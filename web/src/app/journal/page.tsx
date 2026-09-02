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
import { JOURNAL_BODIES } from "@/components/pages/content/journal-bodies";
import { GUIDE_BODIES } from "@/components/pages/content/guide-bodies";
import { getGuides, getJournalPosts } from "@/lib/content";
import { formatLongDate } from "@/lib/format";

const PATH = "/journal";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * From the van — site-content.md, Section: Journal.
 *
 * The old blog was 23 auto-generated stubs titled "Discover [product]", each
 * repeating the shop description word for word, with every Read More pointing
 * at /blogpage/undefined. All 23 are gone; /blogpage 301s here.
 *
 * The index lists the eight commissioned pieces exactly as the content spec
 * numbers them: four dated posts here, four undated guides in /guides. A
 * post that has not been written says so — the state is copy, not a comment.
 */
export default function JournalIndexPage() {
  const posts = getJournalPosts();
  const guides = getGuides();
  const published = posts.filter((p) => JOURNAL_BODIES[p.slug]?.published);

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Journal", path: PATH }]} />

      <Section surface="paper-50" size="none" className="overflow-hidden pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
        <LineArtBleed glyph="van" side="right" size={640} />
        <div className="relative max-w-[var(--max-narrow)]">
          <Kicker>Journal</Kicker>
          <h1 className="mt-4 text-display-lg text-ink-800">From the van</h1>
          <Lead className="mt-6">
            Notes on bread, the route, and what didn&rsquo;t rise. One post a
            fortnight, 250 to 700 words, no listicles.
          </Lead>
          <p className="micro mt-8 text-ink-500">
            <span className="tabular">{published.length}</span> written ·{" "}
            <span className="tabular">{posts.length - published.length}</span>{" "}
            commissioned
          </p>
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <RuleHeading trailing="Dated, never updated">Posts</RuleHeading>
        <ul className="mt-2">
          {posts.map((post) => {
            const body = JOURNAL_BODIES[post.slug];
            const isDraft = !body?.published;
            return (
              <li key={post.slug} className="border-b border-b-paper-300">
                <Link
                  href={post.path}
                  className="group grid gap-4 py-8 lg:grid-cols-12 lg:gap-12"
                >
                  <p className="micro text-ink-500 lg:col-span-2">
                    {body?.published ? (
                      <span className="tabular">
                        {formatLongDate(body.published)}
                      </span>
                    ) : (
                      "Not published"
                    )}
                  </p>
                  <div className="lg:col-span-6">
                    <h3 className="text-display-sm text-ink-800 transition-colors duration-[var(--dur-fast)] group-hover:text-ink-900">
                      {post.h1}
                    </h3>
                    <p className="mt-3 max-w-[52ch] text-body text-ink-600">
                      {body?.standfirst ?? post.description}
                    </p>
                  </div>
                  <div className="lg:col-span-4 lg:text-right">
                    {isDraft ? (
                      <Badge variant="outline">Being written</Badge>
                    ) : (
                      <span className="micro inline-flex items-center gap-2 text-kiln">
                        Read
                        <ArrowRight
                          size={16}
                          strokeWidth={1.5}
                          aria-hidden="true"
                          className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
                        />
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section surface="paper-100" size="half">
        <RuleHeading trailing="Undated, maintained">
          And the guides
        </RuleHeading>
        <p className="mt-6 max-w-[62ch] text-body text-ink-600">
          Four of the eight pieces are definition pages rather than posts. They
          live in their own section because they get corrected when we learn
          something, and a dated post never does.
        </p>
        <ul className="mt-8 grid gap-x-12 gap-y-1 sm:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.slug} className="border-t border-t-paper-300">
              <Link
                href={guide.path}
                className="group flex min-h-14 items-center justify-between gap-6 py-3"
              >
                <span className="text-body text-ink-700 group-hover:text-ink-900">
                  {guide.h1}
                </span>
                {GUIDE_BODIES[guide.slug]?.state === "part-published" ? (
                  <span className="micro shrink-0 text-ink-500">Part-published</span>
                ) : (
                  <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="shrink-0 text-ink-500 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href="/guides" variant="secondary" className="mt-10">
          All four guides
        </ButtonLink>
      </Section>
    </>
  );
}
