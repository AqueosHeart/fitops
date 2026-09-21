---
type: session-record
project: FitOps
date: 2026-09-21
---

# Public My Account utility and Join Now hierarchy

## User goal

Make the public/member split easier to understand and accessible: a visitor can join as a new fictional member, while an existing member can find account access without making the marketing site feel like the booking application.

## Decision

- `My Account` is a secondary public-header utility linking to `/portal/login`.
- `Join Now` remains the primary public conversion CTA linking to `/join`.
- `/join` is the only route into new-member registration. A selected fictional plan, consent, and validation are required before `/register`; no payment or card data is collected.
- Portal Login handles existing members, demo personas, and protected-route redirects. It restores only validated internal `returnTo` state and can send a successfully authenticated account needing fictional enrollment to Join.
- Footer/system routes are grouped separately from header navigation. Public class details remain browsable; unauthenticated booking intent is preserved through Join.

## Evidence and changes

- Updated native `wiki/design/FitOps User Flows.drawio` Page 01 before all derivative artifacts.
- Added ADR 006 and aligned requirements, architecture, API, Mermaid sitemap, Obsidian review hub, and Figma generator source.
- Rebuilt `scripts/figma-plugin/code.js` and passed `node --check scripts/figma-plugin/code.js`, `node scripts/validate-ux-sync.mjs` (29 mapped routes/anchors), and `git diff --check`.
- Per visual review, converted Page 01 to a sparse route map: group headings and card copy carry route inventory and role destinations; only high-signal transitions retain connectors. The detailed Pages 02 through 07 carry execution behavior.

## Outstanding action

Run the regenerated Figma toolkit in a connected Figma file and visually inspect the desktop and Android header, Join, and My Account modules before declaring the Figma canvas synchronized.
