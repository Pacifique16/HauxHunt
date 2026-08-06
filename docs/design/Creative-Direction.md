HauxHunt — Creative Direction (Phases 1–5)
Phase 1 — Research Synthesis

I looked at both the reference brands you named and current (2026) landing page trend datarather than gradient-everything backgrounds, the field has moved to restrained two-tone gradients applied surgically to hero blobs, buttons, or section accents, with glassmorphism narrowed to specific surfaces like cards and nav overlays instead of an entire visual language. A few other findings worth building on: glassmorphism's 2026 form leans on backdrop blur plus semi-transparent surfaces, and remains an obvious choice for SaaS, fintech, and premium brands signaling modernity without overwhelming the user, and the strongest hero sections now show product value visually within seconds rather than stating what the product is, following a before→after or problem→solution arc. Motion has matured too — minimal, meaningful micro-animation (hover states, scroll reveals, form feedback) is favored over decorative motion, and where 3D/WebGL appears, it's now expected to be well-tuned and performance-aware, with lazy-loading and lower-fidelity mobile fallbacks treated as standard.
SaaS Hero + 4

Cross-referencing this against Apple / Airbnb / Stripe / Linear / Vercel / Notion / Framer / Raycast / Arc / Revolut / Perplexity / OpenAI, the recurring principles are:

Pattern What the best sites actually do
Hero composition One sentence of real value, not a slogan. Product/data visible in the first viewport, not below it.
Typography hierarchy 2–3 weights of one typeface, huge size jumps (not gradual steps) between hero and body.
White space Used as a status symbol — the more empty space around an element, the more expensive it feels.
Color One saturated brand color, deployed sparingly against near-black/near-white neutrals. Color is a spotlight, not a fill.
Glassmorphism Reserved for one signature surface (a card, a panel, a nav bar) — never the whole page.
Motion Physically plausible easing, short duration (150–300ms), used to clarify state changes, not decorate.
Scroll storytelling Each section reveals one idea, in order, building an argument — not a list of features.
Cards Flat until hovered; elevation is earned through interaction, not default.
AI presentation Never a robot/chip icon. Shown as a live, working interface — a conversation, a result appearing, a match score updating.
Navigation Disappears/condenses on scroll. Never competes with the hero.
CTAs One primary action per screen. Everything else is secondary, visually quiet.

The clearest throughline: restraint is the luxury signal. Apple, Linear, and Stripe all look expensive because of what they leave out, not what they add.

Phase 2 — HauxHunt Visual Identity

Brand personality: Calm authority. HauxHunt should feel like the one person in the room who's actually verified everything, so you don't have to. Confident, unhurried, quietly intelligent — not hype-y, not "startup-cute."

Design philosophy: Evidence over decoration. Every visual flourish must be doing a trust or clarity job (a verification checkmark, a live match score, a real chat exchange) — nothing is there just to look modern.

Visual language: Deep navy as gravity, Royal Blue as action, Electric Blue and Violet as two distinct "intelligence" signals (search vs. AI-assistant), generous negative space, one glass surface per screen used deliberately.

Typography system: Single family (Inter, already in your system) carrying the whole page — Bold display type at dramatic scale (56–80px) for statements, Regular body at conservative scale (16–18px) for reassurance. No decorative or script fonts — decoration undermines the "trust" read.

Color palette: Keep the token system you already built (Navy/Royal Blue/Electric Blue/Emerald/Amber/Red/Violet) — it's already right for this direction. The creative shift is in how sparingly it's deployed: navy and white/off-white carry 90% of the page; Royal Blue and Violet appear only at moments of action or AI presence.

Grid system: 12-column, 1440px desktop container, 24px gutters, generous 96–140px section padding (matches the 2026 bento-grid convention of a 12-column CSS Grid with a 100px base unit and 16px gutters, adapted to your spacing tokens).

Spacing philosophy: Sections breathe at 2–3× the density of your component-level spacing. Component spacing = precision; section spacing = luxury.

Border radius philosophy: Larger radii (24–32px) on hero-level surfaces to feel soft and human; tighter radii (8–12px) on functional UI (buttons, inputs) to feel precise and engineered. The contrast itself communicates "warm brand, rigorous product."

