import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { InkArt, type InkArtName } from "@/components/ui/InkArt";
import { PageHeader } from "@/components/blocks/PageHeader";
import {
  ContentSection,
  SectionHead,
  Eyebrow,
} from "@/components/pages/content/PageShell";
import { SITE } from "@/lib/config";

const PATH = "/about";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Our story — PAGES-v2 "Our Story".
 *
 * A split hero, the founders in one paragraph, three sketched steps, a photo
 * band, why eggless in two sentences, and the menu. Nothing about hydration
 * percentages: the craft claim is made by the pictures and the steps, not by
 * a spec sheet.
 */

/**
 * The three steps, each carrying one of the commissioned line drawings from
 * /images/lineart on a well. They sit at a higher opacity than a background
 * mark because here the drawing IS the content of the slot, not atmosphere
 * behind text.
 */
const STEPS: { n: string; title: string; body: string; art: InkArtName }[] = [
  {
    n: "01",
    title: "Mix and rest",
    body: "A wet dough, mixed in small batches and left cool overnight. Time is what replaces the egg.",
    art: "rolling-pin-and-flour-bag",
  },
  {
    n: "02",
    title: "Shape by hand",
    body: "Every loaf and every bun is rolled by hand. A dough this soft does not behave in a machine.",
    art: "anpan-bun",
  },
  {
    n: "03",
    title: "Bake at dawn, then drive",
    body: "The ovens go on at four. By the time the van leaves, everything on board was made this morning.",
    art: "oven-with-loaves",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Our story", path: PATH }]} />

      {/* ---- Hero: photo left, the line right ------------------------- */}
      <PageHeader
        script="Since December 2025."
        title="Baked the Japanese way, without a single egg."
        italic
        art="rolling-pin-and-flour-bag"
        artSize="lg"
      />

      <ContentSection surface="paper" size="none" className="pb-[var(--section-y)]">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
              <Image
                src="/images/stock/lifestyle/hands-holding-loaf-linen-table.jpg"
                alt="Hands lifting a loaf off a linen-covered table"
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover object-[50%_48%]"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="max-w-[52ch] text-body-lg text-ink-2">
              {SITE.founders[0]} and {SITE.founders[1]} started Fillo in
              Bengaluru with one loaf and one route. Most of us remember a
              neighbourhood that smelled of bread in the evening, and that
              routine disappeared into supermarket shelves. So the bakery moves
              instead. More than 300 first-time tasters worked through the menu
              before the van ran a single street, and they are the reason the
              shokupan is soft without an egg in it.
            </p>
            <ButtonLink href="/shop" className="mt-8">
              See the menu
            </ButtonLink>
          </div>
        </div>
      </ContentSection>

      {/* ---- Three sketched steps -------------------------------------- */}
      <ContentSection surface="paper-2">
        <SectionHead eyebrow="How we bake" heading="Three things, done slowly." />
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map(({ n, title, body, art }) => (
            <li key={n}>
              <div
                data-surface="well"
                className="relative grid aspect-[3/2] w-full place-items-center overflow-hidden rounded-lg bg-well"
              >
                <InkArt
                  name={art}
                  width={230}
                  opacity={0.7}
                  hideOnPhone={false}
                  className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <p className="mt-6 text-body-sm text-muted tabular">{n}</p>
              <h3 className="mt-1 font-display text-[24px] leading-tight text-ink">
                {title}
              </h3>
              <p className="mt-3 max-w-[36ch] text-body text-ink-2">{body}</p>
            </li>
          ))}
        </ol>
      </ContentSection>

      {/* ---- The photo band -------------------------------------------- */}
      <section className="relative">
        <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
          <Image
            src="/images/stock/dark-bands/breads-in-oven-warm-glow.jpg"
            alt="Loaves in the oven under a warm glow"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ---- Why eggless ------------------------------------------------ */}
      {/* No line art here: the three drawings above are this page's allowance,
          and there is no clear ground in this section that is not under text. */}
      <ContentSection surface="peach">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>Why eggless</Eyebrow>
            <h2 className="mt-3 max-w-[14ch] font-display text-h2 text-ink italic">
              Not what we left out.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-[54ch] text-body-lg text-ink-2">
              Egg is usually what gives a milk bread its softness, so taking it
              out means finding that softness somewhere else. Ours comes from a
              wetter dough, a longer and cooler ferment, and hands instead of a
              machine.
            </p>
            <p className="mt-5 max-w-[54ch] text-body-lg text-ink-2">
              All 23 bakes are eggless. Not a range, not a line, all of it.
            </p>
          </div>
        </div>
      </ContentSection>

      {/* ---- The close --------------------------------------------------- */}
      <ContentSection surface="paper">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[16ch] text-h2 text-ink">
            The rest of it is in the bread.
          </h2>
          <ButtonLink href="/shop" size="lg">
            See the menu
          </ButtonLink>
        </div>
        <p className="mt-10 max-w-[58ch] border-t border-line pt-6 text-body-sm text-muted">
          Fillo Bakes is operated by {SITE.legalName}, registered in{" "}
          {SITE.city}, {SITE.state}.
        </p>
      </ContentSection>
    </>
  );
}
