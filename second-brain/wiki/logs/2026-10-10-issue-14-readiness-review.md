---
type: session-log
project: FitOps
date: 2026-10-10
---

# Issue #14 release-readiness review

## Goal

Compare the current GitHub release issue and Phase 6 / Sprint 8 implementation plan with checked-in implementation and evidence, then complete safe repository work.

## Findings

- GitHub Issue #14 is Open. `gh issue view` returned no assignee, labels, or project items. `gh project list` could not run because the local GitHub CLI token lacks `read:project`; do not treat the earlier second-brain Sprint 8 assignment as verified.
- Existing deployment and security review document a private HTTP-only LAN service, no trusted proxy, and no public TLS/HSTS. The last documented Linux app commit is `8951e16` with Next.js 16.3.6, while repository `main` uses 16.3.8.
- Issue #13 CI and architecture/test evidence exist. No portfolio case-study artifact or explicit volume-guarded reset instructions existed before this work.
- No public hostname or verified public endpoint is recorded. Public smoke, HSTS, and trusted-proxy evidence cannot be produced from the current private setup.

## Changes

- Updated `docs/linux-server-deployment.md` to clone/fast-forward current `main`, describe the stale deployed version accurately, and provide a private-only demo reset that checks both Compose volume labels before deleting the exact FitOps PostgreSQL volume.
- Added `docs/portfolio-case-study.md` with verified implementation/CI/local evidence and explicit scope and deployment limits; linked it from `README.md`.
- Corrected the board/project/sprint mirrors so Issue #14's current GitHub metadata is not represented as confirmed Sprint 8 work.

## Verification and limits

- `docker compose config` confirmed the Linux deployment project name `fitops` and logical volume key `fitops-postgres`, matching the reset procedure's expected Compose labels. The reset procedure was not executed; no database was deleted.
- `git diff --check` passed. No application tests/build were run. No remote service, GitHub issue/project, or database was changed.
- Continue only after the GitHub Project assignment is clarified and a domain/edge plan is authorized. Keep direct-bound HTTP private.
