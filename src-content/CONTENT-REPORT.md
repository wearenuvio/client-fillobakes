# Content report — Fillo Bakes rebuild

What the current site's content gets right, what it gets wrong, what I filled in, and what only the founders can answer.

**Deliverables in this folder:** `products.json` (23 SKUs + categories + redirects) · `site-content.md` (page-by-page copy spec) · `seo.json` (84 routes) · `mock-data.json` (fixtures for the mocked front end) · this report.

**Reconciled to `research/DECISIONS.md` v2 (3 Sep 2026).** Where this content spec conflicted with `research/competitors/journey-recommendation.md`, the journey doc won on flow. Everything below is written against the final route map.

---

## 1. What the current content gets right

Five things are genuinely good and the rebuild keeps all of them.

1. **The About page.** It is the only page on the site that sounds like a person. "Fuwa fuwa", "precision hydration, fermentation timing", "made completely eggless without sacrificing softness", "intentionally tight menu", "flavours developed from travels to Japan and inspired by real kitchens, not chemicals", "over 300 first-time tasters". Every one of those is specific, defensible and hard to copy. Almost all of it carries over verbatim. My only structural change is to promote the six differentiators and the 300-taster number out of the bottom of the page, where they currently sit under three softer paragraphs.
2. **The product naming system.** Kyoto Curry, Seoul Spice, Calcutta Blaze, Bangalore Bloom, Korean Whisper, Mawa Melt. That is a rule — world city plus a sensory word — not a list. Descriptive, evocative item names measurably lift both sales and post-purchase satisfaction. It is the strongest undocumented asset in the business.
3. **The checkout bones.** A 30-day date picker with four two-hour slots, a working coupon nudge, cart persistence across sessions, and a ₹1 loyalty upsell at the right moment. That is rare for a micro-bakery and none of it gets thrown away.
4. **The van tracker.** A live GPS feed of a moving bakery, updating every 15 seconds. Nobody else in this market has one.
5. **`/shokupan`.** The only page on the site with a title tag, and it ranks. That template is proven and the whole SEO plan is built around it.

---

## 2. What it gets wrong

### The one that costs money
**The price changes at the door.** The site promises ₹420 and Shopify asks for ₹470, because delivery is added after the customer has committed. An unexpected cost at the end is the single most documented cause of cart abandonment. Everything else on the current checkout is friction. This one is a broken promise, and no amount of copy fixes it — the delivery fee has to be computed and shown on Fillo's own checkout from the first render.

### The one that is strategically absurd
**Serviceability is never checked.** A customer can build a cart, pick a date, choose a slot, fill in contact details and reach Shopify before discovering the van does not come to them. For a business whose entire proposition is a fixed route, "where are you" is the first question the site should ask and currently the only one it never asks. Worse: an out-of-area lookup is not a lost customer for a van, it is route-planning data. The current site throws that signal away.

### Numbers that are not true
- `100+ Items` on the home page. The menu is 23. A customer who counts stops trusting anything else on the page.
- `500+ Lovers` on the home page against `thousands of loyal customers` on the Franchise page. Two made-up numbers that contradict each other.
- The Fillo+ "Quick Math" block calls a ₹1500 order "Instant redemption", which reads as same-order redemption. It is not.

### Content that is actively broken
- **8 of 12 `/product/*` sitemap URLs render "Product Not Found" at HTTP 200.** Soft 404s, indexed.
- **All 23 blog posts are duplicates** of the shop descriptions, titled "Discover [product]", with every "Read More" pointing at `/blogpage/undefined`.
- **All three Fruit Sandos share one identical description**, including the two that are not the base product.
- **The "About This Product" block is identical on all 23 product pages.**
- **`/fillo-plus`, `/franchise`, `/blogpage` and `/shokupan` are all missing from the sitemap.**
- **No title tag, meta description, canonical, OG tag, favicon or JSON-LD on any core page.** This is the cheapest, largest fix in the entire rebuild.

### Content that contradicts the business
- **The shipping policy describes couriers**, "weight and distance", and "1–2 business days processing". That is a warehouse. Fillo is a van on a route. The policy currently argues against the proposition on the brand's own domain.
- **The Franchise page carries a live dummy phone number**, `+91 98765 43210`, and a second Gmail address that contradicts the Contact page.

