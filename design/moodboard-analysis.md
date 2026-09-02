# Fillo Bakes — Mood Board Analysis

Source: `moodboard/*.webp` (8 client-selected references), `assets/logo/fillo-bakes-logo.png`,
`research/current-site-journey.md`, `research/site-snapshot/pages/home.html`.

All hex values below were sampled from the actual pixels (Pillow, dominant-colour and
saturation-filtered passes), not eyeballed. Contrast ratios are computed WCAG 2.1.

---

## 0. The logo is the fixed point

| Role | Hex | Where sampled |
|---|---|---|
| Blob / mark | **`#023D5D`** | 10,496 opaque px in `fillo-logo-transparent.png` — the single flat fill |
| Wordmark | **`#FFFDE8`** | 66,181 opaque px — a pale butter cream, very slightly yellow |

Contrast of wordmark on mark: **11.2:1**.

Shape: a **rotated superellipse / soft blob** (a leaf-squircle), not a circle and not a
rounded rect. Wordmark is a **soft geometric sans**, near-monolinear, generous apertures,
single-storey `a`-feel, with a distinctive curved-tail `f`. Lowercase throughout.

**Critical finding — the live site is off-brand.** `home.html` uses `[#1B3A5F]` (82 uses) as
"navy" and `[#F8F4E3]` as cream, plus stray `yellow-400`/`yellow-300` utilities. `#1B3A5F` is
*not* the logo navy — it is lighter, bluer and more purple than `#023D5D`. The rebuild must
correct this. `#023D5D` is non-negotiable.

---

## 1. `0723fd870c2c70802d7c39ebebb97b6b.webp` — "Hasbar" menu index

**Layout.** A single full-width menu index, no hero. Thin top nav (4 links, underlined,
left-aligned) → masthead → 4-column product grid → full-bleed near-black footer band. The
grid has no page-level side padding beyond ~45px; it runs almost edge to edge. Gutters are
tight (~8–10px), so the grid reads as a *contact sheet*, not as cards.

**Typography.** Masthead "Menu" in a high-contrast transitional serif at ~64px, regular
weight, tight tracking, immediately followed by a mono count `( 12 )` at ~11px with wide
letterspacing — a deliberate serif/mono collision. Product names are **all-caps serif**,
~15px, tracking ~0.01em. Descriptors are **monospace**, ~9px, uppercase-ish, bullet-separated
(`Freshly baked • Buttery • Flaky layers`). Prices are **italic serif** (`$4.90`). Footer band:
huge geometric grotesk caps `LET'S BAKE!` at ~44px, weight 700+, and a `©26` lockup.
Four distinct type registers on one page, each doing one job.

**Palette.** Paper `#FAF9F5`; product wells `#EDECE8` (a cool-warm neutral grey, ~1.5%
darker than the paper); band `#131313`; the only chroma in the entire page is the food itself
(crust golds cluster at `#C07028`).

**Photography.** Every product is a **cutout on a plain well** — no plates, no props, no
tablecloth, no depth of field. Lit flat-frontal, small soft contact shadow. Fills ~55% of the
tile, centred, generous air on all four sides.

**Cards.** Zero radius. No border. No shadow. Card = image well + text below, left-aligned,
outside the well. A small square outlined chip (`H/C`) sits inset in one tile's top-right.

**Rhythm.** Light paper for 90% of the height, then one hard cut to a near-black band. That
cut is the only "event" on the page.

**Take:** the grid model, the mono descriptor line, the price-in-italic, the tinted well,
the four type registers, the single dark band.

---

## 2. `3219571e8562656ea8ecc3454f0bf71d.webp` — "Mark.One" bakery landing

**Layout.** Two stacked artboards on a `#FFE9D4` peach presentation background. Hero is
split 50/50: type left, product right. Sections alternate between full-width white and
full-bleed black. Product rails are 4-up.

**Typography.** Headline `Your Daily Dose of Freshness` in an **ornate high-contrast display
serif** with exaggerated thin/thick modulation and swash-ish `y`/`f` — ~54px, regular weight,
tight leading (~0.95). Section headings (`Our Bestsellers`, `Tradition Meets Taste`) reuse
the same face at ~34px. Body is a plain neutral sans, ~13px/1.6. Card names ~14px sans.
The serif does *all* the character work; the sans is deliberately silent.

**Palette.** Card surface `#FBFAF6`, page white `#FFFFFF`, presentation peach `#FFE9D4`,
buttons and the dark band `#000000`, star rating `#F5B400`-ish.

