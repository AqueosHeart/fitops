import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DemoNotice, PublicLayout } from "@/components/site-shell";
import { LoginForm } from "@/components/auth-forms";
import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { getPortalDestination } from "@/lib/server/auth/portal-destination";

export default async function PortalLoginPage({ searchParams }: PageProps<"/portal/login">) {
  const query = await searchParams;
  const returnTo = typeof query.returnTo === "string" ? query.returnTo : "/app";
  const currentUser = await resolveCurrentUser(await headers());
  if (currentUser) redirect(getPortalDestination(currentUser, returnTo));
  return <PublicLayout><div className="auth-wrap"><aside className="auth-aside"><div><p className="eyebrow">Member Portal / My Account</p><h1>Good to<br />have you back.</h1><p>Sign in to see your upcoming classes and keep your week moving.</p></div><Link className="hero-link" href="/schedule">Browse the public schedule ↗</Link></aside><section className="auth-panel"><p className="eyebrow">Existing member access</p><h2>Sign in to the club.</h2><p>This portal is separate from public browsing. Your chosen member destination is kept after sign-in.</p><LoginForm returnTo={returnTo} /><div className="divider-label">New to Practice?</div><p><Link className="inline-link" href={`/join?returnTo=${encodeURIComponent(returnTo)}`}>Choose a fictional plan and create a demo account ↗</Link></p><DemoNotice /></section></div></PublicLayout>;
}
