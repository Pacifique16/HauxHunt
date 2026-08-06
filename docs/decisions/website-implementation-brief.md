# HauxHunt Marketing Website — Implementation Brief

> **⚠ §7 (Typography) and §8 (Color-role rules) superseded (2026-08-06)** by the
> official brand identity in `docs/design/Design-System.md`. The Inter swap, the
> navy/royal/electric/violet palette, and the three-way colour-role separation
> those sections resolved are no longer in effect. Hero acceptance criteria in
> §19 that cite specific colour or type values (Deep Navy `#0F172A`, the violet
> glass border, Electric Blue focus) are pending restatement against the new
> identity in the interface redesign pass; every non-colour criterion still
> applies as written.

**Status:** Approved for hero + navigation implementation (2026-08-05). Sections below the hero remain undesigned/undecided.
**Scope:** The public marketing website only (`src/app/**`). Does not cover the authenticated Tenant/Landlord/PM/Admin product surfaces described in the product docs.

## Source documents & priority order

**Revised 2026-08-05.** Original priority order (visual docs first) is superseded — product scope now governs over visual styling when the two genuinely conflict:

1. `docs/product/UIUX-Design-Brief.docx` — governs product scope, launch behavior, roles, accessibility, and feature availability. **The Visual Design Bible must not introduce a feature the UI/UX Design Brief places outside the Launch Slice.**
2. `docs/design/Visual-Design-Bible.md` — governs visual styling, lighting, depth, typography, motion, brand expression, _within_ the scope §1 allows.
3. `docs/design/Creative-Direction.md` — storytelling and art direction.
4. `docs/product/Feature-Catalogue.pdf` — long-term context only, not a source of launch requirements.

This brief synthesizes, and does not override, any of the above. Conflicts identified during drafting are marked **⚠ Open conflict**; each has since been resolved by an explicit decision, marked **✅ Resolved 2026-08-05** immediately below it. The original flag text is left in place for traceability — it recorded what the tension actually was.

---

## 1. Product positioning

HauxHunt is positioned as **AI-native residential rental infrastructure** for long-term rentals — not a listings marketplace with an AI feature bolted on, but a platform where intelligent discovery/matching and identity/property verification are the core operating model (Feature Catalogue, Product Scope: _"AI Rental Assistant and recommendation intelligence form a core intelligence layer"_; Creative Direction Phase 2: _"the product's actual differentiator... is the AI itself, not the real estate"_).

Brand personality (Creative Direction, Phase 2): **calm authority** — _"the one person in the room who's actually verified everything, so you don't have to."_ Confident, unhurried, quietly intelligent. Not hype-y, not "startup-cute."

Design philosophy: **evidence over decoration** — every visual flourish (a verification checkmark, a live match score, a real chat/search exchange) must do a trust or clarity job. Nothing decorative for its own sake.

Launch markets are **Rwanda and Nigeria** (UIUX Brief §3), broadening later. The marketing site's claims, currency framing, and any location examples should stay consistent with a two-market (not single-market) launch — avoid copy that implicitly frames Rwanda/Kigali as the only market, even though the approved photography direction is Kigali-specific (see §13).

---

## 2. Primary website audiences

Drawn from UIUX Brief §1 (Personas). The Admin/Trust & Safety persona is an internal-tool user, not a marketing-site audience, and is excluded below.

| Audience                  | Who they are                                                                                                                          | What the site must do for them                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Tenant**                | Individual or co-applicant renter, often splitting rent with roommates; students and shared-housing renters are common. Mobile-first. | Convince them HauxHunt finds a trustworthy home fast, with transparent true move-in cost, and low scam risk.                                           |
| **Landlord (individual)** | Owns/self-manages one or a few properties. Lower tech fluency than a PM.                                                              | Show trust signals before asking them to engage; make the value (fill vacancies fast, low admin overhead) obvious without requiring technical fluency. |
| **Property Manager**      | Manages a portfolio for one or more owners. Desktop/web-primary.                                                                      | Signal the platform operates at volume — dashboards, not one-off flows — and can be trusted with a real portfolio.                                     |

A secondary implicit audience is **prospective investors/partners** evaluating HauxHunt's credibility (implied by "Confidential" product docs and the trust-first brand thesis), but no source document defines this as a distinct persona with its own needs — treat trust/credibility signals as serving this audience by extension, not as a separate section.

---

## 3. Visitor goals

- **Tenant visitor:** "Can this actually find me a real, safe home, and will I understand the true cost before I commit?" Wants to see live-feeling inventory, a visible match/verification signal, and a low-friction way to start searching.
- **Landlord/PM visitor:** "Is this platform legitimate enough to trust with my property and my tenants' money?" Wants trust/verification proof before any commitment ask, and a two-sided credibility signal (the platform works for tenants too, not just as a lead-gen funnel for landlords).
- **All visitors:** Resolve renting's core anxiety — _"is this a scam?"_ — before being asked to act. Per Creative Direction Phase 4, trust must be established (Trust & Verification, then Statistics, then Testimonials) **before** the final CTA, not asserted upfront and left unproven.

