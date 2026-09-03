import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/blocks/PageHeader";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import {
  ContentSection,
  SectionHead,
} from "@/components/pages/content/PageShell";
import { JOURNAL_BODIES } from "@/components/pages/content/journal-bodies";
import { GUIDE_BODIES } from "@/components/pages/content/guide-bodies";
import { getGuides, getJournalPosts } from "@/lib/content";
import { formatLongDate } from "@/lib/format";

const PATH = "/journal";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * From the van — PAGES-v2 Journal.
 *
 * Photo cards: title, one line, date. A piece that has not been written
 * carries a "Coming soon" tag and no body — the old site's 23 auto-generated
 * stubs were the reason this section exists at all.
 */
export default function JournalIndexPage() {
  const posts = getJournalPosts();
  const guides = getGuides();

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Journal", path: PATH }]} />

      <PageHeader
        script="From the van."
        title="The journal"
        lede="Notes on bread, the route, and what did not rise. One post a fortnight."
        art="sparrow-branch"
        artSize="lg"
      />

      <ContentSection surface="paper" size="half">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const body = JOURNAL_BODIES[post.slug];
            const soon = !body?.published;
            return (
              <li key={post.slug}>
                <Link
                  href={post.path}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-card transition-[box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-well">
                    {body?.image ? (
                      <Image
                        src={body.image.src}
                        alt=""
                        fill
                        priority={index < 2}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        style={{ objectPosition: body.image.focus ?? "50% 60%" }}
                        className={
                          soon
                            ? "object-cover opacity-70 grayscale-[.5]"
                            : "object-cover transition-transform duration-[var(--dur-base)] group-hover:scale-105 motion-reduce:transform-none"
                        }
                      />
                    ) : null}
                    {soon ? (
                      <span className="absolute top-3 left-3">
                        <Badge variant="outline">Coming soon</Badge>
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-[24px] leading-tight text-ink">
                      {post.h1}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-body-sm text-ink-2">
                      {body?.standfirst ?? post.description}
                    </p>
                    {body?.published ? (
                      <p className="mt-5 text-body-sm text-muted tabular">
                        {formatLongDate(body.published)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </ContentSection>

      <ContentSection surface="paper-2">
        <SectionHead
          eyebrow="Guides"
          heading="And the ones we keep up to date."
          lead="Four definition pages rather than posts. A guide is corrected when we learn something; a dated post stands as written."
          link={{ href: "/guides", label: "All four guides" }}
        />
        <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.slug} className="border-t border-line">
              <Link
                href={guide.path}
                className="group flex min-h-14 items-center justify-between gap-6 py-4"
              >
                <span className="font-display text-[20px] leading-snug text-ink">
                  {guide.h1}
                </span>
                {GUIDE_BODIES[guide.slug]?.state === "part-published" ? (
                  <Badge variant="outline" className="shrink-0">
                    In progress
                  </Badge>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection surface="peach" size="half">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-[20ch] text-h2 text-ink">
            The bread is better than the writing.
          </h2>
          <ButtonLink href="/shop" className="shrink-0">
            See the menu
          </ButtonLink>
        </div>
      </ContentSection>
    </>
  );
}
