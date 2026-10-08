---
type: sprint
project: FitOps
sprint: Sprint 5
status: complete
updated: 2026-10-08
---

# Sprint 5 Member Booking Product Slice

## Goal

Deliver the member-facing Practice Athletic Club journey on the verified API: public discovery, schedule, fictional enrollment, portal login, and member bookings.

## Delivered work

- [x] Issue #11: accurate public discovery and session availability.
- [x] Issue #11: plan selection, registration/login, protected member workspace, and return paths.
- [x] Issue #11: waiver, booking/waitlist, cancellation, errors, and server-authoritative outcomes.
- [x] Issue #11: desktop/mobile accessibility and end-to-end verification against approved flows.

## Sprint status (2026-10-08)

The Sprint 5 goal is delivered: Issue #11 is Closed / Done and assigned Sprint 5 in GitHub Projects. Issue #12 is separately Closed / Done in Sprint 6. Issue #13 is Open / In Progress / Sprint 7; its acceptance checks are not complete.

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

- LAN deploy follow-up (2026-10-08): deployed isolated FitOps on the authorized LAN Linux host at port 3001, separate from AARC. Six migrations, single fictional seed, DB verification, LAN HTTP access, anonymous admin redirect, and a server-side authenticated admin route check passed. AARC remains on port 3000. The deployed app remains on Next.js 16.3.6 and private LAN only; local quality work updates the repository to 16.3.8 but has not deployed it. Issues #13/#14 release gates remain open.
- Prisma Studio follow-up (2026-10-08): on-demand Studio profile and loopback proxy deployed; host port `127.0.0.1:5555` is reachable through a local SSH tunnel only. Studio UI and JavaScript asset returned 200 from the Windows workstation. Studio can directly mutate tables and bypass app rules; close its service/tunnel when not in use. ADR 017 records the decision.
- Admin acceptance and review follow-up (2026-10-08): signed-in browser verified overview, sessions/filter and empty result, fictional roster/FIFO ordering, form rendering, staff `/portal/login` return, and 390 px responsive layout after `58f2760`. On an isolated disposable PostgreSQL instance, browser session creation passed; capacity increase from 2 to 3 promoted FIFO waiter Casey Morgan while Taylor Chen remained waiting; member and trainer sessions both saw the admin-only denial at `/admin`. API-contract tests passed 7/7 against PostgreSQL. A focused review found no blocking defect. PR #17 merged at `08fbdd894c27436de2a52d8efe5c722c2e43dc56`; Issue #12 is Closed / Done / Sprint 6. Temporary acceptance resources were removed, and no deployed demo DB rows were changed.

- Historical UX follow-up (2026-10-07, superseded): the admin header and role-aware `/portal/login` redirects were implemented and later covered by Issue #12's authenticated acceptance. API-contract, lint, TypeScript, production build, and UX structural validation passed; route-flow previews were regenerated and inspected. The local Docker outage at that time was an environment-specific limitation and did not block the later disposable-PostgreSQL acceptance.

- Local portability follow-up (2026-10-07): added `compose.yaml` for loopback-only PostgreSQL 16 with persistent volume, `docs/local-development.md` for a fresh Windows checkout, and optional private seed-password support so the fictional seeded admin can sign in. Migrations and seed reconstruct a new local dataset; no live DB dump, credentials, session tokens, or local user activity are committed. This is developer setup only, not Issue #14 production-release evidence.

- Historical checkpoint (2026-10-07, superseded): branch `codex/fitops-issue-12-admin-operations` was started from PR #16's member branch, rebased onto `main`, then completed and merged as PR #17 on 2026-10-08.
- Implemented locally: protected admin overview and session manager, filtered listing, create/edit forms, occupancy/history-aware controls, fictional participant and ordered waitlist views, role-guarded program/trainer options, and role-aware login return paths. API/auth/constraint/race tests (24), lint, TypeScript, Prisma validation, read-only `db:verify`, and optimized production build (34 routes) pass. HTTP checks confirm unauthenticated admin routes preserve their return path to portal login.
- Historical test-account checkpoint: the fictional account used for the completed Issue #12 acceptance already had ADMINISTRATOR access. A separate inactive synthetic account was restored to MEMBER; the active account's profile and participation rows were preserved. No credentials or contact details are recorded here.
- Issue #12 acceptance is complete and closed. Issue #13 is now In Progress in Sprint 7; see [the Issue #13 evidence report](../../../docs/quality/issue-13-evidence.md) for current verified and pending evidence.

## Verified dependencies

- [x] Issue #10 merged and closed; `FitOps Delivery` records Done.
- [x] Issue #6 wireframe/flow evidence and Issue #9 identity-security specification exist.

## Non-goals

No payments, real enrollment, health data, production data, or client-side authorization.
