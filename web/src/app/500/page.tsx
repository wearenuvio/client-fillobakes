import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { SystemPage } from "@/components/pages/content/SystemPage";

export const metadata: Metadata = buildMetadata("/500", { noindex: true });

/**
 * Rendered on demand. Next reserves `500.html` in the static export for the
 * Pages-router fallback, so prerendering an app route at this exact path
 * collides with it at build time.
 */
export const dynamic = "force-dynamic";

/**
 * The server-error page as a visitable route, so it can be reviewed without
 * breaking something. The runtime boundary is src/app/error.tsx and carries
 * the same copy.
 *
 * Reassurance first, then the way out. No stack trace, and no error code a
 * customer cannot use.
 */
export default function ServerErrorPage() {
  return (
    <SystemPage
      code="500"
      title="That one is on us."
      body="Something broke at our end and nothing you were doing has been charged. Your order is still there."
      action={
        <ButtonLink href="/" size="lg">
          Try again
        </ButtonLink>
      }
    />
  );
}
