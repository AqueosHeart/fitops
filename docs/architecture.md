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

Owns member status and eligibility to book.

### Scheduling

Owns programs, trainers, class sessions, capacity, and cutoff times.

### Booking

Owns confirmed reservations, cancellations, overlap checks, waitlists, and promotion.

### Administration

Provides authorized use cases for managing sessions and viewing operational state. It does not bypass scheduling or booking invariants.

## Suggested source structure

```text
src/
├── app/
│   ├── (marketing)/
│   ├── (member)/
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

Booking, cancellation, and waitlist promotion require database transactions. Capacity is checked and updated within the transaction so concurrent requests cannot overbook a session.

The database must enforce uniqueness for active member-session participation. Application checks provide useful errors, while database constraints remain the final consistency guard.

## Authentication and authorization

- Authentication establishes user identity through a server-managed session.
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
