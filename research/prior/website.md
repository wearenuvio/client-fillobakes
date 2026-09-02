# Fillo Bakes — Website Extraction & Technical Audit
_Extracted live via browser, 18 Aug 2026. Site: https://www.fillobakes.com/_

## Company facts (from site)
- Legal entity (footer): **Wise Eats SuperFood OPC Pvt Ltd**
- Founders: **Neha S Nirmal & Nischal Vasant Meethal**, founded **December 2025**
- Concept: 100% vegetarian, eggless, Japanese-inspired **moving bakery** (van), Bengaluru. Mission framed as reviving neighbourhood bread-vendor nostalgia ("like milk vendors"), bread as daily staple.
- 300+ first-time tasters in testing phase (about page claim)
- Contact: +91 86189 06902 · wiseeatsindia@gmail.com · Mon–Sun 10:00–19:00 · WhatsApp CTA on /contact
- Franchise page contact: fillobakes@gmail.com and **+91 98765 43210 (dummy placeholder number left live)**
- Tech stack: **v0.app-generated Next.js** on Vercel, Shopify checkout backend, GA4 (G-BSM177ENQL), Contentsquare analytics, OpenStreetMap for van tracking.

## Sitemap / pages
`/` `/shop` `/fillo-plus` `/fillo-plus/dashboard` `/about` `/blogpage` `/franchise` `/cart` `/checkout` `/contact` `/privacy` `/terms` `/refund` `/shipping` `/payment-policy` + hidden SEO page `/shokupan` + stale `/product/*` URLs.

## Product catalogue (live, /shop)
| Category | Product | Price |
|---|---|---|
| Breads | Milk Shokupan (Whole/Sliced variants) | ₹200 |
| Breads | Japanese Marble Bread | ₹200 |
| Breads | Blue Pea Bread (butterfly pea flower) | ₹250 |
| Breads | Chocolate Shokupan | ₹250 |
| An Pan | Custard / Choco / Pistachio | ₹159 |
| An Pan | Strawberry / Tiramisu / Cookie n Cream / Banana Biscoff | ₹189 |
| Kare Pan | Seoul Spice (gochujang sweet potato), Tex Mex Zest | ₹159 |
| Pies & Strudels | Bangalore Bloom ₹99; Kyoto Curry, Calcutta Blaze, Umami Melt, Korean Whisper, Orchard Melt, Mawa Melt ₹129 |
| Fruit Sandos | Fruit Sando ₹250; Strawberry Cream ₹280; Custard Cream ₹280 |

- 23 SKUs live. Price band ₹99–₹280. "Weekly Specials" filter tab exists but shows **no items**.
- Homepage claims "100+ Items" — actual catalogue is 23. Also "500+ Lovers".
- **Duplicate copy**: all 3 Fruit Sandos share one identical description. Blog stubs duplicate shop copy again.
- Naming system is a genuine asset: city-fusion names (Kyoto Curry, Seoul Spice, Calcutta Blaze, Bangalore Bloom, Mawa Melt).

## Fillo+ membership (/fillo-plus)
- ₹1 one-time join fee → 2 coins per ₹100 spent → 25 coins = ₹25 off. Effective ~2% cashback.
- Email-based signup → ₹1 Shopify checkout. Member dashboard at /fillo-plus/dashboard ("Your Rewards", "Bake More").
- Benefits promised: early access to seasonal items, member perks. No email nurture evidence.

## Ordering & checkout flow (tested to payment step, not submitted)
1. /shop → Add → variant modal (e.g. Shokupan Whole Loaf / Sliced) → cart drawer.
2. /cart: coupon nudge "Add ₹300 more → FILLO10 = 10% off above ₹500". Working.
3. /checkout: **delivery date picker (30 days ahead) + 4 time slots (12–2, 2–4, 4–6, 6–8 PM)**, contact info, Fillo+ ₹1 add-on upsell, 5% tax, then redirect to **Shopify secure checkout**.
- Genuinely good D2C bones: scheduled slot delivery + coupon + loyalty upsell at checkout.
- **No delivery-area/pincode check anywhere before payment** — user discovers serviceability never.
- Homepage also has −/+ steppers direct add. In-page cart panel on /shop ("Review Your Order").

## Van tracker (killer feature, buried)
- Tiny "🚐 Track our van" pill bottom-left of homepage → popup with **live map (OpenStreetMap), van position (seen live at K.S. Nissar Ahmed Ward / Banaswadi–Ramamurthy Nagar), "updates every 15 seconds"**.
- This is a real-time GPS feed of the moving bakery — exactly the "alien-level" asset — presented as an afterthought widget. Not a page, not shareable, no route schedule, no "notify me when near me".

## SEO / technical findings (critical)
| Issue | Evidence | Severity |
|---|---|---|
| **No `<title>` on any core page** | `/`, /shop, /about, /contact, /fillo-plus, /franchise, /blogpage, /shipping, /refund all render empty title | Critical |
| No meta descriptions, no OG tags, no canonical, no favicon, no JSON-LD schema | checked in-browser + curl | Critical |
| Only `/shokupan` has title+meta ("Shokupan Bread in Bangalore…") — and it's **missing from sitemap.xml** | curl | High |
| Sitemap lists 12 stale `/product/*` URLs (fillo-munch, pandan-kaya, milo-toast, taipei-whisper…) that render "Product Not Found" **with HTTP 200** (soft-404s) | tested | High |
| /fillo-plus, /franchise, /blogpage also absent from sitemap | curl | Medium |
| Blog "Read More" links all point to **/blogpage/undefined** (broken) | link extraction | High |
| Blog is auto-generated product stubs (duplicate content), zero editorial content | /blogpage | Medium |
| Site is client-rendered SPA feel; only shokupan page server-renders meta | curl vs browser | High |
| robots.txt fine; sitemap lastmod 2026-07-05 | curl | — |

## Trust & content findings
- 8 homepage testimonials, all unverifiable text ("Riya S.", "Aman K.") + on-page "Post Review" star widget — reviews go nowhere visible; no Google/JustDial integration, no press logos (The Hindu feature unused on site).
- Shipping policy is generic courier boilerplate ("1–2 business days", "weight and distance") — **contradicts the fresh-daily, slot-scheduled van model** and mentions couriers, not the van.
- Brand identity: plain-text serif "Fillo" wordmark, no logo mark, cream/navy palette, emoji-heavy UI copy (✨🥐🪙), hero = close-up bread photo/video. Warm but generic; nothing visually ownable; inconsistent with "alien-level" ambition.
- Email inconsistency: wiseeatsindia@gmail.com (contact) vs fillobakes@gmail.com (franchise); both Gmail, no domain email.
- Franchise page claims "thousands of loyal customers" while homepage says "500+ lovers" — inconsistent.
- Only Instagram linked in header; no YouTube/LinkedIn links on site; no newsletter capture anywhere; no WhatsApp channel promo (only contact-page WhatsApp button).
- Rendering glitch observed: on scroll, /shop occasionally paints a large blank region with header detached (transient SPA hydration issue).

## What already works (don't break)
1. Shopify-backed checkout with delivery-slot scheduling — rare for a micro bakery.
2. Live GPS van tracking — unique in the market.
3. Fillo+ ₹1 loyalty with checkout upsell.
4. Sharp niche positioning + charming product naming system.
5. /shokupan SEO page template proven (ranks per proposal research).
6. GA4 + Contentsquare already installed (measurement possible day one).
