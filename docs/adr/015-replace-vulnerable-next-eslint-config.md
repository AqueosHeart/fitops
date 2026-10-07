# ADR 015 Replace the vulnerable Next ESLint config with direct lint plugins

## Status

Accepted on 2026-10-07. Supersedes the temporary Issue #10 dependency disposition recorded in the 2026-10-07 `braces` audit follow-up.

## Context

The pinned `eslint-config-next@16.3.6` pulls `@next/eslint-plugin-next@16.3.6 -> fast-glob@3.3.1 -> micromatch@4.0.8 -> braces@3.0.3`. GitHub Advisory GHSA-vfj7-8cjw-p6xm identifies all published `braces` versions through 3.0.3 as affected and lists no patched version. npm's forced fix downgrades the Next ESLint config to 14.2.35, which is incompatible with the pinned Next.js 16 application. The proposed upstream fix PR is closed and not suitable to consume as an unofficial fork.

## Decision

1. Remove `eslint-config-next` and its Next-specific ESLint plugin from the development dependency tree until a compatible audited release is available.
2. Use pinned direct ESLint dependencies and a flat config for ESLint core recommended rules, TypeScript recommended rules, React recommended rules, React Hooks recommended rules, JSX accessibility recommended rules, and import recommended rules with the TypeScript resolver.
3. Keep Next.js 16.3.6 and preserve the existing `npm run lint` gate. Do not downgrade the app framework or conceal the advisory with an audit exception.
4. Suppress `no-control-regex` only at the return-path validator's intentional ASCII-control rejection regex, with a source comment explaining the security purpose.

## Consequences

- `npm audit --audit-level=high` can run with zero findings while the application remains on Next.js 16.
- ESLint no longer runs the `@next/next/*` framework-specific rules. Build, TypeScript, API integration, and security tests remain separate gates but do not replace every framework lint rule.
- Reevaluate this decision when Next publishes a compatible lint config whose complete dependency tree is audit-clean. Restore the framework plugin only after lint, tests, build, and full audit pass together; supersede this ADR if its return changes.

## Alternatives considered

- **Force npm's automatic fix:** rejected because it downgrades `eslint-config-next` to v14.
- **Install a fork or Git commit of `braces`:** rejected because the proposed upstream patch is unmerged and has reported compatibility regressions.
- **Leave the high finding as dev-only:** previously selected as the conservative interim disposition, superseded by this ADR after the owner authorized changing the lint toolchain to complete the full audit.

## Verification gate

Require zero findings from `npm audit --audit-level=high`, passing `npm run lint`, all Issue #10 focused integration suites, `npx tsc --noEmit`, Prisma validate/generate, production build, and `git diff --check`.
