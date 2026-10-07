import Link from "next/link";

export function SiteHeader({ member = false }: { member?: boolean }) {
  return (
    <header className={`site-header${member ? " site-header-member" : ""}`}>
      <Link className="wordmark" href={member ? "/app" : "/"} aria-label="Practice Athletic Club home">
        <span className="wordmark-mark" aria-hidden="true">P</span>
        <span>practice<span className="wordmark-light"> athletic club</span></span>
      </Link>
      <nav className="site-nav" aria-label={member ? "Member navigation" : "Main navigation"}>
        {member ? (
          <>
            <Link href="/app/schedule">Schedule</Link>
            <Link href="/app/bookings">My bookings</Link>
            <Link href="/app/profile/security">Profile</Link>
          </>
        ) : (
          <>
            <Link href="/#programs">Programs</Link>
            <Link href="/schedule">Schedule</Link>
            <Link href="/pricing">Plans</Link>
          </>
        )}
      </nav>
      <div className="header-actions">
        {member ? <Link className="button button-quiet button-small" href="/app/profile/security">My account</Link> : (
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
