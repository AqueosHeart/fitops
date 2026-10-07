"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, ApiError, friendlyError } from "@/lib/client/api";
import type { SessionSummary } from "@/components/schedule-explorer";

export function SessionDetail({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<SessionSummary | null>(null);
  const [error, setError] = useState("");
  const [member, setMember] = useState(false);
  const [membershipChecked, setMembershipChecked] = useState(false);
  useEffect(() => {
    void api<SessionSummary>(`/api/v1/sessions/${sessionId}`).then(setSession).catch((cause) => setError(friendlyError(cause)));
    void api("/api/v1/me/membership").then(() => setMember(true)).catch((cause) => { if (cause instanceof ApiError && cause.status === 401) setMember(false); }).finally(() => setMembershipChecked(true));
  }, [sessionId]);
  if (error) return <div className="session-detail-panel"><div className="schedule-state state-error" role="alert">{error}<p><Link className="inline-link" href="/schedule">Return to the schedule</Link></p></div></div>;
  if (!session || !membershipChecked) return <div className="session-detail-panel"><div className="skeleton" aria-label="Loading session details" aria-busy="true" /></div>;
  const start = new Date(session.startsAt);
  const end = new Date(session.endsAt);
  const cutoff = new Date(start.getTime() - session.bookingCutoffMinutes * 60_000);
  const target = `/app/schedule?sessionId=${encodeURIComponent(session.sessionId)}`;
  return <section className="session-detail-panel"><p className="eyebrow">Upcoming class / Session details</p><article className="session-detail-card"><span className={`availability${session.availability === "full" ? " availability-full" : ""}`}>{session.availability === "full" ? "Full · waitlist open" : `${Math.max(0, session.capacity - session.confirmedCount)} places available`}</span><h2>{session.program}</h2><p className="intro-copy" style={{ marginLeft: 0 }}>A coached small-group session at Practice Athletic Club.</p><dl className="detail-meta"><div><dt>When</dt><dd>{new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }).format(start)} – {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(end)}</dd></div><div><dt>Trainer</dt><dd>{session.trainer}</dd></div><div><dt>Availability</dt><dd>{session.confirmedCount} of {session.capacity} confirmed</dd></div><div><dt>Booking cutoff</dt><dd>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(cutoff)}</dd></div></dl><p className="session-meta">Availability can change. Your booking or waitlist request is confirmed only after the server rechecks current membership, session rules, and capacity.</p><div className="hero-actions" style={{ marginTop: 22 }}>{member ? <Link className="button button-dark" href={target}>Continue in member workspace ↗</Link> : <Link className="button button-dark" href={`/join?returnTo=${encodeURIComponent(target)}`}>Continue to Join ↗</Link>}<Link className="button button-outline" href="/schedule">Back to schedule</Link></div></article></section>;
}
