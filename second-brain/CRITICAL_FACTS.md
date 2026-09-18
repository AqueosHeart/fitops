---
type: critical-facts
project: FitOps
updated: 2026-09-18
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
- The six Mermaid sources in `docs/design/` remain version-controlled review exports: sitemap, booking, waitlist, cancellation, trainer, and administrator flows. SVG previews are derived from those Mermaid sources and must be regenerated whenever an export changes.
- The active Obsidian vault is `second-brain`; `wiki/design/FitOps User Flows.md` is its embedded Mermaid review hub.
- `wiki/design/FitOps User Flows.drawio` is the current source for the approved boundary between public discovery, `/join`, direct Member Portal Login (`/portal/login`), and protected workspaces. Public headers show `Join now`, never a global Sign In action. `/app` is the member dashboard, followed by `/app/schedule`, `/app/bookings`, and `/app/profile/security`; trainer and administrator workspaces remain separate.
- Booking and cancellation diagrams use each session's configured cutoff; they do not hardcode a global two-hour rule or treat released availability as a capacity increase.
- The pending Figma generator targets eleven module pages with 19 desktop and 17 Android 390 px states cascading vertically. Landing and Public Schedule are separate modules; it also models Join, the direct Member Portal, and the protected member dashboard/workspace. It uses fictional data and must not be treated as brand approval.
- The landing-page pair now covers public navigation, activities, services, facilities, fictional pricing, team, contact, final CTA, and a legal/navigation footer. Its information architecture was expanded from a user-supplied site reference without copying that site's assets, identity, or copy.
- Landing now exposes the required schedule path through a `Schedule` navigation entry and CTA. The first desktop and Android schedule states cascade under Landing on the same Figma page and receive its prototype navigation; Schedule detail and failure states remain on the dedicated Schedule page.
- `node scripts/validate-ux-sync.mjs` verifies 29 routes and anchors across draw.io, Mermaid, and the English-only Figma generator, including Join and the protected member workspace. It also rejects a Landing-header Sign In action. Static validation passed on 2026-09-18; executing and visually QAing the versioned Figma pages is still pending because no Figma instance was accessible in that session.
- The 2026-09-18 native draw.io correction pass makes role routing, fictional plan selection, re-authentication, retries, dismissal/back actions, error recovery, promotion visibility, and staff access recovery explicit. It does not add payments, refunds, admin session deletion, or real-time notifications to MVP scope.
- The wireframe generator selects the `01 Landing` module by name after creating all versioned pages, so its final Figma selection contains only nodes from the active page. This fixes the selection error introduced when `00 Public, Legal, and Miscellaneous` was added before Landing.
- Continuity rule: tasks opened from this repository must follow `AGENTS.md`, read the second brain before work, and update material project context before completion.
