# ADR 011 Recheck the cutoff during cancellation promotion

## Status

Accepted for design; synchronized PostgreSQL proof remains pending.

## Context

ADR 007 requires a database-clock cutoff check after locks and atomic cancellation/promotion. Its cancellation description checks cutoff after the session lock, then scans waiting members. Locking an individual member can block behind another transaction. The configured cutoff can pass during that wait, making the original check stale before promotion.

## Decision

After locking each candidate member in a cancellation promotion scan, read the database wall clock again before changing that candidate's waitlist state or confirming a booking. If cutoff has passed, abort and roll back the entire transaction, including the original cancellation and any earlier expiries. This applies even when the candidate is ineligible. If no candidate is scanned, the cutoff check after the session lock remains authoritative for cancellation. Whole-transaction retries must re-evaluate time and state from the start.

This refines ADR 007's cutoff protocol. ADR 007's assumption that a check before the scan alone prevents post-cutoff promotion is superseded; its atomicity, FIFO, and lock-order decisions remain accepted. ADR 010 independently applies the same post-member-lock cutoff check to capacity-increase promotion.

## Consequences and proof

A cancellation that began before cutoff may fail if it waits for a member lock until cutoff. No partial cancellation, expiry, or promotion is committed. The API returns `422 BOOKING_CUTOFF_PASSED` to the owner. Add a synchronized PostgreSQL test that holds a candidate member lock across cutoff and verifies a full rollback, plus a test where the scan completes before cutoff.
