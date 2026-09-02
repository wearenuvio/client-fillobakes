
## account (agent group: account)

1. **`components/blocks/BakeStrip.tsx` — read `step.at` when `atLabel` is absent.**
   The strip renders `step.atLabel ?? "—"`, but `mock-data.json`'s *order*
   bake strips carry only `at` (the van's carry both). A completed step on an
   order therefore renders a done tick with an em dash. Suggested fix: fall
   back to `formatClockBare(step.at)` when `atLabel` is missing.
   *Worked around locally* with a vertical `OrderTimeline` in
   `components/pages/account/`, which formats `at` itself.

2. **`components/blocks/BakeStrip.tsx` — five cells.** The grid is
   `grid-cols-2 sm:grid-cols-4`, so the five-step order timeline
   (site-content: "Five steps, always all five visible") leaves an orphan cell
   at desktop. Either accept a `columns` prop or let the grid derive from
   `steps.length`. *Worked around locally* with `OrderTimeline`, which stacks
   the five steps vertically and carries the per-step sentence the strip has no
   room for.

3. **`components/ui/OtpField.tsx` — the code length is fixed at six.**
   `OtpBoxes` takes a `length` prop but the legend is hard-coded
   "Enter the 6-digit code", so a four-box variant would lie. site-content's
   login copy says a four-digit code; DESIGN.md §12.25 says six boxes. We
   shipped six and adapted the copy ("a six-digit code"). If the founders want
   four, the legend needs to derive from `length`.

4. **`components/ui/Dialog.tsx` — no scroll affordance on tall content.**
   The "change what's in it" sheet lists the catalogue; the panel scrolls
   (`max-h-[92vh] overflow-y-auto`) but the footer scrolls away with it. A
   sticky footer inside `Dialog` would help every long form.

## van (agent group: van — /van, /van/[route], /areas, /standing-order, /fillo-plus)

1. **`components/blocks/Header.tsx` — the mobile area-chip row overflows the
   header and lands on the page's first section.** The `<header>` is a fixed
   `h-15` at `<lg`, but at `<640px` it also renders a second row
   (`container-content pb-2 sm:hidden`) holding the full-width
   `<LocationChip>`. That row is outside the 60px box, so it paints over the
   top of whatever the page starts with — on `/van` it sits across the dark
   status band's kicker. Suggested fix: let the header grow to `h-auto` below
   `sm` (or move the chip inside the bar), so the sticky offset matches the
   painted height. Not worked around locally: every page shares the chrome, and
   padding my own first section would only hide it on my five routes.

2. **`components/blocks/SubscriptionPlanCard.tsx` — the `recommended` state
   hard-codes the label "Most popular".** There is no data behind that claim
   (DECISIONS §10: every number/claim is true or it does not ship), so
   `/standing-order` renders both plans in the `default` state and the card's
   emphasis treatment goes unused. Suggested fix: accept a `badge` prop so a
   page can say something it can support ("Our pick", "Start here").

3. **`components/blocks/TrackerCard.tsx` — `RouteList` has nowhere to put a
   stop's descriptor or its map link.** DESIGN §12.17.2 and site-content both
   ask each stop row for the local landmark ("opposite the Nandini booth") and
   an open-in-maps affordance, which is what makes a stop findable in
   Bengaluru. *Worked around locally* with `components/pages/van/StopSchedule`,
   which keeps the same timeline geometry and adds the descriptor, the band, a
   maps link and a per-stop notify button. `RouteList` is still used inside
   `TrackerCard` on `/areas/[area]`.

4. **`lib/mock.ts` — the `Area` type does not match the fixture's waitlist
   shape.** `Area` declares `waitlistCount` / `waitlistPosition`, but
   `mock-data.json` carries `waitlist: { requests, position, threshold,
   thresholdTbc, copy }` (and a `laneNote` on `hsr-layout`). `AreaResultBlock`
   in `blocks/AreaCheck.tsx` reads `area.waitlistPosition`, so the "#23 in
   Whitefield" line never renders from the real data. *Worked around locally*
   with a narrowed type in `app/areas/[area]/page.tsx`.

5. **`lib/mock.ts` — `Subscription` has no `weeklyMessages`.** The fixture
   carries the four WhatsApp templates (Wed / Thu / Fri / Sat) that
   `/standing-order` renders as the message loop. *Worked around locally* with
   a narrowed type.

## home (routes `/`, `/boxes`, `/gifting`, `/gift-cards`)

1. **`blocks/ProductCard.tsx` — the sold-out ghost button overflows a narrow
   column.** At 375px the grid is two-up, a card is ~160px wide, and
   `Tell me when it's back` is rendered in a `Button` whose base class is
   `whitespace-nowrap`, so it runs over the neighbouring card. Suggested fix in
   the primitive: let the sold-out control wrap (`whitespace-normal`, `h-auto`,
   `min-h-11`) or drop to a shorter label under `md`. Worked around locally in
   `components/pages/home/MenuGrid.tsx` with a scoped arbitrary-variant
   override, which should be deleted once the primitive handles it.

2. **No way to open the global Area & lane sheet from inside a page.**
   `SiteChrome` mounts `<AreaLaneSheet>` and passes `onOpenAreaSheet` to
   `Header` only, so a page module (the home "Two ways to get bread" cards, the
   PDP route line, the cart's fulfilment row) cannot open the one sheet the
   content spec says all of them open. Suggested fix: export a context
   (`useAreaSheet()`) from `SiteChrome` and consume it in page components.
   Worked around locally by rendering an inline `<AreaCheck>` under the lane
   cards, which writes the same session store.

3. **The cart cannot represent a box.** `/boxes` sells three curated boxes and
   a build-your-own at a box price, but `store/cart.ts` holds `{slug, qty}`
   catalogue lines only, so adding a box adds its contents at list price and
   the box saving is not applied to the total. Suggested fix: a bundle line
   type, or a discount hook on `computeTotals`. Until then the page states the
   box price with an `[Est.]` tag and says the kitchen applies it to the order.

4. **No shared TBC / Est. helper.** The brief requires `[TBC]` strings to be
   rendered through a helper; there was none in `ui/`, so
   `components/pages/home/Tbc.tsx` exports `<Tbc>` and `<Est>`. Worth promoting
   to `components/ui/` if other groups need it.

---

## Group: content (`/about`, `/shokupan`, `/guides`, `/journal`, `/faq`, `/contact`, `/franchise`, `/policies/*`, 404, `/500`, `/offline`)

1. **`/guides` has no entry in `lib/routes.ts` or `seo.json`.** `ROUTES` carries
   `/guides/[slug]` but not the index, and `seo.json` has the four guide pages
   but no `/guides` route, so the index is missing from the sitemap and falls
   through `buildMetadata` to a derived default. Worked around by passing an
   explicit `title`/`description` in `src/app/guides/page.tsx`. Suggested fix:
   add `{ path: "/guides", group: "content" }` to `ROUTES` and an authored
   `/guides` entry to `seo.json`. (`/journal` has both; `/guides` should match.)

2. **`articleLd()` cannot express the guide/journal distinction.** The content
   spec's whole reason for two sections is that a guide is undated and
   maintained while a journal post is dated and never updated, but the node
   builder only takes `datePublished`. Suggested fix: optional `dateModified`
   and `author` on `articleLd`, so guides can emit `dateModified` and posts can
   emit an author. Worked around by stating both facts in the visible meta row.

3. **`ProductCard`'s name link and add button measure under 44px tall.** Audited
   at 375px on `/shokupan`, `/guides/*` and `/journal/*`, which embed the real
   card: the `<a>` around the product name and the two circular controls come
   back at ~36px against DESIGN.md §12's 44×44 floor. Not touched — it is
   `blocks/ProductCard.tsx`. Suggested fix: pad the controls to a 44px hit area
   (the spec already asks for this: "36×36 tap targets, padded to 44px").

4. **FSSAI licence number is still TBC.** `/about` renders the row through the
   TBC helper and names it as missing rather than printing a placeholder, and
   the footer compliance line needs the same treatment when the number lands.

5. **Two guides are written beyond their `seo.json` status.** `/guides/an-pan`
   and `/guides/what-is-karepan` are marked `"commissioned"` in `seo.json`, but
   every fact in the bodies I wrote is already asserted by those same
   `metaDescription` strings (anpan, Ginza, 1875; karepan, 1920s, crumbed and
   fried), so shipping them as stubs would have been worse than shipping them.
   `/guides/how-to-store-shokupan` is `"blocked on founder input"` and ships
   part-published, with the storage times named as missing — it is a
   food-safety page and the gap is deliberate. Flagging for the content owner
   to review the two bodies rather than assume they are founder-supplied.

6. **Parallel `pnpm dev` servers corrupt `.next`.** Three agents running
   `next dev` against the same working tree race on
   `.next/static/development/_buildManifest.js.tmp*` and take each other's
   servers down with a 500. Not a code fault — worth one shared server, or a
   per-agent `distDir`, next time.
