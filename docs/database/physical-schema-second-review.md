# Issue #8 physical schema: second design review

Date: 2026-09-23. Reviewed the [revised plan](physical-schema-plan.md), [ADR 009](../adr/009-one-physical-session-row.md), [ADR 010](../adr/010-promote-waitlist-on-capacity-increase.md), conceptual DBML, requirements, API, architecture, and canonical/derived administrator and authentication flows. This is a document and static-validation review. No schema was migrated and no PostgreSQL transaction was executed.

## Disposition of the first review

| Finding | Second-pass result | Evidence / remaining proof |
| --- | --- | --- |
| H1: duplicated Scheduling/Booking snapshot | **Design resolved.** One `class_sessions` physical row maps to separate domain views, so public and booking time use the same columns. | ADR 009 and the plan's physical-mapping section. Module imports and transaction behavior still need implementation tests. |
| H2: unspecified authentication persistence | **Schema choice resolved.** Own `users.password_hash` and `auth_version`; Auth.js Credentials uses JWT sessions, with no Auth.js adapter tables. Recovery is demo guidance, not a reset or email delivery. | Plan's authentication section and corrected canonical auth flow. Hashing parameters, JWT lifetime, throttling, and demo access abuse controls remain Issue #9 security work. |
| H3: cross-table confirmed-plus-waiting state | **Design rule resolved, execution unproven.** All participation writers share the session lock, status transition table, and active-state check. Partial unique indexes protect each table separately; the cross-table invariant remains transactional by ADR 009. | Plan transaction matrix and required synchronized PostgreSQL tests. This must not be called proven until those tests pass. |
| H4: vague physical columns | **Design specified.** The plan lists native `timestamptz(3)`, UUID, bigint, nullability, defaults, FKs/actions, state checks, and indexes. | Exact Prisma syntax and migration SQL still depend on a pinned version and need inspection plus rejected-write tests. |
| M1: trainer overlap | **Design resolved.** A PostgreSQL GiST exclusion constraint on trainer and half-open time range backs the trainer lock/check. | Migration and concurrent create/edit tests pending. |
| M2: history-based edit freeze | **Design resolved.** Any booking or waitlist row, including inactive history, freezes program/trainer/time/cutoff/status; only capacity may change. | Plan, requirements, API, and edit test obligation. |
| M3: promotion provenance and timestamp pairs | **Design resolved.** Promoted booking carries a unique same-member/session source waitlist FK, and state/timestamp checks are specified. | Composite FK and CHECK SQL must be verified in a real migration. |
| M4: fictional plan catalog | **Design resolved.** One versioned in-code catalog supplies publication, public response, and registration validation. | Integration tests must confirm both use the same catalog. |

## New finding discovered and resolved in this pass

**Capacity increase could bypass the waitlist.** An administrator could previously increase capacity while members waited, leaving an open seat for a new direct booking. [ADR 010](../adr/010-promote-waitlist-on-capacity-increase.md) now requires capacity increase and first-eligible FIFO promotion in one transaction before cutoff. It rejects increases after cutoff while waiting entries remain. The canonical draw.io administrator flow was updated before its Mermaid and wireframe source copy; requirements and the PATCH contract were aligned. Add capacity-increase versus booking/cancellation, multiple-seat, ineligible-first, rollback, and cutoff-race PostgreSQL tests. No new route or scenario state was introduced.

The final lock-order pass also requires an admin editor to re-read the trainer assignment after obtaining the session lock and restart if it changed. A capacity increase rechecks the cutoff after each candidate member lock and rolls back if it passes before promotion. Both are design rules pending synchronized PostgreSQL proof.

## Residual implementation gates and limits

1. **No executable proof:** Prisma schema, SQL migrations, rejected-write tests, and synchronized PostgreSQL race tests do not exist. The design may still reveal issues when applied to a real database. Issue #8 remains open.
2. **Version pin:** The implementation must choose compatible Prisma, Auth.js, Node, and PostgreSQL versions before generating a migration. Current Prisma releases have different migration workflows; the plan intentionally specifies required SQL properties rather than pretending a version-specific command is already verified.
3. **Security:** Issue #9 must define password hashing parameters, demo-persona access controls, login throttling, JWT expiry, and revocation behavior. Clearing the current JWT cookie on sign-out does not invalidate a copied token; `auth_version` allows explicit server-side invalidation only when checked on every protected request. [Auth.js session-strategy tradeoffs](https://authjs.dev/concepts/session-strategies).
4. **Native visual QA:** Local draw.io XML and Mermaid/Figma source checks can validate structure and text, but do not constitute native Figma or Penpot visual approval. Existing external static mirrors may need regeneration before they are presented as current.

## Second-pass result

The eight first-pass **design** findings and the new capacity-fairness gap have documented resolutions. The revised plan is suitable for implementation planning, subject to the existing Sprint 0 and Sprint 1 design gates. It is **not** Issue #8 completion evidence. The next review must inspect the actual migration SQL and PostgreSQL test results before claiming correctness.
