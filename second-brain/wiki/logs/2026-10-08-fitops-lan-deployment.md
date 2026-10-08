---
type: session-log
project: FitOps
date: 2026-10-08
---

# FitOps LAN deployment continuation

The user authorized a private-LAN deployment of the fictional FitOps app to the Linux host at `192.168.1.208`, separate from AARC. The intended checkout is `/home/sebastian/fitops`; the app is bound only to port 3001 and has its own PostgreSQL 16 named volume, with no host DB port. No AARC service, database, reverse proxy, or port 3000 changes are authorized or needed.

Added `web/Dockerfile`, `web/.dockerignore`, `deploy/compose.linux.yaml`, `deploy/fitops.env.example`, and `docs/linux-server-deployment.md`. The deployment applies committed migrations on app startup and requires one initial fictional seed only on the fresh volume. Local checks passed: Compose config, ESLint, TypeScript, Prisma validation, and optimized Next production build. Local Docker engine is unavailable, so the image was not built locally.

Remote deployment, seed/database verification, HTTP checks, and authenticated browser acceptance remain unverified. Next safe step is push the reviewed changes to the existing Issue #12 branch, then use the user's authorization for scoped sudo Docker operations in `/home/sebastian/fitops`. Keep generated secrets only in the host's mode-600 `.env`; do not print them or record them here. The SSH password shared in chat should be rotated after the work.
