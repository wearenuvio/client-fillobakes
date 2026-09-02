# Fillo Bakes — Page specs v2 (everything after home / shop / product)

Follows design/DESIGN-v2.md tokens, components and directives (§6). Mobile first. One eyebrow, one headline, ≤2 sentences per section. No repeated facts. No "[TBC]". Copy below is final unless it reads wrong in place.
Defaults assumed while the client sleeps: delivery ₹49, free over ₹499 · Fillo+ free, phone based · Standing Order 3 plans · fake OTP 1234 · stylised van map.

Psychology principles applied everywhere: reduce choices at each step (one primary button per screen), show progress and certainty near money (price shown once, delivery inside it), make waiting feel like craft (bake status), make sold-out warm not apologetic, put the reason-to-return right after the reward moment (order confirmation).

---

## Cart drawer (global)
Right sheet on desktop, bottom sheet on mobile (90vh, drag handle). Title "Your order" (serif 28). Lines: 64px cutout in a small well, name, qty stepper, line price. Below lines: **Delivery row** — "Deliver to Indiranagar · change" (opens the area/lane sheet) or, if unset, "Where should we bring it?" + small "Set area" secondary button. **Free delivery meter**: thin bar + "₹120 more for free delivery" (hide when reached: "Free delivery"). Totals: Items, Delivery (₹49 or Free), Total (serif 24). One primary button "Checkout · ₹449". Empty state: cutout of a bun at 50%, "Nothing in your order yet." + primary "See the menu". Sticky bottom cart bar on shop/product pages when items > 0: "2 items · ₹449 · View order".

## Area & lane sheet (global, opened from cart or dark band)
Step 1 "Where should we bring it?" pincode or area input with 6 mock suggestions. Result states: served → "We deliver to Indiranagar Tue, Thu and Sat." · van only → "The van stops in Banaswadi on Saturdays. Home delivery coming soon." · not yet → "Not yet in Whitefield. Leave your number and we'll tell you first." (phone input + "Notify me"). Step 2 "How do you want it?" two cards: **Home delivery** ₹49 · "Two-hour window, to your door." / **Catch the van** Free · "Pick a stop, we hold your order on board." Picking one closes the sheet and updates the chip in the cart. Never more than two steps.

