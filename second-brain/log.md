---
type: activity-log
project: FitOps
updated: 2026-09-21
---

# FitOps Activity Log

## 2026-09-21

- Simplified Page 01 after visual review showed connector crossings and unreadable labels. Removed decorative route-inventory and long cross-workspace arrows, added clear group headings and route-copy explanations, and retained only high-signal transitions. Updated the Mermaid sitemap and Obsidian review hub to the same sparse-map convention.
- Accepted ADR 006 after reviewing the source sitemap, public/member boundary, and existing-member entry path. The public header now has secondary `My Account` access to `/portal/login` and primary `Join Now` conversion to `/join`; it is not a generic global Sign In pattern.
- Updated native draw.io Page 01 first, then the Mermaid sitemap/review hub and English-only Figma generator. Registration now follows fictional-plan selection only; direct portal access, guarded redirects, validated `returnTo`, public session intent, footer/system routes, and the separate protected workspaces are explicit.
- Rebuilt `scripts/figma-plugin/code.js`; `node --check scripts/figma-plugin/code.js`, `node scripts/validate-ux-sync.mjs` (29 mapped routes/anchors), and `git diff --check` passed. No Figma file was connected, so generator execution and visual QA remain pending.
- Audited and corrected Page 1 (`01 Sitemap`) of `wiki/design/FitOps User Flows.drawio`.
- Resolved a 70 px horizontal collision between the `Join now /join` card and the Legend card (`leg1_box`), which previously obscured the `Auth & Security` and `Overlay / Modal` color swatches.
- Re-aligned the authentication row to an intuitive left-to-right flow (`publicNav` -> `join` -> `authHub` / `login` / `register`), eliminating backward crisscrossing orthogonal connectors.
- Restored visual taxonomy compliance across all nodes: updated `root` brand card from Administrator Operations (`#111310; stroke=#C7F134`) to Public Cream (`#F2F0E8; stroke=#111310`); updated `confirmed` and `waiting` from Public Cream to Member Sand (`#E2E0D8`); changed `e-conf-cancel` to a dashed violet modal connector (`strokeColor=#8B5CF6; dashed=1`); and eliminated the dashed-modal `miscellaneous` container in favor of direct public navigation routing.
- Enforced ADR 004 security boundaries: removed unauthorized direct edges from `root` to protected member, trainer, and administrator workspaces, ensuring protected shells are accessible strictly through server-validated role redirects (`/portal/login`) and new demo registration (`/register`).
- Removed out-of-place runtime booking modals (`waiverModal`, `expiryModal`, duplicate `auth` decision) from the sitemap to resolve dead ends and upward wire tangling, linking public session details directly to `/join` with an internal `returnTo` preserve intent.
- Validated all 29 mapped routes and anchors with `node scripts/validate-ux-sync.mjs`, achieving 100% pass across draw.io, Mermaid, and the Figma generator with 0 collisions and 0 broken references.

## 2026-09-17

- Reviewed only the repository Mermaid sitemap and user flows against the product requirements, API, architecture, and data model.
- Replaced the incomplete diagrams with canonical sitemap, booking, waitlist, cancellation, trainer, and administrator Mermaid sources.
- Removed the hardcoded two-hour cutoff, incorrect capacity-increment behavior, out-of-scope QR/check-in behavior, and unsupported real-time claims.
- Added server-authoritative membership, role, duplicate, overlap, cutoff, concurrency, authorization, validation, rollback, loading, empty, error, and success paths.
- Replaced the stale SVG exports with fresh previews rendered from all six Mermaid sources and removed the old hardcoded SVG generator that could recreate contradictory diagrams.
- Validated all six Mermaid sources through a Mermaid-compatible renderer; every diagram returned a successful render response.
- Added `wiki/design/FitOps User Flows.md` as an Obsidian-native Mermaid review hub after confirming that the active vault is `second-brain`, not the repository root.
- Generated `wiki/design/FitOps User Flows.drawio`: six native draw.io pages with editable nodes and orthogonal connectors for the sitemap and five role-specific flows.
- Corrected the draw.io sitemap after visual inspection: public pages are parallel destinations reached through a shared public-navigation hub; Home does not lead sequentially to Programs, Schedule, Trainers, or Pricing.
- Researched fitness studio and SaaS compliance standards (Terms of Service, Physical Activity Readiness Questionnaire / Liability Waiver, Privacy Policy, and Demo disclosures) and web application security architectures (RBAC, CSRF token validation, IP/account rate-limiting, and session expiry intent recovery).
- Expanded `wiki/design/FitOps User Flows.drawio` from 6 pages (113 vertices, 108 edges) to 7 pages (223 vertices, 222 edges), adding Page 7 (`07 Authentication, Security, and Onboarding`) and upgrading Pages 1 through 6 with legal gates, security check blocks, and session restoration paths.
- Synchronized `wiki/design/FitOps User Flows.md` with updated Mermaid diagrams and architectural requirements for terms, liability waiver, privacy, demo session handling, and security controls.
- Embedded visual architecture color keys directly onto Pages 1, 2, and 7 of `wiki/design/FitOps User Flows.drawio` (increasing vertex count to 281 across 7 pages) and codified the full color taxonomy table in `wiki/design/FitOps User Flows.md`.

