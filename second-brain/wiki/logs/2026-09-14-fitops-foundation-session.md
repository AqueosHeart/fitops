---
type: session-record
project: FitOps
date: 2026-09-14
status: completed
---

# FitOps Foundation Session

## User goal

Create a portfolio project that improves the chances of obtaining an entry-level, trainee, or first software-engineering job in Culiacan or remotely from Mexico, while planning and executing it as an engineer responsible for the complete lifecycle.

## Decisions

- A static fictional gym landing page would repeat existing frontend evidence and is not sufficient as the primary project outcome.
- The concept became FitOps, a fictional full-stack gym class-booking and operations product.
- The critical product flow covers discovery, demo sign-in, class booking, full-class waitlisting, booking review, and cancellation.
- PostgreSQL was selected because the domain has structured relational data and transaction-sensitive booking rules.
- REST endpoints will expose sessions, bookings, cancellations, waitlists, and administrative operations.
- The architecture is a modular monolith. Domain and application rules remain independent of React, HTTP, Prisma, and database adapters.
- Delivery uses eight SDLC phases and one-week, Scrum-inspired sprints from Sprint 0 through Sprint 8.
- GitHub Projects manages backlog and sprint execution; Figma manages UX design; Mermaid manages repository diagrams; DBML models the conceptual database; Prisma schema and migrations become the physical database source of truth; OpenAPI becomes the REST contract.
- The public GitHub repository is `https://github.com/AqueosHeart/fitops`.
- The repository root is an Obsidian-compatible vault with a project-specific second brain.
- Third-party Obsidian plugin code, background agents, API keys, and generated caches are not committed.

## Created evidence

- Product requirements and business rules
- UX plan and critical journey
- Architecture and two ADRs
- Conceptual data model and DBML schema
- REST API contract
- Eight-phase SDLC and sprint roadmap
- Engineering-tool ownership map
- Obsidian second-brain structure, templates, board mirror, and safety rules
- Public repository with verified files on the `main` branch

## Current state

FitOps remains in planning. No application functionality has been implemented. The work is in Sprint 0 across SDLC phases 1 and 2.

## Unresolved work

- Connect the `fitops` repository to the `FitOps Delivery` GitHub Project.
- Configure project fields and views.
- Convert the approved Sprint 0 backlog into GitHub Issues.
- Review the Sprint 0 exit gate.
- Create Sprint 1 low-fidelity desktop and mobile wireframes in Figma.

## Next safe action

Connect the repository to the GitHub Project and create the Sprint 0 issues before beginning interface design or application code.
