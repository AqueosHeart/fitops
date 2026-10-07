# FitOps REST API Contract

## Conventions

- Base path: `/api/v1`
- JSON request and response bodies
- Authenticated identity comes from the server session, never a client-supplied user ID
- Dates use ISO 8601 UTC strings
- Validation failures return field-level details
- Expected domain failures return stable machine-readable codes

## Response shapes

Successful single-resource response:

```json
{
  "data": {}
}
```

Expected error response:

```json
{
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "This class overlaps another confirmed booking.",
    "fields": {}
  }
}
```

## Public endpoints

### `GET /api/v1/membership/plans`

Returns the published fictional plan catalog used by `/pricing` and `/join`. Each response must state that the plans are demo-only and that no payment is collected. It returns no payment-provider, billing, or checkout fields.

### `GET /api/v1/programs`

Returns published programs.

### `GET /api/v1/sessions`

Filters: `from`, `to`, `program`, `trainer`, `availability`, and `cursor`.

Returns session summaries with computed availability. Pagination is cursor-based.

### `GET /api/v1/sessions/{sessionId}`

Returns program, trainer, schedule, capacity, confirmed count, availability, and booking cutoff.

## Authentication and fictional enrollment endpoints

### `POST /api/v1/auth/register`

Creates a fictional demo member identity and active `MemberProfile` after validation of name, normalized email, password, terms/privacy consent, liability-waiver consent, and `selectedPlanCode` (`base`, `complete`, or `training_plus`). The selected plan is a demo enrollment only: the request must reject payment, card, billing, checkout, and provider fields.

User, profile, selected plan, `termsPrivacyAcceptedAt`, and `waiverSignedAt` are committed atomically. No PAR-Q answers or health information are stored. Existing fictional demo profiles without a signed waiver use the in-app waiver step before a booking attempt.

If Better Auth cannot issue the initial database session after account creation, the handler removes the new user, credential account, member profile, and any partial session before returning `500 INTERNAL_ERROR`; the failed registration does not leave an unusable account.

The handler validates an internal `returnTo` value and then redirects or responds with the restored member-workspace destination. It never accepts an external redirect URL.

Expected failures:

- `409 EMAIL_ALREADY_REGISTERED`
- `422 CONSENT_REQUIRED`
- `422 INVALID_PLAN_CODE`
- `422 INVALID_RETURN_TO`
- `500 INTERNAL_ERROR` if the initial session cannot be issued; the account creation is rolled back

### `POST /api/v1/auth/login`

Authenticates an existing member or a fictional demo persona and restores a validated internal `returnTo` destination. This endpoint is reached from the secondary public-header `My Account` utility, `/join`, a protected-route redirect, or a direct `/portal/login` request; it is not a generic global Sign In action.

### `GET /api/v1/me/membership`

Returns the authenticated member's active or inactive status, selected fictional plan, waiver status, and permitted member-workspace routes. It does not expose payment or billing data because none exists in version one.

Member access is based on an owned MemberProfile, not on `User.role === member`; a trainer or administrator with a MemberProfile may use member actions under the same eligibility checks.

### `POST /api/v1/me/waiver`

Records an authenticated MemberProfile owner's explicit acceptance from the existing liability-waiver modal. The server stores `waiverSignedAt` and returns the signed state and timestamp; it stores no PAR-Q answers or health data. Repeated acceptance returns the existing signed state without changing the original timestamp. Missing profile is forbidden. Signing the waiver does not create a booking or bypass the next booking request's eligibility and capacity recheck.

## Member endpoints

### `GET /api/v1/me/bookings`

Returns the authenticated member's upcoming confirmed bookings and active waitlist entries. Each confirmed booking includes `startsAt`, `endsAt`, and `cancellationCutoffAt` (the session start minus its configured cutoff) so the interface can explain whether cancellation is currently available. The server remains authoritative and rechecks the cutoff during `DELETE /api/v1/bookings/{bookingId}`.

### `POST /api/v1/sessions/{sessionId}/bookings`

Creates a confirmed booking when capacity exists. Returns `201 Created`.

The server checks an owned MemberProfile, active demo membership, waiver, scheduled status, session-specific cutoff, duplicate active participation, member-time overlap, and capacity inside the Booking transaction defined by ADRs 007 and 008. A trainer or administrator with a MemberProfile may book; their staff role alone is insufficient. An existing waiting entry blocks direct booking until it is removed or promoted. A stale public availability display never reserves a seat.

Expected failures:

- `401 UNAUTHENTICATED`
- `403 MEMBERSHIP_INACTIVE`
- `403 WAIVER_REQUIRED`
- `404 SESSION_NOT_FOUND`
- `409 ALREADY_BOOKED`
- `409 ALREADY_WAITING`
- `409 BOOKING_CONFLICT`
- `409 SESSION_FULL`
- `500 PARTICIPATION_INVARIANT_BROKEN` only if a free seat and waiting entry coexist after the session lock; return a generic message, record a server-side alert, and require explicit data repair rather than booking ahead of the queue.
- `422 BOOKING_CUTOFF_PASSED`

### `DELETE /api/v1/bookings/{bookingId}`

Cancels the authenticated member's booking. If eligible, promotes the first waitlisted member transactionally. Returns `204 No Content`.

