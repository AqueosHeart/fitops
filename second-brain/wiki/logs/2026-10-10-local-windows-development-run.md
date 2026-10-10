---
type: session-log
project: FitOps
date: 2026-10-10
---

# Windows local development run

## Goal

Assess the GitHub-synced FitOps repository and run it locally on the Windows workstation.

## Evidence and changes

- Confirmed `main` was synced with `origin/main` at `88a6644` before setup.
- Started Docker Desktop 29.6.2 and created a fresh Compose PostgreSQL 16 volume bound to `127.0.0.1:5433`. Generated local secrets into ignored `.env` files; no existing FitOps database volume was present.
- Installed dependencies with Node 24.15.0/npm 11.12.1. `npm ci` succeeded with an engine warning against the package's 24.14.x/11.9.x version declarations.
- Generated Prisma Client, applied six migrations, seeded fictional demo data, and verified 6 users, 3 sessions, 4 confirmed bookings, and 4 waitlist entries.
- Started Next.js 16.3.8 with hostname `127.0.0.1` on port 3000. `/` and `/portal/login` returned HTTP 200. The server is local development only.
- No application code changed. Updated the README status and local guide clone example after finding stale project status/branch information. No tests or production build were run. No LAN service or deployed database was touched.

## Findings and next step

- Root `README.md` and `docs/local-development.md` were refreshed for current project status and cloning `main`. The guide still documents the Node/npm versions pinned by the package; this workstation uses newer 24.15.0/11.12.1 versions, which installed successfully with engine warnings.
- Issue #14 still owns release evidence; HTTPS/HSTS and trusted-proxy requirements remain uncleared. This local run is not release evidence.
- Keep `npm run dev` and the Compose database running to use the app. Local admin email is `admin@example.test`; its generated password is stored in ignored `web/.env` as `FITOPS_DEMO_PASSWORD`.
