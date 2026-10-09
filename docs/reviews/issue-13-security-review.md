# Issue #13 focused security review

**Date:** 2026-10-08
**Scope:** Current FitOps application code, security-sensitive API boundaries, CI configuration, and the documented LAN Compose deployment.
**Verdict:** No critical or high-severity application-code finding was identified in the reviewed, test-covered flows. This is a focused review, not a penetration test or production security certification.

## Evidence reviewed

- `docs/security/threat-model-and-access-control.md` and `docs/adr/012-identity-security-baseline.md`.
- Better Auth setup in `web/lib/server/auth.ts`; login throttling in `web/lib/server/auth/login-rate-limit.ts`; same-origin enforcement in `web/lib/server/http/origin.ts`; authenticated member, trainer, and administrator route handlers.
- GitHub Actions workflow `.github/workflows/quality.yml` and LAN Compose/environment configuration in `deploy/compose.linux.yaml` and `deploy/fitops.env.example`.
- Existing auth/API-contract/constraint/concurrency integration suites and the isolated CI results in [run 37846080789](https://github.com/AqueosHeart/fitops/actions/runs/37846080789), which passed on `fff390b`.

## Controls verified

- Better Auth uses Argon2id with 19 MiB memory, two iterations, and parallelism one; accepted passwords are 15–128 characters. The secret is required at startup and must be at least 32 characters.
- Sessions are database-backed, expire after eight hours, do not refresh, and carry `authVersion`; protected identity/role checks are server-side. The existing auth suite exercises stale-session invalidation.
- Unsafe application writes require an exact configured-origin match. Existing tests cover cross-origin/missing-origin rejection and verify rejected writes leave state unchanged.
- Member resource access is owner-scoped; trainer reads are assignment-scoped; administrative operations require the administrator role. Existing API tests exercise IDOR and role-denial paths.
- Login limiting atomically reserves an email-keyed attempt and can also reserve an IP-keyed attempt when `TRUST_PROXY=true`. Tests cover the email and forwarded-IP thresholds, expired-window reset, successful-login counter behavior, and origin rejection.
- CI creates ephemeral credentials and masks them before exporting them to later steps. Playwright tracing is disabled because traces can contain authentication headers/cookies. The complete dependency audit passed with zero reported vulnerabilities in run 37846080789.

## Findings and release boundary

1. **Deployment-dependent IP rate limiting.** The current LAN Compose service is published directly on the LAN and does not set `TRUST_PROXY`; the application therefore ignores `X-Forwarded-For` and only the email-keyed login limit is active on that deployment. This safe default avoids trusting a client-spoofable header. Do not enable `TRUST_PROXY` while clients can reach the app directly. For a future edge deployment, put the app behind a trusted proxy that overwrites forwarding headers, restrict direct app access, then configure and verify the trusted-IP limit. Track this deployment-specific gate under [Issue #14](https://github.com/AqueosHeart/fitops/issues/14).
2. **Transport security is LAN-demo only.** The documented deployment uses plain HTTP on a private LAN address. The security baseline requires HTTPS/HSTS for production. Do not expose this deployment publicly until TLS/HSTS and the proxy boundary are configured and verified; this is also part of Issue #14's release gate.

No change to trust behavior was made during this review. In particular, blindly enabling forwarded-IP trust would create a spoofable rate-limit bypass on the current direct-bound deployment. No live database or deployed service was modified.

## Remaining limits

- No external penetration test, internet-facing TLS test, production proxy test, or browser field-metrics collection was performed.
- The green CI suite proves only the covered behavior against its isolated PostgreSQL service. It does not certify production operations or the LAN deployment.
