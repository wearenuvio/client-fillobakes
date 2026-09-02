# Live Tracking & Map UX — Research for the Fillo Bakes Tracker Page

UX research, phase 4 of 5. Scope: turning the existing hidden GPS popup (OSM, 15s refresh) into a flagship
tracker page with notify-me, built to accept a stamp-rally game layer later.

Format: **Pattern → who does it → SPEC line for Fillo.** SPEC lines are written to be implementable as-is.

---

## 0. The one-line thesis

Everyone copies Domino's, and almost everyone copies the wrong half. The Pizza Tracker's power is not
the map — **there is no map** — it is *operational transparency*: proof of effort, in stages, with a
believable clock. Fillo's van is more interesting than a pizza oven because it genuinely moves, so we
get the map *and* the stages. The design job is to make the map the emotional layer and the stage/ETA
strip the informational layer, and never let the map be the only thing on the page.

---

## 1. THE CANON

### 1.1 Domino's Pizza Tracker — steps, not a map

**Pattern.** Launched January 2008 (tested Dec 2007), designed by Crispin Porter + Bogusky, as part of a
push to take digital orders from 20% to 50% of the business. It shows **discrete stages** — Prep, Bake,
Quality Check, Out for Delivery — not a location. Latency between real state and displayed state is
capped at ~40 seconds. It surfaces the driver's first name and lets you message the store.

**Why it works.**
- **Operational transparency / the labor illusion.** Buell & Norton (Management Science, 2011) showed
  across five experiments that when a service visibly signals effort, people *prefer the slower
  experience* to an instant identical result — perceived effort triggers reciprocity, which raises
  valuation. Domino's is a labor illusion with a progress bar.
- **The return-trip effect.** Designer Shuya Gong: repeated updates make the wait feel shorter — "you
  are moving through pizza time" instead of clock time.
- **Control.** Visible progress converts helpless waiting into informed waiting; NN/g frames the same
  point as anxiety reduction (users "lack control over the completion of that process").
- **Cheapness of truth.** Domino's already had the back-end state machine. The tracker was a UI on
  existing data — exactly Fillo's situation with the existing GPS feed.

**Why steps beat a map for them.** A pizza in an oven has no meaningful position. Stages let you show
progress during phases where nothing spatial is happening, and they let you *under-promise* by
lingering. A map is honest but brutal: a stationary dot reads as a broken product.

> **SPEC —** Ship a 4-stage horizontal status strip pinned directly under the map — `Loading up` →
> `On the road` → `At <stop name>` → `Sold out / Back tomorrow` — driven by the same 15s feed, so the
> page still says something meaningful when the van is parked, in a dead zone, or hasn't left the
> kitchen yet.

### 1.2 Uber / Ola — the live-map grammar everyone now expects

