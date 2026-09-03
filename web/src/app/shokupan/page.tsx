import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, EggOff, Leaf } from "lucide-react";
import { buildMetadata, JsonLd, faqLd, bakeryLd } from "@/lib/seo";
import { Stamp } from "@/components/ui/Stamp";
import { InkArt } from "@/components/ui/InkArt";
import { Faq } from "@/components/blocks/Faq";
import { ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { Prose } from "@/components/pages/content/Prose";
import { CutoutWell } from "@/components/pages/content/CutoutWell";
import { RelatedProducts } from "@/components/pages/content/RelatedProducts";
import {
  ContentSection,
  SectionHead,
  Eyebrow,
} from "@/components/pages/content/PageShell";
import { SHOKUPAN_FAQ } from "@/components/pages/content/faq-items";
import { getProductsByCategory, getProductBySlug } from "@/lib/catalog";
import { COMMERCE } from "@/lib/config";

const PATH = "/shokupan";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * /shokupan — the one page on the old site that ranks, and the only entry in
 * the redirect map with `to: null`. It keeps its path.
 *
 * It is the commercial landing page: what shokupan is in two paragraphs, the
 * loaves you can actually buy, how you get one, and four questions. The
 * editorial companion is /guides/what-is-shokupan — two intents, two pages,
 * cross-linked, no cannibalisation.
 */

const FACTS = [
  { icon: EggOff, label: "Eggless" },
  { icon: Leaf, label: "Vegetarian" },
  { icon: CalendarCheck, label: "Baked daily" },
] as const;

export default function ShokupanPage() {
  const breads = getProductsByCategory("breads");
  const signature = getProductBySlug("milk-shokupan");

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

      {/* ---- Hero: the line left, the cutout on a well right ---------- */}
      <ContentSection surface="paper" size="none" className="pt-8 pb-[var(--section-y)] lg:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="script">Japan&rsquo;s everyday loaf.</p>
            <h1 className="mt-3 max-w-[13ch] text-display-1 text-ink">
              Shokupan, baked eggless in Bengaluru.
            </h1>
            <p className="mt-6 max-w-[50ch] text-body-lg text-ink-2">
              A fine, even crumb, a thin crust, and slices that pull apart in
              soft sheets. Brought to your street by van.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="/shop" size="lg">
                See the menu
              </ButtonLink>
              <Link
                href="/guides/what-is-shokupan"
                className="link-underline text-body-sm font-semibold text-accent"
              >
                What is shokupan
              </Link>
            </div>

            {signature ? (
              <p className="mt-7 flex items-baseline gap-2 text-body-sm text-muted">
                Milk Shokupan is <Price amount={signature.price} size="sm" /> a
                loaf.
              </p>
            ) : null}

            <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6">
              {FACTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="text-accent"
                  />
                  <span className="text-body-sm text-ink-2">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:col-span-5">
            <CutoutWell
              slug="milk-shokupan"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            {/* Wrapped rather than positioned directly: `Stamp` carries its
                own `relative`, which wins over an `absolute` passed in. */}
            <span className="absolute right-4 bottom-4 lg:right-6 lg:bottom-6">
              <Stamp lines={["baked this", "morning"]} size={80} />
            </span>
          </div>
        </div>
      </ContentSection>

      {/* ---- What it is ------------------------------------------------ */}
      <ContentSection surface="paper-2">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>What it is</Eyebrow>
            <h2 className="mt-3 max-w-[14ch] text-h2 text-ink">
              The loaf you keep in the house.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <Prose>
              <p>
                Shokupan is written 食パン, roughly eating bread. It is the loaf
                a Japanese household keeps on the counter, the way pav or a
                sliced white loaf is the default here. The crumb is fine and
                even, the crust is thin, and a slice holds a shape under butter,
                jam or a sandwich filling without going to pieces.
              </p>
              <p>
                Ours is made without eggs, which is the part that took the
                longest. Egg is usually what gives a milk loaf its softness and
                its structure, so removing it means finding that softness
                somewhere else. We found it in a wetter dough, a longer and
                cooler ferment, and shaping by hand in small batches.
              </p>
              <p>
                <Link href="/guides/what-is-shokupan">
                  The full guide, including where the loaf came from
                </Link>
                .
              </p>
            </Prose>
          </div>
        </div>
      </ContentSection>

      {/* ---- The loaves you can buy ------------------------------------ */}
      <ContentSection surface="paper">
        <RelatedProducts
          slugs={breads.map((b) => b.slug)}
          eyebrow="On the menu"
          heading={`${breads.length} shokupan to choose from.`}
        />
      </ContentSection>

      {/* ---- The dark band: one line, one sentence, two doors ---------- */}
      <section
        data-surface="dark"
        className="relative overflow-hidden bg-choc py-[var(--section-y-lg)]"
      >
        <InkArt
          name="bakery-van"
          tone="light"
          width={480}
          opacity={0.16}
          className="top-1/2 -right-20 -translate-y-1/2"
        />
        <div className="relative container-content">
          <div className="max-w-[24ch]">
            <h2 className="text-display-2 text-on-choc">
              Order by 8pm. At your door tomorrow.
            </h2>
          </div>
          <p className="mt-6 max-w-[52ch] text-body-lg text-on-choc-2">
            Meet the van at a stop and pay nothing for delivery, or have it
            brought to your door in a two-hour window for ₹
            <span className="tabular">{COMMERCE.deliveryFee}</span>.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/van" variant="onPhotoPrimary" size="lg">
              Track the van
            </ButtonLink>
            <ButtonLink href="/areas" variant="onPhotoSecondary" size="lg">
              Where we deliver
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ---- Four questions -------------------------------------------- */}
      <ContentSection surface="paper">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="Questions" heading="The four we get asked." />
            <ButtonLink href="/faq" variant="secondary" className="mt-7">
              Read them all
            </ButtonLink>
          </div>
          <div className="lg:col-span-8">
            <Faq
              measure="full"
              items={SHOKUPAN_FAQ.map((item) => ({
                question: item.question,
                answer: (
                  <>
                    <p>{item.answer}</p>
                    {item.link ? (
                      <p className="mt-4">
                        <Link href={item.link.href}>{item.link.label}</Link>
                      </p>
                    ) : null}
                  </>
                ),
              }))}
            />
          </div>
        </div>
      </ContentSection>
    </>
  );
}
