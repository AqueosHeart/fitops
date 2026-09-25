# ADR 009 Map Scheduling and Booking views to one physical session row

## Status

Accepted for design; executable schema and PostgreSQL behavior remain unverified.

## Context

[ADR 008](008-booking-owns-reservable-session.md) assigns calendar definition to Scheduling and reservation policy/participation to Booking. It permits separate physical tables or a mapped implementation. The first Issue #8 proposal chose `session_slots` and `bookable_sessions` with duplicate program, trainer, and interval columns. Its review found no reliable way to detect a future write to only one copy. The MVP has one PostgreSQL database and no independently deployed services.

## Decision

1. Use one physical `class_sessions` row per user-visible session. Scheduling owns its program, trainer, start, and end columns through a `SessionSlot` repository port. Booking owns capacity, cutoff, reservation status, queue counter, and participation through a `BookableSession` repository port. These are separate domain views of one row, not a shared domain entity. Neither domain imports the generated Prisma type or the other's adapter.
2. The application transaction coordinator owns the database transaction and maps the row to each context. All participation and capacity writes lock the `class_sessions` row. A member confirmation also locks the relevant `member_profiles` row. This retains ADRs 007–008's session-before-member order and immediate overlap rule.
3. An administrator create command validates Scheduling fields, creates the row with Booking policy in the same transaction, and exposes one session ID. Before any participation row has **ever** existed, the administrator may edit the permitted Scheduling and Booking fields under the trainer/session locks. After any booking or waitlist entry has existed, only capacity may change, and never below confirmed occupancy. Historical rows are retained.
4. Use a PostgreSQL exclusion constraint to prevent trainer-time overlap, plus the trainer-row lock and application check for a stable domain error. The exclusion constraint applies to all persisted session intervals in the MVP; cancellation/reuse semantics require a later decision.
5. Keep separate `bookings` and `waitlist_entries` tables to preserve the established API identities and history. Partial unique indexes backstop duplicate confirmed and duplicate waiting rows. The mandatory cross-table active-participation invariant, capacity, member-time overlap, and FIFO promotion use the shared locked transaction protocol and synchronized PostgreSQL tests. No trigger or third participation table is added for MVP.

## Consequences

- One interval is authoritative for public discovery, trainer schedules, cutoff, and member-overlap checks. There is no persisted Booking copy to drift.
- Physical table ownership is column and adapter based. A migration review and module-boundary check must reject direct Prisma imports in domain/application code or one context's adapter calling the other context's adapter.
- The row is a contention point, already required by the accepted consistency protocol. This is appropriate for the single-database MVP and needs concurrency tests before claiming correctness.
- This decision selects ADR 008's permitted physical mapping. ADR 008's domain ownership and ADR 007's transaction safeguards remain accepted; neither historical ADR is rewritten.

## Alternatives considered

- **Two tables with duplicated Scheduling data:** exposes a drift risk without an independently needed read model.
- **Two tables without a persisted Booking interval:** preserves separation but requires a cross-table translation and lock/read path for every booking decision. It adds joins and lifecycle states without a current product need.
- **One participation table:** can backstop cross-table active uniqueness, but changes the established Booking/WaitlistEntry history and API identity mapping. Revisit if transaction tests or later requirements justify it.

## Verification gate

The [Issue #8 physical schema plan](../database/physical-schema-plan.md) specifies fields and checks. Review migration SQL and run PostgreSQL constraint and synchronized race tests after the Sprint 0 and Sprint 1 design gates. This ADR is a design decision, not implementation evidence.
