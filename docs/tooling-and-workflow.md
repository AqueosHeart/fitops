# FitOps Engineering Tooling and Workflow

## Decision summary

FitOps will keep project execution and engineering evidence close to the code. GitHub Projects will manage the sprint, GitHub Issues will hold backlog items and acceptance criteria, and pull requests will provide implementation and review history.

Design artifacts will use the format that best matches their purpose:

- Figma for FitOps foundations, components, wireframes, prototypes, and visual review
- draw.io for editable UX flow and sitemap diagrams, with Mermaid review exports stored in Markdown
- DBML for the reviewed conceptual database diagram
- Prisma schema and committed migrations for the executable database definition
- OpenAPI stored in the repository for the REST contract

## Scrum workspace

### System

Use one GitHub Project named `FitOps Delivery` connected to the FitOps repository.

This is a solo, Scrum-inspired workflow. It uses sprint goals, a backlog, reviews, and retrospectives without claiming that one developer reproduces every role and ceremony of a full Scrum team.

### Project views

Create these views:

1. `Current Sprint` as a board grouped by Status
2. `Product Backlog` as a table ordered by Priority
3. `SDLC Roadmap` as a roadmap grouped by SDLC Phase
4. `Bugs and Debt` as a filtered table

### Status values

- Backlog
- Ready
- In Progress
- In Review
- Blocked
- Done

### Required fields

- Sprint: Sprint 0 through Sprint 8
- SDLC Phase: 1 through 8
- Priority: P0, P1, P2, or P3
- Type: Feature, Bug, Architecture, Documentation, Test, or Maintenance
- Estimate: 1, 2, 3, 5, or 8 points
- Risk: Low, Medium, or High

### Work-item rules

- Each user story or engineering task is a GitHub Issue.
- Each issue states user value, acceptance criteria, failure states, dependencies, and test expectations.
- A pull request links its issue and describes how the result was verified.
- One issue should be small enough to finish and demonstrate during one sprint.
- An issue cannot move to Done until the Definition of Done in the delivery plan is satisfied.
- New ideas enter the backlog unless they address a security issue, data-loss risk, or blocking defect.

## UX and UI design

### System

Use the linked [FitOpsWireframing Figma file](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7110-73). It contains separate `FitOps · Foundations`, `FitOps · Components`, and [FitOps · Landing](https://www.figma.com/design/8O6NvazN4Alxk1G1TmRYoV/FitOpsWireframing?node-id=7120-4) pages. The FitOps foundations are exploratory and align to the user-linked [Practice Athletic Club brand guidelines](https://www.figma.com/design/tOe3cyDw9VLbHhgYOC3Nnn/Branding-Guidelines-Presentation-Template--Community-?m=auto&t=t6aPLJ1Mqct9jYKB-6). Existing AARC reference pages remain preserved and are not FitOps specifications. The landing page includes a separate scroll-motion handoff note; its Figma artwork is not itself a scroll-linked animation.

### Wireframe recovery

The former Penpot wireframe set is historical. Rebuild the active Figma wireframes from `second-brain/wiki/design/FitOps User Flows.drawio`, draw.io Page 08, and the repository's scenario/generator sources. Compare the output against the current requirements before presenting it as current. The Penpot canvas is not directly copied by the connected Figma tools.

### Repository evidence

Figma is the working visual-design environment, but important decisions must remain reviewable from the repository. `second-brain/wiki/design/FitOps User Flows.drawio` is the editable source of truth for UX navigation and flow architecture: change it before updating derived Mermaid exports or Figma wireframes. The derived work must preserve the approved public-discovery, Join, and protected-workspace boundary. Export approved review evidence into `docs/design/` when useful.

No screenshot is treated as a specification by itself. States, rules, and acceptance criteria remain in version-controlled documents and issues.

## Architecture and workflow diagrams

Use Mermaid diagrams directly inside Markdown files for:

- System context
- Container and module boundaries
- Critical user flows
- Request sequences
- Deployment topology
- Conceptual entity relationships when a compact diagram is sufficient

Mermaid text is version controlled, reviewable in pull requests, and rendered by GitHub. Diagram changes must accompany the code or contract change they explain.

## Database design

### Conceptual design

Use DBML stored at `docs/database/fitops.dbml` to design and review entities, keys, relationships, indexes, and referential actions. The same DBML may be opened in dbdiagram.io for interactive visualization.

The conceptual model answers:

- What information exists?
- How are entities related?
- Which relationships are optional or required?
- What uniqueness and lifecycle rules matter?

### Executable source of truth

Once database implementation begins, the authoritative physical definition is:

1. `prisma/schema.prisma`
2. The complete committed Prisma migration history
3. Explicit SQL included in reviewed migrations when Prisma syntax is insufficient

The live database, a screenshot, or an uncommitted diagram is never the source of truth.

### Change workflow

Every database change follows this sequence:

1. Link the change to a GitHub Issue and acceptance criteria.
2. Update the conceptual model when relationships or domain meaning change.
3. Update the Prisma schema.
4. Generate a migration in development.
5. Review the generated SQL and data-loss risk.
6. Run migration and repository integration tests.
7. Commit the schema and complete migration history together.
8. Update diagrams and documentation in the same pull request.
9. Apply pending migrations through the deployment workflow, never by editing production manually.

## REST API design

The API contract will live at `docs/openapi.yaml` once implementation starts. The human-readable decisions remain in `docs/api.md`.

OpenAPI is authoritative for paths, methods, parameters, request bodies, response shapes, and status codes. Domain rules remain authoritative in product requirements and domain tests.

## Lint and dependency audit

`web/eslint.config.mjs` uses ESLint flat config with direct, version-pinned core, TypeScript, React, React Hooks, JSX accessibility, and import rules. The Next-specific ESLint preset is intentionally omitted under [ADR 015](adr/015-replace-vulnerable-next-eslint-config.md) because its transitive dependency tree contains the unpatched `braces` stack-exhaustion advisory. Consequently, `@next/next/*` lint rules are not currently applied. Keep `npm run lint`, TypeScript, the production build, and the focused integration suites as separate verification gates; restore the Next preset only after a compatible, fully audited release exists and has passed the same gates.

## Decision ownership map

| Concern | Working tool | Repository source of truth |
|---|---|---|
| Sprint and backlog | GitHub Projects | GitHub Issues and linked pull requests |
| UX flow and navigation architecture | draw.io | `second-brain/wiki/design/FitOps User Flows.drawio` |
| UX visual design and prototypes | Figma | Approved boards derived from draw.io plus UX requirements |
| Architecture diagrams | Mermaid | Markdown files under `docs/` |
| Conceptual database model | dbdiagram.io or editor with DBML | `docs/database/fitops.dbml` |
| Physical database model | Prisma | `prisma/schema.prisma` and migrations |
| REST API | OpenAPI editor or code editor | `docs/openapi.yaml` |
| Architecture decisions | Markdown | `docs/adr/` |
| Application behavior | Local and deployed application | Code, tests, requirements, and migrations |

## Immediate Sprint 0 actions

1. Create the GitHub repository.
2. Create the `FitOps Delivery` GitHub Project and its fields and views.
3. Convert the existing Sprint 0 requirements into GitHub Issues.
4. Create the Figma file and low-fidelity pages.
5. Add the initial DBML file from the reviewed data model.
6. Review the Sprint 0 exit gate before beginning Sprint 1.
