# Fillo Bakes — India-Specific Commerce UX
_UX research phase 5 of 5. Compiled 27 Aug 2026. Desk research; India data preferred, global proxies marked `[GLOBAL PROXY]`._

**Context assumed:** Japanese-inspired eggless bakery van, Bengaluru. Shopify checkout behind a v0/Next.js front end. 23 SKUs, ₹99–₹280. Existing checkout already has a date picker (30 days out) + 4 time slots (12–2, 2–4, 4–6, 6–8 PM). No pincode/serviceability check anywhere. Live van GPS tracker exists but is buried in a corner pill. WhatsApp-heavy customer base.

**How to read the spec lines:** each `→ FILLO SPEC` is one shippable, unambiguous instruction. They are numbered `F1…F26` so they can be lifted into a build backlog.

---

## 0. The three numbers that govern every decision below

| Number | Value | Why it decides things |
|---|---|---|
| Mobile share of Indian e-comm traffic | **70–78%** of sessions; mobile converts at ~1.4–2.0% vs 3.2–4.1% desktop | Every module below is a phone module first. Desktop is a courtesy. |
| UPI share of Indian digital payments | **~85%** of digital transactions (FY25-26, NPCI) | Payment UI is a UPI UI. Cards are a fallback, not a peer. |
| WhatsApp users in India | **500M+**, and **91% of online Indian adults message a business weekly** | WhatsApp is not a support channel bolted on. It is a primary storefront surface. |

Baseline conversion targets for an Indian D2C Shopify store: average ~1.2–1.5%, good 1.8–3%, top-decile 3–4%+. Fillo should be underwriting toward 2.5%+ because it is a repeat-purchase staple (bread), not a considered purchase.

---

## 1. Quick-commerce UI patterns — what Blinkit/Zepto/Instamart trained Bengaluru to expect

Bengaluru is the single most quick-commerce-saturated city in India: **~153 sq ft of dark-store space per 1,000 residents vs a national average of ~51 sq ft — roughly 3× the national concentration** (ICICI Securities, via Storyboard18). A Fillo customer in Indiranagar or Banaswadi opens your site with Blinkit muscle memory already loaded. You cannot ignore those conventions; you can only decide which to honour and which to deliberately refuse.

### 1.1 Address-first / location-gated entry — **ADOPT (adapted)**
**Pattern.** Blinkit, Zepto and Instamart resolve location *before* they show a catalogue. Dark-store selection precedes browsing, with the nearest store auto-selected as default. The user has been trained that "where are you?" is question one, and that answering it unlocks the store.
**Evidence.** ProductGrowth's quick-commerce UX teardown describes dark-store selection as the pre-browse step; every major q-comm app opens with a location chip in the top bar that is the most-tapped element on the screen.
**Why it matters for Fillo.** A moving van bakery is *more* location-dependent than a dark store, not less. Your current site lets a customer in Whitefield build a ₹700 cart and discover serviceability never. That is the single largest known UX defect in the funnel.
**Reject the harsh version:** do not hard-gate the catalogue behind a pincode wall. Premium browsing is part of the sell, and a wall on a first visit from an Instagram click kills discovery.

> **→ FILLO SPEC F1.** Put a persistent location chip in the sticky header, left of the logo, reading `📍 Deliver to — Set area` on first visit and `📍 Banaswadi · Tomorrow 4–6 PM` once set. Tapping opens a bottom sheet with area-name autocomplete (not raw pincode entry first). Catalogue stays fully browsable unset; the chip turns amber, never blocks.

### 1.2 Speed framing / countdown as the hero promise — **REJECT, and replace**
**Pattern.** Q-commerce leads with a number: "10 mins", "8 mins", a live countdown on the tracking screen ("9:47 remaining"). The countdown creates urgency, prevents cart edits, and creates accountability.
**Evidence.** ProductGrowth documents countdown placement across tracking screen, post-order homepage, and push. Speed *is* the value proposition for the category.
**Why Fillo should reject it.** Fillo cannot win a speed war and should not enter one — shokupan is proofed and baked, not picked from a shelf. More importantly, competing on minutes reframes a ₹250 loaf as a convenience commodity, which is exactly the frame that makes ₹250 feel expensive. Premium bakeries in India (Subko, Blue Tokai) never lead with delivery speed; they lead with process and origin.
**The replacement.** Substitute *baking-time certainty* for *delivery-time speed*. The equivalent emotional payload is "it will be fresh and it will be exactly when you said", not "it will be fast".

> **→ FILLO SPEC F2.** Replace any speed language in the hero with a freshness-window line: `Baked this morning · Delivered in your 2-hour window`. On the order-confirmation and tracking screen, show a bake-then-deliver timeline (Baked 6:00 AM → Loaded 11:30 AM → Your window 4–6 PM), not a countdown timer.

### 1.3 Search-first vs browse-first — **REJECT for Fillo**
**Pattern.** Q-commerce is search-first because **~70% of Zepto orders are reorders** — the user knows the SKU name and is typing it. Target time from search to checkout is 45 seconds.
**Evidence.** ProductGrowth, quick-commerce UX.
**Why reject.** With 23 SKUs and names like *Kyoto Curry*, *Seoul Spice*, *Calcutta Blaze*, *Bangalore Bloom*, a first-time visitor cannot search for what they cannot name. Your naming system is a discovery asset, and search actively hides it. Search becomes correct only once repeat-purchase share is high.
**But adopt the reorder half.** The reorder instinct is real and transferable: one-tap reorder increases repeat frequency by ~20% in q-comm.

> **→ FILLO SPEC F3.** No search field in the header until the catalogue exceeds ~40 SKUs. Instead, for any returning visitor (localStorage or logged-in), inject a `Order again` row as the first module below the hero: horizontal cards of their last 3 ordered items with a single `Add` button each, no variant modal.

