---
type: session-log
project: FitOps
date: 2026-09-17
status: complete
---

# User flows expansion: terms, privacy, security, and onboarding

## Goal

Review and complete platform user flows in `second-brain/wiki/design/FitOps User Flows.drawio` and its review hub `second-brain/wiki/design/FitOps User Flows.md`. Integrate essential fitness SaaS legal foundations (Terms of Service, Liability Waiver / Physical Readiness PAR-Q, Privacy Policy / Demo Data disclosures) and security controls (RBAC, CSRF token validation, brute-force rate-limiting, and session expiry intent recovery).

## Changes

- Researched fitness studio operational legal requirements and web application security architectures:
  - **Liability Waiver & Physical Readiness (PAR-Q):** Mandatory consent before any class booking is permitted.
  - **Terms of Service:** Studio etiquette, configured cancellation cutoff agreement, and waitlist auto-promotion consent.
  - **Privacy Policy & Demo Notice:** Disclosures on session cookie usage, zero real payment card processing, and fictional demo data sandboxing.
  - **Security Architecture:** Server-authoritative RBAC (`MEMBER`, `TRAINER`, `ADMIN`), double-submit CSRF cookie/header checks on mutations, sliding-window rate limiting on sensitive routes, and 401 session expiry modal preserving client intent.
- Upgraded `second-brain/wiki/design/FitOps User Flows.drawio` from 6 pages to 7 comprehensive pages:
  - `01 Sitemap`: Added Legal hub (`/terms`, `/privacy`, `/waiver`), Auth Hub (`/login`, `/register`, `/auth/forgot-password`), Member Security (`/profile/security`), and Overlays (Cookie banner, Waiver modal, Expiry modal).
  - `02 Booking and Waitlist`: Integrated Physical Readiness & Liability Waiver check gate, CSRF/Rate limit security check, session expiry (401) recovery, and booking terms cutoff agreement.
  - `03 Waitlist Management`: Added CSRF token and rate-limiting validation on waitlist actions to prevent queue tampering.
  - `04 Cancellation and Promotion`: Integrated server validation, CSRF/rate limit enforcement, and structured audit logging of cancellations and first-eligible FIFO promotions.
  - `05 Trainer Access`: Added server-side RBAC session inspection and 403 security audit logging.
  - `06 Administrator Operations`: Added RBAC gatekeeper, CSRF validation on create/edit mutations, and admin audit trail.
  - `07 Authentication, Security, and Onboarding` (NEW PAGE): Full visual flow for registration with mandatory terms/waiver checkboxes, sign-in with brute-force rate-limiting, 1-click portfolio demo persona fast-switcher (Alex, Marcus, Sarah), session lifecycle/expiry intent recovery, server RBAC, password recovery, and sign-out.
- Synchronized `second-brain/wiki/design/FitOps User Flows.md`:
  - Updated Sitemap and Booking Mermaid flowcharts with legal gates and security checkpoints.
  - Added new section `## Authentication, onboarding, and security` with complete Mermaid flowchart.
  - Added architectural specification section detailing Terms, Liability Waiver (PAR-Q), Privacy/Demo policies, and Security architecture.

## Evidence

- `second-brain/wiki/design/FitOps User Flows.drawio` parsed cleanly via Python `xml.etree.ElementTree` with 0 errors across all 7 diagrams.
- Total count: 223 vertices and 222 connectors (up from 113 vertices and 108 connectors).
- Visual palette strictly complies with Practice Athletic Club brand guidelines (Jet Black `#111310`, Lime `#C7F134`, Cream `#F2F0E8`, Slate `#5C6159`, Security Guard `#E1EAF5`/`#1E3A8A`, Note/Overlay `#FFFFFF`/`#8B5CF6`).
- `second-brain/CRITICAL_FACTS.md` updated to reflect the 7-page draw.io companion.

## Next safe action

Review and approve the expanded user flows and complete the remaining Sprint 0 exit items (Issue tracking and project board connection) before starting Sprint 1 low-fidelity wireframes.
