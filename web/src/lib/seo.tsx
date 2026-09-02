import type { Metadata } from "next";
import seoRaw from "@/data/seo.json";
import { SITE, CONTACT } from "@/lib/config";
import { ROUTE_ALIASES, ROUTE_INDEX } from "@/lib/routes";
import { getPriceRange } from "@/lib/catalog";

/**
 * Metadata + JSON-LD, read from src-content/seo.json.
 *
 * The audit that produced seo.json found that NO core page on the live site
 * renders a <title>. Every route in this app therefore ships title,
 * description, canonical, OG and JSON-LD server-rendered — that is the whole
 * point of this module.
 *
 * seo.json is still being migrated to the v2 route map (DECISIONS.md), so
 * lookup falls back: exact path -> ROUTE_ALIASES -> dynamic template
 * ("/product/tiramisu-an-pan" -> "/product/[slug]") -> a derived default.
 */

export type SeoRoute = {
  route: string;
  title: string;
  metaDescription: string;
  h1: string;
  keywords?: string[];
  jsonLd?: string[];
  jsonLdNotes?: string;
  robots?: string;
  template?: string;
  note?: string;
  status?: string;
  priority?: number;
  changefreq?: string;
};

type SeoFile = {
  meta: {
    siteName: string;
    baseUrl: string;
    defaultLocale: string;
    openGraph: { defaultImage: string; twitterCard: string; note?: string };
    globalJsonLd: unknown[];
  };
  routes: SeoRoute[];
};

const seo = seoRaw as unknown as SeoFile;
const byRoute = new Map(seo.routes.map((r) => [r.route, r]));

export const SEO_META = seo.meta;
export const OG_DEFAULT = seo.meta.openGraph.defaultImage;

/** "/product/tiramisu-an-pan" -> "/product/[slug]" (one dynamic tail only). */
function toTemplate(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) return null;
  for (const def of ROUTE_INDEX.values()) {
    if (!def.dynamic) continue;
    const defSegments = def.path.split("/").filter(Boolean);
    if (defSegments.length !== segments.length) continue;
    const matches = defSegments.every(
      (s, i) => s.startsWith("[") || s === segments[i],
    );
    if (matches) return def.path;
  }
  return null;
}

/** Resolves the seo.json entry for a path, or null when none exists yet. */
export function getSeoRoute(path: string): SeoRoute | null {
  const direct = byRoute.get(path);
  if (direct) return direct;

  const alias = ROUTE_ALIASES[path];
  if (alias && byRoute.get(alias)) return byRoute.get(alias)!;

  const template = toTemplate(path);
  if (template) {
    const templateEntry =
      byRoute.get(template) ??
      (ROUTE_ALIASES[template] ? byRoute.get(ROUTE_ALIASES[template]) : undefined);
    if (templateEntry) return templateEntry;
  }
  return null;
}

/** The page's H1, from seo.json. Falls back to a humanised path segment. */
export function getH1(path: string, fallback?: string): string {
  return getSeoRoute(path)?.h1 ?? fallback ?? humanise(path);
}

