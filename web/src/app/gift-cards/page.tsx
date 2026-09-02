import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Kicker } from "@/components/ui/Rule";
import { ButtonLink } from "@/components/ui/Button";
import { RingSeal } from "@/components/ui/Stamp";
import { GiftCardBuy } from "@/components/pages/home/GiftCardBuy";
import { GiftCardCodes } from "@/components/pages/home/GiftCardCodes";
import { Tbc } from "@/components/pages/home/Tbc";

const PATH = "/gift-cards";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Gift cards — site-content "Page: Gift cards".
 *
 * This page matters more than it looks: it is the thing that still converts on
 * a sold-out day. When the run is gone, it is the only purchase left on the
 * site, so the sold-out module on the home page links straight to it.
 */
export default function GiftCardsPage() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Gift cards", path: "/gift-cards" }]} />

      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <Kicker>Gift cards</Kicker>
            <h1 className="mt-4 text-display-xl text-ink-800">Gift cards</h1>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">
              For when you don&rsquo;t know which Saturday, or which bread.
            </p>

            <dl className="mt-10 divide-y divide-paper-300 border-y border-y-paper-300">
              <div className="flex items-baseline gap-3 py-3">
                <dt className="micro shrink-0 text-ink-500">Arrives on</dt>
                <span className="dot-leader" aria-hidden="true" />
                <dd className="shrink-0 font-mono text-body-sm text-ink-800">
                  WhatsApp
                </dd>
              </div>
              <div className="flex items-baseline gap-3 py-3">
                <dt className="micro shrink-0 text-ink-500">Sent</dt>
                <span className="dot-leader" aria-hidden="true" />
                <dd className="shrink-0 font-mono text-body-sm text-ink-800">
                  The date you pick
                </dd>
              </div>
              <div className="flex items-baseline gap-3 py-3">
                <dt className="micro shrink-0 text-ink-500">Expiry</dt>
                <span className="dot-leader" aria-hidden="true" />
                <dd className="shrink-0">
                  <Tbc what="Whether gift cards expire" />
                </dd>
              </div>
            </dl>

            <div className="mt-12 hidden lg:block">
              <RingSeal size={132} />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-lg border border-paper-300 bg-paper-0 p-6 md:p-8">
              <GiftCardBuy />
            </div>
          </div>
        </div>
      </Section>

      <Section surface="paper-100">
        <SectionHeader
          kicker="Already have one"
          heading="Redeem it, or just look."
          lead="No login for a balance check. The person holding the card is often not the person with the account."
        />
        <div className="mt-10">
          <GiftCardCodes />
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <div className="flex flex-col gap-4 border-t border-t-paper-400 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-display-sm text-ink-800">
              A card is not a substitute for a loaf.
            </h2>
            <p className="mt-2 max-w-[52ch] text-body text-ink-600">
              If the run is still open, send the bread. The card is for the
              weeks when it is not, or when you would rather they chose.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/shop" variant="secondary" size="md">
              See this week&rsquo;s bake
            </ButtonLink>
            <ButtonLink href="/gifting" variant="ghost" size="md">
              Send a box instead →
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
