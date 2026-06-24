---
name: Ubot
description: The Practice Arena — a dark, focused marketing surface for Costa Rican exam-prep AI.
colors:
  primary: "#267cd1"
  primary-deep: "#1f61a3"
  ink: "#0f1117"
  ink-raised: "#141925"
  surface: "#1a1d27"
  border: "#2a2f3d"
  text: "#f8fafc"
  text-body: "#cbd5e1"
  text-muted: "#94a3b8"
  white: "#ffffff"
  premium: "#f59e0b"
  success: "#22c55e"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.025em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "64px"
  3xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-outline-hover:
    backgroundColor: "{colors.surface}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-hover:
    backgroundColor: "{colors.surface}"
---

# Design System: Ubot

## 1. Overview

**Creative North Star: "The Practice Arena"**

Ubot's surface is a practice arena, not a brochure. The dark ink is the practice floor — the room a student sits in at 11pm grinding timed exams. Mentor Blue is the coach's marker: the line on the whiteboard, the active rep, the streak counter. Everything else stays quiet so the marker reads. The system is refined and restrained; it earns trust through clarity and specificity (real universities, real exam formats, real prices in colones), never through spectacle. Hierarchy comes from weight, size, and a single accent — not from a second typeface or a gradient.

This system explicitly rejects the **generic SaaS / AI-tool landing** reflex: no indigo-to-violet gradient blobs, no glassmorphism cards as decoration, no hero-metric template (big number, tiny uppercase label, supporting stats), no endless identical icon-card grids. It rejects the **dark-mode cliché / neon AI** reflex: the dark theme is not "because tools look cool," there is no neon glow, no trendy AI aesthetic that trades legibility for mood — the dark surface serves night-time, low-data, mobile study sessions. And it rejects **stiff corporate / formal** treatment: Ubot is a coach, not an institution; the voice is Costa Rican Spanish, plain and warm.

**Key Characteristics:**
- Dark, single-accent system: ink surface + one Mentor Blue marker + amber reserved exclusively for Premium.
- Single typeface (Inter) carrying the entire hierarchy via weight and size; no second face.
- Subtle-hybrid elevation: ambient shadows at rest, deepening only as a state response (hover/focus).
- Sentence-case voice everywhere except tiny tracked metadata (stats, plan names, footer heads).
- Refined and restrained: every shadow, border, and ornament earns its place or is removed.

## 2. Colors: The Arena Palette

