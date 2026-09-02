# Fillo Bakes — TERTIARY Phase Execution Research
### The quarter horizon: subscription, lifecycle, gifting, doorstep, Shorts/LinkedIn, site reskin
_Researched 18 August 2026. All prices current as of this date. USD→INR conversions at **₹88/$ (assumed rate — verify at purchase)**._

---

## Reading conventions

| Mark | Meaning |
|---|---|
| **[Sourced]** | Figure taken from a cited source below |
| **[Est.]** | Our estimate — reasoning given, not a published figure |
| **[Vendor]** | Vendor-published claim, treat as marketing until validated |
| ⚠️ | Blocker or dependency that must be resolved before the task starts |

**Effort bands used throughout:** S = under 1 day · M = 2–5 days · L = 1–3 weeks · XL = 4+ weeks.

---

## ⚠️ THE CROSS-CUTTING BLOCKER (read this first)

Everything in this phase collides with one architectural fact from the site audit:

> Fillo runs a **v0.app-generated Next.js front end on Vercel that redirects to Shopify's hosted checkout**. The storefront is not a Shopify theme.

Consequences for the entire tertiary bucket:

| Tertiary item | What breaks | Fix path |
|---|---|---|
| Subscription | Shopify subscription apps sell via **Selling Plans**. A custom cart must fetch selling-plan IDs and attach `sellingPlanId` to line items, then hand off to Shopify checkout. Off-the-shelf widget UI (Appstle/Seal "subscribe & save" radio buttons) will **not** render on a Next.js page. | Dev work to wire Storefront API selling plans into the custom PDP/cart (M–L), **or** migrate storefront to a Shopify theme (item 6). |
| Loyalty (Fillo+ v2) | Smile.io / Rivo / BON widgets are theme app extensions. They don't run on the custom front end. Fillo+ is currently custom-built, which is why it exists at all. | Keep building Fillo+ custom (dev cost every change), or migrate. |
| Referral | Same as loyalty — most referral apps inject widgets into the theme. | Manual coupon-code referral (₹0) works today; app-based needs theme. |
| Reviews/UGC | Same. | Same. |

**The single highest-leverage strategic decision in this phase is not "which subscription app" — it is "do we stay headless".** Staying headless means every retention feature is bespoke dev. Migrating to a Shopify theme unlocks the entire app ecosystem at ~₹0–3,000/month each, at the cost of rebuilding the slot picker and van tracker. Item 6 costs both paths.

---

# 1. WEEKLY BREAD SUBSCRIPTION

## 1a. Tool landscape — Shopify subscription apps, current pricing

| App | Free tier | Paid entry | Scale tier | Transaction fee | Notes |
|---|---|---|---|---|---|
| **Shopify Subscriptions** (first-party) | **Free, always** | — | — | **0%** (normal Shopify payment fees only) | Weekly/monthly/yearly auto-billing; %, ₹, BXGY, fixed discounts; customer account portal with **pause / skip / cancel / update payment & address**. Low feature ceiling: no bundle builder, limited dunning, limited portal customisation. **[Sourced]** |
| **Seal Subscriptions** | Free forever, **50 active subscriptions**, 0% fee | $5.95/mo (~₹525) — 100 subs | $9.95 (250 subs) → $24.95 (500 subs); 150,000+ on request | **0% on all paid plans** | Freemium flat pricing, no revenue share. Best budget pick with real features. **[Sourced]** |
| **Appstle Subscriptions** | Free up to **$500/mo subscription revenue** | $10/mo (~₹880) Starter — up to $5,000/mo sub revenue | $30/mo Business — up to $30,000/mo; Enterprise $200+ | 0% | Starter adds custom shipping plans, loyalty, one-click portal login, inventory forecasts. Business adds build-a-box/bundling, product swaps, retention tooling. **[Sourced]** |
| **Recharge** | — | **$25/mo** — net-new merchants installed after 9 Feb 2026 only, **max 50 active subscribers** | **$99/mo + 1.49% + $0.19 per transaction** (auto-bump past 50 subscribers) | Stacked % + flat, on top of payment processor | Battle-tested at enterprise scale. Economically wrong for Fillo: at 200 subscribers × ₹800/mo, Recharge costs ~₹8,700 + ~₹2,400 in fees = **~₹11,100/mo** vs Seal at ~₹2,200/mo. **[Est. from sourced rate card]** |

### Recommendation
**Start on Shopify Subscriptions (free).** It does exactly what a weekly loaf plan needs — recurring weekly billing, customer-managed pause/skip. Graduate to **Seal (₹525–2,200/mo)** when you need multi-plan logic or >50 subscribers, and only consider Appstle Business when build-a-box (mix-your-own-4-loaves) becomes a real product. **Do not install Recharge at this stage.**

⚠️ **All of the above assume Shopify checkout owns the cart.** With the custom Next.js cart, budget **3–6 dev days [Est.]** to attach selling plans via Storefront API before any app can function.

## 1b. Model design — what the plan should actually be

### The two structural choices

**Prepaid share (CSB model) vs pay-per-delivery (auto-billed):**

The Community Supported Bakery model is directly transferable: customers **commit to and pay in advance for a fixed number of loaves over a period** (e.g. 2 loaves/week for 3 months), receiving a discount off the single-loaf price, with the discount scaling with commitment length. Documented benefits: cashflow up front, demand visibility, and **reduced waste because you bake to a known number** **[Sourced]**.

For a bakery that bakes fresh daily and currently has an empty "Weekly Specials" tab, the waste argument is the strongest one — this is a margin programme dressed as a marketing programme.

**Recommended hybrid:**
- **Default = auto-billed weekly** (lowest friction to start, standard Shopify Subscriptions behaviour, cancel anytime).
- **Upsell = prepaid 12-week "Bread Share"** at a deeper discount, positioned as founding-member support. Prepaid also removes payment-failure churn entirely, which is a meaningful share of subscription churn.

**Pause/skip is non-negotiable.** Note the counter-example found in the field: a US bakery states plainly that it cannot pause subscriptions and instructs customers to "find a friend to eat your bread that week" **[Sourced]** — that is exactly the friction that kills a food subscription in a city where people travel. Shopify Subscriptions gives pause/skip free in the customer portal; use it and market it.

**Variety rotation as churn defence.** The documented CSB best practice is to **rotate: swap one variety each week, substitute cookies for bread occasionally, and slot in a surprise product every 3–4 weeks** to prevent subscription fatigue **[Sourced]**. Fillo's 23-SKU catalogue with its city-fusion naming system is unusually well set up for this — the rotation *is* content.

### Proposed plan architecture **[Est. — pricing is our design, not a sourced figure]**

| Plan | Contents | List value | Subscriber price | Discount | Rationale |
|---|---|---|---|---|---|
| **The Loaf** | 1 shokupan/week | ₹200 | ₹180/wk (₹780/mo) | 10% | Entry; matches the "bread as staple" mission |
| **The Table** | 2 items/week (1 bread + 1 rotating an pan/kare pan) | ₹359 | ₹310/wk (₹1,340/mo) | ~14% | The volume target; rotation built in |
| **The Bread Share** (prepaid) | 12 weeks × The Table, paid upfront | ₹4,308 | ₹3,600 | ~16% | Cashflow + zero payment churn |

Anchor logic: the discount must be **visible but not the reason to subscribe** — the reasons are the fixed slot, the rotation, and Fillo+ status. Bread subscription in India is competing with a ₹40 supermarket loaf, not with other artisan bakeries; the pitch is ritual and freshness, not price. Note that Milkbasket, the closest operational analogue, charges customers a **subscription/convenience fee of roughly ₹160–175/month** on top of goods **[Sourced — user-reported, treat as indicative]**, which shows Indian households will pay a standing fee for daily doorstep certainty.

## 1c. Society / apartment-gate group model

### How the milk-delivery playbook actually works

- **Milkbasket** runs **no minimum order value** for the customer; the economics come from **delivery density**, not order size — their routing lets a single delivery partner serve **up to 50 customers within a two-hour window**, with assured delivery by 7 AM and flexi-ordering until midnight **[Sourced]**. Milk subscription is the onboarding hook; basket share is expanded afterwards.
- **Country Delight** places **small local hubs close to customer clusters**, enabling early-morning delivery, with app-managed customisable schedules, **vacation pauses**, and add-ons **[Sourced]**.
- Both run **prepaid wallets** — the customer tops up, then draws down. Milkbasket's wallet is explicitly a prepayment against future purchases; they pair it with a ₹150 signup bonus and ₹250 per referral **[Sourced]**.

