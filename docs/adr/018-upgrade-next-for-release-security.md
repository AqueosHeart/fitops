# ADR 018 Upgrade the FitOps framework pin for release security

## Status

Accepted on 2026-10-09. Supersedes ADR 015 only on the pinned Next.js version; ADR 015's lint-toolchain decisions remain in force.

## Context

ADR 015 removed an incompatible, vulnerable Next ESLint dependency tree while retaining Next.js 16.3.6. Issue #13 later identified a high-severity advisory in that runtime version. The repository upgraded Next.js to 16.3.8, updated its lockfile, and passed the complete quality workflow including full dependency audit and production build. The LAN host was last documented on 16.3.6; its current checkout and runtime have not been verified.

## Decision

- Keep Next.js pinned to 16.3.8, with the matching committed lockfile, as the release candidate.
- Retain ADR 015's direct ESLint plugin setup; this version decision does not restore `eslint-config-next`.
- Do not claim or infer that the Linux host has been updated from repository or CI evidence. Verify the server checkout, deployed commit, runtime package version, and health after an authorized update.
- Keep the server LAN-only. This framework update does not configure TLS/HSTS, a trusted proxy, or public exposure.

## Consequences

- Repository and CI evidence can establish the candidate's dependency and build state, not the deployed server's state.
- The user-approved LAN-only deployment can continue to use email-keyed login limiting with `TRUST_PROXY` disabled. Do not trust forwarded client IP headers without a verified proxy boundary.
- A future change to deployment exposure requires a separate review and verified HTTPS/HSTS and edge configuration.

## Verification

The Issue #13 CI run passed audit and build on the merged framework update. Issue #14 readiness evidence records the separate, currently blocked server verification.
