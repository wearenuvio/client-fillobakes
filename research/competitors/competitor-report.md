# Fillo Bakes — Competitor & Benchmark Report

Walked live in Chrome, 3 Sep 2026. Every pattern below carries the URL it was observed on.
Where a claim is inherited rather than observed, it is labelled **[not observed]**.

---

## 0. Method, and what I could not see

**Fully walked (home → menu → product → cart → checkout, as far as allowed):**
Hotplate + a live Hotplate storefront (Fort Mill Sourdough Co.), Blue Tokai, GAIL's, Wildgrain,
Theobroma (both of its two sites), Bombay Sweet Shop, Lily Pond Bakery, Sour House, Levain,
Bread Ahead, The Baker's Dozen, Country Delight, Milkbasket, Blinkit, Zepto, Swiggy storefront states.

**Stopped deliberately:** I added an item to a Hotplate cart and reached checkout step 1, then stopped at
the phone-number field. No personal data was entered, no form submitted, nothing paid, anywhere.

**Could not observe, and why — this matters for the tracking section:**

| Target | Why not |
|---|---|
| Domino's Pizza Tracker | `dominos.co.in/tracker` returns a 404; the tracker is order-scoped and needs a live paid order |
| Swiggy / Zomato / Zepto / Blinkit live order maps | Order-scoped; require login + a real paid order |
| Amazon "N stops away" map | Order-scoped; requires a live out-for-delivery shipment |
| Uber / Ola ETA UX | App-only, requires a booked ride |
| Street Food Finder | Cloudflare bot-verification wall. **I did not attempt to bypass it** |
| Mister Softee truck tracker | Page would not attach in the browser |
| Supr Daily | `suprdaily.com` has lapsed and now redirects to an unrelated gambling site (the business was folded into Swiggy Instamart) |
| Shokupan Micro Bakery | `shokupaninmicrobakery.com` rendered a completely blank document — no title, no body text |

Everything in the tracking section is therefore split into **observed** and **inherited/documented**, and I
have not dressed the second category up as the first. The prior corpus's `tracking-ux.md` cites its sources
properly; I have flagged where its numbers come from vendor blogs rather than measurement.

---

## 1. Competitor profiles

### 1.1 Hotplate — `hotplate.com` and `hotplate.com/fortmillsourdough`
**The single closest analogue to Fillo that exists.** A platform purpose-built for exactly Fillo's operating
model: a small baker, fixed neighbourhood stops on fixed weekdays, limited supply, pre-order only.

**Positioning.** "The #1 food drop platform." Its own definition, from the homepage FAQ:
> "A drop is just a preorder window with a clear start and end time. Most popups already sell this way — Hotplate gives it structure."

**Marketing-site structure (in order):** nav (Product / Pricing / Our Why / Company / Resources · Log In ·
Start Selling) → hero with a rotating product noun ("Powering the hottest **sourdough** drops") → 4-step
"How Hotplate works" (build list → schedule a drop → orders open and we text customers → fulfil without
stress) → creator wall with follower counts and city → "What's included" (Custom Storefront · Reviews &
Loyalty · Inventory Management · Automated Messaging · Automated Prep List · Stats & Insights) → FAQ → CTA.

**Buyer-side storefront structure** (`/fortmillsourdough`, observed live):
1. Header: logo, `Gift Card`, `Share`.
2. Brand card: cover image, socials, and the **route schedule written as plain text in the bio** —
   `DAILY Tue-Fri - Waterside at the Catawba (Fort Mill)` / `Tuesday - Baxter Village, Barber Rock, Massey` /
   `Wednesday - Springfield, BridgeMill and Palisades` / `Thursday - McCullough, Lake Ridge, Riverwalk` /
   `Friday - Masons Bend, Lake Shore, Baxter Village`.
3. **`🔔 Never miss a drop`** — full-width SMS-list button, the most prominent control on the page.
4. **Current & Next Drops**, each a card: title, `📅 Pickup on Thu, Sep 3`, `📍 Lake Ridge (Tega Cay) + 3 more`,
   a description carrying the cutoff in the operator's own voice
   (*"Extras for Thursday pickup - must be ordered by 9:15am. After that all extras are sent to The Speckled Pear…"*),
   and for the imminent one a **live countdown: `00 Hours 04 Mins 15 Secs`** → `Click to order`.
5. FAQ (4 questions, all operational: what the ordering process looks like, changing pickup time, forgetting
   to collect, missing items).
6. Customer reviews with photos — `See all 99 reviews`.
7. "Other stores … thinks you'll love" cross-promo.
8. **Past Drops** — an archive (`Dropped on September 1, 2026`) proving the ritual is real.

**Drop page (the menu).** Sticky left rail carries the drop card, a `Pickup on Thu, Sep 3` row, and a
**location row that expands into named neighbourhood stops** with city + ZIP and an open-in-maps icon
(`Lake Ridge (Tega Cay) · Fort Mill, SC 29708` / `McCullough` / `Riverwalk` / `Waterside at the Catawba`).
Right pane: category tabs (Artisan Loaves · Sandwich Loaves · Treats & Add-Ons · **Gift Cards**), ~14 items.
**Sold-out items stay in the grid, greyed, with a loud red `Sold Out` ribbon** — never hidden. Every item
carries a full ingredient list and, where relevant, `CONTAINS: WHEAT, MILK & SOY`.

**Cart and checkout — the strongest part.**
- Product opens as a **quick-view modal** with an image gallery and a full-width sticky `Add to Cart · $12.00`.
- Adding produces a floating bar: `Cart · **6:56** · 1 items` — a **cart reservation countdown**. Your items
  are held for ~7 minutes.
- Cart modal: `Your Cart` + a `Pickup` badge + the timer + line items with steppers + `Subtotal` +
  **`Choose Time & Checkout`**.
- Checkout: a 3-step stepper **`1 Info · 2 Time · 3 Pay`**, the hold timer still running top-right, and step 1
  is **a phone number and nothing else**:
  > "Enter your phone number — We need this to send you updates about your order"

  Below it a collapsed `Location & Time` card reading *"Fill in your info to see available times"*, a
  collapsible `Items · 1` block, then `Subtotal $12.00` / `Taxes & Fees ⓘ` / **`Total $12.69`** — the total is
  complete before any address is asked for. SMS-consent copy sits inline above the pay button.

**Delivery model:** pickup at named neighbourhood stops, per-drop. **Subscription:** none — the recurring
mechanic is the SMS list plus a fixed weekly rhythm. **Loyalty:** platform-level "Reviews & Loyalty";
**gift cards sold as a menu category**. **Tracking:** none — the schedule and the cutoff do that job.

**Weaknesses:** storefront is client-rendered with essentially no SEO surface; the brand lives entirely
inside Hotplate's chrome ("Powered by Hotplate" footer); no delivery lane at all.

---

### 1.2 GAIL's — `gails.com` (UK)
**The best single piece of copy in this entire report.**

**Positioning.** Craft-community bakery. Nav: `Order · Journal · About · Loyalty · Visit us`.
Hero is a values statement ("Our Craft Community") with **two CTAs: `ORDER` and `VISIT US`** — the two
fulfilment realities given equal weight at the top of the page.

**The announcement bar carries a computed cutoff sentence:**
> `ORDER BY 11AM TOMORROW FOR DELIVERY ON SATURDAY`

**And — the bit the prior research missed — the same sentence is repeated in red, directly above the buy
button on the PDP** (`/collections/bread/products/gails-sourdough-650g`):
> *Order by 11am tomorrow for delivery on Saturday*
> **[ ADD TO BASKET ]**

**PDP structure:** breadcrumb → gallery → name → price → quantity stepper → **cutoff line** → ADD TO BASKET →
sensory description (crust, crumb, texture, four short lines) → allergen disclaimer → four accordions:
`COLLECTION` ("Collection available, see locations") · **`LOCAL DELIVERY` ("Check for delivery" + a Postcode
field)** · `NUTRITION` · `ALLERGENS` → "STOCK UP YOUR PANTRY" cross-sell → producer profiles with names.

**Homepage sections in order:** announcement bar → nav → hero (Our Craft Community, ORDER / VISIT US) →
ingredient story → "What makes a better loaf?" (named farm, named farmer) → producer profile → "Celebrating
the season" product rail → "Handmade Loaves" rail → "We welcome you inside" + **FIND YOUR NEAREST BAKERY** →
testimonials → **loyalty**: *"Collect nine stamps on our loyalty app and enjoy a barista made drink or loaf of
bread on us. SIGN UP HERE."*

**Availability badges on product cards:** `Select Bakeries`, `Nationwide Delivery`, `Bread of the Month`,
`New Recipe`. Calorie counts are printed inside the product title itself.

**Weaknesses:** a very large catalogue (the prior research counted 263 SKUs) means sold-out becomes wallpaper;
no subscription; loyalty is app-only and therefore invisible to a web-first buyer.

---

### 1.3 Blue Tokai — `bluetokaicoffee.com` (India)
**The India subscription benchmark, and a masterclass in the FAQ as a conversion tool.**

**Homepage in order:** announcement `GET 10% OFF ON YOUR FIRST COFFEE PURCHASE, USE CODE - TRY10` → nav
(Roasted Coffee · Offers · Gifting · Equipment · Others · Learn · About Us · **GET THE APP** · search · account
· cart) → hero carousel → category tiles → "Bestseller Coffees" rail → "New to Specialty Coffee?" →
**subscription pitch block** → **subscription customiser teaser** → testimonials.

