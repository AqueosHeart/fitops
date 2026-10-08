---
type: session
project: FitOps
date: 2026-10-08
---

# Issue #13 CI accessibility findings corrected locally

- CI run [37841999623](https://github.com/AqueosHeart/fitops/actions/runs/37841999623) passed isolated PostgreSQL migration/seed, DB/API/constraint/concurrency suites, lint/type-check, full dependency audit, and production build. The E2E job failed during its first landing-page axe scan, before completing the journey.
- Axe reported text contrast ratios of 4.43–4.45:1 for muted copy against soft cream sections, plus named loading-grid `<div>` elements with ARIA attributes but no semantic role.
- Changed the shared muted color to `#62655b`, calculated at 4.86:1 or better on affected backgrounds, and gave named busy loading grids `role="status"`. Local lint and TypeScript pass.
- CI run [37842824345](https://github.com/AqueosHeart/fitops/actions/runs/37842824345) confirmed landing accessibility now passes and uncovered a test selector collision: generic `getByRole("status")` matched both the waitlist success message and loading region. Scoped the assertion to `.state-success[role='status']`.
- CI run [37843355892](https://github.com/AqueosHeart/fitops/actions/runs/37843355892) then revealed the fixed position assertion was not retry-safe and that `/trainer/sessions` is not an allowed `returnTo`; the app correctly displayed its unavailable-destination error. The test now signs in using `/app`, checks the trainer-only API is accessible, then verifies `/admin` denial. Automatic retries are disabled because this flow mutates seeded participation and CI creates a fresh database on each run.
- Repository review confirmed neither documented trainer UI route (`/trainer/sessions`, `/trainer/sessions/:id`) exists even though the API does and signed-in trainer routing targets the list route. Tracked the missing read-only workspace as [Issue #19](https://github.com/AqueosHeart/fitops/issues/19) and added it to FitOps Delivery Backlog (Phase 4, P1, Medium risk, Feature).
- CI run [37844839060](https://github.com/AqueosHeart/fitops/actions/runs/37844839060) passed the complete then-configured workflow, including all three axe scans. Added a browser-only performance budget test with three fresh loads for 1440×900 and 390×844, LCP ≤2500 ms and CLS ≤0.1, and attached raw JSON samples. These are synthetic CI budgets based on web.dev's published “good” thresholds, not field CWV; results await CI.
- Playwright trace capture is now disabled: traces include authenticated request headers and session cookies. The three failed-run report artifacts carrying traces have been deleted.
- Still pending: fresh CI rerun, complete booking/waitlist/cancel-promotion/admin browser flow, passing scans on all target views, and browser runtime performance measurement. The local Docker Linux engine was unavailable; no deployed service or database was touched.
