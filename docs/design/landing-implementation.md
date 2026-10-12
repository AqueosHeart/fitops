# Landing implementation and Storybook review

Latest hero motion (2026-10-11): user's MeuFit reference and screenshots inform a staggered blur-to-sharp entrance for `Progress is a practice.` Four word spans animate for 850 ms with delays 100/240/380/520 ms; description follows at 500 ms, while buttons slide at 700 ms without fading. CSS runs once per page load/refresh, retains semantic heading text, and is absent under reduced motion. No external assets or animation dependency were added. Five focused Chromium tests include deterministic animation-phase comparison, refresh replay and reduced-motion fallback; builds/lint/typecheck/UX sync pass. Desktop phases were visually inspected. This is a matching visual treatment, not a claim to reproduce MeuFit's exact timing or implementation.

The first Figma-to-code slice implements navigation, action links, and the hero from [Figma node 7120:5](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7120-5). [ADR 019](../adr/019-storybook-and-shared-landing-components.md) records the shared component workflow.

From `web/`:

```powershell
npm run storybook
npm run build-storybook
npm run build
npm run start -- --hostname 127.0.0.1
npx playwright test tests/e2e/landing-first-section.spec.ts
$env:FITOPS_STORYBOOK_URL = 'http://127.0.0.1:6006'
npx playwright test tests/e2e/landing-stories.spec.ts
```

Storybook runs on loopback port 6006. `Landing/First section` contains Hero, Navigation, NavigationAndHero, and Actions stories. Resize the preview for responsive review; use the accessibility panel for isolated checks. The composed story's router is mocked, so click destinations must also be checked in the real app on port 3000. The production page uses `PublicLayout landing`; other public and protected shells keep their current header.

The mobile layout is an implementation adaptation at 390 px, not an approved Figma mobile design. At narrow widths, a native disclosure exposes navigation and My Account while Join now remains visible. Motion consists of a 460 ms entrance, button hover transitions, and a 70 px CSS scroll-linked photo drift where supported. Reduced motion disables these effects; unsupported scroll timelines retain the static photo.

## Assets and typography

The original fictional editorial photograph from Figma is compressed into `web/public/images/landing/hero.webp` (1672 × 941, 162,976 bytes). The wordmark circle is the original 34 × 34 Figma SVG; its P remains live text as designed. Files are local and are used in their respective photo/wordmark slots. The Mona Sans Latin variable font comes from pinned `@fontsource-variable/mona-sans` 5.3.0, copied to `web/public/fonts/mona-sans-latin.woff2` with its OFL license. If updating that dependency, explicitly refresh the copied font and license.

## Verification boundary

2026-10-11: production Next.js and Storybook builds, TypeScript, lint, UX structural synchronization, and full dependency audit passed. Chromium checked desktop/mobile links, loaded hero image, native mobile disclosure, no horizontal overflow, zero axe violations in the first section, no runtime exceptions, and reduced-motion styles. Desktop 1440 × 960 and mobile 390 × 844 renders were inspected against the desktop Figma target and for mobile fit. This is first-section evidence; the lower page still uses the existing sections. Full landing performance budgets and remaining Figma animations have not been revalidated or implemented.

## Viewport correction and complete preview

The subsequent user request overrides the fixed desktop artboard sizing: hero `min-height: 100svh`, fluid horizontal gutters, top-aligned photo crop, and complete removal of the green identity badge. At 1440 × 960, 390 × 844 and 2552 × 957, the hero occupies the first viewport and lower sections begin after scrolling.

Seven user-requested `gpt-6-luna` agents implemented principles, facilities, activities, plans, team, closing invitation and footer. Each has an individual story; `Landing/Complete preview` (`landing-complete-preview--full-page`) composes them with the shared header/hero. These lower components are currently Storybook previews; the production page retains its prior lower sections. Storybook mocks Next navigation, so full destination journeys remain a production-integration check.

Original photos from the existing Figma landing are stored locally as WebP quality 88: facilities (four 1448 × 1086 photos), activities (two 1122 × 1402 portraits and one 1448 × 1086 landscape), and team (three 1122 × 1402 portraits). Closing reuses the strength-floor photo. Relevant source nodes include principles 7120:29, facilities 7143:24, plans 7151:117, team 7151:165, closing 7120:107 and footer 7120:113 in the same Figma file. Imagery/coaches remain illustrative and fictional; plan prices/inclusions are undefined and links use existing plan codes.

Native horizontal carousels support touch, keyboard focus, arrows, resize updates and disabled bounds. Marquees include pause controls, offscreen/document-visibility suspension and reduced-motion fallbacks. Team words reveal on entry; this is an application adaptation of timeline motion, not a claim of exact Figma scroll binding. Parent review corrected initial title contrast, mobile decoration overlap, narrow controls and static principle visibility.

Final local verification: Next.js/Storybook builds, lint/typecheck, audit (zero vulnerabilities), UX sync, and two focused Chromium tests passed. Composed axe and document-overflow checks cover 1440 × 960, 390 × 844, 320 × 844 and 2552 × 957; keyboard/arrow movement and all four motion-pause controls were exercised. Captures were inspected at desktop and mobile. Authenticated DB journeys and full-page performance budgets were not rerun. The unavailable local DB affects the existing production discovery sections; this work does not change its data or deployment.

## Complete homepage integration (2026-10-11)

After the user's explicit integration request, Home and Storybook now import `LandingContent`, sharing the complete section order. `PublicLayout landing` uses the reviewed landing footer; other pages retain their existing shell. The signed-out notice remains. The previous homepage catalog/session widgets are replaced by the reviewed editorial composition, with live discovery still available via `/programs` and `/schedule`. No server/domain/data behavior changed.

Next.js and Storybook builds, lint, TypeScript and structural UX sync pass. Four Chromium tests cover the first viewport, complete production page, complete Storybook preview and actual Next.js navigation. Full-page axe/overflow checks cover 1440, 390, 320 and 2552 px widths; carousel arrows/keyboard and all pause controls pass. Desktop/mobile production captures were inspected. Plan CTA reaches `/join?plan=training_plus`; schedule and privacy links, Facilities anchor, one header/footer and non-landing shell were verified. DB-backed enrollment/booking and performance budgets were not rerun; this is local integration evidence, not deployment evidence.

## Scroll-driven heading focus (2026-10-11)

Shared ScrollHeading controls the five section titles, replacing the team timeline reveal. Words sharpen progressively as heading top moves from 90% to 60% of viewport height and blur again on reverse scroll. requestAnimationFrame batches passive scroll/resize updates; all listeners and pending frames are cleaned up. No opacity fade; text/heading semantics and line breaks remain. Reduced motion and no JavaScript render clear text immediately. Builds, lint/typecheck, UX sync and six Chromium tests pass, including all five headings at desktop/mobile, scroll reversal and reduced motion. Intermediate/final captures and no-JavaScript output reviewed. No new dependency, route/data change or performance-budget claim.
