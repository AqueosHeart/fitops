---
type: board-mirror
project: FitOps
updated: 2026-09-23
---

# FitOps Delivery Board Mirror

GitHub Projects becomes the execution source of truth after setup. This note is an Obsidian navigation aid and must not contradict GitHub issue status.

## Current Sprint (Sprint 0 -> Transition to Sprint 1)

- [[../wiki/tasks/Sprint 0]]

## Ready for Sprint 1

- [#6 [DESIGN] Low-Fidelity Desktop & Mobile Booking Flow Wireframes](https://github.com/AqueosHeart/fitops/issues/6)
  - Confirmed under **Ready for Sprint 1** in this system; added the existing `sprint:sprint-1` label to GitHub Issue #6. The issue remains open because native Figma execution and visual approval are outstanding. GitHub reports no Project attached to this issue; Project listing requires the missing `read:project` scope.
  - draw.io is the editable UX source of truth. The Mermaid route/access architecture and English-only Figma generator statically align on 29 routes and anchors through `node scripts/validate-ux-sync.mjs`, including secondary `My Account`, primary `Join Now`, legal, cookies, 404, and the protected member workspace.
  - The nine-page native file separates `00 Sitemap` (26 page URLs, independently checked) from `01 Route & Access Architecture` (routes, UI/system states, enrollment steps); Pages 02 through 07 retain detailed behavior, and Page 08 records wireframe coverage. Figma visual execution remains the outstanding verification step.
- The plugin now defines 26 page routes plus a separate 404 fallback, each with full desktop (1440 px) and mobile (390 px) sections. It generates 163 scenarios per device across 20 named versioned Figma review pages; desktop/mobile scenario frames remain direct children of their page. Only different-frame, same-page transitions receive NAVIGATE reactions; cross-page destinations are labeled and reached through the plugin page chooser. The local `Manage FitOps Components` action separately scans the UI kit and maintains a Button component set with Style, Size, and Brand variants plus five neutral native components, without changing the Community template. Static checks pass; native rerun and visual QA remain pending. Issue #6 remains pending.
  - Penpot now has all 20 review groups as a static vector mirror: 163 scenarios / 326 desktop-mobile boards, with no icons or prototype reactions. This supports review but does not satisfy the native Figma execution and approval gate; Issue #6 remains pending.
  - On 2026-09-23, removed 12 duplicate older Penpot import pages and retained one numbered 20-page wireframe set. Live screen names match all 26 draw.io page routes, the 404 fallback, and 163 scenarios on each device. Corrected short screen backgrounds and spot-checked member booking and schedule exports. Full native Figma visual approval remains open.
  - Review hub: [[../wiki/design/FitOps User Flows]]
  - Editable diagram: [[../wiki/design/FitOps User Flows.drawio]]
- [#7 [ARCH] Domain Boundary & Use-Case Specification](https://github.com/AqueosHeart/fitops/issues/7)
  - Closed on GitHub in `c8d1262`: [[../wiki/design/Issue 7 Domain Boundaries and Use Cases]] documents ten use cases, twelve-rule mapping, ADRs 007–008, and seven race scenarios. ADR 008 resolves the DDD boundary review and the expanded context/aggregate/event artifacts pass the DDD design checklists. Schema, migrations, and PostgreSQL proof remain downstream implementation evidence.
- [#8 [DATA] Physical Database Schema & Migration Strategy (Prisma)](https://github.com/AqueosHeart/fitops/issues/8)
  - Open. Revised [physical schema plan](../../docs/database/physical-schema-plan.md) uses one physical session row (ADR 009), specifies auth storage, constraints, and lock order, and adds capacity-increase FIFO promotion (ADR 010). The issue's GitHub body currently contains only `## Summary`.
  - The [first review](../../docs/database/physical-schema-review.md) found four high and four medium design gaps. The [second review](../../docs/database/physical-schema-second-review.md) records their design resolution and remaining implementation/security gates. Prisma schema, committed migrations, and PostgreSQL race evidence are pending.
  - The [independent third review](../../docs/database/physical-schema-third-review.md) corrected cancellation cutoff rechecks (ADR 011), stale Issue #7 protocol, and the invariant-error contract on Book and Join. No executable proof yet.
- [#9 [SEC] Threat Model & Server-Side Access Control Specification](https://github.com/AqueosHeart/fitops/issues/9)

## In Review

- None (Sprint 0 Exit Gate Review)

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
