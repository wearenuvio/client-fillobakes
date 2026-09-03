import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, JsonLd, articleLd } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ArticleHeader } from "@/components/pages/content/ArticleHeader";
import { Prose } from "@/components/pages/content/Prose";
import { EditorialImage } from "@/components/pages/content/EditorialImage";
import { RelatedProducts } from "@/components/pages/content/RelatedProducts";
import {
  ContentSection,
  Eyebrow,
} from "@/components/pages/content/PageShell";
import { JOURNAL_BODIES } from "@/components/pages/content/journal-bodies";
import { getJournalPost, getJournalPosts } from "@/lib/content";
import { formatLongDate } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getJournalPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const body = JOURNAL_BODIES[slug];
  // A commissioned post is a real URL with nothing on it yet. It should not
  // compete in search with the pieces that are actually written.
  return buildMetadata(`/journal/${slug}`, {
    noindex: body ? !body.published : undefined,
  });
}

/**
 * A journal post — dated, and never updated.
 *
 * Prose at the reading measure, one photograph, and the bakes it is about at
 * the end. A post that has not been written renders the same page with a
 * "Coming soon" tag and one sentence saying what it is waiting on. No outline
 * dressed up as an article: a reader arriving from search is told, not filled.
 */
export default async function JournalPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  const body = JOURNAL_BODIES[slug];
  if (!post || !body) notFound();

  const soon = !body.published;

  return (
    <>
      <JsonLd
        path={post.path}
        crumbs={[
          { name: "Journal", path: "/journal" },
          { name: post.h1, path: post.path },
        ]}
        nodes={[
          articleLd({
            headline: post.h1,
            description: post.description,
            path: post.path,
            ...(body.published ? { datePublished: body.published } : {}),
          }),
        ]}
      />

      <ContentSection surface="paper" size="none" className="pt-10 pb-8 lg:pt-14">
        <ArticleHeader
          kicker="From the van"
          title={post.h1}
          standfirst={body.standfirst}
          backHref="/journal"
          backLabel="The journal"
          meta={[
            body.published ? (
              <span key="date" className="tabular">
                {formatLongDate(body.published)}
              </span>
            ) : (
              <Badge key="soon" variant="outline">
                Coming soon
              </Badge>
            ),
            "Fillo Bakes, Bengaluru",
          ]}
        />
      </ContentSection>

      <ContentSection surface="paper" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* The rail mirrors the policies' contents column, so the library
              and the small print are visibly the same object. */}
          <nav
            aria-label="Read next"
            className="order-2 lg:order-1 lg:col-span-4 lg:sticky lg:top-24 lg:self-start"
          >
            <Eyebrow>Read next</Eyebrow>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {body.related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline flex min-h-11 items-center py-2 text-body-sm font-medium text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="order-1 lg:order-2 lg:col-span-8">
            <EditorialImage
              src={body.image.src}
              alt={body.image.alt}
              ratio="16 / 9"
              sizes="(min-width: 1024px) 700px, 100vw"
              priority
              caption={body.image.caption}
              credit={body.image.credit}
            />

            {soon ? (
              <div className="mt-10 rounded-lg border border-line bg-card p-6 lg:p-8">
                <Eyebrow>Not written yet</Eyebrow>
                <p className="mt-3 max-w-[52ch] text-body-lg text-ink-2">
                  {body.draftNote}
                </p>
              </div>
            ) : (
              <article className="mt-10">
                <Prose>{body.body}</Prose>
              </article>
            )}
          </div>
        </div>
      </ContentSection>

      <ContentSection surface="paper-2">
        <RelatedProducts
          slugs={body.productSlugs.slice(0, 2)}
          eyebrow="Pairs well with"
          heading={soon ? "What it will be about." : "What this one is about."}
        />
        <ButtonLink href="/shop" size="lg" className="mt-10">
          See the menu
        </ButtonLink>
      </ContentSection>
    </>
  );
}
