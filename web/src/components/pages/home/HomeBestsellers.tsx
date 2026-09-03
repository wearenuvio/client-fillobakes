import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/blocks/ProductCard";
import { SectionHead } from "@/components/pages/home/HomeSections";
import { InkArt } from "@/components/ui/InkArt";
import { stockFor } from "@/components/pages/commerce/run";

/**
 * Bestsellers — DESIGN-v2 §3.3. Eight white cards on cream, one tap to add.
 *
 * The eight the client named. Stock comes from the same fixture the shop grid
 * reads, so a card that is sold out here is sold out there.
 *
 * A drawn loaf sits low on the right at a tenth of full strength. It is placed
 * below the heading and behind the grid, where the only thing it can tint is
 * the gutter between two opaque cards — never a word.
 */

export function HomeBestsellers({
  products,
  total,
}: {
  products: Product[];
  total: number;
}) {
  return (
    <section
      data-reveal
      className="relative overflow-hidden bg-paper py-[var(--section-y)]"
    >
      <InkArt
        name="shokupan-loaf"
        width={520}
        opacity={0.1}
        className="right-[-60px] bottom-[-40px] w-[520px]"
      />
      <div className="relative container-content">
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
