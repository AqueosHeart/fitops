# ADR 019 Use Storybook alongside the Next.js landing

## Status

Accepted on 2026-10-11 after the user agreed to the proposed first slice: Storybook, shared navigation/buttons/hero, and immediate integration into Next.js.

## Context

The Figma landing has a desktop composition and motion studies. Its web implementation needs both isolated component review and real-page validation of scroll, navigation, imagery, and performance. FitOps already uses Next.js App Router and React; business rules and server adapters must remain independent of this visual workflow.

## Decision

1. Use Storybook 10.6.1 with `@storybook/nextjs-vite` and Vite 8.3.4 as local development tools. Keep their configuration under `web/.storybook`; generated output is ignored.
2. Stories import the same React components and CSS as Next.js. Do not maintain separate production and story implementations.
3. Start with `ActionLink`, `LandingHeader`, and `LandingHero`. Reuse the existing button base and public shell; keep the landing palette/font scoped so protected workspaces retain their presentation.
4. Use local Figma assets and self-host Mona Sans with its OFL license. Do not reference expiring Figma URLs in application code.
5. Prefer CSS for simple entrance/hover/parallax effects. Gate motion with `prefers-reduced-motion`; CSS scroll-timeline support is progressive enhancement, with a static fallback.
6. Keep current destinations: Facilities → `/#facilities`, Activities → `/#programs`, Plans → `/pricing`, Team → `/about`, My Account → `/portal/login`, Join now → `/join`. This first slice does not introduce new routes, anchors, or a team section. Reconcile future landing navigation with draw.io before changing flows.
7. Validate components in Storybook and the real Next.js page. Storybook navigation uses router mocks; production routing and full-page scroll must be checked in Next.js.

## Consequences

There is an additional local toolchain and dependency audit/build gate. Storybook does not prove server behavior or production performance. The remaining landing sections, carousel/marquee/word-reveal motion and mobile Figma composition remain separate work. This implementation does not approve the exploratory brand or complete release Issue #14.
