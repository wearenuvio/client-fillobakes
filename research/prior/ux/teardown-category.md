# Fillo Bakes — UX Research Phase 1/5
## In-category teardowns: food & bakery D2C websites

**Date:** 2026-08-27
**Method:** live page fetches (WebFetch/WebSearch), reading actual on-page copy. No browser automation.
**Purpose:** inform Fillo Bakes' site design — Japanese eggless moving-bakery van, Bengaluru, Shopify checkout, live GPS van tracker, weekly drop model.

### Sites torn down

| # | Site | URL | Model | Fetch status |
|---|---|---|---|---|
| 1 | Ginza Nishikawa (銀座に志かわ) | https://www.ginza-nishikawa.co.jp/ | Single-SKU premium shokupan, store reservation | Full |
| 2 | Sakimoto Bakery (嵜本) | https://shokupan-sakimoto.com/ | Premium shokupan, reservation + separate frozen e-comm | Full (main site); mail-order site returned broken encoding |
| 3 | The Baker's Dozen | https://thebakersdozen.in/ | Brand catalogue → marketplace handoff | Full |
| 4 | Blue Tokai Coffee | https://bluetokaicoffee.com/ | Shopify D2C + subscription + cafés | Full |
| 5 | Bombay Sweet Shop | https://bombaysweetshop.com/ | Shopify D2C, gifting-led | Full |
| 6 | Levain Bakery | https://levainbakery.com/ | Shopify D2C, nationwide ship + local pickup | Full |
| 7 | GAIL's | https://gails.com/ (gailsbread.co.uk → 301) | Bakery chain, click & collect + slot delivery | Full |
| 8 | Hotplate (micro-bakery drop platform) | https://www.hotplate.com/ | Weekly pre-order drops | Storefronts are client-rendered and return only a title to a fetcher — mechanics reconstructed from hotplate.com/product, the blog, and help.hotplate.com articles |

**Substitution note:** individual Hotplate shop pages (`/bakesalecookiellc`, `/thecommoncookie`) are SPAs that serve no crawlable copy. This is itself a finding — Hotplate storefronts have effectively zero SEO surface. Mechanics below are taken from Hotplate's own product page and seller documentation, which describe the customer-facing experience directly.

---

## 1. Ginza Nishikawa (銀座に志かわ)
**URLs:** https://www.ginza-nishikawa.co.jp/ · /bread · /bread/sweetbeanbread

### (a) Copy
- **Homepage first line:** 「こだわったのは仕込み水に使用している独自のアルカリイオン水」 — *"What we obsessed over is the proprietary alkaline ionised water used in the dough."* The site leads with a **process obsession**, not a product benefit and not a price.
- **Product description style:** purely **sensory + provenance**. 「神秘的な甘さ」 *("a mysterious sweetness")*. 「素材のうまみを引き出す水として知られるアルカリイオン水」 *("alkaline ionised water, known for drawing out the umami of ingredients")*. Ingredient list is a named cast: finest Canadian wheat flour, honey, fresh cream, butter. No macros, no spec table.
- **Voice attributes:** reverent, singular, artisanal-formal. Almost no second-person. Zero exclamation marks. It reads like a manufacturer's statement of intent.
- **How they say fresh/craft:** they don't say "fresh." They say **こだわり (kodawari — uncompromising commitment)** and 「水も食材」 *("water is an ingredient too")*. Craft is proven by naming one specific input and defending it.
- **CTA language:** 「WEB予約」 *(Web reservation)*, 「ご予約方法」 *(How to reserve)*. Not "buy" — **"reserve."**

### (b) IA
Nav: 商品紹介 (Products) · 高級食パン (Premium Shokupan) · CAFE · 店舗一覧 (Store list) · お知らせ (News) · メディア (Media) · WEB予約 · 銀座に志かわUSA.
Page inventory: product index, per-variant product pages, store locator (49+ locations), news, press/media wall, cafe, US site.
**Clicks to order:** 2 — nav "WEB予約" → external reservation app. Alternative path explicitly documented: walk in or phone the store with 「お名前、お電話番号、ご希望の本数、お受け取り日時」 *(name, phone, number of loaves, pickup date & time)*.

### (c) PDP anatomy
Hero image → name → price (1本〈2斤〉1,200円 税込) → the water/ingredient story → sensory paragraph → 食べ方 (how to eat) → variant family (山型 / あん / 北海道4種のチーズ / 潤み葡萄のレーズン) → **packaging upsell as first-class product** (gift box ¥242, large paper bag ¥110, dedicated bread furoshiki ¥1,320 per colour).
No reviews. No delivery module. No urgency. No add-to-cart on the main site.

### (d) Trust
Media page (press logos), 49-store locator, the water story itself, and the price. Trust is carried by **scarcity + institutional presence**, not social proof.

### (e) Conversion
Reservation, not checkout. Explicit scarcity disclaimer: 「各店舗の予約状況により、お客様のご希望される本数、日時がお受けできない場合もございます」 *("depending on each store's reservation status, your requested quantity and time may not be available")* — scarcity is stated as an apology, which makes it credible rather than salesy. No email capture, no discount code, no countdown.

