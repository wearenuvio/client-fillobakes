import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { AnPanGlyph, LoafGlyph, WheatGlyph } from "@/components/ui/LineArt";
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
 * The three steps. `Glyph` is the placeholder that holds the slot until the
 * commissioned hand-drawn line art lands in /images/lineart — the drawing
 * drops into the same square with no layout change.
 */
const STEPS = [
  {
    n: "01",
    title: "Mix and rest",
    body: "A wet dough, mixed in small batches and left cool overnight. Time is what replaces the egg.",
    Glyph: WheatGlyph,
  },
  {
    n: "02",
    title: "Shape by hand",
    body: "Every loaf and every bun is rolled by hand. A dough this soft does not behave in a machine.",
    Glyph: AnPanGlyph,
  },
  {
    n: "03",
    title: "Bake at dawn, then drive",
    body: "The ovens go on at four. By the time the van leaves, everything on board was made this morning.",
    Glyph: LoafGlyph,
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Our story", path: PATH }]} />

      {/* ---- Hero: photo left, the line right ------------------------- */}
      <ContentSection surface="paper" size="none" className="pt-8 pb-[var(--section-y)] lg:pt-12">
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
            <p className="script">Since December 2025.</p>
            <h1 className="mt-3 max-w-[15ch] font-display text-display-2 text-ink italic">
              Baked the Japanese way, without a single egg.
            </h1>
            <p className="mt-6 max-w-[52ch] text-body-lg text-ink-2">
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
          {STEPS.map(({ n, title, body, Glyph }) => (
            <li key={n}>
              {/* Line-art slot. A delivered drawing replaces the glyph. */}
              <div
                data-surface="well"
                className="grid aspect-[3/2] w-full place-items-center rounded-lg bg-well"
              >
                <Glyph
                  size={148}
                  strokeWidth={1.25}
                  className="text-muted opacity-75"
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
