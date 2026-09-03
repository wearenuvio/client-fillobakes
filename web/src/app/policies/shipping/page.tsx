import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PolicyLayout } from "@/components/pages/content/PolicyLayout";
import { COMMERCE, SITE } from "@/lib/config";

const PATH = "/policies/shipping";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Delivery — rewritten for the van (site-content.md, Policies).
 *
 * The policy this replaces described couriers, weight-and-distance pricing and
 * "1–2 business days" processing. None of that is how this business works: it
 * described a warehouse, and it contradicted the entire proposition. This one
 * describes a van on a route, and it states its numbers rather than hedging
 * them.
 */
export default function ShippingPolicyPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Policies", path: PATH },
          { name: "Delivery", path: PATH },
        ]}
      />
      <PolicyLayout
        current={PATH}
        title="Delivery"
        updated="3 September 2026"
        lead={`We deliver in ${SITE.city} only, on fixed neighbourhood routes. Set your area anywhere on the site to see whether we reach you, which days, and what it costs.`}
        sections={[
          {
            id: "how-it-works",
            title: "How it works",
            body: (
              <p>
                We bake in small batches after orders come in. Your box goes out
                on the next route day for your area, in the two-hour window you
                choose. It is handed over in person, not left in a locker.
              </p>
            ),
          },
          {
            id: "runs-and-windows",
            title: "Runs and windows",
            body: (
              <>
                <p>
                  Each route has its own run days. Home delivery windows are
                  12&ndash;2, 2&ndash;4, 4&ndash;6 and 6&ndash;8 PM, and you can
                  order for any run currently scheduled.
                </p>
                <p>
                  <strong>
                    Orders for a run close at 8pm the evening before it.
                  </strong>{" "}
                  That is when the dough goes in. After it, the next run for
                  your area is the earliest we can bake for.
                </p>
              </>
            ),
          },
          {
            id: "catch-the-van",
            title: "Catch the van",
            body: (
              <p>
                You can meet the van at a stop on its run instead. There is no
                delivery fee, and the <Link href="/van">tracker</Link> shows it
                approaching by stop count rather than by a countdown. This is
                the lane most people end up preferring.
              </p>
            ),
          },
          {
            id: "what-it-costs",
            title: "What it costs",
            body: (
              <>
                <p>
                  Catching the van at a stop is free. Home delivery is ₹
                  {COMMERCE.deliveryFee}, and free on orders over ₹
                  {COMMERCE.freeDeliveryThreshold}.
                </p>
                <p>
                  The fee is inside the total shown before you pay and is never
                  added afterwards. If the number on the button ever differs
                  from the number you are charged, that is a bug and we want to
                  hear about it.
                </p>
              </>
            ),
          },
          {
            id: "if-we-cannot-reach-you",
            title: "If we can't reach you",
            body: (
              <p>
                We call once and wait. If nobody answers and you have not told
                us where to leave it, the box comes back with the van and we
                will contact you to rebook. You can tell us at checkout where to
                leave it, though bread left outside in {SITE.city} in June is
                bread we would not want to eat.
              </p>
            ),
          },
          {
            id: "if-something-is-wrong",
            title: "If something is wrong",
            body: (
              <p>
                Message us within 24 hours with a photo. See{" "}
                <Link href="/policies/refund">Refunds</Link>.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
