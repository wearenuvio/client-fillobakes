# Fillo Bakes — Recommended Journey, Page Map and Screen Inventory

The decisive build spec for the new fillobakes.com. One flow, not options.
Evidence for every pattern is in `competitor-report.md` alongside the URL it was observed on.

**Read this as a mocking brief.** Every route, every screen, every state that needs a design is enumerated.
If a state is not listed here, it should not exist.

---

## 0. The five decisions everything else follows from

1. **The lane is chosen before the cart, not at checkout.**
   *Catch the van (free, at a stop)* and *Home delivery (₹49, 2-hour window)* are the site's primary
   navigation, because the lane changes which days, which stops and which items are available. Deciding it at
   checkout means the cart can be unfulfillable.
   *Pattern: Bombay Sweet Shop's `Shop Mumbai` / `Shop All-India` tiles; Levain's `Same Day Pickup or Delivery`
   nav item; Theobroma's store-locator-before-menu; Lily Pond's city modal.*

2. **The area gates the answer, never the catalogue.**
   Browse freely. But every surface whose answer depends on where you are — the lane cards, the drop card, the
   PDP route line, the cart, the checkout — either shows the real answer or asks for the area. A header chip
   holds the state: **place + mode + next slot**.

3. **One total, one domain, one contact ask.**
   The total shown in the cart drawer is the total charged. Delivery is inside it from the first time it
   appears. No hop to `myshopify.com`.

4. **The phone is the identity.** OTP confirms it. Email is optional and labelled "for your invoice".
   Fillo+ becomes **free** and phone-based; the ₹1 join fee is removed.

5. **The van's schedule is the content; the live map is the garnish.**
   `/van` must be a page worth bookmarking on the five days a week the van isn't running.

---

## 1. Page map

```
PUBLIC
/                                   Home
/shop                               This week's bake (drop-aware)
/shop/[category]                    breads · an-pan · kare-pan · pies-strudels · fruit-sandos · boxes
/shop/all                           All 23, the full catalogue
/product/[slug]                     PDP
/boxes                              Curated boxes + build-your-own
/van                                The van — live / off-air, route, notify me
/van/[route]                        /van/indiranagar, /van/koramangala …  (route page, SEO + share target)
/areas/[area]                       /areas/banaswadi …  (serviceability landing page, pSEO)
/standing-order                     Subscription: pitch + builder entry
/fillo-plus                         Membership: what it is, how coins work
/gift-cards                         Gift cards
/gifting                            Send bread as a gift

/cart                               Full-page cart (drawer is the primary; this is the fallback/deep-link)
/checkout                           One page, one domain
/order/[id]                         Order confirmation + live status (public via signed link, no login)

/about                              Story + founders + the van
/shokupan                           Keep. Extend into a small guide cluster:
/guides/[slug]                        /guides/what-is-shokupan, /guides/an-pan, /guides/how-to-store-shokupan
/journal  /journal/[slug]           Real editorial (replaces /blogpage stubs)
/faq
/contact
/franchise
/policies/shipping | refund | terms | privacy | payment

ACCOUNT (phone + OTP, no password)
/account                            Dashboard
/account/orders
/account/orders/[id]
/account/subscription               The Standing Order — manage
/account/subscription/setup         Builder (also reachable from /standing-order)
/account/addresses
/account/rewards                    Fillo Coins + Fillo+ status
/account/alerts                     WhatsApp / push preferences, per-stop notifications
/account/gift-cards
/account/settings                   Phone, email, name, delete account

AUTH
/login                              Phone → OTP. No password anywhere.
/logout

SYSTEM
/404  /500  /offline (PWA shell)
```

**Routes to retire:** `/blogpage` (and the 12 stale `/product/*` sitemap entries returning HTTP 200),
`/fillo-plus/dashboard` (absorbed into `/account/rewards`), `/cart` as the primary cart surface.

---

## 2. Global components and their states

These appear on many pages. Mock each state once.

### 2.1 Announcement bar
Single line, computed, never a stack of coupon codes.

| State | Copy |
|---|---|
| Orders open | `Order by Thursday 8pm for Saturday's Indiranagar run` |
| Cutoff soon (< 12h) | `Orders close in 6 hours for Saturday's run` |
| Between drops | `Next bake: Saturday. Orders open Sunday 9am.` |
| Area not yet set | `Order by Thursday 8pm for Saturday's bake` (generic, no area) |
| Out-of-area visitor | `We're not on your street yet — tell us where you are` → `/areas` |

### 2.2 Header
`[wordmark] [Shop] [The Van] [Standing Order] ——— [search] [area chip] [account] [cart(n)]`
Mobile: wordmark · area chip · cart, with a bottom sheet menu.

**Area chip — the most important component on the site. Five states:**

