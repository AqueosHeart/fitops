---
type: session
project: FitOps
date: 2026-10-11
---

# Hero focus entrance

User supplied MeuFit Vigo URL and screenshots of progressive blurred-to-sharp headings and requested that effect for `Progress is a practice.` on refresh. Read reference page and attempted live motion inspection; live heading remained unsplit/static during automated observation, so supplied screenshots guide the visual treatment rather than an asserted exact source timing.

Updated draw.io presentation note first. Four semantic word spans now animate from 12 px blur/14 px vertical offset to sharp white text over 850 ms, with 140 ms stagger (100 to 520 ms delays). Description follows; buttons slide without opacity fading to preserve contrast. CSS-only animation replays on document load, shares production/Storybook code, and leaves content immediately visible for reduced motion. Other sections unchanged.

Verified builds, lint/typecheck, UX sync and five focused Chromium tests, including deterministic stagger comparison, refresh replay and reduced-motion fallback. Desktop intermediate/final frames visually inspected. Initial axe check ran during button fade and caught low transient contrast; removed button opacity animation and checked text after entrance completion. No dependency, route, data, GitHub/sprint or deployment change; performance budgets not rerun.
