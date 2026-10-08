---
type: activity-log
project: FitOps
updated: 2026-09-21
---

# FitOps Activity Log

## 2026-10-08 — FitOps LAN deployment continuation

- User authorized deployment of the fictional FitOps demo to the separate Linux host, isolated from AARC.
- Added Node 24 Docker build, LAN-only Compose config (private PostgreSQL volume; app bound to `192.168.1.208:3001`), example environment template, and deployment/rollback guide.
- Passed Compose config validation, ESLint, TypeScript, Prisma validation, and Next production build locally. Deployed commit `8951e16`; six migrations, one-time fictional seed, and `db:verify` passed. LAN login returned HTTP 200, anonymous admin redirected, and server-side authenticated admin returned HTTP 200.
- AARC service/database/port were not modified. The HTTP service remains LAN-only; `npm audit --omit=dev` reports a high-severity finding in Next.js 16.3.6. See ADR 016 and the session note. No secrets were recorded.
- Details: [[wiki/logs/2026-10-08-fitops-lan-deployment]].

## 2026-10-08 — Admin browser acceptance and mobile overflow fix

- Signed-in browser verified the admin overview, list filter and empty state, fictional roster/FIFO waitlist, create/edit forms, and valid admin My Account return path.
- Fixed the hidden Actions table-header text that extended document width at phone size. Commit `58f2760` was pushed and deployed by rebuilding/recreating only the FitOps app container; PostgreSQL remained healthy and no DB rows changed.
- Post-deploy mobile measurement confirms document width equals viewport width; horizontal scroll is isolated to the table wrapper. Lint, TypeScript, and production build passed. API-contract integration test failed because local PostgreSQL on port 5432 is unavailable; it was not redirected to the live DB.
- Remaining Issue #12 gates: mutation-based create/capacity-promotion acceptance, member/trainer denial in browser, and subsequent review/transition. PR #17 remains Draft.
- Details: [[wiki/logs/2026-10-08-fitops-lan-deployment]].

## 2026-10-08 — Prisma Studio over SSH tunnel

- Added an on-demand Compose Studio profile plus a small same-network-namespace proxy because Prisma CLI binds Studio to container loopback.
- Deployed it with server host binding `127.0.0.1:5555`, and opened a Windows SSH local tunnel. Studio HTML and JS asset both return HTTP 200 through `http://127.0.0.1:5555`; AARC ports and services are unchanged.
- Studio directly edits the fictional FitOps DB and bypasses application rules. Stop the profile and close the tunnel after use. ADR 017 records the decision.
- Details: [[wiki/logs/2026-10-08-fitops-lan-deployment]].

## 2026-10-07 - Issue #10 published for review

