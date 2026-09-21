---
type: ux-flow-hub
project: FitOps
status: review-required
updated: 2026-09-21
---

# FitOps User Flows

This note is the Obsidian-readable review hub for the platform user flows, incorporating terms of service, gym liability waiver, privacy policies, demo data governance, security guardrails, and full authentication/onboarding lifecycles.

Open the native editable diagram: [[FitOps User Flows.drawio|FitOps User Flows.drawio]]. The native file now has nine pages: `00 Sitemap` contains 26 page URLs only; `01 Route & Access Architecture` preserves route/access context, explicitly typed UI/system states, and enrollment steps; Pages 02 through 07 retain the detailed flows; Page 08 specifies wireframe sections and scenarios. Landing anchors and the `/404` fallback belong to the architecture view, not the page-only sitemap. No routes or product capabilities were added.

## Native flow correction passes, 2026-09-21

The editable draw.io source was corrected before its Mermaid and Figma derivatives. The sitemap resolves a 70 px collision with the Legend card, maintains taxonomy compliance, and eliminates unauthenticated direct root edges to protected workspaces. The later access-boundary pass implements ADR 006: the public header now offers secondary `My Account` access for existing members and primary `Join Now` conversion; registration is reachable only after fictional-plan selection. Footer/system routes are grouped separately, and protected-route redirects preserve only validated internal `returnTo` state. The detailed flows include recovery for dismissed waivers, expired sessions, duplicate/conflict outcomes, retries, cancellation cutoffs, promotion visibility, forbidden staff access, failed administrator saves, registration consent, existing-email redirects, invalid credentials, and rate limits.

## Visual language and color legend

Every color in the diagrams has a precise architectural meaning derived from the Practice Athletic Club design system and application access model:

| Block Color & Styling | Category / Experience | Architectural Meaning & Scope |
| :--- | :--- | :--- |
| **Cream (`#F2F0E8`)** with Jet Black border | **Public & Legal Experience** | Unauthenticated visitor access: Home, Programs, Schedule, Pricing, Terms of Service, Privacy Policy, Liability Waiver. No credentials required. |
| **Sand (`#E2E0D8`)** with Jet Black border | **Member Space (Protected)** | Authenticated member workspace: `/app`, `/app/schedule`, `/app/bookings`, confirmed reservations, waitlist positions, and `/app/profile/security`. Requires a valid member session. |
| **Soft Blue (`#E1EAF5`)** with Navy border (`#1E3A8A`) | **Join, Auth & Security Hub** | Fictional plan selection, existing-member Sign In, registration, password recovery, CSRF validation, and IP/account rate limiting. No payment is collected. |
| **White Card (`#FFFFFF`)** with Dashed Violet border (`#8B5CF6`) | **Contextual Overlays & Modals** | Ephemeral client dialogs: Cookie/Demo notice banner, Session Details sheet, Join decision, Liability Waiver signing modal, 401 Session Expiry recovery. |
| **Lavender (`#E8E3F3`)** with Deep Purple border (`#4C3B73`) | **Trainer Space (Protected)** | Staff trainer view: Assigned class schedule, attendee counts, session details. Restricted strictly to `TRAINER` role (read-only). |
| **Jet Black (`#111310`)** with Signal Lime border (`#C7F134`) | **Administrator Operations** | Staff operations management: Operations overview, class creation/editing, capacity overrides, participant roster. Restricted strictly to `ADMIN` role. |
| **Soft Sage Green (`#DDEBD8`)** with Forest Green border (`#1F4D32`) | **Success & Confirmed States** | Positive outcomes: Atomic confirmed reservation created, spot opened, FIFO waitlist promotion executed, signed waiver on file. |
| **Soft Alert Red (`#F7DFDC`)** with Crimson border (`#9E2E25`) | **Rejections & Error Gates** | Guard blocks: Cutoff window passed, session capacity full, booking overlap conflict, rate limit lockout (429), 401 expired, 403 forbidden. |
| **Amber Rhombus (`#FFF4D6`)** with Brown border (`#7A4B00`) | **Decision Gateways** | Authoritative conditional logic: Capacity check, membership status, waiver signed?, role eligibility, duplicate prevention. |
| **Solid Grey Connector (`#40443F`)** | **Synchronous Flow / Route** | Standard hierarchical page navigation or authoritative sequential execution step. |
| **Dashed Purple Connector (`#8B5CF6`)** | **Overlay / Modal Trigger** | Non-blocking client dialog activation or contextual sheet presentation. |
| **Dashed Red Connector (`#9E2E25`)** | **Security / Auth Intercept** | Unauthenticated action redirect, rate-limit lockout, or session expiry re-auth recovery. |

