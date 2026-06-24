---
target: src/pages/index.astro (homepage)
total_score: 22
p0_count: 1
p1_count: 3
timestamp: 2026-06-24T11-45-30Z
slug: src-pages-index-astro
---
# Critique: Ubot Homepage (`src/pages/index.astro`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Lightbox has no loading/focus state; FX fetch fails silently with no "referencial" affordance until the static note. |
| 2 | Match System / Real World | 3 | Strong locale fit (colones, UCR/UNA/TEC, "combo de comida rápida"); "Elo" and "Flipmatch" are unexplained jargon. |
| 3 | User Control & Freedom | 2 | No "skip to content"; lightbox has Esc/click-out but no focus management or arrow nav; mobile menu closes on tap. |
| 4 | Consistency & Standards | 2 | Pricing CTAs use custom inline classes, not `.btn` (no primary glow, inconsistent shape); `#pricing` vs `/pricing` anchor split. |
| 5 | Error Prevention | 3 | FX fallback rate (500) keeps price non-blank offline — genuinely good engineering for the audience. |
| 6 | Recognition Rather Than Recall | 2 | Gallery tiles have no captions (must open lightbox to know what you're seeing); feature icons are generic Material Symbols. |
| 7 | Flexibility & Efficiency | 2 | No search, no lightbox arrow nav, no keyboard shortcuts; FAQ native `<details>` is the one efficient move. |
| 8 | Aesthetic & Minimalist Design | 2 | Coherent palette discipline, but the 13-card parade + filler stats add clutter where calm was promised. |
| 9 | Help Users Recognize/Recover from Errors | 2 | No error states for broken images or failed FX fetch; no form errors (no forms present). |
| 10 | Help & Documentation | 2 | FAQ is solid help; but no contact email rendered (`params.mail` exists in config, unused in footer). |
| **Total** | | **22/40** | **Acceptable — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

Does this look AI-made? **Yes — two of the absolute bans are hit where the eye lands first and longest.**

**LLM assessment.** The loudest tell is the **hero-metric template** (`Hero.astro:89-101`): four stat cards as `text-2xl font-extrabold text-primary` big numbers over `text-xs uppercase tracking-wide text-gray` tiny tracked labels in bordered `bg-card` chrome — the exact "big number + tiny uppercase-label stat cards" banned in PRODUCT.md/DESIGN.md. It's compounded by filler values (`24/7`, `100%`, `3+`, `Global`), where "Rankings globales: Global" is tautological. Filler metrics in the hero-metric shape is the single most recognizable AI-landing reflex.

The second tell is the **identical-card-grid parade**: EssentialFeatures (6) → WhyChooseUs (3) → HowItWorks (4) = 13 near-identical "badge + `text-lg` title + `text-sm text-gray` one-liner" blocks in a row. The section ordering itself (logos → hero+stats → 6 feature cards → 3 benefit cards → 4 step cards → gallery → 2-col pricing → FAQ → gradient CTA) is the canonical AI landing scaffold. Brand specifics (UCR/UNA/TEC, colones, PayPal, Spanish) partially rescue it, but the skeleton is the default template.

Tells **not** hit: no side-stripe borders, no glassmorphism-as-default (only the structural header blur and the lightbox overlay, both allowed), no uppercase tracked eyebrows above sections, no gradient text rendered. The HowItWorks numbered circles are justified (a real ordered sequence). Note: the banned `gradient-text-primary` utility still sits unused in `utilities.css:9-15` — remove it.

**Deterministic scan.** The bundled detector returned 2 warnings, both in `src/layouts/Base.astro`, both **false positives**:
1. `design-system-font` — flags "Material Symbols Rounded is not declared in DESIGN.md typography." False positive: Material Symbols is an icon set, not text typography; it belongs in the icon system, not the type hierarchy.
2. `single-font` — flags "only one font family used." False positive twice over: (a) the detector missed Inter, which Astro's `<Font>` component injects rather than loading via a `<link>` the detector can see; (b) the single-Inter choice is *The One Voice Rule* in DESIGN.md — a deliberate brand decision, not an omission.

The detector caught **nothing the LLM review missed** on this surface; its findings are both font false positives. The real issues (hero-metric template, card parade, contrast, keyboard access) are structural/semantic and below the detector's pattern set.

**Visual overlays.** Browser automation is not available in this harness, so no user-visible detector overlay was injected. The deterministic CLI scan above is the complete Assessment B evidence.

## Overall Impression

A real, usable page with genuine audience craft (colones-first pricing that never goes blank offline, real university names, PayPal reassurance, native `<details>` FAQ). But the structural scaffold does the brand no favors: it leads with AI hype and filler metrics, then marches through 13 identical cards where a coach should be building visible momentum. The single biggest opportunity is to stop *describing* the product's differentiators (ranking, streak, Elo, real exam formats) in identical card chrome and start *showing* one of them above the fold.

## What's Working

- **Access-engineering for the exact audience.** Pricing renders colones-primary with a live FX fetch, 1-hour localStorage cache, and a server-rendered `FALLBACK_RATE = 500` so the price is never blank on a slow/metered connection (`Pricing.astro:12, 147-168`). Combined with `lang="es"` and real university names, this is PRODUCT.md's "accessibility is access" principle made concrete.
- **Amber discipline.** Premium Amber is confined to the Premium plan border/tint/shadow, the "Popular" pill, the Premium CTA, and the two `premium: true` feature tags. It appears nowhere decorative — rare restraint, exactly honoring The Premium Amber Rule.
- **FAQ as native `<details>` with a real state signal.** Accessible, JS-free (works before JS loads on slow connections), with a clear open state and a `+`→`×` rotation in Mentor Blue. The content answers the right questions (three universities, free reality, cancellation, payments).

## Priority Issues

**[P0] Gallery lightbox is keyboard-inaccessible.**
- *What:* `Gallery.astro:30` makes each tile a `div.cursor-pointer` with the click handler on the img. Tiles aren't focusable; the lightbox sets no focus on open, has no focus trap, no arrow nav; only the close button is keyboard-reachable.
- *Why it matters:* PRODUCT.md explicitly requires "full keyboard support for the gallery lightbox" and frames accessibility as the brand's core promise. A keyboard/screen-reader user cannot open the screenshots at all — the one "show, don't tell" surface is dead to them.
- *Fix:* Make each tile a `<button>` with a descriptive `aria-label`. On open, move focus into the lightbox, trap it, add `←/→` to cycle images and `Esc` to close (already wired), restore focus to the triggering tile on close.
- *Suggested command:* `/impeccable harden`

**[P1] Hero-metric template (banned anti-reference) + filler stats.**
- *What:* `Hero.astro:89-101` renders 4 stat cards as big blue numbers over tiny uppercase tracked labels — the exact hero-metric template banned in PRODUCT.md/DESIGN.md. Values (`24/7`, `100%`, `3+`, `Global`) are non-credible filler.
- *Why it matters:* The loudest AI-slop tell and the first thing a skeptical student reads as "this is fake." It also spends Mentor Blue on four decorative numbers (straining The One Marker Rule) and competes with the h1.
- *Fix:* Remove the stat strip, or replace with one credible, specific proof point (a live ranking snapshot, a real streak counter, or "X estudiantes preparándose hoy"). If a number stays, it should be real, singular, and large — not a 4-up grid of placeholders.
- *Suggested command:* `/impeccable distill`

**[P1] Pricing double-₡ bug + white-on-amber contrast failure.**
- *What:* `Pricing.astro:45-53` renders a standalone `₡` span *and* a `data-crc-price` span that itself starts with a literal `₡` → the price reads "₡₡2,500 / mes" on both plans. Separately, the Premium CTA and "Popular" pill (`bg-amber-500 text-white`) put white on #f59e0b ≈ 2.1:1, far below 4.5:1 AA.
- *Why it matters:* A typo in the price — the most-scrutinized element — erodes trust at the conversion moment. The amber contrast failure breaches WCAG AA (a brand promise) and makes "Obtener Premium" hard to read on dim phones.
- *Fix:* Drop the literal `₡` from the `data-crc-price` span. Switch the amber CTA/pill to a deeper amber fill (`#b45309`/`amber-700`) or dark text on amber-500.
- *Suggested command:* `/impeccable audit`

**[P1] Three consecutive identical card grids (the AI-slop parade).**
- *What:* EssentialFeatures (6) → WhyChooseUs (3) → HowItWorks (4) = 13 near-identical "badge + title + one-liner" blocks in a row. WhyChooseUs even restates hero content ("Disponible 24/7").
- *Why it matters:* "Endless identical icon-card grids" made literal — the second-loudest AI-landing tell. It flattens hierarchy, blurs section boundaries, and turns the coach voice into a brochure (the "stiff corporate" anti-reference). On mobile it's 13 stacked cards of scrolling fatigue.
- *Fix:* Collapse EssentialFeatures + WhyChooseUs into one section; differentiate visually (let one be an inline list with no card chrome, or a short prose block). Break the rhythm between sections with a different primitive (a product screenshot, a ranking visualization, a testimonial) instead of a fourth card grid.
- *Suggested command:* `/impeccable layout`

**[P2] Hero `<mark>` emphasizes "inteligencia artificial" — the tech, not the student.**
- *What:* `homepage/-index.md:5-7` highlights *inteligencia artificial* in Mentor Blue, so the hero's emphasized word is the AI, not the student's outcome.
- *Why it matters:* PRODUCT.md says confidence comes "from visible progress, not from adjectives" and "not by hyping the AI." Leading with the technology addresses the wrong question — she wants "will this get me in?", not "is this AI?". It mirrors the generic AI-tool-landing voice the brand rejects.
- *Fix:* Shift the `<mark>` to the outcome word — "Prepárate para **la U**…" — and let "IA" live unhighlighted in the subtitle. Emphasize where she's going, not what powers it.
- *Suggested command:* `/impeccable clarify`

## Persona Red Flags

**Jordan (confused first-timer).** Recognizes their university in the logo trio — good. Both hero CTAs lead away to chat.ubotcr.com with no "what happens next" affordance — Jordan clicks and lands in the app cold. Cannot tell why there are *two* benefit sections (EssentialFeatures + WhyChooseUs) with the same shape. The reassurance needed — "Empieza a prepararte en menos de un minuto, sin tarjeta de crédito" — is buried 3 sections deep in HowItWorks, far from the hero CTA. At Pricing, "₡₡0" reads like a typo; "Comenzar gratis" is the same label as the hero button — no sense of progression.

**Riley (deliberate stress tester).** First screen: the four filler stats — "3+ modalidades" and "Rankings globales: Global" read as non-credible, trust drops immediately. Pricing: spots "₡₡2,500" in the most-scrutinized element. Clicks "Obtener Premium" → arrives at chat.ubotcr.com, *not* a checkout; conversion path is opaque. Footer: the `footer_legal` column (Privacy/Terms) is commented out (`Footer.astro:133-155`) — for a product taking PayPal payments, missing legal links is a trust + compliance red flag. Tries the gallery with keyboard — can't open a single tile. FAQ recovers some trust — the one section that holds up to scrutiny.

**Casey (distracted mobile user).** 3 university logos load `eager`/`fetchpriority="high"` above the fold on a data-capped plan — heavy first paint for the slow-connection audience. Scrolls through 13 stacked cards on a phone — long, repetitive, no rest beat; high abandonment risk between EssentialFeatures and HowItWorks. The sticky header's "Comenzar gratis" button is `hidden md:flex` (`Header.astro:112`) — on mobile the only persistent CTA is behind the hamburger. Taps a gallery tile → lightbox opens with no swipe/arrow to advance; must close and re-tap each tile. Reaches Pricing, sees "₡₡0."

**Project persona — "María," 17, mid-range Android, prepping for UCR admisión, data-capped, skeptical of AI hype, can't afford an academia.** The UCR logo is the single thing that makes María stay. But the h1 then highlights "inteligencia artificial" — the *source of her skepticism*, not her motivation. She scrolls for proof and finds **no testimonials, no student outcomes, no faces, no "X estudiantes ya entraron a la U."** The coach brand promises belief in the student, but the page shows zero students. The one beat that lands is WhyChooseUs: "Premium cuesta menos que un combo de comida rápida al mes" — concrete, respectful price anchoring, buried in the middle. María's real constraint is her phone/data, yet no copy says "funciona en tu celular" or "funciona con datos limitados." She clicks "Comenzar gratis" not knowing whether it's a web app, a download, or a data-plan burden.

## Minor Observations

- `utilities.css:9-15` — the banned `gradient-text-primary` utility is still present (DESIGN.md says remove it).
- No `text-wrap: balance` on h1/h2 and no fluid `clamp()` on display/headline — components use discrete `text-4xl/5xl/6xl` breakpoints instead of the DESIGN.md-specified clamps.
- `base.css:2` `scroll-behavior: smooth` is not gated behind `prefers-reduced-motion`; same for the FAQ `faqSlideDown` keyframe, card hover lifts, and `scale-105` image zoom — no global reduced-motion fallback exists despite PRODUCT.md requiring one for every animation.
- Gallery alt text is generic (`Captura de Ubot 1…6`); lightbox img alt is `Vista completa` — not descriptive of content.
- Nav IA split: in-page `#pricing` anchor (hero "Ver planes") vs separate `/pricing` route (nav "Precios").
- The "Recursos" dropdown wraps only 2 items — a dropdown for two links is marginal.
- `config.params.mail` (contacto@ubotcr.com) exists but is never rendered in the footer — no visible contact channel.
- Body copy defaults to `text-gray` (#94a3b8 = text-muted) everywhere; DESIGN.md reserves text-muted for *metadata* and assigns text-body (#cbd5e1) to *prose* — this flattens hierarchy and dims all descriptions.
- `generated-theme.css:11` `--color-primary-dark: #141925` is ink-raised mislabeled as "primary-dark" — naming hazard for future fills.
- Hero's `from-primary/5` top wash is unspecified in DESIGN.md — minor untracked accent spend.
- EssentialFeatures "Videos explicativos"/"Podcasts de estudio" (Premium-tagged) vs Pricing's "Generación de videos explicativos"/"Generación de podcasts" — the verb "Generación" shifts meaning; a student may not map the two.

## Questions to Consider

1. If you stripped every icon badge and numbered circle from the page, would the value still land — or is the meaning currently living in the chrome rather than the copy?
2. The product's real differentiators — the live ranking board, the daily streak, the Elo system, the real exam formats — are only *described* on the landing page, never *shown*. Why isn't a live ranking snapshot or a real exam question the hero, instead of three logos and four filler stats?
3. A stressed student's first question is "¿esto me ayuda a entrar?" The page answers "qué hace" (features) but never "si funciona" (outcomes). What would it take to put one real student outcome above the fold where "inteligencia artificial" currently sits?
