import Image from "next/image";
import Link from "next/link";
import { ActionLink } from "./action-link";

const destinations = [
  { label: "Facilities", href: "/#facilities" },
  { label: "Activities", href: "/#programs" },
  { label: "Plans", href: "/pricing" },
  { label: "Team", href: "/about" },
];

function NavigationLinks() {
  return <>{destinations.map(({ label, href }) => <Link key={label} href={href}>{label}</Link>)}</>;
}

export function LandingHeader() {
  return <header className="landing-header">
    <Link className="landing-wordmark" href="/" aria-label="Practice Athletic Club home">
      <span className="landing-mark"><Image src="/images/landing/practice-mark.svg" width={34} height={34} alt="" /><span aria-hidden="true">P</span></span>
      <span className="landing-wordmark-text">practice<span>ATHLETIC CLUB</span></span>
    </Link>
    <nav className="landing-desktop-nav" aria-label="Main navigation"><NavigationLinks /></nav>
    <div className="landing-header-actions"><Link className="landing-account" href="/portal/login">My Account</Link><ActionLink href="/join" size="medium">Join now</ActionLink></div>
    <details className="landing-mobile-menu">
      <summary>Menu <span aria-hidden="true">＋</span></summary>
      <nav aria-label="Mobile navigation"><NavigationLinks /><Link href="/portal/login">My Account</Link></nav>
    </details>
  </header>;
}
