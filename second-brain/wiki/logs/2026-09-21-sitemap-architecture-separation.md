---
type: log
project: FitOps
date: 2026-09-21
status: review-required
---

# Separate Sitemap from Route & Access Architecture

## User goal and decisions

- Preserve the useful route/access diagram and create a simpler sitemap containing page URLs only.
- Keep Pages 02 through 07 stable; prepend `00 Sitemap` and rename Page 01 to `01 Route & Access Architecture`.
- Use the 26 already-defined page URLs. Landing anchors and `/404` system behavior remain in the architecture view. No standalone admin-session detail or booking-detail page was invented.
- Label confirmed reservations and waitlist entries as sections of `/app/bookings`, cancellation as a modal, cookie notice as a banner, and the route guard/404 as system behavior.
- Make enrollment explicit as Join, plan selection, registration, account/session creation, and validated member intent or dashboard fallback. Keep Portal Login separate.

## Changes and evidence

- Updated draw.io first; derived `sitemap.mmd` and `route-access-architecture.mmd`, their SVG previews, and the Obsidian review hub.
- Static synchronization checks cover 26 page-only URLs separately from the existing 29 route/anchor label mappings. The latter still do not prove all flow semantics or Figma visual correctness.
- Mermaid SVG generation succeeded with the existing CLI and installed Edge after bundled Chromium/Chrome launch failures. The compact sitemap preview was visually inspected.
- Project context and sprint mirror updated without marking Issue #6 or flow approval complete.

## Unresolved and next action

- Review the two native diagram pages. Native draw.io CLI did not produce its requested PNG, so native rendering is not claimed as visually verified; XML integrity and geometry are checked separately.
- Existing inactive-membership enrollment/recovery semantics remain an open review item. This presentation change does not resolve the full authentication specification.
- Figma execution and visual QA remain pending. No app implementation, publication, or GitHub status changes occurred.
- The workspace already contained substantial uncommitted work; this change is left uncommitted alongside it.
