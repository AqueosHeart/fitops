# FitOps

FitOps is a fictional gym class-booking and operations product built as a software-engineering portfolio project. It combines a public marketing site with a working member experience and an administrative workflow.

The project is intentionally planned before implementation. The objective is to demonstrate product thinking, business-rule design, relational data modeling, REST API design, testing, accessibility, security, CI, and deployment rather than only visual styling.

## Product statement

FitOps helps gym members find and reserve classes while giving gym staff a dependable way to manage schedules, capacity, cancellations, and waitlists.

## Primary portfolio signal

A recruiter should be able to verify that the author can take a product from an ambiguous idea to a documented, tested, and deployed full-stack system.

## Planning documents

- [Product requirements](docs/product-requirements.md)
- [UX plan](docs/ux-plan.md)
- [Architecture](docs/architecture.md)
- [Data model](docs/data-model.md)
- [Conceptual database schema](docs/database/fitops.dbml)
- [REST API contract](docs/api.md)
- [Eight-phase SDLC and sprint plan](docs/delivery-plan.md)
- [Engineering tooling and workflow](docs/tooling-and-workflow.md)
- [ADR 001 Modular monolith](docs/adr/001-modular-monolith.md)
- [ADR 002 Repository centered planning and design tools](docs/adr/002-project-and-design-tooling.md)

## Obsidian project memory

The repository is also an Obsidian-compatible vault. Open the repository root in Obsidian and start at [FitOps Knowledge Index](second-brain/index.md). The second brain stores linked project knowledge, decisions, sprint context, and templates without committing API keys, plugin state, or private data.

See [second-brain setup and safety](second-brain/README.md) and [references and attribution](NOTICE.md).

## Proposed stack

- Next.js with React and TypeScript
- PostgreSQL
- Prisma ORM with explicit database constraints and transactions
- Auth.js for authentication
- Zod for boundary validation
- Vitest and React Testing Library
- Playwright for end-to-end tests
- GitHub Actions for continuous integration
- Vercel for the application and a managed PostgreSQL provider for the demo database

The provider names are deployment choices, not domain dependencies. Core booking rules must be testable without a browser, network, or live database.

## Current status

Planning only. No application functionality has been implemented yet. Delivery is organized through an eight-phase SDLC and one-week sprints; the current work belongs to Sprint 0.
