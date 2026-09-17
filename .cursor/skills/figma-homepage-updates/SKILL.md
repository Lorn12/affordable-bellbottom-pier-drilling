---
name: figma-homepage-updates
description: Matches this site’s homepage to the Figma file (tokens, frames, assets) without guessing. Use when updating homepage UI, matching Figma, fixing visual mismatches, adjusting type/spacing/color, or when the user mentions Figma, tablet, or design tokens.
---

# Figma homepage updates

## Before any visual edit

1. If the target section, breakpoint, or Figma node is unclear, **ask**. Do not assume.
2. Load the Figma MCP skill `figma-design-to-code` before calling `get_design_context`.
3. Call `get_variable_defs` on the frame you are implementing (`Homepage Desktop-V1` `6161:112` on Ready Homepage and mobile, `Homepage Large Tablet-V1` `6217:356` (1280), `Homepage Regular Tablet-V1` `5869:721` (768), and/or `Homepage Mobile-V1` `5869:362` unless the user gives a different node; About is `About Desktop-V1` `6546:410`, `About Large Tablet-V1` `6546:1573`, and `About Regular Tablet-V1` `6552:5848` on **About Page**). Do not implement from unsuffixed archive frames.
4. Call `get_design_context` on the **section** node, not only the full page, when the page is too large.
5. Compare tokens to `src/style.css` and the markup. Change the site to match Figma Desktop-V1 / Regular Tablet-V1 / Mobile-V1, not the reverse, unless asked to update Figma **or** an approved exception below already applies.
6. Change only the breakpoint named in the request. Do not restyle tablet or mobile in the same pass.
7. Keep frames editable: auto-layout, variables, and component instances. Do not flatten homepage frames to screenshots. Do not edit the shared default Button L/M/S appearance unless asked. Hover lives as separate components under `Butttons-02`.

File: `https://www.figma.com/design/rNBkruQcCGz3s7uz1xn0bR/Affordable-Bellbottom-Pier-Drilling`

## Breakpoints

- Desktop: 1440 frame `Homepage Desktop-V1` `6161:112` on Ready Homepage and mobile. Full nav from 1280px up (`lg`).
- Tablet: 1280 frame `Homepage Large Tablet-V1` `6217:356` on Ready Homepage and mobile. Hamburger below 1280px (tablet layout from 768px through 1279px). Min-width reference: `Homepage Regular Tablet-V1` `5869:721` (768). Desktop type from 768px up (`md`).
- Mobile: 400 frame `Homepage Mobile-V1` `5869:362`. Mobile type below 768px.

Extra state frames (not full homepage copies):

- `Header Desktop-02 — Solid (after Companies)` — scrolled header
- `Mobile menu open — Homepage Mobile-02` — hamburger overlay (also documents tablet open menu)
- Button hover components beside `Butttons-02`, including `Icon Button Arrow` (`6413:240`) Default / Hover (Neutral-200), 52px

Keep existing menu overlay behavior. Do not invent extra tablet section layouts beyond that frame.

## Hero (nav overlay + photo overlay)

The header sits on top of the hero (`-mt-[58px]` mobile, `-mt-[93px]` from tablet up). Figma `section-xxl` top padding includes the area behind the menu. Do not paste that token as extra space under the nav.

Content is **bottom-aligned** (`justify-end`). `.hero-inner` padding-top is only the overlay bar; the gap under the nav comes from min-height + `justify-end`. Implemented in `src/style.css` (re-measure if nodes move):

- Mobile (below 768px): min-height `944px`, padding-top `58px`, padding-bottom `80px` (`Homepage Mobile-V1`)
- Tablet (768–1279): min-height interpolates Regular Tablet-V1 `924px` → Large Tablet-V1 `900px`; padding-top `93px`, padding-bottom `80px`
- Desktop (1280px+): min-height `824px`, padding-top `93px`, padding-bottom `80px` (`Homepage Desktop-V1`)
- Gap between hero blocks: `32px` (`gap-8`)
- Photo `opacity-[0.78]`, hex grid `opacity-12`, gradient `from-[rgba(11,11,11,0.225)]` to `to-[rgba(11,11,11,0.846)]` (Option A ink wash: Figma gradient layer 0.9, stops 0.25→0.94)
- Desktop review: `lg:bottom-20` (80px), `lg:right-20`

Do not mix `md:pt-*` with `lg:py-*` on `.hero-inner`. Do not copy this overlay onto `.dark-pattern` unless asked.

## Approved exceptions (code wins until Figma is updated)

