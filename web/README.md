# Fillo Bakes — front end

Next.js 15 (App Router) · TypeScript · Tailwind v4 · zustand · lucide-react.
Front end only: every number on this site comes from a JSON fixture, and
nothing talks to a real back end yet.

**Phase 2a (this repo state) shipped the system.** Phase 2b fills the pages.

---

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build; must stay clean
pnpm lint         # eslint; must stay clean
pnpm typecheck    # tsc --noEmit
pnpm images       # rebuild the image manifest after adding cutouts
pnpm routes       # scaffold any missing placeholder route (never overwrites)
```

Two review surfaces:

| URL | What it is |
|---|---|
| `/styleguide` | Every component in every documented state, with the DESIGN.md clause it implements. Start here. |
| any route | A placeholder carrying real metadata, the real H1 and a "TODO Phase 2b" note naming what to build and which components to build it from. |

---

## The authorities

Read these before changing anything. Where they disagree, this is the order:

1. `research/DECISIONS.md` (v2) — the route map, the fulfilment model, the
   commercial facts. **Binding.**
2. `design/DESIGN.md` + `design/tokens.css` — the design system. **Binding on
   anything visual.**
3. `research/competitors/journey-recommendation.md` — wins on *flow* (what
   happens in what order), per DECISIONS §0.
4. `src-content/site-content.md` — the copy. Written to be pasted, not
   paraphrased.
5. `src-content/seo.json` — titles, descriptions, H1s and JSON-LD per route.

---

## Folder map

```
web/
├─ scripts/
│  ├─ generate-image-manifest.mjs   scans public/images → src/lib/generated/
│  └─ generate-routes.mjs           scaffolds missing placeholder routes
├─ public/
│  ├─ brand/                        the logo, from assets/logo/
│  ├─ images/products/              generated cutouts: <slug>.png / -v1 / -v2
│  └─ images/legacy/                photographs from the old site
└─ src/
   ├─ app/
   │  ├─ globals.css                THE DESIGN SYSTEM. tokens.css as @theme.
   │  ├─ fonts.ts                   next/font wiring
   │  ├─ layout.tsx                 fonts + <SiteChrome>
   │  ├─ not-found.tsx  error.tsx   404 and the runtime error boundary
   │  ├─ sitemap.ts  robots.ts      generated from the route map
   │  ├─ styleguide/                the review surface
   │  └─ …                          one directory per route in the map
   ├─ components/
   │  ├─ ui/                        primitives: Button, Field, Dialog, …
   │  ├─ blocks/                    composites: ProductCard, CartDrawer, …
   │  └─ styleguide/                review-page scaffolding only
   ├─ data/                         products.json · mock-data.json · seo.json
   ├─ lib/                          catalog · mock · seo · format · images · …
   └─ store/                        cart · session (both zustand + localStorage)
