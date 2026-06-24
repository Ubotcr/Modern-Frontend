---
target: src/pages/index.astro (homepage)
total_score: 33
p0_count: 0
p1_count: 2
timestamp: 2026-06-24T13-17-09Z
slug: src-pages-index-astro
---
# Critique: Ubot Homepage (`src/pages/index.astro`) — Third Run

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No scrollspy/"you are here" in nav; FX rate swaps silently (fallback → live) with no transition cue. Lightbox `· 3/6` indicator is good. |
| 2 | Match System / Real World | 4 | Excellent: "la U," colones-primary + live FX, Elo/Flipmatch glosses, "combo de comida rápida," prepago-aware FAQ. Feels made for CR students. |
| 3 | User Control & Freedom | 3 | Lightbox is exemplary (Esc, arrows, Tab trap, focus restore). Mobile menu has no Escape handler and no focus trap — the biggest control gap, on the primary device. |
| 4 | Consistency & Standards | 3 | All 7 h2s share the fluid scale (good). Sub-heading scale drifts: WhyChooseUs h3 = text-xl vs EssentialFeatures/HowItWorks h3 = text-lg. |
| 5 | Error Prevention | 3 | No forms to validate. FX never blanks (server-rendered fallback + 1h cache). 404 is clean. Limited surface, handled well. |
| 6 | Recognition Rather Than Recall | 4 | Logos visible, plans side-by-side, FAQ questions visible, gallery captions inline, icon+text everywhere. Strong "show, don't tell." |
| 7 | Flexibility & Efficiency | 3 | Skip link, focus rings, reduced-motion, no-JS graceful. Mobile menu a11y gap + Material Symbols full-range stylesheet is a perf cost on metered connections. |
| 8 | Aesthetic & Minimalist Design | 4 | Restrained, one accent, dechromed bands, fluid type. Only busy spot: 6 icon badges in EssentialFeatures (3 big + 3 small). Contained, not disqualifying. |
| 9 | Help Users Recognize/Recover from Errors | 3 | 404 is friendly + fluid. FX failure is silent-fallback + "referencial" transparency. Small surface, well handled. |
| 10 | Help & Documentation | 3 | FAQ now 6 items incl. the low-data entry; HowItWorks sets expectations. No "¿Aún tienes dudas? Escríbenos" CTA at FAQ end. |
| **Total** | | **33/40** | **Strong — bordering on excellent** |

## Anti-Patterns Verdict

The page has moved clearly past "AI-generated" into the "purpose-built product surface" band. The last major card-grid tell — six equal feature cards — is gone, replaced by a 3-primary + 3-demoted hierarchy that reads as editorial choice. Gallery at position 3 means product proof arrives before more text — the opposite of the generic scaffold. All absolute bans check clean: no gradient blobs, no glassmorphism on cards, no hero-metric template, no gradient text, no neon, no uppercase-tracked eyebrows, no side-stripes, amber confined to Premium, green confined to pricing checks.

The one remaining "template fingerprint" is small: the three EssentialFeatures primary cards are still textbook identical icon-cards — same 48px badge, same text-lg title, same text-sm body, same border + shadow, in a clean 3-up grid. Three isn't "endless" and the demoted cluster breaks the monotony, so it clears the ban — but it's the one place a designer's eye still reads "feature grid pattern."

**Deterministic scan:** 2 warnings, both known false positives (Material Symbols icon set, single-Inter One Voice Rule). Zero real anti-patterns detected.

## Overall Impression

A strong, purpose-built surface that feels made for Costa Rican students — not generated for a category. The score moved from 22 → 28 → 33, and the gains are honest: real-world match is now excellent (H2 = 4), aesthetic restraint is excellent (H8 = 4), and recognition is excellent (H6 = 4). The remaining gap between "strong" and "excellent" is narrow: mobile menu a11y, FX fetch on load (prepago data cost), and the one remaining 3-up card pattern. The biggest strategic gap is still outcome evidence — no real student quotes or results — but that's a content gap, not a design defect.

## What's Working

- **Real-world match is the superpower.** Costa Rican Spanish, colones-primary with live FX + server fallback, "la U," Elo/Flipmatch glosses, prepago-aware FAQ, TikTok in the footer. No generic SaaS landing could ship this copy.
- **Proof-before-patience pacing.** Gallery at position 3 turns "show, don't tell" into actual page structure. Combined with native-details FAQ and the 3+3 feature hierarchy, the page respects attention.
- **Accessibility treated as the brand promise.** Skip link, global focus ring, reduced-motion, no-JS graceful degradation, safe-area scroll margin, lightbox with Esc/arrows/Tab-trap/focus-restore. Matches PRODUCT.md's "accessibility is access" literally.

## Priority Issues

**[P1] Mobile menu: no Escape-to-close, no focus trap.**
- *What:* Header.astro script handles toggle + outside-click + link-close, but never Escape, and Tab can escape behind the overlay.
- *Why:* The primary audience is mobile. An open menu that ignores Escape and leaks focus is both a WCAG gap and a usability irritant on the exact persona the product serves.
- *Fix:* Add a keydown Escape → closeMenu() on document; trap Tab within [menu-toggle, …mobile links, nav CTA] while open, mirroring the lightbox pattern.
- *Suggested command:* `/impeccable harden`

