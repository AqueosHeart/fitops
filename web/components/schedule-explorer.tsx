"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { api, ApiError, friendlyError, jsonBody } from "@/lib/client/api";
import { AccessibleDialog } from "@/components/accessible-dialog";

export type SessionSummary = {
  sessionId: string;
  program: string;
  trainer: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  confirmedCount: number;
  availability: "available" | "full";
  bookingCutoffMinutes: number;
};

type ProgramsResponse = { programs: Array<{ slug: string; name: string }> };
type SessionsResponse = { sessions: SessionSummary[]; nextCursor: string | null };
type MemberReservations = { bookings: Array<{ sessionId: string }>; waitlist: Array<{ sessionId: string }> };

export function FeaturedSessions() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const query = new URLSearchParams({ from: startOfTodayIso(), to: endOfWindowIso() });
    void api<SessionsResponse>(`/api/v1/sessions?${query}`).then((result) => setSessions(result.sessions.slice(0, 3))).catch((cause) => setError(friendlyError(cause))).finally(() => setLoading(false));
  }, []);
  if (error) return <div className="schedule-state state-error" role="alert">{error}</div>;
  if (loading) return <div className="session-grid" role="status" aria-label="Loading upcoming sessions" aria-busy="true">{[1, 2, 3].map((item) => <div className="skeleton" key={item} />)}</div>;
  if (!sessions.length) return <div className="schedule-state"><strong>No upcoming sessions are scheduled in this demo yet.</strong><p>The public catalog will update when the next fictional class is scheduled.</p></div>;
  return <div className="session-grid">{sessions.map((session) => <SessionCard key={session.sessionId} session={session} action={<Link className="button button-outline button-small" href={`/sessions/${session.sessionId}`}>View session</Link>} />)}</div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function startOfTodayIso() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function endOfWindowIso() {
  const date = new Date();
  date.setDate(date.getDate() + 45);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

export function SessionCard({ session, action }: { session: SessionSummary; action: React.ReactNode }) {
  const startsAt = new Date(session.startsAt);
  const cutoffAt = new Date(startsAt.getTime() - session.bookingCutoffMinutes * 60_000);
  return (
    <article className="session-card">
      <div className="session-card-top">
        <div><h3>{session.program}</h3><p className="session-meta">with {session.trainer}</p></div>
        <span className={`availability${session.availability === "full" ? " availability-full" : ""}`}>
          {session.availability === "full" ? "Waitlist open" : `${Math.max(0, session.capacity - session.confirmedCount)} places`}
        </span>
      </div>
      <p className="session-meta">{formatDate(session.startsAt)} · {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(session.endsAt))}</p>
      <p className="session-meta">Book or cancel by {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(cutoffAt)}</p>
      <div className="session-card-bottom"><span className="session-meta">{session.confirmedCount} / {session.capacity} booked</span>{action}</div>
    </article>
  );
}

