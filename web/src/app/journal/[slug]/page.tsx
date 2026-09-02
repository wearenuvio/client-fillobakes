import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, JsonLd, articleLd } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { Rule } from "@/components/ui/Rule";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ArticleHeader } from "@/components/pages/content/ArticleHeader";
import { Prose } from "@/components/pages/content/Prose";
import { EditorialImage } from "@/components/pages/content/EditorialImage";
import { RelatedProducts } from "@/components/pages/content/RelatedProducts";
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
  // A commissioned post is a real URL with an outline on it. It should not
  // compete in search with the pieces that are actually written.
  return buildMetadata(`/journal/${slug}`, {
    noindex: body ? !body.published : undefined,
  });
}

/**
 * A journal post — dated, and never updated.
 *
 * Prose at `--max-prose`, one photograph, links out to the bakes it mentions.
 * A post that has not been written renders the same layout with the outline
 * and a plain sentence saying what it is waiting on, because a reader who
 * arrives from search deserves to be told rather than to find filler.
 */
export default async function JournalPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  const body = JOURNAL_BODIES[slug];
  if (!post || !body) notFound();

  const isDraft = !body.published;

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

      <Section surface="paper-50" size="none" className="pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
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
              "Not published yet"
            ),
            "Fillo Bakes, Bengaluru",
          ]}
        />

        {isDraft && body.draftNote ? (
          <div className="mt-10 max-w-[var(--max-narrow)] border-y border-y-paper-300 py-6">
            <Badge variant="outline">Being written</Badge>
            <p className="mt-3 max-w-[62ch] text-body text-ink-600">
              {body.draftNote}
            </p>
          </div>
        ) : null}
      </Section>

      <Section surface="paper-50" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <article className="lg:col-span-7">
            <Prose>{body.body}</Prose>

            <Rule tone="strong" className="mt-16" />
            <p className="micro mt-6 text-ink-500">Read next</p>
            <ul className="mt-3 space-y-1">
              {body.related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline inline-flex min-h-11 items-center text-body text-kiln"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <aside className="lg:col-span-5">
            <EditorialImage
              src={body.image.src}
              alt={body.image.alt}
              ratio="4 / 5"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
              caption={body.image.caption}
              credit={body.image.credit}
              className="lg:sticky lg:top-24"
            />
          </aside>
        </div>
      </Section>

      <Section surface="paper-100">
        <RelatedProducts
          slugs={body.productSlugs}
          heading={isDraft ? "What it will be about" : "What this one is about"}
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/shop" size="lg">
            See this week&rsquo;s bake
          </ButtonLink>
          <ButtonLink href="/journal" variant="secondary" size="lg">
            The rest of the journal
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
