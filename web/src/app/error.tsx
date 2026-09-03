"use client";

import { Button } from "@/components/ui/Button";
import { SystemPage } from "@/components/pages/content/SystemPage";

/**
 * The runtime error boundary. The same page as /500.
 *
 * It never shows a raw error to the visitor: the digest goes to the console
 * and the human line goes on the page.
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
    <SystemPage
      code="Error"
      title="That one is on us."
      body="Something broke at our end and nothing you were doing has been charged. Your order is still there."
      action={
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
