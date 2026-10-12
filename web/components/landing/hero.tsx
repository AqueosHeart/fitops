import Image from "next/image";
import { ActionLink } from "./action-link";

export function LandingHero() {
  return <section className="landing-hero" aria-labelledby="landing-title">
    <div className="landing-hero-image"><Image src="/images/landing/hero.webp" alt="A fictional coach guides a member lifting a barbell in the Practice studio." fill sizes="100vw" preload /></div>
    <div className="landing-hero-wash" aria-hidden="true" />
    <div className="landing-hero-content">
      <h1 id="landing-title">Progress is<br />a practice.</h1>
      <p className="landing-hero-description">Thoughtful coaching, small-group classes, and room to build a rhythm that feels like yours. Start with one session.</p>
      <div className="landing-hero-actions"><ActionLink href="/#programs">Explore activities</ActionLink><ActionLink href="/#facilities" variant="outline">Explore the club</ActionLink></div>
    </div>
    <a className="landing-scroll-cue" href="/#programs">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a>
  </section>;
}
