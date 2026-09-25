---
type: project
status: active
phase: development preparation
sprint: Sprint 0 complete
updated: 2026-09-25
---

# FitOps

FitOps is the repository and internal project codename. The public-facing fictional gym is **Practice Athletic Club**, which helps members discover and reserve classes while giving staff a dependable way to manage schedules, capacity, cancellations, and waitlists.

## Current outcome

The [Sprint 0 exit review](../../../docs/reviews/sprint-0-exit-review.md) passed on 2026-09-25. `FitOps Delivery` is linked to the repository and has the required fields and views. Issue #8 is open and tracked as Sprint 3, SDLC Phase 4, Architecture, High risk, P1, estimate 5; Issue #9 is closed and Done. The version-pinned `web/` foundation, first reviewed migration, and fictional seed are applied locally; the next work is repository adapters and transaction proof.

The planning foundation exists. `Practice Athletic Club`, Quiet Strength, the Mona Sans lime-bar wordmark, and its palette/type materials are working brand inputs, not a defined or approved brand. `wiki/design/FitOps User Flows.drawio` is the editable source of truth for UX navigation and flows; Mermaid and Penpot are derived only after it changes. ADRs 004 through 006 separate public discovery, fictional membership Join, secondary existing-member account access, and the protected member dashboard (`/app`). The native correction passes make recovery paths, role routing, fictional-plan selection, public footer/system destinations, and in-app promotion visibility explicit without expanding MVP payment, refund, deletion, or real-time-notification scope. The native file now has nine pages: `00 Sitemap` contains 26 page URLs only; `01 Route & Access Architecture` preserves route/access context, explicitly typed UI/system states, and enrollment steps; Pages 02 through 07 retain the detailed flows; Page 08 specifies wireframe sections and states. Landing anchors and the `/404` fallback belong to the architecture view, not the page-only sitemap. No routes or product capabilities were added. Landing and Public Schedule are distinct Penpot route pages. The public header has a secondary `My Account` utility to `/portal/login` and a primary `Join Now` CTA to `/join`; registration requires a selected fictional plan. No payment, card, or real subscription is collected. Static checks cover 26 page-only sitemap URLs plus the existing 29 route/anchor mappings across the architecture and generator. The plugin defines 26 page routes plus a separate 404 fallback, each with full desktop (1440 px) and mobile (390 px) sections. It generates 163 scenarios per device across 20 sidebar-readable Penpot review pages whose names begin with their ordered group. Related routes share a page, while every desktop/mobile scenario frame remains a direct child of that page. Legal & Misc groups Terms, Privacy, Waiver, Cookie preferences, and 404; Club information, Account access, and Trainer screens are grouped by workflow. Only different-frame, same-page transitions receive NAVIGATE reactions; cross-page destinations are labeled and reached through the plugin page chooser. The canonical Penpot inventory and structural sync check are the available visual-design evidence; Issue #6 is closed. Implementation may now begin with the version-pinned foundation described in the Sprint 0 exit review.

## FitOps component page manager

ADR 013 supersedes the earlier Figma references in this project's historical planning record. Penpot is now the active visual-design tool; draw.io remains the editable UX-flow source, and Mermaid plus Penpot are derived artifacts. The closed Issue #6 is evidenced by the canonical Penpot inventory, not a native Figma run. The local Figma toolkit remains historical source tooling and is not a delivery gate.

## Penpot candidate token set

The connected Penpot `FitOps Design System` file now has a `Design Tokens` page with palette swatches, a typography table, a proposed spacing scale, and proposed 1440 px desktop, 768 px tablet, and 390 px mobile grids. The `Practice Exploratory` catalog set contains 11 documented color candidates, 9 documented font sizes, and 5 Mona Sans weights; `FitOps Layout Proposal` contains 8 proposed spacing values based on a 4 px unit. The latest catalog read reports `Practice Exploratory` active, `FitOps Layout Proposal` inactive, `Global` inactive, and the `FitOps` theme inactive with no sets. This activation state does not approve the brand. Grid and spacing values remain proposals pending review against real flows; no undocumented radius or shadow values were added.

