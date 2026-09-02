# Line-art reference notes — Fillo Bakes

Collected 3 Sep 2026 from Pinterest (8 searches: bakery line art illustration · wheat line
drawing minimal · bread sketch ink illustration · japanese bakery illustration line ·
shokupan illustration · anpan illustration line art · vintage bakery engraving ·
bakery van illustration line). 170 pins harvested, 26 kept in `reference/`.

These are **research references only** — mood and stroke study, not shippable art. Several
carry stock watermarks (03, 06, 10, 12, 15, 19). Nothing here goes on the site; the shipped
assets are generated fresh in `web/public/images/lineart/`.

## The stroke style to copy

Anchor references: **14-pastry-collection**, **23-jp-bread-coffee**, **25-jp-baked-goods**,
**01-wheat-single-line**, **20-lineart-set-bakery**.

- **Single-weight ink line.** One uniform stroke thickness across the whole drawing — no
  tapering calligraphic swells, no thick-outline/thin-detail hierarchy. 14 and 20 do this
  perfectly; 04 and 05 do the opposite (full engraving tonal hatch) and are the wrong end
  of the scale for us.
- **~2px at 400px wide** (≈0.5% of the image width). At the 1200px master that is ~6px; at
  the 200–320px sizes we actually place on the page it lands back at 1.5–2px. Thin enough
  to read as a pen mark on paper, thick enough to survive at .12 opacity behind text.
- **No fill, no shading, no tone.** Interiors stay open paper. The only permitted interior
  marks are a handful of short "score" strokes that say what a thing is — the three slashes
  on a loaf top (22), the sesame dots on a bun, the scoring on a croissant. Never hatching
  as shading (avoid 04, 05, 06, 15, 21).
- **Slight hand wobble.** Lines should be drawn, not plotted — see the soft irregularity in
  23 and 25 vs the mechanical CAD feel of 08 and 18. Circles are not perfect circles.
  This is what keeps it in the same family as GAIL's faint wheat sketches (moodboard mb8)
  and the sketched flour bag / loaf / basket of mb7.
- **Open, uncrowded silhouettes.** One subject, generous internal space, centred, no
  ground line, no cast shadow, no background box, no frame.
- **No text, no captions, no logos.** Every set reference here (02, 14, 19, 20, 25) carries
  lettering; we take the drawing style and drop the words.
- **Colour:** one ink colour only, `#2B1B12` (brand ink/chocolate). 14 is the closest match
  in spirit — a single warm terracotta line, no second colour. Never two-tone, never a
  coloured fill behind the line.
- **Background:** fully transparent PNG with alpha. The cream ground comes from the page,
  not from the asset — 14, 19, 23 all bake their paper into the file, which we must not do.

## What subjects work

Strong, and worth generating:
- **Wheat** — single vertical stalk (01, 12) and two crossed stalks (13). The most reusable
  mark we have: section background at low opacity, seal decoration, footer, divider.
- **Loaves** — a square shokupan with two cut slices reads instantly at small size; see the
  simple scored loaf in 22 and the shokupan doodles in 25.
- **Buns** — round anpan with sesame, oval kare pan. 25 and 26 show that a round bun needs
  one contour plus 3–5 marks and nothing more, or it turns into a blob.
- **Croissant** — the crescent in 14 and 20 works because the segments are drawn as separate
  arcs, not as hatching.
- **Fruit sando** — triangle sandwich with a visible fruit cross-section; not present in the
  references, but the flat geometric handling in 20 is the model.
- **Rolling pin + flour bag** — the mb7 "baker market" cue; 07 (bread in a paper bag) is the
  right level of detail for the bag.
- **Van, side view** — 16, 17, 18 are all usable silhouettes. 17 is the loosest and closest
  to our hand-drawn brief; 18 is too mechanical. Keep the sign panel blank (no lettering).
- **Oven with loaves** — 05 and 06 have the shape but far too much tone; take the arch and
  the loaf placement, drop the hatching entirely.
- **Small utility marks** — steam curls, crumb scatter, and a round seal ring with wheat.
  These are not really in the references (they're too small to pin) but they follow the
  same rules and are what actually glues a page together.

Avoid:
- Full engraving / etching with tonal hatch (04, 05, 06, 15, 21) — too heavy, goes muddy at
  .12 opacity and clashes with Instrument Serif.
- Character illustration — bakers, faces, hands (05, 06, 09, 24). Fillo's line art is about
  the product and the craft objects, not mascots.
- Seamless patterns (03, 10) — we want discrete objects we can place, not tiles.
- Anything with a coloured fill, a second ink, a shop-front scene, or built-in lettering.

## File map

| File | Query | Use |
|---|---|---|
| 01-wheat-single-line | wheat line drawing minimal | **anchor** — single-line stalk, exact stroke target |
| 02-bakery-set-handdrawn | bakery line art | set composition, colour too saturated |
| 03-wheat-pattern-dense | wheat line drawing minimal | watermarked; density study only |
| 04-two-loaves-bw | bread sketch ink | wrong end of scale (tonal engraving) |
| 05-baker-rolling-pin | vintage bakery engraving | oven/arch shape cue; hatching to be dropped |
| 06-oldfashioned-bakery | vintage bakery engraving | watermarked; oven scene cue only |
| 07-breads-basket-sketch | bread sketch ink | bag + loaf detail level |
| 08-food-truck-line | bakery van illustration | van proportions; too mechanical |
| 09-bakers-loose-lines | bakery line art | loose-line quality, character subject rejected |
| 10-wheat-ochre-pattern | wheat line drawing minimal | watermarked; pattern only |
| 11-wheat-ink-brush | wheat line drawing minimal | brush weight too variable |
| 12-wheat-line-plant | wheat line drawing minimal | watermarked; stalk structure |
| 13-wheat-two-stalks | wheat line drawing minimal | **anchor** — crossed-pair composition |
| 14-pastry-collection | bakery line art | **anchor** — single-weight terracotta line, closest to brand |
| 15-breads-pastries-ink | bread sketch ink | watermarked; subject inventory only |
| 16-camper-van-line | bakery van illustration | van silhouette |
| 17-van-line | bakery van illustration | **anchor** — loosest, most hand-drawn van |
| 18-food-truck-line-2 | bakery van illustration | van proportions; too mechanical |
| 19-lineart-baking-set | bakery line art | watermarked; clean minimal handling |
| 20-lineart-set-bakery | bakery line art | **anchor** — clean single-weight set |
| 21-loaf-drawing | bread sketch ink | too tonal |
| 22-loaf-bw | bread sketch ink | scoring marks on a loaf, done minimally |
| 23-jp-bread-coffee | japanese bakery illustration line | **anchor** — Japanese line-bread mood |
| 24-jp-breads-bw | japanese bakery illustration line | brush-logo feel; character rejected |
| 25-jp-baked-goods | shokupan illustration | **anchor** — shokupan + bun doodles |
| 26-jp-food-bw | anpan illustration line art | bun/loaf shorthand at tiny size |

## Generation prompt (locked, reuse verbatim per subject)

> Minimal hand-drawn line illustration of [SUBJECT], single continuous thin ink line, no
> shading, no fill, no text, slight hand-drawn wobble, vintage bakery engraving feel,
> centered, on a fully TRANSPARENT background (PNG with alpha), dark chocolate brown line
> #2B1B12.

References attached to the generating chat: 14-pastry-collection, 23-jp-bread-coffee,
01-wheat-single-line.
