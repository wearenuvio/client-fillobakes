"use client";

import * as React from "react";
import { NewsletterRow } from "@/components/blocks/NewsletterRow";

/**
 * The Sunday message — DESIGN.md §12.21, microcopy library.
 *
 * The marketing list, not the van-proximity nudge: a different consent, a
 * different message and a different frequency, and the two are never in the
 * same viewport. Success replaces the form in place — no toast, no redirect.
 *
 * Mocked: a short delay, then the success state. Nothing leaves the browser.
 */

export function HomeNewsletter() {
  const [state, setState] = React.useState<"idle" | "submitting" | "success">(
    "idle",
  );

  return (
    <NewsletterRow
      state={state}
      heading="One message every Sunday."
      body="What we're baking, where the van will be, and a photo of whatever didn't rise properly."
      onSubmit={() => {
        setState("submitting");
        window.setTimeout(() => setState("success"), 600);
      }}
    />
  );
}