### Voice
Emoji in headlines, product names, CTAs and the announcement bar. Exclamation marks throughout. "Golden, Buttery, Blissful ✨". "Explore Our Magic ✨". "Ooh lala". "happiness wrapped in butter and love 🥰". It reads as a template, not a bakery that ferments dough overnight. Quietness is differentiating in a category of `SHOP NOW`, and it reads as expensive.

### Eight five-star testimonials in a row
Unattributed, undated, no source, next to an inline "Post Review" star widget that goes nowhere. The first five reviews do almost all the trust work; eight identical ones read as manufactured. Cut to three, attach areas and dates, and move collection into the post-delivery WhatsApp message where it is tied to a real order.

---

## 3. Gaps I filled

| Gap | What I wrote |
|---|---|
| No dedicated van page | `/track` — live state, off-air state, notify-me (WhatsApp opt-in), walk-up copy, waitlist with a public counter, plus a full widget string table for every state including stale signal and off hours |
| No serviceability anywhere | `/delivery` page, a home-page area-check module, an inline check on every product page under the price, and an area chip in the header. One entry, three surfaces |
| No subscription | `Fillo+ Weekly Box` at `/fillo-plus/weekly-box` — three tiers, skip/pause/cancel mechanics written out in the open, route-day selection, weekly rotation as the retention mechanic |
| No FAQ | 15 real Q&As drawn from the policies, the delivery model and the objections that actually block a first order |
| No real blog | 8 article titles, 2 fully written 250-word posts (`what-is-shokupan`, `why-eggless`), and the deletion of all 23 stubs |
| No unique product copy | 23 unique `longDescription` fields, honest, restating only what the site already claims |
| No allergen information | Per-SKU `contains` / `likely` in `products.json`, plus a fixed three-state allergen block spec on every product page |
| No account area | Full "Account and flows" section: sign in, account home, orders, order detail with a five-step bake strip, addresses, Fillo+ dashboard with ledger, subscription management, notification preferences, and empty + error states for every one |
| Duplicate/dead URLs | A 14-entry `redirects` array in `products.json` |
| No image inventory | `existingImage` per SKU, plus an `orphanImages` list |
| Price/total integrity | A one-screen checkout spec with two fulfilment lanes, phone+OTP identity, UPI first, and the rule that the number on the button equals the number in the table equals the number Razorpay charges |

### Image findings
- **Two SKUs have no photograph at all:** `tex-mex-zest` (which is a *featured* product and one of only four working product pages) and `tiramisu-an-pan`.
- **The base `fruit-sando` has no photograph.** The two WhatsApp images map to the strawberry-cream and custard-cream versions — but that mapping is **inferred visually** (pink cream vs yellow custard cream), not from a filename. Confirm before publishing.
- **`nice-mince-new.jpg` is an orphan.** It shows spinach-and-cheese buns, "Nice Mince" is not in the 23-SKU catalogue, and its lighting and styling differ sharply from every other product shot. It reads as stock photography. On a site whose entire argument is "we made this by hand this morning", a stock food photo is a material risk. Do not reuse without confirming provenance.
- **The single most valuable shot that does not exist** is the van, open, on a real residential street, with someone being handed a loaf.

---

## 4. Where I deviated, and why

### 4a. Reconciliation with the journey doc — what changed in my deliverables

The competitor and journey agent's flow decisions supersede my first pass. Eleven substantive changes:

| # | Was (my first pass) | Now | Why the journey doc is right |
|---|---|---|---|
| 1 | Area check as a home module | **Lane and area chosen before the cart**, via a header chip and a bottom sheet | The lane changes which days, stops and items are available. Deciding it at checkout means the cart can be unfulfillable. |
| 2 | A single weekly cadence | **Route runs with per-route run days** — one route daily, one three times a week | A van serves different neighbourhoods on different days. A single site-wide "Saturday" was a simplification that would have shipped a lie. |
| 3 | Generic cutoff | **`Order by Thursday 8pm for Saturday's Indiranagar run`**, in the bar, above every buy button and beside every greyed date | One sentence, everywhere, naming both ends. This is the site's spine. |
| 4 | Fillo+ at ₹1 | **Fillo+ is free and phone-based** | Nobody in the benchmark set charges to join. The ₹1 forces a full Shopify checkout to acquire a mechanic that costs nothing to run, filtering out most of the people it exists to capture. |
| 5 | "Fillo+ Weekly Box", pitched on the home page | **"The Standing Order"**, pitched on the confirmation of order #2 | "Cancel Fillo+" would be ambiguous between *stop my bread* and *leave the programme* — a real support problem. And the first order proves the bread; the second is when the habit exists. |
| 6 | "Box" used loosely, including `Add to the box` | **"Box" now means only the curated products at `/boxes`** | With a real box product on the menu, the button and the subscription could not both be "the box". |
| 7 | `/track`, `/delivery` | **`/van` + `/van/[route]`, `/areas/[area]`** | Route and area pages are shareable, indexable and the only realistic local-SEO lane. `/van/[route]` is also the QR target on the van's glass case. |
| 8 | Three doors as a home module | **Three doors as a shop module** | It belongs where someone is choosing, not where they are still deciding whether to care. |
| 9 | Flat policy URLs | **`/policies/*`** | Consistency with the final route map. |
| 10 | `/journal/what-is-shokupan` | **`/guides/what-is-shokupan`**, with a four-guide cluster | A guide is undated and maintained; a journal post is dated and never updated. Mixing them makes both worse. `/shokupan` still stays live as the commercial page. |
| 11 | No timers at all | **Two honest timers allowed**: the cart hold and the cutoff clock | Both are wired to real constraints. A manufactured countdown is still banned. |

