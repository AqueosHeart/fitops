---
type: session-record
project: FitOps
date: 2026-10-10
---

# FitOps landing page concept in Figma

## Goal
Create the first professional landing-page design in the active FitOps Figma file, following the user's reference for a full-image hero and scroll-driven motion while retaining FitOps product and navigation rules.

## Work completed
- Added an editable `Landing / Desktop / Full page · 1440` artboard on `FitOps · Landing`.
- Hero uses the current fictional Practice homepage photo as a full-bleed image, with a dark overlay, overlaid copy, public navigation, and schedule CTA.
- Included brand-principle cards, the seeded Strength Foundations program, reusable available/full session-card instances with public `View session` actions, club-positioning section, schedule conversion CTA, and demo/legal footer.
- Reused FitOps button and session-card components. The AARC pages and the FitOps foundations/components pages remain separate.
- Added a separate scroll-motion handoff: clipped/overscanned image drifting ~70 px through the hero, 20 px reveal lift and 460 ms fade, 80 ms card stagger, fixed 3 px progress bar, and a reduced-motion fallback. This is a web implementation specification; Figma remains static for continuous scroll-linked parallax.
- A temporary Figma capture of the existing local page supplied the image fill. Its temporary capture frame and injected script were removed after the image was reused.
- Follow-up visual pass: replaced the hero with a generated editorial training image; added generated gym-interior and coach/member images to the featured program card and club-story section. Added a lime-backed, ink-text hero label reading `PRACTICE ATHLETIC CLUB / NEIGHBORHOOD TRAINING` and consistent lime dash markers for section eyebrows. The generated images were uploaded directly into Figma and are not application assets.

## Evidence and boundaries
- Figma node: [Landing / Desktop / Full page](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7120-4); motion note node `7120:128`.
- Reviewed the hero, featured program, and club-story renders after the image and label updates. Corrected bound-overlay opacity so the hero photograph remains visible beneath the typography.
- The copy and public navigation follow `web/app/page.tsx`, `web/components/site-shell.tsx`, current public-route rules, and the fiction-only seed catalog. Sample session card data is labeled; app dates/availability remain dynamic.
- Brand values remain exploratory and unapproved. This Figma concept does not modify code or approve Issue #6's historical wireframe evidence.

## Outstanding
Create a mobile composition and, separately, rebuild the full 163-per-device scenario set in Figma from draw.io and repository sources. Continuous parallax/reveal behavior requires later web implementation. No build or test run was requested or performed.
