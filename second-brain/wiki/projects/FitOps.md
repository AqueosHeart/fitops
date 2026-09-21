---
type: project
status: active
phase: requirements
sprint: Sprint 0
updated: 2026-09-21
---

# FitOps

FitOps is the repository and internal project codename. The public-facing fictional gym is **Practice Athletic Club**, which helps members discover and reserve classes while giving staff a dependable way to manage schedules, capacity, cancellations, and waitlists.

## Current outcome

The planning foundation exists. `Practice Athletic Club`, Quiet Strength, the Mona Sans lime-bar wordmark, and its palette/type materials are working brand inputs, not a defined or approved brand. `wiki/design/FitOps User Flows.drawio` is the editable source of truth for UX navigation and flows; Mermaid and Figma are derived only after it changes. ADRs 004 through 006 separate public discovery, fictional membership Join, secondary existing-member account access, and the protected member dashboard (`/app`). The native correction passes make recovery paths, role routing, fictional-plan selection, public footer/system destinations, and in-app promotion visibility explicit without expanding MVP payment, refund, deletion, or real-time-notification scope. The native file now has nine pages: `00 Sitemap` contains 26 page URLs only; `01 Route & Access Architecture` preserves route/access context, explicitly typed UI/system states, and enrollment steps; Pages 02 through 07 retain the detailed flows; Page 08 specifies wireframe sections and states. Landing anchors and the `/404` fallback belong to the architecture view, not the page-only sitemap. No routes or product capabilities were added. Landing and Public Schedule are distinct Figma route pages. The public header has a secondary `My Account` utility to `/portal/login` and a primary `Join Now` CTA to `/join`; registration requires a selected fictional plan. No payment, card, or real subscription is collected. Static checks cover 26 page-only sitemap URLs plus the existing 29 route/anchor mappings across the architecture and generator. The plugin now defines 26 page routes plus a separate 404 fallback, each with full desktop (1440 px) and mobile (390 px) sections. It generates 163 scenarios per device across 27 separate versioned Figma route pages. Desktop/mobile scenario frames are direct children of their page. Only different-frame, same-page transitions receive NAVIGATE reactions; cross-page destinations are labeled and reached through the plugin page chooser. The earlier combined-page run failed native reaction validation; the stricter local regression tests now pass, but native rerun and visual QA remain pending. Static sync must pass after each change; executing and visually QAing the versioned Figma pages remains pending because no Figma instance is connected. Implementation must not begin until the Sprint 0 review and Sprint 1 low-fidelity design gate are complete.

## Critical journey

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