```

---

## The data layer

Three JSON files are copied verbatim from `src-content/` into `src/data/`.
**Re-copy them when the content agent updates them** — do not hand-edit the
copies.

```bash
cp ../src-content/{products,mock-data,seo}.json src/data/
```

### `lib/catalog.ts` — the 23 SKUs

```ts
getProducts()                    // all 23, catalogue order
getProductBySlug("milk-shokupan")
getProductsByCategory("anpan")
getCategories()                  // the six, with .count and .products
getCategory("breads")
getPairings("milk-shokupan", 3)  // "goes well with", resolved to real products
getBestsellers()                 // only the 8 the live home page calls favourites
getSignature()                   // the hero SKU
getPriceRange()                  // for the Bakery JSON-LD priceRange
getRedirects()                   // the dead /product/* URLs
```

`Product.kana` is the **kana alone**, with the romaji gloss stripped, and is
`null` when there is no verified reading. `Product.image` is already resolved
(see below) and is `null` when nothing exists.

### `lib/mock.ts` — the mocked back end

| Area | Getters |
|---|---|
| Customer | `getCustomer` `getAddresses` `getAddress` `getDefaultAddress` |
| Orders | `getOrders` `getOrder` `getOrderIds` `getLatestOrder` `getOrderStateCopy` `ORDER_STATUS_REFERENCE` |
| Standing Order | `getSubscription` `getSubscriptionState(variant)` `SUBSCRIPTION_STATES` |
| Loyalty | `getLoyaltyLedger` |
| Lanes | `getLanes` `getLane(id)` — ids are `catch_the_van` and `home_delivery` |
| Routes | `getRoutes` `getRoute` `getRouteSlugs` `getAllStops` `getStop` `getRoutesForArea` |
| Areas | `getAreas` `getArea` `getAreaSlugs` `getServedAreas` `resolveAreaQuery` `areaSlug` |
| Boxes / gifts | `getBoxes` `getBox` `getGiftCards` |
| Cutoff | `getCutoffClock` `getCutoffCopy(state)` `CUTOFF_STATES` |
| Cart hold | `getCartReservation` |
| Area chip | `getAreaChip` |
| Van | `getVanState(variant)` `VAN_STATES` `getOnBoard` `getStockFor` `getVanStripCopy` `getNotifyMeCopy` |
| Alerts | `getAlertPreferences` |
| TBC | `TBC` `isTbc(value)` `MOCK_META` `AS_OF` |

Two rules the data carries and the UI must honour:

- **A `null` timestamp means "has not happened yet".** Render it as an
  unticked step with an em dash — never as a guess. A fabricated bake strip is
  worse than no bake strip.
- **A TBC string is a founder placeholder.** Check `isTbc()` and say so, or
  omit the row. Never round a TBC into a confident number.

`getVanState()` takes any of `live · off_air · stale · off_route · go_dark ·
map_failed · no_run_today · route_cancelled · off_hours` and always returns the
same shape, because every state renders the **identical layout** — only the
content moves.

### `lib/seo.ts` — metadata and JSON-LD

```tsx
export const metadata = buildMetadata("/shop");

// dynamic:
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return buildMetadata(`/product/${slug}`, { ogImage: product.image?.src });
}

// in the page body:
<JsonLd
  path={path}
  crumbs={[{ name: "Shop", path: "/shop" }, { name: product.name, path }]}
  nodes={[productLd({ … })]}
/>
```

`buildMetadata` reads `seo.json` and returns title, description, keywords,
canonical, robots, OpenGraph and Twitter. It resolves a path by exact match,
then by `ROUTE_ALIASES` (a v2 path → its v1 seo.json entry, for anything the
content agent has not migrated), then by dynamic template, then by a derived
default — so a route that is missing from `seo.json` still ships valid
metadata rather than nothing.

Titles are emitted **absolute**: `seo.json`'s titles are authored and
length-tuned, and the layout template must not append a second brand suffix.

Node builders: `organizationLd` (always included by `<JsonLd>`), `bakeryLd`,
`websiteLd`, `breadcrumbLd`, `productLd`, `faqLd`, `articleLd`.

### `lib/format.ts` — numbers, dates, bands

`formatINR` `groupIndian` `formatShortfall` · `formatLongDate`
`formatShortDate` `formatDayMonth` `weekdayName` `slotChipParts` ·
`formatClock` `formatClockBare` `formatTimeOfDay` `formatTimeBand`
`formatTimeBandShort` `formatArrivalBand` · `formatPingAge` `formatCountdown` ·
`pluralise`.

Every date helper reads the ISO string's **wall-clock parts** rather than
constructing a `Date`, because the server's timezone and the browser's would
otherwise disagree and React would flag a hydration mismatch. All fixture
timestamps carry `+05:30`.

### `lib/images.ts` — product image resolution

```ts
resolveProductImage(slug, existingImage)
// 1. /images/products/<slug>.png       the delivered cutout
// 2. /images/products/<slug>-v2.png
// 3. /images/products/<slug>-v1.png
// 4. /images/legacy/<existingImage>    the old site's photograph
// 5. null                              caller renders the line-art placeholder
```

Slug spelling is normalised in both directions, because the generation
pipeline names files `…-anpan-…` while `products.json` uses `an-pan`.

**When new cutouts land in `assets/products/`:** copy them into
`web/public/images/products/`, drop the `-v1`/`-v2` suffix or leave it (both
resolve), then run `pnpm images`. The manifest is a generated file; do not
edit `src/lib/generated/image-manifest.ts` by hand.

### `lib/routes.ts` / `lib/content.ts`

`ROUTES` is the v2 route map, `RETIRED_REDIRECTS` is wired into
`next.config.ts`, and `legacyProductRedirects()` converts `products.json`'s
redirect array (skipping `to: null`, which means *do not redirect* —
`/shokupan` is the one page on the old site that ranks). `content.ts` indexes
the guides and journal posts out of `seo.json`.

---

## The stores

Both are zustand + `persist` to `localStorage`, both persist **primitives
only**, and both must be read behind `useHydrated()` anywhere the value
renders — the server cannot see `localStorage`, so the empty state renders
first and swaps after mount.

### `store/cart.ts`

```ts
const lines     = useCartStore((s) => s.lines);      // [{ slug, qty }]
const add       = useCartStore((s) => s.add);        // add(slug, qty = 1)
useCartStore((s) => s.increment | s.decrement | s.setQty | s.remove | s.clear)
useCartStore((s) => s.open | s.close | s.toggle)     // the drawer
```

Only `{ slug, qty }` is persisted; names, prices and images are looked up from
the catalogue at render, so a price change can never leave a stale number in
someone's browser. `decrement` at quantity 1 removes the line, matching the
stepper's `trash-2` affordance.

```ts
computeTotals(lines, lane) // → { count, subtotal, delivery, total,
                           //     toFreeDelivery, freeDeliveryEarned, coinsEarned }
