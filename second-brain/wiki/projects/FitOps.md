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

The planning foundation exists. `Practice Athletic Club`, Quiet Strength, the Mona Sans lime-bar wordmark, and its palette/type materials are working brand inputs, not a defined or approved brand. `wiki/design/FitOps User Flows.drawio` is the editable source of truth for UX navigation and flows; Mermaid and Figma are derived only after it changes. ADRs 004 and 005 separate public discovery, fictional membership Join, the direct Member Portal (`/portal/login`), and the protected member dashboard (`/app`). The native correction pass made recovery paths, role routing, fictional-plan selection, and in-app promotion visibility explicit without expanding MVP payment, refund, deletion, or real-time-notification scope. Landing and Public Schedule are distinct wireframe modules. No payment, card, or real subscription is collected. The sitemap and generator cover 29 routes or anchors. The English-only Figma toolkit creates eleven module pages with 19 desktop and 17 Android 390 px states. Static sync passed, but Figma execution and visual QA remain pending; implementation must not begin until the Sprint 0 review and Sprint 1 low-fidelity design gate are complete.

## Critical journey

Visitor discovers the club, uses Join to choose a fictional plan or sign in as an existing member, enters the separate member workspace, books an available session or joins a waitlist, reviews the result, and cancels when permitted.

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