**[P1] FX conversion fires on page load, not on pricing approach (prepago data cost).**
- *What:* initPricingConversion() runs immediately on script execution, hitting open.er-api.com even if the user never scrolls to pricing.
- *Why:* Metered/prepago connections pay for that request in data for a section they may never reach. The fallback rate already renders server-side, so the live fetch is a progressive enhancement and should behave like one.
- *Fix:* Gate the fetch behind an IntersectionObserver on #pricing; keep cache read on load for returning visitors.
- *Suggested command:* `/impeccable optimize`

**[P2] EssentialFeatures primary cards still read as a 3-up icon-card template.**
- *What:* Three identical icon-badge + title + body cards in a clean 3-col grid — the last "pattern" moment on the page.
- *Why:* Clears the "endless identical grid" ban but is the one section a design director still reads as "feature grid." Differentiating it would close the good→excellent gap.
- *Fix:* Elevate "Chat con IA" (the core loop) into a larger featured tile with a small product crop; keep "Exámenes" + "Rankings" as two equal supporting cards — 1 hero + 2 supporters, asymmetric.
- *Suggested command:* `/impeccable layout`

**[P2] Two identical "Comenzar gratis" primary CTAs on first paint.**
- *What:* Sticky nav button and hero primary button share the exact label, link, and Mentor Blue fill, both visible at the top.
- *Why:* Redundant decision point + mild One Marker Rule tension. The persistent nav CTA is fine, but the identical label makes it feel duplicated.
- *Fix:* Differentiate the label (nav: "Abrir app"; hero: "Comenzar gratis") or treatment (nav CTA → btn-outline so the hero owns the primary fill on first paint).
- *Suggested command:* `/impeccable clarify`

**[P3] Sub-heading scale drift + no scrollspy.**
- *What:* WhyChooseUs h3 = text-xl (1.25rem) while EssentialFeatures/HowItWorks h3 = text-lg (1.125rem); nav has no active-section indicator on scroll.
- *Why:* The size jump reads as accidental. No scrollspy means a long single-page journey never shows "you are here."
- *Fix:* Align WhyChooseUs h3 to text-lg; add a lightweight IntersectionObserver scrollspy toggling text-link on the matching nav item.
- *Suggested command:* `/impeccable polish`

## Persona Red Flags

**Jordan (first-timer):** Elo and Flipmatch glosses help — no bounce on unknown terms. "Recursos" dropdown relies on the expand_more glyph to signal "dropdown" — a first-timer who doesn't hover may miss Blog/Changelog. "tipo de cambio referencial" — "referencial" is mild finance jargon; "aproximado" alone would scan faster.

**Riley (stress tester):** Lightbox survives: arrows wrap, Esc closes, Tab trapped, focus restored. But pressing Escape while the mobile menu is open does nothing — no handler. Tab can leave the mobile menu and reach content behind the overlay. Gallery's import.meta.glob fallback path renders a raw <img> if the processed asset isn't found — a missing file shows a broken-image tile.

**Casey (mobile, slow connection):** Tap targets generous, CTAs centered, scroll-margin respects the notch. But Material Symbols Rounded loads the full glyph range via a render-blocking Google Fonts stylesheet — a real first-paint cost for a handful of decorative icons. The FX fetch fires on load regardless of whether pricing is reached — prepago data spent on a section Casey may never scroll to.

**"María," 17, prepago, shared family phone, night studier:** She feels seen: "la U," colones, "menos que un combo de comida rápida," "¿Necesito internet todo el tiempo?" → "funciona en el navegador de tu celular, sin descarga." Best audience-fit work on the page. Outdated gallery screenshots (known TODO) are a credibility risk specifically because Gallery now sits at position 3. ₡2,500 (fallback) flashing to ₡2,5XX (live) on a slow connection — the number changes after the fact.

## Minor Observations

- All 7 section h2s confirmed on the same fluid clamp scale — the fixed-breakpoints issue is resolved.
- <mark> on the 800-weight 36px+ h1 qualifies as large-bold text, so Mentor Blue at ~4.4:1 clears the 3:1 large-text threshold. Correct.
- HowItWorks connector line aligns with the 48px nodes' centers; the border-4 border-body ring masks the line behind each node. Nice detail.
- Free-plan button is now bg-transparent + border — reads as a proper outline affordance, not a "hole." Good fix.
- EssentialFeatures included cluster uses bg-card/50 — a tonal half-step down from the primary bg-card cards. Hierarchy is felt, not stated.
- FAQ slide-down animation has no in-component reduced-motion guard, but base.css's global block neutralizes it. Covered.
- 404 is fluid with btn-lg — clean, on-brand.
- Footer social set (Facebook, Instagram, TikTok) is the right channel mix for the CR student audience.

## Questions to Consider

1. The h1 leads with the tech — "con inteligencia artificial" — while the brand's voice is "coach, not hype." Would leading with the student ("Prepárate para la U, repaso a repaso") and letting the features prove the AI be more on-North-Star than naming the AI in the headline?

2. EssentialFeatures is the last template fingerprint. If "Chat con IA" — the core daily loop — became a single featured tile with a small real product crop, and "Exámenes" + "Rankings" sat as two supporters, would that simultaneously kill the 3-up-grid tell and advance "show, don't tell" inside the features section itself?

3. Every CTA opens a new tab to chat.ubotcr.com — no on-site on-ramp and no email capture. For price-sensitive, trust-cautious students (and paying parents), would a lightweight pre-app step ("elige tu universidad" → app) lift signup among the hesitant, or does the straight-to-app friction convert better for this audience?
