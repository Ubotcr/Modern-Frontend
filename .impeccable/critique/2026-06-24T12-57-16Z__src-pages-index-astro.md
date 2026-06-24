---
target: src/pages/index.astro (homepage)
total_score: 28
p0_count: 0
p1_count: 3
timestamp: 2026-06-24T12-57-16Z
slug: src-pages-index-astro
---
# Critique: Ubot Homepage (`src/pages/index.astro`) — Re-run

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | FX conversion has no "updating" state — fallback renders, then price silently swaps if the fetch succeeds; lightbox caption `· index/total` is good. |
| 2 | Match System / Real World | 3 | Colones-primary, UCR/UNA/TEC, "combo de comida rápida" are excellent; docked for unexplained jargon ("Elo," "Flipmatch"). |
| 3 | User Control & Freedom | 3 | Lightbox has Esc/prev/next/click-out + focus restore; FAQ native `<details>`; mobile menu closes on outside-click. |
| 4 | Consistency & Standards | 2 | Same chat.ubotcr.com signup labeled "Comenzar gratis" / "Comenzar gratis" / "Comenzar gratis ahora" across hero/header/CTA; plan names mix a word ("Gratuito") with a brand ("Ubot Premium"). |
| 5 | Error Prevention | 3 | Server-rendered fallback rate so price is never blank; but `applyRate` has no sanity bounds — a malformed API rate of ₡9999 would render unchecked. |
| 6 | Recognition Rather Than Recall | 2 | Product screenshots (the proof) are buried at section 5; the hero primary CTA ejects the visitor off-site with no preview of what the app is. |
| 7 | Flexibility & Efficiency | 3 | Skip link, focus-visible ring, `prefers-reduced-motion` guards, in-page anchors; but main nav links point to separate routes, not homepage sections. |
| 8 | Aesthetic & Minimalist Design | 3 | Single-accent restraint is real; EssentialFeatures' 6 equal-weight cards are the one place hierarchy flattens. |
| 9 | Help Users Recognize/Recover from Errors | 3 | Silent FX fallback is honest ("aproximados") but gives no freshness signal; no other error surfaces on a static page. |
| 10 | Help & Documentation | 3 | FAQ hits the anxious questions (which unis, is it free, cancel, payments); missing "¿necesito internet?" for the low-data audience. |
| **Total** | | **28/40** | **Good — address weak areas, solid foundation** |

Up from 22/40. The +6 came from accessibility/state work (skip link, focus-visible, reduced-motion, lightbox keyboard trap), the hero-metric removal, and the card-parade restructure. The gaps that didn't move: CTA/label consistency (H4 stayed at 2), product-show placement (H6 stayed at 2).

## Anti-Patterns Verdict

**Does this look AI-made?** The page has moved past the "obviously AI-generated" floor. Two structural decisions did the heavy lifting: the hero-metric template was actually removed (Hero is now logos + h1 + subtitle + 2 CTAs, no stat cards), and the 13-card parade was genuinely restructured into three different primitives — one card grid (EssentialFeatures), one dechromed inline-text band (WhyChooseUs, no icons/borders), and one numbered connected step flow (HowItWorks with a connector line, no card chrome).

The absolute bans hold: no side-stripes, no gradient text (banned utility deleted, `bg-gradient-dark` confined to CTA panel), no glassmorphism on card bodies, no uppercase-tracked eyebrows, numbered markers confined to a real ordered sequence.

Two tells remain. **EssentialFeatures** is now the *only* card grid — six icon cards in a 3-col grid, which makes it stand out more, not less. And **rhythm**: SectionHeader is invoked six times, always centered, always h2 + subtitle, with strict ink/surface band alternation — one metronomic pattern repeated six times. A designer wouldn't call it "AI," but would call it "template-tidy." The hero and the CTA panel are the only places that break the mold.

**Deterministic scan:** 2 warnings, both in `Base.astro`, both **false positives** — Material Symbols is an icon set (not text typography), and the single-Inter choice is the deliberate One Voice Rule. The detector caught zero real anti-patterns.

## Overall Impression