## Complete wireframe coverage

The plugin now defines 26 page routes plus a separate 404 fallback, each with full desktop (1440 px) and mobile (390 px) sections. It generates 163 scenarios per device across 27 separate versioned Figma route pages. Desktop/mobile scenario frames are direct children of their page. Only different-frame, same-page transitions receive NAVIGATE reactions; cross-page destinations are labeled and reached through the plugin page chooser. The earlier combined-page run failed native reaction validation; the stricter local regression tests now pass, but native rerun and visual QA remain pending.

[Route, section, and state matrix](../../../docs/design/wireframe-coverage.md).

## Sitemap

[Open SVG preview](../../../docs/design/sitemap.svg). Only page URLs appear as nodes; lines express information hierarchy.

```mermaid
flowchart TB
    %% Route-only information hierarchy. Group headings are not pages.
    subgraph publicGroup["PUBLIC DISCOVERY"]
        direction TB
        home["/"]
        programs["/programs"]
        home --- programs
        schedule["/schedule"]
        home --- schedule
        details["/sessions/:id"]
        schedule --- details
        trainers["/trainers"]
        home --- trainers
        pricing["/pricing"]
        home --- pricing
    end
    style publicGroup fill:#F2F0E8,stroke:#B8BDB4
    subgraph legalGroup["PUBLIC INFORMATION & PREFERENCES"]
        direction TB
        about["/about"]
        terms["/terms"]
        privacy["/privacy"]
        waiver["/waiver"]
        cookies["/cookie-settings"]
    end
    style legalGroup fill:#F2F0E8,stroke:#B8BDB4
    subgraph authGroup["JOIN & ACCOUNT PAGES"]
        direction TB
        join["/join"]
        register["/register"]
        login["/portal/login"]
        recovery["/auth/forgot-password"]
    end
    style authGroup fill:#E1EAF5,stroke:#B8BDB4
    subgraph memberGroup["MEMBER WORKSPACE"]
        direction TB
        app["/app"]
        appSchedule["/app/schedule"]
        app --- appSchedule
        bookings["/app/bookings"]
        app --- bookings
        security["/app/profile/security"]
        app --- security
    end
    style memberGroup fill:#E2E0D8,stroke:#B8BDB4
    subgraph trainerGroup["TRAINER WORKSPACE"]
        direction TB
        assigned["/trainer/sessions"]
        assignedDetail["/trainer/sessions/:id"]
        assigned --- assignedDetail
    end
    style trainerGroup fill:#E8E3F3,stroke:#B8BDB4
    subgraph adminGroup["ADMINISTRATOR WORKSPACE"]
        direction TB
        adminHome["/admin"]
        adminSessions["/admin/sessions"]
        adminHome --- adminSessions
        adminCreate["/admin/sessions/new"]
        adminSessions --- adminCreate
        adminEdit["/admin/sessions/:id/edit"]
        adminSessions --- adminEdit
        participants["/admin/sessions/:id/participants"]
        adminSessions --- participants
    end
    style adminGroup fill:#EDF1E8,stroke:#B8BDB4

    %% Invisible layout links organize groups; they are not navigation.
    publicGroup ~~~ legalGroup ~~~ authGroup ~~~ memberGroup ~~~ trainerGroup ~~~ adminGroup
```

## Route & Access Architecture

[Open SVG preview](../../../docs/design/route-access-architecture.svg). Routes, flow steps, and UI/system behavior are explicitly distinguished.

