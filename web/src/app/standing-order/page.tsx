import type { Metadata } from "next";
import { Calendar, Check, MessageCircle, Pause, Repeat, SkipForward } from "lucide-react";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Faq } from "@/components/blocks/Faq";
import { SubscriptionPlanCard } from "@/components/blocks/SubscriptionPlanCard";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Rule";
import { LineArtBleed } from "@/components/ui/LineArt";
import { TbcNote, TwoProducts } from "@/components/pages/van/Tbc";
import { formatINR } from "@/lib/format";
import { COMMERCE, SUBSCRIPTION_NAME } from "@/lib/config";
import { getSubscription, isTbc, TBC } from "@/lib/mock";

const PATH = "/standing-order";

export const metadata: Metadata = buildMetadata(PATH);

/** The two mock plans. Both prices are estimates and are labelled as such. */
const PLANS = [
  {
    id: "standing_loaf",
    name: "1 Milk Shokupan",
    cadence: "Every Saturday",
    listPrice: 200,
    weeklyPrice: 180,
    saving: "₹20 a week",
    benefits: [
      "One loaf, every run day, at your stop or your door",
      "Coins on every delivery",
      "Skip any week until 8pm the evening before",
      "First refusal on new bakes",
    ],
  },
  {
    id: "standing_pair",
    name: "1 loaf + 1 rotating bake",
    cadence: "Every Saturday",
    listPrice: 359,
    weeklyPrice: 310,
    saving: "₹49 a week",
    benefits: [
      "A loaf plus whatever the kitchen is proudest of that week",
      "Coins on every delivery",
      "Swap the rotating item, or skip the week",
      "First refusal on new bakes",
    ],
  },
] as const;

const STEPS = [
  {
    title: "Pick your loaf",
    body: "One item, or a few. Change it whenever.",
  },
  {
    title: "We put you on your route's list",
    body: "Your area decides the run day. Indiranagar is Saturdays.",
  },
  {
    title: "We message you Wednesday",
    body: "What's coming, what it costs, and a skip button. One tap and that week is off.",
  },
  {
    title: "The van brings it Saturday",
    body: "Same stop, same window, every week.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Can I skip a week?",
    answer:
      "Yes, until 8pm the evening before the run. You aren't charged for a skipped week.",
  },
  {
    question: "Can I pause?",
    answer:
      "Yes. Pick a return date. Nothing is charged while you're paused and we message you the day before it restarts.",
  },
  {
    question: "How do I cancel?",
    answer:
      "One tap, from your account. No phone call. Your last delivery is the one already in the plan.",
  },
  {
    question: "Can I change the day?",
    answer:
      "Yes, to any day the van serves your area. It applies from the following run.",
  },
  {
    question: "Can I change what's in it?",
    answer: "Yes, from the next uncut delivery.",
  },
  {
    question: "What if you can't bake my loaf?",
    answer:
      "We message you and offer a swap or a skip. You aren't charged either way.",
  },
  {
    question: "What if my payment fails?",
    answer:
      "We tell you and give you a link to retry. If it isn't resolved by the cutoff we skip that week. We never silently cancel.",
  },
  {
    question: "What if the route changes?",
    answer: "We tell you before the cutoff, with the new time.",
  },
];

/**
 * The Standing Order — the weekly bread, pitched as a product with its own
 * price, cadence and exits.
 *
 * The reassurance sits high on purpose: a subscription to a weekly run has to
 * be trivially escapable or nobody starts one (§12.18). Skip, pause and cancel
 * are stated before the price, never behind a retention flow, and never in
 * danger red — skipping a week is not a destructive act.
 *
 * It is never pitched on a first visit; this page is the destination, and the
 * order-#2 confirmation is the invitation.
 */