**Photography.** Cutouts again — muffins spilling from a kraft paper bag, croissants with a
tiny motion "pop" (three ink dashes drawn beside one). Rendered with a real drop shadow so
they float off the surface. The dark cookie band uses the same cutout treatment (cookies
mid-air on black).

**Cards.** ~10px radius, `#FFFFFF` surface, near-invisible 1px hairline, faint diffuse
shadow. One card in each rail is lifted (raised shadow + slight scale) as the hover state.

**Buttons.** Black **pill** with white text, ~13px, small chevron. On the dark band, the
price is inlined into the button: `$3.50 | Shop now ›`.

**Motion cue.** A **circular rotating badge** — `SHOP NOW • SHOP NOW •` set on a ring around
a black circle with a ↗ arrow. Explicit motion device.

**Take:** the rotating seal, product cutouts with real shadows, black pill CTA, the dark
full-bleed band used as a mid-page interruption, one-serif-does-everything.

---

## 3. `4bea3ca839d3acd1a7b085332e6bb5d4.webp` — bakery interior, warm sepia

**Layout.** A single full-bleed photograph with an overlaid text column at 20% width, and a
short icon+label list pinned bottom-left. No chrome, no card, no panel — type sits directly
on the image.

**Typography.** Body paragraph in a plain neutral sans, ~15px/1.45, white. The headline
`Ready to Taste The Difference?` is a **casual retro script** (brush/signature, connected,
heavy contrast, slight left slant) at ~44px, two lines, tightly stacked. Feature list is
~15px sans with a thin line icon at ~18px, ~14px gap.

**Palette.** The whole frame is graded to a warm sepia: mid-tones `#583010`–`#704018`, high
lights blown to warm cream, blacks lifted (never true black). The only clean colour is the
red cap `#C8302A`-ish and the plant green — both *in* the photo, not in the UI.

**Photography — the key lesson.** This is **not** dark moody plating. It is a bright,
daylight, over-the-shoulder documentary frame of a person working: hands, tray, glass case,
plants, tattoos, a striped tank. Real place, real person, natural window light, warm white
balance, shallow-ish but not artificial depth. Nothing is styled on slate or dark wood.

**Take:** lifestyle photography must be warm, bright, human and in-the-room. Text over
photo is white-on-warm with no scrim box — the grade does the work. Thin line icons at
small size next to short factual labels.

---

## 4. `51926f401c50fc40a4ffbf5e1859fa4f.webp` — "Ovenly Atelier"

**Layout.** Full desktop page in two columns of the same artboard. Hero is a **contained**
full-bleed photo with a **wave-cut bottom edge** (a soft S-curve mask) that dissolves into
the paper. Below: centred section headers, 3-up card rails, a 4-column stats row separated
by thin vertical rules, a 4-up "why" row of tinted tiles, and a right-aligned price list
with dot-leader rules.

**Typography.** Hero `Crafted with warmth, butter & love.` in an **italic high-contrast
serif**, ~46px, leading ~1.15, two lines. Eyebrow `Freshly baked every sunrise` in the same
serif italic at ~13px, in a muted tan. Section heads in the same serif upright/italic mix at
~26px, centred. Kicker labels (`FEATURED FAVORITES`, `ABOUT OVENLY`, `SIGNATURE MENU`) are
tiny all-caps sans, ~9px, tracking ~0.16em, in a desaturated tan — a real letterspaced
eyebrow system. Stats numbers `10+ 5K+ 100% 1K+` in serif ~22px over ~8px tracked caps labels.

**Palette.** Paper `#FCF3EC` (warm, peach-leaning); the alternating section band and the
tinted well `#E8DBCB`; a middle tone `#F1E8D7`; the pill CTA `Order Now` in `#E8DBCB`-to-tan
`#D5B495`; hero photo blacks `#0D0805`.

**Cards.** ~8px radius, tinted `#FCF3EC` on the darker band (and vice versa), 1px hairline,
no shadow. Card image is a **photograph cropped to the card top**, not a cutout — this image
is the one exception that permits real bakery-scene photography inside a card.

**Devices.** A round `EST. 1998 / HANDMADE DAILY` **stamp** overlapping the hero's top-right
corner, cream fill, breaking the photo edge. A ghosted wheat-sheaf line illustration bleeding
off the right edge of a text section at very low opacity.

**Take:** the wave/organic edge between photo and paper, the round stamp overlapping the
hero, the letterspaced tan kicker system, tinted-band section alternation, the stats row with
vertical hairline dividers, the dot-leader price list.

