"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";

/**
 * Change or cancel — and it has to actually work.
 *
 * The live site's last line before payment is "No changes can be made after
 * payment", which reads as a threat and is the wrong promise. The right one is
 * the cut-off: free until 8pm the evening before, and after that the dough is
 * in and we say so plainly rather than pretending.
 */
export function ChangeOrCancel({
  canChange,
  closedCopy,
  cutoffLine,
}: {
  canChange: boolean;
  /** Authored copy for after the cut-off. */
  closedCopy: string;
  /** "You can change or cancel free until Thursday 8pm." */
  cutoffLine: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  if (!canChange) {
    return (
      <div>
        <p className="text-body text-ink-600">{closedCopy}</p>
        <Button
          variant="ghost"
          size="md"
          className="mt-2 -ml-4"
          onClick={() =>
            toast({ message: "Opening WhatsApp with your order number.", tone: "info" })
          }
        >
          Message us on WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-body text-ink-800">{cutoffLine}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={() =>
            toast({ message: "Changed. Same total.", tone: "success" })
          }
        >
          Change the day or window
        </Button>
        <Button variant="ghost" size="md" onClick={() => setOpen(true)}>
          Cancel this order
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Cancel this order?"
        description="Nothing further will be charged, and the refund goes back the way it came — 7 to 10 working days with Razorpay."
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpen(false)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              size="md"
              onClick={() => {
                setOpen(false);
                toast({
                  message:
                    "Cancelled. Nothing further will be charged, and the refund is with Razorpay — 7 to 10 working days.",
                  tone: "info",
                });
              }}
            >
              Cancel the order
            </Button>
          </>
        }
      />
    </div>
  );
}
