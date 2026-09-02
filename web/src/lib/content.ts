import seoRaw from "@/data/seo.json";

/**
 * Editorial index for /guides/[slug] and /journal/[slug].
 *
 * Phase 2a has no CMS and no MDX: the slugs, titles, descriptions and H1s all
 * come from seo.json, which is the file the content agent maintains. Phase 2b
 * writes the bodies — either as MDX under src/content or from whatever source
 * the coordinator picks — and keeps using these helpers for the index pages so
 * the two lists cannot drift out of sync with the sitemap.
 */

type SeoRoute = {
  route: string;
  title: string;
  metaDescription: string;
  h1: string;
  status?: string;
  note?: string;
};

const routes = (seoRaw as unknown as { routes: SeoRoute[] }).routes;

export type Entry = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  /** seo.json marks which of the eight posts are written in full. */
  status?: string;
};

function collect(prefix: string): Entry[] {
  return routes
    .filter((r) => r.route.startsWith(`${prefix}/`) && !r.route.includes("["))
    .map((r) => ({
      slug: r.route.slice(prefix.length + 1),
      path: r.route,
      title: r.title,
      h1: r.h1,
      description: r.metaDescription,
      status: r.status,
    }));
}

const guides = collect("/guides");
const journal = collect("/journal");

export function getGuides(): Entry[] {
  return guides;
}

export function getGuide(slug: string): Entry | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getJournalPosts(): Entry[] {
  return journal;
}

export function getJournalPost(slug: string): Entry | undefined {
  return journal.find((p) => p.slug === slug);
}
