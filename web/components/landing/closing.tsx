"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ActionLink } from "./action-link";
import "./closing.css";
import { ScrollHeading } from "./scroll-heading";

const marqueeText = "BEGIN YOUR PRACTICE · BEGIN YOUR PRACTICE · BEGIN YOUR PRACTICE · BEGIN YOUR PRACTICE · BEGIN YOUR PRACTICE · ";

export function LandingClosingInvitation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [marqueePaused, setMarqueePaused] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    const updatePageVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateMotionPreference();
    updatePageVisibility();

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(section);
    motionPreference.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", updatePageVisibility);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", updateMotionPreference);
      document.removeEventListener("visibilitychange", updatePageVisibility);
    };
  }, []);

  const paused = marqueePaused || !inView || !pageVisible || reducedMotion;

  return <section
    className="landing-closing"
    id="contact"
    ref={sectionRef}
    aria-labelledby="landing-closing-title"
    data-marquee-paused={paused}
  >
    <div className="landing-closing-photo" aria-hidden="true">
      <Image
        src="/images/landing/facilities/strength-floor.webp"
        alt=""
        fill
        sizes="100vw"
      />
    </div>
    <div className="landing-closing-wash" aria-hidden="true" />

    <div className="landing-closing-marquee" aria-hidden="true">
      <div className="landing-closing-marquee-track">
        <span>{marqueeText}</span>
        <span>{marqueeText}</span>
      </div>
    </div>

    <div className="landing-closing-inner">
      <p className="landing-closing-eyebrow"><span aria-hidden="true" />Your next chapter</p>
      <ScrollHeading id="landing-closing-title" lines={["You have the place.", "Now make it yours."]} />
      <ActionLink className="landing-closing-action" href="/join">Start now</ActionLink>
      <div className="landing-closing-caption">
        <p>Choose your plan. Begin your Practice.</p>
        {!reducedMotion && <button
          className="landing-closing-motion-control"
          type="button"
          aria-pressed={marqueePaused}
          onClick={() => setMarqueePaused((paused) => !paused)}
        >{marqueePaused ? "Play marquee" : "Pause marquee"}</button>}
      </div>
    </div>
  </section>;
}
