import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { SystemPage } from "@/components/pages/content/SystemPage";

export const metadata: Metadata = buildMetadata("/404", { noindex: true });

/**
 * 404 — PAGES-v2.
 *
 * The live site returns a bare "Product Not Found · ID: [slug]" at HTTP 200
 * for eight sitemap URLs, which is a soft 404 and worse than a real one. This
 * returns a real 404, and the dead /product/* URLs are 301'd in
 * next.config.ts rather than landing here at all.
 *
 * One door. A grid of "you might like these" on a page someone reached by
 * accident is a shop window in front of a locked one.
 */
export default function NotFound() {
  return (
    <SystemPage
      code="404"
      title="Nothing here yet."
      body="That page has gone, or it never existed. The menu is where everything actually is."
      action={
        <ButtonLink href="/shop" size="lg">
          See the menu
        </ButtonLink>
      }
    />
  );
}
