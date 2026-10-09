"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, friendlyError } from "@/lib/client/api";
import { DemoNotice } from "@/components/site-shell";

type Plan = { code: string; name: string; demoOnly: boolean; paymentCollected: boolean };
export function JoinPicker({ returnTo = "/app", initialPlan = "" }: { returnTo?: string; initialPlan?: string }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState(initialPlan);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { void api<{ plans: Plan[] }>("/api/v1/membership/plans").then((data) => setPlans(data.plans)).catch((cause) => setError(friendlyError(cause))).finally(() => setLoading(false)); }, []);
  const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/app";
  return <section className="join-panel">
    <DemoNotice />
    <div className="join-existing"><div><p className="eyebrow">Already a member?</p><p>Sign in to your demo account and pick up where you left off.</p></div><Link className="button" href={`/portal/login?returnTo=${encodeURIComponent(safeReturnTo)}`}>Go to My Account ↗</Link></div>
    {error && <div className="schedule-state state-error" role="alert">{error}<button className="button button-outline" type="button" onClick={() => { setLoading(true); void api<{ plans: Plan[] }>("/api/v1/membership/plans").then((data) => setPlans(data.plans)).catch((cause) => setError(friendlyError(cause))).finally(() => setLoading(false)); }}>Try again</button></div>}
    {loading ? <div className="plan-grid" role="status" aria-label="Loading demo plans" aria-busy="true">{[1, 2, 3].map((item) => <div className="skeleton" key={item} />)}</div> : plans.length ? <div className="plan-grid">{plans.map((plan) => <article className={`plan-card${selected === plan.code ? " plan-card-selected" : ""}`} key={plan.code}><span className="plan-code">A fictional plan</span><h2>{plan.name}</h2><p>Use this demo-only choice to create your member account. It does not include a price, charge, or real subscription.</p><button className={selected === plan.code ? "button button-accent" : "button button-outline"} type="button" aria-pressed={selected === plan.code} onClick={() => setSelected(plan.code)}>{selected === plan.code ? "Selected" : `Choose ${plan.name}`}</button></article>)}</div> : <div className="schedule-state">Demo plan choices are temporarily unavailable.</div>}
    {plans.some((plan) => selected === plan.code) && <div className="join-existing"><div><p className="eyebrow">Next step</p><p>Your selection is for this fictional demo only. No payment or card information is requested.</p></div><Link className="button" href={`/register?plan=${encodeURIComponent(selected)}&returnTo=${encodeURIComponent(safeReturnTo)}`}>Create demo account ↗</Link></div>}
  </section>;
}
