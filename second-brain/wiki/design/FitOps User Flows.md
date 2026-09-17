---
type: ux-flow-hub
project: FitOps
status: review-required
updated: 2026-09-17
---

# FitOps User Flows

This note is the Obsidian-readable review hub for the platform user flows, incorporating terms of service, gym liability waiver, privacy policies, demo data governance, security guardrails, and full authentication/onboarding lifecycles.

Open the native editable diagram: [[FitOps User Flows.drawio|FitOps User Flows.drawio]]. It contains the seven diagrams as individual draw.io pages (281 vertices, 222 edges) with embedded visual color keys.

## Visual language and color legend

Every color in the diagrams has a precise architectural meaning derived from the Practice Athletic Club design system and application access model:

| Block Color & Styling | Category / Experience | Architectural Meaning & Scope |
| :--- | :--- | :--- |
| **Cream (`#F2F0E8`)** with Jet Black border | **Public & Legal Experience** | Unauthenticated visitor access: Home, Programs, Schedule, Pricing, Terms of Service, Privacy Policy, Liability Waiver. No credentials required. |
| **Sand (`#E2E0D8`)** with Jet Black border | **Member Space (Protected)** | Authenticated member portal: `/my-bookings`, confirmed reservations, waitlist positions, `/profile/security`. Requires valid member session. |
| **Soft Blue (`#E1EAF5`)** with Navy border (`#1E3A8A`) | **Auth & Security Hub** | Identity & security pipeline: Sign In, 1-click Demo Switcher, Registration with Zod validation, Password recovery, CSRF validation, IP/account rate limiting. |
| **White Card (`#FFFFFF`)** with Dashed Violet border (`#8B5CF6`) | **Contextual Overlays & Modals** | Ephemeral client dialogs: Cookie/Demo notice banner, Session Details sheet, Demo sign-in modal, Liability Waiver signing modal, 401 Session Expiry recovery. |
| **Lavender (`#E8E3F3`)** with Deep Purple border (`#4C3B73`) | **Trainer Space (Protected)** | Staff trainer view: Assigned class schedule, attendee counts, session details. Restricted strictly to `TRAINER` role (read-only). |
| **Jet Black (`#111310`)** with Signal Lime border (`#C7F134`) | **Administrator Operations** | Staff operations management: Operations overview, class creation/editing, capacity overrides, participant roster. Restricted strictly to `ADMIN` role. |
| **Soft Sage Green (`#DDEBD8`)** with Forest Green border (`#1F4D32`) | **Success & Confirmed States** | Positive outcomes: Atomic confirmed reservation created, spot opened, FIFO waitlist promotion executed, signed waiver on file. |
| **Soft Alert Red (`#F7DFDC`)** with Crimson border (`#9E2E25`) | **Rejections & Error Gates** | Guard blocks: Cutoff window passed, session capacity full, booking overlap conflict, rate limit lockout (429), 401 expired, 403 forbidden. |
| **Amber Rhombus (`#FFF4D6`)** with Brown border (`#7A4B00`) | **Decision Gateways** | Authoritative conditional logic: Capacity check, membership status, waiver signed?, role eligibility, duplicate prevention. |
| **Solid Grey Connector (`#40443F`)** | **Synchronous Flow / Route** | Standard hierarchical page navigation or authoritative sequential execution step. |
| **Dashed Purple Connector (`#8B5CF6`)** | **Overlay / Modal Trigger** | Non-blocking client dialog activation or contextual sheet presentation. |
| **Dashed Red Connector (`#9E2E25`)** | **Security / Auth Intercept** | Unauthenticated action redirect, rate-limit lockout, or session expiry re-auth recovery. |

## Sitemap

