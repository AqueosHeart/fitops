# FitOps UX and User Flow Specification

## Experience principle

The experience must make the next action obvious, expose current product state, and keep authoritative business rules on the server. Visual polish supports the athletic workflow; it does not replace testable behavior.

## Canonical UX-flow artifact and derived views

`second-brain/wiki/design/FitOps User Flows.drawio` is the editable, canonical UX information architecture and flow artifact. Its nine pages are updated first for every navigation, screen, or flow change. The Mermaid files in `docs/design/` are version-controlled review exports, and the Figma wireframes are a derived design view generated through `scripts/figma-plugin/`; neither may introduce a route, screen, or state absent from the draw.io file.

| Artifact | Purpose |
| --- | --- |
| `sitemap.mmd` | Page-only hierarchy from draw.io 00 Sitemap: 26 existing URLs, no UI states or auth-flow steps |
| `route-access-architecture.mmd` | Route/access context from draw.io Page 01, including anchors, system fallback, UI states, and enrollment steps |
| `user-flow-booking.mmd` | Discovery, authentication, eligibility, booking, waitlist entry, concurrency, and failures |
| `user-flow-waitlist.mmd` | Viewing and leaving a waitlist, including concurrent promotion |
| `user-flow-cancellation.mmd` | Configured cutoff enforcement, cancellation, rollback, and first-eligible FIFO promotion |
| `user-flow-trainer.mmd` | Protected, read-only trainer assignments and attendee counts |
| `user-flow-admin.mmd` | Protected administrator list, create, edit, validation, and participant views |

## Diagram separation

The native file has nine pages: `00 Sitemap` contains 26 page URLs only; `01 Route & Access Architecture` preserves route/access context, explicitly typed UI/system states, and enrollment steps; Pages 02 through 07 retain the detailed flows; Page 08 specifies route-by-route wireframe sections and scenarios. Landing anchors and the `/404` fallback belong to the architecture view, not the page-only sitemap. No routes or product capabilities were added.

Lines in the sitemap represent information hierarchy, not permission grants or a mandatory click sequence. Group headings are not routes. `/app/bookings` contains confirmed and waiting sections; neither has a separate URL. `/admin/sessions/:id/edit` and `/admin/sessions/:id/participants` exist, but no standalone `/admin/sessions/:id` page is defined. `:id` denotes a session identifier.

## Information architecture rules

- Public visitors can understand the fictional gym, programs, trainers, pricing concept, and schedule without signing in. The public header offers secondary `My Account` access for existing members and primary `Join Now` conversion; it never uses a generic global `Sign In` action.
- `/join` is a membership decision page: a new visitor selects a fictional plan and registers a demo member profile, while an existing member continues to the Member Portal at `/portal/login`. It explicitly states that no payment or card information is collected.
- The public schedule supports date, program, trainer, and availability filters. An anonymous booking attempt preserves the selected session as `returnTo` and redirects to `/join`.
- The member workspace is a separate protected shell rooted at the dashboard `/app`, with `/app/schedule`, `/app/bookings`, and `/app/profile/security`.
- Member pages expose confirmed reservations, waitlist position, cancellation, waitlist removal, membership status, and selected fictional plan.
- Trainer pages are protected and read-only in version one.
- Administrator pages are protected and support session listing, creation, editing, and participant inspection.
- QR passes, barcode check-in, production messaging, payments, and real-time transport are not part of version one.

## Cross-flow business rules

1. Only an authenticated user with a member profile and active demo membership may book or join a waitlist.
2. A plan selection is a fictional, no-payment demo enrollment. It creates no charge, payment instrument, invoice, or recurring subscription.
3. Trainer and administrator identities cannot use member actions unless they also have a member profile.
4. Booking and waitlist requests recheck session status and the session's configured cutoff on the server.
5. A member can have at most one active booking or one waiting entry for a session.
6. Confirmed bookings cannot overlap.
7. Capacity is rechecked inside the booking transaction; the interface never guarantees a spot from stale availability.
8. Cancelling a booking does not change maximum capacity. It either increases availability or transfers the released spot to the first eligible waiting member.
9. Waitlist promotion is FIFO among eligible entries. Ineligible entries are resolved according to the agreed status rule and the search continues within the same transaction.
10. Expected domain errors use stable error codes. Unexpected failures preserve context, show a request identifier, and offer a safe retry.
11. Administrative UI does not bypass scheduling, capacity, authorization, or booking invariants.
12. Every blocking state in the mapped flows provides a bounded recovery action: retry the preserved request, return to the relevant list or schedule, re-authenticate in place, or move to the permitted role experience. This does not add payments, refunds, session deletion, or real-time messaging to MVP scope.