function humanise(path: string): string {
  const last = path.split("/").filter(Boolean).pop();
  if (!last) return SITE.name;
  return last
    .replace(/\[|\]/g, "")
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export type MetadataOptions = {
  /** Overrides the title from seo.json (dynamic routes fill in the real name). */
  title?: string;
  description?: string;
  /** Canonical path if it differs from `path` (e.g. a paginated view). */
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  keywords?: string[];
};

/**
 * Builds a Next `Metadata` object for a route.
 *
 *   export const metadata = buildMetadata("/shop");
 *   // dynamic:
 *   export async function generateMetadata({ params }) {
 *     const { slug } = await params;
 *     return buildMetadata(`/product/${slug}`, { title: product.name });
 *   }
 */
export function buildMetadata(
  path: string,
  options: MetadataOptions = {},
): Metadata {
  const entry = getSeoRoute(path);
  const def = ROUTE_INDEX.get(path) ?? ROUTE_INDEX.get(toTemplate(path) ?? "");
  const noindex =
    options.noindex ??
    def?.noindex ??
    /noindex/i.test(entry?.robots ?? "") ??
    false;

  const title =
    options.title ?? entry?.title ?? `${humanise(path)} | ${SITE.name}`;
  const description =
    options.description ??
    entry?.metaDescription ??
    "Eggless Japanese bakery in Bengaluru. Milk bread baked every morning, brought to your street by van.";
  const canonicalPath = options.canonical ?? path;
  const url = `${SITE.baseUrl}${canonicalPath === "/" ? "" : canonicalPath}`;
  const image = options.ogImage ?? OG_DEFAULT;

  return {
    // Absolute: seo.json's titles are authored and length-tuned, and several
    // already carry the brand. The layout's "%s | Fillo Bakes" template must
    // not append a second suffix on top of them.
    title: { absolute: title },
    description,
    keywords: options.keywords ?? entry?.keywords,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_IN",
      url,
      title,
      description,
      images: [{ url: `${SITE.baseUrl}${image}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE.baseUrl}${image}`],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                     */
/* -------------------------------------------------------------------------- */

type JsonLdNode = Record<string, unknown>;

/** Organization — placed on every page (seo.json meta.globalJsonLd). */
export function organizationLd(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": `${SITE.baseUrl}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.baseUrl,
    founder: SITE.founders.map((name) => ({ "@type": "Person", name })),
    foundingDate: SITE.founded,
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    sameAs: [CONTACT.instagram],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.state,
      addressCountry: SITE.country,
    },
  };
}

/**
 * Bakery — a LocalBusiness subtype. Deliberately publishes NO street address:
 * it is a van, not a shop (seo.json jsonLdNotes on "/").
 */
export function bakeryLd(areaServed: string[] = []): JsonLdNode {
  const { min, max } = getPriceRange();
  return {
    "@type": "Bakery",
    "@id": `${SITE.baseUrl}/#bakery`,
    name: SITE.name,
    url: SITE.baseUrl,
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    priceRange: `₹${min}-₹${max}`,
    servesCuisine: "Japanese",
    openingHours: SITE.hours,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.state,
      addressCountry: SITE.country,
    },
    areaServed: areaServed.map((name) => ({ "@type": "Place", name })),
  };
}

export function websiteLd(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${SITE.baseUrl}/#website`,
    name: SITE.name,
    url: SITE.baseUrl,
    inLanguage: SITE.locale,
    publisher: { "@id": `${SITE.baseUrl}/#organization` },
  };
}

export type Crumb = { name: string; path: string };

/** BreadcrumbList — every page below the home page. */
export function breadcrumbLd(crumbs: Crumb[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE.baseUrl}${c.path === "/" ? "" : c.path}`,
    })),
  };
}

export function productLd(input: {
  name: string;
  slug: string;
  description: string;
  price: number;
  image?: string | null;
  inStock?: boolean;
}): JsonLdNode {
  return {
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: `${SITE.baseUrl}/product/${input.slug}`,
    ...(input.image ? { image: `${SITE.baseUrl}${input.image}` } : {}),
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      price: input.price,
      priceCurrency: "INR",
      availability: `https://schema.org/${input.inStock === false ? "OutOfStock" : "InStock"}`,
      url: `${SITE.baseUrl}/product/${input.slug}`,
    },
  };
}

export function faqLd(items: { question: string; answer: string }[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function articleLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  /**
   * A guide is undated and maintained, a journal post is dated and never
   * revised — which is the whole reason the site has two sections. Guides
   * emit `dateModified`; posts emit an author.
   */
  dateModified?: string;
  author?: string;
}): JsonLdNode {
  return {
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: `${SITE.baseUrl}${input.path}`,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.author
      ? { author: { "@type": "Person", name: input.author } }
      : {}),
    publisher: { "@id": `${SITE.baseUrl}/#organization` },
  };
}

/**
 * Server component that emits one `@graph` script tag.
 * Organization is always included; pass anything else the route needs.
 *
 *   <JsonLd path="/shop" crumbs={[{ name: "Shop", path: "/shop" }]} />
 */
export function JsonLd({
  path,
  crumbs,
  nodes = [],
}: {
  path: string;
  crumbs?: Crumb[];
  nodes?: JsonLdNode[];
}) {
  const graph: JsonLdNode[] = [organizationLd()];
  if (path !== "/" && crumbs?.length) graph.push(breadcrumbLd(crumbs));
  graph.push(...nodes);

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for the one sequence that can break out.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
