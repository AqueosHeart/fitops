# Vercel demo deployment

## Current deployment

- Vercel project: `fitops`; framework: Next.js; Root Directory: `web`.
- Public Production URL: <https://fitops-sebastian11.vercel.app>.
- Preview for `codex/landing-storybook-first-section`: protected branch deployment; branch alias is `https://fitops-git-codex-landing-storybook-first-section-sebastian11.vercel.app`.
- Database: Vercel Marketplace Neon, Free (`free_v3`) plan, `iad1` region.
- Configured environment variable names include `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `TRUST_PROXY`. Secret values must remain in Vercel or ignored local environment files.
- The current Preview and Production `DATABASE_URL` values point to the same Neon database. Preview is protected by Vercel authentication but can still mutate demo data. Keep all records fictional; separate the environments before using real data.

## Deployment and database evidence

The first hosted database was fresh. All six Prisma migrations were applied, the fictional seed was loaded, and `db:verify` confirmed 6 users, 3 sessions, 4 confirmed bookings, and 4 waitlist entries, with upcoming available and full sessions. The admin sign-in smoke reached `/admin/sessions`, received HTTP 200 from its admin sessions API, then signed out successfully. Public `/`, `/portal/login`, `/api/v1/programs`, and `/api/v1/sessions` returned HTTP 200. Production responses included `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.

On 2026-10-13, the deployed critical browser journey passed: a fictional member registered and joined the seeded waitlist, an administrator increased capacity, FIFO promotion completed, another seeded member cancelled and triggered promotion, and member/trainer authorization denials were verified. Accessibility scans passed during the journey and the browser reported no runtime errors. The temporary registered account was removed, then the deterministic fictional seed was restored; final database verification returned the original 6 users, 3 sessions, 4 confirmed bookings, and 4 waiting entries.

The live IP-throttle check also passed. Twenty failed logins supplied twenty different, spoofed `X-Forwarded-For` addresses; the following valid fictional admin sign-in was denied at the configured 20-attempt client-IP threshold. The verification script restores affected login-attempt rows to their pre-check values even if the check fails. This verifies the Vercel edge boundary and application behavior together; it is a focused release check, not a penetration test.

After merge, Vercel Production deployed `main` commit `81aff98137553d802cdf849484fb53bc0da7ecb1` successfully. The canonical public routes returned HTTP 200 and HSTS after that deployment. GitHub Issue #14 is Closed after PR [#23](https://github.com/AqueosHeart/fitops/pull/23) merged with its quality and Vercel Preview checks passing.

Only fictional demo data was used. Seed credentials are generated locally and stored in ignored `web/.env.demo.local`; never commit or publish that file. The Vercel environment files are also local-only and excluded from deployment uploads.

## Security and release gates

- Preview deployments require Vercel authentication; Production is public.
- `TRUST_PROXY=true` is configured. Verify trusted client IP behavior against the live deployment before claiming IP throttling is effective.
- `web/scripts/verify-production-ip-throttle.mjs` performs the guarded live check and restores its attempt-counter changes. PowerShell invocation from `web/` (the password stays in the local ignored file and process environment):

  ```powershell
  $line = Get-Content .env.demo.local | Where-Object { $_.StartsWith('FITOPS_DEMO_PASSWORD=') } | Select-Object -First 1
  $env:FITOPS_DEMO_PASSWORD = $line.Substring('FITOPS_DEMO_PASSWORD='.Length)
  $env:FITOPS_VERIFY_PRODUCTION_IP_LIMIT = 'YES'
  $env:BETTER_AUTH_URL = 'https://fitops-sebastian11.vercel.app'
  $env:TRUST_PROXY = 'true'
  npx vercel env run --environment production --project fitops -- node scripts/verify-production-ip-throttle.mjs
  Remove-Item Env:FITOPS_DEMO_PASSWORD, Env:FITOPS_VERIFY_PRODUCTION_IP_LIMIT, Env:BETTER_AUTH_URL, Env:TRUST_PROXY
  ```
- `web/scripts/reset-production-demo.mjs` is the guarded recovery/reset procedure. It refuses to proceed unless the database is Neon and contains exactly the six seeded demo accounts and three deterministic demo sessions. It then runs the seed against `DATABASE_URL_UNPOOLED` and `db:verify`. This rotates the six seeded credentials/sessions and resets participation on seeded sessions; keep only fictional demo data in this database. Do not use it if the preflight finds extra accounts/sessions. PowerShell invocation from `web/`:

  ```powershell
  $line = Get-Content .env.demo.local | Where-Object { $_.StartsWith('FITOPS_DEMO_PASSWORD=') } | Select-Object -First 1
  $env:FITOPS_DEMO_PASSWORD = $line.Substring('FITOPS_DEMO_PASSWORD='.Length)
  $env:FITOPS_RESET_PRODUCTION_DEMO = 'YES'
  $env:BETTER_AUTH_URL = 'https://fitops-sebastian11.vercel.app'
  $env:TRUST_PROXY = 'true'
  npx vercel env run --environment production --project fitops -- node scripts/reset-production-demo.mjs
  Remove-Item Env:FITOPS_DEMO_PASSWORD, Env:FITOPS_RESET_PRODUCTION_DEMO, Env:BETTER_AUTH_URL, Env:TRUST_PROXY
  ```
- Issue #14 acceptance evidence is complete and recorded in GitHub; it closed when PR #23 merged to `main` at `81aff98137553d802cdf849484fb53bc0da7ecb1`. The separate LAN deployment remains private and unchanged.
- Neon Free has service limits; it is suitable for this fictional demo, not evidence of production capacity or an SLA.
- The deployment build completed on Node `24.21.0` / npm `11.19.0`, while `web/package.json` pins Node `24.14.x` / npm `11.9.x`. Vercel also reported install-script and engine warnings; reconcile the runtime pin and confirm a clean build as follow-up work.

## Safe redeployment

Deploy from the repository root so Vercel applies the configured `web` Root Directory. Confirm the intended Git revision and production target before using `vercel deploy --prod`. Do not run the seed as a routine deployment step: it can reset deterministic demo reservations and account credentials. Use the migration command and seed only for an explicitly reviewed fresh fictional demo database. For production and Preview migration commands, use the unpooled connection (`DATABASE_URL_UNPOOLED` / `POSTGRES_URL_NON_POOLING`) to avoid a local `.env` URL taking precedence.

`/.vercelignore` and `/web/.vercelignore` exclude environment files and repository-only documentation/agent configuration from source uploads. Keep these exclusions when adjusting the project Root Directory.