---

## 5. `b32e1e189506dcd13f51dd208ceae4e3.webp` — "Bakeria" hero

**The single most instructive image in the set.**

**Layout.** The whole page sits **inset inside a near-black `#1A1A1A` frame** (~40px). Header
is one row: mark + wordmark left, 6 nav links centre with an underline on the active item,
then search, cart-with-count-badge, and a filled `Order now` pill right. Hero is 45/55: type
left, two cutout croissants right with crumbs scattered between them into the type column's
negative space. Nothing is boxed.

**Typography.** `Freshly Baked` in a **very high-contrast serif at ~92px, regular weight**,
leading ~0.92, tracking ~-0.01em — hairline thins, sharp bracketed serifs, a ball terminal
on the `y`, tall ascenders. Eyebrow `Baked fresh. Made with love.` in a light script at
~19px in a muted tan. Body ~16px/1.65 neutral sans, max ~46ch. Nav ~12px caps, tracking
~0.08em. Bottom-left proof line `REAL INGREDIENTS. / BETTER EVERYDAY.` in ~11px caps,
tracking ~0.1em, separated from a wheat glyph by a **vertical hairline rule**.

**Palette (sampled).** Paper `#F4EFE9` / `#F6EFE7`; ink `#2F1B12` (a dark chocolate, *not*
black); CTA `#9E3B26` — a brick / terracotta; frame `#1A1A1A`; the tan of the script eyebrow
and the seal ring sit around `#C8A36F`.

**Buttons.** Primary = solid `#9E3B26` **rounded-rect (~8px)**, cream label ~17px medium,
with a `→` and a real gap. That is a rounded rect, not a pill — contrast with images 2 and 6.

**Devices.** Bottom-right **circular seal**: `FRESH INGREDIENTS · BETTER EVERYDAY` set on a
ring around a small wheat glyph, drawn in 1px tan, no fill. Third seal in the set.

**Cart.** A small numeric badge `0` on the bag icon, offset top-right.

**Take:** hairline display serif at extreme size, cutouts + scattered crumbs invading the
type column, brick accent, the inset dark frame, the ringed seal, the hairline-separated
proof lockup, the header pattern almost exactly as Fillo needs it.

---

## 6. `ba3d0f6c4f6f321eaa577f5eb4e5d65c.webp` — "Oven & Co." croissant hero

**Layout.** One full-bleed panel, inset ~35px in a light grey presentation field, ~12px
radius on the panel. Nav is a single row: 3 links left, centred wordmark, location dropdown
+ 3 social glyphs right, with a **full-width 1px hairline** under it. Everything else is
centred on the vertical axis.

**Typography.** `— CROISSANT —` in a **huge geometric grotesk, all caps, ~86px, weight
~800, tracking ~-0.01em, pure white**, flanked by two em-dashes. `Freshly Baked` in a bold
rust script **overlapping the grotesk's baseline by ~40%** — the two faces deliberately
collide. Above it, `OPEN EVERYDAY 9AM - 8PM` in italic caps sans ~16px, tracking ~0.03em.
Bottom-left `100% Handmade & Organic` bold sans ~22px over a 2-line ~14px paragraph.

**Palette.** The panel is a **vertical caramel gradient** from `#C8A36F` at the top down into
the photograph's own crust browns — the background *is* the food, extended upward. Type is
white and rust `#8B3A18`-ish. No paper, no cards, no chroma outside the bake.

**Buttons.** Two **pills** side by side, ~46px tall: filled white/cream with dark label, and
ghost (1px cream border, transparent fill, cream label). This is the clearest primary+ghost
pair in the set.

**Photography.** Extreme macro of a single croissant, filling the bottom 60%, so close that
lamination, sesame and blistering are the texture of the page. Warm, glowing, top-lit.

**Take:** one-word display type on photo, the primary+ghost pill pair on an image, hairline
under the nav, gradient-from-the-food background, macro crop as texture.

---

## 7. `original-55ce5e5b520ff6976ab53dfb2fee870e.webp` — "baker market"

**Layout.** Three overlapping artboards. Very generous whitespace — the hero bread occupies
~25% of the frame and everything else is air. Content column is narrow and centred; asymmetry
comes from a **vertically rotated label** (`Get in touch with us`, 90°, with a short rule)
pinned to the left margin.

