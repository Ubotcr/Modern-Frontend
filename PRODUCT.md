# Product

## Register

brand

## Users

Costa Rican high-school students and recent graduates preparing for the admission
exams of the three main public universities — UCR, UNA, TEC. They study alongside
school or work, are often time-poor and stressed, and reach the site mostly on
mobile devices, sometimes over slow or metered connections. Many cannot afford a
traditional academia or private prep course, so price and access are decisive.

Secondary audience: parents and guardians who may pay for Ubot Premium on behalf
of a student, and who need to trust the product quickly.

## Product Purpose

Ubot is an AI assistant that helps students prepare for Costa Rican public-
university admission exams: chat-based doubt solving, timed practice exams in the
real test format, national rankings with a daily streak and Elo points,
explanatory videos and podcasts, and synced history across devices. A free plan
covers the essentials; Ubot Premium ($5/mo) unlocks unlimited exams, weekly
exclusive exams, media generation, and priority AI responses.

This Astro site is the marketing surface for that product. The app itself lives
separately at chat.ubotcr.com. The landing page exists to convert visitors into
free signups and to upsell Premium — while establishing Ubot as the credible,
accessible, AI-native way to prep for the Costa Rican admission exams. Success is
measured by signup rate and Premium conversion, not by page views.

## Brand Personality

Confident, motivating, expert. Ubot is a coach that believes in the student —
direct and encouraging, never lecturing or corporate. The voice is Costa Rican
Spanish, plain and warm, the kind of tone a good study partner uses: "you've got
this, here's the next rep." Emotionally the goal is confidence plus momentum —
lower exam anxiety by making progress visible and practice feel repeatable, not
by hyping the AI.

## Anti-references

What this must NOT look like.

- **Generic SaaS / AI-tool landing.** No indigo-to-violet gradient blobs, no
  glassmorphism cards as decoration, no hero-metric template (big number, tiny
  uppercase label, supporting stats), no endless identical icon-card grids. These
  read as template, not as a product made for Costa Rican students.
- **Dark-mode cliché / neon AI.** No "dark because tools look cool," no neon glow,
  no trendy AI aesthetic that trades legibility for mood. The dark theme is a
  deliberate choice to serve night-time, low-data, mobile study sessions — not a
  vibe.
- **Stiff corporate / formal.** No university-brochure formality, no corporate
  stiffness, no stock-photo earnestness. This is a coach, not an institution.

## Design Principles

1. **Practice what you preach.** Ubot sells an intelligent, well-crafted study
   tool; the landing page must itself feel intelligent and well-crafted. Generic
   template moves undermine the product promise. The craft is the proof.
2. **Coach, don't lecture.** Every section should push the student forward — show
   momentum, ranking, streaks, the next rep — rather than lecture about features.
   Confidence comes from visible progress, not from adjectives.
3. **Show, don't tell.** Show the product in action (real exam formats, the chat,
   the ranking) instead of asserting "AI-powered learning." Specifics beat
   abstractions; real university names and real prices in colones beat buzzwords.
4. **Accessibility is access.** The product's entire promise is access to exam
   prep for every Costa Rican student. The site must work on the devices and
   connections those students actually have: fast on mobile, legible at WCAG AA,
   graceful on slow networks. Performance and accessibility are brand promises,
   not checkboxes.
5. **Expert confidence, not hype.** Earn trust through clarity and specificity —
   the three universities, the real exam models, the actual price in colones —
   not through gradient spectacle or AI buzzwords. Calm authority.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body and placeholder text must meet 4.5:1 contrast against
their background; large text and UI boundaries 3:1. Full keyboard support for
navigation, dropdowns, the gallery lightbox, and the FAQ accordion (the latter
already uses native `<details>`). Every animation needs a
`prefers-reduced-motion` alternative. Icons are decorative unless they carry
meaning, in which case they get an accessible label. Language is Costa Rican
Spanish throughout (`lang="es"`).

Because the audience is on mixed mobile devices and sometimes slow or metered
connections, performance is an accessibility concern: defer non-critical work,
lazy-load below-the-fold media, and keep the page usable before JavaScript runs.
