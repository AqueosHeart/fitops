import Link from "next/link";
import { LandingHero } from "@/components/landing/hero";
import { PublicLayout } from "@/components/site-shell";
import { FeaturedSessions } from "@/components/schedule-explorer";
import { PublicPrograms } from "@/components/public-programs";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { signedOut } = await searchParams;
  return <PublicLayout landing>
    {signedOut === "1" && <p className="schedule-state state-success landing-signout" role="status">You’ve signed out securely.</p>}
    <LandingHero />
    <div className="ticker"><span>Small group by design</span><span>Coaching that meets you here</span><span>Progress at your pace</span></div>
    <section className="section" id="programs">
      <div className="section-heading"><div><p className="eyebrow">Find your kind of effort</p><h2>Programs for your week.</h2></div><Link className="inline-link" href="/programs">Explore all programs ↗</Link></div>
      <PublicPrograms compact />
    </section>
    <section className="section section-soft">
      <div className="section-heading"><div><p className="eyebrow">A good place to begin</p><h2>Upcoming sessions.</h2></div><p>Live demo availability from the club schedule. Places are only confirmed by the server when you book.</p></div>
      <FeaturedSessions />
      <div style={{ marginTop: 24 }}><Link className="button button-dark" href="/schedule">Browse the full schedule</Link></div>
    </section>
    <section className="section section-dark">
      <div className="feature-grid">
        <article className="feature-card"><span className="feature-index">01 / COACHING</span><h3>Clear, not loud.</h3><p>Expert cues and thoughtful progressions make space for every starting point.</p></article>
        <article className="feature-card"><span className="feature-index">02 / COMMUNITY</span><h3>Better together.</h3><p>Small groups bring energy without turning your workout into a performance.</p></article>
        <article className="feature-card"><span className="feature-index">03 / CONSISTENCY</span><h3>Built around life.</h3><p>Find a class that fits the week you actually have.</p></article>
      </div>
    </section>
    <section className="section section-soft" id="facilities"><div className="section-heading"><div><p className="eyebrow">Practice, not perfection</p><h2>A place to make it yours.</h2></div><p>Practice Athletic Club is a fictional neighborhood studio created for a portfolio product demo. All people and membership details are examples.</p></div><div className="demo-notice"><span aria-hidden="true">✳</span> Demo-only experience. No payment, card details, health answers, or real membership are collected.</div></section>
    <section className="section" id="contact"><div className="section-heading"><div><p className="eyebrow">Your next session starts here</p><h2>Make room for movement.</h2></div><Link className="button button-dark" href="/join">Join the demo club</Link></div></section>
  </PublicLayout>;
}