### 1.4 Item-card anatomy — **ADOPT the structure, REJECT the density**
**Pattern.** The q-comm card is: square image → name (2 lines, truncated) → weight/qty → price → a compact `ADD` button that becomes a `− 1 +` stepper in place. Cards sit in a 2-up grid. Everything is optimised for scan rate and tap count.
**Evidence.** Blinkit/Instamart lead with polished, dense vibrant grids; Zepto's minimalist speed-focused UI "can feel cluttered for niche items" (Nectarbits comparison) — an explicit warning for a niche premium catalogue.
**Fillo's version.** Keep the ADD-becomes-stepper mechanic (your site already has steppers — good). Reject the density: a ₹250 loaf photographed at 160px in a 2-up grid reads as a ₹40 loaf. Premium Indian D2C runs bigger, airier cards with a descriptive line — Blue Tokai's cards carry tasting notes ("Raspberry, Plum Tart, Marigold, Red Cherry") right on the card, which is the mechanism that justifies the price *before* the tap.

> **→ FILLO SPEC F4.** Product card = 4:5 image, product name, **one 4–6 word flavour/texture note in italic small caps** (Blue Tokai tasting-note pattern, e.g. *Milky, cloud-soft, faintly sweet*), price, then a right-aligned `Add` pill that morphs into `− 1 +` in place. Grid is 2-up on mobile with 16px gutters and generous vertical rhythm — never more than 2 rows visible per scroll.

### 1.5 Stock transparency and scarcity — **ADOPT, honestly**
**Pattern.** Show a count only when there is genuine scarcity ("12 left", "Low stock"); items with plenty just say "In stock". Q-comm shows per-dark-store availability to prevent post-checkout disappointment.
**Evidence.** ProductGrowth: stock-level transparency "creates urgency without lying".
**Why it fits Fillo unusually well.** A van has a literally finite load. Scarcity is not a growth-hack here, it is a fact — which makes it credible in a market that has learned to discount fake urgency.

> **→ FILLO SPEC F5.** Show `Only 6 loaves on today's van` only when true daily stock ≤ 10; otherwise show nothing. Sold-out items stay in the grid, greyed, with a `Notify me` button that captures a phone number for a WhatsApp ping — never hide sold-out SKUs.

### 1.6 The "Weekly Specials" empty tab — **FIX or REMOVE**
Q-commerce has trained users that every tab is populated. An empty filter tab reads as a broken site, and the audit found `Weekly Specials` returns zero items.

> **→ FILLO SPEC F6.** Hide any category tab that resolves to zero products at render time. Never ship an empty tab.

---

## 2. Checkout India

Global baseline: documented cart abandonment averages **70.22%** (Baymard meta-analysis, Sept 2025), with mobile at **~80%** vs desktop ~66%. Top fixable causes: extra/unexpected costs (**48%**), forced account creation (**~25%**), checkout too long (**~18%**). Fixing major checkout UX defects is worth up to **~35%** conversion uplift. `[GLOBAL PROXY — Baymard is US-panel; the India-specific overlays are below.]`

### 2.1 UPI-first payment UX
**Pattern.** UPI is not one option among six. It is ~85% of digital payments and should occupy roughly that share of visual weight. The correct mobile pattern is **UPI Intent** — tap `Pay with UPI` → OS app-switch to GPay/PhonePe/Paytm → biometric → return. Not a collect request typed into a VPA field. Collect requests expire and are a documented failure mode; intent flows do not.
**Evidence.** UPI at ~85% of digital transactions; P2M volume 67.01bn in H1 2025, +37% YoY; merchant-side blended success rates 92–96%; system-wide technical declines down to ~0.8%. Razorpay reports **~15% conversion lift** from Magic Checkout generally and **18–30% uplift** where the address step was the abandonment point, partly via deep UPI integration and prefill across a ~100M-user network.
**The premium wrinkle.** At ₹99–₹280 AOV, ticket sizes sit comfortably inside UPI-lite/one-tap territory. There is no EMI conversation to have, which means you can cut the payment UI down to almost nothing — a virtue.

> **→ FILLO SPEC F7.** Payment step shows three things, in this order and this hierarchy: (1) a full-width primary `Pay ₹X via UPI` button that fires **UPI intent** with app icons (GPay, PhonePe, Paytm) rendered inside it; (2) a single collapsed row `Cards, Net Banking, Wallets`; (3) COD per F9. No VPA text field on mobile. No EMI, no BNPL — they cheapen a ₹250 loaf.

### 2.2 COD psychology at premium price points
**Pattern.** COD is ~42% of India D2C orders but carries **24–38% RTO** (25–30% typical) against **2–3%** for prepaid. COD resistance is *regret psychology*, not habit — the buyer is buying an option to change their mind, so trust signals move the needle as much as discounts do.
**Evidence.** A ₹49 checkout discount plus a WhatsApp payment-link nudge within 8 minutes of a COD order moved one brand's COD share from 68% → 52% and RTO from 29% → 21% in 45 days. Small prepaid incentives (₹30–₹100 or free shipping/gift wrap) typically shift **10–15%** of COD orders to prepaid; well-run COD→prepaid programmes report 25–35% conversion.
**The Fillo-specific case for restricting COD.** Fillo is *scheduled, perishable, van-delivered*. An RTO is not a return to a warehouse — it is a loaf that is now waste, on a van with finite capacity, in a slot that could have gone to someone else. Fillo's real RTO cost is ~100% of COGS plus a lost slot. This justifies a harder line on COD than a typical D2C brand.
**But do not remove COD silently.** COD availability is a trust signal in itself for a brand founded in Dec 2025 with no reputation yet. The pattern that resolves this: **offer COD, price it, and make prepaid visibly the better deal.**

> **→ FILLO SPEC F8.** Cap COD at first order only and at cart values ≤ ₹500; above that, show COD greyed with the line `Prepaid only for larger orders — keeps the van light`.
> **→ FILLO SPEC F9.** Show COD as the third payment option with an explicit `+₹30 handling` and, adjacent, `Pay now and save ₹30` on the UPI button. Trigger a WhatsApp payment-link message within 10 minutes of any COD order placed, offering the same ₹30 back.

