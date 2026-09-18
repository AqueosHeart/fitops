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
- Canonical UX architecture is maintained as six Mermaid sources in `docs/design/`: sitemap, booking, waitlist, cancellation, trainer, and administrator flows. The existing Figma toolkit at `scripts/figma-plugin/` now includes a non-destructive low-fidelity wireframe action, but its output and visual QA are still pending.
- SVG previews in `docs/design/` are derived from those Mermaid sources and must be regenerated whenever a source changes.
- The active Obsidian vault is `second-brain`; `wiki/design/FitOps User Flows.md` is its embedded Mermaid review hub.
- `wiki/design/FitOps User Flows.drawio` is the native editable draw.io companion, with seven pages, 281 editable shapes, 222 connectors, and embedded visual color keys. It models sitemap, booking, waitlist, cancellation, trainer, administrator, and dedicated authentication/onboarding/security flows with complete terms, privacy, waiver, and RBAC guardrails.
- Booking and cancellation diagrams use each session's configured cutoff; they do not hardcode a global two-hour rule or treat released availability as a capacity increase.
- The pending Figma generator targets nine module pages with 15 desktop and 13 Android 390 px states cascading vertically, uses fictional data, reuses local WebbyFrames buttons and badges when available, creates no prototype reactions, and must not be treated as brand approval.
- Continuity rule: tasks opened from this repository must follow `AGENTS.md`, read the second brain before work, and update material project context before completion.
