# Decisions log v2 (binding for build agents) — 2026-09-03

Sources reconciled: design/DESIGN.md, src-content/*, research/competitors/journey-recommendation.md (wins on flow), research/prior (input only).

1. **Framework:** Next.js 15 App Router + Tailwind v4 + TS, in `web/`. Front end only, mock data, Vercel target.
2. **Fulfilment = route runs.** Each route (area cluster) has RUN DAYS (mock: some routes 3×/week, one daily). Cutoff **8pm the evening before a run**. Copy pattern: "Order by 8pm for Saturday's run" / "tomorrow's run". Two lanes: **Catch the van** (free, pick stop + band) and **Home delivery** (₹49, 2-hour window, free above ₹499 [TBC]). Lane + area chosen BEFORE cart via header chip (place · mode · next slot) and bottom sheet; catalogue browsable without it, every location-dependent answer asks for it.
3. **Fillo+ = FREE, phone-based membership/account layer** (coins 2/₹100, 25 = ₹25 off, no expiry; alerts; early access). ₹1 fee removed; existing ₹1 payers = "Founding member" badge.
4. **The Standing Order = weekly bread subscription**, a product inside Fillo+. Pitched at order #2 (confirmation of 2nd order + account), never on first visit hero. Manage: skip week, pause, change run day/stop, change contents, cancel, resume; payment-failed and route-changed states.
5. **Checkout:** one page, one domain, four blocks (lane+slot → items+total with delivery inside → phone+OTP identity, email optional "for your invoice" → UPI primary, COD limited). Total shown in drawer = total charged. Honest timers allowed only when wired to a real constraint (cart reservation, cutoff clock). No fake countdowns.
6. **Van:** `/van` page (live / off-air / stale / go-dark states; schedule is the content, map is garnish; stops not minutes), `/van/[route]` route pages, van strip widget in header/home, notify-me = WhatsApp opt-in sheet.
7. **Three doors** = a shop module, not an interstitial. Search field allowed. Honest supply counts only where mock data supplies them.
8. **Language:** English UI; kana only under product names; no Kannada in chrome; optional per-city local line.
9. **Design:** design/DESIGN.md + tokens.css authoritative. Logo navy #023D5D. No emoji. No gradients. Lucide.
10. **Every number true or clearly mock-tagged.** FSSAI, hydration, ferment, counts = [TBC] placeholders in data, rendered honestly.
11. **Contacts:** Instagram @fillo_bakes · WhatsApp +91 86189 06902 · wiseeatsindia@gmail.com · Bengaluru · Mon–Sun 10–19.

## FINAL ROUTE MAP (use exactly these paths)
PUBLIC
/                        Home
/shop                    This week's bake (run-aware) + category filter + search + "three doors" module
/shop/all                Full catalogue (23)
/product/[slug]          PDP
/boxes                   Curated boxes + build-your-own (mock 3 boxes)
/van                     Tracker (live/off-air/stale/go-dark)
/van/[route]             Route page (mock 4 routes)
/areas/[area]            Serviceability landing (mock 6 areas)
/standing-order          Subscription pitch + builder entry
/fillo-plus              Membership explainer
/gifting                 Send bread as a gift (light)
/gift-cards              Gift cards (light)
/cart                    Full-page cart (drawer primary)
/checkout                One page
/order/[id]              Confirmation + live status
/about                   Story + founders + van
/shokupan                Keep (SEO)
/guides/[slug]           what-is-shokupan, an-pan, how-to-store-shokupan, what-is-karepan
/journal, /journal/[slug]  8 posts (2 full)
/faq  /contact  /franchise
/policies/shipping | refund | terms | privacy | payment  (old /shipping etc. redirect)
ACCOUNT (phone+OTP)
/account  /account/orders  /account/orders/[id]  /account/subscription  /account/subscription/setup
/account/addresses  /account/rewards  /account/alerts  /account/gift-cards  /account/settings
AUTH  /login  /logout
SYSTEM  /404  /500  /offline
RETIRED (redirect): /blogpage→/journal, /fillo-plus/dashboard→/account/rewards, /shop/[slug]→/product/[slug], /track→/van, /signin→/login, /delivery→/areas, /fillo-plus/weekly-box→/standing-order

## v3 — 3 Sep 2026, after client review of v1 build (rejected)
- Visual system replaced: see design/DESIGN-v2.md and design/brand-direction-v1.html (client-approved). Palette "Butter paper" (cream/chocolate/terracotta), Instrument Serif + Hanken Grotesk + Caveat script, floating-cutout hero. Navy only inside the logo. No mono labels, no ticker, no hairline editorial system.
- Page priority is D2C: Crave → Choose → Believe → Get it → Come back. Route/run/cutoff/lane details demoted to cart drawer, checkout and /van.
- No "[TBC]" or internal notes ever render.
- Build order: home + shop + product first (client sign-off), then checkout/cart, van + standing order + fillo+, then account + content.
