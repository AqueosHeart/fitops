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
- Branch `codex/fitops-issue-13-quality` is pushed in draft PR [#18](https://github.com/AqueosHeart/fitops/pull/18). CI run [37841999623](https://github.com/AqueosHeart/fitops/actions/runs/37841999623) passed PostgreSQL migration/seed/integration, lint/typecheck, audit, and build. Follow-up run [37842824345](https://github.com/AqueosHeart/fitops/actions/runs/37842824345) confirmed the landing axe scan passes and exposed a fixed queue-position assertion plus an unsupported trainer login return path. The test now checks the success notice, uses the supported sign-in destination, and verifies the trainer-only API. Stateful E2E auto-retries are disabled so a retry cannot act on an already-mutated seed; another fresh CI run is required.
- Code review also confirmed the documented `/trainer/sessions` UI is missing although the trainer API exists and authenticated trainer routing targets it. This is outside Issue #13's quality-gate code scope and is tracked as [Issue #19](https://github.com/AqueosHeart/fitops/issues/19), added to the FitOps Delivery backlog.
- Run [37844839060](https://github.com/AqueosHeart/fitops/actions/runs/37844839060) passed all then-configured database, audit, build, critical-flow, and axe checks. A CI lab performance test is added separately: 3 fresh samples at desktop/mobile sizes, with LCP/CLS thresholds from web.dev and raw metrics attached; measurements await the next run. It is explicitly synthetic, not field CWV.
- `npm audit --package-lock-only --audit-level=high`: zero vulnerabilities across production and development dependencies.
- `npm run lint`, `npx tsc --noEmit`, Prisma Client generation, and production `npm run build` pass on the local code. Next.js 16.3.8 build listed 42 routes and generated 33 static page entries.
- `npm run test:e2e -- --list` discovers the single Chromium critical journey. Build artifact sizes are recorded in [Issue #13 quality evidence](../../../docs/quality/issue-13-evidence.md).

## Still required

- Push the accessibility fixes and rerun the workflow on GitHub; inspect all new failures.
- Confirm the full browser journey and axe scans pass on all targeted views in the isolated PostgreSQL service.
- Verify the new desktop/mobile LCP/CLS lab budget in CI and inspect its attached measurements; the result is not field-user performance evidence.
- Review the resulting evidence, update Issue #13 criteria accurately, and only then consider closure.

## Environment boundary

The Windows Docker Linux engine did not respond to `docker info`, so local database-backed verification was not attempted. Do not use the deployed demo database for automated tests. The GitHub workflow creates a disposable PostgreSQL 16 database with fictional seed data. The Linux deployment remains on Next.js 16.3.6 and LAN-only; this sprint has not deployed or altered that server.
