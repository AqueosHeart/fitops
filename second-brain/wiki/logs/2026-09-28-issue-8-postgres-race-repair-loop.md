---
type: session-record
project: FitOps
date: 2026-09-28
---

# Issue #8 PostgreSQL Race Repair Loop

## Goal

Continue the interrupted Issue #8 implementation through independent audit, repair, and review cycles.

## Decisions and changes

- Raised the TypeScript target to ES2020 for Prisma `BigInt` values.
- Kept direct-booking and waitlist results distinct (`ALREADY_BOOKED` versus `ALREADY_WAITING`) so future HTTP handlers can honor the API contract.
- Added bounded full-transaction retries for PostgreSQL deadlock, serialization, and Prisma write-conflict shapes.
- Guarded cancellation and capacity promotion against non-scheduled sessions.
- Replaced unsynchronized `Promise.all` checks with UUID-isolated fixtures, held PostgreSQL row locks, and observed lock waits. Added coverage for final-seat, queue-position, cancellation/booking, cancellation/waitlist, capacity/booking, capacity/cancellation, ineligible/multi-seat promotion, cutoff rollback, and injected promotion-write rollback.

## Evidence

- `npm run test:race`: 10 passing synchronized PostgreSQL tests.
- `tsc --noEmit --incremental false`: passed.
- Independent final review found no P0/P1 blocker for this database/race-proof scope.
- The production build compiled and began TypeScript checking, but did not finish in the desktop command window; do not claim it passed.

## Unresolved and next action

- The app still has no Auth.js credentials flow, authenticated HTTP handlers, server-side authorization, API contract tests, or product UI. Implement the secure HTTP/auth boundary before connecting any client UI to booking services.
