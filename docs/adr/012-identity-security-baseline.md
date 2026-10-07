# ADR 012 Establish the identity security baseline

## Status

Accepted for design. Implementation and security verification remain pending.

## Context

Issue #8 requires exact choices for password storage, login abuse resistance, JWT lifetime and invalidation before it can create the `users.password_hash` and `users.auth_version` columns. The MVP has fictional demo identities, uses Auth.js Credentials with JWT sessions, and has no email delivery or password-reset flow.

## Decision

1. Credentials are accepted only over HTTPS. The Identity adapter stores an Argon2id password hash with a per-password random salt. Its minimum parameters are 19 MiB memory, two iterations, and parallelism one. Password values are never normalized, truncated, logged, returned, seeded as plaintext, or stored outside `users.password_hash`.
2. Registration and login accept passwords from 15 through 128 Unicode characters. They allow whitespace and password-manager paste. The UI may show strength feedback; server validation is authoritative. A future breached-password check must fail closed only when its dependency is available and must not send a raw password to a third party.
3. Authentication failures use the same generic response for an unknown email, incorrect password, disabled account, or rate-limited attempt. The server applies both an email-keyed limit of five failed attempts in 15 minutes and an IP-keyed limit of 20 failed attempts in 15 minutes. Limits expire naturally rather than permanently locking an account. Successful authentication clears the email-keyed failure counter.
4. Auth.js Credentials uses a signed and encrypted HTTP-only JWT cookie. The JWT contains only stable user ID (`sub`), `auth_version`, issued-at and expiry data managed by Auth.js. It has an eight-hour maximum age. It is never exposed to JavaScript, `localStorage`, `sessionStorage`, API JSON, logs, or URLs. Production cookies require `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, no shared `Domain`, and a `__Host-` prefix where Auth.js configuration permits it.
5. Every protected request resolves the current User and relevant profile from PostgreSQL, rejects a mismatched `auth_version`, and checks the required role and owned profile at the use-case boundary. A role, membership, waiver, or trainer assignment in an old token has no authority. Incrementing `auth_version` invalidates all previously issued tokens for that user.
6. State-changing cookie-authenticated endpoints require a same-origin `Origin` check, reject an absent or mismatched origin in browser requests, and use Auth.js's built-in CSRF protection for Auth.js routes. `SameSite` is defense in depth, not the sole CSRF control. API routes do not enable permissive cross-origin credentials.
7. `returnTo` is an allowlisted internal path, never an arbitrary URL. It may target only defined FitOps routes and must begin with one slash, contain no scheme, authority, backslash, or control character, and never begin with `//`. The server chooses the final default destination when it is absent or invalid.
8. The existing recovery screen is informational only: it creates no reset token, sends no email, and does not reveal whether an identity exists. Password change, email change, account recovery, MFA, and staff impersonation are outside the MVP and require a new threat-model and UX review before implementation.

## Consequences

- Issue #8 can map `password_hash text` and `auth_version integer NOT NULL DEFAULT 1` without deferring their required behavior.
- A future database implementation needs a rate-limit store with atomic increment and expiry. It must not use a browser-only counter.
- Privileged sessions use the same short-lived token model. Administrator and trainer access remains server-authorized on every request.
- The required tests are listed in the Issue #9 threat model. These decisions do not claim that a secure implementation exists yet.

## Alternatives considered

- **Plain or fast hashes:** rejected because leaked password values would be cheap to crack.
- **Database session rows:** not needed for the stated JWT-session MVP; `auth_version` provides server-side invalidation for security events.
- **Permanent account lockout:** rejected because it permits easy denial of service against known accounts.
- **Email password reset:** rejected because the MVP has no approved email delivery, reset-token contract, or recovery threat model.

## Verification gate

Before implementation is called complete, test the Argon2id parameters, generic login failures, both rate-limit dimensions, JWT expiry and `auth_version` invalidation, cookie attributes in production configuration, CSRF rejection, return-path rejection, and server-side IDOR/role checks. No secret, plaintext password, email, JWT, connection string, or stack trace may reach a client response or log.
