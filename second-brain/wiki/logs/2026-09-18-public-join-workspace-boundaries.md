---
type: session-summary
project: FitOps
date: 2026-09-18
---

# Public Join and Workspace Boundaries

## User goal

Prevent the marketing site, sign-in, scheduling, and member management from appearing as one mixed navigation experience. Keep the draw.io diagram synchronized before derived Mermaid and Figma artifacts.

## Decision

ADR 004 separates three shells: public discovery, `/join`, and protected workspaces. The public header exposes `Join now` only. Join offers new visitors fictional plan selection and registration, plus an `Already a member? Sign in` path. No payment, card, billing, invoice, or real subscription is part of the portfolio demo.

## Changes and evidence

- Updated the native seven-page draw.io source before the Mermaid sitemap, review hub, and Figma generator.
- Member workspace routes are `/app`, `/app/schedule`, `/app/bookings`, and `/app/profile/security`; trainer and administrator routes remain separate.
- Added conceptual `selectedPlanCode` and plan-selection timestamp to `MemberProfile` solely for fictional demo enrollment.
- Documented validated internal `returnTo` handling and the future payment-provider decision gate.
- Rebuilt `scripts/figma-plugin/code.js` and passed `node scripts/validate-ux-sync.mjs` for 29 mapped destinations.

## Unresolved / next safe action

Run the local Figma plugin to create a new versioned wireframe page, then visually review the Landing, Join, and Member Workspace frames. Do not claim Figma synchronization is visually complete until that review succeeds. Mermaid SVG regeneration was attempted, but the local Puppeteer browser process could not launch; regenerate `sitemap.svg` and `user-flow-booking.svg` in a working renderer before treating their previews as current.

## Follow-up refinement

ADR 005 separates Public Schedule from Landing, adds direct Member Portal Login at `/portal/login`, and makes `/app` the member dashboard. The follow-up Figma review must verify these four distinct modules: Landing, Public Schedule, Member Portal, and Member Workspace.

## Flow-review audit

A supplied review was checked directly against the editable draw.io XML. Its duplicate `e-nav-contact` finding was valid and has been corrected; all seven diagram pages now have unique IDs and the XML parses. The audit also confirmed unresolved retry, dismissal, and return paths across the booking, waitlist, cancellation, trainer, administrator, and authentication diagrams, plus a sitemap source-versus-Mermaid role-routing mismatch. These are review findings, not completed scope: the next safe action is a draw.io-first UX correction pass, then regeneration of derived Mermaid and Figma artifacts.

## Native correction completed

The approved correction pass changed the native draw.io file before every derivative. It added explicit post-auth role routing, `/join` fictional-plan selection, waiver dismissal, in-place re-authentication and request replay, recoverable booking/waitlist/admin retries, return actions for blocked and staff states, promotion visibility through an in-app dashboard badge, and registration/login recovery loops. Mermaid and wireframe-generator text now reflect those behaviors. Payments, refunds, admin session cancellation/deletion, and real-time notifications remain outside the MVP. Static XML, ID-uniqueness, route-sync, and generator checks are required next; visual Figma execution remains pending.