**Typography.** `Fresh bakery every day` in a **light, high-contrast serif** at ~34px,
centred, tracking ~0. Section heads `How we work`, `Products` in the same serif ~26px,
left-aligned, each followed by a **short horizontal rule** as a terminator. Body ~10px sans.
Process numbers `01/ 02/ 03/` in a large light serif with a slash, in a pale grey — used as
decoration more than as data.

**Palette.** `#F7F7F7` near-white with a fine **paper grain texture** visible across the
whole surface; ink is a soft near-black; the only accent is a **saturated yellow** — a small
square bag-icon chip `#E8C800`-ish and a pale yellow button fill with an offset shadow-block.

**Photography.** Cutout bread floating on the textured white with a soft cast shadow beneath
— no well, no tile. Alongside it: hand-drawn **line illustrations** (flour sack, loaf, basket)
in 1px ink, used for the process steps, plus a curved dashed connector between them.

**Take:** paper grain, cutouts floating shadow-only, rules as section terminators, the
rotated marginal label, line illustrations for process/how-it-works, and the permission for
one small saturated accent chip.

---

## 8. `original-8e11fd5dda7474d8c68e4acb3762cfe5.webp` — GAIL's

**Layout.** Two artboards on a greige field. Hero split 45/55, type left. Product rail is
4-up with `‹ ›` arrows top-right of the rail and a **partial progress rule** under it (a red
segment on a hairline track). Sections separated by generous vertical air and hairlines. Full
red footer band with 3 link columns.

**Typography.** Headline `FROM OUR / OVEN TO YOUR / DOOR` in **all-caps sans, ~28px, weight
~600, leading ~1.2, tracking ~0.01em** — this is the one reference that runs a *sans* headline.
Section heads `WHAT WE LOVE / TO EAT`, `OUR STORY`, `BAKERY MENU`, `THE BAKER'S PAPER` all
in the same caps sans. Above each: a tiny red all-caps kicker (`OUR PRODUCTS`, `ABOUT US`,
`OUR BAKERIES`, `WINTER 2021`, `OUR NEWSLETTER`) at ~8px, tracking ~0.14em. Product names
~9px caps; prices ~9px in **red**. Body ~8px/1.5.

**Palette (sampled).** Paper `#F0EFEA` (greige, cooler than the other refs); tinted band
`#DEDACE`; secondary tint `#E5E1D5`; ink `#3E2521` (warm dark brown); accent **`#D12030`** —
8,136 sampled pixels, used for the wordmark, kicker labels, prices, the primary button, the
rail progress bar, the map pins and the entire footer band. **One accent, everywhere,
never a second one.**

**Cards.** Square-ish tiles, ~4px radius, photo on a light tint, name + price below, and a
**small circular outline icon-button (bag) at the bottom-right of the meta block** — the
add-to-cart affordance is a 28px circle, not a full-width button.

**Texture.** Very large, very pale **line illustrations of wheat, buns and pastries** ghosted
into the background at ~4% opacity, bleeding off the edges. This is the page's only
"decoration" and it never competes with content.

**Devices.** A small "Valentines Baking" **promo strip** — a tiny product photo on a tint,
a caps label, and a red circular `›` — a compact cross-sell pattern worth stealing for
Fillo+/subscription.

**Take:** one red accent applied ruthlessly, ghosted line-art background texture, the
circular add-button on cards, the tiny letterspaced kicker over every section head, the
coloured full-bleed footer band, the rail progress rule.

---

## Synthesis — the 7 traits the client is asking for

Counted across the 8 references, these are the traits that recur. Everything in `DESIGN.md`
is derived from this list.

**1. Warm paper, never white — with a tinted second surface.**
8/8 images sit on an off-white with warmth in it: `#FAF9F5`, `#FBFAF6`, `#FCF3EC`, `#F4EFE9`,
`#F7F7F7`, `#F0EFEA`. And 5/8 introduce a *second, one-step-darker tint* (`#EDECE8`,
`#E8DBCB`, `#DEDACE`) used for image wells and alternating bands. So: a paper scale, not a
paper colour. Two of the eight also add grain/texture (mb-7 explicitly, mb-1 subtly).

