---
type: session-log
project: FitOps
date: 2026-09-15
status: complete
---

# Practice Athletic Club — Sitemap & User Flow Architecture Engine (Sprint 1, Issue #6)

## Objectives & Context
Establish the architectural foundations for **Sprint 1 (Phase 3: System & UX Design)** and **Issue #6 (`[DESIGN] Low-Fidelity Desktop & Mobile Booking Flow Wireframes`)** by generating a complete, verified Information Architecture (Sitemap) and 3 Critical User Flows in Figma using native template components.

## Delivered Artifacts & Architecture
1. **Dynamic Component-Scanning Engine**:
   - Integrated into [`scripts/figma-plugin/`](file:///c:/Users/SEBASTIAN/Documents/Gym/scripts/figma-plugin/) and compiled via [`scripts/compile-plugin.mjs`](file:///c:/Users/SEBASTIAN/Documents/Gym/scripts/compile-plugin.mjs).
   - Scans the `Components` page in Figma to discover template components/frames (Cards, Steps, Decisions, Modals, Badges) and instantiates them with authentic Practice Athletic Club text, routes, and tokens.
2. **Master Sitemap (Tree Architecture)**:
   - Built on the `Sitemap` page as a 2800 × 1800 tree diagram.
   - Root Node (`fitops.app /`) linked to 4 Tier-1 domains: Public Experience, Global Overlays, Member Experience, and Operations & Admin.
   - Orthogonal connector routing connecting parents to children.
3. **3 Multi-Branch Critical User Flows**:
   - Built on the `Userflow` page as a 3600 × 2600 board.
   - **Flow 01**: Class Discovery $\rightarrow$ Filter $\rightarrow$ Details Drawer $\rightarrow$ Auth Decision $\rightarrow$ Spots Decision $\rightarrow$ Branch A: Booked / Branch B: Waitlist #X.
   - **Flow 02**: Cancellation Trigger $\rightarrow$ 2h Cutoff Verification $\rightarrow$ Policy Dialog $\rightarrow$ Server Transaction $\rightarrow$ Waitlist Check $\rightarrow$ Auto-Promotion of #1.
   - **Flow 03**: Admin Sign-in $\rightarrow$ Operations Overview $\rightarrow$ Session Management $\rightarrow$ Roster Drawer $\rightarrow$ Capacity / Trainer Edit $\rightarrow$ Real-time Sync.

## Next Safe Action
Proceed with low-fidelity wireframe screen assembly in Figma (Desktop 1440px & Mobile 390px) matching the verified sitemap and user flow routes.
