import {
  ShopGrid,
  ShopTabs,
  type ShopItem,
  type ShopTab,
} from "@/components/pages/commerce/ShopGrid";
import { getCategories, getProducts, type Product } from "@/lib/catalog";
import { stockFor } from "@/components/pages/commerce/run";
import { StickyCartBar } from "@/components/pages/commerce/StickyCartBar";

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

export function ShopShell({
  heading,
  count,
  lead,
  activeTab = "all",
  products,
  headingAs: Heading = "h1",
}: {
  heading: string;
  count: number;
  lead: string;
  activeTab?: string;
  products: Product[];
  headingAs?: "h1" | "h2";
}) {
  return (
    <>
      <section className="bg-paper pt-10 pb-8 lg:pt-14">
        <div className="container-content">
          <p className="script">Everything eggless.</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <Heading className="text-display-2 text-ink">{heading}</Heading>
            <span className="text-body-lg text-muted tabular">
              {count} {count === 1 ? "bake" : "bakes"}
            </span>
          </div>
          <p className="mt-4 max-w-[52ch] text-body-lg text-ink-2">{lead}</p>
        </div>
      </section>

      <ShopTabs tabs={shopTabs()} activeTab={activeTab} />

      <section className="bg-paper pb-[var(--section-y)]">
        <div className="container-content">
          <ShopGrid items={shopItems(products)} />
        </div>
      </section>

      <StickyCartBar />
    </>
  );
}
