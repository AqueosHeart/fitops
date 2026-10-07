# ADR 013 Use Penpot for FitOps visual design review

## Status

Accepted. This supersedes ADR 002 and the Figma-specific visual-tool references in ADRs 003 through 006, without changing their flow, route, or ownership decisions.

## Context

ADR 002 selected Figma for interface design. FitOps now has a connected Penpot `FitOps Design System` file with its tokens, icon reference, and a canonical low-fidelity wireframe set: 20 numbered `— Wireframes` pages containing 163 desktop and 163 mobile boards. The project needs one accessible visual-review location, not a duplicate Figma gate.

## Decision

1. Penpot is the working tool for FitOps low-fidelity and future high-fidelity visual design. The canonical file is `FitOps Design System`.
2. draw.io remains the editable UX-flow source of truth. Mermaid exports and Penpot boards are derived artifacts and cannot add an unmapped route, state, or capability.
3. The visual review set is the 20 numbered Penpot `— Wireframes` pages, with 326 boards across the 26 page routes, separate 404 fallback, and 163 scenarios per device. `Design Tokens` and `Icons — Lucide` remain supporting design-system pages.
4. Issue #6's visual-design acceptance is assessed in Penpot. It requires the canonical page inventory, structural route/scenario validation, and a human visual review of the critical public, member booking/waitlist/cancellation, trainer, and administrator boards at desktop and mobile sizes.
5. `scripts/figma-plugin/` and its local generator remain historical source tooling. They may inform a Penpot refresh while retained, but they are not the active tool, delivery target, or approval gate. No Figma Desktop run is required for FitOps.

## Consequences

- Documentation and the delivery board use Penpot as the visual-design reference.
- The existing Penpot set is preserved as the sole canonical wireframe inventory; duplicate imports remain out of scope.
- A future Penpot import or redesign still follows draw.io first, then Mermaid/static validation, then Penpot refresh and visual review.
- This does not approve the exploratory brand candidate or implement application behavior.

## Verification gate

Run `node scripts/validate-ux-sync.mjs` after flow or scenario changes. Before claiming a Penpot visual change approved, inspect the affected desktop/mobile boards in Penpot and retain review evidence in the issue or repository log. The current Issue #6 is closed on GitHub; reopening it is appropriate only if the Penpot coverage or mapped flows materially change.
