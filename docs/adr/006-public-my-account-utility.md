# ADR 006 Add a secondary My Account utility to the public header

## Status

Accepted

## Context

The public site and member workspace must remain separate. However, hiding the direct Member Portal entry until a visitor reaches Join makes the existing-member path unnecessarily difficult to find. Mature fitness brands commonly present account access as a lower-emphasis utility beside a more prominent join action.

## Decision

- Every public-header variant exposes `My Account` as a secondary utility that opens `/portal/login`.
- `Join Now` remains the single primary public conversion CTA and opens `/join`.
- `/join` remains the only route that leads a new visitor to `/register`; registration requires a selected fictional plan, consent, and validation. It never collects payment or card data.
- `/portal/login` handles existing members, demo personas, and protected-route redirects. It restores only a validated internal `returnTo` value and can direct a successfully authenticated account without an active demo membership to `/join`.
- Footer and system routes remain separate from the header navigation. Public session details remain browsable; an unauthenticated booking action preserves intent and begins at Join.

## Consequences

- Existing members can recognize a familiar account entry without competing with conversion.
- The marketing site, fictional enrollment flow, and authenticated workspaces preserve distinct navigation shells and responsibilities.
- Labels must be consistent across draw.io, Mermaid, Figma wireframes, requirements, and implementation: `My Account` is not a generic global `Sign In`; `Join Now` is the primary CTA.

## Supersedes

This refines ADR 005 only where it restricted the Member Portal to supporting/footer contexts. ADR 005 remains accepted for the separate public schedule, direct portal route, member dashboard, and validated `returnTo` rules.
