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

- [x] E2E tests cover sign-in, booking, waitlist, cancellation/promotion, and administrator authorization.
- [x] Accessibility, security, performance, concurrency, and dependency reviews are recorded; discovered defects are resolved or explicitly tracked.
- [x] CI executes the reproducible quality suite successfully.
- [x] Evidence separates verified behavior from planned work.

## Verified so far (2026-10-08)

- GitHub Issue #13 is Open / In Progress / Sprint 7; Issues #10–#12 prerequisites are closed.
- Branch `codex/fitops-issue-13-quality` is pushed in draft PR [#18](https://github.com/AqueosHeart/fitops/pull/18). Earlier runs exposed and led to correction of a status selector collision, a queue-position assertion, and an unsupported trainer login return path. The final run below passes the flow. Stateful E2E auto-retries remain disabled so a retry cannot act on an already-mutated seed.
- Code review also confirmed the documented `/trainer/sessions` UI is missing although the trainer API exists and authenticated trainer routing targets it. This is outside Issue #13's quality-gate code scope and is tracked as [Issue #19](https://github.com/AqueosHeart/fitops/issues/19), added to the FitOps Delivery backlog.
- Run [37846080789](https://github.com/AqueosHeart/fitops/actions/runs/37846080789) on `fff390b` passed database, audit, build, critical-flow, all axe scans, and the desktop/mobile LCP/CLS lab budgets; raw metric values are attached to the Playwright report. It is explicitly synthetic, not field CWV.
- A focused security review is recorded in [security review](../../../docs/reviews/issue-13-security-review.md). No critical/high application-code finding appeared in covered paths; trusted-proxy/IP throttling and TLS/HSTS are explicitly retained as Issue #14 release gates.
- `npm audit --package-lock-only --audit-level=high`: zero vulnerabilities across production and development dependencies.
- `npm run lint`, `npx tsc --noEmit`, Prisma Client generation, and production `npm run build` pass on the local code. Next.js 16.3.8 build listed 42 routes and generated 33 static page entries.
- `npm run test:e2e -- --list` discovers the single Chromium critical journey. Build artifact sizes are recorded in [Issue #13 quality evidence](../../../docs/quality/issue-13-evidence.md).

## Still required

- Decide whether Issue #13 acceptance evidence is sufficient to leave review, and update its GitHub criteria only to match verified scope.
- Review the full Issue #13 evidence and update GitHub acceptance criteria only where each claim is supported; decide whether any remaining scope warrants keeping the issue open.

## Environment boundary

The Windows Docker Linux engine did not respond to `docker info`, so local database-backed verification was not attempted. Do not use the deployed demo database for automated tests. The GitHub workflow creates a disposable PostgreSQL 16 database with fictional seed data. The Linux deployment remains on Next.js 16.3.6 and LAN-only; this sprint has not deployed or altered that server.
