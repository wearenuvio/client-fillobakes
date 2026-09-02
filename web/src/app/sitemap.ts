import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { ROUTES } from "@/lib/routes";
import { getProducts } from "@/lib/catalog";
import { getAreaSlugs, getRouteSlugs } from "@/lib/mock";
import { getGuides, getJournalPosts } from "@/lib/content";

/**
 * The sitemap, built from the v2 route map rather than hand-maintained.
 *
 * seo.json's sitemapNotes are explicit about what the old one got wrong:
 *   - the 12 /product/* URLs it lists, eight of which return "Product Not
 *     Found" at HTTP 200, are gone; the 23 real SKUs are here instead;
 *   - /fillo-plus, /franchise and /shokupan were missing and are now included;
 *   - /login, /account/*, /checkout, /cart, /order/* and the system pages are
 *     excluded entirely, which the `noindex` flag on each route drives.
 *
 * lastmod is deliberately absent: seo.json asks for a per-URL value driven by
 * the CMS, and a build-time constant on every URL is worse than none.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.baseUrl;
  const url = (path: string) => `${base}${path === "/" ? "" : path}`;

  const staticRoutes = ROUTES.filter((r) => !r.noindex && !r.dynamic).map((r) => ({
    url: url(r.path),
    changeFrequency: (r.path === "/" || r.path === "/shop" || r.path === "/van"
      ? "daily"
      : "weekly") as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: r.path === "/" ? 1 : r.path === "/shop" ? 0.9 : 0.6,
  }));

  const products = getProducts().map((p) => ({
    url: url(`/product/${p.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const areas = getAreaSlugs().map((slug) => ({
    url: url(`/areas/${slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const vanRoutes = getRouteSlugs().map((slug) => ({
    url: url(`/van/${slug}`),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const editorial = [...getGuides(), ...getJournalPosts()].map((entry) => ({
    url: url(entry.path),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...products, ...areas, ...vanRoutes, ...editorial];
}
