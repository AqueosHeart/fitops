---
type: architecture-review
project: FitOps
issue: 7
status: draft-for-review
updated: 2026-09-23
---

# Issue 7: Domain boundaries and use cases

> [!important] Status
> Reviewed design specification. [ADR 008](../../../docs/adr/008-booking-owns-reservable-session.md) records the chosen ownership boundary; [ADR 007](../../../docs/adr/007-booking-consistency-boundary.md) retains the transaction protocol. No application code or database migration exists to verify either. The [editable UX flow](FitOps%20User%20Flows.drawio) remains the navigation source of truth. GitHub [Issue #7](https://github.com/AqueosHeart/fitops/issues/7) currently has only a `## Summary` body.

## Sources and scope

- FitOps sources: [requirements](../../../docs/product-requirements.md), [architecture](../../../docs/architecture.md), [data model](../../../docs/data-model.md), [API](../../../docs/api.md), and [[FitOps User Flows]].
- External reference: local 2007 *Use Case Specifications and Template* PDF, pages 7–9 and 11–17. Its actor, goal, trigger, precondition, basic/alternate/exception flow, postcondition, and business-rule fields are adapted here. Project-manager signatures, frequency guesses, and diagram duplication are omitted.
- Review method: the repository's [ddd-scope](https://github.com/ForceInjection/domain-driven-design-skills/blob/main/skills/ddd-scope/SKILL.en.md), [ddd-discover](https://github.com/ForceInjection/domain-driven-design-skills/blob/main/skills/ddd-discover/SKILL.en.md), [ddd-subdomains](https://github.com/ForceInjection/domain-driven-design-skills/blob/main/skills/ddd-subdomains/SKILL.en.md), [ddd-contexts](https://github.com/ForceInjection/domain-driven-design-skills/blob/main/skills/ddd-contexts/SKILL.en.md), [ddd-context-map](https://github.com/ForceInjection/domain-driven-design-skills/blob/main/skills/ddd-context-map/SKILL.en.md), [ddd-aggregates](https://github.com/ForceInjection/domain-driven-design-skills/blob/main/skills/ddd-aggregates/SKILL.en.md), [ddd-domain-interactions](https://github.com/ForceInjection/domain-driven-design-skills/blob/main/skills/ddd-domain-interactions/SKILL.en.md), and [ddd-model-review](https://github.com/ForceInjection/domain-driven-design-skills/blob/main/skills/ddd-model-review/SKILL.en.md). Their checklists are analytical aids, not project requirements; `ddd-openspec-bridge` is deferred because no OpenSpec workflow is planned.
- MVP only: fictional membership, no payments, multi-branch support, event broker, or real-time notification delivery.

## Repeatable use case format

Copy this section for each user-goal operation. Use a separate row for every significant business-rule alternative and error. State the resulting domain state even when the operation fails.

| Field | What to specify |
| --- | --- |
| ID, goal, priority | Result-oriented verb and object, linked to an MVP requirement and route/API. |
| Primary and supporting actors | Role initiating the goal; any external system or role needed to finish it. |
| Trigger and preconditions | Starting event, then facts that must already hold. Do not confuse the trigger with a precondition. |
| Success postcondition | Observable state after success. |
| Failure postcondition | State guaranteed after rejection or infrastructure failure. |
| Basic flow | Numbered actor action and system response on the ordinary successful path. |
| Alternate flows | Business-rule branches, each tied to a basic-flow step and an end/resume point. |
| Exception flows | Validation, authorization, concurrency, and persistence failures; state and retry behavior. |
| Rules and invariants | Rule IDs from the requirements; owner and enforcement point. |
| Acceptance examples | Concrete Given/When/Then cases, including the boundary case. |
| Open decisions | Questions that evidence does not yet settle. |

## Use case inventory

| ID    | Goal / actor                                                | Requirement / API                              | Priority |
| ----- | ----------------------------------------------------------- | ---------------------------------------------- | -------- |
| UC-01 | Select fictional plan and register / visitor                | Join; `POST /auth/register`                    | High     |
| UC-02 | Book an available class / member                            | Rules 1–4, 8–9; `POST /sessions/{id}/bookings` | High     |
| UC-03 | Join a full-class waitlist / member                         | Rules 5–6, 8–9; `POST /sessions/{id}/waitlist` | High     |
| UC-04 | Cancel a booking and promote next eligible member / member  | Rules 6–8; `DELETE /bookings/{id}`             | High     |
| UC-05 | Create or edit a class session / administrator              | Capacity, trainer, time; admin POST/PATCH      | High     |
| UC-06 | View assigned sessions and attendee counts / trainer        | Trainer read-only MVP view                     | Medium   |
| UC-07 | Leave a waitlist / member                                   | `DELETE /waitlist/{id}`                        | High     |
| UC-08 | Review personal bookings and waitlist positions / member    | `GET /me/bookings`                             | High     |
| UC-09 | Discover a session and its availability / visitor or member | Public sessions GET endpoints                  | High     |
| UC-10 | View session participants / administrator                   | `GET /admin/sessions/{id}/participants`        | Medium   |

The cases below cover the MVP goals. Each prior open point now has a documented design resolution or a stated implementation verification gate.

### UC-01 Select a fictional plan and register

- **Actor/trigger:** Visitor chooses Join Now and submits registration with one fictional plan.
- **Preconditions:** Registration is available; the selected plan code is among the published demo plans. The visitor need not already be authenticated.
- **Success postcondition:** Exactly one demo User and active MemberProfile exist with the chosen plan and recorded consents; no payment object exists. The visitor can enter the member workspace using only a validated internal `returnTo` destination.
- **Failure postcondition:** No partial User/MemberProfile or consent record is committed.
- **Basic flow:** (1) Visitor opens `/join` and selects `base`, `complete`, or `training_plus`. (2) System clearly states the plan is fictional and collects no payment. (3) Visitor supplies registration data and required terms/privacy and liability-waiver consent. (4) System validates fields, normalizes the email, validates internal `returnTo`, and atomically creates the demo identity and member profile. (5) System establishes the authorized session and routes to the approved member destination.
- **Alternates:** An existing member chooses `My Account` and enters `/portal/login`; that path is login, not a second registration. A visitor declining a required consent remains on the form without an account.
- **Exceptions:** Duplicate normalized email, invalid plan, missing consent, external `returnTo`, or persistence failure creates no partial enrollment. Payment/card/billing/provider fields are rejected.
- **Acceptance examples:** Given a valid demo plan and required consents, registration produces one member profile with no billing record. Given an external `returnTo`, registration is rejected or the redirect is refused according to the API contract, and no external navigation occurs.
- **Resolution:** Membership owns `termsPrivacyAcceptedAt` and `waiverSignedAt` on MemberProfile; the API, data model, and conceptual DBML now include them. Issue #8 must implement and migrate these fields. PAR-Q answers are not stored.

### UC-02 Book an available class

- **Actor/trigger:** Member requests booking for a published, scheduled session. The authenticated identity comes from the server session.
- **Preconditions:** Member account/profile exists; selected session exists. Eligibility, cutoff, overlap, and capacity are checked at execution time, not assumed true at page load.
- **Success postcondition:** Exactly one active confirmed booking belongs to the member for the session; confirmed count is at most capacity.
- **Failure postcondition:** No new active booking or partial capacity change exists.
- **Basic flow:** (1) Person with a MemberProfile submits booking. (2) System verifies that profile and its active demo membership/waiver, regardless of whether the same User has a trainer or administrator role. (3) System checks scheduled status, configured cutoff, duplicate participation, overlapping confirmed bookings, and available capacity against current data. (4) System commits the confirmed booking atomically and returns its identifier/state. (5) Member sees the reservation.
- **Alternates:** At step 2, an existing demo MemberProfile missing a signed waiver completes the in-app waiver action, then retries the booking request; signing alone does not reserve a seat. At step 3, a full session leads to the distinct UC-03 waitlist choice; no booking is created. An unauthenticated visitor follows the existing Join or Member Portal Login journey, preserving only a validated internal return path.
- **Exceptions:** Invalid/forbidden request leaves state unchanged. Simultaneous last-seat requests must yield at most one confirmation; loser receives a stable conflict/full response. A failed transaction returns no success claim and may be retried safely after re-reading state.
- **Acceptance examples:** Given one seat and two eligible members, when they book concurrently, then exactly one new booking is confirmed. Given an overlap or configured cutoff already passed, when booking is requested, then no booking is created.
- **Resolution:** `SESSION_FULL` directs the client to the separate waitlist action. An existing waiting entry returns `ALREADY_WAITING` and blocks direct booking until removal or promotion. The server rechecks state under the ADR 007 transaction protocol.

### UC-03 Join a full-class waitlist

- **Actor/trigger:** Eligible member requests a place after learning the session is full.
- **Preconditions:** Session exists; member identity is authenticated. Fullness, status, eligibility, and cutoff are rechecked on submission.
- **Success postcondition:** Exactly one waiting entry exists for the member/session with a deterministic ordering key; capacity and confirmed bookings are unchanged.
- **Failure postcondition:** No new entry is created.
- **Basic flow:** (1) Member requests waitlisting. (2) System checks member eligibility, session state/cutoff, current fullness, and duplicate active participation. (3) System assigns an ordered position and commits the entry. (4) System returns waiting status and current position.
- **Alternates/exceptions:** If a seat opens before commit, return `SEAT_AVAILABLE` and offer booking; do not silently add a waitlist entry. Duplicate entry, confirmed booking, cutoff, ineligible member, or concurrent state change returns a stable rejection and no duplicate participation.
- **Acceptance examples:** Given a full session, two sequential eligible requests receive distinct ordered entries. Given a duplicate request, only one waiting entry remains.
- **Resolution:** If a seat opens before waitlist commit, return `SEAT_AVAILABLE` and let the member choose Book. Session-row serialization assigns a unique monotonically increasing `positionKey` within that session; Issue #8 must choose the exact database allocation method and verify concurrent requests.

### UC-04 Cancel a booking and promote a member

- **Actor/trigger:** Member cancels their own confirmed booking before that session's configured cutoff.
- **Preconditions:** The booking and its session exist. Ownership, state, and cutoff are checked at execution time.
- **Success postcondition:** Booking is cancelled. The first **eligible** waiting member is promoted, if any; otherwise one seat becomes available. Confirmed count never exceeds capacity; each waitlist entry has one final state.
- **Failure postcondition:** Original booking and waitlist order remain unchanged.
- **Basic flow:** (1) Member requests cancellation. (2) System authorizes ownership and checks configured cutoff. (3) In one database transaction it cancels the booking, scans waiting entries in order, rechecks each candidate's current eligibility and time conflict, marks ineligible entries expired, and promotes the first eligible candidate. (4) System commits and returns cancellation result; views refresh.
- **Alternates/exceptions:** No eligible candidate leaves the seat open. Repeat DELETE by the original owner of an already-cancelled booking returns `204` without another promotion; other callers are forbidden. A concurrent cancellation, new booking, or promotion cannot exceed capacity or promote the same entry twice. A transaction failure rolls back cancellation, expiries, and promotion.
- **Acceptance examples:** Given one confirmed booking and waiting members A then B where A is ineligible, cancellation promotes B and never A. Given a persistence failure during promotion, the original booking remains confirmed.
- **Resolution:** Requirements and API now match the editable flow: first currently eligible waiting entry is promoted, ineligible entries become `expired`, and member cancellation/promotion cannot proceed after the configured cutoff. A temporary overlap can therefore end a member's place; ADR 007 records that trade-off for later product review.

### UC-05 Create or edit a class session

- **Actor/trigger:** Administrator submits a create or edit request from the protected session manager.
- **Preconditions:** Server-authenticated administrator role; for edit, target session exists.
- **Success postcondition:** A scheduled session has valid program/trainer, start before end, positive capacity, nonnegative configured cutoff, and no prohibited trainer-time overlap. An edited capacity is never below confirmed occupancy.
- **Failure postcondition:** Existing session and participant state remain unchanged; a failed create leaves no partial session.
- **Basic flow:** (1) Administrator enters or changes allowed scheduling fields. (2) System authorizes and validates the command. (3) System checks trainer existence and schedule overlap; on edit it reads confirmed occupancy under the same concurrency discipline used by booking. (4) System commits the session change. (5) The public and protected views read the new state.
- **Alternates:** Create and edit share validation but are separate commands. The administrator may leave the form without saving. Existing participants are displayed for impact assessment; an edit must not silently delete or cancel their bookings.
- **Exceptions:** Role failure returns forbidden. Invalid time/capacity/cutoff, unavailable trainer, overlap, or capacity below occupancy returns a stable field/conflict error. If a booking wins the race before capacity reduction commits, the edit rechecks and rejects. A failed write makes no completion claim.
- **Acceptance examples:** Given 8 confirmed bookings, reducing capacity to 7 is rejected. Given a concurrent booking for the last allowed seat and capacity reduction, the final state satisfies confirmed count ≤ capacity.
- **Resolution:** Once any confirmed booking or waiting entry exists, admin PATCH may change capacity only, never below confirmed occupancy. Program, trainer, time, cutoff, and status are frozen; cancellation/deletion and participant migration are outside this endpoint.

### UC-06 View assigned sessions and attendee counts

- **Actor/trigger:** Trainer opens assigned sessions in the protected trainer workspace.
- **Preconditions:** Authenticated trainer identity with TrainerProfile.
- **Success postcondition:** No domain mutation; only sessions assigned to this trainer and permitted attendance counts are returned.
- **Failure postcondition:** No state changes; unauthorized data is not disclosed.
- **Basic flow:** (1) Trainer opens the assigned-session list. (2) System authorizes the trainer and filters by trainer profile on the server. (3) System returns upcoming assignments and counts. (4) Trainer opens a permitted session detail if available.
- **Alternates/exceptions:** Empty assignment list shows a meaningful empty state. Missing profile, expired login, or server failure produces denial/retry without leaking other trainers' sessions.
- **Acceptance examples:** A trainer assigned to session A sees A and its count, not session B assigned to another trainer.
- **Resolution:** `GET /api/v1/trainer/sessions` now defines a trainer-scoped read-only contract; no trainer editing power is added.

### UC-07 Leave a waitlist

- **Actor/trigger:** Member requests removal of their own waiting entry from My bookings.
- **Preconditions:** Authenticated member; target entry exists.
- **Success postcondition:** A waiting entry becomes cancelled atomically; queue order of other waiting entries is unchanged.
- **Failure postcondition:** If ownership or state check fails, no entry changes.
- **Basic flow:** (1) Member selects Leave waitlist. (2) System verifies identity, ownership, and current `waiting` status. (3) System marks the entry cancelled. (4) My bookings refreshes.
- **Alternates/exceptions:** If promotion already occurred, show the confirmed booking and its separate cancellation rule. If entry is already cancelled/expired, refresh current state; never cancel a promoted booking through this endpoint. Unexpected write failure leaves entry visible and retriable.
- **Acceptance examples:** Given A and B waiting in order, A leaves; B remains waiting and becomes first eligible entry. Given A was promoted concurrently, leaving waitlist does not cancel A's booking.

### UC-08 Review my bookings and waitlist positions

- **Actor/trigger:** Member opens `/app/bookings`.
- **Preconditions:** Authenticated member profile.
- **Success postcondition:** No mutation; the view reflects authorized upcoming confirmed bookings and current waiting entries with positions derived from live queue state.
- **Failure postcondition:** No data is changed or leaked.
- **Basic flow:** (1) Member opens My bookings. (2) System scopes records to server-authenticated member ID. (3) System returns upcoming bookings and waiting entries. (4) UI shows relevant cancellation/leave actions under current rules.
- **Alternates/exceptions:** Empty, loading, expired session, and server failure have explicit states. A stale position must refresh after any queue mutation; the display is not a guarantee of eventual promotion.
- **Acceptance examples:** Member A cannot retrieve Member B's reservations by changing a client ID. A promotion appears as a confirmed booking after refresh.

### UC-09 Discover a session and availability

- **Actor/trigger:** Visitor or member browses the public schedule or a session detail.
- **Preconditions:** Published program and visible session data exist; no login is required for public discovery.
- **Success postcondition:** No mutation; the visitor sees time, trainer, status, configured cutoff, and computed availability from committed data.
- **Failure postcondition:** No private participant data is disclosed.
- **Basic flow:** (1) Visitor filters by date, program, trainer, and availability. (2) System returns matching visible sessions. (3) Visitor opens a detail. (4) System shows Book or Join waitlist affordance according to current read state. (5) Protected submission rechecks all conditions.
- **Alternates/exceptions:** No match offers filter reset. Anonymous booking intent goes to `/join` with a validated internal return path. Loading/failure states allow retry. Stale availability is resolved at command time.
- **Acceptance examples:** Public response has aggregate counts, no member names. A session shown with one seat may still return full when another booking commits first.

### UC-10 View session participants

- **Actor/trigger:** Administrator opens a managed session's participants.
- **Preconditions:** Authenticated administrator and existing session.
- **Success postcondition:** No mutation; confirmed participants and ordered waiting entries are shown using fictional records only.
- **Failure postcondition:** Unauthorized callers receive no participant information.
- **Basic flow:** (1) Administrator selects the session. (2) System checks role on the server. (3) System reads confirmed and waiting participants in stable order. (4) UI shows current occupancy and waitlist.
- **Alternates/exceptions:** Empty participant lists show zero counts; a missing session returns not found; expired login or server failure uses protected retry/reauthentication behavior.
- **Acceptance examples:** Member role cannot call the endpoint; administrator sees only fictional demo participant data.

## Domain boundaries and rule ownership

### Requirement traceability

| Rule | Owning use case / validation point | Constraint or transaction backstop | Required example |
| --- | --- | --- | --- |
| 1 Active member | UC-02/03 and UC-04 promotion: Membership state rechecked after locks | Member row lock in ADR 007 transaction | Deactivate waiting member before cancellation; they are not promoted. |
| 2 No duplicate confirmed booking | UC-02/04: check confirmed participation | Partial unique confirmed `(member_id, session_id)` in Issue #8 migration | Two same-member booking requests yield one confirmation. |
| 3 No overlapping confirmed sessions | UC-02/04: query intervals after member lock | Member row serializes cross-session confirmations; no simple FK/unique index suffices | Two simultaneous bookings of different overlapping sessions produce one confirmation. |
| 4 Confirmed count ≤ capacity | UC-02/04/05: occupancy check after session lock | Shared session-row lock; positive-capacity check; confirmed count rechecked before commit | Two members compete for last seat; one confirms and count stays ≤ capacity. |
| 5 One waiting entry when full | UC-03: current fullness and active participation check | Session lock and partial unique waiting `(member_id, session_id)` | Concurrent duplicate waitlist requests create one entry. |
| 6 FIFO order | UC-03 assigns order; UC-04 selects lowest waiting key; UC-07 removes only target | Unique `(session_id, position_key)` plus session-serialized allocation | A then B wait; after eligible cancellation, A promotes first. |
| 7 First eligible, same transaction | UC-04: ordered eligibility scan and commit | One transaction covers cancellation, expiries, and promotion; rollback on failure | A ineligible and B eligible: A expires, B promotes; injected failure rolls back all. |
| 8 Configured cutoff | UC-02/03/04 and promotion: current session time rule | Session lock, server clock, current cutoff read in transaction | Requests immediately before/at cutoff produce allowed/rejected outcomes per strict `<` comparison. |
| 9 Staff need member profile | UC-02/03/04/07: server identity plus member profile, independent of User.role | Server authorization and profile FK; no UI-only gate | Trainer with a member profile may book; trainer without one cannot. |
| 10 Fictional data and limited admin operations | UC-05/06/09/10: authorization and response filtering | Seed-only deployment data and admin role checks | Member cannot read admin participants; all fixtures are fictional. |
| 11 Fictional plan, no payment | UC-01: allowed plan and consent validation | Plan-code enum/check and atomic enrollment; reject unknown billing fields | Submit card field or invalid plan: no account/payment record is created. |
| 12 Separate navigation | UC-01/09: route intent and `returnTo` validation | Server allowlist for internal destinations | External `returnTo` is refused; existing member uses `/portal/login`. |

Rules 1, 8, and 9 need precise treatment for automatic promotion: the member is not actively initiating the action, but must still be eligible under the current booking policy. This is where a plain “member-only” check can be too vague.

These are the ADR 007 design boundaries within **one modular monolith**, not separate services. A code module, database table, route group, and bounded context need not correspond one-to-one.

| Context | Owns | Does not own | Main contract / risk |
| --- | --- | --- | --- |
| Identity | User identity, login session, role assertion | Membership eligibility, reservation rules | Supplies server-verified actor identity; role alone is insufficient for booking. |
| Membership | Member profile, fictional plan selection, active status, waiver eligibility | Payment/billing, capacity, bookings | Supplies an eligibility decision; current status can change between read and booking transaction. |
| Scheduling | Program/trainer catalog, class session lifecycle, start/end, capacity and cutoff configuration | Confirmed booking lifecycle and queue order | Supplies session policy/state to Booking; admin edits must respect confirmed occupancy. |
| Booking | Confirmed bookings, waitlist entries and ordering, cancellation/promotion, member overlap | Plan selection and login | Core consistency owner; needs atomic access to session capacity/state. |
| Administration | Authorized orchestration and operational read models | Separate booking or scheduling rule set | Application interface, not a bounded context; admin writes invoke Scheduling/Booking policy. |

### Shared vocabulary and translations

| Term | Meaning and owner | Avoid confusing it with |
| --- | --- | --- |
| Class session | Product/UI label for one scheduled occurrence. Scheduling calls its calendar definition a SessionSlot; Booking calls its reservable snapshot a BookableSession. | Program, a reusable class description. |
| Active membership | Fictional member eligibility state; Membership. | Paid subscription or an authenticated login session. |
| Confirmed booking | Active reserved seat for one member/session; Booking. | Waitlist entry or merely viewing a session. |
| Waitlist position | Ordering among currently waiting entries, subject to eligibility rechecks; Booking. | Guaranteed seat or permanent rank. |
| Available seat | Capacity minus confirmed occupancy at a particular committed state; Booking computes from Scheduling policy. | A persisted capacity increase after cancellation. |
| Administrator action | Authorized command through a use case. | Direct database override of invariants. |

Avoid vague domain names such as `Manager` or `Processor`; use business verbs and the vocabulary above. `BookingIntent` is not required by current requirements and should not be added without a lifecycle reason.

### Context relationships and ownership

| Producer → consumer | Contract | Failure/consistency concern |
| --- | --- | --- |
| Identity → application use cases | Server-verified actor ID and roles | Reject absent/forged identity before domain mutation. |
| Membership → Booking | Eligibility policy/query with status and waiver state | Recheck after session/member locks under ADR 007; do not trust a page-load snapshot. |
| Scheduling → Booking | Session identity, state, interval, capacity, configured cutoff | Booking uses current session data in the atomic booking/cancellation operation. |
| Booking → Scheduling admin use case | Confirmed occupancy and affected reservations | Capacity reduction below confirmed count is rejected under concurrent writes. |
| Booking → read views | Committed booking/waitlist result | Read views may refresh after commit; they cannot authorize a write. |

Within this monolith, explicit application/domain contracts and transaction coordination are sufficient. An event broker, distributed compensation, and API version windows between internal modules would add complexity without a current need.

## Expanded DDD skill run

This is a document-based pass through eight modeling skills, using existing FitOps evidence instead of inventing stakeholder interviews. Proposed events and aggregate shapes below are design candidates, not implemented code. ADR 007 records the consistency decision.

### 1. `ddd-scope`: problem, boundaries, and assumptions

**Problem:** A visitor and fictional gym member need a dependable way to discover classes, reserve limited seats, and handle cancellations and waitlists while staff maintain accurate schedules.

**Value:** A working demo proves end-to-end business rules and trustworthy operational views. Core goal: a correct booking lifecycle. Supporting goals: fictional enrollment, schedule management, role-specific views. Non-goals: payment, real member data, multiple branches, live notifications, and microservices.

| Assumption or constraint | Status | Verification |
| --- | --- | --- |
| One gym branch is enough for MVP | Explicit scope | Requirements and UX review |
| Configured cutoff belongs to each session | Existing rule | Requirements and diagram comparison |
| A session can accept at most `capacity` confirmed bookings | Existing invariant | Concurrent database integration test |
| A member may have only one active participation state per session | Inferred from duplicate rules and flows | Requirements decision, constraint design, tests |
| Recruiters value demonstrated consistency and test evidence | Product hypothesis | Portfolio review after deployment; currently unverified |

Term seeds with ambiguity: *program* versus *class session*; *member* versus *user*; *active membership* versus *login session*; *booking* versus *waitlist entry*; *capacity* versus *available seat*; *cutoff* for booking versus cancellation; *eligible* at waitlist entry versus promotion; *confirmed* versus *promoted*; *plan* versus *paid subscription*; *trainer assignment* versus *trainer authorization*.

Risk inventory: business, an attractive demo without working rules; integration, identity/eligibility changes between reads and writes; consistency, last-seat and overlap races; delivery, excessive DDD structure for a single modular monolith. Keep every model element traceable to a use case or invariant.

### 2. `ddd-discover`: event and command candidates

| Sequence | Past-tense fact candidate | Triggering command / actor | Branch or hotspot |
| --- | --- | --- | --- |
| 1 | DemoMemberRegistered | Register / visitor | Consent and fictional plan; no payment |
| 2 | ClassSessionScheduled | Create session / administrator | Trainer overlap and valid capacity |
| 3 | BookingConfirmed | Book session / member | **Strong consistency:** eligibility, overlap, last seat |
| 3a | WaitlistEntryAdded | Join waitlist / member | Fullness and FIFO assignment must be checked atomically |
| 4 | BookingCancelled | Cancel booking / member | **Strong consistency:** same transaction as any promotion |
| 5 | WaitlistEntryExpired | Resolve ineligible candidate / system within cancellation command | Current cancellation diagram, requirements, and API now aligned |
| 6 | WaitlistEntryPromoted | Cancel booking / system within same transaction | First eligible candidate, no overbooking |
| 7 | ClassSessionUpdated | Edit session / administrator | Capacity reduction and participant impact |
| 8 | WaitlistEntryCancelled | Leave waitlist / member | Race with promotion |

These are domain facts suitable for traceability; they do **not** imply a broker or eventual consistency. Exception paths: simultaneous last-seat requests yield one confirmation and one full/conflict outcome; failed cancellation/promotion rolls back both; concurrent admin capacity reduction and member booking must leave capacity valid. Ambiguities to confirm with product owner: promotion after a newly passed cutoff, transiently ineligible queue members, post-booking session time edits, and duplicate retry semantics.

### 3. `ddd-subdomains`: investment and context candidates

| Capability | Classification | Why / investment |
| --- | --- | --- |
| Seat allocation, booking, cancellation, FIFO waitlist, overlap prevention | **Core** | Distinguishing proof of FitOps behavior; invest in pure rules and concurrency tests. |
| Class-session and trainer schedule management | Supporting | Required to supply reliable bookable inventory; keep cohesive and narrow. |
| Fictional membership/eligibility | Supporting | Gates the core flow; keep payment outside scope. |
| Authentication and role sessions | Generic | Use established auth machinery behind FitOps authorization policy. |
| Public discovery/read views | Supporting | Needed for journey and conversion; derive availability from authoritative state. |

One core group among five meets the skill's focus criterion. A single project maintainer owns all modules; “team ownership” in the skill means code/contract ownership here, not invented teams.

### 4. `ddd-contexts`: boundary review

Candidate bounded contexts are Identity, Membership, Scheduling, and Booking. Administration and public discovery are application/read interfaces that orchestrate or query them; they do not currently have distinct entities, lifecycle, or ubiquitous language sufficient to justify separate bounded contexts. The existing `Administration` architecture section can remain a module label if it calls the domain owners rather than owning a parallel session model. The terminology and ownership tables above are the context directory and glossary for this pass.

[ADR 007](../../../docs/adr/007-booking-consistency-boundary.md) records the decision: Scheduling owns editable `ClassSession` policy; Booking owns participation and occupancy decisions. One application transaction coordinates affected rows without a bidirectional domain import. Trade-off: synchronous correctness with contention on popular sessions. The alternative of one larger Booking context remains available if implementation reveals duplicated rules.

### 5. `ddd-context-map`: contracts and failure modes

| Boundary | Contract owner | Consumer / translation | Failure handling |
| --- | --- | --- | --- |
| Identity → use cases | Identity | Server actor ID/roles, no client actor ID | Fail closed on missing session or role. |
| Membership → Booking | Membership | `MemberEligibility` snapshot or query, not raw profile shape | Revalidate at commit under defined isolation; reject stale eligibility. |
| Scheduling → Booking | Scheduling | `BookableSessionPolicy` with interval/status/capacity/cutoff | Reject stale/changed session; serialize against capacity edits. |
| Booking → admin orchestration | Booking | Confirmed occupancy and participation impact | Reject edit if capacity becomes invalid; no implicit booking deletion. |
| Domain state → read views | Each domain owner | Query projection only | Stale display is allowed; write path always rechecks. |

Failure modes: absent identity, inactive membership, concurrent final-seat claim, overlap race across two sessions, admin capacity race, promotion candidate becoming ineligible, and transaction failure. All have explicit reject or rollback behavior in the use cases. Internal contracts can evolve in one repository and release; API response changes need normal compatibility review. An integration event contract, distributed retry queue, or shared kernel is not justified by current scope.

### 6. `ddd-aggregates`: initial invariants and consistency

| Candidate root / owner | Owned state or value objects | Commands | Must remain true |
| --- | --- | --- | --- |
| MemberProfile / Membership | Status, fictional plan, consent/waiver state | Register, change demo status | Booking eligibility is explicit; no payment semantics. |
| ClassSession / Scheduling | Time interval, trainer ID, capacity, cutoff, status | Create/edit session | End after start; capacity positive; edits cannot invalidate confirmed occupancy. |
| SessionParticipation / Booking, **superseded design label** | Booking and WaitlistEntry identities for one session, queue order | Book, waitlist, cancel, leave, promote | Confirmed count ≤ session capacity; no duplicate active member/session participation; FIFO first eligible promotion. |

`SessionParticipation` was a consistency concept, not a settled aggregate. ADR 008 replaces it with `BookableSession` and `MemberReservationCalendar`; their full roots, entity/value-object model, and ports appear in **DDD closure artifacts, revision 2**. PostgreSQL concurrency tests remain required. Prisma's transaction API alone is not proof of race safety.

| Invariant / rule | Decision point | Enforcement candidate | Failure result |
| --- | --- | --- | --- |
| Active eligible member and waiver, rules 1 and 9 | Book, waitlist, promotion | Server policy read/recheck | No participation change |
| One active booking and one waiting entry, rules 2 and 5 | Book/waitlist/promotion | Domain guard plus database partial uniqueness or equivalent | Stable duplicate/conflict |
| No overlapping confirmed member sessions, rule 3 | Book/promotion | Member-scoped serialization plus overlap query; database exclusion constraint may be evaluated | No new confirmed booking |
| Confirmed count ≤ capacity, rule 4 | Book/promotion/admin edit | Session-scoped serialization plus check in same transaction | Full/conflict, no partial write |
| FIFO first eligible, rules 6 and 7 | Cancellation | Ordered queue read and atomic state transition | Cancellation and promotion both roll back on failure |
| Configured cutoff, rule 8 | Book/cancel; diagram also uses it for waitlist/promotion | Current session policy at command time | Rejection without mutation |

The source skill recommends eventual consistency across aggregates by default. FitOps's accepted same-transaction cancellation/promotion rule takes precedence; boundaries must support that invariant. No event-sourced model or cross-service saga is needed.

### 7. `ddd-domain-interactions`: semantic ports and events

| Proposed event        | Source     | When recorded                         | Consumer and publication                           |
| --------------------- | ---------- | ------------------------------------- | -------------------------------------------------- |
| BookingConfirmed      | Booking    | Committed confirmation                | My bookings/read refresh; internal only            |
| WaitlistEntryAdded    | Booking    | Committed waiting entry               | Queue read view; internal only                     |
| BookingCancelled      | Booking    | Committed cancellation                | Member read view; internal only                    |
| WaitlistEntryPromoted | Booking    | Same commit as cancellation/promotion | Member dashboard badge on next read; internal only |
| ClassSessionUpdated   | Scheduling | Committed admin edit                  | Public/protected read refresh; internal only       |

Events here are a vocabulary for committed facts and tests, not a mandate to persist an event log or dispatch asynchronous notifications. Application use cases coordinate `MemberEligibilityPort`, `ClassSessionPolicyPort`, and `ParticipationRepository` through a unit-of-work/transaction boundary. Their methods should express intent (`loadForBooking`, `findConfirmedOverlap`, `firstWaitingByOrder`, `saveParticipation`) rather than expose Prisma records. Registration and class-session creation may use simple validated constructors; a factory is justified only if creation rules become complex. No external subscribers or replay requirement exists in MVP.

### 8. `ddd-model-review`: evidence-based result

The earlier 0–10 scores were subjective and did **not** meet this skill's repeatability check. They are withdrawn as a readiness gate. The checklist review below identifies missing model artifacts and a boundary backtrack. No quality score is warranted until the same explicit rubric is applied to a complete context catalog, aggregate model, interaction catalog, and their traceability.

| Dimension | Current review | Evidence |
| --- | --- | --- |
| Language | Partial | The key terms are distinguished, but the glossary lacks per-context examples, synonyms, and conflict handling. |
| Boundaries | **Backtrack required** | ADR 007 intentionally coordinates Scheduling's mutable capacity with Booking's occupancy in one transaction; the context and aggregate checklists ask for the strong invariant to fit a clear owner. |
| Invariants | Partial | Twelve requirements are traced, but `SessionParticipation` is a consistency label rather than a settled aggregate root with defined entity/value-object ownership. |
| Events | Partial | Past-tense event candidates exist, but no event directory defines source, fields, ordering, and idempotency for each. |
| Coupling | Partial | Narrow ports are named, but a relationship pattern, translation rule, and contract change policy are not specified for each boundary. |

**Initial skill-review result: Not Ready.** This finding applied before ADR 008 and the closure artifacts below. The revision resolves the boundary by placing capacity and occupancy in Booking, then defines aggregate and interaction contracts. See the updated checklist audit for the current result. Operational readiness remains separately unverified: no Prisma schema, migration, use-case code, or PostgreSQL concurrency test has run.

| Priority | Review finding | Resolution / remaining proof |
| --- | --- | --- |
| Resolved design gap | Capacity and occupancy span Scheduling/Booking | ADR 008 makes Booking the BookableSession owner; PostgreSQL race test remains pending. |
| P0 | Member overlap spans multiple sessions | ADR 007 member lock after session lock specified; concurrent overlap test pending. |
| P1 | Promotion eligibility and expiry | Requirements/API aligned to editable flow; temporary overlap expiry is an explicit trade-off to revisit if product evidence changes. |
| P1 | Waiver storage and trainer read | Conceptual data model/DBML and trainer API updated; executable migration/endpoint pending. |
| P1 | Admin session edit impact | Capacity-only after participation specified; concurrent edit/booking test pending. |

### Skill checklist audit, 2026-09-23

The eight skill sections above show how their ideas were applied; they are **not** eight completed skill deliverables. This audit uses the upstream English `SKILL.en.md` validation checklists as written.

| Skill | Result | Missing item or evidence |
| --- | --- | --- |
| `ddd-scope` | Pass for design | Problem, goals/non-goals, terminology, risks, verification methods, and downstream preparation are now recorded. Product outcome remains unverified until implementation. |
| `ddd-discover` | Pass for design | Event/command candidates, main and exception paths, hotspots, and a resolved ambiguity register are recorded. |
| `ddd-subdomains` | Pass for design | One core domain, supporting/generic capabilities, measurable indicators, and the three ownership seams are explicit. |
| `ddd-contexts` | Pass with ADR 008 | BookableSession puts capacity/occupancy in Booking. Responsibilities, non-responsibilities, examples, anti-terms, and language-change rules are now explicit. |
| `ddd-context-map` | Pass for design | Every cross-context contract has an owner, pattern, translation, change rule, and failure handling. |
| `ddd-aggregates` | Pass with documented exception | Roots, entities/value objects, commands, and invariants are defined. MemberReservationCalendar and BookableSession change together locally only to preserve immediate overlap prevention; ADR 008 records the exception. |
| `ddd-domain-interactions` | Pass for design | Internal event fields, ordering, idempotency, ports, and subscriber boundary are cataloged. No external replay capability is required in MVP. |
| `ddd-model-review` | Conditional pass for design | The complete document provides a repeatable checklist. The only remaining evidence gap is executable schema and PostgreSQL concurrency tests, which evaluates implementation rather than the design model. |

Two contract defects surfaced during the audit and were fixed in place: member actions now check for an owned MemberProfile rather than requiring `User.role === member`, and the existing in-app waiver modal has a documented `POST /api/v1/me/waiver` API operation. Waitlist entry intentionally does not check overlapping confirmed sessions; promotion rechecks overlap. These statements align rule 9 and the editable booking flow without adding screens.

## DDD closure artifacts, revision 2

ADR 008 resolves the prior backtrack: the Booking context owns the capacity/occupancy invariant through `BookableSession`. Scheduling owns a calendar `SessionSlot`; publishing is a translated, synchronous contract. This section supplies the artifacts previously missing from the skill audit.

### Context directory and ubiquitous language

| Context | Responsibility / non-responsibility | Core terms and example | Data owner / contract owner |
| --- | --- | --- | --- |
| Identity | Authenticates a User and asserts roles. Does not decide membership eligibility. | **User**: an authenticated account. Example: an administrator signs in and still has no booking permission without a MemberProfile. | Users and server session; Identity owns `AuthenticatedActor`. |
| Membership | Maintains MemberProfile, fictional plan, active status, and consent timestamps. Does not allocate seats. | **Eligible member**: an owned active profile with a signed waiver. Example: an active trainer who also has a profile may book. | MemberProfile and consents; Membership owns `MemberEligibility`. |
| Scheduling | Maintains Program, TrainerProfile, SessionSlot, and trainer calendar conflicts. Does not track reservations. | **SessionSlot**: a scheduled class occurrence before or after publication. Example: a trainer is assigned 18:00–19:00. | Programs, trainers, SessionSlot; Scheduling owns `PublishableSlot`. |
| Booking | Allocates limited seats and maintains reservation state. Does not change trainer assignment or plan selection. | **BookableSession**: translated reservable session snapshot. **Confirmed reservation**: a seat that consumes capacity. Example: a 12-seat slot has 11 confirmations and one available seat. | BookableSession, Booking, WaitlistEntry, MemberReservationCalendar; Booking owns booking commands and events. |

| Term | Definition | Synonym to avoid / conflict resolution |
| --- | --- | --- |
| SessionSlot | Scheduling calendar definition with program, trainer, and interval. | Do not call it “booking session” inside Scheduling. |
| BookableSession | Booking's reservation-policy snapshot for a published SessionSlot. | Do not use “ClassSession” without context in domain code; adapters map the physical record. |
| Capacity | Maximum confirmations accepted by one BookableSession. | Not “available seats”; availability is derived from capacity minus confirmations. |
| Booking | Confirmed reservation entity. | Not a waitlist entry or a page intent. |
| WaitlistEntry | FIFO request for a seat after a session was full. | Position is not a guaranteed seat. |
| MemberReservationCalendar | Booking aggregate holding confirmed time intervals for one member. | Not a user calendar or trainer calendar. |

Avoid technical anti-terms in domain code: `Manager`, `Processor`, `Handler`, `Data`, and `Record`. Use `BookableSession`, `AdjustCapacity`, `PromoteWaitlistEntry`, and `MemberEligibility` instead. New or changed terms require review by the Issue #7 owner, update to this glossary, ADR when ownership changes, and a versioned API change when public contracts change.

### Scope, discovery, and subdomain closure

| Item | Decision / verification method |
| --- | --- |
| Business outcome | A fictional member can discover, reserve, cancel, and receive deterministic queue treatment without private data. Verify with the full e2e critical journey after implementation. |
| Core-domain indicator | Every synchronized PostgreSQL race scenario in this note preserves capacity, FIFO outcome, and no-overlap rules. Verify with Issue #8 schema plus booking integration tests. |
| Supporting-domain indicator | Registration produces a fictional active MemberProfile with consent timestamps, and a trainer sees only assigned sessions. Verify with endpoint authorization/integration tests. |
| Delivery risk | A physical ORM model may bleed across contexts. Mitigate with port-level unit tests and an import-boundary test before the first feature slice. |
| Next prepared input | Issue #8 supplies migrations and constraints; Issue #9 supplies authorization/threat-model controls; Sprint 1 supplies the first Booking use-case tests. |

| Ambiguity discovered | Resolution / accountable evidence |
| --- | --- |
| Which owner has capacity and cutoff? | Booking owns BookableSession under ADR 008; architecture and API updated. |
| Can a staff user book? | Yes, if they own an active MemberProfile with signed waiver; requirements rule 9 and API record it. |
| Does joining the waitlist require no time conflict? | No. Conflict is checked at promotion; an ineligible entry expires under the documented policy. |
| Are drafts a user-visible workflow? | No. Admin create schedules and publishes internally in one existing command. |
| Can time/trainer/cutoff change after participation? | No for MVP; only Booking capacity adjustment is allowed. |

Capability ownership has three review seams: Identity provides actor assertion to Membership/Booking, Scheduling publishes translated slots to Booking, and Booking provides operational reads to Administration. One project maintainer owns their contracts today; that does not invent separate teams, but each seam has a named context owner and test obligation.

### Context map and contract ownership

| Upstream → downstream | Pattern / translation | Contract owner, change rule | Failure mitigation |
| --- | --- | --- | --- |
| Identity → Membership and Booking application use cases | Conformist to compact `AuthenticatedActor` value (`userId`, roles); no Identity entity import | Identity; additive fields only without a new version, breaking change requires API/contract review | Missing or invalid actor fails closed as `401`/`403`. |
| Membership → Booking | Customer-supplier port. Map MemberProfile to `MemberEligibility` (`memberId`, active, waiverSignedAt). | Membership; Booking consumes only this value object | Re-read under Booking transaction; ineligible result creates no participation state. |
| Scheduling → Booking | Anti-corruption translation from `PublishableSlot` to `BookableSession` snapshot; no shared entity/ORM model | Scheduling owns source fields; Booking owns translated reservable state after publish | Publication fails atomically or creates neither reservable state nor success response; adapter contract tests cover field mapping. |
| Booking → Administration/read views | Open host query contract for occupancy, participants, and committed result states | Booking; public versioned REST response contract | Reads may be stale; mutations always recheck authoritative state. |

Compatibility policy: internal ports change atomically in the monolith with unit and integration coverage; public `/api/v1` response shapes are additive within v1 and require a successor version for breaking changes. No context uses another context's database/ORM model. The four contracts above replace informal shared shapes.

### Aggregate and value-object model

| Aggregate root | Entities / value objects | Commands | Invariants |
| --- | --- | --- | --- |
| MemberProfile | `MembershipStatus`, `FictionalPlanCode`, `ConsentTimestamp` value objects | RegisterMember, SignWaiver, ChangeDemoStatus | Active profile and signed waiver define membership eligibility; no payment state exists. |
| SessionSlot | `TimeInterval`, `TrainerId`, `ProgramId` value objects | ScheduleSlot, AmendUnpublishedSlot, PublishSlot | End is after start; trainer intervals do not overlap. |
| BookableSession | Booking and WaitlistEntry entities; `Capacity`, `BookingCutoff`, `SessionInterval`, `WaitlistPosition` value objects | ConfirmReservation, JoinWaitlist, CancelReservation, PromoteNextEligible, LeaveWaitlist, AdjustCapacity | Confirmations never exceed capacity; one active booking or waiting entry per member/session; FIFO queue state is deterministic. |
| MemberReservationCalendar | ConfirmedReservationInterval entities; `SessionInterval` value object | ReserveInterval, ReleaseInterval | One member has no overlapping confirmed intervals. |

`BookableSession` and `MemberReservationCalendar` intentionally change in the same local transaction when confirmation or promotion occurs. ADR 008 records this exception and its reason. The calendar is not an external system and does not receive published events. `Capacity`, `BookingCutoff`, and `SessionInterval` validate at construction; `MemberEligibility`, `CanConfirmReservation`, and `IsBeforeCutoff` are first-class specifications rather than anonymous conditional branches.

| Foreign reference examined | Lifecycle owned by | Decision |
| --- | --- | --- |
| ProgramId and TrainerId in SessionSlot | Scheduling | Scheduling creates/edits their catalog records; Booking holds only translated identifiers/labels. |
| SessionSlotId in BookableSession | Scheduling | Booking does not create or modify the slot; it owns the post-publication reservation snapshot. |
| MemberId in BookableSession / WaitlistEntry | Membership | Booking never creates MemberProfile; it queries translated eligibility. |
| Booking interval in MemberReservationCalendar | Booking | Booking creates/removes the interval only as a confirmation is committed/cancelled. |

### Repository ports, events, and idempotency

| Port / event | Semantic contract | Ordering, idempotency, and consumer |
| --- | --- | --- |
| `BookableSessionRepository.lockById` | Loads one BookableSession for mutation under the session lock. | Called before all session participation writes. |
| `MemberReservationCalendarRepository.lockByMemberId` | Loads the member's calendar under its owned `member_profiles` lock anchor until a physical calendar table is selected. | Called after session lock for confirmation/promotion. |
| `MemberEligibilityPort.getForUpdate` | Returns current owned profile eligibility after lock acquisition. | No raw MemberProfile persistence model escapes Membership. |
| `PublishBookableSession` | Creates translated BookableSession from a published SessionSlot. | Idempotency key is `sessionSlotId`; duplicate publish returns existing BookableSession. |
| `BookingConfirmed` | Fact recorded after one confirmation commits. Fields: bookingId, memberId, bookableSessionId, committedAt. | Internal only; ordered after transaction commit; read models may refresh. |
| `WaitlistEntryAdded` | Fact recorded after waitlist commit. Fields: entryId, memberId, bookableSessionId, positionKey. | A position key is immutable; no replay consumer in MVP. |
| `BookingCancelled` / `WaitlistEntryPromoted` | Facts recorded from the same committed transaction. | Promotion follows cancellation in that transaction; never publish one on rollback. |
| `WaitlistEntryExpired` | Fact recorded when current eligibility fails during promotion. | Idempotency key is entryId plus final status; no retry may expire twice. |

| Factory | Creation target and conditions |
| --- | --- |
| `MemberProfile.register` | Valid fictional plan plus required Terms/Privacy and waiver timestamps; rejects billing and health fields. |
| `SessionSlot.schedule` | Valid ProgramId/TrainerId and non-overlapping trainer TimeInterval. |
| `BookableSession.publishFromSlot` | One translated SessionSlot snapshot with valid Capacity and BookingCutoff; idempotent by SessionSlotId. |
| `MemberReservationCalendar.reconstitute` | Loads only confirmed reservation intervals for one member; rejects overlapping persisted intervals as data corruption. |

Domain events remain internal records for traceability and read refresh. There is no broker, outbox, external subscriber, dead-letter queue, or replay service in scope. If a later external consumer is added, it requires a new integration-event contract and ADR.

## UX, requirements, model, and API reconciliation

| Use case | Editable draw.io evidence | Requirements / data / API outcome |
| --- | --- | --- |
| UC-01 Register | Page 07 requires plan and both legal consents; only internal return paths | Requirement 11, registration API, MemberProfile consent timestamps/DBML aligned. |
| UC-02 Book | Page 02 rechecks identity, membership, waiver, overlap, capacity, cutoff | Booking API now covers waiver and already-waiting outcomes; ADR 007 provides lock order. |
| UC-03 Waitlist | Page 02 rechecks fullness and shows Book when a seat opened | Waitlist API now returns `SEAT_AVAILABLE`; session-serialized queue order specified. |
| UC-04 Cancel/promote | Page 04 rolls back as one unit, expires ineligible entries, uses FIFO | Requirements/API now state current eligibility, expiry, same commit, and unchanged capacity. |
| UC-05 Admin create/edit | Page 06 checks trainer overlap and capacity below bookings | API now limits edits after participation; ADR 007 covers concurrent capacity changes. |
| UC-06 Trainer read | Page 05 trainer workspace is read-only | New trainer GET contract added; no edit operation. |
| UC-07 Leave waitlist | Page 03 distinguishes waiting, promoted, resolved | Waitlist DELETE now distinguishes promoted state and duplicate removal. |
| UC-08 My bookings | Page 03 loads bookings, waitlist position, and recovery states | Existing member GET remains server-scoped; position is a snapshot. |
| UC-09 Public discovery | Pages 01–02 allow anonymous schedule/details before protected action | Public sessions GET remains public; writes recheck stale availability. |
| UC-10 Admin participants | Page 06 shows fictional confirmed and ordered waiting members | Existing admin GET remains role-protected and fictional-data only. |

No route or screen was added, so the editable draw.io source required no mutation. The source already expresses the behaviors; this pass made the written contracts agree with it. Existing derived Mermaid and wireframes remain review artifacts, not new sources of truth.

## Race-safe transaction design and proof obligations

The protocol below is a design specification for PostgreSQL. It has **not** run against an executable schema. Read the database clock **after acquiring the locks**, not at transaction start or from the browser, for the strict `now < startsAt - cutoff` test; a request waiting on another writer must not pass a cutoff that elapsed while it waited. At `READ COMMITTED`, re-read all mutable state after locking; bounded whole-transaction retry handles deadlock or serialization errors. Fix lock order in one shared application coordinator and integration-test every writer.

```text
Book(member, session):
  BEGIN
  SELECT class_session FOR UPDATE                     # session lock first
  SELECT member_profile FOR UPDATE                    # member lock second
  re-read session policy, membership/waiver, confirmed count,
    duplicate booking/waiting entry, member overlapping confirmations
  reject unless scheduled, before cutoff, eligible, not duplicate,
    no overlap, confirmed count < capacity
  INSERT confirmed booking                            # partial unique index backstop
  COMMIT

JoinWaitlist(member, session):
  BEGIN; lock session; lock member; recheck eligibility and full capacity
  reject with SEAT_AVAILABLE if count < capacity
  assign next session-local position_key under session lock; INSERT waiting entry
  COMMIT

Cancel(booking):
  read booking's session ID without trusting mutable state; BEGIN; lock session
  re-read booking, owner, status, session cutoff; reject if invalid
  mark booking cancelled
  for each waiting entry in ascending position_key:
    lock candidate member; re-read eligibility, waiver, duplicate and overlap
    if ineligible: mark entry expired; continue
    mark entry promoted; insert one confirmed booking; break
  assert confirmed count <= capacity; COMMIT all changes together

EditSession(admin, session):
  authorize admin; BEGIN; lock session; re-read participation and occupancy
  if any confirmed/waiting participation: allow capacity change only
  reject proposed capacity < confirmed count; UPDATE; COMMIT
```

When trainer/time edits are allowed before participation, serialize scheduling edits on the trainer profile before acquiring the session lock and checking trainer overlap. Booking commands never acquire a trainer lock, so this does not reverse a booking lock cycle. A promotion may hold one session and acquire member locks in FIFO order; two promotions on different sessions can deadlock if they meet the same members in different orders. Retrying the **entire** failed transaction releases every lock and preserves the invariant. Retry exhaustion returns a stable failure with no partial cancellation claim.

| Concurrent interleaving to run in PostgreSQL integration tests | Expected committed result |
| --- | --- |
| T1 and T2 read the same final seat; both submit booking for different members | Session lock makes one wait. One confirmed insert commits; the other sees full and fails. Confirmed count equals capacity. |
| Same member submits overlapping sessions A and B simultaneously | Each holds a different session lock, but both need the same member lock. Second rechecks after first commits and fails overlap. Exactly one confirmed booking. |
| Member cancellation races a fresh booking for the released seat | Both need the same session lock. If cancellation wins, it promotes the first eligible waiter before the fresh booking can inspect capacity; fresh request sees full. If booking wins first, it sees full and fails, then cancellation promotes. |
| Two cancellations on one full session with two waiting members | Session lock serializes both; each cancellation scans current queue and cannot promote the same entry twice. Final confirmed count stays within capacity. |
| Admin reduces capacity while another member books | Both need the session lock. Whichever commits first determines the other's recheck; no committed state has capacity below confirmed occupancy. |
| Promotion encounters an inactive first waiter and eligible second waiter | First entry becomes expired, second becomes confirmed, all in one commit. Injected failure before commit restores cancelled booking and both waiting states. |
| Join-waitlist request races a cancellation that opens a seat | Whichever owns session lock first decides. If cancellation leaves availability, join request returns `SEAT_AVAILABLE`; no orphan waiting entry is inserted. |

Issue #8 must implement partial unique indexes for active confirmed bookings and active waiting entries, plus unique `(session_id, position_key)`. The member/session locking protocol is required because these indexes alone cannot enforce total capacity, cross-session overlap, or an active booking versus waiting entry stored in separate tables. Test both outcomes of each interleaving with barriers or coordinated connections; sequential tests cannot demonstrate race safety.

## Issue #7 exit evidence and current state

1. **Use case alignment: documented.** Ten cases are cross-checked in the table above; requirements, API, data model, and conceptual DBML now cover the identified gaps. Any future UX change must start in draw.io.
2. **Decision record: documented.** [ADR 007](../../../docs/adr/007-booking-consistency-boundary.md) records lock order, promotion policy, edit limits, alternatives, and costs; [ADR 008](../../../docs/adr/008-booking-owns-reservable-session.md) supersedes its split capacity ownership. ADRs 001–006 remain unchanged.
3. **Rule traceability: documented.** All twelve MVP rules have an owning use case, validation point, persistence/transaction backstop, and concrete example in the matrix above. Issue #8 must convert conceptual constraints into schema and migrations.
4. **Race design: specified, execution pending.** The transaction protocol and seven concurrent interleavings above make the intended result reviewable. An actual claim of race safety requires implementation and PostgreSQL tests; no such proof exists yet.

**Current review result:** The documented model now passes the upstream DDD skill checklists for design, with ADR 008's explicit local multi-aggregate exception. Application implementation remains gated by Sprint 0 review, Issue #6 wireframe approval, Issue #8 schema/migrations, Issue #9 security work, and PostgreSQL concurrency tests. GitHub Issue #7 remains open until its planned review and delivery evidence are complete.

## Related

- [[../projects/FitOps]]
- [[../tasks/Sprint 0]]
- [[FitOps User Flows]]
