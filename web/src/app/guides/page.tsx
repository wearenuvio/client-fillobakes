import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { Kicker } from "@/components/ui/Rule";
import { RuleHeading } from "@/components/pages/content/RuleHeading";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { LineArtBleed } from "@/components/ui/LineArt";
import { Lead } from "@/components/pages/content/Prose";
import { GUIDE_BODIES } from "@/components/pages/content/guide-bodies";
import { getGuides } from "@/lib/content";

const PATH = "/guides";

export const metadata: Metadata = buildMetadata(PATH, {
  title: "Guides — shokupan, anpan, karepan explained | Fillo Bakes",
  description:
    "Four evergreen guides to the Japanese breads we bake: what shokupan is, what an anpan is, what a karepan is, and how to keep a milk loaf.",
});

/**
 * The guides index — site-content.md, Section: Guides.
 *
 * Four evergreen definition pages. They are separate from the journal on
 * purpose: a guide is undated and maintained, a journal post is dated and
 * never updated. The index says which is which rather than assuming anyone
 * knows.
 */
export default function GuidesIndexPage() {
  const guides = getGuides();

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Guides", path: PATH }]} />

      <Section surface="paper-50" size="none" className="overflow-hidden pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
        <LineArtBleed glyph="wheat" side="right" size={600} />
        <div className="relative max-w-[var(--max-narrow)]">
          <Kicker>Guides</Kicker>
          <h1 className="mt-4 text-display-lg text-ink-800">
            What the words mean
          </h1>
          <Lead className="mt-6">
            Four pages that explain the formats we bake. Undated, kept up to
            date, and linked from every product they describe.
          </Lead>
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <RuleHeading trailing={`${guides.length}`}>The four</RuleHeading>
        <ul className="mt-2">
          {guides.map((guide) => {
            const body = GUIDE_BODIES[guide.slug];
            return (
              <li key={guide.slug} className="border-b border-b-paper-300">
                <Link
                  href={guide.path}
                  className="group grid gap-4 py-8 lg:grid-cols-12 lg:gap-12"
                >
                  <div className="lg:col-span-4">
                    <h3 className="text-display-sm text-ink-800 transition-colors duration-[var(--dur-fast)] group-hover:text-ink-900">
                      {guide.h1}
                    </h3>
                  </div>
                  <div className="lg:col-span-6">
                    <p className="max-w-[52ch] text-body text-ink-600">
                      {body?.standfirst ?? guide.description}
                    </p>
                    {body?.state === "part-published" ? (
                      <Badge variant="warning" className="mt-4">
                        Part-published
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex items-start lg:col-span-2 lg:justify-end">
                    <span className="micro inline-flex items-center gap-2 text-kiln">
                      Read
                      <ArrowRight
                        size={16}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section surface="paper-100" size="half">
        <div className="max-w-[var(--max-narrow)]">
          <h2 className="text-display-sm text-ink-800">
            Looking for the dated stuff?
          </h2>
          <p className="mt-3 max-w-[46ch] text-body text-ink-600">
            The journal is where the route, the failures and the timestamps
            live. A guide is maintained; a journal post stands as written.
          </p>
          <ButtonLink href="/journal" variant="secondary" className="mt-6">
            From the van
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