```mermaid
flowchart TD
    Root[Practice Athletic Club]

    subgraph PublicSpace[Public discovery site]
        PublicNav[Public header<br/>Primary navigation, My Account utility, and Join Now CTA]
        Home[Home /]
        Programs[Programs /programs]
        Services[Services /#services]
        Facilities[Facilities /#facilities]
        Contact[Contact /#contact]
        PublicSchedule[Schedule /schedule]
        Trainers[Trainers /trainers]
        Pricing[Pricing /pricing<br/>Fictional plans only]
        SessionDetails[Session detail /sessions/:id<br/>PUBLIC ROUTE: anonymous booking starts Join; members continue in workspace]
    end

    subgraph FooterSystem[Footer and system routes]
        About[About Us /about]
        Terms[Terms of Service /terms]
        Privacy[Privacy Policy /privacy]
        Waiver[Liability Waiver /waiver]
        Cookies[Cookie preferences /cookie-settings]
        NotFound["SYSTEM FALLBACK: Not Found /404"]
    end

    subgraph JoinAndAuth[Membership join and authentication]
        Join[Join Now /join<br/>Choose a fictional plan; no payment or card data]
        Login[My Account /portal/login<br/>Existing-member access and demo persona switcher]
        Guard[Protected-route guard<br/>SYSTEM: unauthenticated to My Account with validated returnTo; wrong role denied]
        Register[Member registration /register<br/>Account form and required consent]
        Recovery[Account recovery /auth/forgot-password]
    end

    subgraph MemberSpace[Member workspace: protected app shell]
        Workspace[Member dashboard /app<br/>Home, next class, and quick actions]
        AppSchedule[Member schedule /app/schedule]
        MyBookings[My bookings /app/bookings]
        ProfileSec[Profile &amp; Security /app/profile/security]
        Confirmed["SECTION: Confirmed reservations within /app/bookings"]
        Waiting["SECTION: Waitlist entries within /app/bookings"]
        CancelDialog["MODAL: Cancellation confirmation"]
    end

    subgraph TrainerSpace[Trainer workspace: protected]
        TrainerAssignments[Assigned sessions /trainer/sessions]
        TrainerSession[Assigned session /trainer/sessions/:id]
    end

    subgraph AdminSpace[Administrator workspace: protected]
        AdminOverview[Operations overview /admin]
        AdminSessions[Session manager /admin/sessions]
        AdminCreate[Create session /admin/sessions/new]
        AdminEdit[Edit session /admin/sessions/:id/edit]
        AdminParticipants[Participants /admin/sessions/:id/participants]
    end

    Root --> PublicNav
    PublicNav -- Secondary utility: My Account --> Login
    PublicNav -- Primary CTA --> Join
    PublicSchedule --> SessionDetails
    Join --> PlanSelected["STEP: select fictional plan"] --> Register
    Register --> Created["STEP: account created and session issued"] --> Destination["Validated member intent, otherwise /app"]
    Login --> Recovery
    Workspace --> AppSchedule & MyBookings & ProfileSec
    MyBookings -. contains .-> Confirmed & Waiting
    Confirmed -. opens .-> CancelDialog
    TrainerAssignments --> TrainerSession
    AdminOverview --> AdminSessions
    AdminSessions --> AdminCreate & AdminEdit & AdminParticipants

    classDef public fill:#F2F0E8,stroke:#111310,color:#111310;
    classDef join fill:#E1EAF5,stroke:#1E3A8A,color:#111310;
    classDef member fill:#E2E0D8,stroke:#111310,color:#111310;
    classDef trainer fill:#E8E3F3,stroke:#4C3B73,color:#111310;
    classDef admin fill:#111310,stroke:#C7F134,color:#F2F0E8;
    classDef overlay fill:#FFFFFF,stroke:#8B5CF6,stroke-dasharray: 4 4,color:#111310;
    class Root,PublicNav,Home,Programs,Services,Facilities,Contact,PublicSchedule,Trainers,Pricing,About,Terms,Privacy,Waiver,Cookies,NotFound public;
    class Join,Login,Guard,Register,Recovery join;
    class Workspace,AppSchedule,MyBookings,ProfileSec,Confirmed,Waiting member;
    class TrainerAssignments,TrainerSession trainer;
    class AdminOverview,AdminSessions,AdminCreate,AdminEdit,AdminParticipants admin;
    class SessionDetails public;
    class CancelDialog overlay;
```

## Booking and waitlist entry

