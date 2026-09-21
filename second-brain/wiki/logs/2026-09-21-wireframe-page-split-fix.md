---
type: log
project: FitOps
date: 2026-09-21
status: native-rerun-pending
---

# Split wireframes and fix invalid prototype destinations

- User supplied a native Figma reaction error and screenshot of the oversized combined page, and explicitly requested separate pages.
- The prior mock test checked only page equality and missed nested destinations and self-navigation. Tightening it reproduced a failure against the old generator before the fix.
- Updated draw.io Page 08 first. The generator now creates 27 separate versioned route pages, with desktop/mobile state frames directly under each page and a per-route index.
- NAVIGATE requires a different top-level frame on the same page. Cross-page targets are labeled in layer names and reached with the plugin page chooser. Current-page/self-targeting actions keep their visible state without a native reaction.
- Added Split current combined page: moves the old generated screens into route pages, preserves content and annotations, clears invalid reactions, and restores existing valid local reactions. It refuses unrelated pages and does not invent links missing from the earlier failed run.
- Full regeneration still covers 163 scenarios per device (326 screens), now with 942 valid local reactions. Tests cover direct page parents, same-page/different-frame constraints, safe reruns, kit reuse, and legacy migration preserving existing objects and annotations.
- Rebuilt the existing plugin bundle. Native rerun and visual verification remain pending; the screenshot proves the previous run failed, not that this fix has run in Figma.
- No publication or commit; existing workspace edits remain preserved. Next action: reload the plugin and split the existing Complete page, or build a fresh 27-page version.
