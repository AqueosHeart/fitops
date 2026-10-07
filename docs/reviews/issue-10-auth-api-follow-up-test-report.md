# Issue #10 Authentication and API Follow-up Test Report

**Date:** 2026-09-28
**Last updated:** 2026-10-07
**Project:** FitOps / Practice Athletic Club (fictional demo)
**Scope:** Follow-up verification of the current authentication repair loop and the available HTTP-contract proof.
**Verdict:** **The local Issue #10 acceptance matrix now passes. GitHub Issue #10 remains Open because these workspace changes have not been published or reviewed upstream; do not claim the issue is merged or closed.**

## Executive summary

The authentication repair set is working in local integration tests. The latest 2026-10-07 run passed five auth tests, seven API-contract tests, two PostgreSQL-constraint tests, and ten synchronized race tests. The API-contract suite reaches all 17 current `/api/v1` route handlers with real database-backed sessions and fictional data. It verifies the documented booking/waitlist domain outcomes, trainer assignment isolation, administrator references/capacity/FIFO promotion/cutoff handling, limiter thresholds/reset, and before/after state for rejected cross-origin, malformed, oversized, and unknown-field writes. Registration rolls back the created identity, profile, account, and any partial session if Better Auth cannot issue its initial session.

Static checks and a production build passed. No P0 authorization or CSRF regression was observed in the covered paths. This is not a whole-API security certification. The full dependency audit now reports zero vulnerabilities. Per ADR 015, `eslint-config-next` and the vulnerable Next ESLint plugin chain have been removed; direct pinned React, React Hooks, JSX accessibility, TypeScript, and import rules preserve the framework-independent lint coverage, but `@next/next/*` rules are no longer applied. The source return-path validator has a narrow, documented suppression for its intentional ASCII-control rejection regex. Restore the Next plugin only when a compatible release has an audit-clean tree.

## Verification performed