### (f) Steal / avoid
- **Steal:** the one-obsession hero. Fillo should lead with a single defensible process claim (eggless Japanese method / the specific milk / the 12-hour tangzhong — whatever is true) rather than a generic "freshly baked in Bengaluru."
- **Avoid:** no email/SMS capture anywhere. For a weekly-drop business that is fatal — Fillo's entire model depends on a list.

---

## 2. Sakimoto Bakery (嵜本)
**URLs:** https://shokupan-sakimoto.com/ · /shokupan/ · /shokupan/gokunama-milk-butter/ · /jam/ · /shop/ · /company/

### (a) Copy
- **Homepage first line:** 「素材本来の自然な旨み、甘みが、ご飯のように様々な食材にマッチし」 — *"The ingredients' own natural umami and sweetness pair with all kinds of foods, like rice does."* Positions bread against a cultural staple.
- **Product description style:** **sensory-first with a use-case tag line per SKU.** Each loaf is sold on *occasion*, not spec:
  - 極美"ナチュラル"食パン — 「毎日食べたい、どんな食べ方とも相性のいい食パン」 *("the loaf you want every day, that suits any way of eating")*
  - 極生"北海道ミルクバター"食パン — 「そのまま食べたい、何もしなくても美味しい食パン」 *("the loaf you want plain — delicious with nothing done to it")*
- **Voice:** warm, playful-precise. Includes a joke warning: *"one bite may become addictive — please exercise caution."* Jams described as having *"a pearl-like lustre and smooth mouthfeel."*
- **Fresh/craft:** by ingredient origin (Hokkaido milk, fresh cream, domestic butter, honey) and by texture verbs (moist, chewy, fluffy crusts, melting).
- **CTA:** 「ご購入はこちら」 *(Purchase here)* · 「ご予約」 *(Reserve)* · ストア *(Store)*.

### (b) IA
Nav: ニュース · 商品 · 嵜本珈琲 · and more · ショップ · ストーリー · よくあるご質問 · 採用情報.
Two commerce surfaces: reservation for in-store pickup, and a separate frozen mail-order shop (sakimoto.shop-pro.jp) with a 定期便 subscription and free-shipping tier.
**Clicks to order:** 2 (Products → Purchase here / Reserve), but the split between brand site and shop domain costs a full context switch.

### (c) PDP anatomy (verified on /gokunama-milk-butter/)
Header → breadcrumb → single product image → title + price (¥1,180 incl. tax) → **allergen line up top** (wheat, dairy; contains honey, unsuitable under 12 months) → sensory paragraph → *how to eat* recommendation ("enjoy fresh as-is; toasting enhances the chew and sweetness; no toppings needed") → CTA buttons → related products → news feed → social → footer.
**Notable:** allergens sit *above* the romance copy, and "how to eat" is a standard module, not an afterthought.

### (d) Trust
Story page, company page, FAQ, store list, News cadence. No customer reviews, no press wall found.

### (e) Conversion
Reservation + frozen mail-order + 定期便 subscription with free shipping. Gift boxes and soft boxes as a dedicated category. No urgency mechanics, no discount codes.

### (f) Steal / avoid
- **Steal:** the **one-line use-case tag per SKU.** Fillo's menu is small; giving each item a single "when you'd eat this" line ("the one you want plain," "the one for the 4pm slump") does more work than a paragraph.
- **Avoid:** splitting commerce across two domains/systems. Fillo should keep reservation, drop, and checkout inside one Shopify surface.

---

## 3. The Baker's Dozen (India)
**URLs:** https://thebakersdozen.in/ · /shop/ · /our-story · /faq · https://blog.thebakersdozen.in/

### (a) Copy
- **Homepage headline:** *"When you love, a little extra."* First line: *"For over a decade, we've been baking with passion, serving across cities…"*
- **Origin line:** *"In 2013, we started with a simple belief — India deserves better bread."*
- **Product description style:** **enthusiastic sensory-conversational**, near-identical register across SKUs: *"Experience a perfect symphony of sweetness and crunch with our Banana Walnut Cake…"*, *"Why settle for ordinary cookies when you can have a handful of joy?"*
- **Voice:** earnest, mission-driven, a little generic. Founder-forward (Chef Aditi Handa, Founder & Executive Chef; Sneh Jain, co-founder).
- **Fresh/craft:** the strongest copy on the site, and it's **the "extra" conceit** — *"the extra hour of fermentation that gives our sourdough its depth," "the extra handful of chocolate chips."* Plus *"Honest Dough. Honest Hearts."* and *"no shortcuts, no compromises."* Section headings: "Simple ingredients," "Slow Fermentation," "Authentic sourdough."
- **CTA:** "Shop Now," "Explore All Products," "Subscribe Now," "Learn More."

### (b) IA
Nav: Our Products · RCB x TBD · Partners · Recipe · Our Story · Know more (FAQs, Contact, Privacy, Locations).
**Clicks to order: infinite — there is no checkout.** Every "Shop Now" is a catalogue link; actual purchase is offloaded to Swiggy Instamart, Blinkit, Zepto, Amazon Fresh, Flipkart Minutes, BigBasket, Nature's Basket, Milkbasket, Reliance, DMart, Ratnadeep. The footer's "Available On" block *is* the buy button.

