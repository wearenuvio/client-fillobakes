import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Kicker, Rule } from "@/components/ui/Rule";
import { ButtonLink } from "@/components/ui/Button";
import { getBoxes, getCutoffCopy } from "@/lib/mock";
import { BoxCard } from "@/components/pages/home/BoxCard";
import { BoxBuilder } from "@/components/pages/home/BoxBuilder";

const PATH = "/boxes";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Boxes — three we have put together, or six you choose.
 *
 * A box is a product. The subscription is the Standing Order, and the two
 * words never overlap on this page or anywhere else (DECISIONS.md §4).
 */
export default function BoxesPage() {
  const boxes = getBoxes().filter((box) => box.type === "curated");

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Boxes", path: "/boxes" }]} />

      <Section surface="paper-50" size="half" className="pt-[var(--section-y)]">
        <Kicker>For the table</Kicker>
        <h1 className="mt-4 max-w-[16ch] text-display-2xl text-ink-800">Boxes</h1>
        <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">
          Three we&rsquo;ve put together, or build your own.
        </p>
        <p className="micro mt-8 border-t border-t-paper-300 pt-4 text-ink-600">
          All vegetarian · All eggless · Baked the morning it goes out
        </p>
      </Section>

      <Section surface="paper-50" size="half">
        <div className="grid gap-6 lg:grid-cols-3">
          {boxes.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
        <p className="micro mt-8 text-ink-500">
          * Box prices are ours, worked back from the single prices. The
          founders set the final numbers before any box goes on a van.
        </p>
      </Section>

      <Section surface="paper-100">
        <SectionHeader
          kicker="Build your own"
          heading="Pick six. Mix anything."
          lead="Slots fill in the order you tap them. Take anything out again before you add the box."
        />
        <div className="mt-10">
          <BoxBuilder />
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <Rule tone="strong" />
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-display-sm text-ink-800">
              Every box rides the same van.
            </h2>
            <p className="mt-2 max-w-[52ch] text-body text-ink-600">
              {getCutoffCopy("open")}. Boxes are packed the morning they go out,
              so what is in the box is what came out of the oven that day.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/shop/all" variant="secondary" size="md">
              See everything we bake
            </ButtonLink>
            <ButtonLink href="/gifting" variant="ghost" size="md">
              Send one as a gift →
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
