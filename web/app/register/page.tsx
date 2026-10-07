import Link from "next/link";
import { DemoNotice, PublicLayout } from "@/components/site-shell";
import { RegisterForm } from "@/components/auth-forms";

const planNames: Record<string, string> = { base: "Base", complete: "Complete", training_plus: "Training Plus" };
export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const query = await searchParams;
  const plan = typeof query.plan === "string" ? query.plan : "";
  const returnTo = typeof query.returnTo === "string" ? query.returnTo : "/app";
  return <PublicLayout><div className="auth-wrap"><aside className="auth-aside"><div><p className="eyebrow">Step 02 / Member access</p><h1>Your practice,<br />your pace.</h1><p>Set up a fictional demo member profile to explore sessions, reservations, and waitlists.</p></div><DemoNotice /></aside><section className="auth-panel"><p className="eyebrow">Create a demo profile</p><h2>Account details</h2><p>Selected plan: <strong>{planNames[plan] ?? "Choose a plan"}</strong> · no purchase, card, or real subscription.</p><RegisterForm selectedPlanCode={plan} returnTo={returnTo} /><p style={{ marginTop: 20 }}>Already have an account? <Link className="inline-link" href={`/portal/login?returnTo=${encodeURIComponent(returnTo)}`}>Sign in</Link>.</p></section></div></PublicLayout>;
}
