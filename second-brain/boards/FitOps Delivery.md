---
type: board-mirror
project: FitOps
updated: 2026-09-18
---

# FitOps Delivery Board Mirror

GitHub Projects becomes the execution source of truth after setup. This note is an Obsidian navigation aid and must not contradict GitHub issue status.

## Current Sprint (Sprint 0 -> Transition to Sprint 1)

- [[../wiki/tasks/Sprint 0]]

## Ready for Sprint 1

- [#6 [DESIGN] Low-Fidelity Desktop & Mobile Booking Flow Wireframes](https://github.com/AqueosHeart/fitops/issues/6)
  - draw.io is the editable UX source of truth. The Mermaid sitemap and English-only Figma generator statically align on 29 routes and anchors through `node scripts/validate-ux-sync.mjs`, including Join, legal, cookies, 404, and the protected member workspace.
  - Native flow recovery is explicitly mapped for booking, waitlist, cancellation, trainer, administrator, and authentication states; Figma visual execution remains the outstanding verification step.
  - The generated eleven module pages, 19 desktop states, and 17 Android states still require execution and visual QA in Figma; Issue #6 remains pending.
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