qtyOf(lines, slug)
deliveryFeeFor(lane, subtotal)
```

**Delivery is inside `total`.** ₹49 home delivery, free over ₹499, free always
on the van lane. The total shown in the drawer is the total charged — never
"calculated at checkout".

### `store/session.ts`

Where the van meets you, chosen **before** the cart.

```ts
useSessionStore((s) => s.area | s.areaStatus | s.lane | s.stopId | s.date | s.band)
useSessionStore((s) => s.setArea | s.setLane | s.setStop | s.setSlot | s.clearLocation)
```

`areaStatus` is `unset · served · no_run · out_of_area`, which drives the five
states of the header `<LocationChip>`. Serviceability is asked once and
remembered; it never blocks browsing, only checkout.

---

## Components

Import directly — there is no barrel file, deliberately.

```tsx
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/blocks/ProductCard";
```

Everything is a server component unless it needs state; `"use client"` appears
only where it is genuinely required. `Button`, `Badge`, `Rule`, `Price`,
`KanaLabel`, `Stamp`, `Field` and the `blocks/` presentational components carry
no directive, so they work in both worlds.

### `components/ui/`

| Component | Key props |
|---|---|
| `Button` / `ButtonLink` | `variant` `primary｜secondary｜ghost｜destructive｜onPhotoPrimary｜onPhotoSecondary`, `size` `sm｜md｜lg`, `fullWidth`, `icon`, `iconPosition`, `loading` |
| `IconButton` | `label` (**required**), `variant` `plain｜outline｜solid｜onDark`, `size`, `round` |
| `Badge` | `variant` `tint｜outline｜solid｜success｜warning｜danger｜info｜crumb｜weekly｜muted`, `tabular` |
| `Rule` / `Kicker` | `tone` `default｜strong｜dark`, `label`, `trailing`, `orientation` |
| `Price` / `FreeLabel` | `amount`, `size` `sm｜md｜lg｜xl`, `muted`, `tone` |
| `KanaLabel` | `kana` (null renders nothing), `decorative` |
| `Stamp` / `RingSeal` | `lines`, `size`; seal takes `text`, `tone` `paper｜dark` |
| `Field` `Input` `Textarea` `Select` `Checkbox` `Switch` | `label` `helper` `error`; `Input` takes `prefix` `leadingIcon` `invalid` `valid` |
| `QtyStepper` | `qty` `onIncrement` `onDecrement` `max` `tone` `pending` |
| `Dialog` | `open` `onClose` `title` `description` `footer` `variant` `dialog｜sheet` |
| `ToastProvider` / `useToast()` | `toast({ message, tone, action })` |
| `OtpField` / `OtpBoxes` | `step` `number｜code`, `status` `idle｜verifying｜success｜error`, `resendIn`, `whatsappFallback` |
| `EmptyState` | `title` `body` `action` (exactly one) `glyph` |
| `Skeleton` / `ProductCardSkeleton` | — |
| `LineArt*` | `LoafGlyph` `AnPanGlyph` `KarePanGlyph` `WheatGlyph` `VanGlyph` `LineArtBleed` |

### `components/blocks/`

| Component | Key props |
|---|---|
| `Section` `Container` `SectionHeader` | `surface` `paper-0｜paper-50｜paper-100｜dark`, `size` `default｜lg｜half｜none`, `width` |
| `ProductCard` / `ProductGrid` | `product`, `stock` `{ soldOut, left, isNew, bakedToday }`, `rowIndex` (alternates the well tint), `onNotifyMe` |
| `CategoryFilter` | `categories` `value` `onChange` `totalCount` `variant` `rail｜chips｜responsive` |
| `CartDrawer` / `CrossSellStrip` | mounted globally; open it with `useCartStore.getState().open()` |
| `SlotPicker` | `dates` `bands` `selectedDate` `selectedBand` `onSelectDate` `onSelectBand` `cutoffNote` `cutoffWarning` |
| `AreaCheck` / `AreaResultBlock` | `status`, `area`, three result kinds: served · van-only · not-yet |
| `FulfilmentLane` / `FulfilmentSummary` | `options` `value` `onChange` `areaSet`; summary takes `lane` `detail` `onChange` |
| `LocationChip` | `onOpen` — reads the session store, five states |
| `AreaLaneSheet` / `AreaLaneSheetBody` | nine steps: `lane · van-stop · delivery-area · success-van · success-delivery · no-run · out-of-area · loading · error` |
| `DropCard` | `baked` `left` `reserved` `cutoffLine` `status` `open｜closed｜sold-out` `soldOutCause` |
| `ProofBlock` / `SpecList` / `HowToEatIt` | `specs: { label, value }[]` — a null value omits the row |
| `ThreeDoors` | `doors` (exactly three), `escapeHref` |
| `BakeStrip` | `steps` `activeStep` `footnote` `tone` |
| `TrackerCard` `VanStatusPill` `RouteList` `VanStrip` | `van` from `getVanState()`; `map` is passed in as a child |
| `Testimonial` `TestimonialRail` `Rating` | `quote` `name` `meta` `rating` `avatar` |
| `StatsBand` | `stats: { value, caption }[]` — 3 or 4 |
| `AnnouncementTicker` | `state` from `TICKER_COPY`, `segments` |
| `HeroPaper` / `HeroStatement` | never both on one page |
| `SubscriptionPlanCard` | `state` `default｜recommended｜current｜paused`, plus `onSkip` `onPause` `onResume` `banner` `cutoffNotice` |
| `Faq` | `items: { question, answer }[]`, `headingLevel` |
| `UpiPayButton` | `amount`, `state` `idle｜awaiting｜returned-unknown｜success｜failed` |
| `WhatsAppOptIn` | `state` `idle｜submitting｜success｜already｜error` |
| `NewsletterRow` | `state`, `surface` `paper-100｜dark` |
| `PagePlaceholder` | Phase 2a only — delete it when you build the page |

---

## Conventions

These are not preferences. Breaking one is a bug.

**Tokens only.** Every colour, radius, shadow, duration and type size comes
from `globals.css`. No hex in a component, no `bg-white`, no
`bg-slate-*`, no shadow ramp, **no gradient**, no `#FFFFFF`, no `#000000`, no
`#1B3A5F`.

