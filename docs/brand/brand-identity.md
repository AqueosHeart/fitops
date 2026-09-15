# Practice Athletic Club — Brand Identity Guidelines

## 1. Brand Core & Essence

- **Brand Name:** Practice Athletic Club
- **Everyday Name:** Practice
- **Internal Repository Codename:** FitOps *(internal only, never member-facing)*
- **Core Tagline:** *Progress is a practice.*
- **Core Brand Idea:** Treating fitness as a repeatable daily practice rather than an extreme performance reserved for athletes.

---

## 2. Strategic Positioning & Pillars

### The Central Tension
Commercial fitness is often either **chaotic and intimidating** (loud sensory overload, crowded floors, aggressive bro-culture) or **cold and transactional** (opaque booking apps, hidden rules, no coach guidance).

People want a space that feels **disciplined, welcoming, and dependable**—where showing up is straightforward and progress is treated as an everyday practice.

### Positioning Statement
> **For** individuals seeking purposeful, structured fitness in a predictable environment,
> **Practice Athletic Club** is the modern training gym
> **that** provides clear class programming, skilled coaching, and an effortless booking experience,
> **because** we treat fitness as a repeatable daily practice rather than an extreme performance.
> **Unlike** chaotic commercial gyms or exclusionary boutique studios,
> **Practice** delivers calm operational clarity, dependable schedules, and respectful guidance.

### The Customer-Facing Promise
> **"A clear place, a clear plan, and your next session ready."**

### The Three Exclusions (What Practice is NOT)
1. ✕ **No Transformation Hype or Body Shaming:** No "30-day shred" claims, aggressive before/after promises, or guilt-tripping for missed sessions.
2. ✕ **No Militaristic or Macho Culture:** No shouting drill-sergeants, performative cheering, or gatekeeping intimidation.
3. ✕ **No Hidden Operational Friction:** No fake scarcity countdowns, complicated token systems, or obscured cancellation rules.

---

## 3. Offer Architecture & Programs

We categorize classes by **training intent** rather than confusing fitness marketing terms:

| Program | Category Badge | Intent & Format | Duration & Intensity |
|---|---|---|---|
| **Practice Strength** | `[STRENGTH]` | Compound barbell and dumbbell mechanics with structured progressive overload. | 45–50 min • Moderate to High |
| **Practice Pace** | `[PACE]` | Aerobic capacity intervals, rowers, ski ergs, and dynamic bodyweight circuits. | 45 min • High |
| **Practice Reset** | `[RESET]` | Joint mobility, posterior chain decompression, and nervous system down-regulation. | 40 min • Low (Active Recovery) |
| **Practice Open Floor** | `[OPEN FLOOR]` | Supervised open practice block with coach availability for personal programs. | 60 min • Self-paced |

### Operational Norms
- **Booking Window:** Opens 7 days in advance; closes 15 minutes before session start.
- **Cancellation Rule:** Free self-service cancellation up to 2 hours prior to session start.
- **Waitlist Logic:** Automatic FIFO promotion when a spot opens. Real-time waitlist position transparency (e.g. `WAITLIST #2`).

---

## 4. Personality & Voice System

### Personality Spectrum
- **Energy:** Controlled & Focused *(steady momentum over sensory overload)*.
- **Tone:** Direct, Warm & Technical *(clear guidance, human warmth, no fitness clichés)*.
- **Progress:** Personal & Habit-driven *(celebrating showing up, no public leaderboards or body comparison)*.

### Calibration Scripts
- **First-Visit Invitation:** *"Book your first session. Meet your coach, understand the format, and start your practice."*
- **Booking Confirmation:** *"You’re confirmed for Practice Strength with Coach Marcus. Tuesday, 7:00 AM. See you on the floor."*
- **Full-Class Waitlist Notice:** *"This session is currently full. Join the waitlist at position #2—we'll confirm your spot automatically if space opens."*
- **Cancellation Confirmation (No shame):** *"Your reservation is cancelled and your spot has been passed to the next member on the waitlist. Whenever you’re ready, your next session is waiting."*
- **Coach Class Briefing:** *"Today’s session is about controlled tempo and hinge mechanics. Focus on clean movement before adding load."*

---

## 5. Master Logo System

The logo is a typography-first wordmark set in **Mona Sans Display** with optically equalized letterforms and a signature **Signal Lime progress bar** positioned under the wordmark.

