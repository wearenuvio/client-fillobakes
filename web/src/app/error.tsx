"use client";

import { Section } from "@/components/blocks/Section";
import { Button, ButtonLink } from "@/components/ui/Button";
import { whatsappHref } from "@/lib/config";

/**
 * The runtime error boundary. Same copy as /500.
 *
 * It never shows a raw error to the visitor — the digest goes to the console
 * and the human line goes on the page (§12.34's rule, applied site-wide).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  return (
    <Section surface="paper-50">
      <div className="max-w-[var(--max-narrow)]">
        <p className="micro text-kiln">Error</p>
        <h1 className="mt-4 text-display-lg text-ink-800">
          Something broke at our end.
        </h1>
        <p className="mt-4 max-w-[46ch] text-body-lg text-ink-600">
          Nothing was charged. Try again, or WhatsApp us and we&rsquo;ll sort it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <ButtonLink
            href={whatsappHref("Hi Fillo — the site threw an error on me.")}
            variant="secondary"
            size="lg"
          >
            WhatsApp us
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
