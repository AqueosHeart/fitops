# Issue #8 physical schema review

Date: 2026-09-23. This is the **first-pass historical review** of the original two-table proposal. Its findings are addressed at the design level in the [revised plan](physical-schema-plan.md) and assessed in the [second review](physical-schema-second-review.md). Scope: the original proposal against the [product rules](../product-requirements.md), [REST contract](../api.md), [conceptual model](../data-model.md), [Issue #7 transaction design](../../second-brain/wiki/design/Issue%207%20Domain%20Boundaries%20and%20Use%20Cases.md), and [ADR 008](../adr/008-booking-owns-reservable-session.md). No executable schema or database test has been run.

## Verdict

The one-to-one `SessionSlot`/`BookableSession` split matches ADR 008, and the row-lock protocol is a credible direction. The proposal is **not yet a physical schema specification**. It leaves several required invariants and persistence choices to implementation, where choosing defaults could change behavior. Resolve the high findings below before generating a migration. Keep Issue #8 open.

## High findings

### H1. The persisted Booking snapshot has no enforceable consistency rule

The proposal stores program, trainer, and interval in both `session_slots` and `bookable_sessions`, then calls any mismatch an integrity failure ([plan lines 19–24](physical-schema-plan.md)). No constraint, reconciliation query, or required update-path test is defined. The proposed application transaction would roll back both sides on failure, but a maintenance script or later write path could update just one table. Public discovery could then show the Scheduling time while cutoff and member-overlap checks use Booking's different time.

**Resolve:** Compare three physical mappings before accepting the split: one `class_sessions` table with module-specific repository mappings, two tables with Booking translating the Scheduling interval at read time, or two tables with a persisted Booking snapshot. ADR 008 requires a domain snapshot, but does not explicitly require duplicate physical columns. If persisted, enumerate its exact fields, canonical source, atomic create/edit path, lock order, and a consistency test that intentionally attempts an out-of-sync update. If not persisted, define the adapter translation and lock/read sequence. Do not let public and booking queries silently read different intervals.

### H2. Authentication storage is incomplete for the promised registration flow

The proposed `users` row says only “credential verifier,” while the API requires password registration, login, and a recovery experience ([plan lines 15 and 47](physical-schema-plan.md); [API](../api.md)). Auth.js Credentials does not persist credential records by default; the application must provide that persistence and verification. Its session strategy and any adapter tables are still undecided. The UX currently says recovery does not send email, so a reset-token table cannot be assumed from the route name alone.

**Resolve:** Specify the exact credential field/storage ownership, password-hash migration and demo-account seeding policy, Auth.js session mode, and whether the recovery screen is a real reset or a guided demo-only state. Then list only the session/account/token tables actually needed. [Auth.js Credentials documentation](https://authjs.dev/getting-started/authentication/credentials).

### H3. One active participation across bookings and waitlist entries needs an explicit transition contract

The two partial unique indexes stop duplicate confirmed rows and duplicate waiting rows separately. They cannot stop one member from being both confirmed and waiting for the same session. The proposal acknowledges this, but its “if the product requires” wording makes the backstop decision sound optional ([plan lines 21–34](physical-schema-plan.md)). The **business invariant** is mandatory in the requirements and Issue #7, whether enforced by a shared table, database trigger, or the accepted locked transaction protocol.

**Resolve:** State the invariant without qualification. List every writer: direct booking, waitlist join/removal, cancellation, promotion, capacity edit, and any demo reset/seed operation. Require the same session lock and post-lock duplicate checks on each relevant path. For promotion, the waiting-to-promoted status change and confirmed-booking insert must commit together. Test that direct booking against an existing waiting entry fails, and that a race between waitlist removal/promotion and another action never leaves both active states. A database backstop is an optional strengthening decision; the invariant itself is not optional.

### H4. Column types and relation actions are too vague to generate the intended PostgreSQL schema

The table list omits exact nullability, database types, defaults, enum/check mapping, foreign-key actions, and status/timestamp checks ([plan lines 13–22](physical-schema-plan.md)). This matters for time: Prisma's documented PostgreSQL default for `DateTime` is `timestamp(3)`, while the conceptual model requires timezone-aware instants. An unqualified field would silently differ from the intended `timestamptz`. The conceptual DBML also specifies cascade/restrict relationships that the physical plan does not confirm.

**Resolve:** Add a field-level matrix or draft Prisma schema before migration review. Specify `@db.Timestamptz(...)` for instant fields, UUID storage, bigint queue values, required versus nullable columns, default values, and every `onDelete`/`onUpdate` action. Add checks such as `cancelled_at` present iff booking status is cancelled, and `resolved_at` present iff a waitlist entry is no longer waiting, unless a documented state transition needs an exception. [Prisma native type mappings](https://docs.prisma.io/docs/orm/reference/prisma-schema-reference); [Prisma relational modeling](https://www.prisma.io/docs/orm/data-modeling/relational-databases).

## Medium findings

### M1. Trainer overlap has no database backstop despite living in one table

The proposal relies on locking a trainer row before checking for another `session_slots` interval ([plan line 19](physical-schema-plan.md)). That protocol can work, but a direct seed, migration, or future write path can bypass it. Unlike member booking overlap, trainer and interval are stored on the same table, so PostgreSQL can reject overlap using an exclusion constraint on trainer ID and a half-open `tstzrange` (with `btree_gist`). Decide whether to add this backstop in reviewed SQL; if omitted, record why and test every write path. [PostgreSQL range and exclusion constraints](https://www.postgresql.org/docs/current/rangetypes.html).

### M2. “Before participation exists” does not say whether historical rows freeze session edits

ADR 008 and the API freeze program, trainer, time, cutoff, and status after the session has received a booking or waitlist entry. The proposal says only “before participation exists” ([plan lines 20 and 24](physical-schema-plan.md)). If an implementation checks *current* confirmed/waiting rows, it could move a session after all participants cancel or resolve, changing the meaning of retained history. Define the rule as “after any participation row has ever existed” unless the product explicitly decides otherwise, and test it. Also define the relationship between Scheduling lifecycle and Booking reservation status; the proposal gives Scheduling no lifecycle field despite ADR 008 assigning it that responsibility.

### M3. State-history links and timestamp consistency are unspecified

On promotion, the proposal marks a waitlist entry `promoted` and creates a booking, but does not link the two records. A `source_waitlist_entry_id` unique nullable FK on bookings, or the reverse link, would make the promotion auditable and simplify duplicate-promotion investigation. Specify whether it is needed for MVP, plus the exact meaning of `booked_at` for promoted bookings. Define allowed status/timestamp pairs for cancellation, promotion, expiry, and waitlist removal. This can be resolved without adding a new user-facing feature.

### M4. Fictional plan catalog has no declared source

The API promises `GET /membership/plans` and registration validates against **published** demo plans, while the proposed schema only stores a plan code on MemberProfile. A fixed code enum alone does not say which plans are published or where their names/descriptions live. Choose a versioned in-code catalog for the three fictional plans or a `membership_plans` table, then make registration and the public endpoint read the same source. Do not add payment or subscription tables.

## Implementation evidence to add to Issue #8

- Field-level schema and reviewed migration SQL, including exact PostgreSQL-native time types, FKs/actions, checks, and indexes.
- Fresh-database migration and schema-drift checks; rejected-write tests for each database constraint.
- Transaction tests for Issue #7's seven interleavings, plus cross-table participation, snapshot consistency, trainer overlap, and historical edit freeze.
- A cutoff test that blocks on a row lock until cutoff passes and uses `clock_timestamp()` after the lock. PostgreSQL `now()` is fixed at transaction start and would give the wrong answer in that case. [PostgreSQL date/time functions](https://www.postgresql.org/docs/current/functions-datetime.html).
- Explicit evidence that all seed and reset paths use fictional data and preserve or intentionally recreate the same invariants.
