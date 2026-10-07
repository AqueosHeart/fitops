"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DemoNotice, PageIntro, PublicLayout } from "@/components/site-shell";
import { api, friendlyError } from "@/lib/client/api";

type Plan = { code: string; name: string; demoOnly: boolean; paymentCollected: boolean };
export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { void api<{ plans: Plan[] }>("/api/v1/membership/plans").then((data) => setPlans(data.plans)).catch((cause) => setError(friendlyError(cause))); }, []);
  return <PublicLayout><PageIntro eyebrow="A plan for your practice" title="Membership, without the fine print." description="Choose a fictional demo plan to try registration and member access. These are labels for the product demo, not offers for sale." /><section className="join-panel"><DemoNotice />{error && <div className="schedule-state state-error" role="alert">{error}</div>}<div className="plan-grid" style={{ marginTop: 24 }}>{plans.map((plan) => <article className="plan-card" key={plan.code}><span className="plan-code">Demo membership</span><h2>{plan.name}</h2><p>Explore the member tools using a fictional, no-payment enrollment. Plan entitlements are not represented in this demo.</p><Link className="button button-dark" href={`/join?plan=${encodeURIComponent(plan.code)}`}>Choose {plan.name}</Link></article>)}</div></section></PublicLayout>;
}
