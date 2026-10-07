---
type: session-log
project: FitOps
date: 2026-10-07
---

# Issue #12 admin shell and signed-in My Account routing

## Goal

Simplify the administrator UI header and make My Account recognize a valid existing session.

## Decisions and changes

- Replaced the public marketing header plus a second admin nav with one admin header: Overview, Sessions, My Account, and Public site. Public Programs, Schedule, Plans, and Join Now are omitted in the admin workspace.
- `/portal/login` now resolves Better Auth session and current user on the server. An authenticated member-profile user goes directly to `/app` unless a validated return path is permitted for that role. Staff-only users route to their workspace.
- Updated the canonical draw.io flow and derived Mermaid route/admin flows. No route or business capability was added.

## Verification

- API-contract: 7/7 passed on isolated rerun. A prior run concurrent with other checks exhausted local PostgreSQL transaction timeouts and failed; rerun after those checks passed.
- Targeted ESLint: passed.
- TypeScript `tsc --noEmit`: passed.
- Production `next build`: passed (33 routes).
- `node scripts/validate-ux-sync.mjs`: passed (26 routes, separate 404, 163 scenarios per device).
- HTTP smoke checks: `/portal/login` returns 200 with anonymous login UI; `/admin` returns 307 to `/portal/login?returnTo=%2Fadmin` when anonymous.
- SVG preview regeneration was attempted via Mermaid CLI package resolution but stalled without output for over a minute; it was stopped. The two SVG previews remain stale relative to the updated Mermaid source files.
- Authenticated browser acceptance, including admin overview/session actions and role denials, remains outstanding. Issue #12 remains Backlog and Draft PR #17 remains in review preparation.

## Next safe action

Refresh the local browser and verify the admin header and My Account redirect using the already authenticated fictional test account; continue the remaining Issue #12 acceptance scenarios without exposing credentials or altering demo data.

## Acceptance follow-up (2026-10-07)

- User confirmed the separately requested local account was fictional. Read-only verification showed it already had the `ADMINISTRATOR` role; its profile, active sessions, bookings, and waitlist entries were preserved without a write. The address is not recorded.
- Repeated `test:api-contract` exposed a flaky test fixture caused by assuming concurrent registration completion order. Updated it to resolve member/admin fixtures by their labels; rerun passed 7/7, including admin operations and role boundaries.
- Full ESLint and TypeScript checks passed after the fixture fix. The production build had passed immediately before this test-only change.
- Renderer package execution stalled again with a pinned Mermaid CLI version, so SVG previews remain pending. The local browser-control service exposed no user browser tab; authenticated visual/interaction acceptance still needs a browser session.
