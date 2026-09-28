---
type: board-mirror
project: FitOps
updated: 2026-09-25
---

# FitOps Delivery Board Mirror

GitHub Projects becomes the execution source of truth after setup. This note is an Obsidian navigation aid and must not contradict GitHub issue status.

## Sprint 0 complete -> implementation preparation

- [[../wiki/tasks/Sprint 0]]

## Ready for Sprint 1

- [#6 [DESIGN] Low-Fidelity Desktop & Mobile Booking Flow Wireframes](https://github.com/AqueosHeart/fitops/issues/6)
  - Closed on GitHub. ADR 013 replaces the obsolete native Figma requirement with Penpot as the visual-design tool.
  - draw.io is the editable UX source of truth. The Mermaid route/access architecture and English-only scenario definitions align on 29 routes and anchors through `node scripts/validate-ux-sync.mjs`, including secondary `My Account`, primary `Join Now`, legal, cookies, 404, and the protected member workspace.
  - Penpot has one canonical 20-page wireframe set: 163 scenarios / 326 desktop-mobile boards. Live screen names match all 26 draw.io page routes, the 404 fallback, and every scenario on each device. No Figma execution is required.
  - Review hub: [[../wiki/design/FitOps User Flows]]
  - Editable diagram: [[../wiki/design/FitOps User Flows.drawio]]
- [#7 [ARCH] Domain Boundary & Use-Case Specification](https://github.com/AqueosHeart/fitops/issues/7)
  - Closed on GitHub in `c8d1262`: [[../wiki/design/Issue 7 Domain Boundaries and Use Cases]] documents ten use cases, twelve-rule mapping, ADRs 007–008, and seven race scenarios. ADR 008 resolves the DDD boundary review and the expanded context/aggregate/event artifacts pass the DDD design checklists. Schema, migrations, and PostgreSQL proof remain downstream implementation evidence.
- [#8 [DATA] Physical Database Schema & Migration Strategy (Prisma)](https://github.com/AqueosHeart/fitops/issues/8)
  - Open and tracked as **In Progress**, Sprint 3, SDLC Phase 4, Architecture, High risk, P1, estimate 5. Its acceptance criteria cover the executable Prisma schema, migrations, PostgreSQL proof, fictional seeds, and synchronized race tests.
  - The reviewed migration and fictional seed are applied locally. Booking read/lock, direct booking, waitlist, cancellation/promotion, and capacity-edit services exist. Ten local synchronized PostgreSQL tests cover final seat, queue positions, cancellation/capacity interleavings, ineligible and multi-seat promotion, cutoff rollback, and injected promotion-write rollback.
  - The [independent third review](../../docs/database/physical-schema-third-review.md) corrections are implemented for promotion cutoff rechecks and the invariant-error contract. Authenticated HTTP handlers, Auth.js credentials, authorization, and UI are still outside the implemented scope.
- [#9 [SEC] Threat Model & Server-Side Access Control Specification](https://github.com/AqueosHeart/fitops/issues/9)
  - Closed and tracked as Done. [ADR 012](../../docs/adr/012-identity-security-baseline.md) and the [threat model](../../docs/security/threat-model-and-access-control.md) define the credential, JWT, CSRF, IDOR, rate-limit, redirect, and redaction requirements that Issue #8 needs.

## Project setup

- `FitOps Delivery` is linked to `AqueosHeart/fitops`.
- Required fields: Status, Priority, Size, Estimate, Iteration, Start date, Target date, Sprint, SDLC Phase, Work Type, and Risk. `Work Type` is the GitHub-compatible replacement for the reserved `Type` name.
- Views: Current Sprint, Product Backlog, SDLC Roadmap, and Bugs and Debt.

## Done (Sprint 0 Completed)

- [#1 [DOCS] Define Product Requirements and Core Booking Rules](https://github.com/AqueosHeart/fitops/issues/1)
- [#2 [ARCH] Modular Monolith Architecture & Technology Selection](https://github.com/AqueosHeart/fitops/issues/2)
- [#3 [BRAND] Practice Athletic Club Brand Identity & Design System Guidelines](https://github.com/AqueosHeart/fitops/issues/3)
  - The connected Penpot file has a `Design Tokens` review page. Documented color/type candidates and proposed spacing/grid values are clearly distinguished; the page does not approve the brand. The latest catalog read reports `Practice Exploratory` active and `FitOps Layout Proposal` inactive.
  - Lucide is the selected UI icon family; a separate Penpot page documents 20 upstream SVGs and proposed sizing/usage rules. Brand approval remains pending.
- [#4 [DATA] Conceptual Data Model & Entity Relationships (DBML)](https://github.com/AqueosHeart/fitops/issues/4)
- [#5 [API] Initial REST Contract & Response Shapes](https://github.com/AqueosHeart/fitops/issues/5)
- Public repository and second-brain setup
- Generated 8 vector presentation slide SVGs in `docs/brand/figma/`
