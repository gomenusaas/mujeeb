# Servly Design System

A design system for **Servly**, a mobile marketplace app where people book home and personal services (cleaning, plumbing, electrical, beauty, moving, repairs, pet care, tutoring) from vetted local pros.

> "Servly" is a working name. No brand name or logo was supplied, so the name is set in plain type wherever a mark would go. Swap it once the real brand exists.

**Sources:**
- `uploads/Services Marketplace Design System.pdf` — one-page overview (colour, type, spacing & shape, iconography, components; "28 components, 8 interactive screens").
- The PDF links to its originating design project (`/projects/684393fa-88b1-4e87-bbf0-f78c6136c8ae`, `ui_kits/app/index.html`). That project's tokens, components, guidelines and UI kit were imported verbatim and are the source of truth here. Its original brief: *colourful but professional, carousels, coloured category cards with icons, modern and immersive*; violet primary, neutral cross-platform styling, light mode only.

## Index
- `styles.css` — entry point; only `@import`s the token files
- `tokens/` — `colors.css`, `typography.css`, `spacing.css` (spacing + radii), `effects.css` (shadows, motion, keyframes), `fonts.css`, `base.css`
- `components/`
  - `core/` — Icon, Button, IconButton, Badge, Chip, Avatar, Rating, ImageSlot
  - `forms/` — TextField, SearchBar, Checkbox, Radio, Switch
  - `marketplace/` — CategoryCard, ServiceCard, ProviderCard, PromoBanner, Carousel, SectionHeader, BookingCard, ChatBubble
  - `navigation/` — AppBar, TabBar, SegmentedControl, ListItem
  - `feedback/` — BottomSheet, Toast, EmptyState
- `guidelines/` — foundation specimen cards (colour, type, spacing, radii, elevation, motion, brand) and `patterns/` (carousel, booking + chat)
- `ui_kits/app/` — interactive 390×844 click-through of the app (`index.html` + one JSX file per screen)
- `assets/3d/` — the 8 Fluent Emoji 3D category PNGs (356px) extracted from the PDF: cleaning, plumbing, electrical, beauty, moving, repairs, pet-care, tutoring. Components load the same art from jsDelivr; these are offline copies.
- `Servly Design System.dc.html` — the overview page the PDF was exported from
- `thumbnail.html` — project tile
- `assets/dev/ds-loader.js` — preview helper that loads components in cards/kits (uses the compiled bundle when present)
- `SKILL.md` — Agent Skill entry point

### Intentional additions
- **Icon** — wrapper around Lucide so every component uses one glyph set.
- **ImageSlot** — striped placeholder for photography until real images exist.

---

## Content fundamentals
- **Voice:** a capable, friendly neighbour. Plain, warm, specific. Never salesy, never cute.
- **Person:** address the user as **you**; the product speaks as **we** only for policy ("We have sent the details to your email"). Pros are called **pros** in UI, by first name in context ("Maya will arrive at 10:00").
- **Casing:** Sentence case everywhere — titles, buttons, tabs ("Book now", "Popular near you"). Overlines are the only uppercase text.
- **Buttons:** verb first, 1–3 words: *Book now*, *Continue*, *Confirm & book · $157*, *Reschedule*, *Message*. Price in the final CTA.
- **Numbers:** always concrete: "214 pros nearby", "Arrives in 2 hrs", "$89", "4.9 (820)". Prices as `$89`; "From $45" on cards; "/hr" suffix for hourly.
- **Reassurance copy** near money and commitment: "You are only charged after the job is done. Free cancellation up to 24 hours before."
- **Emoji:** not used in UI. Status and meaning come from icons and colour.
- **Examples:** "Hi Alex, what needs doing today?" · "Leaky tap? Plumbers in 2 hrs" · "Booked 2k+ times this week" · "Nothing here yet".

