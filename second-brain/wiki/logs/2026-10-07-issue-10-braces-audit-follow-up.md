---
type: session-record
project: FitOps
date: 2026-10-07
---

# Issue #10 `braces` audit follow-up

## User goal

Continue addressing the remaining high dependency audit finding using the best safe option.

## Evidence and decision

- `npm ls braces micromatch fast-glob @next/eslint-plugin-next eslint-config-next --all` and `npm explain braces` confirm the chain `eslint-config-next@16.3.6 -> @next/eslint-plugin-next@16.3.6 -> fast-glob@3.3.1 -> micromatch@4.0.8 -> braces@3.0.3`, marked dev-only.
- `npm audit --omit=dev --audit-level=high` reports 0 vulnerabilities.
- The upstream advisory has no patched published version. Its proposed fix PR is closed and has a reported compatibility regression. npm's force-fix downgrades `eslint-config-next` to v14.
- Registry verification shows the latest official `eslint-config-next@16.4.0` still uses `@next/eslint-plugin-next@16.4.0 -> fast-glob@3.3.1`; published `braces` remains 3.0.3. A config-only upgrade does not remediate this.
- Fresh acceptance rerun passed auth (5), API contract (7), PostgreSQL constraints (2), PostgreSQL races (10), lint, TypeScript, Prisma validation/generation, and the production build (14 static pages); production audit reports 0 findings.
- Kept the approved Next 16 lint toolchain; did not add an unreviewed fork, lie with a same-version override, or force downgrade. The five high full-audit findings remain, confined to the development lint chain.

## Next safe action

Recheck the upstream `braces` advisory/release before the next dependency refresh and replace the chain only when an upstream-patched compatible release is available. Do not call the full audit clean until then.
