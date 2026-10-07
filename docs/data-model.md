# FitOps Data Model

## Relationship overview

```text
User 1---0..1 MemberProfile
User 1---0..1 TrainerProfile
Program 1---* ClassSession
TrainerProfile 1---* ClassSession
MemberProfile 1---* Booking *---1 ClassSession
MemberProfile 1---* WaitlistEntry *---1 ClassSession
```

## Logical ownership after ADRs 008 and 009

`ClassSession` is the conceptual product record. [ADR 009](adr/009-one-physical-session-row.md) chooses one physical `class_sessions` table mapped through separate repository ports: Scheduling uses a `SessionSlot` view for program, trainer, and interval; Booking uses a `BookableSession` view for capacity, cutoff, status, interval, and participation. Domain code does not import Prisma models or another context's adapter. `MemberReservationCalendar` uses the member-profile row as its lock anchor and confirmed-booking intervals rather than a separate persisted table.

The revised field-level mapping, constraints, and migration proof plan are in [Issue #8's schema plan](database/physical-schema-plan.md). They remain design evidence until an executable schema and PostgreSQL tests exist.

## Entities

### User

- `id` UUID primary key
- `email` unique normalized email
- `name`
- `role` member, trainer, or administrator
- `passwordHash` credential verifier for fictional demo accounts; never plaintext
- `authVersion` positive integer used to invalidate older JWT sessions
- `createdAt`
- `updatedAt`

### MemberProfile

- `id` UUID primary key
- `userId` unique foreign key
- `status` active or inactive
- `selectedPlanCode` nullable: `base`, `complete`, or `training_plus`; records a fictional demo enrollment only
- `planSelectedAt` nullable timestamp
- `termsPrivacyAcceptedAt` nullable timestamp for existing demo personas; required for new registration
- `waiverSignedAt` nullable timestamp for legacy/demo personas; required for new registration and member booking eligibility
- `createdAt`

Only acceptance timestamps are modeled. Do not store PAR-Q answers or real health information in demo data. Registration writes User, MemberProfile, selected plan, and required consent timestamps atomically.

No payment method, billing address, transaction, invoice, subscription-provider identifier, or renewal state belongs in the version-one data model. The selected plan supports the portfolio onboarding narrative only and never represents a paid subscription.

### TrainerProfile

- `id` UUID primary key
- `userId` unique foreign key
- `bio`
- `specialties`

### Program

- `id` UUID primary key
- `slug` unique
- `name`
- `description`
- `intensity`
- `durationMinutes`
- `isPublished`

### ClassSession

- `id` UUID primary key
- `programId` foreign key
- `trainerId` foreign key
- `startsAt` timezone-aware timestamp
- `endsAt` timezone-aware timestamp
- `capacity` positive integer
- `bookingCutoffMinutes` non-negative integer
- `status` scheduled, cancelled, or completed
- `nextPositionKey` positive session-local waitlist counter

### Booking

- `id` UUID primary key
- `memberId` foreign key
- `sessionId` foreign key
- `status` confirmed or cancelled
- `bookedAt`
- `cancelledAt` nullable
- `sourceWaitlistEntryId` nullable; links a promoted booking to the matching waitlist entry

### WaitlistEntry

- `id` UUID primary key
- `memberId` foreign key
- `sessionId` foreign key
- `status` waiting, promoted, cancelled, or expired
- `positionKey` monotonically ordered value
- `joinedAt`
- `resolvedAt` nullable

## Required constraints

- Unique normalized user email
- Capacity greater than zero
- Session end later than session start
- Unique active booking per member and session
- Unique waiting entry per member and session
- One active confirmed booking **or** waiting entry per member/session, enforced by the shared transaction protocol across both tables
- Unique, monotonically allocated `positionKey` per session; resolved entries may leave gaps
- No overlapping trainer intervals, backed by a PostgreSQL exclusion constraint
- Program, trainer, interval, cutoff, and status freeze after any participation row has ever existed; capacity can still change if it remains at or above confirmed occupancy
- Participation mutations serialize on their session row and, when a member can receive a confirmed seat, on their member-profile row; this protects capacity and cross-session overlap beyond what simple uniqueness can express
- Admin capacity edits use the same session row lock and reject capacity below confirmed occupancy
- Capacity increases before cutoff promote eligible waiting members in FIFO order in the edit transaction; an increase after cutoff is rejected while waiting entries remain
- Foreign-key integrity for every relationship
- Timestamps stored in UTC and displayed in the selected local timezone

## Indexes

- Class sessions by `startsAt` and `status`
- Class sessions by `programId` and `startsAt`
- Bookings by `sessionId` and `status`
- Bookings by `memberId` and `status`
- Waitlist entries by `sessionId`, `status`, and `positionKey`

## Seed-data policy

All names, emails, biographies, schedules, and metrics must be clearly fictional. Seed data must be repeatable and safe to recreate. No copied customer, employee, gym-member, or production records are permitted.
