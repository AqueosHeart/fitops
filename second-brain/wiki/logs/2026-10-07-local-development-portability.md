---
type: session-log
project: FitOps
date: 2026-10-07
---

# Local development portability

## Goal

Allow the project to be cloned and run on a second Windows computer with its own local PostgreSQL database.

## Changes

- Added root `compose.yaml` for PostgreSQL 16, loopback-only port 5433, health checks, and a persistent named volume; Compose credentials come from ignored root `.env`.
- Added `docs/local-development.md` with first-clone steps, private environment setup, migrations, seed, verification, and volume/data boundaries.
- Updated root and web READMEs to describe the implemented stack and point to the real setup guide.
- Added optional `FITOPS_DEMO_PASSWORD` handling in the fictional seed with the existing 15-128 character policy. The value is supplied only via ignored local environment configuration; blank retains random unrecoverable seed passwords.

## Data and safety

- New computers receive schema and fictional seed data, not a dump of this computer's database.
- No actual `.env`, database file/dump, credential hash, session token, account, or local booking activity was committed. Tracked `.env.example` files contain placeholders only.
- Compose binds PostgreSQL only to `127.0.0.1`; generated local credentials are for disposable development only.
- `docker compose up`, migrations, and database verification could not be executed on the current computer because Docker Desktop's Linux engine pipe is unavailable. They remain first-run verification steps on a machine with a working Docker engine.

## Next action

On the home computer, follow `docs/local-development.md`, run Compose health checks plus migrations/seed/verification, and then continue authenticated Issue #12 acceptance. This does not close the separate production deployment scope in Issue #14.