## Checkout `/checkout` (one page, four blocks, mobile stacked; desktop 2 columns with order summary sticky right)
Header: serif "Checkout" + small "Your order, once. Delivery is already inside the total."
1. **Your order** — compact lines, edit link back to cart. Summary card: items, delivery, total (serif).
2. **Where** — shows the chosen area + lane as a card with "Change". Home delivery: address form India-shaped: House / flat, Building or society, Landmark (optional), Area (prefilled). Catch the van: stop selector (list of this route's stops with time bands, one pre-selected).
3. **When** — date chips (next 7 days, disabled ones carry a small "Orders closed" line under them; today disabled after 8pm), then time windows (12–2, 2–4, 4–6, 6–8; van lane shows the stop's band only). One line under: "Order by 8pm for next-day delivery."
4. **Who and pay** — phone input (+91), "Send code" → 4 boxes OTP (mock 1234), success tick replaces the boxes with "Verified · +91 86189 06902 · change". Name (optional), email "for your receipt" (optional). Pay: UPI primary card (Google Pay / PhonePe / Paytm logos as text chips), Card, Cash at the door (+₹30, first order). Primary button full width "Pay ₹449" → mock 1.5s "Confirming with your bank…" → /order/FB-1042.
Edge states: OTP wrong ("That code didn't match. Try again or resend."), slot filled while on page (toast + auto-select next), cart empty (redirect to /shop with toast "Add something first").
No promo-code hunting field visible by default: "Have a code?" as a ghost link that reveals an input (kills the abandonment-to-hunt-coupons behaviour).

## Order confirmation `/order/[id]`
Big serif "Got it, Riya." · "Your order is on Saturday's list. We'll message you Friday night with the exact window." · Order card: items, total, where, when, a WhatsApp "Message us" ghost link. **Bake status** (BakeStrip restyled, 4 steps: Ordered · Baking · On the van · Delivered; timestamps when known, otherwise the expected day). Then the reason-to-return: if orderCount ≥ 2 → Standing Order card "You've ordered the shokupan twice. Want it every Saturday? Skip any week." button "Set it up"; else → Fillo+ card "Join free, earn 9 coins on this order." button "Join with this number" (one tap since phone verified). Footer link "Track the van on Saturday".

## The Van `/van`
Hero (paper): script "Bread that comes to your street." · display-2 "The van" · one sentence "Every morning we bake, then drive fixed routes across Bengaluru. Catch it at a stop, or track it to your door."
**Status card** (the truth): LIVE → "On the Indiranagar run · 2 stops away from you · around 4:40–4:50". OFF AIR → "Back tomorrow, 3:30pm, Koramangala run." Never minutes-precise ETA. Small "Updated 9s ago".
**Map**: stylised illustrated route (SVG; cream ground, chocolate line, terracotta van marker, stop dots with names, faint wheat line art). Off air: the route drawn, no marker.
**This week** : 7 day strip, each day a route name + stops + bands; today highlighted. Tap a day → stops list.
**Notify me**: "One WhatsApp when we're two stops away. Never more than one a day." phone + button. Confirmation: "Done. We'll message +91 … on Saturday."
**Bake strip** for today (Mixed 4:10 · Baked 5:40 · Loading 3:10 · On the road) when live.
Routes `/van/[route]`: name, days, stops with bands and a landmark, "Catch it here" → sets area+lane and opens cart.
Areas `/areas/[area]`: "Do we reach Indiranagar?" + answer card + days + CTA "Order for Tuesday". Index `/areas`: 6 tiles.

## Standing Order `/standing-order`
Hero (peach): script "Your bread, every week." · display-2 "The Standing Order" · "Pick a plan, pick a day. Skip any week, pause any time."
**Plans** (3 cards, middle one "Start here" badge): The Loaf ₹200/wk (one milk shokupan) · Loaf and buns ₹499/wk (a loaf + two an pan of your choice) · The Family ₹899/wk (two loaves, four buns, one sando). Each: what's inside as small cutouts, "Choose" secondary button.
**How it works** (3 sketched steps with line art): Choose your bread · Choose your day and stop · We bake it fresh, every week.
**Promises** row: Skip any week · Pause any time · Change what's inside · No lock-in.
FAQ (4 items). Primary CTA repeats once at the bottom "Start with The Loaf".

## Fillo+ `/fillo-plus`
Hero (paper): display-2 "Join free. Earn on every order." · "2 coins for every ₹100. 25 coins is ₹25 off." · phone input + "Join free" (OTP sheet). Three small cards: Coins on every order · Early access to new bakes · Van alerts on WhatsApp. One line for founding members: "Joined for ₹1 before September? You're a founding member. Your coins and perks stay." Nothing else.

## Login `/login`
Centered card: serif "Welcome back" · phone · OTP (1234) · "We'll never call you. Only bread updates." Returning user → /account.

## Account `/account/*` (mobile: top tabs scroll; desktop: left list)
- **Home**: greeting, next delivery card (when, where, items, "Change"), coins chip, quick links.
- **Orders**: list cards (date, items summary, total, status chip: Placed · Baking · On the van · Delivered · Cancelled). Detail: bake status + "Order again" primary.
- **Standing Order**: plan card, next delivery with "Skip this week" (confirm sheet: "Skip 12 Oct? You won't be charged."), Pause / Resume, Change day and stop, Change what's inside (sheet with cutouts + steppers, plan price recalculates), Cancel (confirm, offers pause first). States: paused banner, payment failed banner with "Retry", route changed notice.
- **Rewards**: big coin count (serif 64) + progress bar to next ₹25 + "Redeem ₹25" when ≥25 + ledger list.
- **Addresses**: cards + add sheet (India-shaped form).
- **Alerts**: WhatsApp toggles (order updates, van near me, Sunday email).
- **Settings**: name, phone (change via OTP), email, delete account (confirm).
Keep every screen to one primary action.

## Our Story `/about`
Hero split (photo left: hands tearing bread; right: italic display-2 "Baked the Japanese way, without a single egg.") · founders paragraph (Neha and Nischal, December 2025, 300 tasters) · **Three sketched steps** "How we bake": Mix and rest · Shape by hand · Bake at dawn and drive · photo band (cooling rack) · "Why eggless" 2 sentences · CTA "See the menu". Nothing about hydration percentages.

## Journal `/journal`, `/journal/[slug]`, Guides `/guides/[slug]`
List: card with photo, title serif 24, one line, date. Post: 68ch prose, serif h2s, one photo, "Pairs well with" 2 cards at the end. Teasers show "Coming soon" tag, no fake body.

## FAQ `/faq`
Grouped accordion: Ordering · Delivery and the van · The bread · Standing Order and Fillo+. 15 real Q&As from src-content. WhatsApp link at the bottom "Still wondering? Message us."

## Contact `/contact`
Two columns: details (WhatsApp, email, hours, Bengaluru) + a 3-field form (name, phone, message). Toast "Sent. We reply within a day."

## Franchise `/franchise`
Short: why partner (3 cards), form (from src-content fields, real contact), no dummy numbers.

## Policies `/policies/*`
One layout: serif title, updated date, contents list, prose. Shipping policy rewritten for the van and windows.

## 404 / 500 / offline
Cutout of a bun, serif "Nothing here yet." · one button "See the menu".

## QA checklist per page
375 and 1280 screenshots; no clipped text; equal card heights; tap targets; empty/sold-out/error states; console clean; no TBC; lighthouse mobile perf ≥ 85 on home (images sized, fonts preloaded).