**The subscription pitch, verbatim:**
> **Brew More. Save More!** WHEN YOU GET A SUBSCRIPTION FROM US, YOU:
> 01 / Save up to 20% · 02 / Enjoy convenience with doorstep deliveries · 03 / Experiment more with new and
> different coffees · 04 / Customise your plan completely · 05 / Stay stocked and never run out of coffee!
> **SUBSCRIBE NOW**
>
> *Completely customise your subscription, in just a few clicks. You get to pick:*
> **NUMBER · PACK SIZE · COFFEES · GRIND SIZE · FREQUENCY**

**The ladder** (`/collections/subscriptions/`) — prepaid, by number of deliveries, with escalating discount:

| Deliveries | Discount | From |
|---|---|---|
| 3 | 10% | ₹1,755 |
| 6 | 12.5% | ₹3,412 |
| 12 | 17.5% | ₹6,435 |
| 24 | 20% | ₹12,480 |

A second parallel ladder exists for the no-equipment "Easy Pour" range at the same percentages
(₹1,350 / ₹2,625 / ₹4,950 / ₹9,600). Hero banner: *"Save up to Rs. 3000 on a regular supply of India's most-loved specialty."*

**Subscription PDP** (`/products/3-delivery-subscription`) carries, in order: `SELECT COFFEE` (15 options
including a **"Mixed Bag"** curated option), `SUBSCRIBE & SAVE UPTO 20%`, then —
> **Enter PIN to check shipping option & delivery time** `[ CHECK ]`
> FREE STANDARD SHIPPING on all prepaid orders above ₹350

then a one-sentence plain-language explainer (*"Get 3 total deliveries scheduled whenever you'd like and save
10% versus buying the packets individually"*), then a **three-group FAQ accordion that is really the
subscription management contract**:
- *Mixed Bag:* what it is, how to get it, how to choose coffees per delivery and change them later, what's
  eligible, bag sizes, whether choosing costs extra.
- *Manage Subscription:* **how to manage or change individual deliveries · how to pause or resume · why you
  can't change pending deliveries · how to cancel · how to see the next delivery date and remaining count ·
  change grind size or label per delivery · send deliveries to different addresses.**
- *General:* why you can't change the first dispatch date · viewing it in the app · why the coffee selection
  is limited · **what happens if your coffee goes out of stock** · full prepay vs pay-per-delivery · mail/call
  frequency · expiry · why discount codes don't stack on subscriptions · international.

Sold-out items remain in every grid with `SOLD OUT` and `LIMITED RELEASE` badges.

**Weaknesses:** very heavy nav; sold-out density on the collection page is high enough to read as a supply
problem; the subscription builder is a Shopify product page doing a job that wants a wizard.

---

### 1.4 Wildgrain — `wildgrain.com` (US)
**The purest subscription-first architecture in the set. There is no shop.**

Nav is `Home · How It Works · Our Story · Reviews · Gifts · Sign In` plus a single primary
**`GET STARTED`**. There is no "Shop" and no product catalogue you can buy from à la carte.

**Hero rotates three offers, each stamped `40,000+ Five-Star Reviews`:**
`FREE CROISSANTS FOR LIFE! 🥐` / `GLUTEN-FREE COOKIES FOR LIFE 🍪` / `FOR THE CARBIVORES IN YOUR LIFE! 🎁`.
Note the joining incentive is a **permanent perk, not a first-order discount** — "for life" rather than "10% off".

**Homepage in order:** hero → "6 reasons to try" → **4-step How It Works** (1 Choose your plan · 2 Pick your
favorites · 3 We ship your box · 4 You bake at home) → product rail → plan-by-lifestyle tiles (Protein · Vegan ·
Gluten-free · Kid Friendly · Fall Options) → add-on range (butters, oil) → press badges (USA Today, Newsweek,
Good Housekeeping, with years) → member testimonials + UGC handles → artisan story → closing CTA
*"Order today & get 4 Free Croissants in every box!"*

**The anxiety-reduction copy on `/pages/faq` is the reusable asset:**
> Freshly baked at home, on your schedule. **Easy to manage, skip, or cancel anytime.**
> **SCHEDULE DELIVERIES ON YOUR TERMS** — Reschedule your delivery or change its frequency so your box arrives on time.
> **GET REMINDERS 4 DAYS BEFORE EACH ORDER** — Get a reminder 4 days before each order via email and SMS!
> **SKIP OR CANCEL YOUR DELIVERIES ANYTIME** — Skip, pause, or cancel whenever you like via your Member Account.

Plus a full section justifying the format's constraint as a virtue ("Better because it's frozen" — naturally
preserved, no waste, perfect timing). **This is the template for justifying Fillo's constraint (a van on a
route) as a feature rather than an apology.**

**Weaknesses:** nothing is purchasable without entering a subscription funnel; no transparency on price until
deep in the flow.

---

### 1.5 Theobroma — `theobroma.in` **and** `order.theobroma.in` (India)
**The prior research walked only the first of these two sites and therefore missed the most relevant flow in
Indian bakery e-commerce.**

Theobroma runs **two separate storefronts** for two fulfilment realities:
- `theobroma.in` — a Shopify catalogue for **nationwide shipping**. Nav is a long product taxonomy
  (Brownies / Biscuits / Breads / Cakes / Combos / Croissants / Desserts / Pastries / Sandwiches / Tea Cakes /
  Beverages / Gifting / Collectibles / Chocolates / Assortments) plus `Find Us`, `Contact Us`, and a distinct
  **`ORDER ONLINE`** link that jumps to the other domain.
- `order.theobroma.in` — **local, same-day ordering**, and its nav item `Order Now` does not go to a menu.
  **It goes to `/store-locator`.**

**The store-locator is the entry to ordering:**
> **Find Theobroma stores near you** — 317+ restaurants across India
> `[ ⌖ Use my location ]` `[ Select City ▾ ]` `[ Select Locality ▾ ]`
> Filters: `Order Type ▾` · `Veg Only` · `Open Now` · `Newly Opened` · `Direct Pay` — *318 results found* · `Sort By ▾`

Each result is a card: store name, an amber **`Delivery from 9:00 AM`** badge, `View Store →`,
`🕐 Store hours · 9:00 AM – 11:00 PM`, the locality (`HSR Layout, Bengaluru`), `Kms away`, **`🚚 Delivery`
and `🏪 Pickup` badges**, a directions button, a call button, and `Order Online`. A live map sits alongside;
clicking a pin opens a popover with `Directions` / `Order Online`.

**This is the closest thing in Indian e-commerce to picking a van route before you see a menu.** The mental
model — *choose where and when you can actually receive this, then browse what is available there* — is
exactly Fillo's, and it is already familiar to a Bengaluru buyer.

**Weaknesses:** the promo strip stacks nine-plus coupon codes (THB40/THB75/THB100/THB150/COMBO15/NEW50/
NEW80/NEW125/NEW200), which reads as a discount brand and trains people to hunt codes; and the two-domain
split is a real seam.

---

### 1.6 Bombay Sweet Shop — `bombaysweetshop.com` (India)
**Fulfilment mode promoted into navigation, and the best availability badge in the set.**

The category tile row directly under the nav — the first thing below the header — leads with **`Shop Mumbai`**
and **`Shop All-India`** as the first two circular tiles, before any product category (Guilt-Free, Mithai,
Chocolate, Namkeen, Cookies…). The two fulfilment lanes *are* the primary navigation.

**Product cards carry stacked badges**: **`Mumbai only`**, `Seasonal`, `Best Seller`, plus a star rating with
review count, strike-through MRP and a `% Off` chip. The `Mumbai only` badge appears on the card in the grid,
not buried in a PDP accordion — so a Delhi buyer learns the constraint before they fall in love with the item.

Rotating announcement bar: *"Diwali corporate gifting is open for bulk orders"* / *"Flat ₹200 Off on ₹2000 &
above"* / *"Flat ₹500 Off on ₹5000 & above"*. WhatsApp FAB bottom-right. Nav includes `Our Stores`,
`Sweets Library`, `Blog`.

Even the 404 is designed: *"Oops! Nothing here. Click here to head back home and find something sweet."* with
a `CONTINUE SHOPPING` button and a bestsellers rail beneath it.

**Weaknesses:** three stacked discounts in the announcement bar; heavy discount framing on every card
undercuts a premium craft position.

---

### 1.7 Lily Pond Bakery — `lilypondbakery.co.in` (Bengaluru)
**A real Bengaluru artisan bread bakery, and the clearest evidence in the whole report for area-first.**

On first load, before anything else, a modal:
> **Welcome** — Please select your city
> **Bengaluru** · *Deliveries Only*
> **Ahmedabad** · *Pick Up At Designated Stores*
> **Vadodara** · *Pick Up At Designated Store*
> `[ ORDER NOW ]`

The critical detail: **the fulfilment mode is attached to the location choice.** You do not pick a city and
then discover how you can get bread; the city *is* how you get bread. The announcement bar restates it
permanently: *"We deliver in Bengaluru only. We offer pick up at designated store's in Ahmedabad and Vadodara."*

Nav after the gate: `Home · About Us · FAQ · Shop Now · Contact Us`. Homepage: hero ("PREMIUM QUALITY /
Freshly Baked / ARTISAN BREADS") → product rail → founder story (named founder, Europe training, the move
from Ahmedabad to Bengaluru) → three craft pillars (Freshly Baked · Premium Quality · Hand Crafted) →
testimonials.

**Weaknesses:** a hard modal on first paint from an Instagram click is a real bounce risk; the gate blocks
even browsing. Grammatical errors in the announcement bar ("store's"). No subscription, no tracking, no loyalty.

---

### 1.8 Sour House — `sourhouse.in` → `sourhouse.in/onlineorder/` (Bengaluru, Koramangala)
The prior research called this *"the only established recurring-delivery bread subscription in Bengaluru."*
That overstates it considerably.

