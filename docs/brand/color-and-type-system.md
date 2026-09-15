# Practice Athletic Club Color and Type System

## Status

Exploratory reference, not an approved brand or interface system. This material extends the current logo-direction colors into accessible roles so it can be evaluated during brand definition. It does not authorize application implementation or replace component-level accessibility testing.

## Color roles

| Token | Value | Intended use |
| --- | --- | --- |
| `ink` | `#111310` | Primary text, dark fields, primary-action text |
| `bone` | `#F2F0E8` | Primary light field and inverse text on Ink |
| `surface-muted` | `#D7D4CA` | Quiet panels, dividers, inactive fills |
| `text-muted` | `#5C6159` | Secondary text only, never below 14 px |
| `signal-lime` | `#C7F134` | Progress, selected state, high-attention fill; never body text |
| `focus-forest` | `#23613F` | Focus ring and interactive emphasis |
| `success-forest` | `#1F4D32` | Confirmed booking and success messaging |
| `warning-amber` | `#7A4B00` | Cutoff and warning messaging |
| `danger-red` | `#9E2E25` | Cancellation and destructive actions |
| `info-blue` | `#245B74` | Informational status messaging |

## Contrast evidence

Ratios use WCAG relative luminance. These are candidate combinations for review, not permission to skip component or state testing.

| Foreground / background | Ratio | Approved use |
| --- | ---: | --- |
| Ink / Bone | 16.37:1 | Primary text and headings |
| Muted text / Bone | 5.56:1 | Secondary text at 14 px and above |
| Ink / Signal lime | 14.28:1 | Text inside lime buttons or selected fills |
| Focus forest / Bone | 6.45:1 | Focus outlines and linked controls |
| White / Success forest | 9.70:1 | Success badge text |
| White / Warning amber | 7.41:1 | Warning badge text |
| White / Danger red | 7.31:1 | Destructive badge text |
| White / Info blue | 7.44:1 | Informational badge text |

Do not use Bone, white, or Signal lime as text on a light field. Do not use Signal lime for body copy, thin rules, or error/success meaning on its own. Pair color state with clear language and an icon when an interface needs it.

## Mona Sans hierarchy

Mona Sans is the sole brand and future interface family. Use normal text casing for reading; the uppercase logo remains artwork and must not be reconstructed as live text.

| Role | Settings | Typical use |
| --- | --- | --- |
| Display | `wght 700–800`, `opsz 48–72`, tight tracking | Marketing headline, campaign panel |
| H1 | `wght 700`, 40/44 desktop; 32/36 mobile | Page title |
| H2 | `wght 650–700`, 28/34 desktop; 24/30 mobile | Major section title |
| H3 | `wght 650`, 20/26 | Card and module title |
| Body | `wght 400–450`, 16/24 | Primary reading text |
| Body small | `wght 450–500`, 14/20 | Supporting information; never below this for essential copy |
| Label | `wght 600`, 12/16, slight tracking | Inputs, filters, utility labels; short strings only |
| Numeric data | `wght 600`, tabular figures when available | Schedule times, capacity, waitlist position |

Use `font-variant-numeric: tabular-nums` for schedules, availability, and operational tables. Reserve all caps for compact labels such as `FULL`, `WAITLIST`, and `BOOKED`; do not use it for paragraphs or long navigation labels.

## Interface behavior rules

- Light member-facing surfaces use Bone with Ink text. Dark Ink is a deliberate campaign or high-attention surface, not the default for every screen.
- Lime signals progression, selection, or the main call to action. An Ink-filled button with Bone text remains an equal primary-action option when lime would overload a page.
- Status colors are semantic. A confirmed booking must say `Booked`; a waitlist entry must say `Waitlist`; color alone is insufficient.
- Interactive controls need a visible Focus forest outline that is at least 2 px and offset from the control edge.
- Keep text and controls on plain fields. Photography may provide atmosphere, but it must not carry essential text or availability information.

## Context tests

The current logo direction was tested in original signage, apparel, social-avatar, and booking-interface representations. See [context test board](logo/practice-context-tests.svg). This is evaluation evidence only; it does not approve the logo, palette, or hierarchy.

## Next review gate

Use the [brand definition guide](brand-definition-guide.md) to establish strategy before deciding whether to retain, revise, or replace this reference system.
