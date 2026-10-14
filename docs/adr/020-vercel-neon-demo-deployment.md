# ADR 020 Deploy the hosted demo on Vercel with Neon

## Status

Accepted on 2026-10-13 for the first public HTTPS demo deployment.

## Context

The user requested deployment to Vercel and selected Neon’s $0 Free plan. FitOps previously had only local and LAN demo configurations. The release still needs the complete member booking journey and deployed IP-throttle proof before Issue #14 can be closed.

## Decision

1. Host the Next.js application as Vercel project `fitops`, rooted at `web`, connected to the repository. Production is served at `https://fitops-sebastian11.vercel.app`.
2. Use the Vercel Marketplace Neon resource on the Free (`free_v3`) plan. Store all connection strings and auth secrets only in Vercel environment settings or ignored local env files; documentation records variable names, never values.
3. Apply the repository’s six Prisma migrations and fictional demo seed to the fresh hosted database. No local database dump, user data, or real-person records are deployed.
4. Keep Vercel deployment protection enabled for Preview deployments and leave Production public. Set `TRUST_PROXY=true` so application origin checks use Vercel’s trusted request boundary; Vercel controls `X-Forwarded-For`.
5. Preview and Production currently share the same Neon database. Treat Preview as protected but data-mutating, and do not use either environment for real member data.
6. Keep Issue #14 open until the full critical member journey and deployed IP-rate-limit behavior are verified. The public admin sign-in smoke is not a substitute for those acceptance gates.

## Consequences

The demo is publicly reachable over HTTPS and has verified HSTS. Preview URLs require Vercel authentication. Neon Free has plan limits and is not a production capacity commitment. Separate Preview and Production databases should be configured before accepting non-fictional data.
