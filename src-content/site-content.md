# Fillo Bakes — site content specification

Final copy for the rebuild of fillobakes.com. Written to be pasted, not paraphrased.

**Company:** Wise Eats SuperFood OPC Pvt Ltd · **Founders:** Neha S Nirmal, Nischal Vasant Meethal (December 2025)
**Contact:** WhatsApp +91 86189 06902 · wiseeatsindia@gmail.com · Instagram @fillo_bakes · Bengaluru · Mon–Sun, 10:00–19:00
**Catalogue:** 23 SKUs, ₹99–₹280 (see `products.json`)

**Primary voice reference:** `research/prior/ux/teardown-voice.md`, `research/prior/ux/fillo-experience-15.pdf`, `research/prior/ux/psychology.md`, `research/prior/ux/india-ux.md`.
Deviations from the drafted strings in that corpus are listed in `CONTENT-REPORT.md` §4.

---

## The one move

Fillo is a logistics operation wearing a romance product: a moving van, a fixed route, a two-hour window, all carrying warm bread.

**A certainty sentence inside every warm moment.** That is the whole site, repeated.

---

## Voice rules

1. **Humour where they are bored. Plainness where they pay.** Jokes live in the FAQ, the shipping policy, the sold-out state, the empty cart and the newsletter ask. Never in a price, a total, a guarantee, a refund line or a checkout button.
2. **The joke escorts the fact, never replaces it.** Every warm line in a functional place still contains the number, the date or the action.
3. **Every number on the site is true.** No "100+ items" against a 23-item menu. No "500+ lovers" nobody counted. Where a number is not verified it is marked `[TBC]` in this document and must not ship.
4. **Stops, not minutes. Bands, not promises.** "2 stops away", "around 4:40 to 4:50" — never a countdown.
5. **Short declaratives.** Sentence case everywhere. No caps-lock CTAs.
6. **No emoji. No exclamation marks.** The current site has both in headlines, product names, CTAs and the announcement bar. All removed.
7. **Warm and quiet.** Paper Boat's register, Graza's information discipline. A bakery that ferments dough overnight does not shout.
8. **Personality lives in structure**, not adjectives: button labels, sold-out states, empty states, product names, nav labels.
9. **English UI.** Japanese appears as product vocabulary only — small kana under a product name, never in navigation, never as a button.
10. **The crumb is the hero image, everywhere.** Torn, not sliced. Interior, not intact.

**Stop using:** "Golden, Buttery, Blissful", "Explore Our Magic", "See All Our Magic", "Ready to Indulge", "Discover [product]", "happiness wrapped in butter and love", "100+ Items", "500+ Lovers", "premium artisanal".
**Start using:** shokupan, anpan, karepan, sando, route, stop, slot, van, the bake, eggless, baked this morning.

---

## Global elements

### Sticky header — CARRIED OVER, restructured

`[Fillo] [Shop] [The van] [Standing order] ——— [search] [area chip] [account] [cart(n)]`
Mobile: wordmark · area chip · cart, with a bottom-sheet menu.

Everything else — About, Journal, Guides, FAQ, Contact, Franchise, Policies — lives in the footer.

**Why:** the current nav (Home Shop Fillo+ About Blog Franchise) gives Franchise — a page for perhaps twenty people a year — the same weight as Shop, and hides the van entirely.

### The area chip — NEW, and the most important component on the site

It holds three facts at once: **place, mode, next slot.** Tapping it opens the area and lane sheet below.

| State | Chip |
|---|---|
| Unset | `Set your area` (amber outline) |
| Van lane set | `Indiranagar · Sat 4–6pm · catch the van` |
| Delivery lane set | `Banaswadi · Sat 4–6pm · ₹49` |
| Set, no run this week | `Banaswadi · no run this week` (muted) |
| Out of area | `Whitefield · not yet` (amber) |

**The rule the chip enforces:** browse freely, but every surface whose answer depends on where you are — the lane cards, the run card, the product route line, the cart, the checkout — either shows the real answer or asks for the area. The catalogue is never gated. The answer always is.

### Area and lane sheet — NEW

One bottom sheet, reached from the chip, the home lane cards, the product route line and checkout. Eight states.

**1. Choose a lane**
> `How do you want it?`

| | `Catch the van` | `Home delivery` |
|---|---|---|
| Price | `Free` | `₹49` |
| Line | `Meet the van at a stop near you.` | `To your door, in a two-hour window.` |
| Note | | `Free over ₹499` `[TBC]` |

**2. Van lane, pick a stop**
> `Which stop?`
Named stops with a local descriptor and the next run:
`Indiranagar, 12th Main · opposite the Nandini booth · Sat 4–6pm` with an open-in-maps icon.

**3. Delivery lane, find your area**
> `Where should we bring it?`
Area **name** autocomplete, not a raw pincode field. `Use my location` sits above it. Pincode is derived, never asked first.

**4. Success, van**
> `You're on Saturday's Indiranagar run. Orders close Thursday 8pm.`

**5. Success, delivery**
> `We deliver to Banaswadi. Saturday, 4–6pm. ₹49, free over ₹499.` `[TBC]`

**6. No run this week**
> `The van isn't running Banaswadi this week. Next: Saturday the 13th.` → `Tell me when it's out`

**7. Out of area**
> `The van hasn't reached Whitefield yet. Tell us you're there and we'll come sooner — we plan routes by demand.`
> One phone field → `Notify me` → `You're #23 in Whitefield. At [TBC] requests we add the route.`

**8. Loading and error**
> Skeleton, then: `Couldn't check that just now. Try again, or WhatsApp us.` → `Retry`

### Announcement bar — CARRIED OVER, rewritten as a computed line

One line, computed, never a stack of coupon codes.

| State | Line |
|---|---|
| Orders open, area known | `Order by Thursday 8pm for Saturday's Indiranagar run` |
| Orders open, no area | `Order by 8pm the evening before for the next run` |
| Cutoff near (under 12h) | `Orders close in 6 hours for Saturday's run` |
| Between runs | `Next bake: Saturday. Orders open Sunday 9am.` |
| Out of area | `We're not on your street yet — tell us where you are` → `/areas` |

**The cadence sentence is the site's spine.** `Order by [day] 8pm for [day]'s [route] run` appears in the announcement bar, above every buy button, and beside every greyed date at checkout. It is the same sentence everywhere.

### Footer — CARRIED OVER, restructured

- **Shop** — This week's bake, All 23, Breads, An Pan, Kare Pan, Pies and Strudels, Fruit Sandos, Boxes, Gift cards
- **Fillo Bakes** — The van, Routes, Areas, The Standing Order, Fillo+, Gifting, About, Journal, Guides, Franchise
- **Help** — FAQ, Contact, Delivery, Refunds, Payment and security, Terms, Privacy
- **Reach us** — WhatsApp +91 86189 06902 · wiseeatsindia@gmail.com · @fillo_bakes · Bengaluru, Karnataka · Mon–Sun, 10:00–19:00

Compliance line: FSSAI green vegetarian mark, FSSAI licence `[TBC]`, `Operated by Wise Eats SuperFood OPC Pvt Ltd, Bengaluru.`
Plus a `Lite mode` toggle, which turns off the map and heavy imagery for a slow connection.

### The local warmth line — NEW

One slot per city, sitting just above the compliance line and repeated as the opening of the order-confirmation WhatsApp message. It is warmth, not navigation. It never appears on a button, a label or a nav item.

**Bengaluru:**

> `ಧನ್ಯವಾದಗಳು. Thank you for letting us park on your street.`

**How the slot works:** one sentence, a two or three word opener in the local language, then English. No transliteration of product names. No language toggle. No dual-label buttons. When the van reaches a second city, that city gets one line written the same way.

### Floating element — CARRIED OVER, reduced to one

Exactly one: the WhatsApp bubble, bottom right. On a product page it shifts up 72px so it never covers the sticky `Add · ₹200` bar.

Every entry point pre-fills with page context: `Hi Fillo — is the Blue Pea Bread on Saturday's van? (from the website)` / `Hi Fillo — question about order [id].`

**Removed:** the floating "Track our van" pill. The van becomes a page, a header state and a home module.

# Page: Home (`/`)

Thirteen modules, answering four questions in the order a first-time visitor has them: **What is this? Do you come to me? Is it worth ₹250? How do I get one?**

Deliberately absent: a hero carousel, popup email capture, stacked coupon codes, a second floating widget, a fake countdown, "100+ Items", "500+ Lovers".

---

### 1. Announcement bar — see Global elements. Five states.

### 2. Header with the area chip — see Global elements. Five chip states.

### 3. Hero — CARRIED OVER, rewritten

**Image needed:** a torn shokupan cross-section, full bleed, crumb filling the frame. Interior-revealing shots outperform intact ones for indulgent food, and the crumb is the entire argument for an eggless milk bread.

**Headline:** `Japanese milk bread. Baked Saturday morning.`
**Sub:** `At your door in a two-hour window, or from the van at a stop near you.`
**One button:** `See this week's bake`

**Note on the eggless claim:** it is deliberately not the headline. Abstention labels measurably depress choice when they lead, while the same claim as a persistent badge still reaches the people searching for it. Headline sells the taste; the trust strip sells the claim. This is the highest-uncertainty recommendation in the research — **run it as an A/B against an eggless-led headline, not as a rollout.**

**Note on the Standing Order:** it does **not** appear in the hero. The subscription is pitched at order #2, not on a first visit. See the Standing Order page.

---

### 4. Trust strip — NEW

`100% eggless` (with the legal green vegetarian mark) · `No preservatives` · `Baked daily` · `FSSAI [TBC]`

---

### 5. Two ways to get bread — NEW

**Purpose:** the lane is chosen before the cart, not at checkout, because the lane changes which days, which stops and which items are available. Deciding it at checkout means the cart can be unfulfillable.

**Headline:** `Two ways to get bread`

| `Catch the van` | `Home delivery` |
|---|---|
| **Free** | **₹49** |
| `Meet the van at a stop near you. We hold your order on board.` | `To your door, in a two-hour window you choose.` |
| | `Free over ₹499` `[TBC]` |

Tapping either opens the area and lane sheet.

**States:** area unset, both cards are CTAs · area set, the chosen card is confirmed with the stop and slot and the other becomes a `Switch` link.

**Data needed:** serviceable areas, stops per route, run days, delivery fee, free-delivery threshold.

---

### 6. This week's bake — the run card — NEW

**Purpose:** replace the eight-card "Featured Specialties" grid with a live, capped, dated, true thing.

**Title:** `The Saturday bake`
**Chips:** the date, then the stops on that run.
**Hero photo:** the loaf.
**Count:** `We bake [TBC]. [n] left.` with a progress bar.
**Under it:** `[n] reserved · [TBC] is the oven, not a tactic.`
**CTA:** `Reserve yours`
**Cutoff line:** `Order by Thursday 8pm for Saturday's run. No restocks, it is a van.`

**Why real counts:** across 416 measured effects, real supply caps beat every other kind of scarcity, especially for experiences. A count that comes from the oven needs no manufacturing. **[TBC — the real per-bake capacity. Do not publish a cap the kitchen cannot honour, and do not ship the placeholder.]**

**States:** orders open · closing soon (a countdown appears, and it is allowed here **only** because it renders a published fact — the 8pm cutoff — not an invented urgency) · sold out · between runs (`Orders open Sunday 9am`).

