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
import { GUIDE_BODIES } from "@/components/pages/content/guide-bodies";
import { getGuide, getGuides } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadata(`/guides/${slug}`);
}

/**
 * A guide — site-content.md, Section: Guides.
 *
 * Long-form at `--max-prose`, one photograph, and the SKUs the guide explains
 * underneath it. Guides are undated and maintained, which the meta row says
 * out loud, because the difference from a journal post is the entire reason
 * these are two sections and not one.
 */
export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const body = GUIDE_BODIES[slug];
  if (!guide || !body) notFound();

  return (
    <>
      <JsonLd
        path={guide.path}
        crumbs={[
          { name: "Guides", path: "/guides" },
          { name: guide.h1, path: guide.path },
        ]}
        nodes={[
          articleLd({
            headline: guide.h1,
            description: guide.description,
            path: guide.path,
          }),
        ]}
      />

      <Section surface="paper-50" size="none" className="pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
        <ArticleHeader
          kicker="Guide"
          title={guide.h1}
          standfirst={body.standfirst}
          backHref="/guides"
          backLabel="All guides"
          meta={[
            body.state === "maintained" ? "Undated · maintained" : "Undated · part-published",
            "Fillo Bakes, Bengaluru",
          ]}
        />

        {body.state === "part-published" && body.stateNote ? (
          <div className="mt-10 max-w-[var(--max-narrow)] border-y border-y-paper-300 py-5">
            <Badge variant="warning">Part-published</Badge>
            <p className="mt-3 max-w-[62ch] text-body-sm text-ink-600">
              {body.stateNote}
            </p>
          </div>
        ) : null}
      </Section>

      <Section surface="paper-50" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
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
          </div>

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
          heading="What this guide is about"
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/shop" size="lg">
            See this week&rsquo;s bake
          </ButtonLink>
          <ButtonLink href="/guides" variant="secondary" size="lg">
            The other guides
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
