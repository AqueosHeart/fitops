# FitOps SDLC and Sprint Delivery Plan

## Operating model

FitOps uses two complementary planning levels:

- The eight SDLC phases describe the complete product lifecycle and the evidence required to move forward.
- One-week sprints divide the work into small, reviewable increments with a demonstrable outcome.

The phases are not strict silos. Testing, security, documentation, and accessibility remain continuous responsibilities. A dedicated phase gives those concerns a final system-level gate.

## Sprint cadence

Each sprint lasts one week and includes:

1. Sprint planning with one clear goal
2. A prioritized set of backlog items
3. Daily written progress and blocker notes
4. Continuous implementation, review, and testing
5. A working demonstration
6. A short retrospective
7. Backlog refinement for the next sprint

Incomplete work returns to the backlog with its remaining acceptance criteria. It is never relabeled as complete.

## Phase 1 Initiation and Planning

### Purpose

Define why the product should exist, what portfolio gap it addresses, who will use it, and what constraints govern the work.

### Activities

- State the problem, target users, and product value
- Review demand, positioning, trust, and portfolio risk
- Define success measures and MVP boundaries
- Identify stakeholders, assumptions, constraints, and major risks
- Establish the decision log and working agreement
- Select the sprint, design, database-modeling, and API-contract tools

### Deliverables

- Product statement
- Pre-build risk review
- Initial scope and exclusions
- High-level roadmap
- Tool ownership and source-of-truth map

### Exit gate

The project has a defensible purpose and constrained MVP. Features without a clear user or portfolio benefit are delayed.

## Phase 2 Requirements Analysis

### Purpose

Translate the product idea into testable functional and non-functional requirements.

### Activities

- Define visitor, member, trainer, and administrator needs
- Write booking, capacity, cancellation, and waitlist rules
- Define authorization and demo-data constraints
- Capture loading, empty, error, and success behavior
- Write measurable acceptance criteria

### Deliverables

- Product requirements document
- Prioritized product backlog
- Business-rule examples
- Acceptance criteria

### Exit gate

Every MVP feature has a user, a reason, testable behavior, and a defined failure state.

## Phase 3 System and UX Design

### Purpose

Design the experience and technical system before implementation creates expensive constraints.

### Activities

- Produce low-fidelity desktop and mobile wireframes
- Validate the critical booking and cancellation journey
- Define domain modules and dependency rules
- Design the relational model and database constraints
- Define the REST API and error contract
- Record material architecture decisions
- Threat-model authentication, authorization, and demo data

### Deliverables

- Reviewed wireframes
- UX state inventory
- Architecture document
- Data model
- REST API contract
- Architecture decision records

### Exit gate

The critical journey is understandable without explanation, and the system can enforce its business rules without UI-only checks.

## Phase 4 Development

### Purpose

Implement the product in vertical slices that produce working behavior.

### Activities

- Establish the TypeScript repository, CI, and module boundaries
- Implement pure domain rules and application use cases
- Add PostgreSQL migrations, repositories, and fictional seed data
- Implement authentication, authorization, and REST handlers
- Build member and administrator interfaces
- Keep documentation synchronized with contract changes

### Deliverables

- Running application
- Versioned migrations
- Tested domain and application code
- Accessible responsive interfaces
- Updated technical documentation

### Exit gate

All MVP journeys work locally from a clean checkout using documented setup commands.

## Phase 5 Testing and Quality Assurance

### Purpose

Verify the integrated product against its requirements, risks, and quality attributes.

### Activities

- Run unit, integration, component, and end-to-end suites
- Test concurrent booking and transactional waitlist promotion
- Verify server-side authorization and input validation
- Audit keyboard use, focus, labels, contrast, and responsive layouts
- Check performance, error handling, log redaction, and secret hygiene
- Execute exploratory tests on mobile and desktop

### Deliverables

- Passing automated test report
- Requirements traceability checklist
- Accessibility and security findings
- Resolved defect list or explicitly accepted limitations

### Exit gate

Critical tests pass, no known high-severity defect remains, and every MVP requirement has evidence.

## Phase 6 Deployment and Release

### Purpose

Release a safe, reproducible public demonstration.

### Activities

- Provision the managed PostgreSQL demo database
- Apply migrations and fictional seed data safely
- Configure environment secrets outside source control
- Deploy the application
- Run smoke and end-to-end checks against production
- Confirm demo accounts, mobile behavior, and rollback steps

### Deliverables

- Public HTTPS demo
- Deployment and rollback instructions
- Verified production checklist
- Versioned release notes

### Exit gate

An external visitor can complete the documented journey, and the release can be reproduced or rolled back without private data.

## Phase 7 Operations and Maintenance

### Purpose

Demonstrate ownership after release rather than treating deployment as the finish line.

