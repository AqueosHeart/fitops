# Local development on another computer

This guide recreates FitOps on a second Windows computer using the committed PostgreSQL migrations and fictional seed. It does not copy this computer's live database, accounts, password hashes, sessions, or booking activity. Those belong in a private backup workflow, never in Git.

## Requirements

- Git
- Docker Desktop with its Linux/WSL 2 engine running
- Node.js 24.14.x and npm 11.9.x (the versions declared by `web/package.json`)

## First-time setup

From PowerShell, clone the repository, prepare the private Compose environment, then start PostgreSQL 16:

```powershell
git clone https://github.com/AqueosHeart/fitops.git
cd fitops
Copy-Item .env.example .env
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
notepad .env
docker compose up -d --wait db
```

Generate a private URL-safe password and replace the placeholder in root `.env`. The database listens only on this computer (`127.0.0.1:5433`) and stores its files in a named Docker volume. The named volume survives `docker compose down`; avoid `docker compose down -v` unless you intend to delete this computer's local database.

Create a private app environment file and a password for the seeded fictional admin:

```powershell
Copy-Item web/.env.example web/.env
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
notepad web/.env
```

Use the same private, URL-safe PostgreSQL password in root `.env` (`POSTGRES_PASSWORD`) and in `web/.env` (`DATABASE_URL`). Generate a separate value for `BETTER_AUTH_SECRET`. Set `FITOPS_DEMO_PASSWORD` to a private 15-128 character local test password if you want to sign in as the seeded `admin@example.test` account. Keep both `.env` files on the machine; they are ignored by Git. If the demo password is left blank, seed accounts receive random credentials that cannot be used to sign in.

Install and initialize the app from its directory:

```powershell
cd web
npm ci
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run db:verify
npm run dev
```

Open <http://localhost:3000>. Use the seeded admin email and the local password you set above to verify administrator routes. If port 3000 is already occupied, start with `npm run dev -- --port 3001` and update `BETTER_AUTH_URL` in `web/.env` to `http://localhost:3001` first. The seed is intended for a brand-new local database: rerunning it replaces credentials/sessions for seeded accounts and resets participation for its deterministic demo sessions. Do not seed an existing database containing work you want to keep.

For later sessions, start Docker Desktop and run `docker compose up -d db` from the repository root, then `npm run dev` from `web`. Migrations are versioned in `web/prisma/migrations`; for a fresh clone with an existing volume, `npx prisma migrate deploy` applies any pending migrations without reseeding.

## Data and portability

Git carries the schema, migrations, seed logic, and app source. The Compose volume and `.env` remain local to each computer. The second computer starts with a fresh fictional dataset; reservations or accounts created on this computer are not synchronized. To move a private database snapshot between computers, use a separately protected backup and transfer method—do not add a dump, volume contents, credentials, or session tokens to this repository.

This Compose setup is for local development only. Do not expose its PostgreSQL port or reuse its local credentials for an internet-facing deployment.
