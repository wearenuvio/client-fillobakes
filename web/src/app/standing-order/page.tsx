import type { Metadata } from "next";
import { CalendarOff, PauseCircle, RefreshCw, Unlock } from "lucide-react";
import { PageHeader } from "@/components/blocks/PageHeader";
import { buildMetadata, JsonLd, faqLd } from "@/lib/seo";
import { SubscriptionPlanCard } from "@/components/blocks/SubscriptionPlanCard";
import { Faq } from "@/components/blocks/Faq";
import { ButtonLink } from "@/components/ui/Button";
import { AnPanGlyph, VanGlyph, WheatGlyph } from "@/components/ui/LineArt";
import { cutoutVariants, cutoutFor } from "@/lib/images";
import { SUBSCRIPTION_NAME } from "@/lib/config";

const PATH = "/standing-order";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * The Standing Order — PAGES-v2 "Standing Order".
 *
 * A weekly commitment is only ever sold on how easily it is escaped, so the
 * promises row sits directly under the plans rather than in the small print,
 * and the four things a subscriber is most afraid of are answered before the
 * FAQ has to be opened.
 *
 * Three plans, one recommendation, one button at the bottom. Choosing between
 * three is a decision; choosing between seven is a task somebody postpones.
 */

const PLANS = [
  {
    id: "loaf",
    name: "The Loaf",
    cadence: "One shokupan, every week.",
    price: 200,
    contents: ["milk-shokupan"],
    benefits: [
      "One 400g milk shokupan, baked the morning it reaches you",
      "Your route's run day, every week",
      "Swap the loaf for any other bread whenever you like",
    ],
  },
  {
    id: "loaf-and-buns",
    name: "Loaf and buns",
    cadence: "A loaf, and something sweet.",
    price: 499,
    contents: ["milk-shokupan", "custard-an-pan", "strawberry-an-pan"],
    benefits: [
      "One milk shokupan and two an pan of your choosing",
      "Change what is inside up to the night before",
      "Free delivery every week, whatever the basket comes to",
    ],
  },
  {
    id: "family",
    name: "The Family",
    cadence: "Enough for a full week.",
    price: 899,
    contents: ["milk-shokupan", "custard-an-pan", "fruit-sando"],
    benefits: [
      "Two loaves, four buns and one fruit sando",
      "Split the delivery across two days if you would rather",
      "Free delivery, and first refusal on the weekly specials",
    ],
  },
] as const;

const STEPS = [
  {
    glyph: AnPanGlyph,
    title: "Choose your bread",
    body: "Start from a plan, then swap anything in it for something you like better.",
  },
  {
    glyph: VanGlyph,
    title: "Choose your day and stop",
    body: "Your route's run day, to your door or to the van at a stop near you.",
  },
  {
    glyph: WheatGlyph,
    title: "We bake it fresh, every week",
    body: "Nothing is baked ahead. Your loaf goes in the oven the morning it reaches you.",
  },
] as const;

const PROMISES = [
  { icon: CalendarOff, label: "Skip any week" },
  { icon: PauseCircle, label: "Pause any time" },
  { icon: RefreshCw, label: "Change what's inside" },
  { icon: Unlock, label: "No lock-in" },
] as const;

const FAQ = [
  {
    question: "What if I am away for a week?",
    answer:
      "Skip it. One tap on your plan card up to 8pm the evening before, and you are not charged for that week.",
  },
  {
    question: "Can I change what is in the box?",
    answer:
      "Yes, every week if you want to. Open your plan, swap a bun for another one, and the price updates before you confirm.",
  },
  {
    question: "When do you take the money?",
    answer:
      "The evening before each delivery, once the order is locked. There is no upfront payment and nothing is taken for a week you have skipped.",
  },
  {
    question: "How do I stop?",
    answer:
      "Cancel from your plan card. It takes one tap, there is no notice period, and we will offer you a pause first in case that is really what you meant.",
  },
] as const;

function contentsFor(slugs: readonly string[]) {
  return slugs.map((slug) => ({
    slug,
    name: slug,
    src: cutoutVariants(slug).v1 ?? cutoutFor(slug),
  }));
}

export default function StandingOrderPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: SUBSCRIPTION_NAME, path: PATH }]}
        nodes={[faqLd(FAQ.map((f) => ({ question: f.question, answer: f.answer })))]}
      />

      {/* -------- Hero ------------------------------------------------- */}
      <PageHeader
        script="Your bread, every week."
        title="The Standing Order"
        lede="Pick a plan, pick a day. Skip any week, pause any time."
        art="shokupan-loaf-v2"
        artSize="lg"
      />

      {/* -------- Plans ------------------------------------------------ */}
      <section className="bg-paper py-[var(--section-y)]">
        <div className="container-content">
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {PLANS.map((plan, i) => (
              <SubscriptionPlanCard
                key={plan.id}
                planName={plan.name}
                cadence={plan.cadence}
                price={plan.price}
                contents={contentsFor(plan.contents)}
                benefits={[...plan.benefits]}
                state={i === 1 ? "recommended" : "default"}
                badge={i === 1 ? "Start here" : undefined}
                action={
                  <ButtonLink
                    href={`/account/subscription/setup?plan=${plan.id}`}
                    variant="secondary"
                    size="md"
                    fullWidth
                  >
                    Choose {plan.name}
                  </ButtonLink>
                }
              />
            ))}
          </div>

          {/* -------- Promises, right under the price ------------------- */}
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-line bg-paper-2 px-6 py-6 lg:grid-cols-4 lg:px-8">
            {PROMISES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3">
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-accent"
                />
                <span className="text-body-sm leading-snug text-ink-2">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------- How it works ----------------------------------------- */}
      <section
        data-reveal
        className="border-y border-line bg-paper-2 py-[var(--section-y)]"
      >
        <div className="container-content">
          <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
            How it works
          </p>
          <h2 className="mt-3 max-w-[18ch] text-h2 text-ink">
            Three decisions, once.
          </h2>

          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map(({ glyph: Glyph, title, body }, i) => (
              <li key={title}>
                <span className="grid size-20 place-items-center rounded-pill border border-line bg-card">
                  <Glyph size={50} strokeWidth={1.5} className="text-accent" />
                </span>
                <p className="mt-5 text-[12px] font-medium tracking-[0.12em] text-muted uppercase tabular">
                  Step {i + 1}
                </p>
                <h3 className="mt-1.5 font-display text-[24px] leading-tight text-ink">
                  {title}
                </h3>
                <p className="mt-2 max-w-[36ch] text-body-sm text-ink-2">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------- FAQ --------------------------------------------------- */}
      <section data-reveal className="bg-paper py-[var(--section-y)]">
        <div className="container-content">
          <h2 className="max-w-[18ch] text-h2 text-ink">
            The four things people ask.
          </h2>
          <Faq className="mt-8" items={FAQ.map((f) => ({ ...f }))} />
        </div>
      </section>

      {/* -------- One way out of the page ------------------------------ */}
      <section className="bg-peach py-[var(--section-y)]">
        <div className="container-content">
          <h2 className="max-w-[16ch] text-h2 text-ink">
            Start with one loaf. Change it whenever.
          </h2>
          <ButtonLink
            href="/account/subscription/setup?plan=loaf"
            size="lg"
            className="mt-8"
          >
            Start with The Loaf
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
