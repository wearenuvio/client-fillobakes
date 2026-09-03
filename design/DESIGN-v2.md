# Fillo Bakes — Design v2 (authoritative; supersedes DESIGN.md, tokens.css, tailwind-theme.json)

Source of truth: `design/brand-direction-v1.html` (the client-approved brand page) and the 8 images in `moodboard/`.
Client decisions (3 Sep 2026): Palette A "Butter paper" · Type A Instrument Serif + Hanken Grotesk + Caveat script · Home hero A floating cutout on cream · Build home + shop + product first.

## 0. The one-line brief
A warm, spacious D2C bakery site. The product floats on cream paper, one big serif line does the talking, one terracotta button does the selling. Nothing on screen looks like an ops dashboard, a newspaper, or a spec sheet.

## 1. Tokens (replace everything in globals.css @theme)

Colour
```
--color-paper:        #F7F2EA   page ground
--color-paper-2:      #F1EADF   alternate section ground
--color-peach:        #F3E3D2   tinted section (story, standing order)
--color-well:         #EFE7DB   product image wells behind cutouts
--color-card:         #FFFDF9   white-ish cards (bestsellers, PDP panels)
--color-ink:          #2B1B12   headings, primary text (chocolate)
--color-ink-2:        #5A463A   body text
--color-muted:        #8F7B69   captions, labels
--color-line:         #E2D6C6   hairlines, card borders
--color-accent:       #B4472B   the ONLY button/link colour (terracotta)
--color-accent-hover: #9E3B24
--color-on-accent:    #FFF7F1
--color-gold:         #D9A441   seals, stars, tiny highlights only
--color-choc:         #2B1B12   dark band ground (same as ink)
--color-choc-2:       #3A2618   dark band card
--color-on-choc:      #F3EADF
--color-success:      #4E7A4A   toast only
--color-danger:       #B4472B   same as accent; errors are text + icon, not red boxes
```
Navy `#023D5D` appears nowhere except inside the logo image. No gradients except a photo scrim. No pure white page grounds.

Type
```
--font-display: "Instrument Serif", Georgia, serif        (400, italic 400)
--font-sans:    "Hanken Grotesk", system-ui, sans-serif   (400, 500, 600)
--font-script:  "Caveat", cursive                         (500)
--font-jp:      "Zen Kaku Gothic New", sans-serif         (kana only, keep current loading)
```
Scale (fluid): display-1 clamp(48px,7.5vw,96px) lh .95 ls -.015em · display-2 clamp(36px,4.8vw,60px) lh 1.02 · h2 clamp(30px,3.6vw,44px) lh 1.05 · h3 24px lh 1.15 · body-lg 18px/1.6 · body 16px/1.6 · small 14px/1.5 · label 12px uppercase tracking .12em weight 500 (sans, NOT mono) · script 22–28px · price 18px sans 600 tabular.
Rules: headings are always the display serif, weight 400, sentence case. Script appears at most once per page, always terracotta, always directly above a display headline. Labels are Hanken caps, never DM Mono. No mono anywhere on customer pages.

Space and shape: section padding 96px desktop / 64px mobile; container 1180px, 24px gutters; card radius 10px; button radius 8px; pill radius 999px for tags/seals only; grid gap 24px.
Shadows: cutouts get `filter: drop-shadow(0 22px 26px rgba(43,27,18,.16))`; cards get none at rest, `0 10px 30px rgba(43,27,18,.08)` on hover; no other shadows.
Motion: 200ms ease-out hover lifts (translateY -2px), cutout gentle float on hero (6s ease-in-out infinite, ±6px, off under reduced-motion), fade-up on scroll for sections (IntersectionObserver, 400ms, once). Nothing else.