**Sold-out state — this becomes the emotional centre of the page:**
> **`Gone for this week.`**
> `Forty loaves, gone by 9:15. Thank you, Indiranagar.`
> `[ Tell me when the van's back out ]`
> `One message, Sunday morning. Nothing else.`

The menu below stays visible, fully greyed, so the buyer sees what they missed.

---

### 7. The menu — CARRIED OVER, trimmed

Six to eight items, two-up, **sold-out items included and greyed rather than hidden.** `See all 23`

Card anatomy: 4:5 crumb-forward image · category label · name with kana beneath in small type · one-line sensory note · price · allergen dots · `Add` pill morphing to a `− 1 +` stepper in place.

**Badges, top-left of image, maximum two:** `Van routes only` · `New` · `This week only` · `Only 6 left` · `Bestseller`.

**Card states:** default · in-cart (stepper) · sold out (image and text muted to about 40%, the `Sold out` ribbon retained at full contrast, `Add` replaced by `Notify me`) · not on this route (muted, with `Available Sunday, Koramangala`) · loading skeleton.

---

### 8. Order again — NEW, returning visitors only

Injects **above** the menu. Last three items, one-tap `Add` each, no variant modal.

---

### 9. The van — NEW as a module

**Purpose:** the brand's unfair asset, currently a 40px pill in the bottom-left corner.

The reusable van strip, a still of the route map, and `Track the van`.

**Must render the off-air state as finished as the live one**, because off-air is the state five days out of seven:
- Live, near you: `The van is 2 stops from Indiranagar · around 4:40–4:50` → `Track it`
- Live, elsewhere: `The van is out — Koramangala today` → `See today's route`
- Off air: `Next run: Saturday, Indiranagar, from 4:30pm` → `See the week's route` · `Tell me when it's out`

---

### 10. Why it costs what it costs — NEW

**Purpose:** the premium argument, placed after desire and before the price objection hardens. Premium Indian D2C never argues price; it replaces the price conversation with a process conversation, in specifics.

**Headline:** `Why a loaf is ₹200`

1. **`The method`** — `A [TBC]-hour ferment and a [TBC]% hydration dough, mixed and shaped by hand in small batches. That is where the crumb comes from.` **[TBC — the corpus drafts "82% hydration, 18h ferment". Those are design placeholders, not measured figures.]**
2. **`Eggless, and nobody asked for a discount for it`** — `Egg is what usually gives a milk bread its softness. Taking it out and keeping the texture is the hard part, and it is why the shokupan took months to settle. Over 300 first-time tasters worked through the menu before the van ran a single route.`
3. **`The names are not decoration`** — `Kyoto Curry. Seoul Spice. Calcutta Blaze. Bangalore Bloom. Each one is a city and a flavour, developed on trips and in real kitchens.`

**Image needed:** the founders, by name and face, in the kitchen at the real hour.

---

### 11. Proof — CARRIED OVER, cut from eight to three

**Headline:** `What people said`

Star average, review count, then three named reviews with areas and photos. The first five reviews do almost all the trust work; eight identical five-star quotes read as manufactured.

- "The shokupan was fabulous, just melt in the mouth delicious. With bread like that, who needs cake." — Riya S.
- "The dessert strudels are unreal. Orchard Melt is comfort food at its finest." — Neha P.
- "Beautiful flavours, not overly greasy, and very filling. Will definitely order again." — Aman K.

`Read all reviews`

**Removed:** the inline star-rating form. A "rate us" widget with no order attached collects noise. Review collection moves into the post-delivery WhatsApp message, tied to a real order.

**Data needed:** area and date per review. **[TBC — confirm these three are real customers and get permission.]**

---

### 12. The Standing Order — NEW, three lines and a button

**Headline:** `Bread, standing. Every Saturday.`
**Body:** `Put your loaf on the van's list and stop thinking about it. Skip any week. Pause anytime.`
**CTA:** `How it works`

**Note:** this is a low-placed explainer, not the pitch. The real pitch fires on the confirmation of a customer's **second** order. See the Standing Order page.

---

### 13. Fillo+ — CARRIED OVER, moved down and made free

**Headline:** `Fillo+ is free`
**Body:** `Join with your phone number. Earn 2 coins for every ₹100 you spend. 25 coins is ₹25 off, and they never expire.`
**CTA:** `Join Fillo+`

Loyalty belongs low. It converts people who are already sold, and a high placement reads as a discount brand.

---

### 14. Footer — see Global elements.

---

# Page: Shop (`/shop`) — this week's bake

Run-aware. URL kept: it is the only shop URL with external equity and the nav label people expect.

---

### 1. Run header — NEW

**Headline:** `The Saturday bake · Indiranagar · 4–6pm`
**Cutoff:** `Orders close Thursday 8pm`
**Counter:** the live cap, same source as the home run card.

**Area unset:** the grid still renders, with a persistent inline banner: `Set your area to see what's on your route.`

---

### 2. Lane and route switcher — NEW

`Saturday · Indiranagar` | `Sunday · Koramangala` | `Home delivery`

Switching re-filters the menu, because availability genuinely differs by run. This is not a cosmetic filter.

---

### 3. Three doors — NEW, a module, not an interstitial

First-time visitors only, as the top module. 23 products overwhelm a first-timer; three doors first, the range second.

**Headline:** `New here? Start with one of three.`

| Door | Product | Price | Line |
|---|---|---|---|
| **The loaf** | Milk Shokupan | ₹200 | `The bread the bakery was built on. Tear it, don't slice it.` |
| **The sweet one** | Custard An Pan | ₹159 | `A soft bun with custard cream in the middle. The one people come back for.` |
| **The box** | The Sunday Table | ₹499 `[TBC]` | `A loaf and three bakes, chosen for you.` |

**Under the row:** `Or browse all 23 bakes`

---

### 4. Category tabs — CARRIED OVER, with one hard rule

`All · Breads · An Pan · Kare Pan · Pies and Strudels · Fruit Sandos · Boxes · Gift cards`

Add the one-line gloss from `products.json` under each in the sidebar, because "An Pan" means nothing on a first visit.

**Never render a tab that resolves to zero items.** The current "Weekly Specials" tab renders empty and must not recur. If there is nothing special this week, the tab is not there.

**Extra filters:** `Sweet` / `Savoury` / `Spicy` / `Contains nuts` / `Same-day only` / `Under ₹150`
**Sort:** `Most ordered · Price low to high · Price high to low · New`
**Search:** allowed, in the header.

---

### 5. Product grid — two-up

Card anatomy and the five card states are specified in the Home module 7.

---

### 6. Sticky bottom bar — CARRIED OVER

Appears when the cart is non-empty: `2 items · Continue · ₹359`
Drawer heading: `Your order`
Drawer CTA: `Checkout`

**Cart drawer contents:** line items with steppers · `Delivery ₹49 · Add ₹120 for free delivery` with a thin progress bar, **or** `Delivery free — you're catching the van` · a coins-redeem row when eligible · **total** · the lane, date and slot restated · `Checkout`.

**Drawer states:** empty · with items · free-delivery threshold met · hold timer running (`Held for 6:42` during a live run) · an item sold out while in the cart (`We sold the last one. Remove it, or swap for [item].`).

---

### Page states

