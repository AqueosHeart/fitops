# Practice Athletic Club Master Toolkit

This is the existing local Figma development plugin for FitOps. Its interface
contains three actions:

1. Display the draw.io source-of-truth reminder.
2. Transform the brand-guidelines template.
3. Build the Issue #6 low-fidelity desktop and mobile wireframes.

The wireframe action translates the canonical architecture from
`second-brain/wiki/design/FitOps User Flows.drawio` into a new versioned Figma
pages. It produces 19 desktop frames and 17 Android frames at 390 px, arranged
as desktop/mobile cascades for Public, Legal, and Miscellaneous; Landing;
Public Schedule; Join; Member Portal; Member Workspace; Booking; Waitlist;
Cancellation; Trainer; and Administrator modules. The
output separates public discovery, fictional membership join, and protected
member or staff workspaces. The public landing header uses `Join now`, not Sign
In. Plan selection is explicitly fictional and no payment is collected. It uses
fictional data and neutral low-fidelity styling; it is not brand
approval. It avoids invalid nested-button reactions and does not place the
public Schedule underneath the Landing module.

The complete landing pair includes public navigation, hero, activity discovery,
services, facilities, pricing, team, contact, final CTA, and a legal/navigation
footer. The supplied MeuFIT site informed this information-architecture scope,
but this plugin uses original copy, fictional data, and neutral wireframe
placeholders rather than its assets or design.

Public Schedule is a separate desktop and Android module, not a state nested
under Landing. It supports browsing and class-detail discovery; booking belongs
to the protected Member Workspace after Join or Portal Login.

The generator re-parents its temporary frames from the current page into the
module pages. It does not create or remove a staging page.

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

`FitOps User Flows.drawio` is the editable UX source of truth. Update it before
Mermaid or Figma, run `node scripts/validate-ux-sync.mjs`, then open the
duplicated WebbyFrames kit in Figma Desktop and run **Practice Athletic Club
Master Toolkit** from **Plugins > Development**. Select **Build Low-Fi
Wireframes**. The action never overwrites an earlier wireframe page.

The generated `00 Public, Legal, and Miscellaneous` module maps every public
route and landing anchor, including Pricing, About Us, Terms, Privacy, Liability
Waiver, Cookie Preferences, and Not Found (`/404`).
