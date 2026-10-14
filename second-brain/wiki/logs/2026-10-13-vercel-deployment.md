---
type: session
project: FitOps
date: 2026-10-13
---

# Vercel demo deployment

User confirmed Vercel login and selected Neon Free ($0). Created the Vercel `fitops` project rooted at `web`, connected it to the GitHub repository, attached Neon Free, ran all six migrations, and seeded fictional demo data. Public Production is https://fitops-sebastian11.vercel.app; Preview requires Vercel authentication. Preview and Production share one DB for now.

Verified public route responses and HSTS; `db:verify` reported 6 users, 3 sessions, 4 confirmed bookings, and 4 waitlist entries. Browser smoke logged in as the fictional administrator, loaded `/admin/sessions`, received a 200 from the admin sessions API, signed out, and had no runtime errors. The complete member booking journey and deployed IP-throttle behavior were not tested; GitHub Issue #14 remains Open. Sprint 7 is complete and no verified Sprint 8 assignment was found.

Added ADR 020 and a deployment runbook. Deployment settings/credentials are not recorded here; generated demo credentials and Vercel local environment files are ignored.

## Release acceptance follow-up

The deployed Playwright critical journey passed registration, waitlist, admin capacity increase, FIFO promotion, cancellation-triggered promotion, access-denial, accessibility, and runtime-error checks. The single temporary fictional test account was deleted. The remote seed was rerun and `db:verify` restored the original six users, three sessions, four confirmed bookings, and four waiting entries.

The guarded production IP-throttle script sent twenty unique spoofed `X-Forwarded-For` addresses; Vercel aggregated the attempts by actual client IP and blocked the next valid admin login at threshold 20. It restored the affected counters. The final source of truth for Issue #14 has not yet been updated. Preview and Production still share a fictional database.
