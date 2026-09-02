import * as React from "react";
import { Rule } from "@/components/ui/Rule";
import { ProductCard, ProductGrid } from "@/components/blocks/ProductCard";
import { getProductBySlug } from "@/lib/catalog";
import { getStockFor } from "@/lib/mock";

/**
 * The bakes an article is actually about.
 *
 * A guide that explains a format and then does not show you the format is an
 * essay. Cards are the real ProductCard in its real states, sold-out
 * included — never hidden or reordered (§12.5).
 */
export function RelatedProducts({
  slugs,
  label = "The ones this is about",
  heading,
  className,
}: {
  slugs: string[];
  label?: string;
  heading?: React.ReactNode;
  className?: string;
}) {
  const products = slugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  if (products.length === 0) return null;

  return (
    <div className={className}>
      <Rule label={label} trailing={`${products.length}`} tone="strong" />
      {heading ? (
        <h2 className="mt-6 text-display-sm text-ink-800">{heading}</h2>
      ) : null}
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
