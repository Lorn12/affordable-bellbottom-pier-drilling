---
name: figma-homepage-updates
description: Matches this site’s homepage to the Figma file (tokens, frames, assets) without guessing. Use when updating homepage UI, matching Figma, fixing visual mismatches, adjusting type/spacing/color, or when the user mentions Figma, tablet, or design tokens.
---

# Figma homepage updates

## Before any visual edit

1. If the target section, breakpoint, or Figma node is unclear, **ask**. Do not assume.
2. Load the Figma MCP skill `figma-design-to-code` before calling `get_design_context`.
3. Call `get_variable_defs` on the frame you are implementing (`Homepage Desktop-03` `5916:490` on the About Page, `Homepage Tablet-02` `5869:721`, and/or `Homepage Mobile-02` `5869:362` unless the user gives a different node). Do not implement from Desktop-02 or unsuffixed archive frames.
4. Call `get_design_context` on the **section** node, not only the full page, when the page is too large.
5. Compare tokens to `src/style.css` and the markup. Change the site to match Figma Desktop-03 / Tablet-02 / Mobile-02, not the reverse, unless Lauren asks to update Figma **or** an approved exception below already applies.
6. Change only the breakpoint Lauren asked for. Do not restyle tablet or mobile in the same pass.
7. Keep frames editable: auto-layout, variables, and component instances. Do not flatten homepage frames to screenshots. Do not edit the shared default Button L/M/S appearance unless Lauren asks. Hover lives as separate components under `Butttons-02`.

File: `https://www.figma.com/design/rNBkruQcCGz3s7uz1xn0bR/Affordable-Bellbottom-Pier-Drilling`

## Breakpoints

- Desktop: 1440 frame `Homepage Desktop-03` `5916:490` (About Page). Full nav from 1030px up (`lg`). Previous desktop: `Homepage Desktop-02` `5869:34`.
- Tablet: 768 frame `Homepage Tablet-02` `5869:721`. Hamburger below 1030px. Desktop type from 768px up (`md`).
- Mobile: 400 frame `Homepage Mobile-02` `5869:362`. Mobile type below 768px.

Extra state frames (not full homepage copies):

- `Header Desktop-02 — Solid (after Companies)` — scrolled header
- `Mobile menu open — Homepage Mobile-02` — hamburger overlay (also documents tablet open menu)
- Button hover components beside `Butttons-02`

Keep existing menu overlay behavior. Do not invent extra tablet section layouts beyond that frame.

## Hero top spacing (nav overlay)

The header sits on top of the hero (`-mt-[58px]` mobile, `-mt-[93px]` from tablet up). Figma `section-xxl` top padding is measured from the **hero top**, including the area behind the menu. Do not paste that token as visible space under the nav.

Match the **look**: `padding-top: header overlay + (Hero Content y − menu height)`.

Implemented on `.hero-inner` in `src/style.css` (re-measure in Figma if those nodes move):

- Mobile (below 768px): `58px` overlay bar (Mobile-02 menu hugs to 58) + remaining gap under the nav to match Hero Content. Re-measure on `Homepage Mobile-02` if nodes move.
- Tablet and desktop (768px+): `93px` overlay bar + remaining gap under the nav. Re-measure on `Homepage Desktop-03` / `Homepage Tablet-02` if nodes move.

Do not mix `md:pt-*` with `lg:py-*` on the same box; `padding-top` can lose to the `md` utility. Set hero top padding in CSS, and leave bottom padding as-is unless the user asks.

## Approved exceptions (code wins until Lauren updates Figma)

- **Photos** in overflow frames: keep Figma crop offsets if present, and always add `object-cover` so images do not stretch.
- **Who We Serve cards:** keep equal height in each breakpoint’s `-02` grid (desktop cards `FILL` equal rows; tablet 398px; mobile 249px). On the site, desktop uses `lg:h-full` + `lg:auto-rows-fr` so all four stretch to the tallest.
- **Header scroll:** the live site switches from a clear overlay to a blurred solid bar at Companies. In Figma that is two states, not one frame that tries to show both.

## Assets

Download Figma image/SVG URLs into `public/assets/`. Do not redraw icons. Do not swap photo and grid files without checking both.

## After edits

Follow the project rule to verify in the browser (desktop and mobile). Do not declare tablet verified unless a tablet frame was provided and checked.

## Out of scope unless the user asks

Inner pages, WordPress/React, hosting, inventing copy that is not in Figma.
