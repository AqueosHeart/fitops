---
type: sprint
project: FitOps
sprint: Sprint 4
status: active
updated: 2026-10-07
---

# Sprint 4 REST API and Access Control

## Goal

Implement fictional enrollment, session, booking, cancellation, and waitlist endpoints with demo authentication, validated internal return paths, and server-side authorization.

## Active work

- [ ] Issue #10: Better Auth Credentials/database sessions, `auth_version` invalidation, rate limiting, and safe internal redirects.
- [ ] Issue #10: Zod-validated `/api/v1` route handlers and stable contract error mapping.
- [ ] Issue #10: Member, trainer, and administrator ownership/role enforcement.
- [ ] Issue #10: API tests for validation, authorization, IDOR, expected domain failures, and success paths.

## Latest verification

- 2026-09-28 follow-up: `npm run test:auth-api` passed 5 tests and `npm run test:api-contract` passed 4 tests; lint, TypeScript, and diff validation passed. The new route suite reaches all 17 current handlers, but the report retains documented domain-edge and unsafe-write no-state-change cases as the open closure gate: [Issue #10 follow-up test report](../../../docs/reviews/issue-10-auth-api-follow-up-test-report.md).
- 2026-10-06 expanded continuation checkpoint: auth 5/5, API contract 7/7, constraints 2/2, synchronized races 10/10, lint, TypeScript, and diff check passed with PostgreSQL reachable. Coverage verified booking/waitlist domain outcomes and rejection state, trainer isolation, administrator references/capacity/FIFO promotion/cutoff, trusted IP/email concurrency and reset, cross-origin no-mutation on unsafe routes, oversized registration rejection, and documented PATCH scheduling edits before participation versus historical-participation rejection. Trainer-overlap create/update conflicts map to `409 TRAINER_OVERLAP`. Its remaining malformed-body gap was closed in the 2026-10-07 review below.
- 2026-10-07 initial final-local-acceptance checkpoint (superseded by ADR 015): auth 5/5, API contract 7/7, constraints 2/2, synchronized races 10/10, lint, TypeScript, diff check, production build, Prisma validation/generation, and production dependency audit pass. Added malformed/oversized/unknown-field no-mutation checks, missing-session and cancellation targets, `ALREADY_WAITING`/`ALREADY_BOOKED`, promoted-entry removal preservation, response redaction, and registration cleanup when initial session issuance fails. Prisma 7.10.0 remains; tested overrides clear its `deepmerge-ts` and `mysql2` audit findings. At that checkpoint the full audit found five high dev-tool findings through `braces`. GitHub Issue #10 remained Open pending publication and upstream CI/review. See [final closure report](../../../docs/reviews/issue-10-auth-api-follow-up-test-report.md).
- 2026-10-07 initial dependency follow-up (superseded by ADR 015): verified `braces@3.0.3` was dev-only via `eslint-config-next@16.3.6 -> @next/eslint-plugin-next@16.3.6 -> fast-glob@3.3.1 -> micromatch@4.0.8`; production audit was 0. No patched release was published, and the proposed fix PR was closed with a reported compatibility regression. This was the interim rationale before the owner authorized replacing the lint configuration.
- 2026-10-07 pre-migration verification snapshot: auth 5/5, API contract 7/7, PostgreSQL constraints 2/2, races 10/10, lint, TypeScript, Prisma validation/generation, and production build (14 static pages) passed. Registry check showed official `eslint-config-next@16.4.0` still used `@next/eslint-plugin-next@16.4.0 -> fast-glob@3.3.1`, and published `braces` remained 3.0.3.
- 2026-10-07 approved lint-toolchain resolution: under ADR 015, removed `eslint-config-next` and replaced it with pinned ESLint core, TypeScript, React, Hooks, JSX accessibility, and import rules. The intentional tradeoff is no `@next/next/*` rules pending a patched, audit-clean compatible plugin. Full audit now reports 0 vulnerabilities; lint passes. All four integration suites (24/24), TypeScript, Prisma validation/generation, production build (14 static pages), and diff check pass. Branch publication and PR CI/review remain pending.

## Verified dependencies

- [x] Issue #8 is closed and Done: executable schema/migrations, fictional seed, rejected-write checks, and synchronized PostgreSQL consistency tests.
- [x] Issue #9 supplies the ADR 012 identity and threat-model baseline.
- [x] Issue #6 supplies the approved Penpot wireframe and draw.io route/flow evidence.

## Non-goals

- Product UI implementation, payments, real accounts, email delivery, recovery, MFA, and production data.
