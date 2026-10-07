---
type: session-record
project: FitOps
date: 2026-09-24
---

# Issue #8 revision and second review

## Goal and decisions

The user asked to fix and upgrade the Issue #8 physical schema proposal, then review it again. ADR 009 chooses one physical `class_sessions` row with separate Scheduling and Booking domain views. The revised plan specifies identity storage, column types, relational constraints, referential actions, indexes, transaction locking, and migration proof. ADR 010 closes a newly found fairness gap: capacity increases before cutoff promote eligible waiters FIFO within the same transaction; an increase after cutoff is rejected while waiting entries remain.

## Evidence and state

The conceptual DBML parsed, the canonical draw.io XML parsed, the updated administrator Mermaid diagram rendered, and local UX synchronization/wireframe checks passed. The [second review](../../../docs/database/physical-schema-second-review.md) distinguishes design resolutions from executable proof. No Prisma schema, migration, PostgreSQL race test, or native Figma/Penpot visual approval exists. Issue #8 is open; Sprint 0 and Sprint 1 design gates and Issue #9 security choices still govern implementation.

## Next safe action

After the design gates, pin stack versions, implement and inspect the migration SQL, then run rejected-write and synchronized PostgreSQL race tests before claiming Issue #8 complete.
