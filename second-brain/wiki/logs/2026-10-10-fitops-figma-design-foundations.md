---
type: session-record
project: FitOps
date: 2026-10-10
---

# Figma visual-tool decision and FitOps foundations

## Goal
Switch the active visual-design workspace from Penpot to Figma, create FitOps foundations/components, and determine whether existing wireframes can be recovered.

## Decisions and evidence
- ADR 018 supersedes ADR 013's visual-tool decision; ADR 017 remains the separate Prisma Studio decision.
- The existing FitOpsWireframing file contains AARC references. Dedicated FitOps pages were created without overwriting those pages.
- The linked Practice branding file informed exploratory tokens; brand approval and application CSS synchronization remain out of scope.
- The old Penpot wireframes are not directly transferable with the connected tools. Their scenario definitions remain recoverable from draw.io Page 08 and repository generator/content sources.

## Changes
- Added Figma foundations: primitive/semantic colors, light/dark modes, spacing, radii, text styles, and subtle elevation.
- Added components: 12 button variants, 4 form-field states, 5 status badges, and 2 session-card variants.
- Recorded the decision and migration status across ADR, UX/workflow docs, second brain, and delivery board mirror.

## Outstanding
Recreate the 163 desktop and 163 mobile scenarios in Figma from repository sources, validate synchronization, and visually review representative flows. Sprint 7 remains complete; this is not a verified Sprint 8 assignment. No app implementation, GitHub issue change, build, test, or deployment occurred.

## Figma pages
- [Foundations](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7110-73)
- [Components](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7111-244)
