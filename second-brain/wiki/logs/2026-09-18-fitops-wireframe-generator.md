---
type: session-record
project: FitOps
date: 2026-09-18
status: pending-figma-execution
---

# FitOps wireframe generator

## Goal

Translate the complete canonical user-flow architecture in `FitOps User Flows.drawio` into low-fidelity desktop and mobile wireframes inside the duplicated WebbyFrames community Figma kit.

## Decisions

- Treat the draw.io file as source material and preserve the current repository requirements as authoritative.
- Cover the critical member journey plus authentication, recoverable failures, trainer access, and administrator operations.
- Use neutral low-fidelity styling and fictional demo data; do not imply brand approval.
- Reuse local WebbyFrames buttons and badges where the duplicated kit exposes suitable components.
- Preserve server-authoritative capacity, deterministic FIFO waitlists, transactional cancellation/promotion, configured per-session cutoffs, RBAC, and context-preserving authentication.

## Artifacts and evidence

- Added the wireframe action to the existing `scripts/figma-plugin/` toolkit without changing its plugin ID.
- Split the plugin source into `brand-and-flows.js` and `wireframes.js`; `build.mjs` generates the installed `code.js` entrypoint.
- The generator creates a new versioned Figma page rather than modifying the source kit.
- Planned output: nine module pages with 15 desktop frames and 13 Android 390 px frames. Each page cascades desktop states vertically with the related Android state beside it.
- Prototype reactions were removed after Figma rejected a nested-button destination; module page generation no longer depends on prototypes.
- `node --check` and manifest JSON parsing passed locally.

## Unresolved

- The connected Figma API reached its Starter-plan call limit before the page could be generated.
- The existing local development plugin must be run from Figma Desktop to execute the new action.
- The generated page therefore still requires execution, visual QA, interaction QA, and user approval. Issue #6 remains incomplete.

## Next safe action

Run the already-installed **Practice Athletic Club Master Toolkit** in the duplicated kit, select **Build Low-Fi Wireframes**, inspect every module page and desktop/Android cascade, then update Issue #6 and the design gate only if the evidence passes review.