The domain redirects to a **generic white-label ordering template** — the browser tab literally reads
**`Template 1`**. What is actually there:
- `Minimum order amount : ₹250`
- **`Minimum Delivery Time: 1440 mins`** — a 24-hour lead time, disclosed as a raw number of minutes.
- A `Delivery | Pick up` toggle and `Sign in`.
- Categories: Breads · Pastry · Gift Hamper · Cake · Drinks · Fermented · Sides & Snacks · Culture ·
  Baking Tools · Totes.
- Address and hours in the footer; `00:00-23:59` as the stated opening hours.

**There is no self-serve subscription on the site at all.** If the weekly-loaf subscription exists it is sold
off-platform, by conversation.

**Read this as good news.** The bar for bread D2C in Bengaluru is very low. A competently built ordering
experience is itself a competitive advantage here; Fillo does not need to out-design GAIL's, it needs to
out-design `Template 1`.

---

### 1.9 Levain Bakery — `levainbakery.com` (US)
Nav: `COOKIES & GIFTS · ORDER · BAKERIES · CORPORATE GIFTS`. The `ORDER` menu splits explicitly into
**`Nationwide Shipping`** and **`Same Day Pickup or Delivery`**, and `Same Day Pickup or Delivery` also sits as a
top-level item in its own right. Occasion architecture is unusually developed: Corporate Gifting, Events &
Party Favors, Catering, Weddings, Gift Guide. Loyalty is `Cookie Club`. A trust ticker scrolls under the hero:
`Made in NYC · Baked Fresh Daily · Shipped Same-Day · 30 Years of Homemade`. Press quote wall (NY Magazine,
NYT, Food & Wine, Travel & Leisure) and a founder origin story close the page.

**The finding the prior research missed, and it is important:** Levain's local lane
(`Same Day Pickup or Delivery`) **leaves the domain entirely** — it points at
`order.online/business/levain-bakery-19070`, a third-party ordering platform.

So the site the prior corpus holds up as the model for fulfilment-first navigation **commits precisely the sin
it condemns in Fillo**: two checkouts, two domains, a context switch mid-funnel. Copy Levain's *navigation
idea*. Do not copy its *implementation*.

---

### 1.10 Bread Ahead — `breadahead.com` (UK)
Nav: `Home · Courses · Locations · Members Area · Our Story · Group Bookings · Gift Vouchers · Contact ·
Future Bakers`, plus a UK/US site switcher. There is **no bread shop in the primary navigation.** The business
monetises the craft as education: baking courses, group bookings, an **Unlimited Membership**, and
**Video Masterclasses**, gated behind a `Membership Area`:
> "The Member's Area is accessible to users who have purchased an Unlimited Membership or a Video Masterclass."

**Relevance to Fillo:** it proves a craft bakery can carry a paid membership that is about access and learning
rather than discount. It is a phase-three idea for Fillo (a shokupan class, a bake-along), not a phase-one one —
but it is the right *shape* for what Fillo+ could eventually become if the coins mechanic is retired.

---

### 1.11 The Baker's Dozen — `thebakersdozen.in` (India)
Nav: `Our Products · RCB x TBD · Partners · Recipe · Our Story · FAQs · Contact Us · Locations`. `/shop/` shows
a real catalogue with category tabs (Breads · Cakes · Cookies · Gifting · Snacks) and genuinely good product
copy ("Zero Maida" as an ownable claim, "a little extra" as a brand phrase). But **`Partners` is the buy
button** — demand is handed to marketplaces. There is no first-party checkout, no customer record, no list,
no repeat mechanic.

**Domain-hygiene warning:** `bakersdozen.in` (without the "the") is **no longer this brand** — it now serves a
completely unrelated pitch-deck workshop landing page. Fillo should register and defend its obvious
misspellings and variants now, while it is cheap.

---

### 1.12 India logistics benchmarks (walked for cutoff, area and subscription mechanics)

**Country Delight — `countrydelight.in`.** City-first: a permanent `Deliver In / Delhi NCR ▾` control top-left
with the explanation *"Select your city to see accurate prices and products."* Cutoff stated as prose:
> *"Orders placed for milk and groceries by 12 midnight are delivered the next day between 5:00 AM and 7:30 AM*"*

The four-line subscription promise: *"Order fresh milk & groceries daily · **Set a customized subscription
plan** · **Use vacation mode for skipping deliveries** · Grab exciting offers for big saving."* Cadences
offered: daily / alternate-day / weekly / monthly. **`Free Membership · On your signup`.** Bangalore is a
served city.
**Weakness worth learning from:** almost every product tile says `Download App Now` instead of `Add`. The web
experience dead-ends into an app install. Fillo must not do this.

**Milkbasket — `milkbasket.com`.** The header is the cutoff:
> **Order by Midnight** / **Delivery by 7 AM!**

Van artwork reads `7 AM Silent Doorstep Delivery`. Bottom tab bar: `Home · Categories · Basket · **Wallet** ·
More` — a **prepaid wallet as a first-class tab**, which is how a low-value high-frequency subscription
business removes payment friction from every delivery. The web app is otherwise a login-gated shell.

**Blinkit — `blinkit.com`.** A **location modal on first paint**:
> **Welcome to blinkit** — Please provide your delivery location to see products at nearby store
> `[ Detect my location ]` — OR — `[ search delivery location ]`

Note two things: the header's ETA slot reads **`Currently unavailable / Select Location ▾`** before you choose,
and **the catalogue still renders behind the modal**. It is a soft gate, not a wall.

**Zepto — `zepto.com`.** No gate at all on first load; the header reserves a slot top-left for the
location/ETA pill. Its hero carries a **fee-transparency promise**:
> **₹0 Handling Fee** ✓ · **₹0 Delivery Fee\*** ✓ · **₹0 Rain & Surge Fee** ✓
> *\*T&C Apply. Above specific minimum order value*

**Swiggy storefront states.** A storefront outside your area renders inline, with the catalogue still visible:
`This location is outside the outlet's delivery area` and `Closed & not delivering`. The Indian convention is
**show and disable**, never hide.

---

### 1.13 Bengaluru direct-competitive picture (Google SERP, 3 Sep 2026)

A search for `"shokupan" bangalore bakery order online` returns an AI Overview naming, in order:

| Rival | Signal |
|---|---|
| **Fillo Bakes Plus** | GBP **4.6 (14 reviews)**, `₹400–600`, "Japanese delicatessen", *49, 3rd cross, NR Layout, FCI Godown Main Rd* — with Order / Call / Directions / Website actions |
| **Tempt Bakehouse**, Koramangala | **4.9 (104 reviews)** — "freshly handmade small-batch Japanese shokupan breads" |
| **Lily Pond Bakery** | "We deliver in Bengaluru only. We offer pick up at…" |
| **Bunco**, Mahadevapura | Zomato **4.4 (1,897 reviews)** — "Japanese Milk Bread Loaf… this Shokupan feels like a cloud in loaf form" |
| **Juny's Bakehouse** | Instagram **20.4K followers** — "Pick them up at our store, or order online" |

**Two findings here.**

1. **Fillo now surfaces for its most valuable keyword.** The prior `competitors.md` recorded Fillo as invisible
   for "shokupan Bangalore." That has changed — Google's AI Overview leads with Fillo Bakes Plus. The GBP is
   working. But **14 reviews against Tempt's 104 and Bunco's 1,897** is the gap that matters now.

2. **Prices disagree across channels.** The same overview cites the Swiggy menu at
   **classic milk shokupan ₹249, marble ₹249, chocolate ₹299**, against the website's **₹200 / ₹200 / ₹250**.
   I could not load the correct Swiggy storefront directly to confirm — the restaurant ID I tried resolved to a
   different outlet — so **treat this as needs-verification, not as established**. If it holds, it is a serious
   problem: the prior work's principle *"every number on the site is true"* is insufficient. The principle has
   to be **every number on every channel agrees**, because Google shows a buyer the Swiggy price and the site
   price on the same screen.

---

## 2. Feature matrix vs Fillo's current site

Legend: ● present and good · ◐ present but weak · ○ absent

| Capability | Fillo today | Hotplate | GAIL's | Blue Tokai | Wildgrain | Theobroma | BSS | Lily Pond | Levain | Country Delight |
|---|---|---|---|---|---|---|---|---|---|---|
| Serviceability / area check before pay | ○ | ● (stop picker) | ● (postcode on PDP) | ● (PIN on PDP) | ● | ● (locator first) | ● (badge) | ● (city modal) | ◐ (offsite) | ● (city selector) |
| Fulfilment mode visible in nav | ○ | ● | ● | n/a | n/a | ● | ● | ● | ● | n/a |
| Computed order-by cutoff in copy | ○ | ● (drop + countdown) | ● (bar **and** PDP) | ○ | ◐ (reminder) | ◐ | ○ | ○ | ◐ | ● (header) |
| Sold-out shown, not hidden | ○ | ● | ● | ● | n/a | ◐ | ◐ | ○ | ◐ | ○ |
| Live per-item stock counts | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| Cart hold / reservation timer | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| One checkout, one domain | ○ (Shopify hop) | ● | ● | ● | ● | ○ (2 sites) | ● | ● | ○ (order.online) | ◐ (app) |
| Phone-first identity | ○ (email) | ● | ○ | ○ | ○ | ◐ | ◐ | ◐ | ○ | ● |
| Fee shown before address | ○ | ● | ◐ | ● | ○ | ◐ | ◐ | ○ | ◐ | ◐ |
| Subscription | ○ | ○ | ○ | ● | ● | ○ | ○ | ○ | ○ | ● |
| Skip / pause / vacation mode | ○ | ○ | ○ | ● | ● | ○ | ○ | ○ | ○ | ● |
| Pre-charge reminder | ○ | ○ | ○ | ◐ | ● | ○ | ○ | ○ | ○ | ○ |
| Loyalty | ◐ (₹1, email) | ● | ● (9 stamps) | ○ | ◐ (perk-for-life) | ○ | ○ | ○ | ● (Cookie Club) | ● (free) |
| Free to join loyalty | **○ (₹1 toll)** | ● | ● | n/a | ● | n/a | n/a | n/a | ● | ● |
| Notify-me / list capture | ○ | ● (SMS, primary CTA) | ◐ | ◐ | ◐ | ○ | ○ | ○ | ◐ | ● |
| Live vehicle tracking | ● (hidden pill) | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| Published route / schedule | ○ | ● | ● (locator) | n/a | n/a | ● | ○ | ◐ | ● | ○ |
| Gift cards | ○ | ● | ◐ | ◐ | ● | ○ | ● | ○ | ● | ○ |
| Reviews per SKU | ○ (site-wide quotes) | ● (99, photos) | ○ | ● | ● | ◐ | ● | ◐ | ● | ◐ |
| Search | ○ | ○ | ● | ● | ● | ● | ● | ○ | ● | ● |
| Order tracking page | ○ | ○ | ○ | ● | ● | ● | ● | ○ | ● | ● |

