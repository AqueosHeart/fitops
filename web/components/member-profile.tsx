"use client";

import { useEffect, useState } from "react";
import { api, friendlyError } from "@/lib/client/api";
import { MemberSignOut } from "@/components/member-sign-out";

type Membership = { status: "active" | "inactive"; selectedPlanCode: string | null; waiverSignedAt: string | null; permittedRoutes: string[] };
export function MemberProfile() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { void api<Membership>("/api/v1/me/membership").then(setMembership).catch((cause) => setError(friendlyError(cause))); }, []);
  return <>
    <div className="member-welcome"><div><p className="eyebrow">Member workspace / Profile & security</p><h1>Your demo profile.</h1><p>Only account and consent details needed for the fictional booking demo are stored.</p></div></div>
    {error && <div className="schedule-state state-error" role="alert">{error}</div>}
    {!membership ? <div className="skeleton" aria-label="Loading profile" aria-busy="true" /> : <><section className="panel-card" style={{ maxWidth: 760 }}><h2>Membership & consent</h2><dl className="detail-meta"><div><dt>Status</dt><dd>{membership.status === "active" ? "Active demo membership" : "Inactive"}</dd></div><div><dt>Selected plan</dt><dd>{membership.selectedPlanCode?.replaceAll("_", " ") ?? "Not selected"}</dd></div><div><dt>Liability waiver</dt><dd>{membership.waiverSignedAt ? `Signed ${new Date(membership.waiverSignedAt).toLocaleDateString("en-US")}` : "Not yet signed"}</dd></div></dl><p className="session-meta">No payment, card, billing, or health-answer data is used. The demo cannot change its member identity from this page.</p></section><MemberSignOut /></>}
  </>;
}
