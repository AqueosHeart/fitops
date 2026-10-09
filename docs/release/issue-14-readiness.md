# Issue #14 release readiness — 2026-10-09

This record separates repository evidence from the state of the LAN server. The chosen release boundary is private LAN only; no public domain, DNS, firewall, router, TLS edge, or external exposure is authorized or configured.

## Verified

- Issue #13 is closed. Its merged `main` candidate pins Next.js 16.3.8; CI passed the full dependency audit and production build, plus database, API, browser, accessibility, and synthetic performance suites.
- The Linux deployment guide describes a separate FitOps Compose project, PostgreSQL volume, private DB network, LAN-bound port 3001, and no AARC service/database changes.
- The LAN login URL responded HTTP 200 during the Oct 9 reachability check. This does not identify the deployed commit or framework version.
- Compose syntax was checked with the example environment file; this is static validation and did not start containers.
- The operator selected LAN-only operation and confirmed `TRUST_PROXY` should remain disabled. With the direct LAN connection, use email-keyed login limiting only; forwarded client IP headers are not trusted.

## Not verified / blocked

- The last recorded Linux deployment used Next.js 16.3.6 at `/home/sebastian/fitops`; the actual current server checkout, running package version, migration state, backup health, and post-update behavior are unknown.
- An SSH batch-key connection attempt was rejected (`Permission denied (publickey,password)`). Do not place a password in repository files or command history. Until an authorized SSH authentication method is available, do not claim a deployment, server backup/reset, or Prisma Studio update.
- The current server's database has not been reset or modified by this release-preparation work.
- There is no HTTPS/HSTS edge and none is required for the selected LAN-only scope. Public release remains explicitly out of scope.

## Safe next actions

1. Obtain a working SSH credential through the user's secure local SSH setup, then inspect the host identity, FitOps checkout/branch/dirty state, Compose project, app version, and database before writes.
2. Follow `docs/linux-server-deployment.md` to make a private, validated database backup before any update or destructive demo reset. Never run reset commands until the user requests the destructive reset and its target has been rechecked.
3. Deploy the reviewed `main` commit only from a clean server checkout, run `db:verify`, check the login route, and record the exact deployed commit/runtime version.
4. Keep `TRUST_PROXY` false and the port LAN-bound. Revisit TLS/HSTS and a trusted proxy only if the user later requests broader exposure.

## Scope boundary

The CI workflow exercises `prisma migrate reset --force`, explicit fictional reseeding, and `db:verify` only on its disposable PostgreSQL service. This tests the documented recipe; it is not evidence that the Linux database was reset or that a production restore has been tested.