**What I kept from my first pass and would defend:** every product description in `products.json`, the allergen split between stated and inferred, the redirect map, the microcopy library, the review and testimonial cuts, the shipping-policy rewrite, and the rule that no unverified number ships.

### 4b. Where I departed from the drafted strings in `research/prior/`

1. **"Kenji" is gone.** The teardown and the deck both draft strings naming a driver called Kenji. No such person appears anywhere in the client's material. Replaced with "the van" and "we". If there is a real person on the route, name them — a named human is a strong trust asset — but I will not invent one.
2. **"Matcha rolls" and "three kinds of cream pan" are gone.** Neither is on the 23-SKU menu. Replaced with real products.
3. **"82% hydration / 18h ferment" is marked `[TBC]`, not shipped.** It is the deck's strongest product-page block and I want it. But those numbers are a design placeholder, and the whole voice system rests on *every number on the site is true*. Shipping an invented hydration figure breaks the one rule that makes the rest credible. Same treatment for "We bake 40".
4. **"Nobody in 300 tastings could tell" is flagged.** The 300-taster figure is real, from the client's own About page. The claim inside the sentence is not measured. Either the founders confirm it, or the line becomes `Eggless. 300 first-time tasters got us there.`
5. **`/shokupan` is not redirected.** My own first pass leaned toward folding it into the journal. That was wrong, and the journey doc agrees: it is the only page on the site with a title tag and it is documented as ranking. It stays live as the commercial landing page, cross-linked with the guide.
6. **The Japanese ritual names are not adopted.** *Yōbi*, *Kinyōbi Drop* and *Mainichi* were proposed for the drop and the plan. "The Standing Order" is a real bakery phrase that survives being said out loud at a van window, and Japanese stays where the client put it: small kana under product names, never in navigation. I kept **"Fillower"** only as far as the account badge, and the ₹1 payers now get **"Founding member"** instead, which is more specific and cannot be devalued by growth.

**One recommendation I am still making against the grain.** The home page leads with taste and demotes "eggless" to a badge, on the evidence that abstention labels depress choice. That evidence is real but Western, and India is the boundary condition — here "eggless" is an active search term, not an abstention. I have written the page that way *and* flagged it as an explicit A/B. It should not be rolled out on the strength of the research alone.

## 5. Open questions for the founders

Nothing below can be answered from the site, the snapshot or the research. Each one blocks a specific piece of copy that is currently sitting on a `[TBC]`.

### Blocks launch

| # | Question | Blocks |
|---|---|---|
| 1 | **What are the real route names, days and time windows?** The only route string that exists anywhere is "K.S. Nissar Ahmed Ward", from the tracker modal. | The whole `/track` schedule table, the area checker's answers, the Weekly Box route-day picker |
| 2 | **Which pincodes do you actually serve?** | Every serviceability state on every page |
| 3 | **Confirm ₹49 delivery and the ₹499 free threshold.** Both are marked [TBC] in DECISIONS v2 and both appear in area-page meta descriptions | Checkout, `/areas/*`, the delivery policy, product pages, FAQ #6. This is also the fix for the ₹420→₹470 break |
| 4 | **Confirm the 8pm cutoff, and what operational fact causes it.** DECISIONS v2 sets 8pm the evening before a run; I have written "because that's when the dough goes in". If the real reason differs, say the real one. | The announcement bar, every buy button, the checkout date picker, standing-order skip rules, the refund policy |
| 5 | **FSSAI licence number.** | The trust strip, the footer, and LocalBusiness schema |
| 6 | **The shared-kitchen allergen line.** Which allergens does the kitchen handle that a given product does not contain? | The allergen block on all 23 product pages. This is a food-safety statement and cannot be inferred |
| 7 | **How long does each format keep, in Bengaluru conditions?** Days at room temperature, refrigerate or not, freezes or not, how to revive. | The "Keeping it" block on every product page, FAQ #11, the `tear-dont-slice` article |
| 8 | **Remove the dummy number `+91 98765 43210`** from the Franchise page, and settle on one email address. Right now the site publishes two. | The Franchise page, and NAP consistency for local search |

