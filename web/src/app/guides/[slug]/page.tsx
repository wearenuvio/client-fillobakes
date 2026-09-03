import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, JsonLd, articleLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { ArticleHeader } from "@/components/pages/content/ArticleHeader";
import { Prose } from "@/components/pages/content/Prose";
import { EditorialImage } from "@/components/pages/content/EditorialImage";
import { RelatedProducts } from "@/components/pages/content/RelatedProducts";
import { ContentSection, Eyebrow } from "@/components/pages/content/PageShell";
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
 * A guide — undated and maintained, which is the entire reason guides and the
 * journal are two sections rather than one. The meta row says so out loud.
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

      <ContentSection surface="paper" size="none" className="pt-10 pb-8 lg:pt-14">
        <ArticleHeader
          kicker="Guide"
          title={guide.h1}
          standfirst={body.standfirst}
          backHref="/guides"
          backLabel="All guides"
          meta={["Undated, kept up to date", "Fillo Bakes, Bengaluru"]}
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

            <article className="mt-10">
              <Prose>{body.body}</Prose>
            </article>
          </div>
        </div>
      </ContentSection>

      <ContentSection surface="paper-2">
        <RelatedProducts
          slugs={body.productSlugs.slice(0, 3)}
          eyebrow="Pairs well with"
          heading="What this guide is about."
        />
        <ButtonLink href="/shop" size="lg" className="mt-10">
          See the menu
        </ButtonLink>
      </ContentSection>
    </>
  );
}
