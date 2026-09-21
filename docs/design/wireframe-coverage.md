# Wireframe coverage

Derived from draw.io Page 08. Each scenario is rendered at 1440 px desktop and 390 px mobile. Output uses 27 separate route pages with top-level frames. Native reactions connect different frames on the same page; the plugin chooser opens other routes. These are editable mockups with preset fictional prototype transitions, not live application functions.

| Route | Sections | Additional states |
| --- | --- | --- |
| `/` | Your next session starts here.; Programs for your week; Upcoming sessions; Services; Facilities; Fictional membership plans; Meet the team; Contact and visit; Make time for your first session.; Your demo privacy | noticeDismissed, signedOut |
| `/programs` | Explore all programs; New to a program? | loading, empty, error |
| `/schedule` | Find a session; Tuesday, September 22 · club local time; Browse the week | loading, empty, error, filtered |
| `/sessions/:id` | Lower Body Tempo; What to expect; Trainer and equipment; Ready to attend? | full, unavailable, loading, error, reset |
| `/trainers` | Our trainers; Train with the team | loading, empty, error |
| `/pricing` | Membership comparison; What the demo includes; Common questions | None |
| `/about` | Our story; How we approach training; The fictional team; The club experience | None |
| `/terms` | Fictional portfolio notice; Document overview; Demo membership; Reservations; Waitlist; Cancellation and cutoffs; Club etiquette; Questions; Related information | None |
| `/privacy` | Fictional portfolio notice; Document overview; Fictional data only; Account and reservation data; Cookies; Visibility; Consent and readiness; Questions and preferences; Related information | None |
| `/waiver` | Fictional portfolio notice; Document overview; Participation information; Readiness acknowledgement; Sample release; Where acknowledgement happens; Related information | None |
| `/cookie-settings` | Essential session cookies; Display preferences; No advertising preferences | changed, savedOff, saved |
| `/join` | Choose your demo plan; Already a member?; Before you continue | base, complete, training, intent, fullIntent, resetIntent |
| `/register` | Account details; Review and consent; Complete your enrollment | base, complete, training, intent, fullIntent, validation, consentMissing, existingEmail, planMissing, error, resetbase, resetcomplete, resettraining, intentbase, intentcomplete, intenttraining, fullIntentbase, fullIntentcomplete, fullIntenttraining, submitting |
| `/portal/login` | Demo account; Try a demo persona; New to Practice? | intent, fullIntent, invalid, locked, error, resetIntent, submitting |
| `/auth/forgot-password` | Recovery request; Need immediate demo access? | sent, validation, limited, submitting |
| `/app` | Your membership; Your next class; Your waitlist; Plan your week | loading, empty, error, inactive |
| `/app/schedule` | Find a session; Tuesday, September 22 · club local time; Browse the week | loading, empty, error, filtered, details, full, confirmed, waitlisted, waiver, duplicate, alreadyWaiting, overlap, cutoff, spotOpened, inactive, forbidden, expired, failed, resetDetails, submitting, joining |
| `/app/bookings` | Upcoming confirmed reservations; Waitlist entries | loading, empty, error, waiting, cancel, cancelled, remaining, cancelCutoff, cancelError, leave, left, promoted, promotedCancel, leaveError, resetConfirmed, resetCancel, resetCancelled, cancelling |
| `/app/profile/security` | Demo profile; Membership; Consent record; Current session | inactive, loading, error |
| `/trainer/sessions` | Filter assignments; Upcoming assignments; Trainer access | loading, empty, error, filtered, denied |
| `/trainer/sessions/:id` | Lower Body Tempo; Class preparation; Attendance overview | loading, error, denied, foundations |
| `/admin` | Today at the club; Session occupancy; Manage the schedule | loading, empty, error, denied |
| `/admin/sessions` | Filter sessions; Scheduled sessions; Result navigation | loading, empty, error, filtered |
| `/admin/sessions/new` | Session details; Before saving | validation, overlap, error, saved, submitting |
| `/admin/sessions/:id/edit` | Current occupancy; Session details; Scheduling safeguards | validation, overlap, error, saved, capacity, memberConflict, submitting |
| `/admin/sessions/:id/participants` | Session summary; Confirmed members; Ordered waitlist; Session actions | loading, empty, error, pace |
| `/404` | Find your way back | None |