loaded · loading skeleton · area unset · route selected with items unavailable on it (greyed, showing the route they *are* on) · whole run sold out · between runs (`Orders open Sunday 9am`, last week's menu greyed, notify-me) · a filter returning nothing.

---

# Page: All bakes (`/shop/all`) — NEW

The same page as `/shop`, with two differences.

1. The run header is replaced by `All 23 bakes`, and the sub-line reads `Everything we make. Availability depends on the run.`
2. **Every card carries an availability badge** — `On Saturday's run` · `Sunday only` · `Home delivery only` · `Not this week`.

This is the page that answers "what do you actually make", separate from "what can I get on Saturday". Both questions are real and the current site only answers the first.

---

# Page: Product detail (`/product/[slug]`)

Currently at `/product/[slug]` too, but 8 of the 12 sitemap slugs render "Product Not Found" at HTTP 200. Redirect map is in `products.json`.

Order matters on this page. It is where the sale is lost.

---

### 1. Gallery
**Cross-section or torn crumb is the default thumbnail.** The whole loaf comes second.

### 2. Name, price, sensory note
Category label and kana (`An Pan あんパン`), H1, price, then one line: `Tear it, don't slice it. It gives up in soft sheets.`

### 3. Spec chips — NEW
Checkable facts, not adjectives: `[TBC]% hydration` · `[TBC]h ferment` · `Baked 5:40am`
**[TBC — hydration and ferment do not exist yet. Ship with `Baked this morning` alone and add the rest as the founders supply them.]**

### 4. The eggless line — NEW
Stated as the reason, not the headline: `Eggless. [TBC — the corpus drafts "Nobody in 300 tastings could tell." The 300-taster number is real; the claim inside the sentence is not measured. Either confirm it or use: "300 first-time tasters got us there."]`

### 5. Route line — NEW
The availability answer, inline: `Saturday · Indiranagar · 4–6pm` with a dropdown caret, opening the area and lane sheet. Unset, it reads `Check where we can bring this`.

### 6. Cutoff line — NEW
In red, directly above the button: `Order by Thursday 8pm for Saturday's run`

### 7. Quantity stepper and `Add · ₹200`
Sticky on mobile. The WhatsApp bubble shifts up 72px so it never covers this bar.

### 8. Honest count
`Only 6 on Saturday's van` — shown **only** when the true remaining count is 10 or fewer.

### 9. Allergens — NEW, fixed position on every product page

Three explicit states, always in the same place, scannable rather than legal-dense. A shopper with an allergy spends three to five minutes on every label they buy, and clarity is the trust variable.

- `Contains — wheat, dairy`
- `Does not contain — egg`
- `Made in a kitchen that also handles — tree nuts (pistachio), soy` **[TBC — founders must confirm. This is a food-safety statement and cannot be inferred.]**

**Rule:** never write "may contain" next to a free-from claim. The eggless claim and a hedge in the same block destroys both.

### 10. How to eat it, how to keep it — NEW

**`How to eat it`** — `Thick-cut, 2cm. Not sandwich-thin. Warm for [TBC] minutes at [TBC]°C, or eat it cold from the bag on the way home. Best on day one, still lovely on day two, French toast on day three.`

**`Keeping it`** — `[TBC — founders. Days at room temperature in Bengaluru, whether to refrigerate (usually no, for milk bread), whether it freezes, how to revive a slice.]` **Do not ship invented storage advice. It is a food-safety claim.**

### 11. Product FAQ — NEW
The two real objections, answered here rather than on `/faq`:
- **`Eggless — does it actually taste like it?`** `No, and that took months. Egg is what usually gives a milk bread its softness, so we get there with a wetter dough and a longer, cooler ferment instead.`
- **`How do I get it if the van moves?`** `Two ways. Meet the van at a stop on its run — that's free — or have it delivered to your door in a two-hour window for ₹49. Set your area and the page will tell you which days apply to you.`

### 12. Reviews for this product — NEW
Count, average, photos, **and the critical ones left visible.** Hidden negatives are worth less than shown ones.

### 13. About this one — CARRIED OVER, replaced
The current copy is identical on all 23 pages: "Each Fillo Bakes product is crafted with premium vegetarian ingredients..." That is 23 pages of duplicate content. Replace with the unique `longDescription` from `products.json`.

### 14. Goes well with — CARRIED OVER, rewritten
The current "Similar Products" shows more of the same category, which is the least useful recommendation for someone who has just chosen one. Use `suggestedPairings` from `products.json`, which crosses categories on purpose.

---

### Page states

available · **sold out for this run** (button becomes `Notify me`, art muted, `Sold out in 41 minutes — 40 baked, 40 gone`) · **not on the selected route** (`On Sunday's Koramangala run` plus a switch link) · area unset · out of area · loading skeleton · **404** — a designed page with a menu rail beneath it, never a bare string.

---

# Page: Cart (`/cart`) — full page

The drawer is the primary cart surface. This page is the fallback and the deep-link target.

Line items · the delivery line · the free-delivery progress · coins redemption · the lane, date and slot summary · total · `Checkout`. Plus a `You might also like` rail, and the cutoff countdown when the run is closing.

**States:** empty (with a menu rail beneath it, never a dead end) · items · an item that just sold out · an item not on the selected route · hold timer running.

**Empty state:**
> `Nothing in your order yet.`
> `This week we've got milk bread, custard an pan and three kinds of pastry.`
> → `See this week's bake`

---

# Page: Checkout (`/checkout`) — NEW, one page, one domain

The current journey puts seven surfaces between craving and paying: shop, variant modal, cart drawer, checkout, confirm modal, Shopify, Razorpay. Contact details are asked three times. The order is reviewed three times. The address form starts over in Western shape on a myshopify.com domain. The chosen date and slot vanish on the payment screen.

And the price changes at the door: ₹420 promised, ₹470 charged, because delivery is added inside Shopify. An unexpected cost at the end is the most documented reason carts die. Everything else here is friction. **This one is a broken promise.**

Four blocks. One domain. One contact ask.

---

### Block 1 — How you're getting it

The lane is already chosen from the header chip, so this block **confirms** rather than asks. It stays editable.

```
( • ) Catch the van        free
      Indiranagar, 12th Main · opposite the Nandini booth
(   ) Home delivery        ₹49   free over ₹499

[ Sat 6 Sep ]  [ Sun 7 Sep ]  [ Sat 13 Sep ]
 Today · closed 8pm
[ 12–2 ]  [ 4–6 ✓ ]  [ 6–8 · full ]
```

**The date range is capped at the runs that exist**, not 30 days forward. The current picker offers 30 days, which implies a bakery that freezes.

**Full and past windows render disabled and greyed, never hidden**, so the pattern is learnable.
**The cutoff rule sits beside the greyed date, not in a tooltip:** `Today is closed. Orders shut at 8pm the evening before a run.`
**Default-select the next available slot**, so a customer who ignores the picker still places a valid order.
**Label windows in full:** `4:00–6:00 PM`, never `4–6`.

---

### Block 2 — Who you are

```
Phone number   +91 [__________]
We need this to send you updates about your order.
→ OTP · 4 boxes, auto-advance, resend after 30s
Email (for your invoice) — optional
```

The phone number is the identity. There is no password and no account wall — **guest checkout is the default path, so there is no "continue as guest" link, because there is nothing to continue from.**

---

### Block 3 — Where (home-delivery lane only; the van lane skips this block entirely)

India-shaped. Never Line 1 and Line 2.

`Use my location` · `Flat / house no.` · `Apartment or building name` (autocomplete) · `Street / area` · `Landmark (helps our driver find you)` · `Pincode` (auto-fills the area, and is never asked first) · `Bengaluru` (prefilled, locked)

---

### Block 4 — Pay

```
Subtotal                          ₹400
Delivery                           ₹49
Fillo Coins (25)                  −₹25
Tax (5%)                           ₹20
────────────────────────────────────────
Total, including delivery         ₹444

[  Pay ₹444 with UPI  ]     GPay · PhonePe · Paytm
▸ Cards, Net Banking, Wallets
▸ Cash at the door  +₹30, first order only

☐ Join Fillo+ — free. Earn coins on this order.
```

**Non-negotiables:**
1. The total here equals the total in the cart drawer. Delivery is inside it before the address block is even reached.
2. The number on the button equals the number in the table equals the number Razorpay charges. If those three ever differ, the build is wrong.
3. The Fillo+ checkbox is **unpriced**. Membership is free now; the ₹1 line is gone.
4. `FILLO10` stays: `Add ₹300 more and FILLO10 takes 10% off.`

UPI is roughly 85% of digital payments in India. One button, then everything else.

**COD:** `Cash at the door, +₹30, first order only.` Blocked above ₹500 with a stated reason: `Prepaid only for larger orders — it keeps the van light.` **[TBC — confirm the surcharge and the cap.]**

**Removed:** the current line `No changes can be made after payment.` It is the last thing a customer reads before paying and it reads as a threat. It is also the wrong promise. Replace with the truth: `You can change or cancel free until Thursday 8pm.`

---

### The promise, under the pay button

> `Saturday, 4 to 6pm, at your gate. We'll message you Friday night with the exact time.`

---

### Checkout states to mock

default · van lane (block 3 absent) · OTP entry · OTP failed · returning customer (phone recognised, saved addresses offered as cards) · coins available / none / insufficient · COD blocked above ₹500 · payment failed · payment pending · **cutoff passed while on the page** (`Saturday's run just closed. Move to Sunday?`) · **an item sold out while on the page** · **hold timer expired**.

**Honest timers only.** A cart hold timer and a cutoff clock are both wired to real constraints and are allowed. A manufactured countdown is not.

- Hold timer: `Held for 6:42` · expiring: `Your hold expires in 40 seconds.` · expired: `Your hold ran out and someone else took the last one. It's back in the shop if it's still there.`
- Cutoff clock: `Orders close in 2h 14m for Saturday's run.`

---

# Page: Order confirmation (`/order/[id]`) — NEW

Reachable **without login via a signed link**, so it survives being forwarded on WhatsApp.

The highest-emotion, lowest-designed screen in e-commerce. Name the next concrete thing that will happen, with a time, in a human voice.

**Headline:** `Got it.`
**The promise, not a warning:** `Saturday, 4 to 6pm, at your gate. We'll message you Friday night with the exact time.`

**Then, in order:**

1. **Order card** — number, items, total paid, lane, stop or address, slot.
2. **Van strip** — live when relevant, off-air otherwise.
3. **Order timeline** — `Confirmed` → `Baking` (with the bake strip on the day) → `Loaded on the van` → `Out on the route` → `Delivered` or `Collected`. **Real timestamps only.**
4. `Add to calendar` · `Track the van` · `Get WhatsApp updates` (opt-in, frequency stated)
5. **`Join Fillo+ — free`** — one tap, because the phone is already verified. This is the single best moment to convert a member and it currently sits behind a ₹1 Shopify checkout.
6. **`Change or cancel`** — and it must actually work: `You can change or cancel free until Thursday 8pm.`

### The order-#2 moment — NEW

On the confirmation of a customer's **second** order, and never the first, one block appears above Fillo+:

> **`You've ordered a Milk Shokupan twice.`**
> `Want it on the van every Saturday? Skip any week, pause anytime, cancel in one tap.`
> `[ Set up a standing order ]`

The first order is about proving the bread. The confirmation of the second is the moment the habit exists, and the pitch is a statement of fact rather than a sales line.

### States
confirmed · baking · out for delivery · delivered (with `Rate this` and `Order again`) · collected · **missed at the stop** (`We waited at Indiranagar till 6:10. Message us and we'll sort it.`) · cancelled · refunded · payment pending.

### WhatsApp message sent on order
> `ಧನ್ಯವಾದಗಳು. Order [id] is in. Saturday, 4 to 6pm, Indiranagar 12th Main. We'll send the time band on Friday night. Reply here if anything changes.`

---

# Page: Our story (`/about`)

The strongest page on the current site. Restructured, not rewritten — the facts in it are specific and the claims are earned. Founder stories raise perceived authenticity through narrative, so this stays a story and does not become a bullet list.

---

### 1. Head — CARRIED OVER

**Headline:** `Bread, delivered on a route`
**Sub:** `A moving bakery in Bengaluru. Started December 2025 by Neha S Nirmal and Nischal Vasant Meethal.`
**Image needed:** the founders with the van, working, not posed.

### 2. Why a van — CARRIED OVER from "Our Vision", tightened

**Headline:** `Why a van`
**Body:** `Most of us remember a neighbourhood that smelled of bread in the evening. Picking up pav for dinner. Buns for tea. That routine disappeared into supermarket shelves and delivery apps. We think fresh bread can be a daily staple again, the way a milk subscription already is. The only way to do that is to bring it to the street rather than wait for the street to come to us. So the bakery moves, on a fixed route, and every batch is baked after the orders come in.`

### 3. Six things we hold to — CARRIED OVER, emoji and tick marks removed

1. `100% vegetarian Japanese baking. No exceptions in the kitchen.`
2. `A fuwa fuwa crumb — the Japanese word is ふわふわ, pillowy — from hydration, fermentation timing and technique.`
3. `Completely eggless, without giving up softness.`
4. `Small batch, hand-rolled, baked after your order.`
5. `A deliberately short menu: shokupan, karepan, anpan.`
6. `Flavours developed on trips to Japan and in real kitchens, not from a flavour catalogue.`

**Note:** all six are on the current About page. They are the best sentences the brand has written and they currently sit below three softer paragraphs.

### 4. 300 people tasted it first — CARRIED OVER, promoted

**Purpose:** the current page mentions "over 300 first-time tasters" in the last line of the last paragraph. It is the most credible number on the entire site and it is doing nothing there.

**Headline:** `300 people tasted it before you could buy it`
**Body:** `Before the van ran a single route, more than 300 first-time tasters worked through the menu. That is what settled the shokupan in an eggless format, and it is why the menu is 23 items and not 60.`
**Data needed:** the date range of the testing phase `[TBC]`.

### 5. What we bake — CARRIED OVER

**Body:** `Our shokupan is a soft milk loaf that took a long time to get right without eggs. Our karepan have a crisp outside and a soft inside, with fillings including umami-forward vegetables and slow-cooked ratatouille. Our anpan are soft buns filled with fresh cream, from chocolate to banana biscoff. Alongside those we bake toasts, pies, strudels and seasonal items.`

**Flag:** the ratatouille karepan named here is not on the live menu. Either it is a rotating item, in which case it belongs in Weekly Specials, or the copy is stale. `[TBC — founders.]`

### 6. The company — NEW

**Body:** `Fillo Bakes is operated by Wise Eats SuperFood OPC Pvt Ltd, registered in Bengaluru, Karnataka. FSSAI licence [TBC]. Payments are processed by Razorpay.`

---

# Page: Fillo+ (`/fillo-plus`) — membership

**The ₹1 join fee is removed.** Fillo+ becomes a free, phone-based account layer.

**Why:** nobody in the benchmark set charges to join — Country Delight, GAIL's, Levain, Wildgrain are all free. Fillo's ₹1 currently forces a customer through a complete Shopify checkout to acquire a retention mechanic that costs nothing to run. It filters out most of the people it exists to capture.

**The two products, stated at the top of both pages:**
> `Fillo+ is the free membership, tied to your phone number. You earn coins on everything you buy. The Standing Order is the weekly bread, on your route's run. You can have either, or both.`

---

### 1. Head — REWRITTEN

**Headline:** `Fillo+ is free.`

That is the single most important line on the page, given what it replaces.

**Sub:** `Join with your phone number. 2 coins for every ₹100 you spend, 25 coins is ₹25 off, and they never expire.`
**CTA:** `Join with your phone number` — one field.
**Secondary:** `Check my coins`

### 2. How coins work — CARRIED OVER

1. `Join` — `One field, your phone number. No fee, no renewal, nothing to remember.`
2. `Earn` — `2 Fillo coins for every ₹100 spent, added when an order is delivered. The Standing Order earns them too.`
3. `Redeem` — `25 coins takes ₹25 off. As often as you reach it. Coins never expire.`

### 3. What else membership gets — CARRIED OVER, trimmed to what is true

`Your order history and saved stops` · `Van alerts for your stop` · `Early access to new bakes, before they hit the menu` · `The Sunday message, if you want it`

**Cut:** "Member Perks — exclusive offers and surprises just for you." A promise with nothing behind it costs more than it earns.

### 4. The maths — CARRIED OVER, corrected

The current "Quick Math" block says a ₹1500 order gives 30 coins and calls it "Instant redemption". A customer reads that as redeemable on the same order. It is not.

| You spend | You earn | Orders to reach ₹25 off |
|---|---|---|
| ₹500 | 10 coins | 3 |
| ₹1,000 | 20 coins | 2 |
| ₹1,500 | 30 coins | 1 |

`Minimum 25 coins to redeem. Coins are earned on one order and applied to a later one. They never expire.`

### 5. States

- **Not a member** — the join field.
- **Member** — the page becomes a link to `/account/rewards`.
- **Legacy email-only member** — `You joined Fillo+ with your email. Add your phone number to keep your coins.` One field, coins preserved.

### 6. Founding members — NEW

Everyone who paid the ₹1 before it was removed keeps something permanent, so the change reads as a gift rather than a devaluation.

> **`Founding member`**
> `You joined when Fillo+ cost ₹1. That badge stays on your account, and you get first access to every new bake before anyone else.`

The badge appears on `/account/rewards`, in the WhatsApp opener, and on the box sticker. It costs nothing to run and cannot be devalued by growth.

**Data needed:** the list of ₹1 payers from Shopify, matched to phone numbers during migration.

---

# Page: The Standing Order (`/standing-order`) — NEW

**Naming, and why it matters.** This is never called a "box". It is not shipped, and the word imports frozen-crate expectations from a different category. "The Standing Order" is a real bakery phrase, it says exactly what it is, and it survives being said out loud at a van window.

It is also **not** Fillo+. Calling it Fillo+ would make "cancel Fillo+" ambiguous between *stop my bread* and *leave the programme* — a genuine support problem. Fillo+ is the free account layer; the Standing Order is a product inside it, with its own price, cadence, management surface and failure modes.

**All prices below are estimates derived from live retail. The founders set the final numbers.**

---

### 1. Hero — NEW

**Headline:** `Bread, standing. Every Saturday.`
**Sub:** `Put your loaf on the van's list and stop thinking about it.`
**CTA:** `Set up a standing order`

**Image needed:** a loaf being handed over at a van window, same person, implied routine.

---

### 2. The reassurance block — NEW, above the fold on mobile

This sits high deliberately. It is the objection, and answering it early converts better than burying it.

> `Skip any week. Pause anytime. Cancel in one tap. We'll message you every Wednesday with what's coming.`

---

### 3. How it works — four steps

1. `Pick your loaf` — `One item, or a few. Change it whenever.`
2. `We put you on your route's list` — `Your area decides the run day. Indiranagar is Saturdays.`
3. `We message you Wednesday` — `What's coming, what it costs, and a skip button. One tap and that week is off.`
4. `The van brings it Saturday` — `Same stop, same window, every week.`

---

### 4. Price — NEW

Show three numbers: the per-delivery price, the standing-order price, and the saving as an **absolute rupee figure**, not just a percentage.

| | Per delivery | Standing order | You save |
|---|---|---|---|
| 1 Milk Shokupan | ₹200 | `₹180/week` `[Est.]` | `₹20 a week` |
| 1 loaf + 1 rotating bake | ₹359 | `₹310/week` `[Est.]` | `₹49 a week` |

`[TBC — both prices are our design, derived from live retail prices. The founders set the final numbers.]`

---

### 5. What's included, what you can change

**Included:** `Your items, every run day, at your stop or your door. Coins on every delivery. First refusal on new bakes.`
**You can change:** `What's in it · which day · how often (weekly or fortnightly) · your stop or address · skip a week · pause · cancel.`

---

### 6. Standing order FAQ

- `Can I skip a week?` — `Yes, until 8pm the evening before the run. You aren't charged for a skipped week.`
- `Can I pause?` — `Yes. Pick a return date. Nothing is charged while you're paused and we message you the day before it restarts.`
- `How do I cancel?` — `One tap, from your account. No phone call. Your last delivery is the one already in the plan.`
- `Can I change the day?` — `Yes, to any day the van serves your area. It applies from the following run.`
- `Can I change what's in it?` — `Yes, from the next uncut delivery.`
- `What if you can't bake my loaf?` — `We message you and offer a swap or a skip. You aren't charged either way.`
- `What if my payment fails?` — `We tell you and give you a link to retry. If it isn't resolved by the cutoff we skip that week. We never silently cancel.`
- `What if the route changes?` — `We tell you before the cutoff, with the new time.`

---

### 7. Set up

**CTA:** `Set up a standing order` → `/account/subscription/setup`

**Page states:** logged out (the CTA starts the phone and OTP flow inside the builder, not before it) · logged in without a standing order · logged in with one (the page becomes `Manage your standing order` and links to `/account/subscription`).

---

### 8. When this page gets pitched

**Never on a first visit, and never in the home hero.** The first order is about proving the bread. The pitch fires on the confirmation of the **second** order, where it is a statement of fact:

> `You've ordered a Milk Shokupan twice. Want it on the van every Saturday? Skip any week.`

---

### The weekly message loop — NEW

Four WhatsApp templates. Nothing else without a separate opt-in.

| When | Message |
|---|---|
| Wednesday 8pm | `Saturday's standing order: 1 Milk Shokupan, ₹180, Indiranagar 4–6pm.` → `[ Skip this week ]` `[ Change ]` |
| Thursday 8pm | Cutoff. The order locks and the charge is attempted. No message. |
| Friday 8pm | `You're on tomorrow's list. Indiranagar, 4 to 6.` |
| Saturday | Bake strip live → van live → delivered → one-tap rating and reorder. |

---

# Page: The van (`/van`) — NEW

**The list owns the truth. The map owns the feeling.** Every number must be readable with the map layer completely failed.

**Off-air is the default state.** The van runs some days, not all of them, so design off-air first. This page must be worth bookmarking on the days the van is in the garage.

**No login, no app, no location permission — ever — to see the van.**

Today this is a bottom-left pill and a popup. It is the most distinctive asset the brand owns.

---

### Twelve modules, two master states

| # | Module | LIVE | OFF AIR |
|---|---|---|---|
| 1 | Status pill | `LIVE · UPDATED 9S AGO` | `OFF AIR · BACK SATURDAY` |
| 2 | Hero line, largest type on the page | `2 stops away.` or `Here now — Indiranagar 12th Main` | `The ovens are cold. The plan isn't.` |
| 3 | Arrival band | `Around 4:40 to 4:50` — widens itself in traffic, caps at `Around 20+ min` | `Rolls out Saturday, 4:30pm` |
| 4 | Map, lazy-loaded | Route drawn, done portion dashed, remaining solid. Stop pins in four states. Van marker tweened across the full 15s interval. `Find the van` re-centre button. | Same map, van parked at the kitchen, greyed, no animation |
| 5 | Bake strip | `MIXED 4:10 ✓ · PROOFED 8:30 ✓ · BAKED 5:40 ✓ · LOADING now` | Hidden |
| 6 | This week's runs | Vertical stop list, four states, landmark names and local descriptors, open-in-maps icon, per-stop `Notify me` | The same list, dated by day |
| 7 | What's on board | Live items with sold-out states | This week's menu plus `Orders close Thursday 8pm` |
| 8 | Notify me | The sheet below | The same, promoted to the top |
| 9 | Activity feed | Last five auto-generated timestamped events, newest first. **Never hand-typed.** | Last run's feed |
| 10 | Stamp card slot | Six slots. Build the layout, ship it empty or flagged off. **No leaderboard, ever.** | Same |
| 11 | `Ask us where we are` | WhatsApp, pre-filled. The reply must never know more than the page. | Same |
| 12 | Footer | `Lite mode` · `Manage alerts` · a plain line on what is published and what is not | Same |

### Stop states

| State | Row |
|---|---|
| Done | `HSR Layout · 3:30 ✓` — grey, ticked, the actual time |
| Current | `Koramangala · here now, till about 5:45` — filled, pulse ring |
| Upcoming | `Indiranagar · around 6:10–6:20` — outline pin, a band |
| Sold out | `Banaswadi · sold out 5:52` — struck through, muted. **Shown as honesty, never hidden.** |

### Edge states to mock

- **Stale fix** (over 90 seconds) — marker drops to 60% opacity, the band is replaced by `Last seen 2 min ago`
- **Off route** — `Between stops` and the position is suppressed
- **Driver go-dark** — `Van's off the map for a bit — back shortly`
- **Map failed** — Lite mode renders automatically, and every number stays readable
- **No run today** — `No run today. Saturday as normal.`
- **Route cancelled** — `No run today — the van's in the garage. Saturday as normal.`

### The van strip — the reusable widget

Used on the home page, `/order/[id]`, `/account`, and as the WhatsApp link preview. **A link, never a modal.** Never the floating element — that slot belongs to WhatsApp.

| State | Renders |
|---|---|
| Live, near you | `The van is 2 stops from Indiranagar · around 4:40–4:50` → `Track it` |
| Live, elsewhere | `The van is out — Koramangala today` → `See today's route` |
| Off air | `Next run: Saturday, Indiranagar, from 4:30pm` → `See the week's route` · `Tell me when it's out` |

### Notify-me sheet

Never fires an OS permission prompt on tap. Appears on a second visit or about 20 seconds of dwell, not on first paint.

> `Tell me when the van is near.`
> `Pick a stop` — `Indiranagar, 12th Main`
> `Tell me when` — `it leaves the kitchen` / `it's 2 stops away` (default) / `it arrives`
> `[ Get the nudge on WhatsApp ]`
> `[ Or get a browser alert ]` — hidden on iOS Safari tabs
> `[ Not now ]`
> `No app, no location permission. We watch the van, not you. At most one message a day.`

**States:** default · submitting · success (`Done. We'll ping you Saturday.`) · already subscribed (`You're set for Indiranagar.` → `Change it`) · error.

### Walk up to it — NEW

**Headline:** `You can just walk up`
**Body:** `If the van is at a stop you don't need an order. Come to the hatch and buy what's there. UPI and card both work. What's on board is what's on board, and the popular things go early.`

### Privacy and data contract — hard requirements

- The public endpoint returns **snapped-to-route position and stop index only**, rounded to roughly 50m.
- Served **only between the route's start and end times**.
- **No historical trail is ever exposed.** Current position only.
- Off-route deviation suppresses the position and shows `Between stops`.
- A driver-controlled **go-dark** switch exists in the cab.
- Notify-me geofences run **server-side against the van**. The customer's device never needs location permission.
- Refresh every 15 seconds, **interpolated across the full interval** — a raw hop looks fake and destroys the credibility the page exists to earn.

**On-page line:** `The map shows the van, not you. We publish where it is during a run, and nothing else.`

---

# Page: Route (`/van/[route]`) — NEW

One shareable, indexable page per route. Four in the mock: `/van/indiranagar`, `/van/koramangala`, `/van/banaswadi`, `/van/hsr-layout`.

**This is the QR target on the van's glass case and on the bag.**

| Section | Content |
|---|---|
| Head | `The Indiranagar run` · `Saturdays, from 4:30pm` |
| Stops in order | Name, local descriptor, typical time band, open-in-maps, per-stop `Notify me` |
| Static map | The route line and its stops. Not the live map — this page must work when the van is parked. |
| Who it serves | The areas on this route, each linking to its `/areas/[area]` page |
| This week's menu for this route | Because availability genuinely differs by run |
| Cutoff | `Order by Thursday 8pm for Saturday's run` |
| Notify | `Tell me when this route runs` |
| Live strip | Only when this route is the one currently running |

**States:** running now · runs later this week · no run this week · route retired (`We've stopped running Indiranagar. Here's the nearest one.`)

---

# Page: Areas (`/areas/[area]`) — NEW, replacing the old `/delivery` idea

Serviceability landing pages, and the only realistic local-SEO lane this business has. Six in the mock: `banaswadi`, `indiranagar`, `koramangala`, `hsr-layout`, `whitefield` (not yet served), `jayanagar` (waitlist).

**Why these exist:** the current site has no serviceability check anywhere. A customer can build a cart, pick a slot, fill in contact details and reach Shopify before discovering the van does not come to them. And for a van, an out-of-area lookup is not a lost customer — it is route-planning data.

---

### Sections, in order

1. **H1** — `Japanese milk bread in Banaswadi`
2. **The answer, immediately** — `Yes. The van runs Banaswadi on Saturdays, 4–6pm. Home delivery is ₹49, free over ₹499.` `[TBC]`
3. **The stop or the window** — the named stop with its descriptor and open-in-maps, plus the delivery windows
4. **Cutoff** — `Order by Thursday 8pm for Saturday's run`
5. **This week's menu for this route**
6. **Reviews from this area** — local proof outperforms general proof on a local page
7. **CTA** — `Order for Banaswadi`
8. **The other areas on this route** — internal links, which is what makes the cluster work

### The three states

**Served**
> `Yes. Banaswadi is on the Saturday run.`

**Served, but no run this week**
> `The van isn't running Banaswadi this week. Next: Saturday the 13th.` → `Tell me when it's out`

**Not yet served**
> `The van hasn't reached Whitefield yet.`
> `Tell us you're there and we'll come sooner — we plan routes by demand.`
> One phone field → `Notify me` → `You're #23 in Whitefield. At [TBC] requests we add the route.`

A public counter turns waitlist capture into a local-pride mechanic. It is also the founders' route-planning dashboard, and nobody else's out-of-stock message tells them where to drive next month.

**Data needed:** serviceable areas, route and run days per area, delivery fee, free-delivery threshold, live per-area request counter, the threshold at which a route is added.

---

# Section: Guides (`/guides/[slug]`) — NEW

Four evergreen definition pages. These are the search-facing pages: someone types "what is shokupan" and lands here, not on a product page and not on a dated journal post.

**They are separate from the journal on purpose.** A guide is undated, maintained, and linked from every relevant product page. A journal post is dated and never updated.

| Slug | Title | Links from |
|---|---|---|
| `what-is-shokupan` | What is shokupan | all four breads, all three sandos |
| `an-pan` | What is an anpan | the seven an pan |
| `what-is-karepan` | What is a karepan | Seoul Spice, Tex Mex Zest |
| `how-to-store-shokupan` | How to keep milk bread | all four breads |

`/shokupan` **stays live** as the commercial landing page and links to `/guides/what-is-shokupan` as its editorial companion. Two intents, two pages, cross-linked, no cannibalisation. It is the only page on the current site with a title tag and it is documented as ranking.

**`how-to-store-shokupan` cannot be published until the founders supply real storage times.** It is a food-safety page.

---

# Section: Journal (`/journal`) — NEW, replacing `/blogpage`

The current blog is 23 auto-generated stubs titled "Discover [product name]", each repeating the shop description word for word, with every "Read More" link pointing at `/blogpage/undefined`. It is duplicate content with broken links. It is a liability, not an asset.

**Delete all 23 stubs.** A blog is only worth having if it is editorial.

**Section head:** `From the van`
**Sub:** `Notes on bread, the route, and what didn't rise.`
**Cadence:** one post a fortnight. Two are written below; six are commissioned.
**Format:** 250–700 words, one photograph, one link to a product, no listicles.

## The eight pieces

| # | Title | Route | Purpose |
|---|---|---|---|
| 1 | **What is shokupan** | `/guides/what-is-shokupan` | The definition page. Written below. |
| 2 | **Why eggless** | `/journal/why-eggless` | Turns the constraint into the craft claim. Written below. |
| 3 | **What is an anpan** | `/guides/an-pan` | Honesty about a naming choice: the original was red bean, ours is cream. |
| 4 | **What is a karepan** | `/guides/what-is-karepan` | Explains the format on the two SKUs people understand least. |
| 5 | **How to keep milk bread** | `/guides/how-to-store-shokupan` | The usage page. High utility, long-tail search. |
| 6 | **A day on the route** | `/journal/a-day-on-the-route` | 4:10am to the last stop, with real timestamps. The labour is the value. |
| 7 | **How to eat a fruit sando** | `/journal/how-to-eat-a-fruit-sando` | Removes the "I won't know what to do with it" objection. |
| 8 | **Why the menu is 23 items** | `/journal/why-23-items` | The founder story told through a constraint. |

---

## Guide 1 — What is shokupan

**Route:** `/guides/what-is-shokupan` · **H1:** What is shokupan · **Image:** a torn slice, crumb to camera

> Shokupan is written 食パン. It means, roughly, eating bread — the loaf you keep in the house rather than the one you buy for an occasion. In Japan it is the default bread, the way pav or a sliced white loaf is the default here.
>
> It looks simple and it is not. The crumb is fine and even. The crust is thin. A slice pulls apart in sheets rather than crumbling, and it holds a shape under butter, jam or a sandwich filling without going to pieces. Bakers get there through a soft, wet dough, a long fermentation, and a lot of attention to temperature. Two shapes are traditional: baked with a lid on the tin for a square slice, or without one for a domed top.
>
> The loaf arrived in Japan in its modern form after the war, when American-style soft white bread came with the occupation, and Japanese bakers spent the following decades making it theirs. It is now the base for most of what a Japanese bakery sells. Cut the crusts off, add cream and fruit, and it becomes a fruit sando. Split it, fill it, and it becomes an anpan.
>
> Ours is made without eggs, which is the part that took the longest. Egg is what usually gives a milk loaf its softness and its structure, so removing it means finding that softness somewhere else. We found it in hydration and in time.
>
> Tear it, don't slice it. It gives up in soft sheets.

**Links out:** Milk Shokupan · Blue Pea Bread · Why eggless

---

## Journal post — Why eggless

**Route:** `/journal/why-eggless` · **H1:** Why eggless · **Image:** two slices, one torn open

> Start with the easy part. Under Indian food labelling rules, egg counts as a non-vegetarian ingredient. So a green vegetarian mark on a packet here already means no egg. Anyone who has spent years reading the mark on the back of a biscuit packet knows this. We are not claiming anything unusual by baking without eggs. Plenty of Indian bakeries do.
>
> The hard part is texture, and nobody talks about that.
>
> Egg does specific work in a milk bread. It carries fat and water into the crumb, it helps the structure set as the loaf bakes, and it is a large part of why a good shokupan feels the way it does. Take it out and the usual result is a loaf that is drier, tighter, and slightly mean. Most eggless milk breads are a compromise, and you can taste the compromise.
>
> Getting the same crumb without it means changing everything else. A wetter dough. A longer, cooler fermentation. Shaping by hand, in small batches, because a wet dough does not behave in a machine. It took months of loaves that were nearly right before one was actually right, and more than 300 first-time tasters worked through the menu before the van ran a single route.
>
> So when we say eggless, we are not asking for credit for what we left out. We are asking you to notice what is still there.
>
> Every one of our 23 items is eggless. Not a range, not a line. All of it.

**Links out:** Milk Shokupan · What is shokupan · Our story

---

# Page: Contact (`/contact`)

Mostly carried over. The problem is not the copy, it is the inconsistency: the site lists two different Gmail addresses, and the Franchise page carries a dummy phone number.

**Headline:** `Talk to us`
**Sub:** `WhatsApp is fastest. We read everything.`

- **WhatsApp** `+91 86189 06902` — `Do you reach me, is it really eggless, can I get it Saturday. All three are quicker in chat.` → `Message us`
- **Email** `wiseeatsindia@gmail.com`
- **Instagram** `@fillo_bakes`
- **Where** `Bengaluru, Karnataka`
- **Hours** `Monday to Sunday, 10:00 AM to 7:00 PM`

**Fix required:** one email address across the whole site. The Franchise page currently uses `fillobakes@gmail.com` and the Contact page uses `wiseeatsindia@gmail.com`. Both are Gmail. `[TBC — founders should pick one, and a domain address would be better than either.]`

---

# Page: Franchise (`/franchise`)

Kept, trimmed, and de-risked. This page currently makes claims the rest of the site contradicts and carries a placeholder phone number that has been live in public.

**Headline:** `Partner with Fillo Bakes`
**Sub:** `We're looking for a small number of operators who want to run a route.`

### What we're offering
- `A tight product range, already tested — 23 items, one kitchen method.`
- `The moving bakery model, including the route and tracker systems.`
- `Training, operations and marketing support.`

**Removed:** "Proven Brand — established presence in Bangalore with thousands of loyal customers." The home page says 500. A franchise page saying thousands, next to a home page saying 500, tells a prospective partner that neither number is real. Replace with what is true: `Founded December 2025. One van, running neighbourhood routes in Bengaluru.`

**Removed:** "Growth Potential — scalable business model with strong margins." A margin claim on a public page invites a question the founders should answer in a call, not in HTML.

### Interest form — CARRIED OVER
Keep the fields, including the investment bands (₹5–10L, ₹10–20L, ₹20–50L, ₹50L+), experience level, and the areas of interest, which already include Moving Bakery.
Submit label: `Send enquiry`
Under it: `We read every one and reply within [TBC] working days.`

### Contact
**Critical fix:** `+91 98765 43210` on this page is a dummy number and has been publicly live. Replace with the real number or remove the field entirely. Same for the second email address.

---

# Page: FAQ (`/faq`) — NEW

Does not exist today. It deflects WhatsApp load, it answers the objections that block a first order, and it is where humour is allowed to live.

**Head:** `Questions`
**Sub:** `If the answer isn't here, WhatsApp us. We reply faster than we update this page.`

### Delivery and the van

**1. Do you deliver to my area?**
Put your pincode in the checker at the top of any page. If we reach you, it shows your route days, your windows and the delivery fee before you add anything to a box. If we don't, leave your number — we plan routes by demand, and a cluster of requests in one place is the thing that moves the van.

**2. What is a moving bakery, exactly?**
A van with our bread in it, running a fixed neighbourhood route on set days. You can have it delivered to your door in a two-hour window, or meet the van at a stop and pay no delivery fee.

**3. Can I just walk up to the van?**
Yes. If it's on your street you don't need an order. Come to the hatch and buy what's there. UPI and card both work. What's on board is what's on board, and the popular things go early.

**4. When does the van come to me?**
Each route has its own run days, and your area decides your route. Set your area once and the header carries it from then on: place, mode, next slot. Some routes run three times a week, one runs daily. On the days your route isn't running, the schedule is the thing to look at, not the map.

**5. How late can I order?**
8pm the evening before a run. `Order by Thursday 8pm for Saturday's run.` That is when the dough goes in. `[TBC — confirm the cutoff.]` Past it, the next available run is pre-selected for you and the closed date is shown greyed with the rule beside it, not hidden.

**6. What does delivery cost?**
Two lanes. Catching the van at a stop is free. Home delivery is ₹49, free over ₹499. `[TBC — confirm the threshold.]` The fee is inside the total from the first screen. If the number on the button ever differs from the number you're charged, tell us — that's a bug, not a policy.

**7. What if I'm not home?**
We call once and wait [TBC] minutes. You can tell us at checkout where to leave it. Bread left outside in Bengaluru in June is bread we wouldn't want to eat, so we'd rather you picked a window when someone's in.

### The bread

**8. Is everything really eggless?**
Yes. All 23 items, every batch, no exceptions. Under Indian labelling rules egg is a non-vegetarian ingredient, so the green mark on our packaging already carries the claim.

**9. Is it vegan?**
No. The breads and most of the fillings contain dairy — milk and butter are what make a milk bread a milk bread. Eggless and vegetarian, not vegan.

**10. What about nuts?**
Pistachio An Pan contains pistachio. Every product page carries a fixed allergen block with three lines: what it contains, what it does not, and what else the kitchen handles. `[TBC — the shared-kitchen line needs founder confirmation before it is published.]`

**11. How long does it keep?**
`[TBC — founders. Needs a real answer per format, in Bengaluru conditions. Do not publish a guess.]` The short version we can already say: bread is best on day one, good on day two, and excellent as French toast on day three.

**12. Do you use preservatives?**
No. That's also why the answer to the previous question is measured in days, not weeks.

### Money

**13. How do I pay?**
UPI first, then cards, netbanking and wallets, all through Razorpay. We never see or store your card details. Cash at the door is available on a first order for +₹30, and not above ₹500 — prepaid keeps the van light. `[TBC — confirm both.]`

**14. Can I get a refund?**
Everything is baked for the day it's made, so we can't take returns. But if a box arrives damaged, wrong, or genuinely not right, message us within 24 hours with a photo and we'll sort it. Every time. Refunds go back through Razorpay and take 7 to 10 working days, which is the bank's pace, not ours.

**15. What is Fillo+, and is it the same as the Standing Order?**
No. Fillo+ is a free membership tied to your phone number. It earns you 2 coins per ₹100 spent, and 25 coins is ₹25 off. The Standing Order is a weekly bread subscription that rides your route's run. It earns coins too. You can have either, or both.

**Foot of page:** `Still stuck?` → `WhatsApp us`

---

# Policies

Four of the five are fine and carry over with light edits. One is actively wrong.

### Delivery (`/policies/shipping`) — REWRITTEN

**All five policies move under `/policies/*`. The old flat URLs redirect.**

The current shipping policy describes couriers, weight-and-distance pricing and "1–2 business days" processing. None of that is how this business works. It describes a warehouse. Fillo is a van on a route, and the policy currently contradicts the entire proposition.

> **Delivery**
>
> We deliver in Bengaluru only, on fixed neighbourhood routes. Enter your pincode anywhere on the site to see whether we reach you, which days, and what it costs.
>
> **How it works.** We bake in small batches after orders come in. Your box goes out on the next route day for your area, in the two-hour window you choose. It is handed over in person, not left in a locker.
>
> **Runs and windows.** Each route has its own run days. Home delivery windows are 12–2, 2–4, 4–6 and 6–8 PM. You can order for any run currently scheduled. **Orders for a run close at 8pm the evening before it.** `[TBC — confirm.]`
>
> **Catch the van.** You can meet the van at a stop on its run instead. There is no delivery fee, and the tracker shows it approaching. This is the lane most people end up preferring.
>
> **What it costs.** Catching the van at a stop is free. Home delivery is ₹49, free over ₹499. `[TBC]` The fee is included in the total shown before you pay and is never added afterwards.
>
> **If we can't reach you.** We call once and wait [TBC] minutes. If nobody answers and you have not told us where to leave it, the box comes back with the van and we will contact you to rebook.
>
> **If something is wrong.** Message us within 24 hours with a photo. See Refunds.
>
> Last updated: [date of publication]

### Refunds (`/policies/refund`) — CARRIED OVER, one line rewritten

The policy itself is sound. Only the opening changes, so that the hard "no" is unambiguous and the recovery is warm — never soften the no, soften the aftermath.

> We can't take returns. Everything is baked for the day it's made. But if your box arrives damaged, wrong, or just not right, message us within 24 hours with a photo and we'll sort it. Every time.

The rest — eligibility, the 24-hour window, order ID and photos, refunds via Razorpay in 7–10 working days — carries over unchanged. **One change:** "before dispatch" becomes `free until 8pm the evening before your run` `[TBC]`, because "dispatch" means nothing on a route.

### Payment and security (`/policies/payment`) — CARRIED OVER

Accurate and fine. Two edits: put UPI first in the list of accepted methods, since it is the primary button. Move the KYC and Razorpay-onboarding checklist off the customer-facing page — it is an internal note that was published by accident.

### Terms (`/policies/terms`) — CARRIED OVER

Update §4 to point at the rewritten Delivery policy rather than describing shipping times. Update §1 with the full legal entity, `Wise Eats SuperFood OPC Pvt Ltd`, rather than "Fillo Bakes". Everything else stands.

### Privacy (`/policies/privacy`) — CARRIED OVER, two additions

Add to "Information We Collect": `Phone number, used as your account identifier` and `Delivery area and address, used to route the van`.
Add a line on the tracker: `The van's live position is ours, not yours. We do not collect your device location.`
Keep the Razorpay language, the no-sale commitment and the deletion contact as they are.

---

# Page: 404 — NEW

Currently the site returns a bare "Product Not Found · ID: [slug]" at HTTP 200 for eight sitemap URLs, which is a soft-404 and worse than a real one.

**Headline:** `We don't bake that.`
**Body:** `That page has gone, or never existed. Here's what's in the van this week.`
**CTA:** `See this week's bake` · **Secondary:** `Track the van`

Below: four product cards.

**Engineering note:** this must return HTTP 404 or 410. Every dead `/product/*` URL should 301 to its match in the `redirects` array in `products.json`, or to `/shop` where no match exists.

---

# Microcopy library

Every string below is written to be reused verbatim. Where a number appears it must be live, not typed.

### Sold out — status, promise, payoff
On a weekly-drop model, sold-out is the default state five days out of seven. It is the most-read copy on the site, so it is written best.

| Moment | String |
|---|---|
| Status, on a card | `Gone for this week` |
| Status, on a product page | `Gone for this week. We bake again Saturday.` |
| Promise, button | `Tell me when the van's back out` |
| Promise, helper | `One message, Sunday morning. Nothing else.` |
| Promise, confirmed | `Done. You'll hear before anyone else does.` |
| Payoff, push | `This week's bake is up.` |
| Payoff, on site | `Fresh out of the oven.` |
| Nearly gone | `3 left` |
| Whole category out | `The an pan are gone. The loaves aren't.` |

### Empty cart
> `Nothing in the box yet.`
> `This week we've got milk bread, custard an pan and three kinds of pastry.`
> → `See this week's bake`

### Empty search / no results
> `We don't bake that — yet. Here's what's in the van this week.`

### Empty Weekly Specials
> `Nothing special this week. The next one goes up Monday morning.` → `Tell me when it does`

### Order states

| Moment | String |
|---|---|
| Order placed | `Got it. Your box is on Saturday's list. We'll message you Friday night with the time band and the stop.` |
| Payment failed | `That didn't go through, and nothing's been charged. Try again, or message us and we'll hold your box while you sort it.` |
| OTP sent | `Sent. Check your messages.` |
| OTP wrong | `That code didn't match. Try again, or we'll send a new one.` |
| Order changed | `Changed. Saturday, 4:00–6:00 PM. Same total.` |
| Order cancelled | `Cancelled. Nothing further will be charged, and the refund is with Razorpay — 7 to 10 working days.` |
| Past cutoff | `Too late to change this one — the dough's in. Message us and we'll do what we can.` |
| Out for delivery | `Your box is on the van. 2 stops away.` |
| Delivered | `Delivered. Tear it, don't slice it.` |

### Area check

| Moment | String |
|---|---|
| Prompt | `Where should we bring it?` |
| Served | `Banaswadi is on the Saturday route.` |
| Not served | `The van hasn't reached Whitefield yet. Tell us you're there and we'll come sooner — we plan routes by demand.` |
| Waitlist joined | `You're #23 in Whitefield.` |
| Serving a new area | `The van comes to Whitefield now. You asked for this.` |

### Forms and errors

| Moment | String |
|---|---|
| Required field | `We need this one.` |
| Bad phone | `That doesn't look like a 10-digit number.` |
| Bad pincode | `That pincode isn't one we recognise.` |
| Generic failure | `Something broke at our end. Nothing was charged. Try again, or WhatsApp us.` |
| Slow load | `Loading. The map comes last, on purpose.` |

### Newsletter
> `One message every Sunday: what we're baking, where the van will be, and a photo of whatever didn't rise properly.`
> Button: `Send it to me` · After: `Done. Sundays only. Promise.`

### Buttons — the standing list
`Add` · `See this week's bake` · `Track the van` · `Set your area` · `Pick a stop` · `Reserve yours` · `Pay ₹[total] with UPI` · `Tell me when the van's back out` · `Notify me` · `Join Fillo+ — free` · `Set up a standing order` · `Skip this week` · `Message us on WhatsApp`

**Test for any new button:** cover the page around it. Can you still tell what it does? `Let's go` and `Yes please` fail this test. `Add` passes.

---

# Account and flows

Every screen a signed-in customer can reach. Sample data shapes for all of it are in `mock-data.json`.

**Three rules across the whole account area.**

1. **The phone number is the account.** No password anywhere. Email is optional and labelled "for your invoice".
2. **Every screen answers "what happens next, and when".** An account page that only shows history is a filing cabinet. This one is a schedule.
3. **Every destructive action states its consequence in the button's own sentence**, not in a modal the user has already decided to dismiss.

---

## Screen: Login (`/login`)

### 1. Enter number
**Headline:** `Sign in`
**Sub:** `Your number is your account. No password to forget.`
**Field:** `+91` fixed prefix, 10 digits, numeric keypad
**CTA:** `Send code`
**Under:** `We'll send a 4-digit code on WhatsApp.`
**Foot:** `New here? Same thing. Put your number in.`

There is no separate sign-up. A number that has not ordered before creates an account on first OTP. **The name is asked after the first order, never before it.**

### 2. Enter code
**Headline:** `Check your messages`
**Sub:** `We sent a code to +91 86189 06902.` with `Change number` beside it
**Field:** four boxes, auto-advance, auto-submit on the fourth, paste-friendly
**Resend:** `Resend in 0:28`, then `Send another code`

### States

| State | Copy |
|---|---|
| Wrong code | `That code didn't match. Try again, or we'll send a new one.` |
| Expired | `That code has expired. We'll send a fresh one.` |
| Resend cooldown | `Hang on 28 seconds and we'll send another.` |
| Rate-limited | `Too many tries. Wait 10 minutes, or WhatsApp us and we'll sign you in.` |
| Not on WhatsApp | `We couldn't reach that number on WhatsApp. Send the code as an SMS instead?` → `Send SMS` |
| Network failure | `Couldn't send that. Nothing's wrong with your number — try again.` |
| Success, mid-checkout | Return to checkout with the cart, lane and slot intact. **Never** drop a signed-in user on the home page mid-purchase. |

`/logout` — one confirm, then back to the home page with the area chip preserved. Signing out should not lose someone's area.

---

## Screen: Account (`/account`)

**Headline:** `Hey Neha.` with the area chip repeated on the right: `Indiranagar · Sat 4–6pm`

The order of these blocks is the order of what people come here to do.

### 1. Next up — the largest card
`Saturday 6 Sep · 4–6pm · Indiranagar, 12th Main`
`1 Milk Shokupan, 2 Custard An Pan · ₹518`
`The van is 2 stops away · around 4:40–4:50`
`[ Track the van ]` `[ Change or cancel ]`

**Empty:** `Nothing on the van for you yet.` followed by this week's run card.

### 2. Your standing order
`1 Milk Shokupan · every Saturday · Indiranagar 4–6pm`
`Next: Sat 13 Sep. Closes Thursday 8pm.`
`[ Skip this week ]` `[ Manage ]`

**No standing order:** the block becomes the pitch — **but only for customers with two or more orders.** A first-time customer sees nothing here.

### 3. Fillo coins
`18 coins · 7 more for ₹25 off` with a progress bar.
Non-members: `Join Fillo+ — free. Start earning on your next order.`

### 4. Order again
Last three items, one-tap `Add` each.

### 5. Nav row
`Orders · Standing order · Addresses · Rewards · Alerts · Gift cards · Settings`

### Dashboard states
new member with no orders · has an upcoming order · order in transit · no standing order · standing order paused · **standing order payment failed** (an alert banner at the very top, above everything).

---

## Screen: Orders (`/account/orders`)

Rows, newest first: date · item thumbnails · stop or address · total · status pill · `Reorder` · `Invoice`
Filters: `All · Upcoming · Delivered · Cancelled`

**Empty:** `No orders yet.` + this week's run card. `The first one is the hard one. Bangalore Bloom is ₹99 and most people start there.`

---

## Screen: Order detail (`/account/orders/[id]`)

Everything on `/order/[id]`, plus the invoice, the payment method, and `Report a problem` opening WhatsApp pre-filled with the order number.

### The order timeline

Five steps, always all five visible, completed ones ticked with a **real** timestamp. The labour is the value — this strip is why the wait reads as craft rather than delay. **A fabricated bake strip is worse than no bake strip.**

| Status | Pill | The sentence under it |
|---|---|---|
| `confirmed` | `Confirmed` | `We have it. Baking starts Friday night.` |
| `baking` | `Baking` | `Your bread is in. Mixed at 4:10, in the oven at 5:40.` |
| `loaded` | `Loaded on the van` | `Out of the oven and on board.` |
| `out` | `Out on the route` | `2 stops away. Around 4:40 to 4:50.` |
| `delivered` | `Delivered` | `Delivered at 4:47. Tear it, don't slice it.` |
| `collected` | `Collected` | `Collected at Indiranagar, 4:52. Thanks for coming out.` |
| `missed` | `Missed at the stop` | `We waited at Indiranagar till 6:10. Message us and we'll sort it.` |
| `cancelled` | `Cancelled` | `Cancelled on 26 Sep. Refund is with Razorpay — 7 to 10 working days.` |
| `payment_pending` | `Payment pending` | `We're waiting on your bank. Nothing is confirmed yet.` |
| `failed` | `Payment failed` | `Nothing was charged and your order wasn't booked.` → `Try again` |

**When the order is out:** the tracker embeds directly in this screen. This is where the customer will look, so it goes here rather than making them navigate to `/van`.

### Actions

| Condition | Actions |
|---|---|
| Before cutoff | `Change window` · `Change stop or address` · `Cancel this order` — with `Free until Thursday 8pm` beside them |
| After cutoff | `Too late to change this one — the dough's in. Message us and we'll do what we can.` → `WhatsApp us` |
| Delivered | `Rate this` · `Order again` · `Something wrong?` |
| Delivered, over 24h | `Order again` only, with `The 24-hour window for reporting a problem has passed, but message us anyway — we'd rather know.` |

### Something wrong
Pick items · up to three photos · one text field.
**Body:** `We can't take returns — everything is baked for the day it's made. But if this arrived damaged, wrong, or just not right, tell us and we'll sort it. Every time.`
**CTA:** `Send this to us` · **Success:** `Got it. We read these ourselves and we'll reply on WhatsApp today.`

---

## Screen: Addresses (`/account/addresses`)

Each card: label · society or building · block and flat · landmark · area · a **serviceability badge** — `Van comes here Saturdays` / `Home delivery ₹49` / `Not served yet` — plus a `Default` tag, `Edit` and `Remove`.

**Add form:** Label · Flat or house no. · Apartment or building name · Street or area · Landmark · Pincode (auto-fills the area) · Bengaluru (locked) · Leave it with (optional). Never Line 1 and Line 2.

| State | Copy |
|---|---|
| Empty | `No addresses saved. Add one and we'll tell you which day the van reaches it.` |
| Not served, on add | `We don't reach Whitefield yet. You can still save this, and we'll tell you when the route changes.` → `Save anyway` |
| Address goes off route | `We've stopped running Whitefield. Your standing order is paused and nothing is being charged.` → `Change address` |
| Removing the default | `Remove Home? Your standing order goes there on Saturdays.` → `Remove and pick another` |
| Removing one in use | `An order is going here on Saturday. Remove it after that delivery.` |

---

## Screen: Rewards (`/account/rewards`)

Replaces `/fillo-plus/dashboard`, which today is an email box that returns a number. That is a lookup tool, not a dashboard.

**Headline:** `18 coins`
**Sub:** `7 more for ₹25 off.` with a progress bar, 18 of 25.
**Member line:** `Fillo+ member since 12 March 2026.` or, for a ₹1 payer, `Founding member since 12 March 2026.`

### Redeem block

| State | Copy | CTA |
|---|---|---|
| Under 25 | `₹25 off unlocks at 25 coins. A ₹350 order gets you there.` | disabled `Redeem ₹25` |
| At or over 25 | `You have enough for ₹25 off. It applies at checkout.` | `Redeem on my next order` |
| Armed | `₹25 off is waiting on your next order.` → `Undo` | `See this week's bake` |
| Not a member | `You're not on Fillo+ yet. It's free, and this order would have earned you 10 coins.` | `Join Fillo+ — free` |
| Legacy email member | `You joined Fillo+ with your email. Add your phone number to keep your coins.` | `Add my number` |

### Ledger
Eight rows, then `Show all`. Date · what happened · coins in or out · running balance · link to the order.
Row copy: `Order FB-2609-0142 · +10` · `Redeemed ₹25 off · −25` · `Joined Fillo+ · +0` · `Standing order, 22 Sep · +6`
**Empty:** `No coins yet. They land the moment an order is delivered, not when you pay.`

### Founding member block
Shown only to ₹1 payers.
> **`Founding member`**
> `You joined when Fillo+ cost ₹1. That badge stays, and you get first access to every new bake.`

### On tiers — a recommendation, not a spec
**Do not launch tiers.** Fillo+ is now one sentence — free, 2 coins per ₹100, 25 coins is ₹25 off, never expires — and a customer can hold the whole thing in their head. A tier ladder on top is a second scheme people have to learn, and there is no data yet on who the repeat buyers even are. The cheapest honest status layer is the one already specced: a name and a date. Revisit after six months of order data. `[TBC — founders.]`

---

## Screen: The Standing Order (`/account/subscription`)

```
YOUR STANDING ORDER                                  [Active]
1 Milk Shokupan                                     ₹180/wk
(standing-order price, ₹20 off ₹200)

Every Saturday · Indiranagar, 12th Main · 4–6pm
Next delivery   Sat 13 Sep
Closes          Thursday 8pm
Paid with       UPI · autopay mandate ····4821
─────────────────────────────────────────────────────────
[ Skip this week ]          [ Change what's in it ]
[ Going away? Pause ]       [ Move to another day ]
[ Change frequency ]        [ Change stop or address ]
─────────────────────────────────────────────────────────
UPCOMING
Sat 13 Sep  1 Milk Shokupan   ₹180   [skip] [change]
Sat 20 Sep  1 Milk Shokupan   ₹180   [skip] [change]
Sat 27 Sep  SKIPPED                  [un-skip]
─────────────────────────────────────────────────────────
HISTORY · 6 deliveries · 1 skipped · since 12 Jul
─────────────────────────────────────────────────────────
Cancel my standing order
```

### Screens and states

| Screen | Copy |
|---|---|
| **Active** | as above |
| **Skip confirm** | `Skipping Saturday 13 Sep. You won't be charged. Back the week after.` One tap, **no interstitial upsell.** |
| **Pause sheet** | `Going away?` → pick a return date → `Paused till 4 Oct. We'll message you the day before.` |
| **Paused** | The card is muted, `Resume now` is prominent, the return date is stated. |
| **Change contents** | The menu with the current selection pre-ticked. `Applies from Sat 20 Sep` stated on the button. |
| **Change day or route** | Only days the van serves the saved area. Others greyed: `Not on this route`. `Applies from Sat 20 Sep`. |
| **Change frequency** | `Weekly` ↔ `Fortnightly`. |
| **Change stop or address** | Permanent, plus a per-delivery override option. |
| **Cancel** | Offers pause **once**, then cancels. No phone call, no retention maze. `Cancelled. Your last delivery was Sat 6 Sep. Come back whenever.` |
| **Out of stock** | `We couldn't bake the Blue Pea this week. Swap for Milk Shokupan, or skip — you won't be charged either way.` |
| **Payment failed** | Banner plus `Retry payment`. Auto-skips that week if unresolved by the cutoff. **Never silently cancels.** `We couldn't take this week's payment, so Saturday is on hold. Nothing else has changed.` |
| **Route changed** | Sent before the cutoff: `We've moved the Indiranagar stop to 5–7pm from Saturday the 20th.` |
| **Route retired** | `We've stopped running Indiranagar. Your standing order is paused and you haven't been charged. Sorry — we'd rather say so than quietly stop.` → `Change address` |
| **Past cutoff on skip** | `Too late to skip this one — it's already being baked. The next one is open.` |

---

## Screen: Standing order builder (`/account/subscription/setup`)

Four steps on **one screen**, not a wizard.

1. **What** — pick items from the menu, with quantity steppers.
2. **Where and when** — the run day is derived from the saved area, so this confirms rather than asks: `Indiranagar, Saturdays, 4–6pm.` Editable.
3. **How often** — `Every week` / `Every other week`.
4. **Confirm** — items, price, saving in rupees, first delivery date, cutoff.

**The reassurance line sits above the confirm button, not below it:**
> `Skip any week. Pause anytime. Cancel in one tap.`

**Confirm button:** `Start my standing order`
**Done:** `You're on the Saturday Indiranagar list. First delivery Sat 13 Sep. We'll message you Wednesday with what's coming.`

**Logged out:** the phone and OTP step happens **inside** the builder, at the confirm step, not as a wall in front of it.

---

## Screen: Alerts (`/account/alerts`)

This is the screen that stops people muting the brand.

**Headline:** `What we send you`
**Sub:** `WhatsApp by default. We don't have a mailing list you didn't ask for.`

| Toggle | Helper | Default |
|---|---|---|
| `Order updates` | `Confirmed, baking, on the van, delivered.` | **On, locked.** `We have to be able to tell you where your bread is.` |
| `Van alerts` | Per stop, per trigger: `leaves the kitchen` / `2 stops away` / `arrives` | Off |
| `The Sunday message` | `What we're baking this week.` | Off |
| `Standing order preview` | `What's coming Saturday, sent Wednesday, with a skip button.` | On for subscribers |
| `When something's back` | `Only for the items you asked about.` | Off |

**Channel:** WhatsApp (default) · browser push (hidden on iOS Safari tabs) · email
**The stated cap, on the page:** `At most one van alert a day. Three messages a week, total.`
**`Pause all alerts for 2 weeks`** — one link.
**Foot:** `Turn everything off` — `You'll still get order updates. Everything else stops.`

**States:** all on · partial · all paused · unsubscribed · blocked us on WhatsApp (`We can't reach you — it looks like our number is blocked. Unblock +91 86189 06902, or switch to SMS.`)

---

## Screen: Gift cards (`/account/gift-cards`) — NEW

Two tabs: `Cards I bought` and `Cards I've been given`.

**Bought:** code, amount, recipient, delivery date, status (`Scheduled` / `Sent` / `Partly used` / `Fully used` / `Expired`), `Resend`.
**Received:** code, remaining balance, `Use at checkout`, expiry.

**Add a card:** one field, `Enter a gift card code` → `Added. ₹500 sits on your account and comes off your next order automatically.`

| State | Copy |
|---|---|
| Empty, bought | `You haven't sent any yet.` → `Send a gift card` |
| Empty, received | `Nothing here. If someone sends you one, it lands on this page.` |
| Invalid code | `That code doesn't match anything. Check it and try again.` |
| Already used | `That card's been spent. Nothing left on it.` |
| Partly used | `₹150 left of ₹500.` |

---

## Screen: Settings (`/account/settings`) — NEW

`Name` · `Phone number` (re-verify by OTP to change) · `Email` (for invoices, optional) · `Language of receipts` · `Delete my account`

**Change number:** `Changing your number moves your orders, coins and standing order with it. We'll send a code to the new one.`

**Delete my account — a plain explanation, not a dark pattern:**
> `Deleting removes your addresses, your saved stops and your alerts.`
> `Your [n] Fillo coins go with it and we can't get them back.`
> `Orders already placed still get delivered, and we keep the invoices as long as the law requires.`
> `If you have a standing order it's cancelled after the delivery already in the plan.`
> `[ Delete my account ]` · `[ Keep it ]`

**Confirm:** `Type DELETE to confirm.` **Done:** `Deleted. Sorry to see you go — the van's still around if you change your mind.`

---

## Van page states — the four canonical ones

Full copy is in the van section above. The four states the mock must render:

1. **Live** — `LIVE · updated 9s ago` · `2 stops away.` · `Around 4:40 to 4:50` · map · stop list with done/current/upcoming/sold-out · bake strip with real timestamps.
2. **Off air** — `OFF AIR · back Saturday` · `The ovens are cold. The plan isn't.` · the week's runs replacing the map · `Tell me when the van's out`.
3. **Stale** — `LAST SEEN 4:32` · marker at 60% opacity · the band replaced by `Last seen 2 min ago`.
4. **Go dark** — `Van's off the map for a bit — back shortly.` · schedule still fully readable.

Plus: notify-me confirmed (`Done. We'll ping you Saturday.`), map failed (Lite mode renders automatically), and no run today.

---

## Cross-screen error states

| Situation | Copy |
|---|---|
| Signed out mid-action | `You've been signed out. Put your number in and we'll take you straight back.` |
| Server error | `Something broke at our end. Nothing was charged. Try again, or WhatsApp us.` |
| Offline | `You're offline. This page is showing what we last knew.` |
| Slow map | `Loading. The map comes last, on purpose.` |
| Feature not in your area | `Not in Whitefield yet.` → `Add my area` |
| Permission denied on a shared link | `That order isn't on this number. Check which number you signed in with.` |
| Cutoff passed mid-flow | `Saturday's run just closed. Move to Sunday?` |
| Item sold out mid-flow | `We sold the last one while you were deciding. Remove it, or swap for [item].` |

---

# Page: Boxes (`/boxes`) — NEW

Curated boxes and a build-your-own. A box is a **product**, not the subscription — the subscription is the Standing Order and the two words never overlap.

**Head:** `Boxes`
**Sub:** `Three we've put together, or build your own.`

### The three curated boxes

| Box | Contents | Price | Line |
|---|---|---|---|
| **The Sunday Table** | 1 loaf + 3 bakes | `₹499` `[Est.]` | `A loaf and three bakes, chosen for you. Feeds a table of four at breakfast.` |
| **The Sweet Half Dozen** | 6 an pan, mixed | `₹949` `[Est.]` | `Six filled buns, no two the same. The one people send as a gift.` |
| **The Savoury Run** | 6 kare pan and pastries | `₹749` `[Est.]` | `Six savoury bakes across the menu. Lunchboxes for the week.` |

`[TBC — all three prices are our design, derived from live retail. The founders set the final numbers.]`

**Every box:** `All vegetarian. All eggless. Baked the morning it goes out.`

### Build your own

A slot-filling interface with a live total.
**Head:** `Build your own`
**Sub:** `Pick six. Mix anything.`
`[ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ]` — empty slots invite a tap; filled slots show the item and a remove control.
**Running line:** `4 of 6 · ₹636 so far`
**Complete:** `6 of 6 · ₹949 · you saved ₹85` — the saving stated in rupees, and only when it is real.

| State | Copy |
|---|---|
| Empty | `Nothing picked yet. Tap a slot.` |
| Partly full | `Two more and the box is done.` |
| An item not on the selected run | `The Blue Pea isn't on Saturday's run. Pick another, or switch to Sunday.` |
| An item sold out | `Gone for this week.` — greyed in the picker, never hidden |

**Image needed:** all three boxes, identical framing, real contents. None exist.

---

# Page: Gifting (`/gifting`) — NEW

Gifting is a structural conversion driver in India, and Fillo already owns the date and slot machinery.

**Head:** `Send bread to someone`
**Sub:** `Pick a Saturday, write a note, and we hand it over.`
**CTA:** `Send a box`

### How the flow differs from a normal order

1. **`Send as a gift` toggle** — available on any order, not only from this page.
2. **Recipient name and phone** — the delivery contact becomes the recipient, so our messages go to them, not to you.
3. **A note, 140 characters**, with a card-shaped live preview. `140 characters. We write it on the card by hand.`
4. **`Hide prices from the recipient` — default ON.** The packing slip and every message to them omits the total.
5. **The slot picker is relabelled** `Choose the Saturday`, because a gift is chosen by date, not by convenience.

### What the sender gets
`We'll message you when it's handed over.` Plus, on delivery: `Delivered to Anjali at 4:47. She's got it.`

### States
default · recipient out of area (`We don't reach Whitefield yet. Send a gift card instead?` → `/gift-cards`) · recipient area has no run that week (`No run in Banaswadi that week. The Saturday after?`) · note too long · gift delivered · recipient not home.

**Image needed:** a box with a handwritten card on top, in someone's hands at a door.

---

# Page: Gift cards (`/gift-cards`) — NEW

**Why this page matters more than it looks:** it is the thing that still converts on a sold-out day. When the run is gone, this is the only purchase left on the site.

**Head:** `Gift cards`
**Sub:** `For when you don't know which Saturday, or which bread.`

**Fields:** amount (`₹500` · `₹1,000` · `₹2,000` · `Other`) · quantity · recipient name and phone · delivery date · a message.
**CTA:** `Send the card`
**Under:** `Delivered on WhatsApp on the date you pick. No expiry.` `[TBC — confirm whether cards expire. If they do, say so here in the same sentence, not in the terms.]`

### Three flows
- **Buy** — as above.
- **Redeem** — `Enter a gift card code` → `Added. ₹500 sits on your account and comes off your next order automatically.`
- **Check balance** — one field, no login: `₹150 left of ₹500.`

### States
purchase · scheduled · sent · redeem · partly used · fully used (`That card's been spent.`) · invalid code · expired.

### On a sold-out day
The run card's sold-out state carries a second button:
> **`Gone for this week.`**
> `[ Tell me when the van's back out ]` `[ Send a gift card instead ]`

---

# Page: 500 (`/500`) — NEW

**Headline:** `That's on us.`
**Body:** `Something broke at our end. Nothing you were doing has been charged. Try again in a minute, or message us and we'll sort it by hand.`
**CTA:** `Try again` · **Secondary:** `WhatsApp us`
**Under:** `If you were mid-order, your cart is still there.`

Must return HTTP 500. No stack trace, no error code the customer cannot use.

---

# Page: Offline (`/offline`) — NEW, the PWA shell

**Headline:** `You're offline.`
**Body:** `This is what we last knew. The van's position and today's counts won't be right until you're back on.`
**CTA:** `Try again`

Below it, cached and still useful: the week's run schedule, the menu, your next order's date and stop, and the WhatsApp number as plain text so it can be copied without a connection.

**The rule:** the schedule is cacheable and the live map is not. Off-air content works offline; that is the point of building the page schedule-first.

---

# Appendix: final route map

| Route | Page | Was |
|---|---|---|
| `/` | Home | unchanged |
| `/shop` | This week's bake, run-aware | unchanged |
| `/shop/all` | All 23 | NEW |
| `/product/[slug]` | Product detail | `/shop/[slug]` in the previous draft |
| `/boxes` | Curated boxes and build-your-own | NEW |
| `/van` | The tracker | `/track` |
| `/van/[route]` | Route page, 4 in the mock | NEW |
| `/areas/[area]` | Serviceability landing, 6 in the mock | `/delivery` |
| `/standing-order` | Subscription pitch and builder entry | `/fillo-plus/weekly-box` |
| `/fillo-plus` | Membership, now free | unchanged path |
| `/gifting` | Send bread as a gift | NEW |
| `/gift-cards` | Gift cards | NEW |
| `/cart` `/checkout` `/order/[id]` | Purchase | unchanged |
| `/about` `/shokupan` `/faq` `/contact` `/franchise` | Content | unchanged |
| `/guides/[slug]` | 4 guides | NEW; `what-is-shokupan` moved here from the journal |
| `/journal` `/journal/[slug]` | 8 pieces, 2 written | `/blogpage` |
| `/policies/shipping\|refund\|terms\|privacy\|payment` | Policies | flat `/shipping` etc. |
| `/login` `/logout` | Auth | `/signin` |
| `/account` `/account/orders` `/account/orders/[id]` | Account | unchanged |
| `/account/subscription` `/account/subscription/setup` | Standing order | `/account/box` |
| `/account/addresses` | Addresses | unchanged |
| `/account/rewards` | Fillo coins | `/account/fillo-plus`; also absorbs `/fillo-plus/dashboard` |
| `/account/alerts` | Alert preferences | `/account/notifications` |
| `/account/gift-cards` `/account/settings` | Account | NEW |
| `/404` `/500` `/offline` | System | `/500` and `/offline` are NEW |
