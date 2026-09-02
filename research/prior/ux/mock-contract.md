# Mock fragment contract (for builder agents)

You produce ONLY `<section class="slide">…</section>` blocks (no html/head/style). They get concatenated into a deck that already defines these tokens and classes:

CSS variables: --bg:#FBFAF6 --ink:#1B1A17 --mid:#57534B --faint:#A6A094 --hair:#E4E0D6 --accent:#A3512B --well:#F3F1EA
Fonts: --serif:"Newsreader" (principles, headings), --sans:"Hanken Grotesk" (UI mock text), --mono:"Martian Mono" (labels, eyebrows)

Available classes:
- .slide (1280x720 page, flex column) · .pad (padding 64px 88px, full height flex column)
- .eyebrow (mono small caps accent) · .pageno / .brand (positioned footer labels; use content "PG" for pageno, it gets renumbered)
- h2 (serif 44px) · .lede · .src (mono micro source line) · .hr · .well · .quote (serif italic)

Mock components (defined in deck CSS, use exactly):
- .phone — 300px wide phone frame: white bg, 1.5px ink border, 26px radius, 16px padding, use inside a flex row
- .phone .bar — top status row (mono 8px, space-between)
- .mk-h — mock heading (sans 700, 15px, ink)
- .mk-t — mock body text (sans 12.5px, line-height 1.45, mid)
- .mk-btn — primary button (block, ink bg, #fff text, sans 600 13px, 10px pad, 8px radius, centered)
- .mk-btn.ghost — outlined variant (transparent bg, ink text, 1px ink border)
- .mk-chip — small pill (mono 8px uppercase, 1px hair border, 3px 8px pad, radius 999)
- .mk-chip.live — accent border + accent text
- .mk-img — image placeholder: var(--well) bg with a single diagonal line (CSS gradient), give it an explicit height, put a .mk-imglabel inside (mono 8px faint, centered) naming the photo, e.g. "PHOTO · TORN LOAF CRUMB"
- .mk-row — flex row, gap 8px, align center
- .mk-card — white card, 1px hair border, 10px radius, 12px padding, margin-top 10px
- .mk-strip — thin progress strip container; .mk-step (flex-1 center, mono 7.5px, pad 6px 0, hair top border) with .done (ink text, "✓ " prefix ok) and .now (accent text, bold)
- .mk-count — big number line (serif 26px ink)

Slide layout for every mock slide:
<section class="slide"><div class="pad">
  <span class="eyebrow">Visualised · [topic]</span>
  <h2 style="margin-top:16px;font-size:34px;max-width:640px;">[One-sentence principle]</h2>
  <div style="flex:1;display:flex;align-items:center;gap:56px;margin-top:8px;">
    <div style="flex:1;max-width:400px;">[2-4 short .lede/.item style annotations, font-size 14.5px, explaining what to notice; use <b> for the key phrase]</div>
    <div style="display:flex;gap:26px;align-items:flex-start;">[1-2 .phone frames or one wide component mock max 640px]</div>
  </div>
  <span class="brand">The Fillo Experience · Visualised</span><span class="pageno">PG</span>
</div></section>

Rules:
- ALL mock copy must be real, final-feeling Fillo strings (use the research drafts verbatim where given). No lorem, no placeholder text except inside .mk-img labels.
- No em dashes anywhere. No emoji except where a mock genuinely shows WhatsApp (allowed there sparingly).
- Wireframe restraint: white, ink, hair, well, one accent. No shadows, no gradients beyond the .mk-img diagonal.
- Everything must fit 720px height. Phones max-height ~520px: keep content short, crop with a bottom fade is NOT available, so just include fewer modules and end the phone with a .mk-chip "SCROLLS ON" marker if needed.
- Annotations left, mock right, always.
