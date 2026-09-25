---
type: session-record
project: FitOps
date: 2026-09-23
status: penpot-wireframes-consolidated
---

# Penpot wireframe consolidation and draw.io coverage audit

## User goal

Review the second Penpot wireframe version, remove obsolete copies, and ensure every draw.io page route and state remains mapped.

## Changes and evidence

- Found 20 original import pages and a partial newer `QA v2` set for groups 01–12. The newer groups had the same scenario-name inventory as their corresponding originals. Kept those newer groups and the sole existing copies of groups 13–20, then removed the 12 redundant older pages.
- Renamed the retained pages `01` through `20` with the `— Wireframes` suffix. Preserved Design Tokens, Icons — Lucide, and the five existing kit pages.
- Corrected 76 member, trainer, and administrator backgrounds that ended before the screen bounds. Moved the extended backgrounds behind the content. Exported and visually checked the member schedule and My bookings desktop boards after the fix.
- Ran `node scripts/validate-ux-sync.mjs`: 26 draw.io page routes, a separate 404 screen, and 163 scenarios per device align with the local definitions. Compared those definitions with the live Penpot inventory: 20 pages, 326 boards, no missing, extra, or duplicate screen names. All retained screen backgrounds reach their board bounds.

## Remaining

This verifies structural coverage and representative renders, not every screen's visual quality. The Penpot boards remain static vectors without prototype interactions. Native Figma execution and visual approval for Issue #6 remain pending.
