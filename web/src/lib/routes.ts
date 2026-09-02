/**
 * The FINAL ROUTE MAP from research/DECISIONS.md v2. This file, not seo.json,
 * is the authority on which paths exist — seo.json is still being migrated
 * from the v1 paths, so lib/seo.ts maps each new path back to its v1 entry
 * (see ROUTE_ALIASES) and falls back gracefully where no entry exists.
 */

import productsFile from "../data/products.json";

export type RouteGroup =
  | "public"
  | "commerce"
  | "content"
  | "account"
  | "auth"
  | "system";

export type RouteDef = {
  path: string;
  group: RouteGroup;
  /** Dynamic segments this route exposes, for the Phase 2b checklist. */
  dynamic?: string;
  noindex?: boolean;
};

export const ROUTES: RouteDef[] = [
  // ---- public -------------------------------------------------------------
  { path: "/", group: "public" },
  { path: "/shop", group: "public" },
  { path: "/shop/all", group: "public" },
  { path: "/product/[slug]", group: "public", dynamic: "slug" },
  { path: "/boxes", group: "public" },
  { path: "/van", group: "public" },
  { path: "/van/[route]", group: "public", dynamic: "route" },
  { path: "/areas", group: "public" },
  { path: "/areas/[area]", group: "public", dynamic: "area" },
  { path: "/standing-order", group: "public" },
  { path: "/fillo-plus", group: "public" },
  { path: "/gifting", group: "public" },
  { path: "/gift-cards", group: "public" },

  // ---- commerce -----------------------------------------------------------
  { path: "/cart", group: "commerce", noindex: true },
  { path: "/checkout", group: "commerce", noindex: true },
  { path: "/order/[id]", group: "commerce", dynamic: "id", noindex: true },

  // ---- content ------------------------------------------------------------
  { path: "/about", group: "content" },
  { path: "/shokupan", group: "content" },
  { path: "/guides", group: "content" },
  { path: "/guides/[slug]", group: "content", dynamic: "slug" },
  { path: "/journal", group: "content" },
  { path: "/journal/[slug]", group: "content", dynamic: "slug" },
  { path: "/faq", group: "content" },
  { path: "/contact", group: "content" },
  { path: "/franchise", group: "content" },
  { path: "/policies/shipping", group: "content" },
  { path: "/policies/refund", group: "content" },
  { path: "/policies/terms", group: "content" },
  { path: "/policies/privacy", group: "content" },
  { path: "/policies/payment", group: "content" },

  // ---- account (all noindex, nofollow) ------------------------------------
  { path: "/account", group: "account", noindex: true },
  { path: "/account/orders", group: "account", noindex: true },
  { path: "/account/orders/[id]", group: "account", dynamic: "id", noindex: true },
  { path: "/account/subscription", group: "account", noindex: true },
  { path: "/account/subscription/setup", group: "account", noindex: true },
  { path: "/account/addresses", group: "account", noindex: true },
  { path: "/account/rewards", group: "account", noindex: true },
  { path: "/account/alerts", group: "account", noindex: true },
  { path: "/account/gift-cards", group: "account", noindex: true },
  { path: "/account/settings", group: "account", noindex: true },

  // ---- auth ---------------------------------------------------------------
  { path: "/login", group: "auth", noindex: true },
  { path: "/logout", group: "auth", noindex: true },

  // ---- system -------------------------------------------------------------
  { path: "/404", group: "system", noindex: true },
  { path: "/500", group: "system", noindex: true },
  { path: "/offline", group: "system", noindex: true },
];

export const ROUTE_INDEX = new Map(ROUTES.map((r) => [r.path, r]));

/**
 * New path -> the seo.json (v1) key that still carries its copy.
 * Remove an entry once seo.json ships that route under its v2 path.
 */
export const ROUTE_ALIASES: Record<string, string> = {
  "/shop/all": "/shop",
  "/product/[slug]": "/shop/[slug]",
  "/van": "/track",
  "/van/[route]": "/track",
  "/areas": "/delivery",
  "/areas/[area]": "/delivery",
  "/standing-order": "/fillo-plus/weekly-box",
  "/login": "/signin",
  "/account/rewards": "/account/fillo-plus",
  "/account/subscription": "/account/box",
  "/account/subscription/setup": "/account/box",
  "/account/alerts": "/account/notifications",
  "/policies/shipping": "/shipping",
  "/policies/refund": "/refund",
  "/policies/terms": "/terms",
  "/policies/privacy": "/privacy",
  "/policies/payment": "/payment-policy",
  // seo.json ships the eight posts individually but no /journal/[slug]
  // template entry; the index page's copy is the right fallback for one.
  "/journal/[slug]": "/journal",
  "/guides/what-is-shokupan": "/journal/what-is-shokupan",
  "/guides/an-pan": "/journal/anpan-red-bean",
  "/guides/what-is-karepan": "/journal/what-is-karepan",
  "/guides/how-to-store-shokupan": "/journal/tear-dont-slice",
};

/** Retired paths that must 301. Wired into next.config.ts. */
/**
 * Path segments under /shop that belong to the catalogue rather than to a
 * product: the category routes. Read from the catalogue file so adding a
 * category cannot silently re-break the redirect above.
 */
const SHOP_SEGMENTS: string[] = (
  productsFile.categories as { slug: string }[]
).map((c) => c.slug);

export const RETIRED_REDIRECTS: { source: string; destination: string }[] = [
  { source: "/blogpage", destination: "/journal" },
  { source: "/fillo-plus/dashboard", destination: "/account/rewards" },
  { source: "/fillo-plus/weekly-box", destination: "/standing-order" },
  // The old site put products at /shop/<slug>; v2 puts them at /product/<slug>
  // and gives /shop/<category> to the catalogue. So the catch-all must skip
  // /shop/all and every real category slug, or it swallows the shop itself.
  {
    source: `/shop/:slug((?!(?:all|${SHOP_SEGMENTS.join("|")})$)[^/]+)`,
    destination: "/product/:slug",
  },
  { source: "/track", destination: "/van" },
  { source: "/signin", destination: "/login" },
  { source: "/delivery", destination: "/areas" },
  { source: "/shipping", destination: "/policies/shipping" },
  { source: "/refund", destination: "/policies/refund" },
  { source: "/terms", destination: "/policies/terms" },
  { source: "/privacy", destination: "/policies/privacy" },
  { source: "/payment-policy", destination: "/policies/payment" },
  { source: "/account/box", destination: "/account/subscription" },
  { source: "/account/fillo-plus", destination: "/account/rewards" },
  { source: "/account/notifications", destination: "/account/alerts" },
];

/**
 * The legacy /product/* URLs from the old sitemap, eight of which currently
 * return "Product Not Found" at HTTP 200. Sourced from products.json's
 * `redirects` array and re-pointed at the v2 /product/[slug] path.
 */
export function legacyProductRedirects(
  entries: { from: string; to: string | null }[],
): { source: string; destination: string }[] {
  return entries
    .filter(
      (r): r is { from: string; to: string } =>
        // `to: null` means DO NOT REDIRECT — /shokupan is the one page on the
        // old site that ranks, and it stays live.
        typeof r.to === "string" && r.to.length > 0,
    )
    .map((r) => ({
      source: r.from,
      destination: r.to.replace(/^\/shop\//, "/product/"),
    }))
    .filter((r) => r.source !== r.destination);
}

/** The four guides named in DECISIONS.md. */
export const GUIDE_SLUGS = [
  "what-is-shokupan",
  "an-pan",
  "how-to-store-shokupan",
  "what-is-karepan",
] as const;