### 2.3 Address UX for Indian addresses
**Pattern.** Indian addresses are landmark-and-locality shaped, not street-and-number shaped. Google's own product research states plainly that "People in India are used to communicating their addresses relative to a landmark or an area name" — behind the post office, opposite the college. Google shipped **Address Descriptors** across **25 Indian metro areas**, returning a **stack-ranked list of the five most relevant landmarks** via Reverse Geocoding, ML-ranked on proximity, prominence and visibility, at no extra cost.
**Evidence.** Google Maps Platform launch post (announced at I/O Connect Bengaluru). Field-type research confirms Indian forms typically need four distinct fields — building/apartment, street, locality, landmark — with **no common standard** for how sites group them, and many users genuinely do not know the "official" version of their own address.
**Bengaluru specifics.** Apartment-society names (Prestige, Sobha, Brigade, Purva…) are the functional address unit in the east/south-east belt where the van runs. Gate numbers, tower letters and block names matter more than street names. A single-line "Address" textarea is the pattern that actually matches how people talk — but it is unroutable for a van driver.

> **→ FILLO SPEC F10.** Address form field order and labels, mobile: `Flat / House no.` → `Apartment or building name` (autocomplete against a Bengaluru society list) → `Street / Area` → `Landmark (helps our driver find you)` → `Pincode` (auto-fills area, never asked first) → `Bengaluru` prefilled and locked. Landmark is optional-but-encouraged with helper text, not a required blocker.
> **→ FILLO SPEC F11.** Offer `Use my location` above the form; on grant, pre-fill area + pincode and surface 3 nearby landmark chips the user can tap to fill the landmark field (Address Descriptors pattern).

### 2.4 Phone-number-first identity vs email
**Pattern.** In India the phone number *is* the identity primitive. OTP login (`enter phone → OTP → in`) removes passwords entirely; documented reductions in checkout abandonment around 28% when replacing password login with OTP. Phone numbers double as identity precisely because COD and delivery coordination run on them.
**Evidence.** Webkul/mojoauth case data `[VENDOR-SOURCED — treat the 28% as directional, not gospel]`; the structural argument (phone = identity in India) is uncontested and is why every Indian app from Swiggy to Zepto opens with a 10-digit field.
**Fillo's current defect.** Fillo+ membership signup is **email-based**, which is backwards for a WhatsApp-heavy customer base and severs the loyalty account from the WhatsApp identity you actually message people on.

> **→ FILLO SPEC F12.** Make the 10-digit mobile number the primary and only required identity field at checkout, with `+91` fixed and non-editable. Email becomes optional, labelled `Email (for your invoice)`. Migrate Fillo+ to phone-number identity so the loyalty account, the order, and the WhatsApp thread are one record.
> **→ FILLO SPEC F13.** Guest checkout is the default path and must never be behind a "Continue as guest" secondary link — account creation, if offered at all, is a post-purchase checkbox: `Save my details for next time`.

### 2.5 Cost transparency
48% of abandonment traces to costs appearing late. Indian buyers are documented as unusually shipping-sensitive; a small delivery fee on a small cart tips a ready buyer. Q-commerce has set the free-delivery threshold anchor at **₹199–₹299**; general D2C tests cluster at ₹500/₹999. Fillo's current ₹500 coupon threshold (FILLO10) is doing AOV work but is a *discount* threshold, not a *delivery* threshold, and the two get confused.

> **→ FILLO SPEC F14.** Display the delivery fee and the free-delivery gap on the product page and in the cart drawer, never first at checkout. Single line, always visible in the cart: `Delivery ₹49 · Add ₹120 for free delivery` with a thin progress bar. Set the free-delivery threshold at ₹399 (between the q-comm anchor and your ₹500 coupon, so the two nudges stack rather than collide).

---

## 3. WhatsApp commerce UX

### 3.1 Browse-on-site, buy-on-WhatsApp — **ADOPT as a parallel path, not the main one**
**Pattern.** The dominant Indian conversational-commerce shape is: discovery on Instagram/site → intent expressed in chat → catalogue or payment link sent in-thread → payment completed without leaving WhatsApp. In-chat payment links are reported to cut cart abandonment ~30% vs redirect-to-website checkout, and WhatsApp-led commerce conversion figures of 45–60% get quoted against 2–5% for sites. `[VENDOR-SOURCED — the 45–60% number is measured on already-engaged chat traffic, not cold traffic; it is a channel-quality artifact, not proof that chat beats web. Do not plan against it.]`
**The honest read.** WhatsApp does not out-convert your website. It converts the subset of people who were already going to buy but had one blocking question — "do you deliver to my area", "is it really eggless", "can I get it Sunday". For Fillo, those three questions are *exactly* the ones the site currently fails to answer. So WhatsApp is a leak-plugging surface, and the correct long-term move is to answer those questions on-site and let WhatsApp handle the residue.

> **→ FILLO SPEC F15.** Every WhatsApp CTA on the site opens `wa.me` with a **pre-filled contextual message**, never a blank thread. From a PDP: `Hi Fillo — is the Blue Pea Bread available this week? (from website)`. From an out-of-area serviceability message: `Hi Fillo — I'm in [area], when will the van reach us?`. Pre-filled context is what makes chat cheap to staff.

### 3.2 Click-to-chat button placement
**Pattern.** The default floating WhatsApp bubble bottom-right is the near-universal Indian implementation. Its cost is that it sits in the thumb's green zone and competes with the primary commerce CTA.
**Evidence.** Every marketing-side source recommends the persistent bubble; no independent placement study for India was found in this research. `[EVIDENCE GAP — placement here is reasoned from thumb-zone research (§4.3), not from an India A/B dataset.]`
**Fillo's conflict.** Fillo's bottom-left already holds the van-tracker pill and the bottom edge needs to hold the sticky `Add to cart`. Three floating elements on a 6-inch screen is a mess.

> **→ FILLO SPEC F16.** One floating element only. Bottom-right bubble is WhatsApp; the van tracker is promoted out of a pill into a real homepage module (§7) and a shareable `/van` page. Sticky bottom bar (`Add · ₹X`) takes the full bottom edge on PDPs and the WhatsApp bubble shifts up 72px on those pages so it never overlaps the buy button.

