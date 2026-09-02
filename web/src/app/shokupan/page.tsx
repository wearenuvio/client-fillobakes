import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, JsonLd, faqLd, bakeryLd } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { Rule, Kicker } from "@/components/ui/Rule";
import { RingSeal } from "@/components/ui/Stamp";
import { Faq } from "@/components/blocks/Faq";
import { ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { ProofBlock } from "@/components/blocks/ProofBlock";
import { Prose, Lead, Footnote } from "@/components/pages/content/Prose";
import { CutoutWell } from "@/components/pages/content/CutoutWell";
import { RelatedProducts } from "@/components/pages/content/RelatedProducts";
import { SHOKUPAN_FAQ } from "@/components/pages/content/faq-items";
import { getProducts, getProductsByCategory, getProductBySlug } from "@/lib/catalog";
import { COMMERCE } from "@/lib/config";

const PATH = "/shokupan";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * /shokupan — the one page on the old site that ranks, and the only URL in the
 * redirect map with `to: null`. It keeps its path.
 *
 * It is the commercial landing page: what shokupan is in two paragraphs, the
 * four loaves you can actually buy, how you get one, and four questions. The
 * editorial companion is /guides/what-is-shokupan — two intents, two pages,
 * cross-linked, no cannibalisation.
 */
export default function ShokupanPage() {
  const breads = getProductsByCategory("breads");
  const signature = getProductBySlug("milk-shokupan");
  const itemCount = getProducts().length;

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: "Shokupan", path: PATH }]}
        nodes={[
          bakeryLd(),
          faqLd(SHOKUPAN_FAQ.map(({ question, answer }) => ({ question, answer }))),
        ]}
      />

      {/* Paper hero (§12.3): 7/5, kicker, display headline, lead, buttons,
          proof lockup — no photo behind the type, no gradient. */}
      <Section surface="paper-50" className="overflow-hidden">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Kicker>Japanese milk bread · Bengaluru</Kicker>
            <h1 className="mt-4 text-display-xl text-ink-800">
              Shokupan &mdash; Japanese milk bread
            </h1>
            <Lead className="mt-6">
              Japan&rsquo;s everyday loaf, baked eggless in Bengaluru and
              brought to your street by van. Fine crumb, thin crust, and slices
              that pull apart in soft sheets.
            </Lead>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/shop" size="lg">
                See this week&rsquo;s bake
              </ButtonLink>
              <ButtonLink
                href="/guides/what-is-shokupan"
                variant="secondary"
                size="lg"
              >
                What is shokupan
              </ButtonLink>
            </div>

            {signature ? (
              <p className="mt-8 text-body-sm text-ink-500">
                Milk Shokupan is{" "}
                <Price amount={signature.price} size="sm" /> a loaf, 100%
                eggless, baked the morning of your run.
              </p>
            ) : null}

            <ProofBlock
              className="mt-10 max-w-[52ch]"
              specs={[
                { label: "Egg", value: `ALL ${itemCount} EGGLESS` },
                { label: "Diet", value: "100% VEGETARIAN" },
                { label: "Cutoff", value: "8PM, EVENING BEFORE" },
              ]}
            />
          </div>

          {/* Hero A's right column is the cutout on a well (§12.3, §10.1),
              with the one seal this page gets overlapping its edge. */}
          <div className="relative lg:col-span-5">
            <CutoutWell
              slug="milk-shokupan"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <RingSeal className="absolute -right-6 -bottom-8 hidden lg:block" />
          </div>
        </div>
      </Section>

      {/* What it is — two paragraphs, then the door to the full guide. */}
      <Section surface="paper-100">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Rule label="What it is" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              The loaf you keep in the house
            </h2>
          </div>
          <div className="lg:col-span-8">
            <Prose>
              <p>
                Shokupan is written 食パン &mdash; roughly, eating bread. It is
                the loaf a Japanese household keeps on the counter, the way pav
                or a sliced white loaf is the default here. The crumb is fine
                and even, the crust is thin, and a slice holds a shape under
                butter, jam or a sandwich filling without going to pieces.
              </p>
              <p>
                Ours is made without eggs, which is the part that took the
                longest. Egg is what usually gives a milk loaf its softness and
                its structure, so removing it means finding that softness
                somewhere else. We found it in a wetter dough, a longer and
                cooler fermentation, and shaping by hand in small batches. More
                than 300 first-time tasters worked through the menu before the
                van ran a single route.
              </p>
              <p>
                <Link href="/guides/what-is-shokupan">
                  The full guide, including where the loaf came from
                </Link>
                .
              </p>
            </Prose>
            <Footnote>
              Tear it, don&rsquo;t slice it. That is not a flourish, it is the
              best way to find out whether a loaf is any good.
            </Footnote>
          </div>
        </div>
      </Section>

      {/* The four you can actually buy. */}
      <Section surface="paper-50">
        <RelatedProducts
          slugs={breads.map((b) => b.slug)}
          label="The loaves"
          heading="Four shokupan on the menu"
        />
      </Section>

      {/* How you get one — the certainty sentence, once. */}
      <Section surface="dark" size="lg">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Kicker tone="crumb">How you get one</Kicker>
            <h2 className="mt-4 text-display-lg text-paper-0">
              Two lanes, one cutoff
            </h2>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-400">
              Meet the van at a stop on its run and pay no delivery fee, or have
              it brought to your door in a two-hour window for ₹
              <span className="tabular">{COMMERCE.deliveryFee}</span>. Orders
              for a run close at 8pm the evening before it, because that is when
              the dough goes in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/van" variant="onPhotoPrimary" size="lg">
                Track the van
              </ButtonLink>
              <ButtonLink href="/areas" variant="onPhotoSecondary" size="lg">
                Set your area
              </ButtonLink>
            </div>
          </div>

          <dl className="lg:col-span-6">
            {[
              {
                term: "Catch the van",
                detail:
                  "Pick a stop on your route, turn up in the ten-minute band we give you, and pay nothing for delivery.",
              },
              {
                term: "Home delivery",
                detail: `To your door inside a two-hour window. ₹${COMMERCE.deliveryFee}, free over ₹${COMMERCE.freeDeliveryThreshold} — that threshold is still being confirmed.`,
              },
              {
                term: "Walk up to it",
                detail:
                  "If the van is on your street you do not need an order. What is on board is what is on board.",
              },
            ].map((row) => (
              <div
                key={row.term}
                className="border-t border-t-[var(--hairline-dark-color)] py-6 last:border-b last:border-b-[var(--hairline-dark-color)]"
              >
                <dt className="micro text-crumb">{row.term}</dt>
                <dd className="mt-2 max-w-[52ch] text-body text-ink-400">
                  {row.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Four questions — the same array feeds FAQPage JSON-LD above. */}
      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Rule label="Questions" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              The four we get asked
            </h2>
            <ButtonLink href="/faq" variant="ghost" className="mt-6">
              All fifteen
            </ButtonLink>
          </div>
          <div className="lg:col-span-8">
            <Faq
              items={SHOKUPAN_FAQ.map((item) => ({
                question: item.question,
                answer: (
                  <>
                    <p>{item.answer}</p>
                    {item.link ? (
                      <p className="mt-4">
                        <Link
                          href={item.link.href}
                          className="micro link-underline text-kiln"
                        >
                          {item.link.label}
                        </Link>
                      </p>
                    ) : null}
                  </>
                ),
              }))}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
