# FitOps

FitOps is a fictional gym class-booking and operations product built as a software-engineering portfolio project. It combines a public marketing site with a working member experience and an administrative workflow.

The project demonstrates product thinking, business-rule design, relational data modeling, REST API design, testing, accessibility, security, CI, and deployment rather than only visual styling.

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
- [ADR 003 draw.io UX-flow source of truth](docs/adr/003-drawio-ux-source-of-truth.md)
- [ADR 004 separate public discovery, fictional membership join, and protected workspaces](docs/adr/004-separate-public-join-and-workspace-shells.md)
- [ADR 005 direct Member Portal and dashboard entry](docs/adr/005-member-portal-and-dashboard-entry.md)
- [ADR 006 secondary My Account utility and primary Join Now CTA](docs/adr/006-public-my-account-utility.md)

## Obsidian project memory

The repository is also an Obsidian-compatible vault. Open the repository root in Obsidian and start at [FitOps Knowledge Index](second-brain/index.md). The second brain stores linked project knowledge, decisions, sprint context, and templates without committing API keys, plugin state, or private data.

See [second-brain setup and safety](second-brain/README.md) and [references and attribution](NOTICE.md).

Repository-level continuity instructions live in [AGENTS.md](AGENTS.md). Codex tasks opened from this repository read the current second-brain context before project work and update it after material changes.

## Implemented stack

- Next.js 16, React 19, and TypeScript
- PostgreSQL 16 in Docker Compose
- Prisma 7 with committed migrations and fictional seed data
- Better Auth credentials and database sessions
- Zod request validation
- Node.js test runner for API, database, authentication, and concurrency contracts

The local setup is documented in [Local development](docs/local-development.md). It recreates the schema and fictional seed on each computer; local environment files, credentials, database volumes, and user-created activity are not committed.

## Current status

The public discovery, member booking, trainer sessions, and administrator operations workflows are implemented and covered by the repository's quality CI. The Linux demo is intended for private LAN use only. Its last documented deployment runs Next.js 16.3.6; the repository's current `main` is on 16.3.8, and a new server release has not yet been verified. Public HTTPS/HSTS and a trusted proxy are not configured, so this is not a public or production deployment. See the [release readiness record](docs/release/issue-14-readiness.md) for evidence and remaining gates.