| State | Chip |
|---|---|
| Unset | `📍 Set your area` (amber outline) |
| Van lane set | `📍 Indiranagar · Sat 4–6pm · catch the van` |
| Delivery lane set | `📍 Banaswadi · Sat 4–6pm · ₹49` |
| Set, but the van doesn't run there this week | `📍 Banaswadi · no run this week` (muted) |
| Out of area | `📍 Whitefield · not yet` (amber) |

Tapping opens the **Area & lane sheet** (§2.3).

### 2.3 Area & lane bottom sheet
One sheet, reached from the chip, the homepage lane cards, the PDP route line, and checkout.

States to mock:
1. **Choose a lane** — two cards with true prices: `Catch the van · free` / `Home delivery · ₹49`.
2. **Van lane → pick a stop** — a short list of named stops with a local descriptor and the next date/time
   (`Indiranagar, 12th Main · opposite the Nandini booth · Sat 4–6pm`), plus an open-in-maps icon.
3. **Delivery lane → area autocomplete** — area *name* first, not a raw pincode field. `Use my location` above it.
4. **Success (van)** — `You're on Saturday's Indiranagar list. Orders close Thursday 8pm.`
5. **Success (delivery)** — `We deliver to Banaswadi. Saturday 4–6pm. ₹49, free over ₹399.`
6. **No run this week** — `The van isn't doing Banaswadi this week. Next: Saturday 13th.` + `Notify me`
7. **Out of area** — `The van hasn't reached Whitefield yet. Tell us you're there and we'll come sooner.`
   → one phone field → `You're #23 in Whitefield. At 40 requests we add the route.`
8. **Loading / error** — a skeleton and a retry.

### 2.4 Product card
Image (4:5, crumb-forward) · category label · name · one-line sensory note · price · `Add` pill that morphs to
a `− 1 +` stepper in place.

**Badges (top-left of image, max two):** `Van routes only` · `New` · `This week only` · `Only 6 left` ·
`Bestseller`.
**States:** default · in-cart (stepper) · **sold out** (image and text muted to ~40%, a loud red `Sold Out`
ribbon retained at full contrast, `Add` replaced by `Notify me`) · `Not on this route` (muted, with
`Available Sunday, Koramangala`) · loading skeleton.

### 2.5 Cart drawer
Line items with steppers · **`Delivery ₹49 · Add ₹120 for free delivery`** with a thin progress bar, or
`Delivery free — you're catching the van` · Coins-redeem row if eligible · **Total** · the lane/date/slot
restated · `Checkout` button.
**States:** empty · with items · free-delivery threshold met · **hold timer running** (`Held for 6:42` during a
live drop) · an item that went out of stock while in the cart (`We sold the last one. Remove, or swap for…`).

### 2.6 Van strip
The reusable tracker widget. Three states — see §6.3.

### 2.7 Floating element
**Exactly one: WhatsApp, bottom-right.** Every entry point pre-fills the message with page context
(`Hi Fillo — is the Blue Pea Bread on Saturday's van? (from the website)`).
On a PDP it shifts up 72px so it never covers the sticky `Add · ₹200` bar.

### 2.8 Footer
FSSAI number · Wise Eats SuperFood OPC Pvt Ltd · policies · contact · socials · `Lite mode` toggle ·
one Kannada thank-you line.

---

## 3. Public pages — section by section

### 3.1 `/` Home

| # | Section | Notes / states |
|---|---|---|
| 0 | Announcement bar | §2.1, five states |
| 1 | Header | §2.2, five chip states |
| 2 | **Hero** | One photograph — torn crumb, at scale. One line: `Japanese milk bread. Baked Saturday morning. At your door in a two-hour window.` One button: `See this week's bake`. **No carousel.** |
| 3 | **Trust strip** | `100% eggless` (with the legal green veg mark) · `No preservatives` · `Baked daily` · `FSSAI 12345678901234` |
| 4 | **Two ways to get bread** | Two cards with real prices. `Catch the van — free, at a stop near you` / `Home delivery — ₹49, in a two-hour window, free over ₹399`. Tapping either opens §2.3. **States:** area unset (both cards are CTAs) · area set (the chosen card is confirmed with the stop/slot, the other is a switch link) |
| 5 | **This week's bake** — the drop card | Title (`The Saturday Bake`) · date + stop chips · hero photo · **`We bake 40. 12 left.`** · progress bar · `28 reserved · 40 is the oven, not a tactic` · `Reserve yours` · `Orders close Thursday 8pm. No restocks, it is a van.` **States:** orders open · closing soon (a countdown appears — it renders a published fact) · **sold out** (see §3.1a) · between drops (`Orders open Sunday 9am`) |
| 6 | **The menu** | 6–8 items, two-up, sold-out included and greyed. `See all 23 →` |
| 7 | **Order again** | Returning visitors only; injected *above* §6. Last 3 items, one-tap `Add` each, no variant modal. |
| 8 | **The van** | §2.7 strip + a still of the route map + `Track the van →`. **Must render the off-air state as well as the live one.** |
| 9 | **Why it costs what it costs** | Ferment hours, the method, the founders by name and face, the neighbourhood-bread-vendor story. Placed after desire, before the objection hardens. |
| 10 | **Proof** | Star average + review count + 3 real named reviews with areas and photos. `Read all reviews →` |
| 11 | **The Standing Order** | Three lines and a button. `Skip any week. Pause anytime.` |
| 12 | **Fillo+** | Free membership, coins, early access. Low on the page deliberately. |
| 13 | Footer | |

