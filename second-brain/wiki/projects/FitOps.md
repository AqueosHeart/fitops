---
type: project
status: active
phase: development
sprint: Sprint 7 complete
updated: 2026-10-11
---

# FitOps

Hero motion follow-up (2026-10-11): user requested the blur-to-sharp text entrance seen in MeuFit. Implemented staggered word reveal on page load/refresh in the shared hero, followed by description/button entry with static reduced-motion fallback. Builds, lint/typecheck, UX sync and five focused browser tests pass; no sprint/GitHub/data/deployment change. See [[../logs/2026-10-11-hero-focus-entrance]].

FitOps is the repository and internal project codename. The public-facing fictional gym is **Practice Athletic Club**, which helps members discover and reserve classes while giving staff a dependable way to manage schedules, capacity, cancellations, and waitlists.

## Current outcome

2026-10-08 authenticated administrator acceptance and focused review passed, then PR #17 merged to `main` at `08fbdd894c27436de2a52d8efe5c722c2e43dc56`. GitHub records Issue #12 Closed / Done / Sprint 6. The deployed demo DB was not changed by acceptance.

On 2026-10-08, continuation moved the already-tracked trainer workspace Issue #19 from Backlog to In Progress without changing Sprint 7's Issue #13 quality goal. Branch `codex/fitops-issue-19-trainer-workspace` implements the protected, read-only assigned-session list/detail and trainer login return routing. Local lint, TypeScript, UX synchronization, E2E discovery, and production build pass; DB-backed contract tests cannot run locally because PostgreSQL on `127.0.0.1:5432` refuses connections. No deployed DB or Linux service was changed. See [[../logs/2026-10-08-issue-19-trainer-workspace-start|Issue #19 trainer workspace continuation]].

Issue #19 is Closed / Done. PR [#20](https://github.com/AqueosHeart/fitops/pull/20) merged into `main` on 2026-10-09 at `674f2b4b0f68d4ca8eb193949913f24221e8fb52`; quality run [37956811965](https://github.com/AqueosHeart/fitops/actions/runs/37956811965) passed disposable PostgreSQL migration/seed and API suites, lint/type-check, audit, production build, and the critical Chromium/accessibility journey. No LAN deployment or live database changed.

