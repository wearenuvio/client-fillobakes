import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/blocks/ProductCard";
import { SectionHead } from "@/components/pages/home/HomeSections";
import { ButtonLink } from "@/components/ui/Button";
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
      {/* Inside the section on every edge. `bottom-[var(--section-y)]` puts
          the loaf's foot on the line the content ends on, and the right inset
          keeps it off the window edge, so `overflow-hidden` has nothing to
          cut. It clears the centred "See all" button horizontally and only
          ever shows through the gutters between opaque cards. */}
      <InkArt
        name="shokupan-loaf"
        width={400}
        opacity={0.1}
        className="right-2 bottom-[var(--section-y)] w-[400px]"
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

        {/* The top-right link is for someone already scanning the heading; the
            button is for someone who has just read all eight cards and is at
            the bottom of the grid with nowhere to go. Same destination, two
            different moments, so both stay. */}
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/shop" variant="secondary" size="md">
            See all {total} bakes
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
