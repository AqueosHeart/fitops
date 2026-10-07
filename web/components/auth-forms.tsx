"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DemoNotice } from "@/components/site-shell";
import { api, ApiError, friendlyError, jsonBody } from "@/lib/client/api";

export function RegisterForm({ selectedPlanCode, returnTo = "/app" }: { selectedPlanCode: string; returnTo?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await api<{ destination: string }>("/api/v1/auth/register", { method: "POST", body: jsonBody({ name, email, password, termsPrivacyAccepted: consent, waiverAccepted: consent, selectedPlanCode, returnTo }) });
      router.replace(result.destination);
    } catch (cause) {
      if (cause instanceof ApiError && cause.code === "EMAIL_ALREADY_REGISTERED") {
        setError(`${friendlyError(cause)} `);
      } else setError(friendlyError(cause));
    } finally { setBusy(false); }
  };
  const knownPlan = ["base", "complete", "training_plus"].includes(selectedPlanCode);
  return <form className="form-stack" onSubmit={submit}>
    {!knownPlan && <p className="form-error" role="alert">Select a demo plan before creating an account. <Link className="inline-link" href="/join">Choose a plan</Link>.</p>}
    <div className="field"><label htmlFor="register-name">Name</label><input id="register-name" autoComplete="name" required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} /></div>
    <div className="field"><label htmlFor="register-email">Email</label><input id="register-email" type="email" autoComplete="email" required maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} /></div>
    <div className="field"><label htmlFor="register-password">Password</label><input id="register-password" type="password" autoComplete="new-password" required minLength={15} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="password-hint" /><span id="password-hint" className="field-hint">Use 15–128 characters. This demo does not email you.</span></div>
    <label className="checkbox-row"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree to the fictional <Link className="inline-link" href="/terms" target="_blank">Terms</Link> and <Link className="inline-link" href="/privacy" target="_blank">Privacy Notice</Link>, and I have read and accept the <Link className="inline-link" href="/waiver" target="_blank">Liability Waiver</Link>. This demo stores consent timestamps only, not health answers.</span></label>
    {error && <p className="form-error" role="alert">{error}{error.includes("signing") && <Link className="inline-link" href={`/portal/login?returnTo=${encodeURIComponent(returnTo)}`}>Sign in</Link>}</p>}
    <div className="form-actions"><button className="button button-dark" type="submit" disabled={busy || !knownPlan}>{busy ? "Creating your demo account…" : "Create member account"}</button><DemoNotice /></div>
  </form>;
}

export function LoginForm({ returnTo = "/app" }: { returnTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await api<{ destination: string }>("/api/v1/auth/login", { method: "POST", body: jsonBody({ email, password, returnTo }) });
      router.replace(result.destination);
    } catch (cause) { setError(friendlyError(cause)); }
    finally { setBusy(false); }
  };
  return <form className="form-stack" onSubmit={submit}>
    <div className="field"><label htmlFor="login-email">Email</label><input id="login-email" type="email" autoComplete="email" required maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} /></div>
    <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" required minLength={15} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} /></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button className="button button-dark" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in to My Account"}</button><p className="field-hint">A successful sign-in returns you to your selected member page.</p></div>
  </form>;
}
