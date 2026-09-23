# ADR 007 Keep seat allocation and waitlist promotion in one consistency boundary

## Status

Accepted for design; implementation remains unverified

## Context

ADR 001 selects a modular monolith with separate Scheduling and Booking modules. Scheduling owns class-session policy (time, status, capacity, cutoff); Booking owns confirmed bookings, waitlist entries, and promotion. Product rules require no overbooking, no overlapping confirmed classes for one member, and promotion of the first eligible waiting member in the same transaction as cancellation. An administrator may edit capacity while members book. Merely reading counts before a write cannot preserve these rules under concurrency.

The editable draw.io flows already require server-side rechecks, a configured cutoff, FIFO promotion, and rollback of the whole cancellation operation. This ADR specifies their ownership and transaction design. It does not add new screens, routes, services, or an event broker.

## Decision

1. Keep Identity, Membership, Scheduling, and Booking as domain modules in one deployed monolith. Administration is an authorized application interface, not an independent owner of session or booking state.
2. Scheduling owns mutable class-session policy. Booking owns participant state and makes seat-allocation decisions using the current policy. An application use case coordinates them through narrow ports and one PostgreSQL transaction; neither domain module imports the other's adapter or ORM model.
3. For booking, waitlist entry, cancellation/promotion, waitlist removal, and session edits affecting participation, lock the affected `class_sessions` row before testing or changing occupancy. For a command that can confirm a member, also lock that member's `member_profiles` row before the overlap query and mutation. Every command uses session-before-member order. Re-read policy, eligibility, occupancy, queue state, and overlaps after acquiring the relevant locks. Lock each promoted candidate's member row before deciding eligibility. A transaction may retry from the beginning on serialization failure or deadlock; retries are bounded and return a stable failure if exhausted.
   Read the database clock after the locks are acquired for cutoff evaluation; a transaction that waited past cutoff must be rejected.
4. Cancellation and FIFO promotion commit together. The session's `capacity` never changes because a member cancels. The first currently eligible waiting entry is promoted; an ineligible entry is marked `expired` as the current UX flow specifies, then the scan continues. Eligibility includes active member profile, signed waiver, no confirmed duplicate or overlapping class, scheduled session, and the session's configured cutoff. Once cutoff passes, member cancellation is rejected, so this command cannot promote after cutoff.
5. An administrator may increase or reduce capacity while maintaining `confirmedCount <= capacity`. If any confirmed booking or waiting entry exists, program, trainer, start/end time, and configured cutoff are immutable in the MVP. Session cancellation/deletion and participant migration are separate, out-of-scope operations. Trainer assignments must not overlap under concurrent creates/edits; scheduling mutations serialize on the trainer profile before checking overlaps.
6. PostgreSQL constraints backstop positive capacity, valid time intervals, active booking uniqueness, and waiting-entry uniqueness. Cross-table participation checks, overlap, and occupancy require the locking protocol plus integration tests. The conceptual DBML remains explanatory; Issue #8 will express the executable details in Prisma schema and committed SQL migrations.

## Rationale and trade-offs

The module split retains clear language and ownership while one database transaction protects the business invariant. Session-row locking serializes all writers for a session; member-row locking serializes confirmations for one member across sessions. Keeping a session's participant rows in separate tables avoids a large in-memory aggregate. The cost is contention on popular sessions and a strict lock protocol that every write path must obey. Deadlocks across two session transactions scanning different waiting members remain possible and require whole-transaction retry.

## Rejected alternatives

- **Eventual promotion through an event or job:** violates the same-transaction product rule and briefly exposes inconsistent availability.
- **Read count, then insert without a lock:** two final-seat requests can both pass the read.
- **Only a unique `(member_id, session_id)` index:** prevents duplicates for one session but not two overlapping sessions or total overcapacity.
- **Copy Scheduling policy into Booking as independent mutable state:** creates conflicting owners and stale-cutoff risk.
- **Allow time/trainer/cutoff edits after participation:** would require migration, cancellation, or member notification rules outside the present MVP.

## Consequences and verification

- All participation mutations and admin capacity edits must share the session-lock protocol; confirm this with database integration tests against PostgreSQL, including synchronized concurrent transactions.
- A member confirmation must acquire the member lock and recheck overlapping confirmed sessions. Cross-session overlap cannot be expressed by a simple foreign key or ordinary uniqueness constraint.
- The UI may show stale availability or position; the write result remains authoritative and returns a stable conflict/refresh path.
- Automatic promotion expires an ineligible waiting entry. This is simple and matches the current flow, but a temporary conflict can lose queue position; product review may supersede this policy in a later ADR.
- No numerical performance target or implementation success is claimed until code, migration, and concurrency tests exist.

## Related evidence

- [Product rules](../product-requirements.md)
- [Architecture](../architecture.md)
- [Conceptual data model](../data-model.md)
- [Issue #7 use cases and test matrix](../../second-brain/wiki/design/Issue%207%20Domain%20Boundaries%20and%20Use%20Cases.md)
- [ADR 001](001-modular-monolith.md)