### 3.3 Catalogue inside WhatsApp
**Pattern.** WhatsApp Catalogues list products with price and description in-chat; Collections group them into categories, creating a browsable layer without leaving the app. The flow is: browse catalogue → add to WhatsApp cart → receive payment link in-thread.
**Fillo's fit.** 23 SKUs is *exactly* the right size for a WhatsApp catalogue — small enough to browse in-thread, too small to need search. Larger catalogues break the pattern.

> **→ FILLO SPEC F17.** Publish all 23 SKUs to a WhatsApp Business catalogue with 4 collections mirroring the site (Breads · An Pan & Kare Pan · Pies & Strudels · Fruit Sandos), each item carrying the same one-line flavour note as the site card (F4), so a customer sees the same words in both places.

### 3.4 Order-status expectations
**Pattern.** WhatsApp open rates run 95–98% vs 20–25% for email — a 4–5× advantage. Indian buyers now expect proactive order-status messages, and live GPS/location sharing during delivery is an established WhatsApp commerce feature. Post-purchase WhatsApp support is credited with material churn reduction in tier-1 cities.
**Fillo's unfair advantage.** Fillo already has a live GPS feed of the van updating every 15 seconds. Nobody else in premium Bengaluru bakery has that. It is currently a widget; it should be a message.

> **→ FILLO SPEC F18.** Four WhatsApp templates, no more: (1) **Order confirmed** — items, date, slot, one `Track the van` deep link; (2) **Baked & loaded**, sent the morning of delivery with a photo of that morning's bake; (3) **Van is ~15 min away**, with the live tracker link; (4) **Delivered** — reorder link + a single-tap rating. Nothing else, ever, without opt-in.

---

## 4. Mobile reality

### 4.1 Traffic share and the conversion gap
**Data.** Mobile is 70–78% of Indian e-comm traffic; mobile-first browsing cited at ~78%. On Shopify globally, mobile is 74–78% of traffic but only 55–62% of revenue. India mobile CVR 1.4–2.0% vs desktop 3.2–4.1%. `[Shopify split is GLOBAL PROXY.]`
**Interpretation.** The mobile/desktop conversion gap is not a device fact, it is a design debt measurement. Everything in this document is an attempt to close it.

> **→ FILLO SPEC F19.** Set an explicit target in analytics: mobile CVR ≥ 60% of desktop CVR within one quarter. Instrument the funnel at five steps — view → add → cart → address → pay — and report the mobile/desktop delta at each. The step with the largest delta is the next thing you fix.

### 4.2 Performance budget on mid-range Android
**Data.** LCP target < 2.5s, INP < 200ms. Google's retail research: a **0.1s** mobile load-time improvement lifted retail conversions **8.4%**. Practitioner guidance for India is blunt: heavy JS frameworks destroy mid-range Android performance, and every marketing pixel and chat widget adds **200–800ms**.
**Fillo's exposure.** The site is a v0-generated Next.js app already carrying GA4 **and** Contentsquare **and** an OpenStreetMap widget **and** (per specs above) a WhatsApp widget. That is four third-party payloads on a bakery site. Contentsquare in particular is a heavyweight session-replay tool that is hard to justify at Fillo's current traffic.
**Data-cost sensitivity.** India has cheap data by global standards, so raw MB cost is a weaker argument than it was in 2018 — but the *device* constraint (mid-range Android CPU parsing JS) is the real ceiling, and image weight is the biggest lever on a bakery site, where photography is the product.

> **→ FILLO SPEC F20.** Budget: **LCP < 2.5s on a throttled mid-tier Android over 4G**, total JS < 200KB gzipped, hero image < 120KB. Ship all product photography as AVIF with WebP fallback, `srcset` at 2 breakpoints, lazy-load everything below fold, and reserve aspect-ratio boxes so CLS is 0. Drop Contentsquare until traffic justifies it; keep GA4 only.

### 4.3 Thumb-zone layout
**Data.** ~49% of smartphone users navigate one-handed. The green zone is bottom-centre; the red zone is the top corners, which are functionally unreachable on 6"+ devices. Minimum touch targets: 44×44pt (Apple) / 48×48dp (Android). Bottom-aligned navigation correlates with lower bounce. `[GLOBAL PROXY — thumb-zone research is Hoober/UXmatters lineage, not India-specific, but device sizes in urban India match or exceed the studied population.]`

> **→ FILLO SPEC F21.** Every primary action lives in the bottom 30% of the viewport: sticky `Add · ₹X` bar on PDPs, sticky `Checkout · ₹X` bar on cart, bottom-sheet (not modal-centre) for variant pickers, slot picker and location. Top bar carries only logo, location chip and cart count — nothing tappable that matters. All targets ≥ 48dp with ≥ 8dp separation.

### 4.4 Vernacular / bilingual UI for Bengaluru — where Kannada warms and where it clutters
**Data.** Vernacular UI is a proven conversion lever *in the right segment*: Meesho gets ~60% of orders from tier-4+ cities where ~70% of customers prefer vernacular, and reports faster journeys and more repeat ordering post-launch; platforms supporting vernacular report up to 3× time-on-site and 7× engagement, and 84% of consumers find regional-language content more relatable and trustworthy. Amazon added Kannada in 2020; Flipkart supports Kannada.
**The counter-evidence for Fillo's specific segment.** Those gains concentrate in tier-2/3/4 and lower-income cohorts. Fillo's buyer is an urban Bengaluru resident paying ₹250 for Japanese milk bread — a cohort that transacts in English by default and where a substantial share are non-Kannada-speaking migrants. A full Kannada UI toggle would be expensive, under-used, and would dilute a Japanese-premium visual identity built on restraint. Note also that "Bengaluru Kannada" is itself a heavily code-mixed urban register — the market reality is mixing, not switching.
**Where Kannada *does* warm.** Not in the UI chrome. In the **brand voice**: a greeting, a thank-you, a driver's line, a sticker on a box. The Fillo origin story is explicitly neighbourhood bread-vendor nostalgia — that story is Kannada-flavoured whether the checkout is or not. Kannada script used as a *warmth signal* costs nothing and reads as local rootedness; Kannada used as a *localisation layer* costs a lot and reads as clutter.