export function ScheduleExplorer({ member = false, initialSessionId }: { member?: boolean; initialSessionId?: string }) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [programs, setPrograms] = useState<Array<{ slug: string; name: string }>>([]);
  const [program, setProgram] = useState("");
  const [trainer, setTrainer] = useState("");
  const [availability, setAvailability] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState("");
  const [participation, setParticipation] = useState<Record<string, "booked" | "waitlisted">>({});
  const [participationLoading, setParticipationLoading] = useState(member);
  const [waiverOpen, setWaiverOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ sessionId: string; kind: "book" | "waitlist" } | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    const query = new URLSearchParams();
    query.set("from", from ? new Date(`${from}T00:00:00`).toISOString() : startOfTodayIso());
    query.set("to", to ? new Date(`${to}T23:59:59`).toISOString() : endOfWindowIso());
    if (program) query.set("program", program);
    if (trainer) query.set("trainer", trainer);
    if (availability) query.set("availability", availability);
    void api<SessionsResponse>(`/api/v1/sessions?${query.toString()}`).then((results) => {
      if (active) { setSessions(results.sessions); setError(""); }
    }).catch((cause) => { if (active) setError(friendlyError(cause)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [availability, from, program, retryCount, to, trainer]);
  useEffect(() => {
    void api<ProgramsResponse>("/api/v1/programs").then((catalog) => setPrograms(catalog.programs)).catch((cause) => setError(friendlyError(cause)));
  }, []);
  useEffect(() => {
    if (!member) return;
    let active = true;
    void api<MemberReservations>("/api/v1/me/bookings").then((result) => {
      if (active) {
        const current: Record<string, "booked" | "waitlisted"> = {};
        for (const booking of result.bookings) current[booking.sessionId] = "booked";
        for (const entry of result.waitlist) if (!current[entry.sessionId]) current[entry.sessionId] = "waitlisted";
        setParticipation(current);
      }
    }).catch((cause) => { if (active) setError(friendlyError(cause)); }).finally(() => { if (active) setParticipationLoading(false); });
    return () => { active = false; };
  }, [member]);

  const sendAction = async (sessionId: string, kind: "book" | "waitlist") => {
    setBusyId(sessionId);
    setStatus("");
    setError("");
    try {
      if (kind === "book") {
        await api(`/api/v1/sessions/${sessionId}/bookings`, { method: "POST", body: jsonBody({}) });
        setParticipation((current) => ({ ...current, [sessionId]: "booked" }));
        setStatus("Your place is confirmed. Check My bookings for details.");
      } else {
        const result = await api<{ position: string }>(`/api/v1/sessions/${sessionId}/waitlist`, { method: "POST", body: jsonBody({}) });
        setParticipation((current) => ({ ...current, [sessionId]: "waitlisted" }));
        setStatus(`You’re on the waitlist at position ${result.position}.`);
      }
      setLoading(true);
      setRetryCount((count) => count + 1);
    } catch (cause) {
      if (cause instanceof ApiError && cause.code === "WAIVER_REQUIRED") {
        setPendingAction({ sessionId, kind });
        setWaiverOpen(true);
      } else if (cause instanceof ApiError && cause.code === "UNAUTHENTICATED") {
        const destination = `/app/schedule${initialSessionId ? `?sessionId=${encodeURIComponent(initialSessionId)}` : ""}`;
        window.location.assign(`/portal/login?returnTo=${encodeURIComponent(destination)}`);
      } else {
        setError(friendlyError(cause));
      }
    } finally {
      setBusyId("");
    }
  };

  const acceptWaiver = async () => {
    if (!pendingAction) return;
    setBusyId(pendingAction.sessionId);
    setError("");
    try {
      await api("/api/v1/me/waiver", { method: "POST", body: jsonBody({ accepted: true }) });
      setWaiverOpen(false);
      const action = pendingAction;
      setPendingAction(null);
      await sendAction(action.sessionId, action.kind);
    } catch (cause) {
      setError(friendlyError(cause));
    } finally {
      setBusyId("");
    }
  };

  const trainers = Array.from(new Set(sessions.map((session) => session.trainer))).sort();
  const visibleSessions = initialSessionId ? sessions.filter((session) => session.sessionId === initialSessionId) : sessions;
  return (
    <div className="schedule-wrap">
      {!initialSessionId && <form className="filters" onSubmit={(event) => { event.preventDefault(); setLoading(true); setRetryCount((count) => count + 1); }}>
        <div className="field"><label htmlFor="date-from">From</label><input id="date-from" type="date" value={from} onChange={(event) => { setFrom(event.target.value); setLoading(true); setError(""); }} /></div>
        <div className="field"><label htmlFor="date-to">Through</label><input id="date-to" type="date" value={to} onChange={(event) => { setTo(event.target.value); setLoading(true); setError(""); }} /></div>
        <div className="field"><label htmlFor="program-filter">Program</label><select id="program-filter" value={program} onChange={(event) => { setProgram(event.target.value); setLoading(true); setError(""); }}><option value="">All programs</option>{programs.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></div>
        <div className="field"><label htmlFor="trainer-filter">Trainer</label><select id="trainer-filter" value={trainer} onChange={(event) => { setTrainer(event.target.value); setLoading(true); setError(""); }}><option value="">All trainers</option>{trainers.map((name) => <option key={name}>{name}</option>)}</select></div>
        <div className="field"><label htmlFor="availability-filter">Availability</label><select id="availability-filter" value={availability} onChange={(event) => { setAvailability(event.target.value); setLoading(true); setError(""); }}><option value="">Any availability</option><option value="available">Places available</option><option value="full">Waitlist open</option></select></div>
        <button className="button button-outline" type="submit">Update schedule</button>
      </form>}
      {initialSessionId && <p className="field-hint" style={{ marginBottom: 15 }}>Your selected session is preserved from the public schedule.</p>}
      <div aria-live="polite" aria-atomic="true">
        {status && <p className="schedule-state state-success" role="status">{status} <Link className="inline-link" href="/app/bookings">View My bookings</Link></p>}
        {error && <div className="schedule-state state-error" role="alert">{error}<div style={{ marginTop: 12 }}><button className="button button-outline" type="button" onClick={() => { setLoading(true); setRetryCount((count) => count + 1); }}>Try again</button></div></div>}
      </div>
      {loading ? <div className="session-grid" role="status" aria-label="Loading schedule" aria-busy="true">{[1, 2, 3].map((item) => <div className="skeleton" key={item} />)}</div> : visibleSessions.length ? (
        <div className="session-grid">{visibleSessions.map((session) => <SessionCard key={session.sessionId} session={session} action={member ? (
          <div className="booking-actions">{participationLoading ? <button className="button button-outline button-small" type="button" disabled>Checking reservation…</button> : participation[session.sessionId] ? <><button className="button button-dark button-small" type="button" disabled>{participation[session.sessionId] === "booked" ? "Booked" : "On waitlist"}</button><Link className="button button-outline button-small" href="/app/bookings">My bookings</Link></> : <><button className="button button-dark button-small" type="button" disabled={busyId === session.sessionId || session.availability === "full"} onClick={() => void sendAction(session.sessionId, "book")}>{busyId === session.sessionId ? "Working…" : session.availability === "full" ? "Session full" : "Book session"}</button>{session.availability === "full" && <button className="button button-outline button-small" type="button" disabled={busyId === session.sessionId} onClick={() => void sendAction(session.sessionId, "waitlist")}>Join waitlist</button>}</>}</div>
        ) : <Link className="button button-outline button-small" href={`/sessions/${session.sessionId}`}>View session</Link>} />)}</div>
      ) : <div className="schedule-state"><strong>{initialSessionId ? "This session is no longer listed." : "No sessions match those filters."}</strong><p>{initialSessionId ? "Browse the schedule for another upcoming class." : "Try another date or clear a filter to see more sessions."}</p>{initialSessionId && <Link className="button button-outline" href={member ? "/app/schedule" : "/schedule"}>Browse schedule</Link>}</div>}

      {waiverOpen && <AccessibleDialog labelledBy="waiver-title" onClose={() => setWaiverOpen(false)}><p className="eyebrow">Before your first booking</p><h2 id="waiver-title">A quick readiness acknowledgement</h2><p>Please read the <Link className="inline-link" href="/waiver" target="_blank">liability waiver</Link>. This demo records only that you accepted it and when. It does not ask for or store health answers.</p><p>Your booking request will be checked again by the server after acceptance; signing does not reserve a place.</p><div className="dialog-actions"><button className="button button-outline" type="button" onClick={() => setWaiverOpen(false)}>Not now</button><button className="button button-dark" type="button" onClick={() => void acceptWaiver()}>I have read and accept</button></div></AccessibleDialog>}
    </div>
  );
}