## Visual foundations
- **Colour:** a deep **violet** (`--brand`, oklch 0.51 0.24 292) carries actions, focus, active nav and the home hero. **Neutrals** are cool greys with a faint violet tint; the app background is near-white `--bg-app`, cards are pure white. The colourful side comes from an **8-hue category palette** (teal, sky, amber, pink, indigo, coral, green, violet) with matched lightness and chroma, so no hue shouts louder than another. Each category owns one hue everywhere (tile, feature card, listing header, booking icon). **Coral** `--accent` is reserved for offers and notification dots. Category 600 shades take white text; 100 tints take 600 icons.
- **Professional balance:** colour lives in contained surfaces (tiles, banners, headers), never in body text or large page backgrounds. Selected chips use ink (neutral-900), not violet, so violet keeps meaning "primary action".
- **Type:** Plus Jakarta Sans 400–800. Headlines are 700–800 with tight tracking (-0.02em); body 15/22. JetBrains Mono only for booking refs and image-slot labels. Min text 11px (overline), body never under 13px.
- **Spacing:** 4px base. Screen gutter 20px, section gap ~26px, card padding 14–16px, list rows ≥56px, hit targets ≥44px.
- **Corner radii:** generous and friendly. Cards 20, tiles 14–20, sheets 28, phone-level hero bottoms 28–32. All buttons, chips, search fields and segmented controls are full pills.
- **Cards:** white, radius 20, soft violet-tinted shadow (`--shadow-sm`), no borders. Selected/bordered states use inset box-shadow (1.5px default, 2px violet selected) with violet-50 fill. No coloured left-border accents.
- **Elevation:** five steps (xs, sm, md, lg, brand). Shadows are tinted toward violet, never pure black. The primary CTA gets a violet glow (`--shadow-brand`). Bottom bars use an upward shadow (`--shadow-up`).
- **Backgrounds:** flat colour only. Coloured heroes (home, category header) use 1–2 translucent white circles as the only decorative motif. No gradients, textures or illustrations.
- **Imagery:** real photography of pros at work, warm natural light, people-forward. Until supplied, use `ImageSlot` placeholders tinted to the category hue.
- **Transparency & blur:** app bar, tab bar and sticky footers are 92–94% white with `saturate(180%) blur(16px)`. Buttons over photos use the `glass` IconButton. Scrims are 45% ink.
- **Motion:** `--ease-out` for most UI (120/200/320ms), `--ease-spring` for toggles, radios and category tile press. Content enters with a 12px rise + fade. Carousel dots stretch into a 20px pill. Bottom sheets slide up 320ms.
- **Press states:** buttons scale to 0.97 + brightness 0.94; icon buttons 0.92; category tiles 0.95 with spring; cards 0.98. No hover-dependent behaviour (touch-first); hover may darken slightly on web.
- **Focus:** 2px violet border plus 4px soft violet ring (`--focus-ring`).
- **Layout:** fixed tab bar (72px) on root tabs only; pushed screens hide it and use a back button. Carousels bleed to the screen edge with the gutter as scroll padding so the next card peeks.

## Iconography
- **Set:** [Lucide](https://lucide.dev) — 24px grid, 2px stroke, rounded caps/joins. Loaded from CDN (`lucide-static@0.454.0`) by the `Icon` component and inlined as SVG so it takes `currentColor`. No icon font, no PNG icons, no emoji, no unicode glyphs as icons (except "•" in masked card numbers).
- **Sizes:** 16 meta/inline, 18–20 default, 22 tab bar, 24–28 category tiles, 36–48 empty/success states.
- **Fill:** outline by default; `filled` only for stars and active hearts.
- **Category icons:** Cleaning `sparkles`, Plumbing `wrench`, Electrical `zap`, Beauty `scissors`, Moving `truck`, Repairs `hammer`, Pet care `paw-print`, Tutoring `graduation-cap`.
- **3D category art:** category cards use Microsoft Fluent Emoji 3D artwork (MIT licence, jsDelivr CDN) via the `art` prop: broom, wrench, light bulb, lipstick, delivery truck, hammer & wrench, paw prints, graduation cap. Feature cards show it oversized, tilted and bleeding off the corner over a soft white glow so it blends into the category colour; tiles show it inside the tint with a soft drop shadow. Lucide line icons remain for all other UI.
- **Logo:** none supplied. The wordmark card shows the name in Plus Jakarta Sans 800 with a violet full stop as a placeholder only.
