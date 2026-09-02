import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard, ProductGrid } from "@/components/blocks/ProductCard";
import { LineArtBleed } from "@/components/ui/LineArt";
import { getBestsellers, getProducts } from "@/lib/catalog";
import { getStockFor } from "@/lib/mock";

export const metadata: Metadata = buildMetadata("/404", { noindex: true });

/**
 * 404 — site-content.md.
 *
 * The live site returns a bare "Product Not Found · ID: [slug]" at HTTP 200
 * for eight sitemap URLs, which is a soft-404 and worse than a real one. This
 * returns a real 404 (Next does that for not-found.tsx), and the dead
 * /product/* URLs are 301'd in next.config.ts instead of landing here.
 *
 * The page hands the visitor exactly one door and four real cards.
 */
export default function NotFound() {
  const suggestions = (getBestsellers().length ? getBestsellers() : getProducts()).slice(0, 4);

  return (
    <Section surface="paper-50" className="overflow-hidden">
      <LineArtBleed glyph="loaf" side="right" size={640} />

      <div className="relative max-w-[var(--max-narrow)]">
        <p className="micro text-kiln">404</p>
        <h1 className="mt-4 text-display-lg text-ink-800">We don&rsquo;t bake that.</h1>
        <p className="mt-4 max-w-[46ch] text-body-lg text-ink-600">
          That page has gone, or never existed. Here&rsquo;s what&rsquo;s in the
          van this week.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/shop" size="lg">
            See this week&rsquo;s bake
          </ButtonLink>
          <ButtonLink href="/van" variant="secondary" size="lg">
            Track the van
          </ButtonLink>
        </div>
      </div>

      <ProductGrid className="relative mt-16">
        {suggestions.map((product) => {
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
    </Section>
  );
}