### Activities

- Monitor availability and unexpected failures
- Review dependency and security updates
- Triage defects and user feedback
- Protect database integrity and reset demo data deliberately
- Measure only real, privacy-safe product behavior
- Maintain documentation and tests with each change

### Deliverables

- Maintenance backlog
- Incident and decision notes when needed
- Dependency-update record
- Verified patch releases

### Exit gate

The demo remains available, safe, truthful, and maintainable with documented operational ownership.

## Phase 8 Evaluation and Retirement

### Purpose

Evaluate whether FitOps achieved its learning and portfolio objectives, then decide whether to evolve, preserve, replace, or retire it.

### Activities

- Compare results with the original success criteria
- Record technical and product lessons
- Review recruiter feedback and repository evidence
- Decide which version-two ideas are justified
- If retiring, archive safely, remove secrets and paid resources, and preserve a truthful case study

### Deliverables

- Project retrospective
- Portfolio case study
- Version-two decision or retirement plan
- Final architecture and demo status

### Exit gate

The next lifecycle decision is explicit and supported by evidence rather than unfinished work.

## Sprint roadmap

### Sprint 0 Product foundation

**SDLC phases:** 1 and 2

**Goal:** Agree on the product problem, users, MVP, rules, risks, acceptance criteria, and engineering tool ownership.

**Demo:** Walk through the prioritized backlog, tool ownership map, and concrete booking-rule examples.

### Sprint 1 UX and technical design

**SDLC phase:** 3

**Goal:** Complete low-fidelity critical-flow wireframes, architecture, data model, REST contract, and security review.

**Demo:** Follow a member from the landing page through booking, waitlisting, and cancellation on desktop and mobile.

### Sprint 2 Engineering foundation

**SDLC phase:** 4

**Goal:** Initialize Next.js, TypeScript strict mode, quality tooling, module boundaries, CI, environment validation, and the first automated test.

**Demo:** A clean checkout installs, builds, lints, and tests through documented commands.

### Sprint 3 Domain and database

**SDLC phase:** 4

**Goal:** Implement scheduling and booking rules, repository interfaces, PostgreSQL migrations, adapters, transactions, and seed data.

**Demo:** Automated examples prove capacity, duplicate, overlap, cutoff, cancellation, and waitlist promotion rules.

### Sprint 4 REST API and access control

**SDLC phase:** 4

**Goal:** Implement session, booking, cancellation, and waitlist endpoints with demo authentication and server-side authorization.

**Demo:** API tests exercise successful and rejected requests using member and administrator identities.

### Sprint 5 Member product slice

**SDLC phase:** 4

**Goal:** Build the landing page, schedule, session details, demo sign-in, and My bookings experience.

**Demo:** A member completes the critical journey on mobile and desktop, including failure states.

### Sprint 6 Administrator product slice

**SDLC phase:** 4

**Goal:** Build the operations overview, session management, and participant and waitlist views.

**Demo:** An administrator manages fictional sessions while domain rules and authorization remain enforced.

### Sprint 7 System quality

**SDLC phase:** 5

**Goal:** Complete E2E coverage, concurrency checks, accessibility review, security review, performance checks, and defect resolution.

**Demo:** Present the traceability checklist and execute the production-candidate test suite.

### Sprint 8 Release and portfolio evidence

**SDLC phases:** 6, 7, and the initial review from 8

**Goal:** Deploy, verify, document operations, and publish truthful portfolio evidence.

**Demo:** Complete the critical journey against the public URL and show the repository, CI result, architecture decisions, and case study.

## Testing strategy

- Unit tests verify domain invariants and use cases with in-memory repositories.
- Integration tests verify PostgreSQL repositories, constraints, transactions, and REST handlers.
- Component tests verify forms, filters, state transitions, and accessible interactions.
- End-to-end tests verify demo sign-in, booking, waitlisting, cancellation, promotion, and administrator authorization.
- Production smoke tests verify only safe demo operations after deployment.

## Definition of ready

A backlog item can enter a sprint only when:

- Its user and intended value are clear
- Acceptance criteria and failure states are defined
- Dependencies and required design decisions are identified
- It is small enough to complete and demonstrate within the sprint

## Definition of done

A backlog item is done only when:

- Acceptance criteria are met
- Tests appropriate to the risk pass
- Loading, empty, error, and success states are handled
- Authorization is enforced on the server
- Accessibility has been considered
- Documentation is updated when contracts or decisions change
- No secrets or personal data are committed
- The working result is demonstrated
- The production demo is verified after deployment when affected

## Change control

New ideas enter the product backlog instead of interrupting an active sprint unless they correct a security issue, data-loss risk, or blocking defect. Material architecture changes require a new ADR. Historical decisions remain unchanged and may be superseded by later ADRs.
