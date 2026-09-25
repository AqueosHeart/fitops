---
type: session-log
project: FitOps
date: 2026-09-23
---

# Issue #8 schema design start

- Goal: define how the physical PostgreSQL/Prisma schema should represent the completed Issue #7 domain boundaries and booking rules.
- Evidence: GitHub Issue #8 is open with only a `## Summary` body; the conceptual DBML still describes one product `ClassSession`. ADR 008 assigns calendar definition to Scheduling and reservation policy/participation to Booking.
- Drafted [the physical schema plan](../../../docs/database/physical-schema-plan.md): one-to-one `session_slots` and `bookable_sessions` sharing a UUID, separate bookings and waitlist rows, relevant checks and partial uniqueness, a session-local queue counter, migration review, and real PostgreSQL concurrency proof.
- Decision status: proposed for review. No executable schema, migration, seed, database test, or application implementation was created. Issue #8 stays open and the Sprint 0/Sprint 1 implementation gate still applies.
- Open checks: pin Prisma/PostgreSQL versions and Auth.js persistence strategy; decide whether trainer specialties need filtering and whether Booking's snapshot needs a program label.
- Next safe action: review the proposal, settle the open checks, then implement and test the physical schema after the project gates are met.