A materially better page than the prior run. The hero is now credible and outcome-focused, the card monotony is broken, accessibility is systematized, and the Pricing section is genuinely excellent for the audience. The page reads as "competent and on-brand" rather than "AI template." The remaining gap is between "good" and "great": EssentialFeatures is the last flat grid, the product proof arrives too late, and the page never shows a single real student or outcome — for a coach brand whose promise is *visible progress*, that absence is the biggest strategic gap.

## What's Working

- **The hero after restructure.** Three real university logos, the `<mark>` moved to "la U" (outcome over tech), subtitle closing on "gratis para todos," exactly two CTAs. Specific, credible, on-voice. The `<mark>` shift is a genuine emotional upgrade.
- **Pricing's dual-currency honesty.** Colones primary (800-weight, large), USD secondary with ≈, server-rendered fallback so the price is never blank, 1-hour cache, explicit "aproximados / cancela cuando quieras / PayPal" note, amber Premium styling with AA-safe contrast (6.97:1). Exactly right for a price-sensitive Costa Rican audience.
- **The parade restructure into three primitives.** Breaking 13 identical cards into card grid + dechromed inline band + numbered connected flow is the single biggest move away from the AI-template read. WhyChooseUs lets the copy carry the weight; HowItWorks' connector line is a real ordered sequence, not scaffold.

## Priority Issues

**[P1] Gallery screenshots are outdated (gallery.md TODO).**
- *What:* The six `/images/promo/*.png` captures are flagged as stale and don't match the current product.
- *Why it matters:* Gallery is the one section that proves the product is real. Stale proof is worse than no proof: a student who has seen the real app feels misled at the precise moment trust is being earned.
- *Fix:* Replace all six captures with current ones matching the captions; until then, remove the section or mark it "próximamente." The captions are excellent — keep them.
- *Suggested command:* `/impeccable polish`

**[P1] EssentialFeatures is a flat 6-card icon grid — the last AI-grid tell.**
- *What:* Six equal-weight cards (48px badge + h3 + p), two Premium-tagged with only a tiny amber chip. No card is prioritized; the section reads as "fill 3×2."
- *Why it matters:* It's the only remaining card grid, so it carries the entire "card grid" connotation alone. Six equal doors raise cognitive load and give no signal about where to start. Also mismatches Pricing: "Exámenes" isn't Premium-tagged here, but unlimited exams are a Premium feature.
- *Fix:* Reduce to 3 primary cards (Chat, Exámenes, Rankings) and demote Videos/Podcasts/Historial into a compact "también incluido / con Premium" cluster, or give the lead card a 2-col span. Reconcile the Premium affiliation with the Pricing feature list.
- *Suggested command:* `/impeccable distill`

**[P1] The product is shown too late.**
- *What:* Gallery sits at position 5, after EssentialFeatures, WhyChooseUs, and HowItWorks — four sections of claims before the first product image.
- *Why it matters:* PRODUCT.md principle #3 is "show, don't tell." A visitor forms an impression in the first scroll; making them read four claim-sections before seeing the actual chat/exam/ranking interface delays the credibility payoff.
- *Fix:* Move Gallery to immediately after the Hero (or after EssentialFeatures), so the product proof arrives early and grounds the feature claims that follow.
- *Suggested command:* `/impeccable layout`

**[P2] CTA label inconsistency.**
- *What:* The same destination (chat.ubotcr.com) is labeled "Comenzar gratis" (hero), "Comenzar gratis" (header), "Comenzar gratis" (free plan), and "Comenzar gratis ahora" (CTA panel). Plus "Obtener Premium" and "Ver planes."
- *Why it matters:* Three variants of the primary signup label break recognition, dilute analytics event names, and contribute to banner blindness — the audience sees "Comenzar gratis" four times and stops reading it.
- *Fix:* Standardize the free-signup label to one string everywhere; reserve the "ahora" escalation for the final CTA panel only if intentional.
- *Suggested command:* `/impeccable clarify`

**[P2] Unexplained jargon: "Elo" and "Flipmatch."**
- *What:* EssentialFeatures mentions "puntos Elo"; gallery captions mention "ELO"; pricing lists "Flipmatch sin límites." Neither term is defined anywhere, including the FAQ.
- *Why it matters:* A Costa Rican high-schooler does not know what an Elo rating system is or what Flipmatch is. The brand voice is "plain and warm, like a study partner" — jargon without a gloss breaks that voice.
- *Fix:* Add a one-line inline gloss ("puntos Elo — el sistema que mide tu nivel, como en el ajedrez"); explain Flipmatch in one phrase or link to it. Fold a "¿Qué significa…?" FAQ entry in.
- *Suggested command:* `/impeccable clarify`

