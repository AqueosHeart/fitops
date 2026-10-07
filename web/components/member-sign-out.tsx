"use client";

import { useState } from "react";

export function MemberSignOut() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const signOut = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/sign-out", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({}), credentials: "same-origin" });
      if (!response.ok) throw new Error("Sign-out failed.");
      window.location.assign("/?signedOut=1");
    } catch {
      setError("We couldn’t sign you out. Try again.");
      setBusy(false);
    }
  };
  return <section className="panel-card signout-card"><div><h2>Sign out</h2><p className="session-meta">Clear this demo session from the current browser.</p></div><button className="button button-outline" type="button" disabled={busy} onClick={() => void signOut()}>{busy ? "Signing out…" : "Sign out"}</button>{error && <p role="alert" className="form-error">{error}</p>}</section>;
}
