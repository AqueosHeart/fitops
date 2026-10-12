"use client";

/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Native horizontal scroll viewport must receive keyboard focus. */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ActionLink } from "./action-link";
import "./activities.css";

const activities = [
  {
    title: "Strength Foundations",
    description: "A coached first step into strength.",
    image: "/images/landing/activities/strength-foundations.webp",
    alt: "A participant practices a dumbbell squat with a coach nearby.",
  },
  {
    title: "Small-group training",
    description: "Shared energy, with room to focus.",
    image: "/images/landing/activities/small-group-training.webp",
    alt: "A small group works through a coached kettlebell exercise.",
  },
  {
    title: "Movement & mobility",
    description: "Stretch, reset and move with intention.",
    image: "/images/landing/activities/movement-mobility.webp",
    alt: "A participant stretches on a mat in a bright studio.",
  },
];

export function LandingActivities() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [marqueeInView, setMarqueeInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const updatePosition = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    setProgress(maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0);
    setCanGoPrevious(viewport.scrollLeft > 1);
    setCanGoNext(viewport.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [updatePosition]);

  useEffect(() => {
    const section = viewportRef.current?.closest(".landing-activities");
    if (!section) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    const sectionIsInViewport = () => {
      const bounds = section.getBoundingClientRect();
      return bounds.bottom > 0 && bounds.top < window.innerHeight;
    };
    const updateVisibility = () => setMarqueeInView(document.visibilityState === "visible" && sectionIsInViewport());
    updateMotionPreference();
    updateVisibility();
    motionPreference.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setMarqueeInView(entry.isIntersecting && document.visibilityState === "visible"));
    observer.observe(section);
    return () => {
      motionPreference.removeEventListener("change", updateMotionPreference);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  const move = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const card = viewport.querySelector<HTMLElement>(".landing-activity-card");
    const gap = Number.parseFloat(getComputedStyle(viewport).columnGap) || 24;
    viewport.scrollBy({ left: direction * ((card?.offsetWidth ?? viewport.clientWidth) + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return <section className="landing-activities" id="programs" aria-labelledby="landing-activities-title">
    <div className="landing-activities-marquee" data-paused={marqueePaused || !marqueeInView || reducedMotion} aria-hidden="true">
      <span>MOVE YOUR WAY · MOVE YOUR WAY · MOVE YOUR WAY · MOVE YOUR WAY · </span>
      <span>MOVE YOUR WAY · MOVE YOUR WAY · MOVE YOUR WAY · MOVE YOUR WAY · </span>
    </div>

    <div className="landing-activities-heading">
      <div className="landing-activities-copy">
        <p className="landing-activities-eyebrow"><span aria-hidden="true" />A practice for every pace</p>
        <h2 id="landing-activities-title">Move your way.</h2>
        <p className="landing-activities-description">Build strength. Find energy. Make room to reset.<br className="landing-activities-desktop-break" /> Start with the way you want to feel.</p>
      </div>
      <ActionLink className="landing-activities-schedule" href="/schedule" variant="outline">View the schedule</ActionLink>
    </div>

    <div className="landing-activities-carousel" role="region" aria-label="Activities">
      <div className="landing-activities-viewport" ref={viewportRef} onScroll={updatePosition} tabIndex={0} aria-label="Activity cards. Scroll horizontally to explore.">
        <div className="landing-activities-track">
          {activities.map((activity, index) => <article className="landing-activity-card" key={activity.title}>
            <a className="landing-activity-image-link" href="/programs" aria-label={`Explore ${activity.title} programs`}>
              <Image src={activity.image} alt={activity.alt} width={920} height={792} />
            </a>
            <div className="landing-activity-caption">
              <p className="landing-activity-index" aria-hidden="true">0{index + 1} / 03</p>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
            </div>
          </article>)}
        </div>
      </div>
    </div>

    <div className="landing-activities-footer">
      <p>Coached · Purposeful · At your pace</p>
      <div className="landing-activities-controls">
        <div className="landing-activities-progress" role="progressbar" aria-label="Carousel position" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <span style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
        </div>
        {!reducedMotion && <button type="button" className="landing-activities-motion-control" aria-pressed={marqueePaused} onClick={() => setMarqueePaused((paused) => !paused)}>{marqueePaused ? "Play motion" : "Pause motion"}</button>}
        <button type="button" className="landing-activities-arrow landing-activities-arrow-previous" aria-label="Previous activity" onClick={() => move(-1)} disabled={!canGoPrevious}>←</button>
        <button type="button" className="landing-activities-arrow landing-activities-arrow-next" aria-label="Next activity" onClick={() => move(1)} disabled={!canGoNext}>→</button>
      </div>
    </div>
  </section>;
}
