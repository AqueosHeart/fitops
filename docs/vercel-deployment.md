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

Only fictional demo data was used. Seed credentials are generated locally and stored in ignored `web/.env.demo.local`; never commit or publish that file. The Vercel environment files are also local-only and excluded from deployment uploads.

## Security and release gates

- Preview deployments require Vercel authentication; Production is public.
- `TRUST_PROXY=true` is configured. Verify trusted client IP behavior against the live deployment before claiming IP throttling is effective.
- Issue #14 remains open until the complete critical member booking journey and deployed IP-throttle proof are completed and recorded.
- Neon Free has service limits; it is suitable for this fictional demo, not evidence of production capacity or an SLA.
- The deployment build completed on Node `24.21.0` / npm `11.19.0`, while `web/package.json` pins Node `24.14.x` / npm `11.9.x`. Vercel also reported install-script and engine warnings; reconcile the runtime pin and confirm a clean build as follow-up work.

## Safe redeployment

Deploy from the repository root so Vercel applies the configured `web` Root Directory. Confirm the intended Git revision and production target before using `vercel deploy --prod`. Do not run the seed as a routine deployment step: it can reset deterministic demo reservations and account credentials. Use the migration command and seed only for an explicitly reviewed fresh fictional demo database. For production and Preview migration commands, use the unpooled connection (`DATABASE_URL_UNPOOLED` / `POSTGRES_URL_NON_POOLING`) to avoid a local `.env` URL taking precedence.

`/.vercelignore` and `/web/.vercelignore` exclude environment files and repository-only documentation/agent configuration from source uploads. Keep these exclusions when adjusting the project Root Directory.
