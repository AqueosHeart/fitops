---
type: sprint
project: FitOps
sprint: Sprint 5
status: active
updated: 2026-10-07
---

# Sprint 5 Member Booking Product Slice

## Goal

Deliver the member-facing Practice Athletic Club journey on the verified API: public discovery, schedule, fictional enrollment, portal login, and member bookings.

## Active work

- [ ] Issue #11: accurate public discovery and session availability.
- [ ] Issue #11: plan selection, registration/login, protected member workspace, and return paths.
- [ ] Issue #11: waiver, booking/waitlist, cancellation, errors, and server-authoritative outcomes.
- [ ] Issue #11: desktop/mobile accessibility and end-to-end verification against approved flows.

## Implementation checkpoint (2026-10-07)

- Branch `codex/fitops-issue-11-member-slice` was committed as `262c337` and pushed in [PR #16](https://github.com/AqueosHeart/fitops/pull/16). GitHub Project status is In Review; no Actions checks are configured. Issue #11 remains open pending review and merge.
- Implemented locally: public landing/programs/pricing/schedule/session detail; fictional plan selection and registration; portal login; server-guarded member dashboard, reservation-aware schedule, bookings, profile/security/sign-out; booking and waitlist actions; accessible cancellation confirmation dialog; waiver and legal/support pages; client API error mapping.
- Additive API response: `/api/v1/me/bookings` exposes the configured `cancellationCutoffAt`; API documentation and integration assertion were updated.
- Fresh fictional seed includes a future available class and a full class with an ordered waitlist. Database verification checks both. A scratch DB accepted all six migrations, fresh seed and `db:verify`, then a second seed/verify cycle with counts stable. The existing local DB gained matching future fixtures while preserving its original past session and participation rows.
- A synthetic `@example.test` member was registered and signed out after testing: booked the open session, joined the full session at position 3, cancelled the booking, left the waitlist, and verified both reservations disappeared. Profile/consent, mobile schedule/profile at 390×844, cancellation dialog Escape/focus return, and protected-route behavior after sign-out were also checked. The fake account remains as local fictional data with no active reservations.
- Verified so far: API contract (7 tests), Prisma validation, TypeScript, lint, production build (29 routes), `db:verify`, fresh/idempotent scratch seed, and browser flow checks including explicit portal login. `db:verify` checks that the required fictional upcoming-available and full-with-waitlist fixtures exist; local account and reservation totals may change during browser testing.

## Remaining acceptance gates

- PR #16 is open for implementation review. No automated GitHub checks are configured; local verification is recorded above. Keep Issue #11 In Review until review feedback is resolved and the PR is merged.
- Browser-visible failure copy and exhaustive accessibility review remain future quality work; keep this separate from Issue #11 unless acceptance requires it.
- A browser-created account and active waitlist record exist in the local database beyond the baseline seed fixtures. Their fictional status is unconfirmed; do not delete/reset or include identifiers in notes until the user confirms.
- Keep Issue #11 open until implementation review and all acceptance criteria are reflected in verified project evidence.
- Update Issue #11 evidence only after acceptance; keep it In Review until review feedback is resolved and PR #16 is merged, then verify the Done transition.

## Verified dependencies

- [x] Issue #10 merged and closed; `FitOps Delivery` records Done.
- [x] Issue #6 wireframe/flow evidence and Issue #9 identity-security specification exist.

## Non-goals

No payments, real enrollment, health data, production data, or client-side authorization.
