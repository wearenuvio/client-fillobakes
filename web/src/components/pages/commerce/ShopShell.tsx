import {
  ShopGrid,
  ShopTabs,
  type ShopItem,
  type ShopTab,
} from "@/components/pages/commerce/ShopGrid";
import { getCategories, getProducts, type Product } from "@/lib/catalog";
import { stockFor } from "@/components/pages/commerce/run";
import { PageHeader } from "@/components/blocks/PageHeader";
import type { InkArtName } from "@/components/ui/InkArt";
import { StickyCartBar } from "@/components/pages/commerce/StickyCartBar";
import { CartBarSpacer } from "@/components/pages/commerce/CartBarSpacer";

/**
 * The shop page — DESIGN-v2 §3 Shop. `/shop`, `/shop/all` and every
 * `/shop/[category]` are the same page: a header block, sticky tabs and the
 * grid. The category route pre-filters and pre-selects its tab.
 */

/** Tabs: All plus every category that actually has items in it. */
export function shopTabs(): ShopTab[] {
  const categories = getCategories().filter((c) => c.count > 0);
  return [
    {
      slug: "all",
      label: "All",
      href: "/shop",
      count: getProducts().length,
    },
    ...categories.map((c) => ({
      slug: c.slug,
      label: c.label,
      href: `/shop/${c.slug}`,
      count: c.count,
    })),
  ];
}

export function shopItems(products: Product[]): ShopItem[] {
  return products.map((product) => {
    const stock = stockFor(product.slug);
    return { product, soldOut: stock.soldOut, left: stock.left };
  });
}

/**
 * Each shop route's drawing: its own kind, and the loaf for the index.
 *
 * The kare pan drawing is the densest of the set — a filled, hatched bun that
 * reads as a smudge rather than a line at 14% behind a header. So the menu
 * index takes the shokupan loaf, which is the thing the bakery is known for
 * anyway, and the kare pan route takes the an pan bun: same open line, and
 * still a bun.
 */
const CATEGORY_ART: Record<string, InkArtName> = {
  all: "shokupan-loaf",
  breads: "shokupan-loaf",
  anpan: "anpan-bun",
  karepan: "anpan-bun",
  "pies-strudels": "croissant",
  "fruit-sandos": "fruit-sando",
};

export function ShopShell({
  heading,
  count,
  lead,
  activeTab = "all",
  products,
}: {
  heading: string;
  count: number;
  lead: string;
  activeTab?: string;
  products: Product[];
}) {
  return (
    <>
      {/* The shared page header, so the menu's top block is the same object
          as every other page's. The count rides the title row on the right
          rather than sitting beside the title, which is what `PageHeader`
          gives every page that has a number to show. */}
      <PageHeader
        script="Everything eggless."
        title={heading}
        lede={lead}
        art={CATEGORY_ART[activeTab] ?? "shokupan-loaf"}
        artSize="md"
        actions={
          <span className="text-body-lg text-muted tabular">
            {count} {count === 1 ? "bake" : "bakes"}
          </span>
        }
      />

      <ShopTabs tabs={shopTabs()} activeTab={activeTab} />

      {/* The tab strip supplies the gap below the header block on a phone. It
          is gone from 1024, so the grid section grows its own top padding
          there rather than butting straight up against the lead line. */}
      <section className="bg-paper pt-6 pb-[var(--section-y)] lg:pt-10">
        <div className="container-content">
          <ShopGrid
            items={shopItems(products)}
            tabs={shopTabs()}
            activeTab={activeTab}
          />
        </div>
      </section>

      {/* The running total follows the thumb on a phone; the spacer keeps the
          last row of the grid clear of it, and collapses when it is not up. */}
      <StickyCartBar />
      <CartBarSpacer />
    </>
  );
}