---

## 4. Landing-page persuasion narrative

This is the approved section-by-section persuasion arc (Creative Direction, Phase 4 — "Information Architecture as Narrative"). Each section has exactly one persuasive job; do not blend jobs across sections.

| Order | Section                  | Persuasion job                                                                                                                          |
| ----- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | **Hero**                 | "Prove it immediately." No claim to read — visitor watches the AI experience happen. Zero scroll needed to grasp the product.           |
| 2     | **Featured Properties**  | "This is real, not a demo." Live-feeling inventory with match scores grounds the AI promise in actual homes.                            |
| 3     | **Why HauxHunt**         | "Here's the whole system." Reframes AI from a single feature into the full operating model (matching, verification, payments, support). |
| 4     | **AI Rental Assistant**  | "It talks back." Second, deeper proof point — conversational, not just search. Where skepticism converts to belief.                     |
| 5     | **Trust & Verification** | "Here's why this is safe." The permission-to-proceed section — addresses renting's core anxiety directly.                               |
| 6     | **Landlord Experience**  | "It works for the other side too." Two-sided credibility is a stronger signal than either side alone.                                   |
| 7     | **Statistics**           | "You're not the first." Social proof through scale — placed _after_ trust is established, not before.                                   |
| 8     | **Testimonials**         | "People like you already did this." Emotional proof following rational proof (stats) — classic persuasion sequencing.                   |
| 9     | **FAQ**                  | "Remove the last doubts." Deliberately late — only near-converting visitors read FAQs.                                                  |
| 10    | **Footer / Final CTA**   | "Now act." Low-friction final ask, after every objection has been pre-answered.                                                         |

This order and reasoning is locked; do not reorder sections without a documented decision in `docs/decisions/`.

**⚠ Open conflict — Section 4:** the Bible's "AI Rental Assistant" section (§2) and this persuasion step both depend on a _conversational_ AI proof point. The UIUX Brief explicitly scopes the only launch-ready natural-language feature (Flow 3B) as a **non-conversational, non-chat, non-"AI"-labeled** smarter search bar, and defers the actual conversational assistant to Fast-Follow (see §6 and the standalone contradictions summary).

**✅ Resolved 2026-08-05:** step 4 of the narrative ("AI Rental Assistant" / "It talks back") is **out of scope for the launch website** as a distinct conversational section — it depends on a feature (Flow 3B says explicitly not to design it) that doesn't exist in the Launch Slice. The hero itself (step 1) now carries the "prove it immediately" job through the reinterpreted natural-language search workspace (§6), demonstrating intelligence through parsing behavior rather than conversation. Steps 2–3 and 5–10 of the narrative are unaffected and remain the approved sequence for when they're built.

---

## 5. Approved creative direction