The request is allowed only for the booking owner before the session's configured cutoff. A successful response means the cancellation and any FIFO promotion/expiry were committed together; configured capacity is unchanged. After each candidate member lock, the server rechecks the database-clock cutoff, active membership, waiver, duplicate confirmation, overlap, and session status. A cutoff that passes during a lock wait rolls back the entire cancellation. Ineligible entries become `expired` as specified in the current UX flow. A repeat DELETE for an already-cancelled booking returns `204` only when the authenticated caller still owns the original booking; it performs no second promotion. Other callers receive `403`, and an unknown booking receives `404`.

Expected business failure: `422 BOOKING_CUTOFF_PASSED`. A transaction failure never returns `204`.

### `POST /api/v1/sessions/{sessionId}/waitlist`

Adds the authenticated member to a full session's waitlist. Returns `201 Created` with current position.

It checks the owned MemberProfile, active membership, waiver, session status, and configured cutoff. Joining a waitlist does not check overlap with another confirmed session; promotion does, and an ineligible entry then expires under the current policy. The session must still be full when the transaction commits. If a seat opened and no one is waiting, return `409 SEAT_AVAILABLE` with current availability so the member can choose Book; do not silently book or waitlist. If a free seat and waiting entry coexist, return the same generic `500 PARTICIPATION_INVARIANT_BROKEN` response and server alert as direct booking; neither action silently repairs or bypasses the queue. A duplicate waiting entry returns `409 ALREADY_WAITING`; an existing confirmed booking returns `409 ALREADY_BOOKED`. Queue ordering is unique and monotonic within a session. The returned position is a snapshot and may change.

### `DELETE /api/v1/waitlist/{entryId}`

Removes the authenticated member from the waitlist. Returns `204 No Content`.

Only a currently `waiting` entry may be cancelled. If promotion already committed, return `409 WAITLIST_ALREADY_PROMOTED` with the current confirmed-booking state; the member must use the booking cancellation operation if still before cutoff. Repeated removal of an already-cancelled owned entry returns `204` without a second state change.

## Trainer endpoints

### `GET /api/v1/trainer/sessions`

Returns only sessions assigned to the authenticated trainer profile, with schedule and attendee counts. This read-only endpoint does not grant trainer editing or disclose other trainers' assignments. A missing trainer profile or role is forbidden. No participant names are returned by this endpoint.

Each item contains `sessionId`, program name, `startsAt`, `endsAt`, session status, `capacity`, and `confirmedCount`. The member list remains available only through the administrator participants endpoint in the MVP.

## Administrator endpoints

### `GET /api/v1/admin/sessions`

Returns operational session information, including confirmed and waiting counts.

### `POST /api/v1/admin/sessions`

Creates a scheduled class session after validating trainer, time, capacity, and overlaps.

Internally, this command creates the Scheduling `SessionSlot` and publishes its translated Booking `BookableSession` in the same local transaction. They are one user-visible session; this is a domain-boundary translation, not a second public resource or route.

### `PATCH /api/v1/admin/sessions/{sessionId}`

Updates one or more of `programId`, `trainerId`, `startsAt`, `endsAt`, `capacity`, and `bookingCutoffMinutes`. Unknown fields (including `status`), an empty object, malformed values, and bodies over 16 KiB are rejected. Session cancellation/deletion remain outside this endpoint.

Once any booking or waitlist entry has ever existed, only capacity may change, and it cannot be set below confirmed occupancy. Program, trainer, start/end, or cutoff changes return `409 SESSION_HAS_PARTICIPANTS`, even when all historical entries are inactive. Before participation has ever existed, those Scheduling fields may change with normal reference and interval validation; trainer-time overlap is checked while holding the trainer row lock and remains backed by the PostgreSQL exclusion constraint. Capacity writes serialize with booking and promotion using the BookableSession lock defined by ADRs 007 and 008.

Other domain failures include `422 INVALID_REFERENCE`, `422 INVALID_INTERVAL`, `422 INVALID_CUTOFF`, and `409 TRAINER_OVERLAP`. Capacity below confirmed occupancy returns `409 CAPACITY_BELOW_CONFIRMED`; if an increase has waiters after cutoff, it returns `409 WAITLIST_CUTOFF_PASSED`, without changing session or queue state.

Capacity increases before the configured cutoff promote the first currently eligible waiting members in FIFO order within the same transaction, filling newly available seats until none or no eligible waiters remain. Ineligible entries become `expired`. The response returns the updated session fields, final capacity, confirmed/waiting counts, and promoted member IDs; public and protected views refresh from committed state. A decrease remains subject to the confirmed-occupancy floor. [ADR 010](adr/010-promote-waitlist-on-capacity-increase.md) records this rule. Direct booking never leaps ahead of a waiting entry if an inconsistent free-seat-plus-waitlist state is encountered.

### `GET /api/v1/admin/sessions/{sessionId}/participants`

Returns fictional booked members and ordered waitlist entries.

## HTTP status policy

- `200` successful read or update
- `201` resource created
- `204` successful deletion with no response body
- `400` malformed request
- `401` unauthenticated
- `403` authenticated but unauthorized
- `404` resource not found
- `409` state conflict
- `422` valid shape but rejected business condition
- `500` unexpected server failure with a request identifier

## Contract gate

Before UI integration, each endpoint must have request validation tests, authorization tests, expected domain-failure tests, and at least one successful integration test.
