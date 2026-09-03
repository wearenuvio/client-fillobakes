import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PolicyLayout } from "@/components/pages/content/PolicyLayout";
import { SITE, CONTACT } from "@/lib/config";

const PATH = "/policies/privacy";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Privacy — carried over with the additions site-content.md asks for:
 * the phone number named as the account identifier, the delivery area named
 * as routing data, and the tracker line. The Razorpay language, the no-sale
 * commitment and the deletion contact are unchanged.
 *
 * The tracker sentence is the one people actually want: the van's live
 * position is ours, not theirs.
 */
export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[
          { name: "Policies", path: "/policies/shipping" },
          { name: "Privacy policy", path: PATH },
        ]}
      />
      <PolicyLayout
        current={PATH}
        title="Privacy policy"
        updated="3 September 2026"
        lead={`What we collect, why we collect it, and how to have it deleted. Fillo Bakes is operated by ${SITE.legalName}, ${SITE.city}.`}
        sections={[
          {
            id: "what-we-collect",
            title: "Information we collect",
            body: (
              <ul>
                <li>
                  <strong>Your phone number</strong>, used as your account
                  identifier. There is no password on this site; the number and
                  a one-time code are the whole login.
                </li>
                <li>
                  <strong>Your delivery area and address</strong>, used to route
                  the van and to tell you which run days apply to you.
                </li>
                <li>
                  <strong>Your name and, if you give it, your email</strong>,
                  used on your order and your invoice.
                </li>
                <li>
                  <strong>Your orders</strong>, so you can see them again and so
                  we know what to bake.
                </li>
              </ul>
            ),
          },
          {
            id: "the-tracker",
            title: "The van tracker",
            body: (
              <p>
                <strong>
                  The van&rsquo;s live position is ours, not yours. We do not
                  collect your device location.
                </strong>{" "}
                The tracker shows you where our van is and how many stops away
                it is from the stop you picked. If you use &ldquo;Use my
                location&rdquo; when setting your area, that lookup happens in
                your browser to fill in the field, and we keep the area you
                confirm rather than the coordinates.
              </p>
            ),
          },
          {
            id: "payments",
            title: "Payments",
            body: (
              <p>
                Payments are processed by Razorpay. Card numbers, CVVs and UPI
                credentials are handled by Razorpay under their own terms and
                never reach us. We keep the fact of a payment, its amount and
                its status, and nothing that could be used to charge you again.
                See <Link href="/policies/payment">Payment and security</Link>.
              </p>
            ),
          },
          {
            id: "messages",
            title: "Messages we send",
            body: (
              <p>
                Order updates go to the number you ordered with, because that is
                the service you bought. Anything else, such as the Sunday
                newsletter, a nudge when the van is near your stop, or a note
                when a sold-out item is back, is a separate opt-in you choose.
                Every one of them can be turned off from your account without
                turning off the others.
              </p>
            ),
          },
          {
            id: "we-do-not-sell-it",
            title: "We don't sell it",
            body: (
              <p>
                We do not sell, rent or trade your personal information. We
                share it only with the services that make an order work, namely
                Razorpay for payment and the messaging provider that sends your
                order updates, and only the part they need.
              </p>
            ),
          },
          {
            id: "deletion",
            title: "Seeing it, or having it deleted",
            body: (
              <p>
                Write to{" "}
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> from the
                address on your account, or message {CONTACT.phone} from the
                number on it, and ask. We will send you what we hold or delete
                it. We keep what tax law requires us to keep on a completed
                order, and nothing beyond that.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
