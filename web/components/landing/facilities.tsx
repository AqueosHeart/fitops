"use client";
/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Native scroll container needs focus for keyboard scrolling. */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import "./facilities.css";
import { ScrollHeading } from "./scroll-heading";

const spaces = [
  {
    title: "Strength floor",
    description: "A steady place to build your base.",
    image: "/images/landing/facilities/strength-floor.webp",
    alt: "Illustrative strength training space with racks and free weights.",
  },
  {
    title: "Small-group studio",
    description: "Shared energy, room to focus.",
    image: "/images/landing/facilities/small-group-studio.webp",
    alt: "Illustrative studio arranged for small-group training.",
  },
  {
    title: "Movement studio",
    description: "Space to stretch, reset and move.",
    image: "/images/landing/facilities/movement-studio.webp",
    alt: "Illustrative open movement studio with mats and equipment.",
  },
  {
    title: "Conditioning floor",
    description: "Find a rhythm that feels like yours.",
    image: "/images/landing/facilities/conditioning-floor.webp",
    alt: "Illustrative conditioning space with cardio equipment.",
  },
];

export function LandingFacilities() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({ activeIndex: 0, atStart: true, atEnd: false });

  const syncPosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const progress = maxScroll > 1 ? track.scrollLeft / maxScroll : 0;
    setPosition({
      activeIndex: Math.round(progress * (spaces.length - 1)),
      atStart: track.scrollLeft <= 1,
      atEnd: maxScroll <= 1 || track.scrollLeft >= maxScroll - 1,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(syncPosition);
    observer.observe(track);
    track.querySelectorAll(".landing-facilities-card").forEach((card) => observer.observe(card));
    syncPosition();
    return () => observer.disconnect();
  }, [syncPosition]);

  const move = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>(".landing-facilities-card");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth;
    track.scrollBy({ left: direction * distance, behavior: "auto" });
  }, []);
  const { activeIndex, atStart, atEnd } = position;
  const progressPercent = ((activeIndex + 1) / spaces.length) * 100;

  return (
    <section className="landing-facilities" id="facilities" aria-labelledby="landing-facilities-title">
      <div className="landing-facilities-inner">
        <span className="landing-facilities-ghost" aria-hidden="true">SPACES</span>
        <div className="landing-facilities-heading">
          <ScrollHeading id="landing-facilities-title" lines={["Find your space."]} />
          <p className="landing-facilities-intro">A closer look at the rooms behind your next session.</p>
        </div>

        <div className="landing-facilities-carousel" role="region" aria-roledescription="carousel" aria-label="Illustrative training spaces">
          <ul
            className="landing-facilities-track"
            ref={trackRef}
            tabIndex={0}
            aria-label="Training space cards"
            onScroll={syncPosition}
          >
            {spaces.map((space, index) => (
              <li className="landing-facilities-card" key={space.title} aria-label={`${index + 1} of ${spaces.length}`}>
                <Image src={space.image} alt={space.alt} fill sizes="(max-width: 650px) 86vw, (max-width: 980px) 43vw, 360px" />
                <span className="landing-facilities-image-wash" aria-hidden="true" />
                <span className="landing-facilities-caption-wash" aria-hidden="true" />
                <span className="landing-facilities-card-copy">
                  <span className="landing-facilities-card-title">{space.title}</span>
                  <span className="landing-facilities-card-description">{space.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="landing-facilities-controls">
          <div className="landing-facilities-progress-wrap">
            <div className="landing-facilities-progress" role="progressbar" aria-label="Carousel position" aria-valuemin={1} aria-valuemax={spaces.length} aria-valuenow={activeIndex + 1}>
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className="landing-facilities-arrows">
            <button type="button" aria-label="Previous space" onClick={() => move(-1)} disabled={atStart}>←</button>
            <button type="button" aria-label="Next space" onClick={() => move(1)} disabled={atEnd}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