**The one column Fillo wins outright is live vehicle tracking — and it is a floating pill in a corner.**
Nobody else in this table has anything like it. It is also the only capability here that a competitor cannot
buy off a Shopify app store.

---

## 3. Things to add — prioritised, with effort

### P0 — ship before anything else (these are broken promises, not features)

| # | Change | Why | Effort |
|---|---|---|---|
| 1 | **One total, from the first screen it appears, including delivery** | The current site promises a total and Shopify then adds a delivery line. Zepto puts ₹0-fees in its hero; Hotplate shows Subtotal / Taxes & Fees / Total before asking for an address. Nothing else on this list matters if the price moves. | M |
| 2 | **One checkout on one domain** | Levain and Theobroma both split their funnel and both are worse for it. Fillo's split is worse still because it changes domain to `myshopify.com` mid-purchase. | L |
| 3 | **Serviceability / route check before payment** | Every India benchmark has one: Blue Tokai's PIN check on the PDP, Bombay Sweet Shop's `Mumbai only` badge, Lily Pond's city modal, Theobroma's locator. Fillo has none — any Indian address currently passes. | M |
| 4 | **Kill the inflated numbers** | "100+ Items" against 23 SKUs; "500+ Lovers". The dummy franchise phone number (+91 98765 43210) is still live. | S |
| 5 | **Fix the dead sitemap entries and blog links** | 8 of 12 `/product/*` sitemap URLs render "Product Not Found" at HTTP 200; blog links point at `/blogpage/undefined`. | S |
| 6 | **Reconcile prices across web, Swiggy and Google** | Google is currently showing a buyer two different prices for the same loaf. Verify first, then fix at source. | S |
| 7 | **Rewrite the shipping policy to describe the van** | It currently describes couriers, weight-based charges and 1–2 business days. It contradicts the product. | S |

### P1 — the conversion build

| # | Change | Evidence | Effort |
|---|---|---|---|
| 8 | **Computed cutoff sentence in three places**: announcement bar, above the buy button on every PDP, next to the greyed date at checkout | GAIL's runs it in the bar *and* on the PDP; Milkbasket and Country Delight run it in the header | S |
| 9 | **Replace the 30-day calendar with 2–3 named drop cards** (`Saturday · Indiranagar · 4–6pm`) | Every route-based operator observed shows named drops, not a calendar: Hotplate's `Pickup on Thu, Sep 3 · Lake Ridge + 3 more` | M |
| 10 | **Fulfilment lane in the navigation**, decided at entry, confirmed at checkout | Bombay Sweet Shop (`Shop Mumbai` / `Shop All-India` as the first two tiles), Levain (`Same Day Pickup or Delivery` top-level), Theobroma (locator before menu) | M |
| 11 | **Phone-first identity, OTP, email optional** | Hotplate's entire checkout step 1 is a phone field: *"We need this to send you updates about your order"* | M |
| 12 | **Sold-out kept in the grid, greyed, with a loud ribbon and a `Notify me`** | Hotplate and Blue Tokai both do exactly this | S |
| 13 | **`Never miss a drop` list capture as a primary CTA**, WhatsApp-first | It is the single most prominent control on the Hotplate storefront | M |
| 14 | **Promote the van tracker from a pill to `/van`**, schedule-first | Fillo's one unique asset is currently a corner widget | L |
| 15 | **Cart hold timer during a live drop** | Hotplate's ~7-minute reservation timer; it is honest because the inventory really is held | M |
| 16 | **Per-SKU reviews with photos** | Fort Mill Sourdough shows 99 reviews with images on the storefront; Fillo has 8 unattributable site-wide quotes and a review widget that goes nowhere | M |

### P2 — the retention build

| # | Change | Evidence | Effort |
|---|---|---|---|
| 17 | **The weekly bread subscription ("The Standing Order")** with skip / pause / change-day / cancel self-serve | Blue Tokai's manage-subscription FAQ; Wildgrain's *"Easy to manage, skip, or cancel anytime"*; Country Delight's **vacation mode** | L |
| 18 | **Pre-charge reminder before every recurring order** | Wildgrain: *"GET REMINDERS 4 DAYS BEFORE EACH ORDER … via email and SMS"* | M |
| 19 | **Make Fillo+ free to join and phone-based** | Nobody charges to join: Country Delight (`Free Membership on your signup`), GAIL's 9-stamp card, Levain Cookie Club, Wildgrain's croissants-for-life | S |
| 20 | **A real account area** — orders, addresses, subscription, rewards, alerts | Blue Tokai and Wildgrain both push all subscription control into a member account | L |
| 21 | **Gift cards as a menu category** | Hotplate sells them as a menu tab — a zero-inventory SKU that still converts on a sold-out day | S |
| 22 | **Route/area landing pages** (`/areas/indiranagar`) | Theobroma's locator, GAIL's "Find your nearest bakery"; this is also the only realistic local-SEO lane | M |
| 23 | **A `Search` field** | Every India benchmark walked leads with one (Blinkit, Zepto, Country Delight, Milkbasket, Bombay Sweet Shop). Indian shoppers are trained to search. | S |

### P3 — later
Gifting flow with note card and hidden prices; corporate/bulk lane (Levain, Bombay Sweet Shop, Theobroma all
have one); a class or membership tier (Bread Ahead); the stamp-rally game layer — **build the slot, not the
feature** (see §7).

---

## 4. Homepage section recommendation, in order, with the reason for each

The homepage answers four questions in this order: **What is this? · Can I actually get it? · Is it worth
₹250? · How do I get one now?** Every module below earns its place against one of those.

| # | Section | Why it is here, and where the pattern comes from |
|---|---|---|
| 0 | **Announcement bar: the computed cutoff** — `Order by Thursday 8pm for Saturday's Indiranagar run` | GAIL's uses exactly this slot for exactly this sentence, and it is the highest-leverage copy on their site. It converts a moving van from an uncertainty into a deadline. |
| 1 | **Sticky header**: wordmark · **area/lane chip** (`📍 Set your area` → `📍 Indiranagar · Sat 4–6pm`) · search · account · cart | Blinkit and Zepto both reserve this exact slot for delivery status. The chip is where the whole area question lives, and it must show the *fulfilment mode*, not just the place — that is Lily Pond's insight. |
| 2 | **Hero: one photograph of torn crumb, one sentence, one button** | Food image, at scale, is the trigger. One line that is a promise with a time in it, not an adjective. One CTA (`See this week's bake`). No carousel — Blue Tokai's and Wildgrain's carousels are the weakest part of otherwise strong pages. |
| 3 | **Trust strip**: `100% eggless` · `No preservatives` · `Baked daily` · `FSSAI <number>` | Levain runs a four-item ticker in this exact slot. For Fillo the eggless claim needs to be a persistent badge, not the headline — it is what a searcher needs to *confirm*, not what a browser needs to be *sold*. |
| 4 | **The two ways to get bread** — two cards, side by side, with real prices: **Catch the van · free, at a stop near you** / **Home delivery · ₹49, in a 2-hour window** | Bombay Sweet Shop makes fulfilment the first two tiles on the page; Levain makes it a nav item. Deciding the lane here rather than at checkout is what stops the cart from being wrong. This is also where the area chip gets set for most visitors. |
| 5 | **This week's bake** — the live drop card: name, date, stop, `We bake 40 · 12 left`, progress bar, `Orders close Thursday 8pm. No restocks, it is a van.` | Hotplate's drop card, adapted. Supply framing rather than time framing. The cap number must be wired to the real order table or it must not ship. |
| 6 | **Today's / this week's menu — 6 to 8 items, two-up, sold-out included and greyed** | Keep the visible menu small so sold-out reads as an event rather than as a broken catalogue — that is GAIL's failure mode at 263 SKUs and Hotplate's success at ~14. `See all 23 →` underneath. |
| 7 | **Order again** — returning visitors only, injected above §6 | Last three items, one-tap add each. The single highest-value module for a repeat-purchase staple, and it costs almost nothing. |
| 8 | **The van** — live strip when running (`The van is 2 stops from Indiranagar · Track it`), the week's route when not (`Saturday Indiranagar · Sunday Koramangala`) | This is Fillo's only unreplicable asset and today it is a corner pill. It belongs mid-page as proof of the model, with the tracker page one tap away. **It must render its off-air state as well as it renders its live state** — five days out of seven, off-air *is* the module. |
| 9 | **Why it costs what it costs** — ferment hours, the method, the founders, the neighbourhood-bread-vendor story, one baker's face | GAIL's names its farmer and its miller on the homepage. At ₹200 a loaf a buyer is hunting for something checkable. Placed *after* desire and *before* the objection can harden. |
| 10 | **Proof** — three real named reviews with areas, plus the review count and star average | Fort Mill Sourdough puts 99 photo reviews on its storefront. Fillo's 14 Google reviews against Tempt's 104 is the real competitive gap; the site should be a review-collection machine. |
| 11 | **The Standing Order** — the weekly subscription pitch, three lines and a button | Blue Tokai and Wildgrain both place the subscription pitch below the product proof, not above it. You sell the ritual to someone who already wants the bread. |
| 12 | **Fillo+** — free membership, coins, early access | Loyalty belongs low. High placement reads as a discount brand, and it converts people who have already decided. |
| 13 | **Footer** — FSSAI number, legal entity, policies, contact, socials, WhatsApp | |

