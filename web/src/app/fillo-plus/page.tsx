import type { Metadata } from "next";
import { Bell, Coins, History, Sparkle } from "lucide-react";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Kicker } from "@/components/ui/Rule";
import { LineArtBleed } from "@/components/ui/LineArt";
import { JoinFilloPlus, LegacyMemberBlock } from "@/components/pages/van/JoinFilloPlus";
import { TwoProducts } from "@/components/pages/van/Tbc";
import { formatINR } from "@/lib/format";
import { COMMERCE, MEMBERSHIP } from "@/lib/config";

const PATH = "/fillo-plus";

export const metadata: Metadata = buildMetadata(PATH);

const HOW_IT_WORKS = [
  {
    title: "Join",
    body: "One field, your phone number. No fee, no renewal, nothing to remember.",
  },
  {
    title: "Earn",
    body: "2 Fillo coins for every ₹100 spent, added when an order is delivered. The Standing Order earns them too.",
  },
  {
    title: "Redeem",
    body: "25 coins takes ₹25 off. As often as you reach it. Coins never expire.",
  },
];

const MEMBERSHIP_GETS = [
  { icon: History, line: "Your order history and saved stops" },
  { icon: Bell, line: "Van alerts for your stop" },
  { icon: Sparkle, line: "Early access to new bakes, before they hit the menu" },
  { icon: Coins, line: "The Sunday message, if you want it" },
];

/** Derived from the earn rate, not typed in — 2 coins per ₹100, 25 to redeem. */
const MATHS = [500, 1000, 1500].map((spend) => {
  const coins = (spend / COMMERCE.coinsBasis) * COMMERCE.coinsPerHundred;
  return {
    spend,
    coins,
    orders: Math.ceil(COMMERCE.coinsRedeemThreshold / coins),
  };
});

/**
 * Fillo+ — the free, phone-based account layer.
 *
 * DECISIONS.md §3: the ₹1 join fee is retired, so there is no price, no
 * checkout and no renewal anywhere on this page. `Fillo+ is free.` is the most
 * important line here precisely because of what it replaces.
 *
 * The people who paid the ₹1 before it went keep a permanent Founding member
 * badge, so the change reads as a gift rather than a devaluation.
 */
export default function FilloPlusPage() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: MEMBERSHIP.name, path: PATH }]} />

      <Section surface="paper-50" className="overflow-hidden">
        <LineArtBleed glyph="wheat" side="right" size={700} />
        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Kicker>Membership</Kicker>
            <h1 className="mt-4 font-display text-display-2xl text-ink-800">
              Fillo+ is free.
            </h1>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">
              Join with your phone number. 2 coins for every ₹100 you spend, 25
              coins is ₹25 off, and they never expire.
            </p>
            <div className="mt-8">
              <ButtonLink href="/account/rewards" variant="secondary" size="lg">
                Check my coins
              </ButtonLink>
            </div>
            <p className="mt-4 text-body-sm text-ink-500">
              Already a member? Your coins live in your account, on the same
              number.
            </p>
          </div>

          <div className="lg:col-span-5">
            <JoinFilloPlus />
          </div>
        </div>

        <TwoProducts className="relative mt-16" />
      </Section>

      <Section surface="paper-100">
        <SectionHeader
          as="h2"
          kicker="Three steps"
          heading="How coins work"
          lead="Earned on one order, spent on a later one. That is the whole mechanic."
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.title} className="border-t border-t-paper-400 pt-5">
              <span className="micro text-kiln tabular">Step {i + 1}</span>
              <h3 className="mt-3 text-title font-sans font-semibold text-ink-800">
                {step.title}
              </h3>
              <p className="mt-2 text-body-sm text-ink-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeader
              as="h2"
              kicker="Included"
              heading="What membership gets"
              lead="Four things, all of which exist. Nothing here is a surprise we have not built."
            />
            <ul className="mt-10 divide-y divide-paper-300 border-y border-y-paper-300">
              {MEMBERSHIP_GETS.map(({ icon: Icon, line }) => (
                <li key={line} className="flex items-start gap-3 py-4">
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-ink-600"
                  />
                  <span className="text-body text-ink-600">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <SectionHeader
              as="h2"
              kicker="The maths"
              heading="What ₹25 off costs you"
              lead="Coins are earned on one order and applied to a later one. They never expire."
            />
            <table className="mt-10 w-full border-y border-y-paper-300 text-left">
              <caption className="sr-only">
                Coins earned per amount spent, and the orders needed to reach ₹25 off
              </caption>
              <thead>
                <tr className="border-b border-b-paper-300">
                  <th scope="col" className="micro py-3 pr-4 font-normal text-ink-500">
                    You spend
                  </th>
                  <th scope="col" className="micro py-3 pr-4 font-normal text-ink-500">
                    You earn
                  </th>
                  <th scope="col" className="micro py-3 font-normal text-ink-500">
                    Orders to reach ₹25 off
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-300">
                {MATHS.map((row) => (
                  <tr key={row.spend}>
                    <th
                      scope="row"
                      className="py-4 pr-4 font-mono text-body-sm font-normal text-ink-800 tabular"
                    >
                      {formatINR(row.spend)}
                    </th>
                    <td className="py-4 pr-4 font-mono text-body-sm text-ink-600 tabular">
                      {row.coins} coins
                    </td>
                    <td className="py-4 font-mono text-body-sm text-ink-600 tabular">
                      {row.orders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="micro mt-4 text-ink-500">
              MINIMUM {COMMERCE.coinsRedeemThreshold} COINS TO REDEEM · COINS NEVER
              EXPIRE
            </p>
          </div>
        </div>
      </Section>

      {/* The grandfather block: a gift, not a devaluation. */}
      <Section surface="dark" size="lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Kicker tone="crumb">Before it was free</Kicker>
            <h2 className="mt-4 font-display text-display-lg text-paper-0">
              Founding member
            </h2>
            <p className="mt-6 max-w-[62ch] text-body-lg text-ink-400">
              You joined when Fillo+ cost ₹1. That badge stays on your account,
              and you get first access to every new bake before anyone else.
            </p>
            <p className="mt-6 max-w-[62ch] text-body-sm text-ink-400">
              It shows on your rewards page, in the WhatsApp opener, and on the
              box sticker. Nothing about it can be taken back.
            </p>
          </div>
          <div className="flex items-start lg:col-span-5 lg:justify-end">
            <Badge variant="crumb">{MEMBERSHIP.foundingMemberBadge}</Badge>
          </div>
        </div>
      </Section>

      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <LegacyMemberBlock />
          </div>
          <div className="lg:col-span-5">
            <h2 className="micro text-kiln">And the bread itself</h2>
            <p className="mt-6 max-w-[62ch] text-body text-ink-600">
              Fillo+ is the account. The Standing Order is the weekly loaf that
              sits inside it — its own price, its own cadence, and its own skip
              button.
            </p>
            <div className="mt-6">
              <ButtonLink href="/standing-order" variant="ghost" size="md">
                The Standing Order →
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
