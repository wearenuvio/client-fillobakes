import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
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
      <div className="bg-paper">
        <div className="container-content pt-10 pb-16 lg:pt-14 lg:pb-24">
          <h1 className="font-display text-display-2 text-ink">Your order</h1>
          {/* The lead line lives inside CartPage: it is about a total, and an
              empty cart has none. */}
          <div className="mt-3">
            <CartPage />
          </div>
        </div>
      </div>
    </>
  );
}
