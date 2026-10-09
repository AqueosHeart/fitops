# LAN-only Linux deployment

This deployment runs a separate fictional FitOps demo beside the AARC application. It uses its own PostgreSQL 16 container and named volume on an internal-only database network, keeps PostgreSQL off host ports, and binds the web app only to the private LAN address `192.168.1.208:3001`. The app also joins a separate bridge network so Docker can publish that host port. It does not use or modify AARC's service, database, reverse proxy, or port 3000. Do not use this setup for public internet access: it has no TLS or production hardening.

The repository's current `main` pins Next.js 16.3.8 and its full dependency audit passed in Issue #13 CI. The last documented server deployment, however, runs Next.js 16.3.6. A LAN HTTP 200 only proves that a route responds; it does not establish which commit is running or that the release gates passed on that host. Keep this instance LAN-only until its checkout and runtime are verified and the remaining release checks are completed.

## First deployment

On the Linux host, clone the intended branch to `/home/sebastian/fitops`, then create a private environment file:

```sh
git clone https://github.com/AqueosHeart/fitops.git /home/sebastian/fitops
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

From `/home/sebastian/fitops`, verify the checkout is clean, fetch `main`, and fast-forward only when safe. Never discard local server changes to make an update succeed:

Before pulling or rebuilding, create and validate a private database backup using the procedure in [Back up and reset the fictional demo database](#back-up-and-reset-the-fictional-demo-database). Do not proceed if the backup validation fails.

```sh
git status --short
git fetch origin main
git switch main
git pull --ff-only origin main
sudo docker compose --env-file .env -f deploy/compose.linux.yaml up -d --build
sudo docker compose --env-file .env -f deploy/compose.linux.yaml ps
curl --fail --silent --show-error http://192.168.1.208:3001/portal/login >/dev/null
sudo docker compose --env-file .env -f deploy/compose.linux.yaml exec app npm run db:verify
```

If needed, inspect only FitOps logs with `sudo docker compose --env-file .env -f deploy/compose.linux.yaml logs --tail=100 app db`. Keep port 3001 private to the LAN. No firewall or router changes are part of this deployment.

## Open Prisma Studio securely

Studio is an on-demand Compose profile. It can read and directly edit every FitOps table, so its host port is bound to loopback only and must be reached through SSH forwarding—not exposed on the LAN. Start it on the server:

```sh
cd /home/sebastian/fitops
sudo docker compose --profile studio --env-file .env -f deploy/compose.linux.yaml up -d studio-proxy
sudo docker compose --profile studio --env-file .env -f deploy/compose.linux.yaml ps
sudo docker compose --profile studio --env-file .env -f deploy/compose.linux.yaml logs --tail=30 studio studio-proxy
```

On the computer where you want to use the browser, keep this command running in a terminal:

```sh
ssh -N -L 5555:127.0.0.1:5555 sebastian@192.168.1.208
```

Then open <http://127.0.0.1:5555>. Close Studio when you are done:

```sh
sudo docker compose --profile studio --env-file .env -f deploy/compose.linux.yaml stop studio
```

The SSH tunnel is temporary; close its terminal to end forwarding. Studio edits go directly to PostgreSQL and bypass FitOps application rules. Use it only for this fictional demo database, and do not edit authentication/session or booking rows unless you intend the consequences.

## Back up and reset the fictional demo database

This procedure is destructive to **all FitOps database state** on this host, including accounts, sessions, bookings, and any data added through Prisma Studio. It does not touch AARC. Use it only when intentionally returning the FitOps demo to its deterministic fictional seed. Do not run it against a database with data you need to retain. The backup remains on the server and is not copied into Git.

First create and validate a private custom-format backup while the database is running:

```sh
set -euo pipefail
cd /home/sebastian/fitops
backup_dir=/home/sebastian/fitops-backups
sudo install -d -m 700 -o sebastian -g sebastian "$backup_dir"
backup_file="$backup_dir/fitops-$(date -u +%Y%m%dT%H%M%SZ).dump"
umask 077
sudo docker compose --env-file .env -f deploy/compose.linux.yaml exec -T db sh -c 'pg_dump --format=custom -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "$backup_file"
sudo chown sebastian:sebastian "$backup_file"
chmod 600 "$backup_file"
test -s "$backup_file"
sudo docker compose --env-file .env -f deploy/compose.linux.yaml exec -T db pg_restore --list < "$backup_file" >/dev/null
```

Then stop the app, reset only the FitOps database schema, restore the fictional seed explicitly, verify it, and restart:

```sh
sudo docker compose --env-file .env -f deploy/compose.linux.yaml stop app
sudo docker compose --env-file .env -f deploy/compose.linux.yaml run --rm app npx prisma migrate reset --force
sudo docker compose --env-file .env -f deploy/compose.linux.yaml run --rm app npm run prisma:seed
sudo docker compose --env-file .env -f deploy/compose.linux.yaml run --rm app npm run db:verify
sudo docker compose --env-file .env -f deploy/compose.linux.yaml up -d app
curl --fail --silent --show-error http://192.168.1.208:3001/portal/login >/dev/null
```

If reset or verification fails, leave the app stopped and restore the backup before starting it again:

```sh
sudo docker compose --env-file .env -f deploy/compose.linux.yaml exec -T db sh -c 'pg_restore --clean --if-exists --no-owner --no-privileges --exit-on-error -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < "$backup_file"
sudo docker compose --env-file .env -f deploy/compose.linux.yaml run --rm app npm run db:verify
sudo docker compose --env-file .env -f deploy/compose.linux.yaml up -d app
```

Keep the backup until the app and data are confirmed. Never use `docker compose down -v` for a reset: it deletes the persistent database volume and removes the recovery path.

## Stop and rollback

To stop the application while retaining its database, run `sudo docker compose --env-file .env -f deploy/compose.linux.yaml down` in the project directory. To roll back code, check out the previous known-good Git commit and rebuild. Preserve the volume unless a deliberate database deletion is intended. AARC remains independently managed by its own service and deployment process.
