# BloodConnect — Design System (Web Dashboard)

> Source of truth: `BloodConnect UI Kit.html` (Sign in board, Screen-states board).
> Scope: **web dashboard only.** There is no mobile app in this phase. Donor-facing patterns from the kit's mobile board are adapted to web views here. Don't build native or mobile-app screens.

## Author & Academic Context

- **Developer:** D. Lokesh Yadav (Final-Year CSE Student)
- **Project:** BloodConnect — Smart Blood Donation Portal[cite: 1]
- **Scope:** Web dashboard design tokens, component specifications, six-state data views, and role-based layouts for connecting hospitals/patients with compatible, available blood donors[cite: 1].

BloodConnect matches blood requests from hospitals with compatible, eligible donors nearby and notifies those donors. Hospital staff, donors and admins all use one web app and **one sign-in**. Role decides what they see.

---

## 1. Principles

1. **Urgency without panic.** Red is for the brand, primary actions and genuinely critical things. Everything else stays calm and neutral.
2. **Say what happened and what to do next.** Never write just "Something went wrong."
3. **Every data view designs all six states:** loading, empty (first use), empty (no results), error, success, blocked.
4. **Privacy is visible.** Patient details never leave the hospital. Donor-facing screens show the hospital, ward and location, never patient identity.
5. **One primary action per view.** Secondary actions use outline or dark buttons, never a second red button.

---

## 2. Design tokens

### 2.1 Colour

Use the names in the first column. Never hard-code hex values in components.

| Token | Hex | Use |
|---|---|---|
| **Brand / primary** | | |
| `--color-primary` | `#B3172F` | Primary buttons, links, brand mark, focus border, critical tag |
| `--color-primary-hover` | `#93112A` | Hover/pressed primary, link hover, text on primary-soft chips |
| `--color-primary-soft` | `#FDE3E5` | Filter chips, brand icon tiles |
| `--color-primary-subtle` | `#FEF2F3` | Error icon tile, error badge background |
| `--color-primary-ring` | `rgba(208, 42, 63, 0.18)` | 3px focus ring (base `#D02A3F`) |
| `--color-primary-on-dark` | `#F29BA4` | Brand-tinted icons on dark surfaces |
| **Neutrals (warm)** | | |
| `--color-ink` | `#1A1514` | Primary text, dark buttons, dark hero panel |
| `--color-ink-2` | `#3E3734` | Text on neutral badges |
| `--color-text-muted` | `#574F4B` | Body/secondary copy, icon buttons |
| `--color-text-subtle` | `#736A66` | Captions, helper text, meta, dividers-with-text |
| `--color-placeholder` | `#9A918C` | Input placeholder |
| `--color-bg` | `#F6F4F3` | App/page background |
| `--color-surface` | `#FFFFFF` | Cards, panels, inputs |
| `--color-surface-sunken` | `#FBFAF9` | Table header row |
| `--color-neutral-soft` | `#EDEAE8` | Row dividers, neutral badge bg, skeleton base, empty progress segment |
| `--color-border` | `#E4DFDC` | Card/panel borders, divider lines |
| `--color-border-strong` | `#C3BCB8` | Input borders, outline buttons, dashed callouts |
| `--color-dark-2` | `#2A2422` | Decorative shapes on dark panels |
| `--color-on-dark-muted` | `#C9C1BD` | Secondary text on `ink` panels |
| **Success** | | |
| `--color-success` | `#1F7A4D` | Success text/icon, "on" switch, completed step |
| `--color-success-soft` | `#E7F4EC` | Success badge/icon bg |
| `--color-success-halo` | `#F3FAF6` | 10px halo ring around the success icon |
| `--color-on-success-muted` | `#D4EEDF` | Secondary text on success banner |
| **Warning / pending** | | |
| `--color-warning` | `#8A5300` | Warning text/icon ("Under review") |
| `--color-warning-mid` | `#D08A1E` | Current in-progress step segment |
| `--color-warning-soft` | `#FFF3DC` | Warning badge/icon bg |
| **Info** | | |
| `--color-info` | `#1F5FAD` | Info/loading badge text |
| `--color-info-soft` | `#E8F0FB` | Info badge bg |

**Rules**
- Red means *brand, primary action or critical*. Don't use it for decoration or for plain "error" styling on non-urgent things when neutral copy will do.
- Status always pairs colour with text or an icon. Never rely on colour alone.
- Neutrals are warm (red-brown undertone). Don't mix in cool greys like `#6B7280`.
- **Dark mode is not defined in the kit.** Ship light only for now.

### 2.2 Typography

| Family | Weights | Role |
|---|---|---|
| **Bricolage Grotesque** | 500, 600, 700 | Display: wordmark, page titles, hero, empty-state titles, card headlines |
| **IBM Plex Sans** | 400, 500, 600 | UI and body (default `font-family` on `body`) |
| **IBM Plex Mono** | 400, 500 | IDs, error refs, blood-group badges, codes |

```css
--font-display: 'Bricolage Grotesque', sans-serif;
--font-sans: 'IBM Plex Sans', system-ui, sans-serif;
--font-mono: 'IBM Plex Mono', ui-monospace, monospace;