# FitOps UX and User Flow Specification

## Experience principle

The experience must make the next action obvious, expose current product state, and keep authoritative business rules on the server. Visual polish supports the athletic workflow; it does not replace testable behavior.

## Canonical Mermaid artifacts

The standalone Mermaid files in `docs/design/` are the canonical information-architecture and user-flow sources. They are intentionally not duplicated here so that the repository has one editable source for each diagram.

| Artifact | Purpose |
| --- | --- |
| `sitemap.mmd` | Public, member, trainer, and administrator information architecture |
| `user-flow-booking.mmd` | Discovery, authentication, eligibility, booking, waitlist entry, concurrency, and failures |
| `user-flow-waitlist.mmd` | Viewing and leaving a waitlist, including concurrent promotion |
| `user-flow-cancellation.mmd` | Configured cutoff enforcement, cancellation, rollback, and first-eligible FIFO promotion |
| `user-flow-trainer.mmd` | Protected, read-only trainer assignments and attendee counts |
| `user-flow-admin.mmd` | Protected administrator list, create, edit, validation, and participant views |

## Information architecture rules

- Public visitors can understand the fictional gym, programs, trainers, pricing concept, and schedule without signing in.
- The schedule supports date, program, trainer, and availability filters.
- A booking attempt from a session preserves the selected session through demo sign-in.
- Member pages expose confirmed reservations, waitlist position, cancellation, and waitlist removal.
- Trainer pages are protected and read-only in version one.
- Administrator pages are protected and support session listing, creation, editing, and participant inspection.
- QR passes, barcode check-in, production messaging, payments, and real-time transport are not part of version one.

## Cross-flow business rules

1. Only an authenticated user with a member profile and active demo membership may book or join a waitlist.
2. Trainer and administrator identities cannot use member actions unless they also have a member profile.
3. Booking and waitlist requests recheck session status and the session's configured cutoff on the server.
4. A member can have at most one active booking or one waiting entry for a session.
5. Confirmed bookings cannot overlap.
6. Capacity is rechecked inside the booking transaction; the interface never guarantees a spot from stale availability.
7. Cancelling a booking does not change maximum capacity. It either increases availability or transfers the released spot to the first eligible waiting member.
8. Waitlist promotion is FIFO among eligible entries. Ineligible entries are resolved according to the agreed status rule and the search continues within the same transaction.
9. Expected domain errors use stable error codes. Unexpected failures preserve context, show a request identifier, and offer a safe retry.
10. Administrative UI does not bypass scheduling, capacity, authorization, or booking invariants.

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
| Public discovery and filtering | Sitemap; booking flow |
| Demo authentication with preserved intent | Sitemap; booking flow |
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

## Wireframe gate

Low-fidelity desktop and mobile wireframes may begin only after these Mermaid artifacts are reviewed. Wireframes must cover the member booking, full-session waitlist, waitlist removal, cancellation, and failure paths without adding functionality outside the product requirements.
