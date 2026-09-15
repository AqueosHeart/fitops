import { execSync } from 'child_process';

const issues = [
  {
    title: '[DOCS] Define Product Requirements and Core Booking Rules',
    body: `## Summary
Establish the core functional requirements, user personas, MVP boundaries, and business rules for Practice Athletic Club.

## Acceptance Criteria
- [x] Document visitor, member, trainer, and admin personas.
- [x] Specify transactional booking, capacity, overlap, cutoff, and FIFO waitlist rules.
- [x] Define explicit exclusions (no real payments, single gym branch, fictional demo data only).
- [x] Document in \`docs/product-requirements.md\`.`,
    labels: ['sprint:sprint-0', 'phase:2-requirements', 'type:documentation', 'priority:p0']
  },
  {
    title: '[ARCH] Modular Monolith Architecture & Technology Selection',
    body: `## Summary
Define the modular monolith system architecture, domain boundary separation, and technology stack.

## Acceptance Criteria
- [x] Select Next.js (App Router), TypeScript strict mode, PostgreSQL, Prisma, Auth.js, and Zod.
- [x] Select testing stack: Vitest, React Testing Library, Playwright.
- [x] Specify domain logic isolation independent of UI/HTTP/ORM adapters.
- [x] Document in \`docs/architecture.md\`.`,
    labels: ['sprint:sprint-0', 'phase:1-planning', 'type:architecture', 'priority:p0']
  },
  {
    title: '[BRAND] Practice Athletic Club Brand Identity & Design System Guidelines',
    body: `## Summary
Codify the strategic positioning, offer taxonomy, voice rules, vector logo lockups, accessible color tokens, and Mona Sans hierarchy.

## Acceptance Criteria
- [x] Define audience tension, positioning statement, and 3 explicit brand exclusions.
- [x] Define program taxonomy: Strength, Pace, Reset, Open Floor.
- [x] Produce primary stacked, inverse, horizontal, and compact vector logo marks.
- [x] Document WCAG AA/AAA compliant color palette and Mona Sans type scale in \`docs/brand/brand-identity.md\`.
- [x] Generate 8 vector presentation slides in \`docs/brand/figma/\`.`,
    labels: ['sprint:sprint-0', 'phase:1-planning', 'type:design', 'priority:p1']
  },
  {
    title: '[DATA] Conceptual Data Model & Entity Relationships (DBML)',
    body: `## Summary
Design the conceptual database schema modeling users, memberships, classes, schedules, bookings, and waitlists.

## Acceptance Criteria
- [x] Define entity models, primary/foreign keys, uniqueness constraints, and referential actions.
- [x] Model 1-to-many relationship between ClassSession, Bookings, and Waitlist.
- [x] Store conceptual schema in \`docs/database/fitops.dbml\`.`,
    labels: ['sprint:sprint-0', 'phase:2-requirements', 'type:architecture', 'priority:p0']
  },
  {
    title: '[API] Initial REST Contract & Response Shapes',
    body: `## Summary
Define the REST API contract for class discovery, booking reservations, cancellations, and administrative schedule operations.

## Acceptance Criteria
- [x] Document endpoints for \`/api/classes\`, \`/api/bookings\`, \`/api/waitlist\`.
- [x] Define standard JSON error shapes and HTTP status code conventions.
- [x] Document in \`docs/api.md\`.`,
    labels: ['sprint:sprint-0', 'phase:2-requirements', 'type:architecture', 'priority:p1']
  },
  {
    title: '[DESIGN] Low-Fidelity Desktop & Mobile Booking Flow Wireframes',
    body: `## Summary
Produce low-fidelity wireframes in Figma covering the critical member booking journey, full-class waitlist queue, and cancellation state.

## Acceptance Criteria
- [ ] Wireframe schedule filter bar (date, program, time).
- [ ] Wireframe session details modal with real-time capacity and coach info.
- [ ] Wireframe deterministic booking confirmation and waitlist state.
- [ ] Wireframe cancellation modal and toast feedback.
- [ ] Export approved frames to \`docs/design/\`.`,
    labels: ['sprint:sprint-1', 'phase:3-design', 'type:design', 'priority:p0']
  },
  {
    title: '[ARCH] Domain Boundary & Use-Case Specification',
    body: `## Summary
Design pure domain services and use cases isolating booking logic and capacity validation from framework code.

## Acceptance Criteria
- [ ] Specify \`BookSessionUseCase\` with capacity and overlap guards.
- [ ] Specify \`CancelBookingUseCase\` with atomic waitlist promotion transaction.
- [ ] Define repository interfaces for persistence inversion.`,
    labels: ['sprint:sprint-1', 'phase:3-design', 'type:architecture', 'priority:p0']
  },
  {
    title: '[DATA] Physical Database Schema & Migration Strategy (Prisma)',
    body: `## Summary
Translate the conceptual DBML model into a production-ready Prisma schema with migration and seed strategy.

## Acceptance Criteria
- [ ] Write \`prisma/schema.prisma\` with indexes, unique constraints, and enum types.
- [ ] Define transaction boundaries for concurrency safety on spot promotion.
- [ ] Prepare deterministic, privacy-safe fictional seed dataset.`,
    labels: ['sprint:sprint-1', 'phase:3-design', 'type:architecture', 'priority:p0']
  },
  {
    title: '[SEC] Threat Model & Server-Side Access Control Specification',
    body: `## Summary
Perform a threat modeling review covering authentication, role-based authorization (Member vs Admin), input sanitization, and demo data safety.

## Acceptance Criteria
- [ ] Threat model API endpoints against horizontal privilege escalation (IDOR).
- [ ] Specify Zod schemas for all client payloads.
- [ ] Document in \`docs/adr/\`.`,
    labels: ['sprint:sprint-1', 'phase:3-design', 'type:architecture', 'priority:p1']
  }
];

console.log('Creating GitHub issues for AqueosHeart/fitops...');

for (const issue of issues) {
  const labelFlags = issue.labels.map(l => `--label "${l}"`).join(' ');
  const cmd = `gh issue create --repo AqueosHeart/fitops --title "${issue.title}" --body "${issue.body.replace(/"/g, '\\"')}" ${labelFlags}`;
  try {
    const out = execSync(cmd, { encoding: 'utf8' });
    console.log(`Created: ${issue.title} -> ${out.trim()}`);
  } catch (err) {
    console.error(`Failed to create ${issue.title}:`, err.message);
  }
}