### Blocks specific claims

| # | Question |
|---|---|
| 9 | **Real hydration percentage and fermentation time** for the shokupan. The deck drafts 82% and 18h; those are placeholders. |
| 10 | **Real oven capacity per bake.** "We bake 40" is the honest-scarcity mechanic and it is a good one, but only if 40 is the number. |
| 11 | **Weekly Box pricing.** I have proposed ₹180 / ₹310 / ₹3,600 prepaid, derived from live retail prices at roughly 10–16% off. These are estimates, not your numbers. |
| 12 | **Is "nobody in 300 tastings could tell" true**, or should the line be "300 first-time tasters got us there"? |
| 13 | **What were the dates of the 300-taster testing phase?** |
| 14 | **Is there a real member-first window for Fillo+?** If not, the "early access" benefit comes off the page. |
| 15 | **Are the eight home-page testimonials real people?** If yes, get areas, dates and permission. If not, they come down. |
| 16 | **COD surcharge and cap.** I have drafted +₹30, first order only. |
| 17 | **How long does the van wait at a stop?** I have drafted 10 minutes. |
| 18 | **How many waitlist requests in one area triggers a new route?** The public counter ("You're #23 in Whitefield. [n] requests and we add the route") is a genuinely good mechanic, but only with a real threshold. |
| 19 | **Is there a ratatouille karepan?** The About page names it; the live menu does not have it. Either it is a rotating special, or the copy is stale. |
| 20 | **Which of the three Fruit Sandos is which in the two photographs?** My mapping is a visual inference. |
| 21 | **Cookie n Cream An Pan names "Oreo" in the description.** Confirm the trademark usage is cleared before it appears in a heading or a title tag. |

### Worth deciding, not blocking

| # | Question |
|---|---|
| 22 | **Is there a person on the route who can be named?** A named human on the van is one of the cheapest trust assets available and the copy has a slot for it. |
| 23 | **Weekly Specials: fill it or remove it.** An empty named tab is worse than no tab. If there is a weekly special, it needs a fixed day and a publishing owner. |
| 24 | **A domain email address** instead of two different Gmail accounts. |
| 25 | **Fillo+ tiers: I recommend against them for now.** The scheme is now one sentence — free, 2 coins per ₹100, 25 coins is ₹25 off, never expires. Revisit after six months of order data. |
| 26 | **Do gift cards expire?** If they do, it has to be said on the page, in the same sentence as the price — not in the terms. |
| 27 | **The list of ₹1 Fillo+ payers**, to grandfather as Founding members during the phone migration. Without it the fee removal reads as a devaluation to exactly the people who backed you first. |
| 28 | **Is there a real cart inventory hold?** The hold timer copy is written and it is honest only if stock is genuinely reserved. If it is not, that timer must not render. |

---

## 6. What to do first

In order, by impact over effort.

1. **Title tags, meta descriptions and canonicals on every page.** Costs nothing, and the site currently has none.
2. **Put the delivery fee inside the total on Fillo's own checkout.** This is the broken promise.
3. **Ask for the area before anything else.** Header chip, home module, product page.
4. **Fix the numbers.** "100+ Items" → 23. "500+ Lovers" → cut or count. "thousands of loyal customers" → cut.
5. **Remove the dummy phone number.** It has been publicly live.
6. **301 the 12 dead product URLs** and make the 404 return an actual 404.
7. **Rewrite the shipping policy.** It currently describes a business Fillo is not.
7b. **Remove every ₹1 reference to Fillo+**, and put the free join one tap from the order confirmation.
8. **Delete the 23 blog stubs.** Publish the two written articles in their place.
9. **Promote the van to a page.**
10. **Photograph Tex Mex Zest, Tiramisu An Pan, the base Fruit Sando, and the van.**
