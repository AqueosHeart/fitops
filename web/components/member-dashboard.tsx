"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, friendlyError } from "@/lib/client/api";
import type { SessionSummary } from "@/components/schedule-explorer";
import { SessionCard } from "@/components/schedule-explorer";

type Booking = { bookingId: string; sessionId: string; program: string; startsAt: string };
type Waitlist = { entryId: string; sessionId: string; program: string; position: string; startsAt: string };
type MemberData = { status: "active" | "inactive"; selectedPlanCode: string | null; waiverSignedAt: string | null };
function fmt(value: string) { return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }

export function MemberDashboard() {
  const [membership, setMembership] = useState<MemberData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [waitlist, setWaitlist] = useState<Waitlist[]>([]);
  const [session, setSession] = useState<SessionSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    void Promise.all([api<MemberData>("/api/v1/me/membership"), api<{ bookings: Booking[]; waitlist: Waitlist[] }>("/api/v1/me/bookings"), api<{ sessions: SessionSummary[]; nextCursor: string | null }>(`/api/v1/sessions?from=${encodeURIComponent(new Date().toISOString())}`)])
      .then(([member, reservation, schedule]) => { if (!live) return; setMembership(member); setBookings(reservation.bookings); setWaitlist(reservation.waitlist); const next = schedule.sessions.find((item) => !reservation.bookings.some((booking) => booking.sessionId === item.sessionId)); setSession(next ?? null); })
      .catch((cause) => { if (live) setError(friendlyError(cause)); }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, []);
  if (loading) return <><div className="member-welcome"><div><p className="eyebrow">Your member workspace</p><h1>Your practice.</h1></div></div><div className="member-grid"><div className="skeleton" /><div className="skeleton" /></div></>;
  return <>
    <div className="member-welcome"><div><p className="eyebrow">Member workspace / Home</p><h1>Your practice.</h1><p>A clear look at what’s next. Class availability always comes from the club schedule.</p></div><Link className="button button-dark" href="/app/schedule">Find a session ↗</Link></div>
    {error && <div className="schedule-state state-error" role="alert">{error}<button className="button button-outline" onClick={() => window.location.reload()}>Try again</button></div>}
    {membership && <div className="membership-band"><div><p>Fictional demo membership</p><strong>{membership.selectedPlanCode?.replaceAll("_", " ") ?? "No plan selected"}</strong></div><p>{membership.status === "active" ? "Active for this demo" : "Inactive · booking is unavailable"}</p></div>}
    <div className="member-grid">
      <section className="panel-card"><h2>Your next class</h2>{bookings[0] ? <div className="booking-row"><div><h3>{bookings[0].program}</h3><p>{fmt(bookings[0].startsAt)}</p></div><Link className="button button-outline button-small" href="/app/bookings">My bookings</Link></div> : session ? <SessionCard session={session} action={<Link className="button button-dark button-small" href={`/app/schedule?sessionId=${encodeURIComponent(session.sessionId)}`}>View & book</Link>} /> : <div className="schedule-state">No upcoming reservation yet. Pick a class that works for you.</div>}<div style={{ marginTop: 16 }}><Link className="inline-link" href="/app/schedule">Browse upcoming sessions ↗</Link></div></section>
      <section className="panel-card"><h2>Your waitlist</h2>{waitlist.length ? waitlist.slice(0, 3).map((entry) => <div className="booking-row" key={entry.entryId}><div><h3>{entry.program}</h3><p>{fmt(entry.startsAt)} · position {entry.position}</p></div></div>) : <div className="schedule-state">No active waitlist entries. If a class is full, you can join its queue.</div>}<div style={{ marginTop: 16 }}><Link className="inline-link" href="/app/bookings">Review reservations ↗</Link></div></section>
    </div>
  </>;
}
