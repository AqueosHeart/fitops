# ADR 005 Use a direct Member Portal and a member dashboard entry

## Status

Accepted

## Context

The original generated wireframes placed the public schedule (`D01`) beneath the Landing frame in the same Figma module. The public navigation was visually reused for schedule discovery, while the member workspace began with My bookings. This left no explicit portal entry or dashboard and made the product feel like one mixed site rather than a public site plus a member system.

## Decision

- Keep public Landing and public Schedule as separate Figma modules and routes. The public schedule supports discovery and class-detail viewing only.
- Use `/portal/login` as the direct, addressable Member Portal entry for existing members and demo personas. It is reachable after the Join decision and when an unauthenticated visitor requests a protected route.
- Use `/app` as the authenticated member dashboard. It presents next class, membership state, and quick actions before `/app/schedule`, `/app/bookings`, and `/app/profile/security`.
- Preserve only validated internal `returnTo` paths across Join and Portal Login. Public class browsing may initiate `intent=book`; an actual booking action remains inside the authenticated member workspace.
- Keep `Join now` as the sole primary public conversion CTA. The Member Portal is not a global public-navigation action, but remains directly addressable and may be linked in supporting/footer contexts.

## Consequences

- Public discovery and the member system have different route groups, navigation shells, and success criteria.
- Existing members can sign in directly without pretending to purchase a new membership.
- The dashboard prevents My bookings from becoming an accidental application home page.
- A later real-payment decision remains separate and requires its own requirements, security, provider, data, and compliance review.

## Supersedes

This ADR refines ADR 004's authentication route and member-workspace entry. ADR 004 remains accepted for the public, fictional Join, and protected-workspace separation.