### (c) PDP anatomy
Thin. Image, name, ~2-line description, "Shop Now" out-link. No reviews, no allergens surfaced, no delivery module, no cross-sell.

### (d) Trust
Founder credentials, "300+ cities," the sourdough/fermentation education content on blog.thebakersdozen.in, an IPL team collab (RCB x TBD), and the sheer length of the retailer list. No reviews, no press wall.

### (e) Conversion
None on-site. Newsletter/"Subscribe Now" and Instagram follow are the only capture. Phone (+91 9082857741) and email (fresh@thebakersdozen.in) in footer.

### (f) Steal / avoid
- **Steal:** the **"extra" device** — a repeatable, ownable phrase that converts a craft claim into a brand line. Fillo's equivalent could hang off the eggless constraint ("everything you'd expect, nothing you'd expect to be missing") or the van.
- **Avoid:** the marketplace handoff. TBD has traded owned demand for distribution — no first-party customer, no list, no repeat mechanic. Fillo's weekly drop cannot survive that. Also avoid TBD's interchangeable product copy: if you swapped two descriptions nobody would notice.

---

## 4. Blue Tokai Coffee Roasters
**URLs:** https://bluetokaicoffee.com/ · /collections/all-products-collection · /products/attikan-estate-easy-pour-coffee-sachets · /pages/pick-your-flavour

### (a) Copy
- **Announcement bar:** *"Get 10% off on your first coffee purchase, use code - TRY10."*
- **Product description style:** **spec-dominant with a sensory veneer.** The Attikan PDP carries a genuine spec table — Roast: Medium Dark · Acidity: Medium · Bitterness: Medium · Altitude: 1200–1650m · Processing: Washed · Varietal: S9 · Tasting notes: Nutty + Chocolatey · Country: India · 11g per sachet (brews 180–200ml) · Shelf-life up to 9 months, nitrogen-flushed. The romance is a three-word stack: *"Quick. Hassle-Free. Delicious."*
- **Voice:** knowledgeable, teacherly, inclusive of beginners — *"New to Specialty Coffee?"*, *"Let's start brewing!"*
- **Fresh/craft:** through **traceability** (estate name, altitude, process, varietal) and shelf-life honesty, not through the word "fresh."
- **CTA:** "Add to cart," "BUY NOW," "Subscribe & Save Upto 20%," "Notify Me," "CHECK" (pin code).

### (b) IA
Nav: Roasted Coffee · Capsules · Ready to Brew · Ready to Drink · Value packs · Subscriptions · All Collection · Offers · Gifting · Equipment · Others · Learn · About Us.
Footer adds: Track Order, Wholesale, Our Roasteries, Our Beliefs, Our Farms, Press, Careers, Packaging.
Merch-nav is **format-first** (how you brew) rather than origin-first — a deliberate beginner accommodation.
**Clicks to order:** 2–3. There is also a lateral discovery path: `/pages/pick-your-flavour` — *"TAKE YOUR PICK, EXPERIMENT & ENJOY!"* — a six-tile flavour selector (Chocolatey & Nutty · Experimental · Fruity & Punchy · Balanced · Bold & Bitter · Delicate & Complex) that routes taste language to SKUs.

