---
type: sprint
project: FitOps
sprint: Sprint 4
status: active
updated: 2026-09-28
---

# Sprint 4 REST API and Access Control

## Goal

Implement fictional enrollment, session, booking, cancellation, and waitlist endpoints with demo authentication, validated internal return paths, and server-side authorization.

## Active work

- [ ] Issue #10: Auth.js Credentials, JWT invalidation, rate limiting, and safe internal redirects.
- [ ] Issue #10: Zod-validated `/api/v1` route handlers and stable contract error mapping.
- [ ] Issue #10: Member, trainer, and administrator ownership/role enforcement.
- [ ] Issue #10: API tests for validation, authorization, IDOR, expected domain failures, and success paths.

## Verified dependencies

- [x] Issue #8 is closed and Done: executable schema/migrations, fictional seed, rejected-write checks, and synchronized PostgreSQL consistency tests.
- [x] Issue #9 supplies the ADR 012 identity and threat-model baseline.
- [x] Issue #6 supplies the approved Penpot wireframe and draw.io route/flow evidence.

## Non-goals

- Product UI implementation, payments, real accounts, email delivery, recovery, MFA, and production data.