```mermaid
flowchart TD
    classDef public fill:#F2F0E8,stroke:#111310,stroke-width:1.5px,color:#111310;
    classDef member fill:#E2E0D8,stroke:#111310,stroke-width:1.5px,color:#111310;
    classDef trainer fill:#E8E3F3,stroke:#4C3B73,stroke-width:1.5px,color:#111310;
    classDef admin fill:#111310,stroke:#C7F134,stroke-width:1.5px,color:#F2F0E8;
    classDef overlay fill:#FFFFFF,stroke:#8B5CF6,stroke-dasharray:4 4,stroke-width:1.5px,color:#111310;
    classDef security fill:#E1EAF5,stroke:#1E3A8A,stroke-width:1.5px,color:#111310;

    Root([Practice Athletic Club])
    subgraph PublicSpace[Public and Legal experience]
        Home["Home /<br/>Value proposition, program summary, schedule preview"]:::public
        Programs["Programs /programs<br/>Description, intensity, duration, equipment"]:::public
        Schedule["Schedule /schedule<br/>Filter by date, program, trainer, availability"]:::public
        Trainers["Trainers /trainers<br/>Fictional bios and specialties"]:::public
        Pricing["Pricing /pricing<br/>Clearly labeled fictional plans"]:::public
        Terms["Terms of Service /terms<br/>Membership rules, cutoff policy, etiquette"]:::public
        Privacy["Privacy Policy /privacy<br/>Fictional demo data disclosures, session cookies"]:::public
        Waiver["Liability Waiver /waiver<br/>Physical readiness and injury liability release"]:::public
    end
    subgraph AuthSpace[Authentication and Onboarding]
        Login["Sign In /login<br/>Credentials or 1-click demo persona switch"]:::security
        Register["Register /register<br/>Zod validation, terms and waiver consent"]:::security
        ForgotPass["Account recovery /auth/forgot-password<br/>Rate-limited, email-safe reset link"]:::security
    end
    subgraph Overlays[Contextual overlays]
        CookieBanner["Cookie and Demo banner<br/>Fictional data notice and session consent"]:::overlay
        SessionDetails["Session details /sessions/:id<br/>Time, trainer, capacity, availability, configured cutoff"]:::overlay
        DemoAuth["Demo sign-in modal<br/>Fictional profiles; preserve selected session"]:::overlay
        WaiverModal["Liability waiver modal<br/>Mandatory before first class booking"]:::overlay
        ExpiryModal["Session expiry modal<br/>Re-auth without losing booking intent"]:::overlay
        CancelDialog["Cancellation confirmation<br/>Configured cutoff and outcome"]:::overlay
    end
    subgraph MemberSpace[Member experience - protected]
        MyBookings["My bookings /my-bookings<br/>Upcoming confirmed and waiting entries"]:::member
        Confirmed["Confirmed reservations<br/>Session details and cancellation action"]:::member
        Waiting["Waitlist entries<br/>Current position and leave action"]:::member
        ProfileSec["Profile and Security /profile/security<br/>Membership status, signed waiver, sign out"]:::member
    end
    subgraph TrainerSpace[Trainer experience - protected read only]
        TrainerAssignments["Assigned sessions /trainer/sessions<br/>Upcoming assigned sessions"]:::trainer
        TrainerSession["Assigned session /trainer/sessions/:id<br/>Session details and attendee count"]:::trainer
    end
    subgraph AdminSpace[Administrator experience - protected]
        AdminOverview["Operations overview /admin<br/>Session occupancy and waitlist counts"]:::admin
        AdminSessions["Session manager /admin/sessions<br/>List and filter scheduled sessions"]:::admin
        AdminCreate["Create session /admin/sessions/new<br/>Program, trainer, time, capacity, cutoff"]:::admin
        AdminEdit["Edit session /admin/sessions/:id/edit<br/>Validated scheduling changes"]:::admin
        AdminParticipants["Participants /admin/sessions/:id/participants<br/>Fictional bookings and ordered waitlist"]:::admin
    end
    Root --> Home & Programs & Schedule & Trainers & Pricing & Terms & Privacy & Waiver
    Root --> Login & Register
    Login -. forgot password .-> ForgotPass
    Schedule --> SessionDetails
    SessionDetails -. unauthenticated booking attempt .-> DemoAuth
    SessionDetails -. waiver check required .-> WaiverModal
    SessionDetails -. session expired .-> ExpiryModal
    DemoAuth -. return to selected session .-> SessionDetails
    Root --> MyBookings
    MyBookings --> Confirmed & Waiting & ProfileSec
    Confirmed --> CancelDialog
    Root --> TrainerAssignments
    TrainerAssignments --> TrainerSession
    Root --> AdminOverview
    AdminOverview --> AdminSessions
    AdminSessions --> AdminCreate & AdminEdit & AdminParticipants
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
    Auth -- No --> SignIn["Demo sign-in<br/>Preserve selected session"] --> MemberProfile
    Auth -- Yes --> MemberProfile{Has member profile?}
    MemberProfile -- No --> RoleBlocked["Member-only action unavailable<br/>Trainer or admin needs member profile"]
    MemberProfile -- Yes --> Membership{Membership active?}
    Membership -- No --> Inactive["Booking blocked<br/>Inactive membership"]
    Membership -- Yes --> WaiverCheck{Liability waiver signed on file?}
    WaiverCheck -- No --> WaiverModal["Present Liability Waiver and PAR-Q modal<br/>Member signs and acknowledges health release"] --> StoreWaiver["Store timestamped waiver in profile"] --> SessionEligible
    WaiverCheck -- Yes --> SessionEligible{Scheduled and before configured cutoff?}
    SessionEligible -- No --> CutoffOrStatus["Booking unavailable<br/>Show status or cutoff passed"]
    SessionEligible -- Yes --> SubmitBooking[Submit booking request]
    SubmitBooking --> SecCheck["Security guard: Verify CSRF token, session token, and rate limit"]
    SecCheck -. 401 session expired .-> ExpiryReauth["Session expired modal<br/>Prompt re-auth; preserve session and intent"] -. resume .-> SubmitBooking
    SecCheck -- Valid --> Transaction["Server transaction rechecks identity, membership, waiver, status, cutoff, duplicates, overlap, and capacity"]
    Transaction --> ExistingBooking{Already confirmed?}
    ExistingBooking -- Yes --> AlreadyBooked["Show existing reservation<br/>No duplicate created"]
    ExistingBooking -- No --> ExistingWaitlist{Already waiting?}
    ExistingWaitlist -- Yes --> AlreadyWaiting["Show current waitlist position<br/>No duplicate created"]
    ExistingWaitlist -- No --> Overlap{Overlaps another booking?}
    Overlap -- Yes --> Conflict["Show booking conflict"]
    Overlap -- No --> Capacity{Capacity available at commit time?}
    Capacity -- Yes --> Confirm[Create confirmed booking atomically] --> BookingSuccess["Booking confirmed<br/>Show in My bookings"]
    Capacity -- No --> Full["Session full<br/>Offer Join waitlist"] --> JoinChoice{Join waitlist?}
    JoinChoice -- No --> Details
    JoinChoice -- Yes --> SubmitWaitlist[Submit waitlist request]
    SubmitWaitlist --> WaitlistSec["Security guard: CSRF and rate limit check"] --> WaitlistRecheck["Server rechecks eligibility, duplicate entry, and capacity"]
    WaitlistRecheck --> StillFull{Session still full?}
    StillFull -- No --> SpotOpened["Refresh and offer booking"] --> Details
    StillFull -- Yes --> CreateEntry[Create one FIFO entry] --> WaitlistSuccess["Waitlist joined<br/>Show current position"]
    Transaction -. unexpected failure .-> Failure["Preserve context, show request ID, offer retry"]
    WaitlistRecheck -. unexpected failure .-> Failure
```