Elevation philosophy: Flat by default. Elevation appears only on hover/interaction or to mark the single most important object in a section (the AI search bar, a live property card).

Glassmorphism rules: One glassmorphic surface per major section, max. Best candidates: the AI Search bar, the AI Assistant chat panel, a floating verification card over a property image. Never apply it to full-width backgrounds or repeated grid items — that reads as a template, not a decision.

Motion language: Ease-out, 200–350ms, scroll-triggered fade+rise (12–20px) per section, no bounce/elastic easing (reads as playful, not trustworthy), number counters that animate once on scroll into the Statistics section.

Icon style: Thin-stroke (1.5px), geometric, no fills except inside AI-context badges. Custom-drawn, not a generic icon-pack look.

Illustration style: None, or near-none. Generic stock-style illustration has become a noise marker in 2026 — the split is custom-commissioned illustration or none at all. For HauxHunt: none. Real UI, real data, real photography instead.
SaaS Hero

Photography direction: Warm, naturally-lit interiors and Kigali cityscapes — never staged/stock-agency real-estate photography (that's exactly the "generic marketplace" look you told me to avoid). If real photography isn't available yet, use photographic-toned placeholder blocks, not illustrated ones — keep the visual promise consistent for handoff.

AI visual identity: AI is never an icon — it's always evidence: a live match-percentage, a chat bubble with a real answer, a search query being typed and results updating. Violet is reserved exclusively for these moments so the brand teaches users "violet = the AI is working right now."

Phase 3 — Three Creative Concepts
Concept A — Modern Minimal Luxury

Apple × Stripe. Enormous type, almost no color, a single hero visual (one beautiful property photo or one elegant UI shot), huge white space, restrained motion.

Why it works: Fastest route to "premium" — luxury brands communicate confidence through absence.
Emotional response: Calm, reassured, "this is a serious company."
Strengths: Timeless, fast to build, ages well, highest trust signal.
Weaknesses: Risks underselling the AI story — minimalism can hide your key differentiator if not handled carefully.
Palette: Navy + white + one Royal Blue accent; Violet appears only in the AI section.
Typography: Very large Bold display (72–88px), generous line-height, sparse body copy.
Motion: Near-silent — fades only, no parallax.
Hero concept: One full-bleed property photo, one sentence, one AI search bar floating below.
Illustration: None.
Concept B — Future AI Experience

Perplexity × OpenAI × Arc. AI is the main character — the hero is a live AI search/conversation, not a headline about AI.

Why it works: Directly proves the "AI-native" claim instead of asserting it.
Emotional response: Curiosity, "this feels genuinely new."
Strengths: Most differentiated from every real-estate competitor; strongest demo-ability.
Weaknesses: Highest execution risk — a mediocre AI-hero looks like a gimmick, not a luxury signal; needs real interaction design, not just visuals.
Palette: Navy base, Violet as the dominant accent (AI is the star, so its color leads).
Typography: Slightly smaller display type than Concept A, more space given to the live interface itself.
Motion: Typing/response animation in the hero, subtle glow pulse on the AI surface.
Hero concept: "Floating AI workspace" — a glassmorphic AI search panel mid-conversation, results populating live beside it.
Illustration: None — the "illustration" is the real interface.
Concept C — Editorial + Apple + Airbnb Hybrid

Airbnb's warmth and photography-led storytelling, Apple's typographic confidence, magazine-style editorial pacing.

Why it works: Balances trust (Apple precision) with warmth and desirability (Airbnb's "this could be your home" emotional pull) — renting is emotional, not just functional.
Emotional response: Aspiration + comfort, "I can picture living there."
Strengths: Most human-centered of the three; best for the Landlord/Tenant testimonial storytelling you already have.
Weaknesses: Depends heavily on genuinely great photography — weak photography collapses this concept fastest.
Palette: Warmer neutral base (off-white, not stark white) with navy/blue as structure and Violet reserved for AI moments.
Typography: Editorial-scale headlines paired with immersive full-bleed imagery; more generous body copy for storytelling sections.
Motion: Slow parallax on photography, scroll-paced section reveals — "magazine turning pages" feel.
Hero concept: "Luxury editorial layout" — a large lifestyle photo with an overlaid glass search panel, headline positioned like a magazine cover line.
Illustration: None — photography carries the emotional weight.
Recommendation: Concept B, with Concept A's restraint applied throughout.

Reasoning: your brand brief explicitly leads with Trust, Security, Intelligence before Premium — and your product's actual differentiator (per everything we've built into the component library — AI match scores, an AI assistant, AI-verified badges) is the AI itself, not the real estate. Concept C is beautiful but is fundamentally an Airbnb pitch; Concept A is beautiful but undersells the one thing that makes HauxHunt not-a-generic-marketplace. Concept B, executed with Concept A's typographic restraint and white space discipline (not neon/sci-fi AI clichés), is the only direction that makes a visitor's first thought "this is the future of renting" rather than "this is a nice real estate site." This also matches where the reference brands you named are actually headed — AI-personalized hero sections and interactive, embedded demos above the fold are the dominant 2026 pattern among the best SaaS products, which is exactly Concept B's structure.
Vezadigital

Phase 4 — Information Architecture as Narrative

Reframed as a persuasion arc, not a section list:

Hero — "Prove it immediately." Visitor doesn't read a claim, they watch AI search happen. Zero friction, zero scroll needed to understand the product.
Featured Properties — "This is real, not a demo." Live-feeling inventory with match scores, grounding the AI promise in actual homes.
Why HauxHunt — "Here's the whole system." Reframes AI from a single feature into the entire operating model (matching, verification, payments, support).
AI Rental Assistant — "It talks back." Second, deeper proof point — conversational, not just search. This is where skepticism converts to belief.
Trust & Verification — "Here's why this is safe." The permission-to-proceed section — addresses the anxiety renting always carries, especially online.
Landlord Experience — "It works for the other side too." Widens credibility — a two-sided marketplace that both sides trust is a stronger signal than either alone.
Statistics — "You're not the first." Social proof through scale, positioned right after trust is established, not before.
Testimonials — "People like you already did this." Emotional proof following rational proof (stats) — classic persuasion sequencing.
FAQ — "Remove the last doubts." Placed deliberately late — only the visitors who are close to converting read FAQs.
Footer / Final CTA — "Now act." Low-friction final ask, after every objection has been pre-answered.

This is close to what we already built — the sequencing was right. The creative upgrade in Phase 6 will be in how each section proves its point, not the order.

Phase 5 — Five Hero Concepts

1. Cinematic Property Experience — Full-bleed, slow-panning property photography behind a centered glass AI-search panel. Emotional, aspirational, closest to Concept C.

2. Floating AI Workspace (recommended) — A dark, near-black canvas; a glassmorphic AI conversation panel floats center-stage, mid-exchange ("Find me a quiet 2BR near Kigali Heights..." → results populating live to the side). No property photography needed — the interface is the hero.

3. Interactive 3D City — A stylized, low-poly 3D map of Kigali with glowing verified-property pins the user can orbit/hover. Highest "Awwwards" ceiling, highest build risk and cost — likely a Phase 2 initiative, not launch-ready.

4. AI Map Intelligence — Split hero: left = AI chat, right = a live map with pins appearing as the AI "thinks." Functional and impressive, but visually busier than Concept B's minimalism should allow.

5. Split-Screen Experience — Left = tenant AI search, right = landlord AI dashboard preview, meeting at a center divider. Strong for communicating the two-sided platform early, but dilutes the single-message clarity a hero needs.

Chosen: #2, Floating AI Workspace. It's the only concept that (a) requires no photography dependency to look finished, (b) puts the AI conversation itself in the spotlight rather than describing it, (c) matches the "calm authority, one glass surface" identity from Phase 2, and (d) is buildable at high fidelity in Figma with the AI Search Component we already have — versus #3 and #4 which need either 3D asset production or a live-data map, both out of scope for a landing page mockup.

Before I open Figma: this is the point where the direction gets locked in. I'm proceeding on Concept B (Future AI Experience, executed with Concept A's restraint) + Hero #2 (Floating AI Workspace) unless you want to push back on either. I'll archive the current landing page as "Version 1" and build the new one from scratch on a new page — worth noting Figma Professional's page limit is unlimited, so I can now keep Version 1 fully intact rather than overwriting it.
