---
type: log
project: FitOps
date: 2026-09-22
status: native-rerun-pending
---

# Named wireframe review groups

- User asked for meaningful Figma page names and asked that 404, legal, and cookie screens be grouped together.
- Updated draw.io Page 08 first. The generator now produces 20 named review pages while preserving all 26 routes, the separate 404 fallback, 163 scenarios per device, and top-level desktop/mobile frames.
- `Legal & Misc · Terms, Privacy, Waiver, Cookies, 404` is one page. Pricing and About are grouped as Club information; login and recovery as Account access; trainer list/detail as Assigned sessions. High-state member booking and administrator routes remain dedicated pages for review clarity.
- The migration action now moves old combined-page output into the same named review groups. Full regeneration creates valid same-page prototype actions for grouped routes; cross-group destinations remain labeled and use the chooser.
- Rebuilt the plugin bundle. Structural generator tests and UX synchronization pass; native Figma rerun and visual QA remain pending.
