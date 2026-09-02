import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { ButtonLink } from "@/components/ui/Button";
import { LineArtBleed } from "@/components/ui/LineArt";
import { whatsappHref } from "@/lib/config";

export const metadata: Metadata = buildMetadata("/500", { noindex: true });

/**
 * Rendered on demand. Next reserves `500.html` in the static export for the
 * Pages-router fallback, so prerendering an app route at this exact path
 * collides with it at build time.
 */
export const dynamic = "force-dynamic";

/**
 * The server-error page as a visitable route, so reviewers can see it without
 * breaking something. The runtime error boundary is src/app/error.tsx and
 * carries the same copy.
 *
 * site-content.md, Page: 500. Reassurance first, then the action: no stack
 * trace, and no error code the customer cannot use.
 */
export default function ServerErrorPage() {
  return (
    <Section surface="paper-50" className="overflow-hidden">
      <LineArtBleed glyph="wheat" side="right" size={560} />
      <div className="relative max-w-[var(--max-narrow)]">
        <p className="micro text-kiln">500</p>
        <h1 className="mt-4 text-display-lg text-ink-800">That&rsquo;s on us.</h1>
        <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">
          Something broke at our end. Nothing you were doing has been charged.
          Try again in a minute, or message us and we&rsquo;ll sort it by hand.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg">
            Try again
          </ButtonLink>
          <ButtonLink
            href={whatsappHref("Hi Fillo — the site threw an error on me.")}
            variant="secondary"
            size="lg"
            icon={<MessageCircle size={20} strokeWidth={1.5} />}
            iconPosition="leading"
          >
            WhatsApp us
          </ButtonLink>
        </div>
        <p className="mt-8 border-t border-t-paper-300 pt-6 text-body-sm text-ink-500">
          If you were mid-order, your cart is still there.
        </p>
      </div>
    </Section>
  );
}