## 2. Components (restyle existing ones; keep APIs where possible)
- **Header**: 72px, paper ground, bottom hairline. Left: logo image (assets/logo, small, height 32) + wordmark "fillo bakes" in display serif 22px. Centre: Shop · Standing Order · The Van · Our Story · Journal (sans 14px 500). Right: search icon, account icon, cart icon with count badge (accent), and an accent "Order" button. Sticky. No ticker above it. Mobile: logo + cart + burger; area chip is NOT in the header.
- **Announcement bar**: removed from global chrome.
- **Button**: primary = accent bg / on-accent text / 8px radius / 14px 600 / padding 12px 20px, hover accent-hover + lift. Secondary = transparent, 1px ink border, ink text. Ghost = text + arrow. Sizes sm/md/lg.
- **Seal**: 88px round, 1.5px ink border, two lines of 10px caps around/inside, optional wheat line icon, slight rotation (-8deg). Used once on the hero and once on the PDP.
- **ProductCard**: card ground; 1:1 well (`--color-well`) with the cutout at 78% width centred, hover cross-fades the v1 cutout to the v2 cutout (250ms; both preloaded; fallback gentle scale when no v2); below: category label (12px caps muted), name (display serif 22px), kana (12px jp muted, directly under name), one-line description (14px ink-2, 1 line clamp), row: price (18px 600) + accent "Add" button (sm) that becomes a stepper. Sold out: cutout desaturated 60% + opacity .7, "Sold out today" tag, button becomes secondary "Notify me". "Few left" tag in gold when stock ≤5 (mock only).
- **Category tile**: 5-up, well ground, cutout, name in serif 20px, count in muted.
- **Trust strip**: 4 items in a row on paper-2, Lucide line icon 22px + 14px text. No borders, no boxes.
- **Story split**: two photos (one tall, one small offset) + eyebrow label + display-2 italic headline + 90-word paragraph + ghost link.
- **Why-return cards**: 4 white cards, 40px line icon, 18px serif title, 14px text.
- **Dark band**: `--color-choc` full-bleed, on-choc text, 2–3 floating cutouts with drop shadow at the edges, display-2 headline, one sentence, inline area check (input + accent button), secondary link "Track the van". The only dark surface on the page.
- **Plan card / Fillo+ card**: peach ground, serif title, 2 lines, one button. Calm.
- **Testimonial**: big serif italic quote 28px, name + area 14px, 5 gold stars small.
- **Footer**: paper-2, 4 columns (Shop, Fillo Bakes, Help, Reach us), wordmark large in serif, newsletter input, FSSAI + company line small muted. Kannada thank-you line allowed here only.
- **Cart drawer**: keep logic; restyle to card ground, serif title "Your order", lines with small cutouts, total with delivery inside, accent "Checkout" button. Area/lane selector lives here as a compact row ("Deliver to Indiranagar · change"), not on the home page.
- **Filters / tabs**: sticky category tabs under the shop header (pill tags, accent when active). Search input right-aligned. Sort dropdown. No sidebar.

## 3. Page specs

### Home `/` — Crave, choose, believe, get it, come back
1. **Hero** (paper, 92vh max 720px, 2 columns 1.1/.9): script "Baked fresh, eggless." · display-1 "Japanese milk bread, to your door." · body-lg "Pillowy shokupan, cream-filled an pan and savoury kare pan, baked every morning in Bengaluru." · buttons: primary "See the menu" → /shop, ghost "How delivery works" → /van. Right: milk-shokupan-v2 cutout, rotate -6deg, floating animation, 4–6 small crumb dots (CSS) around it, Seal "100% eggless · baked daily" bottom-right. LCP image priority.
2. **Trust strip** (paper-2): 100% eggless · Baked every morning · No preservatives · Delivered across Bengaluru.
3. **Bestsellers** (paper): eyebrow "Bestsellers", h2 "The ones people come back for." right-aligned ghost "See all 23 →". 8 ProductCards in two rows (4-up desktop, 2-up mobile): milk-shokupan, custard-anpan, seoul-spice, fruit-sando, strawberry-anpan, japanese-marble-bread, kyoto-curry, blue-pea-bread. Add works via cart store.
4. **Categories**: eyebrow "Shop by kind", 5 tiles: Breads (4), An pan (7), Kare pan (2), Pies and strudels (7), Fruit sandos (3) → /shop/[category].
5. **Story split** (peach): eyebrow "Our story", italic display-2 "Baked the Japanese way, without a single egg." paragraph from src-content Our story (90 words, warm, no numbers unless real: founded December 2025, Neha and Nischal, 300 tasters). Photos: stock lifestyle hands-tearing-bread-minimal + milk-bread-loaves-cooling-rack. Ghost "Read our story".
6. **Why people return** (paper): 4 cards: Pillowy, every time · Eggless, no compromise · Fresh this morning · Small batches.
7. **Dark band**: display-2 "Order by 8pm. At your door tomorrow." sentence "Two-hour delivery windows across Bengaluru, or catch the van at a stop near you and skip the delivery fee." AreaCheck inline (pincode/area → result copy: "We deliver to Indiranagar on Tue, Thu, Sat." / "Not yet, join the waitlist"). Link "Track the van →". Cutouts: custard-anpan-v1 left edge, seoul-spice-v1 right edge.
8. **Come back** (paper-2, 2 cards side by side): Standing Order card "Your bread, every week." + "Skip any week, pause any time." button "How it works" → /standing-order. Fillo+ card "Join free, earn on every order." + "2 coins per ₹100. 25 coins is ₹25 off." button "Join free" → /fillo-plus.
9. **Reviews**: 3 quotes from research/site-snapshot/text/home.txt testimonials (real ones), centre one larger.
10. **Journal + newsletter**: 2 post cards (what-is-shokupan, why-eggless) + one-line newsletter field "One email on Sunday. What we're baking, where the van will be."
11. **Footer**.
Nothing about run counts, cutoff clocks, lanes, or "[TBC]" on this page.

