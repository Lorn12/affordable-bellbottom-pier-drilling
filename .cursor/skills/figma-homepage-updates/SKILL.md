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
5. Compare tokens to `src/style.css` and the markup. Change the site to match Figma Desktop-V1 / Regular Tablet-V1 / Mobile-V1, not the reverse, unless asked to update Figma **or** an approved exception below already applies. **Exception for type:** use the Typography collection mode values even when a frame’s text style is bound wrong.
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

The header sits on top of the hero (`-mt-[68px]` mobile, `-mt-[93px]` from tablet up). Figma `section-xxl` top padding includes the area behind the menu. Do not paste that token as extra space under the nav.

Content is **bottom-aligned** (`justify-end`). `.hero-inner` padding-top is only the overlay bar; the gap under the nav comes from min-height + `justify-end`. Implemented in `src/style.css` (re-measure if nodes move):

- Mobile (below 768px): min-height `944px`, padding-top `68px` (44px logo + 12px padding), padding-bottom `80px` (`Homepage Mobile-V1`)
- Tablet (768–1279): min-height interpolates Regular Tablet-V1 `924px` → Large Tablet-V1 `932px`; padding-top `93px`, padding-bottom `80px`
- Desktop (1280px+): min-height `824px`, padding-top `93px`, padding-bottom `80px` (`Homepage Desktop-V1`)
- Gap between hero blocks: `32px` (`gap-8`)
- Photo `opacity-[0.78]`, hex grid `opacity-12`, gradient `from-[rgba(11,11,11,0.225)]` to `to-[rgba(11,11,11,0.846)]` (Option A ink wash: Figma gradient layer 0.9, stops 0.25→0.94)
- Review card (Desktop-V1, Large Tablet-V1, Regular Tablet-V1, Mobile-V1): fill `rgba(151,151,151,0.1)`, Glass background blur `4px`, no stroke. Desktop position `lg:bottom-20` (80px), `lg:right-20`

Do not mix `md:pt-*` with `lg:py-*` on `.hero-inner`. Do not copy this overlay onto `.dark-pattern` unless asked.

## Typography (variable modes, not baked frame sizes)

The **Typography** collection has Desktop, Tablet, and Mobile modes. Tablet header sizes match Desktop. Mobile is the step-down. Always call `get_variable_defs` and use those mode values for heading CSS (`md` = 768+ tablet/desktop type; below 768 = mobile type).

If a Figma text layer is on the wrong style, **do not copy that size onto the site**. Implement the token the heading is supposed to use:

- **Home H1 only:** `header-xxl` — 72 from `md`, **52** on mobile (110% line height below 768). This is the only extra-large header. Homepage Mobile-V1 uses that token. Do not switch it to `header-xl` 48.
- **About, Services, Contact, and Careers H1:** `header-xl` — 52 from `md`, 48 on mobile.
- **Section / CTA / footer headings** (Home, About, Services): `header-l` — 42 from `md`, 36 on mobile. Do not use 32 (`header-m`) for these.
- Card titles: `header-s` 24 at every breakpoint. Eyebrows: `header-xs` 20. Body: `text-m` 16.

Do not push these corrections back into Figma unless asked.

## Approved exceptions (code wins until Figma is updated)

