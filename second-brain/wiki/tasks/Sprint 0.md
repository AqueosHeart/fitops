---
type: sprint
project: FitOps
sprint: Sprint 0
status: active
updated: 2026-09-21
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
- [x] Establish draw.io as the editable UX source of truth and align all 29 routes and anchors across draw.io, Mermaid, and the English-only Figma generator
- [x] Decide and document separate public discovery, fictional membership Join, and protected workspace shells (ADR 004)
- [x] Add a repository UX synchronization validation for public, legal, cookie, 404, authentication, and protected-route coverage
- [x] Correct the native draw.io flow dead ends and contradiction findings before updating its derived Mermaid and Figma artifacts
- [x] Define the public-header access hierarchy: secondary `My Account`, primary `Join Now`, plan-gated fictional registration, and separate footer/system routes (ADR 006)
- [x] Reduce Page 01 connector density so the editable sitemap remains legible and defers detailed behavior to Pages 02 through 07
- [x] Separate the 26-URL `00 Sitemap` from `01 Route & Access Architecture`, clarify UI/system states and enrollment steps, and refresh both Mermaid/SVG review exports
- [ ] Review and approve the corrected Mermaid and draw.io flows
- [x] Expand the local plugin to separate desktop/mobile screens for all 26 routes plus 404, with 163 scenarios per device, complete content sections, and checked prototype links
- [x] Split generator output into 27 route pages, add existing-output migration, and reproduce/fix invalid native NAVIGATE destinations in the stricter regression test
- [ ] Produce and visually approve the native Figma desktop/mobile wireframes required by Issue #6
  - The plugin now defines 26 page routes plus a separate 404 fallback, each with full desktop (1440 px) and mobile (390 px) sections. It generates 163 scenarios per device across 27 separate versioned Figma route pages. Desktop/mobile scenario frames are direct children of their page. Only different-frame, same-page transitions receive NAVIGATE reactions; cross-page destinations are labeled and reached through the plugin page chooser. The earlier combined-page run failed native reaction validation; the stricter local regression tests now pass, but native rerun and visual QA remain pending.

## Connections

- [[../projects/FitOps]]
- [[../concepts/Software Development Life Cycle]]
- [[../../boards/FitOps Delivery]]
