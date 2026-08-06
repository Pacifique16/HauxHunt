# HauxHunt Design System — Color & Typography

**Status:** Awaiting approval. Colour and typography only.
**Supersedes:** the navy / royal-blue / violet palette in `Visual-Design-Bible.md` §1–§5 and `website-implementation-brief.md` §7–§8, and the Inter typeface decision of 2026-08-05.
**Not in scope:** hero, navigation, or any other interface redesign. Layout, spacing, motion, glass, photography and component dialects are untouched by this pass.

---

> **⚠ Background changed to white (2026-08-06).** The site now renders in the
> **Paper** context — `<body class="theme-paper">` — with `--bg-canvas` set to
> pure `#FFFFFF`. Dark Green is no longer the page background; it is now the
> primary _text_ colour and the tint behind surfaces and atmosphere.
>
> The consequence to know: **neither brand green is usable on white.** Martian
> Green is 1.90:1 there and Lime is 1.18:1. Every role that depended on them
> substitutes to **Martian 800 `#506B19`** — primary actions, the focus ring,
> brand text, and the intelligence/parsing highlight. Lime therefore does not
> currently appear anywhere in the interface. §3's Paper column is the live
> spec; the Dark column is retained for the dark surfaces still to come.

## 1. The four official colors

| Role               | Name          | Hex       | HSL             |
| ------------------ | ------------- | --------- | --------------- |
| Primary brand      | Martian Green | `#99CC33` | `80° 60% 50%`   |
| Primary background | Dark Green    | `#003333` | `180° 100% 10%` |
| Surface            | Carbon        | `#171717` | `0° 0% 9%`      |
| Accent             | Lime          | `#C6FF34` | `77° 100% 60%`  |

Every other value in this system is derived from these four. The two greens sit 3° apart in hue and are separated by saturation and luminance, not by hue — which is exactly why the usage rules in §6 are not optional.

---

## 2. Primitive ramps

Ramps are generated on each source color's own hue so tints and shades never drift off-brand. **Primitives are never referenced directly from a component** — they exist so a future palette change is one edit, not a thousand.

### Martian Green — `hsl(80 60% L)`

| Step    | Hex       | Notes                                        |
| ------- | --------- | -------------------------------------------- |
| 50      | `#F7FBEF` |                                              |
| 100     | `#EBF5D6` |                                              |
| 200     | `#D6EBAD` |                                              |
| 300     | `#C2E085` |                                              |
| 400     | `#ADD65C` | primary-action hover on dark                 |
| **500** | `#99CC33` | **the brand color** — primary action on dark |
| 600     | `#80AB2B` | primary-action pressed on dark               |
| 700     | `#698C21` |                                              |
| 800     | `#506B19` | lowest step that passes AA as text on light  |
| 900     | `#374912` |                                              |
| 950     | `#222D0B` |                                              |

### Lime — `hsl(77 100% L)`

| Step    | Hex       | Notes                                    |
| ------- | --------- | ---------------------------------------- |
| 50      | `#F9FFEB` |                                          |
| 100     | `#F3FFD6` |                                          |
| 200     | `#E9FFB3` |                                          |
| 300     | `#DBFF80` |                                          |
| 400     | `#D1FF5C` |                                          |
| **500** | `#C6FF34` | **the accent** — focus, success, parsing |
| 600     | `#A8E212` |                                          |
| 700     | `#7CA512` |                                          |
| 800     | `#59760F` | success on light contexts                |
| 900     | `#36470A` |                                          |

### Dark Green — `hsl(180 …)`

| Step    | Hex       | Notes                             |
| ------- | --------- | --------------------------------- |
| 50      | `#F0FAFA` | light-context canvas              |
| 100     | `#D9F2F2` |                                   |
| 200     | `#B3E6E6` |                                   |
| 300     | `#75D1D1` | informational status on dark      |
| 400     | `#37BEBE` |                                   |
| 500     | `#1A9393` |                                   |
| 600     | `#0D7777` |                                   |
| 700     | `#055C5C` | informational status on light     |
| 800     | `#004747` | tinted section band on canvas     |
| **900** | `#003333` | **the page background**           |
| 950     | `#001A1A` | deepest band; text on brand fills |

### Carbon — neutral

