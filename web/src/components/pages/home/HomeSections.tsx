import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Cloud,
  EggOff,
  Leaf,
  MapPin,
  Sunrise,
  Wheat,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { InkArt, type InkArtName } from "@/components/ui/InkArt";
import { ReviewsCarousel } from "@/components/pages/home/ReviewsCarousel";
import { getCategories } from "@/lib/catalog";

/**
 * The quiet sections of the home page — DESIGN-v2 §3.2, .4, .5, .6, .8, .9, .10.
 *
 * Everything here is a server component: nothing on this half of the page has
 * state. One eyebrow, one heading, one right-hand link per band; no boxes
 * around facts, no counters, no logistics.
 */

/* -------------------------------------------------------------------------- */
/* Shared heading                                                             */
/* -------------------------------------------------------------------------- */

export function SectionHead({
  eyebrow,
  heading,
  link,
  className,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  link?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
          {eyebrow}
        </p>
        {/* Two lines on a phone, one line from lg: the heading is the only
            thing in its flex item, so lifting the measure lets "The four
            things they say back to us." set on a single line beside the
            link rather than breaking after "say". */}
        <h2 className="mt-3 max-w-[20ch] text-h2 text-ink lg:max-w-none">
          {heading}
        </h2>
      </div>
      {link ? (
        <Link
          href={link.href}
          className="link-underline inline-flex shrink-0 items-center gap-2 text-body-sm font-semibold text-accent"
        >
          {link.label}
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2 — Trust strip                                                            */
/* -------------------------------------------------------------------------- */

const TRUST = [
  { icon: EggOff, label: "100% eggless" },
  { icon: Sunrise, label: "Baked every morning" },
  { icon: Leaf, label: "No preservatives" },
  { icon: MapPin, label: "Delivered across Bengaluru" },
] as const;

export function TrustStripV2() {
  return (
    <section className="border-y border-line bg-paper-2">
      <div className="container-content">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 py-8 lg:grid-cols-4 lg:py-9">
          {TRUST.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <Icon
                size={22}
                strokeWidth={1.5}
                aria-hidden="true"
                className="shrink-0 text-accent"
              />
              <span className="text-body-sm text-ink-2">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4 — Categories                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The tiles are drawings, not photographs.
 *
 * A cutout tile competes with the eight cutouts in the Bestsellers grid
 * directly above it, and the two bands end up reading as one long product
 * list. Drawn at full strength on the well ground, the row becomes a change
 * of voice — a hand-lettered menu board between two photographic grids — and
 * the categories stop pretending to be products.
 */
const CATEGORY_MARK: Record<string, InkArtName> = {
  breads: "shokupan-loaf",
  anpan: "anpan-bun",
  karepan: "karepan",
  "pies-strudels": "croissant",
  "fruit-sandos": "fruit-sando",
};

export function CategoryTiles() {
  const tiles = getCategories().filter(
    (c) => c.count > 0 && CATEGORY_MARK[c.slug],
  );

  return (
    <section data-reveal className="bg-paper py-[var(--section-y)]">
      <div className="container-content">
        <SectionHead eyebrow="Shop by kind" heading="Five ways in." />

        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {tiles.map((category) => {
            const mark = CATEGORY_MARK[category.slug];
            return (
              <li key={category.slug}>
                <Link
                  href={`/shop/${category.slug}`}
                  className="group block rounded-lg"
                >
                  <div
                    className={cn(
                      "relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg",
                      // Accent hairline at rest; on hover the tile floods
                      // accent and the drawing goes cream (filter below).
                      "border border-accent bg-well",
                      "transition-colors duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                      "group-hover:bg-accent",
                    )}
                  >
                    {mark ? (
                      <InkArt
                        name={mark}
                        width={220}
                        fit="contain"
                        opacity={1}
                        hideOnPhone={false}
                        parallax={false}
                        sizes="(min-width: 1024px) 220px, 40vw"
                        className={cn(
                          "inset-[14%]",
                          "transition-[transform,filter] duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                          // Chocolate ink → cream: black it out, then invert.
                          "group-hover:-translate-y-0.5 group-hover:[filter:brightness(0)_invert(1)_opacity(0.95)] motion-reduce:transform-none",
                        )}
                      />
                    ) : (
                      <Wheat
                        size={44}
                        strokeWidth={1.25}
                        aria-hidden="true"
                        className="text-muted"
                      />
                    )}
                  </div>
                  <p className="mt-3 font-display text-[20px] leading-tight text-ink">
                    {category.label}
                  </p>
                  <p className="text-body-sm text-muted tabular">
                    {category.count} bakes
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5 — Story split                                                            */
/* -------------------------------------------------------------------------- */

/** Around the story drawing: bread words in kana, each at its own depth. */
const STORY_KANA = [
  // Top band
  { text: "パン", x: "4%", y: "-6%", size: 22, opacity: 0.5, depth: 14, rotate: -8 },
  { text: "食パン", x: "40%", y: "-9%", size: 15, opacity: 0.45, depth: 10, rotate: 4 },
  { text: "カレーパン", x: "70%", y: "-5%", size: 13, opacity: 0.4, depth: 16, rotate: 6 },
  // Left band
  { text: "ふわふわ", x: "-12%", y: "18%", size: 18, opacity: 0.55, depth: 18, rotate: -10 },
  { text: "卵なし", x: "-14%", y: "48%", size: 14, opacity: 0.45, depth: 6, rotate: -4 },
  { text: "小麦", x: "-8%", y: "76%", size: 16, opacity: 0.4, depth: 12, rotate: 8 },
  // Right band
  { text: "焼きたて", x: "96%", y: "14%", size: 15, opacity: 0.5, depth: 12, rotate: 10 },
  { text: "あんパン", x: "98%", y: "44%", size: 14, opacity: 0.45, depth: 8, rotate: -6 },
  { text: "牛乳", x: "100%", y: "72%", size: 16, opacity: 0.4, depth: 15, rotate: 5 },
  // Bottom band
  { text: "毎朝", x: "8%", y: "102%", size: 15, opacity: 0.45, depth: 9, rotate: -5 },
  { text: "サンド", x: "44%", y: "105%", size: 14, opacity: 0.4, depth: 13, rotate: 3 },
  { text: "手作り", x: "76%", y: "101%", size: 15, opacity: 0.5, depth: 11, rotate: -9 },
] as const;

export function StorySplit() {
  return (
    <section data-reveal className="bg-peach py-[var(--section-y)]">
      <div className="container-content">
        <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          {/* One drawing instead of two stock photographs (client, Sep 2026).
              The photographs were bought crops of somebody else's kitchen and
              read as stock the moment you looked twice; the mb7 cue — rolling
              pin and flour bag — is the bakery's own hand, and at full ink it
              is illustration rather than atmosphere. Boxed at the file's own
              1200:958 ratio so `contain` never crops it, centred against the
              paragraph on desktop and sitting above it on a phone. */}
          <div className="relative mx-auto aspect-[1200/958] w-[220px] lg:mx-0 lg:w-full lg:max-w-[340px]">
            {/* Japanese words for what we bake, scattered around the drawing.
                Each rides the shared pointer vars at its own depth, so the
                cloud shifts as one and the nearer words move more. */}
            {STORY_KANA.map((k) => (
              <span
                key={k.text}
                aria-hidden="true"
                className="kana pointer-events-none absolute select-none whitespace-nowrap text-accent motion-reduce:transform-none"
                style={{
                  left: k.x,
                  top: k.y,
                  fontSize: k.size,
                  opacity: k.opacity,
                  transform: `translate(calc(var(--ink-px, 0) * ${k.depth}px), calc(var(--ink-py, 0) * ${k.depth}px)) rotate(${k.rotate}deg)`,
                  transition: "transform 120ms linear",
                }}
              >
                {k.text}
              </span>
            ))}
            <InkArt
              name="rolling-pin-and-flour-bag"
              width={300}
              fit="contain"
              opacity={0.9}
              hideOnPhone={false}
              sizes="(min-width: 1024px) 300px, 200px"
              className="inset-[6%]"
            />
          </div>

          <div>
            <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              Our story
            </p>
            <h2 className="mt-3 max-w-[16ch] font-display text-display-2 text-ink italic">
              Baked the Japanese way, without a single egg.
            </h2>
            <p className="mt-6 max-w-[54ch] text-body-lg text-ink-2">
              Neha and Nischal started Fillo in December 2025 with one loaf and
              a route. Most of us remember a neighbourhood that smelled of bread
              in the evening, and that routine disappeared into supermarket
              shelves. So the bakery moves instead: a fixed route, small
              batches, everything baked after the orders come in. More than 300
              first-time tasters worked through the menu before the van ran a
              single street, and they are the reason the shokupan is soft
              without an egg in it.
            </p>
            <ButtonLink
              href="/about"
              variant="ghost"
              size="md"
              className="mt-7"
              icon={
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
              }
            >
              Read our story
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6 — Why people return                                                      */
/* -------------------------------------------------------------------------- */

const REASONS = [
  {
    // A cloud, not a sparkle: the claim is about the crumb being soft, and a
    // sparkle is the generic "premium" glyph that says nothing about bread.
    icon: Cloud,
    title: "Pillowy, every time",
    body: "A fuwa fuwa crumb that pulls apart in soft sheets, from hydration and a long, cool ferment.",
  },
  {
    icon: EggOff,
    title: "Eggless, no compromise",
    body: "Egg is what usually makes a milk bread soft. Ours gets there on technique instead.",
  },
  {
    icon: Sunrise,
    title: "Fresh this morning",
    body: "Nothing is baked before your order exists, and nothing sits on a shelf overnight.",
  },
  {
    icon: CalendarCheck,
    title: "Small batches",
    body: "A short menu of 23 bakes, hand-rolled, so every tray gets the same attention.",
  },
] as const;

export function WhyReturn() {
  return (
    <section
      data-reveal
      className="relative overflow-hidden bg-paper py-[var(--section-y)]"
    >
      {/* Boxed rather than free-floating: the drawing is 1200x942, so the
          old 400px width was 314px tall, hung off the bottom padding line,
          and the four opaque cards ate everything but the chimney and the two
          jambs — a fragment, and one the scroll drift pushed through the top
          edge of a section that clips.

          Now it sits in the clear band beside the heading, pinned to the
          section's own top padding line and inset from the right, so the
          whole oven reads and only its feet tuck behind the top corner of the
          last card. Inside the section on every edge at any height, and never
          near a word: the heading ends well short of it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[var(--section-y)] right-4 hidden aspect-[1200/942] w-[200px] lg:block xl:w-[230px]"
      >
        <InkArt
          name="oven-with-loaves"
          width={230}
          fit="contain"
          opacity={0.12}
          sizes="230px"
          className="inset-0"
        />
      </div>
      <div className="relative container-content">
        <SectionHead
          eyebrow="Why people return"
          heading="The four things they say back to us."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {REASONS.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-lg border border-line bg-card p-6 lg:p-7"
            >
              <Icon
                size={36}
                strokeWidth={1.25}
                aria-hidden="true"
                className="text-accent"
              />
              <h3 className="mt-6 font-display text-[20px] leading-tight text-ink">
                {title}
              </h3>
              <p className="mt-2 text-body-sm text-ink-2">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8 — Come back                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The Standing Order — the one place on the home page that asks for a habit
 * rather than an order.
 *
 * A full-width peach band (§7), which is the one place on this page a second
 * ground is worth spending: the weekly loaf is a different kind of decision
 * from the bakes above it, and the colour is what says so.
 *
 * The notched ink cartouche — the only one in the system (§9) — wraps the
 * three drawn steps and nothing else. A frame around the whole band would
 * make a certificate of the section; around the steps alone it reads as what
 * it is, a printed card explaining a routine. So: script and title above the
 * card, the card, then the price line and the buttons under it, all centred
 * on one axis.
 *
 * The corner notch is a fixed pixel size, so the card is the same shape at
 * 375 as at 1440 rather than stretching, and the three steps stack inside the
 * same frame on a phone.
 */
const STANDING_STEPS = [
  { art: "shokupan-loaf", title: "Choose your bread" },
  { art: "bakery-van", title: "Choose your day and stop" },
  { art: "oven-with-loaves", title: "We bake it fresh and drive" },
] as const satisfies readonly { art: InkArtName; title: string }[];

export function StandingOrderBand() {
  return (
    <section data-reveal className="relative bg-peach py-[var(--section-y)]">
      {/* The wave tile across the whole band, under everything (§9). */}
      <span aria-hidden="true" className="seigaiha-wash" />

      <div className="relative container-content text-center">
        {/* Solid peach behind the words so the wave wash never runs under type. */}
        <div className="mx-auto w-fit bg-peach px-6 py-2 sm:px-10">
          <p className="script">Your bread, every week.</p>
          <h2 className="mt-3 font-display text-display-2 text-ink">
            The Standing Order
          </h2>
        </div>

        {/* The cartouche. The frame is drawn by the wrapper; the list inside
            carries the 32px padding that keeps every line clear of it. */}
        {/* The whole strip is one hanko: a cream stamp with the rough
            terracotta ink edge and carved inner border, the three steps
            inside it. Same device as the seal on the hero, at panel scale. */}
        <div className="relative mx-auto mt-10 max-w-[880px] -rotate-[0.4deg]">
          <svg
            viewBox="0 0 880 300"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <filter id="strip-ink" x="-3%" y="-6%" width="106%" height="112%">
                <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.7" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <g filter="url(#strip-ink)">
              {/* Same build as the small hanko: a solid terracotta block with
                  the rough edge, then the interior lifted out in cream so the
                  terracotta reads as a thick stamped band, then the carved
                  inner line. */}
              <rect x="1" y="1" width="878" height="298" rx="10" fill="var(--color-accent)" />
              <rect x="9" y="9" width="862" height="282" rx="6" fill="var(--color-card)" />
              <rect x="16" y="16" width="848" height="268" rx="4" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          <ol className="relative grid gap-8 px-8 py-9 sm:grid-cols-3 sm:gap-6 sm:px-10">
            {STANDING_STEPS.map(({ art, title }, i) => (
              <li key={title} className="flex flex-col items-center text-center">
                <span className="relative block h-[96px] w-[130px]">
                  <InkArt
                    name={art}
                    width={130}
                    fit="contain"
                    opacity={0.92}
                    hideOnPhone={false}
                    parallax={false}
                    sizes="130px"
                    className="inset-0"
                  />
                </span>
                <h3 className="mt-4 max-w-[16ch] font-display text-[17px] leading-[1.25] text-ink">
                  {title}
                </h3>
                <span className="micro mt-1.5 text-accent">{`Step ${i + 1}`}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mx-auto mt-10 w-fit max-w-[56ch] bg-peach px-6 py-2 text-body-lg text-ink-2 sm:px-8">
          From ₹180 a week. Skip any week, pause any time.
        </p>

        <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <ButtonLink href="/standing-order" size="lg">
            Start with The Loaf
          </ButtonLink>
          <ButtonLink
            href="/standing-order"
            variant="ghost"
            size="lg"
            icon={<ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />}
          >
            How it works
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** Fillo+ — one line, because joining is one tap and costs nothing. */
export function FilloPlusStrip() {
  return (
    <section className="border-y border-line bg-paper-2 py-6">
      <div className="container-content flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-body text-ink-2">
          <span className="font-semibold text-ink">Fillo+</span> — join free and
          earn two coins on every ₹100. Twenty-five coins is ₹25 off.
        </p>
        <ButtonLink
          href="/fillo-plus"
          variant="ghost"
          size="md"
          className="shrink-0"
          icon={<ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />}
        >
          Join free
        </ButtonLink>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 9 — Reviews (the eight real ones from the live site; three shown)          */
/* -------------------------------------------------------------------------- */

/**
 * The quotes are the approved live-site testimonials, unedited. Only the area
 * under each one changed: three lines reading "Bengaluru" said nothing the
 * hero and the trust strip had not already said twice, and a route the van
 * actually runs is both more specific and more useful.
 */
const REVIEWS = [
  {
    quote:
      "Beautiful flavours, not overly greasy, and very filling. Will definitely order again.",
    name: "Aman K.",
    meta: "Indiranagar",
  },
  {
    quote:
      "The shokupan was fabulous, just melt in the mouth delicious. With bread like that, who needs cake.",
    name: "Riya S.",
    meta: "Koramangala",
  },
  {
    quote:
      "Every item feels crafted, not mass-produced. You can taste the care.",
    name: "Rahul D.",
    meta: "HSR Layout",
  },
] as const;

export function Reviews() {
  return (
    // Bottom padding only: the section above it is also paper and already
    // ends on a full section of air, so a second one would put 192px between
    // the tiles and the quotes and break the rhythm the rest of the page keeps.
    <section className="bg-paper pb-[var(--section-y)]">
      <div className="container-content">
        <ReviewsCarousel reviews={REVIEWS} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 10 — Journal + newsletter                                                  */
/* -------------------------------------------------------------------------- */

const POSTS = [
  {
    href: "/guides/what-is-shokupan",
    eyebrow: "Guide",
    title: "What is shokupan",
    body: "Japan's everyday loaf: fine crumb, thin crust, and it pulls apart in soft sheets.",
    image: "/images/stock/hero/shokupan-loaf-sliced-warm-light.jpg",
    alt: "A sliced shokupan loaf in warm light",
  },
  {
    href: "/journal/why-eggless",
    eyebrow: "Journal",
    title: "Why eggless",
    body: "Eggless is easy to claim. Keeping the crumb soft without one is the hard part.",
    image: "/images/stock/ingredients/milk-pouring-into-glass.jpg",
    alt: "Milk pouring into a glass",
  },
] as const;

export function JournalRow() {
  return (
    <section data-reveal className="bg-paper py-[var(--section-y)]">
      <div className="container-content">
        <SectionHead
          eyebrow="From the journal"
          heading="What we are reading about bread."
          link={{ href: "/journal", label: "All posts" }}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr_0.85fr]">
          {POSTS.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="group flex flex-col overflow-hidden rounded-lg border border-line bg-card transition-[box-shadow,transform] duration-[var(--dur-base)] hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="photo-warm relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 1024px) 32vw, 90vw"
                  className="object-cover transition-transform duration-[var(--dur-base)] group-hover:scale-105 motion-reduce:transform-none"
                />
              </div>
              <div className="p-6">
                <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                  {post.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-[24px] leading-tight text-ink">
                  {post.title}
                </h3>
                <p className="mt-2 text-body-sm text-ink-2">{post.body}</p>
              </div>
            </Link>
          ))}

          <div className="flex flex-col justify-center rounded-lg bg-peach p-8">
            <h3 className="max-w-[16ch] font-display text-[26px] leading-tight text-ink">
              One email on Sunday.
            </h3>
            <p className="mt-3 text-body-sm text-ink-2">
              What we are baking, and where the van will be.
            </p>
            <form
              className="mt-6"
              action="/journal"
              aria-label="The Sunday email"
            >
              <label htmlFor="home-email" className="sr-only">
                Your email
              </label>
              <input
                id="home-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 w-full rounded-md border border-line bg-card px-3.5 text-body-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
              />
              <button
                type="submit"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-body-sm font-semibold text-on-accent transition-colors duration-[var(--dur-base)] hover:bg-accent-hover"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
