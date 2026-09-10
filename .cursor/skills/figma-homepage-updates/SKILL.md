---
name: figma-homepage-updates
description: Matches this site’s homepage to the Figma file (tokens, frames, assets) without guessing. Use when updating homepage UI, matching Figma, fixing visual mismatches, adjusting type/spacing/color, or when the user mentions Figma, tablet, or design tokens.
---

# Figma homepage updates

## Before any visual edit

1. If the target section, breakpoint, or Figma node is unclear, **ask**. Do not assume.
2. Load the Figma MCP skill `figma-design-to-code` before calling `get_design_context`.
3. Call `get_variable_defs` on the frame you are implementing (`Homepage Desktop-03` `6040:137` on the About Page, `Homepage Tablet-02` `5869:721`, and/or `Homepage Mobile-02` `5869:362` unless the user gives a different node; About page desktop is `About Desktop` `5916:827`). Ready Homepage `Desktop-02` is a copy of the desktop hero, not a second source. Do not implement from unsuffixed archive frames.
4. Call `get_design_context` on the **section** node, not only the full page, when the page is too large.
5. Compare tokens to `src/style.css` and the markup. Change the site to match Figma Desktop-03 / Tablet-02 / Mobile-02, not the reverse, unless asked to update Figma **or** an approved exception below already applies.
6. Change only the breakpoint named in the request. Do not restyle tablet or mobile in the same pass.
7. Keep frames editable: auto-layout, variables, and component instances. Do not flatten homepage frames to screenshots. Do not edit the shared default Button L/M/S appearance unless asked. Hover lives as separate components under `Butttons-02`.

File: `https://www.figma.com/design/rNBkruQcCGz3s7uz1xn0bR/Affordable-Bellbottom-Pier-Drilling`

## Breakpoints

- Desktop: 1440 frame `Homepage Desktop-03` `6040:137` (About Page). Full nav from 1030px up (`lg`). Ready copy: `Homepage Desktop-02` `5869:34`.
- Tablet: 768 frame `Homepage Tablet-02` `5869:721`. Hamburger below 1030px. Desktop type from 768px up (`md`).
- Mobile: 400 frame `Homepage Mobile-02` `5869:362`. Mobile type below 768px.

Extra state frames (not full homepage copies):

- `Header Desktop-02 — Solid (after Companies)` — scrolled header
- `Mobile menu open — Homepage Mobile-02` — hamburger overlay (also documents tablet open menu)
- Button hover components beside `Butttons-02`

Keep existing menu overlay behavior. Do not invent extra tablet section layouts beyond that frame.

## Hero (nav overlay + photo overlay)

The header sits on top of the hero (`-mt-[58px]` mobile, `-mt-[93px]` from tablet up). Figma `section-xxl` top padding includes the area behind the menu. Do not paste that token as extra space under the nav.

Content is **bottom-aligned** (`justify-end`). `.hero-inner` padding-top is only the overlay bar; the gap under the nav comes from min-height + `justify-end`. Implemented in `src/style.css` (re-measure if nodes move):

- Mobile (below 768px): min-height `1100px`, padding-top `58px`, padding-bottom `80px` (`Homepage Mobile-02`)
- Tablet and desktop (768px+): min-height `980px`, padding-top `93px`, padding-bottom `80px` (`Homepage Desktop-03` / `Homepage Tablet-02`)
- Gap between hero blocks: `32px` (`gap-8`)
- Photo `opacity-[0.78]`, hex grid `opacity-12`, gradient `from-[rgba(11,11,11,0.11)]` to `to-[rgba(11,11,11,0.63)]`
- Desktop review: `lg:bottom-20` (80px), `lg:right-20`

Do not mix `md:pt-*` with `lg:py-*` on `.hero-inner`. Do not copy this overlay onto `.dark-pattern` unless asked.

## Approved exceptions (code wins until Figma is updated)

- **Photos** in overflow frames: keep Figma crop offsets if present, and always add `object-cover` so images do not stretch.
- **Who We Serve cards:** keep equal height in each breakpoint’s `-02` grid (desktop cards `FILL` equal rows; tablet 398px; mobile 249px). On the site, desktop uses `lg:h-full` + `lg:auto-rows-fr` so all four stretch to the tallest.
- **Header scroll:** the live site switches from a clear overlay to a blurred solid bar at Companies. In Figma that is two states, not one frame that tries to show both.
- **Our Work hover:** Desktop-03 cards are a flat 20% black overlay only. The live site keeps that at rest and adds `.project-card-scrim` on hover/focus (bottom ink gradient). Do not clear the overlay on hover.
- **Soil & Rock drill icon:** Noun Project (`noun-drilling-8343366`), not Streamline. Leave the Figma SVG stroke. Do not redraw it.
- **Equipment vs How We Work spacing:** different on purpose in Desktop-03. Do not copy one section’s gutter onto the other unless asked.

## Assets

Download Figma image/SVG URLs into `public/assets/`. Do not redraw icons. Do not swap photo and grid files without checking both.

## After edits

Follow the project rule to verify in the browser (desktop and mobile). Do not declare tablet verified unless a tablet frame was provided and checked.

## About page

Visual source: `About Desktop` `5916:827` (1440). Hero is 800 tall (shorter than Home); use `.about-hero-inner`, not `.hero-inner`. Same overlay recipe as Home (photo 0.78, hex grid 0.12, ink gradient). No About tablet/mobile frames — do not invent them.

## Out of scope unless the user asks

WordPress/React, hosting, inventing copy that is not in Figma, remaining inner pages (Services, Projects, Careers, Contact).