| Check | Command or evidence | Result |
| --- | --- | --- |
| Authentication integration | `npm run test:auth-api` | Pass: 5 tests, 0 failures; includes malformed/unknown/oversized registration, redaction, and session-issuance rollback |
| API route-contract integration | `npm run test:api-contract` | Pass: 7 tests, 0 failures; all 17 current `/api/v1` handlers reached; malformed/oversized/unknown-field login, waiver, create, and PATCH requests rejected with before/after assertions |
| PostgreSQL constraint integration | `npm run test:constraints` | Pass: 2 tests, 0 failures; connectivity preflight succeeded |
| PostgreSQL race integration | `npm run test:race` | Pass: 10 tests, 0 failures |
| Lint | `npm run lint` | Pass |
| Type checking | `npx tsc --noEmit` | Pass |
| Production build | `BETTER_AUTH_SECRET=<ephemeral build-only value> BETTER_AUTH_URL=http://localhost:3000 npm run build` | Pass; Next.js compiled and generated all 14 static pages. An initial attempt without an ephemeral secret failed because local `.env` does not provide a valid build secret; no secret file was modified. |
| Diff whitespace validation | `git diff --check` | Pass; Git emitted only existing LF-to-CRLF warnings |
| Type checking after added closure cases | `npx tsc --noEmit` | Pass |
| Lint after added closure cases | `npm run lint` | Pass |
| Docker/PostgreSQL availability | `docker ps`; `Test-NetConnection 127.0.0.1 -Port 5432` | `fitops-postgres` running; port reachable |
| Diff whitespace validation after added closure cases | `git diff --check` | Pass; Git emitted only existing LF-to-CRLF warnings |
| Atomic login-limit reservation | PostgreSQL `INSERT ... ON CONFLICT ... RETURNING failure_count` in `web/lib/server/auth/login-rate-limit.ts` | Reviewed: decision and increment occur in one database statement |
| Successful trusted-IP reservation release | A trusted forwarded IP reaches its limit, a successful reservation is released, then the next reservation succeeds | Proven by automated test |
| Session invalidation | Session stores `authVersion`; `resolveCurrentUser()` reloads the user and compares it | Proven by automated test |
| Registration redirect contract | `parseReturnTo()` restricts targets to the four approved `/app` routes | Proven for an external URL by automated test |
| Unknown administrator-domain code fallback | Administrator capacity mapping sends an unrecognized result to `unexpectedError()` | Proven by automated test: generic `500 INTERNAL_ERROR` is returned instead of the unrecognized code |
| Trainer assignment isolation | Two trainer profiles with separate assigned sessions | Each trainer sees its own session and not the other's |
| Login limiter | Shared email/IP concurrent reservations, aged-window reset, successful login reset/IP release | Email allows five concurrent reservations; trusted IP allows twenty of twenty-five; successful login clears email failures and releases its IP slot |
| Trainer overlap | Create a session overlapping an existing trainer assignment | PostgreSQL exclusion failure is mapped to `409 TRAINER_OVERLAP`; no session row is created |
| Administrator session edits | PATCH scheduling/capacity fields before participation; then PATCH scheduling fields after active and historical participation | Pre-participation edits persist atomically; post-participation schedule edits return `409 SESSION_HAS_PARTICIPANTS` without state changes; capacity-only updates remain supported |
| Registration/session atomicity | Inject a non-success Better Auth response and a thrown session-creation failure after account/profile creation | Both responses are generic `500`s and leave zero user, profile, credential-account, or session rows |
| Prisma transitive overrides | `npm ls prisma @prisma/config deepmerge-ts mysql2`; `npx prisma validate`; `npx prisma generate` | Prisma remains 7.10.0; `deepmerge-ts` is 8.0.2 and `mysql2` is 3.24.5. Schema validation and client generation both pass |
| Production dependency audit | `npm audit --omit=dev --audit-level=high` | Pass: 0 production vulnerabilities |
| Initial full dependency audit, before ADR 015 | `npm audit --audit-level=high`; `npm ls braces micromatch fast-glob @next/eslint-plugin-next eslint-config-next --all`; `npm explain braces` | Initially five high findings via dev-only `braces@3.0.3`; the lint-config migration below removed this chain and the final audit now reports 0 vulnerabilities |
| Fresh local verification after dependency review | Auth (5), API contract (7), PostgreSQL constraints (2), PostgreSQL races (10), lint, TypeScript, Prisma validate/generate, and production build | Pass: 24 integration tests total; Next.js 16.3.6 production build generated all 14 static pages. The build used process-only ephemeral auth settings; no `.env` file was edited |
| Official lint-config registry check before migration | `npm view eslint-config-next@16.4.0 dependencies --json`; `npm view @next/eslint-plugin-next@16.4.0 dependencies --json`; `npm view braces version` | At review time, config 16.4.0 still depended on plugin 16.4.0 -> `fast-glob@3.3.1`, and published `braces` remained 3.0.3. Updating the config alone did not remediate the alert |
| Lint-config migration | `npm run lint`; `npm ls braces eslint-config-next @next/eslint-plugin-next --all`; see [ADR 015](../adr/015-replace-vulnerable-next-eslint-config.md) | Lint passes with pinned core, TypeScript, React, React Hooks, JSX accessibility, and import rules; vulnerable packages are absent. Next-specific ESLint rules are intentionally unavailable until an audit-clean compatible config can be used |
| Full dependency audit after lint-config migration | `npm audit --audit-level=high` | Pass: 0 vulnerabilities |

## Passed automated scenarios

