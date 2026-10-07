---
type: session-record
project: FitOps
date: 2026-09-25
---

# Issue #9 identity security baseline

## Goal

Resolve the identity and access-control decisions that Issue #8 needs before physical-schema implementation.

## Decisions

- ADR 012 uses Argon2id with at least 19 MiB memory, two iterations, and parallelism one; passwords are accepted from 15 through 128 Unicode characters without normalization or truncation.
- Login failures are generic and rate limited by normalized email and IP. Auth.js Credentials has an eight-hour HTTP-only JWT, with only stable user ID and `auth_version`; protected requests reload current User/profile state.
- Unsafe cookie-authenticated API requests require same-origin validation. `returnTo` is allowlisted to known internal routes. Recovery, email delivery, MFA, social login, and password change remain outside MVP.
- The threat model defines IDOR, role, CSRF, redirect, rate-limit, redaction, and concurrency test evidence.

## Evidence and limits

- The design aligns with existing API, architecture, Issue #8's physical plan, and the demo-only data policy.
- No application, Prisma schema, migration, PostgreSQL test, connected Figma approval, or Sprint 0 exit review exists yet.

## Next safe action

Complete the outstanding Sprint 0 and native Figma design gates, then pin the implementation versions and create the first Prisma schema/migration with the ADR 012 identity behavior.
