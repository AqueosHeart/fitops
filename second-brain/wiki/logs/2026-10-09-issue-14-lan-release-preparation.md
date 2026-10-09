---
type: session-record
project: FitOps
date: 2026-10-09
---

# Issue #14 LAN release preparation

## Goal and decision

Continue FitOps after PRs #18, #20, and #21 merged. Issue #14 is the active Sprint 8 scope. The user chose LAN-only and confirmed `TRUST_PROXY` must remain disabled. No public exposure is authorized.

## Changes

- Added ADR 018: keep Next.js 16.3.8 in the repo candidate; preserve ADR 015 lint choices; do not infer server deployment from CI.
- Added Issue #14 readiness evidence distinguishing CI/static checks from server proof.
- Corrected local/server clone instructions to use the repository default branch.
- Added a backup-first, validated custom-format backup and explicit Prisma reset/reseed/verify/recovery runbook. Reset and restore are documented only; they were not run.
- Extended the quality workflow to run reset, explicit fictional seed, and `db:verify` against its disposable PostgreSQL service after browser tests.
- Updated Sprint 8/project/board memory and root README to avoid stale completion/deployment claims.

## Evidence and limits

- Repository candidate is Next.js 16.3.8 with Issue #13 quality CI evidence; last recorded Linux deployment used 16.3.6.
- LAN login endpoint returned HTTP 200, which verifies route reachability only.
- Compose validation used the example env file and did not start a container.
- PR [#22](https://github.com/AqueosHeart/fitops/pull/22) is open and quality run [37959917619](https://github.com/AqueosHeart/fitops/actions/runs/37959917619) passed, including the new disposable-DB reset/reseed/verify stage.
- SSH batch-key authentication was rejected; current checkout, running version, DB migration/data state, backup health, and deployment status remain unknown. No server or database was changed.
- Public TLS/HSTS and trusted proxy are deferred for the LAN-only scope. `TRUST_PROXY` remains false.

## Next safe action

Establish SSH using the user's private local credential configuration. Inspect host identity, checkout cleanliness/branch/commit, Compose state, and running app version read-only. Before any update or intentional demo reset, create and validate a private DB backup. Do not run reset or restore without explicit destructive intent and a confirmed target.
