# Product Cutout Generation Log — Agent A

Scope: 4 Breads + 4 An Pan (8 slugs, 16 files). Other slugs handled by other agents.

Tool: ChatGPT image generation (chatgpt.com), one fresh chat per product, reference photo
attached from `research/site-snapshot/images/`. Every reference was viewed before prompting
so the prompt describes the real shape, colour and toppings.

## Style contract (identical across all 16 files)

> Using the attached photo as the exact reference for this product, generate a clean product
> cutout of **[PRODUCT]**: [1-line description of shape / colour / visible features].
> Photorealistic, soft warm studio light from the top-left, subtle contact shadow only,
> 30 degree three-quarter angle, sharp focus, warm golden tones, no props, no plate, no text.
> Fully TRANSPARENT background (PNG with alpha channel, no white backdrop, no checkerboard).
> The product fills about 80% of the frame.

`-v2` is always: *same product, same style, cut face / cross-section visible, transparent PNG.*

## Results

| Slug | Reference file | v1 | v2 | Dimensions (v1 / v2) | Alpha | Notes |
|---|---|---|---|---|---|---|
| milk-shokupan | milk-shokupan-new.PNG | ok | ok | 1536×1024 / 1536×1024 | yes / yes | 4-hump pullman loaf; v2 = loaf + two cut slices |
| japanese-marble-bread | marble-bread.jpeg | ok | ok | 1536×1024 / 1536×1024 | yes / yes | v1 loaf with swirl end exposed; v2 = slices, full spiral cross-section |
| blue-pea-bread | blue-pea-bread.jpg | ok | ok | 1310×1200 / 1536×1024 | yes / yes | Natural slate-blue + cream swirl crumb; "no hands" added (reference is hand-held) |
| chocolate-shokupan | chocolate-bread.jpeg | ok | ok | 1536×1024 / 1536×1024 | yes / yes | Cocoa crust + choc chips; v2 = chip-studded crumb slices |
| strawberry-anpan | strawberry-an-pan.jpg | ok | ok | 1341×1173 / 1536×1024 | yes / yes | Pink cream band + 3 strawberry slices, icing sugar |
| custard-anpan | custard-pan.jpeg | ok | ok | 1536×1024 / 1536×1024 | yes / yes | Pale yellow custard band, heavy icing sugar |
| choco-anpan | choco-la.jpg | ok | ok | 1536×1024 / 1536×1024 | yes / yes | Dark cocoa bun + glossy chocolate cream band |
| pistachio-anpan | pistachio-an.png | ok | ok | 1536×1024 / 1536×1024 | yes / yes | Pale green pistachio cream band; "no tray / no baking paper" added |

**Pending: none.** All 16 files delivered.

## Verification

Every file checked with `sips` (hasAlpha) and a pixel-level alpha audit:

- All four corners have `alpha = 0` on all 16 files — background is genuinely transparent,
  not a white or checkerboard fill.
- Opaque subject coverage ranges 47–75 % of the frame (target ≈ 80 % of the *width*; the
  frames are landscape so area coverage is naturally lower).
- Note for downstream use: transparent pixels retain warm RGB values under `alpha = 0`.
  Some image viewers composite this as a warm "halo". It is not visible in any
  alpha-respecting renderer (browser, Figma, Photoshop). No action needed.

## Issues encountered

1. **No rate limiting hit.** No throttle message appeared at any point.
2. **Cross-tab composer contamination (important for the coordinator).** ChatGPT syncs the
   *new-chat* composer draft across every tab of the same account. With three agents typing
   into `chatgpt.com/` simultaneously, drafts overwrote each other: on two occasions another
   agent's prompt (e.g. a "KOREAN WHISPER" prompt) appeared in this tab's composer, and on
   several occasions this tab's typed prompt was silently wiped before send.
   *Fix adopted:* insert the prompt with `document.execCommand('insertText', …)` and submit by
   clicking the send button programmatically, then verify the sent user message before waiting.
   Drafts inside an existing `/c/<id>` conversation are per-conversation and never collided,
   so all `-v2` sends were unaffected. Other agents may have sent a wrong prompt at least once.
3. **Download method.** Instead of the hover-and-click download button, each finished image was
   fetched from this tab's own DOM and saved via a blob anchor under a unique name
   (`filloA-<slug>-vN.png`). This never produces a `ChatGPT Image*.png` file, so there was zero
   possibility of picking up another agent's download — no file in `~/Downloads` that this
   agent did not itself create was ever read or moved.
4. **Lazy loading.** Generated images below the fold report `naturalWidth = 0`; the poll must
   `scrollIntoView()` and set `loading = 'eager'` before reading the image, or it looks
   perpetually unfinished.
5. **Browser restart mid-run.** The extension tab group was dropped once (between choco-anpan's
   upload and send); the run was resumed in a fresh tab with no lost or duplicated output.
