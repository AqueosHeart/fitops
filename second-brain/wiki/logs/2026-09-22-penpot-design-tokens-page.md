---
type: session-record
project: FitOps
date: 2026-09-22
status: page-created-and-visually-reviewed
---

# Penpot Design Tokens page and layout proposals

## User goal

Create a dedicated Penpot page modeled on the supplied design-token reference, adapted to Practice Athletic Club's documented exploratory values and the current FitOps viewport evidence.

## Changes and evidence

- Created the `Design Tokens` page with a 1440 × 2180 board containing candidate color roles, the documented Mona Sans size/weight hierarchy, an explicitly proposed spacing scale, proposed desktop/tablet/mobile grid examples, and usage/accessibility guardrails.
- Added spacing values 4, 8, 12, 16, 24, 32, 48, and 64 px to a separate `FitOps Layout Proposal` set, marked proposed and inactive.
- Grid examples use 1440 px desktop (12 columns, 1200 px max content, 24 px gutters), 768 px tablet review frame (8 columns, 32 px margins, 16 px gutters), and 390 px mobile (4 columns, 16 px margins/gutters). Tablet size and grid values are recommendations for review, not existing requirements; breakpoints remain unspecified.
- Exported and visually inspected the Penpot board. Corrected the desktop margin label after review.
- Current catalog read reports `Practice Exploratory` active, `FitOps Layout Proposal` inactive, `Global` inactive, and the `FitOps` theme inactive with no sets. These states do not approve the brand.

## Remaining

Review proposed spacing and grid values against actual booking and staff flows. Resolve the source differences for line-height/tracking before adding those as tokens. Keep the brand unapproved until its existing approval gate is complete.
