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

- Branch `codex/fitops-issue-11-member-slice` was committed as `262c337` and pushed in [PR #16](https://github.com/AqueosHeart/fitops/pull/16), merged to `main` at `0248913b6867708a6f5bf8e1dd44a74ac32ec313` on 2026-10-07. Issue #11 is Closed and GitHub Project status is Done; no Actions checks are configured.
- Implemented locally: public landing/programs/pricing/schedule/session detail; fictional plan selection and registration; portal login; server-guarded member dashboard, reservation-aware schedule, bookings, profile/security/sign-out; booking and waitlist actions; accessible cancellation confirmation dialog; waiver and legal/support pages; client API error mapping.
- Additive API response: `/api/v1/me/bookings` exposes the configured `cancellationCutoffAt`; API documentation and integration assertion were updated.
- Fresh fictional seed includes a future available class and a full class with an ordered waitlist. Database verification checks both. A scratch DB accepted all six migrations, fresh seed and `db:verify`, then a second seed/verify cycle with counts stable. The existing local DB gained matching future fixtures while preserving its original past session and participation rows.
- A synthetic `@example.test` member was registered and signed out after testing: booked the open session, joined the full session at position 3, cancelled the booking, left the waitlist, and verified both reservations disappeared. Profile/consent, mobile schedule/profile at 390×844, cancellation dialog Escape/focus return, and protected-route behavior after sign-out were also checked. The fake account remains as local fictional data with no active reservations.
- Verified so far: API contract (7 tests), Prisma validation, TypeScript, lint, production build (29 routes), `db:verify`, fresh/idempotent scratch seed, and browser flow checks including explicit portal login. `db:verify` checks that the required fictional upcoming-available and full-with-waitlist fixtures exist; local account and reservation totals may change during browser testing.

## Remaining acceptance gates

- PR #16 is merged and Issue #11 is Closed/Done. No automated GitHub checks are configured; local and browser verification is recorded above.
- Browser-visible failure copy and exhaustive accessibility review remain future quality work; keep this separate from Issue #11 unless acceptance requires it.
- A browser-created fictional account and active waitlist record exist in the local database beyond the baseline seed fixtures; the user confirmed the account is fictional. No address or identifier is stored in notes. Do not delete/reset demo state without reviewing impact.
- Issue #11 acceptance checkboxes and verification evidence were updated after merge; Issue #11 remains Done unless new defects are found.

## Downstream stacked preparation (not Sprint 5 completion)

- UX follow-up (2026-10-07): draw.io and Mermaid route/admin flows specify a single admin header (Overview, Sessions, My Account, Public site) and an existing valid member session routed from My Account to `/app`. Implementation consolidates the header and adds server-side role-aware `/portal/login` redirects. API-contract (7/7), ESLint, TypeScript, production build, UX structural validator, and anonymous HTTP redirects pass; authenticated browser acceptance is outstanding. Test setup now identifies concurrent fixture users by label instead of relying on insertion order. The fictional account requested for admin access was already ADMINISTRATOR; no role or account data was changed. Both affected SVG previews were regenerated with Mermaid CLI 12.0.0 and inspected via local Edge. On 2026-10-07 the FitOps browser attempt used port 3001 because AARC occupies 3000; its admin shell renders but database requests fail with `ECONNREFUSED` while Docker's Linux engine is unreachable. Do not claim authenticated acceptance until Docker/WSL and the local database recover.

- Local portability follow-up (2026-10-07): added `compose.yaml` for loopback-only PostgreSQL 16 with persistent volume, `docs/local-development.md` for a fresh Windows checkout, and optional private seed-password support so the fictional seeded admin can sign in. Migrations and seed reconstruct a new local dataset; no live DB dump, credentials, session tokens, or local user activity are committed. This is developer setup only and does not close Issue #14 deployment scope or the Issue #12 browser gate.

- On 2026-10-07, branch `codex/fitops-issue-12-admin-operations` was started from PR #16's member branch and rebased onto `main` after PR #16 merged. Draft PR #17 contains the incomplete administrator UI slice and is not merged; Issue #12 remains Backlog / Sprint 6.
- Implemented locally: protected admin overview and session manager, filtered listing, create/edit forms, occupancy/history-aware controls, fictional participant and ordered waitlist views, role-guarded program/trainer options, and role-aware login return paths. API/auth/constraint/race tests (24), lint, TypeScript, Prisma validation, read-only `db:verify`, and optimized production build (34 routes) pass. HTTP checks confirm unauthenticated admin routes preserve their return path to portal login.
- For browser acceptance, the user authorized promoting the fictional member account tied to the current browser sessions from MEMBER to ADMINISTRATOR. A first account mismatch was corrected: the unrelated inactive test account was restored to MEMBER, and the current account's four sessions, member profile, booking, and waitlist entry were preserved. Refresh `/admin` in the existing session; do not expose credentials in chat.
- Remaining before Issue #12 acceptance: run authenticated browser acceptance for administrator overview, create, safe edits/capacity promotion, participant/waitlist view, plus member/trainer denial; address findings; run final full checks; then convert PR #17 from Draft after review. Keep #12 Backlog until GitHub confirms the proper Sprint 6 start.

## Verified dependencies

- [x] Issue #10 merged and closed; `FitOps Delivery` records Done.
- [x] Issue #6 wireframe/flow evidence and Issue #9 identity-security specification exist.

## Non-goals

No payments, real enrollment, health data, production data, or client-side authorization.
