---
type: session
project: FitOps
date: 2026-10-08
---

# Issue #13 CI accessibility findings corrected locally

- CI run [37841999623](https://github.com/AqueosHeart/fitops/actions/runs/37841999623) passed isolated PostgreSQL migration/seed, DB/API/constraint/concurrency suites, lint/type-check, full dependency audit, and production build. The E2E job failed during its first landing-page axe scan, before completing the journey.
- Axe reported text contrast ratios of 4.43–4.45:1 for muted copy against soft cream sections, plus named loading-grid `<div>` elements with ARIA attributes but no semantic role.
- Changed the shared muted color to `#62655b`, calculated at 4.86:1 or better on affected backgrounds, and gave named busy loading grids `role="status"`. Local lint and TypeScript pass.
- Still pending: push/CI rerun, complete booking/waitlist/cancel-promotion/admin browser flow, passing scans on all target views, and browser runtime performance measurement. The local Docker Linux engine was unavailable; no deployed service or database was touched.
