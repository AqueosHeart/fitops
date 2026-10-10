# Practice Athletic Club — FitOps case study

**Status:** Draft, dated 2026-10-10. The public release gates in [GitHub Issue #14](https://github.com/AqueosHeart/fitops/issues/14) are still open. This document describes verified implementation and evidence; it does not claim a public production launch.

## The problem

Practice Athletic Club is a fictional fitness-club portfolio product. Members need to find and reserve classes, while staff need dependable schedule and capacity operations. The core engineering problem is keeping booking, cancellation, and waitlist promotion correct when requests race, while protecting member and staff workspaces.

## What was built

- A public discovery site with schedule browsing and fictional membership enrollment.
- A protected member workspace for booking, waitlisting, booking history, cancellation, and account security.
- A protected trainer workspace showing assigned sessions and aggregate attendance counts.
- A protected administrator workspace for schedule and capacity operations.
- Versioned PostgreSQL schema and migrations, fictional seed data, server-side authorization, and a documented REST API.

The application is a Next.js and TypeScript modular monolith with PostgreSQL, Prisma, Better Auth, and Zod. Booking and waitlist writes are decided transactionally on the server; displayed availability is advisory. No payments or real member data are involved.

## Engineering evidence

- The Issue #13 quality workflow passed database integration and concurrency suites, lint/type checks, dependency audit, production build, critical browser journey, accessibility scans, and synthetic performance budgets in [GitHub Actions run 37846080789](https://github.com/AqueosHeart/fitops/actions/runs/37846080789). Those performance samples are CI lab data, not field Core Web Vitals.
- The trainer workspace passed isolated database/API, build, browser, and accessibility checks in [GitHub Actions run 37956811965](https://github.com/AqueosHeart/fitops/actions/runs/37956811965).
- The database integration suite includes ten synchronized PostgreSQL race and rollback cases. These verify selected booking, waitlist, cancellation, capacity, and promotion interleavings; they are not a proof that every possible production failure is handled.
- On 2026-10-10, a fresh Windows local setup applied all six migrations and verified fictional data (6 users, 3 sessions, 4 confirmed bookings, 4 waitlist entries). The local home and login pages returned HTTP 200. This verifies local startup only.

## Deployment and release status

The documented Linux demo is bound to the private LAN and uses plain HTTP. Its last recorded deployment check was 2026-10-08 on commit `8951e16` with Next.js 16.3.6; current repository `main` is newer. The local Windows instance runs only on loopback and is not the public demo.

There is no verified public URL or public smoke test yet. HTTPS/HSTS, a trusted proxy boundary before enabling IP-based rate limiting, an updated Linux deployment, public critical-flow smoke checks, and final release review remain open. Do not expose the current direct-bound HTTP service to the internet.

## Scope and limits

- Fictional data only; no real club, members, payments, or production records.
- CI browser and performance results are automated evidence, not human usability research or field measurements.
- No public availability, external penetration-test, backup/restore exercise, operational monitoring, or production readiness claim is made here.
- Release evidence and remaining acceptance criteria are tracked in [GitHub Issue #14](https://github.com/AqueosHeart/fitops/issues/14).