**Deliberately absent:** hero carousel, popup email capture, stacked coupon codes, a second floating widget,
"100+ Items", "500+ Lovers".

**3.1a Sold-out homepage state.** When the drop is gone, §5 becomes the emotional centre of the page:
> **Gone for this week.**
> Forty loaves, gone by 9:15. Thank you, Indiranagar.
> `[ Tell me when the van's back out ]`
> One message, Sunday morning. Nothing else.

§6 stays visible, fully greyed, so the buyer sees what they missed.

---

### 3.2 `/shop` — This week's bake

1. Header + area chip.
2. **Drop header**: `The Saturday Bake · Indiranagar · 4–6pm` · `Orders close Thursday 8pm` · live cap counter.
3. **Lane/route switcher**: `Saturday · Indiranagar` | `Sunday · Koramangala` | `Home delivery` — switching
   re-filters the menu, because availability genuinely differs.
4. **Three doors** (first-time visitors only, as the *top module*, not a blocking screen):
   `The Loaf ₹200` / `The Sweet One ₹159` / `The Box ₹499` → `Or browse all 23 bakes`.
5. **Category tabs**: All · Breads · An Pan · Kare Pan · Pies & Strudels · Fruit Sandos · Boxes · Gift Cards.
   **Never render a tab that resolves to zero items** — the current "Weekly Specials" empty tab must not recur.
6. Product grid, two-up.
7. Sticky bottom bar when the cart is non-empty: `2 items · Continue · ₹359`.

**States:** loaded · loading skeleton · area unset (grid renders, but a persistent inline banner reads
`Set your area to see what's on your route`) · route selected with items unavailable on it (greyed, with the
route they *are* on) · whole drop sold out · between drops (`Orders open Sunday 9am` + last week's menu greyed
+ notify-me) · filter returns nothing.

`/shop/all` is the same page with the drop header replaced by `All 23 bakes` and an availability badge on
every card.

---

### 3.3 `/product/[slug]` — PDP

Order matters here; this is where the sale is lost.

1. Gallery — **cross-section / torn crumb as the default thumbnail**, whole loaf second.
2. Name · price · one-line sensory note (`Tear it, don't slice it. It gives up in soft sheets.`)
3. **Spec chips** — checkable facts, not adjectives: `82% hydration` · `18h ferment` · `Baked 5:40am`
4. Eggless line, stated as the *reason*, not the headline: `Eggless. Nobody in 300 tastings could tell.`
5. **Route line** — the availability answer, inline:
   `📍 Saturday · Indiranagar · 4–6pm ▾` (opens §2.3), or `Check where we can bring this` when unset
6. **Cutoff line, in red, directly above the button** — `Order by Thursday 8pm for Saturday's run`
7. Quantity stepper + **`Add · ₹200`** (sticky on mobile)
8. `Only 6 on Saturday's van` — only when the true remaining count is ≤ 10
9. **Allergens block, fixed position on every PDP, three explicit states**: *Contains · Does not contain ·
   Made in a kitchen that also handles*. Never "may contain" next to a free-from claim.
10. How to eat / how to store (`Thick-cut, 2cm. Not sandwich-thin.`)
11. **PDP FAQ** answering the two real objections: *"Eggless — does it actually taste like it?"* and
    *"How do I get it if the van moves?"*
12. **Reviews for this SKU** — count, average, photos, and the critical ones left visible.
13. `Goes well with` cross-sell.

**States:** available · **sold out for this drop** (button → `Notify me`, card art muted, `Sold out in 41
minutes — 40 baked, 40 gone`) · not on the selected route (`On Sunday's Koramangala run` + a switch link) ·
area unset · out of area · loading skeleton · **404 (`Product not found`)** — must be a designed page with a
menu rail beneath it, not a bare string.

---

### 3.4 `/van` — the tracker
Full spec in §6. Twelve modules, two master states (LIVE / OFF-AIR), four stop states.

### 3.5 `/van/[route]`
A shareable, indexable page per route. Route name, its stops in order with typical times, a static map, who
it serves, this week's menu for that route, `Notify me for this route`, and the live strip when active.
This is the QR target on the van's glass case and on the bag.