### (c) PDP anatomy
Gallery → title → price → size variant → **one-time vs Subscribe & Save toggle** (frequencies: weekly / 10 days / fortnightly / 3 weeks / monthly / on request; commitments of 3, 6, 12, 24 deliveries) → tasting notes → spec table → 4-step brewing guide with animated GIF → free-shipping line (*"FREE STANDARD SHIPPING on all prepaid orders above ₹350"*) → **pin code serviceability checker** → FAQ accordion (9 questions: vs instant coffee, milk guidance, shelf-life, what's in the sachet, reusability, nitrogen safety, disposal, filter material) → "You may also like."

### (d) Trust
"Happy Customers" testimonial block on home, Press page, Our Farms / Our Roasteries / Our Beliefs (supply-chain transparency), Learn hub, wholesale + careers pages, Track Order.

### (e) Conversion
First-purchase code in a persistent bar · email capture (*"Special offers, brewing tips & recipes! Get an insider access to new launches, events & more"*) · subscription ladder priced by commitment (3 deliveries ₹1,500 / 10% · 6 ₹3,000 / 12.5% · 12 ₹6,000 / 17.5%) · free-shipping threshold ₹350 · pin-code check · "Notify Me" on sold-out SKUs.

### (f) Steal / avoid
- **Steal:** two things. (1) The **flavour-first discovery page** — Fillo should let people pick by craving ("milky & light," "deeply chocolatey," "fruit & cream") rather than by product name. (2) The **PDP FAQ accordion answering the objection the category actually has.** For Blue Tokai it's "is this instant coffee?" For Fillo it is unambiguously **"eggless — does it taste like it?"** and **"how do I get it if the van moves?"** Those two belong on every PDP.
- **Avoid:** 13 top-level nav items. Fillo has one van and a weekly drop; a nav that size would be theatre.

---

## 5. Bombay Sweet Shop
**URLs:** https://bombaysweetshop.com/ · /collections/all · /products/gulab-jamun · /pages/about-us

### (a) Copy
- **Announcement bar (rotating):** *"Free shipping on orders ₹1500 & above 🚚"* / *"Flat ₹200 Off on ₹2000 & above"* / *"Flat ₹500 Off on ₹5000 & above."*
- **Homepage first line:** *"New on the Shelf: Indie Crunch Bars 🍫"* — a **launch line, not a positioning line.** The site treats the homepage as a shelf, refreshed by what's new.
- **Product description style:** **sensory + provenance + reassurance stacked.** Gulab Jamun: freshly handmade, fried in pure ghee, doused in sugar syrup, *"a soft blend of khoya and chenna, filled with nutty pistachios,"* melt-in-mouth.
- **Voice:** playful, modern, confidently Indian. Brand story: *"Like bees to honey, we followed the sugar trail across India, discovering recipes, imbibing traditions and mastering new skills to build our very own sweet shop."* Positioning is explicitly **"Re-creation"** — familiar sweets through *"a new lens of play."*
- **Fresh/craft:** *"crafted with high quality ingredients, careful technique, and elegant presentation"* + a hard shelf-life statement: **"Enjoy within 15 days."** Freshness is expressed as a *constraint*, which reads as honesty.
- **CTA:** "Add to Cart," "View details," "Shop All," "Shop Mumbai," "Track Your Order."

### (b) IA
Nav: Shop All · Mithai · Chocolate · Namkeen · From The Kadhai · Hampers · Customised Gifting · Diwali Corporate Gifting · Track Your Order · Rakhi Specials · Our Stores · About Us · Sweets Library · Blog.
**Clicks to order: 2** (category → PDP → add to cart), or 1 from the homepage shelf.
Note the **occasion-shaped nav** (Rakhi Specials, Diwali Corporate Gifting) that changes with the calendar — the same muscle Fillo needs for weekly drops.

### (c) PDP anatomy
Gallery → title → **4.6★ / 12 reviews** → price (₹250, MRP incl. all taxes) → size variants (6 pcs ₹250 / 2 pcs ₹125) → **"Mumbai only" availability badge** → sensory description → allergen + dietary block (contains pistachio, gluten, milk; dairy and lactose; **Jain-certified**; contains nuts; requires refrigeration; FSSAI No. 11521002000128) → **shelf life "Enjoy within 15 days"** → **pin code delivery checker** → customer reviews (58% 5★, 42% 4★, real text including a critical one about syrup leakage) → **"Frequently Bought Together"** → customisation contact link → **floating WhatsApp support button**.

### (d) Trust
Hard numbers on the homepage: *"3500+ Corporate Clients," "3,22,172 Hampers Delivered," "Pan-India Delivery Network."* Plus "Featured In" press wall (Forbes India, The Hindu, Travel + Leisure Asia, Vogue India, Scroll.in, Homegrown, CN Traveller India), named founders/chef (Girish Nayak, Chief Mithaiwala, CIA-trained; Sameer Seth; Yash Bhanage), parent-company credibility (Hunger Inc. — The Bombay Canteen, O Pedro), FSSAI licence in the footer, and **unfiltered negative reviews left visible**.

### (e) Conversion
Threshold ladder in the announcement bar (₹1500 free ship / ₹200 off ₹2000 / ₹500 off ₹5000) · pin code checker · "Mumbai only" honesty badge · Frequently Bought Together · WhatsApp support · Track Your Order · email capture (*"Subscribe to get updates on the latest workshops, events and products. We don't spam. It's a promise."*) · seasonal urgency via occasion collections. No countdown, no subscription.

### (f) Steal / avoid
- **Steal:** the **"Mumbai only" badge plus pin-code checker plus hard shelf life** — an honest local-perishable stack. Fillo is a van in Bengaluru; saying "this route only, eat within 2 days" *early and visibly* prevents the single worst outcome (a customer in Delhi buying a fresh milk bread). Also steal the **counted proof** ("3,22,172 hampers delivered") — a precise number beats an adjective.
- **Avoid:** three stacked discount offers in the announcement bar. It trains the customer to wait for a code and undercuts a premium craft position. Fillo's scarcity should come from the drop, not from discounts.

---

## 6. Levain Bakery
**URLs:** https://levainbakery.com/ · /collections/cookies · /products/chocolate-chip-walnut-cookies · /pages/shipping · /pages/faq · /products/requested-delivery-date

### (a) Copy
- **Homepage hero (currently a collab takeover):** *"A Collab Born in Our Bakery Cases"* / *"Crate & Barrel pieces have lived in our bakeries for years — and now they can live in yours."* Evergreen hero underneath: **"Big Cookies Baked in the Big Apple."**
- **Product description style:** **pure sensory, zero spec.** *"The cookie that started it all!"* … *"crispy on the outside with a satisfyingly thick and gooey center"* … *"Every bite is packed with semi-sweet chocolate chips and chunks of walnuts."* Then packaging as sensory too: *"packed in beautiful cellophane bags with hand-tied blue ribbons."*
- **Voice:** warm, proud, New York, exclamation-friendly. Origin: *"In 1995, our shared passion for breads urged us to open a little neighborhood bakery on W. 74th Street… our little shop became an overnight sensation."*
- **Fresh/craft:** operationalised, not adjectival — *"Handmade with love and the best ingredients in NYC since 1995. We bake fresh and ship same-day, so cookies arrive ready to enjoy."* and *"Cookies are baked fresh to order and shipped direct from NYC."*
- **CTA:** "Shop All Cookies & Gifts," "Add to Bag," "Shop Corporate," "Select Location to Order," "Unlock Free Shipping."

### (b) IA
Nav: Cookies & Gifts · **Same Day Pickup or Delivery** · Gift Guide · Levain for Crate & Barrel · Corporate Gifting · Events & Party Favors · Catering · Weddings · Bakeries · About · Cookie Club.
Collection uses tabs rather than filters: All · Assortments · Gifts · Cookies · Subscriptions · Merch.
**Clicks to order: 2.** Fulfilment mode is a *top-level nav item*, which is the single most Fillo-relevant IA decision on any of these eight sites.

### (c) PDP anatomy (verified, in order)
1. Gallery (4 images) → 2. Title + pack-size pricing (4-pack $32 / 8-pack $52 / 12-pack $82, 12-pack free ship) → 3. **Add to Bag** → 4. **Same-day pickup/delivery location selector** → 5. Allergens accordion → 6. Cookie care accordion → 7. Shipping accordion → 8. Full details → 9. Lifestyle imagery → 10. Media carousel → 11. "Perfectly Baked, Perfectly Wrapped" → 12. "Big Cookies Baked With Love" → 13. "Cookies Are Our Love Language" (gift messaging) → 14. **"30 Years of Sweet Reviews"** (5 press quotes, 1997–2022) → 15. "Try Our Other Recipes" cross-sell.
**No customer reviews, no star rating, no nutrition panel, no FAQ accordion on the PDP.** Press substitutes entirely for social proof.

Badge vocabulary on collection: Best Seller · New Flavor · Back for Summer · New for Summer · Made to Gift · Levain Exclusive · Limited Edition · Free with a 12pk.

### (d) Trust
Press wall, quoted on the PDP itself:
- *"Among local cookie mavens, they're considered as much a New York culinary icon as a Katz's hot dog or a Di Fara slice."* — New York Magazine
- *"…what may possibly be the largest, most divine chocolate chip cookies in Manhattan."* — The New York Times
- *"There's a reason we've called its chocolate chip-walnut cookie one of the best in America."* — Food & Wine
Plus 30-year founding story, bakery locations, and an **honest allergen disclaimer**: *"we are not an allergen-free bakery."*

### (e) Conversion
- **Delivery date selection is the centrepiece.** *"Select delivery date and calculate shipping at Checkout."* Orders up to **25 days ahead**; ship days Tue–Fri; nothing in transit over a weekend; noon ET cutoff Mon–Thu. There is even a **$0.00 "Delivery Date Request" product** used as a scheduling mechanism.
- Free shipping on 12-packs (up to $20 value); otherwise from $12.50 — plus an **"Unlock Free Shipping"** progress prompt.
- Local delivery & pickup orderable up to **4 days in advance**; same-day by zip code shown at checkout.
- Subscription: **Cookie Club** (monthly and prepaid). Referral: **Give $15, Get $15**.
- Email capture: *"Be the first to know about new cookie launches, special promotions, and exclusive surprises we've baked just for you."*
- Honest hard line: *"Given the perishable nature of our cookies, we aren't able to accept returns… final sale."*

### (f) Steal / avoid
- **Steal:** **"Same Day Pickup or Delivery" as a primary nav item**, and the PDP's fulfilment-selector sitting *directly under Add to Bag*. For Fillo, the equivalent is "Find the Van / This Week's Drop" as nav item #1, and a route-and-slot selector immediately under the buy button. Also steal the **storage-and-reheat module** — *"warm the cookie in a 350-degree oven for a few minutes or until gooey"* — it extends the product experience past delivery and is trivially adaptable to Japanese milk bread.
- **Avoid:** letting a collab takeover displace the positioning line. A first-time visitor currently lands on a homewares partnership rather than "Big Cookies Baked in the Big Apple." Fillo's hero must always answer *what is this and how do I get it*.

---

## 7. GAIL's
**URLs:** https://gails.com/ (gailsbread.co.uk 301s here) · /collections/all · /collections/all/products/almond-croissant · /pages/faqs

### (a) Copy
- **Announcement bar:** *"Order by 11am tomorrow for delivery on Sunday"* — a **live, computed logistics sentence in the highest-attention slot on the site.** Not a discount. This is the standout mechanic of the whole set.
- **Homepage headline:** *"Our Craft Community"* / *"We are nothing without the craftspeople who make and grow our food."*
- **Product description style:** **plain, ingredient-honest, occasionally confessional.** Almond Croissant: *"Made using twice-baked, unsold croissants and topped with almond frangipane and flaked almonds. May contain almond shell. Part of our Waste Not range."* They tell you it's yesterday's croissant — and make that a virtue.
- **Voice:** understated British, supplier-reverent, anti-industrial. *"Craft is passed from one generation to the next through people, not processes."* Section headings read like a magazine: "Inspired by ingredients," "What makes a better loaf?", "Meet Mary and Jane Quicke," "Handmade Loaves," "We Welcome You Inside," "Some kind words."
- **Fresh/craft:** by **naming the humans** (a named cheesemaker gets a homepage section) and by process words: handmade, freshly baked, *"The food will be freshly made, to order."*
- **CTA:** "Order," "Add to basket," "Explore Bread," "Find your nearest bakery," "Sign up Here."

### (b) IA
Nav: For the Office · For Home · Hamper & Gifts · Catering · Journal · Loyalty · About · Visit Us.
**Nav is segmented by occasion/buyer, not by product** — the first two items are audiences. Footer carries Bakery Menu, Allergens, Impact Report, App, Same Day Click & Collect, Loyalty T&Cs.
**Clicks to order: 2–3.** 263 SKUs across 14 categories; much shows "Sold out," which the site does not hide.

### (c) PDP anatomy
Title → price (£4.20) → quantity stepper → description → allergen disclaimer (*"we cannot guarantee our food and drinks are free from allergens"*) → Allergens accordion → **Click & Collect section** → **Local delivery section** → Deliveroo option → cutoff line → £20 minimum spend line → **Add to basket** → related carousels (pantry, drinks). No reviews on PDP.

### (d) Trust
"Some kind words" testimonial block, named suppliers, Impact Report 2023, Allergens hub, Modern Slavery / Tax Strategy / Gender Pay Gap / Menopause Action Plan pages. Trust here is **institutional-ethical** rather than press-driven.

### (e) Conversion — the most complete logistics stack of the eight
- Order up to **30 days in advance, until 11am two days before the delivery date.**
- **One-hour delivery slots, 8am–4pm daily**, including bank holidays.
- **£20 minimum spend**; flat **£14.95** delivery fee.
- Same-day Click & Collect any time during bakery hours; *"Designated collection areas eliminate waiting"*; same-day orders can't be cancelled.
- One delivery attempt only: *"If no one is available to receive it, the order will be taken back to our bakery."*
- Honest limitation: *"we can't assure it will arrive hot."*
- **Loyalty app:** *"Collect nine stamps on our loyalty app and enjoy a barista made drink or loaf of bread on us."*
- Postcode serviceability gate.

### (f) Steal / avoid
- **Steal:** the **computed cutoff sentence in the announcement bar.** Fillo's version — *"Order by Thursday 6pm for Saturday's Indiranagar stop"* — is the single highest-leverage piece of copy the site can carry, because it converts a confusing model (a moving van) into one imperative sentence, and it creates real urgency without a discount. Also steal the **"Waste Not" honesty** — naming a constraint and making it a range.
- **Avoid:** a catalogue where most items read "Sold out." Sold-out is powerful for a drop *when it's the exception*; at 263 SKUs it reads as a broken site. Fillo should keep the drop menu small enough that sold-out is an event.

---

## 8. Hotplate (weekly-drop micro-bakery platform)
**URLs:** https://www.hotplate.com/ · /product · https://www.blog.hotplate.com/blog/selling-food-via-pre-order-drops-z4gey · https://help.hotplate.com/en/articles/13730387-how-hotplate-works · /13730404-how-to-sell-out-your-first-drop
Example storefronts (client-rendered, no crawlable copy): /bakesalecookiellc · /thecommoncookie · /littlelovebakeryandtreats · /bunningsbakery

### (a) Copy
- **Platform hero:** *"The #1 food drop platform"* / *"Powering the hottest [rotating food nouns]"* / *"Build your customer list, post a drop, get orders, and sell out on your schedule."*
- **The category-defining sentence:** *"A drop is just a preorder window with a clear start and end time."* And: *"A drop is when a limited supply of product becomes available for purchase all at once."*
- **Operating promise:** *"Customers order and pay ahead of time during a set window. You make exactly what's ordered — nothing more, nothing less."*
- **Voice:** blunt, operator-to-operator, verb-led. *"Never oversell. Ever."* / *"Built to sell out fast."*
- Storefront copy is seller-written; the platform supplies structure, not tone.

### (b) IA
Storefront IA is deliberately near-zero: shop name + bio + the current/next drop + menu + checkout. No nav, no about page, no blog. **Clicks to order: 1–2 from an SMS link.** The customer does not browse; they are *summoned*.

### (c) PDP anatomy
There is effectively **no PDP** — items are cards inside the drop, with name, photo, price, remaining inventory, and modifiers ("1-5 menu items, with minimal to no modifications" is the platform's own recommendation). The **drop page is the product page.**

### (d) Trust
Reviews & Loyalty is a built-in feature; the seller's bio and past-drop history carry the rest. No press, no guarantees, no institutional signals. Trust is **community-and-cadence based**: they sold out last week, therefore this is good.

### (e) Conversion mechanics — the richest of the eight
- **SMS list is the primary asset:** *"Customers get a text with a link to order every time you post a menu."* / *"Text your audience instantly. Automatic drop alerts, order reminders, and a built-in inbox."*
- **Order window** with explicit open/close times; *"Choose when orders open, set pickup windows, control inventory."*
- **Cart hold timer + waitlist:** *"Items reserve in-cart with a timer and customers can join a waitlist for sold out items."* Waitlisted customers are auto-notified if inventory frees up.
- **Countdown + live inventory:** *"Limited drops stoke demand. Countdown timers and real-time inventory create urgency."*
- **Hard inventory caps** — overselling is structurally impossible.
- **Pickup windows** at set locations, with ready-notification texts.
- **Deliberate scarcity as launch doctrine:** *"we recommend that you set low inventory for your first drop, even if you're able to produce more."*
- **Cadence doctrine:** open orders mid-week for weekend pickup — *"Dropping mid week gives your customers something to look forward to on the weekend."* Sellers *"see more consistent growth when their customers are prompted to purchase on a regular cadence."* A "duplicate +1 week" feature makes the cadence one click.
- **Sell-out as a marketing event:** announcing the sellout is treated as a message in its own right — reinforcing desirability, attracting non-subscribers, acknowledging unmet demand.
- Social layer: *"Between the pre-drop anonymous chat, the rush of trying to get what you want, the platform has become a hyper-social, competitive, and celebratory experience."*

### (f) Steal / avoid
- **Steal:** essentially the whole drop stack, rebuilt on Shopify — **SMS/WhatsApp list as the primary conversion asset, a stated order window with a countdown, per-item inventory caps shown live, a cart hold timer, a waitlist on sold-out items, and a "sold out in X minutes" recap post.** Also steal the doctrine: **under-produce deliberately** on early drops, keep the menu to 3–5 items with no modifiers, and open orders mid-week for weekend pickup.
- **Avoid:** Hotplate's zero-SEO, zero-context storefront. Its shop pages return nothing to a crawler and nothing to a stranger — they only work for someone who already got the text. Fillo needs both: a Hotplate-grade drop mechanic *and* a real brand/story/discovery surface for people who've never heard of the van.

---

## Cross-site pattern table

Legend: ● present · ◐ partial / weak / adjacent · ○ absent · GN = Ginza Nishikawa, SB = Sakimoto, TBD = The Baker's Dozen, BT = Blue Tokai, BSS = Bombay Sweet Shop, LV = Levain, GA = GAIL's, HP = Hotplate.

| Module | GN | SB | TBD | BT | BSS | LV | GA | HP | Count | Verdict |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|---|
| Founder / origin-story page | ● | ● | ● | ● | ● | ● | ● | ◐ | **8/8** | Table stakes |
| Physical location / pickup finder | ● | ● | ● | ● | ● | ● | ● | ● | **8/8** | Table stakes |
| Sensory-led product copy | ● | ● | ● | ◐ | ● | ● | ● | ◐ | **8/8** | Table stakes |
| Gifting / occasion lane | ● | ● | ● | ● | ● | ● | ● | ○ | **7/8** | Table stakes |
| Cross-sell / related items | ● | ● | ○ | ● | ● | ● | ● | ○ | **6/8** | Table stakes |
| FAQ or PDP accordion | ○ | ● | ● | ● | ● | ● | ● | ○ | **6/8** | Table stakes |
| Editorial / blog / library | ● | ● | ● | ● | ● | ○ | ● | ○ | **6/8** | Table stakes |
| Allergen / ingredient / shelf-life disclosure | ◐ | ● | ○ | ● | ● | ● | ● | ○ | **5–6/8** | Table stakes (non-negotiable for Fillo: eggless *is* the claim) |
| Announcement / utility bar | ○ | ○ | ○ | ● | ● | ● | ● | ● | **5/8** | Near-stakes |
| Email or SMS capture | ○ | ○ | ◐ | ● | ● | ● | ● | ● | **5/8** | Near-stakes — and the #1 gap on the sites that skip it |
| Storage / how-to-eat / reheat guidance | ● | ● | ○ | ● | ◐ | ● | ○ | ○ | **5/8** | Near-stakes |
| Committed date/slot/reservation mechanic | ● | ● | ○ | ○ | ○ | ● | ● | ● | **5/8** | Near-stakes |
| Free-shipping threshold or order minimum | ○ | ◐ | ○ | ● | ● | ● | ● | ○ | **4–5/8** | Common |
| Press / media wall | ● | ○ | ○ | ● | ● | ● | ○ | ○ | **4/8** | **Differentiator** |
| Serviceability gate (pin / postcode / zip) | ○ | ○ | ○ | ● | ● | ◐ | ● | ○ | **3–4/8** | **Differentiator** |
| Subscription / recurring plan | ○ | ● | ○ | ● | ○ | ● | ○ | ◐ | **3/8** | **Differentiator** |
| Customer reviews with star ratings | ○ | ○ | ○ | ◐ | ● | ○ | ◐ | ● | **2–4/8** | **Differentiator** (Levain deliberately uses press *instead*) |
| Order tracking page | ○ | ○ | ○ | ● | ● | ○ | ○ | ● | **3/8** | **Differentiator** |
| Counted proof ("3,22,172 hampers delivered") | ○ | ○ | ◐ | ○ | ● | ○ | ○ | ○ | **1–2/8** | **Rare differentiator** |
| Computed cutoff sentence in top bar | ○ | ○ | ○ | ○ | ○ | ○ | ● | ○ | **1/8** | **Rare differentiator** |
| Fulfilment mode as top-level nav item | ○ | ○ | ○ | ○ | ○ | ● | ◐ | ● | **2–3/8** | **Rare differentiator** |
| Taste/craving-led discovery tool | ○ | ○ | ○ | ● | ○ | ○ | ○ | ○ | **1/8** | **Rare differentiator** |
| Countdown + live inventory + cart timer + waitlist | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ● | **1/8** | **Rare differentiator — Fillo's whole model** |
| Availability-limit badge ("Mumbai only") | ○ | ○ | ○ | ○ | ● | ○ | ◐ | ○ | **1–2/8** | **Rare differentiator** |
| WhatsApp support entry point | ○ | ○ | ◐ | ○ | ● | ○ | ○ | ○ | **1–2/8** | **Rare differentiator (India-relevant)** |
| Loyalty / referral programme | ○ | ○ | ○ | ○ | ○ | ● | ● | ● | **3/8** | **Differentiator** |
| Constraint stated honestly as a virtue | ● | ● | ○ | ● | ● | ● | ● | ● | **7/8** | Table stakes among the *good* sites |

### The one pattern that cuts across everything

The eight sites split cleanly into two philosophies, and Fillo needs both halves:

- **The romance half** (Ginza Nishikawa, Sakimoto, Levain, GAIL's): one obsession, named humans, sensory-only product copy, no discounts, scarcity framed as an apology. These sites make you *want* it.
- **The logistics half** (Blue Tokai, Bombay Sweet Shop, GAIL's, Hotplate): serviceability gates, cutoff sentences, shelf-life statements, availability badges, inventory caps, tracked orders. These sites make you *trust* that you'll actually get it.

Every site that failed at something failed by having only one half. TBD has romance and no way to buy. Hotplate has mechanics and no reason to care. **GAIL's and Levain are the only two that carry both — and both do it by putting a logistics sentence in a romance slot** (GAIL's cutoff in the announcement bar; Levain's fulfilment picker directly under Add to Bag). That is the specific move Fillo should copy, because a moving van is 100% a logistics problem wearing a romance product.

---

## Appendix: all URLs fetched

**Ginza Nishikawa** — https://www.ginza-nishikawa.co.jp/ · https://www.ginza-nishikawa.co.jp/bread · https://www.ginza-nishikawa.co.jp/bread/sweetbeanbread · https://www.ginza-nishikawa.co.jp/reservation
**Sakimoto Bakery** — https://shokupan-sakimoto.com/ · https://shokupan-sakimoto.com/shokupan/ · https://shokupan-sakimoto.com/shokupan/gokunama-milk-butter/ · https://shokupan-sakimoto.com/jam/ · https://shokupan-sakimoto.com/shop/ · https://shokupan-sakimoto.com/company/ · https://sakimoto.shop-pro.jp/
**The Baker's Dozen** — https://thebakersdozen.in/ · https://www.thebakersdozen.in/shop/ · https://thebakersdozen.in/our-story · https://www.thebakersdozen.in/faq · https://blog.thebakersdozen.in/
**Blue Tokai** — https://bluetokaicoffee.com/ · https://bluetokaicoffee.com/collections/all-products-collection · https://bluetokaicoffee.com/products/attikan-estate-easy-pour-coffee-sachets · https://bluetokaicoffee.com/pages/pick-your-flavour
**Bombay Sweet Shop** — https://bombaysweetshop.com/ · https://bombaysweetshop.com/collections/all · https://bombaysweetshop.com/products/gulab-jamun · https://bombaysweetshop.com/pages/about-us · https://bombaysweetshop.com/pages/track
**Levain Bakery** — https://www.levainbakery.com/ · https://www.levainbakery.com/collections/cookies · https://www.levainbakery.com/products/chocolate-chip-walnut-cookies · https://levainbakery.com/pages/shipping · https://levainbakery.com/pages/faq · https://levainbakery.com/products/requested-delivery-date
**GAIL's** — https://gails.com/ · https://gails.com/collections/all · https://gails.com/collections/all/products/almond-croissant · https://gails.com/pages/faqs
**Hotplate** — https://www.hotplate.com/ · https://www.hotplate.com/product · https://www.blog.hotplate.com/blog/how-pastry-businesses-grow-on-hotplate · https://www.blog.hotplate.com/blog/selling-food-via-pre-order-drops-z4gey · https://help.hotplate.com/ · https://help.hotplate.com/en/collections/18465761-getting-started · https://help.hotplate.com/en/articles/13730387-how-hotplate-works · https://help.hotplate.com/en/articles/13730404-how-to-sell-out-your-first-drop
