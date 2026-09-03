# Phase 3 — cross-owner requests

Raised by the account / content pass. Everything here sits outside that pass's
ownership (DESIGN-v2 §6 hand-off), so it is logged rather than edited.

---

## 1. RESOLVED — the two `pnpm typecheck` errors

`OtpField.tsx` was missing `whatsappFallback` / `onWhatsappFallback`, and
`SlotPicker.tsx` was missing `cutoffNote`, so `LoginForm` and `CheckoutPage`
would not compile. Both were fixed by their owners while this pass was running.
`pnpm typecheck`, `pnpm lint` and `pnpm build` are all clean as of this note.
Left here only so nobody re-opens it.

---

## 2. Navy cutout shadow still hard-coded in six components

`drop-shadow-[0_18px_24px_rgba(4,33,47,0.35)]` is the v1 navy contact shadow.
DESIGN-v2 §1 replaced it with `--cutout-shadow` / `--cutout-shadow-sm`, exposed
as the `.cutout` and `.cutout-sm` utilities in `globals.css`. On cream paper the
navy version reads grey-blue under every cutout.

Fixed in this pass: `pages/account/ItemThumbs.tsx`,
`pages/account/ItemPicker.tsx`, `pages/content/CutoutWell.tsx`.

Still to do, by owner:

| File | Owner |
|---|---|
| `blocks/Hero.tsx` (also a navy `linear-gradient` scrim, line 132) | home |
| `blocks/ThreeDoors.tsx` | shop |
| `pages/commerce/ProductGallery.tsx` | product |
| `pages/home/BoxCard.tsx` | home |
| `pages/home/BoxBuilder.tsx` | home |
| `pages/home/SoldOutBand.tsx` | home |

Swap the arbitrary value for `cutout` (hero scale) or `cutout-sm` (thumbnail
scale). No other change needed.

---

## 3. `AccountNav` labels changed: "Account home" is now "Overview"

`ACCOUNT_NAV` is exported from `pages/account/AccountNav.tsx` and consumed by
`AccountHome`. Nothing else imports it today. Flagging only in case a header or
footer link is written against the old label later.

---

## 4. `/standing-order` still carries the v1 plan model

PAGES-v2 fixes three plans — The Loaf ₹200/wk, Loaf and buns ₹499/wk, The
Family ₹899/wk — but `mock-data.json`'s subscription fixture is still the
single v1 plan at `weeklyPrice` 180 against a `listPrice` of 200, carrying a
`priceConfidence` TBC string. `/account/subscription` renders the fixture and so
shows ₹180/week, which will not match the three cards on `/standing-order` once
that page is rebuilt.

The account pass suppresses the TBC string (it never renders) but cannot change
the number without changing the fixture every other subscription surface reads.
**Owner:** whoever rebuilds `/standing-order`. **Fix:** add the three plans to
`mock-data.json` and point `getSubscription()` at "The Loaf".

---

# Raised by the commerce pass (cart · area sheet · checkout · order · login)

## 5. Items 1a and 1b above are closed

Both were the commerce pass's to fix and both are fixed.

- **1a** — `LoginForm` no longer passes `whatsappFallback` / `onWhatsappFallback`.
  The login card is now phone → four boxes → `/account`, per PAGES-v2 "Login",
  and the WhatsApp fallback is gone with the six-digit code. `OtpField` no
  longer declares those props, so the README's OtpField row is stale on that
  point.
- **1b** — `SlotPicker` and `CheckoutPage` now agree on `note`. `cutoffNote`
  and `cutoffWarning` are gone: the rail states the reason under each disabled
  chip instead of carrying a separate warning bar.

## 6. The OTP is four digits now, and the mock code is 1234

PAGES-v2 fixes both: "phone + OTP 1234", "4 boxes OTP (mock 1234)".
`OtpBoxes` therefore defaults to `length = 4` (`OTP_LENGTH`), and the
wrong-code path is anything that is not `"1234"`.

Four surfaces outside this pass still hard-code the old six-digit failure
sentinel and will now always succeed, because a four-box group can never
produce `"000000"`:

| File | Owner |
|---|---|
| `pages/van/JoinFilloPlus.tsx` | van |
| `pages/account/SubscriptionBuilder.tsx` | account |
| `pages/account/SettingsPanel.tsx` | account |

**Fix:** compare against `"1234"` (or import `OTP_CODE` once someone gives it a
home in `lib/config.ts` — worth doing, it is now written out in three places).

