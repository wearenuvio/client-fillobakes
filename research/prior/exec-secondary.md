# Fillo Bakes × Nuvio — SECONDARY Phase Execution Research
### Weeks 4–10 · five touchpoints, task-level
_Compiled 18 August 2026. All prices in INR unless stated. Prices exclude 18% GST unless noted._

---

## Scope note — what this file does NOT cover

This file deliberately does not re-cover ground held by its sister files. Where a topic touches one, it is **flagged and extended**, never repeated.

| Sister file | Holds |
|---|---|
| `exec-primary.md` | Identity system, Instagram, WhatsApp (incl. BSP pricing table), Google Business Profile, packaging |
| `exec-tertiary.md` | Subscription, lifecycle, gifting, doorstep ritual, Shorts/LinkedIn, site reskin & Shopify-migration decision |
| `exec-brandworld.md` | Mascot / van-character, naming system, sonic brand, merch, site IA, physical surfaces |

**Two hard inbound dependencies.** Nothing in §1 (van livery) can be produced until the identity system, Pantone spec and the van-character decision are signed. Nothing in §2 (tracker) can be scoped until the Path A / Path B headless-vs-Shopify decision in `exec-tertiary.md` §6 is made, because the tracker is one of the two assets that would need rebuilding.

**Confidence legend (same as sister files):**

| Tag | Meaning |
|---|---|
| **[PUB]** | Publicly listed price / documented platform rule / published statistic. Verifiable at source. |
| **[Est.]** | Nuvio estimate derived from market ranges. Planning number, not a quote. |
| **[QUOTE]** | Must be quoted by a vendor before it is a real number. Do not budget on the range alone. |

**Standing caveat on Indian vendor pricing:** IndiaMART / TradeIndia rates are lead-generation anchors, not transaction prices. Landed cost is typically 1.5–3× the "starting at" figure once print, lamination, installation labour, GST and travel are added.

---
---

# 1. VAN LIVERY

**Why it is the flagship of this phase.** Fillo's single most differentiating physical asset is a vehicle that moves through six neighbourhoods a week. Every other touchpoint in this phase depends on the van being legible — the tracker page is worthless if nobody knows what they are looking for, the drop ritual is weaker if the van is not the recognisable object at the gate, and the neighbourhood pages have nothing to photograph. The wrap is the only Fillo asset seen by people who are not looking for it.

**The design constraint that should drive every decision:** the van is read at **13–15 km/h in Bengaluru traffic** (see §3 for the TomTom data) and **stationary at a society gate for 15–40 minutes**. These are two completely different reading distances and the livery must serve both — a distance layer (name + colour + character, readable at 30m) and a close layer (QR, WhatsApp number, FSSAI, claim line, readable at 1–2m). Most small-business wraps fail by designing only the close layer at distance scale.

## 1a. The format decision — wrap vs paint vs partial vs magnets

| Option | What it is | Cost posture | Reversible? | Verdict for Fillo |
|---|---|---|---|---|
| **Full wrap (cast vinyl)** | Vinyl over every painted panel | Highest | Yes — peels off, protects the paint under it | ✅ **Recommended for the primary van** if the route model is stable |
| **Partial wrap** | Sides + rear + bonnet; roof and lower skirt left in base colour | ~50–60% of a full wrap; partial coverage defined at 50–200 sq ft vs a van's 90–125 running-feet full-wrap requirement **[PUB]** | Yes | ✅ **Recommended for van #2 and for the pilot**, and arguably for van #1 too — a bold partial on a correctly-coloured base van reads identically at 30m for ~half the money |
| **Paint / respray** | Base colour changed in paint | Comparable to a mid wrap but permanent | No | ❌ Avoid. Requires informing the RTO of a colour change (RC colour-code compliance), kills resale, and cannot be updated when the brand or claim line moves. There is no upside for a brand at week 6 of a rebuild |
| **Magnetic panels** | Printed magnet sheets on flat steel panels | Lowest | Fully — removable in seconds | ⚠️ **Not a livery solution — a supplementary one.** Only adheres to flat ferrous panels, will not survive highway speed, and looks temporary. Genuinely useful for **route-specific / drop-specific panels** ("TODAY: HSR · 6:30pm") and for a **borrowed or rented second vehicle** on a festive week |

**The Fillo recommendation: bold partial wrap on the primary van + magnetic day-panels.** A partial wrap on a van whose base colour is already close to the brand's paper/berry palette buys ~90% of the recognition at ~55% of the cost, and the money saved funds the magnetic day-panel system — which is the piece that makes the drop ritual (§3) legible at the kerb.

## 1b. Material grades — the decision that determines whether you re-wrap in year 2

| Grade | Examples | Thickness / behaviour | Realistic life | Use for |
|---|---|---|---|---|
| **Cast** | 3M IJ180 / IJ180Cv3 Controltac, Avery MPI 1105 | ~2 mil; conforms around curves and rivets, stretches evenly under heat, relaxes without fighting memory, stable after post-heating **[PUB]** | **5–7 years+**, rated up to 10 **[PUB]** | Full and partial vehicle wraps — anything crossing a curve, a rivet, a door seam or a wheel arch |
| **Calendared** | Oracal 651, Avery PR800 | 3–4 mil; has *memory* — it wants to return to its original shape | 2–3 years; cheap calendared film "shrinks and cracks within 2 to 3 years" **[PUB]** | Flat lettering, door decals, short-term promotional panels only. **Wrong for full wraps** |
| **Unbranded / grey-market film** | Assorted Chinese imports | — | Often fails in **1–2 years** vs 5–7 for 3M / Avery / Oracal **[PUB]** | Nothing that carries the brand |

**Indian-sun adjustment [Est.].** Published durability ratings are largely temperate-climate figures. Bengaluru's UV load and the fact that a moving-bakery van is parked in open sun for much of the working day means the honest planning number is **3–5 years for cast film, 12–24 months for calendared, under 12 months for unbranded**. Assume the roof and the bonnet — the horizontal surfaces — degrade roughly twice as fast as the vertical sides. This is the argument for leaving the roof unwrapped in a partial: it is the panel that fails first and nobody sees it.

**Non-negotiable spec line for the vendor brief:** *cast vinyl, 3M / Avery / Oracal branded, with a matching branded overlaminate (UV + abrasion), printed with solvent or latex inks, installed with post-heating on all curves and seams.* The overlaminate is where cheap quotes quietly cut cost, and it is the single component that determines whether the berry red is still berry red in month 18.

## 1c. (a) MUST-HAVE

| # | Element / task | Why it is a MUST | Owner |
|---|---|---|---|
| 1 | **Vehicle survey & panel measurement** — exact panel dimensions, seam/rivet/handle positions, photographs of all six faces on the actual van | Every wrap disaster starts with a design drawn on a stock template that does not match the real vehicle | Wrap vendor + Nuvio |
| 2 | **Dimensioned template artwork** (vector, to scale, per panel) with a marked **safe zone** clear of handles, seams, fuel flap and door gaps | Text or a face crossing a door gap is the most common visible failure | Nuvio |
| 3 | **Name at distance scale** — brand name occupying ≥ 40% of the side panel width, single colour, high contrast against the base | The 30m layer. If the name is not readable from across a four-lane road, the wrap is decoration | Nuvio |
| 4 | **The van-character / face** (per `exec-brandworld.md` §1f — the van itself as the character) applied at the **front** of the vehicle | The character's whole value is that it makes the van a "who" not a "what". It must be on the face that approaches the viewer | Nuvio |
| 5 | **Claim line, one sentence, ≤ 6 words** — the eggless + Japanese + fresh-today proposition | The category is unfamiliar in Bengaluru. A van that only says the name teaches nobody anything | Nuvio |
| 6 | **WhatsApp number, large, on both sides and rear** — with the WhatsApp glyph so it is not read as a landline | WhatsApp is Fillo's primary ordering channel per `exec-primary.md`. It must be the phone-number-sized element | Nuvio |
| 7 | **QR code — minimum 15 cm × 15 cm, error correction level Q or H, placed at 1.0–1.4 m from ground on the serving side** | See sizing maths in §1d. Placed at adult eye/hand height on the side people actually queue at | Nuvio |
| 8 | **FSSAI licence number displayed** — mandatory display of the FSSAI licence/registration number for a food business; for a mobile/food-truck FBO it must be displayed prominently on the vehicle **[PUB]** | Legal duty, and a trust signal in an eggless-claims category | Founder |
| 9 | **AIS-090 compliant retro-reflective conspicuity tape** along the rear and side lower edges | Mandatory-standard reflective marking for commercial vehicles in India; also the cheapest night-safety upgrade available **[PUB]** | Wrap vendor |
| 10 | **Number plates, lights, indicators, mirrors and windscreen fully unobstructed** | Wrap must not cover the number plate or windshield; RC colour-code compliance applies **[PUB]** | Wrap vendor |
| 11 | **BBMP Mobile Display permission — Form-V application filed** (see §1f) | The 2024 bye-laws require written permission of the Chief Commissioner for mobile displays, applied for in Form-V **[PUB]**. Get the position in writing before printing | Founder + Nuvio |
| 12 | **Printed proof + on-vehicle mockup sign-off** before full print | A wrap reprint is a five-figure mistake (`exec-primary.md` §1 sequencing trap) | Nuvio + Founder |
| 13 | **Cast vinyl + branded overlaminate specified in writing on the PO** | The one clause that separates a 4-year wrap from an 18-month one | Founder |
| 14 | **Photo documentation of the finished van** — all six faces, hero 3/4, detail of QR and stamp, shot on the same day in good light | This is the single most reusable content asset the phase produces. It feeds the tracker page, the neighbourhood pages, the creator brief and the press kit | Nuvio |

## 1d. QR sizing — the maths, because everyone gets this wrong

The working rule is the **10:1 ratio**: minimum QR dimension ≈ one-tenth of the maximum expected scanning distance **[PUB]**. A code scanned from 1 m needs to be ≥ 10 cm wide.

| Scenario | Scan distance | Bare minimum | Fillo spec |
|---|---|---|---|
| Adult standing at the serving hatch | 0.8–1.2 m | 8–12 cm | **15 cm** |
| Person walking past the parked van | 1.5–2.0 m | 15–20 cm | **20 cm** (rear panel) |
| Someone in the next car at a signal | 3–4 m | 30–40 cm | ❌ Do not design for this. Nobody scans a moving van. Use the WhatsApp number instead |

