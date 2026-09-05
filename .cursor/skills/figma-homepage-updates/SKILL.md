---
name: figma-homepage-updates
description: Matches this site’s homepage to the Figma file (tokens, frames, assets) without guessing. Use when updating homepage UI, matching Figma, fixing visual mismatches, adjusting type/spacing/color, or when the user mentions Figma, tablet, or design tokens.
---

# Figma homepage updates

## Before any visual edit

1. If the target section, breakpoint, or Figma node is unclear, **ask**. Do not assume.
2. Load the Figma MCP skill `figma-design-to-code` before calling `get_design_context`.
3. Call `get_variable_defs` on the frame you are implementing (desktop `5162:587`, tablet `5435:27`, and/or mobile `5162:925` unless the user gives a different node).
4. Call `get_design_context` on the **section** node, not only the full page, when the page is too large.
5. Compare tokens to `src/style.css` and the markup. Change the site to match Figma, not the reverse, unless the user asks to update Figma **or** an approved exception below already applies.
6. Change only the breakpoint Lauren asked for. Do not restyle tablet or mobile in the same pass.

File: `https://www.figma.com/design/rNBkruQcCGz3s7uz1xn0bR/Affordable-Bellbottom-Pier-Drilling`

## Breakpoints

- Desktop: 1440 frame `5162:587`. Full nav from 1030px up (`lg`).
- Tablet: 768 frame `5435:27` (draft cloned from desktop). Hamburger below 1030px. Desktop type from 768px up (`md`).
- Mobile: 400 frame `5162:925`. Mobile type below 768px.

Keep existing menu overlay behavior. Do not invent extra tablet section layouts beyond that frame.

## Hero top spacing (nav overlay)

The header sits on top of the hero (`-mt-[58px]` mobile, `-mt-[93px]` from tablet up). Figma `section-xxl` top padding is measured from the **hero top**, including the area behind the menu. Do not paste that token as visible space under the nav.

Match the **look**: `padding-top: header overlay + (Hero Content y − menu height)`.

Implemented on `.hero-inner` in `src/style.css` (re-measure in Figma if those nodes move):

- Mobile (below 768px): `58px + 122px` (content `5162:933` at y `180`)
- Tablet and desktop (768px+): `93px + 107px` (content y `200` on `5435:37` / `5162:595`)

Do not mix `md:pt-*` with `lg:py-*` on the same box; `padding-top` can lose to the `md` utility. Set hero top padding in CSS, and leave bottom padding as-is unless the user asks.

## Approved exceptions (code wins until Lauren updates Figma)

- **Who We Serve** card `<h3>` titles: desktop `header-s` (24px Inter Bold, line-height 1.25), not desktop `header-m` 36px. Keep mobile 18px and tablet 24px from those frames.
- **Photos** in overflow frames: keep Figma crop offsets if present, and always add `object-cover` so images do not stretch.

## Assets

Download Figma image/SVG URLs into `public/assets/`. Do not redraw icons. Do not swap photo and grid files without checking both.

## After edits

Follow the project rule to verify in the browser (desktop and mobile). Do not declare tablet verified unless a tablet frame was provided and checked.

## Out of scope unless the user asks

Inner pages, WordPress/React, hosting, inventing copy that is not in Figma.
