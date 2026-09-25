---
type: session-record
project: FitOps
date: 2026-09-25
issue: 8
---

# Issue #8 fictional seed

- Added `web/prisma/seed.ts` and `npm run prisma:seed`.
- Seed data is fictional, uses `example.test`, and creates a full session with two bookings and two FIFO waitlist entries.
- It does not contain a usable password or stored credential hash in source.
- Verified local counts: six users, one session, two confirmed bookings, two waiting entries.
