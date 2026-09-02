import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, EggOff, Leaf, Sunrise } from "lucide-react";
import { buildMetadata, getSeoRoute, JsonLd, productLd } from "@/lib/seo";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { Price } from "@/components/ui/Price";
import { ProductCard } from "@/components/blocks/ProductCard";
import {
  ProductAddBlock,
  ProductGalleryV2,
} from "@/components/pages/commerce/ProductStage";
import { galleryFor } from "@/components/pages/commerce/gallery";
import { stockFor } from "@/components/pages/commerce/run";
import { StickyCartBar } from "@/components/pages/commerce/StickyCartBar";
import {
  getProductBySlug,
  getProducts,
  getCategoryOf,
  getPairings,
} from "@/lib/catalog";
import { cutoutVariants, type ProductImage } from "@/lib/images";

type Params = { params: Promise<{ slug: string }> };

/** All 23 SKUs are prerendered. The catalogue is static; nothing is fetched. */
export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return buildMetadata(`/product/${slug}`);

  return buildMetadata(`/product/${slug}`, {
    title: getSeoRoute(`/product/${slug}`)
      ? undefined
      : `${product.name} — ${product.shortDescription.replace(/\.$/, "")} | ₹${product.price}`,
    ogImage: product.image?.src,
  });
}

/** Allergen keys → the words a customer actually reads. */
const ALLERGEN_NAMES: Record<string, string> = {
  gluten: "wheat",
  dairy: "dairy",
  nuts: "tree nuts",
  soy: "soy",
};

/** One lifestyle frame per category, so the gallery closes on a real photo. */
const LIFESTYLE: Record<string, string> = {
  breads: "/images/stock/lifestyle/bread-butter-coffee-slate-table.jpg",
  anpan: "/images/stock/lifestyle/pastries-cooling-rack-curtain-light.jpg",
  karepan: "/images/stock/lifestyle/coffee-pastry-table-soft-morning.jpg",
  "pies-strudels": "/images/stock/lifestyle/berry-cream-pastry-plated.jpg",
  "fruit-sandos": "/images/stock/lifestyle/toast-jam-knives-window-light.jpg",
};

