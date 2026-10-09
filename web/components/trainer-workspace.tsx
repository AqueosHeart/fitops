"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { api, friendlyError } from "@/lib/client/api";

type Session = { sessionId: string; program: string; startsAt: string; endsAt: string; status: string; capacity: number; confirmedCount: number };

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function SessionCard({ session }: { session: Session }) {
  return <article className="trainer-session-card">
    <div><p className="eyebrow">Assigned class</p><h2>{session.program}</h2><p className="trainer-session-time">{dateLabel(session.startsAt)}</p></div>
    <div className="trainer-session-meta"><span className="admin-status">{session.status}</span><span>{session.confirmedCount} / {session.capacity} confirmed</span></div>
    <Link className="button button-outline button-small" href={`/trainer/sessions/${session.sessionId}`}>View session <span aria-hidden="true">→</span></Link>
  </article>;
}

export function TrainerSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const result = await api<{ sessions: Session[] }>("/api/v1/trainer/sessions");
      setSessions(result.sessions.filter((session) => new Date(session.startsAt).getTime() >= Date.now() && session.status === "scheduled"));
    } catch (reason) { setError(friendlyError(reason)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  const programs = useMemo(() => [...new Set(sessions.map((session) => session.program))].sort(), [sessions]);
  const filtered = useMemo(() => sessions.filter((session) => session.program.toLowerCase().includes(filter.toLowerCase())), [sessions, filter]);

  return <section className="trainer-content">
    <div className="trainer-heading"><div><p className="eyebrow">Trainer workspace</p><h1>Assigned sessions</h1><p>Your upcoming classes and confirmed reservation counts.</p></div></div>
    <div className="trainer-panel">
      <div className="trainer-panel-heading"><div><h2>Upcoming assignments</h2><p>Only classes assigned to your trainer account are shown.</p></div>{sessions.length > 0 && <label className="admin-filter">Filter by program<input value={filter} onChange={(event) => setFilter(event.target.value)} list="trainer-programs" placeholder="All programs" /><datalist id="trainer-programs">{programs.map((program) => <option key={program} value={program} />)}</datalist></label>}</div>
      {loading ? <div className="trainer-session-list" role="status" aria-live="polite" aria-busy="true" aria-label="Loading assigned sessions"><div className="trainer-skeleton" /><div className="trainer-skeleton" /></div>
        : error ? <div className="trainer-state trainer-state-error" role="alert">{error}<button className="button button-quiet" onClick={() => void load()}>Retry</button></div>
          : sessions.length === 0 ? <div className="trainer-state"><h2>No upcoming sessions</h2><p>New classes assigned to you will appear here.</p></div>
            : filtered.length === 0 ? <div className="trainer-state"><h2>No matching sessions</h2><p>Try another program name or clear the filter.</p><button className="button button-quiet" onClick={() => setFilter("")}>Clear filter</button></div>
              : <div className="trainer-session-list">{filtered.map((session) => <SessionCard key={session.sessionId} session={session} />)}</div>}
    </div>
    <p className="trainer-note">Read-only workspace · attendee names and contact details are not available here.</p>
  </section>;
}

export function TrainerSessionDetail({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError(""); setNotFound(false);
    try {
      const result = await api<{ session: Session }>(`/api/v1/trainer/sessions/${encodeURIComponent(sessionId)}`);
      setSession(result.session);
    } catch (reason) {
      if (reason && typeof reason === "object" && "status" in reason && reason.status === 404) setNotFound(true);
      else setError(friendlyError(reason));
    } finally { setLoading(false); }
  }, [sessionId]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  return <section className="trainer-content">
    <div className="trainer-heading"><div><p className="eyebrow">Class preparation</p><h1>Session details</h1><p>Review the assignment and aggregate attendance before class.</p></div><Link className="button button-quiet" href="/trainer/sessions">Back to sessions</Link></div>
    {loading ? <div className="trainer-panel trainer-skeleton" role="status" aria-live="polite" aria-busy="true" aria-label="Loading session details" />
      : notFound ? <div className="trainer-panel trainer-state"><h2>Session unavailable</h2><p>This session may not be assigned to your account.</p><Link className="button button-outline" href="/trainer/sessions">Return to assigned sessions</Link></div>
        : error ? <div className="trainer-panel trainer-state trainer-state-error" role="alert">{error}<button className="button button-quiet" onClick={() => void load()}>Retry</button></div>
          : session && <><div className="trainer-session-detail"><div className="trainer-panel"><p className="eyebrow">{session.status}</p><h2>{session.program}</h2><p>{dateLabel(session.startsAt)}</p><p>Ends {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(session.endsAt))}</p></div><section className="trainer-panel trainer-attendance" aria-labelledby="attendance-heading"><p className="eyebrow">Attendance overview</p><h2 id="attendance-heading">Confirmed reservations</h2><strong>{session.confirmedCount}<span> / {session.capacity}</span></strong><p>Aggregate count only. Member names and contact details are not shown.</p></section></div></>}
  </section>;
}
