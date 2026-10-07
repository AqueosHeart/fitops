---
type: session-record
project: FitOps
date: 2026-09-24
---

# Issue #8 independent third review

## Goal and decisions

The user requested another pass using a subagent. The independent audit found a cancellation cutoff race, a stale Issue #7 transaction protocol, and an undefined response for a free seat coexisting with a waiting entry. ADR 011 refines cancellation promotion to check the database clock after each candidate member lock and roll back the entire command if cutoff passed. Book and Join use the same generic invariant error and operational alert for the inconsistent free-seat-plus-waitlist state.

## Evidence and current state

The [third review](../../../docs/database/physical-schema-third-review.md) maps findings to corrections and executable tests. The Issue #7 use case, glossary, event note, and pseudocode now agree with ADRs 008–011. No Prisma schema, migration, rejected-write test, PostgreSQL race proof, or security implementation exists. Issue #8 remains open under the existing design gates.

## Next safe action

After Sprint 0 and Sprint 1 gates, pin stack versions and implement the migration. Verify constraint rejection and synchronized cancellation/capacity races, including cutoff crossing during candidate member locks, before closing Issue #8.
