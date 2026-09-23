---
type: session-log
project: FitOps
date: 2026-09-23
---

# Issue #7 use case and boundary draft

- Goal: adapt the supplied use case PDF and review FitOps's proposed domain boundaries using ForceInjection's DDD skills.
- Created [[../design/Issue 7 Domain Boundaries and Use Cases]] with a reusable use case format, six-case inventory, three expanded critical cases, candidate context ownership, context relationships, and a preliminary model review.
- Sources checked: local 20-page 2007 PDF, current GitHub Issue #7 (open, `## Summary` body), existing requirements, architecture, data model, API, and the external `ddd-contexts`, `ddd-context-map`, `ddd-aggregates`, and `ddd-model-review` skill files.
- Decisions: treat Administration as a likely application facade; keep cancellation and waitlist promotion in one transaction as FitOps requires. These are review findings, not approved architecture changes.
- Unresolved: capacity/occupancy ownership, cross-session overlap concurrency, waitlist promotion eligibility and cutoff behavior, admin capacity-edit races, and completion of UC-01/05/06.
- Next safe action: review and resolve these questions, then record a boundary ADR and complete the use cases before marking Issue #7 ready.

## Same-day expansion

- Expanded all ten MVP use cases, including registration, admin create/edit, trainer read, waitlist removal, personal bookings, public discovery, and admin participants.
- Ran a document-based pass through `ddd-scope`, `ddd-discover`, `ddd-subdomains`, `ddd-contexts`, `ddd-context-map`, `ddd-aggregates`, `ddd-domain-interactions`, and `ddd-model-review`; OpenSpec bridge was outside the current workflow.
- Corrected the initial review: the derived cancellation flow already proposes expiring ineligible waiting entries and checks promotion against the configured cutoff. These need explicit requirements/API alignment, especially for transient ineligibility.
- Found additional gaps: waiver status storage is absent from the conceptual data model; trainer read endpoint is absent from the API; allowed post-booking session edits are unspecified. No issue status or architecture approval changed.

## Exit-evidence upgrade

- Reconciled all ten use cases to the existing draw.io pages without changing the UX source. Expanded product requirements, REST API, data model, and DBML to align promotion/cutoff/expiry, waiver timestamps, trainer read access, and post-participation admin edit limits.
- Added accepted-for-design ADR 007. It assigns Scheduling policy and Booking participation ownership and specifies one PostgreSQL transaction with session-before-member locks, rechecks, bounded retry, and cancellation/promotion atomicity.
- Mapped all twelve MVP rules to use cases, validation points, persistence backstops, and examples. Documented seven concurrent interleavings for future PostgreSQL integration tests.
- No Prisma schema, migration, app implementation, or concurrency test was run. Operational race safety remains unverified; GitHub Issue #7 was not closed.

## Same-day DDD skill audit

- Re-checked the Issue #7 design against the upstream `ddd-*` validation checklists. Prior 0–10 model-review scores were subjective and withdrawn. `ddd-contexts` and `ddd-aggregates` require backtracking because the capacity/occupancy invariant crosses proposed context boundaries and `SessionParticipation` is not a settled aggregate. Scope, discovery, subdomains, context mapping, and domain-interaction deliverables are only partial.
- Corrected member action authorization to require an owned MemberProfile, independent of the single `User.role` value; a trainer/administrator may also be a member. Added the missing `POST /api/v1/me/waiver` contract for the existing modal. Clarified that waitlist entry does not pre-check overlap, whereas promotion does.
- Issue #7 remains open for boundary review. ADR 007 was not silently rewritten or superseded; a further boundary decision must receive a new ADR if the review changes its accepted design.

## Same-day DDD closure revision

- Applied the architecture-patterns skill to resolve the checklist backtrack. ADR 008 supersedes ADR 007 only where capacity/cutoff ownership was split: Scheduling now owns SessionSlot calendar definition; Booking owns BookableSession capacity/cutoff/participation and MemberReservationCalendar for immediate no-overlap enforcement.
- Added complete context glossary, anti-terms, evolution policy, contract map, subdomain measures, ambiguity resolutions, aggregate roots/value objects, semantic ports, event fields, ordering, and idempotency rules. The revised document passes the external DDD checklists for design with an explicit local multi-aggregate exception.
- No executable schema, migration, implementation, import-boundary test, or PostgreSQL concurrency test exists. Issue #7 remains open.

### Lock-anchor clarification

- Kept ADR 007's physical lock order consistent with ADR 008: BookableSession locks first; MemberReservationCalendar currently uses its owned `member_profiles` row as its lock anchor until Issue #8 selects a physical representation. This avoids a contradictory third lock or a premature extra table claim.

### Final documentation consistency check

- Rechecked the final artifacts with the architecture-patterns skill. Corrected stale references that described ADR 007 as the ownership boundary: ADR 008 now carries that role, while ADR 007 retains transaction safeguards. GitHub Issue #7 remains open and has only its original `## Summary` body, so the repository documents are the available local completion criteria.
