# ADR 004 Separate public discovery, fictional membership join, and protected workspaces

## Status

Accepted

## Context

The earlier wireframes let a marketing-site header, demo sign-in, schedule booking, and member-management screens appear to belong to one navigation model. That obscures whether the visitor is learning about the club, becoming a member, or operating an authenticated account. It also risks implying a real checkout even though version one explicitly excludes payments and subscriptions.

## Decision

- Use three experience boundaries:
  - **Public discovery:** marketing, programs, public schedule, pricing, facilities, contact, and legal routes. The header exposes `Join now`, not a global Sign In action.
  - **Membership join:** `/join` presents a new visitor with fictional plan selection and a transparent no-payment disclosure. It also exposes `Already a member? Sign in`.
  - **Protected workspaces:** members use `/app`, `/app/schedule`, `/app/bookings`, and `/app/profile/security`; trainers and administrators use their own protected route groups and shells.
- An anonymous booking action preserves a validated internal `returnTo` path and routes to `/join`. A new demo member registers after selecting a fictional plan; an existing member signs in. Both return to the member workspace or the preserved internal intent.
- The membership module may record `selectedPlanCode` only as fictional demo-enrollment data. It must not create payment instruments, charges, invoices, payment-provider calls, or renewal behavior.
- Pricing and Join copy must say that no payment or credit-card information is collected in the portfolio demo.
- `/login` remains reachable through Join, protected-route redirects, and direct URLs. It is intentionally absent from the public global navigation.

## Consequences

- Marketing-page navigation remains focused on discovery and conversion to Join.
- The member booking interface has a dedicated application shell, avoiding the mixed navigation shown in the original booking wireframe.
- Authentication, redirect validation, and role routing remain server-side responsibilities. UI visibility does not grant access.
- A real commerce provider, subscriptions, and billing would require a later requirements revision, threat model, data model, API contract, provider decision, and a new ADR.

## Supersedes

This ADR supersedes the public-entry and sign-in portions of the original Sprint 0 UX plan. It does not supersede ADR 003: draw.io remains the editable UX source of truth and was updated before the derived Mermaid and Figma artifacts.
