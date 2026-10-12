"use client";

import { useEffect, useRef, useState } from "react";
import "./principles.css";

const principles = [
  "SMALL GROUP BY DESIGN",
  "COACHING THAT MEETS YOU HERE",
  "PROGRESS AT YOUR PACE",
];

export function LandingPrinciples() {
  const ribbonRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const ribbon = ribbonRef.current;
    if (!ribbon) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    const updateDocumentVisibility = () => setDocumentVisible(document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));

    updateMotionPreference();
    updateDocumentVisibility();
    observer.observe(ribbon);
    motionPreference.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", updateDocumentVisibility);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", updateMotionPreference);
      document.removeEventListener("visibilitychange", updateDocumentVisibility);
    };
  }, []);

  const motionActive = inView && documentVisible && !reducedMotion && !paused;

  return <section className="landing-principles" ref={ribbonRef} data-motion-active={motionActive} aria-label="Practice principles">
    <ul className="landing-principles-accessible">
      {principles.map((principle) => <li key={principle}>{principle}</li>)}
    </ul>

    <div className="landing-principles-viewport" aria-hidden="true">
      <div className="landing-principles-track">
        {[0, 1].map((copy) => <div className="landing-principles-group" key={copy}>
          {principles.map((principle, index) => <span className={`landing-principles-item landing-principles-item-${index + 1}`} key={principle}>{principle}</span>)}
        </div>)}
      </div>
    </div>

    {!reducedMotion && <button
      className="landing-principles-control"
      type="button"
      aria-label={paused ? "Play principles motion" : "Pause principles motion"}
      aria-pressed={paused}
      onClick={() => setPaused((wasPaused) => !wasPaused)}
    ><span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span><span className="landing-principles-control-label">{paused ? "Play" : "Pause"}</span></button>}
  </section>;
}