**No emoji. Anywhere.** Not in copy, not in a label, not in a commit. Icons are
Lucide at `strokeWidth={1.5}`, sizes 16 / 20 / 24. `star` is the only filled
icon in the system and it is filled with `--color-crumb`.

**Display type is always weight 400.** If a headline feels weak, set it larger,
never bolder. Never a display face under 24px, never body sans over 24px.

**The kana rule.** Japanese appears only as `<KanaLabel>` under a product name.
Never in nav, never in a button, never in an error, never as a heading. Omit
rather than invent, and never romanise as a substitute. No Kannada in the
chrome — the one local-warmth line in the footer is the single exception.

**Numbers.** `₹` with no space, whole rupees, `formatINR()`. Every price,
count, timestamp and coin balance carries `tabular-nums` — use the `tabular`
class or the `<Price>` component. Prices are display-italic.

**Every number is true.** No "100+ items" against a 23-item menu. If the data
says TBC, the UI says TBC or says nothing.

**Stops, not minutes.** Proximity is a stop count; time is a ten-minute band.
Never a countdown to arrival. The only honest timer is the cart hold, and only
when it is wired to a real reservation.

**Accessibility.** 44×44px minimum hit target everywhere. Focus rings are
`:focus-visible` only, kiln on paper and crumb on dark, and are handled by the
base layer — do not add `focus:` styles per component. Every icon-only control
has a label. Overlays trap focus, close on `Esc` and restore focus.

