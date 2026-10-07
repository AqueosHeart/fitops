---
type: session-record
project: FitOps
date: 2026-09-25
issue: 8
---

# Issue #8 initial schema migration

## Changes

- Added the complete physical data-model graph: User, MemberProfile, TrainerProfile, Program, ClassSession, Booking, and WaitlistEntry.
- Generated the initial Prisma migration in create-only mode and reviewed its SQL before applying it.
- Added reviewed PostgreSQL-only SQL for normalized email and state checks, partial active-participation indexes, composite promotion provenance, `btree_gist`, trainer interval exclusion, and restrictive foreign keys.

## Verification

- `npx prisma validate` passed.
- The migration applied to the empty local `fitops` PostgreSQL database; all seven domain tables exist.
- `npx prisma generate` and `npm run lint` passed.

## Next action

Create fictional seed data, implement adapter and transaction boundaries, then add synchronized PostgreSQL proof for the booking, waitlist, cancellation, and capacity-increase races.