## Waitlist management

```mermaid
flowchart TD
    Start([Member opens My bookings]) --> Load[Load confirmed reservations and waiting entries]
    Load --> LoadState{Request result}
    LoadState -- Loading --> Loading[Show stable loading skeleton] --> LoadState
    LoadState -- Failure --> Retry["Show recoverable error and retry"] --> Load
    LoadState -- Empty --> Empty["No upcoming bookings or waitlist entries"]
    LoadState -- Ready --> Select[Select a waiting entry] --> Details["Show details, FIFO position, and Leave waitlist action"]
    Details --> Choice{Member choice}
    Choice -- Keep waiting --> End([Remain on waitlist])
    Choice -- Leave waitlist --> Submit[Submit removal request]
    Submit --> ServerCheck["Server verifies session, CSRF token, rate limit, identity, ownership, and entry status"]
    ServerCheck --> Status{Current status}
    Status -- Waiting --> Remove[Atomically mark entry cancelled] --> Removed["Removed from waitlist"]
    Status -- Promoted --> Promoted["Show confirmed reservation and cancellation policy"]
    Status -- Cancelled or expired --> Resolved["Refresh My bookings"]
    ServerCheck -. unexpected failure .-> RemoveFailure["Keep entry visible and offer retry"]
```

## Cancellation and FIFO promotion

