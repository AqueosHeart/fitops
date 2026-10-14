# Practice Athletic Club — FitOps case study

**Status:** Portfolio demo, updated 2026-10-13. The fictional demo is publicly deployed; it is not a commercial service or production gym system. Release evidence is tracked in [GitHub Issue #14](https://github.com/AqueosHeart/fitops/issues/14).

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
- On 2026-10-13, the deployed Vercel critical browser journey passed member registration, waitlist join, administrator capacity increase, FIFO promotion, cancellation/promotion, and member/trainer access controls. The temporary account and test data were removed/restored to the six-user fictional seed afterward.
- Live login throttling passed with twenty distinct spoofed forwarding addresses; Vercel's request boundary kept them under the actual client IP and blocked the next valid demo-admin login at the configured threshold. The guarded verification script restored the counters. This is a focused proxy-boundary check, not a penetration test.

## Deployment and release status

The public fictional demo runs at <https://fitops-sebastian11.vercel.app> on Vercel with a Neon Free database. Public routes and HTTPS/HSTS were verified. Preview deployments require Vercel authentication; Preview and Production currently share the demo database. The existing Linux demo remains separately bound to the private LAN and uses plain HTTP; it is not the public demo.

## Scope and limits

- Fictional data only; no real club, members, payments, or production records.
- CI browser and performance results are automated evidence, not human usability research or field measurements.
- No external penetration test, backup/restore exercise, operational monitoring, or commercial-production readiness claim is made here. Vercel Hobby is intended for personal, non-commercial use; confirm plan terms before any business use.
- Release evidence and remaining acceptance criteria are tracked in [GitHub Issue #14](https://github.com/AqueosHeart/fitops/issues/14).
