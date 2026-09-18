---
type: project
status: active
phase: requirements
sprint: Sprint 0
updated: 2026-09-18
---

# FitOps

FitOps is the repository and internal project codename. The public-facing fictional gym is **Practice Athletic Club**, which helps members discover and reserve classes while giving staff a dependable way to manage schedules, capacity, cancellations, and waitlists.

## Current outcome

The planning foundation exists. `Practice Athletic Club`, Quiet Strength, the Mona Sans lime-bar wordmark, and its palette/type materials are working brand inputs, not a defined or approved brand. The Mermaid sitemap and role-specific flows have been corrected against the product requirements and expanded into a seven-page draw.io companion covering terms, liability waiver, privacy, security guardrails, and onboarding. The existing Figma toolkit at `scripts/figma-plugin/` now includes a third action that translates those flows into nine module pages, with 15 desktop states cascading beside 13 Android 390 px states. It deliberately creates no prototype reactions. The integrated plugin has passed static validation, but the wireframe action has not yet been run or visually verified in Figma, so Sprint 1 wireframes remain incomplete. Implementation must not begin until the Sprint 0 requirements review and Sprint 1 low-fidelity design gate are complete.

## Critical journey

Visitor discovers FitOps, browses the schedule, signs into a fictional demo account, books an available session or joins a waitlist, reviews the result, and cancels when permitted.

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
