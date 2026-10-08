---
type: session-log
project: FitOps
date: 2026-10-08
---

# FitOps LAN deployment continuation

The user authorized a private-LAN deployment of the fictional FitOps app to the Linux host at `192.168.1.208`, separate from AARC. The intended checkout is `/home/sebastian/fitops`; the app is bound only to port 3001 and has its own PostgreSQL 16 named volume, with no host DB port. No AARC service, database, reverse proxy, or port 3000 changes are authorized or needed.

Added `web/Dockerfile`, `web/.dockerignore`, `deploy/compose.linux.yaml`, `deploy/fitops.env.example`, and `docs/linux-server-deployment.md`. The deployment applies committed migrations on app startup and requires one initial fictional seed only on the fresh volume. Local checks passed: Compose config, ESLint, TypeScript, Prisma validation, and optimized Next production build. Local Docker engine is unavailable, so the image was not built locally.

Installed Debian's `docker-compose` package because the existing Docker Engine had no Compose plugin, then cloned and deployed branch `codex/fitops-issue-12-admin-operations` at code commit `8951e16`. Generated DB/auth/demo credentials directly on the server into mode-600 `.env`; none were printed or recorded. The container build required build-only placeholder environment values for Prisma generation and OpenSSL libraries in both image stages. The app needed a second bridge network in addition to its private DB network for published LAN access. These deployment decisions are recorded in ADR 016.

Verified six migrations, one fictional seed, and `db:verify` (6 users, 3 sessions, 4 confirmed bookings, 4 waitlist entries). The server reports `192.168.1.208:3001->3000/tcp`; from the Windows workstation `/portal/login` returned 200 and `/admin` redirected to `/portal/login?returnTo=%2Fadmin`. Using the secret only inside the app container, seeded-admin API login returned 200 and the authenticated `/admin` request returned 200. `aarc.service` remained active and port 3000 remained unchanged. Local Compose validation, lint, TypeScript, Prisma validation, and optimized Next build passed.

The instance is private-LAN only and has no TLS. `npm audit --omit=dev` reports one high-severity issue in pinned Next.js 16.3.6 (fix available outside the pinned version range); do not expose this deployment publicly until the framework is updated and reviewed. Issue #12's interactive browser acceptance and Issue #14 production/release gates remain open. The SSH password shared in chat should be rotated because it was exposed here. For the seeded demo login, email is `admin@example.test`; the private password is in the server `.env` as `FITOPS_DEMO_PASSWORD` and should be viewed only on the server by its owner.
