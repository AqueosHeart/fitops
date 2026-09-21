---
type: critical-facts
project: FitOps
updated: 2026-09-21
---

# FitOps Critical Facts

- Status: planning only; no application functionality has been implemented.
- Working public name: `Practice Athletic Club`; `FitOps` remains the repository and internal project codename.
- Branding scope is identity only for the current stage; no website or application implementation is authorized by the branding work.
- Brand status: not defined or approved. Quiet Strength, the Mona Sans lime-bar wordmark, and the palette/type system are exploratory candidates that may be retained, revised, or replaced after the brand-definition process.
- Original signage, apparel, social-avatar, and booking-interface tests exist as evaluation evidence only. They do not approve the logo, palette, or brand system.
- Public repository: `https://github.com/AqueosHeart/fitops`.
- Current lifecycle position: SDLC phases 1 and 2, Sprint 0.
- Delivery model: eight SDLC phases with one-week, Scrum-inspired sprints.
- Architecture: modular monolith.
- Proposed application stack: Next.js, React, TypeScript, PostgreSQL, Prisma, Auth.js, and Zod.
- Test stack: Vitest, React Testing Library, and Playwright.
- Sprint source of truth after repository setup: GitHub Projects, Issues, and pull requests.
- Conceptual database source: `docs/database/fitops.dbml`.
- Executable database source after implementation: Prisma schema plus complete committed migrations.
- Data policy: fictional demo data only; no production or personal records.
- `second-brain/wiki/design/FitOps User Flows.drawio` is the editable UX source of truth. Update it before every UX add, removal, or modification; Mermaid exports and Figma wireframes are derived views and may not introduce unmodeled screens or routes.
- Seven Mermaid sources in `docs/design/` are review exports: sitemap, route/access architecture, booking, waitlist, cancellation, trainer, and administrator. SVG previews must be regenerated when exports change.
- The active Obsidian vault is `second-brain`; `wiki/design/FitOps User Flows.md` is its embedded Mermaid review hub.
- `wiki/design/FitOps User Flows.drawio` is the current source for the approved boundary between public discovery, `/join`, direct Member Portal Login (`/portal/login`), and protected workspaces. Per ADR 006, public headers show secondary `My Account` access for existing members and primary `Join Now` conversion, never a generic global Sign In action. `/app` is the member dashboard, followed by `/app/schedule`, `/app/bookings`, and `/app/profile/security`; trainer and administrator workspaces remain separate.
- Booking and cancellation diagrams use each session's configured cutoff; they do not hardcode a global two-hour rule or treat released availability as a capacity increase.
- The plugin now defines 26 page routes plus a separate 404 fallback, each with full desktop (1440 px) and mobile (390 px) sections. It generates 163 scenarios per device across 27 separate versioned Figma route pages. Desktop/mobile scenario frames are direct children of their page. Only different-frame, same-page transitions receive NAVIGATE reactions; cross-page destinations are labeled and reached through the plugin page chooser. The earlier combined-page run failed native reaction validation; the stricter local regression tests now pass, but native rerun and visual QA remain pending.
- The landing-page pair now covers public navigation, activities, services, facilities, fictional pricing, team, contact, final CTA, and a legal/navigation footer. Its information architecture was expanded from a user-supplied site reference without copying that site's assets, identity, or copy.
- Landing, public Schedule, and every remaining route now have separate Figma pages with paired desktop/mobile states.
- `node scripts/validate-ux-sync.mjs` checks 26 sitemap routes, a separate 404 screen, landing anchors, and 163 scenario definitions per device against draw.io Page 08. `node scripts/test-wireframe-generator.mjs` executes the renderer through a Plugin API double and checks links, layout bounds, guards, kit reuse, and reruns. These checks do not replace native Figma QA.
- The 2026-09-18 native draw.io correction pass makes role routing, fictional plan selection, re-authentication, retries, dismissal/back actions, error recovery, promotion visibility, and staff access recovery explicit. It does not add payments, refunds, admin session deletion, or real-time notifications to MVP scope.
- The 2026-09-21 native draw.io sitemap remediation resolves the 70 px collision over the legend card on the 01 Sitemap, aligns colors with taxonomy keys (Root brand styled in Public Cream, bookings/waitlist in Member Sand, cancel dialog using dashed violet modal connectors), and eliminates unauthenticated direct root-to-protected workspace edges per ADR 004.
- The native file now has nine pages: `00 Sitemap` contains 26 page URLs only; `01 Route & Access Architecture` preserves route/access context, explicitly typed UI/system states, and enrollment steps; Pages 02 through 07 retain the detailed flows; Page 08 records all wireframe sections and scenarios. Landing anchors and the `/404` fallback belong to the architecture view, not the page-only sitemap. No routes or product capabilities were added.
- The generator selects only the new desktop Home frame and reveals its desktop/mobile pair on the newly created Figma page. Previous pages are preserved; failed output is marked Incomplete.
- Continuity rule: tasks opened from this repository must follow `AGENTS.md`, read the second brain before work, and update material project context before completion.
