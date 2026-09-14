---
type: concept
project: FitOps
updated: 2026-09-14
---

# Modular Monolith

FitOps will deploy as one Next.js application while separating identity, membership, scheduling, and booking responsibilities. Domain and application logic cannot depend directly on React, route handlers, Prisma, or PostgreSQL.

This choice keeps deployment understandable while allowing core booking rules to be tested without a browser, network, or database.

## Connections

- [[../projects/FitOps]]
- [[Database Source of Truth]]
- [Architecture](../../../docs/architecture.md)
- [ADR 001](../../../docs/adr/001-modular-monolith.md)
