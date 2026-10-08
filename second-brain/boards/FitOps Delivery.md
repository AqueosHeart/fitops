---
type: board-mirror
project: FitOps
updated: 2026-10-08
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
- Complete: **Done**, Sprint 4, SDLC Phase 4, Feature, High risk, P1, estimate 8. PR [#15](https://github.com/AqueosHeart/fitops/pull/15) merged 2026-10-07 at `ee5839203e15879309187a6b811532ff15b56f3a`; Issue #10 is Closed.
  - Implements Better Auth credentials/database sessions, server-side ownership/role authorization, `/api/v1` handlers, validation, anti-CSRF/origin behavior, and API contract tests. UI is explicitly downstream.
  - Latest evidence: auth (5), API-contract (7), PostgreSQL-constraint (2), synchronized race (10), lint, TypeScript, Prisma validation/generation, production build, and zero-finding dependency audits passed before merge. ADR 015 records the lint-toolchain tradeoff. All 17 handlers have contract evidence. PR [#15](https://github.com/AqueosHeart/fitops/pull/15) merged 2026-10-07; no Actions checks are configured.
- [#11 [UI] Member Booking Product Slice](https://github.com/AqueosHeart/fitops/issues/11)
- Complete: **Done**, Sprint 5, SDLC Phase 4, Feature, High risk, P1, estimate 8. PR [#16](https://github.com/AqueosHeart/fitops/pull/16) merged 2026-10-07 at `0248913b6867708a6f5bf8e1dd44a74ac32ec313`; Issue #11 is Closed.
  - Verified member UI, server-side protection, reservation-aware schedule, sign-out, and additive cancellation cutoff. API-contract (7), Prisma validation, TypeScript, lint, production build (29 routes), browser registration/login/booking/waitlist/cancellation/sign-out flows, mobile 390×844 review, and scratch-db fresh/idempotent seed checks passed. No Actions checks are configured.
- [#12 [UI] Administrator Operations Product Slice](https://github.com/AqueosHeart/fitops/issues/12)
  - UX follow-up: one focused admin header replaces duplicate/public navigation; signed-in My Account routes to `/app` for member-profile users or an authorized `returnTo`. Contract/API, lint, type, build, and UX coverage checks pass. Concurrent fixture lookup was made deterministic. The requested fictional local account already had the admin role, so no permission mutation was needed. Route-access and admin SVG previews were regenerated and visually inspected. The workstation Docker engine remains unavailable, so acceptance used an isolated disposable PostgreSQL instance on the LAN host rather than the deployed demo database.
  - Complete: **Done**, Sprint 6, SDLC Phase 4, Feature, High risk, P1, estimate 5. PR [#17](https://github.com/AqueosHeart/fitops/pull/17) merged to `main` at `08fbdd894c27436de2a52d8efe5c722c2e43dc56` on 2026-10-08; Issue #12 is Closed and GitHub Project status is Done. The fictional admin account was already an administrator, so no role/account data changed.
  - Local work-at-home setup now has a Compose PostgreSQL service and migration/seed guide. It creates a fresh fictional database per computer and does not sync current local activity. Issue #12 browser acceptance has passed; Issue #14 production/release gates remain open.
  - 2026-10-08 LAN deployment follow-up: FitOps is running from `/home/sebastian/fitops` on `192.168.1.208:3001` with its own private PostgreSQL volume. Migrations, one-time fictional seed, DB verification, public login HTTP 200, unauthenticated admin redirect, and server-side authenticated admin HTTP 200 passed. AARC remains active on port 3000 and was untouched. The deployment is LAN-only; a high-severity audit finding in pinned Next.js 16.3.6 must be resolved before broader exposure. Interactive browser acceptance remains open.
  - 2026-10-08 Prisma Studio: optional profile running through a companion loopback proxy at `127.0.0.1:5555`; accessed through the workstation's SSH tunnel. Studio HTML/JS return 200. It is a direct DB editor and must be stopped after use; ADR 017 records its access boundary.
  - 2026-10-08 authenticated browser acceptance and focused code review passed; PR #17 merged. Browser acceptance covered overview, filter/empty state, seeded participants/FIFO, create/edit, staff `/portal/login` return, mobile width, capacity promotion, and member/trainer denial. API-contract passed 7/7 against isolated PostgreSQL. Temporary resources were removed and deployed demo data stayed unchanged.
- [#13 [QUALITY] System Quality and Production-Candidate Evidence](https://github.com/AqueosHeart/fitops/issues/13)
  - In Progress: Sprint 7, SDLC Phase 5, Test, High risk, P1, estimate 8. PR [#18](https://github.com/AqueosHeart/fitops/pull/18) is ready for review. CI run [37847213151](https://github.com/AqueosHeart/fitops/actions/runs/37847213151) passes PostgreSQL migrations/seed/integration, lint/typecheck, dependency audit, production build, critical Playwright journey, all axe scans, and desktop/mobile LCP/CLS lab budgets. Focused security review is recorded in `docs/reviews/issue-13-security-review.md`; its deployment-only HTTPS/HSTS and trusted-proxy conditions are tracked in Issue #14. Issue #13 acceptance criteria are checked; issue remains open pending PR review/merge.
- [#14 [RELEASE] Deployment and Portfolio Evidence](https://github.com/AqueosHeart/fitops/issues/14)
  - Backlog: Sprint 8, SDLC Phase 6, Maintenance, Medium risk, P2, estimate 5. Depends on Issue #13 quality evidence. Acceptance now explicitly requires HTTPS/HSTS before public exposure and a sanitized, trusted proxy boundary before IP-based login throttling is enabled.
- [#19 [UI] Trainer Assigned Sessions Workspace](https://github.com/AqueosHeart/fitops/issues/19)
  - In Review in GitHub Project (2026-10-08), Phase 4 / P1 / Feature. PR [#20](https://github.com/AqueosHeart/fitops/pull/20), stacked on PR #18, adds protected assigned-session list/detail, aggregate-only counts, safe trainer return paths, and implementation evidence. PR check [37853584276](https://github.com/AqueosHeart/fitops/actions/runs/37853584276) passes isolated PostgreSQL, audit, type/build, and browser/accessibility gates. Not added to Sprint 7, whose goal remains Issue #13; merge #20 after #18 is reviewed and merged.
- [#9 [SEC] Threat Model & Server-Side Access Control Specification](https://github.com/AqueosHeart/fitops/issues/9)
  - Closed and tracked as Done. [ADR 012](../../docs/adr/012-identity-security-baseline.md) and the [threat model](../../docs/security/threat-model-and-access-control.md) define the credential, JWT, CSRF, IDOR, rate-limit, redirect, and redaction requirements that Issue #8 needs.

## Project setup

2026-10-07 Issue #12 UX follow-up: the admin shell now has one focused header (Overview, Sessions, My Account, Public site), and My Account routes valid member sessions directly to `/app` unless a role-permitted return path applies. Contract tests (7/7), focused ESLint, and TypeScript pass; authenticated browser acceptance remains open and GitHub status is unchanged.

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