Also new and reusable, from `ui/OtpField.tsx`: `PhoneInput`, `VerifiedPhone`
and `formatIndianPhone(digits)` — the `+91 86189 06902` shape. Anything
rendering a phone number by hand should use the last one.

## 7. `AreaLaneSheet` is two steps; `AreaLaneSheetBody` and `SheetStep` are gone

PAGES-v2 caps the sheet at two steps and three results, so the nine-step
version is replaced. The public API is unchanged for callers —
`<AreaLaneSheet open onClose />` — and `initialStep` is gone because there is
no longer a step worth deep-linking to.

`pages/commerce/ProductBuyBlock.tsx` and `pages/commerce/ShopBoard.tsx` both
still import it and both still compile; neither is reachable from `app/`
today, so if the product and shop passes have finished with them they are dead
code and should go.

## 8. `mock-data.json` has no order `FB-1042`

PAGES-v2 sends checkout to `/order/FB-1042`, and the fixture's order ids are
`FB-DDMM-NNNN`. The confirmation therefore builds that order itself, in
`pages/commerce/confirmation.ts`: live from the cart and session when you have
just paid, and from a small local fallback when the link is opened cold.

**Fix, if the fixture is ever the better home for it:** add an order `FB-1042`
in the just-placed state (nothing done but `ordered`, `canChange: true`) and
`orderView()` will pick it up with no code change.

## 9. Two confirmation CTAs point at pages this pass does not own

The reason-to-return card is chosen by `customer.orderCount` (3 in the
fixture, so the Standing Order card is what renders today):

- `orderCount >= 2` → **"Set it up"** → `/standing-order`
- otherwise → **"Join with this number"** → `/fillo-plus`

The second is a plain link. PAGES-v2 wants it to be genuinely one tap, since
the number is already verified at that point — that needs a join action on the
Fillo+ side that accepts an already-verified session phone
(`useSessionStore(s => s.phone)`, with `phoneVerified`). **Owner:** Fillo+.

## 10. Indiranagar runs one day a week, which the date rail has to allow for

`checkoutDays()` returns today plus the next **seven** days, not six. Every
area's delivery days are its route's run days, and `route_indiranagar` runs
Saturdays only — a seven-chip rail opened on a Saturday contains exactly one
Saturday, today, whose 8pm cut-off passed last night. The rail would have had
no selectable day at all. Eight chips guarantee at least one, on every route.

If the fixture ever gives the served areas a second weekly run, this can go
back to seven.

## 11. `store/session.ts` gained three fields (additive)

`phone`, `phoneVerified` and `customerName`, with `setPhone` and
`setCustomerName`. Checkout writes them; the confirmation reads them to greet
by name and to know the number is already verified. Persisted like the rest, no
version bump needed — absent keys read as `null` / `false`.

## 12. `CartPage` no longer takes props

`/cart` is now the drawer's full-page twin: lines, delivery row, meter,
totals, one button. The run switcher, the hold timer, the coins panel and the
suggestion grid are gone with it, so `app/cart/page.tsx` no longer reads
`board-data`, `run`, `getCartReservation`, `getLoyaltyLedger` or `getOnBoard`.
Nothing else imports `pages/commerce/HoldTimer.tsx` or
`pages/commerce/CartLines.tsx` now — candidates for deletion once the shop and
product passes confirm they are done with them.

## 13. `SubscriptionPlanCard` restyled to v2, plus one additive prop

**Owner:** The Van / Standing Order / Fillo+ pass.

The card was still on the v1 surfaces (`bg-paper-0`, `border-paper-300`,
`text-kiln`, `bg-warning-tint` banners). It is now on the v2 card/peach
grounds with a 1.5px ink hairline for the recommended state. **Every existing
prop is unchanged**, so `styleguide` and the account pages compile untouched.

One prop is new and optional: `contents?: PlanContent[]` (`{slug, src, name}`),
which draws what is in the plan as small cutouts on a well above the price.
`/standing-order` passes it; nothing else has to.

Two behavioural changes worth knowing about if you render the card elsewhere:
the action moved to `mt-auto`, so buttons bottom-align across a row of cards of
unequal height, and the default action is now `secondary` rather than
`primary` — a page of three plans should not carry three accent buttons.

## 14. `OtpField` hard-codes six boxes; PAGES-v2 specifies a four-digit code

**Owner:** whoever owns `ui/OtpField.tsx`.

