# ADR 003 Use draw.io as the editable UX-flow source of truth

## Status

Accepted

## Context

The low-fidelity Figma landing wireframes gained public destinations for Services, Facilities, and Contact that were not represented in the editable UX sitemap. This caused two competing descriptions of the product navigation.

## Decision

- Treat `second-brain/wiki/design/FitOps User Flows.drawio` as the editable source of truth for UX navigation, screen inventory, and user-flow states.
- Update draw.io first for every UX add, deletion, or modification.
- Treat `docs/design/*.mmd` as derived, version-controlled Mermaid review views.
- Treat Figma wireframes and prototypes as derived visual artifacts. Regenerate or update them through the installed **Practice Athletic Club Master Toolkit** only after the draw.io change is reviewed.
- Run `node scripts/validate-ux-sync.mjs` before claiming the sitemap and Figma generator are aligned. The check covers every mapped route and landing anchor, including legal, cookie, recovery, and role-protected destinations, and rejects Spanish wireframe copy.

## Consequences

- A new UI page cannot be added only in Figma.
- Draw.io remains reviewable and editable inside the repository, while Mermaid remains available in Markdown and Figma remains the visual-prototyping workspace.
- The Mermaid sitemap, Figma generator, and generated Figma pages require a synchronization pass when the source changes.

## Supersedes

This ADR supersedes the UX-diagram ownership portion of ADR 002. ADR 002 remains accepted for Figma as the visual design and prototype environment.
