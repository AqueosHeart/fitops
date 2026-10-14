"use client";

/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- The scrollable region needs tab focus for keyboard navigation. */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import "./team.css";
import { ScrollHeading } from "./scroll-heading";

const coaches = [
  {
    name: "Maya",
    role: "Strength coach",
    image: "/images/landing/team/maya.webp",
  },
  {
    name: "Jordan",
    role: "Small-group coach",
    image: "/images/landing/team/jordan.webp",
  },
  {
    name: "Lena",
    role: "Movement coach",
    image: "/images/landing/team/lena.webp",
  },
];

export function LandingTeam() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const sectionIntersecting = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [motionInView, setMotionInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const updatePosition = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const index = maxScroll > 0
      ? Math.min(coaches.length - 1, Math.max(0, Math.round((viewport.scrollLeft / maxScroll) * (coaches.length - 1))))
      : 0;

    setActiveIndex(index);
    setCanGoPrevious(viewport.scrollLeft > 1);
    setCanGoNext(viewport.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(viewport);
    const track = viewport.querySelector<HTMLElement>(".landing-team-track");
    if (track) observer.observe(track);
    return () => observer.disconnect();
  }, [updatePosition]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    const updateVisibility = () => {
      setMotionInView(sectionIntersecting.current && document.visibilityState === "visible");
    };
    updateMotionPreference();
    updateVisibility();
    motionPreference.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => {
      sectionIntersecting.current = entry.isIntersecting;
      updateVisibility();
    });
    observer.observe(section);

    return () => {
      motionPreference.removeEventListener("change", updateMotionPreference);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  const move = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    const firstCard = viewport?.querySelector<HTMLElement>(".landing-team-card");
    if (!viewport || !firstCard) return;

    const track = viewport.querySelector<HTMLElement>(".landing-team-track");
    const gap = Number.parseFloat(track ? getComputedStyle(track).columnGap : "24") || 24;
    const step = firstCard.getBoundingClientRect().width + gap;
    viewport.scrollBy({
      left: direction * step,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const handleCarouselKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" && canGoPrevious) {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight" && canGoNext) {
      event.preventDefault();
      move(1);
    }
  };

  const motionPaused = marqueePaused || !motionInView || reducedMotion;

  return <section className="landing-team" ref={sectionRef} data-motion-active={motionInView && !reducedMotion} data-paused={!motionInView || reducedMotion} aria-labelledby="landing-team-title">
    <div className="landing-team-marquee" data-paused={motionPaused} aria-hidden="true">
      <span>OUR PEOPLE · OUR PEOPLE · OUR PEOPLE · OUR PEOPLE · OUR PEOPLE · </span>
      <span>OUR PEOPLE · OUR PEOPLE · OUR PEOPLE · OUR PEOPLE · OUR PEOPLE · </span>
    </div>

    <div className="landing-team-inner">
      <ScrollHeading className="landing-team-title" id="landing-team-title" lines={["Good coaching.", "A human connection."]} />
      <p className="landing-team-intro">Coaches who know your name. Guidance that feels personal.</p>

      <div className="landing-team-carousel" role="region" aria-label="Fictional coach profiles">
        {/* The scrollable viewport receives focus so arrow keys can move between snapped cards. */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="landing-team-viewport"
          ref={viewportRef}
          onScroll={updatePosition}
          onKeyDown={handleCarouselKeyDown}
          tabIndex={0}
          aria-label="Coach cards. Scroll horizontally to explore."
        >
          <div className="landing-team-track">
            {coaches.map((coach) => <article className="landing-team-card" key={coach.name}>
              <Image src={coach.image} alt="" width={1122} height={1402} sizes="(max-width: 650px) 82vw, 460px" />
              <div className="landing-team-caption">
                <h3>{coach.name}</h3>
                <p>{coach.role}</p>
              </div>
            </article>)}
          </div>
        </div>
      </div>
      <div className="landing-team-footer">
        <div className="landing-team-controls">
          <div className="landing-team-progress" role="progressbar" aria-label="Coach carousel position" aria-valuemin={1} aria-valuemax={coaches.length} aria-valuenow={activeIndex + 1}>
            <span style={{ transform: `translateX(${activeIndex * 100}%)` }} />
          </div>
          {!reducedMotion && <button
            type="button"
            className="landing-team-motion-control"
            aria-pressed={marqueePaused}
            onClick={() => setMarqueePaused((paused) => !paused)}
          >{marqueePaused ? "Resume marquee" : "Pause marquee"}</button>}
          <div className="landing-team-arrows">
            <button type="button" aria-label="Previous coach" onClick={() => move(-1)} disabled={!canGoPrevious}>←</button>
            <button type="button" aria-label="Next coach" onClick={() => move(1)} disabled={!canGoNext}>→</button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