**Pattern.** A canonical vocabulary has hardened: a top-down vehicle glyph, **interpolated** movement
(never teleporting), route geometry differentiated by line style (solid thin line = vehicle's drive
route, dashed = the human's walk leg), a persistent bottom sheet carrying ETA + identity + actions, and
off-app continuity (iOS Live Activities / Dynamic Island showing ETA on the lock screen without opening
the app). The animation trick is well documented: on each new coordinate, compute the delta from the
marker's current position and divide across a fixed interval so the marker glides.

**Relevance.** Fillo's feed is 15s — four times slower than a ride-hail ping. Raw application of a 15s
position update produces a stuttering, clearly-fake-looking dot, which destroys the credibility the
whole page depends on.

> **SPEC —** Tween the van marker between the last two fixes over the full 15s interval with linear
> easing and rotate the glyph to the bearing of travel; if a fix is >90s stale, stop the tween, drop
> the marker to 60% opacity and swap the ETA line for `Last seen 2 min ago`.

### 1.3 Swiggy / Zomato — the India-specific tracking patterns

**Pattern.** Both stream rider GPS into Redis and push to the client over WebSockets, animating the
marker client-side so the page never visibly refreshes. UX-wise the India conventions that matter:

- **Three fixed markers, one moving one.** Restaurant, rider, customer — the customer always knows
  which dot is "me".
- **The card owns the truth, the map owns the feeling.** ETA, order state and the rider's name/photo/
  call button live in a bottom card; the map is decoration above it. When GPS is flaky the card still
  reads correctly.
- **Call/chat is one tap from the map.** Indian users expect a human escape hatch on a live-tracking
  screen. Zomato/Swiggy put the phone icon on the rider row.
- **Tonal split.** Swiggy optimises for utility/speed and minimal chrome; Zomato for visual delight,
  big banners, personality copy. Fillo is culturally closer to Zomato but functionally closer to
  Swiggy — a small brand can't afford a slow tracker.

> **SPEC —** Bottom sheet, always visible above the fold on mobile, with three rows: (1) status +
> ETA band, (2) next stop name in Bengaluru-local phrasing (`Next: Sony World Signal, Koramangala`),
> (3) a WhatsApp button labelled `Ask us where we are` — the human escape hatch, since Fillo has no
> call-centre.

### 1.4 Amazon — "stops away" instead of a clock

**Pattern.** Amazon Map Tracking shows the van live on a map *and* a **`N stops away`** counter, but
only once the driver is within 10 stops. When the route is re-sequenced, the map stays and the counter
disappears, replaced by `The driver has to make a few more deliveries on the way`. This is a deliberate
choice: proximity in metres is a bad predictor of arrival time on a multi-stop route, and a count of
stops is both more honest and un-falsifiable.

**Why it's the single most transferable idea for Fillo.** A bakery van on a fixed daily route *is* a
multi-stop route. "1.2 km away" is a lie when there are three stops and a Bengaluru signal in between.

> **SPEC —** Primary proximity metric is **`2 stops away`**, not distance and not a bare clock; show
> the stop counter only when the van is ≤3 stops from a stop the user has starred, and fall back to
> `Still a few stops out` rather than inventing a number when the route is off-sequence.

### 1.5 NN/g status-tracker guidelines (the checklist)

From *Status Trackers and Progress Updates: 16 Design Guidelines* — status trackers are **pull**,
progress updates are **push**; both exist to reduce the anxiety of not controlling a process. The ones
that bind on Fillo:

- Feature the **most recent update first**; don't clutter.
- **Plain language, not back-end jargon** (no "fulfilled", no "geofence entered").
- **Keep the history with timestamps** — visible progress builds confidence.
- **Give low-granularity updates during long gaps** ("joined the processing queue") rather than silence.
- **Automate**; manual status entry produces errors, and an inaccurate tracker is worse than none.
- **Let users control channel and frequency inside the tracker itself.**
- **Deep-link notifications straight back to the tracker**, no re-entry of any reference.
- **Never let a support channel know more than the tracker does.** If the WhatsApp reply is better
  than the page, the page is dead.

> **SPEC —** Under the map, a reverse-chronological timestamped feed capped at the last 5 events
> (`10:42 Left the kitchen` / `11:05 Arrived Indiranagar 12th Main` / `11:40 Sold out of croissants`),
> auto-generated from the feed and stop states — never hand-typed.

---

## 2. VEHICLE-AS-DESTINATION (the closer analogues)

The canon above is all *thing comes to you*. Fillo is the inverse: **you go to the vehicle**. That
flips three things — the user needs to know where to *walk*, needs confidence the van will still be
there when they arrive, and needs a reason to leave the house *now*.

### 2.1 Mister Softee — the closest living analogue, and its mistakes

**Pattern.** Mister Softee's app tracks franchise trucks in real time via GPS/beacons. Two things it
gets right: **no account required** (enter a ZIP and go) and an explicit promise that it doesn't store
your location. One thing it gets badly wrong, per reviewers: **there is no "nearest truck" affordance
— you have to zoom all the way out to find any truck at all.**

**Lesson.** For vehicle-as-destination, the default camera must never be "the user's location" or
"the whole city". It must be "the thing you came here to see".

> **SPEC —** Default map camera = tight bounds containing the van + the next stop, at whatever zoom
> fits both; a `Find the van` FAB re-centres to that bound after any pan. No login, no location
> permission, ever, to see the van.

### 2.2 Food-truck locators — the schedule/live hybrid

**Pattern.** The whole category (StreetFoodFinder, OpenTruck, FoodTrukt, Truckster) has converged on a
hybrid: owners publish a **schedule**, trucks appear on the map automatically when scheduled, and
optionally **broadcast live GPS with one tap**. Front-ends show a status pill counting how many trucks
are `live` vs `scheduled today`. The reason is structural — live GPS is unreliable and off-hours, so
the schedule is the load-bearing content and live location is the garnish.

**Lesson for Fillo.** The van is offline ~18 hours a day. If the page is only a live map, it is a
broken page most of the time. The schedule is what makes the URL worth bookmarking.

> **SPEC —** Page has two states with the same layout: **LIVE** (map + moving van + ETA band) and
> **OFF-AIR** (same map, van glyph parked at the kitchen, greyed, with `Tomorrow's route` as a stop
> list carrying times) — and a persistent `Today's route` list that renders identically in both.

### 2.3 Transit — personality without sacrificing legibility

**Pattern.** Transit 6.0 replaced Interstate (a US-highway font, "car culture") with **Puffin**, briefed
as *"legible at a glance, clean but not uptight, cheeky yet elegant"*. They scaled ETAs from 18pt to
**60pt** in detail views, increased whitespace, moved to "bigger, bolder, bubblier colours", and built a
unified **ETA card** component that packs alerts, crowding and accessibility around one huge number.
GO-mode avatars are a chosen personal character. Neon Dark Mode programmatically derives its palette
from the local transit agency's own route colours.

**Lesson.** Personality lives in the type, colour and one character — not in decoration around the
number. The number gets enormous.

> **SPEC —** The ETA/next-stop line is the largest type on the page (min 48px on mobile, brand display
> face), everything else steps down hard; the van's face/character carries all the charm so the data
> can stay plain.

### 2.4 Citymapper — playfulness as a *voice*, not a feature

**Pattern.** Citymapper's witty tone comes from treating the app as *a person helping you out* rather
than a tool. It has a family of city characters derived from its face-like arrow logo — a top-hat-and-
monocle figure for London, a Viking for Stockholm — each "smiling, inviting, built from basic shapes".
GO trips report calories burned, trees saved, money saved: light gamification that rewards the trip you
already took rather than demanding a new one.

> **SPEC —** Give the van a Bengaluru-specific character treatment (the van glyph gets a face; the
> empty/off-air state gets one line of first-person copy — `Sleeping. Dough's proving.`), and write
> every system string in that voice, including errors.

### 2.5 School-bus trackers — the calm register

**Pattern.** Parent-facing bus apps (BusBoss, BusWhere, WheresTheBus) are the most anxiety-sensitive
tracking apps in existence and they are uniformly *calm*: no marketing, no upsell, the map and ETA
**visible on landing with zero extra clicks** because it's a daily-repeat action. Their notification
model is **user-drawn geofences** — the parent sets a radius around the stop and gets a push when the
bus enters it, plus proactive alerts for delays. They explicitly design for non-technical users.

**Lesson.** Two of these transfer exactly: zero-click-to-value on landing, and *the user chooses the
geofence*, not the brand.

> **SPEC —** No modal, no cookie wall, no newsletter interstitial on the tracker route; map + status
> render on first paint. Notify-me lets the user pick **which stop** to be alerted about, not just
> "alert me about the van".

---

## 3. MAP CRAFT

### 3.1 Custom map styling — brand-colouring an OSM basemap

**Pattern.** Brands restyle basemaps to demote the world and promote their own data. Mapbox Studio is
the commercial route (custom fonts, icons, textures; component sliders for road width and **POI
density**). Since Fillo is already on OSM, the open stack is cheaper and lighter:
- **Protomaps / PMTiles** — the entire basemap as *one static file* on object storage (e.g. Cloudflare
  R2), read by the browser via HTTP range requests. No tile server, no database, no API key, no
  per-view billing.
- **MapLibre GL JS** to render it; **Maputnik** to edit the style visually (start from Protomaps Light,
  export `style.json`).
- **OpenMapTiles / VersaTiles** as alternatives if a served stack is preferred.

**The craft rule** (implicit in every good branded map): the basemap must lose contrast so the brand
layer wins. Kill POI icons, mute road fills to a single warm neutral, drop label density, keep water
and major-road geometry for orientation only.

> **SPEC —** Custom MapLibre style built from a Bengaluru-only PMTiles extract: background in the
> brand's cream/parchment tone, roads a single desaturated tint, **all commercial POI layers removed**,
> labels only for arterial roads and the neighbourhoods Fillo serves — so the only saturated colour
> anywhere on the map is Fillo's.

### 3.2 Marker / avatar design — the vehicle with a face

**Pattern.** Uber uses an abstract top-down car glyph, rotated to bearing, precisely *because* it must
read at 20px among many. A single-vehicle product has the opposite constraint: there is exactly one
marker and it should be a **character**. Citymapper's city mascots and Transit's GO avatars show the
model — simple shapes, one expression, instantly recognisable at small size.

Practical constraints for a face-on-a-marker: it must survive 32px, it must not rotate with bearing
(a face upside-down is a bug, not a joke — rotate a separate directional element instead), it needs a
drop shadow or halo to sit on a light basemap, and it needs pulse/idle states.

> **SPEC —** Van marker = 44px SVG, face always upright, with a small rotating direction chevron
> beneath it; three states — `driving` (subtle bob animation), `parked at stop` (radiating pulse ring,
> face smiling), `off-air` (eyes closed, 60% opacity, no animation).

### 3.3 Route lines vs live pins

**Pattern.** Uber differentiates line semantics by style (solid = vehicle route, dashed = walking leg).
Delivery apps draw the *remaining* route only. Transit apps draw the full line always, because the line
*is* the product.

**For Fillo the line is the product.** A single moving dot on an empty map communicates almost nothing;
the same dot on a drawn route with 6 marked stops instantly communicates "this is a scheduled service
with a shape, and I can see where it goes next." It also solves the parked-van problem: even when the
dot is still, the route tells a story.

> **SPEC —** Always draw today's full route as a brand-coloured line; render the **completed** portion
> at 30% opacity/dashed and the **remaining** portion solid at full weight, so the line itself is a
> progress bar. Six stop pins along it, styled per §3.5.

### 3.4 ETA communication — bands, not point times

**Pattern.** Industry consensus is that a promise is a **range**, not an instant: build ETAs on
percentiles (P50/P75/**P90**) and publish the P90 as the far edge of the window, because over-promising
compounds into support load, bad reviews and churn while under-promising costs almost nothing. A
reliable window beats a precise time that is frequently missed. Amazon's `stops away` is the same
instinct expressed as a count. Domino's caps display lag at 40s so the shown state is never a lie.

**Bengaluru amplifies this.** Traffic variance on a 5km arterial run is enormous; a point ETA will be
wrong most days.

> **SPEC —** Never render a single-minute ETA. Show a **10-minute band** derived from P90
> (`Reaching Indiranagar 11:20–11:30`), widen the band automatically when the van's speed over the last
> 3 fixes is below walking pace, and cap the promise at `Around 20+ min` rather than showing a
> big number.

### 3.5 Stop states — upcoming / current / done

**Pattern.** Every transit and multi-stop delivery UI encodes three-to-four stop states. NN/g's
scannability guidance (vertical progress graphic, most-recent-first, visually distinct rows) applies
directly. Bakery adds a fourth state the others don't have: **sold out**.

> **SPEC —** Four stop states, each with a distinct pin *and* list-row treatment: `done` (grey,
> tick, actual time shown), `current` (filled brand colour, pulse ring, `Here now — till ~11:45`),
> `upcoming` (outline pin, ETA band), `sold out` (struck-through row, muted, `Sold out 11:52` — shown
> as honesty, not hidden).

---

## 4. NOTIFY-ME MECHANICS

### 4.1 Permission priming — never ask cold

**Pattern.** A **pre-permission "soft ask"** before the OS dialog lifts opt-in by 2–3×. Firing the
native prompt on first launch is described as the single biggest mistake apps make. Ask **after a value
moment**, always offer an explicit `Not now` (users who defer often accept on the next trigger; users
who feel pressured deny permanently). On iOS the native prompt is **one-shot** — a denial is buried in
Settings and effectively permanent.

> **SPEC —** The notify-me CTA never triggers the OS prompt directly. Tap → in-page sheet: *"Want a
> ping when the van's 10 minutes from Indiranagar?"* with a channel choice and a `Not now`; only after
> a channel is chosen does the native permission dialog fire. Trigger the sheet on the user's **second**
> visit or after 20s of dwell on the tracker — a value moment, not a landing.

### 4.2 Channel: WhatsApp beats web push in India — but hedge

**Pattern.**
- WhatsApp Business API is the default consumer-notification channel in India: ~98% open rate on
  opted-in lists, ~50% response rates, rich media + interactive buttons, and **marketing template
  messages at roughly $0.0118 each** (Meta moved to per-message billing on 1 July 2025). Opt-in is
  legally and operationally mandatory — sending without it gets accounts banned. 78% of Indian SMBs
  already use WhatsApp for customer comms.
- **Web push is structurally weak on iPhone**: since iOS 16.4 it works *only* if the site is added to
  the Home Screen as a PWA — not from a Safari tab, and a user who opens the site in the browser is
  still "not subscribed". For a walk-up-traffic bakery page, that disqualifies push as the primary
  channel.
- Web push on Android/desktop is still worth having and costs nothing per message; OLX's PWA push
  drove 250% more re-engagement.

> **SPEC —** WhatsApp opt-in is the **primary** notify-me (phone number + explicit consent checkbox
> with the template preview shown inline); web push is offered as a secondary `Or get a browser alert`
> and is silently hidden on iOS Safari tabs where it cannot work. Store consent timestamp + source URL
> per number.

### 4.3 Geofenced alerts — let the user draw the fence

**Pattern.** School-bus apps let parents define a radius around *their* stop and push on entry/exit,
plus proactive delay alerts. Loyalty platforms use the same primitive for "you're nearby" nudges. The
important UX move is that the geofence is anchored to a **named place the user chose**, not to their
live location — which also removes the need for background location permission entirely.

> **SPEC —** Notify-me = pick a stop from today's route (not a live-location radius) + pick a trigger:
> `When the van leaves the kitchen`, `When it's 2 stops away`, or `When it arrives`. Geofencing is
> computed **server-side against the van's position** — the user's device never needs location
> permission, which is the entire privacy story.

### 4.4 Frequency capping — one van, one ping

**Pattern.** The sweet spot for consumer apps is **3–5 notifications/week**; 1–2/day is the danger zone
where open rates fall to 8–12% and opt-outs climb; ~1 promotional message/day is the ceiling.
Localytics: **60% of users disable push entirely** because of too many irrelevant alerts. Preference
centres cut unsubscribes by up to 30% without reducing volume — perceived control matters more than
frequency. Caps must span push + WhatsApp + SMS together, not per-channel.

> **SPEC —** Hard cap: **one route-day alert per subscriber per day**, max 3/week across all channels
> combined, with route alerts (transactional, user-requested) counted separately from any marketing
> broadcast; a `Manage alerts` link in every message footer leading to a one-screen preference page
> (which stop, which trigger, pause 2 weeks, stop).

---

## 5. GAME LAYER PRECEDENTS

### 5.1 Pokémon GO — what's worth stealing from the map

**Pattern.** Its map is *aesthetically minimalist by design*: everything non-essential is hidden behind
bottom tabs and right-edge icons so attention lands on the catchable thing. But it is not empty — it
keeps streets and recognisable landmarks so the game world stays anchored to the real one. Niantic
builds its POI set bottom-up from **places people already congregate** — parks, statues, murals,
landmarks — and makes design decisions per location type (park vs art installation, pedestrian vs car
traffic).

**Three transferable decisions:**
1. **Landmark abstraction over address precision.** Bengaluru navigates by landmark, not by address —
   this is a cultural fit, not just a game mechanic.
2. **The map is not a map, it's a board.** Stops should look like *places to go*, not pins in a dataset.
3. **Safety-shaped POI selection.** Niantic filters by whether a location supports pedestrians. Fillo's
   stops must be places it's safe and normal to stand around on a Bengaluru road.

> **SPEC —** Every stop carries a landmark name and a 3-word local descriptor rather than an address
> (`Sony World Signal · opposite the Nandini booth`), and the future stamp layer uses stops as the
> board squares — no new geography to learn.

### 5.2 Eki stamp rallies / EKITAG — the Japanese digital-stamp model

**Pattern.** JR East's **EKITAG** (2023) digitised the century-old *eki stamp* ritual: you tap an NFC
sticker at the station, the app issues the digital stamp, now across **1,200+ stations**. Design
choices worth noting: the stamp is **earned by physical presence** (NFC tap, not a check-in button);
collected stamps can be **composited onto your own photo** — turning the reward into shareable content;
**secret stamps and mementos** appear during event periods; and the app doubles as a *planner*, showing
where the stamps are so you can route a trip around them. The analogue tradition it descends from is
the *stamp rally* — a fixed set, a booklet, and a completion prize.

**Why this is the right model for Fillo** rather than points/badges: it's finite, physical, tied to a
ritual, and the artefact (a filled card) is the reward.

> **SPEC —** Design the tracker's stop list so each stop has a permanent slot in a **6-stop stamp
> card** rendered as a page section; stamps are earned at the van (QR/NFC at the counter), the filled
> card composites onto a user photo for sharing, and seasonal "secret" stamps ride on limited bakes.

### 5.3 Foursquare / Swarm — what killed it, what worked

**What killed it.**
- **Purely extrinsic motivation.** Badges and mayorships were "a temporary engagement incentive that
  ultimately wore off" — the gamified behaviour had no intrinsic value underneath.
- **Competition doesn't scale.** Mechanics that worked at 50k users/day broke at 50M: mayorships in
  dense areas became unwinnable, incumbents were impossible to displace, "everyone that isn't at the
  top of the leaderboard gets de-motivated quickly", and users quit in disappointment.
- Foursquare eventually stripped points/badges and split check-ins into Swarm; Swarm later restored
  mayorships, arguably too late.

**What worked.** The check-in itself as a *lightweight ritual with social proof*, and location data as
the durable asset underneath the game.

**Translation for Fillo.** Never build a leaderboard. Fillo's advantage is Foursquare's inverse: the
underlying behaviour (buying and eating a good croissant) is *intrinsically* rewarding, and the
population per stop is small enough that competition would be personal and mean. Compete against the
card, not against each other.

> **SPEC —** Stamp rally is **completion-based, resettable per season, zero leaderboards, zero
> mayorships** — the only comparison shown is your own card vs. its empty slots; the reward is a real
> bake, not a badge.

---

## 6. PRACTICAL

### 6.1 Privacy & safety of a publicly-visible vehicle

**The risk.** A public, always-on, precise real-time position of a small vehicle carrying cash and one
or two staff is a stalking/robbery surface, and it exposes the driver's day as continuous surveillance
(EFF's locational-privacy framing). Research on vehicle location privacy uses **geo-obfuscation**:
perturbing the reported position via an obfuscation function while keeping estimated travel cost close
to the true one — i.e. coarsen without breaking usefulness. Standard mobility-data practice also strips
identifiers on a short clock (e.g. rider IDs dropped after 24h).

**Practical coarsening patterns for Fillo:**
- **Snap-to-route.** Publish the van's projected position on its own published polyline, not its raw
  GPS fix. Kills residential-street precision and looks *better* (no dot in a building).
- **Publish only during service hours.** Feed goes dark at end of route — this is also the honest
  product behaviour (§2.2).
- **Coarsen off-route.** If the van deviates (fuel, bathroom, breakdown, driver's home), suppress
  position and show `Between stops` rather than a real location.
- **No history.** Publish current position only; never expose a trail endpoint.
- **Driver consent + a kill switch** the driver controls from the cab.

> **SPEC —** The public endpoint returns **snapped-to-route position + stop index only**, rounded to
> ~50m, served only between `route_start` and `route_end`, with no historical trail and a driver-side
> `Go dark` toggle that instantly flips the page to OFF-AIR with the copy `Van's off the map for a
> bit — back shortly`.

### 6.2 Low-bandwidth map performance in India

**Pattern & numbers.** Flipkart's PWA tripled time-on-site and lifted re-engagement 40% by targeting 2G
users; OLX cut bounce 80% and drove 250% more re-engagement; MakeMyTrip cut page load 38% on slow
connections for tier-2/3 users. The framing that matters: *"a 233 KB app that works on 2G is more
inclusive than a 148 MB download that requires strong Wi-Fi"* — Indian users on 32GB budget phones
watch both storage and data.

**Map-specific tactics:** WebP tiles over PNG (25–30% smaller; AVIF 40–50%); stripping unused
attributes/languages from vector tiles cuts them up to 40%; progressive loading (low-res placeholder →
detail); dynamic quality scaling (low-res at z1–10, high-res only at street level); lazy-loading the
map library itself (60–80% smaller initial bundle; ~200KB saved on a Google Maps deferral, 40–60%
bandwidth on Leaflet); tile caching with sane eviction; keep any single tile under 500KB.

**Plus the obvious one:** a Bengaluru-only PMTiles extract is a few MB total and can be edge-cached
permanently, versus a global tile service billed per view.

> **SPEC —** Server-render the stop list, ETA band and status strip as static HTML; **lazy-load
> MapLibre + tiles only after first paint** (or on user tap on mobile under a `Save data` heuristic);
> Bengaluru-bbox PMTiles on a CDN with a stripped, single-language vector schema; target < 150KB
> before the map layer loads.

### 6.3 PWA vs native

**Pattern.** PWAs cost 40–60% less and ship 50–70% faster; a good one delivers ~80% of the native
experience at 50–60% of cost. The Indian precedent set (Flipkart, OLX, MakeMyTrip, BookMyShow) is
overwhelmingly PWA. The one real gap is iOS: push requires Home Screen installation (iOS 16.4+), no
silent push, no notifications from Safari tabs, and constrained background processing.

**Verdict for Fillo.** Native is indefensible — the product is a URL people reach from Instagram bio,
a poster QR, or a WhatsApp forward. Install friction would kill it. Ship a **PWA**, and use the iOS
push gap as the exact reason WhatsApp is the primary alert channel (§4.2). The stamp rally later needs
NFC/QR scan, which a PWA handles via camera/`ndefreader` on Android and camera-only on iOS — QR is the
safe common denominator.

> **SPEC —** PWA with a service worker caching the shell, the route data and yesterday's tiles;
> offer `Add to Home Screen` **only after** a user has opted into alerts (that's the moment install
> earns its keep and, on iOS, the only way their push can work) — never on first visit.

### 6.4 Battery / data cost messaging

**Pattern.** Users in data-conscious markets react to visible cost. The tracker page has an unusual
property: **it costs the user nothing to be notified** because the geofence is evaluated server-side
(§4.3) — no background location, no always-on GPS on the user's phone. That is a genuine, honest
differentiator worth saying out loud, in the same breath as the privacy claim Mister Softee makes.

> **SPEC —** Under the notify-me sheet, one line of reassurance copy in the brand voice: *"We watch
> the van, not you. No location permission, no background tracking, no battery drain — we just message
> you when it's close."* Pair with a `Lite mode` toggle in the footer that disables the map layer and
> renders the stop list + ETA only (persisted in localStorage).

---

## 7. RECOMMENDED TRACKER PAGE ANATOMY

Mobile-first, top to bottom. Everything above `[FOLD]` must render server-side before MapLibre loads.

| # | Module | Content | Why (source of the pattern) |
|---|---|---|---|
| 1 | **Status bar** | `LIVE` pill + last-updated stamp (`updated 8s ago`), or `OFF-AIR` | NN/g: visibility of system status; Domino's 40s honesty cap |
| 2 | **Hero line** | Largest type on page: `2 stops away` or `Here now — Indiranagar 12th Main` or `Back tomorrow, 8:30am` | Amazon `stops away`; Transit's 60pt ETA |
| 3 | **ETA band** | `Reaching Indiranagar 11:20–11:30`, widens under traffic | P90 windows, never point times |
| 4 | **Map** | Branded MapLibre/PMTiles basemap, full route line (done = faded, remaining = solid), 6 stop pins in 4 states, van-with-a-face marker tweened over 15s, `Find the van` FAB, default camera bound to van + next stop | §3 entire; Mister Softee's missing-nearest-truck failure |
| 5 | **Stage strip** | `Loading up → On the road → At stop → Sold out`, current stage lit | Domino's; keeps the page meaningful when the dot is still |
| 6 | **Today's route** | Vertical stop list, 4 states, landmark names + local descriptors, per-stop `Notify me` | School-bus zero-click; Pokémon GO landmark abstraction; NN/g scannability |
| 7 | **Notify-me sheet** *(soft-ask, triggered on 2nd visit / 20s dwell)* | Pick stop → pick trigger → WhatsApp (primary) / browser push (secondary, hidden on iOS Safari) → `Not now`; privacy + no-battery-drain reassurance line | Permission priming 2–3× lift; India WhatsApp economics; iOS 16.4 push constraint |
| 8 | **What's on board** | Today's bakes with sold-out states, live-linked to stop states | The actual reason to walk over; sold-out honesty |
| 9 | **Activity feed** | Last 5 timestamped auto-generated events | NN/g guidelines 2, 9, 11 |
| 10 | **Stamp card** *(phase 2 — build the slot now)* | 6 slots mapped 1:1 to the 6 stops, season-based, photo-composite share, no leaderboard | EKITAG; Foursquare's extrinsic-motivation failure |
| 11 | **Human escape hatch** | `Ask us where we are` → WhatsApp; must never know more than the page does | Swiggy/Zomato call affordance; NN/g omnichannel-consistency rule |
| 12 | **Footer** | `Lite mode` toggle, `Manage alerts`, privacy line on what's published and what isn't, `Add to Home Screen` (post-opt-in only) | Data-cost messaging; frequency/preference control; geo-obfuscation disclosure |

**Three rules that govern the whole page**

1. **The card is the truth, the map is the feeling.** Every number a user needs must be readable with
   the map layer completely failed to load.
2. **Never show a stationary dot alone.** Route line + stage strip + stop list carry the story when
   position doesn't.
3. **Under-promise everywhere.** Bands not point times, stop counts not distances, `a few stops out`
   not a fabricated number, and an ETA that widens itself in traffic.

---

## Sources

**Domino's / operational transparency**
- [Inside Domino's 'Pizza Tracker': What it does, why and how — Nation's Restaurant News](https://www.nrn.com/food-trends/inside-domino-s-pizza-tracker-what-it-does-why-and-how)
- [How the Domino's pizza tracker conquered the business world — The Hustle](https://thehustle.co/originals/how-the-dominos-pizza-tracker-conquered-the-business-world)
- [Happy 15th Birthday, Domino's Tracker! — Domino's Newsroom](https://media.dominos.com/stories/tracker-15th-birthday/)
- [Domino's Innovations timeline](https://biz.dominos.com/about-us/innovations/)
- [Buell & Norton, "The Labor Illusion: How Operational Transparency Increases Perceived Value", Management Science (2011)](https://pubsonline.informs.org/doi/10.1287/mnsc.1110.1376)
- [Ryan W. Buell — Harvard Business School faculty profile](https://www.hbs.edu/faculty/Pages/profile.aspx?facId=320524)
- [Why government technologists love the Domino's pizza tracker — StateScoop](https://statescoop.com/why-government-technologists-love-dominos-pizza-tracker/)

**Live-map conventions / Uber / Swiggy / Zomato / Amazon**
- [Designing the latest generation of Uber Navigation — Uber Design](https://medium.com/uber-design/designing-the-latest-generation-of-uber-navigation-maps-built-for-ridesharing-de3ede031ce1)
- [Case study: Uber's interactive map usage in mobile platforms — Bootcamp/UX Collective](https://bootcamp.uxdesign.cc/interactive-map-usage-in-ubers-ui-user-emotion-flow-84648ab09940)
- [How to Build Uber Car Animation Using Mapbox Markers — Active Bridge](https://activebridge.medium.com/how-to-build-uber-car-animation-using-mapbox-markers-ecdeb5261df1)
- [How Zomato Shows Live Delivery Partner Movement Without Page Refresh](https://medium.com/@anuragkumbhare2043/how-zomato-shows-live-delivery-partner-movement-without-page-refresh-0a4148af3837)
- [How Platforms Like Zomato, Swiggy, Uber and Ola Update Rider's Location in Real Time — DEV](https://dev.to/rachit_avasthi/how-platforms-like-zomato-swiggy-uber-and-ola-update-riders-location-in-real-time-3ic5)
- [Swiggy vs Zomato: Who Nails the Food Delivery UX in India?](https://medium.com/@diginext27/swiggy-vs-zomato-who-nails-the-food-delivery-ux-in-india-3ccb520476c8)
- [Amazon Map Tracking — Amazon Customer Service](https://www.amazon.com/gp/help/customer/display.html?nodeId=GU9B4LE26DKWVQTN)
- [Amazon puts live mobile tracking feature on the map — Retail Dive](https://www.retaildive.com/news/amazon-puts-live-mobile-tracking-feature-on-the-map/524350/)

**Status-tracker guidelines**
- [Status Trackers and Progress Updates: 16 Design Guidelines — NN/g](https://www.nngroup.com/articles/status-tracker-progress-update/)
- [Status Trackers: 6 Guidelines for Discoverability and Clarity — NN/g](https://www.nngroup.com/videos/status-trackers/)
- [Visibility of System Status (Usability Heuristic #1) — NN/g](https://www.nngroup.com/articles/visibility-system-status/)

**Vehicle-as-destination**
- [Mister Softee app allows you to track local ice cream trucks — NBC New York](https://www.nbcnewyork.com/news/national-international/mister-softee-app-track-truck/5395280/)
- [Mister Softee goes high tech — AOL/Bucks County Courier Times](https://www.aol.com/mister-softee-goes-high-tech-091631061.html)
- [Mister Softee — Google Play listing](https://play.google.com/store/apps/details?id=org.mistersoftee)
- [StreetFoodFinder apps](https://streetfoodfinder.com/apps)
- [OpenTruck: Food Truck Locator — App Store](https://apps.apple.com/us/app/opentruck-food-truck-locator/id6757166897)
- [Transit 6.0: let's make public transit more beautiful — Transit blog](https://blog.transitapp.com/six-o/)
- [Why I love Citymapper's user experience — Econsultancy](https://econsultancy.com/six-features-to-appreciate-about-citymappers-ux/)
- [Getting from A to B, simplified by Citymapper — Creative Review](https://www.creativereview.co.uk/citymapper-simplifying-commutes/)
- [School Bus Tracking App for Parents: A Complete Guide — BusBoss](https://www.busboss.com/school-bus-tracking-app-for-parents)
- [Dedicated Parent App for School Bus Tracking — BusWhere](https://www.buswhere.com/dedicated-parents-app-for-school-bus-tracking/)
- [UX/UI case study — a school bus tracking application](https://medium.com/@henry_8746/ux-ui-case-study-a-school-bus-tracking-application-5e8df6062783)

**Map craft**
- [Mapbox Studio](https://www.mapbox.com/mapbox-studio) · [Map design and styles — Mapbox docs](https://docs.mapbox.com/help/dive-deeper/map-design/)
- [Protomaps — the open source map in a file](https://protomaps.com/api)
- [Serving a custom vector web map using PMTiles and maplibre-gl — Simon Willison](https://til.simonwillison.net/gis/pmtiles)
- [Self-hosted slippy maps, for novices — NPR Visuals](https://blog.apps.npr.org/2024/11/26/slippy-maps.html)
- [OpenMapTiles](https://openmaptiles.org/)
- [Five Ways to Make Fast Maps for Low Bandwidth Environments — Development Seed](https://medium.com/devseed/five-ways-to-make-fast-maps-for-low-bandwidth-environments-8e7dd813fc05)
- [Optimizing Mobile Map Performance](https://medium.com/@animagun/optimizing-mobile-map-performance-strategies-for-blazing-fast-map-loading-ca6e0db210ec)

**ETA communication**
- [How to Estimate Delivery Times Without Overpromising](https://medium.com/@spyseller/how-to-estimate-delivery-times-without-overpromising-3bd6b67160ae)
- [Delivery ETA Accuracy: How AI Predictions Outperform Estimates — Locus](https://locus.sh/blogs/delivery-eta-accuracy-outperforms-estimates/)
- [The Hidden Cost of Failed ETA Promises — Locus](https://locus.sh/blogs/hidden-cost-failed-eta-promises-ai-routing-accuracy/)
- [Measuring Impact of Inaccurate ETAs — NextBillion.ai](https://nextbillion.ai/blog/measuring-impact-of-inaccurate-etas)

**Notify-me / permissions / channels**
- [How to Improve Push Notification Opt-In Rates — Plotline](https://www.plotline.so/blog/how-to-improve-push-notification-opt-in-rates)
- [iOS Push Permission: Priming Patterns That Lift Opt-In — PushEngage](https://www.pushengage.com/ios-push-notification-permission/)
- [How to improve the push opt-in rate — Batch docs](https://doc.batch.com/guides-and-best-practices/orchestration/how-to-improve-the-push-opt-in-rate)
- [WhatsApp Business API India 2025 Guide — Anantya.ai](https://anantya.ai/blog/whatsapp-business-api-india-2025-guide/)
- [WhatsApp Marketing Statistics India — WhatSender](https://whatsender.dev/blog/whatsapp-marketing-statistics-india-2026)
- [WhatsApp Marketing for Indian Businesses — Ozonetel](https://ozonetel.com/whatsapp-for-marketing/)
- [iOS special requirements for web push notifications — Pushpad](https://pushpad.xyz/blog/ios-special-requirements-for-web-push-notifications)
- [PWA iOS Limitations and Safari Support — MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- [Finding the Push Notification Sweet Spot — Retenshun](https://retenshun.com/blog/push-notification-frequency-sweet-spot)
- [Notification Rate Limiting Guide: Prevent Alert Fatigue — NotiGrid](https://notigrid.com/blog/notification-rate-limiting-alert-fatigue)
- [10 Push Notification Metrics You Need To Track — CleverTap](https://clevertap.com/blog/push-notification-metrics-ctr-open-rate/)

**Game layer**
- [Does Pokémon GO meet the principles of UI design? — Pokémon GO Hub](https://pokemongohub.net/post/article/lets-talk-does-pokemon-go-meet-the-principles-of-ui-design/)
- [Engineering Pokémon Playgrounds: Niantic's Visual Positioning System](https://nianticlabs.com/news/pokemon-playgrounds)
- [EKITAG｜Digital Stamps — Google Play](https://play.google.com/store/apps/details?id=jp.co.jreast.ekitag)
- ["EKITAG": Digital Station Stamp App — Japan Rail Club](https://www.japanrailclub.com/ekitag-digital-station-stamp/)
- [Station to Station: Japan's Iconic Eki Stamps — JAPAN HOUSE Los Angeles](https://www.japanhousela.com/articles/station-to-station-japans-iconic-eki-stamps-train-stamp-book-passport-goshuin-goshuincho/)
- [Stamp rally — Wikipedia](https://en.wikipedia.org/wiki/Stamp_rally)
- [Why Foursquare Failed — Yu-kai Chou](https://yukaichou.com/behavioral-analysis/why-foursquare-failed-hint-the-same-reason-as-pokemon-go/)
- [Checking in and out: Foursquare and Gamification — Centrical](https://centrical.com/resources/what-foursquares-evolution-can-teach-us-about-enterprise-gamification/)
- [The de-gamification of Foursquare — NEXT Conference](https://nextconf.eu/2014/08/the-de-gamification-of-foursquare/)

**Privacy / performance / PWA**
- [Locational Privacy — Electronic Frontier Foundation](https://www.eff.org/issues/location-privacy)
- [Protecting Vehicle Location Privacy with Contextually-Driven Synthetic Location Generation — arXiv](https://arxiv.org/pdf/2409.09495)
- [What is geofencing? Privacy concerns — Comparitech](https://www.comparitech.com/blog/vpn-privacy/what-is-geofencing-privacy/)
- [PWA vs. Native App: Pros and Cons — *instinctools](https://www.instinctools.com/blog/pwa-vs-native-app/)
- [Progressive Web Apps vs. Native Apps for Indian Businesses — Aurtos Studio](https://aurtostechnologies.in/blog/progressive-web-apps-india)
- [Do Progressive Web Apps Work on iOS? — MobiLoud](https://www.mobiloud.com/blog/progressive-web-apps-ios)
- [Digital stamp card location verification & anti-fraud — Easypromos](https://www.easypromosapp.com/blog/en/how-to-create-a-digital-punch-card-to-build-a-long-lasting-relationship-with-your-customers/)
