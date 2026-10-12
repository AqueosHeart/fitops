# Landing implementation — first section

The first Figma-to-code slice implements navigation, action links, and the hero from [Figma node 7120:5](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7120-5). [ADR 019](../adr/019-storybook-and-shared-landing-components.md) records the shared component workflow.

From `web/`:

```powershell
npm run storybook
npm run build-storybook
npm run build
npm run start -- --hostname 127.0.0.1
npx playwright test tests/e2e/landing-first-section.spec.ts
```

Storybook runs on loopback port 6006. `Landing/First section` contains Hero, Navigation, NavigationAndHero, and Actions stories. Resize the preview for responsive review; use the accessibility panel for isolated checks. The composed story's router is mocked, so click destinations must also be checked in the real app on port 3000. The production page uses `PublicLayout landing`; other public and protected shells keep their current header.

The mobile layout is an implementation adaptation at 390 px, not an approved Figma mobile design. At narrow widths, a native disclosure exposes navigation and My Account while Join now remains visible. Motion consists of a 460 ms entrance, button hover transitions, and a 70 px CSS scroll-linked photo drift where supported. Reduced motion disables these effects; unsupported scroll timelines retain the static photo.

## Assets and typography

The original fictional editorial photograph from Figma is compressed into `web/public/images/landing/hero.webp` (1672 × 941, 162,976 bytes). The wordmark circle is the original 34 × 34 Figma SVG; its P remains live text as designed. Files are local and are used in their respective photo/wordmark slots. The Mona Sans Latin variable font comes from pinned `@fontsource-variable/mona-sans` 5.3.0, copied to `web/public/fonts/mona-sans-latin.woff2` with its OFL license. If updating that dependency, explicitly refresh the copied font and license.

## Verification boundary

2026-10-11: production Next.js and Storybook builds, TypeScript, lint, UX structural synchronization, and full dependency audit passed. Chromium checked desktop/mobile links, loaded hero image, native mobile disclosure, no horizontal overflow, zero axe violations in the first section, no runtime exceptions, and reduced-motion styles. Desktop 1440 × 960 and mobile 390 × 844 renders were inspected against the desktop Figma target and for mobile fit. This is first-section evidence; the lower page still uses the existing sections. Full landing performance budgets and remaining Figma animations have not been revalidated or implemented.
