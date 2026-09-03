import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PolicyLayout } from "@/components/pages/content/PolicyLayout";
import { SITE, CONTACT } from "@/lib/config";

const PATH = "/policies/terms";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Terms — carried over with two updates (site-content.md, Policies).
 *
 *  §1 names the full legal entity, Wise Eats SuperFood OPC Pvt Ltd, rather
 *     than "Fillo Bakes", which is a brand and not a party to anything.
 *  §4 points at the rewritten Delivery policy instead of describing shipping
 *     times that never applied to a van.
 */
export default function TermsPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Policies", path: "/policies/shipping" },
          { name: "Terms and conditions", path: PATH },
        ]}
      />
      <PolicyLayout
        current={PATH}
        title="Terms and conditions"
        updated="3 September 2026"
        lead={`These terms govern orders placed with Fillo Bakes, a brand operated by ${SITE.legalName}, registered in ${SITE.city}, ${SITE.state}.`}
        sections={[
          {
            id: "who-you-are-contracting-with",
            title: "Who you are contracting with",
            body: (
              <p>
                Your contract is with <strong>{SITE.legalName}</strong>,
                registered in {SITE.city}, {SITE.state}. &ldquo;Fillo
                Bakes&rdquo;, &ldquo;we&rdquo; and &ldquo;us&rdquo; on this site
                mean that company. Contact is{" "}
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or{" "}
                {CONTACT.phone}.
              </p>
            ),
          },
          {
            id: "using-the-site",
            title: "Using the site",
            body: (
              <p>
                You may browse the catalogue freely. Placing an order requires a
                phone number, which becomes your account identifier. There is no
                password anywhere on this site, so keep access to that number
                secure: anyone who can receive its messages can see your orders.
              </p>
            ),
          },
          {
            id: "orders-and-prices",
            title: "Orders and prices",
            body: (
              <>
                <p>
                  Prices are in Indian rupees and include the delivery fee where
                  one applies. An order is accepted when payment succeeds and we
                  confirm it; until then nothing is reserved.
                </p>
                <p>
                  We bake to order in small batches, so an item can sell out
                  between you seeing it and you paying for it. If that happens
                  we will tell you and refund that line rather than substitute
                  something you did not choose.
                </p>
              </>
            ),
          },
          {
            id: "delivery",
            title: "Delivery",
            body: (
              <p>
                Delivery is set out in full in the{" "}
                <Link href="/policies/shipping">Delivery policy</Link>, which
                covers where we go, when we go there, what it costs and what
                happens if we cannot reach you. Those terms form part of these.
              </p>
            ),
          },
          {
            id: "cancellations-and-refunds",
            title: "Cancellations and refunds",
            body: (
              <p>
                Fresh bread cannot be returned. What we do fix, and how a refund
                is paid, is set out in the{" "}
                <Link href="/policies/refund">Refunds policy</Link>. Nothing in
                these terms limits your rights under Indian consumer law.
              </p>
            ),
          },
          {
            id: "food-and-allergens",
            title: "Food, allergens and storage",
            body: (
              <p>
                Everything we bake is vegetarian and eggless, and individual
                products carry their own allergen information on the product
                page. Bread has no preservatives in it and is at its best on the
                day it is baked.
              </p>
            ),
          },
          {
            id: "liability",
            title: "Liability",
            body: (
              <p>
                We are responsible for the food we bake and the service we
                describe here. We are not responsible for a run delayed by
                traffic, weather or something outside our control, beyond
                putting your order right. Our liability for any order is limited
                to the value of that order.
              </p>
            ),
          },
          {
            id: "changes-and-law",
            title: "Changes, and which law applies",
            body: (
              <p>
                We may update these terms. The version that applies to an order
                is the one published when you placed it, and the date at the top
                of this page tells you which that is. These terms are governed
                by the laws of India, and the courts of {SITE.city},{" "}
                {SITE.state} have jurisdiction.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
