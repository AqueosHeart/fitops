---
type: session-record
project: FitOps
date: 2026-09-25
---

# Penpot replaces Figma as the visual-design tool

## Decision

The user selected Penpot for FitOps visual design. ADR 013 supersedes ADR 002 only for that tool choice. draw.io stays the editable UX-flow source; Mermaid and Penpot are derived views.

## Evidence

- The connected `FitOps Design System` contains 20 canonical `— Wireframes` pages, 163 scenarios per device, and 326 static desktop/mobile boards for 26 routes plus the 404 fallback.
- `node scripts/validate-ux-sync.mjs` remains the structural route/scenario check. Penpot review is the visual approval surface.
- GitHub Issue #6 is currently closed. Its active evidence is the Penpot set, not a native Figma execution.

## Scope and follow-up

- The local Figma plugin remains as historical source/import tooling and is not deleted or required.
- Future visual updates begin in draw.io, refresh derived Mermaid and Penpot artifacts, then receive Penpot visual review.