- **Photos** in overflow frames: keep Figma crop offsets if present, and always add `object-cover` so images do not stretch. Do **not** add a second `overflow-hidden` + radius wrapper around a `<picture>` to place an overlay — that makes photos blurry on high-DPI screens. Round the `<img>`. Overlay controls are siblings. Keep `srcset`, `sizes`, `width`, `height`, and `alt`. Our Services: `.service-card-photo` uses 8px / 42px corners; the 52px arrow sits 6px from the right and 9px from the photo bottom on every breakpoint. Our Work uses the same 52px lime/Neutral-200 button, top-right.
- **Who We Serve cards:** Copy is audience tiles: Concrete Contractors, Home Builders, Pool Companies, Direct Clients, plus Based in Hockley, Texas. Desktop-V1 and Large Tablet-V1 are a 560px side-by-side bento (left photo 1fr, right stack 2fr; top row 1fr/2fr). Apply that from `min-[1024px]` (hamburger still below 1280). Regular Tablet-V1 stacks a 400px photo over two 272px rows (2-col then 3-col). Mobile-V1 stacks every tile full-width like the site (do not keep the cramped 2/3-column bento). Keep `bg-black/40` on the Concrete Contractors photo so the caption stays readable. The Discuss Your Project text link uses full `text-lime-dark` like View All Services (do not fade the CTA with the intro copy).
- **Header scroll:** the live site switches from a clear overlay to a blurred solid bar at Companies. In Figma that is two states, not one frame that tries to show both.
- **Our Work:** white section (Neutral-100), ink headings, Neutral-600 intro. Desktop-V1 cards are a flat 20% black overlay only. The live site keeps that at rest and adds `.project-card-scrim` on hover/focus (bottom ink gradient). Do not clear the overlay on hover. Circular arrows use `.icon-arrow-btn` at 52px on Our Services and Our Work (all breakpoints); card hover/focus/active fills Neutral-200 (`#f1f1f1`). Figma hover is a variant next to `Butttons-02`, not a change to the default lime rest state. Photos use `object-cover` (pool `object-position: 57% center`, pour `29% center`, belled center). Srcset includes the full source width (pool 1448, belled 1672, pour 1536). `sizes` is the object-cover painted width, not the card width, so the tall cards are not upscaled. Three columns from `min-[1024px]` (20px gap through 1279, 40px from `lg`); two columns at 400px tall from 768–1023; stacked 450px cards below 768.
- **Typography modes over baked type:** heading sizes follow the Typography collection, not a mis-bound text style. Home H1 is `header-xxl` (72 / 52). Homepage Mobile-V1 hero is `header-xxl` at 52. About, Services, Contact, and Careers H1 are `header-xl` (52 / 48). Section/CTA/footer headings are `header-l` (42 / 36). Do not revert the Home mobile hero to 48.
- **Soil & Rock drill icon:** Noun Project (`noun-drilling-8343366`), not Streamline. Leave the Figma SVG stroke. Do not redraw it.
- **Equipment vs How We Work spacing:** different on purpose in Desktop-V1. Do not copy one section’s gutter onto the other unless asked. How We Work is one dark section (intro left, numbered steps right, 40px gap, two columns from `min-[1024px]`, stacked below). Steps stay full column width with no `max-width`. Do not restore the old photo or the separate white Project Planning section. The eyebrow is “How We Work” on every homepage frame, including Mobile-V1. The mobile quote eyebrow is “Request a Quote.”

## Assets

Download Figma image/SVG URLs into `public/assets/`. Do not redraw icons. Do not swap photo and grid files without checking both. `srcset` `w` descriptors must match the file’s real pixel width. After any photo markup change, confirm the image is sharp on desktop and mobile (not only that the layout matches).

The header and footer logo is `public/assets/logo.svg`. The lime BELLBOTTOM word is vector paths, not an SVG mask. Homepage frames use the `ABPD Logo Lockup` component (44px mobile header, 55px from tablet up, 77px footer). Do not replace that file with a raster export. Other Figma pages may still use the older raster until those frames are updated.

## After edits

Follow the project rule to verify in the browser (desktop and mobile). Do not declare tablet verified unless a tablet frame was provided and checked.

## About page

Visual source on **About Page**:

- Desktop: `About Desktop-V1` `6546:410` (1440). Full nav from 1280px (`lg`).
- Large tablet: `About Large Tablet-V1` `6546:1573` (1280) — visual source from `min-[1024px]` through 1279 (hamburger still below 1280).
- Regular tablet: `About Regular Tablet-V1` `6552:5848` (768) — visual source for 768–1023.
- Mobile: `About Mobile-V1` `6595:1954` (400). Why Choose Us stacks the bento full-width like Homepage Mobile-V1 Who We Serve.

Hero uses `.about-hero-inner`, not `.hero-inner`. Same overlay recipe as Home (photo 0.78, hex grid 0.12, ink gradient). Below 768px the hero photo is `object-[62%_center]` with `sizes="1440px"` so the tall frame stays sharp and the machine stays in view; from `md` up it is `object-center`. The first Who We Are caption is Straight-Shaft Drilling. Homepage Concrete Contractors uses `who-serve-concrete`, not the About belled photo. Regular Tablet-V1 hero is 742 tall; Large Tablet-V1 / Desktop-V1 are 800. Interpolate 742→800 across 768–1279. Capabilities marquee after the hero matches the homepage strip. Who We Are photos are 400 tall: Regular Tablet-V1 is a 2-up + full-width third photo with stacked captions; 3-column photos and caption row from `min-[1024px]`. Fill with `object-cover` (do not use the Figma 156% crop offsets). Why Choose Us Regular Tablet-V1 matches the homepage regular-tablet bento (400px photo over 2-col then 3-col rows); side-by-side 560px bento from `min-[1024px]`; About Mobile-V1 stacks every tile full-width. Keep `bg-black/40` on the Why Choose photo so captions stay readable. Equipment & Access and the quote CTA stack on Regular Tablet-V1 and go side-by-side from `min-[1024px]`.

## Services page

Visual source on **Services Page**:

- Desktop: `Services Desktop-V1` `6692:1699` (1440). Full nav from 1280px (`lg`).
- Large tablet: `Services Large Tablet-V1` `6738:2969` (1280) — hamburger still below 1280. Hero 800, pad 40. Listing cards 2-up; fifth card half-width left-aligned.
- Regular tablet: `Services Regular Tablet-V1` `6738:3177` (768) — hero 742, pad 40. Cards, prep, and CTA stack.
- Mobile: `Services Mobile-V1` `6738:3371` (400) — hero 742, pad 20. Cards, prep, and CTA stack. Hero `header-xl` 48; section/CTA/footer `header-l` 36 (Typography Mobile mode).