/** How to eat it, by category. Written from the kitchen, not invented per SKU. */
const HOW_TO_EAT: Record<string, string> = {
  breads:
    "Cut it thick, about 2cm, never sandwich-thin. Warm with butter on day one, still lovely on day two, French toast on day three.",
  anpan:
    "Room temperature, torn in half so you can see the filling. Ten seconds in a warm oven brings the crumb back if it has been sitting.",
  karepan:
    "Five minutes in a hot oven to crisp the outside again, then eat it with your hands while the filling is still warm.",
  "pies-strudels":
    "Straight from the box works. Eight minutes in a hot oven works better, and the pastry comes back like it was just baked.",
  "fruit-sandos":
    "Cold, cut corner to corner so the fruit shows, and within the day. The cream is fresh and does not wait.",
};

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const path = `/product/${product.slug}`;
  const category = getCategoryOf(product);
  const stock = stockFor(product.slug);
  const pairings = getPairings(product.slug, 3);

  // Three frames, in the order the spec names them: the two cutout revisions
  // and one lifestyle photograph. A SKU with only one cutout gets two frames,
  // and one with none falls back to the old site's photograph.
  const variants = cutoutVariants(product.slug);
  const cutouts = [variants.v1, variants.v2].filter(
    (src): src is string => Boolean(src),
  );
  const fallback = cutouts.length
    ? []
    : galleryFor(product.slug, product.existingImage).slice(0, 1);
  const lifestyle = LIFESTYLE[product.category];
  const images: ProductImage[] = [
    ...cutouts.map((src) => ({ src, kind: "cutout" as const })),
    ...fallback,
    ...(lifestyle ? [{ src: lifestyle, kind: "legacy" as const }] : []),
  ];

  const contains = product.allergens.contains
    .map((a) => ALLERGEN_NAMES[a] ?? a)
    .filter(Boolean);
  const howToEat = HOW_TO_EAT[product.category];

  return (
    <>
      <JsonLd
        path={path}
        crumbs={[
          { name: "Shop", path: "/shop" },
          { name: product.name, path },
        ]}
        nodes={[
          productLd({
            name: product.name,
            slug: product.slug,
            description: product.shortDescription,
            price: product.price,
            image: product.image?.src,
            inStock: !stock.soldOut,
          }),
        ]}
      />

      {/* -------- 1. Breadcrumb ---------------------------------------- */}
      <nav aria-label="Breadcrumb" className="bg-paper pt-6">
        <ol className="container-content flex flex-wrap items-center gap-1.5 text-body-sm text-muted">
          <li>
            <Link href="/shop" className="link-underline hover:text-ink">
              Shop
            </Link>
          </li>
          <ChevronRight size={14} strokeWidth={1.5} aria-hidden="true" />
          {category ? (
            <>
              <li>
                <Link
                  href={`/shop/${category.slug}`}
                  className="link-underline hover:text-ink"
                >
                  {category.label}
                </Link>
              </li>
              <ChevronRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </>
          ) : null}
          <li aria-current="page" className="text-ink-2">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* -------- 2. The stage ----------------------------------------- */}
      <section className="bg-paper pt-8 pb-[var(--section-y)]">
        <div className="container-content">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <ProductGalleryV2
              images={images}
              alt={product.name}
              soldOut={stock.soldOut}
            />

            <div className="lg:pt-4">
              <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                {category?.label}
              </p>

              <h1 className="mt-3 text-display-2 text-ink">{product.name}</h1>
              <KanaLabel
                kana={product.kana}
                decorative={false}
                className="mt-1.5 !text-[14px]"
              />

              <div className="mt-5">
                <Price amount={product.price} size="lg" muted={stock.soldOut} />
              </div>

              <p className="mt-5 max-w-[48ch] text-body-lg text-ink-2">
                {blurb(product.shortDescription, product.longDescription)}
              </p>

              <div className="mt-8">
                <ProductAddBlock
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  soldOut={stock.soldOut}
                />
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
                {[
                  { icon: EggOff, label: "Eggless" },
                  { icon: Leaf, label: "Vegetarian" },
                  { icon: Sunrise, label: "Baked daily" },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-body-sm text-ink-2"
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="text-accent"
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* -------- 3. What is in it, how to eat it ---------------------- */}
      <section className="border-y border-line bg-paper-2 py-[var(--section-y)]">
        <div className="container-content">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-h2 text-ink">What&rsquo;s in it</h2>
              <dl className="mt-7 divide-y divide-line border-y border-line">
                {contains.length > 0 ? (
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                    <dt className="w-full shrink-0 text-[12px] font-medium tracking-[0.12em] text-muted uppercase sm:w-44">
                      Contains
                    </dt>
                    <dd className="text-body text-ink">
                      {sentence(contains)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                  <dt className="w-full shrink-0 text-[12px] font-medium tracking-[0.12em] text-muted uppercase sm:w-44">
                    Does not contain
                  </dt>
                  <dd className="text-body text-ink">Egg</dd>
                </div>
              </dl>
            </div>

            {howToEat ? (
              <div>
                <h2 className="text-h2 text-ink">How to eat it</h2>
                <p className="mt-7 max-w-[52ch] text-body-lg text-ink-2">
                  {howToEat}
                </p>
                {tail(product.shortDescription, product.longDescription) ? (
                  <p className="mt-6 max-w-[52ch] text-body text-ink-2">
                    {tail(product.shortDescription, product.longDescription)}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* -------- 4. Pairs well with ----------------------------------- */}
      {pairings.length > 0 ? (
        <section className="bg-paper py-[var(--section-y)]">
          <div className="container-content">
            <h2 className="text-h2 text-ink">Pairs well with</h2>
            <div className="mt-9 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
              {pairings.map((pairing) => {
                const pairStock = stockFor(pairing.slug);
                return (
                  <ProductCard
                    key={pairing.slug}
                    product={{ ...pairing, href: `/product/${pairing.slug}` }}
                    stock={{ soldOut: pairStock.soldOut, left: pairStock.left }}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* -------- 5. Two reviews --------------------------------------- */}
      <section className="border-t border-line bg-paper-2 py-[var(--section-y)]">
        <div className="container-content">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {REVIEWS.map((review) => (
              <figure key={review.name}>
                <Stars />
                <blockquote className="mt-4 font-display text-[24px] leading-[1.25] text-ink italic">
                  {review.quote}
                </blockquote>
                <figcaption className="mt-4 text-body-sm text-muted">
                  {review.name} · {review.meta}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* The running total follows the thumb on a phone. */}
      <StickyCartBar />
      <div aria-hidden="true" className="h-16 md:hidden" />
    </>
  );
}

/** Two of the eight real testimonials carried over from the live site. */
const REVIEWS = [
  {
    quote:
      "Perfect balance of flavour and texture. The sandos are my go-to now.",
    name: "Ananya G.",
    meta: "Bengaluru",
  },
  {
    quote:
      "Every item feels crafted, not mass-produced. You can taste the care.",
    name: "Rahul D.",
    meta: "Bengaluru",
  },
] as const;

function Stars() {
  return (
    <span className="flex gap-1" aria-label="Five out of five">
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

/** "wheat, dairy" → "Wheat and dairy". */
function sentence(words: string[]): string {
  const list =
    words.length <= 1
      ? words.join("")
      : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
  return list.charAt(0).toUpperCase() + list.slice(1);
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.]+\./);
  return match ? match[0] : "";
}

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

/**
 * Several SKUs open their long description by restating the short one almost
 * word for word. Printing both puts the same sentence on screen twice, so the
 * buy column borrows the opening sentence only when it actually adds something.
 */
function borrows(short: string, long: string): boolean {
  const opener = firstSentence(long);
  if (!opener) return false;
  const a = new Set(words(short));
  const b = words(opener);
  if (b.length === 0) return false;
  const shared = b.filter((w) => a.has(w)).length / b.length;
  return shared < 0.5;
}

/** The two-line description under the price. */
function blurb(short: string, long: string): string {
  return borrows(short, long) ? `${short} ${firstSentence(long)}` : short;
}

/** Whatever the buy column did not use, for the section below it. */
function tail(short: string, long: string): string {
  return borrows(short, long)
    ? long.slice(firstSentence(long).length).trim()
    : long;
}
