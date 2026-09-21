---
type: log
project: FitOps
date: 2026-09-21
status: completed
---

# draw.io 01 Sitemap Remediation Session

## Context & Objectives

The user requested an analysis and subsequent remediation of **Page 1: `01 Sitemap`** within the editable UX source of truth `second-brain/wiki/design/FitOps User Flows.drawio`. The goal was to identify and fix visual layout flaws, design system taxonomy violations, information architecture conflicts, and flow modeling inconsistencies.

## Flaws Identified & Remediated

1. **Legend Card Collision Resolved:**
   - **Flaw:** `Join now /join` ($x=1660..1920, y=220$) overlapped the Legend Card (`leg1_box`, $x=1850..2350$) by 70 px, obscuring swatch `leg1_sw3` (*Auth & Security*) and clipping `leg1_sw4` (*Overlay/Modal*).
   - **Fix:** Relocated `join` to $x=1140, y=220$ and `authHub` to $x=1460, y=220$, maintaining an orderly right boundary at $x=1720$ and establishing a clean 130 px gutter before the legend card.

2. **Horizontal Sequence Inversion Corrected:**
   - **Flaw:** `authHub` was situated between `publicNav` and `join`, forcing connectors to leap 860 px over `authHub` and reverse direction backwards.
   - **Fix:** Restored left-to-right flow: `publicNav` ($x=440$) $\to$ `join` ($x=1140$) $\to$ `authHub` ($x=1460$), with downstream vertical cascades to `register` ($x=1140, y=370$), `login` ($x=1460, y=370$), and `recovery` ($x=1460, y=500$).

3. **Taxonomy & Design System Compliance Restored:**
   - **`root` (`Practice Athletic Club`):** Updated from Administrator Operations (`#111310; stroke=#C7F134`) to Public Cream (`#F2F0E8; stroke=#111310`), matching Legend Item 1 and `sitemap.mmd`.
   - **`confirmed` and `waiting`:** Updated from Public Cream (`#F2F0E8`) to Member Sand (`#E2E0D8`), properly classifying them as protected member space data entities per Legend Item 2.
   - **`e-conf-cancel`:** Updated from solid grey to a dashed violet modal connector (`strokeColor=#8B5CF6; dashed=1`) targeting `cancelDialog`.
   - **`miscellaneous`:** Removed the misleading dashed-violet modal note in favor of direct public navigation connections to `/about`, `/cookie-settings`, and `/404`.

4. **Security & Boundary Invariants Enforced (ADR 004):**
   - **Flaw:** `root` had direct solid edges (`e-root-bookings`, `e-root-trainer`, `e-root-admin`) to protected workspaces, bypassing authentication.
   - **Fix:** Removed all direct root-to-protected workspace edges. Entry into `/app`, `/trainer/sessions`, and `/admin` is strictly governed by server-validated role redirects from `/portal/login` and new demo registration from `/register`.

5. **Eliminated Runtime Modal Bloat & Dead Ends:**
   - Removed interaction-level modals (`waiverModal`, `expiryModal`, duplicate `auth` decision) that belonged to Page 2 and Page 7 flows.
   - Linked public session details directly to `/join` with an unauthenticated booking intent preserving `returnTo` (`e-details-join`), aligning 1:1 with `sitemap.mmd`.

## Verification & Artifacts

- **Automated UX Route Synchronization:** `node scripts/validate-ux-sync.mjs` passed with all 29 routes and anchors verified across draw.io, Mermaid, and the Figma generator.
- **Automated Geometry & Integrity Audit:** 0 bounding box collisions, 0 overlapping nodes, 0 invalid edge references, and all 7 diagrams intact in `FitOps User Flows.drawio` (291 vertices, 264 edges).
- **Review Hub Alignment:** Updated `second-brain/wiki/design/FitOps User Flows.md` with current vertex counts, aligned member workspace labels, and documented the 2026-09-21 correction pass.
