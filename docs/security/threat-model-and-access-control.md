# Issue #9: Threat model and server-side access control

Status: design baseline for the fictional FitOps MVP. This document does not claim a working authentication system, database, or deployment.

## Scope and assets

FitOps is a fictional gym-operations portfolio app. It stores only demo data, but it must still protect authentication material, membership and waiver state, booking history, waitlist order, staff operations, and the integrity of capacity rules.

| Asset | Security property |
| --- | --- |
| Password hash and Auth.js secret | Confidential; never returned, logged, or committed. |
| JWT cookie | Confidential and integrity-protected; usable only through the browser's secure cookie path. |
| User, MemberProfile, TrainerProfile | Accessed only by the authenticated owner or the narrowly authorized staff operation. |
| Bookings and waitlist entries | Owner-safe for member operations; staff reads are scoped by role and purpose. |
| Session capacity, cutoff, and queue order | Changed only by the authorized transaction protocol in ADRs 007 through 011. |
| Demo seed data | Fictional and reproducible; contains no real personal data or plaintext credential. |

## Trust boundaries

```text
Browser input and cookies
  -> Next.js route handler: Zod validation, origin check, request limits
  -> authenticated identity resolver: JWT signature, expiry, auth_version
  -> use case: role, ownership, member/trainer eligibility
  -> repository transaction: scoped query and database constraints
  -> PostgreSQL
```

Client controls, route visibility, and supplied identifiers are untrusted. The server session provides identity; the current database record provides roles, membership, waiver, profile ownership, and resource scope.

## Threats, controls, and proof

| Threat | Required control | Test evidence |
| --- | --- | --- |
| Password disclosure or offline cracking | Argon2id parameters from ADR 012, random salts, redacted logs, TLS-only transport | Verify hash format/parameters; search logs and responses for passwords; reject plaintext seed data. |
| User enumeration or credential stuffing | Generic failure response and email/IP rate limits | Compare unknown-email and wrong-password responses; exceed each limit; show a successful login clears only the appropriate counter. |
| Stolen or stale JWT | HTTP-only secure cookie, eight-hour lifetime, current-user reload and `auth_version` comparison on every protected request | Alter/expire token; increment `auth_version`; verify protected routes reject both. |
| CSRF against booking or administration | Same-origin checks for unsafe requests, Auth.js CSRF controls, no credentialed CORS | Cross-site or missing-Origin POST/DELETE/PATCH fails with no state change; valid same-origin request succeeds. |
| Open redirect after login or registration | Allowlisted internal `returnTo` parser | Reject `https://`, `//host`, encoded bypasses, backslashes, and unknown routes; accept approved member routes. |
| Member IDOR | Derive member identity from session and scope every booking/waitlist query by owner | Member A cannot read, cancel, or leave Member B's resources even with valid IDs. |
| Trainer or administrator privilege escalation | Reload role/profile from database; separate role guards per use case | Member cannot call trainer/admin endpoints; trainer cannot access another trainer's schedule or admin participants. |
| Invalid membership or waiver bypass | Lock and reread the owned profile in booking/promotion transaction | Deactivate membership or remove waiver during a synchronized booking attempt; no confirmation commits. |
| SQL injection or malformed input | Zod allowlists/length limits, Prisma parameterization, reviewed raw SQL only in migrations | Malformed IDs, strings, dates, and unknown fields fail with 400/422; no raw user input reaches query construction. |
| Leakage through errors, logs, or demo data | Stable public error codes, request ID only for unexpected errors, structured redaction, fictional seed policy | Trigger errors and inspect responses/log fixture; scan committed seeds/config for credentials and private data. |
| Concurrency-based authorization or capacity bypass | ADRs 007 through 011 lock order, rechecks, constraints, and synchronized PostgreSQL tests | Race suite proves final-seat, cancellation-promotion, capacity increase, cutoff, and overlap behavior. |

## Authorization matrix

| Operation | Authentication | Server authorization |
| --- | --- | --- |
| Read public plans, programs, sessions | None | Published records only. |
| Register or login | None | Rate-limited; validate request and internal return path. |
| Read own membership/bookings; book; waitlist; cancel; waiver | Valid session | Current User owns an eligible MemberProfile. Never accept a member ID from the client. |
| Read assigned trainer sessions | Valid session | Current User has Trainer role and owns the matching TrainerProfile; query is filtered to it. |
| Read participants; create or edit sessions | Valid session | Current User has Administrator role; commands still use scheduling and booking invariants. |
| Manage user security state | Future scope | Requires a new approved use case, reauthentication requirement, and audit design. |

A staff user can also act as a member only through an owned, active MemberProfile. A staff role does not substitute for membership eligibility.

## Endpoint rules

- Route handlers parse unknown bodies with Zod and enforce size and length limits before use cases.
- Protected handlers obtain identity once from the server session; client-supplied `userId`, `memberId`, `role`, or ownership flags are ignored or rejected.
- A missing session produces `401 UNAUTHENTICATED`; a valid session without the required role, profile, or resource ownership produces `403 FORBIDDEN`. A resource may use `404` where discovery would leak an identifier, but the policy must be consistent for that resource class.
- `GET /api/v1/trainer/sessions` filters by the authenticated trainer profile. It never accepts a trainer ID filter.
- `DELETE /api/v1/bookings/{bookingId}` and `DELETE /api/v1/waitlist/{entryId}` resolve the record within the authenticated owner's scope before a transaction. Repeated owner-safe deletion preserves the API's existing idempotency rule.
- Administrator session commands check role before resolving or mutating scheduling data. They accept no authority from hidden buttons, client claims, or URL shape.

## Security configuration and operations

- Production requires HTTPS and HSTS. Development can use an explicit local exception that never ships as production configuration.
- Required secrets are environment variables, validated at startup and excluded from Git. The Auth.js secret is generated with cryptographically secure randomness and is never reused across environments.
- Logs retain a request ID, outcome code, endpoint, and rate-limit event. They exclude passwords, token/cookie values, authorization headers, raw emails, connection strings, and profile details.
- Dependency updates use the pinned lockfile and vulnerability review before release. The app has no third-party login, payment, email, or analytics credential in MVP.
- The public demo is reset only through an explicit environment-targeted command. It never runs against an arbitrary connection string or a non-demo database.

## Non-goals and deferred decisions

- No real email delivery, email verification, password reset, account recovery, MFA, social login, payment, health data, or production customer data.
- No account deletion, staff impersonation, role-management UI, session-location tracking, or security-event audit trail in MVP.
- Adding any deferred capability requires UX, API, threat-model, data-schema, and ADR review before implementation.

## Issue #9 acceptance evidence

- [ ] ADR 012 and this document are reviewed against the product/API/UX design.
- [ ] The GitHub Issue describes the acceptance criteria and dependency on Issue #8.
- [ ] The future implementation has automated authentication, authorization, CSRF, redirect, rate-limit, and redaction tests listed above.
- [ ] The future Prisma migration and seed satisfy the identity-storage and fictional-data rules.

## References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
