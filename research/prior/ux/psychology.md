# Fillo Bakes — UX Research Phase 3: The Psychology Layer

Documented behavioural principles, each with a source and a confidence mark, translated into one
concrete module or copy change for the Fillo site / drop tracker.

**Context assumed:** Japanese-style eggless bakery on a moving van, Bengaluru. Weekly drops with
honest caps, pre-order model, ~23 SKUs, subscription planned. Shokupan and most of the range are
unfamiliar to the Indian mainstream buyer. Brand promise is honesty (real caps, real waits, real
kitchen), so every persuasion lever below is chosen to be *truthful-compatible* — nothing that
requires a lie to work.

**Confidence key**
- **High** — meta-analysis, replicated effect, or peer-reviewed field experiment with behavioural
  (not just self-report) outcomes.
- **Medium** — single peer-reviewed study, lab-only outcome, or a real effect with known moderators
  that may not all hold in Fillo's context.
- **Low** — industry/practitioner data, vendor-reported benchmarks, or theory applied by analogy.

A standing caveat: several classics below (notably Wansink's menu-label work) come from a lab whose
research practices were later discredited. Where that applies it is flagged inline and confidence is
capped at Medium regardless of how often the number gets quoted.

---

## 1. Appetite on Screen

### 1.1 Food images are a physiological, not merely aesthetic, stimulus
**Finding.** Viewing appetising food images (vs. neutral images) raises subjective hunger and moves
appetite-related hormones — visual food cues act as conditioned stimuli that trigger anticipatory
"cephalic phase" responses before any food is present. This is the mechanism that makes food photography
work at all; it is not a styling preference.
**Source.** Schüssler et al., *PLOS ONE* (2020), "Visual stimulation with food pictures in the regulation
of hunger hormones and nutrient deposition" — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0232099;
Blechert et al., *Food-pics* image database, *Frontiers in Psychology* (2014) — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4067906/
**Confidence.** High.
**Fillo application.** The homepage hero must be food, at scale, above the fold — not the van, not the
logo, not a mood shot. The van is the *story*; the bread is the *trigger*. Reserve the van for the
second scroll module ("Where the van is this week").

### 1.2 Interior-revealing (cross-section) shots beat intact shots for indulgent food
**Finding.** Across four preregistered studies including a live Google Ads field test, packaging and
imagery that *reveal the interior* of an indulgent food (cut open, torn, sectioned) increased purchase
intention relative to intact depictions. The mediator is **sensory vividness** — the cross-section lets
the viewer mentally simulate texture and taste. The effect attenuates when the sensory information is
supplied some other way (e.g. an explicit texture description) or when the food is positioned as healthy.
**Source.** Liu, Y. (2026), "Seeing is wanting: Interior-revealing packaging depictions increase purchase
intentions for indulgent foods," *Marketing Letters* 37(21) — https://link.springer.com/article/10.1007/s11002-026-09816-7
**Confidence.** High (preregistered, multi-study, includes field data).
**Fillo application.** Every SKU card gets a mandatory **two-image pair: whole loaf → torn/sliced
cross-section**, with the cross-section as the *default* thumbnail for shokupan, milk buns and any
filled item. Shokupan's whole selling point is the crumb — the pull-apart shot *is* the product
description. Note the moderator: if you use the cross-section, you can dial *back* the texture prose;
if you skip it, you must write the texture out in words.

### 1.3 Animated motion cues (steam) raise desirability — but only real animation, not implied motion
**Finding.** Adding **animated traces of steam** to food images raised perceived temperature, perceived
freshness, and desirability. Critically, *implied* motion in a still image did not produce the effect —
the animation had to actually move. A boundary condition: steam animation helped most when the
underlying food photo was *less* appealing.
**Source.** Zhang, Desebrock, Okajima & Spence (2024), "'Hot stuff': Making food more desirable with
animated temperature cues," *Food Quality and Preference* 120 — https://www.psy.ox.ac.uk/publication/1998717
**Confidence.** Medium-High (three online experiments; self-reported desirability, not purchase).
**Fillo application.** One — and only one — **looping 2–3s video/WebP of steam rising off a just-cut loaf**,
placed in the drop-day hero when the drop is live. Do not sprinkle CSS "steam" over every card: the
effect is strongest on the weakest image, so use it as a rescue for the one shot you can't retake, and
as a live-drop signal everywhere else. Respect `prefers-reduced-motion` with a static fallback.

### 1.4 Dynamic imagery raises perceived *energy* of the food — which is a two-sided lever
**Finding.** Four experiments: dynamic imagery on menus caused customers to perceive the food as
*higher energy* (more caloric/rich). This raised purchase intention for hedonically-motivated diners and
did the opposite for functionally-motivated ones. The effect disappeared when nutrition information was
made salient, and only appeared for high-energy-density foods.
**Source.** Du, Y. & Wang, X. (2024), "Dynamic or static? The effect of food imagery on menus on perceived
food energy and purchase intention," *Journal of Retailing and Consumer Services* 81 —
https://ideas.repec.org/a/eee/joreco/v81y2024ics0969698924003382.html
**Confidence.** Medium (single paper, four experiments, self-report outcomes).
**Fillo application.** Segment the motion by SKU intent. **Motion on the indulgent tier** (cream buns,
melon pan, anything filled). **Stills on the everyday tier** (plain shokupan, the subscription loaf) —
that tier is bought functionally, as the week's bread, and making it read as richer works against the
"this is your daily loaf" framing the subscription depends on.

### 1.5 Colour is the single strongest intrinsic cue for expected flavour — and mismatch punishes you
**Finding.** Spence's review: colour is the most important product-intrinsic sensory cue in setting
taste and flavour expectations; changing hue or saturation shifts expectation and therefore the
experienced taste. When the colour does not match the taste that arrives, the result is *negatively
valenced disconfirmation* — worse than never having set the expectation.
**Source.** Spence, C. (2015), "On the psychological impact of food colour," *Flavour* 4:21 —
https://flavourjournal.biomedcentral.com/articles/10.1186/s13411-015-0031-3
**Confidence.** High (review of a large literature).
**Fillo application.** **Ban colour grading on product photography.** Shokupan crumb is pale ivory-white;
if the site's warm/retro palette pushes the photos golden, the buyer expects a brioche-rich, eggy crumb
and gets a milky, restrained one — a disconfirmation, on the exact attribute (eggless) the brand is
staking. Put the retro warmth in the *surrounding UI* (background paper, buttons, type), and keep the
food itself colour-accurate on a neutral card. Write this into the shoot spec as a hard rule.

### 1.6 Plating and arrangement move willingness to pay, not just liking
**Finding.** Visual composition of a dish — artistic vs. conventional arrangement, neatness, height,
orientation — shifts hedonic evaluation, perceived portion size, perceived healthiness *and willingness
to pay*. Art-inspired plating is preferred and commands a price premium; there is even a documented
preference for oblique lines ascending to the right.
**Source.** Michel, Velasco, Spence and colleagues; see Zellner et al. and the Flavour paper "Aesthetic
plating: a preference for oblique lines ascending to the right" — https://link.springer.com/article/10.1186/s13411-015-0037-x;
review in *Food Perception and Aesthetics* — https://www.tandfonline.com/doi/full/10.1080/15428052.2020.1824833
**Confidence.** Medium (robust direction, effect sizes vary by study and cuisine).
**Fillo application.** For the **gift-pack and subscription-box images specifically**, shoot arranged
compositions (staggered slices on a diagonal, tiered box) rather than flat top-downs — those are the two
highest-price SKUs, and arrangement is the cheapest available WTP lever. Keep single-SKU shots plain so
the arranged shots stay distinctive.

---

## 2. Scarcity Done Honestly

### 2.1 Supply-based scarcity is the *right* kind of scarcity for an experience like a drop
**Finding.** Meta-analysis of 416 effect sizes from 131 studies: scarcity raises purchase intentions
overall, but the effective *type* depends on product type. **Demand-based scarcity** (popularity,
"selling fast") works best for utilitarian products; **supply-based scarcity** (limited quantity, "we
only bake N") works best for **experiences**; time-based scarcity works best for high-involvement
purchases.
**Source.** Barton, Zlatevska & Oppewal (2022), "Scarcity tactics in marketing: A meta-analysis of
product scarcity effects on consumer purchase intentions," *Journal of Retailing* 98(4), 741–758 —
https://www.sciencedirect.com/science/article/pii/S0022435922000434 (open PDF: https://pure.bond.edu.au/ws/files/182976505/Scarcity_tactics_in_marketing.pdf)
**Confidence.** High (meta-analysis).
**Fillo application.** A drop is an experience, so lead with **supply framing, not countdown framing**:
the drop module headline is "**We bake 40 loaves on Saturday. 12 left.**" — not "Sale ends in 04:12:33."
Fillo's honest cap is, by the literature, already the strongest available form of scarcity for what it
sells. This is the rare case where the truthful option is also the higher-performing one.

### 2.2 Limited-quantity beats limited-time, mediated by perceived consumer competition
**Finding.** Limited-quantity scarcity messages produced higher purchase intentions than limited-time
messages, and the effect was **mediated by perceived competition with other consumers** — the sense that
someone else will take it. The advantage widens for symbolically-positioned brands.
**Source.** Aggarwal, Jun & Huh (2011), "Scarcity messages: A consumer competition perspective,"
*Journal of Advertising* 40(3), 19–30 — https://www.tandfonline.com/doi/abs/10.2753/JOA0091-3367400302
**Confidence.** High (well-cited, replicated direction).
**Fillo application.** Make the competition **visible and true**: a live counter on the drop page —
"**23 of 40 claimed**" — updating from real orders, plus a small ticker "Anjali in Indiranagar just took
2." The mediator is the perception of other buyers, so *showing the other buyers* is the mechanism, not
decoration. Only ship this if the numbers are wired to the real order table; a fake ticker triggers §2.4.

### 2.3 Sold-out is social proof, and *why* it sold out changes what buyers infer
**Finding.** Unavailability raises perceived value and desirability. But the *attributed cause* matters:
items unavailable due to **market demand** are judged more valuable and more unique than items
unavailable by accident or through abundance. Sold-out functions as a popularity signal — buyers infer
quality from others' purchases.
**Source.** Worchel, Lee & Adewole (1975), "Effects of supply and demand on ratings of object value,"
*JPSP*; Verhallen & Robben, "Scarcity and preference: An experiment on unavailability and product
evaluation" — https://www.researchgate.net/publication/222478926_Scarcity_and_Preference_An_Experiment_on_Unavailability_and_Product_Evaluation
**Confidence.** High (foundational, replicated).
**Fillo application.** **Never hide or grey out a sold-out SKU** — keep it in the grid, full colour, with
a stamped overlay that names the cause: "**Sold out in 41 minutes — 40 baked, 40 gone.**" Then attach a
"Tell me first next Saturday" button. The sold-out card is doing three jobs at once: social proof,
honest-cap evidence, and waitlist capture. Sort sold-out items *after* available ones but keep them on
the page.

### 2.4 Fake or manufactured scarcity triggers reactance and retailer avoidance
**Finding.** Reactance (Brehm, 1966) is the motivational state aroused when a person perceives a
freedom being threatened; the response is to restore the freedom — often by refusing. Applied to retail:
when consumers encounter social or temporal scarcity cues they may **question the credibility** of the
message and perceive the purchase as coerced; these reactance-based responses are associated with
**greater intention to avoid the retailer entirely**. In one line of work on limited-time offers,
reactance operated as a *stronger negative mediator* than scarcity was a positive one. Practitioner
observation converges: the first fake timer may work; by the third, buyers discount everything on the
page.
**Source.** Brehm, J.W. (1966), *A Theory of Psychological Reactance*; Rosenberg & Siegel (2018),
"A 50-year review of psychological reactance theory" — https://scholar.dominican.edu/cgi/viewcontent.cgi?article=1002&context=psychology-faculty-scholarship;
Stevens et al. (2026), "Beyond the Shelf: Navigating Scarcity in the Digital Age," *Psychology & Marketing* —
https://onlinelibrary.wiley.com/doi/10.1002/mar.70232
**Confidence.** High for reactance theory itself; Medium for the specific retail-avoidance magnitude.
**Fillo application.** Adopt a public, one-line **"Honest Caps" pledge** and put it directly under every
scarcity number: "*This number is our real oven capacity. We have never added a fake one and never will.*"
Then earn it visibly — on weeks that *don't* sell out, the page must say "Didn't sell out this week —
still 9 loaves at 4pm." A cap that is sometimes not reached is the proof that the cap is real, and it
inoculates every future sold-out against the credibility discount.

### 2.5 Countdown timers: real effect, weak evidence base, high reactance cost
**Finding.** Vendor and agency data report conversion lifts in the 8–25% range for genuine deadlines,
with short believable windows outperforming long ones and specific clocks outperforming vague
"limited time" copy. There is no strong independent academic evidence for the timer *widget* per se;
the underlying deadline effect is better established than the UI. Luxury and high-consideration
categories show the smallest and sometimes negative effects, because urgency conflicts with deliberate
purchasing.
**Source.** Aggregated practitioner data (Growave, LiquidBoost, Clean Commit) — https://cleancommit.io/blog/do-countdown-timers-work/;
IMRG on countdown clocks as retail practice — https://www.imrg.org/blog/countdown-clocks-on-websites-good-or-bad-retail-practice/
**Confidence.** Low (vendor-reported, no controlled academic replication located).
**Fillo application.** Use **one** clock, and make it a *calendar* deadline, not a pressure device:
"**Pre-orders close Thursday 9pm — 1 day 4 hrs**" on the drop page only. It is stating a real production
cutoff (you have to know the dough count), which reads as operations rather than manipulation. Do not
put a timer on individual SKU cards or in the cart.

### 2.6 Waitlists convert because progress feels owed — the goal-gradient and endowed-progress effects
**Finding.** People accelerate effort as they approach a goal, and **artificial head-start progress**
("2 of 12 stamps already filled") produces real acceleration and higher completion than an equivalent
program starting at zero — demonstrated in a café loyalty field study and an online rating study, with
persistence effects on retention.
**Source.** Kivetz, Urminsky & Zheng (2006), "The Goal-Gradient Hypothesis Resurrected," *Journal of
Marketing Research* 43(1), 39–54 — https://journals.sagepub.com/doi/abs/10.1509/jmkr.43.1.39
**Confidence.** High (field + lab, well cited).
**Fillo application.** The waitlist should not be a dead email box — make it a **visible position with
progress**: "You're #7 in line. 4 loaves usually free up by Friday from cancellations — you're likely
in." And when the subscription launches, seed the loyalty card with progress already on it ("Your first
2 stamps are on us — you've been here since drop #3") rather than starting new subscribers at zero.

---

## 3. Choice Architecture

### 3.1 Choice overload is real but conditional — 23 SKUs is not automatically a problem
**Finding.** The famous jam study (6 vs. 24 jams; 30% vs. 3% purchase) is widely cited but poorly
replicated — Scheibehenne, Greifeneder & Todd's meta-analysis of 50 experiments found a mean effect
near zero (d ≈ 0.02). The corrective meta-analysis by Chernev, Böckenholt & Goodman (99 observations)
resolves it: assortment size causes overload **only** under four moderators — high **choice set
complexity**, high **decision task difficulty**, high **preference uncertainty**, and a non-specific
**decision goal**.
**Source.** Iyengar & Lepper (2000), *JPSP*; Scheibehenne, Greifeneder & Todd (2010), *Journal of
Consumer Research*; Chernev, Böckenholt & Goodman (2015), "Choice overload: A conceptual review and
meta-analysis," *Journal of Consumer Psychology* 25(2), 333–358 —
https://chernev.com/wp-content/uploads/2017/02/ChoiceOverload_JCP_2015.pdf
**Confidence.** High (two meta-analyses in agreement once moderators are modelled).
**Fillo application.** Fillo hits **three of the four risk moderators at once**: the buyer has high
preference uncertainty (they've never had shokupan), high task difficulty (unfamiliar Japanese names),
and usually no specific goal ("what even is this shop?"). So 23 SKUs *is* a live risk here — but the fix
is not to cut the menu, it is to **collapse the first decision**. First-time visitors see a **3-choice
entry screen** ("The Loaf · The Sweet Bun · The Starter Box"), with "See all 23" as a secondary link.
Returning buyers (cookie/account) skip straight to the full grid, since familiarity removes the moderator.

### 3.2 Categories increase perceived variety and satisfaction — for novices specifically
**Finding.** The **mere categorization effect**: the presence of categories — irrespective of their
content or informativeness — increases perceived assortment variety and outcome satisfaction. The
effect holds for choosers **unfamiliar** with the domain and disappears for experts, who read variety
from the options themselves.
**Source.** Mogilner, Rudnick & Iyengar (2008), "The Mere Categorization Effect," *Journal of Consumer
Research* 35(2), 202–215 — https://academic.oup.com/jcr/article-abstract/35/2/202/1806103
**Confidence.** High.
**Fillo application.** Group the 23 SKUs under **more categories than strictly necessary, named in
plain-English benefit terms**, not Japanese taxonomy: "Daily loaves · Sweet buns · Savoury buns ·
Sandwich-ready · Gift boxes · This week only." Six named shelves for 23 items will read as *more* variety
and produce more satisfied choosers than three efficient ones — precisely because Fillo's audience are
novices in this domain.

### 3.3 Descriptive, evocative item names lift sales and post-purchase attitude
**Finding.** In a six-week restaurant field study, descriptive menu labels ("Grandma's zucchini cookies,"
"succulent Italian seafood filet") increased sales of the labelled items ~27% and improved attitudes to
the food, the restaurant, and repatronage intent — the identical food, renamed.
**Source.** Wansink, Painter & van Ittersum (2001), "Descriptive Menu Labels' Effect on Sales," *Cornell
Hotel and Restaurant Administration Quarterly* 42(6) — https://journals.sagepub.com/doi/10.1177/0010880401426008
**Confidence.** Medium — *flagged*. Wansink's lab was subject to a major research-integrity investigation
and multiple retractions; this specific paper has not been retracted but the 27% figure should be treated
as directional, not as a planning number. The underlying direction is independently supported by later
descriptive-food-name work (https://www.sciencedirect.com/science/article/abs/pii/S0278431920300852).
**Fillo application.** Every SKU gets a **two-line name**: the real Japanese name on line one, a sensory
descriptor on line two — "**Shokupan** / pull-apart milk loaf, cloud-soft, no egg." This does double duty:
it is the descriptive label (§3.3) *and* the unfamiliarity remedy (§4.2). Ban bare names like "Melon Pan"
standing alone.

### 3.4 Defaults are the strongest single lever in choice architecture
**Finding.** Pre-selected options dominate outcomes — the canonical demonstration is organ-donation
consent at 85.9–99.98% under opt-out defaults vs. 4.25–27.5% under opt-in. A meta-analysis of default
effects confirms robustness while quantifying variation by domain. Mechanisms: status-quo bias, loss
aversion, and **implicit endorsement** — people read the default as the seller's recommendation.
**Source.** Johnson & Goldstein (2003), *Science* 302:1338–39; Jachimowicz et al., "When and why defaults
influence decisions: a meta-analysis of default effects," *Behavioural Public Policy* —
https://www.cambridge.org/core/journals/behavioural-public-policy/article/when-and-why-defaults-influence-decisions-a-metaanalysis-of-default-effects/67AF6972CFB52698A60B6BD94B70C2C0
**Confidence.** High.
**Fillo application.** In the subscription flow, **default to weekly-1-loaf on the shokupan**, with
"pause any week" adjacent to the toggle rather than buried. The implicit-endorsement mechanism means the
default also *communicates the intended ritual* — one loaf, every week — which is exactly the habit §5.4
is trying to install. Do **not** default-add gift boxes or upsells to the cart; that is where defaults
cross into dark-pattern territory and collide with §2.4.

### 3.5 Price presentation: drop the currency symbol, don't drop the honesty
**Finding.** Field study at a Culinary Institute of America restaurant (201 dining parties): menus with
**numerals only** produced ~8.15% higher spend per person than menus showing "₹/$" or prices written out
as words. Proposed mechanism: explicit money references cue the **pain of paying**.
**Source.** Yang, Kimes & Sessarego (2009), "$ or Dollars: Effects of Menu-price Formats on Restaurant
Checks," *Cornell Hospitality Report* — https://ecommons.cornell.edu/entities/publication/1ca7d603-ee0c-4721-9003-91ca4f87cfa2
**Confidence.** Medium (single field study, restaurant context, not e-commerce; checkout must always
show full currency for legal/clarity reasons).
**Fillo application.** On the **browse grid** show `220` not `₹220.00`; in the **cart and checkout** show
`₹220` in full with all charges itemised. Browsing is where pain-of-paying suppresses exploration;
checkout is where hidden costs destroy trust — and per §3.6 obscured component pricing is the fastest way
to lose a bundle sale.

### 3.6 Bundles: frame the extra as a gift, not as a discount, and never hide component prices
**Finding.** Bundling reduces evaluation cost and the pain of paying by collapsing several yes/no
decisions into one. But **framing decides the outcome**: a price-*discount* frame on a non-complementary
bundle reduces "smart shopper" feelings, whereas a **free-gift frame** preserves them. Absolute-savings
framing ("Save ₹120") tends to outperform percentage framing via loss aversion. Obscured component
pricing inside a bundle damages trust.
**Source.** "Framing the Unlikely Pair: 'Free Gifts' Heuristic in Evaluation of Non-Complementary Product
Bundles" — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12466855/; Li et al. (2022), "Impact of mixed
bundling type on consumers' value perception," *International Journal of Consumer Studies* —
https://onlinelibrary.wiley.com/doi/abs/10.1111/ijcs.12776
**Confidence.** Medium.
**Fillo application.** Build gift packs as **mixed bundles with a visible line-item breakdown** — each
item at its normal price, then one line "**+ Kyoto tea cake — our gift, ₹0**" and a footer "**You save
₹120**" (rupees, not percent). This satisfies both mechanisms: the gift frame protects the smart-shopper
feeling on an assortment that isn't naturally complementary, and the itemisation removes the hidden-price
trust penalty.

---

## 4. Trust for a New Brand

### 4.1 The first five reviews do almost all the work
**Finding.** Purchase likelihood for a product with **five reviews is 270% higher** than for a product
with none; marginal benefit falls off sharply after the fifth. Effects are larger for higher-priced
items (+380% vs. +190% for cheap items). Purchase likelihood **peaks between 4.0 and 4.7 stars and
declines toward 5.0** — perfect scores read as implausible. Verified-buyer badges raise purchase odds
~15%. Displaying negative reviews establishes credibility rather than destroying it.
**Source.** Medill Spiegel Research Center (2017), "How Online Reviews Influence Sales," Northwestern —
https://spiegel.medill.northwestern.edu/how-online-reviews-influence-sales/ (eBook PDF:
https://spiegel.medill.northwestern.edu/wp-content/uploads/sites/2/2021/04/Spiegel_Online-Review_eBook_Jun2017_FINAL.pdf)
**Confidence.** High for direction; Medium for the exact percentages (single commercial dataset, not
peer-reviewed).
**Fillo application.** Treat "**five reviews per SKU**" as a **launch gate**, not a growth metric: no SKU
goes on the main grid until it has five, and the first drops should ship with a physical card in the bag
asking for one review with a QR code. Show the star average with the count and **do not suppress the
3-star reviews** — a 4.6 with a visible "crust was too dark for me" is worth more than a silent 5.0.

### 4.2 Information reduces the neophobia penalty on unfamiliar food
**Finding.** Food neophobia depresses willingness to try unfamiliar items, and **providing information
reduces that penalty**: nutrition/product information increased willingness to consume unfamiliar Asian
menu items among American consumers by reducing uncertainty; educational information raised willingness
to eat novel foods in multiple studies; taste-quality information specifically raises willingness to try.
Acceptance rises further after tasting.
**Source.** Kim et al., "Effects of Food Neophobia, Familiarity, and Nutrition Information on Consumer
Acceptance of Asian Menu Items" — https://www.researchgate.net/publication/240242160;
Lee et al. (2025), *Journal of Sensory Studies* — https://onlinelibrary.wiley.com/doi/10.1111/joss.70031;
information-provision effects in *npj Science of Food* (2026) — https://www.nature.com/articles/s41538-026-00826-3
**Confidence.** High (consistent direction across many studies and food categories).
**Fillo application.** Ship a **"What is shokupan?" module directly inside the product card** — not on a
separate blog page nobody reaches. Three lines, an analogy anchored to something Bengaluru already knows
("softer than a bun, squarer than a pav, made by a slower method called yudane"), plus one line on *how
to eat it* (thick-cut toast, 2cm, not sandwich-thin). The anchoring-to-familiar move is the specific
lever that converts high-neophobia buyers.

### 4.3 "Eggless" as a headline claim can cost you — reframe the benefit
**Finding.** Explicit abstention labels depress choice: dish selection fell from **17% to under 8%** when
described as "vegan," "vegetarian," "plant-based," or "meat-free," with no significant differences among
the four labels. Alternative framings — **"healthy," "sustainable," or taste/experience frames** — recover
or exceed baseline choice. Labelling a product for an attribute consumers didn't expect to be relevant
biases expected taste downward.
**Source.** Krpan & Houtsma (2020), *Appetite*; "Don't say 'vegan' or 'plant-based'…" (2023), *Journal of
Environmental Psychology* — https://www.sciencedirect.com/science/article/abs/pii/S0272494423002657;
"Vegan labeling for what is already vegan," *Food Quality and Preference* (2022) —
https://www.sciencedirect.com/science/article/abs/pii/S0195666322001398
**Confidence.** High for the abstention-label penalty; Medium for direct transfer to *eggless* in an
Indian market — India is the key boundary condition here, since a large share of the audience is
actively *seeking* eggless and the label is a positive search term, not an abstention. **Test, don't
assume.**
**Fillo application.** Lead with the **sensory** claim and let eggless be the *reason*, not the headline:
"**Cloud-soft milk loaf — soft because of a Japanese method, not because of egg.**" Keep a persistent,
unmissable **"100% eggless — always, every SKU"** badge in the header/footer for the buyers who are
searching for exactly that, so the seekers still find it instantly. Headline = taste; badge = claim.
A/B this one; it is the highest-uncertainty recommendation in this document.

### 4.4 Allergen claims: clarity, not volume, is the trust variable
**Finding.** Roughly two-thirds of allergy-affected shoppers who use allergen information say they trust
it, but **"unclear labeling information" is the single highest-ranked concern (42%)**. Food-allergy
shoppers spend 3–5 minutes reading the label of every product they buy. FDA now holds that a voluntary
"free-from [allergen]" claim cannot coexist with a "may contain" precautionary statement on the same
package — mixing the two is what destroys credibility.
**Source.** IFIC (2025) consumer study on food allergies and labeling —
https://ific.org/media/new-ific-study-reveals-over-half-of-americans-are-impacted-by-food-allergies-intolerances-and-sensitivities-trust-and-clarity-in-labeling-remain-key-challenges/;
FDA guidance summary — https://menutrinfo.com/blog/fda-draws-the-line-on-free-from-claims-what-this-means/
**Confidence.** Medium (US survey data, applied by analogy to India; direction is safe, numbers are not).
**Fillo application.** One **fixed-position allergen block on every product page**, always in the same
place, with three explicit states: *Contains · Does not contain · Made in a kitchen that also handles*.
Never write "may contain" next to a "free-from" claim. Since the buyer will spend minutes on this, make
it scannable rather than legal-dense — and say the shared-kitchen truth plainly; the honesty is the asset.

### 4.5 Founder stories raise brand authenticity through narrative transportation
**Finding.** Founder stories that foreground **values and motives** increase perceived brand authenticity;
the narrative *format* (as opposed to a factual list) drives **transportation**, which mediates the
authenticity gain. Authenticity in turn supports credibility, trust, and willingness to pay. Firm-originated
stories improve consumer brand experience and willingness to pay; a story exposure widened consumers'
acceptable price range.
**Source.** Hamby & Brinberg (2019), "It's about our values: How founder's stories influence brand
authenticity," *Psychology & Marketing* 36(11) — https://onlinelibrary.wiley.com/doi/abs/10.1002/mar.21252
(open copy: https://scholarworks.boisestate.edu/cgi/viewcontent.cgi?article=1057&context=marketing_facpubs)
**Confidence.** Medium-High.
**Fillo application.** Put a **~150-word founder note in first person, with a face, on the checkout
page** — not only on an About page. It must be a *narrative with a motive* ("I couldn't find a loaf my
egg-allergic kid could eat, so I learned yudane"), not a credentials list. Transportation is the mediator,
so it needs a beginning-middle-end in three sentences, and it needs to sit where the price hesitation
actually happens.

---

## 5. Anticipation and Ritual

### 5.1 The labor illusion — showing the work increases perceived value, even when it adds wait
**Finding.** Across five experiments in travel search and online dating, websites that made their effort
**visible** were valued more highly — participants sometimes **preferred longer waits with visible work
to instant identical results**. Perceived provider effort induced feelings of reciprocity, which mediated
the link from transparency to higher valuation.
**Source.** Buell & Norton (2011), "The Labor Illusion: How Operational Transparency Increases Perceived
Value," *Management Science* 57(9), 1564–1579 — https://www.hbs.edu/ris/Publication%20Files/Norton_Michael_The%20labor%20illusion%20How%20operational_f4269b70-3732-4fc4-8113-72d0c47533e0.pdf
**Confidence.** High. **This is the single highest-leverage principle in this document for Fillo.**
**Fillo application.** The tracker must not be a progress bar — it must be a **narrated bake**, with
named, real, timestamped stages: `Yudane resting (4h)` → `First proof` → `Shaped — 40 loaves` → `In the
oven, 210°C` → `Cooling — we don't slice hot bread` → `Loaded on the van` → `Van is on Route Indiranagar`.
Each stage carries a one-line explanation of *why it takes that long*. The wait from Thursday's order to
Saturday's handover is not a cost to be minimised — it is the brand's most valuable owned surface, and
labour-illusion research says filling it with visible effort raises what the loaf is worth.

### 5.2 Two-way operational transparency raises both satisfaction and actual service quality
**Finding.** Field and lab experiments in **food service**: making the cooking process visible to
customers (process transparency) and customers visible to cooks (customer transparency) produced a
**22.2% increase in customer-reported quality** and **19.2% reduction in throughput time**. Customers who
observed the process perceived greater employee effort and were more appreciative; the effect runs both
ways, with employees working better when seen.
**Source.** Buell, Kim & Tsay (2017), "Creating Reciprocal Value Through Operational Transparency,"
*Management Science* 63(6), 1673–1695 — https://www.hbs.edu/ris/Publication%20Files/14-115_aee7737a-a405-46f1-85e9-67882dd95435.pdf
**Confidence.** High (field experiments, behavioural outcomes).
**Fillo application.** Make it **reciprocal, not one-way**: the tracker shows the baker; the *baker's
view* shows the buyer. Add a "**Baking for**" line on the drop page — "Today's 40 loaves are going to 31
neighbours: Anjali, Rehan, the Prakash family…" (first names only, opt-in). And a 20-second unedited
"today's bake" clip from the van each drop morning. Note the finding's specific origin in a **cafeteria** —
this is the closest-fit experiment in the literature to what Fillo actually does.

### 5.3 Uncertain and unexplained waits feel longer; last place makes people abandon
**Finding.** Maister's principles of waiting: occupied time feels shorter than unoccupied; **uncertain
waits feel longer than known, finite waits**; **unexplained waits feel longer than explained waits**.
Buell's queue work adds a behavioural edge: people in **last place are roughly twice as likely to switch
or abandon** a queue, because with nobody behind them they lose the downward social comparison that
confirms the wait is worthwhile — and **queue transparency neutralises the effect**.
**Source.** Maister, D. (1985), "The Psychology of Waiting Lines" — https://davidmaister.com/articles/1/52/;
Buell, R. (2021), "Last-Place Aversion in Queues," *Management Science* —
https://www.hbs.edu/ris/Publication%20Files/18-053_84131e4f-b25f-48a9-9a81-63b3fd1c815e.pdf
**Confidence.** High.
**Fillo application.** Every waiting screen states a **specific time and a reason**: not "arriving soon"
but "**Van reaches your gate ~5:40pm — it's doing HSR first because that stop is bigger.**" And on the
waitlist, **never show a customer they are last**: show "#7 of 14 waiting" when there are people behind
them, and when they *are* last, show absolute progress instead ("4 spots have freed up since you joined")
rather than the position. Same data, different framing, materially different abandonment.

### 5.4 Anticipation is itself consumed — and a wait can raise the final evaluation
**Finding.** Loewenstein's classic result: people paid **more** to receive a desired experience (a kiss
from a favourite celebrity) in three days than immediately — anticipation carries positive utility, so
delay adds value for savoured experiences. Consistent with this, four experiments found a **required wait
can signal quality and raise both purchase intention and experienced satisfaction**, moderated by prior
knowledge, consumption motivation, and how hard quality is to judge objectively. Recent work tracking
attitudes across pre-anticipation, post-anticipation and post-consumption finds **anticipation intensity
positively predicts the attitude gain**.
**Source.** Loewenstein, G. (1987), "Anticipation and the valuation of delayed consumption," *Economic
Journal* 97; Giebelhausen, Robinson & Cronin (2011), "Worth waiting for: increasing satisfaction by
making consumers wait," *Journal of the Academy of Marketing Science* 39(6), 889–905 —
https://link.springer.com/article/10.1007/s11747-010-0222-5; Vichiengior, Ackermann & Palmer (2025),
"When waiting makes sense," *International Journal of Research in Marketing* 42(1), 74–94 —
https://centaur.reading.ac.uk/116763/
**Confidence.** High for anticipatory utility; Medium-High for the wait→satisfaction transfer (moderated).
**Fillo application.** **Do not apologise for the wait — sell it.** Order confirmation copy should read
"**Your loaf gets made on Saturday morning. Here's what happens between now and then**" with the yudane
timeline, rather than "Sorry, delivery takes 2 days." Note the moderator: the effect is strongest when
quality is *hard to judge in advance* — which is exactly the state a first-time shokupan buyer is in. Send
exactly two anticipation touches (Thursday cutoff, Saturday 6am "dough's in"); more than that and
anticipation flips to impatience (Hardisty & Weber's savouring/impatience asymmetry).

### 5.5 Habits form through repetition in a *consistent context* — and drops are a perfect cue
**Finding.** 96 participants performing a chosen behaviour daily in the same context: automaticity rose
along an asymptotic curve, **median 66 days** to plateau (range 18–254). Behaviours with **strong
contextual cues and immediate rewards** reached automaticity fastest; **missing a single occasion did
not materially damage** habit formation.
**Source.** Lally, van Jaarsveld, Potts & Wardle (2010), "How are habits formed: Modelling habit formation
in the real world," *European Journal of Social Psychology* 40(6), 998–1009 —
https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674
**Confidence.** High.
**Fillo application.** Never move the drop. **Same weekday, same hour, forever** — the fixed slot *is* the
contextual cue, and it is worth more than the incremental revenue from an opportunistic mid-week drop.
Then engineer the two accelerators: an **immediate reward** at the cue moment (the drop email opens with
this week's cross-section photo, not with a CTA) and, per Lally's forgiveness finding, a **"skipped a week?
no problem"** message on return rather than a win-back discount — you want the habit intact, not a
discount reflex. Budget ~9–10 weeks (≈66 days) of consecutive drops before judging whether the ritual has
taken.

---

## 6. Local and Community

### 6.1 Trust in the producer — not price or convenience — is the local-food purchase driver
**Finding.** Three factors drive intention to buy local food: availability, health, and **trust in local
producers**. Trust in producers is antecedent to perceiving local food as authentic, tasty, healthy and
socially sustainable. **Social embeddedness** (interaction with, and knowledge of, the seller) and
**spatial embeddedness** (supporting local producers and community) are core motivating forces. Direct
producer-consumer sales channels create the interaction that generates this trust; buyers choosing direct
venues cite *their local community* as the primary concern.
**Source.** Frontiers in Nutrition (2023), "Psychosocial drivers influencing local food purchasing: beyond
availability, the importance of trust in farmers" — https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2023.1204732/full;
Choices Magazine (2010), "Local Food Consumers: How Motivations and Perceptions Translate to Buying
Behavior" — https://www.choicesmagazine.org/UserFiles/file/article_109.pdf
**Confidence.** Medium-High (survey/observational, largely Western samples).
**Fillo application.** Put the **baker, by name and face, on the drop page every week** — "This week's
40 loaves: baked by Priya, 4am–9am Saturday." A van is *structurally* a direct channel; the site should
stop presenting it as a logistics detail and start presenting it as the trust mechanism. Rotate a one-line
first-person note from the baker each drop.

### 6.2 Local-global identity moderates who responds to "local" copy
**Finding.** Consumers' **local vs. global identity** significantly shapes attitude toward and intention
to buy local foods — the same "local" appeal that lands with locally-identified consumers can fall flat
or read as parochial with globally-identified ones.
**Source.** "Impact of consumer global–local identity on attitude towards and intention to buy local
foods" — https://pmc.ncbi.nlm.nih.gov/articles/PMC8519665/
**Confidence.** Medium.
**Fillo application.** Fillo's audience is largely globally-identified urban Bengaluru — so **anchor
"local" to the neighbourhood, not to the nation**. Write route copy as *place* ("Baked in Bengaluru,
parked at your gate in Indiranagar") rather than as *provenance patriotism*. The Japanese-method framing
and the neighbourhood framing are complements here, not a contradiction: global craft, local street.

### 6.3 Society-gate group buying runs on interpersonal trust and a fixed leader
**Finding.** In community group-buying, a **fixed local leader** organises neighbours; consumers'
**lock-in purchase intention** from that leader is driven by two interaction types — *merchant-role*
interaction (information, ability, efficiency) and *friend-role* interaction (friendship, mutual
assistance, warmth) — via **trust transfer**. In offline community retail, **interpersonal trust between
neighbours** matters more than platform trust; rich media (photos, videos) shared in the group raises
trust in the group-buy.
**Source.** Frontiers in Psychology (2022), "Influence of Multi-Role Interactions in Community Group-Buying
on Consumers' Lock-In Purchasing Intention From a Fixed Leader" —
https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.903221/full
**Confidence.** Medium (Chinese CGB context, survey-based; the structural analogy to Bengaluru apartment
societies is strong but untested).
**Fillo application.** Ship a **"Bring the van to your gate" module**: one resident becomes the named
**Gate Captain** for their society, gets a shareable link and a WhatsApp-ready card with this week's
cross-section photo, and the van commits to the stop once N pre-orders are in. Give the captain both roles
the research names — merchant (a small dashboard: "9 of 15 neighbours in") and friend (a free loaf,
their name on the route page). The unlock threshold doubles as honest supply-based scarcity per §2.1.

### 6.4 Naming a thing creates psychological ownership of it
**Finding.** Naming a product **increases psychological ownership** and, through it, improves consumer
evaluations relative to an identical unnamed product. Psychological ownership drives attachment,
valuation, and **stewardship** — people take care of what they feel they own. Where physical touch is
unavailable (i.e. online), **ownership imagery** ("imagine taking this home") substitutes for touch in
raising perceived ownership and valuation.
**Source.** Stoner, Loken & Blank (2018), "The Name Game: How Naming Products Increases Psychological
Ownership and Subsequent Consumer Evaluations," *Journal of Consumer Psychology* —
https://carlsonschool.umn.edu/sites/carlsonschool.umn.edu/files/2020-03/Stoner_et_al-2018-Journal_of_Consumer_Psychology.pdf;
Peck & Shu (2009), "The Effect of Mere Touch on Perceived Ownership," *JCR*; Peck & Shu (2023) review,
*Consumer Psychology Review* — https://myscp.onlinelibrary.wiley.com/doi/10.1002/arcp.1084
**Confidence.** Medium-High.
**Fillo application.** **Name the van and name each route**, and let the neighbourhood own the name:
the van has a name on the tracker ("Momo is 4 stops away"), and routes are named after their streets, not
numbered ("The 12th Main Run"). Then push it one step further per the stewardship finding — let a society
**name its own stop** when it crosses the Gate Captain threshold. A stop that a neighbourhood named is a
stop that neighbourhood defends.

---

## Sources

**Appetite on screen**
- Schüssler et al. (2020), *PLOS ONE* — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0232099
- Blechert et al. (2014), Food-pics database, *Frontiers in Psychology* — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4067906/
- Liu (2026), "Seeing is wanting," *Marketing Letters* — https://link.springer.com/article/10.1007/s11002-026-09816-7
- Zhang, Desebrock, Okajima & Spence (2024), "'Hot stuff'," *Food Quality and Preference* — https://www.psy.ox.ac.uk/publication/1998717
- Du & Wang (2024), "Dynamic or static?", *JRCS* — https://ideas.repec.org/a/eee/joreco/v81y2024ics0969698924003382.html
- Spence (2015), "On the psychological impact of food colour," *Flavour* — https://flavourjournal.biomedcentral.com/articles/10.1186/s13411-015-0031-3
- "Aesthetic plating: a preference for oblique lines ascending to the right," *Flavour* — https://link.springer.com/article/10.1186/s13411-015-0037-x
- *Food Perception and Aesthetics* review — https://www.tandfonline.com/doi/full/10.1080/15428052.2020.1824833

**Scarcity**
- Barton, Zlatevska & Oppewal (2022), *Journal of Retailing* 98(4) — https://www.sciencedirect.com/science/article/pii/S0022435922000434 · PDF: https://pure.bond.edu.au/ws/files/182976505/Scarcity_tactics_in_marketing.pdf
- Aggarwal, Jun & Huh (2011), *Journal of Advertising* 40(3) — https://www.tandfonline.com/doi/abs/10.2753/JOA0091-3367400302
- Verhallen & Robben, "Scarcity and preference" — https://www.researchgate.net/publication/222478926_Scarcity_and_Preference_An_Experiment_on_Unavailability_and_Product_Evaluation
- Rosenberg & Siegel (2018), 50-year review of reactance theory — https://scholar.dominican.edu/cgi/viewcontent.cgi?article=1002&context=psychology-faculty-scholarship
- Stevens et al. (2026), "Beyond the Shelf," *Psychology & Marketing* — https://onlinelibrary.wiley.com/doi/10.1002/mar.70232
- Kivetz, Urminsky & Zheng (2006), *JMR* 43(1) — https://journals.sagepub.com/doi/abs/10.1509/jmkr.43.1.39
- Countdown-timer practitioner data — https://cleancommit.io/blog/do-countdown-timers-work/ · https://www.imrg.org/blog/countdown-clocks-on-websites-good-or-bad-retail-practice/

**Choice architecture**
- Chernev, Böckenholt & Goodman (2015), *JCP* 25(2) — https://chernev.com/wp-content/uploads/2017/02/ChoiceOverload_JCP_2015.pdf
- Scheibehenne, Greifeneder & Todd (2010), *JCR* — summary: https://www.jasoncollins.blog/posts/not-the-jam-study-again
- Mogilner, Rudnick & Iyengar (2008), *JCR* 35(2) — https://academic.oup.com/jcr/article-abstract/35/2/202/1806103
- Wansink, Painter & van Ittersum (2001), *CHRAQ* 42(6) — https://journals.sagepub.com/doi/10.1177/0010880401426008 *(integrity caveat, see §3.3)*
- "The impacts of descriptive food names on consumer impressions" (2020) — https://www.sciencedirect.com/science/article/abs/pii/S0278431920300852
- Johnson & Goldstein (2003), *Science*; defaults meta-analysis — https://www.cambridge.org/core/journals/behavioural-public-policy/article/when-and-why-defaults-influence-decisions-a-metaanalysis-of-default-effects/67AF6972CFB52698A60B6BD94B70C2C0
- Yang, Kimes & Sessarego (2009), Cornell — https://ecommons.cornell.edu/entities/publication/1ca7d603-ee0c-4721-9003-91ca4f87cfa2
- "Framing the Unlikely Pair: 'Free Gifts' Heuristic" — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12466855/
- Li et al. (2022), *IJCS* — https://onlinelibrary.wiley.com/doi/abs/10.1111/ijcs.12776

**Trust**
- Medill Spiegel Research Center (2017) — https://spiegel.medill.northwestern.edu/how-online-reviews-influence-sales/
- Kim et al., food neophobia & nutrition information — https://www.researchgate.net/publication/240242160
- Lee et al. (2025), *Journal of Sensory Studies* — https://onlinelibrary.wiley.com/doi/10.1111/joss.70031
- Information provision & novel foods (2026), *npj Science of Food* — https://www.nature.com/articles/s41538-026-00826-3
- "Don't say 'vegan' or 'plant-based'" (2023), *JEP* — https://www.sciencedirect.com/science/article/abs/pii/S0272494423002657
- "Vegan labeling for what is already vegan" (2022), *FQAP* — https://www.sciencedirect.com/science/article/abs/pii/S0195666322001398
- IFIC (2025) allergen labeling study — https://ific.org/media/new-ific-study-reveals-over-half-of-americans-are-impacted-by-food-allergies-intolerances-and-sensitivities-trust-and-clarity-in-labeling-remain-key-challenges/
- FDA "free-from" guidance summary — https://menutrinfo.com/blog/fda-draws-the-line-on-free-from-claims-what-this-means/
- Hamby & Brinberg (2019), *Psychology & Marketing* — https://scholarworks.boisestate.edu/cgi/viewcontent.cgi?article=1057&context=marketing_facpubs

**Anticipation and ritual**
- Buell & Norton (2011), *Management Science* 57(9) — https://www.hbs.edu/ris/Publication%20Files/Norton_Michael_The%20labor%20illusion%20How%20operational_f4269b70-3732-4fc4-8113-72d0c47533e0.pdf
- Buell, Kim & Tsay (2017), *Management Science* 63(6) — https://www.hbs.edu/ris/Publication%20Files/14-115_aee7737a-a405-46f1-85e9-67882dd95435.pdf
- Buell (2021), "Last-Place Aversion in Queues," *Management Science* — https://www.hbs.edu/ris/Publication%20Files/18-053_84131e4f-b25f-48a9-9a81-63b3fd1c815e.pdf
- Maister (1985), "The Psychology of Waiting Lines" — https://davidmaister.com/articles/1/52/
- Giebelhausen, Robinson & Cronin (2011), *JAMS* 39(6) — https://link.springer.com/article/10.1007/s11747-010-0222-5
- Vichiengior, Ackermann & Palmer (2025), *IJRM* 42(1) — https://centaur.reading.ac.uk/116763/
- Hardisty & Weber (2020), savouring vs. dread, *JCP* — https://myscp.onlinelibrary.wiley.com/doi/abs/10.1002/jcpy.1169
- Lally et al. (2010), *EJSP* 40(6) — https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674

**Local and community**
- Frontiers in Nutrition (2023), trust in local producers — https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2023.1204732/full
- Choices Magazine (2010), local food consumers — https://www.choicesmagazine.org/UserFiles/file/article_109.pdf
- Global–local identity and local foods — https://pmc.ncbi.nlm.nih.gov/articles/PMC8519665/
- Frontiers in Psychology (2022), community group-buying — https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.903221/full
- Stoner, Loken & Blank (2018), "The Name Game," *JCP* — https://carlsonschool.umn.edu/sites/carlsonschool.umn.edu/files/2020-03/Stoner_et_al-2018-Journal_of_Consumer_Psychology.pdf
- Peck & Shu (2023) review, *Consumer Psychology Review* — https://myscp.onlinelibrary.wiley.com/doi/10.1002/arcp.1084

---

## Open questions for Phase 4/5

1. **Eggless framing (§4.3)** — the abstention-label literature is Western and about *meat/dairy*
   avoidance. In India, eggless is a sought positive attribute. This is the one recommendation that needs
   a live A/B before it ships.
2. **Cap credibility (§2.4)** — worth measuring whether publishing not-sold-out weeks measurably raises
   conversion on subsequent sold-out weeks. No literature found on this specific move; it is a reasoned
   application of reactance theory, not a documented result.
3. **Gate Captain (§6.3)** — the community group-buying evidence is Chinese and survey-based. Pilot with
   two societies before building the module.
