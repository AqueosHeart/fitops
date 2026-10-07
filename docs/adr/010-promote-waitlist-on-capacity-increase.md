# ADR 010 Promote waiting members when capacity increases

## Status

Accepted for design; implementation and PostgreSQL concurrency proof remain pending.

## Context

The MVP promises FIFO waitlist order and permits administrators to increase a session's capacity after participation exists. The Issue #7 protocol specified promotion when a booking is cancelled, but did not define what happens when an administrator creates open seats by increasing capacity. If the edit merely changes the capacity number, a new direct booking could claim a seat ahead of existing waiting members.

## Decision

1. A capacity increase before the session's configured cutoff must process waiting entries in ascending `position_key` inside the same transaction as the capacity update. Recheck each candidate's active membership, signed waiver, existing confirmation, and overlap under its member-profile lock. Mark ineligible entries `expired`; mark eligible entries `promoted` and insert linked confirmed bookings until no seat or waiting entry remains.
2. The administrator command holds the `class_sessions` row lock throughout the edit and promotion scan. It uses the database wall clock after locks and rechecks cutoff after each candidate's member lock, before confirming a promotion. If cutoff passes during the scan, the whole increase rolls back. A transaction failure rolls back the capacity change, expiries, and all promotions together. Concurrent booking, cancellation, and waitlist commands see either the old or the fully updated state.
3. If the cutoff has passed and waiting entries remain, reject a capacity increase; the command must not promote after cutoff or expose a new seat to a direct booking. Capacity reduction remains allowed when it is not below confirmed occupancy. A capacity increase after cutoff with no waiting entries may update the administrative number, but creates no booking opportunity because member commands are closed.
4. A direct booking encountering both a free seat and a waiting entry treats that state as an invariant failure and does not leapfrog the queue. The normal locked mutations must prevent this state; a repair path would require review rather than silent promotion from the read request.

## Consequences

- The first eligible waiting members receive newly opened seats in FIFO order, matching the existing fairness rule.
- `PATCH /admin/sessions/{id}` may create multiple confirmed bookings; its response and refreshed participant counts must reflect the committed result.
- Capacity increase now shares the same member-lock and bounded whole-transaction retry discipline as cancellation promotion. This extends ADR 007's promotion trigger without changing its cancellation behavior.
- No new route or screen is added. The editable administrator flow and derived views must describe the result before implementation.

## Rejected alternatives

- **Leave seats open while a waitlist exists:** allows direct bookings to bypass FIFO order.
- **Reject every capacity increase with a waitlist:** avoids the race but makes the permitted administrator capacity action unnecessarily limited.
- **Promote asynchronously:** exposes an open seat and violates immediate consistency.

## Verification

Add synchronized PostgreSQL tests for capacity increase versus direct booking and cancellation, including multiple newly available seats, an ineligible first waiter, cutoff crossing while waiting for the session lock or a candidate member lock, and injected failure after one promotion. No correctness claim is made until these pass.
