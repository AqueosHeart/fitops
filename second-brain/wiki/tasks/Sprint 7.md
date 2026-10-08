---
type: sprint
project: FitOps
sprint: Sprint 7
status: active
updated: 2026-10-08
---

# Sprint 7 — System Quality and Production-Candidate Evidence

## Goal

Build a reproducible, truthful quality gate for the FitOps production candidate. The one-week sprint is planned for 2026-10-08 through 2026-10-15; GitHub Issue #13 is the execution source of truth.

## Acceptance work

- [ ] E2E tests cover sign-in, booking, waitlist, cancellation/promotion, and administrator authorization.
- [ ] Accessibility, security, performance, concurrency, and dependency reviews are recorded; discovered defects are resolved or explicitly tracked.
- [ ] CI executes the reproducible quality suite successfully.
- [ ] Evidence separates verified behavior from planned work.

## Verified so far (2026-10-08)

- GitHub Issue #13 is Open / In Progress / Sprint 7; Issues #10–#12 prerequisites are closed.
- Branch `codex/fitops-issue-13-quality` is pushed in draft PR [#18](https://github.com/AqueosHeart/fitops/pull/18). CI run [37841999623](https://github.com/AqueosHeart/fitops/actions/runs/37841999623) passed PostgreSQL migration/seed/integration, lint/typecheck, audit, and build. Its browser journey failed axe on landing text contrast (4.43–4.45:1) and loading-grid ARIA semantics. Both are corrected locally; another Actions run is required.
- `npm audit --package-lock-only --audit-level=high`: zero vulnerabilities across production and development dependencies.
- `npm run lint`, `npx tsc --noEmit`, Prisma Client generation, and production `npm run build` pass on the local code. Next.js 16.3.8 build listed 42 routes and generated 33 static page entries.
- `npm run test:e2e -- --list` discovers the single Chromium critical journey. Build artifact sizes are recorded in [Issue #13 quality evidence](../../../docs/quality/issue-13-evidence.md).

## Still required

- Push the accessibility fixes and rerun the workflow on GitHub; inspect all new failures.
- Confirm the browser journey and axe scans pass on all targeted views in the isolated PostgreSQL service.
- Complete browser runtime performance measurement and agree on a useful budget; current bundle sizes alone are not a performance score.
- Review the resulting evidence, update Issue #13 criteria accurately, and only then consider closure.

## Environment boundary

The Windows Docker Linux engine did not respond to `docker info`, so local database-backed verification was not attempted. Do not use the deployed demo database for automated tests. The GitHub workflow creates a disposable PostgreSQL 16 database with fictional seed data. The Linux deployment remains on Next.js 16.3.6 and LAN-only; this sprint has not deployed or altered that server.