On 2026-10-09, PR [#18](https://github.com/AqueosHeart/fitops/pull/18) merged into `main` at `20eea7710d77fb7002b01f57d85acf1900a0fa39`; GitHub records Issue #13 Closed / Done. Sprint 7's quality objective is complete. Its security review retains Issue #14's HTTPS/HSTS and trusted-proxy release gates; this merge does not authorize public exposure or deployment.

On 2026-10-10, a fresh Windows local-development instance was started from synced `main`. Docker Desktop 29.6.2 runs isolated PostgreSQL 16 on loopback port 5433; all six migrations applied and the fictional seed verified (6 users, 3 sessions, 4 confirmed bookings, 4 waitlist entries). Next.js 16.3.8 dev server is bound to `127.0.0.1:3000`; `/` and `/portal/login` returned 200. Configuration is in ignored `.env` files and the database is in a dedicated local Docker volume. No LAN server or deployed database was touched. The root README now reflects current implementation/release status, and the local guide clones `main`.

Issue #14 readiness review (2026-10-10) added a guarded private-demo volume reset to the LAN guide and a [case-study draft](../../../docs/portfolio-case-study.md). The repo now separates verified CI/local evidence from the missing public release. The documented Linux service is stale relative to `main` and remains HTTP-only/private. GitHub shows Issue #14 Open with no assignee, labels, or project item; the earlier Sprint 8 mirror is unverified. Public smoke, TLS/HSTS, trusted-proxy configuration, and release review remain open.

Local visual review (2026-10-10) found that the public homepage's abstract CSS figure weakened its portfolio presentation. The local page now uses a compressed, fictional editorial training image and keeps the desktop navigation on one row through the tablet breakpoint. The update was reviewed at 870 px in the local browser. It remains an exploratory application treatment: the brand is unapproved, Issue #14 remains Open, and there is no public deployment evidence. See [[../logs/2026-10-10-local-homepage-visual-review|local homepage visual review]].

The [Sprint 0 exit review](../../../docs/reviews/sprint-0-exit-review.md) passed on 2026-09-25. `FitOps Delivery` was linked to the repository and its fields/views were established. Issues #8, #10, #11, #12, and #13 are closed and Done after database, API/access-control, member, administrator, and quality evidence. PR #17 merged on 2026-10-08 at `08fbdd894c27436de2a52d8efe5c722c2e43dc56`; PR #18 merged on 2026-10-09 at `20eea7710d77fb7002b01f57d85acf1900a0fa39`. Issue #14 is Open; current GitHub issue metadata returns no assignee, labels, or linked project, so its previously documented Sprint 8 assignment is unverified.

The 2026-09-28 follow-up test report is a historical checkpoint with nine integration scenarios. The final Issue #10 acceptance review added the documented domain edges and unsafe-write no-state-change evidence; PR #15 merged on 2026-10-07 and Issue #10 is Closed/Done. Issues #11 (Sprint 5 member slice), #12 (Sprint 6 administrator slice), and #13 (Sprint 7 quality evidence) are now closed; Issue #14 remains open, with its GitHub Project assignment to be reconciled.

Historical checkpoint (2026-10-07, superseded): Issue #12 implementation began on branch `codex/fitops-issue-12-admin-operations`, was rebased onto `main`, then completed and merged as PR #17 on 2026-10-08. The local FitOps app's older Docker/WSL outage and use of port 3001 were environment-specific; no Docker/WSL changes were made.

The repository now includes a local-only PostgreSQL 16 Compose service and a [second-computer development guide](../../../docs/local-development.md). It recreates a fresh database from committed migrations and fictional seed data; it intentionally does not transfer the current computer's live database, credential hashes, sessions, or user activity. The optional seeded-admin password is read from the ignored local `.env` file. This setup is not production deployment evidence.

On 2026-10-07, PR [#15](https://github.com/AqueosHeart/fitops/pull/15) merged to `main` (merge commit `ee5839203e15879309187a6b811532ff15b56f3a`) and Issue #10 closed; API evidence and ADR 015 are recorded in the closure report and Sprint 4 note. Issue #11's member journey was delivered in PR [#16](https://github.com/AqueosHeart/fitops/pull/16), merged at `0248913b6867708a6f5bf8e1dd44a74ac32ec313`; Issue #11 is Closed/Done in GitHub. Browser verification completed fictional signup and consent, explicit portal login with preserved return path, successful booking, full-session waitlist, cancellation and leave-waitlist actions, accessible dialog Escape/focus restore, profile/plan/waiver status, sign-out home confirmation and post-sign-out protected-route redirect. Mobile schedule/profile were checked at 390×844. The current DB gained two future demo sessions (available and full with two waiters) without altering the original past session and participation rows; a scratch database applied all six migrations, passed fresh seed and `db:verify`, then passed a second seed/verify cycle. The synthetic test member was signed out after its booking and waitlist records were removed. API-contract (7), Prisma validation, TypeScript, lint, production build (29 routes), and current `db:verify` fixture assertions pass; local account and participation totals may change during browser QA. No GitHub Actions checks are configured.

The planning foundation exists. `Practice Athletic Club`, Quiet Strength, the Mona Sans lime-bar wordmark, and its palette/type materials are working brand inputs, not a defined or approved brand. `wiki/design/FitOps User Flows.drawio` is the editable source of truth for UX navigation and flows; Mermaid and Figma are derived only after it changes. ADRs 004 through 006 separate public discovery, fictional membership Join, secondary existing-member account access, and the protected member dashboard (`/app`). The native file has nine pages, including 26 page URLs, route/access architecture, detailed flows, and Page 08 wireframe scenarios. Landing anchors and the `/404` fallback belong to the architecture view, not the page-only sitemap. No routes or product capabilities were added. Static checks cover 26 page-only sitemap URLs plus 29 route/anchor mappings. The repository generator defines 163 scenarios per device. The former 20-page Penpot set (326 static desktop/mobile boards) is historical; Figma wireframe recreation remains outstanding. The public header has a secondary `My Account` utility to `/portal/login` and a primary `Join Now` CTA to `/join`; registration requires a selected fictional plan. No payment, card, or real subscription is collected. Issue #6 closure records the Penpot-era visual review only.

## FitOps component page manager

ADR 018 supersedes ADR 013's visual-tool choice. Figma is the active visual-design tool; draw.io remains the editable UX-flow source, and Mermaid plus Figma wireframes are derived artifacts. The closed Issue #6 is evidenced by the historical Penpot inventory, not a native Figma run. See the separate [FitOpsWireframing Figma foundations](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7110-73) and [components](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7111-244) pages. Existing AARC pages remain preserved and separate.

## Figma exploratory foundation and components

The active Figma file has separate FitOps foundations and component pages, alongside preserved AARC references. Foundations include primitive and semantic colors, light/dark modes, spacing, radii, typography styles, and subtle elevation. These candidates align with the linked Practice brand guideline reference but remain exploratory; this work does not approve the identity or synchronize application CSS.

The former Penpot Lucide sheet remains a historical icon reference; it has not yet been migrated into the active Figma pages.

On 2026-10-10, added a first full-page desktop homepage concept on the separate [FitOps · Landing Figma page](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7120-4). It has a full-bleed hero, public nav, brand principles, the seeded Strength Foundations program, sample availability-state cards that link to public session details, a closing schedule CTA, and legal/demo footer. The layout uses local FitOps button and session-card instances. Visual passes added three generated editorial photo fills, the green `PRACTICE ATHLETIC CLUB / NEIGHBORHOOD TRAINING` hero label, repeated lime eyebrow accents, a deeper left-side hero fade, and a transparent white-outline `Explore programs` secondary CTA beside the primary schedule CTA. Adjacent handoff notes describe image parallax, scroll-entry reveals, a fixed progress rule, and a reduced-motion fallback. This is an exploratory desktop visual concept, not an animated Figma prototype or app implementation; mobile composition, brand approval, and the full wireframe migration remain outstanding.

The former connected Penpot file has a historical set of 20 numbered wireframe pages: 163 scenarios, each represented by desktop (1440 px) and mobile (390 px) static SVG-vector boards. The 2026-09-23 cleanup removed 12 duplicate older imports after scenario comparison. The historic inventory covered all 26 draw.io routes, the 404 fallback, and desktop/mobile states. These fictional low-fidelity boards omit icons and prototype interactions. Their scenarios remain recoverable from draw.io Page 08 and repository generator sources; direct canvas transfer is unavailable through the connected tools, and rebuilding them in Figma remains outstanding.

## Critical journey

Issue #7 has an [[../design/Issue 7 Domain Boundaries and Use Cases|Obsidian design specification]] with ten use cases, twelve-rule traceability, and a transaction protocol with concurrent acceptance scenarios. ADR 008 supersedes ADR 007's split capacity ownership: Booking owns `BookableSession` capacity/cutoff/participation and Scheduling owns `SessionSlot` calendar definition. The revised artifact passes the DDD skill checklists for design, with a documented local multi-aggregate exception for immediate overlap prevention. The member-profile authorization wording and in-app waiver API gap were corrected. Executable schema and PostgreSQL race tests remain downstream evidence.

Issue #8 has a revised [physical schema and migration plan](../../../docs/database/physical-schema-plan.md). ADR 009 maps the conceptual `ClassSession` to one physical row while Scheduling and Booking keep separate domain views. The plan now specifies credential/JWT persistence, PostgreSQL types and constraints, lock order, and synchronized race-test obligations. ADR 010 adds FIFO promotion when an administrator increases capacity before cutoff.

The [first review](../../../docs/database/physical-schema-review.md) found four high and four medium gaps; the [second review](../../../docs/database/physical-schema-second-review.md) records their design resolution and the newly closed capacity-increase fairness gap. The implementation foundation now has a valid empty Prisma schema and verified local PostgreSQL connection, but no domain model, committed migration, or PostgreSQL test. Issue #8 stays open.

Issue #9 now has a [threat model and access-control specification](../../../docs/security/threat-model-and-access-control.md) and ADR 012. It fixes the design choices for Argon2id password hashing, generic and rate-limited credentials login, JWT lifespan and invalidation, CSRF defenses, server-side authorization, and the demo-only recovery boundary. This provides Issue #8's required identity behavior; it does not implement authentication or clear the remaining design gates.

An [independent third review](../../../docs/database/physical-schema-third-review.md) found that cancellation could wait past cutoff while locking a promotion candidate. ADR 011 now requires a fresh cutoff check after each candidate lock and rollback on expiry. The review also aligned the older Issue #7 protocol with historical-row edit freeze and ADR 010, and defines an operational error for a free seat coexisting with a waitlist. The corrected plan still needs executable proof.

Visitor discovers the club, uses primary Join Now to choose a fictional plan or secondary My Account as an existing member, enters the separate member workspace, books an available session or joins a waitlist, reviews the result, and cancels when permitted.

## Key constraints

- No real gym, customer, member, payment, or production data
- No microservices for the MVP
- Server-side authorization for protected operations
- Transactional enforcement of capacity and waitlist promotion
- Public demo and repository claims must be verifiable

## Current deployment status (2026-10-08)

Deployed from branch `codex/fitops-issue-12-admin-operations` (app source at commit `8951e16`) to `/home/sebastian/fitops` on the LAN at port 3001, with a separate PostgreSQL 16 volume and private database network. All six migrations applied; one fictional seed and `db:verify` passed (6 users, 3 sessions, 4 confirmed bookings, 4 waitlist entries). From the Windows workstation, the login page returns 200 and anonymous `/admin` redirects to `/portal/login?returnTo=%2Fadmin`. A server-side seeded-admin login and protected `/admin` request both returned 200. AARC remains active on port 3000 and was not modified. The deployed app is still LAN-only, without TLS, and still runs Next.js 16.3.6; the local update to 16.3.8 has not been deployed. Do not expose publicly until the quality and release gates are complete. Issues #13 and #14 remain open.

Deployment topology is recorded in [ADR 016](../../../docs/adr/016-lan-only-linux-fitops-deployment.md); operational instructions are in [the LAN deployment guide](../../../docs/linux-server-deployment.md).

Prisma Studio is running on demand in its `studio` Compose profile, published only at server loopback `127.0.0.1:5555`. An SSH tunnel from the Windows workstation is active and the UI HTML/JS asset return HTTP 200 at local `http://127.0.0.1:5555`. Studio writes bypass application invariants; see [ADR 017](../../../docs/adr/017-prisma-studio-over-ssh-tunnel.md). Close the Studio container and tunnel after use.

## Connections

- [[../../CRITICAL_FACTS]]
- [[../tasks/Sprint 7|Current sprint]]
- [[../tasks/Sprint 5|Completed Sprint 5]]
- [[../tasks/Sprint 0]]
- [[../concepts/Modular Monolith]]
- [[../concepts/Database Source of Truth]]
- [[../decisions/Decision Index]]
- [Product requirements](../../../docs/product-requirements.md)
- [Portfolio case study draft](../../../docs/portfolio-case-study.md)
- [Brand foundation](../../../docs/brand/brand-foundation.md)
- [Brand definition guide](../../../docs/brand/brand-definition-guide.md)
- [Visual territories](../../../docs/brand/visual-territories.md)
- [Logo system](../../../docs/brand/logo-system.md)
- [Color and type system](../../../docs/brand/color-and-type-system.md)


Landing follow-up (2026-10-10): added an installations carousel below the club story and before the closing CTA. Four generated illustrative photos cover strength, small-group, movement, and conditioning spaces. The static Figma design shows a partial next card, progress track, and arrow controls; a motion note specifies drag/swipe, snap transitions, image settling, no autoplay, and reduced-motion behavior. These images do not document verified club facilities. See [[../logs/2026-10-10-fitops-figma-landing-page|Figma landing page concept and motion handoff]].


Landing reorganization (2026-10-10): followed the user-requested Main → Facilities → Activities → Plans → Team → Start now order, using MeuFit Vigo as a visual/content-sequence reference. Added three photo-led activity cards, fictional Base/Complete/Training Plus comparisons without invented pricing, a generated three-coach portrait, and a full-photo closing invitation. Three new generated images were placed into Figma; existing photographic assets were reused. Reusable Activity Card and Standard/Emphasized Plan Card components use existing Practice tokens and styles. Archived earlier intermediary sections beside the artboard. Reviewed the 1440 × 5014 composition and corrected final-heading contrast plus the missing hero label. No application code, routes, GitHub issue status, or deployment changed; brand approval, mobile composition, and actual motion implementation remain outstanding.


Living Figma follow-up (2026-10-10): inspected MeuFit's moving outlined text and individual staff cards. Replaced the group portrait with three generated fictional coach profiles (Maya, Jordan, Lena) in a reusable Staff Card carousel. Added moving marquees and progressive word reveal to the headline; Facilities, Activities, and Staff have horizontal overflow plus six native SCROLL_TO arrow reactions (560 ms). The landing is 1440 × 5478. Native timelines now animate the visual treatment, with a separate 10-second motion study (`7160:96`) exported as MP4 and reviewed at six phases. Fixed headline spacing, portrait crops, and marquee clipping. The preview is time-based; real scroll binding, continuous loops/pause, interaction-driven progress sync, parallax, and reduced-motion behavior remain web handoff. Application code, issue/sprint status, and deployment were unchanged.

## First landing implementation (2026-10-11)

The user authorized the first Figma-to-web slice: shared navigation/buttons/hero in Storybook and Next.js. ADR 019 establishes the component-review workflow. Local builds, lint/typecheck, audit, UX sync and focused Chromium desktop/mobile/axe/reduced-motion checks pass. Other landing sections and their motion are pending; mobile implementation is an adaptation, not an approved Figma composition. Docker's Linux engine was unavailable during UI review; no database or deployment changed. See [[../logs/2026-10-11-landing-storybook-first-section|session record]] and [implementation evidence](../../../docs/design/landing-implementation.md). Sprint 7 remains complete; this work has no claimed new sprint assignment.

## Landing viewport and complete Storybook preview (2026-10-11)

The user's follow-up removes the hero badge and replaces fixed artboard dimensions with viewport height and fluid gutters in production. Seven explicitly requested Luna agents mapped the remaining sections into shared components and individual stories; a composed Storybook preview contains the complete landing. Parent reviewed source and captures at 1440, 390 and 320 px, checked a 2552 px viewport, corrected contrast and mobile overlaps, and verified keyboard/carousels/motion pause/reduced motion. Builds, lint/typecheck, audit and UX sync pass. The lower production page remains its previous implementation pending integration; full-page performance and mobile Figma approval remain outstanding. No GitHub status, completed sprint, DB or deployment changed. See [[../logs/2026-10-11-landing-viewport-and-storybook-sections]].

Subsequent integration (2026-10-11): user authorized implementation of all reviewed sections in Home. Production and Storybook share `LandingContent`, with the landing footer and preserved signed-out notice. Four browser tests, complete-page axe/overflow/carousel/pause checks at four sizes, actual destination navigation, visual desktop/mobile review, builds, lint/typecheck and UX sync pass. Live discovery remains on `/programs` and `/schedule`. Performance budgets/mobile Figma approval remain pending; GitHub/sprint/DB/deployment unchanged. See [[../logs/2026-10-11-complete-landing-integration]].

Scroll motion follow-up (2026-10-11): user requested blur-to-sharp headings while scrolling. Five sections now use shared ScrollHeading, replacing timed team reveal with reversible scroll-progress focus. Builds, lint/typecheck, UX sync and six focused browser tests pass; reduced-motion/no-JavaScript fallback verified. No GitHub/sprint/deployment change. See [[../logs/2026-10-11-scroll-heading-focus]].

Landing label cleanup (2026-10-11): removed user-identified decorative micro-labels and repeated concept notes throughout shared landing components; adjusted spacing/control alignment. Existing builds and six UI tests pass. GitHub/sprint/data/deployment unchanged. See [[../logs/2026-10-11-landing-label-cleanup]].