- **Photos** in overflow frames: keep Figma crop offsets if present, and always add `object-cover` so images do not stretch. Do **not** add a second `overflow-hidden` + radius wrapper around a `<picture>` to place an overlay — that makes photos blurry on high-DPI screens. Round the `<img>`. Overlay controls are siblings. Keep `srcset`, `sizes`, `width`, `height`, and `alt`. Our Services: `.service-card-photo` uses 8px / 42px corners; the 52px arrow sits 6px from the right and 9px from the photo bottom on every breakpoint. Our Work uses the same 52px lime/Neutral-200 button, top-right.
- **Who We Serve cards:** Copy is audience tiles: Concrete Contractors, Home Builders, Pool Companies, Direct Clients, plus Based in Hockley, Texas. Desktop-V1 and Large Tablet-V1 are a 560px side-by-side bento (left photo 1fr, right stack 2fr; top row 1fr/2fr). Apply that from `min-[1024px]` (hamburger still below 1280). Regular Tablet-V1 stacks a 400px photo over two 272px rows (2-col then 3-col). Mobile-V1 stacks every tile full-width like the site (do not keep the cramped 2/3-column bento). Keep `bg-black/40` on the Concrete Contractors photo so the caption stays readable. The Discuss Your Project text link uses full `text-lime-dark` like View All Services (do not fade the CTA with the intro copy).
- **Header scroll:** the live site switches from a clear overlay to a blurred solid bar at Companies. In Figma that is two states, not one frame that tries to show both.
- **Our Work hover:** Desktop-V1 cards are a flat 20% black overlay only. The live site keeps that at rest and adds `.project-card-scrim` on hover/focus (bottom ink gradient). Do not clear the overlay on hover. Circular arrows use `.icon-arrow-btn` at 52px on Our Services and Our Work (all breakpoints); card hover/focus/active fills Neutral-200 (`#f1f1f1`). Figma hover is a variant next to `Butttons-02`, not a change to the default lime rest state.
- **Soil & Rock drill icon:** Noun Project (`noun-drilling-8343366`), not Streamline. Leave the Figma SVG stroke. Do not redraw it.
- **Equipment vs How We Work spacing:** different on purpose in Desktop-V1. Do not copy one section’s gutter onto the other unless asked. How We Work steps (Left Content Container) stay full column width with no `max-width` at tablet, mobile, or desktop.

## Assets

Download Figma image/SVG URLs into `public/assets/`. Do not redraw icons. Do not swap photo and grid files without checking both. `srcset` `w` descriptors must match the file’s real pixel width. After any photo markup change, confirm the image is sharp on desktop and mobile (not only that the layout matches).

## After edits

Follow the project rule to verify in the browser (desktop and mobile). Do not declare tablet verified unless a tablet frame was provided and checked.

## About page

Visual source on **About Page**:

- Desktop: `About Desktop-V1` `6546:410` (1440). Full nav from 1280px (`lg`).
- Large tablet: `About Large Tablet-V1` `6546:1573` (1280) — visual source from `min-[1024px]` through 1279 (hamburger still below 1280).
- Regular tablet: `About Regular Tablet-V1` `6552:5848` (768) — visual source for 768–1023.
- Mobile: `About Mobile-V1` `6595:1954` (400). Why Choose Us stacks the bento full-width like Homepage Mobile-V1 Who We Serve.

Hero uses `.about-hero-inner`, not `.hero-inner`. Same overlay recipe as Home (photo 0.78, hex grid 0.12, ink gradient). Regular Tablet-V1 hero is 742 tall; Large Tablet-V1 / Desktop-V1 are 800. Interpolate 742→800 across 768–1279. Capabilities marquee after the hero matches the homepage strip. Who We Are photos are 400 tall: Regular Tablet-V1 is a 2-up + full-width third photo with stacked captions; 3-column photos and caption row from `min-[1024px]`. Fill with `object-cover` (do not use the Figma 156% crop offsets). Why Choose Us Regular Tablet-V1 matches the homepage regular-tablet bento (400px photo over 2-col then 3-col rows); side-by-side 560px bento from `min-[1024px]`; About Mobile-V1 stacks every tile full-width. Keep `bg-black/40` on the Why Choose photo so captions stay readable. Equipment & Access and the quote CTA stack on Regular Tablet-V1 and go side-by-side from `min-[1024px]`.

## Out of scope unless the user asks

WordPress/React, hosting, inventing copy that is not in Figma, remaining inner pages (Services, Projects, Careers, Contact).