```mermaid
flowchart TD
    Start([Visitor or member opens schedule]) --> Browse["Filter by date, program, trainer, and availability"]
    Browse --> Results{Any matching sessions?}
    Results -- No --> Empty["Empty state<br/>Clear filters or choose another date"] --> Browse
    Results -- Yes --> Select[Select a session] --> Details["View time, trainer, availability, status, and configured cutoff"]
    Details -. booking terms .-> TermsNotice["Booking terms: Late cancellation forfeits spot; auto-promotion is binding"]
    Details --> Intent[Choose Book session]
    Intent --> Auth{Authenticated?}
    Auth -- No --> Join["Redirect to Join /join<br/>Select a fictional plan or use Portal Login; preserve returnTo"] --> MemberProfile
    Auth -- Yes --> MemberProfile{Has member profile?}
    MemberProfile -- No --> RoleBlocked["Member-only action unavailable<br/>Trainer or admin needs member profile"]
    MemberProfile -- Yes --> Membership{Membership active?}
    Membership -- No --> Inactive["Booking blocked<br/>Inactive membership"]
    Membership -- Yes --> WaiverCheck{Liability waiver signed on file?}
    WaiverCheck -- No --> WaiverModal["Present Liability Waiver and PAR-Q modal<br/>Member signs and acknowledges health release"]
    WaiverModal -- Sign --> StoreWaiver["Store timestamped waiver in profile"] --> SessionEligible
    WaiverModal -- Decline or close --> Details
    WaiverCheck -- Yes --> SessionEligible{Scheduled and before configured cutoff?}
    SessionEligible -- No --> CutoffOrStatus["Booking unavailable<br/>Show status or cutoff passed"] --> Browse
    SessionEligible -- Yes --> SubmitBooking[Submit booking request]
    SubmitBooking --> SecCheck["Security guard: Verify CSRF token, session token, and rate limit"]
    SecCheck -. 401 session expired .-> ExpiryReauth["Session expired modal<br/>Prompt re-auth; preserve session and intent"] -. resume .-> SubmitBooking
    SecCheck -- Valid --> Transaction["Server transaction rechecks identity, membership, waiver, status, cutoff, duplicates, overlap, and capacity"]
    Transaction --> ExistingBooking{Already confirmed?}
    ExistingBooking -- Yes --> AlreadyBooked["Show existing reservation<br/>No duplicate created"] --> MyBookings["Open My bookings /app/bookings"]
    ExistingBooking -- No --> ExistingWaitlist{Already waiting?}
    ExistingWaitlist -- Yes --> AlreadyWaiting["Show current waitlist position<br/>No duplicate created"] --> MyBookings
    ExistingWaitlist -- No --> Overlap{Overlaps another booking?}
    Overlap -- Yes --> Conflict["Show booking conflict"] --> MyBookings
    Overlap -- No --> Capacity{Capacity available at commit time?}
    Capacity -- Yes --> Confirm[Create confirmed booking atomically] --> BookingSuccess["Booking confirmed<br/>Show in My bookings"] --> MyBookings
    Capacity -- No --> Full["Session full<br/>Offer Join waitlist"] --> JoinChoice{Join waitlist?}
    JoinChoice -- No --> Details
    JoinChoice -- Yes --> SubmitWaitlist[Submit waitlist request]
    SubmitWaitlist --> WaitlistSec["Security guard: CSRF and rate limit check"] --> WaitlistRecheck["Server rechecks eligibility, duplicate entry, and capacity"]
    WaitlistRecheck --> StillFull{Session still full?}
    StillFull -- No --> SpotOpened["Refresh and offer booking"] --> Details
    StillFull -- Yes --> CreateEntry[Create one FIFO entry] --> WaitlistSuccess["Waitlist joined<br/>Show current position"] --> MyBookings
    Transaction -. unexpected failure .-> Failure["Preserve context, show request ID, offer retry"]
    WaitlistRecheck -. unexpected failure .-> Failure
    Failure -. retry booking .-> SubmitBooking
    Failure -. retry waitlist .-> SubmitWaitlist
```

## Waitlist management

```mermaid
flowchart TD
    Start([Member opens My bookings]) --> Load[Load confirmed reservations and waiting entries]
    Load --> Loading[Show stable loading skeleton] --> LoadState{Request result}
    LoadState -- Failure --> Retry["Show recoverable error and retry"] --> Load
    LoadState -- Empty --> Empty["No upcoming bookings or waitlist entries"]
    LoadState -- Ready --> Select[Select a waiting entry] --> Details["Show details, FIFO position, and Leave waitlist action"]
    Details --> Choice{Member choice}
    Choice -- Keep waiting --> End([Remain on waitlist])
    Choice -- Leave waitlist --> Submit[Submit removal request]
    Submit --> ServerCheck["Server verifies session, CSRF token, rate limit, identity, ownership, and entry status"]
    ServerCheck --> Status{Current status}
    Status -- Waiting --> Remove[Atomically mark entry cancelled] --> Removed["Removed from waitlist"] --> Start
    Status -- Promoted --> Promoted["Show confirmed reservation and cancellation policy"] --> ConfirmedReservation["Open confirmed reservation; cancellation remains available before cutoff"]
    Status -- Cancelled or expired --> Resolved["Refresh My bookings"] --> Start
    ServerCheck -. unexpected failure .-> RemoveFailure["Keep entry visible and offer retry"]
    RemoveFailure -. retry removal .-> Submit
```