**Adjustments that apply to a van specifically [PUB]:**
- Signage QRs should use **error correction level Q or H** (higher redundancy).
- Add **20–30%** to the size if the code sits on a **curved surface**, in **low light**, or will be scanned by older devices. A van panel is frequently all three.
- The reliable everyday floor is **2 × 2 cm**; anything approaching that on a vehicle is decorative, not functional.

**Placement rules for Fillo:** on the **serving side** (the side the queue forms on), **1.0–1.4 m from ground**, on a **flat panel** — never across a seam, a rivet line or a curve. Add a two-word instruction above it ("Menu & route" or "Order here") — an unlabelled QR on a vehicle gets very few scans because nobody knows what it does. Use a **dynamic/short-link QR** so the destination can change from menu → drop page → tracker page without re-wrapping.

## 1e. (b) GOOD-TO-HAVE

| Element | What it buys | Cost posture |
|---|---|---|
| **Magnetic day-panels** — a set of 4–6 interchangeable panels ("TODAY · HSR · 6:30 PM", "SOLD OUT", "NEXT STOP →") | Makes the drop ritual (§3) legible at the kerb, and converts the van into a mini-billboard for the *specific* stop rather than the brand in general | Low |
| **Roof figure / 3D character** (per `exec-brandworld.md` §1c — the Peko-chan move) | Converts "branded vehicle" into "the thing children point at". Highest kid-appeal item available for the money | Medium |
| **Reflective *brand* elements** — the stamp mark or wordmark cut from reflective film, not just the compliance tape | The van works a 6:30–8:30 pm evening slot for much of the year. A wordmark that lights up in headlights is a genuine second shift of visibility | Low–medium |
| **Rear-door "you just bought from" panel** — the QR + route calendar on the door the queue faces | The rear is the panel most people stare at longest (they're queueing) and it is usually wasted | Included in wrap |
| **Serving-window frame graphic** — the stamp device framing the hatch | Makes every phone photo of the handover carry the brand mark. Free content-marketing multiplier | Included in wrap |
| **Interior-facing surfaces** — the inside of the open hatch door, visible only when trading | Nobody does this. It is the "surprise" layer for the person actually at the van | Included in wrap |
| **Second-vehicle magnetic kit** | Lets a rented tempo or a scooter run a festive overflow route in brand without a second wrap | Low |
| **Under-van / skirt reflective strip in brand colour** | Distinctive night silhouette | Low |
| **Wrap-care card for the driver** — no automatic car-wash brushes, hand wash, no petrol-based solvents, park in shade where possible | Cheapest single act that extends wrap life. Costs ₹0 and is almost never done | ₹0 |

## 1f. Legality — Bengaluru specifics

**⚠️ This section needs a local sign-off. Treat as a research position, not legal advice.**

| Issue | Position | Source confidence |
|---|---|---|
| **BBMP Advertisement Bye-Laws, 2024** | Notified **17 July 2025** under the Greater Bengaluru Governance Act, 2024; replaces the 2006 and 2018 bye-laws and governs all outdoor advertising in Greater Bengaluru | **[PUB]** |
| **Mobile displays** | "The advertiser shall display advertisements only after obtaining written permission of the Chief Commissioner or his authorised officer, by applying in **Form-V for Mobile Displays**" | **[PUB]** |
| **Private vs commercial vehicles** | A person cannot use a **private** car to carry advertisement; those with **commercial** vehicles are not prohibited from carrying advertisements **with prior permission** | **[PUB]** |
| **Own-brand on own goods vehicle** | The bye-laws as reported do not carve out a clean exemption for a business advertising *itself* on its *own* commercial vehicle. Industry practice treats own-brand fleet livery as ordinary vehicle identification rather than "advertisement", and enforcement in Bengaluru has historically focused on third-party hoarding-style vehicle ads — **but the 2024 bye-laws are new and the safe reading is that a permission application is required** | **[Est.] — verify** |
| **RTO / motor-vehicle side** | Wrapping is legal if you inform the RTO of a colour change, keep the RC colour code accurate, and do not obscure the number plate or windshield | **[PUB]** |
| **Reflective marking** | AIS-090 / AIS-089 conspicuity marking standards apply to commercial vehicles | **[PUB]** |
| **FSSAI** | Licence/registration number must be displayed; Food Safety Display Boards (FSDB) are being phased in as an additional requirement | **[PUB]** |

**Practical sequence Nuvio should run:**
1. Founder writes to the BBMP Advertisement department describing the vehicle as own-goods carrier displaying own trade name, and asks in writing whether Form-V applies. **Do this in week 4, before design is finalised** — the answer does not change the design but the paper trail changes the risk.
2. Confirm the vehicle's RC colour entry matches or is updated for the wrap base colour.
3. Confirm FSSAI licence category covers a mobile/vending vehicle and get the number set for artwork.
4. Budget a **contingency line for permission fees** — these are levied by the municipal authority and are not knowable in advance.

## 1g. (c) India cost bands

**Wrap material & installation**

| Line item | Band | Confidence |
|---|---|---|
| Vinyl, standard gloss, Bengaluru | **₹80–120 / sq ft** | **[PUB]** — vinyled.in, Bengaluru |
| Vinyl, matte / satin | **₹120–180 / sq ft** | **[PUB]** |
| Vinyl, metallic / chrome | **₹200–300+ / sq ft** | **[PUB]** |
| Colour-shift / chameleon | ₹300–500 / sq ft | **[PUB]** — irrelevant for Fillo, listed for anchoring |
| IndiaMART floor listing, car & bike vinyl wrap, Bengaluru | ₹100 / sq ft | **[PUB]** — lead-gen anchor, not a transaction price |
| Full car wrap, Bengaluru, all-in | **₹25,000–70,000** | **[PUB]** |
| Full car wrap, India, premium film | ₹60,000–1,50,000 | **[PUB]** |

**Fillo-specific build-up [Est.]**

Small van coverage is roughly **5 ft × 59 ft ≈ 295 sq ft** for a full wrap; medium van 5 × 75 ≈ 375 sq ft **[PUB]**. A Tata Ace / Mahindra Jeeto / Supro class vehicle is smaller than a US panel van — call it **180–260 sq ft for a full wrap** and **90–140 sq ft for a bold partial [Est.]**.

| Scenario | Area | Rate | Band |
|---|---|---|---|
| **Bold partial wrap, cast film + laminate, printed** | ~110 sq ft | ₹150–220/sq ft installed | **₹18,000–28,000** **[Est./QUOTE]** |
| **Full wrap, cast film + laminate, printed** | ~220 sq ft | ₹150–220/sq ft installed | **₹35,000–50,000** **[Est./QUOTE]** |
| **Full wrap, premium finish / complex artwork** | ~220 sq ft | ₹220–300/sq ft | **₹50,000–70,000** **[Est./QUOTE]** |
| **Design & artwork production** (Nuvio, dimensioned templates, 6 panels, proofing) | — | — | **₹25,000–60,000** **[Est.]** |

**Ancillary**

| Item | Band | Confidence |
|---|---|---|
| Retro-reflective sheeting | **₹32–35 / sq ft** (MOQ often 600 sq ft) | **[PUB]** |
| High-intensity prismatic reflective sheeting | **₹75 / sq ft** | **[PUB]** |
| 3M / Orafol AIS-090 conspicuity tape, 2" × 50 m roll | **₹2,800 / roll** | **[PUB]** |
| Magnetic day-panel set, 4–6 panels, printed magnet 30-mil equivalent | **₹3,000–8,000 for the set** | **[Est./QUOTE]** — no clean India public price found; US 12×18" panels are the reference format |
| Van roof character figure (FRP, 2–3 ft) | ₹15,000–40,000 | **[Est.]** — carried from `exec-brandworld.md` §1d, not re-derived |
| BBMP mobile-display permission fee | **Unknown — contingency ₹5,000–25,000** | **[QUOTE]** |

**Lead times [Est.]:** design & template 5–8 working days · vendor quote & proof 3–5 days · print 2–4 days · installation **1–2 days for a partial, 2–4 days for a full wrap** (US benchmark for a partial is 2–3 days **[PUB]**; add a day for a first-time custom job). **Total realistic: 3–4 weeks from signed identity to van on road.** Do not compress the proof stage.

## 1h. (d) Benchmark facts

1. **Cast vs calendared is a 3× life difference.** 3M IJ180Cv3 cast film is rated 5–7 years+ and up to 10; cheap calendared film "shrinks and cracks within 2 to 3 years", and unbranded film often fails in 1–2 years against 5–7 for 3M / Avery / Oracal **[PUB]**. On a ~₹40,000 wrap, specifying cast is a ₹6,000–10,000 decision that buys three extra years.
2. **Partial wraps get most of the effect for about half the material.** Vans need 90–125 running feet of film for a full wrap; a partial uses about half, and US partials price at $1,500–2,500 against $2,500–6,000 for full **[PUB]**. For a brand at week 6 of a rebuild — where the claim line may still move — the reversibility of a partial is a feature, not a compromise.
3. **The QR is a 15 cm decision.** The 10:1 rule means a code intended to be scanned from 1.5 m must be ≥ 15 cm; signage QRs should carry error correction Q or H and take a 20–30% size uplift on curved or low-light surfaces **[PUB]**. Most Indian food-truck wraps carry QRs at 5–8 cm, which is why they do not get scanned.
4. **Bengaluru's regulatory ground moved in 2025.** The BBMP Advertisement Bye-Laws 2024 were notified on 17 July 2025 and explicitly create a Form-V route for mobile displays **[PUB]**. Any competitor livery photographed before that date is not evidence of what is permitted now.

---
---

# 2. LIVE TRACKER PAGE + NOTIFY-ME

**Starting position.** Fillo already has an OpenStreetMap embed with live position and 15-second refresh, currently surfaced as a **pill on the homepage** (`exec-tertiary.md` §6). This phase's job is not to build a tracker — it is to **promote the tracker from a widget to a destination**, and to attach a capture mechanic to it. `exec-tertiary.md` already sizes that promotion at **₹25k–50k**; this section specifies what that money buys.

**The strategic point.** A live map is a novelty that people visit once. A **route calendar with per-stop ETAs and a notify-me** is a utility people return to weekly. The difference between those two products is roughly two weeks of work and it is the whole value of the touchpoint.

## 2a. Reference implementations

| Reference | Mechanics worth copying | Numbers |
|---|---|---|
| **Mister Softee app** (US) | **No login required** — "Skip" straight to the live map. Tap a truck to see how long it has been parked and its menu. **Proximity alerts** when a truck is near you. A **"freeze request"** — the customer asks the vendor to stay put at their current location. Trucks are opt-in per franchise | 625 trucks, 18 states, 350 franchises; app debuted 2020, relaunched 2026 to much larger uptake **[PUB]** |
| **Country Delight** (India, dairy subscription) | Subscription-first, live order tracking, delivery-slot clarity, flexible daily/weekly/custom cadence — the Indian consumer's existing mental model for "a vehicle is coming to me with fresh food" | Operates in 18+ cities across 11 states; ~30 million app downloads **[PUB]** |
| **Traccar** (open-source GPS platform) | Free, open source, supports a wide range of GPS devices and protocols, real-time tracking, **geofencing** and reporting. Geofencing is the mechanism that makes "notify me when the van enters Indiranagar" possible without writing it yourself | Runs on a ~₹500/month VPS **[PUB]** |

**The single most transferable idea is the "freeze request."** It inverts the relationship: instead of the customer chasing the van, the customer signals demand at a location. For Fillo that translates into a **"Stop at my gate" request** — which is simultaneously a delight feature, a route-planning data source, and the cheapest possible market research for which societies to add next.

## 2b. (a) MUST-HAVE

| # | Element / task | Detail |
|---|---|---|
| 1 | **A real page at a real URL** — `/route` or `/van` (not a homepage pill) | Needs its own title, meta description, OG image and a place in nav. It is the page the van's QR should point to on non-drop days |
| 2 | **Live pin on the OSM map** with a **"last updated HH:MM"** timestamp | The timestamp is not optional. A stale pin with no timestamp destroys trust permanently; a stale pin labelled "last seen 4 min ago" is honest |
| 3 | **Explicit offline / not-trading state** | "The van is off duty. Next out: Thursday 6:30 pm, HSR." Most trackers break here and show a frozen pin forever |
| 4 | **Route calendar — the whole week, above the fold on mobile** | Day → neighbourhood → stop(s) → window. This is the part people actually want; the map is the part they screenshot |
| 5 | **Per-stop ETA with an honest band, not a point** | "6:30–6:50 pm" not "6:34 pm". See §2d — Bengaluru peak speeds make point ETAs a promise you cannot keep |
| 6 | **Notify-me capture: WhatsApp opt-in as the primary mechanic** | One field (number), one neighbourhood selector, one consent checkbox. WhatsApp, not email — see §2c |
| 7 | **Consent language + opt-out** on the notify-me form | "You'll get a message the evening before we're in your area. Reply STOP any time." Required for WhatsApp policy compliance and it materially improves opt-in rate |
| 8 | **Mobile-first layout** — assume 100% of traffic is a phone at a gate | Map ≤ 45% of viewport, calendar and CTA visible without scrolling |
| 9 | **Driver-privacy boundary: tracking active only during trading hours** | Location data is personal data under the DPDP Act; tracking should be limited to working hours unless there is a documented reason otherwise **[PUB]**. A hard on/off tied to the shift is both the compliant and the correct product behaviour |
| 10 | **Signed driver acknowledgement** covering what is collected, why, and for how long | Every driver whose location is tracked should sign an acknowledgement **[PUB]** |
| 11 | **Retention policy — location history deleted on a short cycle (e.g. 7–30 days)** | Retention limited to what is necessary **[PUB]** |
| 12 | **Shareable state** — a stop-specific URL (`/route/hsr`) with its own OG card | Makes the page forwardable into society WhatsApp groups, which is Fillo's actual distribution channel |
| 13 | **Fallback when GPS drops** | Show the scheduled position with a "scheduled, not live" label rather than nothing |

## 2c. (b) GOOD-TO-HAVE

| Element | What it buys |
|---|---|
| **Geofence-triggered WhatsApp alert** — "the van has entered Koramangala" | The Mister Softee proximity alert, done in the channel Indians actually read. Traccar's built-in geofencing supplies the trigger **[PUB]**. This is the highest-value item on this list |
| **"Stop at my gate" request form** | The freeze-request idea, adapted. Doubles as route-expansion research |
| **Countdown to next stop** ("arriving in ~12 min") | Converts a browsing visit into a walk to the gate |
| **Today's stock ticker** — "18 shokupan left at this stop" | Marries the tracker to the drop ritual (§3) and creates urgency without a discount |
| **Add-to-calendar** for a recurring weekly stop (.ics) | Turns a route into a habit. Almost nobody does this |
| **Route names** (per `exec-brandworld.md` §5) rendered on the map as named lines | "The Indiranagar Loop" is a thing you belong to; "Route 3" is not |
| **Historical "the van was here" heat layer** | Beautiful, shareable, and proves coverage to a new neighbourhood. ⚠️ Only aggregate/blurred — never a replayable driver trace |
| **Van-character animation** on the pin (per brandworld) | Makes the map itself branded |
| **Web push as a secondary channel** for people who won't give a number | Free, but far lower reliability than WhatsApp in India |
| **Public status embed** for society/RWA WhatsApp groups | A single image-card auto-generated per stop |

## 2d. Tech options on the existing OSM feed

| Layer | Option | Cost | Note |
|---|---|---|---|
| **Map render** | Leaflet on OSM tiles | ₹0 | Recommended for simplicity; ideal for vehicle markers and tracks on an OSM map **[PUB]**. Already the incumbent |
| | MapLibre GL | ₹0 | Better for vector tiles, smoother animation, heavier bundle. Only worth it if the heat layer or route lines ship |
| **Position source** | Existing feed (already live) | — | Keep. Do not rebuild what works |
| | Traccar self-hosted | **~₹500/month VPS** **[PUB]** | Adds geofencing, history, multi-device — the platform layer that makes notify-me cheap |
| **Hardware** | Basic GPS tracker unit | **₹750–1,200/unit** **[PUB]** (IndiaMART listings — treat as anchors) | Fine for a single van |
| | Commercial tracker + service | **₹3,000–8,000 + ₹300–600/month** **[PUB]** | Buys support and an SLA |
| | DIY (ESP32 + SIM7600 LTE) | **₹2,500–4,000, no subscription** **[PUB]** | Cheapest at steady state, most fragile. Not recommended for a business-critical customer-facing feed |
| **Notify-me delivery** | WhatsApp utility templates | **~₹0.115–0.13/message** (per `exec-primary.md` §3) | A route alert is a **utility** message, not marketing — ~7× cheaper. This categorisation decision is worth more than the whole tracker build |
| **Opt-in storage** | Shopify customer tags / BSP contact list | included | Tag by neighbourhood so the alert is targeted, not broadcast |

**Cost band for the whole touchpoint:** **₹25,000–50,000 build** (carried from `exec-tertiary.md`) **+ ₹500–1,500/month running [Est.]** (VPS + tracker SIM), **+ message spend**. At 1,000 opted-in contacts receiving one route alert a week as a **utility** template: roughly **₹500–560/month [Est.]**. The same volume sent as **marketing** templates would be ~₹3,700/month — which is the whole argument for writing them as utility.

## 2e. Privacy & safety — what publishing a live location actually exposes

| Risk | Mitigation |
|---|---|
| **Driver surveillance / DPDP exposure.** Location data is personal data; continuous tracking must be justified and limited to legitimate operational needs; penalties under the Act reach up to ₹250 crore **[PUB]** | Track only during shift; documented policy; signed driver acknowledgement; short retention; no after-hours collection |
| **Physical safety of the driver and cash float.** A public real-time pin on a small vehicle carrying cash is a genuine, under-discussed risk in an Indian urban context | Publish a **coarsened** public pin (snap to the nearest stop / ~200 m grid) rather than raw GPS. The customer needs to know *which gate*, not which metre. Full precision stays internal |
| **Route predictability.** A published weekly calendar tells anyone exactly where a small cash-carrying vehicle will be | Prefer UPI-first at the van; keep float low; do not publish the return-to-base leg |
| **Third-party sharing.** Sharing driver location with third-party platforms without informing the individual is a potential DPDP violation **[PUB]** | If a mapping or analytics vendor receives the feed, name it in the policy |
| **Customer opt-in data.** Phone numbers collected for notify-me are personal data with a stated purpose | Purpose-limit: route alerts only. Do not silently migrate the list into marketing broadcasts |
| **Stale-data harm.** Someone walks to a gate the van has left | Timestamp + honest ETA bands + explicit "off duty" state (all MUSTs above) |

**Recommended public precision [Est.]:** snap to stop when within ~300 m of a scheduled stop; show a coarse road-level position in transit; never show the depot/home address; never show the vehicle outside published trading hours.

## 2f. (d) Benchmark facts

1. **Mister Softee's tracker works because it removes friction and adds agency.** No login — "Skip" goes straight to the live map; the app shows how long a truck has been parked, its menu, proximity alerts, and a **freeze request** to ask the vendor to stay **[PUB]**. Fillo can replicate all four on a web page with zero app-download cost.
2. **The opt-in problem is a franchise problem there and a discipline problem here.** Mister Softee's 625 trucks across 350 franchises each have to opt in, so the map is incomplete **[PUB]** — a coverage gap that erodes trust. Fillo's advantage is one van and total control; the equivalent failure mode is the tracker being switched off on busy days, which is exactly when people check it.
3. **India already has the mental model.** Country Delight — live order tracking, subscription cadence, fresh-daily doorstep dairy — is at 18+ cities, 11 states and ~30 million app downloads **[PUB]**. Fillo does not need to teach "a vehicle brings me fresh food on a schedule"; it needs to teach "and you can watch it coming."
4. **Geofencing is a free feature of an open-source platform.** Traccar supplies real-time tracking, geofencing and reporting on a ~₹500/month instance **[PUB]** — meaning the "notify me when the van reaches my area" mechanic costs roughly the price of one marketing WhatsApp broadcast per year in infrastructure.

---
---

# 3. WEEKLY DROP RITUAL

**The proposition.** A drop model converts a bakery's two structural problems — waste and uncertain demand — into a marketing asset. You bake only what is paid for, and scarcity does the promotional work a discount would otherwise have to do. For a fresh-today, eggless, Japanese-method product with a short shelf life, this is not a growth tactic; it is the correct operating model.

## 3a. Choosing the drop day and time for Bengaluru

**The traffic reality, which decides everything [PUB]:**

| Metric | Bengaluru |
|---|---|
| Congestion level | **74.4%** — highest in India, **2nd globally** (behind Mexico City) |
| Morning peak average speed | **14.6 km/h** |
| Evening peak average speed | **13.2 km/h** |
| Time to travel 10 km | **36 min 09 s** (worsened ~2 min year-on-year) |
| Distance covered in 15 min at peak | **3.3–3.6 km** (national average 5.5 km) |
| Annual time lost per commuter | **168 hours** |

**What this forces:**

1. **A van cannot serve two distant neighbourhoods in one evening.** At 13.2 km/h, a 7 km hop between Indiranagar and HSR is ~32 minutes of pure transit. **One neighbourhood per evening slot** is the only honest route design. This is the single most important operational conclusion in this section.
2. **Cluster stops geographically, not by demand.** Two or three stops within a 3 km radius is a workable evening; anything wider collapses the ETA promise.
3. **Evening is worse than morning for transit but better for demand.** Bread demand at residential gates peaks 6:30–8:30 pm; morning peak (14.6 km/h) is marginally faster but the audience is in a car, not at a gate.
4. **Publish ETA bands, never point times.** A ±20-minute band is the honest reflection of 13.2 km/h variance. Under-promise the band and beat it.

**Recommended drop-week shape [Est.]:**

| Element | Recommendation | Reasoning |
|---|---|---|
| **Order window opens** | **Monday 12:00 noon** | Weekday lunchtime scroll; leaves the full week for word-of-mouth to compound |
| **Order window closes** | **Wednesday 18:00** | Gives production 24h+ of certainty. San Pedro Sourdough's model closes Thursday morning for a Friday pickup — a ~24–30h gap **[PUB]** |
| **Bake / drop day** | **Thursday and Saturday** | Thursday captures the weekend-anticipation mood; Saturday is the family/gift day |
| **Van slot** | **18:30–20:30, one neighbourhood** | Post-work gate window; single-neighbourhood constraint per the traffic maths |
| **Sold-out announcement** | Same evening, within an hour of selling out | The sold-out post is the marketing (see §3c) |
| **Waitlist opens** | Immediately on sell-out | Waitlist is the demand signal that sets next week's cap |

**Neighbourhood → day mapping [Est.]** — assign a fixed day per neighbourhood and never move it. Predictability is the entire product. A rotating schedule destroys the habit that makes a drop model work.

## 3b. Cap-setting method

The cap is the most under-thought number in a drop business. Set it too high and you get an unsold shelf and a "still available" post that reads as failure; set it too low and you leave money and goodwill on the table. The discipline is to **let the cap trail demand, never lead it**.

**The method [Est.]:**

1. **Week 1 cap = confident production capacity × 0.7.** Deliberately under-supply. A first drop that sells out in 40 minutes is worth more than one that sells 100% in six hours.
2. **Record four numbers every drop:** units capped, minutes-to-sellout, waitlist adds after sellout, no-shows at collection.
3. **Raise the cap only when minutes-to-sellout exceeds a threshold** — e.g. if the drop takes more than ~4 hours to clear, hold the cap; if it clears in under 60 minutes two weeks running, raise by 15–20%.
4. **Never raise the cap by more than ~20% in a week.** Production quality on a hand-method Japanese loaf degrades faster than volume grows.
5. **Keep a "walk-up reserve"** — 10–15% held back off the pre-order system for people who see the van. Pre-order-only drops make the van itself pointless as an acquisition channel.
6. **Cap per SKU, not just in total.** A drop that sells out of shokupan but not of the seasonal item teaches you the SKU mix; a total cap teaches you nothing.

**The counter-intuitive rule:** sell out **every** week, deliberately. The scarcity is the product. Hotplate's core pitch is that the drop model "takes out all the guesswork of inventory because you only bake what's already been paid for, which means limited wasted time, ingredients, and money" **[PUB]** — the waste elimination is the P&L benefit, but the sell-out is the marketing benefit, and it only compounds if it is reliable.

## 3c. Sold-out post choreography

This is the highest-leverage free marketing in a drop business, and almost everyone wastes it by posting a grey "SOLD OUT" tile.

| Beat | Timing | Content |
|---|---|---|
| **1. Window opens** | Mon 12:00 | Story + feed post + WhatsApp Channel. The bake, not the offer. What is different this week |
| **2. Halfway signal** | Mon evening or Tue am | "Half gone" — a real number, not a vibe. Numbers are credible; "hurry" is not |
| **3. Last-call** | ~4h before close | Story only, with a countdown sticker |
| **4. SOLD OUT** | Within the hour | ⭐ The important one. Three elements: **gratitude**, **a real number** ("54 loaves, 3 hours 20 minutes"), and **the next door** ("waitlist open — you get first access Monday 11:45, fifteen minutes early") |
| **5. The bake** | Drop morning | Process content — the dough, the proof, the van loading. This is the content that recruits the *next* cohort |
| **6. At the van** | Drop evening | Faces, the queue, the handover. Geotag the neighbourhood (feeds §4) |
| **7. Waitlist re-open note** | Day after | "37 people joined the waitlist. Next week's cap goes up by 10." Publishing the cap logic makes customers complicit in the growth story |

**The rule that makes the sold-out post work:** it must contain a **number** and a **next action**. Without a number it is a brag; without a next action it is a dead end.

## 3d. (a) MUST-HAVE

| # | Element / task |
|---|---|
| 1 | **Fixed weekly rhythm, published** — open time, close time, bake day, van slot per neighbourhood. Same every week |
| 2 | **A single canonical drop page** (`/drop` or `/this-week`) that is the same URL every week, so it can be linked from the van QR, bio, Channel and creator posts without ever changing |
| 3 | **Hard cap enforced by inventory, not by honour** — Shopify inventory set to the cap so the product genuinely goes unavailable |
| 4 | **Countdown to window open**, on the drop page and in Stories |
| 5 | **Sold-out state that looks designed**, not like an error — the stamp device over the product, next drop date, waitlist CTA |
| 6 | **Waitlist / notify-me capture on the sold-out state** — the single most valuable form on the site |
| 7 | **Pre-order window with explicit open and close times** stated in IST on the page itself |
| 8 | **Collection/delivery slot chosen at checkout** (already exists per `exec-tertiary.md`) tied to the neighbourhood's drop day |
| 9 | **Order-confirmation WhatsApp utility message** stating slot, stop and what to do at the van |
| 10 | **Day-before reminder** (utility template) — the single biggest lever on no-show rate |
| 11 | **A no-show / unclaimed-order policy**, written and stated at checkout |
| 12 | **The four-number log** (cap, minutes-to-sellout, waitlist adds, no-shows) kept in a sheet from drop #1 |
| 13 | **A "we're baking" content beat** every drop — the drop model dies without the process content that justifies the scarcity |

## 3e. (b) GOOD-TO-HAVE

| Element | What it buys |
|---|---|
| **Early access for waitlist / subscribers** — window opens 15 min early | Converts the waitlist from a consolation prize into a status. Feeds the Fillo+ programme in `exec-tertiary.md` |
| **Live stock counter on the drop page** ("31 left") | The Hotplate-style urgency mechanic, honest version |
| **Drop-name per week** (per the brandworld naming system) | "The Rain Drop", "Exam Week Loaf" — makes each week a distinct object worth posting about |
| **Bundle SKU** ("the whole table") | Highest-AOV move available; Hotplate explicitly recommends bundles/combo packs **[PUB]** |
| **Mystery / baker's-choice SKU** capped at ~10% | Sells out first every time, costs nothing, generates unboxing content |
| **Waitlist-size published** | Social proof that costs ₹0 |
| **A physical "SOLD OUT" magnetic panel for the van** (see §1e) | Closes the loop between the digital ritual and the street |
| **Post-drop feedback one-tap** (WhatsApp quick reply) | Review flow feeding §4 neighbourhood pages |
| **Second drop tier for corporate/office pre-orders** | Weekday morning slot, higher units per stop, no queue |

## 3f. Hotplate-style mechanics, replicated on a Shopify India stack

Hotplate is purpose-built for scheduled drop releases with a countdown timer and a sold-out-state UX **[PUB]**, and is not available as an India-friendly stack. Everything it does is reproducible:

| Hotplate mechanic | Shopify India equivalent | Cost posture |
|---|---|---|
| Scheduled drop release | Shopify **scheduled publish** on the product/collection, or a pre-order app's campaign start time | ₹0–low |
| Countdown timer | Pre-order/presale apps ship countdown timers natively (Timesact and peers list "pre-orders countdown timer") **[PUB]**; or a theme snippet | ₹0–₹1,500/mo |
| Sold-out state UX | Custom sold-out template on the PDP + inventory-driven availability | Design time only |
| Waitlist / notify-me | Back-in-stock & waitlist apps — Appikon has a free plan with paid tiers **under $20/month**, scaling with notification volume **[PUB]**; Waitlist Flow, Amp, Essent, Globo, Timesact all cover this **[PUB]** | ₹0–₹1,700/mo |
| WhatsApp restock alert | Several apps do WhatsApp-native restock alerts; or route the event through the existing BSP as a **utility** template | Message cost only |
| Pickup-slot selection | Already built (Fillo's slot picker) | ₹0 |
| Partial/deposit payments | Timesact, Essent and Globo all support pay-in-full, partial, split and deposit **[PUB]** | Included |
| Order limits per drop | Presale order limits (Timesact) or plain Shopify inventory caps | ₹0 |

**Total app cost band: ₹0–₹3,500/month [Est.]** for the full drop stack — plus the standing caveat from `exec-tertiary.md` that **on Path A (headless) none of these apps are available** and each mechanic becomes bespoke dev. **The drop ritual is the strongest single argument for Path B.** If Fillo stays headless, add **₹60,000–1,20,000 [Est.]** of one-off dev to reproduce the countdown, sold-out state, waitlist and cap logic.

## 3g. (c) India cost bands

| Line item | Band | Confidence |
|---|---|---|
| Pre-order / presale app | ₹0–₹1,500/mo | **[PUB]** — most have free tiers |
| Waitlist / back-in-stock app | ₹0–₹1,700/mo (Appikon free plan; paid tiers start under $20/mo) | **[PUB]** |
| WhatsApp utility messages (confirmation + reminder + sold-out), 200 orders/wk | **~₹250–350/month** | **[PUB]** rate × **[Est.]** volume |
| Drop-page design & build (Path B) | **₹40,000–90,000** one-off | **[Est.]** |
| Drop-page build (Path A, headless bespoke) | **₹100,000–200,000** one-off | **[Est.]** |
| Weekly content production for the drop beat (7 posts/stories) | **₹8,000–20,000/month** | **[Est.]** — consistent with the character-retainer band in `exec-brandworld.md` |
| Magnetic "SOLD OUT" / day panels | ₹3,000–8,000 one-off | **[Est.]** |

## 3h. (d) Benchmark facts

1. **San Pedro Sourdough's calendar is the template, and it is deliberately slow.** Menu opens over the weekend, orders accumulate through the week, **ordering closes Thursday morning, pickup Friday afternoon** — a ~24–30 hour production certainty window **[PUB]**. The lesson is that the gap between close and bake is the whole point; a same-day close removes the benefit that justifies the model.
2. **Sell-out speed is the metric drop bakeries actually manage.** Reported outcomes range from selling out **in minutes** for microbakeries with strong local followings to a documented "sourdough baker sells out in 30 minutes" case **[PUB]**. Hotplate frames the model's benefit as eliminating guesswork so there is "limited wasted time, ingredients, and money" **[PUB]** — i.e. the P&L case is waste, the growth case is the sell-out.
3. **One pickup day a week is the standard, not a limitation.** Drop-based baked-goods businesses on Hotplate "often offer one pickup day a week so they can concentrate their prep efforts while still serving a wide customer base" **[PUB]**. Fillo's van makes this stronger, not weaker: one *neighbourhood* per day, one *drop* per week, is the same concentration logic applied to a moving shop.
4. **Bengaluru's traffic sets a hard ceiling on route ambition.** At 13.2 km/h evening peak and 3.3–3.6 km covered in 15 minutes **[PUB]**, a two-neighbourhood evening is arithmetically impossible without breaking the ETA promise. Any route plan that assumes otherwise will generate the worst possible customer experience: a paid pre-order and a van that is late.

---
---

# 4. PRODUCT PAGES + LOCAL SEARCH PAGES

**The opportunity, in one number.** **46% of all Google searches have local intent**, the Map Pack appears in ~93% of local-intent searches and captures ~44% of clicks, and **76% of people who search for something nearby visit a business within 24 hours** **[PUB]**. For a business whose entire proposition is "we come to your neighbourhood," neighbourhood pages are not an SEO tactic — they are the digital equivalent of the van.

**The risk, in one word: doorways.** Google explicitly warns that city landing pages can be doorway pages and against guidelines, and doorways remain listed in Google's spam policies **[PUB]**. The difference between a legitimate neighbourhood page and a doorway page is entirely about whether the page contains information that only exists because Fillo actually goes there.

**Fillo's structural advantage:** most local-SEO doorway spam is produced by businesses with no real presence in the city they are targeting. Fillo *physically parks a van* in each of these neighbourhoods on a known day. That means every page can carry a real stop, a real time, real photos from that location, and real reviews from people who live there. **Fillo is one of the rare cases where the honest version of the page is also the best-ranking version.**

## 4a. Target page list — sequencing

Priority is a function of route reality, not search volume. Do not publish a page for a neighbourhood the van does not yet serve.

| Wave | Neighbourhood | Rationale | Publish when |
|---|---|---|---|
| **1** | **Indiranagar** | Highest concentration of the Japan-literate, specialty-bakery-aware audience; strongest creator density; best photography backdrop | Week 5 |
| **1** | **Koramangala** | Startup/office density; highest willingness to pay for a specialty loaf; strongest weekday-morning corporate drop potential | Week 5 |
| **1** | **HSR Layout** | Dense gated-society model — the RWA/gate route model works best here; highest repeat-subscription potential | Week 6 |
| **2** | **Whitefield** | Large, affluent, expat-heavy, under-served by specialty bakeries; ⚠️ but the traffic maths in §3a make it a *dedicated day*, never a same-evening add-on | Week 7–8 |
| **2** | **Banaswadi** | Genuinely under-served; low competition means a page can rank on very little authority | Week 8 |
| **2** | **Ramamurthy Nagar** | Same logic as Banaswadi; contiguous route with it, which halves the transit cost | Week 8 |
| **3** | Sub-areas within wave 1 (e.g. specific society clusters) | Only if a wave-1 page proves it earns traffic | Week 10+ |

**Hard rule: six pages maximum in this phase.** A seventh page for a neighbourhood without a stop is the exact behaviour Google's doorway policy targets. Growth in page count must trail growth in route coverage.

## 4b. Neighbourhood page template — module list

| # | Module | MUST / GOOD | Content that makes it non-generic |
|---|---|---|---|
| 1 | **H1 naming the offer and the place** | MUST | "Fresh Japanese milk bread in HSR Layout — Thursday evenings" |
| 2 | **The stop card** — exact stop location, day, time band | MUST | The single most valuable and least copyable element. Nobody else can write this |
| 3 | **Embedded map centred on the actual stop** | MUST | Not a city-wide map. The gate |
| 4 | **Route-day statement** in plain language | MUST | "We're in HSR every Thursday, 6:30–8:30 pm" |
| 5 | **Photos taken *in that neighbourhood*** — the van at that gate | MUST | The strongest possible anti-doorway signal, and the cheapest. Requires only that someone photographs each stop once |
| 6 | **Testimonials from residents of that area**, attributed to the area | MUST | "— Priya, HSR Sector 2". Sourced via the post-drop WhatsApp feedback loop (§3e) |
| 7 | **Neighbourhood-specific FAQ** (3–5 Qs) | MUST | "Do you come inside the gate at [society]?", "Is there parking?", "What time do you usually sell out here?" — genuinely different answers per area |
| 8 | **Notify-me for this neighbourhood** (pre-filled) | MUST | Ties §2's capture mechanic to the page |
| 9 | **Order CTA to the current drop** | MUST | Same canonical `/drop` URL |
| 10 | **JSON-LD `LocalBusiness` schema** with area served | MUST | Trust signal expected of legitimate location pages **[PUB]** |
| 11 | **Local landmark references** in the body copy | MUST | Landmarks, neighbourhoods and service-area specifics are named as elements of a legitimate location page **[PUB]** |
| 12 | **Link to the live tracker filtered to this stop** (`/route/hsr`) | GOOD | Unique utility no competitor has |
| 13 | **"Nearest other stop"** cross-link | GOOD | Real internal linking with a user purpose |
| 14 | **Neighbourhood-specific product note** | GOOD | e.g. "the Whitefield route carries the larger 1.5-loaf pack because of the drive" — small, true, unfakeable |
| 15 | **Local creator content embed** (§5) | GOOD | Third-party proof, geographically anchored |
| 16 | **Sold-out history for this stop** | GOOD | "Usually sells out by 7:15 pm here" — genuine utility, drives earlier arrival |

## 4c. On-page SEO spec, per neighbourhood page

| Element | Spec |
|---|---|
| **URL** | `/bengaluru/{neighbourhood}` — flat, readable, one level. e.g. `/bengaluru/hsr-layout` |
| **Title tag** | `Japanese Eggless Bread in {Neighbourhood}, Bengaluru \| Fillo Bakes Van` — ≤ 60 chars where possible |
| **Meta description** | Must include the **day and time**. Local searchers pick on schedule, not adjectives |
| **H1** | One per page, offer + place |
| **H2s** | Where we stop · What we bake · What {neighbourhood} says · Questions from {neighbourhood} |
| **Body copy** | **Minimum 300 words of genuinely unique prose per page.** Duplicate copy with only the city name swapped is "the fastest way to trigger a thin content penalty" **[PUB]** |
| **Image alt text** | Descriptive and location-specific; never keyword-stuffed |
| **Schema** | `LocalBusiness` (or `Bakery`) + `areaServed` + `openingHoursSpecification` for that stop + `FAQPage` for the local FAQ |
| **Internal links in** | From `/route`, from the footer, from the drop page, and from at least one relevant blog/journal post |
| **Internal links out** | To `/drop`, to `/route/{stop}`, to 1–2 adjacent neighbourhood pages, to the product pages of SKUs carried on that route |
| **Canonical** | Self-canonical. No cross-canonicalising neighbourhood pages to a parent — that is an admission they are doorways |
| **Indexability** | Indexable only once it has real photos, real testimonials and a live stop. **Publish behind `noindex` until then** |

## 4d. Internal linking structure

```
/                        (home)
├── /drop                (canonical weekly drop page — every CTA lands here)
├── /route               (tracker hub: live map + full week calendar)
│   ├── /route/indiranagar
│   ├── /route/koramangala
│   └── /route/hsr-layout        ← per-stop shareable states (§2)
├── /bengaluru/indiranagar       ← neighbourhood landing pages
├── /bengaluru/koramangala
├── /bengaluru/hsr-layout
├── /bengaluru/whitefield
├── /bengaluru/banaswadi
├── /bengaluru/ramamurthy-nagar
└── /products/{sku}              ← product pages, linked from every neighbourhood page
```

**Two rules.** (1) `/route` links **down** to every neighbourhood page and each neighbourhood page links **back up** — that hub-and-spoke shape is what gives the pages "a proper place in the site's structure," which is one of the stated tests of a legitimate multi-location strategy **[PUB]**. (2) Neighbourhood pages link **sideways** only to genuinely adjacent stops, not to all six — an all-to-all footer link block is a doorway fingerprint.

## 4e. Avoiding the doorway-page penalty — the checklist

A page passes if it can answer **yes** to all of these. If it cannot, it should not be indexed.

- [ ] Does this page contain at least three facts that are **only true of this neighbourhood**? (stop location, day/time, typical sell-out time, a named landmark, a local society)
- [ ] Does it contain **at least one photograph taken in this neighbourhood**?
- [ ] Does it contain **at least one testimonial from someone who lives there**?
- [ ] Would a resident of that area find this page **more useful than the homepage**?
- [ ] Is the body copy **substantially rewritten**, not templated with the name swapped?
- [ ] Does the page **do something** (notify-me, order, live tracker link) rather than funnel to a single generic page?
- [ ] Does the van **actually go there**?

The last one is the real test. Google's doorway definition is a page "designed to intercept traffic for a particular search query and redirect or funnel that visitor to a different page with the actual content" **[PUB]**. A page whose stop card lets a person meet a real van at a real gate on a real Thursday is not that page.

## 4f. Product page spec block — is it feasible?

The proposal is a technical spec block on each product page: **hydration %, ferment hours, bake time, flour, method**.

| Field | Feasibility | Note |
|---|---|---|
| **Hydration %** | ✅ Feasible and safe | It is a ratio, not a recipe. Publishing "78% hydration" gives away nothing a competent baker could not infer, and it is a strong credibility signal to the exact audience Fillo wants |
| **Ferment / proof hours** | ✅ Feasible | "16-hour cold ferment" is the most compelling single number a bakery can publish. It explains the price |
| **Bake time & temperature** | ⚠️ Publish time, consider withholding temperature | Time is atmospheric; temperature edges toward the actual process. Judgement call for the founder |
| **Method name** | ✅ Feasible | Yudane / tangzhong is the whole Japanese-bread story and is public knowledge. **Explain it in one sentence** — the audience mostly does not know the word |
| **Flour / origin** | ✅ Feasible if the supply chain is stable | Only publish what you can guarantee weekly. A spec that changes silently is worse than no spec |
| **Eggless / allergen declaration** | ✅ **MUST**, not optional | The core claim. Must be unambiguous, and must state what *is* in it (dairy? butter?) not only what is not |
| **Shelf life & storage** | ✅ **MUST** | A fresh-today loaf with no storage guidance generates avoidable complaints |
| **Weight & servings** | ✅ **MUST** | Basic, frequently missing on Indian bakery PDPs |

**The strategic point:** the spec block is Fillo's cheapest differentiator on the PDP. Competitor bakery product pages in Bengaluru are almost universally a photo, a price and two lines of adjectives (see `competitors.md`). A page that says *"78% hydration · 16-hour cold ferment · yudane method · eggless, contains dairy · best within 48 hours"* is doing something nobody else in the category does, costs nothing to produce, and gives the neighbourhood pages something substantive to link to.

**Risk to manage:** every published number becomes a promise. Publish only what the kitchen can hold to every week, and review the spec block when a recipe changes.

## 4g. (c) India cost bands

| Line item | Band | Confidence |
|---|---|---|
| Neighbourhood page template design (one template, six instances) | **₹25,000–60,000** one-off | **[Est.]** |
| Copywriting, 6 pages × 300–500 unique words + local FAQ | **₹18,000–45,000** | **[Est.]** |
| Photography — one shoot per stop, van in situ | **₹15,000–40,000** for all six | **[Est.]** |
| Schema implementation (LocalBusiness + FAQPage) | **₹8,000–20,000** | **[Est.]** |
| Product page spec block — design + content for the core range | **₹15,000–35,000** | **[Est.]** |
| Ongoing: refresh testimonials + sell-out data per page, monthly | **₹4,000–8,000/month** | **[Est.]** |

## 4h. (d) Benchmark facts

1. **The local pack is where the clicks are.** The Map Pack appears in ~93% of local-intent searches and takes ~44% of clicks, ahead of organic (29%) and ads (21%); position 1 in the pack sees a 17.8% CTR **[PUB]**. This means the neighbourhood pages' primary job is to *support* the Google Business Profile (owned in `exec-primary.md`), not to replace it.
2. **Local intent converts to footfall inside a day.** 46% of all Google searches have local intent and 76% of people searching for something nearby visit a business within 24 hours **[PUB]**. For a van with a fixed weekly slot, a page that states the day and time is capturing exactly this behaviour.
3. **Google has been explicit about city pages for a decade.** Doorway pages have been penalised since 2015, remain listed under Google's spam policies, and Google has specifically warned that city landing pages can *be* doorway pages **[PUB]**. The stated pass condition is that "each page has a clear reason to exist, real local detail, and a proper place in the site's structure" **[PUB]** — which is exactly what a real van stop provides.

---
---

# 5. CREATOR PARTNERSHIPS

**The case for creators over ads for Fillo specifically.** Fillo has three things that make creator content unusually cheap and unusually effective: a **visually distinctive object** (the wrapped van), a **scarcity mechanic** (the drop), and a **novel category claim** (Japanese eggless). It also has three constraints: a small budget, a product with a 48-hour shelf life, and a route that only reaches six neighbourhoods. The correct programme is therefore **geographically targeted nano/micro seeding with a small paid layer**, not a mid-tier campaign.

## 5a. Bengaluru food-creator rate card, 2026

**Instagram Reel — India, by tier [PUB]:**

| Tier | Followers | Per-reel band (general) | Per-deliverable band |
|---|---|---|---|
| **Nano** | 1K–10K | **₹2,000–8,000**; wider range ₹1,000–12,000 depending on niche and engagement | ₹2,000–8,000 |
| **Micro** | 10K–100K | **₹2,000–35,000** | ₹8,000–80,000 |
| **Mid** | 100K–500K | — | **₹50,000–3,50,000** |
| **Macro** | 500K–1M | ₹84,000–7,90,000 | — |

**Food-niche adjustment — this is the number that matters [PUB]:**

- **Food micros at ~50K followers: ₹15,000–35,000**, against beauty/fashion micros at the same tier commanding ₹25,000–60,000.
- **Finance and tech command 30–50% higher rates than lifestyle or food.**
- Entry point across the market is **~₹3,000 for a nano creator reel**.

**Bengaluru adjustment [Est.].** The cited data explicitly notes that a Mumbai beauty micro at 45K can out-price a Bangalore fitness creator at 180K "because the beauty auction has more buyers" **[PUB]**. Bengaluru food is a **buyer-thin auction** relative to Mumbai/Delhi lifestyle. Practical planning bands for **Bengaluru food creators**:

| Tier | Bengaluru food reel [Est.] | Notes |
|---|---|---|
| Nano (1–10K) | **₹0 (barter) – ₹5,000** | Barter is the norm at this tier |
| Micro (10–50K) | **₹6,000–20,000** | Fillo's core target band |
| Micro-upper (50–100K) | **₹15,000–35,000** | **[PUB]**-anchored at the 50K point |
| Mid (100–200K) | **₹35,000–90,000** | Occasional use only, for a launch moment |

**Named Bengaluru food creators found in tier-mapping tools** (as directional examples of the local pool, not endorsements): Arijit Choudhury (~170.8K), Gourav Mahendra (~125.8K), Hitesh Bhayal (~109.7K), Food Clicks (~25.7K), FABulous Explorers / Food and Bengaluru (~23.1K), Foody Monk **[PUB]**. Fillo's programme should live in the 5K–40K band, which these directories under-index and which is best found manually via neighbourhood geotags.

## 5b. Barter vs paid — the norms for food in India

| | Barter / seeding | Paid |
|---|---|---|
| **Applicable tier** | Nano and lower-micro; India-specific practice starts from as low as **1,000 followers** **[PUB]** | Upper-micro and above |
| **Post rate** | Barter deals see an **80–90% post rate when properly executed** **[PUB]** | ~100%, contractual |
| **Control** | Low — no guaranteed deliverable, timing or framing | High — brief, deadline, usage rights |
| **Cost** | Product COGS + delivery | Fee + product |
| **Role** | Barter is "the always-on engine for product discovery and creator relationships" **[PUB]** | Paid is "the focused layer for launches and performance pushes" **[PUB]** |

**The Fillo read: barter-led, paid-punctuated.** Run a permanent seeding programme at nano/micro tier (the always-on engine) and reserve paid for **three or four moments a year** — the van livery reveal, a festive gifting drop, a new neighbourhood launch. The product itself is an unusually strong barter currency: a warm, photogenic, novel loaf handed over from a wrapped van is a better piece of content for the creator than most brands can offer.

**The Fillo-specific barter trap:** a 48-hour shelf life means a hamper posted three days later is a bad experience. **Seed at the van, in person, on the creator's own route day.** This converts a logistics constraint into the best part of the offer — the creator gets an experience, a location and a character, not a parcel.

## 5c. Deliverables spec — what to ask for

| Deliverable | Spec | Why |
|---|---|---|
| **1 × Instagram Reel, posted as a Collab** | Fillo added as collaborator before publish | Collab posts appear on both profiles; Q1 2026 data indicates collabs generate **~47% more impressions than single-author posts in the first 24 hours** **[PUB]**. Up to 5 collaborators are permitted, so one post can sit on 6 profiles **[PUB]** |
| **2–3 × Stories** with link sticker to `/drop` | Posted same day as the reel | Stories carry the click; the reel carries the reach |
| **Geotag of the neighbourhood** on the reel | Mandatory in the brief | Directly supports the neighbourhood pages in §4 |
| **Tag + mention** of @fillobakes | Mandatory | |
| **ASCI-compliant disclosure** | See §5e — non-negotiable | |
| **Usage rights**, 3–6 months, organic + paid | Stated in the brief | Lets Fillo re-run the best asset as an ad. Frequently forgotten and expensive to buy later |
| **Raw footage** (GOOD) | Optional, small uplift | Feeds the brand's own edit for Shorts (`exec-tertiary.md`) |

**What not to ask for:** a follow, a specific caption verbatim, or an unreasonable turnaround. The three fastest ways to kill a micro-creator relationship in a small city where creators talk to each other.

## 5d. Outreach message — structure, not script

A template that works has six parts and fits in a DM without a "more" fold:

1. **Specific evidence you watched their work** — name the post, not the account. One sentence.
2. **Who Fillo is, in one line** — the Japanese eggless moving bakery.
3. **The hook that is about them, not you** — "we're parking in Indiranagar on Thursday and thought the van would shoot well at golden hour."
4. **The offer, stated plainly** — barter (what exactly they get) or paid (a number, or "what's your rate for a reel + 2 stories?"). **Never open with "collab for exposure."**
5. **The ask, small and specific** — one reel, two stories, collab tag. Not "some content."
6. **A low-friction next step** — "want me to hold a loaf for Thursday?"

**Rules:** send from the brand account, not a personal one. Follow up **once**, after five days, then stop. Ask their rate rather than stating a budget when you genuinely don't know the tier — food creator rates in Bengaluru vary more than the published bands suggest.

## 5e. ASCI disclosure — the compliance floor

**These are rules, not guidance. All are [PUB].**

| Rule | Detail |
|---|---|
| **Barter counts** | ASCI has made it mandatory to label **all** promotional content, whether the creator received money **or goods in barter** |
| **What counts as material connection** | Free products or **unsolicited gifts**, discounts, contest/sweepstake entries, trips or hotel stays, media barters, coverage, awards, or any family or employment relationship |
| **Placement** | Disclosure must be **upfront, prominent and easily understandable**, and must appear **in the first two lines of the caption** |
| **Permitted labels** | "Advertisement", "Ad", "Sponsored", "Collaboration", "Employee", "Free Gift" |
| **Video (Reels / Shorts / YouTube)** | A **verbal disclosure within the first 10 seconds**, **in addition to** a text overlay. The verbal disclosure must clearly state the content is sponsored or paid |
| **Explicitly non-compliant** | Disclosures buried in hashtags, hidden at the end of the post, or visible only after clicking "More" |

**Operational consequence for Fillo:** the brief must specify the label, its placement, and — for reels — the 10-second verbal and the overlay. Put this in the brief as a **checklist the creator ticks**, not a legal paragraph. And note that Fillo's own **sold-out and drop posts** are unaffected (owned media), but any **re-share of creator content as a Fillo ad** must retain the disclosure.

## 5f. (a) MUST-HAVE

| # | Element / task |
|---|---|
| 1 | **A creator brief document, one page** — product story, the three non-negotiables (eggless, Japanese method, fresh-today), what not to say, disclosure checklist, deliverables, usage rights, deadline |
| 2 | **A target list of 40–60 Bengaluru creators**, filtered by **neighbourhood on Fillo's route**, 3K–50K followers, food/lifestyle, with visible engagement (not follower count) as the sort key |
| 3 | **ASCI disclosure requirements written into every brief** — label, first two lines, 10-second verbal + overlay for video |
| 4 | **Collab-post request as standard** — Fillo added as collaborator before publish |
| 5 | **Geotag requirement** on every deliverable |
| 6 | **Usage rights clause**, minimum 3 months organic + paid |
| 7 | **A tracking sheet** — creator, tier, neighbourhood, offer type, sent date, posted date, reach, saves, link clicks, orders attributed (via a per-creator discount code or UTM) |
| 8 | **Per-creator trackable code or link** — otherwise the programme is unmeasurable and will be cut at the first budget review |
| 9 | **Seeding at the van, in person** — not shipped hampers (48-hour shelf life) |
| 10 | **A written monthly cadence and cap** so the programme does not become ad-hoc |
| 11 | **Repost permission workflow** — ask, get it in writing, save the asset |

## 5g. (b) GOOD-TO-HAVE

| Element | What it buys |
|---|---|
| **A "creator route day"** — one drop evening a month where 3–5 creators are invited to the same stop | Turns seeding into an event; creators make content of each other; one van visit produces five assets |
| **Neighbourhood ambassador** — one creator per route area, ongoing, small monthly retainer | Consistency beats reach at this scale; a recurring face per neighbourhood feeds the §4 pages |
| **Creator-named SKU or drop** | The single strongest ask a micro-creator will say yes to for free |
| **Paid amplification of the best barter asset** | Cheaper than commissioning a paid post, and you know it performs before you spend |
| **Local illustrator collabs** (per `exec-brandworld.md` §1e — the low-cost alternative to licensed IP) | Character/merch content, not just food content |
| **Creator feedback loop into the product** | Free R&D and it makes the relationship reciprocal |
| **A press/creator kit page** on the site | Assets, facts, the story, the FSSAI/eggless specifics — reduces the back-and-forth per creator |

## 5h. Monthly seeding programme on a small budget

**Structure [Est.] — a 12-creator month at roughly ₹25,000–40,000 all-in:**

| Layer | Volume/month | Offer | Cost |
|---|---|---|---|
| **Barter seeding, nano (3–10K)** | 8 creators | Loaf + a small hamper, handed over at the van | COGS only — **₹400–800 each → ₹3,200–6,400** |
| **Barter+ , micro (10–30K)** | 3 creators | Hamper + a small honorarium ₹2,000–4,000 to secure a deliverable commitment | **₹7,500–15,000** |
| **Paid, upper-micro (30–60K)** | 1 creator | Reel + 2 stories + collab, contracted | **₹10,000–20,000** |
| **Programme management** | — | Sourcing, outreach, briefing, tracking, reposting | **₹8,000–15,000/mo [Est.]** if agency-run |

At an 80–90% barter post rate **[PUB]**, a 12-creator month should yield **~10 posted assets**, of which 3–4 are usable as Fillo's own paid creative. This compares against agency-managed seeding programmes at **$3,000–15,000/month for 30–100+ creators** **[PUB]** — Fillo's version is deliberately one-tenth the scale and geographically concentrated, which for a six-neighbourhood van is the right trade.

**Rotation rule:** never seed the same creator twice in a quarter with the same product. Rotate on the **drop theme** instead — the weekly named drop (§3e) gives a legitimate reason to return to a creator four times a year without repeating yourself.

**Scale-back version [Est.]:** if the budget is **₹10,000/month**, run **6 nano barters + 1 micro barter+** and nothing else. The programme's value is consistency; six creators a month for six months beats thirty in one month.

## 5i. (c) India cost bands — summary

| Line item | Band | Confidence |
|---|---|---|
| Nano reel (1–10K), India | ₹2,000–8,000 (entry ~₹3,000) | **[PUB]** |
| Micro reel (10–100K), India | ₹2,000–35,000 | **[PUB]** |
| Food micro at ~50K | **₹15,000–35,000** | **[PUB]** |
| Mid-tier deliverable (100–500K) | ₹50,000–3,50,000 | **[PUB]** |
| Bengaluru food micro (10–50K) planning band | **₹6,000–20,000** | **[Est.]** |
| Barter hamper COGS | **₹400–800/creator** | **[Est.]** |
| Small-CPG creator campaign floor | from **~$1,000** (~₹85,000) | **[PUB]** |
| Agency-managed seeding, 30–100+ creators | $3,000–15,000/month | **[PUB]** |
| **Recommended Fillo monthly programme** | **₹25,000–40,000/month all-in** (₹10,000 scale-back version viable) | **[Est.]** |

## 5j. (d) Benchmark facts

1. **Food is the cheap niche, and that is the opportunity.** Food micros at 50K charge ₹15,000–35,000 against ₹25,000–60,000 for beauty/fashion at the same tier, and finance/tech command 30–50% more than lifestyle or food **[PUB]**. Fillo is buying in the least competitive creator auction in Indian influencer marketing.
2. **Collab posts are a free ~47% reach uplift.** Q1 2026 data indicates Instagram Collab posts generate ~47% more impressions than single-author posts within the first 24 hours, because content enters both follower bases' exploration streams simultaneously; up to 5 collaborators are permitted **[PUB]**. Requesting collab status costs nothing and is the highest-ROI single line in the brief.
3. **Barter works — at a documented rate.** Barter deals see an **80–90% post rate when properly executed**, and Indian practice supports barter from as low as 1,000 followers **[PUB]**. The planning implication: to get 10 posts, seed 12 creators, not 10.
4. **Disclosure applies to barter, not just cash.** ASCI mandates labelling for content where the creator received **goods in barter**, requires the label in the first two lines of the caption, and for video requires a **verbal disclosure in the first 10 seconds plus a text overlay** **[PUB]**. A seeding programme that skips this is a compliance exposure for both parties, and the most common failure in Indian small-brand seeding.

---
---

# Cross-cutting: the Secondary phase in one budget table

| Touchpoint | One-off | Monthly | Confidence |
|---|---|---|---|
| **1. Van livery** — bold partial, cast film, artwork, reflective, magnets, contingency | **₹55,000–1,05,000** | ₹0 | **[Est./QUOTE]** |
| **1b. Full-wrap upgrade path** | ₹75,000–1,45,000 | ₹0 | **[Est./QUOTE]** |
| **2. Tracker page + notify-me** | ₹25,000–50,000 | ₹500–1,500 + messages | **[PUB/Est.]** |
| **3. Weekly drop ritual** (Path B / Shopify) | ₹40,000–90,000 | ₹8,000–25,000 (apps + content) | **[Est.]** |
| **3b. Drop ritual on Path A (headless)** | ₹1,00,000–2,00,000 | ₹8,000–20,000 | **[Est.]** |
| **4. Product + neighbourhood pages** | ₹80,000–1,90,000 | ₹4,000–8,000 | **[Est.]** |
| **5. Creator partnerships** | ₹0 | ₹25,000–40,000 (₹10,000 minimum viable) | **[Est.]** |
| **Secondary phase total, recommended path** | **₹2,00,000–4,35,000** | **₹37,500–74,500/month** | **[Est.]** |

**Sequencing within weeks 4–10:**

| Week | Focus |
|---|---|
| 4 | BBMP/RTO/FSSAI enquiries filed · van survey & measurement · creator target list built |
| 5 | Livery artwork · neighbourhood page template design · wave-1 page copy · first barter seeding |
| 6 | Wrap printed & installed · van photography (feeds everything) · drop mechanics built on Shopify |
| 7 | Tracker page promoted to `/route` · notify-me live · first drop run in one neighbourhood |
| 8 | Wave-1 neighbourhood pages published · drop extended to second neighbourhood · first paid creator |
| 9 | Geofence alerts · wave-2 pages drafted · cap raised on first evidence |
| 10 | Wave-2 pages published · magnetic day-panels · review of the four-number log and the creator sheet |

---
---

# Sources

**Van livery — wraps, materials, cost**
- [vinyled.in — Car wrapping in Bangalore: cost & styles](https://vinyled.in/car-wrapping-in-bangalore/)
- [vinyled.in — Car wrapping in Bangalore, colour-change options & cost 2025](https://vinyled.in/car-wrapping-in-bangalore-2/)
- [IndiaMART — Car & bike vinyl wrap, Bengaluru (₹100/sq ft listing)](https://www.indiamart.com/proddetail/car-bike-vinyl-wrap-20196310391.html)
- [IndiaMART — Vinyl vehicle wraps, Bengaluru directory](https://dir.indiamart.com/bengaluru/vinyl-vehicle-wraps.html)
- [motorprotek — Car wrapping cost in India](https://motorprotek.com/blogs/news/car-wrapping-cost-in-india)
- [Identity Graphx — Vehicle wrap materials: cast vs calendered, 3M vs Avery vs ORACAL (2026)](https://identitygraphx.com/wraps/materials)
- [SignInk — 3M IJ180Cv3 cast vehicle wrapping vinyl](https://www.signink.com/3m-180cv3/)
- [WePrintWraps — 3M IJ180 printed wrap film](https://weprintwraps.com/our-products/3m-ij180-printed-wrap-film/)
- [Chicago Fleet Wraps — Wrap materials guide, Avery Dennison & 3M](https://chicagofleetwraps.com/materials/)
- [vinylfrog — The cost to vinyl wrap a van](https://www.vinylfrog.com/blogs/car-wrap-tips/the-cost-to-vinyl-wrap-a-van)
- [vinylfrog — Partial vehicle wraps](https://www.vinylfrog.com/blogs/car-wrap-tips/partial-vehicle-wraps)
- [Six08 Graphics — Partial vehicle wrap](https://six08graphics.com/products/truck-wrap-half)

**Van livery — legality & compliance**
- [Mondaq — BBMP Advertisement Bye-Laws, 2024: a new legal framework for Bengaluru's outdoor advertising](https://www.mondaq.com/india/advertising-marketing-branding/1656790/bbmp-advertisement-bye-laws-2024-a-new-legal-framework-for-bengalurus-outdoor-advertising)
- [Lexplosion — BBMP notifies the Advertisement Bye-Laws, 2024](https://lexplosion.in/bruhat-bengaluru-mahanagara-palike-notifies-the-bruhat-bengaluru-mahanagara-palike-advertisement-bye-laws-2024/)
- [TeamLease RegTech — BBMP (Advertisement) Bye-Laws, 2024](https://teamleaseregtech.com/updates/article/44794/bruhat-bengaluru-mahanagara-palike-advertisement-bye-laws-2024/)
- [Vidhi Legal Policy — Comments on the draft BBMP Advertisement Bye-laws, 2024 (PDF)](https://vidhilegalpolicy.in/wp-content/uploads/2024/09/unnamed-file.pdf)
- [ACKO — Is car wrapping legal in India? RTO rules](https://www.acko.com/car-insurance/blogs/is-car-wrapping-legal-in-india/)
- [Tata AIG — Is car wrap legal in India or not](https://www.tataaig.com/knowledge-center/car-insurance/is-car-wrap-legal-in-india-or-not)
- [MyHoardings — Permission required for branding on vehicles](https://www.myhoardings.com/FAQ/who-take-care-of-permission-required-for-branding-on-vehicles-in-delhi/)
- [MyHoardings — Tata Ace branding vehicle](https://www.myhoardings.com/FAQ/how-to-promote-my-company-using-tata-ace-branding-vehicle/)
- [FSSAI — Food Safety Display Boards](https://fssai.gov.in/business/fsdb)
- [QuickCompany — FSSAI licence and guidelines for food trucks](https://www.quickcompany.in/articles/fssai-license-and-guidelines-for-food-trucks)
- [LegalWiz — FSSAI licence process for a food truck](https://www.legalwiz.in/blog/fssai-license-process-for-food-truck)
- [Siddharth Enterprises — 3M/Orafol retro-reflective tape AIS-090 / AIS-089 pricing](https://www.siddharthenterprises.net.in/3m-orafol-retro-reflective-tape-ais-090-ais-089-red-white-yellow-2inch-x-50m-11060102.html)
- [Siddharth Enterprise — High-intensity prismatic reflective sheeting](https://www.siddharthenterprise.com/high-intensity-prismatic-sheeting.html)
- [3M India — Reflective sheeting](https://www.3mindia.in/3M/en_IN/p/c/films-sheeting/reflective-sheeting/)

**QR sizing**
- [Uniqode — How to size your QR codes](https://www.uniqode.com/blog/qr-code-best-practices/how-to-perfectly-size-your-qr-codes)
- [QRLynx — Minimum QR code size for print: the 10:1 rule](https://qrlynx.com/blog/qr-code-size-guide-print)
- [QR Code Generator — Minimum QR code size guidelines](https://www.qr-code-generator.com/blog/minimum-qr-code-size/)
- [Linkbreakers — QR code size and print dimension benchmarks](https://linkbreakers.com/help/article/qr-code-size-and-print-dimension-benchmarks)

**Live tracker & notify-me**
- [Chop Dawg — Mister Softee app case study](https://www.chopdawg.com/success-story/mister-softee/)
- [NBC10 Philadelphia — Mister Softee app tracks local ice cream trucks](https://www.nbcphiladelphia.com/entertainment/the-scene/mister-softee-app-track-truck/3852085/)
- [Yahoo Life — You can now track Mister Softee trucks with an app](https://www.yahoo.com/lifestyle/articles/now-track-mister-softee-trucks-210000288.html)
- [Mister Softee — App Store listing](https://apps.apple.com/us/app/mister-softee/id1472464240)
- [Traccar — open-source GPS tracking platform](https://www.traccar.org/)
- [Traccar — GitHub](https://github.com/traccar/traccar)
- [Zbotic — Vehicle GPS tracker with SIM7600 LTE (India, DIY build)](https://zbotic.in/vehicle-gps-tracker-real-time-location-with-sim7600-lte/)
- [IndiaMART — GPS vehicle tracking system pricing](https://m.indiamart.com/unitrack/gps-vehicle-tracking-system.html)
- [Country Delight](https://countrydelight.in/)
- [Google Play — Country Delight app](https://play.google.com/store/apps/details?id=app.mycountrydelight.in.countrydelight&hl=en-IN)
- [Legal500 — DPDP Act compliance for logistics: GPS tracking, telematics and workforce data risks](https://www.legal500.com/developments/thought-leadership/dpdp-act-compliance-for-logistics-and-supply-chain-companies-in-india-gps-tracking-telematics-and-workforce-data-risks/)
- [Elogs — Is GPS tracking legal in India?](https://elogs.in/blog/gps-tracking-legal-india/)
- [DataSecure — Geo-privacy: legal dimensions of location data in smart mobility](https://datasecure.ind.in/blogs/geo-privacy-legal-dimensions/)

**Weekly drop ritual**
- [Hotplate Blog — How baked-goods businesses grow on Hotplate](https://www.blog.hotplate.com/blog/how-pastry-businesses-grow-on-hotplate)
- [Hotplate Blog — Microbakery case study: San Pedro Sourdough](https://www.blog.hotplate.com/blog/microbakery-case-study-san-pedro-sourdough)
- [FindHomegrown — Hotplate review 2026: pricing + alternatives](https://findhomegrown.com/blog/hotplate-alternative)
- [Restomas — How pre-order systems help bakeries sell more with less waste](https://www.restomas.com/blog/how-pre-order-systems-help-bakeries-sell-more-with-less-waste)
- [Shopify App Store — Preorder Now Presale Timesact](https://apps.shopify.com/timesact-discount-pre-order)
- [Shopify App Store — Essent Preorder Back in Stock](https://apps.shopify.com/essential-pre-order)
- [Shopify App Store — Amp Back in Stock | Preorder](https://apps.shopify.com/back-in-stock)
- [Shopify App Store — Waitlist Flow · Alert Restocks](https://apps.shopify.com/waitlist-flow)
- [eShipz — Best back-in-stock apps for Shopify (2026)](https://www.eshipz.com/blog/best-back-in-stock-apps/)
- [TomTom Traffic Index — Bengaluru city report](https://www.tomtom.com/traffic-index/city/bengaluru/)
- [Down To Earth — Bengaluru among world's slowest cities, TomTom index](https://www.downtoearth.org.in/urbanisation/bengaluru-kolkata-among-worlds-slowest-cities-as-india-ranks-high-on-congestion-index)
- [Outlook Traveller — TomTom Traffic Index 2025](https://www.outlooktraveller.com/News/global-traffic-index-2025-indian-cities-among-the-most-congested-on-earth)

**Local search & product pages**
- [Locafy — Local SEO statistics for 2026](https://locafy.com/blog/local-seo-statistics)
- [SearchLab — Local SEO statistics 2026: local pack, reviews & GBP](https://searchlab.nl/en/statistics/local-seo-statistics-2026)
- [BizIQ — Local search statistics 2026: near-me, mobile & purchase data](https://biziq.com/blog/local-search-statistics/)
- [Shopify — Local SEO statistics 2026](https://www.shopify.com/blog/local-seo-statistics)
- [Search Engine Roundtable — Google warns against city landing pages; can be doorway pages](https://www.seroundtable.com/google-city-landing-pages-doorway-pages-28670.html)
- [Manning Search Marketing — Location pages vs doorway pages: best practices and pitfalls](https://www.manningmarketing.com/articles/location-pages-vs-doorway-pages-seo-best-practices-and-pitfalls/)
- [Big Red SEO — Doorway pages vs landing pages: hidden SEO risks in 2026](https://www.bigredseo.com/doorway-pages-vs-landing-pages/)
- [Arc4 — Local SEO landing pages: complete guide for 2026](https://arc4.com/resources/local-seo-landing-pages/)
- [Weightman Digital — Why your "one page per town" SEO strategy costs you leads](https://www.weightmandigital.com/one-page-per-town-seo-strategy-costing-leads/)

**Creator partnerships**
- [IdentityKit — Influencer rate card India 2026](https://www.identitykit.in/blog/influencer-rate-card-india-2026)
- [Upgrowth — Influencer pricing India 2026: rates by follower tier](https://upgrowth.in/influencer-marketing-pricing-india-2026/)
- [CreatorIQ India — Instagram influencer rates India 2026](https://creatoriq.in/rates/india-guide)
- [TickTime — Influencer rate card India 2026: reel, story & YouTube pricing](https://ticktime.media/blogs/influencer-rate-card-india-2026-instagram-reel-story-youtube-video-pricing)
- [TickTime — The 2026 guide to barter collaborations](https://ticktime.media/blogs/the-2026-guide-to-barter-collaborations-how-to-build-a-brand-without-a-marketing-budget)
- [CPG Marketing — How small food CPG brands run creator campaigns on tight budgets](https://www.cpgmarketing.ai/blog/influencer-marketing-small-cpg-brands-tight-budget)
- [Monarch Social Media — How much does product seeding cost?](https://www.monarchsocialmedia.com/how-much-does-product-seeding-cost/)
- [Hubfluence — Product seeding and influencer gifting guide](https://www.hubfluence.io/blog/product-seeding-influencer-gifting-guide)
- [ASCI — Influencer advertising guidelines (ASCI Social)](https://www.ascionline.in/social/)
- [Sansa Legal — ASCI influencer advertising guidelines 2026: disclosure rules](https://www.sansalegal.com/post/asci-influencer-advertising-guidelines-2026-disclosure-rules-for-paid-content-and-ai-influencers)
- [Haulpack — ASCI influencer marketing guidelines: updated rules](https://www.haulpack.com/blog/asci-guidelines-for-influencers/)
- [Khaitan & Co — ASCI influencer advertising guidelines for digital media](https://www.khaitanco.com/thought-leaderships/ASCI-releases-influencer-advertising-guidelines-for-digital-media-Effective-14-June-21-onward)
- [TryMyPost — Instagram collab posts strategy: boost reach in 2026](https://www.trymypost.com/blog/instagram-collab-posts-strategy-guide-2026)
- [Sked Social — Complete guide to Instagram collaboration posts 2026](https://skedsocial.com/blog/instagram-collaboration-feature)
- [Modash — Top Bangalore food influencers on Instagram](https://www.modash.io/find-influencers/india/bangalore/food)
- [Heepsy — Top food influencers in Bangalore / Karnataka](https://www.heepsy.com/ranking/top-food-influencers-in-bangalore)

---

_End of Secondary phase execution research._
