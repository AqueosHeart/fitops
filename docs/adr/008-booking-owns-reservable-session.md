# ADR 008 Give Booking ownership of the reservable session

## Status

Accepted for design; implementation remains unverified

## Context

The Issue #7 DDD review found that ADR 007 left a strong invariant split between Scheduling, which owned capacity and cutoff, and Booking, which owned occupancy and promotion. The resulting application transaction is viable in PostgreSQL, but it makes neither bounded context the clear owner of a bookable session.

FitOps needs a clear model without turning the modular monolith into distributed services. A class can exist in the calendar before it is reservable; after it is published, reservation rules and participation must evolve together. The current MVP administrator flow creates bookable sessions immediately, so publishing is an internal step of the existing create operation, not a new screen or public endpoint.

## Decision

1. Scheduling owns `SessionSlot`: program, trainer, start time, end time, and the scheduling lifecycle. It prevents trainer-time overlap. It has no participation or seat-allocation responsibility.
2. Booking owns `BookableSession`, its `Capacity`, `BookingCutoff`, reservation status, confirmed participation, and waitlist order. `BookableSession` is the aggregate root for session-local capacity, duplicate participation, queue order, cancellation, and promotion rules.
3. `POST /admin/sessions` schedules and publishes in one synchronous application use case, creating a SessionSlot and its BookableSession together. The Booking context receives a translated value snapshot: `SessionSlotId`, program label/id, trainer id, time interval, capacity, and cutoff. Booking does not import Scheduling entities or ORM models.
4. Before the first confirmed booking or waiting entry, an administrator can amend the SessionSlot and its BookableSession snapshot in one application transaction. After participation exists, the session time, program, trainer, cutoff, and booking status are frozen for MVP. Capacity changes become the Booking command `AdjustCapacity`; it locks the BookableSession and rejects a value below confirmed occupancy.
5. `MemberReservationCalendar` is a second Booking aggregate root. It holds only the member's confirmed reservation intervals and prevents a member from confirming overlapping BookableSessions. Until Issue #8 chooses a separate physical calendar table, the owned `member_profiles` row is its lock anchor. Confirming or promoting a reservation changes both Booking aggregates in one local PostgreSQL transaction. This is an explicit exception to the default “one aggregate per transaction” guideline because the MVP requires immediate overlap prevention and contains both aggregates in one context and database.
6. ADR 007's cutoff recheck, atomic cancellation/promotion, retries, and database backstops remain in force. Its session-first then member-profile lock order is the physical realization of BookableSession then MemberReservationCalendar locking. In its Decision section, items 2 and 5 are superseded by this ADR; the remaining items continue to apply.

## Consequences

- The capacity/occupancy invariant now has one bounded-context owner: Booking.
- Scheduling and Booking use an explicit synchronous customer-supplier contract inside one application. The translation must be tested; direct entity or Prisma-model sharing is forbidden.
- A future physical schema may use separate `session_slots`, `bookable_sessions`, and `member_reservation_calendars` tables. The present DBML is conceptual and must not be treated as proof of the physical design.
- Promotion and confirmation still need a local multi-aggregate transaction. This is accepted because immediate correctness is a product rule; no asynchronous event or saga is introduced.
- A published SessionSlot that has participant records becomes less editable, which matches the existing UX and API policy.

## Rejected alternatives

- **Leave capacity in Scheduling:** preserves the DDD boundary failure that prompted this ADR.
- **Merge all Scheduling and Booking behavior:** hides trainer scheduling language inside seat allocation and expands the core context unnecessarily.
- **Use eventual consistency for overlap or promotion:** permits a member to briefly hold conflicting bookings or exposes an open seat before promotion.

## Related evidence

- [ADR 007](007-booking-consistency-boundary.md)
- [Architecture](../architecture.md)
- [Issue #7 use cases and model review](../../second-brain/wiki/design/Issue%207%20Domain%20Boundaries%20and%20Use%20Cases.md)
