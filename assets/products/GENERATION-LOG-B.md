# Generation Log — Batch B

Product cutouts generated via ChatGPT image generation (Chrome extension), 2026-09-03.
Style prompt held constant across all products: photorealistic cutout, soft warm studio light
from top-left, subtle contact shadow only, 30 degree three-quarter angle, warm golden tones,
no props / plate / text, fully transparent background (PNG with alpha), product fills ~80% of frame.
v2 = cut face / cross-section variant, same product and style.

All delivered files: 1536 x 1024 px, `hasAlpha: yes` (verified with `sips`).
All delivered files opened with the Read tool and visually confirmed to depict the correct product.

| Slug | Reference used | v1 | v2 | Dims | Alpha | Notes |
|---|---|---|---|---|---|---|
| tiramisu-anpan | `custard-pan.jpeg` (style proxy — no product photo exists) | done | done | 1536x1024 | yes | Milk bun, mascarpone cream band, cocoa + icing sugar dusting. v2 halved showing cocoa-layered cream centre. Visually verified. |
| cookie-n-cream-anpan | `oreoanpan.png` | done | done | 1536x1024 | yes | Cream band speckled with cookie crumb, two dark sandwich cookies. v2 halved showing cookies-and-cream centre. Visually verified. |
| banana-biscoff-anpan | `bananapan.png` | done | done | 1536x1024 | yes | Biscoff caramel + speculoos crumb band, three banana slices. v2 halved showing banana/Biscoff centre. Visually verified. |
| seoul-spice | `seoul.png` | done | done | 1536x1024 | yes | Twisted Kare Pan roll, chilli-flake ends. v2 cut open showing red gochujang sweet-potato filling. Visually verified. |
| tex-mex-zest | `seoul.png` (Kare Pan form proxy — **no Tex Mex reference exists** in the snapshot) | done | done | 1536x1024 | yes | `nice-mince-new.jpg` was inspected and is a sesame bun with spinach-cheese filling, **not** Tex Mex; all `image*.png` files were also inspected and are unrelated (bread spread, Instagram logo, fruit sando, custard bun, veg mark). Same twisted-roll form as Seoul Spice with cheese, jalapeno and bell pepper. v2 generated in a fresh chat using `tex-mex-zest-v1.png` as the reference (original chat lost to a browser restart). Visually verified. |
| bangalore-bloom | `bangalorebloom.png` | done | done | 1536x1024 | yes | Rolled puff-pastry parcel, flaky layered ends, sesame on top. v2 cut open showing spiced mixed-veg and potato filling. Visually verified. |
| kyoto-curry | `kyoto-curry-new.jpg` | **PENDING** | **PENDING** | — | — | Blocked by ChatGPT rate limit (see below). Reference uploaded, prompt composed, never sent. |
| calcutta-blaze | `calcutta-blaze-new.jpg` | **PENDING** | **PENDING** | — | — | Blocked by ChatGPT rate limit (see below). Not started. |

## Pending / blockers

- **03:08 IST, 2026-09-03 — ChatGPT rate limit.** Modal: "Too many requests — You're making
  requests too quickly. We've temporarily limited access to your conversations to protect your
  data. Please wait a few minutes before trying again." Hit while composing the Kyoto Curry
  prompt. Per client instruction, generation was stopped rather than waited out.
  **kyoto-curry** and **calcutta-blaze** (4 files total) remain to be generated in a later run.

## Issues encountered (for the next run)

1. **Cross-agent composer draft collision.** ChatGPT syncs the *new-chat* composer draft across
   tabs on the same account. During the Tex Mex Zest attempt the composer was found holding
   another agent's "Custard An Pan" prompt alongside my attachment. Mitigation used: `cmd+A` +
   `Delete` in the composer immediately before typing, then screenshot-verify the composer text
   before pressing Return. Drafts inside an existing `/c/<id>` conversation do **not** collide,
   so v2 sends were safe.
2. **First keystroke swallowed after page load.** The first `type` action after a fresh navigate
   is frequently dropped entirely, or drops its first character (one prompt began "sing the
   attached..."). Always screenshot-verify the composer before sending.
3. **Browser restart mid-run** wiped all tabs and the in-progress Tex Mex Zest conversation; v2
   was recovered by starting a new chat with the already-downloaded v1 PNG as the reference.
4. **Download path.** Images were saved via the fullscreen image viewer's "Save" button (the
   inline hover control is Share, not download). Files land in `~/Downloads` as
   `ChatGPT Image <date>.png`; with parallel agents, diff a before/after `ls` and open ambiguous
   candidates with Read before moving.
