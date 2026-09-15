# FitOps UX & User Flow Specification

## Experience Principle

The design must make the next action obvious, expose real product state, and eliminate hidden friction. Visual polish supports the athletic workflow; it does not replace it.

---

## 1. Information Architecture & Sitemap

```mermaid
graph TD
    classDef public fill:#F2F0E8,stroke:#111310,stroke-width:1.5px,color:#111310;
    classDef member fill:#E2E0D8,stroke:#111310,stroke-width:1.5px,color:#111310;
    classDef admin fill:#111310,stroke:#C7F134,stroke-width:1.5px,color:#F2F0E8;
    classDef modal fill:#FFFFFF,stroke:#8B5CF6,stroke-dasharray: 4 4,stroke-width:1.5px,color:#111310;

    subgraph PublicSpace ["01. Public Experience (Visitor)"]
        Home["🏠 Home (Landing Page)<br/>• Hero & Value Prop<br/>• Program Taxonomy Guide<br/>• Live Schedule Preview"]:::public
        Programs["📋 Programs Guide (/programs)<br/>• Strength, Pace, Reset, Open Floor<br/>• Intensity Ratings & Equipment"]:::public
        PublicSchedule["📅 Public Schedule (/schedule)<br/>• 7-Day Date Strip<br/>• Program Filter & Legend"]:::public
        Trainers["🏋️ Trainers Roster (/trainers)<br/>• Coach Bios & Specialties"]:::public
    end

    subgraph GlobalOverlays ["02. Global Overlays & Drawers"]
        AuthModal["🔑 Demo Auth & Role Switcher<br/>• Fictional Demo Profiles<br/>• Preserves Selected Session Intent"]:::modal
        SessionDrawer["📄 Session Details Drawer (/sessions/:id)<br/>• Workout Focus & Intensity<br/>• 2h Cutoff Policy Notice<br/>• Membership Gating & Single CTA"]:::modal
        CancelModal["⚠️ Cancellation Confirmation Dialog<br/>• Cutoff Check & Warning<br/>• Waitlist Auto-Transfer Notice"]:::modal
    end

    subgraph MemberSpace ["03. Member Experience (Authenticated)"]
        MemberSchedule["📅 Interactive Schedule (/schedule)<br/>• Live Occupancy Meters<br/>• Real-time Booking Engine"]:::member
        MyBookings["🎫 My Bookings (/my-bookings)"]:::member
        ConfirmedPasses["• Confirmed Passes & Pass QR"]:::member
        WaitlistQueue["• FIFO Waitlist Position Tracker"]:::member
        MembershipStatus["💳 Membership & Passes Tab<br/>• Active All-Access Status"]:::member
    end

    subgraph AdminSpace ["04. Operations & Admin (Staff)"]
        AdminOverview["📊 Operations Overview (/admin)<br/>• Occupancy % & Active Waitlists"]:::admin
        AdminSessions["🗓️ Session Manager (/admin/sessions)<br/>• High-Density Schedule Table<br/>• Quick Capacity & Trainer Editor"]:::admin
        AdminRoster["👥 Attendee & Waitlist Roster (/admin/sessions/:id/roster)<br/>• Check-in & Promotion History"]:::admin
    end

    Home --> Programs
    Home --> PublicSchedule
    Home --> Trainers

    PublicSchedule --> SessionDrawer
    MemberSchedule --> SessionDrawer
    SessionDrawer --> AuthModal

    AuthModal --> MemberSchedule
    AuthModal --> MyBookings
    AuthModal --> AdminOverview

    MyBookings --> ConfirmedPasses
    MyBookings --> WaitlistQueue
    MyBookings --> MembershipStatus

    ConfirmedPasses --> CancelModal

    AdminOverview --> AdminSessions
    AdminSessions --> AdminRoster
```

---

## 2. Critical User Flows

### Flow 1: Visitor Discovery $\rightarrow$ Auth $\rightarrow$ Membership $\rightarrow$ Booking / Waitlist

Addresses first-time visitor program education, context-preserving authentication, gym membership gating, and deterministic FIFO waitlist assignment.

```mermaid
flowchart TD
    Start([Visitor lands on Home or Schedule]) --> Educate[Explore Program Taxonomy & Intensity on Landing Page]
    Educate --> Browse[Open Schedule & Filter by Date / Program]
    Browse --> SelectClass[Click on 07:00 AM Lower Body Tempo]
    SelectClass --> OpenDrawer[Open Session Details Drawer with Class Info]

    OpenDrawer --> CheckAuth{Is Visitor Authenticated?}

    CheckAuth -- "No (Guest)" --> OpenAuthModal[Open Demo Auth Modal<br/>Preserve selected session ID]
    OpenAuthModal --> SelectDemoUser[Select Demo Profile: Alex Rivera]
    SelectDemoUser --> CheckMembership

    CheckAuth -- "Yes (Logged In)" --> CheckMembership{Has Active Gym Membership?}

    CheckMembership -- "No / Expired" --> ShowPaywall[Show 'Active Membership Required'<br/>CTA: Activate Demo Pass]
    ShowPaywall --> ActivatePass[Click 'Activate Demo Pass'] --> CheckSpots

    CheckMembership -- "Yes (Active)" --> CheckSpots{Are Spots Available?}

    CheckSpots -- "Yes (Spots > 0)" --> ClickBook[Click 'Book Session']
    ClickBook --> CheckOverlap{Time Conflict with Existing Booking?}

    CheckOverlap -- "Conflict (Overlap)" --> ShowOverlapError[❌ Show Error: Time Overlap with another reservation]
    CheckOverlap -- "No Conflict" --> ConfirmBooking[✅ Booking Confirmed in Database]
    ConfirmBooking --> ShowSuccessToast[Show Success Modal & Add to My Bookings]
    ShowSuccessToast --> RedirectConfirmed[View in My Bookings • Confirmed Tab]

    CheckSpots -- "No (Capacity Full)" --> ClickWaitlist[Click 'Join FIFO Waitlist']
    ClickWaitlist --> CheckInWaitlist{Already in Queue?}
    CheckInWaitlist -- "Yes" --> ShowAlreadyInQueue[Notice: Already in Waitlist queue]
    CheckInWaitlist -- "No" --> ConfirmWaitlist[⏳ Joined Waitlist: Position #X assigned]
    ConfirmWaitlist --> RedirectWaitlist[View in My Bookings • Waitlist Tab]
```

