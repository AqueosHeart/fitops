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

The handler validates an internal `returnTo` value and then redirects or responds with the restored member-workspace destination. It never accepts an external redirect URL.

Expected failures:

- `409 EMAIL_ALREADY_REGISTERED`
- `422 CONSENT_REQUIRED`
- `422 INVALID_PLAN_CODE`
- `422 INVALID_RETURN_TO`

### `POST /api/v1/auth/login`

Authenticates an existing member or a fictional demo persona and restores a validated internal `returnTo` destination. This endpoint is reached from the secondary public-header `My Account` utility, `/join`, a protected-route redirect, or a direct `/portal/login` request; it is not a generic global Sign In action.

### `GET /api/v1/me/membership`

Returns the authenticated member's active or inactive status, selected fictional plan, waiver status, and permitted member-workspace routes. It does not expose payment or billing data because none exists in version one.

## Member endpoints

### `GET /api/v1/me/bookings`

Returns the authenticated member's upcoming confirmed bookings and waitlist entries.

### `POST /api/v1/sessions/{sessionId}/bookings`

Creates a confirmed booking when capacity exists. Returns `201 Created`.

Expected failures:

- `401 UNAUTHENTICATED`
- `403 MEMBERSHIP_INACTIVE`
- `404 SESSION_NOT_FOUND`
- `409 ALREADY_BOOKED`
- `409 BOOKING_CONFLICT`
- `409 SESSION_FULL`
- `422 BOOKING_CUTOFF_PASSED`

### `DELETE /api/v1/bookings/{bookingId}`

Cancels the authenticated member's booking. If eligible, promotes the first waitlisted member transactionally. Returns `204 No Content`.

### `POST /api/v1/sessions/{sessionId}/waitlist`

Adds the authenticated member to a full session's waitlist. Returns `201 Created` with current position.

### `DELETE /api/v1/waitlist/{entryId}`

Removes the authenticated member from the waitlist. Returns `204 No Content`.

## Administrator endpoints

### `GET /api/v1/admin/sessions`

Returns operational session information, including confirmed and waiting counts.

### `POST /api/v1/admin/sessions`

Creates a scheduled class session after validating trainer, time, capacity, and overlaps.

### `PATCH /api/v1/admin/sessions/{sessionId}`

Updates allowed session fields. Capacity cannot be reduced below confirmed bookings.

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
