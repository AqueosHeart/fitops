---
type: sprint
project: FitOps
sprint: Sprint 8
status: active
updated: 2026-10-09
---

# Sprint 8 — LAN Release and Portfolio Evidence

## Goal

Complete the Issue #14 release evidence for the private LAN demo without expanding it to public internet exposure. Planned one-week sprint: 2026-10-09 through 2026-10-16. GitHub Issue #14 is the execution source of truth.

## Acceptance work

- [ ] Record accurate repository/CI and deployed-server evidence separately.
- [ ] Back up the FitOps database before any server update or destructive demo reset; verify a recovery path.
- [ ] Deploy the reviewed repository candidate only after server checkout and database are inspected; verify deployed commit/runtime, DB fixture, and browser route.
- [ ] Keep `TRUST_PROXY` disabled on the direct LAN deployment; document email-only login limiting.
- [ ] Keep the service LAN-only. Public TLS/HSTS/proxy work is deferred and no public release is claimed.
- [ ] Publish truthful release and portfolio evidence.

## Verified and in progress (2026-10-09)

- Issues #13 and #19 are closed; PRs #18, #20, and #21 are merged to `main`.
- LAN-only selected by the user. `TRUST_PROXY` remains disabled by explicit user confirmation.
- Current repository candidate is Next.js 16.3.8 and passed Issue #13 CI audit/build; last recorded Linux deployment is 16.3.6.
- HTTP login endpoint returned 200, but route reachability does not prove deployed version or commit.
- Compose syntax was checked with the example environment file; this is static validation and did not start containers.
- SSH batch-key authentication was rejected, so current host checkout/runtime/database cannot be inspected or changed yet.
- Release evidence: [Issue #14 readiness](../../../docs/release/issue-14-readiness.md).

## Next safe action

Establish SSH through the user's secure local configuration. Then perform read-only host/checkout/database inventory and confirm a private backup before asking to make any destructive data reset. No passwords or private data belong in Git or this vault.
