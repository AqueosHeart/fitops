---
type: board-mirror
project: FitOps
updated: 2026-10-07
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
  - Closed and Done. Two fresh disposable databases applied both migrations; rejected-write tests, fictional seed verification, and ten synchronized PostgreSQL race/rollback tests pass locally.
- [#10 [API] Secure REST API and Server-Side Access Control](https://github.com/AqueosHeart/fitops/issues/10)
  - Active: **In Progress**, Sprint 4, SDLC Phase 4, Feature, High risk, P1, estimate 8.
  - Implements Better Auth credentials/database sessions, server-side ownership/role authorization, `/api/v1` handlers, validation, anti-CSRF/origin behavior, and API contract tests. UI is explicitly downstream.
  - Latest local evidence: on 2026-10-07, auth (5), API-contract (7), PostgreSQL-constraint (2), and synchronized race (10) tests pass, along with lint, TypeScript, diff check, Prisma validation/generation, production build (14 static pages), and full dependency audit (0 findings). ADR 015 replaces the vulnerable Next ESLint chain with pinned React, Hooks, JSX accessibility, TypeScript, import, and ESLint core rules; `@next/next/*` checks are intentionally not applied pending an audit-clean compatible plugin. All 17 handlers have contract evidence, including no-mutation rejection cases, booking/waitlist edges, trainer isolation, admin scheduling/capacity rules, limiter behavior, redaction, and registration cleanup. PR [#15](https://github.com/AqueosHeart/fitops/pull/15) is open; no Actions checks are configured. Issue #10 remains Open pending maintainer review/merge.
- [#11 [UI] Member Booking Product Slice](https://github.com/AqueosHeart/fitops/issues/11)
  - Backlog: Sprint 5, SDLC Phase 4, Feature, High risk, P1, estimate 8. Depends on Issue #10's verified API.
- [#12 [UI] Administrator Operations Product Slice](https://github.com/AqueosHeart/fitops/issues/12)
  - Backlog: Sprint 6, SDLC Phase 4, Feature, High risk, P1, estimate 5. Depends on the secure API and member contract.
- [#13 [QUALITY] System Quality and Production-Candidate Evidence](https://github.com/AqueosHeart/fitops/issues/13)
  - Backlog: Sprint 7, SDLC Phase 5, Test, High risk, P1, estimate 8. Covers E2E, accessibility, security, performance, CI, and truthful evidence.
- [#14 [RELEASE] Deployment and Portfolio Evidence](https://github.com/AqueosHeart/fitops/issues/14)
  - Backlog: Sprint 8, SDLC Phase 6, Maintenance, Medium risk, P2, estimate 5. Depends on Issue #13 quality evidence.
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
