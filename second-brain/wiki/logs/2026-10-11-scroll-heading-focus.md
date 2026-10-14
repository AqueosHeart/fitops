---
type: session
project: FitOps
date: 2026-10-11
---

# Scroll heading focus

User requested blurred letters becoming clear during scroll, extending the hero refresh entrance. Updated draw.io presentation note before implementation. Shared `ScrollHeading` replaces the five section headings (facilities, activities, plans, team, closing), including the former time-driven team word reveal.

Word focus tracks heading position from 90% to 60% of viewport height, with progressive word offsets. Blur decreases from 8 px to zero and vertical offset from 8 px to zero; scrolling backward reverses it. Passive scroll listener batches writes in requestAnimationFrame, with listener/frame cleanup. Semantic h2 text and line breaks are retained. Reduced motion and no-JavaScript output are immediately clear; no dependency added. Hero entrance and marquees unchanged.

Next.js/Storybook builds, lint/typecheck, UX sync and six focused Chromium tests pass. New scroll test checks initial/intermediate/final focus and reversal for every heading at 1440 and 390 px, plus reduced motion. Existing full-page production/Storybook accessibility, overflow, carousels, pause and routing checks pass. Desktop intermediate and mobile final captures reviewed; no-JavaScript check confirmed 22 unblurred word spans. Performance budgets and DB acceptance not rerun; no data, route, GitHub/sprint or deployment change.