### 3.6 `/areas/[area]`
Serviceability landing pages, the only realistic local-SEO lane.
`Japanese milk bread in Banaswadi` → the van's schedule for that area · the stop or delivery window ·
the fee and threshold · this week's menu · reviews from that area · `Order for Banaswadi`.
**States:** served · not yet served (the waitlist with a live position count) · served but no run this week.

### 3.7 `/standing-order`
1. Hero: `Bread, standing. Every Saturday.`
2. **How it works, four steps**: pick your loaf → we put you on your route's list → we message you Wednesday →
   the van brings it Saturday.
3. **The reassurance block, above the fold on mobile**:
   `Skip any week. Pause anytime. Cancel in one tap. We'll message you every Wednesday with what's coming.`
4. Price: per-delivery price, the standing-order price, and the saving as an absolute rupee figure.
5. What's included / what you can change.
6. FAQ — the Blue Tokai model: skip, pause, cancel, change day, change loaf, change address, what happens if we
   can't bake your loaf, what happens if payment fails.
7. `Set up a standing order` → `/account/subscription/setup`
**States:** logged out (CTA starts the phone/OTP flow inside the builder) · logged in without a subscription ·
logged in with one (page becomes `Manage your standing order`).

### 3.8 `/fillo-plus`
1. `Fillo+ is free.` — the single most important line, given the ₹1 fee is being removed.
2. How coins work: 2 per ₹100, 25 coins = ₹25 off, no expiry.
3. What else membership gets: order history, saved stops, early access to new bakes, alerts.
4. `Join with your phone number` — one field.
**States:** not a member · member (becomes a link to `/account/rewards`) · migrated legacy member
(`You joined Fillo+ with your email. Add your phone to keep your coins.`).

### 3.9 `/gifting`, `/gift-cards`, `/boxes`
- **Gifting**: `Send as a gift` toggle → recipient name + phone (delivery contact becomes the recipient) ·
  a 140-character note with a card-shaped preview · **`Hide prices from recipient` default ON** ·
  the existing route/slot picker relabelled `Choose the Saturday`.
- **Gift cards**: a menu-level SKU. It is the thing that still converts on a sold-out day.
  Amount · quantity · recipient · delivery date · message. States: purchase · redeem · check balance.
- **Boxes**: curated boxes + build-your-own with a slot-filling UI and a live total.

