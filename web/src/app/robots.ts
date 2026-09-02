import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

/**
 * The account area, the purchase flow and the styleguide are never indexed.
 * AI crawlers are allowed: the guides and the area pages exist precisely to be
 * quoted, and blocking them would cost the long-tail this site is built on.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/account/",
          "/cart",
          "/checkout",
          "/order/",
          "/login",
          "/logout",
          "/styleguide",
          "/offline",
        ],
      },
    ],
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
    host: SITE.baseUrl,
  };
}
