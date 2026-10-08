# Issue #13 quality and production-candidate evidence

Updated: 2026-10-08

This record separates checks already observed from automation or reviews that still need to run. Issue #13 is not complete until its acceptance criteria have evidence from a successful CI run and the remaining review items are resolved or explicitly scoped.

## Verified in this work session

- `npm audit --package-lock-only --audit-level=high` reported zero vulnerabilities across production and development dependencies after updating the pinned Next.js version from 16.3.6 to 16.3.8.
- The clean install reports the pinned ESLint 9.39.5 as deprecated. The lockfile's current React, import, and accessibility ESLint plugins declare peer support only through ESLint 9, so an ESLint 10 major upgrade is deferred until those plugins support it and the lint config can be verified.
- `npm run lint`, `npx tsc --noEmit`, Prisma Client generation, and `npm run build` passed locally. The Next.js 16.3.8 production build listed 42 routes and generated 33 static page entries without a database connection, using placeholder-only local build variables.
- Build artifact size review: Next's root shared JavaScript plus polyfill files total 552,948 raw bytes (six files); `.next/static` totals 814,059 raw bytes (25 files). These are uncompressed build-artifact sizes, not network transfer size or a user-visible performance score.
- The new GitHub Actions workflow is configured to create a fresh PostgreSQL 16 service, apply migrations, seed fictional data, run database/API/constraint/concurrency suites, lint, type-check, audit all dependencies, build, and run the critical browser journey.
- CI's PostgreSQL `trust` authentication is limited to the short-lived GitHub-hosted test service; application secret and demo password are generated randomly at run time and are not repository secrets or production credentials.
- Workflow YAML parses locally and contains the expected quality job steps; this syntax check does not substitute for a GitHub Actions run.
- `npm run test:e2e -- --list` successfully discovers the Chromium journey. The Playwright scenario covers fictional registration/waiver acceptance, waitlist entry, administrator capacity increase and FIFO promotions, member cancellation and promotion, and member/trainer denial of administrator access. axe-core scans the public landing page, member bookings page, and administrator roster.
- Source review of the existing integration suites confirms explicit cases for cross-origin registration and spoofed-host rejection, session invalidation, login throttling/role-safe return paths, booking ownership/IDOR, role boundaries, and no-state-change failures. The PostgreSQL race suite contains ten synchronized contention/rollback cases; the constraint suite contains two rejected-write cases. These suites are configured in CI but were not executed locally in this session.

## Not yet verified

- The local Docker Desktop Linux engine did not respond to a read-only `docker info` query, so no local PostgreSQL-backed tests or browser journey were run against it.
- The GitHub Actions workflow has not run yet; its result is required before treating the automation as verified.
- The accessibility scans and end-to-end scenario are implemented but have not yet produced a passing run.
- Browser runtime performance, real transfer sizes, and an agreed performance budget remain unmeasured. No user-facing performance score or production-readiness claim is made here.
- Production operations, TLS/public exposure, backup/restore, monitoring, and deployment rollback remain outside the evidence added here and must not be inferred from CI.

## Current automation entry point

`.github/workflows/quality.yml` is the reproducible CI gate. `web/tests/e2e/critical-member-and-admin.spec.ts` is intended to run only against a fresh, disposable, fictional test database; the test member is created with a unique `example.test` address. No live database, credentials, or production records are used by the workflow.
