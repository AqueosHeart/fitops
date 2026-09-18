# FitOps Product Requirements

## Decision summary

The public-facing fictional gym is **Practice Athletic Club**. `FitOps` remains the repository and internal project codename.

The project will be a portfolio-grade full-stack product, not a static gym landing page. The first release will prove one complete business flow: a visitor discovers Practice Athletic Club, chooses a fictional membership plan through Join, creates or signs into a demo member account, books a class in the member workspace, and later cancels it while capacity and waitlist rules remain correct.

## Pre-build risk review

**Risk verdict:** Medium. The domain is understandable and suitable for a portfolio, but a generic design or oversized feature list would add little evidence beyond existing projects.

**Main assumption:** Recruiters will value the project only if the public demo exposes real business logic, tests, architectural decisions, and safe fictional data.

**Evidence to create first:** A clickable low-fidelity flow covering class discovery, booking, a full-class waitlist, and cancellation.

**Do next:** Design and validate the single member booking journey before building secondary pages.

**Delay:** Payments, native mobile apps, real email delivery, social features, workout tracking, multiple gym branches, and microservices.

## Users

### Visitor

Needs to understand the gym, programs, schedule, pricing concept, and next action without creating an account.

### Member

Needs to browse upcoming class sessions, see remaining capacity, book or cancel, join a waitlist, and review personal reservations.

### Trainer

Needs to see assigned sessions and attendee counts. Trainer editing is not required in the first release.

### Administrator

Needs to create and edit class sessions, assign trainers, set capacity, and see bookings and waitlist status.

## MVP scope

### Public experience

- Responsive landing page with a clear value proposition
- Programs and trainer summaries backed by seed data
- Upcoming class schedule preview
- Pricing presentation clearly labeled as fictional
- A public `Join now` call to action; the landing header must not expose a global Sign In action
- A `/join` decision page that offers fictional plan selection for a new demo member and an explicit “Already a member? Sign in” path
- Public schedule discovery with a context-preserving redirect to Join when an anonymous visitor wants to book
- Pricing presentation clearly marked fictional, with no payment, card, billing, or real-subscription collection

### Member experience

- Protected member workspace under `/app`, distinct from the marketing shell
- Direct existing-member access through the Member Portal at `/portal/login`, plus protected-route redirects
- Member dashboard at `/app` with next class, membership state, and quick actions before schedule and bookings
- Search and filter class sessions by date, program, trainer, and availability
- View session details and remaining capacity
- Book an available session
- Join the waitlist when a session is full
- Cancel a booking
- View upcoming bookings and waitlist positions

### Administrative experience

- Protected administrator route
- List class sessions and occupancy
- Create and edit a session
- Assign a trainer and capacity
- View booked and waitlisted members using fictional data

## Business rules

1. Only authenticated members with an active demo membership may book.
2. A member cannot hold two active bookings for the same session.
3. A member cannot book sessions whose times overlap.
4. Confirmed bookings cannot exceed session capacity.
5. When capacity is full, a member may join the waitlist once.
6. Waitlist order is first in, first out.
7. When a confirmed booking is cancelled, the first eligible waitlisted member is promoted in the same transaction.
8. Members cannot book or cancel a session after its configured cutoff.
9. Trainers and administrators cannot use member-only booking actions unless they also have a member profile.
10. All public demo data is fictional and all destructive administrative actions are limited to demo records.
11. Selecting a plan in `/join` is a fictional demo enrollment, not a purchase. The interface must state that no payment is collected.
12. Public discovery pages and protected workspaces use separate navigation shells. Public navigation does not include a global Sign In action.

## Success criteria

- A first-time visitor can understand the product and reach the schedule within 30 seconds.
- A demo member can book an available class and see the updated reservation.
- A full class places the member on a deterministic waitlist.
- Cancellation promotes the correct eligible member without exceeding capacity.
- Authorization prevents members from accessing administrative operations.
- Critical domain rules pass unit and integration tests.
- The deployed demo works on mobile and desktop with no private or production data.

## Out of scope for version one

- Real payments or subscriptions
- Production email or SMS
- Barcode or QR check-in
- Workout and health tracking
- Real-time chat
- Multi-tenant or multi-branch support
- Recommendation systems
- Native mobile applications