Lucide is the selected icon family for the planned UI. Penpot has a separate `Icons — Lucide` page with 20 upstream Lucide SVGs covering navigation/account, booking/schedule, status/feedback, and common controls. The page recommends 24 px / 2 px stroke as the default, with text labels for navigation and ambiguous actions. This records an icon-library choice, not approval of the visual identity or implementation.

The connected Penpot file has one canonical set of 20 numbered `— Wireframes` pages: 163 scenarios, each represented by desktop (1440 px) and mobile (390 px) static SVG-vector boards. The 2026-09-23 cleanup removed 12 duplicate older import pages after comparing scenario names with the newer QA pages; groups 13–20 were kept and corrected in place. Live page inventory matches all 26 draw.io page routes, the 404 fallback, and every desktop/mobile state, with no missing or duplicate screen names. Short member/trainer/admin backgrounds were extended and sent behind content; representative booking and member-schedule boards were exported for visual review. The pages remain low fidelity, use fictional demo content, and omit icons and prototype interactions. Penpot is the approved visual-design tool for Issue #6 under ADR 013.

## Critical journey

Issue #7 has an [[../design/Issue 7 Domain Boundaries and Use Cases|Obsidian design specification]] with ten use cases, twelve-rule traceability, and a transaction protocol with concurrent acceptance scenarios. ADR 008 supersedes ADR 007's split capacity ownership: Booking owns `BookableSession` capacity/cutoff/participation and Scheduling owns `SessionSlot` calendar definition. The revised artifact passes the DDD skill checklists for design, with a documented local multi-aggregate exception for immediate overlap prevention. The member-profile authorization wording and in-app waiver API gap were corrected. Executable schema and PostgreSQL race tests remain downstream evidence.

Issue #8 has a revised [physical schema and migration plan](../../../docs/database/physical-schema-plan.md). ADR 009 maps the conceptual `ClassSession` to one physical row while Scheduling and Booking keep separate domain views. The plan now specifies credential/JWT persistence, PostgreSQL types and constraints, lock order, and synchronized race-test obligations. ADR 010 adds FIFO promotion when an administrator increases capacity before cutoff.

The [first review](../../../docs/database/physical-schema-review.md) found four high and four medium gaps; the [second review](../../../docs/database/physical-schema-second-review.md) records their design resolution and the newly closed capacity-increase fairness gap. The implementation foundation now has a valid empty Prisma schema and verified local PostgreSQL connection, but no domain model, committed migration, or PostgreSQL test. Issue #8 stays open.

Issue #9 now has a [threat model and access-control specification](../../../docs/security/threat-model-and-access-control.md) and ADR 012. It fixes the design choices for Argon2id password hashing, generic and rate-limited credentials login, JWT lifespan and invalidation, CSRF defenses, server-side authorization, and the demo-only recovery boundary. This provides Issue #8's required identity behavior; it does not implement authentication or clear the remaining design gates.

An [independent third review](../../../docs/database/physical-schema-third-review.md) found that cancellation could wait past cutoff while locking a promotion candidate. ADR 011 now requires a fresh cutoff check after each candidate lock and rollback on expiry. The review also aligned the older Issue #7 protocol with historical-row edit freeze and ADR 010, and defines an operational error for a free seat coexisting with a waitlist. The corrected plan still needs executable proof.

Visitor discovers the club, uses primary Join Now to choose a fictional plan or secondary My Account as an existing member, enters the separate member workspace, books an available session or joins a waitlist, reviews the result, and cancels when permitted.

## Key constraints

- No real gym, customer, member, payment, or production data
- No microservices for the MVP
- Server-side authorization for protected operations
- Transactional enforcement of capacity and waitlist promotion
- Public demo and repository claims must be verifiable

## Connections

- [[../../CRITICAL_FACTS]]
- [[../tasks/Sprint 0]]
- [[../concepts/Modular Monolith]]
- [[../concepts/Database Source of Truth]]
- [[../decisions/Decision Index]]
- [Product requirements](../../../docs/product-requirements.md)
- [Brand foundation](../../../docs/brand/brand-foundation.md)
- [Brand definition guide](../../../docs/brand/brand-definition-guide.md)
- [Visual territories](../../../docs/brand/visual-territories.md)
- [Logo system](../../../docs/brand/logo-system.md)
- [Color and type system](../../../docs/brand/color-and-type-system.md)
