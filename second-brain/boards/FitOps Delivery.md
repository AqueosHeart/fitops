---
type: board-mirror
project: FitOps
updated: 2026-09-21
---

# FitOps Delivery Board Mirror

GitHub Projects becomes the execution source of truth after setup. This note is an Obsidian navigation aid and must not contradict GitHub issue status.

## Current Sprint (Sprint 0 -> Transition to Sprint 1)

- [[../wiki/tasks/Sprint 0]]

## Ready for Sprint 1

- [#6 [DESIGN] Low-Fidelity Desktop & Mobile Booking Flow Wireframes](https://github.com/AqueosHeart/fitops/issues/6)
  - draw.io is the editable UX source of truth. The Mermaid route/access architecture and English-only Figma generator statically align on 29 routes and anchors through `node scripts/validate-ux-sync.mjs`, including secondary `My Account`, primary `Join Now`, legal, cookies, 404, and the protected member workspace.
  - The nine-page native file separates `00 Sitemap` (26 page URLs, independently checked) from `01 Route & Access Architecture` (routes, UI/system states, enrollment steps); Pages 02 through 07 retain detailed behavior, and Page 08 records wireframe coverage. Figma visual execution remains the outstanding verification step.
  - The plugin now defines 26 page routes plus a separate 404 fallback, each with full desktop (1440 px) and mobile (390 px) sections. It generates 163 scenarios per device across 27 separate versioned Figma route pages. Desktop/mobile scenario frames are direct children of their page. Only different-frame, same-page transitions receive NAVIGATE reactions; cross-page destinations are labeled and reached through the plugin page chooser. The earlier combined-page run failed native reaction validation; the stricter local regression tests now pass, but native rerun and visual QA remain pending. Issue #6 remains pending.
  - Review hub: [[../wiki/design/FitOps User Flows]]
  - Editable diagram: [[../wiki/design/FitOps User Flows.drawio]]
- [#7 [ARCH] Domain Boundary & Use-Case Specification](https://github.com/AqueosHeart/fitops/issues/7)
- [#8 [DATA] Physical Database Schema & Migration Strategy (Prisma)](https://github.com/AqueosHeart/fitops/issues/8)
- [#9 [SEC] Threat Model & Server-Side Access Control Specification](https://github.com/AqueosHeart/fitops/issues/9)

## In Review

- None (Sprint 0 Exit Gate Review)

## Done (Sprint 0 Completed)

- [#1 [DOCS] Define Product Requirements and Core Booking Rules](https://github.com/AqueosHeart/fitops/issues/1)
- [#2 [ARCH] Modular Monolith Architecture & Technology Selection](https://github.com/AqueosHeart/fitops/issues/2)
- [#3 [BRAND] Practice Athletic Club Brand Identity & Design System Guidelines](https://github.com/AqueosHeart/fitops/issues/3)
- [#4 [DATA] Conceptual Data Model & Entity Relationships (DBML)](https://github.com/AqueosHeart/fitops/issues/4)
- [#5 [API] Initial REST Contract & Response Shapes](https://github.com/AqueosHeart/fitops/issues/5)
- Public repository and second-brain setup
- Generated 8 vector presentation slide SVGs in `docs/brand/figma/`