Hero uses `.services-hero-inner` (800 desktop, same overlay recipe as About). Live hub still stacks below desktop until asked to match the new frames. The first hub card is Straight-Shaft Drilling, uses `listing-pier`, and links to `services/straight-shaft-drilling.html`. The second is Bellbottom Pier Drilling and links to `services/bellbottom-pier-drilling.html`. Pool, Commercial & Residential, and Concrete Pour Assistance Explore links stay coming soon. Listing intro stays left-aligned. Project Preparation accordion copy is the approved four-item list; the mobilization answer is “Mobilization and minimum may vary.” Figma shows state 1 only, and the intro stays full opacity. Srcset includes the full source width (hero, pool, and home 1448; belled and pour 1536; pier and prep 1086). The services footer still omits “Get a Quote Today.”

Straight-Shaft live file `services/straight-shaft-drilling.html` from **Services Page**: Desktop-V1 `6748:4368` (two-column from `lg`), Large Tablet-V1 `6784:4838` (two-column from `min-[1024px]`), Regular Tablet-V1 `6784:5233` (stacked 768–1023), mobile `6784:5629` (stacked below 768; not the hub). Bellbottom uses the same layout at `services/bellbottom-pier-drilling.html` from `7138:283`, `7138:609`, `7138:858`, and `7138:1094`. Hero uses `.service-detail-hero-inner` (742 mobile/regular tablet, interpolates to 800 by 1280) and `service-pier-hero` (1086). Straight-Shaft overview photo is `listing-pier`; Bellbottom overview photo is `listing-belled`; jobsite photo is `listing-home`. Hidden Related Services stay off the site. Desktop and overlay Services is a dropdown trigger (not a page link); All Services in the dropdown goes to `services.html`. The dropdown includes Bellbottom Pier Drilling and Straight-Shaft Drilling. Hub `Services Mobile-V1` is `6738:3371`. FAQ sections stay on the live website design; do not restyle them to match Figma.

## Contact page

Visual source on **Contact Page**:

- Desktop: `Contact Desktop-V1` `6838:434` (1440). Full nav from 1280px (`lg`). Hero 800. Quote two-column (588 + 40 + 652), pad 80.
- Large tablet: `Contact Large Tablet-V1` `6838:653` (1280) — visual source from `min-[1024px]` through 1279 (hamburger still below 1280). Hero 800, pad 40. Quote two-column (548 + 40 + 612).
- Regular tablet: `Contact Regular Tablet-V1` `6838:863` (768) — hero 742, pad 40. Quote stacks: 400 photo then form. Email/phone stay 2-up.
- Mobile: `Contact Mobile-V1` `6838:1059` (400) — hero 800, pad 20. Quote stacks; email/phone stack. Hero `header-xl` 48; section headings `header-l` 36.

Hero uses `.contact-hero-inner` (same overlay recipe as About/Services). Interpolate 742→800 across 768–1279; mobile stays 800. Hero CTA is Call only. Capabilities marquee after the hero matches About. Quote and service-area sections are white; FAQ uses `.dark-pattern`. First FAQ item is open (lime −). Footer Contact on the site lists phone, Greater Houston, and hours. Do not invent a street address, email, directions link, or national map.

## Careers page

Visual source on **Careers Page**:

- Desktop: `Careers Desktop-V1` `6994:276` (1440). Full nav from 1280px (`lg`). Hero 800. Apply two-column, pad 80.
- Large tablet: `Careers Large Tablet-V1` `6994:508` (1280) — visual source from `min-[1024px]` through 1279 (hamburger still below 1280). Hero 800, pad 40. Apply two-column.
- Regular tablet: `Careers Regular Tablet-V1` `6994:731` (768) — hero 742, pad 40. Apply stacks: photo then form. Email/phone stay 2-up.
- Mobile: `Careers Mobile-V1` `6994:940` (400) — hero 800, pad 20. Apply stacks; email/phone stack. Hero `header-xl` 48; section headings `header-l` 36.

Same structure and hero class as Contact (`.contact-hero-inner`). Hero CTA is Apply Now to `#apply`. Position of interest is a required select: Equipment Operator — Skid Steer, General Labor, and CDL Driver. Any employee must have reliable transportation. FAQ uses `.dark-pattern` and the live website accordion, not a Figma FAQ restyle. Question containers use a soft Neutral-200 border (`rgb(241 241 241 / 0.32)`, stronger on hover and focus). Service-area intro is the crew based in Hockley. Submitted state frame: `6994:1193`. Quote and apply forms mailto `bids@affordablebellbottomdrill.com`.

## Out of scope unless the user asks

WordPress/React, hosting, inventing copy that is not in Figma, remaining inner pages (other individual service pages, Projects).