`0 #FFFFFF` · `50 #F4F4F4` · `100 #E4E4E4` · `200 #C9C9C9` · `300 #A3A3A3` · `400 #7A7A7A` · `500 #575757` · `600 #3D3D3D` · `700 #2E2E2E` · `800 #212121` · **`900 #171717`** · `950 #0B0B0B`

### Mist — the on-dark text scale

Dark-Green-tinted neutrals at 10–16% saturation. One ramp serves both dark surfaces: the 180° tint reads as deliberate against Dark Green and is imperceptible against Carbon. Pure grey on Dark Green looks like a mistake; this is the fix.

| Step | Hex       | Purpose                                        |
| ---- | --------- | ---------------------------------------------- |
| 100  | `#E7EFEF` | high-emphasis secondary text                   |
| 200  | `#CAD8D8` | secondary text                                 |
| 300  | `#A8BDBD` | tertiary text                                  |
| 400  | `#819C9C` | **floor for body text** — 4.71:1 on Dark Green |
| 500  | `#6E9191` | **floor for interactive borders** — 4.02:1     |
| 600  | `#5C7070` | disabled only — WCAG-exempt, never body text   |

### Signal hues

The only non-brand hues in the system. Success is Lime, so these cover the rest.

| Token              | Hex       |
| ------------------ | --------- |
| warning (dark ctx) | `#FFC34D` |
| warning (light)    | `#A86F00` |
| danger (dark ctx)  | `#FF6C5C` |
| danger (light)     | `#B32B1C` |
| info (dark ctx)    | `#75D1D1` |
| info (light)       | `#055C5C` |

---

## 3. Semantic roles

The layer components actually consume. Default context is **dark**; the light ("Paper") context is a scoped opt-in, not a user-toggleable theme.

### Background

| Token                 | Dark                | Paper               | Use                          |
| --------------------- | ------------------- | ------------------- | ---------------------------- |
| `--bg-canvas`         | `#003333`           | `#F0FAFA`           | page background              |
| `--bg-canvas-deep`    | `#001A1A`           | `#D9F2F2`           | footer, deepest full-bleed   |
| `--bg-canvas-raised`  | `#004747`           | `#FFFFFF`           | tinted section band          |
| `--bg-surface`        | `#171717`           | `#FFFFFF`           | cards, panels, sheets        |
| `--bg-surface-raised` | `#212121`           | `#FFFFFF`           | popover, menu, elevated card |
| `--bg-surface-sunken` | `#0B0B0B`           | `#E7EFEF`           | wells, insets, code          |
| `--bg-inverse`        | `#F0FAFA`           | `#003333`           | opposite-context island      |
| `--bg-overlay`        | `rgba(0,26,26,.72)` | `rgba(0,26,26,.48)` | modal scrim                  |
| `--bg-subtle`         | white 4%            | dark 4%             | hover wash, zebra rows       |
| `--bg-muted`          | white 8%            | dark 7%             | input rest, disabled fill    |

### Foreground

| Token              | Dark      | on Dark Green           | on Carbon | Paper     | on Paper              |
| ------------------ | --------- | ----------------------- | --------- | --------- | --------------------- |
| `--text-primary`   | `#FFFFFF` | **13.80:1**             | 17.93:1   | `#003333` | 12.99:1               |
| `--text-secondary` | `#CAD8D8` | **9.42:1**              | 12.23:1   | `#055C5C` | 7.34:1                |
| `--text-tertiary`  | `#A8BDBD` | **7.02:1**              | 9.12:1    | `#575757` | 6.80:1                |
| `--text-muted`     | `#819C9C` | **4.71:1**              | 6.12:1    | `#575757` | 6.80:1                |
| `--text-disabled`  | `#5C7070` | exempt                  | exempt    | `#7A7A7A` | exempt                |
| `--text-brand`     | `#99CC33` | **7.26:1**              | 9.42:1    | `#506B19` | 5.71:1                |
| `--text-accent`    | `#C6FF34` | **11.67:1**             | 15.16:1   | `#506B19` | 5.71:1                |
| `--text-on-brand`  | `#001A1A` | 9.50:1 on Martian Green |           | `#FFFFFF` | 6.07:1 on Martian 800 |
| `--text-on-accent` | `#001A1A` | 15.27:1 on Lime         |           | `#001A1A` | —                     |

Every value above clears WCAG 2.1 AA for normal text (4.5:1). `--text-muted` is the floor: nothing dimmer than Mist 400 may carry body copy.

