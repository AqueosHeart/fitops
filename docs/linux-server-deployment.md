# LAN-only Linux deployment

This deployment runs a separate fictional FitOps demo beside the AARC application. It uses its own PostgreSQL 16 container and named volume on an internal-only database network, keeps PostgreSQL off host ports, and binds the web app only to the private LAN address `192.168.1.208:3001`. The app also joins a separate bridge network so Docker can publish that host port. It does not use or modify AARC's service, database, reverse proxy, or port 3000. Do not use this setup for public internet access: it has no TLS or production hardening.

As of 2026-10-08, `npm audit --omit=dev` reports a high-severity advisory affecting the pinned Next.js 16.3.6; an update outside the current version pin is available. Keep this instance private until the framework is updated and the full verification gate passes.

## First deployment

On the Linux host, clone the intended branch to `/home/sebastian/fitops`, then create a private environment file:

```sh
git clone --branch codex/fitops-issue-12-admin-operations https://github.com/AqueosHeart/fitops.git /home/sebastian/fitops
cd /home/sebastian/fitops
umask 077
cp deploy/fitops.env.example .env
```

Edit `.env` locally on the host. Set unique random values for `POSTGRES_PASSWORD` and `BETTER_AUTH_SECRET`, and choose a private 15–128 character `FITOPS_DEMO_PASSWORD`. Keep the bind address and auth URL aligned with the host's private address. Never commit or share `.env`.

Build and start only this Compose project:

```sh
sudo docker compose --env-file .env -f deploy/compose.linux.yaml up -d --build
sudo docker compose --env-file .env -f deploy/compose.linux.yaml ps
```

The app container waits for PostgreSQL, applies committed migrations, then starts Next.js. On the brand-new database only, seed fictional records exactly once and verify them:

```sh
sudo docker compose --env-file .env -f deploy/compose.linux.yaml exec app npm run prisma:seed
sudo docker compose --env-file .env -f deploy/compose.linux.yaml exec app npm run db:verify
```

Use the seeded `admin@example.test` account and the private demo password from `.env` to test the admin workspace. Do not rerun the seed after anyone has used this database: the seed resets demo credentials/sessions and deterministic participation. The database volume persists across `down`/recreate; never use `down -v` unless intentionally deleting all FitOps server data.

## Update and checks

From `/home/sebastian/fitops`, fetch the branch and fast-forward only when the checkout is clean, then rebuild:

```sh
git status --short
git pull --ff-only
sudo docker compose --env-file .env -f deploy/compose.linux.yaml up -d --build
sudo docker compose --env-file .env -f deploy/compose.linux.yaml ps
curl --fail --silent --show-error http://192.168.1.208:3001/portal/login >/dev/null
```

If needed, inspect only FitOps logs with `sudo docker compose --env-file .env -f deploy/compose.linux.yaml logs --tail=100 app db`. Keep port 3001 private to the LAN. No firewall or router changes are part of this deployment.

## Stop and rollback

To stop the application while retaining its database, run `sudo docker compose --env-file .env -f deploy/compose.linux.yaml down` in the project directory. To roll back code, check out the previous known-good Git commit and rebuild. Preserve the volume unless a deliberate database deletion is intended. AARC remains independently managed by its own service and deployment process.
