# Fillo Bakes — Design System

**Version 1.0 · authoritative.** Derived from `design/moodboard-analysis.md`, the logo
(`assets/logo/fillo-bakes-logo.png`) and `research/current-site-journey.md`.
Implementation tokens: `design/tokens.css`, `design/tailwind-theme.json`.

This is one system. Where this document says a value, use that value. Nothing here is an
option list. If a case is not covered, follow the nearest rule in spirit and keep the
hairline-and-whitespace bias.

---

## 1. Brand personality

> **Precise. Warm. Everyday.**

- **Precise** — Japanese method. Hairlines, tight leading, exact grids, specs in mono, kana
  under every product name. Nothing is approximate.
- **Warm** — cream paper, crust golds, brick accent, a round hand-stamp, real daylight
  photographs of real people. Never clinical, never cold blue-grey.
- **Everyday** — this is bread you buy on a Tuesday, not a patisserie occasion. The van comes
  to your street. Prices are plain, the add button is one tap, the tone is unfussy.

### 1.1 Voice (from `research/prior/ux/teardown-voice.md`)

**Warm, specific, slightly self-deprecating, never shouting.** Fillo sits in the sincere-and-quiet
quadrant — Paper Boat's register, Graza's structure, Fishwife's microcopy, Surreal's footnote.

Three rules the design must physically support:

1. **Humour lives only where the user is bored, anxious or disappointed** — sold-out states,
   empty states, FAQ, delivery copy, the newsletter opt-in, errors. Never in a price, a
   guarantee, a policy or a checkout button. Components in those places have no room for a
   playful string and should not be designed with one.
2. **The joke escorts the fact, never replaces it.** Every component that carries a number
   (DropCard, ProofBlock, Tracker, BakeStrip, free-delivery progress) renders the number in
   its own slot, in tabular numerals, at a size that survives the copy being deleted.
3. **The footnote is the humour container.** Give every claim slot an optional
   `--text-caption` `--color-ink-500` footnote line directly beneath it, prefixed `*`. The
   headline stays clean; the personality goes small. Budget one footnote per section.

Sold-out is written as **three separate strings** — status, promise, payoff — and the design
gives each its own slot (§12.5, §12.27).

