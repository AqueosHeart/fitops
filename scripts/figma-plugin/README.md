# Practice Athletic Club Master Toolkit

This is the existing local Figma development plugin for FitOps. Its interface
contains three actions:

1. Build sitemap and user-flow pages.
2. Transform the brand-guidelines template.
3. Build the Issue #6 low-fidelity desktop and mobile wireframes.

The wireframe action translates the canonical architecture from
`second-brain/wiki/design/FitOps User Flows.drawio` into a new versioned Figma
pages. It produces 15 desktop frames and 13 Android frames at 390 px, arranged
as desktop/mobile cascades for Landing, Schedule, Authentication, Booking,
Waitlist, My Bookings, Cancellation, Trainer, and Administrator modules. The
output uses fictional data and neutral low-fidelity styling; it is not brand
approval. It deliberately creates no prototype reactions, so all module pages
can be generated safely in one run.

## Build

The installed manifest continues to point to `code.js`. After editing either
source file, rebuild the entrypoint:

```powershell
node scripts/figma-plugin/build.mjs
node --check scripts/figma-plugin/code.js
```

- `brand-and-flows.js` contains the original toolkit behavior and message router.
- `wireframes.js` contains the low-fidelity screen generator.
- `code.js` is generated from both sources.

## Run the wireframes

Open the duplicated WebbyFrames kit in Figma Desktop, run **Practice Athletic
Club Master Toolkit** from **Plugins > Development**, and select **Build Low-Fi
Wireframes**. The action never overwrites an earlier wireframe page.