### Border

| Token                  | Dark               | Paper     | Use                                     |
| ---------------------- | ------------------ | --------- | --------------------------------------- |
| `--border-subtle`      | white 8%           | dark 8%   | decorative hairline only                |
| `--border-default`     | white 14%          | dark 14%  | card / panel edge                       |
| `--border-strong`      | white 24%          | dark 26%  | emphasis divider                        |
| `--border-interactive` | `#6E9191` (4.02:1) | `#0D7777` | **required** on real control boundaries |
| `--border-brand`       | `#99CC33`          | `#506B19` |                                         |
| `--border-accent`      | `#C6FF34`          | `#506B19` |                                         |

> **The white-alpha borders do not meet WCAG 1.4.11.** `rgba(255,255,255,.24)` on Dark Green composites to 2.11:1 — below the 3:1 required for the visual boundary of an active control. Inputs, selects, checkboxes and radios must use `--border-interactive`. The alpha values are for decorative separation only.

### Action

| Token                     | Dark      | Paper     |
| ------------------------- | --------- | --------- |
| `--action-primary`        | `#99CC33` | `#506B19` |
| `--action-primary-hover`  | `#ADD65C` | `#374912` |
| `--action-primary-active` | `#80AB2B` | `#222D0B` |
| `--action-primary-fg`     | `#001A1A` | `#FFFFFF` |

On dark, hover **brightens**; darkening a fill against a dark canvas reads as the control switching off. On Paper the direction inverts.

### Focus

One focus color sitewide, applied via `:focus-visible` in the base layer as a 2px ring with 2px offset.

| Context | Ring      | Contrast vs canvas |
| ------- | --------- | ------------------ |
| Dark    | `#C6FF34` | **11.67:1**        |
| Paper   | `#506B19` | **4.43:1**         |

> Lime is unusable as a focus ring on light backgrounds — `#C6FF34` on `#F0FAFA` is **1.18:1**, far below the 3:1 non-text minimum. This is the one place the accent is substituted rather than re-mapped.

### Status

| Role    | Dark      | on Dark Green | Paper     |
| ------- | --------- | ------------- | --------- |
| success | `#C6FF34` | 11.67:1       | `#59760F` |
| warning | `#FFC34D` | 8.65:1        | `#A86F00` |
| danger  | `#FF6C5C` | 4.96:1        | `#B32B1C` |
| info    | `#75D1D1` | 7.76:1        | `#055C5C` |

Each ships with a matched `-bg` (12% tint) and `-border` (32% tint).

### Intelligence

Lime's second job: marking machine-derived evidence — parsed query fragments, match confidence, "why this matches" reasoning. It marks evidence; it never asserts "AI".

`--intel-highlight` `#C6FF34` · `--intel-highlight-bg` Lime 10% · `--intel-highlight-border` Lime 30% · `--intel-unclear` `#FFC34D` (low-confidence parse, always paired with an icon and text, never colour alone).

### Elevation

Dark UI: shadow grounds, glow signifies. Never both at full strength on one element.

`--elevation-xs` → `--elevation-lg` (black 30% → 45%, 2px → 48px blur) · `--glow-brand` `0 0 28px rgba(153,204,51,.22)` · `--glow-accent` `0 0 28px rgba(198,255,52,.20)`

---

## 4. Typography

**Family: Aether, sans-serif.** One family carries the entire system — display weight for statements, regular for body. No display/body pairing, no decorative secondary.

