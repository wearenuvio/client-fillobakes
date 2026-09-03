import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageHeader } from "@/components/blocks/PageHeader";
import { CartPage } from "@/components/pages/commerce/CartPage";

const PATH = "/cart";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * The full-page cart. Everything on it is client state, so this route is a
 * heading and a mount point — the numbers come from the same `computeTotals`
 * the drawer and checkout use.
 */
export default function CartRoute() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Your order", path: PATH }]} />
      {/* The lede lives inside CartPage: it is about a total, and an empty
          cart has none. */}
      <PageHeader title="Your order" variant="compact" art="anpan-bun" artSize="sm" />
      <div className="bg-paper">
        <div className="container-content pb-16 lg:pb-24">
          <CartPage />
        </div>
      </div>
    </>
  );
}
