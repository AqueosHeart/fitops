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

For the user's request to view the server DB, added the on-demand Prisma Studio profile and a Node TCP/HTTP proxy in the same container network namespace. The current Prisma CLI listens on container loopback; the proxy bridges to a container port that Docker can publish. The host publishes it on `127.0.0.1:5555` only. The local SSH tunnel is active from the Windows workstation; HTTP checks returned 200 for the Studio UI and its JS bundle. Browser panel opened at `http://127.0.0.1:5555`. Stop Studio with the documented `docker compose --profile studio ... stop studio`; close the SSH tunnel process separately. Studio is a direct database editor and bypasses domain rules; no row edits were made during setup. ADR 017 records this boundary.

## Authenticated admin browser and mobile fix (2026-10-08)

After the user signed in, the live browser rendered `/admin` with 3 scheduled sessions, 4 confirmed members, 4 waitlisted members, and capacity 6. The sessions page filter and no-results state worked; the fictional participant page showed two confirmed entries and FIFO positions 1–2. Create and edit forms rendered. Existing-participation edit correctly disabled schedule, trainer/program, and cutoff fields, allowing only capacity and explaining FIFO promotion; no save was submitted. Visiting `/portal/login` with the current staff session redirected back to `/admin`.

At the design's 390 px mobile width, browser inspection measured `document.scrollWidth=632` versus 375 px client width; the off-screen Actions header inside the wide table leaked into page-level scroll. Replaced the hidden span with a scoped column header carrying `aria-label="Actions"`. ESLint on `admin-workspace.tsx`, `npx tsc --noEmit`, and `npm run build` passed. `npm run test:api-contract` could not run because local PostgreSQL at `localhost:5432` returned `ECONNREFUSED`; it was not run against the live server DB.

Committed/pushed as `58f2760` and deployed by fast-forwarding `/home/sebastian/fitops`, rebuilding, and recreating only `fitops-app-1`. The PostgreSQL service stayed healthy. The user's existing admin session remained valid after restart. Post-deploy mobile measurement is `document.scrollWidth=375`, `document.clientWidth=375`, and the table wrapper alone scrolls (`clientWidth=307`, `scrollWidth=713`). No database rows were changed. Issue #12 mutation acceptance (create and capacity promotion) and member/trainer denial browser checks remain open; PR #17 stays Draft.
