# Line art — Fillo Bakes

Hand-drawn single-weight line illustrations, generated 3 Sep 2026 to the style locked in
`assets/lineart/REFERENCE-NOTES.md` (Pinterest research, 26 reference pins in
`assets/lineart/reference/`). Direction follows `design/DESIGN-v2.md` and the moodboard
cues mb8 (faint wheat/bread sketches behind content) and mb7 (sketched flour bag, loaf,
basket).

**Every file is a transparent PNG with a real alpha channel** — the cream ground comes from
the page, never from the asset. Two colourways per subject:

- `<name>.png` — line in `--color-ink` `#2B1B12`. Use on paper, paper-2, peach, card, well.
- `<name>-light.png` — line in `--color-on-choc` `#F3EADF`. Use **only** on the dark band
  (`--color-choc` `#2B1B12`) and the footer if it ever goes dark.

Long side capped at 1200px, trimmed to content with 4% padding, so `object-fit` and
percentage widths behave predictably. Untrimmed 1024/1536 masters are kept in
`assets/lineart/lineart-*.png`.

## Usage rules

- Line art is decoration, never a product image. Product cutouts stay photographic.
- Background use: `opacity: .12`, ink colourway, behind a section — never behind body copy
  at a higher opacity, and never more than one per section.
- Foreground use (seal, footer mark, divider): full opacity, 24–120px.
- Never tint them to terracotta. The accent stays reserved for buttons and links.
- Mark them `aria-hidden="true"` / `alt=""` — they carry no information.
- They are large PNGs; lazy-load everything except a hero-corner mark.

## Files

| File | Size | Bytes | Suggested placement |
|---|---|---|---|
| `wheat-stalk.png` / `-light` | 276×1200 | 114 / 119 KB | **Hero corner** — single stalk bottom-left of the home hero, ~180px tall, opacity .18. Also the divider mark between Story and Why-return. |
| `wheat-stalk-v2.png` / `-light` | 301×1200 | 96 / 103 KB | Alternate stalk so repeated placements are not identical — mirror of the hero mark, used in the footer left column. |
| `wheat-pair.png` / `-light` | 587×1200 | 242 / 256 KB | **Seal decoration** — the two crossed stalks sit inside/behind the 88px "100% eggless · baked daily" seal on the hero and PDP. |
| `wheat-pair-v2.png` / `-light` | 1200×813 | 322 / 329 KB | Wide tied-sheaf variant. **Footer** centre mark above the wordmark, ~140px wide. |
| `shokupan-loaf.png` / `-light` | 1200×813 | 265 / 279 KB | **Section background** behind Bestsellers, right edge, ~520px, opacity .12. Also the Breads category tile mark. |
| `shokupan-loaf-v2.png` / `-light` | 1065×824 | 207 KB | Front-on loaf with one slice — **Standing Order card** ("Your bread, every week.") on the Come-back band, ~120px. |
| `anpan-bun.png` / `-light` | 1041×905 | 146 KB | **An pan category tile** mark, and the empty-state / sold-out placeholder in the shop grid. |
| `karepan.png` / `-light` | 1200×800 | 541 / 544 KB | **Kare pan category tile** mark. Heaviest file (dense crumb texture) — lazy-load, or downscale to 600px if it is only used at tile size. |
| `fruit-sando.png` / `-light` | 852×1200 | 364 / 382 KB | **Fruit sandos category tile** mark; also the Journal card mark on the what-is-shokupan / sando posts. |
| `croissant.png` / `-light` | 1200×757 | 297 / 311 KB | **Pies and strudels / pastry** tile mark, and a section background at opacity .12 behind the Journal + newsletter block. |
| `rolling-pin-and-flour-bag.png` / `-light` | 1200×958 | 306 / 326 KB | **Our story split** (peach section) — background mark behind the tall photo, ~420px, opacity .12. The mb7 "baker market" cue. |
| `bakery-van.png` / `-light` | 1200×872 | 332 / 356 KB | **The Van page** hero mark and the "Track the van →" link on the dark band — use `bakery-van-light.png` there. Sign board is deliberately blank. |
| `oven-with-loaves.png` / `-light` | 1200×942 | 406 / 425 KB | **Why people return** section background ("Fresh this morning" / "Small batches"), ~480px, opacity .12. |
| `steam-swirls.png` / `-light` | 612×1200 | 121 / 127 KB | Small accent above a hot item — PDP "baked this morning" line, the freshness item in the trust strip, ~40px. |
| `crumbs-scatter.png` / `-light` | 1146×778 | 67 KB | Scattered crumbs around the hero cutout (an alternative to the CSS crumb dots), and under the cart-drawer total. Lightest file. |
| `stamp-ring.png` / `-light` | 1187×1189 | 209 / 208 KB | **Seal** — the 88px round seal ring on the hero and PDP; set the two lines of 10px caps inside the empty centre in HTML, rotated −8deg. |
| `sakura-sprig.png` / `-light` | 951×1122 | 212 / 212 KB | **Our story page header** — the sprig sits top-right of the story hero, ~200px, opacity .18; and the **order-confirmation** page as the small mark above "Thank you — we're baking.", ~72px at full opacity. |
| `sparrow-branch.png` / `-light` | 1068×940 | 187 / 187 KB | **Journal and Guides index headers** — perched at the end of the page title rule, ~120px at full opacity. Also the Journal card mark on posts with no photo. |
| `seigaiha-tile.png` / `-light` | 644×426 | 122 / 122 KB | **Repeating texture, not a motif** — `background-repeat: repeat` at `opacity: .06` behind the Standing Order band and the account header. Set `background-size` (≈320px wide) to control scale; do not stretch it. |

## Dark band

The dark band is the only surface that takes the `-light` files. Recommended pairing for the
"Order by 8pm" band: `bakery-van-light.png` at the right edge and `wheat-pair-v2-light.png`
faint at the left, both around opacity .16 — the product cutouts stay photographic per the
spec, so keep the line art behind them.

## Pending

Nothing pending. 19 subjects generated (13 base + 3 variants + 3 later additions), each
verified to carry a real alpha channel with a fully transparent ground — no
background-removal pass was needed on any file. 38 PNGs.

### Note on `seigaiha-tile`

The three later additions (`sakura-sprig`, `sparrow-branch`, `seigaiha-tile`) were generated
3 Sep 2026 from the same locked prompt with `wheat-pair.png` and `bakery-van.png` attached as
style references, so they carry the identical single-weight line.

`seigaiha-tile` is the one asset that breaks two of the house rules, deliberately:

- It is a **repeating pattern**, which `REFERENCE-NOTES.md` otherwise rules out. It is used
  only as a faint ground texture at .06, never as a placed object, so the "discrete objects
  we can place" rule still holds for every other file.
- It is **not square**. 644×426 is the pattern's true repeat — two horizontal wave periods by
  one vertical row-pair. The generator returned a 1254×1254 image with a transparent margin
  on all four sides, which would have shown a gap line on every tile boundary, so it was
  cropped to the repeat rather than padded to a square. Squaring it now would need either a
  1.5× vertical stretch (which flattens the arcs) or a crop that reopens the seam. Tiling was
  verified by compositing 2×2 copies and inspecting both seams; neither is visible.