> **→ FILLO SPEC F22.** Ship the UI in English only. Use Kannada in exactly three places: the order-confirmation WhatsApp opener (`ಧನ್ಯವಾದಗಳು! Your bread is booked`), the van-tracker module header, and physical packaging. No language toggle, no dual-label buttons, no transliterated product names.

---

## 5. Premium positioning in India — how the good ones signal worth-the-price on screen

### 5.1 The mechanism: substitute *process* for *discount*
**Pattern.** Premium Indian D2C never argues price. It replaces the price conversation with a process conversation, delivered in specifics.
- **Blue Tokai** puts **tasting notes on the card itself** — "Raspberry, Plum Tart, Marigold, Red Cherry" — plus a farm-origins carousel, "Limited Release" tags, a beginner-friendly module for first-timers, and a recommendation quiz. Price justification happens before the click.
- **Subko** leans on named craft vocabulary — in-house Arabica Q Graders, "Pod-to-Bar", "micro-batch rustic baking philosophy" — and radical geographic specificity (Karnataka, Meghalaya, Nagaland, Nepal, Sri Lanka) under "From the Subcontinent, For All". Minimalist logo, video backgrounds, conversational section heads.
- **Anand Sweets** runs the trust-marker stack: "Since 1988", "No Preservatives", ISO certification, "Loved by 5 lakh+ customers", regional specificity (Mysore Pak, Dharwad Peda, Ajmeri Kalakand), plus same-day Bangalore delivery via Swiggy/Zomato/Blinkit.
- **Khoya** runs the luxury-gifting stack: press logos (Vogue, GQ, NDTV), occasion- and recipient-based navigation ("For Family & Friends", "For Colleagues"), price-tiered gifting ("Under 2500" → "Above 10000"), named hampers ("The Big Brother — Rakhi Special"), and explicit city-level delivery promises (Delhi NCR same-day before 3 PM).
- Cross-cutting: Indian consumers "want to know ingredient benefits, routine logic, visible results, and why your formulation is worth a premium", and "routinely pay premiums for products that *look* better, because packaging signals quality and aspiration."

**Fillo's unused assets.** Three things are sitting on the floor: (a) the city-fusion naming system (Kyoto Curry, Seoul Spice, Calcutta Blaze, Bangalore Bloom) is a genuine premium signal presented as a plain product name; (b) the founders' story and the Dec 2025 origin; (c) the van itself, with live GPS — a provenance device more vivid than any farm carousel, currently rendered as a 40px pill.

**Fillo's active liabilities.** Homepage claims "100+ Items" against 23 real SKUs, and "500+ Lovers" against a stated 300+ tasters. Inflated round numbers are the fastest way to lose a premium buyer, who reads them as the tell of a cheap brand. Also: all three Fruit Sandos share one identical description — copy-paste is legible and it reads as carelessness at ₹280.

> **→ FILLO SPEC F23.** Replace every inflated stat with a specific true one: `23 recipes` not "100+ Items"; `300+ first tastings since December` not "500+ Lovers". Give every SKU its own 4–6 word flavour note (F4) and a 2-line "why this name" microcopy on the PDP — the Kyoto/Seoul/Calcutta naming is the premium argument, make it legible.
> **→ FILLO SPEC F24.** Add a persistent trust strip directly under the hero, four items, icons + 2-word labels: `100% Eggless` (green-dot mark) · `No preservatives` · `Baked daily` · `FSSAI [14-digit no.]`. The green vegetarian dot is legally meaningful in India and eggless is Fillo's core claim — display the mark, not just the word.

### 5.2 Gifting as an Indian conversion driver
**Pattern.** Gifting is a structurally larger driver in India than in most markets — Diwali, Raksha Bandhan, Eid, Christmas, Holi, plus a very large corporate-gifting layer. The premium end has converged on a repeatable flow: shop-by-occasion → shop-by-recipient → shop-by-price-band → named hamper → personalised message card → chosen delivery date. Anand Sweets runs dedicated Personal / Wedding / Corporate gifting pages; Khoya runs occasion + recipient + price-tier navigation; premium players are moving toward "handcrafted... meaningful, artisan-made" positioning over mass-produced.
**Why Fillo is well-placed and badly configured.** Fillo already has the hardest gifting component built — a **date picker 30 days out plus time slots**. That is precisely the machinery gifting needs, and it is currently framed as a logistics constraint rather than a gifting feature. Japanese bakery boxes are visually gift-shaped. What is missing is the message card, the recipient split, and the hamper SKU.

> **→ FILLO SPEC F25.** Add a `Send as a gift` toggle in the cart. When on, it reveals: recipient name + phone (delivery contact becomes the recipient, billing stays the buyer), a `Gift message` textarea capped at 140 characters (printed on a card, shown as a card-shaped preview), and a `Hide prices from recipient` checkbox default-on. Reuse the existing date+slot picker verbatim — relabel it `When should it arrive?` in gift mode.

---

## 6. Delivery-area UX

### 6.1 Pincode checker placement
**Pattern.** Indian e-comm standard is a pincode checker **on the product page**, above or beside the buy button, returning four things at once: serviceable yes/no, estimated delivery date, shipping charge, and COD availability. The stated purpose across every vendor implementation is reducing cart abandonment "caused by unclear delivery zones" and "checkout abandonment caused by delivery uncertainty". SMOOR — a premium Bengaluru cake brand — runs pincode availability checks plus per-locality landing pages (Koramangala, HSR, Indiranagar, Hennur, JP Nagar…) as its core order-flow UX.
**Evidence quality.** Placement consensus is strong; hard abandonment-delta numbers are vendor-claimed rather than independently measured. `[EVIDENCE GAP — no independent India A/B data on hero-vs-PDP-vs-cart placement was found. Recommendation below is reasoned from the consensus plus Baymard's 48%-late-costs finding.]`
**The placement question, resolved.** Not hero-only (a wall on first visit kills Instagram-driven discovery). Not cart-only (that is the late-cost failure Baymard measures). The answer is **all three, escalating**: a soft chip in the header (F1), an authoritative check on the PDP, and a locked-in confirmation in the cart.

