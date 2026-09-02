import type { Metadata } from "next";
import { buildMetadata, JsonLd, bakeryLd, websiteLd } from "@/lib/seo";
import { getAreas } from "@/lib/mock";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { HomeHero } from "@/components/pages/home/HomeHero";
import { HomeVanBand } from "@/components/pages/home/HomeVanBand";
import { HomeBestsellers } from "@/components/pages/home/HomeBestsellers";
import {
  CategoryTiles,
  ComeBack,
  JournalRow,
  Reviews,
  StorySplit,
  TrustStripV2,
  WhyReturn,
} from "@/components/pages/home/HomeSections";

const PATH = "/";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Home — DESIGN-v2 §3. Crave, choose, believe, get it, come back.
 *
 * Eleven sections in that order and nothing else. The run days, the stops, the
 * cutoff clock, the lane choice and the honest supply counts have all moved to
 * the cart drawer, checkout and /van: they are answers to "how do I get it",
 * so they arrive once, in the dark band, and never before the product.
 *
 * One script line, one seal, one accent button per screenful, one dark band.
 */
export default function HomePage() {
  const areaServed = getAreas()
    .filter((a) => a.serviceability !== "not_yet")
    .map((a) => a.name);

  const hero = getProductBySlug("milk-shokupan");
  const total = getProducts().length;

  // Two rows: four across on desktop, two across on a phone.
  const bestsellers = [
    "milk-shokupan",
    "custard-an-pan",
    "seoul-spice",
    "fruit-sando",
    "strawberry-an-pan",
    "japanese-marble-bread",
    "kyoto-curry",
    "blue-pea-bread",
  ]
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      {/* The bakery publishes no street address: it is a van, not a shop. */}
      <JsonLd path={PATH} nodes={[bakeryLd(areaServed), websiteLd()]} />

      {/* 1 — Crave. */}
      <HomeHero
        image={hero?.image ?? null}
        imageAlt="A loaf of Fillo milk shokupan, sliced"
      />

      {/* 2 — The four quiet facts. */}
      <TrustStripV2 />

      {/* 3 — Choose: four cards with one-tap add. */}
      <HomeBestsellers products={bestsellers} total={total} />

      {/* 4 — Choose: the five kinds. */}
      <CategoryTiles />

      {/* 5 — Believe: the founders and the method. */}
      <StorySplit />

      {/* 6 — Believe: the four reasons people come back. */}
      <WhyReturn />

      {/* 7 — Get it. The page's one dark band. */}
      <HomeVanBand
        leftCutout={getProductBySlug("custard-an-pan")?.image ?? null}
        rightCutout={getProductBySlug("seoul-spice")?.image ?? null}
      />

      {/* 8 — Come back: the habit and the membership, side by side. */}
      <ComeBack />

      {/* 9 — Come back: three real reviews. */}
      <Reviews />

      {/* 10 — Come back: two posts and the Sunday email. */}
      <JournalRow />
    </>
  );
}
