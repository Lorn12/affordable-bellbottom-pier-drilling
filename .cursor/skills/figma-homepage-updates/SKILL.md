---
name: figma-homepage-updates
description: Matches this site’s homepage to the Figma file (tokens, frames, assets) without guessing. Use when updating homepage UI, matching Figma, fixing visual mismatches, adjusting type/spacing/color, or when the user mentions Figma, tablet, or design tokens.
---

# Figma homepage updates

## Before any visual edit

1. If the target section, breakpoint, or Figma node is unclear, **ask**. Do not assume.
2. Load the Figma MCP skill `figma-design-to-code` before calling `get_design_context`.
3. Call `get_variable_defs` on the frame you are implementing (desktop `5162:587` and/or mobile `5162:925` unless the user gives a different node).
4. Call `get_design_context` on the **section** node, not only the full page, when the page is too large.
5. Compare tokens to `src/style.css` and the markup. Change the site to match Figma, not the reverse, unless the user asks to update Figma.

File: `https://www.figma.com/design/rNBkruQcCGz3s7uz1xn0bR/Affordable-Bellbottom-Pier-Drilling`

## Breakpoints

- Desktop and mobile: implement from those frames and their variable values.
- Tablet: **stop and ask** if the user wants tablet work. Do not invent a layout. Only implement tablet after they provide a frame node.

## Assets

Download Figma image/SVG URLs into `public/assets/`. Do not redraw icons. Do not swap photo and grid files without checking both.

## After edits

Follow the project rule to verify in the browser (desktop and mobile). Do not declare tablet verified unless a tablet frame was provided and checked.

## Out of scope unless the user asks

Inner pages, WordPress/React, hosting, inventing copy that is not in Figma.
