"use client";

import { Fragment, useEffect, useRef } from "react";
import "./scroll-heading.css";

export function ScrollHeading({ id, className, lines }: { id: string; className?: string; lines: string[] }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const words = [...heading.querySelectorAll<HTMLElement>(".landing-scroll-word")];
    let frame = 0;
    const update = () => {
      frame = 0;
      if (preference.matches) {
        delete heading.dataset.scrollReveal;
        return;
      }
      const height = window.innerHeight;
      const top = heading.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (height * .9 - top) / (height * .3)));
      words.forEach((word, index) => {
        const delay = words.length > 1 ? index / (words.length - 1) * .3 : 0;
        const focus = Math.min(1, Math.max(0, (progress - delay) / .7));
        word.style.setProperty("--landing-word-focus", String(focus));
      });
      heading.dataset.scrollReveal = "true";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
      delete heading.dataset.scrollReveal;
    };
  }, []);

  return <h2 id={id} className={className} ref={headingRef}>
    {lines.map((line, lineIndex) => <span className="landing-scroll-line" key={line}>
      {line.split(" ").map((word, wordIndex) => <Fragment key={`${wordIndex}-${word}`}>
        {wordIndex > 0 && " "}<span className="landing-scroll-word">{word}</span>
      </Fragment>)}{lineIndex < lines.length - 1 && " "}
    </span>)}
  </h2>;
}