**2. An editorial serif carries the whole voice; the sans is deliberately silent.**
6/8 use a high-contrast serif for display (mb-1, 2, 4, 5, 7 and mb-8's serif-adjacent caps),
set **large, at regular weight, with tight leading**, and paired with a plain, quiet
neutral sans for body at ~15–16px/1.6. The character comes from *scale and contrast*, never
from a bold weight. mb-5 is the extreme case: 92px at weight 400.

**3. Product cutouts on plain grounds — no plates, no styling, no dark plating.**
5/8 (mb-1, 2, 5, 7, 8) show products cut out with the background removed and placed either
on a flat tinted well or floating on paper with a soft contact shadow. Where a real
photograph is used (mb-3, mb-4, mb-6) it is **bright, warm, daylit, human or macro** —
never dark, never slate/moody plating.

**4. A round stamp/seal is a shared brand device.**
3/8 use one: mb-2 (`SHOP NOW •` rotating ring), mb-4 (`EST. 1998 / HANDMADE DAILY` filled
stamp overlapping the hero), mb-5 (`FRESH INGREDIENTS · BETTER EVERYDAY` outline ring around
a wheat glyph). This is the client asking for a seal, and it maps perfectly onto Fillo's
"baked today" and "100% eggless" claims.

**5. A dark full-bleed band as the page's rhythm section.**
5/8 (mb-1 footer, mb-2 cookie band + footer, mb-4 hero, mb-6 whole panel, mb-8 red footer)
cut hard from paper into one saturated or near-black full-bleed block. It appears once or
twice per page, never more, and it is where the loudest type lives.

**6. Hairlines and letterspaced micro-caps do all the structuring.**
7/8 rely on 1px rules (under the nav in mb-6, between stats in mb-4, as section terminators
in mb-7, under rails in mb-8) and on **tiny all-caps or mono labels at 9–11px with 0.1–0.16em
tracking** (mb-1 mono descriptors, mb-4 tan kickers, mb-5 proof line, mb-8 red kickers).
There are almost no boxes, badges-with-fills, or heavy borders anywhere in the set.

**7. Generous, asymmetric whitespace; content never fills its container.**
mb-7 is the extreme (the hero product is 25% of the frame). Even the dense mb-1 grid leaves
~45% air inside each tile. Type columns cap at ~46–60ch. Section padding is large and
vertical rhythm is loose. Asymmetry is created by off-axis placement and marginal rotated
labels, not by decorative shapes.

### Secondary traits worth carrying
- **One accent, applied everywhere** (mb-8's `#D12030` is the model) rather than a palette
  of five.
- **Cards are quiet**: 0–10px radius, hairline or nothing, shadow only on hover.
- **Two-tier buttons**: one filled + one ghost/outline, both with the same geometry
  (mb-6 pills, mb-5 rounded rects). Fillo needs a third: ghost/text.
- **Add-to-cart is small and circular** on the card (mb-8), not a full-width bar.
- **Ghosted line illustrations** as background texture at very low opacity (mb-8, mb-4).
- **Mono for specs**, and italic serif for prices (mb-1).

---

## What to reject

- **Purple/violet gradients, glassmorphism, blur panels, neon.** Nothing in the set is
  synthetic. Every colour in all 8 images is either paper, ink, or something that came out of
  an oven.
- **Dark moody food photography.** mb-3 is explicitly the opposite: bright, daylit, a real
  person in a real shop. Do not shoot or source on slate, dark wood or black marble.
- **Bold-weight display type.** Only mb-6 goes heavy, and only because it is one word on a
  photograph. Everywhere else display is weight 400 at large size. Never set a headline in
  700 as a substitute for setting it larger.
- **Full-bleed drop shadows / floaty card stacks / heavy elevation.** 6/8 use no shadow at
  all on UI; shadow appears only under cutout products (a physical contact shadow) and on a
  single hover-lifted card in mb-2.
- **Rounded-everything.** Radii in the set are 0, 4, 8, 10 and 12px. There is not one 24px
  "friendly" card. The pill is reserved for buttons only.
- **The current site's `#1B3A5F` fake navy, `#F8F4E3` cream, and stray `yellow-400`/
  `yellow-300` utilities.** Replace with `#023D5D`, the paper scale, and one governed
  golden signal token.
- **Emoji as UI** (the current site's `✨` in the hero and `🚚` on the van button).
  Use Lucide line icons at 1.5px stroke.
- **Multi-column footers of blue links.** mb-1, mb-6 and mb-8 all put the footer in a single
  full-bleed coloured band with 3 short columns and one oversized statement line.
- **Centre-everything layouts.** Only mb-6 and parts of mb-4 centre; the strongest pages
  (mb-1, mb-5, mb-8) are left-aligned with an asymmetric split.
- **A second accent colour.** One accent, one signal. Category colours are hints, not fills.
- **Stock "AI bakery" imagery of impossibly perfect bread on a rustic board.** The client
  picked a documentary frame (mb-3) and clean cutouts (mb-1/5/7). Those are the two modes.