- Committed the verified Issue #10 implementation and continuity updates as `761f91f` on `codex/fitops-planning-checkpoint` and pushed the authorized branch.
- Opened [PR #15](https://github.com/AqueosHeart/fitops/pull/15) against `main` with `Closes #10`; GitHub reports CLEAN. `gh pr checks` reports no checks because the repository has no configured Actions workflow. Issue #10 is still Open pending maintainer review/merge.
- Session: [[wiki/logs/2026-10-07-issue-10-eslint-advisory-resolution]].

## 2026-10-07 - Issue #10 zero-vulnerability lint-toolchain resolution

- After owner authorization, removed `eslint-config-next` and its vulnerable Next plugin/fast-glob/micromatch/braces chain. Added pinned direct ESLint core, TypeScript, React, React Hooks, JSX accessibility, and import tooling; retained the existing `npm run lint` gate.
- Added ADR 015. Explicit tradeoff: Next-specific `@next/next/*` lint rules are unavailable until a compatible audited plugin release can be restored. Kept `no-control-regex` enabled globally and suppressed it only at the security return-path validator's intentional ASCII-control filter.
- Verified full dependency audit 0 findings, no installed `braces` or `eslint-config-next`, lint passes, 24 integration tests pass, TypeScript passes, Prisma validate/generate pass, production build generates 14 static pages, and `git diff --check` passes. Next: publish authorized branch and open PR; CI/review pending.
- Session: [[wiki/logs/2026-10-07-issue-10-eslint-advisory-resolution]].

## 2026-10-07 - Issue #10 `braces` audit follow-up

- Verified `npm ls` and `npm explain` dependency path: `eslint-config-next@16.3.6 -> @next/eslint-plugin-next@16.3.6 -> fast-glob@3.3.1 -> micromatch@4.0.8 -> braces@3.0.3`; npm marks it dev-only. `npm audit --omit=dev --audit-level=high` reports 0 vulnerabilities.
- Confirmed there is no patched published `braces` release. The proposed upstream depth-limit fix PR is closed and has a reported compatibility regression. Rejected an unsafe override/fork and npm's forced Next ESLint v14 downgrade; preserve the Next 16 lint rules and track for an upstream fix.
- Fresh verification rerun passes all 24 focused PostgreSQL-backed integration tests, lint, TypeScript, Prisma validation/generation, and production build with all 14 static pages. Registry check: official `eslint-config-next@16.4.0` still reaches `fast-glob@3.3.1`; `braces` remains 3.0.3.
- Session: [[wiki/logs/2026-10-07-issue-10-braces-audit-follow-up]].

## 2026-10-06 - Issue #10 API closure continuation and expanded matrix

- Added database-backed API contract assertions for booking/waitlist inactive membership and waiver rejection, full/cutoff behavior, duplicate waitlist, repeated waitlist removal/cancellation and promoted-entry handling, plus before/after no-change checks for waiver CSRF and invalid/unknown-field administrator capacity updates.
- Expanded route proof for booking/waitlist seat, duplicate, overlap, cutoff and invariant outcomes; no-state-change on rejected unsafe writes; oversized registration; trainer isolation; administrator invalid references, capacity floor, FIFO promotion, cutoff, trainer overlap, and the documented PATCH scheduling-edit/history rules; plus limiter email/IP concurrency, expired-window, and successful-login reset.
- Fixed the admin session-create error mapping discovered by the trainer-overlap integration test: PostgreSQL exclusion violations now return `409 TRAINER_OVERLAP`.
- Updated `PATCH /api/v1/admin/sessions/{sessionId}` to support documented program/trainer/time/cutoff/capacity edits before participation history, while enforcing capacity-only changes after any booking or waitlist history. Status changes remain out of scope. All edits are serialized on the session row; trainer reassignment/time edits lock and check the trainer assignment, backed by the exclusion constraint.
- `npm run test:auth-api` (5/5), `npm run test:api-contract` (7/7), `npm run test:constraints` (2/2), `npm run test:race` (10/10), `npm run lint`, `npx tsc --noEmit`, and `git diff --check` pass with local PostgreSQL reachable. Issue #10 stays In Progress because broader malformed-body coverage and final acceptance review remain.
- Updated the closure report, Sprint 4/project/board notes, and this session record with the exact evidence and remaining boundary.
- Session: [[wiki/logs/2026-10-06-issue-10-api-closure-continuation]].

## 2026-09-28 — Better Auth implementation baseline for Issue #10

- Replaced the unused Auth.js dependency with pinned Better Auth 1.7.6 and its Prisma adapter after the project owner selected Better Auth for login.
- Added ADR 014, which supersedes only ADR 012's Auth.js/JWT implementation choice while retaining Argon2id, eight-hour sessions, same-origin checks, `auth_version`, and fictional-data constraints.
- Added reviewed Prisma migrations for Better Auth users/sessions/accounts/verifications, session `auth_version`, credential-rate-limit records, and an explicit restoration migration for Issue #8's composite promotion-provenance constraint after Prisma could not represent it.
- Added the Better Auth handler with non-MVP account-management routes blocked, custom registration/login entry points, a current-user resolver, same-origin protection, return-path validation, and membership/waiver handlers. Route-level integration tests and the remaining Issue #10 endpoint surface are still incomplete; Issue #10 remains In Progress.
- Verification rerun: database seed/verification, booking and waitlist verification, rejected-write checks, ten synchronized PostgreSQL races, Better Auth registration/session/origin tests, lint, TypeScript, Prisma validation, and a production build with an ephemeral test secret passed. The ordinary build correctly fails without `BETTER_AUTH_SECRET`, so local `.env` must be configured before starting the app. `npm audit --omit=dev --audit-level=high` reports four Prisma-transitive advisories; its only automated fix force-downgrades Prisma, so it was not applied.
- Continued Issue #10 with public plan/program/session reads, member booking reads and cancellation, waitlist removal, trainer/admin reads, administrator session create/capacity edits, and participant reads. Review found resource-ID cancellation and promotion-race defects; cancellation now targets the requested booking and waitlist removal uses the established session/member lock order. The full per-endpoint contract-test matrix remains incomplete, so Issue #10 stays In Progress.
- Follow-up test report now has nine passing authentication/API integration tests, lint, TypeScript, and diff validation. The new route-contract suite reaches all 17 current `/api/v1` handlers with real sessions and fictional records; it proves selected validation, authorization, IDOR, CSRF, domain-error, and success cases. Issue #10 remains In Progress because every documented domain edge and unsafe-write no-state-change outcome still needs proof.

## 2026-09-22 - Penpot Lucide icon library

- Added `Icons — Lucide` to the connected Penpot file with 20 official icon SVGs grouped for navigation/account, booking/schedule, status/feedback, and common controls. The board documents a 24 px / 2 px default and accessible labeling guidance.
- Lucide is the selected UI icon family; the page and usage rules remain reviewable design guidance. This does not approve the FitOps brand or constitute application implementation.
- Session: [[wiki/logs/2026-09-22-penpot-lucide-icon-library]].

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


## 2026-09-22 - Named wireframe review groups

- Consolidated the 27 route pages into 20 named review pages while keeping every route/state screen separate and top-level. Legal & Misc contains Terms, Privacy, Waiver, Cookie preferences, and 404; related Club information, Account access, and Trainer routes are grouped by workflow.
- Rebuilt the plugin and verified grouping, prototype constraints, static UX synchronization, and layout checks. Native Figma visual QA remains pending.
- Session: [[wiki/logs/2026-09-22-wireframe-review-groups]].


## 2026-09-22 - Sidebar-readable wireframe page names

- Reordered generated Figma page names so the sidebar begins with the numbered review group, such as `01 · Public · Home`, followed by the version marker. Existing prefix-first versions remain supported by regrouping.
- Session: [[wiki/logs/2026-09-22-wireframe-sidebar-names]].


## 2026-09-22 - FitOps component page manager

- Added `Manage FitOps Components` to the local Practice Athletic Club Master Toolkit. It scans eligible kit pages and creates or refreshes a native Button component set with Style, Size, and Brand variants plus five neutral low-fidelity components on a separate `FitOps Components` page, preserving the Community kit and unrelated user layers.
- Rebuilt the plugin and passed structural component rerun coverage, wireframe generator checks, UX synchronization, JavaScript syntax checks, and whitespace validation. Native Figma Desktop execution and visual QA remain pending.
- Session: [[wiki/logs/2026-09-22-fitops-component-page-manager]].


## 2026-09-22 - Penpot exploratory design tokens

- Added 25 tokens to a new inactive `Practice Exploratory` set in the connected Penpot `FitOps Design System` file: 11 colors, 9 font sizes, and 5 Mona Sans weights. Kept the existing `Global` set and `FitOps` theme unchanged.
- Values follow the existing exploratory brand references; no unsupported spacing, radii, shadows, or other values were added. The token set does not approve the brand.
- Session: [[wiki/logs/2026-09-22-penpot-exploratory-design-tokens]].


## 2026-09-22 - Penpot Design Tokens page and layout proposals

- Created and visually reviewed a dedicated `Design Tokens` page in the connected Penpot file. It documents existing color/type references and proposes a 4 px spacing scale plus responsive grid examples at 1440, 768, and 390 px.
- Added the 8 spacing values to a separate inactive `FitOps Layout Proposal` set. Current catalog read shows `Practice Exploratory` active, `Global` inactive, and the `FitOps` theme inactive with no sets; activation does not constitute brand approval.
- Line-height/tracking and exact layout breakpoints remain unresolved; the page labels spacing and grid values as proposals.
- Session: [[wiki/logs/2026-09-22-penpot-design-tokens-page]].


## 2026-09-22 - Penpot wireframe mirror from plugin source

- Created 20 numbered review pages in the connected Penpot file from the local Figma plugin's existing route/state definitions: 163 scenarios and 326 desktop/mobile SVG-vector screen groups. Kept the low-fidelity structure and fictional data; no icons or prototype reactions were added.
- Exported and visually reviewed the Home desktop and Admin Participants boards; both have readable light canvases and clear screen content. Page and board counts match the plugin's definitions.
- This Penpot mirror does not claim native Figma execution or visual approval; the native Figma Issue #6 gate remains pending.
- Session: [[wiki/logs/2026-09-22-penpot-wireframe-mirror]].


## 2026-09-22 - Issue #6 Ready for Sprint 1 status sync

- Confirmed Issue #6 is listed under Ready for Sprint 1 in the local delivery system and added the existing `sprint:sprint-1` label to GitHub Issue #6. GitHub verification shows the issue remains open and has no attached Project item.
- Native Figma execution and visual approval remain outstanding, so the issue was not marked complete. Project board access is unavailable to the current GitHub connection because it lacks `read:project` scope.
- Session: [[wiki/logs/2026-09-22-issue-6-ready-for-sprint-1]].
## 2026-09-23 - Penpot wireframe consolidation and draw.io coverage audit

- Removed 12 redundant older Penpot import pages after verifying their screen-name inventories match the newer QA pages. Renamed the retained 20 groups consistently as `— Wireframes`; Design Tokens, Icons, and kit pages were preserved.
- Matched the live 326 desktop/mobile boards to all 26 draw.io page routes, the separate 404 fallback, and 163 scenarios per device with no missing, extra, or duplicate names. Corrected 76 short member/trainer/admin screen backgrounds and exported representative member booking and schedule boards for visual review.
- Static Penpot mirrors still lack prototype interactions and do not complete native Figma visual approval for Issue #6.
- Session: [[wiki/logs/2026-09-23-penpot-wireframe-consolidation]].

## 2026-09-23 - Issue #7 use case and boundary draft

- Adapted the supplied use case template into an Obsidian specification and reviewed candidate boundaries with four DDD skill checklists.
- Identified unresolved consistency and eligibility questions; Issue #7 remains open and implementation readiness is not claimed.
- Session: [[wiki/logs/2026-09-23-issue-7-use-case-boundary-draft]].

### Same-day expansion

- Expanded the draft to ten use cases and applied eight DDD skill stages to existing requirements and flow evidence. Corrected the cancellation review against the current flow and recorded waiver, trainer API, and session-edit gaps.

### Exit-evidence upgrade

- Aligned ten use cases with the editable UX source and updated requirements, REST API, conceptual data model, and DBML. Added ADR 007, twelve-rule traceability, and a transaction protocol with seven concurrent test scenarios.
- Design review is documented; executable schema and PostgreSQL concurrency tests remain unimplemented. Issue #7 was not closed.

### Same-day DDD skill audit

- Checked the Issue #7 artifacts against upstream DDD skill validation lists. Withdrew subjective review scores and marked context/aggregate backtracking and incomplete modeling artifacts. Corrected member-profile authorization and documented the existing in-app waiver action in the API. Issue #7 remains open.

### Same-day DDD closure revision

- Added ADR 008 to give Booking BookableSession capacity/cutoff/participation ownership and retain Scheduling's calendar responsibility. Expanded context, aggregate, event, port, and contract-map artifacts; the revised design passes the DDD checklists with a documented local multi-aggregate exception. Implementation evidence remains pending.

- Clarified that MemberReservationCalendar uses the owned member-profile row as its physical lock anchor until the data-schema work selects a representation; the session-first lock protocol remains unchanged.

- Final documentation check corrected stale ADR 007-only references: ADR 008 is the ownership boundary and ADR 007 keeps transaction safeguards. GitHub Issue #7 remains open with no stated acceptance criteria beyond its title/summary.

### GitHub closure

- Published the reviewed design artifacts in `c8d1262` and closed [GitHub Issue #7](https://github.com/AqueosHeart/fitops/issues/7). The issue is closed as documentation/design scope; executable schema, migrations, and PostgreSQL concurrency evidence remain assigned to downstream work.

## 2026-09-23 Issue #8 schema design start

- Drafted `docs/database/physical-schema-plan.md` from Issue #7, ADR 008, the conceptual DBML, requirements, and API. Proposed separate one-to-one Scheduling/Booking session tables with a shared public ID, database constraints, session-local waitlist key allocation, migration review, and synchronized PostgreSQL race tests.
- Issue #8 remains open. No Prisma schema, SQL migration, PostgreSQL test, or application behavior was created. Authentication persistence and trainer-specialty representation remain design checks before implementation.

### Same-day deep review

- Audited the proposal against Issue #7, ADRs 007–008, requirements, API, conceptual model, and current PostgreSQL/Prisma/Auth.js documentation. Recorded four high and four medium findings in `docs/database/physical-schema-review.md`.
- The design is not ready to migrate: session snapshots can drift, authentication storage is undefined, cross-table participation transitions need a complete contract, and native types/FK actions are missing. No executable schema or PostgreSQL proof exists; Issue #8 stays open.

## 2026-09-24 Issue #8 revision and second review

- Revised the physical plan, conceptual DBML, architecture, requirements, API, and related UX copy. ADR 009 selects one physical `class_sessions` row mapped to separate Scheduling and Booking domain views; the plan now names auth storage, PostgreSQL types, constraints, foreign-key actions, indexes, lock order, and migration/test obligations.
- The second review records design resolutions for the prior four high and four medium findings. It found a further capacity-increase fairness gap; ADR 010 requires FIFO promotion of eligible waiters inside the administrator edit transaction before cutoff, with rollback on failure and a post-cutoff restriction.
- Static DBML parsing, draw.io XML parsing, Mermaid rendering, wireframe generation, and UX synchronization checks passed. No Prisma schema, migration, PostgreSQL execution, or native visual approval exists. Issue #8 remains open under the Sprint 0 and Sprint 1 design gates and Issue #9 security decisions.

### Independent third schema review

- A subagent reviewed the revised plan against requirements, API, Issue #7 use cases, ADRs, and DBML. It found a cancellation promotion cutoff race, stale Issue #7 edit/promotion protocol, and an undefined free-seat-plus-waitlist error. ADR 011 now requires a fresh cutoff check after each candidate member lock, with full rollback if expired.
- Aligned the Issue #7 use cases and pseudocode with historical-row edit freeze, capacity-increase FIFO promotion, and the inconsistent free-seat-plus-waitlist response. Both Book and Join now specify generic `500 PARTICIPATION_INVARIANT_BROKEN`, server alert, and explicit repair. The [third review](../docs/database/physical-schema-third-review.md) records evidence and outstanding database proof. Issue #8 remains open.

## 2026-09-25 - Issue #9 identity security baseline

- Added ADR 012 and a threat model for the fictional MVP. It records Argon2id storage, 15–128 character password handling, generic rate-limited credential failures, an eight-hour HTTP-only JWT session, current-record authorization with `auth_version` invalidation, origin-based CSRF checks, return-path allowlisting, and redacted logging.
- The recovery route remains informational because no email or reset-token flow is approved. The threat model defines server-side authorization and test obligations for member ownership, trainer scope, administrator operations, and concurrency safety.
- This supplies Issue #8's required identity-security design choices. It does not create Prisma models, migrations, authentication code, PostgreSQL tests, or clear the outstanding Sprint 0/native Figma gates.
- Session: [[wiki/logs/2026-09-25-issue-9-security-baseline]].

## 2026-09-25 - Penpot replaces Figma as the visual-design tool

- Added ADR 013 to make the connected Penpot `FitOps Design System` file the active FitOps visual-design tool. draw.io remains the editable UX-flow source and Mermaid plus Penpot remain derived artifacts.
- Replaced the obsolete native Figma requirement in Issue #6 documentation with the canonical Penpot set: 20 numbered wireframe pages, 326 desktop/mobile boards, 163 scenarios per device, and coverage of 26 routes plus the 404 fallback. GitHub reports Issue #6 is closed.
- Retained `scripts/figma-plugin/` as historical import/source tooling. It is no longer a required run, approval gate, or delivery target.
- Session: [[wiki/logs/2026-09-25-penpot-replaces-figma]].

## 2026-09-25 - Sprint 0 exit and GitHub Project setup

- Linked `AqueosHeart/fitops` to the `FitOps Delivery` GitHub Project. Added Sprint, SDLC Phase, Work Type, and Risk fields; standardized Status and Priority options; created Current Sprint, Product Backlog, SDLC Roadmap, and Bugs and Debt views. GitHub reserves `Type`, so the project uses `Work Type`.
- Added Issues #8 and #9 to the delivery plan with values. Issue #8 is In Progress for Sprint 3 / SDLC Phase 4, high risk, P1, estimate 5. Issue #9 is Done and closed for Sprint 1 / SDLC Phase 3, high risk, P1, estimate 3.
- The Sprint 0 exit review passed from documented product, UX, architecture, data, security, Penpot, and GitHub Project evidence. No executable application or database proof exists yet.
- Session: [[wiki/logs/2026-09-25-sprint-0-exit-and-project-setup]].

## 2026-09-25 - Issue #8 implementation foundation

- Added `web/` as the Next.js 16.3.6 application foundation with TypeScript, ESLint, and Tailwind. The generated application passes lint and a production build.
- Pinned Node 24.14.x, npm 11.9.x, Prisma 7.10.0, PostgreSQL driver packages, Zod 4.6.5, and `next-auth` 4.24.15. PostgreSQL 16 runs locally in Docker and the `fitops` database connection was verified.
- Added a valid empty Prisma 7 configuration and schema plus an ignored local `.env` and tracked `.env.example`. No domain models, migration, seed, authentication behavior, constraints, or race tests were created.
- `npm audit --omit=dev` reports four high findings in Prisma CLI transitive development dependencies. The offered automated fix downgrades Prisma to 6, so it was not applied; reassess when Prisma 7 publishes a compatible fix.
- Session: [[wiki/logs/2026-09-25-issue-8-implementation-foundation]].

## 2026-09-25 - Issue #8 initial schema migration

- Added the seven physical models, six native PostgreSQL enums, relations, named read indexes, and promotion provenance mapping to `web/prisma/schema.prisma`.
- Generated and reviewed the initial migration before applying it to the empty local PostgreSQL 16 database. It adds the required checks, partial active-participation indexes, composite promotion reference, `btree_gist` trainer interval exclusion, and explicit `ON UPDATE NO ACTION` foreign keys.
- Prisma validation, migration application, client generation, and lint passed. No fictional seed, adapters, authentication behavior, or synchronized race tests exist yet.
- Session: [[wiki/logs/2026-09-25-issue-8-initial-schema-migration]].

## 2026-09-25 - Issue #8 fictional seed

- Added a repeatable Prisma seed with six fictional `example.test` users, a trainer, administrator, program, full upcoming session, two confirmed bookings, and two FIFO waitlist entries. It creates a runtime Argon2id hash and stores no usable demo password or credential hash in source.
- `npm run prisma:seed` passed against local PostgreSQL and produced counts of six users, one session, two confirmed bookings, and two waiting entries.

## 2026-09-25 - Shared Prisma client

- Added the server-only shared Prisma PostgreSQL client and `npm run db:verify`. It successfully reads the local fictional seed data.

## 2026-09-25 - Booking repository and locks

- Added a read-only booking-state repository and a transaction helper that locks the ClassSession row, then the MemberProfile row, with parameterized PostgreSQL `FOR UPDATE` queries.
- Verification reads the full seeded booking state through both paths and confirms two bookings plus an active member under the lock.

## 2026-09-25 - Booking decision services

- Added transaction-scoped direct booking, waitlist join, and cancellation with FIFO promotion services. They use the documented ClassSession then MemberProfile lock order.
- Direct booking and waitlist verification confirm duplicate participation returns `ALREADY_PARTICIPATING`. Cancellation promotion is implemented but still requires synchronized PostgreSQL race tests, including cutoff crossing and ineligible candidate cases.

## 2026-09-28 - Issue #8 synchronized PostgreSQL repair loop

- Independent audit, repair, and re-audit cycles corrected the TypeScript ES target, distinct booked/waiting outcomes, capacity-transaction retries, and promotion status guards.
- Added ten UUID-isolated PostgreSQL tests that use held row locks and observed blocked workers to exercise booking, waitlist, cancellation, capacity, ineligible/multi-seat promotion, cutoff crossings, and an injected promotion-write failure with complete rollback assertions.
- `npm run test:race` passes all ten tests. TypeScript checks pass. A production build compiled and entered TypeScript checking but did not finish within the desktop command window, so it is not recorded as a passed build.
- Authenticated HTTP handlers, Auth.js credentials, server-side authorization, and product UI remain unimplemented and are the next safe work.
- Session: [[wiki/logs/2026-09-28-issue-8-postgres-race-repair-loop]].

## 2026-09-28 - Issue #8 closure and Sprint 4 activation

- Verified the remaining Issue #8 acceptance gates: two fresh disposable PostgreSQL databases each applied both committed migrations; two rejected-invalid-write tests pass; the re-seeded local data contains six fictional users, one session, two confirmed bookings, and two waiting entries.
- Updated GitHub Issue #8 acceptance checkboxes, closed it as completed, and set its `FitOps Delivery` Project status to Done.
- Created GitHub Issue #10, `[API] Secure REST API and Server-Side Access Control`, and triaged it as In Progress for Sprint 4 / SDLC Phase 4, Feature, High risk, P1, estimate 8.
- Session: [[wiki/logs/2026-09-28-issue-8-closure-and-sprint-4-activation]].

## 2026-09-28 - Delivery backlog visibility

- Added Issues #11 through #14 to GitHub and `FitOps Delivery` to make the remaining roadmap visible: member product, administrator product, system quality, and release/portfolio evidence.
- The Project now shows Issue #10 In Progress and the dependency-ordered Sprint 5 through Sprint 8 work as Backlog. No future-sprint implementation is claimed.

## 2026-10-07 - Issue #10 local acceptance closure review

- Added malformed JSON, unknown-field, oversized-body, and oversized declared-length rejection checks for body-parsing endpoints, with state assertions for rejected unsafe writes. Added missing-session and unknown-cancellation checks, exact `ALREADY_WAITING`/`ALREADY_BOOKED` assertions, and proof that removing a promoted waitlist entry preserves both its linked booking and entry.
- Hardened registration cleanup: if the initial Better Auth session request fails or throws after identity/profile/account creation, a transaction removes the incomplete registration. Integration tests verify no user, profile, credential account, or session remains. Registration response redaction is also asserted.
- Resumed `fitops-postgres` after Docker Desktop restart. Auth (5), API contract (7), PostgreSQL constraints (2), synchronized races (10), lint, TypeScript, diff check, and production build pass. Build used only a temporary process-scoped secret; no `.env` file was edited.
- `npm audit fix` updated patched `sharp` and `source-map-js`. Tested npm overrides upgrade Prisma CLI/config transitive `deepmerge-ts` to 8.0.2 and `mysql2` to 3.24.5 while retaining Prisma 7.10.0; Prisma validate/generate pass and `npm audit --omit=dev --audit-level=high` reports zero vulnerabilities. Full audit retains five high findings through unpatched development-only `braces` in the Next ESLint chain; npm's force-fix would downgrade the Next ESLint config to v14 and was not applied.
- Public GitHub Issue #10 remains Open and no branch/PR is attached. Local acceptance passes, but implementation/report are unpublished pending user authorization and upstream CI/review.
- Session: [[wiki/logs/2026-10-07-issue-10-final-local-acceptance-review]].
# 2026-10-07 — Issue #11 member product slice started

- Verified PR #15 merged to `main` at `ee5839203e15879309187a6b811532ff15b56f3a`; Issue #10 is Closed/Done, and Issue #11 is In Progress in Sprint 5.
- Created local branch `codex/fitops-issue-11-member-slice` from updated `origin/main`; implemented partial public/member UI, server-side route guard, cancellation cutoff UI/API field, and improved future-session demo seed.
- API-contract suite (7), Prisma validation, TypeScript, lint, production build (29 routes), and diff/secrets checks passed. A fresh scratch DB applied all six migrations and passed fresh plus idempotent seed verification, then was removed. The existing local DB gained two future fixtures and a fictional test member; its original historical data was preserved. Browser verified fictional registration/login, booking, full waitlist, cancellation/leave, mobile views, dialog keyboard behavior, sign-out, and protected redirect. Issue #11 remains In Progress, with local uncommitted changes and no PR.
- Details and next safe steps: [[wiki/logs/2026-10-07-issue-11-member-product-slice]]; [[wiki/tasks/Sprint 5]].

## 2026-10-07 — Issue #11 local verification and PR handoff

- Re-ran API-contract tests (7 passing), TypeScript, lint, Prisma validation, production build (29 routes), `db:verify`, and `git diff --check`; all passed. The API test cleaned its temporary records. No GitHub Actions checks are configured for this repository.
- Committed the member product slice as `262c337`, pushed branch `codex/fitops-issue-11-member-slice`, opened PR #16, and moved the FitOps Delivery item to In Review. Issue #11 remains open pending review and merge.
- Local development auth config now has a generated key only in ignored `web/.env.local`; no key or account identifier is stored in the repository. The user confirmed the additional browser-created account and active waitlist entry are fictional; no address or identifier was recorded, and no cleanup or seed reset was run.
- Details: [[wiki/logs/2026-10-07-issue-11-member-product-slice]]; [[wiki/tasks/Sprint 5]].

## 2026-10-07 — Issue #12 administrator operations started as dependent work

- PR #16 remains open, so administrator UI work is on a local branch stacked on its member branch; Issue #12 stays Backlog/Sprint 6 and no acceptance closure is claimed.
- Implemented protected admin overview/list/create/edit/participants screens and admin-only form options; documented the response contract. API-contract 7/7, targeted ESLint, and production build (34 routes) pass. Authenticated browser acceptance and dependency merge are still required.
- Details: [[wiki/logs/2026-10-07-issue-12-admin-operations-start]]; [[wiki/tasks/Sprint 5]].

## 2026-10-07 — Issue #11 merged and Issue #12 branch rebased

- Reviewed and merged PR #16 to `main` at `0248913b6867708a6f5bf8e1dd44a74ac32ec313`; GitHub closed Issue #11 and records its Project status as Done. The issue checklist now contains verified acceptance evidence.
- Rebased `codex/fitops-issue-12-admin-operations` onto the merged main. The admin branch remains local and Issue #12 remains Backlog; authenticated UI acceptance is outstanding.
- Re-run on the merged stack: auth 5, API contract 7, DB constraints 2, PostgreSQL races 10, lint, TypeScript, Prisma validate, read-only `db:verify`, production build (34 routes), and `git diff --check` passed. No Actions checks are configured.
- Details: [[wiki/logs/2026-10-07-issue-11-member-product-slice]]; [[wiki/logs/2026-10-07-issue-12-admin-operations-start]]; [[wiki/tasks/Sprint 5]].

## 2026-10-07 — Issue #12 draft PR published

- Pushed `codex/fitops-issue-12-admin-operations` and opened Draft PR [#17](https://github.com/AqueosHeart/fitops/pull/17) against `main`; its review description lists the authenticated browser acceptance still required. Issue #12 remains Backlog.
- Fixed the login return-path mismatch discovered while verifying the admin gate: only administrators may land on allowlisted `/admin` routes; member registration remains member-only. API-contract (7), auth (5), lint, and build (34 routes) pass after the fix.
- Details: [[wiki/logs/2026-10-07-issue-12-admin-operations-start]]; [[wiki/tasks/Sprint 5]].

## 2026-10-07 — Issue #12 fictional admin test account enabled

- With explicit user authorization, promoted the unique non-seed fictional `@example.test` test account from MEMBER to ADMINISTRATOR in the local database using a conditional transaction.
- Verified the new role and preserved its member profile, one booking, and one waitlist entry; no account identifier or credential was recorded. Issue #12 remains Backlog pending authenticated browser acceptance.
- Details: [[wiki/logs/2026-10-07-issue-12-admin-test-account]].

## 2026-10-07 — Issue #12 browser account mismatch corrected

- The admin screenshot still showed a signed-in member denial. Read-only inspection of active session ownership showed the browser account differed from the inactive test account first promoted; no credentials or full identifiers were read or recorded.
- In one conditional transaction, restored the unrelated inactive account to MEMBER and promoted the unique fictional member account with active sessions to ADMINISTRATOR. Verified four sessions and its member profile, one booking, and one waitlist entry remained unchanged.
- Role resolution reloads the user from PostgreSQL on each protected request. The user can refresh `/admin`; authenticated browser acceptance is not yet verified.
- Details: [[wiki/logs/2026-10-07-issue-12-admin-test-account]].

## 2026-10-07 — Issue #12 admin shell and account routing

- Consolidated admin navigation into one focused header: Overview, Sessions, My Account, and Public site. Removed the public marketing nav/Join Now and duplicate operations subnav from admin routes.
- `/portal/login` now resolves a valid Better Auth session server-side, honoring an allowlisted destination only if permitted for the current role; otherwise member-profile accounts go to `/app`, and staff-only accounts go to their role workspace.
- Updated draw.io source, Mermaid route/admin flows, FitOps project and Sprint 5 notes, delivery mirror, and this log. API-contract test passes 7/7; targeted ESLint, TypeScript, production build (33 routes), UX structural validator, and anonymous login/admin redirect HTTP checks pass. Initial concurrent test attempt hit local DB transaction timeouts; isolated rerun passed. Mermaid CLI package resolution stalled, so SVG previews remain stale. Authenticated browser acceptance remains outstanding.
- Details: [[wiki/logs/2026-10-07-issue-12-admin-shell-account-routing]]; [[wiki/tasks/Sprint 5]].

## 2026-10-07 — Issue #12 acceptance follow-up

- User confirmed the newly requested local account was fictional. Read-only inspection showed it already held ADMINISTRATOR; its existing member profile, sessions, bookings, and waitlist records were left unchanged. The address is intentionally not copied to project notes.
- A repeated API-contract run exposed a nondeterministic test fixture: concurrent registrations were indexed by completion order. Changed lookups to stable test labels; rerun passes 7/7, including admin creation/edit/FIFO/cutoff and role-boundary contracts. ESLint and TypeScript pass; prior production build remains green.
- Mermaid CLI package execution stalled twice (including a pinned-version attempt); SVG previews remain stale. Authenticated browser UI acceptance remains open because no user browser tab/session is exposed to the local browser-control surface.
- Details: [[wiki/logs/2026-10-07-issue-12-admin-shell-account-routing]]; [[wiki/tasks/Sprint 5]].

## 2026-10-07 — Mermaid previews regenerated after renderer recovery

- Installed Mermaid CLI 12.0.0 into an isolated temporary npm cache with install scripts disabled; configured Puppeteer to use the already-installed local Edge executable. This avoided project dependency changes and browser downloads.
- Regenerated `docs/design/route-access-architecture.svg` and `docs/design/user-flow-admin.svg`, verified their labels against the Mermaid sources, and visually inspected both rendered previews. The earlier stalled-renderer note is superseded by this result.
- Authenticated browser acceptance remains outstanding; the local browser-control surface exposes no signed-in user tab.
- Details: [[wiki/logs/2026-10-07-issue-12-admin-shell-account-routing]].
## 2026-10-07 - FitOps admin browser retry blocked by Docker engine

- Resolved the local port conflict: AARC owns 3000; launched FitOps on 3001 and confirmed the admin navigation shell renders.
- Database-backed workspace is unavailable: `npm run db:verify` returns Prisma `ECONNREFUSED`; Docker CLI cannot reach the Linux engine pipe. No Docker/WSL or database changes were made.
- Corrected continuity notes: the fictional account requested for admin access already had ADMINISTRATOR; no role/account data changed in the read-only verification.
- Route-access and admin Mermaid SVG previews are regenerated, XML-parse successfully, and passed visual inspection. Structural UX sync passed. Authenticated Issue #12 acceptance remains pending database recovery.
## 2026-10-07 - FitOps second-computer local setup

- Added root Docker Compose PostgreSQL 16 for local development, bound only to loopback port 5433 with a persistent named volume.
- Added a Windows first-clone guide using committed Prisma migrations and fictional seed records; updated stale root project status and web READMEs.
- Added optional `FITOPS_DEMO_PASSWORD` support for fresh seed runs, validated against the existing 15-128 character password policy. The private `.env` remains ignored; absent a value, seed credentials stay randomly generated.
- No live database export, credential hashes, sessions, user account data, actual `.env` files, or Docker volume contents were added. Example environment files contain placeholders only. This is local development portability, not production deployment.
- Docker engine is unavailable on this computer, so actual Compose startup and database verification must be performed after Docker/WSL recovery or on the home computer.

## 2026-10-08 - Issue #12 acceptance completed on isolated test data

- Applied all six migrations and seeded a disposable PostgreSQL database on the LAN host; `db:verify` reported six fictional users, three sessions, four confirmed bookings, and four waitlist entries.
- API-contract integration suite passed 7/7 against PostgreSQL. Authenticated browser acceptance passed admin overview/create/edit/roster, a capacity increase from 2 to 3 with Casey Morgan FIFO-promoted ahead of Taylor Chen, and member/trainer denials on `/admin`.
- Removed the temporary DB, local Next.js instances, browser tab, and SSH tunnels. The deployed FitOps demo database and AARC were not changed. Issue #12 remains Backlog and Draft PR #17 pending review/Sprint 6 transition.
- Details: [[wiki/logs/2026-10-08-issue-12-acceptance]].

## 2026-10-08 - Issue #12 review completed; PR ready for human review

- Reviewed administrator session create/list/update and participant endpoints for same-origin enforcement, current-user administrator authorization, schema validation, scoped fictional data, and business-rule delegation. Reviewed login return-path allowlists and UI loading/error states against product requirements and ADRs 012/014. No blocking defect found in the inspected scope.
- Confirmed GitHub PR #17 is open, head `8a6c93b7a3f14e8447d73c44b5cd9005d78f23b3`, with no configured CI checks, review requests, or submitted reviews. Marked it Ready for review; this is not a code approval or a merge.
- GitHub Projects still records Issue #12 as Backlog / Sprint 6. No sprint start, project status change, issue closure, or deployment DB write occurred.
- Details: [[wiki/logs/2026-10-08-issue-12-review]].

## 2026-10-08 - Issue #13 quality gate started

- PR #17 merged to `main` at `08fbdd894c27436de2a52d8efe5c722c2e43dc56`; Issue #12 is Closed / Done / Sprint 6. Issue #13 was moved from Backlog to In Progress in Sprint 7, preserving its existing assignment.
- Branch `codex/fitops-issue-13-quality` updates Next.js to 16.3.8, adds Playwright/axe critical-journey coverage, a PostgreSQL-backed GitHub Actions quality workflow, ignored test-output paths, and an evidence report.
- Verified locally: zero full lockfile audit findings, lint, TypeScript, Prisma Client generation, production build (42 routes / 33 static page entries), Playwright discovery, and build artifact-size measurements. The deployed Linux app was not changed.
- Branch was pushed and draft PR #18 opened. The first Actions attempt exposed missing generated Next.js route types before `tsc` and unmasked ephemeral test values in job metadata; workflow now runs `next typegen` first and masks generated values before export. Rerun is pending.
- Pending: passing GitHub Actions, DB-backed integration/concurrency tests, browser E2E and axe results, and browser runtime performance measurement. The local Docker Linux engine did not respond to `docker info`; no live or deployed database was used.
- Details: [[wiki/logs/2026-10-08-issue-13-quality-start]].

## 2026-10-08 - Issue #13 CI accessibility findings corrected locally

- CI run 37841999623 passed isolated PostgreSQL migration/seed, database/API/constraint/concurrency suites, lint/type-check, full audit, and production build. The browser run stopped at the landing-page axe scan.
- Axe identified muted text at 4.43–4.45:1 against two soft backgrounds and ARIA labels/busy state on generic loading-grid divs without a semantic role. Darkened the shared muted token to `#62655b` (calculated 4.86:1 or higher on affected backgrounds) and assigned `role="status"` to named loading regions. Local lint and TypeScript pass.
- CI rerun, complete E2E flow, remaining axe scans, and browser runtime performance review remain pending. No live database or server was modified.
- Details: [[wiki/logs/2026-10-08-issue-13-accessibility-fix]].
- Follow-up run 37842824345 passed the landing axe scan and exposed that the generic E2E `getByRole("status")` selector matched both the success alert and loading status. Scoped the assertion to the success notice. Full flow and remaining scans are pending another CI run.
- Run 37843355892 then surfaced an unsupported trainer `returnTo` target and retry contamination from a state-mutating scenario. The test now uses the supported default and verifies `GET /api/v1/trainer/sessions`; auto-retries are disabled pending a fresh CI job. Playwright trace capture is disabled because trace archives include authenticated request headers/cookies, and previous failed-run trace artifacts were deleted.
- The underlying documented trainer pages are absent while `GET /api/v1/trainer/sessions` exists and authenticated trainer routing targets `/trainer/sessions`. Tracked this scope gap as Issue [#19](https://github.com/AqueosHeart/fitops/issues/19), added it to FitOps Delivery as a Phase 4 / P1 Feature in Backlog; Issue #13's E2E only claims API-role and admin-denial coverage.
- CI run 37846080789 on `fff390b` passed the full quality gate, including all three axe scans and desktop/mobile synthetic LCP/CLS budgets. The Playwright report has raw metric JSON attachments; this is not field CWV.
- Focused security review recorded no critical/high application-code issue in the covered paths; it identified trusted-proxy/IP-throttling and TLS/HSTS deployment gates, explicitly left safe defaults unchanged, and assigned these to Issue #14.
- Final CI run 37847213151 passed against `fbe6d5f`. Issue #13 acceptance criteria were checked against evidence, and PR #18 is ready for review; Issue #13 remains open until review and merge. No PR was merged and no deployment or database was changed.

## 2026-10-08 - Issue #19 trainer workspace started

- Moved Issue #19 to In Progress in FitOps Delivery while keeping it outside Sprint 7's Issue #13 goal.
- Implemented protected trainer session list/detail routes and APIs; detail queries are scoped by both session and current trainer and return aggregate counts only. Added safe trainer login return paths and My Account routing.
- Updated the editable draw.io trainer flow, wireframe coverage, and API contract.
- Local ESLint, TypeScript, UX synchronization, E2E discovery, and production build pass. DB contract suite was attempted but blocked by `ECONNREFUSED` on local PostgreSQL port 5432; no production/LAN database was changed.
- Added manual dispatch to the existing quality workflow so the stacked branch can run the isolated PostgreSQL/browser gate before PR #18 merges.
- First isolated run [37852249660](https://github.com/AqueosHeart/fitops/actions/runs/37852249660) passed DB contracts, lint/typecheck, audit, and build. E2E stopped at a strict alert locator because the Next route announcer is also an alert; changed assertions to exact copy.
- Next: push the correction and rerun quality CI for the stacked PR before checking Issue #19 acceptance.