PAGES-v2 says the mock OTP is `1234`, and checkout's spec says "4 boxes OTP".
`OtpField` renders `OtpBoxes` with the default `length = 6` and does not
forward a `length`. Fillo+ therefore composes `OtpBoxes length={4}` directly
inside its own sheet rather than using `OtpField`'s code step.

The one-line fix is a `length?: number` prop on `OtpField` passed straight
through to `OtpBoxes`. Then Fillo+, login and checkout can all share the same
component instead of two of them re-implementing the chrome around the boxes.

## 15. Fixture bugs in `mock-data.json` that the van pages had to work around

**Owner:** whoever maintains `src-content/mock-data.json`.

1. `vanState.alternateStates.no_run_today` and `.route_cancelled` do not carry
   a `status` key, so `getVanState()` merges them over the live state and they
   come back as `status: "live"`. A page trusting `van.status` shows a pulsing
   LIVE pill above the headline "No run today". `/van` therefore derives its
   tone and its pill from the requested **variant**, not from `van.status`.
   Adding `"status": "off_air"` to both would let the status field be trusted.

2. `vanState.bakeStrip` stamps `proofed` at 08:30 and `baked` at 05:40 — a
   loaf proofed three hours after it was baked. `/van` prints Mixed, Baked and
   Loading (the three PAGES-v2 names) and leaves `proofed` out rather than
   printing a sequence that contradicts itself.

