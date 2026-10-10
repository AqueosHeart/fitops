# ADR 018 Use Figma for FitOps visual design and components

## Status

Accepted on 2026-10-10. Supersedes ADR 013's visual-tool decision. The previous Penpot work remains historical evidence; it is no longer the active design source. ADR 017 remains the Prisma Studio decision.

## Context

ADR 013 moved visual review from Figma to Penpot. The user has now chosen Figma as the active FitOps design environment. The user-linked Figma file `FitOpsWireframing` contains AARC reference pages and is being extended with separate FitOps foundations and component pages. The Practice Athletic Club branding reference is a separate Figma file.

The existing Penpot wireframes are not directly transferred by the connected Figma tools. Their UX source remains in the repository: the editable draw.io flows, the Page 08 scenario inventory, and the local wireframe generator and content definitions. Recovery should be based on these sources and must not introduce new routes, states, or unsupported behavior.

## Decision

1. Figma is the active visual-design, component-library, and future prototype workspace for FitOps. The current working file is [FitOpsWireframing](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7110-73).
2. The linked branding reference is [Practice Athletic Club brand guidelines](https://www.figma.com/design/tOe3cyDw9VLbHhgYOC3Nnn/Branding-Guidelines-Presentation-Template--Community-?m=auto&t=t6aPLJ1Mqct9jYKB-6). The Figma FitOps foundations and components are exploratory and do not approve the brand or synchronize application CSS.
3. New FitOps assets use distinct `FitOps · Foundations` and `FitOps · Components` pages. Existing AARC pages are preserved as reference and are not FitOps product specifications.
4. draw.io remains the editable source of truth for UX navigation, routes, and flow rules. Mermaid and Figma wireframes are derived views; neither may add an unmapped route, screen, state, or capability.
5. The prior 20-page Penpot wireframe set is retained as historical reference. It is not the active source. Its 163 scenario definitions per device remain recoverable from repository sources; rebuilding or importing them into Figma is outstanding and requires a route/state sync and visual review.
6. Issue #6's closure records the completed Penpot-era review only. This decision does not claim that the Figma wireframe inventory has been rebuilt or that its visual-review gate has passed.

## Consequences

- Repository workflow, UX notes, and current project facts identify Figma as the active visual-design tool.
- Wireframe recovery proceeds from draw.io and the repository's scenario/generator sources; the Penpot canvas is not assumed to be directly importable.
- The AARC pages and previous Penpot boards remain available as references, with their ownership and historical status clearly labeled.
- No application code, route, or product behavior changes are authorized by this visual-tool decision.

## Verification gate

Before calling a Figma wireframe migration complete, run `node scripts/validate-ux-sync.mjs`, compare the Figma page and scenario inventory against draw.io Page 08 and current requirements, then inspect representative public, booking, waitlist, cancellation, trainer, and administrator desktop/mobile screens. Do not reuse the AARC content as FitOps copy or behavior.
