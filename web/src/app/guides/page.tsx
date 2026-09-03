import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/blocks/PageHeader";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ContentSection } from "@/components/pages/content/PageShell";
import { GUIDE_BODIES } from "@/components/pages/content/guide-bodies";
import { getGuides } from "@/lib/content";

const PATH = "/guides";

export const metadata: Metadata = buildMetadata(PATH, {
  title: "Guides — shokupan, anpan, karepan explained | Fillo Bakes",
  description:
    "Four evergreen guides to the Japanese breads we bake: what shokupan is, what an anpan is, what a karepan is, and how to keep a milk loaf.",
});

/**
 * The guides index — PAGES-v2 Journal / Guides.
 *
 * The same card as the journal, so the two sections read as one library. A
 * guide is undated and maintained; the journal is dated and stands as
 * written, and the index says which is which rather than assuming anyone
 * knows.
 */
export default function GuidesIndexPage() {
  const guides = getGuides();

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Guides", path: PATH }]} />

      <PageHeader
        script="What the words mean."
        title="Guides"
        lede="Four pages that explain the formats we bake. Undated, kept up to date, and linked from every product they describe."
        art="sparrow-branch"
        artSize="lg"
      />

      <ContentSection surface="paper" size="half">
        <ul className="grid gap-6 sm:grid-cols-2">
          {guides.map((guide, index) => {
            const body = GUIDE_BODIES[guide.slug];
            const partial = body?.state === "part-published";
            return (
              <li key={guide.slug}>
                <Link
                  href={guide.path}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-card transition-[box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-well">
                    {body?.image ? (
                      <Image
                        src={body.image.src}
                        alt=""
                        fill
                        priority={index < 2}
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[var(--dur-base)] group-hover:scale-105 motion-reduce:transform-none"
                      />
                    ) : null}
                    {partial ? (
                      <span className="absolute top-3 left-3">
                        <Badge variant="outline">In progress</Badge>
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-[24px] leading-tight text-ink">
                      {guide.h1}
                    </h2>
                    <p className="mt-3 text-body-sm text-ink-2">
                      {body?.standfirst ?? guide.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </ContentSection>

      <ContentSection surface="paper-2" size="half">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="max-w-[20ch] text-h2 text-ink">
              Looking for the dated stuff?
            </h2>
            <p className="mt-3 max-w-[46ch] text-body-lg text-ink-2">
              The journal is where the route, the failures and the timestamps
              live.
            </p>
          </div>
          <ButtonLink href="/journal" variant="secondary" className="shrink-0">
            From the van
          </ButtonLink>
        </div>
      </ContentSection>
    </>
  );
}
