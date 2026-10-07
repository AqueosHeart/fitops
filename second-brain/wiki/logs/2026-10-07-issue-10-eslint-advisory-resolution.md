---
type: session-record
project: FitOps
date: 2026-10-07
---

# Issue #10 lint advisory resolution

## User goal

Finish the remaining Issue #10 dependency-audit work and publish the completed branch for review.

## Decision and changes

- The owner authorized replacing the Next ESLint integration and publishing/opening a PR.
- Removed vulnerable `eslint-config-next` / `@next/eslint-plugin-next` dependencies. Added pinned direct ESLint core, TypeScript, React, React Hooks, JSX accessibility, and import rules with TypeScript resolution.
- Added ADR 015, documenting the deliberate loss of Next-specific `@next/next/*` lint rules until an audit-clean compatible plugin is available. Kept the control-character regex suppression narrow to the return-path validator.

## Verification

- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm ls braces eslint-config-next @next/eslint-plugin-next --all`: empty.
- `npm run lint`: pass.
- Auth 5/5; API contract 7/7; PostgreSQL constraints 2/2; synchronized races 10/10.
- TypeScript, Prisma validation/generation, production build (14 static pages), and `git diff --check`: pass.

## Delivery status

Branch: `codex/fitops-planning-checkpoint`. Push and PR creation are authorized and remain the next action. Issue #10 stays open until PR CI and maintainer review/closure.