## Persona Red Flags

**Jordan (first-timer):** Clicks "Comenzar gratis" → ejected to chat.ubotcr.com with no transition context. Scrolls to EssentialFeatures: six cards, no "start here" signal. Reads "Flipmatch sin límites" in the Premium plan — has no idea what Flipmatch is, no gloss, no FAQ entry.

**Riley (stress tester):** Disables JS — pricing fallback renders (good). Notices `applyRate` has no sanity bounds (a malformed rate of ₡9999 would render unchecked). Opens lightbox — focus trap works, arrows work, Esc closes, focus restores (good). But the caption (`text-white/80` on `bg-black/80`) sits over arbitrary screenshot content with no scrim — over a bright white exam screenshot the caption can drop below AA. HowItWorks' `border-4 border-body` is heavier than the hairline connector it sits on.

**Casey (mobile):** The header "Comenzar gratis" button is `hidden md:flex` — the primary conversion action is buried behind a menu tap on the majority device. EssentialFeatures stacks to 1-col → six tall cards with no way to skim. Sees "Comenzar gratis" four times across the scroll → banner blindness.

**"Mateo," 17, mid-range Android, prepago data, studies at night, anxious about UCR:** Hero loads four `loading="eager"` images (3 logos + header school logo) on a metered connection. Reads "Prepárate para la U" — feels seen. Hits "puntos Elo" — "¿Qué es eso?" No answer. Reaches Gallery — screenshots are outdated and don't match the real app his friend showed him. Trust drops. Wants to know "¿necesito internet todo el tiempo?" — not in the FAQ. Taps "Comenzar gratis" → leaves to chat.ubotcr.com; on prepago data, a heavy app load is a cost he wasn't warned about.

## Minor Observations

- EssentialFeatures puts `text-2xl` on the badge *and* `text-[1.5rem]` on the inner Icon — two competing font-size utilities on the same element.
- CTA panel h2 uses fixed `text-3xl md:text-4xl` instead of the fluid `clamp()` headline token every other section h2 uses — breaks the type scale.
- WhyChooseUs frontmatter still defines `icon` per item but the partial no longer renders icons — dead data.
- Token redundancy: `--color-dark` and `--color-body` are both `#0f1117`; `--color-dark-gray` and `--color-ink-raised` are both `#141925`.
- Footer column heads are `text-sm uppercase tracking-wide` — one step above the Label class the Sentence-Case Rule reserves for uppercase-tracked metadata.
- Free plan renders "≈ $0 USD" under "₡0 / mes" — slightly odd copy for a free tier; consider dropping the USD line when `price === 0`.
- Pricing free-plan button uses `bg-body` (ink) on a `bg-card` (surface) section — the button is *darker* than its card, reading as a hole rather than a button.
- FAQ `subtitle: ""` is an empty string passed to SectionHeader; harmless but messy.
- `scroll-margin-top: 80px` doesn't account for `env(safe-area-inset-top)` on notched devices — anchor jumps could tuck a heading under the header on iPhone.
- Mobile-menu dropdown group label is `uppercase tracking-wide text-gray` — a tiny uppercase-tracked micro-label that edges toward the banned eyebrow pattern.

## Questions to Consider

1. What if the hero's primary CTA didn't eject the visitor to chat.ubotcr.com on the first tap, but instead scrolled to the Gallery (or opened an inline product preview) — would letting students *see* the product before leaving convert better than the immediate off-site bounce?

2. If EssentialFeatures could only keep **three** cards, which three survive — and do the other three become a stronger, more honest one-line "también incluido" footnote? What does the grid look like once it's been forced to choose?

3. The page leads with three university logos and real colones prices — both strong credibility moves — but never shows a single real student, quote, or outcome ("subí 200 puntos en 3 semanas"). For a coach brand whose entire promise is *visible progress*, is the absence of any outcome evidence a bigger gap than every visual polish issue on this list combined?
