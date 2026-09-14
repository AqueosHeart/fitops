# ADR 001 Use a Modular Monolith

## Status

Accepted for initial implementation

## Context

FitOps needs enough architectural structure to keep booking rules testable and database operations safe. It does not have the traffic, team boundaries, or independent deployment requirements that would justify microservices.

## Decision

Build one Next.js application organized into identity, membership, scheduling, and booking modules. Keep domain and application logic independent of React, Next.js route handlers, Prisma, and PostgreSQL. Cross-layer communication uses explicit interfaces.

## Consequences

### Benefits

- One repository and deployment reduce operational overhead.
- Domain rules can be tested with in-memory adapters.
- Database transactions can protect capacity and waitlist invariants.
- Module boundaries provide an interview-ready explanation of responsibilities.

### Costs

- Boundaries rely on repository discipline and automated import checks.
- Modules share one process and database deployment.
- Independent scaling is unavailable without later extraction.

## Rejected alternatives

### Static site or WordPress-only implementation

Appropriate for a marketing-only gym website, but insufficient for the booking, authorization, capacity, and waitlist goals of this portfolio project.

### Microservices

Adds networking, distributed transactions, deployment complexity, and observability work without evidence that separate services are needed.

### Separate frontend and backend repositories

Possible later, but unnecessary for the first release. A single application can still maintain strict domain and adapter boundaries while being easier for recruiters to run and review.