---

### Flow 2: Reservation Cancellation & Automatic FIFO Waitlist Promotion

Proves server-side transactional integrity, 2-hour cancellation cutoff enforcement, and automatic promotion of the next eligible waitlisted member.

```mermaid
flowchart TD
    StartCancel([Member opens 'My Bookings']) --> ViewActivePasses[View Active Confirmed Reservations]
    ViewActivePasses --> ClickCancel[Click 'Cancel Booking']
    ClickCancel --> CheckCutoff{Is cancellation within 2h Cutoff Window?}

    CheckCutoff -- "Yes (Past Cutoff)" --> LockCancel[❌ Cancellation Locked<br/>Policy: Free cancellations close 2h before start]
    CheckCutoff -- "No (Eligible)" --> OpenDialog[Open Cancellation Warning Dialog<br/>Notice: Spot will transfer to next in line]

    OpenDialog --> Decision{User Choice}
    Decision -- "Keep Spot" --> AbortCancel[Close Dialog • Reservation Retained]
    Decision -- "Confirm Cancel" --> ServerTransaction[Execute Atomic Database Transaction]

    ServerTransaction --> CheckQueue{Is Waitlist Queue > 0?}
    CheckQueue -- "Yes (Members Waiting)" --> AutoPromote[⚡ Automatically Promote #1 in Waitlist to Confirmed Spot]
    CheckQueue -- "No (Queue Empty)" --> IncrementCapacity[+1 Spot Released to General Schedule Capacity]

    AutoPromote & IncrementCapacity --> UpdateUI[Update My Bookings List & Show Success Toast]
```

---

### Flow 3: Administrator Schedule & Roster Operations

Allows gym staff to monitor real-time occupancy, edit capacity limits, reassign coaches, and review chronological waitlists.

```mermaid
flowchart TD
    AdminStart([Staff signs in as Morgan Vance - Admin]) --> AdminDash[Operations Overview Dashboard]
    AdminDash --> ViewKPIs[Review Today's Bookings: 42/48 • Waitlist Count: 5]
    ViewKPIs --> OpenSessionTable[Open Session Management Table]
    OpenSessionTable --> SelectSession[Select 07:00 AM Lower Body Tempo]
    SelectSession --> OpenRosterDrawer[Open Session Roster & Edit Drawer]

    OpenRosterDrawer --> AdminAction{Action Selected}
    AdminAction -- "Edit Capacity" --> AdjustCap[Change Max Spots e.g. 12 to 14]
    AdminAction -- "Reassign Coach" --> ChangeTrainer[Assign Trainer Marcus Vance]
    AdminAction -- "Inspect Waitlist" --> ViewQueueOrder[Review Chronological FIFO Waitlist Order]

    AdjustCap & ChangeTrainer --> SaveSession[Save Changes]
    SaveSession --> LiveSync[⚡ Real-time Sync to Public & Member Schedules]
```

---

## 3. Required Page States

Every interactive page must design these states before implementation:

- **Loading**: Skeleton pulse placeholders matching component dimensions.
- **Empty**: Informative empty states (e.g. *"No sessions scheduled on this date"*, *"You have no active reservations"*).
- **Ready**: Complete interactive loaded state.
- **Validation Error**: In-line field validation and conflict notices (e.g., time overlap).
- **Authorization Failure**: Role-gated redirect or prompt (e.g. member attempting to access `/admin`).
- **Server Failure**: Resilient retry banner with actionable guidance.
- **Success Confirmation**: Toast or modal confirmation for booked, waitlisted, and cancelled sessions.
- **Mobile Layout**: Responsive single-column layout optimized for 390px viewports.

---

## 4. Program Taxonomy & Offer Pillars

- **`[STRENGTH]`**: Heavy compound lifting, tempo intervals, 50 min.
- **`[PACE]`**: Aerobic conditioning, ergometer intervals, 45 min.
- **`[RESET]`**: Mobility, breathwork, myofascial recovery, 45 min.
- **`[OPEN FLOOR]`**: Self-directed athletic training with staff supervision.

---

## 5. Visual Artifact Exports

Stand-alone export files are stored in `docs/design/`:
- `docs/design/sitemap.mmd` & `docs/design/sitemap.svg`
- `docs/design/user-flow-booking.mmd` & `docs/design/user-flow-booking.svg`
- `docs/design/user-flow-cancellation.mmd` & `docs/design/user-flow-cancellation.svg`
- `docs/design/user-flow-admin.mmd` & `docs/design/user-flow-admin.svg`