**Motion.** CSS only; framer-motion is not installed and is not needed.
`prefers-reduced-motion` is handled globally, and anything that loops carries
`data-motion="marquee｜seal｜pulse"` so the global rule can stop it.

**Server components by default.** Add `"use client"` only for state, effects,
or an event handler that cannot be lifted.

---

## Phase 2b checklist

Every route below exists, has correct metadata and a real H1, and renders a
`<PagePlaceholder>` naming what to build. **Delete the placeholder, keep the
metadata export.**

### Public

- [ ] `/` — hero, trust strip, area check, van module, Three Doors, today's bake, why it costs what it costs, Fillo+, proof, newsletter
- [ ] `/shop` — run-aware header, category filter, search, Three Doors, grid
- [ ] `/shop/all` — the full 23
- [ ] `/product/[slug]` — 23 pages: buy block, lane selector under it, proof block, allergens, how to eat it, pairings
- [ ] `/boxes` — three curated boxes + build-your-own
- [ ] `/van` — status → hero line → arrival band → route list → bake strip → map. **Off air first.**
- [ ] `/van/[route]` — 4 route pages
- [ ] `/areas` — index + AreaCheck
- [ ] `/areas/[area]` — 6 serviceability landings
- [ ] `/standing-order` — subscription pitch + builder entry
- [ ] `/fillo-plus` — membership explainer (**free**, no ₹1 anywhere)
- [ ] `/gifting`, `/gift-cards`

### Purchase

- [ ] `/cart` — full-page cart
- [ ] `/checkout` — one page, four blocks; the van lane skips the address block
- [ ] `/order/[id]` — confirmation + live status

### Content

- [ ] `/about`, `/shokupan` (**keep the URL — it is the one page that ranks**)
- [ ] `/guides/[slug]` — 4 guides
- [ ] `/journal`, `/journal/[slug]` — 8 posts, 2 written in full
- [ ] `/faq` (+ FAQPage JSON-LD from the same array), `/contact`, `/franchise`
- [ ] `/policies/{shipping,refund,terms,privacy,payment}`

### Account

- [ ] `/login`, `/logout`
- [ ] `/account`, `/account/orders`, `/account/orders/[id]`
- [ ] `/account/subscription`, `/account/subscription/setup`
- [ ] `/account/addresses`, `/account/rewards`, `/account/alerts`
- [ ] `/account/gift-cards`, `/account/settings`

### System

- [x] `/404` — built
- [x] `/500` + `error.tsx` — built
- [x] `/offline` — built

### Still owed to this app

- [ ] Product cutouts for the remaining SKUs (4 of 23 have one; the rest fall
      back to legacy photographs, and `tex-mex-zest` and `fruit-sando` have no
      image at all)
- [ ] The OG image — `/og/fillo-crumb-1200x630.jpg` does not exist yet. It
      should be the torn shokupan cross-section, not the logo.
- [ ] A Hero variant B photograph (`HeroStatement` is built and unused)
- [ ] The map layer for `/van` — load it **after** the text, as a
      progressively-enhanced child of `TrackerCard`
- [ ] Real FSSAI licence number for the footer compliance line
