import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PolicyLayout } from "@/components/pages/content/PolicyLayout";

const PATH = "/policies/payment";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Payment and security — carried over with two edits (site-content.md).
 *
 *  1. UPI goes first in the list of accepted methods, because it is the
 *     primary button at checkout (§12.34) and the list should match the page.
 *  2. The KYC and Razorpay-onboarding checklist is gone. It was an internal
 *     note published by accident and it never belonged on a customer page.
 */
export default function PaymentPolicyPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Policies", path: "/policies/shipping" },
          { name: "Payment and security", path: PATH },
        ]}
      />
      <PolicyLayout
        current={PATH}
        title="Payment and security"
        updated="3 October 2026"
        lead="Payments are processed by Razorpay. We never see or store your card details, and the total you are shown is the total you are charged."
        sections={[
          {
            id: "what-we-accept",
            title: "What we accept",
            body: (
              <>
                <ul>
                  <li>
                    <strong>UPI</strong> &mdash; the primary method, and the
                    default button at checkout.
                  </li>
                  <li>Debit and credit cards.</li>
                  <li>Netbanking.</li>
                  <li>Wallets supported by Razorpay.</li>
                  <li>
                    Cash at the door, on a first order only, under a cap and
                    with a small surcharge. Both figures are still being
                    confirmed and the checkout shows the real ones before you
                    commit.
                  </li>
                </ul>
                <p>
                  Prepaid keeps the van light, which is the only reason cash is
                  limited rather than unavailable.
                </p>
              </>
            ),
          },
          {
            id: "what-we-store",
            title: "What we store",
            body: (
              <p>
                Nothing that could be used to charge you. Card numbers, CVVs and
                UPI credentials are handled by Razorpay and never reach our
                servers. What we keep is your order, your phone number as your
                account identifier, and the delivery area we need in order to
                route the van &mdash; see{" "}
                <Link href="/policies/privacy">Privacy</Link>.
              </p>
            ),
          },
          {
            id: "the-total",
            title: "The total is the total",
            body: (
              <p>
                Delivery is inside the total from the first screen. Nothing is
                added after you press pay, and there is no separate handling,
                packaging or convenience charge. If the number on the button
                differs from the number on your statement, that is a bug and we
                want the screenshot.
              </p>
            ),
          },
          {
            id: "if-a-payment-fails",
            title: "If a payment fails",
            body: (
              <p>
                Nothing is charged on a failed payment. If money has left your
                account and the order has not appeared, it is almost always a
                bank hold that reverses on its own within a few working days
                &mdash; message us with the order ID and the time, and we will
                chase it with Razorpay and hold your box in the meantime.
              </p>
            ),
          },
          {
            id: "refunds",
            title: "Refunds",
            body: (
              <p>
                Refunds go back through Razorpay to the method you paid with and
                take 7 to 10 working days.{" "}
                <Link href="/policies/refund">The refunds policy</Link> covers
                when one applies.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