## 2026-09-15

- Replaced `FitOps` as the fictional gym's customer-facing name with **Practice Athletic Club**; retained `FitOps` as the repository and internal project codename.
- Limited the current branding work to brand identity and its artifacts, with no application or website implementation.
- Documented the initial positioning, audience, promise, personality, voice, naming rules, visual principles, required outputs, and next visual-territory review gate.
- Kept `Progress is a practice.` as a working tagline pending explicit approval.
- Created Quiet Strength, Kinetic Editorial, and Modern Club visual territories with original concept moodboards, provisional palettes, typography directions, logo approaches, photography rules, and explicit risks.
- Recommended Quiet Strength for review without marking it approved.
- Recorded the user's approval of Quiet Strength as the Practice Athletic Club visual territory.
- Created three deterministic monochrome vector logo concepts and compared their favicon legibility at 128, 32, and 16 pixels.
- Recommended Interval P for refinement without marking the logo concept approved.
- Recorded the user's rejection of the icon-led logo round as generic and insufficiently premium.
- Replaced it with three typography-first directions: Foundation, Standard, and Editorial Club; recommended Editorial Club without marking it approved.
- Reviewed two user-supplied visual references and identified the stacked name, not an emblem, as the intended identity.
- Superseded the exploratory logo rounds with a reference-led stacked wordmark system containing primary, inverse, horizontal, and compact vector variants; approval remains pending.
- Selected the strategy of custom logo lettering with Instrument Sans as the supporting brand and booking-interface family.
- Created a recognition comparison and updated the vector candidate with a custom flat-apex `A`, alternate straight-leg `R`, and optically equalized stacked lines; logo approval remains pending.
- Created an unapproved Mona Sans font-character exploration with point, progress-bar, and register-bar lime signatures; the progress bar is recommended for review.
- Recorded the user's selection of the Mona Sans stacked wordmark with the short lime progress bar.
- Finalized primary stacked, inverse, horizontal, compact, and small-size vector evidence; the full accessible palette and typography hierarchy remain pending.
- Approved the Practice Athletic Club accessible palette, Mona Sans hierarchy, and documented contrast combinations. Created original logo context-test evidence for signage, apparel, social avatar, and booking interface; implementation remains blocked by the Sprint 0 review and Sprint 1 wireframe gate.
- Corrected the prior status: the brand is not defined or approved. Reclassified the name, Quiet Strength, wordmark, palette/type material, and context tests as working inputs and evaluation evidence. Added an extended brand-definition guide; the next action is strategy definition before visual approval.
- Defined the core brand strategy (Audience, Tension, Positioning, Promise, Exclusions, Offer taxonomy, Voice scripts) and codified it in `docs/brand/brand-identity.md`.
- Generated 8 production-grade vector presentation slide SVGs in `docs/brand/figma/` mapped directly to the user's Figma Branding Guidelines Presentation template (`tOe3cyDw9VLbHhgYOC3Nnn`), plus a master 8-slide artboard.
- Built, tested, and compiled the in-place Figma transformation plugin (`scripts/figma-plugin/`) that executes directly inside Figma to transform the template with 100% clean editable layers, Auto-Layout, and native text boxes.
- Downloaded and registered all 48 styles of the official Mona Sans font family to the Windows system registry.
- Transformed all template slides: Cover, Brand Strategy, Dual Logo Showcase cards (Ink on Bone & Bone on Ink), Smallest Logo Size footer (Compact Mark), Typography Hierarchy (Mona Sans), Color Palette (Ink, Bone, Signal Lime, Surface Muted), and the 6 Key Elements vector graphics cards. Brand design is complete.
- Developed dynamic Sitemap & User Flow generator in `scripts/figma-plugin/` that scans the template `Components` page, instantiates native components, and constructs full 4-tier IA tree and 3 critical branching user flows with orthogonal connectors for Sprint 1 (Issue #6).
- Resolved core UX gaps (program taxonomy education, context-preserving demo auth, gym membership verification, and transactional FIFO auto-promotion) in Mermaid diagrams (`docs/ux-plan.md`) and compiled standalone vector exports in `docs/design/`.

## 2026-09-18

- Accepted ADR 005 to correct an information-architecture flaw found in the generated wireframes: Public Schedule is no longer nested beneath Landing; direct existing-member access uses `/portal/login`; and `/app` is an explicit member dashboard before schedule and bookings.
- Updated the editable draw.io sitemap first, then the Mermaid sitemap/review hub and Figma generator. The generator now creates eleven modules with 19 desktop and 17 Android states, including separate Landing, Public Schedule, Member Portal, and Member Workspace modules.
- Audited a supplied flow-review report against the live draw.io source. Removed the duplicate `e-nav-contact` XML edge ID and verified that all seven diagram pages now have unique cell IDs and parse successfully. The audit also confirmed several unresolved recovery-path and source-versus-Mermaid routing gaps; these remain explicitly unimplemented pending a scoped UX correction pass.
- Completed the scoped UX correction pass in native draw.io first. Added role-routing, fictional-plan selection, re-authentication, retry, dismissal, return, promotion-visibility, and access-recovery connections; retained the explicit MVP exclusions for payments, refunds, admin session deletion, and real-time notifications. Updated the derived Mermaid flow, Figma generator coverage, review hub, and planning notes afterward.

- Accepted ADR 004 after reviewing the product requirements, UX plan, architecture, API, data model, DBML, delivery plan, and source-of-truth UX artifacts. Public discovery, fictional membership Join, and protected workspaces are now distinct.
- Updated native draw.io first, then the Mermaid sitemap/review hub and Figma generator. The public header now has `Join now`, not Sign In. `/join` presents fictional plan selection for new demo members and an `Already a member? Sign in` option; no payment or card data is collected.
- Moved member navigation to the protected `/app` shell (`/app/schedule`, `/app/bookings`, and `/app/profile/security`) and documented internal `returnTo` validation after Join or sign-in.
- Added the fictional `selectedPlanCode` to the conceptual member profile only. Real payments, subscriptions, invoices, and billing remain explicitly out of scope.
- Rebuilt the Figma plugin bundle and passed static route synchronization for 29 mapped routes and anchors. Figma execution and visual QA remain pending.
- Attempted to refresh the two affected Mermaid SVG previews, but the local Mermaid CLI could not launch its Puppeteer browser process. The `.mmd` sources are current; regenerate the SVG previews in a working renderer before approval.

- Fixed the Figma runtime selection failure after adding module `00`: the generator now resolves and activates the `01 Landing` page by name before selecting its landing frame. Rebuilt `scripts/figma-plugin/code.js` afterward.
- Expanded the draw.io sitemap with a Miscellaneous group containing About Us, Cookie Preferences, and Not Found (`/404`). Extended the derived Mermaid sitemap and the Figma generator with an explicit Public, Legal, and Miscellaneous module.
- Replaced all generated Figma wireframe copy with English. The source-of-truth reminder now disables the stale Figma sitemap generator, preventing it from independently changing the architecture.
- Expanded and passed `node scripts/validate-ux-sync.mjs`: 26 draw.io routes and anchors now have matching Mermaid and Figma-generator coverage, including Pricing, About Us, legal, cookies, 404, authentication, member, trainer, and administrator destinations.
- Accepted ADR 003: `wiki/design/FitOps User Flows.drawio` is the editable UX source of truth. Mermaid and Figma are derived after draw.io updates, never competing sources.
- Added public landing destinations Services (`/#services`), Facilities (`/#facilities`), and Contact (`/#contact`) plus their navigation connections to the native draw.io sitemap. Updated its Mermaid review export and confirmed that the existing Figma generator already contains matching landing sections.
- Added and passed `node scripts/validate-ux-sync.mjs`. The stale draw.io regeneration script now stops rather than overwriting the source diagram. Figma execution and visual QA remain pending because no Figma instance was accessible.
- Mapped all seven pages of `FitOps User Flows.drawio` into a non-destructive third action in the existing Figma toolkit at `scripts/figma-plugin/`.
- Prepared nine module pages with 15 desktop and 13 Android 390 px low-fidelity states covering landing, schedule discovery, booking, waitlist, cancellation, authentication, failures, trainer access, and administrator operations.
- Reused WebbyFrames button and badge components when available while keeping the output visually neutral and explicitly separate from brand approval.
- Kept the existing plugin ID, added a generated modular entrypoint, and validated the source JavaScript, bundled JavaScript, UI, and manifest locally. After a rejected nested-button prototype reaction, removed the invalid nested reactions and switched to per-module pages with desktop/Android cascades. Figma execution and visual QA remain pending.
- Corrected the follow-up runtime failure from attempting to remove a temporary Figma page. The generator now re-parents temporary frames from the current page into module pages without creating or removing any staging page.
- Expanded the landing desktop and Android wireframes from a short hero into a full public site scroll: navigation, activities, services, facilities, fictional tariffs, team, contact, final CTA, and legal/navigation footer. A user-supplied MeuFIT reference informed coverage only; all FitOps copy, data, and placeholders remain original and fictional.
- Restored Landing-to-Schedule access: added `Horario` to public navigation, included a visible schedule CTA, placed the first desktop/Android schedule states under the landing pair on the same Figma page, and linked the top-level landing frames to those valid prototype destinations.

## 2026-09-14

- Defined FitOps as a portfolio-grade gym booking and operations product rather than a static landing page.
- Documented product requirements, user roles, scope, business rules, success criteria, and exclusions.
- Chose a modular-monolith architecture with domain rules isolated from UI, HTTP, and persistence concerns.
- Designed the initial conceptual data model and REST API contract.
- Organized delivery into eight SDLC phases and Sprint 0 through Sprint 8.
- Selected GitHub Projects for sprint execution, Figma for UX work, Mermaid for repository diagrams, DBML for conceptual data modeling, Prisma migrations for physical database history, and OpenAPI for the REST contract.
- Created this Obsidian-compatible project memory with no third-party binaries or secrets.
- Created the public `AqueosHeart/fitops` GitHub repository and pushed the planning and project-memory files.
- Added repository-level continuity instructions that require new FitOps tasks to read the second-brain context and material tasks to update it before completion.
- Saved a durable foundation-session summary and a concise chronological conversation record.


## 2026-09-21 - Sitemap and architecture separation

- The native file now has eight pages: `00 Sitemap` contains 26 page URLs only; `01 Route & Access Architecture` preserves route/access context, explicitly typed UI/system states, and enrollment steps; Pages 02 through 07 retain the detailed flows. Landing anchors and the `/404` fallback belong to the architecture view, not the page-only sitemap. No routes or product capabilities were added.
- Refreshed Mermaid/SVG exports, review hub, static route checks, and continuity notes. Flow approval, native visual review, and Figma QA remain pending.
- Session: [[wiki/logs/2026-09-21-sitemap-architecture-separation]].


## 2026-09-21 - Complete wireframe plugin

- The plugin now defines 26 page routes plus a separate 404 fallback, each with full desktop (1440 px) and mobile (390 px) sections. It generates 163 scenarios per device on one new versioned Figma page with 27 route sections and same-page prototype links. Local build, structural tests, and representative approximate layout previews pass; native Figma execution and visual QA remain pending.
- Updated draw.io coverage first, then the plugin, bundle, coverage specification, tests, UI, and current project context. No app implementation or publication.
- Session: [[wiki/logs/2026-09-21-complete-wireframe-plugin]].


## 2026-09-21 - Wireframe page split and reaction fix

- User-reported Figma failure reproduced in stricter tests. Generator now produces 27 route pages with top-level frames, no self/cross-page NAVIGATE, and a page chooser. Added a migration action for existing combined output. Native rerun remains pending.
- [[wiki/logs/2026-09-21-wireframe-page-split-fix]].