> **→ FILLO SPEC F26.** PDP: directly under the price, a single-line inline check — `📍 Check delivery` expanding to a pincode/area input. On success it replaces itself with `✓ Delivered to Banaswadi · Next van: Tomorrow, 4–6 PM · Free over ₹399`. The result persists to the header chip and pre-fills checkout. One entry, three surfaces.

### 6.2 Out-of-area messaging and waitlist capture
**Pattern.** The default failure state — a red "Sorry, we don't deliver to your pincode" — throws away the highest-intent signal a moving bakery could receive. For a *van*, an out-of-area lookup is not a lost customer; it is **route-planning data and a demand cluster**. This is a genuine strategic asset unique to Fillo's model: nobody else's out-of-stock message tells them where to drive tomorrow.
**Design.** Reframe the negative as an invitation, capture phone (not email — §2.4), and make the promise specific and honest.

> **→ FILLO SPEC F26b.** Out-of-area state reads: `The van hasn't reached [Area] yet. Tell us you're there and we'll come sooner — we plan routes by demand.` → single phone-number field → `Notify me` → confirmation `You're #23 in [Area]. 40 requests and we add the route.` Store area + count; surface the top 5 waiting areas on an internal dashboard and, optionally, publicly on the `/van` page as a live demand map. A public counter turns waitlist capture into a shareable local-pride mechanic.

### 6.3 Slot-picker UX (existing Fillo picker: date + 4 slots)
**Pattern.** Best practice for scheduled delivery: show a live calendar/time picker rather than a vague estimate; make scheduling the default; **full slots disappear rather than appear-and-fail** — that is the critical link between logistics feasibility and customer choice; use smart defaults and suggest the next available slot rather than making users hunt; never leave AM/PM ambiguous; use visual availability indicators.
**Fillo's picker vs. that standard.** A **30-day-forward date picker with 4 static slots** has three defects. (1) 30 days is wrong for perishable bread — it implies a bakery that freezes. (2) Static slots mean a user can pick a slot the van cannot serve for their area, which converts a booking into an apology. (3) Slot choice arrives *at checkout*, after cart-building, which is exactly the late-constraint pattern that causes abandonment.
**The van-specific correction.** Slots for a moving bakery are not a grid — they are a **route**. The van is in Banaswadi at 4–6 PM whether or not the customer picks it. So the honest picker shows *the van's actual schedule for that area*, which is both more truthful and easier to build than open capacity management.

> **→ FILLO SPEC F26c.** Rebuild the picker as an **area-aware route picker**: cap the date range at **7 days** (bread, not hampers); after area is known, show only the dates and windows the van actually serves that area, each with a live-capacity state (`4 slots left` / `Full`, with full slots rendered disabled-and-greyed, not hidden, so the user learns the pattern); default-select the **next available** slot so a user who ignores the picker still gets a valid order; label windows unambiguously (`4:00–6:00 PM`, never `4–6`). Surface the chosen slot in the header chip from PDP onward, not first at checkout.

---

## 7. Mobile homepage anatomy — first-time Bengaluru visitor, on a phone

Design intent: answer the four questions a first-timer actually has, in the order they have them — **What is this? Do you come to me? Is it worth ₹250? How do I get one?** — while keeping the premium restraint that justifies the price. Each module is one thumb-scroll.

| # | Module | Content | Why here |
|---|---|---|---|
| **0** | **Sticky header** (48px) | Logo · `📍 Set area` chip · cart count | Location chip is q-comm muscle memory (F1); nothing else competes |
| **1** | **Hero** — one photograph, one line | Full-bleed shokupan cross-section. `Japanese milk bread. Baked this morning. Delivered to your door in a 2-hour window.` One primary button: `See today's bake`. **No carousel.** | Answers "what is this" in one sentence. Carousels destroy LCP and are ignored; a single image is the premium signal (Subko pattern) |
| **2** | **Trust strip** | `100% Eggless` (green dot) · `No preservatives` · `Baked daily` · `FSSAI ####` | F24. The eggless claim is Fillo's core differentiator and must clear the fold-line immediately |
| **3** | **Delivery-area check** | `📍 Where should we bring it?` → area input → serviceable result **or** waitlist (F26b) | Question two, asked before browsing, answered without a wall. The single biggest current funnel defect |
| **4** | **The van** — promoted from pill to module | Live map preview, van position, `Updates every 15s`, `Track the van →` to a full `/van` page | This is the brand's unfair asset and its provenance story. It replaces the "farm origins carousel" that Blue Tokai uses to justify price |
| **5** | **Today's bake** — 4 SKUs, 2-up grid | Hero SKUs with flavour notes (F4) and honest stock counts (F5). `See all 23 →` | Answers "worth ₹250" through specificity, not through a discount |
| **6** | **Order again** *(returning visitors only; injects above module 5)* | Last 3 items, one-tap add | q-comm reorder pattern (F3); the repeat-purchase engine for a bread business |
| **7** | **Why it costs what it costs** | Three short blocks: 12-hour ferment / the naming system (Kyoto, Seoul, Calcutta, Bangalore) / founders + the neighbourhood-bread-vendor story. Photography-led, short copy | The premium argument, placed *after* desire is created and *before* the price objection lands |
| **8** | **Gifting** | One image, `Send bread as a gift — with a note and a chosen date` → gift flow (F25) | India's structural conversion driver; Fillo already owns the date/slot machinery |
| **9** | **Fillo+** | ₹1 join · 2 coins per ₹100. Phone-number signup (F12) | Loyalty belongs low: it converts people already sold, and high placement reads as a discount brand |
| **10** | **Proof** | 3 real reviews with names + areas (Indiranagar, Banaswadi). Real numbers only (F23) | Anand Sweets' social-proof stack, sized honestly |
| **11** | **Footer** | FSSAI no., entity name, contact, policies, socials, single Kannada thank-you line (F22) | Compliance + warmth |
| **—** | **Floating** | WhatsApp bubble bottom-right, single floating element, offset above sticky CTAs (F16) | Thumb-zone discipline (F21) |

