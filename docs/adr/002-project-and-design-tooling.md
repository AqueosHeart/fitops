# ADR 002 Use Repository Centered Planning and Design Tools

## Status

Accepted for initial implementation

## Context

FitOps needs sprint tracking, interface design, architecture diagrams, database modeling, and API documentation. Using unrelated tools without ownership rules would create duplicate and conflicting specifications.

## Decision

- Use GitHub Projects, Issues, and pull requests for sprint execution and engineering history.
- Use Figma for interface design and prototypes.
- Store architecture and flow diagrams as Mermaid in Markdown.
- Store the conceptual database model as DBML and visualize it with dbdiagram.io when useful.
- Treat the Prisma schema and committed migrations as the executable database source of truth.
- Store the REST contract as OpenAPI in the repository.

## Consequences

### Benefits

- Sprint work links directly to implementation and verification.
- Important technical artifacts are version controlled and reviewable.
- Recruiters can inspect decisions without receiving access to private tools.
- Database and API changes have explicit ownership and change workflows.

### Costs

- Figma and GitHub Projects contain external state that must be linked carefully.
- Conceptual diagrams must be updated when authoritative implementation contracts change.
- A solo project uses a Scrum-inspired process rather than every formal Scrum role.

## Rejected alternatives

### Trello as the primary sprint board

It provides a simple board but separates work items from issues, pull requests, CI results, and repository evidence.

### Figma as the database source of truth

Visual diagrams are helpful for discussion but cannot safely define migrations, constraints, or production state.

### The live database as the source of truth

Manual state cannot be reproduced or reviewed reliably. Versioned schemas and migrations are required.

### Documentation only in external tools

External links can become inaccessible and produce weak portfolio evidence. Core decisions must remain in the repository.