```mermaid
flowchart TD
    Start([Member opens My bookings]) --> Select[Select confirmed reservation]
    Select --> CutoffDisplay{Before configured cancellation cutoff?}
    CutoffDisplay -- No --> Locked["Cancellation unavailable<br/>Reservation remains confirmed"]
    CutoffDisplay -- Yes --> Dialog["Confirm cancellation<br/>Explain possible waitlist promotion"]
    Dialog --> Choice{Member choice}
    Choice -- Keep reservation --> Retain([Close dialog; reservation retained])
    Choice -- Confirm cancellation --> Submit[Submit cancellation request]
    Submit --> Validate["Server verifies session identity, ownership, CSRF token, rate limit, confirmed status, and cutoff"]
    Validate --> Valid{Still eligible to cancel?}
    Valid -- No --> Rejected["Show stable domain error and refresh state"]
    Valid -- Yes --> Transaction[Begin one database transaction] --> CancelBooking[Mark booking cancelled] --> NextEntry[Select earliest FIFO waiting entry]
    NextEntry --> Queue{Waiting entry found?}
    Queue -- No --> CommitOpen["Commit cancellation<br/>Maximum capacity unchanged; availability increases"] --> CancelSuccess["Original member sees cancellation confirmed"]
    Queue -- Yes --> Eligible{Entry eligible under current booking rules?}
    Eligible -- No --> ResolveIneligible[Mark entry expired using agreed status rule] --> NextEntry
    Eligible -- Yes --> Promote["Mark entry promoted and create confirmed booking atomically"] --> CommitPromotion[Commit cancellation and promotion]
    CommitPromotion --> CancelSuccess
    CommitPromotion --> PromotedResult["Promoted member sees confirmed reservation on refresh"]
    CommitPromotion -. audit logging .-> AuditLog["Structured audit log: record cancellation, availability update, or promotion with request ID"]
    Transaction -. transaction failure .-> Rollback["Roll back all changes; reservation remains confirmed"]
```

## Trainer access

```mermaid
flowchart TD
    Start([User signs in]) --> Role{Trainer role verified in server session?}
    Role -- No --> Forbidden["Access denied (403)<br/>Security event logged; no trainer data exposed"]
    Role -- Yes --> Load[Load assigned upcoming sessions]
    Load --> Result{Request result}
    Result -- Loading --> Loading[Show stable loading skeleton] --> Result
    Result -- Failure --> Retry["Show request ID and retry"] --> Load
    Result -- Empty --> Empty["No assigned upcoming sessions"]
    Result -- Ready --> List[Show assigned sessions and attendee counts] --> Select[Select an assigned session]
    Select --> Authorized{Assigned to this trainer?}
    Authorized -- No --> Forbidden
    Authorized -- Yes --> Detail["Read-only session details and attendee count<br/>No trainer editing in version one"]
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
```

## Authentication, onboarding, and security