## Cancellation and FIFO promotion

```mermaid
flowchart TD
    Start([Member opens My bookings]) --> Select[Select confirmed reservation]
    Select --> CutoffDisplay{Before configured cancellation cutoff?}
    CutoffDisplay -- No --> Locked["Cancellation unavailable<br/>Reservation remains confirmed"] --> Start
    CutoffDisplay -- Yes --> Dialog["Confirm cancellation<br/>Explain possible waitlist promotion"]
    Dialog --> Choice{Member choice}
    Choice -- Keep reservation --> Retain([Close dialog; reservation retained])
    Choice -- Confirm cancellation --> Submit[Submit cancellation request]
    Submit --> Validate["Server verifies session identity, ownership, CSRF token, rate limit, confirmed status, and cutoff"]
    Validate --> Valid{Still eligible to cancel?}
    Valid -- No --> Rejected["Show stable domain error and refresh state"] --> Start
    Valid -- Yes --> Transaction[Begin one database transaction] --> CancelBooking[Mark booking cancelled] --> NextEntry[Select earliest FIFO waiting entry]
    NextEntry --> Queue{Waiting entry found?}
    Queue -- No --> CommitOpen["Commit cancellation<br/>Maximum capacity unchanged; availability increases"] --> CancelSuccess["Original member sees cancellation confirmed"] --> Start
    Queue -- Yes --> Eligible{Entry eligible under current booking rules?}
    Eligible -- No --> ResolveIneligible[Mark entry expired using agreed status rule] --> NextEntry
    Eligible -- Yes --> Promote["Mark entry promoted and create confirmed booking atomically"] --> CommitPromotion[Commit cancellation and promotion]
    CommitPromotion --> CancelSuccess
    CommitPromotion --> PromotedResult["Promoted member sees confirmed reservation and dashboard badge on next visit"] --> Start
    CommitPromotion -. audit logging .-> AuditLog["Structured audit log: record cancellation, availability update, or promotion with request ID"]
    Transaction -. transaction failure .-> Rollback["Roll back all changes; reservation remains confirmed"] --> Start
```

## Trainer access

```mermaid
flowchart TD
    Start([User signs in]) --> Role{Trainer role verified in server session?}
    Role -- No --> Forbidden["Access denied (403)<br/>Security event logged; no trainer data exposed"] --> Start
    Role -- Yes --> Load[Load assigned upcoming sessions]
    Load --> Result{Request result}
    Result -- Loading --> Loading[Show stable loading skeleton] --> Result
    Result -- Failure --> Retry["Show request ID and retry"] --> Load
    Result -- Empty --> Empty["No assigned upcoming sessions"]
    Result -- Ready --> List[Show assigned sessions and attendee counts] --> Select[Select an assigned session]
    Select --> Authorized{Assigned to this trainer?}
    Authorized -- No --> Forbidden --> Start
    Authorized -- Yes --> Detail["Read-only session details and attendee count<br/>No trainer editing in version one"] --> List
```

## Administrator operations

