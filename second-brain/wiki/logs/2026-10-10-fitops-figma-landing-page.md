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
- Final crop pass: made the club-story coaching photo 420 × 280 to retain both people’s faces, expanded the story section, and shifted the closing CTA/footer down to preserve section spacing. The desktop artboard is now 1440 × 3887.
- Hero contrast/button pass: increased the dark ink overlay and strengthened the left-side gradient fade, preserving the photograph and visible hero copy. Replaced the `Explore programs` text link with an instance of the FitOps Outline / Large button, styled transparent with white text and border to suit the dark image. Restored the lime hero label and two bottom hero cues after detecting their absence in the render, then reviewed the full hero crop.
- Added `07 · Club spaces / Photo carousel` below the club story and before the closing CTA. Four generated illustrative Figma-only photos show strength, small-group, movement, and conditioning spaces. The layout has three full 360 px cards and a 108 px peek of the fourth, image overlays/captions, progress track, and previous/next arrows. The CTA and footer now follow the section; the desktop page is 1440 × 4647.
- Added facility motion handoff: reveal on entry, drag/swipe or arrows, one-card snap with a 560 ms eased transition and restrained image settle, progress sync, no autoplay, and instant snapping for reduced-motion. The Figma page is a static design; these behaviors are specified for later web work.


## Landing sequence refinement

- User requested Main → Facilities → Activities → Plans → Team → Start now and supplied [MeuFit Vigo](https://www.meufit.gal/centros/meufit-vigo) as reference. Browsed the source to examine its facilities, activity photography, tariff comparison, team, and final invitation. Retained Practice identity and current fictional catalog, without importing MeuFit pricing or staff/amenity claims.
- Reordered the desktop landing accordingly; principles strip remains part of the Main composition. Archived the original introduction, featured program, schedule preview, and club story at x3000 in the same Figma page. Artboard now 1440 × 5014.
- Added Activity Card component `7151:94` with three instances (Strength Foundations, Small-group training, Movement & mobility), and Plan Card set `7151:124` with Standard/Emphasized presentations and three catalog-name instances. Existing buttons, Practice colors/spacing variables, Mona Sans typography, and text styles are reused. Master components sit outside the review artboard.
- Generated three original images with the built-in ImageGen tool: coached goblet squat, seated mobility, and a diverse three-coach editorial portrait. Placed as editable image fills in activity/team nodes. Reused existing small-group and strength-floor imagery; active landing has ten photographic fills. Images illustrate the concept rather than real club personnel or inventory.
- Header links now read Facilities, Activities, Plans, Team; hero CTAs read Explore activities and Explore the club. Closing CTA reads Start now and appears after Team.
- Updated motion handoff for the sequence, activity hover/reveal image settling, and team parallax with reduced-motion fallback. Actual interactions remain for later implementation.
- Reviewed full-page render: corrected closing-heading contrast after moving it onto a photo and restored the missing lime hero badge plus scroll cue. Final screenshot confirms section order, readable cards/plan controls, team photo, and final invitation. All text families are Mona Sans.

## Evidence and boundaries
- Figma node: [Landing / Desktop / Full page](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7120-4); motion note node `7120:128`.
- Reviewed the hero, featured program, club-story, and facilities renders. Moved facilities support copy below/left of the large outlined `SPACES` headline after the first render showed an overlap; final render confirms separation, legible captions, clear controls, and the visible next-card peek. Corrected bound-overlay opacity so the hero photograph remains visible beneath the typography. Facility photos are illustrative concept images, not evidence of actual amenities.
- The copy and public navigation follow `web/app/page.tsx`, `web/components/site-shell.tsx`, current public-route rules, and the fiction-only seed catalog. Sample session card data is labeled; app dates/availability remain dynamic.
- Brand values remain exploratory and unapproved. This Figma concept does not modify code or approve Issue #6's historical wireframe evidence.

## Outstanding
Create a mobile composition and, separately, rebuild the full 163-per-device scenario set in Figma from draw.io and repository sources. Continuous parallax/reveal behavior requires later web implementation. No build or test run was requested or performed.


Living Figma follow-up (2026-10-10): inspected MeuFit's moving outlined text and individual staff cards. Replaced the group portrait with three generated fictional coach profiles (Maya, Jordan, Lena) in a reusable Staff Card carousel. Added moving marquees and progressive word reveal to the headline; Facilities, Activities, and Staff have horizontal overflow plus six native SCROLL_TO arrow reactions (560 ms). The landing is 1440 × 5478. Native timelines now animate the visual treatment, with a separate 10-second motion study (`7160:96`) exported as MP4 and reviewed at six phases. Fixed headline spacing, portrait crops, and marquee clipping. The preview is time-based; real scroll binding, continuous loops/pause, interaction-driven progress sync, parallax, and reduced-motion behavior remain web handoff. Application code, issue/sprint status, and deployment were unchanged.
