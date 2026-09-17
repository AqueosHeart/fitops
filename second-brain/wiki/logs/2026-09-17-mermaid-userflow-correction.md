---
type: session-log
project: FitOps
date: 2026-09-17
status: complete
---

# Mermaid user-flow correction

## Goal

Review and correct the repository Mermaid artifacts only. Figma artifacts and generators were explicitly excluded from the requested scope.

## Changes

- Rebuilt `docs/design/sitemap.mmd` around the visitor, member, trainer, and administrator requirements.
- Rebuilt the booking and cancellation flows and added dedicated waitlist and trainer flows.
- Expanded administrator behavior to include session creation, editing, validation, authorization, empty states, failures, and fictional participant views.
- Replaced the hardcoded two-hour cutoff with the per-session configured cutoff.
- Corrected cancellation semantics so maximum capacity remains unchanged when availability is released.
- Made first-eligible FIFO promotion, skip behavior, rollback, and promoted-member state explicit.
- Removed QR/check-in and unsupported real-time behavior from the Mermaid architecture.
- Made the `.mmd` files the canonical artifacts in `docs/ux-plan.md`, replaced stale SVG derivatives with fresh previews, and removed their hardcoded generator.
- Added an Obsidian-native embedded Mermaid review hub at `second-brain/wiki/design/FitOps User Flows.md` because the user's active vault is `second-brain`.
- Added `second-brain/wiki/design/FitOps User Flows.drawio`, a native six-page draw.io companion with editable shapes and connectors.
- Corrected the draw.io sitemap after user review: the public navigation hub points independently to Home, Programs, Schedule, Trainers, and Pricing; no sequential public-page path is represented.

## Evidence

- All six `.mmd` sources returned HTTP 200 from a Mermaid-compatible render validation.
- `git diff --check` passed before the continuity update.
- The corrected draw.io XML parsed successfully with six diagrams, 113 editable vertices, and 108 editable connectors.

## Unresolved review point

The promotion-eligibility definition in `docs/ux-plan.md` is the current design assumption and should be explicitly approved or revised during requirements review before implementation.

## Next safe action

Review and approve the corrected Mermaid flows, then produce the low-fidelity desktop and mobile wireframes required by Issue #6.
