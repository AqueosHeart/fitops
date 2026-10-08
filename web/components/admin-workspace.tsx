"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Session = { sessionId: string; programId: string; trainerId: string; program: string; trainer: string; startsAt: string; endsAt: string; status: string; capacity: number; bookingCutoffMinutes: number; confirmedCount: number; waitingCount: number; hasParticipationHistory: boolean };
type Program = { id: string; name: string };
type Trainer = { id: string; name: string };
type ApiError = { error?: { message?: string; requestId?: string } };

async function readError(response: Response, fallback: string) {
  const body = await response.json().catch(() => ({})) as ApiError;
  return `${body.error?.message ?? fallback}${body.error?.requestId ? ` (Request ${body.error.requestId})` : ""}`;
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function AdminSessions({ overview = false }: { overview?: boolean }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/v1/admin/sessions", { cache: "no-store" });
      if (!response.ok) throw new Error(await readError(response, "Could not load sessions."));
      const body = await response.json() as { data: { sessions: Session[] } };
      setSessions(body.data.sessions);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load sessions."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  const filtered = useMemo(() => sessions.filter((session) => `${session.program} ${session.trainer} ${session.status}`.toLowerCase().includes(filter.toLowerCase())), [sessions, filter]);
  const scheduled = useMemo(() => sessions.filter((item) => item.status === "scheduled"), [sessions]);
  const totals = useMemo(() => scheduled.reduce((sum, item) => ({ confirmed: sum.confirmed + item.confirmedCount, waiting: sum.waiting + item.waitingCount, capacity: sum.capacity + item.capacity }), { confirmed: 0, waiting: 0, capacity: 0 }), [scheduled]);

  return <section className="admin-content">
    <div className="admin-heading"><div><p className="eyebrow">Practice Athletic Club · Staff</p><h1>{overview ? "Today at the club" : "Session manager"}</h1><p>{overview ? "A clear view of scheduled capacity and member demand." : "Review occupancy, waitlists, and upcoming sessions."}</p></div><Link className="button button-dark" href="/admin/sessions/new">Create session <span aria-hidden="true">↗</span></Link></div>
    <div className="admin-metrics" aria-label="Operational counts">
      <article><span>Scheduled sessions</span><strong>{loading ? "—" : scheduled.length}</strong></article>
      <article><span>Confirmed members</span><strong>{loading ? "—" : totals.confirmed}</strong></article>
      <article><span>Waiting in queue</span><strong>{loading ? "—" : totals.waiting}</strong></article>
      <article><span>Available capacity</span><strong>{loading ? "—" : Math.max(totals.capacity - totals.confirmed, 0)}</strong></article>
    </div>
    <div className="admin-panel">
      <div className="admin-panel-heading"><div><h2>{overview ? "Session occupancy" : "Scheduled sessions"}</h2><p>Counts reflect the latest server response.</p></div>{!overview && <label className="admin-filter">Filter sessions<input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Program, trainer, status" /></label>}</div>
      {loading ? <div className="admin-state" aria-live="polite">Loading sessions…</div> : error ? <div className="admin-state admin-state-error" role="alert">{error}<button className="button button-quiet" onClick={() => void load()}>Retry</button></div> : filtered.length === 0 ? <div className="admin-state">{sessions.length ? "No sessions match this filter." : "No scheduled sessions yet."} {!sessions.length && <Link href="/admin/sessions/new">Create the first session</Link>}</div> : <div className="admin-table-wrap"><table className="admin-table"><caption className="sr-only">Session occupancy, waitlist counts, status, and administrator actions</caption><thead><tr><th scope="col">Session</th><th scope="col">Starts</th><th scope="col">Occupancy</th><th scope="col">Waitlist</th><th scope="col">Status</th><th scope="col" aria-label="Actions" /></tr></thead><tbody>{filtered.slice(0, overview ? 5 : undefined).map((session) => <tr key={session.sessionId}><td><strong>{session.program}</strong><span>{session.trainer}</span></td><td>{dateLabel(session.startsAt)}</td><td>{session.confirmedCount} / {session.capacity}</td><td>{session.waitingCount}</td><td><span className="admin-status">{session.status}</span></td><td><div className="admin-row-actions"><Link href={`/admin/sessions/${session.sessionId}/participants`}>Participants</Link><Link href={`/admin/sessions/${session.sessionId}/edit`}>Edit</Link></div></td></tr>)}</tbody></table></div>}
      {overview && sessions.length > 5 && <p className="admin-all-link"><Link href="/admin/sessions">View all sessions →</Link></p>}
    </div>
    <p className="admin-demo-note">Fictional demo workspace. Session changes are validated and enforced by the server.</p>
  </section>;
}

function localDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value); const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function AdminSessionForm({ sessionId }: { sessionId?: string }) {
  const [programs, setPrograms] = useState<Program[]>([]); const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [session, setSession] = useState<Session>(); const [form, setForm] = useState({ programId: "", trainerId: "", startsAt: "", endsAt: "", capacity: "12", bookingCutoffMinutes: "120" });
  const [busy, setBusy] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  useEffect(() => { void (async () => { try {
    const [optionsResponse, sessionsResponse] = await Promise.all([fetch("/api/v1/admin/options", { cache: "no-store" }), fetch("/api/v1/admin/sessions", { cache: "no-store" })]);
    if (!optionsResponse.ok) throw new Error(await readError(optionsResponse, "Could not load programs and trainers."));
    if (!sessionsResponse.ok) throw new Error(await readError(sessionsResponse, "Could not load session details."));
    const options = (await optionsResponse.json() as { data: { programs: Program[]; trainers: Trainer[] } }).data;
    setPrograms(options.programs); setTrainers(options.trainers);
    if (sessionId) {
      const items = (await sessionsResponse.json() as { data: { sessions: Session[] } }).data.sessions;
      const selected = items.find((item) => item.sessionId === sessionId);
      if (!selected) throw new Error("The session was not found in the scheduled session list.");
      setSession(selected); setForm({ programId: selected.programId, trainerId: selected.trainerId, startsAt: localDateTime(selected.startsAt), endsAt: localDateTime(selected.endsAt), capacity: String(selected.capacity), bookingCutoffMinutes: String(selected.bookingCutoffMinutes) });
    }
  } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load this form."); } finally { setBusy(false); } })(); }, [sessionId]);
  const lockedSchedule = Boolean(session?.hasParticipationHistory);
  const change = (name: keyof typeof form, value: string) => setForm((previous) => ({ ...previous, [name]: value }));
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    if (!form.startsAt || !form.endsAt || new Date(form.endsAt) <= new Date(form.startsAt)) { setError("End time must be later than start time."); setSaving(false); return; }
    const body = { programId: form.programId, trainerId: form.trainerId, startsAt: new Date(form.startsAt).toISOString(), endsAt: new Date(form.endsAt).toISOString(), capacity: Number(form.capacity), bookingCutoffMinutes: Number(form.bookingCutoffMinutes) };
    try {
      const response = await fetch(sessionId ? `/api/v1/admin/sessions/${sessionId}` : "/api/v1/admin/sessions", { method: sessionId ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(sessionId ? lockedSchedule ? { capacity: body.capacity } : body : body) });
      if (!response.ok) throw new Error(await readError(response, "Could not save this session."));
      if (!sessionId) { const result = (await response.json() as { data: { sessionId: string } }).data; window.location.assign(`/admin/sessions/${result.sessionId}/participants`); return; }
      window.location.assign("/admin/sessions");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save this session."); }
    finally { setSaving(false); }
  }
  return <section className="admin-content admin-form-content"><div className="admin-heading"><div><p className="eyebrow">Session management</p><h1>{sessionId ? "Edit session" : "Create a session"}</h1><p>Business rules, capacity, and waitlist changes are enforced by the server.</p></div><Link className="button button-quiet" href="/admin/sessions">Back to sessions</Link></div>
    {busy ? <div className="admin-state">Loading session details…</div> : error && (!sessionId || !session) ? <div className="admin-state admin-state-error" role="alert">{error}</div> : <form className="admin-form" onSubmit={submit}>
      {session && <div className="admin-form-summary"><strong>Current occupancy</strong><span>{session.confirmedCount} confirmed · {session.waitingCount} waiting · capacity {session.capacity}</span></div>}
      {error && <p className="admin-inline-error" role="alert">{error}</p>}
      <div className="admin-form-grid">
        <label className="admin-field">Program<select required value={form.programId} onChange={(event) => change("programId", event.target.value)} disabled={saving || lockedSchedule}><option value="">Choose a program</option>{programs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="admin-field">Trainer<select required value={form.trainerId} onChange={(event) => change("trainerId", event.target.value)} disabled={saving || lockedSchedule}><option value="">Choose a trainer</option>{trainers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="admin-field">Starts at<input required type="datetime-local" value={form.startsAt} onChange={(event) => change("startsAt", event.target.value)} disabled={saving || lockedSchedule} /></label>
        <label className="admin-field">Ends at<input required type="datetime-local" value={form.endsAt} onChange={(event) => change("endsAt", event.target.value)} disabled={saving || lockedSchedule} /></label>
        <label className="admin-field">Capacity<input required type="number" min={session?.confirmedCount ?? 1} step="1" value={form.capacity} onChange={(event) => change("capacity", event.target.value)} disabled={saving} /></label>
        <label className="admin-field">Booking cutoff (minutes)<input required type="number" min="0" step="1" value={form.bookingCutoffMinutes} onChange={(event) => change("bookingCutoffMinutes", event.target.value)} disabled={saving || lockedSchedule} /></label>
      </div>
      {lockedSchedule && <p className="admin-policy-note">Because this session has current or past participation, only capacity can change. Increasing capacity before cutoff can promote the ordered waitlist; lowering it below confirmed occupancy is rejected.</p>}
      <div className="admin-form-actions"><Link className="button button-quiet" href="/admin/sessions">Cancel</Link><button className="button button-dark" disabled={saving || busy || !programs.length || !trainers.length}>{saving ? "Saving…" : sessionId ? "Save changes" : "Create session"}</button></div>
    </form>}
  </section>;
}

export function AdminParticipants({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<Session>(); const [participants, setParticipants] = useState<{ bookings: { bookingId: string; memberName: string; bookedAt: string }[]; waitlist: { entryId: string; memberName: string; position: string; joinedAt: string }[] }>();
  const [busy, setBusy] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { setBusy(true); setError(""); try {
    const [sessionsResponse, rosterResponse] = await Promise.all([fetch("/api/v1/admin/sessions", { cache: "no-store" }), fetch(`/api/v1/admin/sessions/${sessionId}/participants`, { cache: "no-store" })]);
    if (!sessionsResponse.ok) throw new Error(await readError(sessionsResponse, "Could not load session.")); if (!rosterResponse.ok) throw new Error(await readError(rosterResponse, "Could not load participants."));
    const items = (await sessionsResponse.json() as { data: { sessions: Session[] } }).data.sessions; const selected = items.find((item) => item.sessionId === sessionId); if (!selected) throw new Error("The session was not found.");
    setSession(selected); setParticipants((await rosterResponse.json() as { data: typeof participants }).data ?? undefined);
  } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load participants."); } finally { setBusy(false); } }, [sessionId]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  return <section className="admin-content"><div className="admin-heading"><div><p className="eyebrow">Session roster</p><h1>Participants and waitlist</h1><p>Fictional member records, shown to authorized administrators only.</p></div><Link className="button button-quiet" href="/admin/sessions">Back to sessions</Link></div>
    {busy ? <div className="admin-state">Loading participants…</div> : error ? <div className="admin-state admin-state-error" role="alert">{error}<button className="button button-quiet" onClick={() => void load()}>Retry</button></div> : session && participants && <>
      <div className="admin-roster-summary"><div><span>{session.program}</span><strong>{dateLabel(session.startsAt)}</strong><small>with {session.trainer}</small></div><div><span>Confirmed</span><strong>{participants.bookings.length} / {session.capacity}</strong></div><div><span>Waitlist</span><strong>{participants.waitlist.length}</strong></div></div>
      <div className="admin-roster-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><h2>Confirmed members</h2><p>Ordered by reservation time</p></div><span className="admin-status">{participants.bookings.length}</span></div>{participants.bookings.length ? participants.bookings.map((person) => <div className="admin-person-row" key={person.bookingId}><strong>{person.memberName}</strong><span>Booked {dateLabel(person.bookedAt)}</span></div>) : <p className="admin-state">No confirmed bookings yet.</p>}</section>
      <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Ordered waitlist</h2><p>FIFO position, maintained by the server</p></div><span className="admin-status">{participants.waitlist.length}</span></div>{participants.waitlist.length ? participants.waitlist.map((person) => <div className="admin-person-row" key={person.entryId}><strong><span className="admin-queue-position">{person.position}</span>{person.memberName}</strong><span>Joined {dateLabel(person.joinedAt)}</span></div>) : <p className="admin-state">No one is waiting.</p>}</section></div>
      <div className="admin-roster-actions"><Link className="button button-outline" href={`/admin/sessions/${sessionId}/edit`}>Edit session</Link><p>Member names and queue positions are never exposed in trainer views.</p></div>
    </>}
  </section>;
}
