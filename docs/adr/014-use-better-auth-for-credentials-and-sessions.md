# ADR 014 Use Better Auth for credentials and sessions

## Status

Accepted. Supersedes the Auth.js/JWT-specific implementation choices in ADR 012.

## Context

Issue #10 needs a maintained authentication boundary compatible with Next.js 16, Prisma 7, PostgreSQL, and the existing fictional `users`/profile model. The repository had only the Auth.js dependency; no Auth.js handler or credential flow had been implemented. The project owner selected Better Auth before Issue #10 implementation began.

## Decision

1. Use Better Auth 1.7.6 with its Prisma adapter and the Next.js `/api/auth/[...all]` handler. Remove the unused Auth.js dependency.
2. Preserve the existing `users` table, UUID identity, roles, `auth_version`, and profile relations. Better Auth maps its user model to `User`; the migration adds only `email_verified` and optional `image` fields required by the adapter.
3. Persist Better Auth sessions, accounts, and verification records in `auth_sessions`, `auth_accounts`, and `auth_verifications`. Session tokens remain HTTP-only cookies; the server validates the session and then reloads the current user and profile for every protected FitOps use case.
4. Keep the eight-hour maximum session lifetime, disable sliding session refresh, use `Secure` cookies in production, and keep `SameSite=Lax` plus explicit same-origin checks for unsafe FitOps API operations.
5. Keep Argon2id. Better Auth's credentials adapter receives the existing Argon2id implementation with at least 19 MiB memory, two iterations, and parallelism one. Credential hashes live in the Better Auth credential account record; `users.password_hash` is retained for the already-migrated fictional schema and seeded legacy compatibility, but is not the authority for new authentication.
6. Better Auth's public sign-up endpoint is disabled. FitOps registration remains an application endpoint so it can atomically create the fictional user, credential account, selected plan, required consents, and `MemberProfile`. Better Auth performs credentials sign-in and session issuance.
7. `auth_version` remains the FitOps-wide invalidation control. The protected-request resolver loads the current `users.auth_version` from PostgreSQL and rejects a session after an explicit version-changing security action; session records may also be revoked directly when required.

## Consequences

- The old JWT-specific wording in ADR 012 and the threat model is superseded by database-backed Better Auth sessions with the same eight-hour bound and server-side authorization guarantees.
- Existing fictional seed users receive credential account rows without storing a plaintext password.
- Better Auth's generated schema is reviewed and merged manually through Prisma migrations; the generator is not allowed to overwrite FitOps domain schema or its hand-authored booking constraints.
- Recovery, email verification delivery, MFA, social login, and production identities remain out of scope.

## Alternatives considered

- **Keep Auth.js Credentials:** rejected by the project owner before any Auth.js implementation existed.
- **Use Better Auth default scrypt:** rejected because ADR 012 already selected Argon2id and Better Auth supports an explicit custom hash/verify implementation.
- **Stateless JWT sessions:** rejected because Better Auth database sessions make per-session revocation and current-session checks straightforward while FitOps retains current-user authorization checks.

## Verification gate

Before Issue #10 is closed, prove the generated handler, credential account mapping, Argon2id settings, eight-hour session expiration, session invalidation, same-origin rejection, generic rate-limited failures, return-path allowlisting, and owner/role authorization with automated integration tests.
