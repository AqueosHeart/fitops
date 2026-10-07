---
type: session-record
project: FitOps
date: 2026-09-28
---

# Better Auth Issue #10 baseline

## User goal

Use Better Auth for FitOps login while continuing Issue #10 with independent review and repair cycles.

## Decisions

- ADR 014 selects Better Auth 1.7.6 and its Prisma adapter, superseding ADR 012 only where it prescribed Auth.js/JWT implementation details.
- FitOps retains its existing fictional `users`, role, profile, and `auth_version` model. Better Auth owns credential accounts and database-backed sessions.
- The direct Better Auth public handler exposes only session lookup and sign-out; application routes own login/registration so consent, fictional enrollment, and email-keyed limits remain enforceable.

## Evidence and changes

- Prisma validation/generation, migration deploy, fictional seed verification, constraint checks, TypeScript, and lint passed locally.
- Three independent audits found and prompted fixes for the unsafe generated composite-FK change, multiple `Set-Cookie` forwarding, cross-site sign-out, unbounded JSON body handling, missing explicit origin configuration, and no-proxy global IP rate limiting.

## Unresolved work

- Implement and prove the remaining documented `/api/v1` public, booking, trainer, and administrator endpoints.
- Add executable route/auth integration tests, including cookies, session invalidation, rate limiting, origin, IDOR, and all endpoint contracts.
- Keep Issue #10 In Progress; do not mark it Done yet.