1. A valid registration returns `201`, sets an HTTP-only cookie, and that cookie authorizes `GET /api/v1/me/membership`.
2. A cross-origin registration request returns `403` and creates no account; consent/plan/redirect and oversized registration rejections also leave no user row.
3. An attacker-controlled request host does not override the configured origin policy.
4. Incrementing a user's `auth_version` makes an already-issued session return `401` on the protected membership endpoint.
5. Registration returns `422` for missing waiver consent, an invalid fictional plan code, and an external `returnTo` value.
6. Public plan, program, session-list, and session-detail routes return their contracts; invalid filters and identifiers are rejected and an unknown session returns `404`.
7. Login restores an approved internal destination, rejects an external destination, and returns the generic credential failure; five-of-six email and twenty-of-twenty-five trusted-IP concurrent limits, aged-window reset, successful-login email clear/IP release, and cross-origin no-counter-change are verified.
8. Member routes reject an anonymous request, reject a cross-origin waiver write, and return valid membership, booking-list, and waiver responses for the owner.
9. A member can book, waitlist, cancel, and leave a waitlist; a different authenticated member receives `403` for each deletion attempt against the owner's resource.
10. Trainer and administrator reads enforce their role boundary. Administrator create, update, participant, validation, and unknown-domain fallback behavior are exercised with a database-backed administrator session.
11. Booking/waitlist behavior verifies seat-available, duplicate booking/waitlist, booking conflict, full/cutoff, invariant-broken state, and no mutation on each rejected outcome; promotion and repeated cancellation/removal remain idempotent.
12. Admin behavior verifies pre-participation program/trainer/time/capacity/cutoff edits, invalid references, invalid intervals, trainer overlap on create and update, below-occupancy rejection, FIFO promotion after expiring an ineligible waiter, cutoff rejection, cross-origin writes, and state preservation. Schedule edits after active or historical participation return `SESSION_HAS_PARTICIPANTS`; capacity remains editable. Trainers cannot read another trainer's assignment.

## Route-level coverage matrix

| Route handler group | Handlers reached | Evidence in the current suite |
| --- | ---: | --- |
| Public catalog and discovery | 4 | Successful plan/program/session responses; invalid session filter and ID; unknown session |
| Authentication and enrollment | 2 | Registration/session cookie, consent/plan/redirect failures, login success/generic failure/redirect failure, atomic limiter |
| Member profile | 3 | Anonymous membership denial, member success, bookings read, same-origin waiver write |
| Booking and waitlist commands | 4 | Anonymous denial, booking/waitlist success, already-waiting domain failure, cancellation and waitlist IDOR denial, owner success |
| Trainer workspace | 1 | Member denial and assigned-trainer success |
| Administrator workspace | 3 | Member denial, administrator read/create/update/participants success, validation failure, unknown-result redaction |
| **Total** | **17** | Every current versioned route handler is imported and invoked |

## Final acceptance review and delivery boundary

- No missing local API acceptance case was identified in the current documented route matrix. Body-parsing endpoints reject invalid JSON, unknown fields, and oversized payloads as applicable; bodyless booking/waitlist/deletion commands retain their documented contract. Unsafe rejections have explicit no-mutation assertions, including promoted waitlist removal, cutoff failures, administrator writes, registration session-issuance failure, and login limiter state.
- GitHub Issue #10 is still Open and has no branch or pull request attached. Local implementation, tests, and this report remain unpublished; repository instructions do not authorize a push unless requested. The issue should be closed only after the implementation is published, CI/review completes, and the maintainer updates the issue.
- The original five high dev-tool findings are resolved in the current workspace by removing the vulnerable Next ESLint chain and replacing it with direct pinned lint plugins, as recorded in ADR 015. Full and production dependency audits now report zero vulnerabilities. The tradeoff is explicit: no `@next/next/*` lint rules until a compatible, audit-clean Next plugin can be restored.

The limiter now has atomic email-threshold, concurrent trusted-IP threshold, expired-window reset, successful-login email-counter clear, and trusted-IP release proof. The administrator PATCH contract now matches the documented accepted design: scheduling fields are editable only before any participation history, with capacity-only edits after participation. The malformed/oversized rejection matrix and final local acceptance review are complete. The constraint suite has a connectivity preflight because its prior `assert.rejects` checks could pass on connection errors.

## Release decision

Local closure gate: **Pass**, with full dependency audit clean. Delivery gate: **Pending**. The local code is acceptance-ready, but GitHub Issue #10 remains Open until the authorized branch publication, pull-request CI/review, and maintainer closure are complete.