Full stack: `"Aether", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

**Weights — four, and no more:** 400 Regular · 500 Medium · 600 Semibold · 700 Bold.

### The scale

| Token          | Size (min → max) | Line height | Weight | Tracking |
| -------------- | ---------------- | ----------- | ------ | -------- |
| **Display XL** | 44 → **72px**    | 1.06 (76px) | 700    | −0.030em |
| **Display L**  | 36 → **60px**    | 1.07 (64px) | 700    | −0.028em |
| **Display M**  | 32 → **48px**    | 1.13 (54px) | 700    | −0.024em |
| **Heading XL** | 28 → **40px**    | 1.15 (46px) | 600    | −0.020em |
| **Heading L**  | 24 → **32px**    | 1.25 (40px) | 600    | −0.018em |
| **Heading M**  | **24px**         | 1.33 (32px) | 600    | −0.014em |
| **Heading S**  | **20px**         | 1.40 (28px) | 600    | −0.010em |
| **Body L**     | **18px**         | 1.67 (30px) | 400    | −0.002em |
| **Body M**     | **16px**         | 1.63 (26px) | 400    | 0        |
| **Body S**     | **14px**         | 1.57 (22px) | 400    | +0.002em |
| **Label**      | **13px**         | 1.23 (16px) | 500    | +0.040em |
| **Caption**    | **12px**         | 1.50 (18px) | 400    | +0.010em |

**Reasoning behind the numbers.**

- **Tracking tightens as size grows and loosens as it shrinks.** At 72px, −0.03em closes the optical gaps that make large type look loose and cheap; at 13px, +0.04em keeps a Label legible. This inverse relationship is the single most important rule in the scale.
- **Line height loosens as size shrinks.** Display sits near 1.06 because large type needs almost no leading to hold together; Body L opens to 1.67 because long-form reading needs air. Calm confidence is mostly leading.
- **Weight is bound to the token, not chosen per use.** Display is always 700, Headings always 600, Body always 400, Label always 500. There is no way to apply a size without its correct weight.
- **The Display → Heading jump is deliberate and large** (72 → 40px). Big jumps read as confident hierarchy; gradual steps read as indecision.
- **12px is the smallest permitted size anywhere,** including Caption. Nothing goes below it.

**Fluid sizing.** Display XL/L/M and Heading XL/L use `clamp()` and reach maximum at ~960px viewport, so no per-breakpoint override is ever needed. Heading M and below are fixed — body copy that shrinks on small screens is a readability failure, not a responsive feature.

**Usage.** Display for hero and section statements only, one per screen. Heading XL/L for section titles, M/S for card and subsection titles. Body M is the default. Label for eyebrows, form labels and chips (uppercase optional — the +0.04em tracking is tuned for it). Caption for metadata, timestamps and footnotes.

---

## 5. Implementation

### CSS variables — `src/app/globals.css`

Three layers, in order:

1. **Primitives** — `--martian-*`, `--lime-*`, `--deep-*`, `--carbon-*`, `--mist-*`, `--signal-*`.
2. **Semantic roles** — `--bg-*`, `--text-*`, `--border-*`, `--action-*`, `--focus-*`, `--status-*`, `--intel-*`, `--elevation-*`. Dark is `:root`; Paper is `.theme-paper`.
3. **shadcn/Radix bridge** — `--background`, `--primary`, `--ring`, etc. mapped onto layer 2 so vendor primitives inherit the brand without being re-skinned individually.

### Tailwind v4 theme tokens — `@theme inline`

Colour utilities. Background roles keep their own names; foreground roles are prefixed `fg-` so they never collide with Tailwind's `text-*` size utilities:

```
bg-canvas   bg-canvas-deep   bg-canvas-raised   bg-surface   bg-surface-raised
bg-surface-sunken   bg-inverse   bg-subtle   bg-wash   bg-overlay

text-fg   text-fg-secondary   text-fg-tertiary   text-fg-muted   text-fg-disabled
text-fg-brand   text-fg-accent   text-fg-on-brand   text-fg-on-accent   text-fg-inverse

border-border-subtle   border-border-default   border-border-strong
border-border-interactive   border-border-brand   border-border-accent

bg-action-primary   bg-action-primary-hover   bg-action-primary-active
bg-action-primary-subtle   text-focus

text-success   bg-success-bg   border-success-border      (also warning / danger / info)
text-intel     bg-intel-bg     border-intel-border        text-intel-unclear

