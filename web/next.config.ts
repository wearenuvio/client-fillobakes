import type { NextConfig } from "next";
import { RETIRED_REDIRECTS, legacyProductRedirects } from "./src/lib/routes";
import products from "./src/data/products.json";

/**
 * Every retired path from DECISIONS.md v2 gets a permanent redirect, plus the
 * dead /product/* slugs from the old site's sitemap (products.json `redirects`)
 * — eight of which currently return "Product Not Found" at HTTP 200, which is
 * a soft-404 and worse than a real one.
 */
const nextConfig: NextConfig = {
  /**
   * The dev overlay badge sits over the bottom-left of every page, which puts
   * it inside every design QA screenshot. The build output is unaffected.
   */
  devIndicators: false,

  async redirects() {
    const legacy = legacyProductRedirects(
      products.redirects as { from: string; to: string | null }[],
    );
    // Exact legacy paths first, then the retired patterns.
    return [...legacy, ...RETIRED_REDIRECTS].map((r) => ({
      ...r,
      permanent: true,
    }));
  },
};

export default nextConfig;
