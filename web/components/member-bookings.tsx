"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiError, api, friendlyError } from "@/lib/client/api";
import { AccessibleDialog } from "@/components/accessible-dialog";

type Booking = { bookingId: string; sessionId: string; program: string; startsAt: string; endsAt: string; cancellationCutoffAt: string };
type Waitlist = { entryId: string; sessionId: string; program: string; position: string; startsAt: string };
type Reservations = { bookings: Booking[]; waitlist: Waitlist[] };
function fmt(value: string) { return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }

export function MemberBookings() {
  const [data, setData] = useState<Reservations>({ bookings: [], waitlist: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [confirmBooking, setConfirmBooking] = useState<Booking | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setData(await api<Reservations>("/api/v1/me/bookings")); }
    catch (cause) { setError(friendlyError(cause)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    let active = true;
    void api<Reservations>("/api/v1/me/bookings").then((result) => { if (active) { setData(result); setError(""); setNow(Date.now()); } }).catch((cause) => { if (active) setError(friendlyError(cause)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const remove = async (id: string, kind: "booking" | "waitlist") => {
    setBusy(id); setError(""); setNotice("");
    try {
      await api(kind === "booking" ? `/api/v1/bookings/${id}` : `/api/v1/waitlist/${id}`, { method: "DELETE" });
      if (kind === "booking") setConfirmBooking(null);
      setNotice(kind === "booking" ? "Your reservation was cancelled. Any eligible waitlist promotion was handled in the same server transaction." : "You left the waitlist.");
      await load();
    } catch (cause) {
      if (cause instanceof ApiError && cause.code === "WAITLIST_ALREADY_PROMOTED") {
        setNotice("Your waitlist entry was promoted before the request arrived. Refreshing My bookings now.");
        await load();
      } else setError(friendlyError(cause));
    } finally { setBusy(""); }
  };
  return <>
    <div className="member-welcome"><div><p className="eyebrow">Member workspace / Reservations</p><h1>My bookings.</h1><p>Confirmed reservations and active waitlist places in one view.</p></div><Link className="button button-dark" href="/app/schedule">Find another session ↗</Link></div>
    <div aria-live="polite" aria-atomic="true">{notice && <div className="schedule-state state-success" role="status">{notice}</div>}{error && <div className="schedule-state state-error" role="alert">{error}<button className="button button-outline" onClick={() => void load()}>Try again</button></div>}</div>
    {loading ? <div className="member-grid" aria-label="Loading reservations" aria-busy="true"><div className="skeleton" /><div className="skeleton" /></div> : <div className="member-grid">
      <section className="panel-card"><h2>Confirmed reservations</h2>{data.bookings.length ? data.bookings.map((booking) => { const pastCutoff = now !== null && now > new Date(booking.cancellationCutoffAt).getTime(); const cutoffUnknown = now === null; return <article className="booking-row" key={booking.bookingId}><div><h3>{booking.program}</h3><p>{fmt(booking.startsAt)} · Confirmed</p><p>{cutoffUnknown ? "Checking cancellation cutoff…" : pastCutoff ? "Cancellation cutoff passed · reservation remains confirmed." : `Cancel by ${fmt(booking.cancellationCutoffAt)}. The server rechecks the cutoff when submitted.`}</p></div><div className="booking-actions"><Link className="button button-outline button-small" href={`/sessions/${booking.sessionId}`}>Session details</Link><button className="button button-danger button-small" type="button" disabled={busy === booking.bookingId || pastCutoff || cutoffUnknown} onClick={() => setConfirmBooking(booking)}>{cutoffUnknown ? "Checking cutoff…" : pastCutoff ? "Cutoff passed" : "Cancel booking"}</button></div></article>; }) : <div className="schedule-state">No upcoming confirmed reservations. Browse the schedule to find your next session.</div>}</section>
      <section className="panel-card"><h2>Waitlist entries</h2>{data.waitlist.length ? data.waitlist.map((entry) => <article className="booking-row" key={entry.entryId}><div><h3>{entry.program}</h3><p>{fmt(entry.startsAt)} · Position {entry.position}</p><p>Position is a live snapshot and may change as the queue moves.</p></div><div className="booking-actions"><button className="button button-outline button-small" type="button" disabled={busy === entry.entryId} onClick={() => void remove(entry.entryId, "waitlist")}>{busy === entry.entryId ? "Working…" : "Leave waitlist"}</button></div></article>) : <div className="schedule-state">No active waitlist entries. When a class is full, you can choose to join its queue.</div>}</section>
    </div>}
    {confirmBooking && <AccessibleDialog labelledBy="cancel-title" onClose={() => setConfirmBooking(null)}><p className="eyebrow">Reservation change</p><h2 id="cancel-title">Cancel this booking?</h2><p>Your {confirmBooking.program} reservation on {fmt(confirmBooking.startsAt)} will be cancelled. If an eligible member is waiting, the server may promote them in the same transaction. The configured cutoff is rechecked when you confirm.</p><div className="dialog-actions"><button className="button button-outline" type="button" onClick={() => setConfirmBooking(null)}>Keep reservation</button><button className="button button-danger" type="button" disabled={busy === confirmBooking.bookingId} onClick={() => void remove(confirmBooking.bookingId, "booking")}>{busy === confirmBooking.bookingId ? "Cancelling…" : "Confirm cancellation"}</button></div></AccessibleDialog>}
  </>;
}