3. Every served area's `nextRun` / `nextRunLabel` is in the past relative to
   `meta.asOf` (Banaswadi "Monday 28 September", Koramangala "Thursday 1
   October", asOf is 3 October). The van pages compute the next run day from
   the route's `runDays` instead, counting from **tomorrow** because orders
   close at 8pm the evening before a run.

4. `areas[].waitlist.copy` contains a literal `[TBC]` ("At [TBC] requests we
   add the route"), which DESIGN-v2 §4 forbids rendering. `/areas/[area]` uses
   `waitlist.requests` and writes its own sentence around it.

## 16. Six of the twelve neighbourhoods on a route have no `/areas/[area]` page

**Owner:** content / mock data.

`routes[].areas` names Domlur, Ejipura, Kalyan Nagar, Ramamurthy Nagar and BTM
Layout, none of which appear in `areas[]`. `/van/[route]` links only the
neighbourhoods that resolve through `getArea()` and renders the rest as plain
text, so nothing points at a 404 — but somebody searching "Domlur bread
delivery" lands nowhere. Adding them to `areas[]` is all that is needed; the
route page picks them up automatically.

## 17. `next build` kills a running `next dev` (shared `.next`)

Both write `.next`, so running `pnpm build` while the dev server is up leaves
it serving 500s on every route until it is restarted. I hit this mid-pass and
restarted the dev server. Worth knowing if two people are in the repo at once:
run the build last, or give it its own `distDir`.

---

## 5. `ui/Field.tsx` is still on the v1 geometry

`Field` / `Input` / `Textarea` / `Select` / `Checkbox` / `Switch` render a 4px
radius on the darker `paper-400` hairline with a caps label welded to every
control. The rebuilt home and shop hand-rolled their inputs rather than use it,
which is the tell.

The account and content pass needed the v2 geometry — 48px control, 8px radius,
`--color-line` hairline on the card ground — for the contact, franchise,
address, settings, alerts and gift-card forms, and `ui/Field` is shared with
routes it does not own. So it wrote one: `components/pages/content/Form.tsx`
(`TextField`, `TextAreaField`, `SelectField`, `CheckRow`, `SwitchRow`,
`PillChoice`, `FieldLabel`).

**Request:** whoever owns `ui/` should either bring `ui/Field` up to v2 and let
`content/Form.tsx` be deleted, or agree that `content/Form.tsx` is the v2 kit
and retire `ui/Field`. Two form systems is the wrong end state either way.

---

## 6. `mock-data.json` gift-card and subscription TBC strings

`giftCards.expiryTbc` and `subscription.plan.priceConfidence` are TBC strings
that the account screens previously rendered as "still being decided" copy.
DESIGN-v2 §4 forbids that, so both are now suppressed and the surrounding copy
states the agreed default instead. The fixture still carries the strings.
Harmless, but worth clearing when the founders confirm the numbers.

---

## 7. `<InkArt parallax>` is now available site-wide — please use it

`components/ui/InkArt.tsx` is a client component now and takes a `parallax`
prop, **default on**. Two things happen when it is on:

- **Pointer drift.** The drawing follows the mouse by up to ±10px, lerped at
  0.08. There is exactly one `pointermove` listener and one animation frame for
  the whole page, in `components/ui/ink-pointer.ts`, ref-counted by the mounted
  drawings. It publishes the smoothed position as `--ink-px` / `--ink-py` on
  `<html>` and the offset is applied in CSS, so per-drawing cost is zero JS.
  Nothing runs on touch or under `prefers-reduced-motion: reduce`.
- **Scroll drift.** ±24px of translate across the section's own scroll range,
  as a CSS scroll-driven animation (`animation-timeline: view()`). No scroll
  listener. Browsers without it get no drift, which is a fine null state.

**Request for the account, content and van pages:** you get this for free —
your existing `<InkArt>` calls already have it. Two rules:

1. Pass `parallax={false}` for any drawing that is *contained illustration*
   rather than background: anything inside a fixed box with `overflow-hidden`
   (a tile, a step, a card mark). ±24px will push it out of the box and the
   box will clip it. Home does this on the category tiles and the Standing
   Order steps.
2. Leave it on for section-background art.

## 8. Line art is never clipped by a section edge

Client rule, Sep 2026: a drawing that does not fit whole gets shrunk or moved,
never bled off the edge. Every background placement on home now sits inside its
section — typically `bottom-[var(--section-y)]` with a small horizontal inset,
so its foot lands on the line the content ends on and `overflow-hidden` has
nothing to cut.

**Request:** the same sweep is needed on the account, content and van pages.
Most of the existing placements there use negative insets (`-right-4`,
`bottom-[-40px]`) and are currently cropped.

Two casualties worth knowing about:

- **The footer stalk is gone.** `wheat-stalk-v2` is 301×1200. At any width
  where it reads as a stalk rather than a scratch it is taller than the
  compacted footer, so it could only be cropped or sit under the link columns.
- **The dark band lost its two product cutouts and the wheat sheaf.** The van
  is now drawn at ~39% of the window per the client, and four objects could not
  all be placed clear of each other and of the edges.

## 9. `--section-y` never reaches the 96px the spec asks for

`--section-y: clamp(4rem, 1.6rem + 4.4vw, 6rem)` resolves to **81.92px at
1280**, not 96px — the ramp does not hit its own ceiling until ~1500px wide.
DESIGN-v2 §1 says "section padding 96px desktop / 64px mobile".

`clamp(4rem, 1.6rem + 5.5vw, 6rem)` hits exactly 64px at 375 and exactly 96px
at 1280. Not changed here: `--section-y` is shared by every page and this pass
was scoped to additive changes in `globals.css`. **Request:** whoever owns the
token should make the call, because right now every page on the site is 14px
short of its own spec at the width the client reviews at.

## 10. FSSAI licence number for the footer legal line

The client asked for "company + FSSAI" on the footer's bottom line. There is no
licence number anywhere in the repo — `TrustStrip.tsx` carries it as a `Tbc`
placeholder and `seo.json` notes in two places that it is unknown and blocks
complete `LocalBusiness` markup. DESIGN-v2 §4 forbids rendering a TBC string
and inventing a licence number is not an option, so the line ships with the
company, city and vegetarian status and no FSSAI.

**Request:** the real number from the founders, then one line in the footer and
the `LocalBusiness` node can both be finished.

## 11. Shop header should move to `PageHeader` when it lands

The shop's top block (`components/pages/commerce/ShopShell.tsx`) is built in the
same shape the content agent is extracting into `components/blocks/PageHeader.tsx`
— script line, display-2 heading, count, one lede. It did not exist when this
pass ran. **Request:** when it does, swap `ShopShell`'s header section for it,
with `karepan` art on `/shop` and `/shop/all` and the category's own art on
`/shop/[category]`.

## 12. Two copy repetitions the client's own briefs created

Both are client-specified strings, so they were left exactly as given rather
than silently edited. Flagging for a decision:

- **The marquee repeats the trust strip verbatim.** The new top marquee carries
  "Baked every morning" and "100% eggless"; the trust strip, one section below
  it, carries the same two phrases word for word. Two of four items are an echo
  within one screen.
- **"Order by 8pm" now appears three times on home** — the marquee, the hero's
  bottom-left line, and the dark band's headline ("Order by 8pm. At your door
  tomorrow.") — plus once more on every product page. DESIGN-v2 §6 caps a fact
  at two mentions.

Suggestion: drop "Baked every morning" and "100% eggless" from the marquee (the
trust strip owns them) and let the marquee carry only what nothing else says —
free delivery over ₹499, the van's no-fee stop, and the 8pm cutoff.

---

## 7. `components/blocks/PageHeader.tsx` — the shared page head (for the shop agent)

Every route outside home / shop / product now opens with this one component,
built from the journal header the client signed off. Home, shop and product
were left alone; adopting it there is the shop agent's call.

```tsx
<PageHeader
  script="Everything eggless."      // Caveat, terracotta, above the title
  eyebrow="Policies"                 // 12px caps label — use instead of script
  title="The menu"
  lede="Baked every morning. Order by 8pm for tomorrow."
  meta={<p …/>}                      // a date, a reading time, a cutoff line
  art="shokupan-loaf"                // one InkArt name, different per page
  artSize="sm | md | lg"             // 150 / 220 / 320px
  artAlign="right | corner"          // right (default) centres on the title row
  variant="default | compact"        // compact = account, cart, checkout, order
  surface="paper | paper-2 | peach"  // standing-order keeps peach
  italic                             // display italic title (Our story)
  actions={<…/>}                     // right slot: a chip, a button
  back={{ href: "/van", label: "The van" }}
  bare                               // no section/container, for use inside a column
>
  {/* anything that hangs under the lede: a tab rail, a form, a button */}
</PageHeader>
```

Two things worth knowing before you use it:

- **The drawing sits on the title row, not on the block.** Anything passed as
  `children` renders under a clear ground. Putting the art on the outer block
  instead puts it behind whatever the page hangs below the lede.
- **`bare`** drops the `<section>` and the container so the same header can
  live inside a column that already has gutters. That is how every
  `/account/*` screen gets it, through `AccountPage`.

Art assigned so far, one per route, so nothing repeats within a journey:
about `rolling-pin-and-flour-bag` · shokupan `shokupan-loaf` · journal +
journal post `croissant` · guides + guide `steam-swirls` · faq `wheat-pair` ·
contact `bakery-van` · franchise `oven-with-loaves` · policies
`wheat-stalk-v2` · 404/500/offline `crumbs-scatter` · van + van/[route]
`bakery-van` · areas + areas/[area] `wheat-stalk` · standing-order
`shokupan-loaf-v2` · fillo-plus `stamp-ring` · cart `anpan-bun` · checkout
`karepan` · order/[id] `crumbs-scatter` · login `wheat-pair` · account home
`anpan-bun`, orders `bakery-van`, subscription `shokupan-loaf-v2`, rewards
`stamp-ring`, addresses `fruit-sando`, alerts `steam-swirls`, settings
`wheat-stalk`, gift cards `wheat-pair-v2`.

Unused and free for home / shop / product: `wheat-stalk-light`,
`shokupan-loaf` variants on the dark band, `fruit-sando`, `karepan`.

---

## 8. `RevealOnScroll` causes a hydration attribute mismatch site-wide

Every page carrying `data-reveal` logs this in the console on first load:

```
A tree hydrated but some attributes of the server rendered HTML didn't match
the client properties.
+ className="… bg-paper-2 py-[var(--section-y)]"
- className="… bg-paper-2 py-[var(--section-y)] reveal"
```

`components/blocks/RevealOnScroll.tsx` adds the `reveal` class to
`[data-reveal]` sections before React hydrates, so the server HTML and the
client tree disagree on `className`. It reproduces on `/` as well as on
`/van`, `/areas/[area]`, `/standing-order` and `/fillo-plus`, so it is global
rather than anything a single page introduced.

**Fix:** render the `reveal` class in the server markup (add it to the
sections themselves and have the observer only set `data-revealed`), or move
the class toggle into an effect that runs after hydration.
**Owner:** whoever owns `RevealOnScroll`.

---

## 9. Three names added to `ui/InkArt`'s `ART` table

The second delivery of drawings — `sakura-sprig`, `sparrow-branch` and
`seigaiha-tile` — landed in `public/images/lineart` but not in the `ART` table
in `components/ui/InkArt.tsx`, which is what types `InkArtName`. Without an
entry the name is a type error, so this pass added the three rows with their
real intrinsic sizes (951×1122, 1068×940, 644×426). No other change to that
file. **Owner of `ui/`:** worth a glance, and worth adding the row at the same
time as the asset in future.

`seigaiha-tile` is a repeating pattern rather than a single drawing, so it is
not used through `InkArt` at all: it is a `background-repeat` layer behind the
account header in `AccountPage`, at 150px, opacity .06, masked to fade out
before it reaches the screen below.