```mermaid
flowchart TD
    Start([User signs in]) --> Role{Administrator role verified in server session?}
    Role -- No --> Forbidden["Access denied (403)<br/>Security event logged; return to permitted experience"]
    Role -- Yes --> Overview["Operations overview<br/>Session occupancy and waitlist counts"] --> Sessions[Open session manager]
    Sessions --> LoadState{Session-list result}
    LoadState -- Loading --> Loading[Show table loading state] --> LoadState
    LoadState -- Failure --> Retry["Show request ID and retry"] --> Sessions
    LoadState -- Empty --> Empty["No scheduled sessions<br/>Offer Create session"] --> CreateForm
    LoadState -- Ready --> Action{Administrator action}
    Action -- Create session --> CreateForm["Program, trainer, start/end, capacity, configured cutoff"]
    CreateForm --> ValidateCreate["Validate fields, capacity, dates, trainer, trainer-time overlap"] --> CreateValid{Valid?}
    CreateValid -- No --> CreateErrors["Show field-level and conflict errors"] --> CreateForm
    CreateValid -- Yes --> CreateSave["Submit create request with CSRF token"] --> Created["Session created and logged in audit trail; refresh list"]
    Action -- Edit session --> EditForm[Edit allowed scheduling fields]
    EditForm --> ValidateEdit["Validate fields, trainer overlap, capacity not below confirmed bookings"] --> EditValid{Valid?}
    EditValid -- No --> EditErrors["Show errors; preserve values"] --> EditForm
    EditValid -- Yes --> EditSave["Submit update request with CSRF token"] --> Updated["Session updated and logged; refetch affected views"]
    Action -- View participants --> Participants["Show fictional confirmed members and ordered waitlist"] --> Sessions
    CreateSave -. unexpected failure .-> SaveFailure["Show request ID and retry"]
    EditSave -. unexpected failure .-> SaveFailure
    SaveFailure -. retry create .-> CreateSave
    SaveFailure -. retry update .-> EditSave
```

## Authentication, onboarding, and security

```mermaid
flowchart TD
    classDef security fill:#E1EAF5,stroke:#1E3A8A,stroke-width:1.5px,color:#111310;
    classDef success fill:#DDEBD8,stroke:#1F4D32,stroke-width:1.5px,color:#111310;
    classDef alert fill:#F7DFDC,stroke:#9E2E25,stroke-width:1.5px,color:#111310;
    classDef note fill:#FFFFFF,stroke:#8B5CF6,stroke-dasharray:4 4,stroke-width:1.5px,color:#111310;

    EntryNav([Visitor clicks Join now]) --> AuthCheck{Already authenticated?}
    EntryRedirect([Booking intent redirect with returnTo]) --> AuthCheck
    EntryDirect([Direct URL: /portal/login or /join]) --> AuthCheck

    AuthCheck -- Yes --> AlreadyAuth["Redirect to role dashboard or restore returnTo"]:::success --> RBACRoute
    AuthCheck -- No --> ChooseIntent{Choose path}

    %% Path A: Register
    ChooseIntent -- New fictional member --> PlanChoice["Open /join<br/>Select fictional plan; no payment collected"] --> RegForm["Open /register<br/>Enter name, email, password"]
    RegForm --> ZodVal["Client Zod validation"] --> FormValid{Valid format?}
    FormValid -- No --> FormErrors["Show field validation errors"]:::alert --> RegForm
    FormValid -- Yes --> LegalConsent["Mandatory legal checkboxes:<br/>1. Terms of Service & Privacy Policy<br/>2. Physical Activity Readiness & Liability Waiver"]:::note
    LegalConsent --> ConsentCheck{Both accepted?}
    ConsentCheck -- No --> ConsentBlocked["Registration blocked until terms & waiver accepted"]:::alert --> LegalConsent
    ConsentCheck -- Yes --> RegSubmit["Submit POST /api/v1/auth/register"]
    RegSubmit --> RegSec["Rate limiter & CSRF token verification"]:::security
    RegSec --> EmailCheck{Email already registered?}
    EmailCheck -- Yes --> ConflictError["409 Conflict: Account exists; offer Portal Login"]:::alert --> LoginPage
    EmailCheck -- No --> CreateUser["Create User & MemberProfile<br/>Hash password, active status, selected fictional plan, waiverSignedAt: timestamp"]
    CreateUser --> IssueCookie["Set HTTP-only, Secure, SameSite session cookie<br/>Log USER_REGISTERED event"]:::security
    IssueCookie --> RegDone["Redirect to returnTo session or Member Dashboard"]:::success --> SessionIssue

    %% Path B: Sign In
    ChooseIntent -- Existing member --> LoginPage["Open /portal/login<br/>Choose method: Credentials or Demo Switcher"]
    LoginPage --> Method{Sign in method?}

    Method -- Credentials --> CredInput["Enter email & password"]
    CredInput --> RateCheck["Rate limiter check: max 5 failed attempts/min"]:::security
    RateCheck -- Limit exceeded --> Lockout["429 Too Many Requests: Temporary lockout cooldown"]:::alert --> CredInput
    RateCheck -- OK --> CredVerify["Server verifies password hash against database"]
    CredVerify --> CredValid{Valid credentials?}
    CredValid -- No --> CredError["401 Invalid credentials; preserve email & log failure"]:::alert --> CredInput
    CredValid -- Yes --> SessionIssue

    Method -- Demo Switcher --> DemoSwitch["Portfolio Demo Switcher<br/>One-click evaluator access"]:::note
    DemoSwitch --> SelectPersona["Select persona:<br/>Alex (Member), Marcus (Trainer), Sarah (Admin)"]
    SelectPersona --> IssueDemo["Issue demo session token instantaneously"]:::success --> SessionIssue

    SessionIssue["Set HTTP-only session cookie<br/>Log USER_AUTHENTICATED audit event"]:::security
    SessionIssue --> RBACRoute["Server-Side RBAC Gatekeeper<br/>Inspect decrypted session role"]
    RBACRoute --> RoleDecision{Session Role}
    RoleDecision -- Member --> MemberDash["/app or validated returnTo member route"]:::success
    RoleDecision -- Trainer --> TrainerDash["/trainer/sessions"]
    RoleDecision -- Administrator --> AdminDash["/admin operations"]

    %% Session Lifecycle & Expiry
    SessionLife["Protected Request"] --> SessionCheck{Session active & valid?}
    SessionCheck -- Valid --> UpdateActive["Authorize request & touch lastActiveAt"]:::success
    SessionCheck -- Expired / 401 --> ExpiryModal["Non-destructive Re-Auth Modal<br/>Preserve in-progress booking or form context"]:::note
    ExpiryModal --> ReauthAction["Enter password or re-select demo persona"] --> ReauthSuccess["Restore session and replay pending mutation"]:::success --> UpdateActive

    %% Account Recovery & Sign Out
    ForgotLink([Forgot password?]) --> ForgotInput["Enter email on /auth/forgot-password"]
    ForgotInput --> ForgotSim["Fictional portfolio response: Generic feedback without enumeration"]:::note
    SignOutAction([User clicks Sign Out]) --> RevokeSession["Server revokes session in DB & clears session cookies"]:::security --> SignOutDone["Redirect to Home / with toast confirmation"]:::success
```

