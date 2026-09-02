# Product Image Generation Log — Batch C

Generated 2026-09-03 (~02:14–03:12 IST) via ChatGPT image generation in Chrome.
All outputs: PNG with true alpha channel, transparent background, consistent style
(photorealistic, soft warm studio light from top-left, subtle contact shadow, 30° three-quarter
angle, warm golden tones, no props/plate/text, product ~80% of frame).

## Results

| Slug | Reference used | v1 | v2 | Dims (v1 / v2) | Alpha | Notes |
|---|---|---|---|---|---|---|
| umami-melt | `research/site-snapshot/images/umami.png` | done | done | 1536x1024 / 1536x1024 | yes / yes | v1 whole roll, v2 cut face showing mushroom + cheese filling |
| korean-whisper | `research/site-snapshot/images/koreanwhisper.png` | done | done | 1536x1024 / 1536x1024 | yes / yes | v1 whole sesame-topped triangular turnover, v2 cut face showing spring onion + cheese |
| orchard-melt | `research/site-snapshot/images/orchard-melt-new.jpg` | done | done | 1536x1024 / 1536x1024 | yes / yes | v1 whole powdered-sugar strudel, v2 halves showing spiced apple compote |
| mawa-melt | `research/site-snapshot/images/mawa-melt.png` | done | done | 1536x1024 / 1536x1024 | yes / yes | v1 whole roll with pistachio + icing sugar, v2 cut face showing mawa crumble |
| fruit-sando | `research/site-snapshot/images/WhatsApp_20Image_202026-05-04_20at_204.12.10_20PM-935N0fpQtb7KZUe6d5OqqSNvMq29Xo.jpeg` (real Fillo tropical sando photo) | done | done | 1234x1275 / 1536x1024 | yes / yes | v1 diagonal cut halves (mango, mandarin, purple sweet potato in whipped cream); v2 whole sando in opened paper wrap |
| strawberry-cream-fruit-sando | `research/site-snapshot/images/WhatsApp_20Image_202026-05-12_20at_205.37.10_20PM-CklyWLahm8OcGWFf8zljIYUrxbPjWU.jpeg` (real Fillo strawberry-cream sando photo) | done | done | 1312x1199 / 1536x1024 | yes / yes | v1 diagonal cut halves (pink strawberry cream, strawberry, mandarin, kiwi); v2 in opened paper wrap |
| custard-cream-fruit-sando | `research/site-snapshot/images/image-8cDaZxfLUs2cOOVbIKMJTWNFqy97oK.png` (fruit-sando structure ref; no dedicated site photo exists) | done | **PENDING** | 1416x1111 / — | yes / — | v1 diagonal cut halves with pale yellow custard cream + strawberry/mandarin/kiwi. v2 blocked by ChatGPT rate limit |

## Pending

- **`custard-cream-fruit-sando-v2.png`** — not generated. ChatGPT returned "Too many requests / You're making
  requests too quickly" at ~03:08 IST (three agents generating in parallel on one account). Per instruction,
  generation was stopped rather than waited out. v1 had already been produced and was downloaded successfully
  after the limit appeared (download is not a generation request).
  To finish later, open a new chat, attach the same reference, and use the standard v2 prompt:
  *"Same product and style, but now show the whole uncut Custard Cream Fruit Sando lying in its opened white
  paper wrap, three-quarter view from above… transparent background PNG with alpha."*

## Reference notes

- No dedicated site photo exists for the custard-cream sando. `image-8cDaZxfLUs2cOOVbIKMJTWNFqy97oK.png`
  (a fruit-sando triple-triangle shot) was used for structure, with the custard filling described in the prompt.
- `image-5Av4…png` is an Instagram logo and `image-UPwn2…png` is a green veg-mark icon — neither is product imagery.
- `image-DRTClrWRMOyXOL9nQ1YVURbh3w8nyV.png` is a custard-filled bun (not a sando); not used.

## Verification

Every PNG above was reopened and visually inspected after download; each depicts the correct product.
Alpha confirmed for all files via `sips -g hasAlpha` (all `yes`).

## Style convention (for consistency with batches A and B)

- v1 = the product's signature hero view (whole pastry for pies/strudels; diagonal cut face for sandos).
- v2 = the complementary view (cut face / cross-section for pastries; whole sando in opened paper wrap for sandos).