A dark, near-neutral stage with one confident blue marker and a single reserved amber for Premium. Neutrals carry a faint cool-blue tint (toward the brand's own hue, never toward warm-by-default) so the surface reads as one family with Mentor Blue rather than as generic zinc.

### Primary
- **Mentor Blue** (`#267cd1` / `oklch(0.628 0.134 252)`): The single brand accent. Used on links, primary buttons, active navigation, icon badges, the `<mark>` in the hero, and focus rings. It is the coach's marker — rare and decisive.
- **Deeper Mentor Blue** (`#1f61a3` / `oklch(0.475 0.120 254)`): The hover/pressed state of the primary, and the AA-safe fill for small interactive text where Mentor Blue on the dark surface drops below 4.5:1.

### Secondary (reserved)
- **Premium Amber** (`#f59e0b` / `oklch(0.770 0.160 70)`): Reserved exclusively for Premium signals — the "Premium" feature tag, the highlighted pricing plan border/badge, the "Popular" pill. Never decorative, never on non-Premium elements.

### Neutral
- **Ink** (`#0f1117` / `oklch(0.165 0.015 264)`): The page body and the darkest surface. Where the practice happens.
- **Ink-Raised** (`#141925` / `oklch(0.200 0.018 264)`): The lighter end of the dark gradient (CTA panel `bg-gradient-dark`), and the dark-mode elevated tone.
- **Surface** (`#1a1d27` / `oklch(0.235 0.020 264)`): Cards, the WhyChooseUs/FAQ/Gallery band background, and hover fills. One step up from Ink.
- **Border** (`#2a2f3d` / `oklch(0.335 0.025 264)`): Hairline dividers, card outlines, input strokes, header/footer rules. Subtle but present.
- **Text** (`#f8fafc` / `oklch(0.985 0.003 250)`): Primary headings and high-emphasis text on dark. Near-white with the faintest cool tint.
- **Text-Body** (`#cbd5e1` / `oklch(0.870 0.012 250)`): Prose body in `.content` (markdown pages) and secondary descriptions.
- **Text-Muted** (`#94a3b8` / `oklch(0.700 0.020 257)`): Subtle metadata — stat labels, plan descriptions, footer links. Meets ~6.7:1 on Surface and ~7.5:1 on Ink.
- **White** (`#ffffff`): Pure white for logo containers on the light logo tiles only; not used as body text (Text is near-white instead).
- **Success Green** (`#22c55e` / `oklch(0.720 0.170 145)`): Pricing feature checkmarks only. Never a general accent.

### Named Rules

**The One Marker Rule.** Mentor Blue appears on ≤15% of any given screen. Its rarity is the point. If two large surfaces both want it, one is wrong — step one back to neutral or to Deeper Mentor Blue.

**The Premium Amber Rule.** Amber is a reserved signal, not a color choice. It appears only on Premium-specific affordances (the Premium feature tag, the highlighted pricing plan, the Popular badge). Using amber anywhere else dilutes the paid tier's visual currency.

**The AA Boundary Rule.** Mentor Blue sits at ~4.4:1 on Ink and ~3.9:1 on Surface as text; white-on-Mentor-Blue sits at ~4.3:1. Both are just under the 4.5:1 AA threshold for *normal* text. Therefore: (a) Mentor Blue as a text color is reserved for large/bold text (hero `<mark>`, large links) or for non-text affordances (icon badges, focus rings, active nav at 14px semibold reads as large); (b) for small interactive fills, use Deeper Mentor Blue (`#1f61a3`, white-on-it ≈ 6.4:1); (c) primary button labels must be semibold (600) so the label qualifies for the relaxed large-text path, and btn-lg labels should be tracked for contrast if weight is reduced. Never let Mentor Blue body copy fall below 4.5:1 — bump to Deeper Mentor Blue or to Text.

## 3. Typography

**Display Font:** Inter (sans-serif fallback)
**Body Font:** Inter (sans-serif fallback)

**Character:** A single geometric-grotesque family carries the whole system. Hierarchy is built from weight (400 → 600 → 700 → 800) and size, never from a second typeface. The voice is direct and confident; heavy display weights (800) read as "this matters," not as "shouting."

### Hierarchy
- **Display** (Inter 800, `clamp(2.25rem, 6vw, 3.75rem)`, 1.25): The hero h1 only. One per page. `text-wrap: balance` to keep line lengths even. Never above 3.75rem — above that the page is shouting, not coaching.
- **Headline** (Inter 700, `clamp(1.875rem, 4vw, 2.25rem)`, 1.25): Section h2s. `text-wrap: balance`.
- **Title** (Inter 600, 1.125rem, 1.25): Card and feature h3s, pricing plan names where sentence-case.
- **Body** (Inter 400, 1rem, 1.625): Paragraphs, descriptions, list items. Cap line length at 65–75ch on long prose; `text-wrap: pretty` on prose blocks to reduce orphans.
- **Label** (Inter 600, 0.75rem, 1.5, `letter-spacing: 0.025em`, UPPERCASE): Reserved for tiny tracked metadata only — stat labels, plan-name kickers, footer column heads. Never for buttons, never for section eyebrows, never for body sentences.

### Named Rules

**The One Voice Rule.** One typeface, Inter, in four weights (400/600/700/800). Introducing a second face is a departure from identity and requires an explicit trigger. Hierarchy comes from weight + size + color, not from a competing family.

**The Sentence-Case Rule.** Buttons, nav items, section headings, and body copy are sentence-case. Uppercase tracked type is a *metadata* treatment, not a *heading* treatment — it appears only on Label-class elements (stats, plan kickers, footer heads). Putting an uppercase tracked eyebrow above every section is the saturated SaaS scaffold and is prohibited.

## 4. Elevation

Subtle hybrid. The dark surface relies primarily on **tonal layering** for depth (Ink → Ink-Raised → Surface), with light ambient shadows present at rest and deepening as a state response. Shadows are never dramatic and never colored-glow; the only colored shadow is the faint Mentor-Blue tint on primary buttons, which reads as "pressable," not as "neon."

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 2px 0 rgba(0,0,0,0.10)` — Tailwind `shadow-sm`): Cards and containers at rest. Barely there; defines the edge against the dark surface.
- **Hover** (`box-shadow: 0 4px 6px -1px rgba(0,0,0,0.20), 0 2px 4px -2px rgba(0,0,0,0.20)` — `shadow-md`): Cards and interactive containers on hover, paired with a `-translate-y-0.5` lift.
- **Raised** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.30), 0 4px 6px -4px rgba(0,0,0,0.30)` — `shadow-lg`): The CTA panel and the gallery lightbox. The most elevation anywhere on the site, used twice.
- **Primary glow** (`box-shadow: 0 1px 2px rgba(38,124,209,0.20)` — `shadow-primary/20`): Primary buttons only. A whisper of Mentor Blue under the fill.

