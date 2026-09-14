# FitOps UX Plan

## Experience principle

The design must make the next action obvious and expose real product state. Visual polish supports the workflow; it does not replace it.

## Information architecture

```text
Public
├── Home
├── Programs
├── Schedule
├── Trainers
└── Demo sign in

Member
├── Schedule
├── Session details
├── My bookings
└── Account

Administrator
├── Operations overview
├── Sessions
├── Session editor
└── Attendance and waitlist
```

## Critical journey

```text
Landing page
  -> Browse schedule
  -> Open session
  -> Sign in as demo member
  -> Book or join waitlist
  -> See confirmed result
  -> Review in My bookings
  -> Cancel
  -> Capacity or waitlist updates
```

## Required page states

Every interactive page must design these states before implementation:

- Loading
- Empty
- Ready
- Validation error
- Authorization failure
- Server failure with retry guidance
- Success confirmation
- Mobile layout

## Page responsibilities

### Home

- Communicate the fictional gym's audience and value proposition
- Show three program categories
- Preview upcoming sessions from the same data source as the application
- Explain the demo and link directly to sign in

### Schedule

- Present sessions by date with accessible filters
- Show trainer, start time, duration, intensity, capacity, and status
- Preserve filters in the URL where practical

### Session details

- Explain what the class is and who leads it
- Display availability and booking cutoff
- Present exactly one primary action based on state: book, join waitlist, cancel, or unavailable

### My bookings

- Separate confirmed bookings and waitlist entries
- Explain position and promotion behavior
- Allow cancellation with a clear confirmation step

### Administrator sessions

- Optimize for scanning and editing rather than marketing aesthetics
- Show occupancy, trainer, time, status, and actionable validation errors

## Design system direction

- Premium but restrained fitness identity
- Neutral dark text, warm off-white surfaces, and one high-contrast accent
- Clear typographic hierarchy with readable body sizes
- Reusable buttons, fields, status badges, cards, tables, dialogs, and feedback messages
- WCAG-aware contrast, keyboard navigation, visible focus, form labels, and reduced-motion support
- No autoplay video, fake testimonials, unsupported claims, or fabricated performance metrics

## Prototype gate

Implementation begins only after low-fidelity versions exist for Home, Schedule, Session details, My bookings, and Administrator sessions, including mobile layouts and error states.
