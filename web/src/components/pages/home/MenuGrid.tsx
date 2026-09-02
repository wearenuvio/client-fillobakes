"use client";

import * as React from "react";
import { ProductCard, ProductGrid } from "@/components/blocks/ProductCard";
import { getBestsellers, getProductBySlug } from "@/lib/catalog";
import { getStockFor } from "@/lib/mock";
import { NotifyDialog } from "@/components/pages/home/NotifyDialog";

/**
 * The menu — site-content Home §7, DESIGN.md §14.2 ("the contact sheet").
 *
 * Eight items, the ones the live site actually calls favourites — no
 * invented "featured" set. Sold-out cards stay in the grid at their place in
 * it: never hidden, never reordered, never greyed out of existence, because
 * seeing what went is what makes the next run worth setting an alert for.
 *
 * Stock comes from the van's on-board counts, so a chip only appears where
 * there is a real number behind it.
 */

export function MenuGrid() {
  const [notify, setNotify] = React.useState<string | null>(null);
  const products = getBestsellers();

  return (
    <>
      <ProductGrid>
        {products.map((product, index) => {
          const stock = getStockFor(product.slug);
          return (
            <ProductCard
              key={product.slug}
              product={product}
              rowIndex={Math.floor(index / 4)}
              stock={
                stock
                  ? { soldOut: stock.state === "sold_out", left: stock.left }
                  : undefined
              }
              onNotifyMe={(slug) => setNotify(slug)}
            />
          );
        })}
      </ProductGrid>

      <NotifyDialog
        open={Boolean(notify)}
        onClose={() => setNotify(null)}
        subject={notify ? (getProductBySlug(notify)?.name ?? null) : null}
      />
    </>
  );
}