export default function StandingOrderPage() {
  const subscription = getSubscription();
  const priceIsEstimate =
    isTbc(TBC.subscriptionPrices) || /^est/i.test(subscription.plan.priceConfidence);
  const messages = subscription.weeklyMessages ?? [];

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: SUBSCRIPTION_NAME, path: PATH }]} />

      <Section surface="paper-50" className="overflow-hidden">
        <LineArtBleed glyph="loaf" side="right" size={680} />
        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Kicker>{SUBSCRIPTION_NAME}</Kicker>
            <h1 className="mt-4 max-w-[14ch] font-display text-display-xl text-ink-800">
              Bread, standing. Every Saturday.
            </h1>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">
              Put your loaf on the van&rsquo;s list and stop thinking about it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href="/account/subscription/setup"
                size="lg"
                icon={<Repeat size={20} strokeWidth={1.5} />}
                iconPosition="leading"
              >
                Set up a standing order
              </ButtonLink>
              <ButtonLink href="/shop" variant="secondary" size="lg">
                See this week&rsquo;s bake
              </ButtonLink>
            </div>
            <p className="mt-4 text-body-sm text-ink-500">
              You put your number in inside the builder, not before it.
            </p>
          </div>

          {/* The objection, answered above the fold rather than buried. */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-paper-300 bg-paper-0 p-6">
              <h2 className="text-title font-sans font-semibold text-ink-800">
                Getting out is one tap
              </h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Skip any week",
                  "Pause anytime",
                  "Cancel in one tap",
                  "We message you every Wednesday with what's coming",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <Check
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-success"
                    />
                    <span className="text-body-sm text-ink-600">{line}</span>
                  </li>
                ))}
              </ul>
              <p className="micro mt-6 text-ink-500">
                ORDERS CLOSE {COMMERCE.cutoffLabel.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <TwoProducts className="relative mt-16" />
      </Section>

      <Section surface="paper-100">
        <SectionHeader
          as="h2"
          kicker="Four steps"
          heading="How it works"
          lead="Nothing here happens without a message first."
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, i) => (
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
        <SectionHeader
          as="h2"
          kicker="Price"
          heading="What it costs"
          lead="The per-delivery price, the standing price, and what you actually save in rupees."
        />

        {/* No "most popular" claim — there is no data behind one (DECISIONS
            §10). "Start here" is a recommendation we can stand behind: the
            single loaf is the smaller commitment. */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {PLANS.map((plan, index) => (
            <SubscriptionPlanCard
              key={plan.id}
              planName={plan.name}
              cadence={plan.cadence}
              price={plan.weeklyPrice}
              benefits={[...plan.benefits]}
              state={index === 0 ? "recommended" : "default"}
              badge={index === 0 ? "Start here" : undefined}
              priceNote={
                priceIsEstimate
                  ? `Estimate — derived from retail, not founder-set. ${formatINR(
                      plan.listPrice,
                    )} per delivery, so you save ${plan.saving}.`
                  : undefined
              }
              action={
                <ButtonLink href="/account/subscription/setup" size="md" fullWidth>
                  Set up a standing order
                </ButtonLink>
              }
            />
          ))}
        </div>

        <div className="mt-10 max-w-[var(--max-narrow)]">
          <table className="w-full border-y border-y-paper-300 text-left">
            <caption className="sr-only">
              Per-delivery price against the standing-order price
            </caption>
            <thead>
              <tr className="border-b border-b-paper-300">
                <th scope="col" className="micro py-3 pr-4 font-normal text-ink-500">
                  Plan
                </th>
                <th scope="col" className="micro py-3 pr-4 font-normal text-ink-500">
                  Per delivery
                </th>
                <th scope="col" className="micro py-3 pr-4 font-normal text-ink-500">
                  Standing order
                </th>
                <th scope="col" className="micro py-3 font-normal text-ink-500">
                  You save
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-300">
              {PLANS.map((plan) => (
                <tr key={plan.id}>
                  <th scope="row" className="py-4 pr-4 text-body-sm font-semibold text-ink-800">
                    {plan.name}
                  </th>
                  <td className="py-4 pr-4 font-mono text-body-sm text-ink-600 tabular">
                    {formatINR(plan.listPrice)}
                  </td>
                  <td className="py-4 pr-4 font-mono text-body-sm text-ink-800 tabular">
                    {formatINR(plan.weeklyPrice)}
                    <span className="text-ink-500"> / week</span>
                  </td>
                  <td className="py-4 font-mono text-body-sm text-kiln tabular">
                    {plan.saving}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TbcNote className="mt-4">
            Both prices are our design, derived from live retail prices. The
            founders set the final numbers.
          </TbcNote>
        </div>
      </Section>

      <Section surface="paper-100">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 className="micro text-kiln">What&rsquo;s included</h2>
            <p className="mt-6 max-w-[62ch] text-body-lg text-ink-600">
              Your items, every run day, at your stop or your door. Coins on
              every delivery. First refusal on new bakes.
            </p>
          </div>
          <div className="lg:col-span-6">
            <h2 className="micro text-kiln">What you can change</h2>
            <ul className="mt-6 divide-y divide-paper-300 border-y border-y-paper-300">
              {[
                "What's in it",
                "Which day",
                "How often — weekly or fortnightly",
                "Your stop or address",
                "Skip a week",
                "Pause",
                "Cancel",
              ].map((line) => (
                <li key={line} className="py-3 text-body-sm text-ink-600">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* The weekly message loop — the whole product, really. */}
      <Section surface="dark" size="lg">
        <Kicker tone="crumb">The week</Kicker>
        <h2 className="mt-4 max-w-[18ch] font-display text-display-lg text-paper-0">
          Four messages, and one of them has a skip button
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {messages.map((message) => (
            <li
              key={message.when}
              className="border-t border-t-[var(--hairline-dark-color)] pt-5"
            >
              <span className="micro text-crumb">{message.when}</span>
              {message.template ? (
                <>
                  <p className="mt-3 flex items-start gap-2 text-body text-paper-0">
                    <MessageCircle
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="mt-1.5 shrink-0 text-crumb"
                    />
                    <span>{message.template}</span>
                  </p>
                  {message.buttons ? (
                    <p className="mt-3 flex flex-wrap gap-2">
                      {message.buttons.map((button) => (
                        <span
                          key={button}
                          className="nano inline-flex h-7 items-center rounded-sm border border-[var(--hairline-dark-color)] px-3 text-paper-0"
                        >
                          {button}
                        </span>
                      ))}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-3 text-body text-ink-400">{message.note}</p>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeader as="h2" kicker="No retention flow" heading="Skip, pause, stop" />
            <ul className="mt-8 space-y-6">
              <li className="flex items-start gap-3">
                <SkipForward
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-ink-600"
                />
                <span>
                  <span className="block text-body font-semibold text-ink-800">
                    Skip this week
                  </span>
                  <span className="mt-1 block text-body-sm text-ink-600">
                    {String(subscription.actions.skipCopy)}
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Pause
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-ink-600"
                />
                <span>
                  <span className="block text-body font-semibold text-ink-800">Pause</span>
                  <span className="mt-1 block text-body-sm text-ink-600">
                    Two weeks, a month, or until you say. No interstitial, no
                    discount offer, one screen.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Calendar
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-ink-600"
                />
                <span>
                  <span className="block text-body font-semibold text-ink-800">Cancel</span>
                  <span className="mt-1 block text-body-sm text-ink-600">
                    {String(subscription.actions.cancelCopy)}
                  </span>
                </span>
              </li>
            </ul>
            <p className="micro mt-8 text-warning">
              CHANGES FOR THIS SATURDAY CLOSE THURSDAY 8PM
            </p>
          </div>

          <div className="lg:col-span-7">
            <SectionHeader as="h2" kicker="Questions" heading="Before you start" />
            <Faq className="mt-8" items={FAQ_ITEMS} />
          </div>
        </div>
      </Section>

      <Section surface="paper-100">
        <div className="flex flex-col items-start gap-6">
          <h2 className="max-w-[18ch] font-display text-display-md text-ink-800">
            Put one loaf on the list and see how it goes
          </h2>
          <p className="max-w-[62ch] text-body text-ink-600">
            Nothing is charged until the cutoff, and the first Wednesday message
            has a skip button in it.
          </p>
          <ButtonLink
            href="/account/subscription/setup"
            size="lg"
            icon={<Repeat size={20} strokeWidth={1.5} />}
            iconPosition="leading"
          >
            Set up a standing order
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