**Deliberately absent, and why:** no search field (F3), no carousel (LCP), no popup email capture (phone-first, and popups on mid-range Android are a bounce machine), no countdown timer (F2), no language toggle (F22), no "100+ Items" (F23), no second floating widget (F16).

---

## 8. Evidence-quality notes

- **Strong, primary:** UPI share and volumes (NPCI/PIB), WhatsApp India user base, Bengaluru dark-store density (ICICI Securities via Storyboard18), Google Address Descriptors coverage (Google Maps Platform), Baymard abandonment meta-analysis, FSSAI labelling law.
- **Directional, vendor-sourced — verify before planning against:** Razorpay Magic Checkout uplift (15% / 18–30% / 25%), the 28% OTP-login abandonment reduction, WhatsApp 45–60% conversion, the COD→prepaid 68%→52% case study, "70% of Zepto orders are reorders".
- **Global proxies:** thumb-zone research, Shopify mobile traffic/revenue split, Baymard's US consumer panel, the 0.1s/8.4% Google retail finding.
- **Evidence gaps found:** no independent India A/B data on pincode-checker placement; no India-specific click-to-chat placement study; no q-commerce category data for bread/bakery specifically. Recommendations in those areas are reasoned from adjacent evidence and flagged inline.

---

## Sources

**Mobile, conversion and checkout baselines**
- [Conversion Rate Benchmarks for Indian D2C Stores — MakeMeConvert](https://www.makemeconvert.com/blog/indian-d2c-conversion-rate-benchmarks)
- [Ecommerce Conversion Rate India — Cognito IT Consultancy](https://cognitoitconsultancy.com/ecommerce-conversion-rate/)
- [Shopify Mobile Commerce Statistics — EasyAppsEcom](https://easyappsecom.com/guides/shopify-mobile-commerce-statistics)
- [The State of Shopify in India — Emerge Digital](https://emergedigital.co/the-state-of-shopify-in-india-2026/)
- [E-Commerce Cart & Checkout Usability Research — Baymard Institute](https://baymard.com/research/checkout-usability)
- [Percentage of Online Shoppers Who Abandon Carts — Red Stag Fulfillment](https://redstagfulfillment.com/percentage-of-online-shoppers-abandon-their-cart/)
- [The Current State of Checkout UX — Total Commerce](https://totalcommerce.partners/blogs/articles/the-current-state-of-checkout-ux-a-comprehensive-look-at-the-key-insights-and-best-practices)

**Quick commerce**
- [Quick Commerce UX: Designing for 10-Minute Delivery — ProductGrowth](https://productgrowth.in/insights/ecommerce/quick-commerce-ux/)
- [Bengaluru tops India's quick commerce market at nearly 3x national average — Storyboard18](https://www.storyboard18.com/how-it-works/bengaluru-tops-indias-quick-commerce-market-at-nearly-3x-national-average-report-98570.htm)
- [Quick Commerce Market Share India — Fynd](https://www.fynd.com/blog/quick-commerce-market-share-india)
- [Blinkit vs Zepto vs Swiggy Instamart — Nectarbits](https://nectarbits.com/blog/blinkit-vs-zepto-vs-swiggy-instamart-which-is-better/)
- [India Quick Commerce Hits 9.5 Million Daily Orders — StartupTalky](https://startuptalky.com/news/quick-commerce-in-india-surges/)
- [Quick Commerce — India, Statista Market Forecast](https://www.statista.com/outlook/emo/online-food-delivery/grocery-delivery/quick-commerce/india/)

**Payments, UPI, COD**
- [India's UPI Revolution — PIB, Government of India](https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=154912&reg=48&lang=2)
- [UPI Payment Success Rates: 2026 Benchmarks — ProductGrowth](https://productgrowth.in/insights/fintech/upi-payment-success-rates/)
- [The Indian Payments Handbook 2025–2030 — PwC India (PDF)](https://www.pwc.in/assets/pdfs/indian-payments-handbook-2025-2030.pdf)
- [UPI Statistics — Meetanshi](https://meetanshi.com/blog/upi-statistics/)
- [Razorpay Magic Checkout](https://razorpay.com/magic-checkout/)
- [One-Click Checkout: What It Is? How It Works in India — Razorpay](https://razorpay.com/learn/one-click-checkout-blog/)
- [Cash on Delivery in India: Benefits, Risks & RTO Tips — Razorpay](https://razorpay.com/blog/cash-on-delivery/)
- [COD to Prepaid Conversion: A Playbook for D2C Brands — Shipway](https://blog.shipway.com/cod-to-prepaid-conversion/)
- [COD to Prepaid Conversion: How D2C Brands Are Getting 25–35% — OneflowAI](https://oneflowai.in/blog/cod-to-prepaid-conversion-d2c-india)
- [The Science of COD vs Prepaid Conversions — bepragma](https://www.bepragma.ai/blogs/cod-vs-prepaid-conversions-insights-for-indian-d2c-stores)
- [How to Reduce RTO in Ecommerce: Indian D2C Guide — HillTeck](https://www.hillteck.com/blog/reduce-rto-ecommerce-india.html)

**Address, identity, serviceability**
- [Launching Address Descriptors for Indian cities — Google Maps Platform](https://mapsplatform.google.com/resources/blog/launching-address-descriptors-make-it-easier-find-addresses-using-landmarks-indian-cities/)
- [Why Google Maps Uses Landmarks in India (UX Case Study) — Bootcamp/Medium](https://medium.com/design-bootcamp/how-google-maps-solved-indias-no-street-names-problem-7f53a282cb65)
- [Anatomy of an Indian Address — The India Notes](https://newsletter.theindianotes.com/p/anatomy-of-an-indian-address)
- [Designing address forms for everyone, everywhere — Shopify Design](https://medium.com/shopify-ux/designing-address-forms-for-everyone-everywhere-f481f6baf513)
- [India Address Format With Examples — PostGrid](https://www.postgrid.com/global-address-format/india-address-format/)
- [Increase Conversions by Phone Number Login in Ecommerce — Webkul](https://webkul.com/blog/phone-number-login-ecommerce-conversion/)
- [Retail & Ecommerce OTP Authentication — MojoAuth](https://mojoauth.com/use-cases/retail-ecommerce/)
- [What is SMS OTP & Why Indian Ecommerce Stores Need It — Unique Digital Outreach](https://uniquedigitaloutreach.in/what-is-sms-otp-why-indian-ecommerce-stores-need-it/)
- [Serviceable Pin Codes for eCommerce — Shiprocket](https://www.shiprocket.in/features/serviceable-pin-codes/)
- [Zipcode & Delivery Validator — Shopify App Store](https://apps.shopify.com/slash-pincode-shipping-check)
- [Pin Code Serviceability Checker — MoreCustomersApp](https://morecustomersapp.com/blog/pin-code-serviceability-checker-on-morecustomersapp-online-store/)

**WhatsApp commerce**
- [WhatsApp's conversational commerce revolution in tier-1 India — Route Mobile](https://routemobile.com/blog/whatsapps-conversational-commerce-revolution-in-tier-1-india/)
- [WhatsApp Commerce — The 2026 Complete Guide — Go4WhatsUp](https://www.go4whatsup.com/guides/whatsapp-commerce/)
- [WhatsApp Business Catalog Playbook for Indian D2C Brands — Influencers Time](https://www.influencers-time.com/whatsapp-business-catalog-playbook-for-indian-d2c-brands/)
- [WhatsApp Ordering for E-commerce in India — bepragma](https://www.bepragma.ai/blogs/whatsapp-order)
- [How Many WhatsApp Users Are in India — Hyperleap](https://hyperleap.ai/blog/whatsapp-statistics-india-2026)
- [WhatsApp statistics: Global usage & market overview — Infobip](https://www.infobip.com/blog/whatsapp-statistics)
- [WhatsApp Business Statistics — Wapikit](https://www.wapikit.com/blog/global-whatsapp-business-statistics-2025)

**Mobile performance & thumb zone**
- [Mastering the Thumb Zone: Mobile UX & UI Design Guide — Parachute Design](https://parachutedesign.ca/blog/thumb-zone-ux/)
- [What is Thumb reachability? — MockFlow](https://mockflow.com/glossary/Thumb-reachability)
- [One-Handed Mobile UX: Best Practices — Upslide Design Studio](https://upslidedesignstudio.com/blogs/one-handed-mobile-ux-design-best-practices-for-better-mobile-apps)
- [Mobile Ecommerce Conversion Rate FAQ — Build Grow Scale](https://buildgrowscale.com/mobile-ecommerce-conversion-rate-faq)
- [How to Build an E-Commerce Website in India — Dot Com Inventions](https://www.dotcominventions.com/web-development/how-to-build-an-e-commerce-website-in-india-in-2026-costs-platforms-what-to-expect/)

**Vernacular & localisation**
- [Local languages: A winning formula for ecommerce in India — YourStory](https://yourstory.com/2023/03/local-languages-winning-formula-e-commerce-india)
- [How E-Commerce Platforms Use Vernacular Languages — Outlook Startup](https://startup.outlookindia.com/sector/e-commerce/vocal-for-local-how-e-commerce-platforms-are-using-vernacular-languages-to-win-over-indian-consumers-news-8805)
- [What you need to know about localizing for India — RWS](https://www.rws.com/blog/what-you-need-to-know-about-localizing-for-india/)
- [Bengaluru Kannada — Wikipedia](https://en.wikipedia.org/wiki/Bengaluru_Kannada)

**Premium positioning, gifting, trust**
- [Blue Tokai Coffee Roasters](https://bluetokaicoffee.com/)
- [Subko Coffee Roasters](https://subko.coffee/)
- [Anand Sweets](https://www.anandsweets.in/) · [Anand Sweets — Gifting](https://www.anandsweets.in/pages/gifting)
- [Khoya Mithai](https://www.khoyamithai.com/)
- [SMOOR — Online Cake Delivery Bengaluru](https://smoor.in/pages/online-cake-delivery-bengaluru)
- [India Gifting Market Size & Forecast — Research and Markets](https://www.researchandmarkets.com/report/india-gifting-market)
- [Why India Loves D2C Food Brands: 2025 Buying Trends — Rare Ideas](https://rareideas.in/blog/why-indian-consumers-choose-d2c-food-brands-2025)
- [How to Build and Grow a D2C Brand in India — HavStrategy](https://www.havstrategy.com/how-to-build-and-grow-a-d2c-brand-in-india/)
- [How Are Vegetarian Foods Labeled in India? — National Law Review](https://natlawreview.com/article/how-are-vegetarian-foods-labeled-india)
- [FSSAI's Directive for E-commerce Food Business Operators — Freyr](https://www.freyrsolutions.com/blog/ensuring-compliance-fssais-directive-for-e-commerce-food-business-operators)

**Delivery slots & shipping thresholds**
- [Time Picker UX: Best Practices, Patterns & Trends — Eleken](https://www.eleken.co/blog-posts/time-picker-ux)
- [Delivery Time Picker at Checkout — Ecwid](https://www.ecwid.com/blog/delivery-time-picker-at-checkout.html)
- [How to Manage Delivery Time Slots on Shopify — Autoserve](https://www.autoserve.io/blog-posts/how-to-manage-delivery-time-slots-on-shopify-best-apps-strategies-for-local-delivery)
- [Scheduled Delivery & E-commerce UX — Medium](https://medium.com/@guptakhushi0423/delivering-peace-of-mind-how-scheduled-delivery-transforms-e-commerce-ux-b36ead723506)
- [No free-shipping threshold to lift cart value — MakeMeConvert](https://www.makemeconvert.com/leak/no-free-shipping-threshold)
- [How D2C Brands Should Price Quick Commerce Orders — Base](https://base.com/en-EN/blog/how-to-d2c-brands-should-price-quick-commerce-orders-delivery-fees-movs-margins/)
- [D2C Logistics in India: Hidden Costs — CustomFit.ai](https://www.customfit.ai/blog/d2c-logistics-in-india-hidden-costs-no-one-talks-about-customfit)