**The transferable mechanic is: minimum viable density per stop, not minimum order per customer.**

### Fillo's society-gate design **[Est. — our design]**

1. **Define the unlock threshold as households, not rupees.** A van stop is worth making when the stop's revenue clears the marginal time cost. At ~₹350 average order and a 10-minute stop, **12–15 committed households per society per delivery day** is a defensible threshold. Publish it as a round number: **"15 homes unlock your gate."**
2. **Build a waitlist page per society** (`/societies/[slug]`) showing a live counter: *"Prestige Shantiniketan — 9 of 15 homes. 6 to go."* This is the single most shareable object in the entire tertiary phase: it converts your customer into your salesperson inside a WhatsApp group you can never join.
3. **Appoint a "Bread Captain" per society** — the resident who gets the group over the line. Reward: free loaf for the life of the stop. This is a referral programme disguised as ops, and it costs ~₹200/week per active society.
4. **RWA permission is a real gate.** Gated communities in Bengaluru mandate security checks and association approval for entry and activity **[Sourced]**. Agency-run RWA activations in Bengaluru quote around **₹15,000/day** **[Sourced — single vendor listing, indicative only]**. Fillo should approach RWAs **directly** (free or nominal gate fee) rather than through an activation agency; the van tasting *is* the activation.
5. **Sequence:** Bread Captain recruits → threshold met → RWA permission → fixed weekly slot published → society-specific WhatsApp broadcast list → van bell at the gate.

## 1d. Churn benchmarks — what to plan against

| Metric | Benchmark | Source quality |
|---|---|---|
| Meal-kit gross monthly churn | **8–15%, midpoint ~11.5%**; meal kits specifically ~12.7% | **[Sourced]** Med |
| Food & beverage boxes (broader) | **12–18% monthly** | **[Sourced]** Med |
| Top-quartile subscription brands | **under 3% monthly** | **[Sourced]** Med |
| Durable-business threshold | **<5%/mo = durable; 5–8% = manageable with a growth ceiling** | **[Sourced, prior research]** Med |
| First-box → second-box conversion | **35–50%** — "the only gate that matters" | **[Sourced]** Med |
| Where churn concentrates | **First two billing cycles.** If month-2 retention is below 70%, later-month improvements cannot rescue LTV | **[Sourced, prior research]** Med |
| Replenishment vs curation | Replenishment (bread, milk) **churns structurally lower** than discovery/curation boxes because the underlying need persists | **[Sourced, prior research]** Med |
| Subscription LTV lift | Food subscriptions **3–4x** one-time LTV; **8–18 orders** vs 1–1.5 | **[Sourced, prior research]** Med |

**Planning target for Fillo [Est.]:** bread is replenishment, not curation, so aim below the meal-kit band — **target ≤8% monthly churn in months 1–6, ≤5% steady state**. Instrument week-2 and week-4 retention specifically; those two weeks decide the programme.

## 1e. MUST-HAVE / GOOD-TO-HAVE

### MUST-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | Decide headless-vs-theme (blocks everything — see item 6) | M (decision + spike) | ₹0 |
| 2 | Wire Storefront API selling plans into custom PDP + cart (if staying headless) | M–L | ₹25k–60k **[Est.]** |
| 3 | Install **Shopify Subscriptions** (free), configure weekly plan, 10% subscriber discount | S | ₹0 |
| 4 | Define 2 plans + delivery-day binding (subscription must map to a van route day) | S | ₹0 |
| 5 | Pause / skip / cancel live in customer portal, and **said out loud in the marketing copy** | S | ₹0 |
| 6 | Subscriber onboarding flow: confirmation → "your day is Thursday" → first-delivery note | S | ₹0 (uses item 2 flows) |
| 7 | Weekly rotation calendar published 4 weeks ahead (kills fatigue, creates content) | S recurring | ₹0 |
| 8 | Society waitlist page with live counter + Bread Captain mechanic | M | ₹15k–30k **[Est.]** |
| 9 | Track week-2 and week-4 retention from day one | S | ₹0 |

### GOOD-TO-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | Prepaid 12-week "Bread Share" SKU (cashflow + zero payment churn) | M | ₹0–10k |
| 2 | Migrate to **Seal** when >50 subscribers | S | ₹525–2,200/mo |
| 3 | Build-a-box (choose your 2 items) — Appstle Business tier | M | ₹2,650/mo |
| 4 | Prepaid wallet / top-up credit, Milkbasket-style | L | ₹60k+ **[Est.]** |
| 5 | Per-society landing pages for local SEO ("bread delivery Whitefield") | M | ₹0 (content) |
| 6 | Vacation-pause reminder before long weekends | S | ₹0 |

---

# 2. LIFECYCLE FLOWS (email + WhatsApp)

## 2a. Channel economics at Fillo's list size (<5,000 contacts)

| Channel | Cost at 1,000 contacts, 4 sends/month | Notes |
|---|---|---|
| **Shopify Email** | **₹0** | **10,000 free emails/month** on Basic/Grow/Advanced/Plus; then **$1 per 1,000** (~₹88). 4,000 sends is fully inside the free tier. Unused emails do not roll over. **[Sourced]** |
| **Klaviyo Email** | **~$20/mo (₹1,760)** at 500 contacts; **~$45/mo (₹3,960)** in the 1,001–1,500 band; ~$100 at 5,000; ~$150 at 10,000. Billing moved to **active profiles** in Feb 2025. Each tier includes ~10x profile count in monthly sends. No annual discount on self-serve as of 2026. **[Sourced]** |
| **WhatsApp — marketing templates** | **₹0.8631 per delivered message** (India, from 1 Jan 2026, up ~10% from ₹0.7846) → 4,000 msgs = **₹3,452 + 18% GST = ₹4,073**, plus BSP platform fee | Meta bills **per delivered template message** since 1 July 2025 — the 24-hour conversation window model is gone. **[Sourced]** |
| **WhatsApp — utility/authentication templates** | **~₹0.115 per message** → 4,000 order/delivery/points messages = **~₹460 + GST** | ⭐ **This is the arbitrage.** Utility messages cost ~7.5% of marketing messages. **[Sourced]** |
| **BSP platform fee** | AiSensy **₹1,500/mo Basic, ₹3,200/mo Pro** (native INR billing, Shopify integration, 14-day Pro trial). Wati **₹2,199 Growth / ₹4,899 Pro**, Shopify integration a **paid ₹499/mo add-on**, extra numbers ₹2,499/mo each. Interakt comparable, strong Shopify integration. **[Sourced]** | 18% GST applies on both Meta charges and BSP fees **[Sourced]** |

### Recommendation for a tiny list
**Shopify Email + WhatsApp utility templates. Skip Klaviyo for now.**

The reasoning: at <5,000 contacts, Shopify Email costs ₹0 and Klaviyo costs ₹21,000–52,000/year. Klaviyo's advantage is segmentation and flow sophistication, which matter at list sizes where segmentation changes revenue — not at 1,000 contacts where you know the customers by name. **Revisit Klaviyo when the list clears ~3,000 and flows are already proven in Shopify Email.**

The WhatsApp decision is different: **use WhatsApp for everything transactional and operational** (order confirmed, van 20 minutes away, points balance, subscription skipped) because those qualify as **utility** templates at ~₹0.115. Reserve **marketing** templates (₹0.8631) for the weekly drop broadcast and win-back only — roughly 4–6 marketing sends per contact per month maximum.

**Total recommended monthly stack [Est.]: ₹1,500 (AiSensy Basic) + ~₹500–1,200 message spend + 18% GST ≈ ₹2,400–3,200/month.**

## 2b. The flow list — triggers, timing, channel