**Floating: exactly one element — WhatsApp, bottom-right.** Bombay Sweet Shop runs one. Fillo currently runs
a van pill down there; that moves into §8 and `/van`.

**Deliberately absent:** hero carousel, popup email capture, stacked coupon codes in the bar (Theobroma's
nine-code strip is the anti-pattern), a second floating widget, "100+ Items".

---

## 5. Recommended user journeys

### 5.1 First-time visitor → first order

```
Instagram / Google / poster QR
  → Home. Cutoff bar reads a real deadline.
  → §4 "Two ways to get bread". Tap a lane.
      ├─ CATCH THE VAN  → pick a stop from a short named list  → chip set: "Indiranagar · Sat 4–6pm · free"
      └─ HOME DELIVERY  → area autocomplete (area name, not raw pincode)
              ├─ served     → chip set: "Banaswadi · Sat 4–6pm · ₹49, free over ₹399"
              └─ not served → waitlist: name the area, one phone field, "You're #23 in Banaswadi"
  → This week's bake. 6–8 items. Sold-out greyed, in place, with Notify me.
  → PDP: crumb photo, sensory line, spec chips, eggless as the reason not the headline,
         cutoff line directly above the button, the chip's lane/date/slot restated under it.
  → Add. Cart drawer shows: subtotal, delivery (or free-with-van), the gap to free delivery, and the TOTAL.
  → Checkout, one page, on-domain:
         1. Fulfilment (pre-filled from the chip, editable, both lanes with true prices)
         2. Phone → OTP.  Email optional, labelled "for your invoice".
         3. Address (India-shaped: flat, building, area, landmark, pincode) — HOME DELIVERY LANE ONLY
         4. Total, unchanged from the drawer.  Pay with UPI.
  → Confirmation: a promise, not a warning.
         "Saturday, 4 to 6pm, at your gate. We'll message you Friday night with the exact time."
         + Track this order  + Join Fillo+ (free, one tap, phone already verified)
```

The four things that make this different from today's site: the lane is decided before the cart, the area is
asked before the payment, the total never changes, and identity is a phone number rather than an email plus a
Shopify account.

### 5.2 Repeat buyer → subscription

Do not sell the subscription to a first-time visitor. Sell it at the **second or third** order, at the moment
the buyer has just proved the habit:

```
Order #2 confirmation  →  "You've ordered a Milk Shokupan twice.
                           Want it on the van every Saturday? Skip any week."
                           [ Set up a standing order ]
  → Standing order builder (4 steps, one screen):
      1. What          → 1 loaf (default: Milk Shokupan) + optional add-ons
      2. Where & when  → route day derived from the saved area; "Every Saturday, Indiranagar, 4–6pm"
      3. How often     → Weekly (default) / Fortnightly
      4. Confirm       → price per delivery, the 10% standing-order price, the cutoff rule,
                         and "Skip any week. Pause anytime. Cancel in one tap." above the button
  → Then: a reminder every week at cutoff-minus-24h with one-tap SKIP.
```

The default matters. Wildgrain and Blue Tokai both default to the most common plan and put the escape hatch
*adjacent to the toggle*, not buried. The skip button in the reminder is the whole retention mechanic —
Country Delight names it **vacation mode** and it is the most-used feature of a milk subscription.

### 5.3 Street / van encounter → WhatsApp → order

This is the journey the current site does not serve at all, and it is where a moving bakery's demand
actually originates.

```
Someone sees the van, or is handed a card at a stop
  → QR on the van's glass case / on the bag / on the receipt
  → /van?stop=indiranagar   (no login, no app, no location permission)
       - live: "2 stops away · around 4:40 to 4:50" + today's route + what's still on board
       - off-air: "Back Saturday" + this week's route + [ Tell me when the van's out ]
  → [ Tell me when the van's out ] → one phone field → WhatsApp opt-in
  → Saturday morning: one WhatsApp message — this week's bake + a deep link to the drop
  → Order in two taps; the phone number is already the account, so no address is asked
    if they picked the van lane.
```

**Where each mechanism sits in the flow:**