**Locked direction (Creative Direction, Phase 3 & 5; confirmed by the Bible's own header):** **Concept B — Future AI Experience**, executed with **Concept A's restraint** (Modern Minimal Luxury) throughout. Hero: **Concept #2, "Floating AI Workspace"** — a dark, near-black-but-navy canvas with a glassmorphic AI panel as the literal hero image; no property photography required in the hero.

Why this direction (for context, not re-litigation): it's the only one of five hero concepts and three creative concepts that (a) requires no photography dependency to look finished, (b) puts the AI experience itself in the spotlight rather than describing it, (c) matches the calm-authority identity, and (d) was buildable at high fidelity with existing design-system components. Concepts A (Modern Minimal Luxury alone) and C (Editorial/Airbnb hybrid) were evaluated and explicitly not chosen — do not revert to them.

The One Rule (Bible §0), governing every future decision on this site: **one glass surface, one accent color in motion, one idea per screen.** When in doubt, remove something.

---

## 6. Hero experience

Full original specification: Bible §1 ("Hero Art Direction"). Summary as originally written:

- **Canvas:** 1440×860px minimum viewport — the product must be graspable with zero scroll. Background is Deep Navy `#0F172A` (never pure black), with a near-imperceptible radial gradient (centered ~50%/35%, +4–6% brightness at center, 0–6% shift over full canvas height).
- **Vertical reading order (strict, center axis):** Nav (72px, transparent→solid after ~40px scroll) → 64px → AI-context eyebrow badge (violet glass) → 24px → Headline (2 lines, centered, max-width 820px) → 20px → Subheadline (1 sentence, centered, max-width 600px, 70%-opacity white) → 40px → **AI Workspace panel** (visual center of gravity) → 32px → Trust strip (3 proof points, small caps, 58%-opacity white).
- **Nothing else is in the hero.** No secondary CTA, no background illustration, no photography. The panel _is_ the hero image.
- **The AI Workspace panel:** 720px fixed width, centered. Glass: `rgba(255,255,255,0.06)` background, 24px backdrop blur, 1px violet-edged border (`rgba(139,92,246,0.35)`). `radius/2xl` (24px) — larger than any functional component, deliberately. Elevation: violet-tinted "AI Glow" (24px blur, 30% opacity) layered under a grounding dark drop shadow (20px offset, 48px blur, 14% black). Internal: single-line input row (sparkle icon, placeholder/typed query, 44px circular violet send button), 1px internal divider at 8% white, then 3–4 suggestion chips (`rgba(255,255,255,0.08)` glass, no border). Idle state: 4px vertical float, 6–8s loop, ease-in-out sine — must read as subconscious, not noticeable.
- **Floating elements:** maximum two small glass fragments (e.g. a miniature "96% match" badge, a verified-check pill), 40–60% opacity, 2–3px blurred, drifting slower (10–14s) and smaller (2px) than the panel, phase-offset from each other and the panel so motion never syncs.
- **Depth planes (exactly three):** background (static navy gradient) → ambient (the two floating fragments) → focal (the sharp, glass-blurred AI panel). No fourth plane.
- **Emotional target:** the eye lands on the glowing panel _before_ the headline. The feeling is "this is a live, working piece of intelligence... waiting for you" — a demonstration, not a marketing claim.

**⚠ Open conflict:** the panel's "AI-context eyebrow badge," its framing as an "AI Workspace," and the persuasion narrative's expectation that the hero _is_ an AI demonstration all read as explicit AI-labeling and/or an implied conversational surface. The UIUX Brief's Flow 3B is explicit that the only in-scope natural-language feature must not be labeled "AI" (no badge, no "AI-powered" copy) and must not read as a chat interface. This is the single highest-priority item to resolve before any hero build work begins — see the contradictions summary.

**✅ Resolved 2026-08-05 — the hero is reinterpreted as an intelligent search workspace, not a conversation panel.** Per Flow 3B and the approved decision:

- **No eyebrow badge.** The "AI-context eyebrow badge" step is removed from the vertical order entirely — not relabeled, removed. Order is now: Nav → 64px → Headline → 20px → Subheadline → 40px → Search Workspace → 32px → Trust indicators.
- **No "AI" language anywhere in the hero UI:** no "AI," "AI-powered," "Ask AI," or equivalent copy/labels on the workspace, its button, or its badges.
- **No chat bubbles, no multi-turn conversation, no implied open-ended Q&A.** The workspace is a single free-text query box that parses into structured, editable filter chips — a smarter search bar, not a chat thread.
- **Required interaction sequence:** (1) visitor types or picks a suggested natural-language query → (2) the workspace shows "what we understood" as editable filter chips (add/remove/edit), clearly flagging anything it couldn't parse → (3) submitting reveals one or two simulated property previews (match %, verified status, price, location, key amenities, and a short "why this matches" explanation) in the normal property-card visual language, not a chat response.
- **Everything else about the Bible's premium visual treatment is kept:** the 720px glass panel, `radius/2xl`, the violet-edged border and AI Glow elevation, the idle float, the ambient floating fragments, the three depth planes. Only the _interaction model and labeling_ changed — the panel is still visually "the AI Workspace" from the Bible, it just never calls itself that out loud.
- Violet remains reserved for genuinely AI/intelligence-derived data (match percentages, "why this matches" explanations) — not for decorative badges that assert "AI" without evidence, consistent with Creative Direction's "AI is never an icon... always evidence."

---

## 7. Typography rules

- **Family:** Single typeface, Inter, across the whole page (Creative Direction, Phase 2) — display type at dramatic scale for statements, regular body at conservative scale for reassurance. No decorative/script fonts anywhere; decoration undermines the trust read.
- **Hero headline is a deliberate exception to the design-system default:** not the standard `Display/2XL` style — for the hero specifically, 72px / 78px line-height / Bold / **-2 letter-spacing** (tighter than default; at this scale, tight tracking reads as more confident/expensive). Pure white — the one place full-contrast white is correct.
- **Hero subheadline:** `Body/LG`, 18px, Regular, 70%-opacity white.
- **Hero eyebrow badge:** `Label/SM`, 11px, Semi Bold, +0.4 letter-spacing, uppercase, violet text.
- **Hero trust strip:** `Label/MD`, 12px, Medium, +0.2 letter-spacing, 58%-opacity white.
- **Sitewide scale (Creative Direction):** 2–3 weights of the one family; huge size jumps between hero and body, not gradual steps; body copy conservative (16–18px).

**⚠ Engineering gap (not a document conflict):** the current scaffold ships Next.js's default **Geist Sans / Geist Mono** (`src/lib/fonts.ts`), not Inter. Creative Direction assumes Inter is "already in your system," which is not true of this fresh codebase. A font swap is required before any typography work begins; not performed as part of this brief.

**✅ Resolved 2026-08-05:** swap to Inter via `next/font/google`, replacing Geist Sans/Mono in `src/lib/fonts.ts` and `src/app/layout.tsx`. Restrained hierarchy only — one large hero display size, one concise supporting-copy size, no decorative pairing, no more weights than the design needs (Regular/Medium/Semi Bold/Bold).

---

## 8. Color-role rules

Three-way, permanent color-role separation (Bible §3, reinforced in the Inheritance Rule, §"Inheritance Rule for Every Future Page"): **Royal Blue = brand action, Electric Blue = functional focus, Violet = AI presence exclusively.** This separation must be preserved everywhere, permanently, on every future HauxHunt surface, not just this site.

- **Deep Navy `#0F172A`** is the only permitted dark-mode background, anywhere, ever — never pure black.
- **Badge/chip color-as-meaning is absolute** (Bible §3): green = success/security only, amber = warning only, red = error only, blue = informational/property only, violet = AI only. No exceptions.
- **Discipline rule (Bible §5):** accent colors appear only on one primary CTA per section, focus/active states, and AI-context elements. Every other pixel is navy, white, off-white, or neutral gray. If more than 3 non-neutral colors are visible in one screenshot, something is wrong.
- **Trust & Verification is the sole exception:** the only section permitted to show more than one accent color simultaneously (green/blue/violet together), because color-coding _is_ the content there.
- **Darkness rhythm:** exactly four sections are dark — Hero, AI Rental Assistant, Statistics, Footer — in that fixed rhythm; never adjacent twice in a row except the intentional Statistics→Footer close.

**⚠ Missing information:** neither the Bible excerpt nor Creative Direction gives exact hex/OKLCH values for Royal Blue, Electric Blue, or Violet (only Deep Navy `#0F172A` and the panel's violet border `rgba(139,92,246,0.35)` are given as concrete values). The current `globals.css` `@theme` block still holds the generic shadcn neutral-gray token set from scaffold init — none of the Bible's brand tokens (`primitive/brand/900`, `color/bg/surface`, `color/ai/accent-bg`, `Elevation/AI Glow`, etc.) exist in code yet. A full design-token pass (color, radius, elevation) is a prerequisite for any component work and is out of scope for this brief.

**✅ Resolved 2026-08-05 — approved initial palette** (defined as an explicit CSS variable layer in `globals.css`, replacing the generic shadcn neutral theme; shades may be adjusted further for accessibility as audited):

| Token                | Hex                   | Role                                                                   |
| -------------------- | --------------------- | ---------------------------------------------------------------------- |
| Navy 950             | `#08111F`             | Deepest navy (rarely used directly)                                    |
| Navy 900             | `#0F172A`             | Primary dark-section background                                        |
| Navy 800             | `#172033`             | Elevated dark surface                                                  |
| Royal Blue 600 / 700 | `#2563EB` / `#1D4ED8` | Primary brand action                                                   |
| Electric Blue 500    | `#0EA5E9`             | Input/focus interaction only                                           |
| Violet 500 / 600     | `#8B5CF6` / `#7C3AED` | Intelligence-related data or match explanation only — never decoration |
| Emerald 600          | `#059669`             | Success/security semantic                                              |
| Amber 500            | `#F59E0B`             | Warning semantic                                                       |
| Red 600              | `#DC2626`             | Error semantic                                                         |
| Off-white canvas     | `#F8FAFC`             | Light-section background, one step off white                           |
| White surface        | `#FFFFFF`             | Card/surface background                                                |
| Text primary         | `#0F172A`             | Body text on light backgrounds                                         |
| Text secondary       | `#475569`             | Secondary/muted text on light backgrounds                              |
| Default border       | `#E2E8F0`             | Hairlines, card borders                                                |

Royal Blue = primary brand action. Electric Blue = input/focus interaction. Violet = intelligence-related data or match explanation only, never generic decoration. This is the same three-way separation the Bible mandates (§8 above); the hex values simply make it buildable.

---

## 9. Layout and spacing rules

- **Grid:** 12-column, 1440px desktop container, 24px gutters (Creative Direction, Phase 2).
- **Section padding:** generous 96–140px vertical section padding.
- **Spacing philosophy:** sections breathe at 2–3× the density of component-level spacing — component spacing signals precision, section spacing signals luxury.
- **Border radius philosophy:** larger radii (24–32px) on hero-level/brand surfaces; tighter radii (8–12px) on functional UI (buttons, inputs). The contrast itself communicates "warm brand, rigorous product." (Confirmed and made concrete in Bible §3: buttons stay at `radius/md` 8px; the hero panel gets `radius/2xl` 24px — bigger radius on the single most important object is a deliberate importance signal.)
- **Visual weight distribution (Bible §6):** each section must have exactly one element carrying 60%+ of visual weight. Two competing elements in one section means the layout is wrong — rebalance via size, saturation, or white space, never by adding more elements.
- **Section-specific spacing overrides** (from Bible §2) take precedence over the general system where stated, e.g. Featured Properties' header-to-grid gap is 56px (deliberately more generous than any other section), Statistics' inter-column padding is at least 64px.

---

## 10. Functional and Intelligence component dialects

Governing idea (Bible §3): **two visual dialects, one grammar.** Every component declares which dialect it belongs to; nothing is ambiguous.

- **Functional dialect** — buttons, inputs, nav, badges, property cards, feature/statistic/testimonial/CTA cards. Precise, tight-radius (`radius/md`, 8px for buttons), no glass, flat by default with elevation earned only on hover (or omitted entirely for non-interactive cards like Statistic/Testimonial, which must never carry a shadow — that would falsely imply clickability).
- **Intelligence dialect** — AI Search / AI Workspace only. Glass, violet, generous radius (`radius/2xl`). This is the _only_ component family permitted the violet glass treatment, permanently — glass's rarity is what makes it mean something.
- **Inputs:** focus state uses **Electric Blue**, never Royal Blue and never Violet — Electric Blue means "functional input," distinct from brand action and AI presence.
- **Trust/Verification badges** sit between dialects: functional radius/flatness, but permitted a soft semantic-tinted glow (4–6% opacity radial) as their one luxury flourish.
- **Navigation** is Functional dialect and never glass — a glass nav would compete with and dilute the hero panel's specialness.

Full per-component table is in Bible §3; treat it as authoritative and do not invent a third dialect.

---

## 11. Motion principles

Canonical timing values (Bible §4 — treat as final; more specific than Creative Direction's general "200–350ms" guidance, which these values refine, not contradict):

- Micro (hover/focus): 150ms, ease-out
- Standard (card lift, button press): 250ms, ease-out
- Section reveal (scroll-in): 400ms, ease-out, 12–20px upward translate
- AI "thinking" stagger: 400ms delay between paired elements
- Hero panel idle float: 6–8s loop, ease-in-out (sine), 4px amplitude
- Ambient floating fragments: 10–14s loop, ease-in-out, 2px amplitude, phase-offset
- Counter count-up: 600–800ms, ease-out (decelerating), fires once on first scroll-into-view only

**Rules:**

1. Nothing animates on page load except the hero AI panel (fade + rise, 500ms, starting 200ms after paint). Every other section animates only on scroll-into-view.
2. Scroll-reveal animations fire once per session per element — never re-fire on scroll up/down.
3. No spring/bounce/elastic easing anywhere. Ease-out only.
4. Hover states never change layout (no width/height shifts) — transform and opacity/color only.
5. The AI-response stagger pattern is the template for **all** future AI-conversation UI across the whole product (mobile app, tenant portal, etc.) — carry it forward, don't reinvent it elsewhere.
6. Future page transitions: 200ms cross-fade, no slide.

**⚠ Missing information:** no source document mentions `prefers-reduced-motion` handling, despite the hero depending on multiple always-on looping animations (panel idle float, ambient fragment drift). Given the UIUX Brief's WCAG 2.1 AA requirement (§14 below), a reduced-motion fallback is very likely required but is not specified by any document. Flagged for approval, not assumed.

**✅ Resolved 2026-08-05 — `prefers-reduced-motion` support is required.** When reduced motion is enabled: remove the panel's looping vertical float, remove ambient fragment drift, remove animated counters (once built), avoid delayed stagger effects, and use short opacity-only transitions where a transition is still needed for clarity. Motion must clarify behavior, not decorate — this is now an explicit rule alongside the Bible's existing motion rules, not left implicit.

---

## 12. Glassmorphism restrictions

- **Bible §0, the One Rule:** one glass surface, one accent color in motion, one idea per screen.
- **Exactly three glass tiers exist, permanently (Bible §6), and no fourth may be added:**
  1. Hero AI Workspace panel — most prominent, largest, brightest violet edge, the only element with idle motion.
  2. AI Rental Assistant chat panel — secondary: same glass recipe, 20% smaller, static (no idle float — sharing the hero's exact motion signature would dilute the hero's uniqueness).
  3. AI match-score pills on property cards — tertiary: smallest, most subtle (4% white overlay + 8px blur).
- **Glass appears exclusively on AI-touched surfaces.** Never on a full-width background, never on repeated grid items as decoration, never on navigation.
- Creative Direction's general guidance ("one glassmorphic surface per major section, max") is consistent with, and superseded in specificity by, the Bible's exact three-tier system above.

---

## 13. Photography direction

Per Bible §7 (consistent with, and more detailed than, Creative Direction's photography bullet):

**Use:** natural warm daylight (golden hour / soft midday, never harsh flash or fluorescent); real, lived-in spaces (never staged "empty show-home" sterility); wide-angle but undistorted; **Kigali-specific architecture and local material textures** where possible, not generic international luxury-apartment stock; consistent sitewide color grade — warm white balance (~3200–3800K feel), lifted shadows (never crushed blacks), ~85–90% saturation so no photo fights the navy/blue palette.

**Avoid absolutely:** traditional real-estate photography clichés (fisheye lenses, blown-out HDR skies, over-saturated staged rooms); people posing directly at camera (handshake/key-handover clichés); visible-agency-watermark stock photography; cool/blue-toned photography that competes with the UI's own blue accents.

**Cropping:** 4:3 for property card thumbnails; 16:9+ for full-bleed section photography. Focal point on a rule-of-thirds intersection, never dead-center.

**Treatment:** subtle 8–12% navy-tinted vignette on all property photography, concentrated at the corners.

**Placeholder rule (Bible §2, Landlord Experience):** until real photography exists, use a soft brand-tinted glass panel (`color/bg/brand-subtle` + a faint 4% radial highlight), never a flat gray box — it should read as "a photo is coming" not "this is unfinished."

**⚠ Missing information:** the photography direction is Kigali/Rwanda-specific throughout; no source document gives equivalent guidance for Nigeria, despite Nigeria being confirmed as a co-equal launch market (UIUX Brief §3). If Nigerian property photography is needed for launch, this gap needs a design decision before it's sourced or shot.

**✅ Resolved 2026-08-05 — deferred, not blocking.** Real photography (both Kigali and Nigerian urban context, once sourced) must follow the existing Use/Avoid/Cropping/Treatment rules above unchanged — the Nigeria gap is a sourcing/commissioning gap, not a rules gap, and "represent both markets over time" is now the explicit expectation. For this implementation pass specifically: the hero must not depend on remote/real photography at all — interface-led visuals and neutral local placeholders only (no `<img>` pointed at an external or stock asset). This is also a performance decision (§16) — no remote asset required for initial render.

---

## 14. Accessibility requirements

Per UIUX Brief §3 (Platform & Design Constraints): **WCAG 2.1 AA is the minimum accessibility target**, stated as applying across web, iOS, and Android — the marketing website is in scope.

Also relevant from the UIUX Brief, applied to a marketing context:

- Every role-gated or state-dependent action must show a visible, explained state (not a dead-end) — relevant if the marketing site links into gated app flows (e.g., "Sign up" for an unverified visitor).
- Design for right-to-left-compatible layout patterns even though the current launch markets (Rwanda, Nigeria) don't require RTL — don't hard-code assumptions that only work left-to-right.
- Multi-market currency: RWF has no minor/decimal unit in everyday use; do not hardcode "always show two decimal places" in any pricing example or stat used on the marketing site.

**⚠ Open conflict:** several Bible-specified hero text treatments use reduced-opacity white on Deep Navy — subheadline at 70%-opacity white (§1), trust strip at 58%-opacity white (§1), floating fragments at 40–60% opacity. These opacities were not evaluated against WCAG 2.1 AA contrast minimums (4.5:1 for normal text, 3:1 for large text) in any source document, and 58%/70%-opacity white on `#0F172A` is likely to fail AA contrast for body-sized text at typical sizes. This needs a contrast audit before implementation — flagged, not resolved here, since resolving it would mean altering Bible-specified values.

**✅ Resolved 2026-08-05 — audited, not assumed.** WCAG 2.1 AA takes priority over any fixed opacity value in the Bible; the 70%/58% figures are starting points only, to be increased where a real contrast check fails. Calculated against relative luminance (WCAG formula): white text at 70% opacity composited over `#0F172A` yields ≈10:1, and at 58% opacity ≈6.6:1 — both clear the 4.5:1 normal-text AA threshold with margin, because `#0F172A` is dark enough that even meaningfully dimmed white stays high-contrast against it. **No opacity increase was needed for these two values**; they ship as specified. This calculation must be re-verified with a real contrast tool during visual review rather than trusted from arithmetic alone. Every other accessibility requirement in this section (keyboard access, visible focus state, semantic HTML, accessible names, sufficient touch targets, no color-only meaning) applies in full to whatever is built.

---

## 15. Responsive behavior

The UIUX Brief's platform guidance (§3) is written for the product apps (web/iOS/Android), not the marketing site specifically, but its principle applies: **design once at the design-system level (color, spacing, type), adapt per context** — not a single pixel-identical layout forced everywhere.

**⚠ Missing information:** every layout and spacing spec in the Bible and Creative Direction (hero canvas 1440×860, 720px-fixed AI panel, 12-column/1440px container, section padding 96–140px, Statistics' 64px inter-column padding, etc.) is stated **only for desktop**. No source document specifies tablet or mobile breakpoints, a mobile hero treatment, how/whether the AI Workspace panel's fixed 720px width and idle-float motion adapt below desktop, or how the two-dialect/glass system degrades on small viewports. This is a significant gap: the entire creative direction as documented is desktop-only, and a mobile/responsive design pass does not yet exist. Do not improvise mobile layout decisions when hero build work begins — this needs an explicit design decision first.

**✅ Resolved 2026-08-05 — approved breakpoint ranges and behavior** (desktop-first: build and validate desktop, then adapt down; one responsive component structure, no separate mobile markup unless truly necessary):

- **Desktop (≥1200px):** centered floating search workspace; max content width ~1200–1280px; workspace width may reach the Bible's ~720px.
- **Tablet (768–1199px):** reduced headline scale; workspace width becomes fluid instead of fixed; ambient floating fragments reduced (fewer/smaller); page gutters stay comfortable (not edge-to-edge).
- **Mobile (<768px):** single-column composition; full-width search workspace within 20–24px gutters; filter chips wrap horizontally; simulated property previews stack vertically; ambient fragments removed entirely (not just reduced); no horizontal overflow under any circumstance.

This resolves the gap for the hero and navigation specifically (the only two components authorized for this implementation pass, §"Implementation Task" below) — other sections' responsive behavior is still undecided and out of scope until they're designed.

---

## 16. Performance requirements

No source document states numeric performance budgets (no LCP/CLS/INP targets, no bundle-size ceiling). The only relevant signal is Creative Direction's general 2026-trend commentary that, where heavier effects (3D/WebGL) are used, "lazy-loading and lower-fidelity mobile fallbacks" are treated as standard — not directly applicable here since no 3D/WebGL was chosen (Concept #3, Interactive 3D City, was explicitly rejected as "likely a Phase 2 initiative, not launch-ready").

Given the absence of stated budgets, default to standard modern web performance practice until a number is approved:

- Track Core Web Vitals (LCP, INP, CLS) as the working performance frame.
- The hero's glass/blur/glow effects (`backdrop-filter`, layered box-shadows, continuous idle-float animations) are real GPU/compositing cost sources and should be built with performance headroom in mind (e.g., `transform`/`opacity`-only animation per Bible §4 rule 4, which already keeps hover/motion off layout-triggering properties).
- Google Fonts (Inter, once swapped in) should be self-hosted or subset per Next.js `next/font` best practice to avoid render-blocking font requests — consistent with the project's existing `next/font/google` usage pattern.

**⚠ Missing information:** no performance budget is approved. Flagged for a follow-up decision rather than invented here.

**✅ Resolved 2026-08-05 — approved budgets:**

- LCP < 2.5s, CLS < 0.1, INP < 200ms.
- No unnecessary client components — server components by default; `"use client"` only where real interactivity requires it.
- No animation libraries beyond Framer Motion (already installed) — no new dependencies.
- No autoplay video, no WebGL/3D.
- No remote asset required for initial render (reinforces the photography decision above).
- Avoid hydration warnings and avoid layout shift from fonts or media.

---

## 17. Features intentionally excluded from the first marketing website

Per this task's explicit instruction, the Feature Catalogue's 313 capabilities across 29 domains represent the **full platform vision, not a launch commitment** (Feature Catalogue, "Feature Scope Summary": _"the intended full-platform capability set and is not an MVP launch commitment"_). None of the following belong on the public marketing site, even though they're documented product features:

- Any **authenticated in-app experience**: Tenant Rental Hub, Landlord/PM portfolio dashboards, Admin console, application workspace, lease workspace, escrow/payments, deposit ledger, move-in/move-out management, dispute resolution case UI.
- **Roommate matching** (UIUX Brief §5B) — explicitly Fast-Follow, designed but not yet built, and gated behind a verification tier that doesn't exist in a marketing context.
- The **full conversational AI Rental Assistant** as a multi-turn, general-purpose chat product (property Q&A, process guidance) — the UIUX Brief is explicit this is fast-follow, not Launch Slice (see the contradictions summary for how this interacts with the Bible's "AI Rental Assistant" hero section).
- **Immersive & AR Property Experience** (360° tours, AR furniture placement, virtual furnishing) — Feature Catalogue phases this under "Experience Expansion," after MVP.
- **Advanced marketplace intelligence / analytics** (liquidity metrics, benchmarking, automated operations) — Feature Catalogue phases this under "Scale & Intelligence," last.
- **Fraud detection, dispute resolution, and admin tooling** — internal/operational, never public-facing.
- Any **screening, lease e-signature, or payment-collection flow** — these are Transaction Layer, not marketing-site scope, and (per UIUX Brief §3) require explicit confirmation/receipt screens that don't belong on a marketing page.

The marketing site's job is to **represent and sell** the trust/verification/matching story, not to implement any of the above.

---

## 18. Engineering constraints

Current, actual state of `HauxHunt/` as of this brief (verified against the repo, not assumed):

- **Stack:** Next.js 16 (App Router, Turbopack), TypeScript (strict), Tailwind CSS v4 (CSS-first config via `@theme` in `src/app/globals.css` — there is no `tailwind.config.ts`), shadcn/ui (Radix base, "Nova" preset, `neutral` base color), Framer Motion, Lucide React. All already installed; no additional dependencies are authorized without a separate decision.
- **Folder architecture** (already scaffolded, see `README.md`): `src/components/{ui,layout,sections,shared,providers}`, `src/config/site.ts`, `src/lib`, `src/hooks`, `src/types`, `src/data`. Section/page components should land in `components/sections` and be composed by `app/**/page.tsx`, per the existing convention.
- **Design tokens do not yet exist.** `globals.css`'s `@theme` block currently holds only the generic shadcn neutral-gray palette from `shadcn init` — none of the Bible's named tokens (`primitive/brand/900`, `color/bg/surface`, `color/ai/accent-bg`, `Elevation/AI Glow`, the `radius/*` scale as the Bible uses it, etc.) have been defined in code. Building any component against Bible-named tokens requires defining those tokens first — out of scope for this brief.
- **Font mismatch:** the scaffold ships Geist Sans/Mono (`src/lib/fonts.ts`); Creative Direction specifies Inter. Needs a font swap before typography work begins (see §7).
- **`src/config/site.ts`** has an empty `description` placeholder — the positioning statement in §1 above is a natural source for it once copy is approved, but it is intentionally left untouched by this brief.
- **This brief itself does not modify `src/app/page.tsx`, install dependencies, or build any UI**, per this task's explicit constraints.

---

## 19. Acceptance criteria for the hero section

**Revised 2026-08-05** to match the reinterpreted, launch-scoped hero (§6). Struck items are no longer applicable and are kept, crossed out, for traceability rather than deleted.

- [ ] Viewport reads as complete with **zero scroll** at 1440×860 / desktop and above.
- [ ] Background is Deep Navy `#0F172A` with the specified radial gradient (centered ~50%/35%, 0–6% brightness shift, no visible banding) — never pure black.
- [ ] Nav is transparent over navy at the top of page, and becomes solid with a 1px bottom hairline **only** after ~40px of scroll, never before.
- [ ] Section content follows the vertical order: nav → 64px → headline → 20px → subheadline → 40px → Search Workspace → 32px → trust indicators. No other elements present.
- ~~Eyebrow badge: violet glass pill...~~ — **removed**, no eyebrow badge exists (§6).
- [ ] Headline: 2 lines, centered, max-width ~820px, 72px/78px line-height, Bold, -2 letter-spacing, pure white. Copy contains no "AI" labeling.
- [ ] Subheadline: 1 sentence, centered, max-width ~600px, `Body/LG` 18px Regular, 70%-opacity white (audited AA-passing, §14). Copy contains no "AI"/"AI-powered" labeling.
- [ ] Trust indicators: 3 proof points in a single row, small caps/label style, 58%-opacity white (audited AA-passing, §14), no color-only meaning (each pairs an icon or text, not a bare colored dot).
- [ ] Search Workspace is ~720px on desktop (fluid on tablet, full-width within 20–24px gutters on mobile per §15), `radius/2xl`-equivalent (24px), glass background `rgba(255,255,255,0.06)` with 24px backdrop blur and a 1px `rgba(139,92,246,0.35)` violet-edged border.
- [ ] Workspace elevation shows both the violet "AI Glow" and a grounding dark drop shadow, layered correctly.
- [ ] Workspace input row is a real `<form>`/`<label>`/`<input>` (not a styled div), with a visible submit affordance — no "AI," "AI-powered," or "Ask AI" copy anywhere on it.
- [ ] Suggestion chips are real buttons, populate the input and trigger parsing on activation (click and keyboard).
- [ ] Submitting shows "what we understood" as **editable filter chips** (add/remove/edit), not a chat bubble or free-form response — presented in an `aria-live` region so the parse result is announced.
- [ ] Anything the parser couldn't confidently understand is flagged distinctly (icon + text, not color alone), per §14.
- [ ] Submitting/updating filters reveals 1–2 simulated property previews using the normal property-card visual language (match %, verified status, price, location, key amenities, short "why this matches" explanation) — not a conversational response.
- [ ] Workspace idle motion (float) and any ambient fragments respect `prefers-reduced-motion` (§11) — removed, not just slowed, when the user has that preference set.
- [ ] At most two floating ambient fragments on desktop, reduced on tablet, removed on mobile (§15); never synchronized with each other or the panel.
- [ ] On load: only the hero's primary surface animates in (fade + rise). No other element animates on initial load.
- [ ] No secondary CTA button, no background illustration, no remote/real photography anywhere in the hero (§13, §16).
- [ ] No spring/bounce/elastic easing anywhere in the hero's motion.
- [ ] Hover/interaction states change only transform/opacity/color — never layout dimensions.
- [ ] Every interactive element (chips, buttons, inputs) is keyboard-operable with a visible focus state (Electric Blue, per §8/§10) and an accessible name.
- [ ] No horizontal overflow at any viewport width.

---

_This brief does not reinterpret, soften, or replace the Visual Design Bible's visual system (color roles, glass rules, motion timings, spatial planes). Where this document changes what the hero **shows or says** — removing the eyebrow badge, replacing conversational chat with parsed filter chips, removing "AI" labeling — that change comes from the 2026-08-05 product-scope decision (UI/UX Design Brief taking priority over the Bible per the revised priority order above), not from a re-reading of the Bible's visual craft, which remains intact._
