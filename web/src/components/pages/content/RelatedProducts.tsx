import * as React from "react";
import { SectionHead } from "@/components/pages/content/PageShell";
import { ProductCard, ProductGrid } from "@/components/blocks/ProductCard";
import { getProductBySlug } from "@/lib/catalog";
import { getStockFor } from "@/lib/mock";

/**
 * The bakes an article is actually about.
 *
 * A guide that explains a format and then does not show you the format is an
 * essay. The cards are the real ProductCard in its real states, sold out
 * included — never hidden, never reordered.
 */
export function RelatedProducts({
  slugs,
  eyebrow = "Pairs well with",
  heading,
  className,
}: {
  slugs: string[];
  eyebrow?: string;
  heading?: React.ReactNode;
  className?: string;
}) {
  const products = slugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  if (products.length === 0) return null;

  return (
    <div className={className}>
      <SectionHead
        eyebrow={eyebrow}
        heading={heading ?? "The ones this is about."}
      />
      <ProductGrid className="mt-8">
        {products.map((product) => {
          const stock = getStockFor(product.slug);
          return (
            <ProductCard
              key={product.slug}
              product={product}
              stock={{
                soldOut: stock?.state === "sold_out",
                left: stock?.left,
              }}
            />
          );
        })}
      </ProductGrid>
    </div>
  );
}
