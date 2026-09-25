---
type: sprint
project: FitOps
sprint: Sprint 0
status: active
updated: 2026-09-25
---

# Sprint 0 Product Foundation

## Sprint goal

Agree on the product problem, users, MVP, rules, risks, acceptance criteria, and engineering-tool ownership.

## Completed planning evidence

- [x] Product statement
- [x] Pre-build risk review
- [x] Initial users and MVP scope
- [x] Core booking and waitlist rules
- [x] Initial architecture
- [x] Conceptual data model
- [x] Initial REST contract
- [x] SDLC and sprint plan
- [x] Tool ownership map
- [x] Obsidian-compatible second brain
- [x] Establish the working public name `Practice Athletic Club`
- [x] Document the initial brand foundation and voice boundaries
- [x] Create three Practice Athletic Club visual territories
- [x] Identify visual territory A, Quiet Strength, as a working candidate
- [x] Reject the generic icon-led logo round
- [x] Create and compact-test three typography-first logo directions
- [x] Translate the supplied visual references into an original stacked vector wordmark candidate
- [x] Explore custom lettering and document its limitations as a working-identity candidate
- [x] Create Mona Sans plus lime-marker alternatives
- [x] Create the Mona Sans Display with short lime progress bar working logo candidate
- [x] Define the final accessible color palette and Mona Sans hierarchy after brand strategy is agreed
- [x] Validate the final logo in signage, apparel, social, and booking-context mockups after brand strategy is agreed
- [x] Codify master brand identity guidelines (`docs/brand/brand-identity.md`) and generate Figma presentation slide SVGs (`docs/brand/figma/`)

## Remaining before Sprint 0 review

- [x] Create and verify the public GitHub repository
- [x] Convert approved backlog items into issues (#1 through #9)
- [ ] Connect the repository to the `FitOps Delivery` GitHub Project
- [ ] Create GitHub fields and views
- [ ] Review the Sprint 0 exit gate

## Sprint 1 preparation evidence

- [x] Correct the Mermaid sitemap and split the critical behavior into booking, waitlist, cancellation, trainer, and administrator flows
- [x] Remove out-of-scope QR/check-in behavior and unsupported real-time claims from the Mermaid architecture
- [x] Publish an Obsidian-native user-flow review hub inside the `second-brain` vault
- [x] Create a seven-page native draw.io companion for editable visual review with legal gates (terms, waiver), security checkpoints, and authentication/onboarding lifecycles
- [x] Establish draw.io as the editable UX source of truth and align all 29 routes and anchors across draw.io, Mermaid, and the English-only scenario definitions used for Penpot coverage
- [x] Decide and document separate public discovery, fictional membership Join, and protected workspace shells (ADR 004)
- [x] Add a repository UX synchronization validation for public, legal, cookie, 404, authentication, and protected-route coverage
- [x] Correct the native draw.io flow dead ends and contradiction findings before updating its derived Mermaid and Penpot artifacts
- [x] Define the public-header access hierarchy: secondary `My Account`, primary `Join Now`, plan-gated fictional registration, and separate footer/system routes (ADR 006)
- [x] Reduce Page 01 connector density so the editable sitemap remains legible and defers detailed behavior to Pages 02 through 07
- [x] Separate the 26-URL `00 Sitemap` from `01 Route & Access Architecture`, clarify UI/system states and enrollment steps, and refresh both Mermaid/SVG review exports
- [ ] Review and approve the corrected Mermaid and draw.io flows
- [x] Expand the local plugin to separate desktop/mobile screens for all 26 routes plus 404, with 163 scenarios per device, complete content sections, and checked prototype links
- [x] Group generator output into 20 named review pages, add existing-output migration, and reproduce/fix invalid native NAVIGATE destinations in the stricter regression test
- [x] Add a safe local component-page manager that scans the UI kit and maintains neutral, native FitOps components without mutating the Community template
- [x] Add documented exploratory color/type tokens and a Design Tokens review page to the connected Penpot file; proposed spacing/grid values remain unapproved
- [x] Add a Penpot Lucide icon reference page with a 20-icon product starter set and working usage guidance
- [x] Establish the canonical Penpot wireframe set as 20 review groups with 163 desktop/mobile scenario pairs; visual checks confirm readable light canvases and representative public/admin layouts. The imported boards are static SVG vectors with no icons or prototype reactions.
- [x] Consolidate Penpot into one 20-page wireframe set, remove 12 duplicate older import pages, correct short member/trainer/admin backgrounds, and verify all 326 live desktop/mobile boards against draw.io's 26 page routes, 404 fallback, and scenario definitions. Representative member booking and schedule exports were visually checked; a screen-by-screen visual approval is still pending.
- [x] Establish and review the Penpot desktop/mobile wireframes required by Issue #6
  - GitHub Issue #6 is closed. ADR 013 makes the 20-page Penpot wireframe set its visual-design evidence; no native Figma run is required.
  - Penpot holds the 26 page routes plus 404 as 163 desktop/mobile scenario pairs. draw.io and Mermaid remain the source and validation path for future visual changes.

## Connections

- Issue #7 closed on GitHub in `c8d1262`: [[../design/Issue 7 Domain Boundaries and Use Cases]] covers ten use cases and all twelve MVP rules. ADR 008 resolves the DDD boundary review by giving Booking BookableSession capacity/cutoff/participation ownership and keeping Scheduling responsible for SessionSlot calendar definition. Aggregate, interaction, and context-map artifacts pass the DDD design checklists; implementation and PostgreSQL race tests remain downstream evidence.
- Issue #8's revised [physical schema plan](../../../docs/database/physical-schema-plan.md) uses one `class_sessions` table with separate Scheduling/Booking domain views (ADR 009). It specifies native types, constraints, auth storage, lock order, migration steps, and synchronized PostgreSQL proof. No Prisma schema, migration, or database test exists; Sprint 0 and Sprint 1 design gates still apply.
- The [first schema review](../../../docs/database/physical-schema-review.md) identified four high and four medium findings. The [second review](../../../docs/database/physical-schema-second-review.md) records design resolutions and the ADR 010 capacity-increase FIFO promotion rule. ADR 012 resolves the identity-security design choices; Issue #8 stays open for executable evidence.
- The [independent third review](../../../docs/database/physical-schema-third-review.md) corrected a cancellation cutoff race (ADR 011), stale Issue #7 protocol wording, and the free-seat-plus-waitlist API failure contract. These remain design corrections; Issue #8 is not complete.
- Issue #9 now records the identity security baseline in [ADR 012](../../../docs/adr/012-identity-security-baseline.md) and the [threat model](../../../docs/security/threat-model-and-access-control.md). Prisma/migration/race evidence and the Sprint 0 exit review remain pending.

- [[../projects/FitOps]]
- [[../concepts/Software Development Life Cycle]]
- [[../../boards/FitOps Delivery]]