```mermaid
flowchart TD
    classDef security fill:#E1EAF5,stroke:#1E3A8A,stroke-width:1.5px,color:#111310;
    classDef success fill:#DDEBD8,stroke:#1F4D32,stroke-width:1.5px,color:#111310;
    classDef alert fill:#F7DFDC,stroke:#9E2E25,stroke-width:1.5px,color:#111310;
    classDef note fill:#FFFFFF,stroke:#8B5CF6,stroke-dasharray:4 4,stroke-width:1.5px,color:#111310;

    EntryNav([Visitor clicks Sign In / Join]) --> AuthCheck{Already authenticated?}
    EntryRedirect([Booking intent redirect with returnTo]) --> AuthCheck
    EntryDirect([Direct URL: /login or /register]) --> AuthCheck

    AuthCheck -- Yes --> AlreadyAuth["Redirect to role dashboard or restore returnTo"]:::success
    AuthCheck -- No --> ChooseIntent{Choose path}

    %% Path A: Register
    ChooseIntent -- Register --> RegForm["Open /register<br/>Enter name, email, password"]
    RegForm --> ZodVal["Client Zod validation"] --> FormValid{Valid format?}
    FormValid -- No --> FormErrors["Show field validation errors"]:::alert --> RegForm
    FormValid -- Yes --> LegalConsent["Mandatory legal checkboxes:<br/>1. Terms of Service & Privacy Policy<br/>2. Physical Activity Readiness & Liability Waiver"]:::note
    LegalConsent --> ConsentCheck{Both accepted?}
    ConsentCheck -- No --> ConsentBlocked["Registration blocked until terms & waiver accepted"]:::alert
    ConsentCheck -- Yes --> RegSubmit["Submit POST /api/v1/auth/register"]
    RegSubmit --> RegSec["Rate limiter & CSRF token verification"]:::security
    RegSec --> EmailCheck{Email already registered?}
    EmailCheck -- Yes --> ConflictError["409 Conflict: Account exists; offer Sign In"]:::alert
    EmailCheck -- No --> CreateUser["Create User & MemberProfile<br/>Hash password, status: ACTIVE, waiverSignedAt: timestamp"]
    CreateUser --> IssueCookie["Set HTTP-only, Secure, SameSite session cookie<br/>Log USER_REGISTERED event"]:::security
    IssueCookie --> RegDone["Redirect to returnTo session or Member Dashboard"]:::success

    %% Path B: Sign In
    ChooseIntent -- Sign In --> LoginPage["Open /login<br/>Choose method: Credentials or Demo Switcher"]
    LoginPage --> Method{Sign in method?}

    Method -- Credentials --> CredInput["Enter email & password"]
    CredInput --> RateCheck["Rate limiter check: max 5 failed attempts/min"]:::security
    RateCheck -- Limit exceeded --> Lockout["429 Too Many Requests: Temporary lockout cooldown"]:::alert
    RateCheck -- OK --> CredVerify["Server verifies password hash against database"]
    CredVerify --> CredValid{Valid credentials?}
    CredValid -- No --> CredError["401 Invalid credentials; preserve email & log failure"]:::alert
    CredValid -- Yes --> SessionIssue

    Method -- Demo Switcher --> DemoSwitch["Portfolio Demo Switcher<br/>One-click evaluator access"]:::note
    DemoSwitch --> SelectPersona["Select persona:<br/>Alex (Member), Marcus (Trainer), Sarah (Admin)"]
    SelectPersona --> IssueDemo["Issue demo session token instantaneously"]:::success --> SessionIssue

    SessionIssue["Set HTTP-only session cookie<br/>Log USER_AUTHENTICATED audit event"]:::security
    SessionIssue --> RBACRoute["Server-Side RBAC Gatekeeper<br/>Inspect decrypted session role"]
    RBACRoute --> RoleDecision{Session Role}
    RoleDecision -- Member --> MemberDash["/my-bookings or returnTo session"]:::success
    RoleDecision -- Trainer --> TrainerDash["/trainer/sessions"]
    RoleDecision -- Administrator --> AdminDash["/admin operations"]

    %% Session Lifecycle & Expiry
    SessionLife["Protected Request"] --> SessionCheck{Session active & valid?}
    SessionCheck -- Valid --> UpdateActive["Authorize request & touch lastActiveAt"]:::success
    SessionCheck -- Expired / 401 --> ExpiryModal["Non-destructive Re-Auth Modal<br/>Preserve in-progress booking or form context"]:::note
    ExpiryModal --> ReauthAction["Enter password or re-select demo persona"] --> ReauthSuccess["Restore session and replay pending mutation"]:::success

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
