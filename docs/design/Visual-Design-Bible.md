# HauxHunt Visual Design Bible

> **⚠ Palette and typography superseded (2026-08-06).** The official HauxHunt
> brand identity — Martian Green `#99CC33`, Dark Green `#003333`, Carbon
> `#171717`, Lime `#C6FF34`, and Aether as the sitewide typeface — replaces the
> navy / royal-blue / electric-blue / violet palette and the Inter typeface
> described throughout this document. **`docs/design/Design-System.md` is
> authoritative for all colour and typography.**
>
> Everything else here — composition, depth planes, motion timings, lighting,
> spatial system, photography direction, the two-dialect component system —
> still stands and has not been re-litigated. Where a section below names a
> specific colour or type value, read the intent and take the value from the
> Design System.

### The single source of truth for every visual decision on HauxHunt, forever.

**Direction: Future AI Experience, executed with Minimal Luxury restraint. Hero: Floating AI Workspace.**

---

## 0. The One Rule Above All Others

**One glass surface. One accent color in motion. One idea per screen.**

Every time a future designer is unsure what to do, the answer is: remove something. HauxHunt earns "premium" through what it leaves out. If a section has two things competing for attention, one of them is wrong.

---

## 1. HERO ART DIRECTION

**Canvas.** 1440×860px minimum viewport (no scroll needed to grasp the product). Background is **Deep Navy `primitive/brand/900` (#0F172A)**, not black — black reads as generic "dark mode," navy reads as premium/financial/trustworthy. The navy is not flat: a radial gradient sits centered at roughly 50% horizontal, 35% vertical, lightening by ~4–6% toward the center and returning to full navy at the edges — just enough to create a sense of a light source behind the AI panel, never enough to be noticed consciously. No visible gradient bands; 0% to 6% brightness shift over the full canvas height.

**Layout & composition.** Strict vertical center axis. Reading order, top to bottom:

1. Navigation bar (72px, transparent over navy, becomes solid `color/bg/surface` with a 1px bottom hairline only after ~40px of scroll — never before)
2. 64px breathing room
3. AI-context eyebrow badge (violet, glass)
4. 24px
5. Headline — two lines, center-aligned, max-width 820px
6. 20px
7. Subheadline — one sentence, center-aligned, max-width 600px, `color/text/secondary`-equivalent on navy (use a 70%-opacity white, not the light-mode tertiary token, since this is the one true dark surface in the system)
8. 40px
9. **The AI Workspace panel** (see below) — this is the visual center of gravity, both literally (vertically centered in the remaining viewport) and figuratively (the brightest, most detailed object on the canvas)
10. 32px
11. Trust strip — three small proof points in a single row, quiet, small caps, low contrast (58% opacity white)

Nothing else is in the hero. No secondary CTA button competing with the panel, no background illustration, no photography. The floating panel _is_ the hero image.

**The AI Workspace panel — the centerpiece.**

- Width: 720px fixed on desktop, centered.
- Surface: glassmorphism — `background: rgba(255,255,255,0.06)`, `backdrop-filter: blur(24px)`, 1px border in `rgba(139,92,246,0.35)` (a soft violet edge, not white — this is what tells the eye "this surface is intelligent," distinct from any other glass in the product).
- Corner radius: `radius/2xl` (24px) — larger than any functional UI component in the system, on purpose. Bigger radius on the single most important object = visual signal of importance.
- Elevation: the `Elevation/AI Glow` effect style already in the token system — a soft violet-tinted shadow blooming outward (24px blur, 30% opacity violet) layered under a conventional dark drop shadow (20px offset, 48px blur, 14% black) for grounding. The violet glow is the "this object is alive" signal; the dark shadow is what makes it feel physically real, sitting above the navy rather than painted onto it.
- Internal composition, top to bottom: a single-line input row (sparkle icon, placeholder/typed query, circular violet send button, 44px), then a thin 1px internal divider at 8% white opacity, then a horizontal row of 3–4 suggestion chips in a lighter glass tone (`rgba(255,255,255,0.08)`, no border).
- The panel is never perfectly static. In its resting/idle state it holds a very slow (6–8s loop), extremely subtle vertical float — 4px of travel, ease-in-out, sine-based — like it's breathing. This must be almost subconscious; if a user can consciously point at "it's moving," reduce the amplitude.

**Floating elements.** Two, maximum, and only if they don't compete with the panel: small glass fragments (property-match badges, e.g. "96% match" in miniature, or a tiny verified-check pill) positioned loosely near the panel's upper-left and lower-right corners, at 40–60% opacity, slightly out of focus (2–3px blur) to read as background depth rather than foreground content. These drift even more slowly than the panel (10–14s loops) and at smaller amplitude (2px), on a different phase offset so they never move in sync with the panel — synchronized motion reads as mechanical, offset motion reads as organic.

**Depth & blur relationships.** Three depth planes only:

1. **Background plane** — the navy gradient itself. Static, no blur applied to it (it IS the blur source for everything above).
2. **Ambient plane** — the two floating fragments. Blurred 2–3px, low opacity, slow drift.
3. **Focal plane** — the AI panel. Sharp, glass-blurred (backdrop-filter, meaning it blurs what's _behind_ it, not itself), full opacity, drop shadow.

No fourth plane. Two more decorative shapes is the maximum the eye should ever be asked to parse before the panel.

**Typography in the hero.**

- Eyebrow badge: `Label/SM` equivalent, 11px, Semi Bold, +0.4 letter-spacing, uppercase, violet text on violet-tinted glass pill.
- Headline: NOT the standard `Display/2XL` style as-is — for the hero specifically, push to 72px / 78px line-height / Bold / -2 letter-spacing (tighter than the design-system default, because at this scale tight tracking reads as more confident/expensive). Pure white, not off-white — this is the one place full-contrast white is correct.
- Subheadline: `Body/LG` at 18px, Regular, 70%-opacity white.
- Trust strip: `Label/MD` at 12px, Medium, +0.2 tracking, 58%-opacity white.

**Emotional target.** A visitor's eye should land on the glowing panel first — before the headline, even. The feeling is: _this is a live, working piece of intelligence, floating in calm dark space, waiting for you._ Not a marketing claim. A demonstration.

---

## 2. SECTION-BY-SECTION ART DIRECTION

Every section below follows the same discipline: one background tone, one focal object, one accent color used at most.

### Featured Properties

**Background:** `color/bg/surface` (pure white/near-white) — the first light section after the dark hero, deliberately, to create a "surfacing from the depths" transition as the user scrolls (dark → light reads as "we've moved from concept to real inventory").
**Composition:** Section Header (center-aligned, violet eyebrow "FEATURED LISTINGS") sits with unusually generous 56px gap above the property grid — more than any other section's header-to-content gap, because this is the first proof section and needs room to feel unhurried.
**Property Cards:** Flat by default — no shadow at rest (breaking from the current `Elevation/02 Low` default; move that shadow to hover-only). At rest, cards are separated purely by white space and a near-invisible 1px border (`color/border/default` at 60% opacity). On hover: lift 4px, `Elevation/03 Medium` appears, image scales 1.03x within its clipped frame over 300ms ease-out — the only section-level hover motion in the entire page that involves an image transform.
**Image treatment:** see Photography Direction (§7) — warm, natural light, 4:3 crop, subtle vignette.
**Verified badge & AI match bar:** unchanged functionally from the current build, but the AI match bar's violet background should be reduced to 8% opacity (currently reads slightly too loud against the otherwise-quiet white card) with the violet text carrying the emphasis instead.
**CTA:** single secondary-style button, center-aligned below the grid, generous 48px top margin — never a primary/filled button here, because the primary color is reserved for the page's single highest-intent action (defined per-section below).

### Why HauxHunt

**Background:** `color/bg/canvas` (very slightly off-white, one step down from the previous section) — a whisper of separation without a hard color break.
**Composition:** 4-column feature grid, but NOT uniform — the AI-Matched Listings card (violet-tinted) should be visually first and slightly larger in emphasis (achieved via the violet background alone, not via size — keep the grid mathematically even, let color do the emphasis work).
**Feature cards:** flat, 1px border, no shadow ever (these are informational, not interactive — shadow implies clickability, and these aren't primary actions).
**Icon treatment:** icons sit in a 48px rounded-square token, `radius/lg`, tinted background matching the card's semantic (brand-subtle blue for standard cards, violet for the AI card) — icon itself is a single thin-stroke glyph, never filled.

### AI Rental Assistant

**Background:** returns to Deep Navy — the second and last full-navy section on the page. This is intentional visual rhyme with the hero: navy = "this is where the AI lives." Every time the page goes navy, the user should subconsciously register "AI moment."
**Composition:** Asymmetric split, 55/45 — text-and-CTA column on the left (never centered here, center-alignment is reserved for the hero only), a glass chat panel floating on the right, vertically centered against the section, NOT top-aligned with the text block — this creates a gentle diagonal tension across the section that keeps it from feeling like two static boxes.
**Chat panel:** same glass language as the hero panel (violet-edged glass, `radius/2xl`, AI Glow shadow) but 20% smaller in scale and without the floating idle animation — this panel is a supporting example, not the hero; giving it the exact same motion treatment would dilute the hero's uniqueness.
**Message bubbles inside:** user message = neutral glass (`rgba(255,255,255,0.08)`, no violet), AI response = violet-tinted glass (`color/ai/accent-bg` equivalent at reduced opacity on dark) — color-coding who's "the intelligence" in every AI conversation surface across the whole site, permanently.
**Motion:** on scroll-into-view, the AI response bubble should animate in with a 400ms delay after the user bubble (staggered, not simultaneous) — visually implying "thinking, then responding," even though it's a static mock. This single staggered reveal is one of the most important motion details in the entire page for selling "this AI is real."

### Trust & Verification

**Background:** white (`color/bg/surface`) — trust sections should feel clean, clinical almost, never moody. This is the one section where the design should feel closer to a bank's website than a lifestyle brand's.
**Composition:** center header, then trust badges in a single flat row (4 items), then verification badges in a second, smaller row beneath — visually implying a hierarchy (big trust pillars, then specific certifications), even though today they're both static.
**Color discipline:** this is the ONLY section allowed to show more than one accent color simultaneously (green for security/success, blue for property verification, violet for AI verification) — because here, color-coding by category IS the content; explaining verification types through color is more trustworthy than through copy alone.
**No motion.** This section should feel the most stable, still, and un-animated of the entire page. Stillness itself communicates reliability. Do not add hover lift to trust badges.

### Landlord Experience

**Background:** `color/bg/canvas`.
**Composition:** asymmetric split like the AI Assistant section, but mirrored (image/visual LEFT, text RIGHT) — alternating left/right across the page's split-sections creates a subtle zig-zag reading rhythm down the page, which is a well-established "premium editorial" pacing device.
**Visual placeholder:** until real photography exists, this should be a soft brand-tinted glass panel (NOT a flat gray box as currently built) — apply `color/bg/brand-subtle` with a very faint (4%) radial highlight in the upper-left, so it reads as "a photo is coming here" rather than "this is unfinished."
**Checklist items:** the small green dots should be replaced with a genuine check-glyph (not a plain dot) — dots read as bullet points, checks read as "verified capability," which matches the trust-first brand voice.

### Statistics

**Background:** Deep Navy — the third and final full-navy moment, closing the "navy = significant claim" pattern established by the hero and the AI Assistant section. Using navy here (rather than white) elevates raw numbers into something that feels institutional, like a company reporting real metrics, not a marketing stat block.
**Composition:** four-column, evenly weighted, generous horizontal padding between columns (at least 64px) so each number has room to feel monumental rather than cramped.
**Motion:** each number counts up from 0 on scroll-into-view (600–800ms, ease-out, count should decelerate near the final value rather than move linearly) — this is the single most expected "premium SaaS" motion moment and its absence would be conspicuous.

### Testimonials

**Background:** white.
**Composition:** unchanged 3-card row structurally, but remove the star-rating row's current flat-orange styling — replace with a single small quote-mark glyph (`"`) at 24px, `color/text/tertiary`, positioned top-left of the card, above the quote text. Star ratings read as generic marketplace (Yelp/Amazon); a quote mark reads as editorial/considered, consistent with the brand voice.
**Avatar treatment:** circular, but should carry a 1px ring in `color/border/default` — a small detail that keeps every avatar looking intentional even as a placeholder.

### FAQ

**Background:** `color/bg/canvas`.
**Composition:** unchanged list structure. Add one micro-interaction: on hover, each row's question text shifts to `color/text/brand` (no other change) — signals interactivity without needing a chevron/expand icon in the static mock.

### Footer

**Background:** Deep Navy — a fourth, final, and expected navy moment. Footers on premium dark-capable brands (Linear, Vercel, Stripe) are almost always dark regardless of the rest of the page, because it functions as the "credits roll" of the experience — the calm, quiet close.
**No change to structure** — the current footer's information architecture is correct; only the transparent-frame bug fix (already resolved) needed addressing.

---

## 3. COMPONENT VISUAL LANGUAGE

The governing idea: **two visual dialects, one grammar.** "Functional dialect" (buttons, inputs, nav, badges — precise, tight-radius, no glass) and "Intelligence dialect" (anything AI-touched — glass, violet, generous radius). Every component declares which dialect it belongs to; nothing should be ambiguous.

- **Buttons** — Functional dialect. Radius stays at `radius/md` (8px) — resist the temptation to round these up to match the hero's luxury radii; buttons are tools, not brand moments. Primary buttons carry a very subtle 1px inner highlight (`rgba(255,255,255,0.15)` top edge) to imply a soft physical bevel — a tiny detail that separates "premium flat" from "cheap flat."
- **Property Cards** — Functional dialect, flat at rest (per §2), hover-elevated. Image corner radius must exactly match card corner radius minus 0px (flush, no inset gap) — currently correct in the build.
- **AI Search / AI Workspace** — Intelligence dialect exclusively. This is the only component family permitted the violet glass treatment. If a future designer is tempted to add glass anywhere else, the answer is no — glass's rarity is what makes it mean something.
- **Inputs (Text Field, Dropdown)** — Functional dialect. Focus state uses Electric Blue, not Royal Blue and not Violet — Electric Blue is reserved specifically for "you are now interacting with a functional input," distinct from both brand-action blue and AI-violet. This three-way color separation (Royal Blue = brand action, Electric Blue = functional focus, Violet = AI presence) must be preserved everywhere, permanently.
- **Badges & Chips** — Functional dialect, but color-as-meaning is doubled down: every badge color must map to exactly one semantic category, forever (green=success/security only, amber=warning only, red=error only, blue=informational/property only, violet=AI only). No exceptions, no "just this once, blue looks nicer here."
- **Trust / Verification Badges** — Sit between dialects: functional radius and flatness, but permitted a soft semantic-tinted background glow (4–6% opacity radial) as their one luxury flourish — trust deserves slightly more visual weight than an ordinary badge.
- **Navigation** — Functional dialect, transparent-to-solid scroll behavior (per hero notes). Never glass — a glass nav competing with the hero's glass AI panel would dilute the panel's specialness.
- **Feature / Statistic / Testimonial / CTA Cards** — Functional dialect, flat, 1px border only, shadow reserved for hover or omitted entirely on non-interactive cards (Statistic, Testimonial are not clickable — they must never carry a shadow, which would falsely imply interactivity).

---

## 4. MOTION SYSTEM

**Core timing values (add these as the site's motion tokens):**

- Micro (hover, focus): **150ms**, ease-out
- Standard (card lift, button press): **250ms**, ease-out
- Section reveal (scroll-in): **400ms**, ease-out, with 12–20px upward translate
- AI "thinking" stagger: **400ms delay** between paired elements (user msg → AI response)
- Hero panel idle float: **6–8s loop**, ease-in-out (sine), 4px amplitude
- Ambient floating fragments: **10–14s loop**, ease-in-out, 2px amplitude, phase-offset from panel and from each other
- Counter count-up: **600–800ms**, ease-out (decelerating), triggered once on first scroll-into-view only — never re-triggers on scroll-away/back

**Rules, not just values:**

1. Nothing animates on load except the hero's AI panel (fades + rises in, 500ms, 200ms after page paint) — every other section animates only on scroll-into-view, never on initial load, to avoid a chaotic "everything moving at once" first impression.
2. Scroll-reveal animations fire once per session per element — never re-fire on scroll up/down repeatedly. Repetition reads as buggy, not polished.
3. No element should ever use spring/bounce/elastic easing anywhere in the product. Ease-out only. Bounce reads as playful/consumer-app; HauxHunt's brand is calm authority.
4. Hover states never change layout (no width/height shifts) — only transform (scale, translateY) and opacity/color, to avoid layout jank.
5. The AI-response stagger pattern (§2, AI Assistant section) is the template for ALL future AI-conversation UI anywhere in the product (mobile app, tenant portal, etc.) — this is the single most important motion signature to carry forward.
6. Page transitions (future multi-page site): 200ms cross-fade, no slide — slide transitions feel consumer-app; cross-fade feels editorial/premium.

---

## 5. LIGHTING SYSTEM

Think of the entire site as having **one implied light source: a soft light behind and above the AI panel in the hero**, and every other section inherits consistent, ambient, shadow-less lighting except where that panel (or its descendants) appear.

- **Where shadows appear:** only on (a) interactive elements on hover, (b) the AI glass panels at all times (their glow IS their light source, always on), (c) elevated CTA banners. Never on static informational cards (Statistic, Testimonial, Trust) at rest.
- **Where glass appears:** exclusively on AI-touched surfaces — the Hero panel, the AI Assistant chat panel, and (new, small) the AI match-score pill on Property Cards should also gain a very subtle glass treatment (4% white overlay + 8px blur) to visually tie every AI touchpoint on the page back to the hero's "intelligence dialect," even outside dedicated AI sections.
- **Where gradients appear:** only two places on the entire page — the hero's ambient radial navy gradient, and a matching (much more subtle, 3% shift) radial in the AI Assistant and Statistics sections, to visually rhyme all three navy sections as "the same intelligent space" reappearing.
- **Where color appears:** accent colors (Royal Blue, Electric Blue, Violet) only ever appear on: one primary CTA per section, focus/active states, and AI-context elements. Every other pixel is navy, white, off-white, or the neutral gray scale. If you can count more than 3 non-neutral colors visible in a single screenshot at once, something is wrong.
- **Where darkness appears:** exactly four sections (Hero, AI Assistant, Statistics, Footer) — always in that rhythm, never adjacent to each other twice in a row except Statistics→Footer which is intentional (closing the page on two consecutive dark, confident notes).

---

## 6. SPATIAL SYSTEM

Three depth planes, used consistently across the entire site, not just the hero:

1. **Background plane** — section background colors/gradients. Always flat, never contains text or interactive elements directly.
2. **Content plane** — the default plane for 95% of all content: headers, body copy, standard cards, images. Flat, no shadow, sits directly on the background plane.
3. **Floating plane** — reserved exclusively for glass/AI surfaces and their immediate ambient decoration. This plane always carries shadow (grounding) and/or glow (significance), and is the only plane permitted independent motion (idle float, drift).

**Layer hierarchy rule:** an element only moves up to the Floating plane if it is either (a) AI-related, or (b) the single most important interactive object in its section (e.g., the primary CTA banner may occasionally earn a subtle shadow-lift on hover, temporarily "visiting" the floating plane). Nothing else is allowed to float, glow, or independently animate — this scarcity is what keeps the floating plane meaningful.

**Glass hierarchy:** Hero AI panel (most prominent: largest, brightest violet edge, only element with idle motion) → AI Assistant chat panel (secondary: smaller scale, same glass recipe, static) → AI match-score pills on cards (tertiary: smallest, most subtle glass treatment, 4% opacity). Three tiers only — a fourth tier would be indistinguishable from the third and dilute the system.

**Visual weight distribution:** each section should have exactly one element carrying 60%+ of the visual weight (the panel in the hero, the chat panel in AI Assistant, the number columns in Statistics, the grid in Featured Properties/Why HauxHunt). If two elements in a section are fighting for weight, the layout is wrong — rebalance via size, color saturation, or white space, not by adding more elements.

---

## 7. PHOTOGRAPHY DIRECTION

**Use:**

- Natural, warm daylight (golden hour or soft midday, never harsh flash or fluorescent interior lighting)
- Real, lived-in spaces — a book on a shelf, a plant, natural clutter-free tidiness — never staged "empty show-home" sterility
- Wide-angle but undistorted interior shots; genuine sense of scale and light
- Kigali-specific architecture and context where possible — local material textures (wood, warm plaster, greenery) rather than generic international "luxury apartment" stock aesthetics
- Consistent color grade across every photo used sitewide: warm white balance (slightly lifted toward 3200–3800K feel), lifted shadows (never crushed blacks), slightly desaturated (roughly 85–90% saturation) so no single photo fights the brand's navy/blue palette

**Avoid, absolutely:**

- Traditional real-estate photography — ultra-wide fisheye lenses, blown-out HDR skies, over-saturated staged rooms (the exact "generic real-estate marketplace" look you told me to eliminate from day one)
- Any photo with people posing directly at camera (handshake, key-handover clichés)
- Stock photography with visible agency watermatch style — generic diverse-smiling-family-in-kitchen imagery reads as template, not brand
- Cool/blue-toned photography that competes with the brand's own blue accent — warm photography against a cool-blue UI is the correct, deliberate contrast; cool photography against cool UI goes flat and forgettable

**Cropping:** 4:3 for property card thumbnails (matches current card proportions), 16:9 or wider for any full-bleed section photography (Landlord Experience visual, future case-study pages). Always crop to keep a natural focal point (a window, a doorway, a design detail) roughly on a rule-of-thirds intersection — never dead-center, dead-center reads as a passport photo, not a lifestyle shot.

**Treatment:** a very subtle (8–12%) navy-tinted vignette on all property photography, concentrated at the corners — this is what visually "belongs" any photo to the HauxHunt brand system even before any UI chrome is added around it.

---

## 8. FINAL MOOD BOARD

_(Described in words, as the reference for whoever builds the literal visual moodboard file.)_

Imagine four images side by side:

1. **A single, glowing glass panel floating in near-total darkness** — violet light bleeding softly from its edges, everything else in the frame pure navy-black, completely still except for the faintest sense that the panel is breathing. _(The Hero.)_

2. **A warm, sunlit apartment interior, slightly desaturated, shot at a natural angle** — a chair, a window, real light falling across a wood floor, nothing staged. _(Photography direction.)_

3. **A stark white card on white background, a single thin blue border, one small violet percentage badge glowing faintly in the corner** — everything about the frame says "quiet, precise, confident." _(Property Card / functional dialect.)_

4. **Deep navy, four enormous white numbers evenly spaced, no decoration, no icons — just scale and confidence.** _(Statistics section.)_

If you can look at those four images and believe they're the same product — that's the brief, achieved. If any one of them looks like it belongs to a different, less serious company, the execution has drifted and should be pulled back toward image 1 and 3, which are the truest expressions of the brand.

---

## Inheritance Rule for Every Future Page

Every future HauxHunt surface — Tenant Portal, Landlord Portal, Admin Portal, mobile app — inherits:

- The three-color-role discipline (Royal Blue = brand action, Electric Blue = functional focus, Violet = AI presence exclusively)
- The two-dialect component system (Functional vs. Intelligence)
- The three-plane spatial system and its floating-plane scarcity rule
- The AI-response stagger motion pattern for any conversational AI surface
- Navy as the _only_ dark-mode background — never pure black, anywhere, ever

This document supersedes any prior informal styling decisions. When in doubt, re-read §0.