| Mechanism | Where it belongs | Where it must NOT be |
|---|---|---|
| Area / serviceability check | Homepage §4 and the header chip; restated on the PDP | Not first at checkout (today's failure) |
| Route/slot picker | Under the buy button on the PDP, pre-filled from the chip | Not a 30-day calendar; not first seen at checkout |
| Van tracker | Its own page `/van`, a homepage module, and a link in every order confirmation and WhatsApp message | Not a floating corner pill |
| Fillo+ | Post-purchase one-tap join; a low homepage module; the account dashboard | Not a paid gate, not an interstitial |
| The Standing Order | Order #2 confirmation; a nav item; a low homepage module; the account dashboard | Not in the first-order funnel |

---

## 6. Copy and microcopy worth borrowing

**Order-by cutoff** — the single most valuable sentence pattern found.
- GAIL's, announcement bar and PDP: `ORDER BY 11AM TOMORROW FOR DELIVERY ON SATURDAY`
- Milkbasket, header: `Order by Midnight · Delivery by 7 AM!`
- Country Delight: *"Orders placed by 12 midnight are delivered the next day between 5:00 AM and 7:30 AM"*
- Hotplate operator voice: *"must be ordered by 9:15am. After that all extras are sent to The Speckled Pear"*
  — note that it names the *consequence*, not just the time.

**Sold-out.** Say the status, name the cause, convert it into an action, and promise a payoff — in that order.
Hotplate keeps the item in the grid, greyed, with a red `Sold Out` ribbon. Blue Tokai keeps it with
`SOLD OUT` and `LIMITED RELEASE` side by side, so scarcity reads as demand rather than as failure.
For Fillo: *"Gone for this week. Forty loaves, gone by 9:15."* → `Tell me when the van's back out` →
*"One message, Sunday morning. Nothing else."* (Stating the frequency at the point of opt-in is what makes
people opt in.)

**Availability limits.** Bombay Sweet Shop's **`Mumbai only`** badge on the card in the grid. Fillo's version
is `Van routes only` / `Home delivery available` / `This route only`, on the card, not in an accordion.

**Subscription anxiety.** Wildgrain, verbatim: *"Easy to manage, skip, or cancel anytime."* /
*"Skip, pause, or cancel whenever you like via your Member Account."* / *"Get a reminder 4 days before each
order."* Country Delight's naming — **"vacation mode"** — is better than "pause" because it removes the
implication that you are quitting.

**Fee transparency.** Zepto's hero: `₹0 Handling Fee · ₹0 Delivery Fee* · ₹0 Rain & Surge Fee` with the
asterisk honoured immediately underneath. Blue Tokai states it on the PDP: `FREE STANDARD SHIPPING on all
prepaid orders above ₹350`.

**Identity ask.** Hotplate: *"Enter your phone number — We need this to send you updates about your order."*
The reason is given in the same breath as the ask. Fillo's current Fillo+ asks for an email with no reason at all.

**Confirmation.** Make it a promise with a named next contact:
*"Got it. Your box is on Saturday's list. We'll message you Friday night with the exact spot and time."*
Never the current site's *"No changes can be made after payment."*

**Empty and error states.** Bombay Sweet Shop's 404: *"Oops! Nothing here. Click here to head back home and
find something sweet"* — plus a bestsellers rail, so the dead end still sells.

**Joining incentive.** Wildgrain's `FREE CROISSANTS FOR LIFE` beats any percentage-off. A permanent small perk
outperforms a one-time discount because it is a reason to stay, not a reason to arrive.

---

## 7. Validation of the prior research

The prior corpus is genuinely strong — better sourced than most agency work, and honest about its own
confidence levels. But it was assembled by fetching pages rather than driving them, and that shows: several of
its most important recommendations rest on marketing copy and help-centre docs rather than on the actual
buying experience. Where I walked the same site with a cart, some conclusions change.

### AGREE — keep, now with better evidence

| Prior claim | Verdict | What I observed that strengthens it |
|---|---|---|
| **Price integrity is severity-one; one total, never changed** | **AGREE, strongly** | Hotplate shows `Subtotal / Taxes & Fees ⓘ / Total` at checkout step 1, *before* an address exists. Zepto puts `₹0 Handling · ₹0 Delivery · ₹0 Rain & Surge` in the hero. Both treat the number as the promise. Extend the rule: the fee must be visible **before the address**, not merely before payment. |
| **One domain, one checkout, one contact ask** | **AGREE** | And here is the sharpest evidence they didn't have: **Levain — the site they cite as the model — sends its local lane off-domain to `order.online`.** The two sites in this report that split their funnel (Levain, Theobroma) are both worse for it. |
| **Phone + OTP as identity; email optional** | **AGREE, now evidenced** | The corpus rested this on a vendor-sourced abandonment statistic it flagged as directional. Hotplate's checkout **step 1 is a phone field and nothing else**, with the reason stated inline. That is a much better argument than the statistic. |
| **Computed cutoff sentence in the announcement bar** | **AGREE, and extend** | Confirmed live on GAIL's. But it appears in **two** places, and the second is the more valuable: **in red, directly above ADD TO BASKET on the PDP**. Ship it in three places: bar, PDP above the button, checkout beside the greyed date. |
| **Sold-out stays visible with a notify-me** | **AGREE** | Hotplate and Blue Tokai both do exactly this. One correction: `psychology.md` §2.3 says keep it **"full colour."** Every site I walked **mutes the card and keeps the ribbon loud**. Do that instead — a full-colour unbuyable card is a usability trap. |
| **Full slots shown and disabled, not hidden** | **AGREE** | The Indian convention is show-and-disable: Swiggy renders `Closed & not delivering` and `This location is outside the outlet's delivery area` inline with the catalogue still visible. Their divergence from the cited "best practice" was the right call. |
| **Cap the date picker at ~7 days, not 30** | **AGREE, and go further** | A 30-day picker implies a bakery that freezes. But no route-based operator I walked uses a calendar **at all** — Hotplate shows named drop cards (`Pickup on Thu, Sep 3 · Lake Ridge + 3 more`). Replace the calendar with 2–3 named drops. |
| **Off-air state designed as a first-class page** | **AGREE** | The Hotplate storefront **is** an off-air-first page: schedule in the bio, `Current & Next Drops`, `Past Drops` archive, and a live element only when a drop is imminent. Use it as the structural model for `/van`. |
| **Kill the inflated numbers; drop Contentsquare; India-shaped address** | **AGREE** | No dispute. |

### REFINE — right instinct, wrong specification

**1. Area-first gating (`india-ux.md` F1: soft chip, never a wall).**
The evidence is genuinely split and their spec is under-determined. **Lily Pond Bakery — the closest Bengaluru
bread analogue in existence — uses a hard modal on first paint.** Blinkit uses a modal over a catalogue that
still renders. Zepto uses no gate at all. Country Delight uses a persistent header selector.

The resolution is not soft-vs-hard. It is: **gate the answer, not the catalogue.** Let people browse freely,
but every place where the answer depends on where they are — the fulfilment cards, the drop card, the PDP
route line, the cart — must either show the real answer or ask for the area. And the corpus's chip spec is
missing the thing Lily Pond gets right: **the chip must carry the fulfilment mode, not just the place.**
`📍 Indiranagar · Sat 4–6pm · catch the van` is a different chip from `📍 Indiranagar`.

**2. "Three doors" as a first-visit interstitial.**
Sound psychology, unevidenced as an interface. **No site in this set does it.** What the market actually does
to reduce a first choice is (a) keep the *drop* small by construction — Fort Mill Sourdough shows ~14 items
across four tabs, and GAIL's 263-SKU catalogue is the counter-example the corpus itself flags; (b) craving-led
category tiles (Blue Tokai); (c) fulfilment-led tiles (Bombay Sweet Shop).

Adding a blocking screen to a funnel you are otherwise trying to shorten from seven surfaces to four is
self-contradictory. **Demote three doors to the top module of `/shop`,** and solve overload the way the
category actually solves it: publish a weekly drop of 6–8 items, with all 23 one tap behind it.

**3. The blanket ban on countdowns (PDF principle 3; `india-ux.md` F2).**
**This is the one I would overrule outright.** Hotplate — the closest operating analogue that exists, and the
category leader for exactly this model — runs **two clocks**: a countdown to the real order cutoff on the drop
card (`00 Hours 04 Mins 15 Secs`), and a **~7-minute cart reservation timer** that persists into checkout.

Neither is manufactured. The first renders a published fact. The second renders real held inventory — it is
the mechanism that stops ten people from buying the last four loaves. The corpus's own `psychology.md` reaches
the correct nuance (§2.5: use one clock, framed as a calendar deadline) and then the PDF flattens it into a
blanket prohibition.

**The rule should be: no clock that is not wired to a real constraint.** Ship both of Hotplate's. Ban only the
evergreen resetting timer.

**4. Two lanes on one checkout screen.**
Agree on substance — and the corpus was right to flag it as an assumption, because it was one. It is now
evidenced. But the evidence says the lane belongs **earlier than checkout**: Bombay Sweet Shop makes it the
first two tiles on the homepage, Levain a nav item, Lily Pond part of the entry modal, Theobroma the entry
itself. The reason is operational, not aesthetic: **the lane changes which days, which stops and which items
are available.** Decide it at entry; *confirm* it at checkout. A checkout-time lane switch means the cart the
user built may not be fulfillable.

**5. "No search field until 40+ SKUs" (F3).**
Mild disagreement. Blinkit, Zepto, Country Delight, Milkbasket, Bombay Sweet Shop, GAIL's, Blue Tokai and
Levain all lead with a prominent search field. Indian shoppers are trained to search. It costs almost nothing
and it is the fastest path for someone who arrived from Google looking for "shokupan". Ship it; just don't
make it the hero.

**6. "Stops away, not minutes" and the ≤3-stop threshold.**
Agree on the principle. But note honestly: **I could not observe Amazon's implementation** — it is order-scoped
— so the "≤3 stops vs Amazon's documented 10" reasoning stands on the corpus's citation, not on anything
either of us has seen running. The corpus's own audit flags this threshold as invented. Treat `3` as a launch
guess to be tuned, and lean the design on the thing that survives every failure mode: **the stop list**.
Both Hotplate and Theobroma carry their whole proposition in a list, with the map as decoration.

**7. Live per-item counts ("We bake 40. 12 left.").**
Agree it is the right mechanic and the meta-analysis behind it is the best-sourced claim in the corpus. But
be clear-eyed: **not one site in this walk publishes live per-item counts.** Hotplate, Blue Tokai and GAIL's
all show a binary sold-out. So this is a genuine differentiator *and* an unproven one, with a real operational
cost — the number has to be true every minute or it destroys the trust it was built to earn. Ship it, wire it
to the order table, and instrument it.

**8. Publishing "didn't sell out this week — still 9 loaves at 4pm."**
Keep the idea, move the placement. On the homepage a first-time visitor with no history reads it as weak
demand. On `/van` and in the Sunday WhatsApp message, to people who already know the ritual, it reads as
honesty. Same string, different room.

### DISAGREE — overrule

**1. The ₹1 Fillo+ join fee. Kill it.**
This is the clearest unforced error on the current site and the corpus never questions it — `india-ux.md`
only asks to migrate its identity from email to phone. **Nobody in this report charges to join a loyalty
programme.** Country Delight: `Free Membership · On your signup`. GAIL's: nine stamps, free app. Levain:
Cookie Club. Wildgrain: free croissants for life.

Worse, Fillo's ₹1 fee requires the user to complete an entire Shopify checkout to join a *loyalty programme*.
That is a full purchase funnel guarding a free-to-operate retention mechanic, and it will be filtering out the
large majority of people who would otherwise become identifiable customers. Make Fillo+ free, phone-based,
and one tap from the order confirmation, where the phone is already verified.

**2. The customer-naming ticker ("Anjali in Indiranagar just took 2") and "Baking for: Anjali, Rehan, the Prakash family…".**
Keep the count; drop the names. Publishing customers' first names and neighbourhoods on a public page is a
privacy problem that no competitor in this set takes on, and it buys social proof that a plain count already
buys. Real reviews with photos (Fort Mill's 99) do this job better and are consented.

**3. The stamp-rally game layer as a build item.**
The corpus's own primary source for it is a *post-mortem of why Foursquare's gamification failed*. There is
zero in-category evidence for it in anything I walked. Build the empty slot in the `/van` layout so the
design accommodates it later; do not build the feature until the ritual itself is proven over the corpus's
own suggested ~9–10 week habit window.

**4. "Every number on the site is true" as the price-integrity principle.**
Too narrow. Google currently appears to be showing a buyer the website price (₹200) and the Swiggy price
(₹249) for the same loaf on the same screen. The principle has to be **every number on every channel agrees**
— site, Swiggy, Zomato, Google Business Profile, WhatsApp catalogue. Needs verification first, but it changes
the shape of the rule.

### What the prior research MISSED

1. **`order.theobroma.in` exists.** They walked `theobroma.in` and concluded Theobroma is a nationwide Shopify
   catalogue. Theobroma actually runs a **second storefront whose ordering entry point is a store locator with
   `Use my location` / city / locality, `Open Now` and `Veg Only` filters, and per-store Delivery/Pickup badges
   with opening times.** This is the single closest analogue in Indian e-commerce to choosing a van route
   before seeing a menu, and it is missing from the corpus entirely.
2. **They never drove a Hotplate storefront.** They read the marketing site and the help centre. Everything
   that matters is on the buyer side and none of it is in the corpus: the **cart reservation timer**, the
   **3-step `Info / Time / Pay` checkout**, the **phone-only first step**, the **per-drop location dropdown of
   named neighbourhood stops with ZIP and map links**, the **`Past Drops` archive**, the **99 photo reviews**,
   and **gift cards as a menu category**.
3. **Blue Tokai's subscription detail.** They missed the **24-delivery / 20% tier** (their ladder stops at 12),
   their prices are stale (₹1,500/₹3,000/₹6,000 vs the live ₹1,755/₹3,412/₹6,435/₹12,480), and they missed the
   two things that actually matter: the **PIN-code checker sitting on the subscription PDP** and the
   **three-group Manage Subscription FAQ** that is effectively the whole subscription UX contract — pause,
   resume, cancel, change grind per delivery, change address per delivery, out-of-stock policy, prepay policy.
4. **Fulfilment as navigation.** They captured Bombay Sweet Shop's `Mumbai only` badge but not that
   **`Shop Mumbai` and `Shop All-India` are the first two tiles on the homepage**.
5. **Levain's local lane is off-domain.** They hold Levain up as the fulfilment-first model without noticing it
   commits the exact seam they are trying to remove from Fillo.
6. **Country Delight's "vacation mode"** — a better name for skip/pause than anything drafted — and
   **Milkbasket's `Order by Midnight / Delivery by 7 AM` header plus a `Wallet` primary tab**, which is how a
   high-frequency low-value subscription removes payment friction from every single delivery.
7. **Zepto's fee-transparency hero.** Direct support for their own price-integrity principle, from the most
   familiar app in their target user's phone.
8. **Sour House is not what they think it is.** They call it *"the only established recurring-delivery bread
   subscription in Bengaluru."* Its site is a white-label template titled **`Template 1`** with a
   `Minimum Delivery Time: 1440 mins` and **no self-serve subscription at all**. The local bar is far lower
   than the corpus implies — which is good news, and changes the ambition calculus.
9. **Fillo now ranks.** `competitors.md` records Fillo as invisible for "shokupan Bangalore." Google's AI
   Overview now leads with Fillo Bakes Plus. The gap has moved from visibility to **review count**: Fillo 14,
   Tempt Bakehouse 104, Bunco 1,897. And there are new rivals the corpus doesn't list — **Tempt Bakehouse
   (Koramangala, 4.9), Bunco (Mahadevapura), Juny's Bakehouse (20.4K IG)**.
10. **Cross-channel price divergence** (§1.13) — needs verification, but potentially the most damaging
    integrity problem on the list.
11. **Domain hygiene.** `bakersdozen.in` is no longer The Baker's Dozen. Fillo should defend its variants now.
12. **Subscription mechanics generally.** The corpus contains almost no subscription UX — `psychology.md` has
    a default-plan note and that is nearly all of it. Blue Tokai, Wildgrain and Country Delight together supply
    the complete playbook and it is not in the research.

### Internal contradictions in the corpus that must be settled

| Conflict | Ruling |
|---|---|
| Cutoff: Thursday **6pm** (`teardown-category`) vs **8pm** (PDF, mocks) vs **9pm** (`psychology`) | **Thursday 8pm.** Pick it, compute it, and render the same computed string everywhere. |
| Delivery fee: **₹50** (PDF) vs **₹49 + free over ₹399** (`india-ux` F14) | **₹49, free over ₹399.** Blue Tokai states the equivalent on the PDP (`free above ₹350`); state it wherever the fee is shown. |
| Countdowns: forbidden (PDF, F2) vs steal Hotplate's (`teardown-category` #16) | **Allowed, if wired to a real constraint.** See REFINE 3. |
| Van name: **Momo** (`psychology`) vs **Kenji** (mock-tracker) | Settle before any mock ships. |
| Van schedule: "two days a week, out 4:30pm" (mock) vs a daily-ish morning route (`tracking-ux` sample feed) | **This is a business fact, not a design choice.** Get it from the founders before the tracker is designed; the whole off-air/live ratio depends on it. |
| Six stops | Unsourced throughout, then load-bearing for the stamp card. Confirm the real number. |
| Browse-grid prices: numerals-only (`psychology` §3.5) vs `₹` shown (mock-commerce) | Show `₹`. The 8.15% finding is a 201-party restaurant study; on an Indian e-commerce grid a bare `220` reads as an error. |

---

## 8. Van and live-tracking benchmark

### 8.1 What I could actually observe

Most consumer order trackers are order-scoped and unreachable without a live paid order (see §0). What is
publicly observable is the **surrounding layer** — how route-based businesses publish schedules, states and
cutoffs — and that turns out to be the more transferable half anyway.

| Source | Observed | Transferable lesson |
|---|---|---|
| **Hotplate storefront** (`hotplate.com/fortmillsourdough`) | Route schedule written as day-by-day neighbourhood text; `Current & Next Drops`; a countdown only on the imminent drop; `Past Drops` archive; `Never miss a drop` as the most prominent control | **The schedule is the page. The live element is the garnish.** This is the correct structure for `/van`, not a map app. |
| **Hotplate drop page** | Location row expands to named stops with city + ZIP and an open-in-maps icon | Stops must be **named places with a map link**, not coordinates |
| **Theobroma locator** (`order.theobroma.in/store-locator`) | Map + list side by side; `Use my location` / city / locality; per-store `Delivery from 9:00 AM`, hours, `Kms away`, `Delivery`/`Pickup` badges, `Open Now` filter, directions + call | **A list of stops with per-stop status and hours is the whole product.** The map is the illustration. |
| **Swiggy storefront** | `This location is outside the outlet's delivery area`; `Closed & not delivering` — rendered inline, catalogue still visible | Off-hours and out-of-area are **states of the normal page**, not error pages |
| **Blinkit** | Location modal on paint; header slot reads `Currently unavailable / Select Location ▾` before selection | The header is where a delivery-status string lives in the Indian mental model |
| **Zepto** | Header slot reserved for the location/ETA pill; `₹0 Delivery Fee` in the hero | Same slot, and fees belong next to it |
| **Milkbasket / Country Delight** | `Order by Midnight · Delivery by 7 AM!`; `by 12 midnight … between 5:00 AM and 7:30 AM`; **vacation mode** | Cutoff-as-header; **an arrival band, never a single time** |
| **Blue Tokai / Wildgrain** | Manage-subscription FAQ; `reminder 4 days before each order`; `skip, pause, or cancel anytime` | The subscription's tracker is a **reminder with a skip button**, not a map |

**Not observed, inherited from `tracking-ux.md` and labelled as such:** Domino's four-stage strip and its ~40s
display-latency cap; Amazon's `N stops away` counter appearing only within 10 stops and its fallback string
*"The driver has to make a few more deliveries on the way"*; Swiggy/Zomato's Redis + WebSocket marker
interpolation; Mister Softee's no-account ZIP entry and its missing nearest-truck affordance. These are
plausible and properly cited in that document, but neither of us has watched them run. Note also that its
WhatsApp figures (~98% open, ~50% response) and its push-frequency figures come from vendor marketing blogs;
plan against the more conservative 3–7% broadcast conversion its own `touchpoint-benchmarks.md` recommends.

### 8.2 What the observed set says about how to show a moving vehicle

1. **The list owns the truth; the map owns the feeling.** Every route business observed leads with a list of
   named places with states attached. None of them makes a moving dot the primary content. Fillo's tracker must
   be fully readable with the map layer entirely failed to load.
2. **Off-air is the default state, so design it first.** If the van runs two days a week, the live map is right
   five-sevenths of nothing. Hotplate's storefront is off-air 90% of the time and remains a page worth
   bookmarking because the schedule and the next drop are the content.
3. **Arrival is a band, never a time.** Country Delight and Milkbasket both publish windows (`5:00–7:30 AM`,
   `by 7 AM`), never a minute.
4. **Proximity should be counted in stops, not metres.** Distance is a lie on a multi-stop Bengaluru route.
   (Principle inherited from Amazon via `tracking-ux.md` — not directly observed.)
5. **No login, no app, no location permission.** The tracker is reached by QR from the van's glass case, by a
   WhatsApp forward, and from an Instagram bio. Any wall kills it.
6. **Notify-me is anchored to a place the user picked, not to their live position** — which means the geofence
   runs server-side against the van and the user never grants a location permission. This is both the honest
   design and the one that removes an entire permissions funnel.
7. **Publish the van's position snapped to the route, during service hours only, with no history trail, and
   give the driver a kill switch.** A public, always-on, precise position of a small vehicle carrying cash and
   one or two staff is a safety surface, and the driver's whole working day should not be public. This is the
   corpus's reasoning and it is correct; it should be a hard requirement, not a nice-to-have.

### 8.3 Concrete spec — `/van` page

Twelve modules, mobile-first. **Everything above the map must be server-rendered before any map library loads.**

| # | Module | LIVE state | OFF-AIR state |
|---|---|---|---|
| 1 | Status pill | `● LIVE · UPDATED 9S AGO` | `OFF AIR · BACK SATURDAY` (never a bare "offline") |
| 2 | Hero line (largest type on the page, min 48px mobile) | `2 stops away.` / `Here now — Indiranagar 12th Main` | `The ovens are cold. The plan isn't.` |
| 3 | Arrival band | `Around 4:40 to 4:50` — widens itself when the van's speed over the last 3 fixes drops below walking pace; caps at `Around 20+ min` rather than printing a big number | `Rolls out Saturday, 4:30pm` |
| 4 | Map (lazy-loaded, after first paint, or on tap under a save-data heuristic) | Today's full route drawn: completed portion dashed at 30% opacity, remaining solid; stop pins in four states; van marker with a face, upright, tweened across the full 15s refresh interval, with a separate rotating direction chevron; `Find the van` button re-centres after any pan | Same map, van parked at the kitchen, greyed, no animation |
| 5 | Bake strip | `✓ MIXED 4:10 · ✓ PROOFED 8:30 · ✓ BAKED 5:40 · LOADING now` with real timestamps | Hidden |
| 6 | **Today's route / This week's route** — the load-bearing module | Vertical stop list. Four states: **done** (grey, tick, actual time) · **current** (filled, pulse, `Here now — till ~11:45`) · **upcoming** (outline, ETA band) · **sold out** (struck through, `Sold out 11:52`). Each row: landmark name + a short local descriptor (`Sony World Signal · opposite the Nandini booth`), an open-in-maps icon, and a per-stop `Notify me` | Identical list, dated: `Saturday · Indiranagar, 12th Main` / `Sunday · Koramangala, Sony World` / `Weekdays · Kitchen only` |
| 7 | What's on board | Live item list with sold-out states, linked to the drop | This week's menu with `Orders close Thursday 8pm` |
| 8 | **Notify me** (the primary CTA in the off-air state) | Bottom sheet, never a native OS prompt on tap. Pick **stop** → pick **trigger** (`when the van leaves the kitchen` / `when it's 2 stops away` / `when it arrives`) → WhatsApp primary, browser push secondary and silently hidden on iOS Safari → explicit `Not now`. Trigger the sheet on second visit or after ~20s dwell, never on first paint. Under it, verbatim: *"We watch the van, not you. No location permission, no background tracking, no battery drain — we just message you when it's close."* | Same, and promoted to the top |
| 9 | Activity feed | Last 5 auto-generated timestamped events, newest first: `11:40 Sold out of Milk Shokupan` / `11:05 Arrived Indiranagar 12th Main` / `10:42 Left the kitchen`. **Never hand-typed.** | Yesterday's / last run's feed |
| 10 | Stamp card slot | Build the layout, ship it empty or hidden behind a flag. Six slots mapped to stops. No leaderboard, ever. | Same |
| 11 | Human escape hatch | `Ask us where we are` → WhatsApp, pre-filled with the stop context. **The WhatsApp reply must never know more than the page does** — if it does, the page is dead. | Same |
| 12 | Footer | `Lite mode` (kills the map layer, renders list + ETA only, persisted locally) · `Manage alerts` · a plain-language line on what is published and what is not | Same |

**Data and privacy contract (hard requirements):**
- Public endpoint returns **snapped-to-route position + stop index only**, rounded to ~50m.
- Served **only between `route_start` and `route_end`**; outside those hours the endpoint returns off-air.
- **No historical trail** is ever exposed. Current position only.
- If the van deviates from the published polyline (fuel, break, breakdown, driver's home), **suppress position
  and show `Between stops`**.
- Driver-controlled **`Go dark`** toggle in the cab flips the page to off-air instantly with
  `Van's off the map for a bit — back shortly`.
- If a fix is **more than 90 seconds stale**: stop the tween, drop the marker to 60% opacity, and replace the
  arrival band with `Last seen 2 min ago`. Never let a stale dot pretend to be live.
- Refresh cadence: the existing 15s feed. **Interpolate across the full interval** — a raw 15s hop looks fake
  and destroys the credibility the page depends on.

### 8.4 Concrete spec — the tracker widget (everywhere else)

A single component, three states, appearing on the homepage (§8 of the section order), in the order
confirmation, in the account order detail, and in the WhatsApp "on the way" message.

| State | Renders |
|---|---|
| **Live, near you** | `● The van is 2 stops from Indiranagar · around 4:40–4:50` → `Track it →` |
| **Live, elsewhere** | `● The van is out — Koramangala today` → `See today's route →` |
| **Off air** | `Next run: Saturday, Indiranagar, from 4:30pm` → `See the week's route →` + `Tell me when it's out` |

It must be a link, not a modal, and it must never be the floating element — that slot belongs to WhatsApp.

### 8.5 Subscription mechanics — the spec

Named **The Standing Order.** (See §9 on naming and its relationship to Fillo+.)

**Shape.** A recurring pre-order against a route day, not a shipped box. Weekly by default, fortnightly
optional. Charged per delivery, not prepaid up-front — Blue Tokai's prepaid ladder works for a 9-month-shelf-life
product and is wrong for a loaf. The saving is a standing **10% standing-order price** plus **free delivery on
the van lane**, stated as an absolute rupee figure on the confirm step, not a percentage.

**Cutoff.** One rule, computed and rendered identically everywhere:
> **Orders close Thursday 8pm for Saturday's run.**

For a standing order this becomes the **skip deadline**. The reminder fires at cutoff-minus-24h.

**The weekly loop.**
```
Wed 8pm   WhatsApp: "Saturday's box: 1 Milk Shokupan, ₹200, Indiranagar 4–6pm.
                     Change it or skip → [link]"          [ Skip this week ]  [ Change ]
Thu 8pm   Cutoff. Order locks. Charge attempted.
Fri night WhatsApp: exact time band for the stop.
Sat       Bake strip goes live → van tracker → delivered → one-tap rating + reorder link.
```

**Every control, and where it lives** (all self-serve in `/account/subscription`, all reachable from one tap
in the weekly reminder):

| Control | Behaviour | Copy |
|---|---|---|
| **Skip a week** | One tap from the reminder or the dashboard. Skips the next delivery only; the schedule survives. | `Skip this week` — never "cancel" |
| **Pause** | Choose a return date. Sends nothing while paused except one message on the return date. | **`Going away?`** → `Pause till a date I choose` (Country Delight's vacation-mode framing) |
| **Change the day / route** | Re-picks the route day from the days the van serves that area. Applies from the next uncut delivery. | `Move to Sunday, Koramangala` |
| **Change what's in it** | Swap the loaf, add or remove add-ons. Applies from the next uncut delivery. | `Change this week's box` |
| **Change frequency** | Weekly ↔ fortnightly. | |
| **Change address / stop** | Per-delivery override as well as a permanent change (Blue Tokai supports per-delivery addresses; it matters for gifting). | |
| **Cancel** | One tap, no retention interstitial, no phone call. Offer pause **once**, then cancel. | `Cancel my standing order` |
| **Out of stock** | If the chosen loaf can't be baked: notify at cutoff, offer a named substitute, and **do not charge** unless accepted. Blue Tokai has a dedicated FAQ for exactly this and Fillo will hit it constantly on a 40-loaf bake. | `We couldn't bake the Blue Pea this week. Swap for Milk Shokupan, or skip — you won't be charged either way.` |
| **Payment failure** | UPI mandate failure at cutoff → one WhatsApp retry link, one email, then auto-skip that week. Never silently drop the subscription. | |

**Anxiety copy, placed above the confirm button** — the Wildgrain pattern, which is the single most
transferable piece of subscription copy in this report:
> **Skip any week. Pause anytime. Cancel in one tap.**
> We'll message you every Wednesday with what's coming, so you're never surprised.

**Route-day awareness is the whole differentiator.** The subscription is not "a box every week"; it is
"you are on Saturday's Indiranagar list." That means: the builder only offers days the van actually serves the
saved area; the reminder names the stop; the confirmation names the stop; and if a route changes, every
affected subscriber gets a message naming the change before the cutoff.

---

## 9. The one recommended flow

Not options. This is what I would ship.

**Naming, settled first.** The current site conflates two different things under one ₹1 SKU. Split them:

- **Fillo+** — the **free membership and account layer**. Phone-based identity, one tap to join from any order
  confirmation. It carries: your orders, your addresses, your saved stop, coins, alerts, and early access to
  new bakes. **The ₹1 fee is removed.** Nobody in this report charges to join a loyalty programme, and Fillo's
  fee currently forces a full Shopify checkout to acquire a free-to-operate retention mechanic.
- **The Standing Order** — the **weekly bread subscription**, a distinct product that lives inside Fillo+ and
  is sold at order #2, never at order #1.
- **Fillo Coins** stay as they are (2 per ₹100, 25 = ₹25) but move behind the free membership. If they must be
  simplified later, a stamp card — GAIL's nine-stamps model — is a better fit for a ₹200 staple than a
  ~2% cashback.

**The flow.**

```
1  ARRIVE          Home. Cutoff bar carries a real, computed deadline.
                   Header chip is empty and amber: "Set your area".

2  CHOOSE THE LANE Two cards, real prices, above the menu:
                     CATCH THE VAN — free, at a stop near you
                     HOME DELIVERY — ₹49, 2-hour window, free over ₹399
                   Choosing sets the header chip to place + mode + next slot.
                   Out of area → waitlist by area, with a position number.
                   The catalogue is never blocked. Only the ANSWER is gated.

3  BROWSE          This week's drop: 6-8 items, two-up, sold-out greyed in place
                   with a Notify me. "See all 23" one tap behind it.
                   Search present but not the hero. Order-again row for returners.

4  DECIDE          PDP: crumb photo first, sensory line, checkable spec chips,
                   eggless stated as the reason not the headline, allergens in a
                   fixed block, per-SKU reviews with photos, the cutoff line in red
                   directly above the button, and the lane/date/slot restated under it.

5  CART            Drawer shows subtotal, the delivery line (or "free — you're
                   catching the van"), the gap to free delivery, and the TOTAL.
                   During a live drop: a cart hold timer, because the stock really is held.

6  CHECKOUT        One page. One domain. Four blocks, in this order:
                     1. Fulfilment  — pre-filled from the chip, both lanes with true prices,
                                      2-3 named drop cards instead of a calendar,
                                      the cutoff rule stated beside any greyed day
                     2. Identity    — phone, then OTP. "We need this to send you updates
                                      about your order." Email optional, "for your invoice".
                     3. Address     — home-delivery lane only. India-shaped:
                                      flat / building / area / landmark / pincode.
                                      Van lane skips this block entirely.
                     4. Pay         — the same total as the drawer. UPI intent first,
                                      cards/netbanking collapsed, COD last and priced.

7  CONFIRM         A promise, with a named next contact and a tracker link.
                   One-tap "Join Fillo+" — the phone is already verified, so it is a toggle.

8  WAIT            Wednesday: what's coming. Friday night: the time band.
                   Saturday: bake strip → live van → delivered.
                   Exactly these touches. Nothing else without opt-in.

9  RETURN          Order-again row on the homepage. Coins visible in the account.
                   At order #2: "Want it every Saturday? Skip any week."

10 SUBSCRIBE       The Standing Order. Route-day aware, weekly by default,
                   skip in one tap from every reminder, pause with a return date,
                   cancel without a phone call.
```

**The three sentences that carry the whole thing:**
1. `Order by Thursday 8pm for Saturday's Indiranagar run.` — in the bar, on the PDP, at checkout.
2. `Catch the van — free. Home delivery — ₹49.` — in the nav, on the homepage, at checkout.
3. `Skip any week. Pause anytime. Cancel in one tap.` — above every subscribe button.

And the one number that must never move between two screens: **the total.**
