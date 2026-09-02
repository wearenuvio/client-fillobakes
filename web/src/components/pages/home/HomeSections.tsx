import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  EggOff,
  Leaf,
  MapPin,
  Sparkles,
  Sunrise,
  Wheat,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { getCategories, getProductBySlug } from "@/lib/catalog";

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
        <h2 className="mt-3 max-w-[18ch] text-h2 text-ink">{heading}</h2>
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

const CATEGORY_FACE: Record<string, string> = {
  breads: "milk-shokupan",
  anpan: "custard-an-pan",
  karepan: "seoul-spice",
  "pies-strudels": "bangalore-bloom",
  "fruit-sandos": "fruit-sando",
};

export function CategoryTiles() {
  const tiles = getCategories().filter(
    (c) => c.count > 0 && CATEGORY_FACE[c.slug],
  );

  return (
    <section data-reveal className="bg-paper py-[var(--section-y)]">
      <div className="container-content">
        <SectionHead eyebrow="Shop by kind" heading="Five ways in." />

        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {tiles.map((category) => {
            const face = getProductBySlug(CATEGORY_FACE[category.slug]);
            return (
              <li key={category.slug}>
                <Link
                  href={`/shop/${category.slug}`}
                  className="group block rounded-lg transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)] hover:-translate-y-0.5"
                >
                  <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-lg bg-well">
                    {face?.image ? (
                      <Image
                        src={face.image.src}
                        alt=""
                        width={400}
                        height={400}
                        sizes="(min-width: 1024px) 220px, 40vw"
                        className={cn(
                          "transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                          "group-hover:scale-105 motion-reduce:transform-none",
                          face.image.kind === "cutout"
                            ? "w-[74%] object-contain cutout-sm"
                            : "size-full object-cover",
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

export function StorySplit() {
  return (
    <section data-reveal className="bg-peach py-[var(--section-y)]">
      <div className="container-content">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Two photos: one tall, one small and offset. */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-[82%] overflow-hidden rounded-xl">
              <Image
                src="/images/stock/lifestyle/hands-holding-loaf-linen-table.jpg"
                alt="Hands lifting a loaf off a linen-covered table"
                fill
                sizes="(min-width: 1024px) 40vw, 82vw"
                className="object-cover object-[50%_45%]"
              />
            </div>
            <div className="absolute right-0 bottom-[-28px] aspect-square w-[44%] overflow-hidden rounded-xl border-[6px] border-peach">
              <Image
                src="/images/stock/hero/milk-bread-loaves-cooling-rack.jpg"
                alt="Milk bread loaves cooling on a rack"
                fill
                sizes="(min-width: 1024px) 22vw, 44vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
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
              icon={<ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />}
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
    icon: Sparkles,
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
    <section data-reveal className="bg-paper py-[var(--section-y)]">
      <div className="container-content">
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

export function ComeBack() {
  return (
    <section data-reveal className="border-y border-line bg-paper-2 py-[var(--section-y)]">
      <div className="container-content">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <ComeBackCard
            eyebrow="The Standing Order"
            heading="Your bread, every week."
            body="A loaf and whatever else you like, on your route's run day. Skip any week, pause any time."
            href="/standing-order"
            cta="How it works"
          />
          <ComeBackCard
            eyebrow="Fillo+"
            heading="Join free, earn on every order."
            body="Two coins for every ₹100. Twenty-five coins is ₹25 off, and they never expire."
            href="/fillo-plus"
            cta="Join free"
          />
        </div>
      </div>
    </section>
  );
}

function ComeBackCard({
  eyebrow,
  heading,
  body,
  href,
  cta,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col rounded-xl bg-peach p-8 lg:p-10">
      <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
        {eyebrow}
      </p>
      <h3 className="mt-3 max-w-[14ch] font-display text-[clamp(28px,3vw,36px)] leading-[1.05] text-ink">
        {heading}
      </h3>
      <p className="mt-4 max-w-[42ch] text-body text-ink-2">{body}</p>
      <ButtonLink href={href} variant="secondary" size="md" className="mt-8 self-start">
        {cta}
      </ButtonLink>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 9 — Reviews (the eight real ones from the live site; three shown)          */
/* -------------------------------------------------------------------------- */

const REVIEWS = [
  {
    quote:
      "Beautiful flavours, not overly greasy, and very filling. Will definitely order again.",
    name: "Aman K.",
    meta: "Bengaluru",
  },
  {
    quote:
      "The shokupan was fabulous, just melt in the mouth delicious. With bread like that, who needs cake.",
    name: "Riya S.",
    meta: "Bengaluru",
  },
  {
    quote:
      "Every item feels crafted, not mass-produced. You can taste the care.",
    name: "Rahul D.",
    meta: "Bengaluru",
  },
] as const;

export function Reviews() {
  return (
    <section className="bg-paper py-[var(--section-y)]">
      <div className="container-content">
        <div className="grid items-start gap-10 md:grid-cols-3 md:gap-8">
          {REVIEWS.map((review, i) => (
            <figure
              key={review.name}
              className={cn(
                "text-center md:text-left",
                i === 1 && "md:text-center",
              )}
            >
              <Stars className={cn("justify-center md:justify-start", i === 1 && "md:justify-center")} />
              <blockquote
                className={cn(
                  "mt-5 font-display text-ink italic",
                  i === 1
                    ? "text-[clamp(24px,2.6vw,32px)] leading-[1.2]"
                    : "text-[20px] leading-[1.3]",
                )}
              >
                {review.quote}
              </blockquote>
              <figcaption className="mt-5 text-body-sm text-muted">
                {review.name} · {review.meta}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("flex gap-1", className)} aria-label="Five out of five">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="var(--color-gold)"
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9z" />
        </svg>
      ))}
    </span>
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
    <section data-reveal className="bg-paper pb-[var(--section-y)]">
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
              <div className="relative aspect-[16/10] overflow-hidden">
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
            <form className="mt-6" action="/journal" aria-label="The Sunday email">
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
