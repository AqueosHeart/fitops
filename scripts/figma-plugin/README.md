# Practice Athletic Club Master Toolkit

This local Figma development plugin preserves its existing source-of-truth reminder and brand action. **Build Low-Fi Wireframes** now creates complete page mockups instead of grouped route-coverage cards.

## Output

- 26 page routes plus a separate `/404` fallback, each with its own desktop and mobile screen.
- 163 scenarios per device: **163 desktop + 163 mobile frames** (326 total).
- Desktop width 1440 px; mobile width 390 px. Content-driven page heights expose every section. Dialog scenarios use 1024/844 px viewport mockups with a dimmed background.
- 27 separate versioned Figma pages, one per route/fallback. Each has paired desktop/mobile scenarios and a compact local index. All screen frames are direct children of their page.
- Separate public and protected shells, desktop workspace navigation, mobile roster cards, complete public footer links, and named landing anchors.
- Booking, full-class waitlist, cancellation, promotion, consent, validation, inactive membership, recovery, role denial, loading, empty, failure, pending, and success examples.
- Selected-plan and selected-session examples survive the demonstrated enrollment paths.

The figures and forms are fictional mockups. Prototype buttons move between preset examples; fields do not submit real requests. Recovery explicitly sends no email. Neutral styling does not approve the brand.

Every run preserves previous pages. An interrupted/failed generation marks its new pages `[Incomplete]` for inspection. Progress is reported during each route and while actions are linked. The generator reuses a suitable primary button and fonts from existing kit pages when available; otherwise it builds editable neutral fallback elements.

See [the coverage matrix](../../docs/design/wireframe-coverage.md) for every route, section, and scenario. The authoritative inventory is Page 08 of `second-brain/wiki/design/FitOps User Flows.drawio`; update it before changing derived content.

## Build and validate

```powershell
node scripts/figma-plugin/build.mjs
node --check scripts/figma-plugin/code.js
node scripts/validate-ux-sync.mjs
node scripts/test-wireframe-generator.mjs
git diff --check
```

- `brand-and-flows.js`: existing toolkit behavior and guarded UI message router.
- `wireframe-content.js`: route-specific copy, sections, fictional examples, and states.
- `wireframes.js`: native Figma layout, responsive rendering, navigation, and versioning.
- `code.js`: generated bundle; do not edit directly.
- `ui.html`: primary action, progress, completion, and error feedback.

The structural test executes the real generator with a Plugin API double. It verifies route/state pairs, action destinations, horizontal bounds, blocked-state behavior, role-denied privacy, preserved user work, kit reuse, and safe reruns. It is **not native Figma visual QA**.

## Run in Figma

1. Import `scripts/figma-plugin/manifest.json` through **Plugins > Development > Import plugin from manifest** if not already imported.
2. Open the target design file. Existing UI-kit components may be present but are not required.
3. Reload/reopen **Practice Athletic Club Master Toolkit** after rebuilding.
4. Click **Build Low-Fi Wireframes** and wait for the completed count.
5. Use the plugin page chooser (or Figma page list) to switch routes, then use each page's scenario index. Local states have native prototype links. Cross-page controls carry the destination in their layer names; native prototype navigation cannot cross pages. Self-targeting navigation/blocked submissions do not receive a reaction.

The previous combined-page output failed native Figma reaction validation. The corrected build passes stricter structural tests for top-level, same-page, different-frame destinations; native rerun and visual review remain pending. Issue #6 is not marked complete.

## Split the existing giant page

Reload the rebuilt plugin, select the old `FitOps Wireframes / Complete / ...` page, then click **Split current combined page**. The action moves existing screens into separate route pages without redrawing them, clears invalid reactions, restores valid local reactions, and retains original annotations on the old page. It does not regenerate prototype actions that were never written before the earlier failure; use Build Low-Fi Wireframes for a fresh, fully linked local-state version. The split action refuses unrelated pages.
