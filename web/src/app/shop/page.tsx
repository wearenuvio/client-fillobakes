import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { ShopShell } from "@/components/pages/commerce/ShopShell";
import { getProducts } from "@/lib/catalog";

const PATH = "/shop";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * The menu — DESIGN-v2 §3 Shop. Grid first.
 *
 * `/shop` and `/shop/all` are the same page. The catalogue is never gated: the
 * grid renders whether or not an area is set, and the area question lives in
 * the cart drawer, where it is actually load-bearing.
 */
export default function ShopPage() {
  const products = getProducts();

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Shop", path: PATH }]} />
      <ShopShell
        heading="The menu"
        count={products.length}
        lead="Baked every morning. Order by 8pm for tomorrow."
        products={products}
        activeTab="all"
      />
    </>
  );
}