### 3.10 Content pages
`/about` (founders by name and face, the van's origin, the 300 first tastings, the neighbourhood-vendor idea),
`/shokupan` (keep — it is the only page currently carrying real meta), `/guides/[slug]`, `/journal`, `/faq`,
`/contact` (WhatsApp primary, phone, email on the fillobakes.com domain, hours), `/franchise`
(**remove the dummy +91 98765 43210**), `/policies/*` — **and the shipping policy must be rewritten to describe
the van, not couriers.**

---

## 4. The purchase flow

### 4.1 `/cart` (full page — the drawer in §2.5 is primary)
Line items, the delivery line, the free-delivery progress, coins redemption, the lane/date/slot summary, total,
`Checkout`. Plus a `You might also like` rail and, if the drop is closing, the countdown.
**States:** empty (with a menu rail, never a dead end) · items · cart contains an item that just sold out ·
cart contains an item not on the selected route · hold timer running.

### 4.2 `/checkout` — one page, one domain, four blocks

```
┌ 1  HOW YOU'RE GETTING IT ───────────────────────────────────┐
│  ( • ) Catch the van        free                            │
│        Indiranagar, 12th Main · opposite the Nandini booth  │
│  (   ) Home delivery        ₹49   free over ₹399            │
│                                                             │
│  [ Sat 6 Sep ]  [ Sun 7 Sep ]  [ Sat 13 Sep ]               │
│   Today · closed 8pm  (greyed, with the rule stated)        │
│  [ 12–2 ] [ 4–6 ✓ ] [ 6–8 · full ]   (full = greyed, shown) │
└─────────────────────────────────────────────────────────────┘
┌ 2  WHO YOU ARE ─────────────────────────────────────────────┐
│  Phone number   +91 [__________]                            │
│  We need this to send you updates about your order.         │
│  → OTP (4 boxes, auto-advance, resend after 30s)            │
│  Email (for your invoice) — optional                        │
└─────────────────────────────────────────────────────────────┘
┌ 3  WHERE  (home-delivery lane only — van lane skips this) ──┐
│  Use my location                                            │
│  Flat / house no.                                           │
│  Apartment or building name        (autocomplete)           │
│  Street / area                                              │
│  Landmark (helps our driver find you)                       │
│  Pincode  (auto-fills area — never asked first)             │
│  Bengaluru  (prefilled, locked)                             │
└─────────────────────────────────────────────────────────────┘
┌ 4  PAY ─────────────────────────────────────────────────────┐
│  Subtotal                                   ₹400            │
│  Delivery                                    ₹49            │
│  Fillo Coins (25)                           −₹25            │
│  Tax                                         ₹20            │
│  ─────────────────────────────────────────────────          │
│  Total, including delivery                  ₹444            │
│                                                             │
│  [  Pay ₹444 with UPI  ]      GPay · PhonePe · Paytm        │
│  ▸ Cards, Net Banking, Wallets                              │
│  ▸ Cash at the door  +₹30, first order only                 │
│                                                             │
│  ☐ Join Fillo+ — free. Earn coins on this order.            │
└─────────────────────────────────────────────────────────────┘
```

**Non-negotiables:** the total equals the cart drawer's total; the fee is visible before the address block;
guest checkout is the default path (there is no "continue as guest" link because there is no account wall);
the cutoff rule is stated beside any greyed date; full slots are shown-and-disabled, not hidden.

**States to mock:** default · van lane (block 3 absent) · OTP entry · OTP failed · returning customer
(phone recognised, addresses offered as cards) · coins available / none / insufficient · COD blocked above
₹500 (`Prepaid only for larger orders — keeps the van light`) · payment failed · payment pending ·
**cutoff passed while on the page** (`Saturday's run just closed. Move to Sunday?`) · **an item sold out while
on the page** · hold timer expired.

### 4.3 `/order/[id]` — confirmation and live status
Reachable without login via a signed link (so it works from a WhatsApp forward).

1. **The promise, not a warning**:
   `Saturday, 4 to 6pm, at your gate. We'll message you Friday night with the exact time.`
2. Order number · items · total paid.
3. **Van strip** (§6.3) — live when relevant.
4. **Order timeline** — `Confirmed` → `Baking` (with the bake strip on the day) → `Loaded on the van` →
   `Out on the route` → `Delivered / Collected`. Real timestamps.
5. `Add to calendar` · `Track the van` · `Get WhatsApp updates` (opt-in, frequency stated) ·
   **`Join Fillo+ — free`** (one tap, phone already verified).
6. `Change or cancel` — and it must actually be possible before the cutoff. The current site's
   *"No changes can be made after payment"* is the wrong promise; the right one is
   `You can change or cancel free until Thursday 8pm.`

**States:** confirmed · baking · out for delivery · delivered (with `Rate this` and `Order again`) ·
collected · **missed at the stop** (`We waited at Indiranagar till 6:10. Message us and we'll sort it.`) ·
cancelled · refunded · payment pending.

---

## 5. Account and dashboards

Phone + OTP. No password anywhere. Every screen below needs a mock.

### 5.1 `/login`
One field (`+91 ▾ [__________]`), then a 4-box OTP with auto-advance and a 30s resend timer.
**States:** enter phone · enter OTP · wrong OTP · resend cooldown · rate-limited · new number
(name is asked *after* the first order, never before).

### 5.2 `/account` — dashboard
The order of these blocks is the order of what people come here to do.

```
Hey Neha.                                    📍 Indiranagar · Sat 4–6pm

┌ NEXT UP ──────────────────────────────────────────────────┐
│  Saturday 6 Sep · 4–6pm · Indiranagar, 12th Main          │
│  1 Milk Shokupan, 2 Custard An Pan          ₹518          │
│  ● The van is 2 stops away · around 4:40–4:50             │
│  [ Track the van ]  [ Change or cancel ]                  │
└───────────────────────────────────────────────────────────┘

┌ YOUR STANDING ORDER ──────────────────────────────────────┐
│  1 Milk Shokupan · every Saturday · Indiranagar 4–6pm     │
│  Next: Sat 13 Sep. Closes Thursday 8pm.                   │
│  [ Skip this week ]  [ Manage ]                           │
└───────────────────────────────────────────────────────────┘

┌ FILLO COINS ──────────────────────────────────────────────┐
│  18 coins · 7 more for ₹25 off      [ ████████░░ ]        │
└───────────────────────────────────────────────────────────┘

┌ ORDER AGAIN ──────────────────────────────────────────────┐
│  [Milk Shokupan +]  [Custard An Pan +]  [Kyoto Curry +]   │
└───────────────────────────────────────────────────────────┘

Orders · Standing order · Addresses · Rewards · Alerts · Gift cards · Settings
```

**States:** new member (no orders — the "Next up" block becomes `Nothing on the van for you yet` + this week's
drop) · has an upcoming order · order in transit · no standing order (the block becomes the pitch) ·
standing order paused · standing order payment failed (an alert banner at the very top).

### 5.3 `/account/orders` and `/account/orders/[id]`
List: date · items thumbnail row · stop or address · total · status pill · `Reorder` · `Invoice`.
Filters: All · Upcoming · Delivered · Cancelled.
Detail: everything in §4.3 plus the invoice, the payment method, and `Report a problem` → WhatsApp pre-filled
with the order number.
**States:** empty (`No orders yet` + this week's drop) · list · detail in each of the seven order states.

### 5.4 `/account/subscription` — The Standing Order

```
┌ YOUR STANDING ORDER ─────────────────────────── [Active] ─┐
│  1 Milk Shokupan                                ₹180/wk   │
│  (standing-order price, ₹20 off ₹200)                     │
│                                                           │
│  Every Saturday · Indiranagar, 12th Main · 4–6pm          │
│  Next delivery   Sat 13 Sep                               │
│  Closes          Thursday 8pm                             │
│  Paid with       UPI · autopay mandate ····4821           │
├───────────────────────────────────────────────────────────┤
│  [ Skip this week ]            [ Change what's in it ]    │
│  [ Going away? Pause ]         [ Move to another day ]    │
│  [ Change frequency ]          [ Change stop or address ] │
├───────────────────────────────────────────────────────────┤
│  UPCOMING                                                 │
│  Sat 13 Sep  1 Milk Shokupan   ₹180   [skip] [change]     │
│  Sat 20 Sep  1 Milk Shokupan   ₹180   [skip] [change]     │
│  Sat 27 Sep  SKIPPED                  [un-skip]           │
├───────────────────────────────────────────────────────────┤
│  HISTORY  ·  6 deliveries · 1 skipped · since 12 Jul      │
├───────────────────────────────────────────────────────────┤
│  Cancel my standing order                                 │
└───────────────────────────────────────────────────────────┘
```

**Screens and states to mock:**
| Screen | Detail |
|---|---|
| Active | as above |
| **Skip confirm** | `Skipping Saturday 13 Sep. You won't be charged. Back the week after.` — one tap, no interstitial upsell |
| **Pause sheet** | `Going away?` → pick a return date → `Paused till 4 Oct. We'll message you the day before.` |
| Paused | The card is muted, with `Resume now` prominent and the return date stated |
| **Change contents** | The menu, with the current selection pre-ticked; applies from the next uncut delivery, stated |
| **Change day / route** | Only shows days the van serves the saved area; `Applies from Sat 20 Sep` |
| **Change frequency** | Weekly ↔ fortnightly |
| **Change stop / address** | Permanent, plus a per-delivery override option |
| **Cancel** | Offers pause **once**, then cancels. No phone call, no retention maze. Confirmation: `Cancelled. Your last delivery was Sat 6 Sep. Come back whenever.` |
| **Out of stock** | `We couldn't bake the Blue Pea this week. Swap for Milk Shokupan, or skip — you won't be charged either way.` |
| **Payment failed** | Banner + `Retry payment` link; auto-skips that week if unresolved by cutoff; never silently cancels |
| **Route changed** | `We've moved the Indiranagar stop to 5–7pm from Saturday 20th.` Sent before the cutoff. |
| **Setup builder** (`/subscription/setup`) | 4 steps on one screen: What → Where & when (route-day derived from the saved area) → How often → Confirm. The reassurance line sits **above** the confirm button: `Skip any week. Pause anytime. Cancel in one tap.` |

**The weekly loop (messages, not screens, but they need mocking too):**
```
Wed 8pm   WhatsApp  "Saturday's box: 1 Milk Shokupan, ₹180, Indiranagar 4–6pm."
                    [ Skip this week ]  [ Change ]
Thu 8pm   Cutoff. Locks. Charge attempted.
Fri 8pm   WhatsApp  "You're on tomorrow's list. Indiranagar, 4 to 6."
Sat       Bake strip live → van live → delivered → one-tap rating + reorder.
```
Four templates total. Nothing else without a separate opt-in.

### 5.5 `/account/rewards` — Fillo+ and Coins
Coin balance with a progress bar to the next ₹25 · `Redeem at checkout` explainer · earning history
(order, date, coins) · redemption history · membership status and join date · benefits list.
**States:** not a member (`Join Fillo+ — free` one-tap) · member below 25 coins · member at/above 25 ·
legacy email-only member being migrated to phone.

### 5.6 `/account/addresses`
Cards with a default flag; add / edit / delete; India-shaped fields; landmark encouraged; a serviceability
badge per address (`Van comes here Saturdays` / `Home delivery ₹49` / `Not served yet`).
**States:** empty · list · add · edit · delete confirm · unserviceable address saved.

### 5.7 `/account/alerts`
The preference centre — this is what stops people muting the brand.
- Channel: WhatsApp (default) / browser push (hidden on iOS Safari tabs) / email
- **Order updates** — always on, transactional
- **Van alerts** — per stop, per trigger (`leaves the kitchen` / `2 stops away` / `arrives`)
- **The Sunday message** — `What we're baking this week` — one a week, opt-in
- **Pause all alerts for 2 weeks**
- A stated cap: `At most one van alert a day. Three messages a week, total.`
**States:** all on · partial · all paused · unsubscribed.

### 5.8 `/account/settings`
Phone (re-verify to change) · name · email · language of receipts · **delete my account** with a plain
explanation of what happens to orders and coins.

---

## 6. The van tracker

### 6.1 Principles
- **The list owns the truth; the map owns the feeling.** Every number must be readable with the map layer
  completely failed.
- **Off-air is the default state.** Design it first.
- **Stops, not metres. Bands, not minutes.**
- **No login, no app, no location permission** — ever, to see the van.
- Server-render everything above the map; lazy-load the map after first paint.

### 6.2 `/van` — twelve modules, two master states

| # | Module | LIVE | OFF-AIR |
|---|---|---|---|
| 1 | Status pill | `● LIVE · UPDATED 9S AGO` | `OFF AIR · BACK SATURDAY` |
| 2 | Hero line (largest type on the page) | `2 stops away.` / `Here now — Indiranagar 12th Main` | `The ovens are cold. The plan isn't.` |
| 3 | Arrival band | `Around 4:40 to 4:50` — widens itself in traffic, caps at `Around 20+ min` | `Rolls out Saturday, 4:30pm` |
| 4 | Map (lazy) | Route drawn: done dashed at 30%, remaining solid. Stop pins in 4 states. Van marker with a face, always upright, tweened across the full 15s interval, with a separate rotating direction chevron. `Find the van` re-centre button. | Same map, van parked at the kitchen, greyed, no animation |
| 5 | Bake strip | `✓ MIXED 4:10 · ✓ PROOFED 8:30 · ✓ BAKED 5:40 · LOADING now` | Hidden |
| 6 | **Today's / this week's route** | Vertical stop list, 4 states (below), landmark names + local descriptors, open-in-maps icon, per-stop `Notify me` | Same list, dated by day |
| 7 | What's on board | Live items with sold-out states | This week's menu + `Orders close Thursday 8pm` |
| 8 | Notify me | §6.4 | Same, promoted to the top |
| 9 | Activity feed | Last 5 auto-generated timestamped events, newest first. **Never hand-typed.** | Last run's feed |
| 10 | Stamp card slot | Build the layout; ship empty or flagged off. Six slots. **No leaderboard, ever.** | Same |
| 11 | `Ask us where we are` | WhatsApp, pre-filled. The reply must never know more than the page. | Same |
| 12 | Footer | `Lite mode` · `Manage alerts` · a plain line on what is published and what is not | Same |

**Stop states (pin + list row):**
| State | Row |
|---|---|
| Done | Grey, tick, actual time — `✓ HSR Layout · 3:30` |
| Current | Filled brand colour, pulse ring — `● Koramangala · Here now, till ~5:45` |
| Upcoming | Outline pin, band — `Indiranagar · around 6:10–6:20` |
| **Sold out** | Struck through, muted — `Banaswadi · Sold out 5:52` — shown as honesty, never hidden |

**Edge states to mock:** stale fix (>90s: marker to 60% opacity, band replaced by `Last seen 2 min ago`) ·
**off-route** (`Between stops` — position suppressed) · **driver `Go dark`** (`Van's off the map for a bit —
back shortly`) · map failed to load (Lite mode renders automatically) · no route today · route cancelled
(`No run today — the van's in the garage. Saturday as normal.`).

### 6.3 The van strip (reusable widget)
Used on the homepage, `/order/[id]`, `/account`, and as the WhatsApp link preview.

| State | Renders |
|---|---|
| Live, near you | `● The van is 2 stops from Indiranagar · around 4:40–4:50` → `Track it →` |
| Live, elsewhere | `● The van is out — Koramangala today` → `See today's route →` |
| Off air | `Next run: Saturday, Indiranagar, from 4:30pm` → `See the week's route →` · `Tell me when it's out` |

A link, never a modal. Never the floating element — that slot is WhatsApp's.

### 6.4 Notify-me sheet
Never fires an OS prompt on tap. Appears on second visit or ~20s dwell, not first paint.
```
Tell me when the van is near.
Pick a stop        [ Indiranagar, 12th Main ▾ ]
Tell me when       ( ) it leaves the kitchen
                   (•) it's 2 stops away
                   ( ) it arrives
[ Get the nudge on WhatsApp ]
[ Or get a browser alert ]        ← hidden on iOS Safari tabs
[ Not now ]
No app, no location permission. We watch the van, not you.
At most one message a day.
```
**States:** default · submitting · success (`Done. We'll ping you Saturday.`) · already subscribed
(`You're set for Indiranagar. Change it →`) · error.

### 6.5 Privacy and data contract (hard requirements)
- Public endpoint returns **snapped-to-route position + stop index only**, rounded to ~50m.
- Served **only between `route_start` and `route_end`**.
- **No historical trail is ever exposed.** Current position only.
- Off-route deviation → suppress position, show `Between stops`.
- Driver-controlled **`Go dark`** kill switch in the cab.
- Notify-me geofences run **server-side against the van**. The user's device never needs location permission.
- Refresh cadence 15s, **interpolated across the full interval** — a raw hop looks fake and destroys the
  credibility the page exists to earn.

---

## 7. Subscription and loyalty — how the two products relate

The current site puts a ₹1 charge, a coins scheme and a would-be subscription under one label. Split them:

```
FILLO+  ·  free  ·  phone-based  ·  the account layer
├── Your orders, addresses, saved stop
├── Fillo Coins        2 per ₹100 · 25 coins = ₹25 off · no expiry
├── Alerts             van alerts, the Sunday message
├── Early access       new bakes before the menu
└── THE STANDING ORDER — the weekly bread subscription (a product, sold at order #2)
```

**Why free.** Nobody in the benchmark set charges to join: Country Delight (`Free Membership · On your
signup`), GAIL's (nine stamps on a free app), Levain (Cookie Club), Wildgrain (free croissants for life).
Fillo's ₹1 currently forces a complete Shopify checkout to acquire a free-to-operate retention mechanic. It is
filtering out most of the people it exists to capture. **Remove it.**

**Why the subscription is a separate product.** It has its own price, its own cadence, its own management
surface, its own failure modes (out of stock, payment failure, route change) and its own lifecycle. Calling it
"Fillo+" would make "cancel Fillo+" ambiguous between *stop my bread* and *leave the programme* — a genuine
support problem.

**Naming.** `The Standing Order` — a real bakery phrase, it says exactly what it is, and it survives being said
out loud at a van window. Fallbacks if the client dislikes it: `The Weekly Loaf`, `Standing Bread`.
Do not call it a "box" — it isn't shipped, and the word imports Wildgrain's frozen-crate expectations.

**Sell it at order #2, never order #1.** The first order is about proving the bread. The confirmation of the
second is the moment the habit exists and the pitch is a statement of fact:
> *You've ordered a Milk Shokupan twice. Want it on the van every Saturday? Skip any week.*

**Migration.** Existing email-only Fillo+ members: one message asking them to add a phone number, coins
preserved, `/fillo-plus/dashboard` redirecting to `/account/rewards`. Do not strand the ₹1 payers — grandfather
them with a small permanent perk (a named `Founding member` badge, and first access to every new bake) so the
change reads as a gift rather than a devaluation.

---

## 8. Complete mock inventory

Everything that needs a design. 68 screens plus states.

**Global (7):** announcement bar ×5 states · header + area chip ×5 · area & lane sheet ×8 · product card ×5 ·
cart drawer ×5 · van strip ×3 · WhatsApp FAB.

**Public (24):** Home (default, sold-out, returning-visitor, area-unset) · Shop (loaded, area-unset,
between-drops, sold-out, empty-filter) · Shop/all · PDP (available, sold-out, wrong-route, area-unset, 404) ·
Boxes · Van (LIVE, OFF-AIR, stale, off-route, go-dark, lite mode, no-run) · Van route page · Area page
(served, waitlist, no-run-this-week) · Standing Order marketing · Fillo+ marketing · Gifting · Gift cards ·
About · Shokupan/guide · Journal index · Journal post · FAQ · Contact · Franchise · Policy page · 404 · 500 ·
offline shell.

**Purchase (14):** Cart page (empty, items, sold-out-item, hold-timer) · Checkout (default, van-lane,
OTP-entry, OTP-failed, returning, COD-blocked, payment-failed, cutoff-passed-live, item-sold-out-live) ·
Order confirmation ×7 order states.

**Account (23):** Login (phone, OTP, error, rate-limited) · Dashboard (new, upcoming, in-transit, no-sub,
paused, payment-failed) · Orders list (empty, list) · Order detail · Subscription (active, paused, skip-confirm,
pause-sheet, change-contents, change-day, change-frequency, change-address, cancel-flow, out-of-stock,
payment-failed) · Setup builder ×4 steps · Rewards (non-member, member, redeemable, legacy-migration) ·
Addresses (empty, list, add/edit, unserviceable) · Alerts · Settings.

**Messages (6 WhatsApp templates):** order confirmed · Wednesday standing-order preview with `Skip` ·
Friday night time band · van is 2 stops away · delivered + rate · Sunday `what we're baking`.

---

## 9. What must be true on day one

If only seven things ship, these are they.

1. **The total never changes between the cart and the charge.**
2. **The area and the lane are decided before the cart, and shown in the header from then on.**
3. **One checkout, on fillobakes.com.**
4. **`Order by Thursday 8pm for Saturday's run`** — in the bar, above every buy button, and beside the greyed
   date at checkout.
5. **Sold-out items stay on the page, greyed, with a `Notify me` that captures a phone number.**
6. **`/van` exists as a page, and its off-air state is as finished as its live state.**
7. **Fillo+ is free, phone-based, and one tap from the order confirmation.**
