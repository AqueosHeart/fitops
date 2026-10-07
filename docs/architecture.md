# FitOps Architecture

## Architectural style

FitOps will begin as a modular monolith deployed as one Next.js application. It will use clear domain boundaries and inward-facing dependencies without creating networked services prematurely.

```text
Browser
  -> Next.js pages and components
  -> REST route handlers
  -> Application use cases
  -> Domain rules
  -> Repository ports
  -> Prisma PostgreSQL adapters
```

## Dependency rule

- Domain code contains business concepts and invariants and imports no Next.js, Prisma, or React code.
- Application use cases coordinate domain objects through repository interfaces.
- REST handlers validate HTTP input, invoke one use case, and map the result to an HTTP response.
- Prisma repositories implement persistence interfaces and translate database records to domain objects.
- React components consume typed API results and do not contain authoritative booking rules.

## Modules

### Identity

Owns users, roles, sessions, and demo-account access.

### Membership

Owns member status, fictional plan selection, and eligibility to book. It does not own payments, billing, cards, invoices, or real subscriptions in version one.

### Scheduling

Owns programs, trainers, `SessionSlot` calendar definitions, and trainer-time overlap prevention. A published slot supplies translated data to Booking; it does not own capacity, cutoff, participation, or waitlist order.

### Booking

Owns `BookableSession` reservation policy (capacity, cutoff, status, and session snapshot), confirmed reservations, cancellations, overlap checks, waitlists, and promotion. `MemberReservationCalendar` prevents overlapping confirmed reservations for one member. ADR 008 defines the Scheduling-to-Booking contract and the explicit local transaction that can change both Booking aggregates.

### Administration

Provides authorized use cases for managing sessions and viewing operational state. It does not bypass scheduling or booking invariants.

Administration is an application-facing orchestration module, not a fifth bounded context or independent owner of session and participation records. ADR 008 defines the Scheduling/Booking ownership boundary; ADR 007 retains the transaction safeguards it references.

ADR 009 maps the Scheduling `SessionSlot` and Booking `BookableSession` views to one physical `class_sessions` row for the single-database MVP. Their repository adapters expose only their owned domain contracts, while a shared application transaction coordinator locks the row and member profile as required. This prevents duplicated physical session intervals from drifting without merging the domain boundaries.

## Suggested source structure

```text
src/
├── app/
│   ├── (marketing)/              # /, /programs, /schedule, /pricing, legal pages
│   ├── (join)/                   # /join, /register, /auth/forgot-password
│   ├── portal/                   # /portal/login
│   ├── (member)/app/             # /app/schedule, /app/bookings, /app/profile/security
│   ├── trainer/
│   ├── admin/
│   └── api/
├── modules/
│   ├── identity/
│   ├── membership/
│   ├── scheduling/
│   └── booking/
│       ├── domain/
│       ├── application/
│       └── infrastructure/
├── components/
├── lib/
└── styles/
tests/
├── unit/
├── integration/
└── e2e/
```

## Transaction boundaries

Booking, cancellation, and waitlist promotion require database transactions. Confirmed occupancy is checked under the session row lock; booking or cancellation does not change configured capacity.

The database enforces unique confirmed bookings and unique waiting entries per member/session separately. The shared locked transaction enforces the cross-table rule that a member cannot be both confirmed and waiting, as well as capacity and overlap; synchronized PostgreSQL tests must prove these paths.

Per [ADR 007](adr/007-booking-consistency-boundary.md), [ADR 008](adr/008-booking-owns-reservable-session.md), [ADR 009](adr/009-one-physical-session-row.md), and [ADR 010](adr/010-promote-waitlist-on-capacity-increase.md), participation mutations lock the affected physical `class_sessions` row, then the MemberReservationCalendar lock anchor, currently its owned `member_profiles` row, when a confirmation or promotion is possible. Rules are rechecked under those locks. This serializes final-seat allocation and member overlap checks across sessions; Booking capacity edits use the same session lock. Cancellation or a capacity increase before cutoff can promote eligible waiters in the same transaction. Bounded whole-transaction retries handle serialization failures and deadlocks. Cross-table participation, overlap, and capacity are protected by this protocol and PostgreSQL integration tests, not by uniqueness constraints alone.

## Authentication and authorization

- Better Auth Credentials uses HTTP-only database-backed sessions and credential-account persistence. The server reloads current user/profile state on protected requests and enforces `auth_version` plus role and profile scope at the use-case boundary. ADR 014 supersedes ADR 012's Auth.js/JWT-specific implementation wording.
- Public marketing routes and the authenticated workspace use distinct layouts. A public header exposes secondary `My Account` access and primary `Join Now`; it does not expose a generic global Sign In action.
- `/join` carries optional, validated `returnTo` intent. New fictional members select a plan before registration; existing members reach `/portal/login` from My Account, Join, or a protected-route redirect.
- Only an approved internal return path may be restored after authentication. The server rejects external or malformed `returnTo` values to prevent open redirects.
- Authorization is checked in every protected use case, not only by hiding UI controls.
- Demo accounts use fictional identities and limited permissions.
- Passwords, connection strings, and provider secrets exist only in environment variables.
- Administrative mutations require an administrator role and validated input.

## Error model

Expected errors use stable codes such as `SESSION_FULL`, `BOOKING_CONFLICT`, `BOOKING_CUTOFF_PASSED`, and `FORBIDDEN`. HTTP adapters translate them consistently; UI copy may be localized without parsing error messages.

## Observability

- Structured server logs with request identifiers
- No passwords, tokens, emails, or sensitive profile data in logs
- Error monitoring may be added after the core flow works
- A health endpoint verifies process and database readiness without exposing secrets

## Deployment environments

- Local: developer database and seeded demo users
- Test: isolated database or disposable schema
- Production demo: managed PostgreSQL with fictional seed data

Database migrations are version controlled and applied through the deployment workflow. Production demo resets must be explicit and must never target unrelated databases.

## Architecture boundaries deliberately delayed

- No microservices
- No event broker
- No distributed cache
- No separate Python service
- No CQRS or event sourcing

These may be discussed as scaling options, but implementing them would obscure the core portfolio evidence.