## Promotion eligibility represented in the flow

Until a more detailed requirements revision supersedes it, a waiting entry is eligible for promotion when:

- the member still has an active membership;
- the member does not already have a confirmed booking for that session;
- the session does not overlap another confirmed booking held by the member; and
- the session remains bookable under its configured cutoff.

The cancellation diagram makes this evaluation and skip loop explicit. Implementation must enforce it transactionally.

## Required interface states

Every interactive page or overlay must account for:

- **Loading:** stable skeletons matching the eventual layout.
- **Empty:** useful guidance for no sessions, assignments, bookings, or waitlist entries.
- **Ready:** complete data and available actions.
- **Validation error:** field-level guidance without losing entered values.
- **Domain conflict:** duplicate, overlap, cutoff, capacity, or concurrent-state feedback using stable error codes.
- **Authorization failure:** no protected data is exposed before redirect or access-denied feedback.
- **Server failure:** request identifier, preserved context, and a safe retry action.
- **Success:** explicit confirmation followed by refreshed authoritative state.
- **Responsive layout:** usable at a 390px mobile viewport and on desktop.
- **Accessible interaction:** keyboard operation, visible focus, labels, announced status changes, and text in addition to color.

## Flow-to-requirement traceability

| Requirement | Mermaid evidence |
| --- | --- |
| Public discovery, Join boundary, and filtering | Sitemap; booking flow |
| Fictional plan selection and existing-member sign-in with preserved intent | Sitemap; booking flow |
| Active membership and member-profile gating | Booking flow |
| Duplicate, overlap, cutoff, and capacity enforcement | Booking flow |
| Deterministic waitlist join and position | Booking flow; waitlist flow |
| Waitlist removal and concurrent promotion handling | Waitlist flow |
| Transactional cancellation and promotion | Cancellation flow |
| First eligible FIFO promotion | Cancellation flow |
| Trainer assigned-session visibility | Sitemap; trainer flow |
| Administrator create, edit, and participants | Sitemap; administrator flow |
| Server-side authorization | Booking, trainer, and administrator flows |
| Loading, empty, conflict, failure, and success states | All role-specific flows and required-state inventory |

## Complete wireframe generator

The plugin now defines 26 page routes plus a separate 404 fallback, each with full desktop (1440 px) and mobile (390 px) sections. It generates 163 scenarios per device across 27 separate versioned Figma route pages. Desktop/mobile scenario frames are direct children of their page. Only different-frame, same-page transitions receive NAVIGATE reactions; cross-page destinations are labeled and reached through the plugin page chooser. The earlier combined-page run failed native reaction validation; the stricter local regression tests now pass, but native rerun and visual QA remain pending.

The user authorized the complete plugin expansion on 2026-09-21; this does not mark the flows approved or Issue #6 done. [Wireframe coverage](design/wireframe-coverage.md) is the derived inventory. Long pages use content-driven height; mobile tables become record cards. Forms use preset fictional examples, and recovery does not send email. No payment, subscription, trainer editing, or session deletion has been added.

## Wireframe gate

Low-fidelity desktop and mobile wireframes may begin only after the draw.io flow pages and derived Mermaid exports are reviewed. Wireframes must cover the member booking, full-session waitlist, waitlist removal, cancellation, and failure paths without adding functionality outside the product requirements.

## UX synchronization workflow

For every add, delete, or modification:

1. Update and review `FitOps User Flows.drawio` first.
2. Update the affected Mermaid review export(s) and run `node scripts/validate-ux-sync.mjs`.
3. Rebuild the Figma plugin when its source changed, then run **Practice Athletic Club Master Toolkit** in Figma to create a new versioned wireframe page.
4. Visually inspect the generated desktop and Android frames before saying the Figma state is synchronized.

`Services`, `Facilities`, and `Contact` are public in-page landing destinations (`/#services`, `/#facilities`, and `/#contact`), not new protected product capabilities. `About Us`, Cookie Preferences, and Not Found are explicit public routes (`/about`, `/cookie-settings`, and `/404`). Pricing, Terms of Service, Privacy Policy, and the Liability Waiver are also represented as distinct public destinations. `/join` is the only public membership-entry CTA. The public header exposes `/portal/login` as a secondary `My Account` utility for existing members and protected redirects, while `Join Now` remains visually and semantically primary.

`node scripts/validate-ux-sync.mjs` checks the mapped public, legal, cookie, Join, authentication, member-workspace, trainer, and administrator destinations across draw.io, the Mermaid route/access architecture, and the English-only Figma content definitions. It separately verifies the 26 page URLs in the draw.io and Mermaid sitemap, the 404 fallback, and scenario counts in draw.io Page 08. It also rejects a Landing-header Sign In action.