---

## Architectural & Cross-Flow Specifications

### 1. Terms of Service, Gym Liability Waiver & Booking Rules
- **Terms of Service (`/terms`)**: Defines member code of conduct, class check-in policies, booking windows, and cancellation rules based on per-session configured cutoffs.
- **Physical Activity Readiness & Liability Waiver (`/waiver`)**: Required for all athletic club participants. Acknowledges physical risks, confirms readiness to exercise, and releases the club from liability. Checked server-side on every booking request; prompted via modal if not signed.
- **Booking Rules**: A member may not hold concurrent overlapping bookings, duplicate bookings for the same session, or book after the session's configured cutoff has elapsed. Waitlist auto-promotions are transactionally binding.

### 2. Privacy, Cookie Policy & Demo Data Disclosures
- **Privacy Policy (`/privacy`)**: Details minimal personal data storage (fictional name, email, booking timestamps) and session cookie handling.
- **Portfolio Demo Disclosure**: Persistent banner on public views certifying that Practice Athletic Club is a portfolio demonstration using exclusively synthetic, privacy-safe records. No real health, personal identity, or credit card information is collected or processed.
- **Essential Cookie Notice**: Discloses use of secure, HTTP-only Auth.js session cookies and local storage for display preferences.

### 3. Security Architecture & Threat Defenses
- **Session Management**: Auth.js with encrypted, HTTP-only, SameSite=Lax cookies. Session timeout and idle expiry trigger non-destructive re-auth modals preserving user context (`returnTo`).
- **Server-Side RBAC**: Role invariants (`VISITOR`, `MEMBER`, `TRAINER`, `ADMINISTRATOR`) are enforced at the API route handler and middleware level. Unauthorized requests return `403 Forbidden` with zero data leakage.
- **CSRF & Rate Limiting**: All mutations (`POST`, `DELETE`, `PATCH`) validate anti-CSRF headers. Rate limiting is applied to authentication endpoints (preventing brute force credential attacks) and booking endpoints (preventing slot-sniping automated scripts).
- **Structured Audit Logging**: Security events (failed logins, lockout triggers, unauthorized access attempts) and critical operational mutations (cancellations, promotions, admin session edits) are logged with request IDs and sanitized identifiers.
