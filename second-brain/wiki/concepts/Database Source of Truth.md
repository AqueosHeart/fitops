---
type: concept
project: FitOps
updated: 2026-09-14
---

# Database Source of Truth

The conceptual model is reviewed as DBML. Once implementation starts, the Prisma schema and complete committed migration history become the authoritative physical database definition.

The live PostgreSQL database and visual screenshots are runtime state, not reproducible specifications. Relationship or domain changes must update the conceptual model, schema, migration, tests, and documentation in the same pull request.

## Connections

- [[../projects/FitOps]]
- [[Modular Monolith]]
- [Conceptual DBML](../../../docs/database/fitops.dbml)
- [Data model](../../../docs/data-model.md)
