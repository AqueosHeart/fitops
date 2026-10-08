import Link from "next/link";

type HeaderMode = "public" | "member" | "admin" | "trainer";

export function SiteHeader({ mode = "public" }: { mode?: HeaderMode }) {
  const member = mode === "member";
  const admin = mode === "admin";
  const trainer = mode === "trainer";
  return (
    <header className={`site-header${member ? " site-header-member" : ""}${admin ? " site-header-admin" : ""}${trainer ? " site-header-trainer" : ""}`}>
      <Link className="wordmark" href={admin ? "/admin" : member ? "/app" : trainer ? "/trainer/sessions" : "/"} aria-label={admin ? "Practice Athletic Club operations home" : trainer ? "Practice Athletic Club trainer home" : "Practice Athletic Club home"}>
        <span className="wordmark-mark" aria-hidden="true">P</span>
        <span>practice<span className="wordmark-light"> athletic club</span></span>
      </Link>
      <nav className="site-nav" aria-label={admin ? "Administrator navigation" : member ? "Member navigation" : "Main navigation"}>
        {member ? (
          <>
            <Link href="/app/schedule">Schedule</Link>
            <Link href="/app/bookings">My bookings</Link>
            <Link href="/app/profile/security">Profile</Link>
          </>
        ) : admin ? (
          <>
            <Link href="/admin">Overview</Link>
            <Link href="/admin/sessions">Sessions</Link>
          </>
        ) : trainer ? (
          <Link href="/trainer/sessions" aria-current="page">Assigned sessions</Link>
        ) : (
          <>
            <Link href="/#programs">Programs</Link>
            <Link href="/schedule">Schedule</Link>
            <Link href="/pricing">Plans</Link>
          </>
        )}
      </nav>
      <div className="header-actions">
        {member ? <Link className="button button-quiet button-small" href="/app/profile/security">My account</Link> : trainer ? (
          <><Link className="account-link" href="/portal/login?returnTo=%2Ftrainer%2Fsessions">My Account</Link><Link className="button button-dark button-small" href="/">Public site</Link></>
        ) : admin ? (
          <>
            <Link className="account-link" href="/portal/login">My Account</Link>
            <Link className="button button-dark button-small" href="/">Public site</Link>
          </>
        ) : (
          <>
            <Link className="account-link" href="/portal/login">My Account</Link>
            <Link className="button button-dark button-small" href="/join">Join now <span aria-hidden="true">↗</span></Link>
          </>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="wordmark" href="/">
        <span className="wordmark-mark" aria-hidden="true">P</span>
        <span>practice<span className="wordmark-light"> athletic club</span></span>
      </Link>
      <p>A fictional club for a real-world practice in thoughtful movement.</p>
      <div className="footer-links"><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/waiver">Liability waiver</Link><Link href="/cookie-settings">Cookie settings</Link></div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return <><SiteHeader /><main className="public-main">{children}</main><SiteFooter /></>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{description}</p></div>;
}

export function DemoNotice() {
  return <p className="demo-notice"><span aria-hidden="true">✳</span> A fictional portfolio demo. No payment is collected and no real membership is created.</p>;
}
