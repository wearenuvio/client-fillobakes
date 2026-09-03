import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PolicyLayout } from "@/components/pages/content/PolicyLayout";

const PATH = "/policies/refund";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Refunds — carried over, opening rewritten (site-content.md, Policies).
 *
 * The rule the rewrite exists to obey: never soften the no, soften the
 * aftermath. "We can't take returns" is the first sentence and it is not
 * hedged; everything after it is the recovery.
 *
 * "Before dispatch" is gone, because dispatch means nothing on a route. The
 * cutoff itself lives in the Delivery policy and is linked, not restated.
 */
export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Policies", path: "/policies/shipping" },
          { name: "Refunds", path: PATH },
        ]}
      />
      <PolicyLayout
        current={PATH}
        title="Refunds"
        updated="3 September 2026"
        lead="We can't take returns. Everything is baked for the day it's made. But if your box arrives damaged, wrong, or just not right, message us within 24 hours with a photo and we'll sort it. Every time."
        sections={[
          {
            id: "why-no-returns",
            title: "Why there are no returns",
            body: (
              <p>
                Every item is baked after your order, for the day it goes out,
                with no preservatives in it. Once it has left the van we cannot
                put it back on the van. This is the same reason the menu is
                short and the same reason a sold-out item stays sold out until
                the next bake.
              </p>
            ),
          },
          {
            id: "what-we-do-fix",
            title: "What we do fix",
            body: (
              <>
                <p>Tell us within 24 hours and send a photo if:</p>
                <ul>
                  <li>the box arrived damaged, crushed or leaking;</li>
                  <li>you were sent the wrong item, or an item is missing;</li>
                  <li>
                    something is genuinely not right, whether under-baked, stale
                    on arrival, or not what the product page described.
                  </li>
                </ul>
                <p>
                  We will replace it on the next run for your area, or refund
                  it. Your order ID and a photo are all we need, and we are not
                  going to ask you to return the bread.
                </p>
              </>
            ),
          },
          {
            id: "changing-or-cancelling",
            title: "Changing or cancelling an order",
            body: (
              <p>
                Changes and cancellations are free until your run closes; the{" "}
                <Link href="/policies/shipping">Delivery policy</Link> says when
                that is. After it the dough is already in, so message us: we
                cannot promise anything, but we will do what we can.
              </p>
            ),
          },
          {
            id: "how-refunds-are-paid",
            title: "How a refund is paid",
            body: (
              <>
                <p>
                  Refunds go back through Razorpay, to the method you paid with.
                  They take 7 to 10 working days to appear, which is the
                  bank&rsquo;s pace and not ours. We do not hold store credit
                  against your account instead of refunding you, unless you ask
                  us to.
                </p>
                <p>
                  See <Link href="/policies/payment">Payment and security</Link>{" "}
                  for how payments are handled.
                </p>
              </>
            ),
          },
          {
            id: "how-to-raise-it",
            title: "How to raise it",
            body: (
              <p>
                WhatsApp is fastest and lets you send the photo in the same
                message. Everything on{" "}
                <Link href="/contact">the contact page</Link> reaches the same
                two people.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
