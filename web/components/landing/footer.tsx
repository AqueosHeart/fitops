import Image from "next/image";
import Link from "next/link";
import "./footer.css";

const footerLinks = [
  { label: "Facilities", href: "/#facilities", kind: "section" },
  { label: "Activities", href: "/#programs", kind: "section" },
  { label: "Plans", href: "/pricing", kind: "section" },
  { label: "Terms", href: "/terms", kind: "legal" },
  { label: "Privacy", href: "/privacy", kind: "legal" },
  { label: "Liability waiver", href: "/waiver", kind: "legal" },
  { label: "Cookie settings", href: "/cookie-settings", kind: "legal" },
] as const;

export function LandingFooter() {
  return <footer className="landing-footer">
    <div className="landing-footer-inner">
      <div className="landing-footer-top">
        <div className="landing-footer-brand">
          <Link className="landing-wordmark" href="/" aria-label="Practice Athletic Club home">
            <span className="landing-mark"><Image src="/images/landing/practice-mark.svg" width={34} height={34} alt="" /><span aria-hidden="true">P</span></span>
            <span className="landing-wordmark-text">practice<span>ATHLETIC CLUB</span></span>
          </Link>
          <p className="landing-footer-description">A fictional club for a real-world practice in thoughtful movement.</p>
        </div>
        <nav className="landing-footer-nav" aria-label="Footer navigation">
          {footerLinks.map(({ label, href, kind }) => <Link key={label} className={`landing-footer-link landing-footer-link-${kind}`} href={href}>{label}</Link>)}
        </nav>
      </div>
    </div>
  </footer>;
}
