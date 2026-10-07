---
type: session-log
project: FitOps
date: 2026-09-23
---

# Issue #8 schema review

- Goal: audit the proposed physical schema deeply for structural errors, missing logic, and unproven invariants.
- Evidence: compared the proposal to Issue #7's seven race scenarios, ADRs 007–008, product requirements, REST API, conceptual DBML, and current PostgreSQL/Prisma/Auth.js primary documentation.
- Result: [review findings](../../../docs/database/physical-schema-review.md) record four high and four medium gaps. The proposed SessionSlot/BookableSession boundary remains plausible, but the persisted snapshot can drift; authentication persistence, cross-table participation transitions, and native types/FK actions are not specified enough for a migration.
- Additional findings: consider a trainer-overlap exclusion constraint; freeze edits after any historical participation; link promoted entries to bookings; declare the source of the fictional plan catalog.
- State: Issue #8 remains open. No executable schema, migration, application change, or PostgreSQL concurrency test was run.
- Next safe action: resolve the high findings in a field-level schema and transition matrix, then revise the plan before implementation.
