"use client";

import * as React from "react";
import { Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { whatsappHref } from "@/lib/config";

/**
 * Newsletter row — DESIGN.md §12.21.
 *
 * This is the MARKETING-LIST capture (the Sunday message). The van-proximity
 * nudge is a different consent, a different message and a different frequency
 * — that is <WhatsAppOptIn> (§12.31). **The two are never shown in the same
 * viewport.**
 *
 * Success replaces the form in place with a check and one line. No toast, no
 * redirect.
 */

export function NewsletterRow({
  state = "idle",
  heading = "One message every Sunday.",
  body = "What we're baking, where the van will be, and a photo of whatever didn't rise properly.",
  surface = "paper-100",
  onSubmit,
  error,
  className,
}: {
  state?: "idle" | "submitting" | "success" | "error";
  heading?: React.ReactNode;
  body?: React.ReactNode;
  surface?: "paper-100" | "dark";
  onSubmit?: (value: string) => void;
  error?: React.ReactNode;
  className?: string;
}) {
  const [value, setValue] = React.useState("");
  const fieldId = React.useId();
  const dark = surface === "dark";

  return (
    <div
      data-surface={dark ? "dark" : undefined}
      className={cn(dark ? "bg-ink-900" : "bg-paper-100", className)}
    >
      <div className="container-content grid gap-8 py-[var(--section-y)] lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2
            className={cn("text-display-md", dark ? "text-paper-0" : "text-ink-800")}
          >
            {heading}
          </h2>
          <p
            className={cn(
              "mt-3 max-w-[46ch] text-body",
              dark ? "text-ink-400" : "text-ink-600",
            )}
          >
            {body}
          </p>
        </div>

        <div className="lg:col-span-6">
          {state === "success" ? (
            <p
              className={cn(
                "flex items-start gap-2 text-body",
                dark ? "text-paper-0" : "text-ink-800",
              )}
            >
              <Check
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-success"
              />
              You&rsquo;re on the list. Sundays only.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <Field
                  label="Mobile number or email"
                  htmlFor={fieldId}
                  className="md:flex-1"
                  error={state === "error" ? error : undefined}
                >
                  <Input
                    id={fieldId}
                    value={value}
                    invalid={state === "error"}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="98765 43210"
                  />
                </Field>
                <Button
                  size="md"
                  loading={state === "submitting"}
                  disabled={!value.trim()}
                  onClick={() => onSubmit?.(value)}
                >
                  Send it to me
                </Button>
              </div>

              <p
                className={cn(
                  "micro mt-3",
                  dark ? "text-ink-400" : "text-ink-500",
                )}
              >
                One message a week. Stop any time by replying STOP.
              </p>

              <Button
                variant="secondary"
                size="md"
                className="mt-4"
                icon={<MessageCircle size={20} strokeWidth={1.5} />}
                iconPosition="leading"
                onClick={() => {
                  window.location.href = whatsappHref(
                    "Hi Fillo — put me on the Sunday message list.",
                  );
                }}
              >
                Or ping us on WhatsApp
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