Typographic voice rules: lowercase in the wordmark only; **sentence case** in UI; Title Case
never. Micro-labels are UPPERCASE with tracking. No exclamation marks. No emoji anywhere in
the UI (the current site's `✨` and `🚚` are removed — use Lucide icons).

### 1.2 Language

- **The UI is English.** All chrome, navigation, buttons, form labels, errors and system
  messages are English.
- **Japanese appears only as small kana under a product name** (§12.26 KanaLabel) and,
  rarely, as a single decorative mark in a section kicker. Never in nav, never in a button,
  never in an error, never as a heading.
- **No Kannada in the chrome.** Kannada may appear inside photographic content (a street
  sign, the van's own livery) but never as interface text, and it is never mixed into an
  English string.
- Numerals are Western Arabic throughout. Currency is `₹` with no space before the amount
  and tabular numerals (`₹200`, not `Rs. 200` or `₹ 200`).

---

## 2. Colour

### 2.1 Primary — from the logo (fixed)

Sampled from `fillo-logo-transparent.png`: the mark is one flat fill, the wordmark is one
flat fill. These two values are the root of the entire palette.

| Token | Hex | Source |
|---|---|---|
| `--color-navy` / `--color-ink-800` | **`#023D5D`** | logo blob, 10,496 px |
| `--color-logo-cream` | **`#FFFDE8`** | logo wordmark, 66,181 px |

`#023D5D` on `#FFFDE8` = **11.2:1**.

> **Correction to the live site.** `home.html` uses `[#1B3A5F]` in 82 places as "navy". That
> is not the logo colour. Every occurrence becomes `#023D5D`. `[#F8F4E3]` becomes
> `--color-paper-50`. `yellow-400`/`yellow-300` become `--color-crumb` under the rules in 2.5.

### 2.2 Paper scale (backgrounds and surfaces)

Synthesised from the mood board papers `#FAF9F5` (mb-1), `#FBFAF6` (mb-2), `#FCF3EC` (mb-4),
`#F4EFE9` (mb-5), `#F0EFEA` (mb-8) and the tinted wells `#EDECE8` (mb-1), `#E8DBCB` (mb-4),
`#DEDACE` (mb-8). Warm, low-chroma, six steps.

| Token | Hex | Use |
|---|---|---|
| `--color-paper-0` | `#FFFDF7` | Card, dialog, drawer, input surfaces. The only near-white. |
| `--color-paper-50` | `#FBF7EF` | **Page background.** Default `body`. |
| `--color-paper-100` | `#F4EEE3` | Alternating section band; sticky header once scrolled. |
| `--color-paper-200` | `#EBE3D5` | **Product image wells**, tinted callouts, stat bands, skeletons. |
| `--color-paper-300` | `#DED4C2` | **Hairlines and dividers on paper.** Disabled surfaces. |
| `--color-paper-400` | `#C9BCA5` | Decorative rules, seal rings, dot-leaders, ghosted line art. |

**Rules.** Never use `#FFFFFF` as a background — the whole system is warm. Never place
`paper-0` directly on `paper-50` without a hairline or a shadow; the 1.5% delta is not enough
on its own. A section may step at most **one** paper level from its neighbour.

### 2.3 Ink scale

The mood board's inks are chocolate (`#2F1B12`, mb-5) and near-black (`#131313`, mb-1). We
reject both: **Fillo's ink is the logo navy, extended.** This keeps every dark surface in the
brand's family and is the single most important synthesis decision in this system.

| Token | Hex | Use | On `paper-50` |
|---|---|---|---|
| `--color-ink-900` | `#04212F` | **Dark full-bleed bands**, footer, dialog scrim base, van map ink | 15.55:1 |
| `--color-ink-800` | `#023D5D` | **Headings, primary button fill, logo, active nav** | 10.75:1 |
| `--color-ink-700` | `#0F4E70` | Primary button hover, link hover, focus outline on dark | 8.38:1 |
| `--color-ink-600` | `#2E5F79` | **Body copy**, secondary text, icon default | 6.49:1 |
| `--color-ink-500` | `#4A7085` | Meta text, timestamps, placeholders, kana | 4.98:1 |
| `--color-ink-400` | `#8AA5B4` | Disabled text/icon, hairlines on dark, muted glyphs | 2.42:1 — **non-text only** |

**AA statement.** Body text is `ink-600` on `paper-50` = **6.49:1** (AA and AAA for normal
text). The smallest text used, 11px micro-caps, is `ink-500` = **4.98:1** (AA). `ink-400` is
never applied to text on paper; on `ink-900` it reaches 6.43:1 and may be used for muted
footer text there.

Text on `paper-200` wells steps up one level: use `ink-600` (5.44:1), never `ink-500` (3.41:1).

### 2.4 Accent — Kiln

`--color-kiln` **`#9E3B26`**. Sampled directly from the mb-5 `Explore our menu` button
(4,558 px). A brick/terracotta: the colour of an oven and of crust, and the natural warm
complement to `#023D5D`.

- On `paper-50`: **6.32:1** (AA for all text).
- `paper-0` on `kiln`: **6.64:1** — safe for button labels.
- On `ink-900`: **2.46:1** — **kiln is forbidden on dark surfaces.** On dark, the accent role
  passes to `--color-crumb` (7.45:1).

Shades: `--color-kiln-700` `#7E2E1D` (hover/pressed), `--color-kiln-100` `#F2DED6` (tint
wells, badge fills carrying `kiln` text at 5.2:1).

**Where kiln is allowed:** section kicker labels, the "baked today"/"eggless" seal ink, the
ticker text, prices in sale state, the cart-badge fill, the rail progress bar, the active
category underline, focus rings, and links inside long-form copy. **Where it is not:** the
primary CTA (that is navy — the logo must own the loudest button), large area fills, any dark
band, or two adjacent components at once. Follow mb-8's discipline: one accent, used
sparingly, everywhere.

### 2.5 Signal — Crumb

`--color-crumb` **`#E4A11B`**. Derived from mb-6's caramel field `#C8A36F` pushed to
saturation and reconciled with mb-7's yellow chip. Replaces the live site's ungoverned
`yellow-400`.

Contrast: 2.09:1 on paper — **fill only, never a text colour on paper.** On `ink-900` it is
7.45:1 and on `ink-800` 5.15:1, so it *is* a legal text/icon colour on dark bands.

**Crumb is used for exactly five things:** the live van-tracker pulse ring, the "baked today"
stamp fill, Fillo+ coins and tier chrome, star ratings, and the marquee underline on the dark
band. Nothing else. If crumb text is unavoidable on paper, use `--color-crumb-ink` `#8A6210`
(5.12:1).

### 2.6 Semantic states

| Token | Hex | On `paper-50` | Use |
|---|---|---|---|
| `--color-success` | `#1F6B4A` | 6.03:1 | Order confirmed, in-stock, van en route |
| `--color-warning` | `#8F5A0B` | 5.41:1 | Low stock, slot filling up, cut-off approaching |
| `--color-danger` | `#9E2A20` | 7.00:1 | Sold out, payment failure, destructive action |
| `--color-info` | `#0F4E70` | 8.38:1 | Neutral system notice (= `ink-700`) |

Each has a `-tint` surface for banners and inline messages, carrying its own ink at ≥4.5:1:
`--color-success-tint` `#E1EFE7`, `--color-warning-tint` `#F6EAD5`, `--color-danger-tint`
`#F5E0DC`, `--color-info-tint` `#DFEAF1`.

Danger `#9E2A20` is deliberately a sibling of kiln `#9E3B26` — the system has one red family,
not two. They are never adjacent; if a sold-out badge sits inside a kiln-accented card, the
badge is `ink-400` outline instead.

### 2.7 Category hints (6)

These are **hints, not fills**: a 2px underline under the category label, the dot before it,
and the active state of the filter chip. A category colour never fills a card, a tile or a
button, and never sets more than ~40px² of area at once.

| Category | Hint `--cat-*` | Text-safe `--cat-*-ink` | On `paper-50` | Rationale |
|---|---|---|---|---|
| Breads | `#C8A36F` | `#8A6636` | 4.87:1 | mb-6 caramel field — crust |
| An Pan | `#9E3B26` | `#9E3B26` | 6.32:1 | = kiln — red bean paste |
| Kare Pan | `#B4700F` | `#8A5609` | 5.75:1 | curry amber, from mb-3's sepia mids |
| Pies & Strudels | `#7A5230` | `#7A5230` | 6.39:1 | mb-3 `#583010` lifted — baked pastry |
| Fruit Sandos | `#B9455C` | `#B9455C` | 4.83:1 | mb-8 `#D12030` desaturated toward strawberry-cream |
| Weekly Specials | `#023D5D` | `#023D5D` | 10.75:1 | brand navy — the house pick |

Use the `-ink` value whenever the colour carries text. Use the plain value for the 2px rule
and the dot.

### 2.8 Overlays

`--color-scrim` `rgba(4, 33, 47, 0.55)` for dialog and drawer backdrops (navy-tinted, never
neutral black). `--color-veil` `rgba(4, 33, 47, 0.06)` for pressed states on paper.

---

## 3. Typography

Four Google families. No system-font stack anywhere except as a fallback.

| Role | Family | Weights | Why |
|---|---|---|---|
| Display | **Instrument Serif** | 400, 400 italic | Matches mb-5's 92px hairline serif and mb-1's masthead exactly: high stroke contrast, sharp bracketed serifs, ball terminal on the `y`. Only ships regular — which enforces rule 3.2. |
| Body / UI | **Hanken Grotesk** | 400, 500, 600, 700 (variable) | Warm neo-grotesk with slightly humanist, softened terminals — echoes the logo wordmark's rounded geometry without imitating it. Excellent at 13–17px. Not Inter, not Poppins, not Space Grotesk. |
| Spec / label | **DM Mono** | 300, 400, 500 | mb-1 sets every product descriptor in mono. Low contrast, distinctive single-storey `a` and looped `g`, holds up at 10–11px with wide tracking. |
| Kana | **Zen Kaku Gothic New** | 400, 500 | Japanese subset only, for kana under product names and Japanese section marks. Humanist gothic that sits beside Hanken Grotesk without a visible seam. |

`--font-display`, `--font-sans`, `--font-mono`, `--font-kana`. Fallback stacks are in
`tokens.css`. In Next.js, load these with `next/font/google` (`display: 'swap'`,
`subsets: ['latin']`, plus `['japanese']` for Zen Kaku); the `@import` in `tokens.css` is the
non-Next reference and the token contract.

### 3.1 Fluid scale

All display sizes interpolate between a 390px and a 1440px viewport. Body sizes below
`body-lg` are fixed — resizing body copy on scroll-width is noise.

| Token | clamp() | min → max | Family | Weight | Leading | Tracking |
|---|---|---|---|---|---|---|
| `--text-display-2xl` | `clamp(3.25rem, 1.486rem + 7.238vw, 8rem)` | 52 → 128 | display | 400 | 0.88 | −0.02em |
| `--text-display-xl` | `clamp(2.75rem, 1.543rem + 4.952vw, 6rem)` | 44 → 96 | display | 400 | 0.92 | −0.018em |
| `--text-display-lg` | `clamp(2.25rem, 1.507rem + 3.048vw, 4.25rem)` | 36 → 68 | display | 400 | 0.98 | −0.015em |
| `--text-display-md` | `clamp(1.875rem, 1.457rem + 1.714vw, 3rem)` | 30 → 48 | display | 400 | 1.06 | −0.01em |
| `--text-display-sm` | `clamp(1.5rem, 1.221rem + 1.143vw, 2.25rem)` | 24 → 36 | display | 400 | 1.14 | −0.005em |
| `--text-title-lg` | `clamp(1.25rem, 1.157rem + 0.381vw, 1.5rem)` | 20 → 24 | sans | 600 | 1.28 | −0.005em |
| `--text-title` | `1.125rem` | 18 | sans | 600 | 1.35 | 0 |
| `--text-body-lg` | `clamp(1.0625rem, 1.016rem + 0.19vw, 1.1875rem)` | 17 → 19 | sans | 400 | 1.62 | 0 |
| `--text-body` | `1rem` | 16 | sans | 400 | 1.6 | 0 |
| `--text-body-sm` | `0.875rem` | 14 | sans | 400 | 1.55 | 0 |
| `--text-caption` | `0.8125rem` | 13 | sans | 400/500 | 1.45 | 0.005em |
| `--text-micro` | `0.6875rem` | 11 | mono | 400 | 1.3 | **0.12em** |
| `--text-nano` | `0.625rem` | 10 | mono | 500 | 1.2 | **0.16em** |

`--text-micro` and `--text-nano` are always `text-transform: uppercase`. They are the kicker,
the category label, the spec line, the stat caption, the seal ring and the nav. This is the
letterspaced micro-caps layer that structures every page in the mood board.

Kana sets at `--text-caption` in `--font-kana` 400, `letter-spacing: 0.06em`, colour
`--color-ink-500`.

Prices set in **`--font-display` italic** at `--text-title` — mb-1's `$4.90` convention,
carried into rupees: `₹200`.

### 3.2 Typographic law

1. **Display type is always weight 400.** If a headline feels weak, set it larger, never
   bolder. Instrument Serif ships only 400 precisely so this cannot be violated.
2. **Never set a display face below 24px** and never set the body sans above 24px. The two
   scales do not overlap.
3. **Measure caps at 62ch** for `body`, **46ch** for `body-lg` lead paragraphs.
4. **Two type registers per component, maximum.** A ProductCard uses sans + mono + display
   (price) — three — because it is the system's densest object; nothing else may.
5. Optical alignment: display headings get `text-wrap: balance`; body paragraphs get
   `text-wrap: pretty`. Never hyphenate.
6. Numerals: `font-variant-numeric: tabular-nums` on all prices, counts, coin balances,
   timers and the stats band. Proportional everywhere else.

---

## 4. Spacing

4px base. Use only these steps.

`--space-0` 0 · `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 ·
`--space-5` 20 · `--space-6` 24 · `--space-8` 32 · `--space-10` 40 · `--space-12` 48 ·
`--space-16` 64 · `--space-20` 80 · `--space-24` 96 · `--space-32` 128 · `--space-40` 160 ·
`--space-48` 192

**Section rhythm.** Vertical padding on a section is `--section-y`:
`clamp(4rem, 2.4rem + 6.6vw, 8rem)` (64 → 128px). A dark band gets one step more
(`--section-y-lg`: `clamp(5rem, 2.8rem + 9vw, 10rem)`, 80 → 160px) because it must feel like
an event. Adjacent sections of the same paper level collapse to a single `--section-y`.

Inside components: `--space-6` (24) is the default padding for cards and panels at desktop,
`--space-4` (16) at mobile. Gaps between a label and its value are `--space-1`; between
stacked meta lines `--space-2`; between a heading and its body `--space-3`; between a body
block and its CTA `--space-6`.

---

## 5. Radii

Mood-board radii are 0, 4, 8, 10, 12. There is nothing rounder.

| Token | Value | Use |
|---|---|---|
| `--radius-none` | `0` | Product image wells, grid tiles, full-bleed bands |
| `--radius-xs` | `2px` | Chips inside dense meta, mono tag outlines |
| `--radius-sm` | `4px` | Inputs, filter chips, date/time slot chips, small badges |
| `--radius-md` | `8px` | **Buttons, cards, panels, toasts** — the default |
| `--radius-lg` | `12px` | Dialogs, cart drawer, van-tracker widget, subscription cards |
| `--radius-xl` | `16px` | Hero image mask, full-width media blocks |
| `--radius-pill` | `999px` | Buttons in the "on-photo" variant only; stepper; cart badge |
| `--radius-blob` | `58% 42% 55% 45% / 48% 55% 45% 52%` | **The Fillo device** — see 5.1 |

### 5.1 The blob

The logo is a rotated superellipse, not a circle. That shape is the brand's one memorable
form and it appears in exactly four places:

1. The **Stamp/Seal** (§10.7).
2. The **van marker** on the tracker map.
3. The **hero image mask** in Hero variant A.
4. The **avatar frame** in Testimonials.

Nowhere else. A blob on a button or a card is a violation. Never animate the blob's radius —
it rotates or it holds still.

---

## 6. Borders and hairlines

The mood board structures pages with 1px rules, not with boxes.

- `--border-hairline`: `1px solid var(--color-paper-300)` — the default divider on paper.
- `--border-hairline-strong`: `1px solid var(--color-paper-400)` — section terminators, the
  rule under the header, the vertical dividers in the stats band.
- `--border-hairline-dark`: `1px solid rgba(255, 253, 232, 0.14)` — dividers on `ink-900`.
- `--border-input`: `1px solid var(--color-paper-400)`; focus swaps to
  `1px solid var(--color-ink-800)` plus the focus ring.
- `--border-strong`: `1.5px solid var(--color-ink-800)` — ghost buttons and the outline seal.

**Rules.** Hairlines are always 1px and never a colour outside the paper scale. A component
gets a border *or* a background tint, never both — except inputs. Do not use a border to
separate two sections that already differ by a paper step.

---

## 7. Elevation

**Policy: this system is flat.** Six of eight references use no shadow on UI at all. Shadow
signals one of exactly three things: a product is a physical object, a surface is temporarily
lifted by the user, or a layer is above the page.

| Token | Value | Use |
|---|---|---|
| `--shadow-none` | `none` | Cards, sections, badges, inputs, chips — the default |
| `--shadow-contact` | `0 18px 24px -18px rgba(4,33,47,0.35)` | **Under product cutouts only.** The physical contact shadow from mb-2/mb-7. |
| `--shadow-lift` | `0 2px 4px -2px rgba(4,33,47,0.06), 0 12px 28px -12px rgba(4,33,47,0.16)` | Card `:hover`/`:focus-visible` only |
| `--shadow-overlay` | `0 24px 60px -20px rgba(4,33,47,0.30)` | Cart drawer, dialog, popover, toast |
| `--shadow-sticky` | `0 1px 0 0 var(--color-paper-300)` | Sticky header after scroll — a hairline, not a shadow |

No shadow uses a neutral black; all are navy-tinted. There is no `sm`/`md`/`lg`/`xl` shadow
ramp — do not invent one.

---

## 8. Grid and layout

- **Content max-width** `--max-content`: `1320px`.
- **Prose max-width** `--max-prose`: `68ch` (about 620px at `body`).
- **Narrow max-width** `--max-narrow`: `880px` — checkout, forms, FAQ, policies.
- **Gutters** `--gutter`: `20px` < 768 · `32px` ≥ 768 · `40px` ≥ 1280.
- **Columns**: 12 at ≥1024, 8 at 768–1023, 4 below 768. Column gap `--space-6` (24) desktop,
  `--space-4` (16) mobile.
- **Bleed**: full-bleed bands escape the container entirely (`width: 100%`), their inner
  content re-enters `--max-content`.

Breakpoints: `sm 480` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`.

**Grid counts.** Product grid: 2 cols < 640, 2 at 640–767, 3 at 768–1279, **4 at ≥1280**
(mb-1 and mb-8 both run 4-up). Tight gutters — `--space-3` (12px) at ≥1280 so the grid reads
as a contact sheet, `--space-4` (16px) below. Category filter is a horizontal scroll rail
below 768 and a left rail at ≥1024.

**Asymmetry rule.** Hero and story sections use a 5/7 or 7/5 split, never 6/6. A section
whose content is centred must be flanked by two left-aligned sections.

---

## 9. Motion

| Token | Value |
|---|---|
| `--dur-instant` | `0ms` |
| `--dur-fast` | `140ms` — hover, focus, chip select, icon swap |
| `--dur-base` | `220ms` — buttons, stepper, accordion, toast in |
| `--dur-slow` | `380ms` — drawer, dialog, filter re-layout |
| `--dur-slower` | `640ms` — scroll reveal, hero entrance |
| `--dur-marquee` | `32s` — ticker loop |
| `--dur-seal` | `22s` — seal ring rotation |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` — entrances, drawers |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` — exits |
| `--ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` — cross-fades, marquee resume |

**What animates**

- **Hover** — cards: `--shadow-lift` + `translateY(-2px)` + image `scale(1.03)` over
  `--dur-fast`. Buttons: background shift only. Links: a 1px underline grows from left,
  `transform: scaleX()` from `transform-origin: left`.
- **Scroll reveal** — once, on first entry, `opacity 0→1` + `translateY(16px→0)` over
  `--dur-slower` with `--ease-out`. Stagger children by **60ms**, capped at 6 items. Reveal
  only section headers, grid rows and dark bands. **Never** re-animate on scroll back.
- **Marquee/ticker** — the announcement bar and the dark-band statement line translate
  continuously at `--dur-marquee` linear, duplicated content for a seamless loop, `paused` on
  `:hover` and on `:focus-within`.
- **Seal** — the ring text rotates 360° over `--dur-seal` linear, infinite. The glyph at the
  centre does not rotate.
- **Cart drawer** — panel `translateX(100% → 0)` over `--dur-slow` `--ease-out`; scrim
  `opacity 0→1` over `--dur-base`. Line items stagger in at 40ms. Exit uses `--ease-in` at
  `--dur-base`.
- **Add-to-cart** — the circular add button morphs into the stepper: width animates
  `36px → 108px` over `--dur-base` `--ease-out`, the `+` icon cross-fades to the `−/1/+`
  row at 60% through. The cart badge counts up and pulses `scale(1 → 1.18 → 1)` over
  `--dur-base`.
- **Van pulse** — a `--color-crumb` ring on the map marker scales `1 → 2.4` with
  `opacity 0.5 → 0` over `1.8s` linear infinite.
- **Slot chips** — selection is a background+border swap over `--dur-fast`; no movement.

**What never animates:** page transitions, parallax, anything on the blob's radius, text
colour on scroll, counters that tick up on the stats band (they render at final value), or
more than one marquee visible at a time.

**`prefers-reduced-motion: reduce`** — all transforms drop to `none`, all durations to
`--dur-instant` except opacity fades which hold at `--dur-fast`; the marquee and the seal
stop and render statically; the van pulse becomes a static ring.

---

## 10. Imagery

### 10.1 Product cutouts (the primary mode)

Every SKU is photographed and delivered as a **transparent PNG/WebP cutout** — background
removed, no plate, no board, no props, no cloth. Flat frontal or 15° lit, warm white balance
(≈5200K), no coloured gels.

Placement: centred in a `--color-paper-200` well at `--radius-none`, occupying **55–62%** of
the well's width, with equal air on all four sides. Apply `--shadow-contact` to the image
itself — it must sit *on* the well, not float above it.

Wells alternate tint by row position, never by category: odd rows `paper-200`, even rows
`paper-100`. Never tint a well with a category colour.

### 10.2 Lifestyle photography

Bright, daylit, human, in-the-room — the mb-3 register. The van on a Bengaluru street, hands
shaping shokupan, a tray coming out, a customer at the hatch. Warm grade: lifted blacks (never
below ~12% luminance), warm highlights, mild contrast. Faces and hands welcome.

**Forbidden:** dark moody plating, slate/black marble/charcoal wood surfaces, hard side-light
chiaroscuro, blue or teal grading, top-down flat-lays on dark backgrounds, and any stock image
of a "rustic artisan loaf on a wooden board". Nothing in the mood board is dark except mb-4's
hero (a *bright* golden croissant pile at low key) and mb-6's macro — both still warm and
glowing.

Text over photography is `--color-paper-0` with **no scrim box**. If legibility fails, regrade
the image or add a bottom-up gradient from `rgba(4,33,47,0.55)` to transparent over the lower
45% — never a flat translucent panel.

### 10.3 Ghosted line art

Wheat, a shokupan loaf, an an-pan, a curry bun, and the van, drawn as 1px `--color-paper-400`
line illustrations. Placed at **4–6% opacity**, oversized (400–900px), bleeding off a section
edge, behind text. One per section, maximum, and never behind a product grid. This is mb-8's
and mb-4's texture device.

### 10.4 Paper grain

A tileable 1–2% opacity noise overlay on `paper-50` page backgrounds, from mb-7. Implement as
a CSS `background-image` data-URI on `body::before` with `pointer-events: none`. It must be
invisible as an effect and felt only as texture. Not applied inside cards, on dark bands, or
over photographs.

### 10.5 Aspect ratios

Product well `1 / 1` · hero media `16 / 9` desktop, `4 / 5` mobile · story/lifestyle `3 / 2` ·
testimonial avatar `1 / 1` in `--radius-blob` · van map `16 / 10` widget, `4 / 3` page.

---

## 11. Iconography

**Lucide**, `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round`,
`fill: none` always. Sizes: `16` inline with text, `20` default UI, `24` header/nav/cart.
Colour inherits `currentColor` — icons are never independently coloured except the van pulse.

Canonical mappings: cart `shopping-bag` · van `truck` · slot `calendar` / `clock` · loyalty
`coins` · eggless/veg `leaf` · subscription `repeat` · WhatsApp `message-circle` · location
`map-pin` · area check `map-pin` · UPI / phone `smartphone` · pause `pause` · skip
`skip-forward` · stepper `minus` / `plus` · accordion `chevron-down` · close `x` · add `plus` ·
success / bake-stage done `check` · stage skipped `minus` · error `alert-circle` · busy
`loader-2` · rating `star` (the only permitted filled icon, filled with `--color-crumb`).

Never mix an emoji with a Lucide icon. Never use a filled icon set.

---

## 12. Components

Every component below is specified with its states. Focus ring is universal:
`outline: 2px solid var(--color-kiln); outline-offset: 2px;` on `:focus-visible` only.
On `ink-900` surfaces the ring is `var(--color-crumb)`.
Minimum hit target is **44×44px** everywhere, including the stepper and chips.

### 12.1 Header / nav

Sticky, `position: sticky; top: 0; z-index: 50`. Height 72px desktop, 60px mobile.

- **At top:** background `transparent` over hero, or `--color-paper-50` elsewhere. No border.
- **Scrolled (> 24px):** background `--color-paper-50` with `backdrop-filter: blur(8px)`,
  `--shadow-sticky` hairline, height shrinks to 60px over `--dur-base`.
- **Layout:** logo + wordmark left (mark at 32px, blob intact); nav centred at ≥1024;
  search icon, van-status pill, cart right. Mobile: hamburger left, logo centre, cart right.
- **Nav links:** `--text-micro` uppercase, `--color-ink-600`. Hover `--color-ink-800` with a
  1px `--color-kiln` underline scaling in from the left over `--dur-fast`. **Active:** an
  always-present 1px `--color-ink-800` underline (mb-5's pattern).
- **Cart:** `shopping-bag` 24px in `--color-ink-800`, with a badge — 18px circle,
  `--radius-pill`, `--color-kiln` fill, `--color-paper-0` `--text-nano` tabular numeral,
  offset `top: -4px; right: -6px`. Badge is absent at 0, not shown as `0`.
- **Van-status pill:** `--radius-pill`, `--color-paper-100` fill, hairline, a 6px
  `--color-crumb` pulsing dot, and `--text-nano` label `ON THE ROAD` / `AT THE BAKERY`.
  Opens the tracker widget. Hidden below 1024.
- **Mobile menu:** full-screen `--color-paper-50` panel, links at `--text-display-sm`, slides
  down over `--dur-slow`. Body scroll locked.

### 12.2 Announcement / ticker bar

Above the header, height 36px, background `--color-ink-900`, text `--color-paper-0` at
`--text-nano`. Content marquees horizontally at `--dur-marquee` linear, items separated by a
`--color-crumb` `·` bullet. Pauses on hover/focus. Dismissible via an `x` at the right (16px,
`--color-ink-400`); dismissal persists for the session. Not sticky — it scrolls away.

**Content pattern — the certainty sentence.** The bar never says "delivery available". It
states the day and the hour, computed, so a van that moves becomes one imperative:
`ORDER BY THURSDAY 8PM FOR SATURDAY'S BAKE · 100% EGGLESS · FREE DELIVERY OVER ₹800`.
When the van is out, the first segment is replaced by `THE VAN IS IN INDIRANAGAR · 2 STOPS
AWAY` and links to the tracker.

### 12.3 Hero — variant A: "Paper hero" (home, shop)

The mb-5 model, and the default.

Left column (7/12): kicker in `--text-micro` `--color-kiln`; headline in `--text-display-2xl`;
lead paragraph in `--text-body-lg` `--color-ink-600` capped at 46ch; a primary + ghost button
pair; and a bottom proof lockup — a `leaf` icon, a vertical hairline, and two `--text-nano`
lines (`100% VEGETARIAN & EGGLESS` / `BAKED FRESH EVERY MORNING`).

Right column (5/12): a product cutout at `--shadow-contact`, plus 4–7 crumb specks scattered
into the left column's negative space. The **Stamp** sits bottom-right, overlapping the
column boundary.

Background `--color-paper-50` with grain. No photo, no gradient. Entrance: kicker, headline,
lead, buttons stagger at 60ms with `--dur-slower`; the cutout fades and rises 24px; the stamp
scales `0.92 → 1` and begins rotating after it settles.

### 12.4 Hero — variant B: "Full-bleed statement" (category, campaign, van page)

The mb-6 model. A full-bleed warm photograph, `--radius-xl` on desktop with a 32px inset from
the viewport edge (mb-5/mb-6's framing), edge-to-edge on mobile. Height `min(78vh, 720px)`.

One word or short phrase in `--text-display-2xl`, `--color-paper-0`, centred, with an
overlapping `--font-display` italic sub-phrase in `--color-crumb` set at ~40% of the display
size and offset to break the baseline (mb-6's collision). Above it, a `--text-nano` line.
Below it, a primary + ghost pill pair in the on-photo variant. Bottom-left, a 2-line claim in
`--text-body-sm`.

Gradient scrim only where required (see §10.2). Never both variants on one page.

### 12.5 ProductCard

The system's densest object. Three type registers, permitted here only.

**Structure (top to bottom):**
1. **Well** — `1 / 1`, `--color-paper-200`, `--radius-none`, cutout at 55–62% with
   `--shadow-contact`. A `Stamp` (small, 44px) may overlay the top-right at `--space-2` inset
   when the SKU is baked-today.
2. **Category label** — `--text-micro`, uppercase, `--cat-*-ink`, preceded by a 5px dot in
   `--cat-*`, `--space-3` above.
3. **Name** — `--text-title`, `--font-sans` 600, `--color-ink-800`, `--space-1` above.
4. **Kana** — `--text-caption`, `--font-kana`, `--color-ink-500`, `letter-spacing: 0.06em`,
   `--space-1` above. Omitted rather than transliterated if unknown.
5. **Spec line** — `--text-micro`, mono, `--color-ink-500`, bullet-separated
   (`SHOKUPAN • 400G • EGGLESS`), `--space-2` above. Truncates to one line.
6. **Foot row** — `--space-4` above, `display: flex; justify-content: space-between;
   align-items: center`. Left: **price** in `--font-display` italic `--text-title`,
   `--color-ink-800`, tabular. Right: the **add control**.

Card itself: no border, no background, no radius — the well *is* the card, meta sits on the
page (mb-1's contact-sheet model). The clickable region is the whole card.

**Add control** — mb-8's circular affordance. Default: a 36px circle, `--radius-pill`,
`1.5px solid var(--color-ink-800)`, `plus` at 20px, transparent fill.
- `:hover` — fill `--color-ink-800`, icon `--color-paper-0`.
- On add — morphs into the **Stepper** (§12.9) at 108px wide over `--dur-base`.

**States**
- `:hover`/`:focus-within` — well image `scale(1.03)`, card `translateY(-2px)`, cutout shadow
  deepens. `--dur-fast`. The card never gains a shadow (only the product does).
- **Sold out** — the most-read state on a weekly-drop site; write and design it as such. The
  well desaturates to `filter: grayscale(1) opacity(0.55)`; a `--text-nano` `GONE THIS WEEK`
  chip in `--color-ink-600` on `--color-paper-200` sits top-left of the well (**not**
  `--color-danger` — running out is good news, not a fault); the price goes `--color-ink-500`;
  and the add control is replaced by a ghost `sm` button `Tell me when it's back`. The card
  remains clickable to the PDP, where the full three-string ritual (§12.27) is shown. Never
  hide, reorder or grey a sold-out card out of the grid.
- **Low stock** — a `--text-nano` `LAST 3` chip in `--color-warning` on
  `--color-warning-tint`, top-left of the well.
- **New / weekly special** — `--text-nano` `THIS WEEK` chip in `--color-paper-0` on
  `--cat-weekly`, top-left.
- **Loading** — well fills `--color-paper-200` with a 1.4s shimmer sweeping
  `--color-paper-100`; meta lines are 3 rounded bars. No spinner.

### 12.6 CategoryFilter

- **≥1024 — left rail** (mirrors the current /shop). Vertical list, `--text-micro` uppercase,
  `--color-ink-600`, `--space-3` row padding. Active: `--color-ink-800`, weight 500, with a
  2px `--cat-*` bar in the left gutter and the count in `--color-ink-500` at the right.
  Hover: `--color-ink-800`. A hairline separates `All` from the six categories.
- **<1024 — scroll rail.** Horizontal, `overflow-x: auto`, `scroll-snap-type: x proximity`,
  gutter-bleeding so chips run to the viewport edge; a `--color-paper-50` fade mask on both
  ends. Chips: `--radius-sm`, 36px tall, `--space-4` horizontal, hairline border,
  `--text-micro`. Active: `--color-ink-800` fill, `--color-paper-0` label, no border.
- **Empty category** (Weekly Specials today) — the chip stays visible but at
  `--color-ink-400` with `aria-disabled`; the grid shows the empty state (§12.20).
- Filter changes re-layout the grid with a 220ms `--ease-inout` cross-fade; items do not
  re-run their scroll reveal.

### 12.7 Cart drawer

Right-side panel, `width: min(440px, 100vw)`, full height, `--color-paper-0`,
`--radius-lg 0 0 --radius-lg` on the left corners, `--shadow-overlay`. Scrim `--color-scrim`.

- **Header** — `Your order` in `--text-display-sm`, item count in `--text-micro`, `x` close
  at 24px. Hairline below.
- **Line item** — 72px square `--color-paper-200` well with the cutout, name + kana, spec
  line, stepper, and price right-aligned in display italic. Hairline between items.
- **Cross-sell strip** — mb-8's promo pattern: a 56px well, a `--text-nano` label
  `ADD A LOAF?`, name, price, and a 28px circular `plus`. One item, above the summary.
- **Summary** — subtotal, delivery, and a `--color-kiln` line for any discount. A Fillo+
  row with a `coins` icon showing coins earned. Tabular numerals, dot-leader rules between
  label and value using a `repeating-linear-gradient` of `--color-paper-300`.
- **Footer** — sticky, `--color-paper-50`, hairline top. Free-delivery progress: a 3px
  `--color-paper-200` track with a `--color-kiln` fill and a `--text-micro` line
  (`₹120 MORE FOR FREE DELIVERY`). Then a full-width primary button `Checkout · ₹840`.
- **Fulfilment row** — directly above the footer: a compact FulfilmentLane summary (§12.29)
  showing the chosen lane, day, area and window, with a ghost `Change` link. If no area is
  set, this row is replaced by an inline AreaCheck (§12.28) and the checkout button is
  `disabled` with the helper `Set your area to check out`.
- **Empty** — a ghosted line-art loaf at 12% opacity, `Nothing in the box yet` in
  `--text-title`, one line naming what is actually baking this week in `--text-body-sm`
  `--color-ink-500`, and a single ghost button `See this week's bake` — the empty state
  hands the user exactly one door.
- Focus is trapped; `Esc` closes; the trigger regains focus on close.

### 12.8 Slot picker

Two rows of chips, the checkout's most important control.

- **Date chips** — horizontal scroll rail, snap. Each chip is 64×76px, `--radius-sm`,
  `--color-paper-0`, hairline. Inside, stacked and centred: weekday in `--text-nano`
  (`WED`), date numeral in `--font-display` `--text-title-lg`, month in `--text-nano`.
  Today's chip shows `TODAY` in place of the weekday, in `--color-kiln`.
- **Time chips** — a 2-col (mobile) / 4-col (desktop) grid of 44px chips, `--radius-sm`,
  label in `--text-body-sm` tabular (`12–2 PM`).
- **States** — default hairline on `paper-0`. `:hover` border `--color-ink-600`.
  **Selected:** `--color-ink-800` fill, `--color-paper-0` text, no border, plus a 16px `check`
  top-right on date chips. **Unavailable:** `--color-paper-200` fill, `--color-ink-400` text,
  a 1px diagonal strike, `aria-disabled`, not focusable. **Filling up:** available, plus a
  `--text-nano` `2 LEFT` in `--color-warning` below the label.
- **Cut-off notice** — when a same-day slot closes within 60 minutes, an inline
  `--color-warning-tint` bar with a `clock` icon above the time row.
- Group semantics: `role="radiogroup"` with `aria-label`, arrow-key roving tabindex.

### 12.9 Stepper

108×36px, `--radius-pill`, `1.5px solid var(--color-ink-800)`, transparent fill,
`display: grid; grid-template-columns: 36px 1fr 36px`.

- `−` and `+` are 36×36 tap targets (padded to 44px hit area), `minus`/`plus` at 18px,
  `--color-ink-800`.
- Quantity centred, `--text-body-sm` 600, tabular. Value changes cross-fade over
  `--dur-fast`; no counting animation.
- `:hover` on a control — a `--color-veil` circle behind it.
- At quantity 1, `−` shows `trash-2` and removes the line.
- **Max reached** — `+` goes `--color-ink-400`, `aria-disabled`, and a `--text-nano` tooltip
  `MAX 5 PER ORDER` appears below for 2s.
- **Pending** — during an optimistic update the border pulses opacity `1 → 0.5 → 1` at 900ms;
  the control stays interactive.
- On the dark band the border and glyphs are `--color-paper-0`.

### 12.10 Button

Geometry: `--radius-md` (8px). Pills are used **only** in the on-photo variant (Hero B) and
for the stepper and cart badge. Label `--font-sans` 500, `letter-spacing: 0.005em`.
Icons at 20px (`md`/`lg`) or 16px (`sm`), gap `--space-2`, always trailing except `plus`.

| Size | Height | Padding-x | Text |
|---|---|---|---|
| `sm` | 36px | `--space-4` | `--text-body-sm` |
| `md` | 44px | `--space-5` | `--text-body` |
| `lg` | 52px | `--space-6` | `--text-body-lg` |

**Primary** — fill `--color-ink-800`, label `--color-paper-0` (11.29:1).
`:hover` fill `--color-ink-700`. `:active` fill `--color-ink-900`, `transform: translateY(1px)`.
`:disabled` fill `--color-paper-300`, label `--color-ink-400`, no pointer.
`loading` — label holds its width, a 16px `loader-2` spins in place of the icon, `aria-busy`.

**Secondary** — transparent fill, `1.5px solid var(--color-ink-800)`, label `--color-ink-800`.
`:hover` fill `--color-veil`. `:active` fill `--color-ink-800`, label `--color-paper-0`.
`:disabled` border and label `--color-paper-300` / `--color-ink-400`.

**Ghost** — no fill, no border, label `--color-ink-700`, padding-x reduced one step.
`:hover` label `--color-ink-900` with a 1px underline scaling in from the left.
Used for tertiary actions, "Read more", and in-card links.

**On-photo variant** (Hero B only) — `--radius-pill`; primary is `--color-paper-0` fill with
`--color-ink-900` label; secondary is transparent with `1.5px solid var(--color-paper-0)` and
a `--color-paper-0` label.

**Destructive** — primary geometry, fill `--color-danger`, label `--color-paper-0`. Only in a
confirmation dialog, never inline.

Never: a kiln-filled primary button, a gradient fill, an all-caps button label, or a button
wider than its container on desktop.

### 12.11 Badge / Tag

`--text-nano`, uppercase, `--radius-xs`, height 20px, padding-x `--space-2`, tabular where
numeric.

- **Tint** (default) — a `-tint` background with its matching ink: `SOLD OUT`, `LAST 3`,
  `NEW`, `THIS WEEK`.
- **Outline** — transparent with a 1px `--color-paper-400` border and `--color-ink-600` text.
  Used for neutral facts: `EGGLESS`, `400G`, `VEG`.
- **Solid** — `--color-ink-800` fill, `--color-paper-0` text. Reserved for the cart count and
  the Fillo+ tier chip (which uses `--color-crumb` fill with `--color-ink-900` text, 5.15:1).

A badge never carries an icon larger than 12px and never wraps to two lines.

### 12.12 Stamp / Seal

The brand device (§5.1). Two forms, both circular in *ring* and blob in *field*.

**Filled stamp** (mb-4) — a `--radius-blob` field in `--color-crumb`, 88px (or 44px in-card),
rotated `-8deg`. Inside, `--font-display` `BAKED` over `TODAY` in `--color-ink-900`, with a
1px `--color-ink-900` inner ring inset 6px. Static. Used on product wells and the hero.

**Ring seal** (mb-2, mb-5) — 132px. `--text-nano` set on a circular path
(`textPath` on an SVG circle) reading `100% VEGETARIAN · EGGLESS · BAKED THIS MORNING ·`,
in `--color-kiln` on paper or `--color-crumb` on dark. A 1px ring in `--color-paper-400`.
At the centre, a `leaf` Lucide glyph at 28px. The ring rotates over `--dur-seal`; the glyph
holds. Used once per page, overlapping a section boundary.

Never place a seal on a photograph's busy area, never two on one screen, never scale below
72px (the ring text becomes illegible).

### 12.13 Testimonial

No card, no quote-mark graphic, no star row above the quote.

Quote in `--font-display` `--text-display-sm`, `--color-ink-800`, capped at 46ch, on
`--color-paper-100`. Below, `--space-6`: a `--radius-blob` 48px avatar (or, with no photo, the
initial in `--font-display` on `--color-paper-200`), then name in `--text-body-sm` 600, then
area + date in `--text-micro` `--color-ink-500` (`INDIRANAGAR · MAY 2026`). Rating as 5
`star` glyphs at 14px, filled `--color-crumb`, unfilled `--color-paper-300`, placed after
the meta.

Carousel: `‹ ›` circular ghost buttons top-right of the rail, and a hairline track beneath
with a `--color-kiln` progress segment (mb-8). Scroll-snap on touch. No auto-advance.

### 12.14 Stats band

mb-4's row. Full-bleed `--color-ink-900`, `--section-y-lg`. A 3- or 4-column row separated by
**vertical `--border-hairline-dark` rules** (not by gaps). Each cell centred: numeral in
`--font-display` `--text-display-lg` `--color-paper-0` tabular; caption below in
`--text-nano` `--color-ink-400`.

Values render at their final number — **no count-up animation.** Below 768 the row becomes a
2×2 grid with horizontal hairlines.

Content: `23 BREADS DAILY` · `100% EGGLESS` · `6 AM BAKE START` · `4,000+ LOAVES A MONTH`.

### 12.15 Footer

Full-bleed `--color-ink-900`, `--section-y-lg` top padding.

- **Statement row** — the wordmark at 48px in `--color-logo-cream`, and beside it one
  oversized line in `--font-display` `--text-display-lg` `--color-paper-0`:
  `bread, brought to you.` Below on mobile.
- **Columns** — three, `--text-body-sm`, `--color-ink-400` links going `--color-paper-0` on
  hover with a 1px underline. Headings in `--text-nano` `--color-crumb`.
  *Shop* (categories) · *Fillo* (About, Fillo+, Subscription, Franchise, Blog) ·
  *Help* (Contact, WhatsApp, Delivery, Refunds, Terms, Privacy).
- **Van strip** — a hairline-bounded row with a `truck` icon, the live status, and a ghost
  link `See where we are →`.
- **Base row** — hairline above; `--text-micro` `--color-ink-400`:
  `WISE EATS SUPERFOOD OPC PVT LTD · BENGALURU`, the phone, and the socials as 20px Lucide
  glyphs.
- One ghosted line-art loaf at 5% opacity bleeding off the right edge.

### 12.16 Van tracker — widget

A floating trigger, bottom-right, `bottom: 24px; right: 24px`, above the fold on every page:
a 52px `--radius-pill` `--color-ink-800` pill with a `truck` icon and a pulsing
`--color-crumb` dot; it expands on hover to reveal `Track our van` in `--text-body-sm`
over `--dur-base`. Below 768 it is a 52px circle only.

Opening it mounts a **panel**, `width: min(380px, calc(100vw - 32px))`, `--radius-lg`,
`--color-paper-0`, `--shadow-overlay`, anchored bottom-right, entering with `scale(0.96) →
1` + fade over `--dur-slow` `--ease-out`.

Panel contents:
1. Header — `Fillo Moving Bakery`, `--text-title`; `x` close.
2. **Status pill** — see §12.16.1. It always carries a state *and* a time or a date. Never
   a bare "offline".
3. **Hero line** — the answer, in `--font-display` `--text-display-sm`: `2 stops away.`
   Below it, the arrival band in `--text-body-sm` `--color-ink-600`: `Around 4:40 to 4:50`.
4. **Map**, `16 / 10`, `--radius-md`, greyscale base tiles tinted toward `--color-paper-100`,
   route line in `--color-kiln` at 2px, and the van marker as a 32px `--radius-blob` in
   `--color-ink-800` with a white `truck` glyph.
5. **Route list** — three rows maximum, see §12.17.
6. Ghost button `Open full tracker →`.

**The load-bearing rule.** Status, hero line, arrival band and route list are **server-rendered
before the map library loads**. The card is the truth; the map is the feeling. If the map
layer is removed entirely the panel must still answer the question the visitor arrived with.
Build and style them so this is literally true — the map is a progressively-enhanced child,
never the container.

**Stops, not minutes.** Distance and ETA are never expressed as a single minute count.
Proximity is a **stop count** (`2 stops away`) and time is a **ten-minute band** that widens
itself in traffic (`Around 4:40 to 4:50`). A stop count is honest and cannot be faked;
a minute count on a multi-stop Bengaluru route is a lie. Never render a countdown.

#### 12.16.1 Tracker status states

One pill, `--radius-pill`, height 28px, `--text-nano`, padding-x `--space-3`. Every state
carries a dot, a label and a time or date.

| State | Dot | Fill / text | Label |
|---|---|---|---|
| **Live** | 8px `--color-crumb` + pulse ring | `--color-ink-900` / `--color-crumb` | `LIVE · UPDATED 9S AGO` |
| **Stale** (>90s no fix) | 8px `--color-warning`, no pulse | `--color-warning-tint` / `--color-warning` | `LAST SEEN 4:31PM` |
| **Off air** (between drops) | 8px `--color-ink-400`, no pulse | `--color-paper-200` / `--color-ink-600` | `OFF AIR · BACK SATURDAY` |
| **Loading up** (pre-roll) | 8px `--color-crumb`, slow pulse | `--color-ink-900` / `--color-crumb` | `LOADING THE VAN · OUT AT 4:30` |
| **Sold out for today** | 8px `--color-ink-400` | `--color-paper-200` / `--color-ink-600` | `RACKS EMPTY · BACK SUNDAY` |
| **Feed error** | 8px `--color-danger` | `--color-danger-tint` / `--color-danger` | `CAN'T REACH THE VAN` |

The `UPDATED 9S AGO` counter refreshes on a 15s interval with a 1px `--color-crumb` progress
hairline draining across the panel's top edge. Under `prefers-reduced-motion` the hairline
holds and only the number changes.

**Off air is the primary state — design it first.** The van runs two days a week, so five
days out of seven this is the page. The off-air panel keeps the **identical layout**: pill,
hero line, route-as-list, one action. Only the content changes:

- Hero line: `The ovens are cold. The plan isn't.`
- The route list becomes the **schedule** — `Saturday / Indiranagar, 12th Main`,
  `Sunday / Koramangala, Sony World`, `Weekdays / Kitchen only` — same row geometry, dots
  all hollow.
- A `--text-body-sm` `--color-ink-600` line: `Both days the van rolls out at 4:30pm and stays
  till the racks are empty.`
- Primary action: `Tell me when the van's out` → opens the WhatsApp opt-in sheet (§12.31).
- Where the map would be, a warm photograph of the van parked at the bakery in `--radius-md`.

The off-air state gets the best line on the page and the notify button, because this is where
a first visit most often lands. It is never styled as an error, never greyed out, and never
smaller than the live state.

**Feed error** is the only degraded state: the map is replaced by a `--color-paper-200` block
reading `We can't reach the van right now — here's today's route anyway`, the route list stays
server-rendered above it, and a `Retry` ghost button sits beneath.

### 12.17 Van tracker — page

Order of the page is the order of certainty: **status → hero line → arrival band → route list
→ bake strip → map**. Everything above the map is server-rendered text.

1. **Status band** — full-bleed `--color-ink-900`, `--section-y` reduced by half. The status
   pill (§12.16.1), then the hero line in `--font-display` `--text-display-xl`
   `--color-paper-0` (`2 stops away.` / `The ovens are cold. The plan isn't.`), then the
   arrival band in `--text-body-lg` `--color-ink-400` (`Around 4:40 to 4:50`).
2. **Route list** — the load-bearing content. At ≥1024 it sits at 4/12 beside the map at
   8/12; below 1024 it sits above the map. Each stop is a row with a `--font-display` time,
   the ward in `--text-body` 600, and a state word in `--text-micro` (`now`, `next`, or the
   clock time it was served). A left-gutter timeline runs behind them: a 2px
   `--color-paper-300` vertical rule with an 11px dot per stop.
   - **Served** — filled `--color-ink-800` dot, a 14px `check` before the ward,
     `--color-ink-500` text.
   - **Current** — `--color-crumb` dot with the pulse ring, `--color-ink-800` text at 600,
     and the row background steps to `--color-paper-100`.
   - **Upcoming** — hollow dot (1.5px `--color-paper-400` ring), `--color-ink-600` text.
   - **Off air** — every dot hollow, times replaced by weekday names.
3. **Map** — `4 / 3`, `--radius-lg`, full route. Loaded after the text. Off air, it is
   replaced by the parked-van photograph at the same ratio.
4. **BakeStrip** (§12.30) — sits directly under the status band and stays meaningful in the
   hours when the dot has not moved.
5. **What happened today** — a generated feed, most recent first, capped at 5 rows, each a
   `--text-body` line with a right-aligned `--text-micro` tabular timestamp on a hairline
   row (`Kenji rang the bell at 43 gates today · 6:40PM`, `Sold out at HSR in 20 minutes ·
   3:50PM`). Every line is generated from stop states — none is hand-written. Hidden entirely
   if fewer than 2 rows exist rather than shown thin.
6. **WhatsApp opt-in row** (§12.31), full width, closing the page.

### 12.18 Subscription plan card

Three cards in a row at ≥1024, stacked below. `--radius-lg`, `--color-paper-0`,
`--border-hairline`, padding `--space-8`.

- Plan name in `--text-micro` `--color-kiln`; cadence in `--font-display`
  `--text-display-sm` (`Twice a week`); price row: `₹` in `--text-body` and the amount in
  `--font-display` `--text-display-md`, then `/ week` in `--text-body-sm` `--color-ink-500`.
- A hairline, then a benefit list — 16px `check` in `--color-success` and `--text-body-sm`
  rows at `--space-3`.
- Primary button, full width.
- **Recommended plan** — surface `--color-paper-100`, border `1.5px solid var(--color-ink-800)`,
  and a `--text-nano` `MOST POPULAR` badge in solid style, half-overlapping the top edge,
  centred. It does **not** scale up or gain a shadow.
- `:hover` — `--shadow-lift`, `translateY(-2px)`.
- **Current plan** — border `--color-success`, a `YOUR PLAN` outline badge, and the button
  becomes secondary `Manage`.

**Pause / skip controls.** A subscription to a weekly drop must be trivially escapable, or
people will not start one. On the *current plan* card, below a `--border-hairline`, a control
row that is never hidden behind a "Manage" page:

- **Next delivery row** — a `calendar` icon, `Next: Saturday 6 Sep · 4–6pm` in `--text-body-sm`
  600, and a ghost `Change` link.
- **Skip** — a secondary `sm` button `Skip this week`. On press it becomes an inline
  `--color-warning-tint` row with `alert-circle`, `Saturday 6 Sep skipped` and a ghost `Undo`
  that persists until the cut-off. After the cut-off, the row is `--color-ink-500` and the
  Undo is removed with the helper `Orders closed Thursday 8pm.`
- **Pause** — a ghost `sm` button `Pause`. Opens a dialog (§12.23) offering three chips —
  `2 weeks`, `1 month`, `Until I say` — plus a primary `Pause deliveries`. No retention
  interstitial, no "are you sure", no discount offer. One screen, one action.
- **Paused state** — the whole card surface steps to `--color-paper-100`, a `PAUSED · BACK
  4 OCT` solid badge replaces `YOUR PLAN`, the benefit list dims to `--color-ink-500`, and
  the primary button becomes `Resume now`. The card is never removed from the page.
- **Cut-off notice** — when the weekly cut-off is inside 24h, a `--text-micro`
  `--color-warning` line under the row: `CHANGES FOR THIS SATURDAY CLOSE THURSDAY 8PM`.

Skip and pause use the same button geometry as every other secondary/ghost pair. They are
never `--color-danger` — skipping a week is not a destructive act.

### 12.19 FAQ accordion

A hairline-separated list, no card, no radius, max-width `--max-narrow`.

- Trigger: full-width, `--space-5` vertical padding, question in `--text-title` left,
  `chevron-down` 20px `--color-ink-500` right. `:hover` question `--color-ink-900`.
- Open: chevron rotates 180° over `--dur-base`; panel height animates via
  `grid-template-rows: 0fr → 1fr` over `--dur-base` `--ease-out`; answer in `--text-body`
  `--color-ink-600` capped at `--max-prose`, padding-bottom `--space-6`.
- One open at a time is **not** enforced — multiple may be open.
- Semantics: `<button aria-expanded>` inside a heading, controlling a `region`.

### 12.20 Empty and error states

Centred in the content area, `--space-16` vertical. A ghosted line-art glyph at 96px and 12%
opacity, a line in `--text-title` `--color-ink-800`, a line in `--text-body-sm`
`--color-ink-500`, and one ghost or secondary button. Never an illustration in colour, never
a spinner as an empty state.

### 12.21 Newsletter / WhatsApp CTA

The **marketing-list** capture (the Sunday message). For the **van-proximity nudge** — a
different consent, a different message, a different frequency — use the WhatsApp opt-in row
(§12.31). The two are never shown in the same viewport.

A full-bleed `--color-paper-100` band (or `--color-ink-900` when it follows a paper section
and the page needs a rhythm beat).

Left 6/12: heading in `--text-display-md`, one line of body. Right 6/12: an inline form —
input plus primary button on one row at ≥768, stacked below. Beneath the form, a `--text-micro`
consent line and a **secondary button with a `message-circle` icon**: `Or ping us on WhatsApp`,
which opens `wa.me`. Success replaces the form in place with a `check` in `--color-success`
and `You're on the list.` — no toast, no redirect.

### 12.22 Toast

Bottom-centre on mobile, bottom-right at ≥768, `max-width: 400px`, `--radius-md`,
`--color-ink-900`, `--color-paper-0` text, `--shadow-overlay`, padding `--space-4`.
A 20px status icon left in `--color-crumb` (success uses `check`), message in
`--text-body-sm`, and one ghost action in `--color-crumb` at the right. Enters
`translateY(12px)` + fade over `--dur-base` `--ease-out`; auto-dismisses at 4.5s (7s with an
action); the timer pauses on hover. Stacks to a maximum of 3, oldest dropping first.
`role="status"`, `aria-live="polite"`.

### 12.23 Dialog

`max-width: 520px`, `--radius-lg`, `--color-paper-0`, `--shadow-overlay`, padding `--space-8`.
Scrim `--color-scrim` fading in over `--dur-base`; panel `scale(0.97) → 1` + fade over
`--dur-slow` `--ease-out`. Title in `--text-display-sm`, body in `--text-body`
`--color-ink-600`, actions right-aligned in a row with `--space-3` gap (ghost cancel, then
primary or destructive). `x` close top-right at 20px. Focus trapped, `Esc` closes, scroll
locked, focus returns to the trigger. Below 640px the dialog becomes a bottom sheet:
full width, `--radius-lg` on the top corners only, entering with `translateY(100% → 0)`.

### 12.24 Form fields

- **Label** — `--text-micro`, uppercase, `--color-ink-600`, `--space-2` below. Always visible;
  never a placeholder-as-label.
- **Input** — height 48px, `--radius-sm`, `--color-paper-0`, `--border-input`, padding-x
  `--space-4`, text `--text-body` `--color-ink-800`. Placeholder `--color-ink-500`.
- `:hover` border `--color-ink-500`. `:focus-visible` border `--color-ink-800` plus the kiln
  focus ring.
- **Error** — border `--color-danger`; below, a 16px `alert-circle` and message in
  `--text-caption` `--color-danger`, wired with `aria-describedby` + `aria-invalid`. Errors
  appear on blur, never on keystroke.
- **Success** — a 16px `check` in `--color-success` inset at the right of the field. No
  border change.
- **Disabled** — `--color-paper-100` fill, `--color-paper-300` border, `--color-ink-400` text.
- **Helper text** — `--text-caption` `--color-ink-500`, `--space-2` below the field.
- **Textarea** — same, `min-height: 120px`, `resize: vertical`.
- **Select** — same shell with a `chevron-down` 20px at the right, `--space-4` inset.
- **Checkbox / radio** — 20px, `--radius-xs` / `--radius-pill`, `1.5px solid
  var(--color-ink-600)`; checked fills `--color-ink-800` with a `--color-paper-0` glyph.
  Label `--text-body-sm`, 44px hit row.
- Phone inputs use `--font-mono` with tabular numerals and a fixed `+91` prefix in
  `--color-ink-500` inside the field, separated by a hairline.

### 12.25 OTP phone field

Two steps in one component; the second replaces the first in place, never on a new page.

**Step 1 — number.** A single 48px input (§12.24) with a fixed `+91` prefix in
`--color-ink-500` and a hairline separator, `inputmode="tel"`, `autocomplete="tel-national"`,
`maxlength=10`, `--font-mono` tabular. Label `MOBILE NUMBER`. Helper:
`We only use this to tell you where the van is.` Primary `md` button `Send code`.

**Step 2 — code.** The number collapses to a `--text-body-sm` `--color-ink-600` line with a
ghost `Change` link. Below it, **six separate 48×56px boxes**, `--radius-sm`, `--color-paper-0`,
`--border-input`, `--font-mono` `--text-display-sm` tabular, centred, `--space-2` gap
(a wider `--space-4` gap between the third and fourth). Label `ENTER THE 6-DIGIT CODE`.

- Focus moves forward on entry and backward on `Backspace` in an empty box; the focused box
  gets `--color-ink-800` border plus the kiln focus ring.
- The whole group accepts a paste of six digits and distributes them.
- `autocomplete="one-time-code"` on the first box so iOS/Android autofill works. The group is
  a single `aria-label`led fieldset; screen readers announce it once, not six times.
- **Verifying** — boxes lock to `--color-paper-100`, `aria-busy`, a 16px `loader-2` under the
  group. No full-screen spinner.
- **Success** — all six borders go `--color-success` for 400ms, then the step advances.
- **Error** — all six borders `--color-danger`, the group shakes `translateX ±4px` twice over
  `--dur-fast` (suppressed under reduced motion), boxes clear, focus returns to the first,
  and a `--text-caption` `--color-danger` message sits below with `alert-circle`.
- **Resend** — a ghost link `Resend code` under the group, disabled with a
  `--font-mono` tabular countdown `RESEND IN 0:29` until it expires. After three failed
  sends, it becomes `Get the code on WhatsApp instead`.

Never auto-submit on the sixth digit without a visible state change; never mask the digits.

### 12.26 KanaLabel

The small Japanese reading under a product name. Used in ProductCard, PDP titles, cart line
items and order confirmations — nowhere else.

`--font-kana` (Zen Kaku Gothic New) 400, `--text-caption` (13px), `letter-spacing: 0.06em`,
`line-height: 1.4`, `--color-ink-500`, `--space-1` above the name it belongs to. Set
`lang="ja"` on the element so screen readers and line-breaking behave, and mark it
`aria-hidden="true"` when the Latin name directly above already carries the same meaning —
it is a visual grace note, not additional information.

- Maximum one line. If the reading would wrap, it is omitted rather than truncated.
- Never romanised as a substitute (`shokupan` in Latin letters is the *name*, not the kana).
- Never bolded, never coloured with a category hint, never larger than `--text-caption`.
- **Omit rather than invent.** If a SKU has no verified Japanese reading, the slot collapses
  and the layout closes up — the card must be designed to look correct with the kana absent.
- On `--color-paper-200` wells or dark bands, step to `--color-ink-600` / `--color-ink-400`
  respectively so contrast holds.

Examples: `Milk Shokupan` / `ミルク食パン` · `Custard An Pan` / `カスタードあんぱん` ·
`Seoul Spice Kare Pan` / `カレーパン`.

### 12.27 DropCard

The weekly-drop buy card, and the single most important commercial object on the site.
**Say how many you baked. Never how long is left.** Supply-based scarcity, never a countdown.

Structure, on a `--color-paper-0` surface at `--radius-lg` with `--border-hairline`,
padding `--space-8`:

1. **Status chip** — solid `ORDERS OPEN` (`--color-ink-800`), or tint `CLOSED` / `SOLD OUT`.
2. **Kicker** — `--text-micro` `--color-ink-500`: `SATURDAY · INDIRANAGAR`.
3. **Photo** — `3 / 2`, `--radius-md`, a tray of loaves at the van door. Warm, daylit.
4. **Name** — `--font-display` `--text-display-md`: `The Saturday Bake`.
5. **The count — the component's whole point.** One line in `--font-display`
   `--text-display-sm` `--color-ink-800`, tabular: **`We bake 40. 12 left.`** The two numbers
   are separate `<span>`s with `tabular-nums` so the line does not reflow as stock falls.
6. **Reserve bar** — a 4px `--color-paper-200` track with a `--color-kiln` fill at 70%, and
   beneath it a `--text-nano` `--color-ink-500` row: `28 RESERVED` left,
   `40 IS THE OVEN, NOT A TACTIC` right. That right-hand line is permanent copy, not a
   tooltip — it is the honesty claim that makes the number credible.
7. **Primary `lg` button** — `Reserve yours`, full width.
8. **Cut-off line** — `--text-caption` `--color-ink-500`, stated once, as a fact:
   `Orders close Thursday 8pm. No restocks, it is a van.`

**Hard rules.**
- **No clock, no ticking digits, no red, no "hurry".** The cut-off carries all the time
  pressure and it is stated once in body colour.
- The count is wired to the real order table or the component does not ship. A manufactured
  number triggers reactance strong enough to outweigh any lift.
- The bar fill uses `--color-kiln`, never `--color-danger`, at any level.
- Below 6 remaining, the count line gains a `--color-warning` dot before it — nothing else
  changes. No colour flip of the whole card.

**Sold-out state — three separately written strings, three separate slots.**
- **Status** — `--font-display` `--text-display-md`: `Gone for this week.`
- **Cause** — `--text-body` `--color-ink-600`: `Forty loaves, gone by 9:15. Thank you,
  Indiranagar.` Scarcity read as demand raises evaluation; scarcity read as an accident does
  not, so the cause is always named.
- **Promise** — primary `lg` `Tell me when the van's back out`, with a `--text-caption`
  `--color-ink-500` helper: `One message, Sunday morning. Nothing else.`
- The photo desaturates to `grayscale(0.7) opacity(0.7)`; the count line and the reserve bar
  are removed entirely, not greyed. The payoff string (`This week's bake is up`) belongs to
  the WhatsApp message, not to this card.

### 12.28 AreaCheck

Serviceability, asked once and remembered. It appears as: a `SET AREA` control in the header,
an inline block on the home hero, a step in checkout, and a fallback in the cart drawer.

**Input.** A 48px field (§12.24) with a `map-pin` 20px leading icon, label `YOUR AREA OR
PINCODE`, `inputmode="numeric"` when the value parses as digits, and a combobox listing
matching Bengaluru areas as you type (`role="combobox"`, `aria-expanded`, roving option
focus). A ghost `Use my location` link sits beneath — it is optional, never a prompt on load.
Primary `md` button `Check`.

**Three result states**, each rendered in place below the field as a `--radius-md` block with
`--space-4` padding. Each names the outcome, then gives exactly one next action.

1. **Served — home delivery.** Surface `--color-success-tint`, a 20px `check` in
   `--color-success`. Line 1 `--text-body` 600 `--color-ink-800`: `We deliver to Indiranagar.`
   Line 2 `--text-body-sm` `--color-ink-600`: `Saturday, 4–6pm. Free over ₹800, ₹60 under.`
   Action: primary `See Saturday's bake`. This also pre-selects the Home delivery lane
   (§12.29).
2. **Catch-the-van only.** Surface `--color-paper-200`, a 20px `truck` in `--color-ink-800`.
   Line 1: `We don't deliver to Whitefield yet — but the van stops nearby.` Line 2: the
   nearest stop with its day and window, in `--text-body-sm`, plus the walking distance if
   known. Actions: primary `Catch the van at Indiranagar` and ghost `See the full route →`.
   This pre-selects the Catch-the-van lane. **This is not an error state** — it is a
   different, equally valid lane, and it must never be styled with `--color-warning` or
   `--color-danger`.
3. **Not yet.** Surface `--color-paper-100`, a 20px `map-pin` in `--color-ink-500`.
   Line 1: `We're not in Sarjapur yet.` Line 2 `--text-body-sm` `--color-ink-600`:
   `We add stops where enough people ask. Tell us you're there and you'll be the first to
   know when we are.` Action: a single-field WhatsApp/email capture inline, then the row
   replaces itself with `check` + `Noted. We'll message you when the van gets to Sarjapur.`
   No dead end, no "sorry", no support link.

**States.** Idle · typing (combobox open) · `checking` (button `aria-busy`, 16px `loader-2`,
field locked) · one of the three results · `error` (`--color-danger-tint`,
`That pincode didn't look right — try the area name instead`, field retains its value).

**Persistence.** Once set, the header control shows `INDIRANAGAR ▾` in `--text-micro` with a
`map-pin`, and reopening it shows the current area pre-filled with a ghost `Change`. Stored
per-browser; never re-asked mid-session; never blocks browsing — only checkout.

### 12.29 FulfilmentLane selector

Two lanes, chosen before the cart, with the price attached to each. It sits **directly under
the Add-to-box button on the PDP** (so route and window are settled before checkout, never
after), and again as a confirmable step in checkout.

A 2-up grid at ≥560px, stacked below. Each lane is a selectable card:
`--radius-md`, `--color-paper-0`, `1.5px solid var(--color-paper-400)`, padding `--space-5`,
`role="radio"` inside a `role="radiogroup"` labelled `WHERE THE VAN MEETS YOU`.

Each card contains, top to bottom:
- A 20px Lucide icon — `truck` for Home delivery, `map-pin` for Catch the van.
- Lane name in `--text-title`: `Home delivery` / `Catch the van`.
- **Price, always attached and always visible** — `--font-display` italic `--text-title`
  tabular: `₹60` / `Free`. Never disclosed later; never "calculated at checkout".
- A `--text-body-sm` `--color-ink-600` detail line: `Saturday · Indiranagar · 4 to 6pm` /
  `Saturday · 12th Main · 4:30 till the racks are empty`.
- A `--text-micro` `--color-ink-500` qualifier: `FREE OVER ₹800` / `NO FEE, EVER`.

**States.** Default as above. `:hover` border `--color-ink-600`. **Selected:** border
`1.5px solid var(--color-ink-800)`, surface `--color-paper-100`, and a 20px `check` in
`--color-ink-800` at the card's top-right. **Unavailable for this area:** surface
`--color-paper-100`, content at `--color-ink-400`, `aria-disabled`, not focusable, and a
`--text-micro` reason under the lane name (`NOT IN WHITEFIELD YET`) with a ghost link
`Check another area` that opens AreaCheck. **No area set:** both lanes render disabled with a
single AreaCheck field above them and the helper `Set your area to see your options.`

Selecting a lane updates the window shown in the header of the cart drawer and the checkout
summary. Changing lane after items are in the box never clears the box.

A **compact summary variant** (one hairline row: icon, lane, day, area, window, price, and a
ghost `Change`) is used in the cart drawer, the checkout summary and the order confirmation.

### 12.30 BakeStrip

The operational-transparency layer: four real timestamps that keep the tracker page meaningful
in the hours when the van's dot has not moved, and that show the labour behind the loaf.

A single horizontal strip of four equal cells divided by `--border-hairline` vertical rules
(or `--border-hairline-dark` on a dark band). Full width, `--space-5` vertical padding.
Below 640px it becomes a 2×2 grid with horizontal hairlines.

Each cell, centred:
- A 16px state glyph — `check` for a completed stage, a 8px `--color-crumb` pulsing dot for
  the active stage, a hollow 8px ring for a future stage.
- Stage name in `--text-nano`: `MIXED` · `PROOFED` · `BAKED` · `LOADING`.
- Timestamp in `--font-mono` `--text-caption` tabular: `4:10` · `8:30` · `5:40` · `NOW`.

**States per cell.** Done — glyph and text `--color-ink-800` (or `--color-paper-0` on dark),
real clock time. Active — `--color-crumb` glyph with pulse, text `--color-ink-800`, timestamp
reads `NOW`. Pending — hollow ring, text `--color-ink-400`, timestamp reads `—`.
Skipped/failed — a 16px `minus` in `--color-ink-400` and the timestamp `—`; never an error
colour, since a stage that did not run is not a fault the visitor can act on.

**Rules.** Every timestamp is a real, server-supplied clock time — the strip is a promise of
honesty and a fabricated time destroys it. No progress bar connecting the cells. No
percentage. Times are 12-hour without a meridiem inside the strip (the page context supplies
morning/evening). The strip renders identically when the map has failed; it is text.

Off air, the strip renders all four cells pending with the label
`NEXT BAKE SATURDAY, FROM 4:10AM` beneath it, rather than being hidden.

### 12.31 WhatsApp opt-in row

WhatsApp, not web push: Safari cannot receive push from a tab, and these pages arrive by QR
and forward. Used as the tracker's primary action, as the sold-out promise, and as the
"tell me when you deliver here" capture in AreaCheck.

**Inline row.** A `--color-paper-100` block, `--radius-md`, padding `--space-6`. Heading in
`--text-display-sm`: `Tell me when the van is near.` One `--text-body` `--color-ink-600` line
setting the expectation precisely: `One WhatsApp message when we're about two stops from your
gate. At most one a day.` Then a row: an area select (§12.28's combobox, pre-filled) and the
OTP phone field (§12.25), then a **primary button with a `message-circle` icon**:
`Get the nudge on WhatsApp`, and beside it a **ghost `Not now`**.

Beneath, a `--text-micro` `--color-ink-500` reassurance line, always present:
`No app, no location permission. We watch the van so you don't have to.`

**Rules.**
- **Never a cold prompt on load.** The sheet form (see below) appears only after a value
  moment — ~20s dwell, a second visit, or a sold-out view. Pressured users deny permanently.
- **`Not now` is always present and is a real ghost button**, the same size as the primary.
  Never an `x` in a corner, never smaller, never lower-contrast than the reassurance line.
- Always show what the message will say and how often, before the button — the expectation
  *is* the pitch.
- **Sheet form** — below 640px, and whenever it is primed rather than requested, this renders
  as a bottom sheet (§12.23) over a dimmed map, with the same content and the same two
  buttons.
- **Success** — the row replaces itself in place: a `check` in `--color-success` and
  `You're on the list. You'll hear from us before anyone else does.` No toast, no redirect.
- **Already opted in** — the row renders as a single hairline line with a `check`,
  `WhatsApp nudges on for Indiranagar`, and a ghost `Turn off`.

### 12.32 ThreeDoors

The first-visit module. Twenty-three SKUs is not overload by itself, but a visitor who has
never eaten shokupan, cannot read the names, and arrives with no goal will stall. The fix is
not a smaller menu — it is a **smaller first decision**, with the full grid one tap away.

A 3-up grid at ≥900px, stacked below, inside `--max-content` on `--color-paper-50`. Above it:
`--text-display-md` `New here? Start with one of three.` and one `--text-body`
`--color-ink-600` line `Everything is eggless. Everything is baked Saturday morning.`

Each door is a large card — deliberately bigger than a ProductCard, `--radius-md`,
`--color-paper-0`, `--border-hairline`, padding `--space-6`, with a `4 / 3`
`--color-paper-200` well and a cutout at the top. **Each door is named twice**, and that
double-naming is the whole remedy for unfamiliarity:

1. **Plain-English role** — `--font-display` `--text-display-sm`: `The Loaf` / `The Sweet One`
   / `The Box`.
2. **Price** — `--font-display` italic `--text-title`, tabular, right-aligned on the same
   baseline as the role.
3. **Real name + sensory line** — `--text-body` `--color-ink-600`:
   `Milk Shokupan. Pull-apart, cloud-soft.` / `Custard An Pan. Soft bun, warm centre.` /
   `A bit of everything. One loaf, two buns, one surprise.`
4. **KanaLabel** (§12.26) under the real name, where one exists.

`:hover` — `--shadow-lift`, `translateY(-2px)`, image `scale(1.03)`. The whole card is the
target; there is no separate button inside a door.

Below the three, centred with `--space-8` above: a single ghost button
`Or browse all 23 bakes →`. That escape hatch is mandatory and is never de-emphasised.

**Rules.** Exactly three doors — not four, not a carousel. The module renders **only for
first-time visitors**; returning buyers are routed straight past it to the grid, and it never
reappears once someone has ordered. It is never the only route to the catalogue. It is not a
category filter and must not reuse the category colours.

### 12.33 ProofBlock / SpecList

Numbers do the persuading. The spec row replaces the adjectives — at ₹200 a loaf, the buyer
is looking for something checkable, and "artisanal" is not checkable.

**Inline variant (PDP, under the sensory line).** A single hairline-bounded row of three or
four cells divided by `--border-hairline` vertical rules, each cell holding a `--font-mono`
`--text-micro` uppercase value: `82% HYDRATION` · `18H FERMENT` · `BAKED 5:40`. Colour
`--color-ink-600`. The row sits on `--color-paper-50` with `--space-4` vertical padding, no
background fill, no icons. Below 560px it wraps to two rows; it never scrolls horizontally.

**List variant (PDP detail, about page).** A definition list of hairline-separated rows:
label left in `--text-micro` uppercase `--color-ink-500`, value right in `--font-mono`
`--text-body-sm` tabular `--color-ink-800`, with a dot-leader rule between them (a
`repeating-linear-gradient` of `--color-paper-300`). Rows: `HYDRATION 82%`, `FERMENT 18 HOURS`,
`BAKE 5:40 AM`, `FLOUR JAPANESE MILLED`, `EGG NONE`, `PRESERVATIVES NONE`, `BEST ON DAY ONE`.

**The claim line.** Directly beneath either variant, one `--text-body` `--color-ink-800` line
carrying the objection-answer, on its own — never as the headline:
`Eggless. Nobody in 300 tastings could tell.` It earns its own line because it answers the
only real objection with evidence rather than reassurance.

**Rules.** Every value is a real, checkable number or a real material. No adjectives inside a
spec cell (`SLOW FERMENT` is not a spec; `18H FERMENT` is). Mono and tabular always, so the
column reads as data. Never coloured, never badged, never given an icon — the plainness is
the credibility. Maximum four cells inline, seven rows in the list. If a value is unknown,
the row is omitted; a spec list with a blank is worse than a shorter one.

A **"how to eat it"** block pairs with this on every PDP — a `--text-body` paragraph under a
`--text-micro` `HOW TO EAT IT` kicker. For an unfamiliar product, usage instruction *is* the
persuasion; it removes the "I won't know what to do with it" objection that adjectives cannot
touch.

### 12.34 UPI pay button

India's default rail. It is the primary payment action, not an alternative tucked below cards.

A full-width primary `lg` button, `--color-ink-800`, label `Pay ₹840 with UPI`, with a 20px
`smartphone` Lucide icon leading. Beneath it, a `--text-micro` `--color-ink-500` row of the
accepted app names as plain text (`GPAY · PHONEPE · PAYTM · BHIM`) — **plain text, not logo
lockups**, so nothing in the payment step breaks the system's typographic discipline or ages
badly. Below that, a secondary `lg` button `Pay by card` and a ghost `Other ways to pay`.

**States.**
- `idle` — as above, with the amount always in the label, tabular.
- `:hover` / `:active` / `:disabled` — inherit the primary button spec.
- **`awaiting`** — the label becomes `Approve in your UPI app`, `aria-busy`, a 16px
  `loader-2` replaces the icon, and a `--font-mono` tabular countdown sits beneath in
  `--text-caption` `--color-ink-500`: `EXPIRES IN 4:52`. The button stays visible and
  disabled — the page must never blank out to a spinner while a user is in another app.
  A ghost `Cancel and go back` appears under the countdown after 20 seconds.
- **`returned-unknown`** — the state a returning user actually hits. Surface
  `--color-info-tint`, `Checking with your bank…`, a hairline indeterminate bar, and no
  action for 8 seconds; then a ghost `Refresh status`.
- **`success`** — the button is replaced in place by a `--color-success-tint` block with a
  20px `check`, `Paid ₹840`, and the confirmation copy naming the next concrete thing with a
  time: `Your box is on Saturday's list. We'll message you Friday night with the exact spot
  and time.`
- **`failed`** — `--color-danger-tint` block, `alert-circle`, and the reassurance first:
  `That didn't go through — nothing's been charged.` Then a primary `Try again` and a ghost
  `Write to us and we'll hold your box`.

**Rules.** The amount appears in the button label in every state that has one. Never show a
raw gateway error code to the user (log it, show the human line). Never auto-retry. Never
place the UPI button below the fold on mobile.

---

## 13. Do / Don't

**Do**
- Set headlines larger, never bolder. Display type is always weight 400.
- Let one hairline do the work of a border, a card and a shadow.
- Put every product on a plain tinted well as a cutout with a contact shadow.
- Use exactly one accent (kiln) and one signal (crumb) per page, sparingly.
- Give every section a `--text-micro` uppercase kicker above its heading.
- Use tabular numerals for every price, count and time.
- Cut to a dark `ink-900` band once or twice per page — and make it the loudest thing there.
- Cap prose at 62ch and let sections breathe at `--section-y`.
- Ship the seal on the home hero, the shop header and the about page. Once per page.
- Keep the blob for the four sanctioned uses.
- Render the tracker's status, hero line, arrival band and route list **before** the map, so
  the page survives the map failing.
- Design the off-air tracker and the sold-out card first — five days out of seven, they *are*
  the site.
- Express proximity as stops and time as a ten-minute band. Never a countdown to arrival.
- Attach the price to the fulfilment lane, on the PDP, before the cart.
- Put real checkable numbers in the spec row: `82% HYDRATION`, `18H FERMENT`, `BAKED 5:40`.
- Keep `Not now` a full-size ghost button beside every opt-in primary.
- Put the amount in the pay button's label in every state.
- Keep the UI English; let Japanese live only as kana under a product name.

**Don't**
- Don't use `#FFFFFF`, `#000000`, `#1B3A5F`, or any Tailwind default palette colour.
- Don't put kiln on a dark band (2.46:1) or crumb on paper as text (2.09:1).
- Don't fill a card, tile or button with a category colour.
- Don't add a shadow ramp, a glass panel, a gradient button, or a purple anything.
- Don't set a display face under 24px or the body sans over 24px.
- Don't animate a counter, a parallax layer, a page transition, or two marquees at once.
- Don't use emoji, filled icon sets, or a stroke width other than 1.5.
- Don't centre a whole page. Don't split a hero 6/6.
- Don't source dark, moody, slate-plated food photography.
- Don't let a component use more than two type registers — ProductCard is the sole exception.
- Don't ship a countdown timer, ticking digits, or a red scarcity treatment on the DropCard.
  The count is the oven; the cut-off carries the pressure and is stated once.
- Don't fabricate a stock count, a bake timestamp, or an ETA. Every number is server-supplied
  or the component does not ship.
- Don't style "catch the van only" or "off air" as an error. They are lanes and schedules,
  not faults.
- Don't put Japanese in nav, buttons, headings or errors — and don't put Kannada in the
  chrome at all.
- Don't romanise a name in place of the kana, and don't invent a reading to fill the slot.
- Don't fire a cold WhatsApp/notification prompt on page load, and don't shrink `Not now`.
- Don't hide, reorder or remove a sold-out product card from the grid.
- Don't make pause or skip destructive-red, or bury them behind a retention flow.
- Don't blank the page to a spinner while the user is away in their UPI app.
- Don't put an adjective in a spec cell, or a logo lockup in the payment step.

---

## 14. Three example section compositions

### 14.1 Home hero — "the loaf and the seal"

Full-bleed `--color-paper-50` with the grain overlay, `--section-y` top and
`--section-y-lg` bottom so the section below sits low on the fold. The container is
`--max-content` on a 12-column grid.

Columns 1–7 hold the type, aligned to the container's left edge and optically hung so the
`H` of the headline aligns with the logo's left edge in the header above. At the top, a
`--text-micro` kicker in kiln: `BENGALURU · 100% EGGLESS · BAKED AT 6 AM`. Beneath it,
`--space-4`, the headline in `--text-display-2xl` — `Bread, brought to you.` — set in
Instrument Serif at 400, leading 0.88, tracking −0.02em, so at 1440px it is 128px and the
two lines almost touch. `--space-6` below, the lead paragraph in `--text-body-lg`
`--color-ink-600` at 46ch: one sentence about the moving bakery and the daily bake.
`--space-8` below, a button row: primary `lg` `Order for today` and ghost `lg`
`Where's the van? →`. Then `--space-12`, a proof lockup pinned to the column's bottom: a
20px `leaf` in `--color-kiln`, a 32px-tall vertical `--border-hairline-strong`, and two
`--text-nano` lines stacked — `100% VEGETARIAN & EGGLESS` / `NO PRESERVATIVES, EVER`.

Columns 8–12 hold a single Milk Shokupan cutout, oversized so it overflows the column into
the gutter on the right and is cropped by the viewport edge — the grid-breaking move.
`--shadow-contact` beneath it. Five or six crumb specks (small cutouts, 8–22px) are scattered
into columns 6–8, deliberately crossing into the type column's negative space so the two
halves interlock rather than sit side by side.

The **ring seal** sits at the boundary of columns 7 and 8, vertically at ~72% of the section
height, overlapping the loaf's lower-left edge — 132px, kiln ring text, slowly rotating.

Entrance: kicker → headline → lead → buttons → proof, staggered 60ms at `--dur-slower` with
`--ease-out`; the loaf fades and rises 24px on the same curve starting 120ms in; the crumbs
fade at 40ms intervals after it; the seal scales `0.92 → 1` last and only then begins to turn.
Under `prefers-reduced-motion` everything renders in place and the seal does not rotate.

### 14.2 Menu grid — "the contact sheet"

Background steps to `--color-paper-100` so the section reads as a distinct surface, and the
`--color-paper-200` wells inside it still separate cleanly. `--section-y` padding, container
`--max-content`.

The header row is a three-part baseline-aligned row on one line at ≥1024: on the left,
`--text-micro` kicker `THE MENU` in kiln above a `--text-display-lg` heading `Today's bake`;
immediately after the heading, on the same baseline, the count in `--font-mono`
`--text-micro` as `( 23 )` — mb-1's serif/mono collision, verbatim. On the right, two
right-aligned `--text-micro` blocks in `--color-ink-500`: `BAKED 5:40 AM · SOLD BY 7 PM` and
`ORDERS CLOSE THURSDAY 8PM`. A `--border-hairline-strong` runs the full container width beneath
the row, `--space-6` below it.

Beneath the rule, the CategoryFilter: a left rail at ≥1024 occupying columns 1–2, with the
grid in columns 3–12; below 1024 the scroll rail sits directly under the rule and the grid
runs full width.

The grid is 4-up at ≥1280 with a tight `--space-3` (12px) gutter, 3-up at 768–1279, 2-up
below, and it deliberately runs close to the container edges so it reads as a contact sheet
rather than as floating cards. Every tile is a ProductCard (§12.5): square `paper-200` well,
cutout at ~58%, then the dotted category label, the name, the kana, the mono spec line, and
the foot row with the italic-serif price and the circular add button. Well tints alternate
by row — odd rows `paper-200`, even rows `paper-100` — giving the grid a faint horizontal
banding that reinforces the rows without a single rule.

Rows reveal on first scroll-entry, staggering the four tiles in a row by 60ms; subsequent
rows do not restagger from zero — each row animates as it enters. Filtering cross-fades the
grid over 220ms `--ease-inout` without re-running the reveal. At the bottom, `--space-12`
below the last row, a centred ghost button `See everything we bake →` sits alone with a
`--border-hairline` above it spanning only the middle 4 columns.

### 14.3 Dark band — "the moving bakery"

The page's rhythm beat, placed between the menu grid and the testimonials. Full-bleed
`--color-ink-900`, `--section-y-lg` (80 → 160px), no radius, edge to edge. No grain — grain
lives on paper only.

At the very top of the band, hard against its upper edge, a **marquee**: a single line in
`--font-display` `--text-display-lg` `--color-paper-0` reading
`the van is out · 6 wards today · milk shokupan sold out at 11 am · the van is out ·`
translating right-to-left over `--dur-marquee` linear, duplicated for a seamless loop, with a
2px `--color-crumb` rule directly beneath it running the full bleed width. It pauses on hover
and on focus-within. It is the only marquee on the page besides the announcement bar, and the
two are never both in view — the announcement bar has scrolled away by this point.

Below it, `--space-16`, the container returns to `--max-content` on a 5/7 split. Columns 1–5
carry: a `--text-nano` kicker in `--color-crumb` `THE MOVING BAKERY`; a heading in
`--text-display-md` `--color-paper-0` — `We drive the bread to your street.`; a paragraph in
`--text-body` `--color-ink-400` at 46ch; and a button pair — primary in the on-dark form
(`--color-paper-0` fill, `--color-ink-900` label) reading `Track the van`, beside a ghost in
`--color-crumb` reading `See today's stops →`.

Columns 7–12 carry the map: `16 / 10`, `--radius-lg`, tiles desaturated and tinted toward
`--color-ink-900` so the map recedes into the band rather than punching a bright hole in it,
the route drawn in `--color-crumb` at 2px (kiln is illegal here at 2.46:1), and the van as a
40px `--radius-blob` marker in `--color-crumb` with an `--color-ink-900` `truck` glyph and a
pulsing ring. Below the map, a single `--text-micro` line in `--color-ink-400`:
`UPDATED 14:01 · REFRESHES EVERY 15 SECONDS`.

Beneath both columns, `--space-12` down, the **stats band** (§12.14) runs inside the same dark
band as a four-cell row divided by `--border-hairline-dark` vertical rules — so the band
closes with the numbers rather than starting a new section. The page then cuts straight back
to `--color-paper-50`, and that hard edge is the whole point of the section.
