import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { ShopShell } from "@/components/pages/commerce/ShopShell";
import { getProducts } from "@/lib/catalog";

const PATH = "/shop/all";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * The same page as `/shop`, kept because the URL is linked from the old site.
 * DESIGN-v2 §3 collapses the two: there is one catalogue and one grid.
 */
export default function AllBakesPage() {
  const products = getProducts();

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Shop", path: "/shop" },
          { name: "Everything", path: PATH },
        ]}
      />
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
