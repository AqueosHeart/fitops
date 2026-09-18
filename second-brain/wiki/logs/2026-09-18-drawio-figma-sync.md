---
type: session-record
project: FitOps
date: 2026-09-18
status: figma-execution-pending
---

# draw.io to Figma synchronization

## Goal

Resolve the mismatch where Figma contained public destinations that the editable UX diagram did not, and make every sitemap route explicitly traceable to the Figma generator.

## Decisions

- Accepted ADR 003: `FitOps User Flows.drawio` is the editable source of truth for UX navigation, screen inventory, and flows.
- Mermaid is a version-controlled review export. Figma is a derived visual and prototype artifact.
- Services, Facilities, and Contact are public landing anchors (`/#services`, `/#facilities`, `/#contact`), not new protected product capabilities.
- Miscellaneous public routes include About Us (`/about`), Cookie Preferences (`/cookie-settings`), and Not Found (`/404`).

## Changes and evidence

- Added the public landing destinations, Miscellaneous group, and navigation connections to Page 01 of the native draw.io document.
- Updated `docs/design/sitemap.mmd`, the UX workflow documentation, decision index, and ADR 003.
- Added `scripts/validate-ux-sync.mjs`; it passed for 26 route and anchor mappings across draw.io, Mermaid, and the English-only Figma generator.
- Added Figma `00 Public, Legal, and Miscellaneous` desktop and Android coverage frames for public routes, Pricing, About Us, Terms, Privacy, Liability Waiver, Cookie Preferences, and Not Found.
- Disabled stale draw.io and Figma sitemap generation paths that could replace the source architecture with incomplete diagrams.
- Fixed the post-generation Figma selection error: after page `00` was added, selecting the Landing frame while `00` was active was invalid. The generator now finds and activates `01 Landing` by name before selecting that frame.

## Unresolved and next safe action

- Figma Desktop was not accessible in this session. Open the duplicated WebbyFrames kit, run **Plugins > Development > Practice Athletic Club Master Toolkit > Build Low-Fi Wireframes**, then inspect the new versioned module pages before marking Issue #6 complete.