shadow-e-xs   shadow-e-sm   shadow-e-md   shadow-e-lg
shadow-glow-brand   shadow-glow-accent
```

Primitive ramps are also exposed (`bg-martian-500`, `text-mist-300`, `bg-deep-900`, …) for the rare case a semantic role genuinely doesn't fit — but reaching for one is a signal that a role is missing.

Typography utilities carry size, line-height, tracking **and** weight in a single class, so a size can't be applied without its correct metrics:

```
text-display-xl   text-display-l   text-display-m
text-heading-xl   text-heading-l   text-heading-m   text-heading-s
text-body-l       text-body-m      text-body-s
text-label        text-caption
```

### Font loading

Aether is not available through `next/font/google`, so it is declared as a plain family in `--font-sans` rather than injected as a font variable. `next/font` and the Inter import are gone from `src/lib/fonts.ts` and `src/app/layout.tsx`.

**Open item — the webfont files do not exist in this repo.** Until they land, the stack falls through to the system UI sans and the interface will not render in Aether. To finish:

1. Add `aether-{regular,medium,semibold,bold}.woff2` to `public/fonts/`.
2. Uncomment the `@font-face` block at the top of `globals.css`.

The fallback chain is ordered for metric proximity so the eventual swap does not shift layout (CLS budget < 0.1).

### Figma Variables

`docs/design/figma-variables.json` — three collections (`HauxHunt/Primitives`, `HauxHunt/Semantic` with Dark + Paper modes, `HauxHunt/Typography`), importable via any Figma Variables import plugin. Aliases in the Semantic collection point at Primitives, mirroring the CSS exactly, so a primitive edit propagates in Figma the same way it does in code.

---

## 6. Usage rules

These are the rules that keep two adjacent greens from reading as an accident.

1. **Dark Green and Carbon dominate.** In any full screenshot, the overwhelming majority of pixels are Dark Green, Carbon, or a Mist neutral.
2. **Martian Green is for primary actions, and little else.** At most one Martian-filled element per viewport. If two are competing, one is wrong.
3. **Lime has exactly four jobs:** focus rings, success state, intelligent parsing / match evidence, and subtle highlight. It is never a background fill, never decoration, never a large area.
4. **Brand green and accent lime never carry the same meaning.** Martian = "do this". Lime = "this is a state, or this is machine-derived evidence". They must never appear as interchangeable greens on the same surface.
5. **Colour is never the only signal.** Because success (Lime) and primary action (Martian) sit 3° apart in hue, every state must also carry an icon, a label, or a shape. This is a hard requirement, not a nicety.
6. **Neither green is legible on light backgrounds.** Martian 500 on white is 1.90:1, Lime 500 is 1.18:1. On Paper, substitute Martian 800 — never dim, tint, or hope.
7. **Interactive boundaries use `--border-interactive`,** never a white-alpha border.
8. **No gradients between the two greens.** They are too close in hue; the transition muddies into an indeterminate olive.
9. **Glow over shadow on dark surfaces,** and never both at full strength.
10. **One idea per screen.** Carried forward from the previous direction, unchanged, and still the tie-breaker when a decision is unclear.

---

## 7. Accessibility summary

- **Target:** WCAG 2.1 AA (UIUX Brief §3).
- **Text:** every foreground role in §3 clears 4.5:1 against both Dark Green and Carbon. Mist 400 is the documented floor.
- **Non-text (1.4.11):** focus rings clear 3:1 in both contexts. `--border-interactive` clears 4.02:1. Decorative white-alpha borders do **not** clear 3:1 and are restricted to non-control separation.
- **Focus:** `:focus-visible` only — pointer interaction never paints a ring. One color, one width, one offset, sitewide.
- **Colour independence:** required by rule §6.5 above, because of the brand/accent hue proximity.
- **Contrast figures** in this document were computed from WCAG relative-luminance arithmetic. Per the standing convention in `website-implementation-brief.md` §14, re-verify with a real contrast tool during visual review rather than trusting the arithmetic alone.

---

## 8. Legacy removal — completed

The colour/typography pass left the previous navy/royal/violet primitives in `globals.css` under a `DEPRECATED` heading so the un-redesigned hero kept rendering. **The hero rebuild (2026-08-06) removed them.** No longer present anywhere in the codebase:

- the `--navy-*`, `--royal-*`, `--electric-*`, `--violet-*`, `--emerald-*`, `--amber-*`, `--red-*`, `--canvas`, `--surface`, `--ink*`, `--line`, `--slate-*` primitives and their `@theme` utility mirrors
- the `bg-legacy-canvas` / `bg-legacy-surface` compatibility utilities
- `.glass-workspace`, `.glass-chip`, `.glass-pill`
- the `float-workspace` / `drift-fragment-*` keyframes and their utilities

`--border` and `--input` now resolve to `--border-default` and `--border-interactive` rather than the legacy hairline. The Dark context is live sitewide: `<body>` carries `bg-canvas text-fg`.

Still untouched by both passes: the spacing and grid scale, radius scale, and photography direction.