### Shop `/shop`, `/shop/all`, `/shop/[category]`
- Header block (paper): script "Everything eggless." display-2 "The menu" + count "23 bakes" muted; one line "Baked every morning. Order by 8pm for tomorrow." Search input right.
- Sticky tabs: All · Breads · An pan · Kare pan · Pies and strudels · Fruit sandos (+ Weekly specials only if items exist). Sort: Most ordered / Price.
- Grid: 4-up desktop, 2-up mobile, ProductCards in catalogue order. Sold out cards greyed as spec. No route switcher, no area nag, no three doors. A slim peach banner after the second row: "Deliver to your area? Check in the cart." — optional, small.
- `/shop` and `/shop/all` are the same page; category routes pre-filter with the tab active.

### Product `/product/[slug]`
- Breadcrumb small. 2 columns (1.05/.95).
- Gallery: main well 1:1 with cutout v1, thumbs: v1, v2, one lifestyle stock photo. Seal "Baked this morning" on the well corner.
- Right: category label, display-2 name, kana under it, price 24px 600, 2-line description, Add stepper + primary "Add to order — ₹200", under it 14px muted "Order by 8pm for tomorrow's delivery." then three small facts in a row with icons: Eggless · Vegetarian · Baked daily.
- Below full width: "What's in it" (contains / does not contain from products.json; if a value is unknown, OMIT the row, never print a note), "How to eat it", "Keeps for" (only if present, else omit), "Pairs well with" 3 ProductCards, then 2 reviews.
- No spec chips with hydration/ferment, no disclaimers, no TBC strings anywhere.

## 4. Mock data hygiene
- Any string containing "[TBC]" or "TBC" must not render. Replace with a real-looking mock or omit the element.
- Stock counts: show "Few left" only for 2 mocked SKUs; never show numbers.
- Reviews: use the 8 real testimonials from the live site snapshot.

## 5. Definition of done for this pass
- Home, shop (3 routes), product render with the new tokens; old navy/mono/ticker chrome gone site-wide (header, footer, cart drawer restyled).
- Screenshots at 1280 and 375 compared against `design/brand-direction-v1.html` sections 03–06: same palette, same type, same hero composition.
- `pnpm typecheck && pnpm lint && pnpm build` clean.
- Other routes may look off until their pass; they must not crash.

## 6. Client directives added 3 Sep (binding for every page)
- **Mobile first.** Design at 375px first. Hero: script, headline, one button, cutout below. 2-up product grids, ≥44px tap targets, scrollable tabs with edge fade, sticky bottom cart bar when the cart has items, no hover-only affordances, `sizes` on every image.
- **Simplify.** One eyebrow, one headline, at most two sentences per section. Never repeat a fact another section already states. Cut filler sections. Trust strip items are 2–4 words. Tiles are name + count.
- **Studio grade.** No clipped text, overflow, uneven card heights, misaligned baselines, layout shift, console errors. Every state checked (empty cart, sold out, few left, image fallback).
- **Line art.** Faint hand-drawn wheat/bread line art (web/public/images/lineart/) may sit behind sections at ~.12 opacity, in the hero corner, footer, and on the dark band in the light variant. Never over text.
- **Logo** stays navy as supplied. **Testimonials**: all 8 real ones are approved.

## 7. Home hero + Standing Order decisions (client, 3 Sep, evening)
- **Hero = big word over crumb photo.** Full-bleed warm macro of shokupan crumb (or the sliced loaf) with a soft chocolate scrim at the bottom only; script "Baked fresh, eggless." above; one oversized display word **"Fuwa fuwa"** (serif, cream, spanning ~80% of the width, like the CROISSANT reference) with a small subline "ふわふわ · the Japanese word for pillowy" and one sentence; buttons: primary "See the menu", secondary outline "How delivery works"; bottom-left small line "Order by 8pm · at your door tomorrow"; bottom-right seal. Mobile: word wraps to two lines, photo cropped to the crumb, buttons stacked.
- **Standing Order = full-width peach band**: script "Your bread, every week." + display-2 "The Standing Order" + three line-art steps (choose your bread · choose your day and stop · we bake it fresh and drive) + "From ₹200 a week. Skip any week, pause any time." + one large terracotta CTA "Start with The Loaf" + ghost "How it works". Nothing else in the band.
- No new sections (ingredients strip, how-to-order, spec chips): the references were for style only.
- Section titles one line on desktop; See-all button under bestsellers; category tiles line art only; first why-return icon changed; dark band art must not overlap cutouts; footer compacted.
