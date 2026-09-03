import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { CheckoutPage } from "@/components/pages/commerce/CheckoutPage";
import {
  checkoutAreas,
  checkoutDays,
} from "@/components/pages/commerce/checkout-data";
import { CONFIRMATION_ORDER_ID } from "@/components/pages/commerce/confirmation";

const PATH = "/checkout";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * One page, four blocks. Everything that touches a fixture is resolved here;
 * the client is handed plain data and does the arithmetic on the cart.
 */
export default function CheckoutRoute() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Checkout", path: PATH }]} />
      <div className="bg-paper">
        <CheckoutPage
          areas={checkoutAreas()}
          days={checkoutDays()}
          orderId={CONFIRMATION_ORDER_ID}
        />
      </div>
    </>
  );
}