### Logo Variants in Repository
1. **Primary Stacked (Light Field):** [`docs/brand/logo/practice-primary-stacked.svg`](file:///c:/Users/SEBASTIAN/Documents/Gym/docs/brand/logo/practice-primary-stacked.svg)
2. **Inverse Stacked (Dark Field):** [`docs/brand/logo/practice-primary-stacked-inverse.svg`](file:///c:/Users/SEBASTIAN/Documents/Gym/docs/brand/logo/practice-primary-stacked-inverse.svg)
3. **Horizontal Lockup (Nav & App Header):** [`docs/brand/logo/practice-horizontal-lockup.svg`](file:///c:/Users/SEBASTIAN/Documents/Gym/docs/brand/logo/practice-horizontal-lockup.svg)
4. **Compact Monogram / Favicon:** [`docs/brand/logo/practice-compact-mark.svg`](file:///c:/Users/SEBASTIAN/Documents/Gym/docs/brand/logo/practice-compact-mark.svg)

### Construction Rules
- **Clear Space:** Minimum clear space around the logo equals the height of the letter **P**.
- **Minimum Digital Size:** 32px height for wordmark; 16px for compact favicon.
- **Misuse:** Never alter letter spacing, never rotate the mark, never change the Signal Lime accent color, and never rebuild the logo using live text.

---

## 6. Color Palette & Accessible Tokens

| Token Name | Hex Code | RGB | CMYK | Role & Usage | Contrast on Bone |
|---|---|---|---|---|---|
| **Ink** | `#111310` | `17, 19, 16` | `75, 68, 67, 85` | Primary text, dark surfaces, main CTA text | 16.37:1 (AAA) |
| **Bone** | `#F2F0E8` | `242, 240, 232` | `3, 2, 6, 0` | Primary light background (warm off-white) | Baseline |
| **Signal Lime** | `#C7F134` | `199, 241, 52` | `25, 0, 85, 0` | Signature progress bar, active tabs, selected states | 14.28:1 (on Ink) |
| **Surface Muted** | `#D7D4CA` | `215, 212, 202` | `15, 12, 18, 0` | Card borders, subtle dividers, quiet panels | 1.3:1 (structural) |
| **Text Muted** | `#5C6159` | `92, 97, 89` | `55, 45, 52, 25` | Secondary timestamps, coach titles, helper text | 5.56:1 (AA) |

### Semantic State Colors
- **Success Forest (`#1F4D32`):** Confirmed reservations, spot promotions (9.7:1 on White).
- **Warning Amber (`#7A4B00`):** Full capacity notices, waitlists, approaching cutoffs (7.4:1 on White).
- **Danger Red (`#9E2E25`):** Cancellations, destructive modal actions (7.3:1 on White).
- **Focus Forest (`#23613F`):** 2px accessible focus outlines for keyboard navigation (6.5:1 on Bone).

---

## 7. Typography Hierarchy (Mona Sans)

All brand and interface typography uses **Mona Sans** with `font-variant-numeric: tabular-nums` for schedules and numerical data.

| Level | Size / Line-Height | Weight | Tracking | Primary Usage |
|---|---|---|---|---|
| **Display** | 64px / 72px | ExtraBold (800) | -3% | Hero landing headlines, campaign posters |
| **Headline 1** | 40px / 48px | Bold (700) | -2% | Primary page titles (Schedule, Profile) |
| **Headline 2** | 28px / 36px | SemiBold (650) | -2% | Section titles, modal headers |
| **Headline 3** | 20px / 28px | SemiBold (600) | -1% | Class card titles, module subheadings |
| **Body** | 16px / 24px | Regular (400) | 0% | Main reading text, class descriptions |
| **Body Small** | 14px / 20px | Regular (450) | 0% | Helper copy, fine print, timestamps |
| **Badge / Label** | 12px / 16px | Bold (700) | +5% | Uppercase status chips (`[STRENGTH]`, `[WAITLIST]`) |

---

## 8. Figma Presentation Slides

Pre-rendered vector slides matching the standard 1920×1080 Figma presentation template are available in [`docs/brand/figma/`](file:///c:/Users/SEBASTIAN/Documents/Gym/docs/brand/figma/):

- `01_cover.svg`: Cover slide
- `02_key_elements_strategy.svg`: Purpose, tension & positioning
- `03_logo_system.svg`: Light, dark, horizontal, and compact lockups
- `04_color_palette.svg`: Core swatches with RGB/HEX/CMYK and contrast
- `05_shades_and_semantic_states.svg`: Operational status states
- `06_typography_family.svg`: Mona Sans weights & character set
- `07_type_hierarchy.svg`: Sizing, tracking, and usage matrix
- `08_offer_and_ui_context.svg`: Program taxonomy and interactive class card component
- `practice-brand-presentation-master-board.svg`: Complete 8-slide master canvas