### Named Rules

**The State-Response Rule.** Shadows deepen on hover and focus; they do not perform at rest. A card at rest has the Rest shadow; the moment it is interacted with it lifts to Hover. Resting elements never carry Raised or glow shadows — that flattens the hierarchy and makes everything feel equally loud.

**The No-Neon Rule.** Colored shadows are limited to the single Primary glow on buttons. No neon drop-glow on cards, headings, or icons. If a glow would make the page read as "AI tool," it is prohibited.

## 5. Components

Components are refined and restrained: quiet at rest, decisive on interaction. Borders are hairline (`1px` Border), corners are gently curved (8–16px), and motion is short and eased.

### Buttons
- **Shape:** 8px radius (`rounded.md`), inline-flex, semibold, sentence-case, `gap-2` with optional icon.
- **Primary:** Mentor Blue fill, white label, Primary glow. `padding: 10px 20px` (lg: `14px 28px`). Hover → Deeper Mentor Blue fill + Hover shadow. Focus-visible → Mentor Blue ring offset by 2px of Ink.
- **Outline:** transparent fill, 1px Border, Text label. Hover → Surface fill. Focus-visible → Mentor Blue ring.
- **Never:** gradient fills, all-caps labels, side-stripe accents, or a shadow heavier than Hover.

### Cards / Containers
- **Corner:** 12px (`rounded.lg`); pricing and CTA use 16px (`rounded.xl`).
- **Background:** Surface (`#1a1d27`); the WhyChooseUs/FAQ/Gallery band uses Surface as a full-bleed section background against Ink.
- **Border:** 1px Border at rest; on hover, border shifts to `primary/30` (Mentor Blue at 30% alpha) — a state signal, not a decoration.
- **Padding:** 24px default (`p-6`); 32px on pricing (`p-8`).
- **Hover:** `-translate-y-0.5` + Hover shadow + `border-primary/30`. The lift is 2px, never more — cards nudge, they don't jump.
- **Never:** nested cards, side-stripe `border-left` accents, or glassmorphism (backdrop-blur on a card body is prohibited; the header's backdrop-blur is the only exception and is structural, not decorative).

### Icon Badges
- **Style:** 48px square, 12px radius, `bg-primary/10` (Mentor Blue at 10% alpha) with a Mentor Blue Material Symbol. The tint reads as "belonging to the brand" without spending the full accent.
- **Premium tag:** an amber `premium/10` chip with amber text in the card corner — the only place amber appears on a card.

### Navigation
- **Header:** sticky, `bg-body/95 backdrop-blur` (the structural blur exception), 1px bottom Border. 64px tall.
- **Items:** sentence-case, 14px, 500 weight; inactive is Text-Muted, hover → Text, active → Mentor Blue.
- **Dropdown:** hover/focus-triggered, Surface panel, 1px Border, `shadow-lg`; items are Text-Muted → Text on hover. Uses `data-open` attribute, not a CSS `:hover` cascade, so keyboard focus works.
- **Mobile:** grid-rows `[0fr]→[1fr]` expand with opacity crossfade; hamburger ↔ close icon rotate-swap. Link tap closes the menu.

### FAQ
- **Native `<details>`/`<summary>`** for accessibility (no JS toggle needed). Surface-tinted panel on the Surface band, 1px Border → `primary/30` when open. The chevron is a `+` icon in a bordered circle that rotates 45° to `×` and fills Mentor Blue on open. The open animation is a short `translateY` ease-out with a `prefers-reduced-motion` fallback to instant.

### Pricing Card
- **Two plans, 2-col on md.** The highlighted (Premium) plan uses an amber border (`premium/50`) and `premium/5` surface tint with a `shadow-amber-500/10`; the free plan is a standard card.
- **Price:** colones primary (large, 800), USD secondary (`≈ $X USD`). Live USD→CRC conversion via `open.er-api.com` with a 1-hour localStorage cache and a server-rendered fallback rate so the price is never blank.
- **Features:** Success-green check badges, sentence-case, `gap-3`.
- **CTA:** full-width; Premium plan uses amber fill + white text, free plan uses outline style.

### CTA Panel
- **`bg-gradient-dark`** (Ink → Ink-Raised), 16px radius, Raised shadow, two Mentor-Blue/10 blur orbs in opposite corners. The orbs are the only decorative blur on the site and are confined to this one panel. A Mentor-Blue rocket icon leads the button.

### Gallery
- **3-col grid of screenshot tiles**, 1px Border, hover lift + `scale-105` image zoom. Lightbox is a fixed full-screen `bg-black/80 backdrop-blur-sm` overlay with Esc/click-outside close and body-scroll lock.

## 6. Do's and Don'ts

### Do:
- **Do** keep Mentor Blue to ≤15% of any screen (The One Marker Rule); carry everything else in the Ink/Surface/Border neutral family.
- **Do** use Deeper Mentor Blue (`#1f61a3`) for small interactive fills and keep primary button labels semibold (600) so contrast clears the AA boundary (The AA Boundary Rule).
- **Do** build hierarchy from Inter weight + size + the single Mentor Blue marker — never from a second typeface (The One Voice Rule).
- **Do** keep section headings sentence-case; reserve uppercase tracked type for Label-class metadata only (stats, plan kickers, footer heads).
- **Do** let shadows respond to state: Rest at rest, Hover on hover/focus, Raised only for the CTA and lightbox (The State-Response Rule).
- **Do** show the product in action (real exam formats, the chat, the ranking, prices in colones) instead of asserting "AI-powered" — per PRODUCT.md's *show, don't tell*.
- **Do** keep the page fast and usable before JavaScript runs (navigation, FAQ, and pricing fallback all work without JS); the audience is on mobile and slow connections.

### Don't:
- **Don't** use indigo-to-violet gradient blobs, glassmorphism cards, the hero-metric template (big number + tiny uppercase-label stat cards), or endless identical icon-card grids — these are the **generic SaaS / AI-tool landing** anti-reference from PRODUCT.md.
- **Don't** use gradient text (`background-clip: text` over a gradient). The unused `gradient-text-primary` utility in `utilities.css` is a banned pattern and should be removed. Emphasis comes from weight or size, never a color gradient.
- **Don't** add neon glow, dark-for-cool mood, or trendy AI aesthetics that trade legibility for vibe — the **dark-mode cliché / neon AI** anti-reference. The dark theme serves night-time low-data study sessions, not a look.
- **Don't** use stiff corporate formality, university-brochure earnestness, or stock-photo stiffness — the **stiff corporate / formal** anti-reference. Ubot is a coach, not an institution.
- **Don't** put a tiny uppercase tracked eyebrow above every section, or numbered `01 / 02 / 03` markers as default scaffolding. Numbers earn their place only when the section IS a real ordered sequence (the How It Works steps qualify; section eyebrows do not).
- **Don't** use `border-left` or `border-right` greater than 1px as a colored side-stripe accent on cards, list items, callouts, or alerts. Use a full border, a background tint, or nothing.
- **Don't** use amber outside Premium-specific affordances (The Premium Amber Rule), and don't use Success green outside pricing checkmarks.
- **Don't** apply `backdrop-blur` to card bodies (glassmorphism). The sticky header's blur is the only exception and is structural.
- **Don't** let heading copy overflow its container at narrow breakpoints — test headline copy at every width; reduce the clamp max or rewrite the copy before shipping a horizontal scroll.
