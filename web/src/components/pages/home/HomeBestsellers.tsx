import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/blocks/ProductCard";
import { SectionHead } from "@/components/pages/home/HomeSections";
import { stockFor } from "@/components/pages/commerce/run";

/**
 * Bestsellers — DESIGN-v2 §3.3. Four white cards on cream, one tap to add.
 *
 * The four the client named: the shokupan, the custard an pan, seoul spice and
 * the fruit sando. Stock comes from the same fixture the shop grid reads, so a
 * card that is sold out here is sold out there.
 */

export function HomeBestsellers({
  products,
  total,
}: {
  products: Product[];
  total: number;
}) {
  return (
    <section className="bg-paper py-[var(--section-y)]">
      <div className="container-content">
        <SectionHead
          eyebrow="Bestsellers"
          heading="The ones people come back for."
          link={{ href: "/shop", label: `See all ${total}` }}
        />

        <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
          {products.map((product, i) => {
            const stock = stockFor(product.slug);
            return (
              <ProductCard
                key={product.slug}
                product={{ ...product, href: `/product/${product.slug}` }}
                stock={{ soldOut: stock.soldOut, left: stock.left }}
                priority={i < 2}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