| # | Flow | Trigger | Timing | Channel | Message skeleton |
|---|---|---|---|---|---|
| **1** | **Welcome / Fillo+ join** | Fillo+ ₹1 purchase or email capture | Email 1: instant. Email 2: +48h. Email 3: +5d | Email (WhatsApp opt-in ask in #1) | 1: "You're in. Here's your coin balance and what it unlocks." 2: The 1874 anpan story + how shokupan is made (brand, not sell). 3: "Your first loaf — here's what to order first" + the rotation calendar |
| **2** | **First-order onboarding** | First order placed | Instant → day-before → 2h before slot | WhatsApp **utility** | Confirm → "Baking tonight, arriving tomorrow 4–6 PM" → "Van is 20 min away." This is the flow that makes the van feel like a service instead of a delivery |
| **3** | **Post-delivery review ask** | 48h after delivery marked complete | Once, +48h. One reminder at +5d if no response | WhatsApp utility, email fallback | "Did the shokupan pull apart the way it should?" → 1-tap star → 4–5★ routes to **Google review link**, 1–3★ routes to founder's WhatsApp. The 48h window is deliberate: long enough that they've eaten it, short enough that they remember |
| **4** | **Points balance / near-redemption** | Balance crosses 20 coins (5 short of ₹25) | Event-triggered, max 1/month | WhatsApp utility | "You're 5 coins away from ₹25 off. One an pan gets you there." Redemption is the driver, not enrolment — Taco Bell's redeemers spend **3.1x** non-redeemers **[Sourced, prior research]** |
| **5** | **Weekly drop broadcast** | Every week, fixed day/hour | Same day + hour, forever. Teaser T-24h, live at T-0, sold-out post at close | WhatsApp **marketing** (₹0.8631) + IG | "Thursday 5 PM: 40 Blue Pea loaves. Last week sold out in 26 minutes." Hard cap, countdown, waitlist. The consistency is the product |
| **6** | **Win-back** | No order in 30 days | D30, D45, D60 then suppress | Email first (cheap), WhatsApp marketing only at D45 | D30: "The bread changed since you left" (rotation calendar). D45: single-use coin bonus. D60: "Should we stop writing?" — a graceful exit outperforms a fourth discount |
| **7** | **Subscription lifecycle** | Sub created / skipped / payment failed | Instant on each event; dunning at D0, D2, D5 | WhatsApp utility | Payment-failure dunning is the highest-ROI message in the entire stack — it recovers revenue you already earned |
| **8** | **Society waitlist nurture** | Joins a society waitlist | On join, at 50% of threshold, at unlock | WhatsApp utility | "9 of 15. Share this with your block." Turns the customer into the salesperson |

### Flow benchmarks to grade against

| Flow | Benchmark | Source quality |
|---|---|---|
| Welcome series | **40–60% open rate**; **12–18% conversion** for top performers | **[Sourced]** Med |
| Post-purchase | **Highest open rate of all flows (~58%)** but one of the **lowest revenue per recipient (~$0.47)** — it is a brand and retention asset, not a revenue line. Do not judge it on revenue | **[Sourced]** Med |
| Win-back | **Lowest yield per recipient in the entire stack** — brands build it first out of loss aversion and it consistently underperforms. Build it last | **[Sourced]** Med |
| Flows vs campaigns | Flows generated **~41% of email revenue from 5.3% of sends**; flow RPR ~$1.94 vs campaign RPR ~$0.11 in Klaviyo's 2026 benchmarks (~18x gap) | **[Sourced]** Med |
| WhatsApp vs email conversion | WhatsApp cart nudges convert **18–25%** vs ~3.7% for email | **[Sourced, prior research]** Med |

**Read-through: build flows 1, 2, 3 first. Build flow 6 last.** The published data says post-purchase wins attention and win-back wins nothing.

## 2c. Fillo+ redesign options

**Current mechanic:** ₹1 join → 2 coins per ₹100 → 25 coins = ₹25 off. That is **~2% cashback**, and it takes **₹1,250 of spend** to earn ₹25. On a ₹350 average order that is **3.6 orders to earn one-seventh of a loaf.** The reward is too distant to change behaviour, and cashback is the least defensible loyalty currency because it is trivially matched by any competitor's discount.

Three redesign directions, in ascending order of ambition:

### Option A — Perk-led (recommended first move)
Keep the coins as a base layer, add **status perks that cost margin only when used**:
- **Early access** to the weekly drop (30 minutes before public) — costs ₹0, and it is the single most valuable perk because the drop is capped.
- **Free loaf on the 6th order** — a punch card, but the 6th is chosen so it lands just past the median repeat count.
- **Birthday an pan**, delivered on the day. Cost ~₹60, memory value far higher.
- **Name on the van** for the first 100 members. Costs ₹0, generates its own content.

Why perks over cashback: loyalty members already spend **+40% per visit and visit +64% more often** than non-members **[Sourced, prior research]** — the job is to make membership feel like *belonging*, which cashback never does.

### Option B — Panera-style frequency subscription ("The Bread Pass")
Panera's Unlimited Sip Club is the strongest published case for frequency pricing in food retail:
- Visit frequency **jumped by more than 200%** for members **[Sourced]**
- **70% increase in food attachment**; members spend **12% more on food per visit** **[Sourced]**
- **One in four Panera transactions** comes from Sip Club members **[Sourced]**
- The mechanism is explicitly the **sunk-cost effect** — customers choose Panera over a competitor to avoid wasting money already spent **[Sourced]**

**Fillo translation [Est.]:** *The Bread Pass — ₹699/month, one loaf a week, free delivery, member price on everything else.* The loaves are the loss leader; the an pan, kare pan and sandos attached to each delivery are the margin. This is structurally the same bet Panera made, and it merges cleanly with the subscription in item 1 — **Fillo+ and the subscription should be one product, not two.**

### Option C — Tiered coins with a redemption accelerator
If keeping cashback, at minimum: **double the earn rate to 4 coins/₹100 (4%)** and drop the redemption floor to **15 coins**, so the first reward lands at ~₹375 of spend — roughly one order. First-reward proximity is what converts enrolment into redemption, and redemption is what correlates with spend.

**Recommendation: A now, B by end of quarter, C only if A and B are both rejected.**

## 2d. MUST-HAVE / GOOD-TO-HAVE

### MUST-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | WhatsApp Business API via **AiSensy** (INR billing, Shopify integration) | M | ₹1,500/mo + msgs |
| 2 | Get **utility** templates approved for order/delivery/points (7.5% the cost of marketing) | M | ₹0 |
| 3 | Flows 1, 2, 3 live (welcome, first-order, 48h review ask) | M | ₹0 |
| 4 | Shopify Email set up with brand template; capture email at checkout + Fillo+ | S | ₹0 |
| 5 | Weekly drop broadcast running on a fixed day/hour | S recurring | ~₹900/1,000 contacts |
| 6 | Fillo+ perk layer (Option A) — early drop access + 6th-order loaf | M | ₹0 dev if bundled with reskin |
| 7 | Explicit WhatsApp opt-in capture at checkout and in welcome email #1 | S | ₹0 |

### GOOD-TO-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | Flows 4, 7, 8 (points, subscription lifecycle, society waitlist) | M | ₹0 |
| 2 | Win-back (flow 6) — build last, lowest yield | S | ₹0 |
| 3 | The Bread Pass (Option B) | L | Merges with item 1 |
| 4 | Klaviyo migration once list >3,000 | M | ₹1,760–8,800/mo |
| 5 | Segment by society for hyper-local broadcasts | S | ₹0 |
| 6 | Dunning sequence for failed subscription payments | S | ₹0 |

---

# 3. GIFTING + REFERRAL

## 3a. The Diwali calendar — and the uncomfortable timing

**Diwali 2026 falls on Sunday, 8 November 2026** **[Sourced]**. Today is 18 August 2026 — **12 weeks out**.

Published corporate gifting lead times:
- **6–8 weeks in advance** for bulk hampers with custom branding **[Sourced]**
- **Order by the first week of October** for standard Diwali hampers **[Sourced]**
- One supplier's stated cut-offs for branded hampers: **15 August for 25–199 units, 1 August for 200+ units** **[Sourced]**
- **Corporate gifting volumes typically book up by early September** **[Sourced]**

**The implication is sharp: for corporate gifting, Fillo is already inside the window.** Corporate buyers are choosing suppliers *now*, in August and early September. Consumer gifting has a much later window (mid-October pre-orders), but corporate does not.

### Recommended calendar **[Est. — built from the sourced lead times]**

| Window | Action |
|---|---|
| **Now → 5 Sep** | Lock the gift SKU spec and packaging supplier. Begin **corporate outreach immediately** — you are competing for orders being placed this month |
| **5–20 Sep** | Packaging artwork approved and boxes ordered (MOQ 50–300, ~1 week after artwork approval **[Sourced]**). Corporate quote sheet + lead-time commitment published |
| **20 Sep → 10 Oct** | Corporate order intake closes. Consumer gift SKU photographed and listed |
| **10–25 Oct** | **Consumer pre-orders open.** Delivery-date picker (already built) does the heavy lifting — customers choose the delivery day |
| **26 Oct → 6 Nov** | Production and van delivery waves. Corporate single-drop deliveries prioritised |
| **7–8 Nov** | Diwali. Van in festive livery |

## 3b. The bakery-specific gifting problem — and its solution

⚠️ **Fresh bread has a 2–3 day shelf life. Corporate Diwali gifting expects a hamper that sits on a desk.** This is the constraint that determines the entire product **[Est. — our reasoning, not a sourced finding]**.

Three viable formats, in order of fit:

1. **Same-day bulk office drop** (best fit for the van). One office, one address, one delivery window, 50–200 boxes of fresh an pan and pies. This is the format Fillo is *uniquely* built for — a moving bakery doing a single-address festive drop is operationally trivial and competitively impossible for a fixed bakery to match without a courier. Habbaa's model of **roasting to order and scheduling production for optimal freshness on delivery** is the same logic applied to coffee **[Sourced]**.
2. **A shelf-stable festive line** — cookies, biscotti, a mawa/nut spread, jam. Extends the window to weeks, but requires new production and FSSAI labelling. Higher effort, higher optionality.
3. **The gift voucher / gifted subscription** — "gift four weeks of bread." Zero shelf-life problem, zero packaging cost, highest margin, and it converts a gift recipient into a subscriber. **Most underrated of the three.**

### Price points and box economics **[Est. — market-positioned, verify against final BOM]**

| SKU | Contents | Price | Est. packaging cost | Target audience |
|---|---|---|---|---|
| **The Small Table** | 4 an pan, festive sleeve | **₹499** | ₹40–70 | Personal, mass-giftable |
| **The Diwali Box** | 1 marble bread + 4 an pan + 2 pies, rigid box | **₹999** | ₹100–180 | Personal premium + small corporate |
| **The Founders' Hamper** | Blue pea + chocolate shokupan + 6 assorted + story card, rigid magnetic box | **₹1,499** | ₹180–350 | Corporate, client gifting |
| **Gift a Month of Bread** | 4-week subscription voucher | **₹1,299** | ₹30 (card only) | The margin play |

**Packaging cost reality [Sourced]:** custom printed food packaging boxes are quoted from **~₹25/box** at the low end; **rigid hamper boxes run ₹184–₹3,097** depending on size and finish. **MOQ for custom-branded boxes: 50–300 units**, lead time **~1 week after artwork approval**. Food-grade paperboard and window/ribbon bakery boxes are standard offerings.

**Corporate-specific requirements to build [Est.]:**
- A **quote sheet** with clear slabs (25 / 50 / 100 / 250 units) and a stated lead time
- **Co-branding option** (client's logo on a belly band, not on the box — cheaper, faster, looks better)
- **GST invoice** — non-negotiable for corporate buyers, and a genuine advantage over informal home bakers
- A **single-page PDF** the buyer can forward to their admin/HR team. Corporate gifting decisions are made by forwarding a PDF

**Market context [Sourced, prior research]:** Indians were projected to spend **over ₹1.8 lakh crore** on traditional gifts and sweets during Diwali 2024, and **53% prefer traditional gifts — sweets, bakery products, or chocolates**. Chocolate gifting rose **27%** across Diwali/Eid/wedding season 2024, with online platforms reporting a **40% surge in seasonal orders**. Eggless is a genuine gifting advantage in India: it removes the single biggest "can I give this to anyone?" objection.

## 3c. Referral programme

### Tools and current pricing

| App | Free tier | Paid entry | Notes |
|---|---|---|---|
| **UpPromote** | Free plan, **up to 200 orders/month** | **$29.99/mo** (~₹2,640) | Strong free tier; affiliate-oriented |
| **Rivo** | Free for stores **under 200 monthly orders** | **$49/mo** (~₹4,310) | Loyalty + referral combined |
| **Growave** | Free plan, unlimited affiliates | **$29.99 / $89.99 / $199.99** | Bundles reviews + wishlist + loyalty + referral |
| **ReferralCandy** | — | Base fee **+ a percentage of referral revenue** | Longest-established (2010); revenue share makes it expensive at low volume |
| Category range | Several free tiers (BON, Smile.io, UpPromote, Rivo) | **~$15–79/mo** entry across the category | **[Sourced]** |

⚠️ **All of these are theme app extensions and will not render on the custom Next.js storefront.** See the cross-cutting blocker.

**Recommendation at Fillo's scale: build "give a loaf" on Shopify discount codes and WhatsApp — ₹0/month.** Unique single-use codes, tracked in a spreadsheet or the Fillo+ dashboard, delivered by WhatsApp. At <200 orders/month an app buys you reporting you don't need yet. Revisit once (a) the storefront question is settled and (b) monthly orders clear ~300.

### "Give a Loaf" design **[Est. — our design]**

> **Give a loaf, get a loaf.** Send a friend a free shokupan on their first order. When they order, your next loaf is on us.

Why a loaf and not a discount: the product *is* the pitch. A ₹100-off code says "we're expensive"; a free loaf says "taste this." It also caps Fillo's exposure at COGS rather than at revenue, and it lands the referred customer's first experience on the hero SKU rather than on whatever was cheapest.

**Mechanics:**
- Double-sided (both parties get something) — one-sided referral programmes consistently underperform
- Reward on **delivery, not order** — protects against fraud and against a bad first experience
- Delivered via **WhatsApp**, not email — the sharing happens in WhatsApp, so the code must live there
- Cap at 5 referrals per customer per quarter
- Put the referral card **physically in the box** — the doorstep moment (item 4) is when goodwill peaks

**Benchmarks to grade against [Sourced, prior research]:** median ecommerce referral conversion **3–5%** (top quartile 8%+); healthy share rate **5–15%** of customers; referred customers show **+16–25% LTV and ~37% better retention**; referral CAC runs roughly **40–50% below paid** in the US cost base (directional only for India).

## 3d. MUST-HAVE / GOOD-TO-HAVE

### MUST-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | **Corporate outreach starting this week** — the window closes in early September | M recurring | ₹0 |
| 2 | Lock gift SKU spec + packaging supplier by 5 Sep | M | ₹0 |
| 3 | Order boxes by 20 Sep (MOQ 50–300, 1 week post-artwork) | S | ₹5k–50k depending on run |
| 4 | Corporate quote sheet + forwardable one-page PDF + GST invoicing | S | ₹0 |
| 5 | Consumer pre-orders live by 15 Oct with delivery-date selection | M | ₹0 (picker exists) |
| 6 | "Give a Loaf" referral on Shopify discount codes + WhatsApp | M | ₹0 |
| 7 | Referral card printed and inserted in every box | S | ₹2–5/card **[Est.]** |

### GOOD-TO-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | Gifted-subscription voucher SKU (no shelf-life problem, best margin) | M | ₹0 |
| 2 | Shelf-stable festive line (cookies/biscotti/spread) | L | ₹30k+ **[Est.]** |
| 3 | Client-logo belly band for corporate co-branding | S | ₹8–15/band **[Est.]** |
| 4 | Referral app once orders >300/month | S | ₹0–4,300/mo |
| 5 | Post-Diwali gifting calendar: Christmas, Valentine's, birthdays, housewarming | M | ₹0 |
| 6 | Corporate repeat programme — Diwali buyers become Q1 office-snack accounts | M | ₹0 |

---

# 4. DOORSTEP EXPERIENCE KIT

## 4a. Uniform and kit — India costs

| Item | India cost | Source quality |
|---|---|---|
| Printed apron, bulk | **₹49–59/piece** at IndiaMART wholesale entry | **[Sourced]** — verify quality at this price |
| Branded apron, decent quality | **₹250–500/piece** **[Est.]** | Reasoning: the ₹49 tier is thin poly; a canvas/cotton apron that reads "craft bakery" sits well above it |
| Round-neck cotton t-shirt, 160 GSM, 1-colour print, 200+ pcs | **₹150–200/piece all-in**; range ₹120–180 basic, ₹280–400 premium polo | **[Sourced]** |
| Company polo, 100+ pcs | from **₹499/piece** | **[Sourced]** |
| Embroidery add-on | **+₹80–150/piece** by design size | **[Sourced]** |
| Lead time | **7–10 business days pan-India** for standard bulk | **[Sourced]** |
| Cap / bandana | ₹80–150 **[Est.]** | — |
| Insulated handoff tote (branded) | ₹300–600 **[Est.]** | — |

**Recommended kit [Est.]: apron + cap + tote, 4 sets = ₹3,000–6,000 total.** At a two-person operation this is a rounding error against its effect. Embroidery over print — it survives washing, and washed-out printing on a delivery apron actively signals the opposite of "premium craft."

## 4b. Handwritten notes at scale — the photocopy finding

This is the best-evidenced single tactic in the entire Fillo research corpus, and its operational implication is unusually convenient.

**The study** (Kim, Choi & Kim, *Journal of Interactive Marketing*, 2022 — randomised field experiment, **n = 1,232** customers of a Korean online beauty retailer, Feb 2017) **[Sourced]**:

| Condition | Subsequent customer spend |
|---|---|
| No note (control) | **$25.97** |
| **Photocopied handwritten note** | **$52.07 — +100.5%** |
| Original handwritten note | Performed **similarly to the photocopy** |
| Machine-written note (Malgun Gothic font) | **No better than no note at all** |

Three operational rules fall straight out of this:
1. **Photocopying does not destroy the effect.** This scales to any order volume.
2. **A typeset note is worthless.** The perceived-effort signal is the entire mechanism. Never set it in a font.
3. **The effect dies if paired with a discount** **[Sourced, prior research]** — the note must be a gift, not a coupon. Do not put an offer code on the card.

### Ops design **[Est.]**
- Write **5–6 master notes by hand** in the founders' actual handwriting, on the actual card stock. Vary them so a repeat customer doesn't receive the same one twice.
- **Photocopy or scan-and-digitally-print** onto uncoated cream stock — uncoated matters, gloss reads as printed.
- **Sign each one by hand** with a real pen. Thirty seconds a batch, and it closes the credibility gap entirely.
- **Rotate the masters seasonally** so the notes stay alive.
- Cost: **₹3–6 per card at 500 units [Est.]**, versus a documented doubling of subsequent spend.
- Keep genuinely bespoke handwritten notes for **first orders, subscription starts, and complaints recovery**.

## 4c. The van bell — audio signature

**Precedent.** Harry Burt, an Ohio candymaker, is generally credited as the first vendor to announce an ice cream van by **covering the truck in bells**; by the 1950s these had become mechanical music boxes **[Sourced]**. The nostalgia mechanism is well described: **music is one of the strongest nostalgia triggers, alongside smell**, and **short, repetitive melodic phrases are easier for the brain to retain** — which is why jingles loop a few notes rather than develop **[Sourced]**. The jingle evokes childhood and "the fabric of that local community" **[Sourced]**.

**Brand-recall evidence:** Veritonic reports **77% of consumers recall a brand more easily when they associate it with a specific sound**; Tostitos reported a **38% increase in brand recall** six months after launching a sound logo **[Sourced — vendor/industry research, Med confidence]**.

This is precisely on-strategy: Fillo's own stated mission is reviving the neighbourhood bread-vendor ritual, "like milk vendors." **The bell is the mission, made audible.**

### Implementation **[Est.]**
| Option | Cost | Notes |
|---|---|---|
| **Brass hand bell** rung by the delivery person | **₹300–800** | ⭐ Recommended. Human, warm, zero regulatory exposure, and it *is* the bread-vendor reference rather than the ice-cream-truck one |
| Mounted mechanical bell on the van | ₹1,500–4,000 | Good; less controllable |
| Amplified jingle / speaker | ₹5,000–15,000 | ⚠️ **Caution.** Amplified sound from vehicles in residential areas is regulated in Indian cities and creates RWA friction — the opposite of what the society-gate model needs. **Verify local Bengaluru/BBMP noise rules before spending anything here [not researched in depth]** |
| Recorded 3-note motif for content | ₹5,000–25,000 (composer) | The same motif on every Reel, Short, and the site's tracker page — sonic branding without a loudspeaker |

**Recommended: physical hand bell + a 3-note motif used only in content.** Total ₹300–800 to start, and the bell arrives before the strategy deck does.

## 4d. Delivery script and handoff **[Est. — our design]**

A script has to be short enough to survive 40 deliveries a day. Four beats:

1. **Bell.** Two rings. Not a doorbell — the bakery announces itself.
2. **Name the bread, not the order.** "Your marble bread — baked this morning." (Not: "Order 4417?")
3. **The handoff.** Two hands. Box facing the customer, lid toward them. Never a bag dangled from a wrist.
4. **The ritual line.** One sentence, always the same: *"Tear it, don't toast it — try the first piece warm."* Consistency is what makes it a ritual instead of small talk.

**Handoff practices to standardise:**
- Box carried, never swung. Bread that arrives compressed cannot be uncompressed.
- The note card sits **on top**, visible on opening — not buried under the loaf.
- QR to reorder + review printed on the inner lid, so it's seen at the moment of maximum goodwill.
- If the customer isn't home: **no doorstep abandonment for fresh bread.** Call, then a WhatsApp with a photo of where it was left. 85% of customers don't reorder after a poor delivery moment **[Sourced, prior research]**.
- **Never apologise for the van being early.** Early is the brand.

## 4e. MUST-HAVE / GOOD-TO-HAVE

### MUST-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | Handwritten master notes → photocopy → hand-sign, **no discount code on the card** | S | ₹3–6/card |
| 2 | Branded apron + cap, 4 sets, embroidered | S (7–10d lead) | ₹3,000–6,000 |
| 3 | Hand bell on the van | S | ₹300–800 |
| 4 | Four-beat delivery script, written down and practised | S | ₹0 |
| 5 | Handoff standard: two hands, box level, note on top | S | ₹0 |
| 6 | Not-at-home protocol (call → WhatsApp photo → never abandon) | S | ₹0 |

### GOOD-TO-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | 3-note sonic motif on all content | M | ₹5k–25k |
| 2 | Insulated branded tote for the walk from van to door | S | ₹300–600 ea |
| 3 | Seasonal note-master rotation | S | ₹0 |
| 4 | Truly bespoke notes for first orders / subscription starts / recovery | S recurring | ₹0 |
| 5 | Verify Bengaluru vehicle-noise rules before any amplified audio | S | ₹0 |
| 6 | Film the doorstep moment — it is the best Reel Fillo isn't making | S | ₹0 |

---

# 5. YOUTUBE SHORTS + LINKEDIN ENGINE

## 5a. Reels → Shorts repurposing workflow

⚠️ **The critical constraint: YouTube's algorithm actively suppresses videos carrying visible TikTok or Instagram watermarks** **[Sourced]**. Downloading your own Reel from Instagram and uploading it to Shorts is the single most common and most costly mistake in repurposing.

### The correct workflow (and it's free)
**Export a clean master before you ever post to Instagram.** If Reels are edited in CapCut / InShot / Premiere, export twice — one for IG, one clean 9:16 file held for Shorts. This costs ₹0 and beats every watermark-removal tool because nothing is ever degraded.

**Fallback, if only the posted Reel survives:** watermark removers — **Wink** (AI frame-by-frame detection, no crop or resize), **Vmake**, **Wondershare UniConverter** (HD/4K export), **short.now** (removes watermark, re-captions, reformats) **[Sourced]**. Free tiers exist across these; assume **₹0–1,500/month [Est.]** if used.

### Shorts SEO — titles and search **[Sourced]**
YouTube Search is now a **primary** traffic source for Shorts, not a secondary one. The optimisation stack:

| Element | Rule |
|---|---|
| **Title** | Focus keyword in the **first 3 words**; keep **under 60 characters** for full display in mobile search |
| **Description** | Topic in the **first ~100 characters**. Never open with "Subscribe for more!" — it buries the keyword the algorithm needs. CTA goes at the end. 150–200 words, keyword + subtopics, no stuffing |
| **Hashtags** | **3–5 in the description.** The first three render as clickable links above the Shorts title — visibility without spending title characters |
| **Tags** | **3–5**: one exact title keyword, 1–2 close variants, 1–2 broad category |
| **Captions** | Add **manual** captions. Auto-captions run ~85% accurate, and captions are a primary ranking signal. Words in the **first 10 seconds carry disproportionate weight**. (One source claims captioned Shorts rank ~23% higher — **[Vendor]**, treat as directional) |
| **Validation** | Search your target query first: **if Shorts already appear in results, there is Shorts search demand for that topic** |

### Fillo's Shorts title bank **[Est. — built to the rules above]**
The opportunity is that Fillo's product *is* a search category with real query volume and almost no Indian supply:

- `Eggless shokupan recipe — Japanese milk bread, no egg`
- `Shokupan vs sandwich bread — the difference in 60 seconds`
- `Anpan: the 1874 Japanese bread with red bean inside`
- `Why Japanese milk bread is so soft (tangzhong explained)`
- `Eggless Japanese bakery in Bangalore — from a van`
- `Blue pea bread — how butterfly pea flower turns bread blue`

Note the split: **recipe/explainer queries win search**, **van/jiggle content wins the feed**. Fillo needs both, and the recipe angle is the one it currently has zero of.

**Cadence, minimum viable [Est.]: 3 Shorts/week, all repurposed from Reels already being made for the Instagram relaunch. Zero incremental filming. Roughly 30 minutes a week of re-titling.** The channel's job in this quarter is to exist, be searchable, and compound — not to grow fast.

## 5b. LinkedIn — showcase page to company page

**Answer: yes, it is possible, officially.** Per LinkedIn Help, three page conversions are supported: Company → Showcase, **Showcase → Company**, and Company → University **[Sourced]**.

**What a Showcase → Company conversion does [Sourced]:**
- URL changes from `/showcase/` to `/company/`
- **Followers migrate** to the new Company Page
- **All shared posts and sponsored posts migrate**
- You choose whether to keep or remove the affiliated-page relationship with the parent

**Requirements and process [Sourced]:**
- Must be a **super admin** of the page (and of the parent page), and confirm authorisation to act for the organisation
- **Contact LinkedIn support** with: exact page name, page URL, conversion type, and the reason for conversion
- ⚠️ **Conversions are irreversible.** LinkedIn cannot retrieve data once converted, and the page cannot be reverted
- Showcase Pages are also **not eligible for certain features**, e.g. Services Pages **[Sourced]**

**Practical note:** several third-party sources claim conversion is impossible and advise creating a new page and rebuilding followers organically **[Sourced — contradicts LinkedIn's own help doc]**. LinkedIn's own documentation is authoritative here, but support-ticket outcomes vary in practice. **Recommended: file the support request; if it stalls beyond two weeks, create a fresh Company Page rather than waiting** — at Fillo's follower count the migration is worth little, and the delay costs more than the followers do.

## 5c. Founder-led B2B / HORECA content

The B2B prize for a bakery is **cafe wholesale, hotel/restaurant supply, and corporate catering** — and unlike D2C, those buyers are on LinkedIn and they are reachable by one founder posting consistently. The corporate Diwali gifting push (item 3) and the LinkedIn engine are the **same motion**: the PDF that gets forwarded is the conversion event, and LinkedIn is where the forwarder finds you.

**Angles that work for a founder-led bakery account [Est.]:**
1. **Unit economics in public** — "what a ₹200 loaf actually costs to make and deliver." Operators share this; it travels.
2. **The van as an ops story** — route density, waste reduction from baking to confirmed orders, why a moving bakery beats a fixed one on rent. This is a business story, not a food story, and LinkedIn rewards the former.
3. **Eggless as a supply-chain advantage** — a genuinely differentiated B2B pitch to cafes serving a vegetarian-heavy market.
4. **Wholesale spec posts** — "here's our cafe pricing, our lead time, and our minimum." Publishing terms publicly is rare and disproportionately effective.
5. **Hiring and building** — the two-founder story, December 2025 to now.

**Cadence, minimum viable [Est.]: 2 founder posts/week + 1 company page repost.** The founder profile carries the reach; the company page carries the credibility check. Do not invert that.

## 5d. MUST-HAVE / GOOD-TO-HAVE

### MUST-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | Export watermark-free masters at edit time — never re-download from IG | S (process) | ₹0 |
| 2 | Create/claim the YouTube channel; 3 Shorts/week from existing Reels | S recurring | ₹0 |
| 3 | Apply Shorts SEO: keyword in first 3 title words, <60 chars, topic in first 100 chars of description, 3–5 hashtags, manual captions | S recurring | ₹0 |
| 4 | Validate each topic by searching it first — confirm Shorts already surface | S | ₹0 |
| 5 | Resolve LinkedIn page type: file the Showcase→Company support request, or create fresh after 2 weeks | S | ₹0 |
| 6 | Founder LinkedIn: 2 posts/week, ops-and-economics angle | S recurring | ₹0 |
| 7 | Link YouTube + LinkedIn from the site (currently only Instagram is linked) | S | ₹0 |

### GOOD-TO-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | Recipe/explainer Shorts series targeting "eggless shokupan recipe" class queries | M | ₹0 |
| 2 | Watermark-removal tool if masters are lost | S | ₹0–1,500/mo |
| 3 | Scheduling tool for cross-posting | S | ₹0–2,000/mo |
| 4 | LinkedIn HORECA/wholesale one-pager as a lead magnet | S | ₹0 |
| 5 | Pinned comment with reorder link on every Short | S | ₹0 |
| 6 | Long-form YouTube (van day-in-the-life) once Shorts prove demand | L | ₹0 |

---

# 6. FULL SITE RESKIN

## 6a. Component inventory (from the live site audit)

| Surface | Components | Reskin complexity |
|---|---|---|
| `/` Home | Hero (photo/video), category tiles, product grid with ±steppers, 8 testimonials, "Post Review" widget, van-tracker pill + map popup, footer | **High** — most bespoke components |
| `/shop` | Category tabs (incl. empty "Weekly Specials"), 23 product cards, variant modal, in-page "Review Your Order" panel | **High** |
| Product / variant modal | Variant selector (Whole/Sliced), price, add-to-cart | Medium |
| `/cart` + cart drawer | Line items, quantity, coupon nudge ("Add ₹300 more → FILLO10"), totals | Medium |
| `/checkout` | **Delivery date picker (30 days), 4 time slots, contact form, Fillo+ ₹1 upsell, 5% tax line** → redirect to Shopify | **High — and the most valuable code in the repo.** Do not casually rewrite |
| `/fillo-plus` + `/dashboard` | Join flow, ₹1 checkout, coin balance, "Bake More" | Medium |
| Van tracker | OpenStreetMap embed, live position, 15-second refresh | **High — unique asset** |
| `/about`, `/franchise`, `/blogpage`, `/contact` | Content pages | Low |
| Policy pages (×5) | Static content | Low |
| `/shokupan` | The one page with proper title/meta — the SEO template | Low, but **preserve its server-rendered meta** |

**Roughly 14 routes, 25–35 distinct components [Est.].**

## 6b. What a design-token reskin of a v0.app codebase actually involves

The honest version: **v0-generated code typically has no token layer.** Colours, spacing and type are inline Tailwind utility classes repeated across components, and components are often duplicated rather than shared. So "apply the new brand tokens" is not the job — **creating the token layer is the job**, and it is most of the effort.

**Realistic sequence [Est.]:**
1. **Audit and extract** — inventory every colour, font size, radius, shadow and spacing value actually in use. Typically reveals 20–40 near-duplicate values that should be 8–12. (M)
2. **Define the token layer** — CSS custom properties / Tailwind theme config: colour, type scale, spacing, radius, shadow, motion. (S–M)
3. **Refactor components to tokens** — the bulk of the work, and where duplicated components get consolidated. (L)
4. **Apply the new brand** — with tokens in place this becomes hours, not weeks. This is the entire argument for doing steps 1–3. (S)
5. **Component polish** — buttons, cards, modal, form fields, empty states rebuilt to the identity. (M)
6. **Content fixes bundled in** — unique copy per SKU (three Fruit Sandos currently share one description), the `/blogpage/undefined` broken links, the empty Weekly Specials tab, the dummy franchise phone number `+91 98765 43210` still live. (M)
7. **SEO remediation, non-negotiable** — titles, meta descriptions, OG tags, canonical, favicon, JSON-LD on every route; remove the 12 stale `/product/*` soft-404s from the sitemap; add `/fillo-plus`, `/franchise`, `/blogpage`, `/shokupan` to the sitemap. (M) **This is arguably higher-value than the reskin itself.**
8. **Fix the hydration glitch** — `/shop` transiently paints a blank region with the header detached. (S)

**Total [Est.]: 4–7 weeks of one competent front-end developer,** with SEO and content fixes bundled.

## 6c. Cost bands — India

| Approach | Cost band | Source quality |
|---|---|---|
| Indian agency hourly rate | **₹1,500–4,000/hour** | **[Sourced]** |
| Indian freelance React/Next.js | **~$22–30/hr ≈ ₹1,900–2,650/hr**; Next.js expertise adds 15–35% over base React rates | **[Sourced]** |
| Basic Shopify store build | **₹20,000–40,000** | **[Sourced]** |
| Premium theme + standard customisation | **₹25,000–75,000** (theme itself ₹8,000–20,000 one-time) | **[Sourced]** |
| Agency-built D2C store | **₹1,50,000–4,00,000** | **[Sourced]** |
| Real-world comparable: mid-size Indian apparel brand redesign (UI redesign + mobile perf + advanced filtering + WhatsApp and email automation) | **~₹1,20,000** | **[Sourced]** |
| Broad range for Shopify development in India | **₹15,000 – ₹5,00,000+** | **[Sourced]** |

### The two paths, costed **[Est., built on the sourced rates]**

| | **Path A — Reskin the Next.js app** | **Path B — Migrate to a Shopify theme** |
|---|---|---|
| Scope | Token layer + refactor + reskin + SEO + content fixes | Dawn/premium theme, rebuild slot picker as app block, rebuild or embed tracker, migrate content |
| Effort | 4–7 weeks | 4–8 weeks |
| **Cost** | **₹1,20,000 – ₹3,00,000** | **₹1,50,000 – ₹3,50,000** |
| Keeps | Slot picker, van tracker, Fillo+ dashboard, checkout bridge — all as-is | — must be rebuilt |
| **Unlocks** | Nothing new. Every future retention feature stays bespoke dev | **The entire Shopify app ecosystem**: subscriptions, loyalty, referral, reviews, upsell — each ₹0–3,000/month instead of ₹25k–60k of dev |
| Ongoing cost | High — each of items 1, 2, 3 above carries dev cost | Low — apps replace dev |
| Risk | Compounding technical debt in generated code nobody wrote | One-time migration risk; slot picker is genuinely non-trivial to rebuild |

**Our read:** the reskin is worth doing either way, but **choosing Path A means accepting that the subscription, loyalty and referral programmes in this document each carry a dev bill for the rest of the business's life.** Over four quarters that difference likely exceeds the migration cost. Path B's real obstacle is not money — it is that the delivery-slot picker and the live van tracker are Fillo's two best pieces of software, and both would need rebuilding.

**A third option worth pricing [Est.]: hybrid.** Migrate `/shop`, `/cart`, PDPs and content to a Shopify theme (where the apps live), keep the van tracker as a standalone Next.js route on a subdomain or path. Gets ~80% of the ecosystem benefit for ~60% of the migration risk.

## 6d. MUST-HAVE / GOOD-TO-HAVE

### MUST-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | **Decide Path A / B / hybrid before any reskin work starts** | S (decision) | ₹0 |
| 2 | Token layer extraction and definition | M | included below |
| 3 | Component refactor to tokens + brand application | L | ₹1.2L–3L total |
| 4 | **SEO remediation**: titles, meta, OG, canonical, favicon, JSON-LD on all routes | M | included |
| 5 | Remove 12 stale `/product/*` soft-404s; add missing routes to sitemap | S | included |
| 6 | Fix `/blogpage/undefined` links and the `/shop` hydration glitch | S | included |
| 7 | Unique copy per SKU; kill duplicate Fruit Sando descriptions | M | ₹0 (content) |
| 8 | Remove the live dummy franchise number `+91 98765 43210` | S | ₹0 |
| 9 | Reconcile claim inconsistencies ("100+ Items" vs 23; "500+ Lovers" vs "thousands") | S | ₹0 |
| 10 | Pincode/serviceability check before payment | M | ₹15k–30k |

### GOOD-TO-HAVE
| # | Task | Effort | Cost |
|---|---|---|---|
| 1 | Van tracker promoted from pill to flagship page with route calendar + "notify me" | M | ₹25k–50k |
| 2 | Society waitlist pages (shares infra with item 1) | M | ₹15k–30k |
| 3 | Rewrite the shipping policy around the van (it currently describes couriers) | S | ₹0 |
| 4 | Real review integration replacing the 8 unverifiable testimonials | M | ₹0–2,500/mo |
| 5 | Domain email (currently two different Gmail addresses) | S | ₹150/user/mo **[Est.]** |
| 6 | Fill or remove the empty "Weekly Specials" tab — it should hold the weekly drop | S | ₹0 |

---

# Consolidated cost summary

| Touchpoint | One-time **[Est.]** | Monthly recurring **[Est.]** |
|---|---|---|
| 1. Subscription | ₹40,000 – ₹90,000 (dev, if headless) | ₹0 → ₹2,200 (Shopify Subs free → Seal) |
| 2. Lifecycle flows | ₹0 – ₹20,000 (templates/setup) | ₹2,400 – ₹3,200 (AiSensy + messages + GST) |
| 3. Gifting + referral | ₹15,000 – ₹60,000 (packaging run + cards) | ₹0 (manual referral) |
| 4. Doorstep kit | ₹4,000 – ₹10,000 | ₹1,500 – ₹3,000 (note cards at volume) |
| 5. Shorts + LinkedIn | ₹0 | ₹0 – ₹1,500 |
| 6. Site reskin | ₹1,20,000 – ₹3,50,000 | ₹0 |
| **Total** | **₹1,79,000 – ₹5,30,000** | **₹3,900 – ₹9,900** |

The spread is dominated by one decision: **the storefront architecture**. Path B (migration) raises the one-time number and collapses both the subscription dev line and the long-run monthly trajectory.

---

# Recommended sequencing within the quarter

| Weeks | Focus | Why now |
|---|---|---|
| **1–2** | **Corporate Diwali outreach** + gift SKU spec + packaging supplier. Storefront path decision. Handwritten notes and hand bell live | Diwali corporate window closes early September — this is the only genuinely time-boxed item in the document. The doorstep items cost under ₹10,000 and ship this week |
| **3–5** | Reskin + SEO remediation begins. WhatsApp API live with utility templates. Flows 1–3. Boxes ordered by 20 Sep | The reskin is the long pole; start it while gifting runs in parallel |
| **6–8** | Consumer gift pre-orders live by 15 Oct. Subscription plumbing. Fillo+ perk layer. Shorts + LinkedIn cadence starts | Content engine needs runway before it compounds |
| **9–12** | Subscription launch + society waitlist pages + Bread Captains. Give-a-Loaf referral. Diwali delivery waves (26 Oct – 8 Nov) | Subscription launches into a warm, festive-primed list rather than a cold one |

**One dependency to respect:** the subscription should launch *after* the weekly drop has an established rhythm — a standing order needs an existing habit to convert, and the drop is what creates it.

---

# Sources

**Subscription apps and pricing**
- https://apps.shopify.com/shopify-subscriptions — Shopify Subscriptions (first-party, free)
- https://www.launchtip.com/blog/the-essential-guide-to-the-native-shopify-subscriptions-app
- https://craftshift.com/shopify-native-subscriptions-vs-third-party-apps-2026/
- https://www.loopwork.co/blog/recharge-vs-seal-vs-loop — Seal tier pricing
- https://www.getonecart.com/shopify-subscription-apps/
- https://subscribfy.ai/blogs/appstle-shopify-app-complete-review-and-better-alternatives-in-2026 — Appstle tiers
- https://www.digismoothie.com/app/appstle-subscriptions
- https://support.getrecharge.com/hc/en-us/articles/360008682914-Recharge-billing-and-pricing
- https://www.ringly.io/blog/recharge-subscriptions-pricing — Recharge $99 + 1.49% + $0.19
- https://app-compare.com/pricing/recharge/

**Bakery / CSA subscription model design**
- https://www.sustainweb.org/realbread/community_supported_baking/ — Community Supported Baking prepaid share model
- https://crescentbakes.com/products/cobble-hill-bread-csa
- https://gardinerbakehouse.com/bread-subscription
- https://butterbakerycafe.com/csb — community bakery shares
- https://findhomegrown.com/blog/farm-stand-csa-subscription — rotation-to-prevent-fatigue practice

**Society / milk-delivery model**
- https://www.milkbasket.com/ and https://www.milkbasket.com/terms-and-conditions.html — wallet prepayment, 7 AM delivery
- https://startuptalky.com/milkbasket-success-story/
- https://businessmodelcanvastemplate.com/blogs/how-it-works/milkbasket-how-it-works — no minimum order value, density economics
- https://www.mypminterview.com/p/business-case-milkbasket-quick-commerce-strategy
- https://www.desidime.com/discussions/milkbasket-charging-175-per-month-for-subscription — ₹160–175/mo subscription fee (user-reported)
- https://www.icoderzsolutions.com/blog/country-delight-business-model/ — local hubs, vacation pause
- https://deonde.co/blog/country-delight-business-model/
- https://www.nobrokerhood.com/blog/apartment-rules-and-regulations-in-bangalore/ — RWA approval requirements
- https://www.myhoardings.com/RWABranding/rwa-activation-bangalore/
- https://www.indiamart.com/proddetail/rwa-activities-services-2850958336030.html — ₹15,000/day RWA activation (single vendor, indicative)

**Churn benchmarks**
- https://retentioncheck.com/churn-benchmarks/meal-kit-subscriptions — 10.8% avg, 8–15% band
- https://eightx.co/blog/meal-kit-subscription-churn-rate-benchmark
- https://eightx.co/blog/average-subscription-churn-rate-by-category
- https://www.subjolt.com/guides/churn-rate-benchmarks/
- https://churncost.com/ecommerce

**Email / WhatsApp pricing and lifecycle**
- https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-messaging/email/pricing — 10,000 free/mo, $1/1,000
- https://changelog.shopify.com/posts/volume-pricing-for-shopify-email
- https://www.omnisend.com/blog/klaviyo-pricing/ — Klaviyo tiers
- https://www.usecarly.com/blog/klaviyo-pricing/ — active-profile billing change
- https://www.retainful.com/blog/klaviyo-pricing
- https://chatmaxima.com/whatsapp-api-pricing/india/ — India per-message rates
- https://whautomate.com/whatsapp-business-api-pricing-india — Jan 2026 ₹0.8631 marketing rate
- https://blueticks.co/blog/whatsapp-business-api-pricing-2026 — per-message billing from 1 July 2025
- https://aisensy.com/pricing — AiSensy ₹1,500 / ₹3,200
- https://codingclave.com/blog/wati-vs-interakt-vs-aisensy-2026 — Wati tiers, Shopify add-on
- https://aisensy.com/aisensy-vs-interakt-vs-wati
- https://www.klaviyo.com/products/email-marketing/benchmarks — 2026 email benchmarks
- https://www.darkroomagency.com/observatory/email-marketing-benchmarks-ecommerce-2026 — welcome/post-purchase/win-back flow performance
- https://www.digitalapplied.com/blog/klaviyo-lifecycle-email-flows-ecommerce-2026-playbook

**Loyalty / frequency pricing**
- https://www.choicehacking.com/2020/05/09/panera-customer-experience/ — Sip Club psychology, sunk cost
- https://www.panerabread.com/en-us/mypanera/subscription.html
- https://www.lowermysubs.com/blog/panera-sip-club-worth-it-2026 — +200% visit frequency, +70% food attachment, 1-in-4 transactions
- https://www.thestreet.com/restaurants/panera-major-sip-club-change

**Gifting**
- https://confettigifts.in/blogs/blogs/diwali-2026-date-gift-hamper-ideas — Diwali 8 Nov 2026
- https://www.1800giftportal.com/blog/when-is-diwali-in-2026.html
- https://habbaa.com/blogs/news/diwali-hampers-for-corporates-premium-custom-gifting-ideas-2026 — 6–8 week lead times, bake/roast-to-order scheduling
- https://thegourmetstories.com/blogs/news/how-to-choose-corporate-gift-hampers-in-india-2026-guide — early-October ordering, September booking-out
- https://www.woofern.com/diwali-corporate-gifts
- https://impressioncart.com/collections/rigid-boxes — rigid box pricing, MOQ
- https://www.tradeindia.com/products/custom-printed-food-packaging-box-c9577852.html — ~₹25/box entry
- https://www.vaishaliadsprints.in/handmade-rigid-boxes-gift-boxes.html — Diwali hamper rigid boxes
- https://www.localcircles.com/a/press/page/india-gifts-survey — ₹1.8 lakh crore, 53% prefer sweets/bakery (via prior research)

**Referral**
- https://www.rivo.io/blog/shopify-referral-program-app
- https://www.referralcandy.com/blog/7-best-shopify-referral-apps-to-grow-your-store-in-2025
- https://www.logbase.io/blog/shopify-referral-apps — UpPromote/Growave/Rivo tiers
- https://bloop.plus/blog/best-shopify-referral-apps/
- https://apps.shopify.com/collections/referral-apps

**Doorstep kit**
- https://dir.indiamart.com/impcat/printed-apron.html — ₹49–59/piece bulk aprons
- https://www.muniuniforms.com/post/company-uniform-t-shirt-india-guide-2026 — polo from ₹499, 7–10 day lead
- https://www.almamaterstore.in/blogs/blog/how-much-do-bulk-team-t-shirts-cost-in-india — ₹150–200/piece all-in at 200+
- https://www.vihaaninternational.com/blog/bulk-tshirt-manufacturing-cost-india — ₹120–400 range, embroidery +₹80–150
- https://ilogo.in/custom/aprons.html
- Kim, Choi & Kim, "Do Handwritten Notes Benefit Online Retailers? A Field Experiment," *Journal of Interactive Marketing*, 2022 (n=1,232 RCT) — via https://app.sciencesays.com/p/handwritten-notes
- https://medium.com/swlh/the-ingenuity-of-the-ice-cream-van-jingle-8e53e27276e7 — Harry Burt, bells origin, nostalgia mechanism
- https://en.wikipedia.org/wiki/Ice_cream_van
- https://www.teamlewis.com/asia/magazine/sonic-branding-turn-up-your-brand-recall-recognition/ — Veritonic 77% recall, Tostitos +38%
- https://www.audiocontentlab.com/blog/sonic-branding-and-audio-logos/

**YouTube Shorts / LinkedIn**
- https://miraflow.ai/blog/youtube-shorts-seo-2026-how-to-rank-shorts-in-search — title/description/tag/caption rules
- https://hypenest.ai/blogs/youtube-shorts-seo-complete-guide-2026
- https://hashtagtools.io/blog/youtube-shorts-hashtags-title-vs-description-2026 — first 3 hashtags render above title
- https://www.autoshortshub.com/guides/youtube-shorts-seo-description-tags
- https://kompozy.io/repurpose-from/instagram-reels-to-youtube-shorts — watermark suppression
- https://wink.ai/instagram-watermark-remover
- https://vmake.ai/erase-reel-watermark-from-instagram
- https://short.now/tools/reels-to-youtube-shorts/
- https://www.makerstations.io/film-once-post-everywhere-a-makers-guide-to-repurposing-shorts-without-the-watermark/
- https://www.linkedin.com/help/linkedin/answer/a553432 — **official**: Showcase → Company conversion supported, irreversible, via support
- https://www.linkedin.com/help/linkedin/answer/a563141 — Showcase Page FAQs
- https://socialrails.com/social-media-terms/linkedin-showcase-page
- https://www.tryordinal.com/blog/linkedin-showcase-pages

**Site reskin / dev cost**
- https://www.goodfirms.co/blog/shopify-store-development-cost-in-india — ₹15K–₹5L+ range
- https://www.webshark.in/blogs/shopify-development-cost-in-india/ — agency ₹1,500–4,000/hr
- https://www.thriftizer.com/shopify-development-cost-india
- https://rajeshrnair.com/blog/business/business-strategy/shopify-store-development-cost-india — ₹1.2L redesign comparable
- https://shopexperts.com/help/pricing/shopify-theme-customization-cost
- https://www.goodfirms.co/blog/cost-to-hire-nextjs-developer — Next.js premium over React base
- https://www.aalpha.net/articles/how-much-does-it-cost-to-hire-a-reactjs-developer/ — India $22–30/hr
- https://www.index.dev/blog/React-Developer-Hourly-Rates-in-2025-Global-Cost-Guide

**Internal prior research referenced**
- `/Users/4bhinav/nuvio/fillobakes/research/website.md` — component inventory, SEO defects, Fillo+ mechanics
- `/Users/4bhinav/nuvio/fillobakes/research/touchpoint-benchmarks.md` — handwritten-note RCT, referral, loyalty, subscription LTV, festive gifting benchmarks
- `/Users/4bhinav/nuvio/fillobakes/research/touchpoints-client.md` — tertiary bucket definition
