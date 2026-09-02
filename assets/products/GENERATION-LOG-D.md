# Generation Log — Batch D (completion run)

Finishes the 5 cutouts left pending by batches B and C. Generated 2026-09-03 (~05:05–05:20 IST)
via ChatGPT image generation in Chrome, one fresh chat per product, reference attached.

Style contract held identical to batches A/B/C: photorealistic, soft warm studio light from the
top-left, subtle contact shadow only, 30 degree three-quarter angle, sharp focus, warm golden
tones, no props / plate / tray / baking paper / text, fully transparent background (PNG with
alpha), product ~80% of frame. v1 = signature hero view, v2 = cut face / cross-section
(for sandos, v2 = whole sando in opened white paper wrap, per the batch-C convention).

## Results

| Slug | Reference used | v1 | v2 | Dims (v1 / v2) | Alpha | Notes |
|---|---|---|---|---|---|---|
| kyoto-curry | `research/site-snapshot/images/kyoto-curry-new.jpg` | done | done | 1351x1164 / 1536x1024 | yes / yes | v1 single square puff-pastry parcel, fork-crimped edges, diagonal scored slits, black sesame + parsley. v2 cut open showing Japanese-style vegetable curry (carrot, potato, peas). Visually verified. |
| calcutta-blaze | `research/site-snapshot/images/calcutta-blaze-new.jpg` | done | done | 1536x1024 / 1536x1024 | yes / yes | v1 single rectangular glossy puff-pastry pocket, crimped ends, laminated side layers, thyme on top. v2 cut open showing spicy paneer cubes in dark tonkatsu sauce with peppers. Visually verified. |
| custard-cream-fruit-sando | `assets/products/custard-cream-fruit-sando-v1.png` (own v1, per batch-C instruction) | (already done in C) | done | 1416x1111 / 1536x1024 | yes / yes | v2 = whole uncut sando in opened white paper wrap, long open side to camera showing pale yellow custard cream with strawberry, mandarin and kiwi. Visually verified. |

**Pending after this run: none.** All 46 product cutouts (23 slugs x v1/v2) are now delivered.

## Verification

- `sips -g hasAlpha` = `yes` on all 5 new files.
- Pixel-level alpha audit (PIL): all four corners `alpha = 0` on every file; opaque
  (alpha >= 250) coverage 47–56% of frame, matching the range of the 41 previously accepted files.
- Every file reopened with the Read tool after download and confirmed to depict the correct product.
- Copied to `web/public/images/products/` and `pnpm images` re-run:
  manifest now reports **50 cutout(s), 27 legacy photo(s)** and lists all 5 new filenames.

## Notes / issues

1. **No rate limit hit this run.** The throttle that blocked batches B and C had cleared.
2. **One regeneration.** The first `custard-cream-fruit-sando-v2` came back as a plain custard
   sando with the fruit hidden inside (the prompt had said "hidden inside"). It was rejected on
   visual comparison with `strawberry-cream-fruit-sando-v2`, which exposes the fruit along the
   open long edge, and regenerated with the open side facing camera. The second output matches
   the sibling composition and is the file that was kept; the rejected image was never installed.
3. **Cross-agent composer collision avoided** using the batch-A method: clear the composer,
   insert via `document.execCommand('insertText', ...)`, screenshot-verify the attachment and
   text, click the send button programmatically, then re-read the sent user message to confirm
   it names this agent's product before waiting. No collision occurred.
4. **Downloads** were fetched from this tab's own DOM as blobs under unique
   `filloD-<slug>-vN.png` names, so no file in `~/Downloads` that this agent did not create was
   ever read or moved.
5. **Transparent-pixel RGB halo** (documented in batch A) is present here too: background pixels
   are genuinely `alpha = 0` but retain warm RGB, so non-alpha-respecting previews composite a
   dark/warm vignette. Not visible in any alpha-respecting renderer. No action needed.
6. **One transient Chrome-extension disconnect** mid-poll during kyoto-curry v1; the tab and
   conversation survived and the run resumed with nothing lost.
