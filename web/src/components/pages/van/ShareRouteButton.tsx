"use client";

import * as React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

/**
 * A route page is the QR target on the van's glass case and on the bag, so it
 * has to be forwardable in one press. Native share where the browser has it,
 * clipboard where it does not, and a toast either way — never a dead button.
 */
export function ShareRouteButton({
  title,
  path,
  label = "Share this route",
}: {
  title: string;
  path: string;
  label?: string;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = React.useState(false);

  async function share() {
    const url = `${window.location.origin}${path}`;
    setBusy(true);
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ message: "Link copied. Send it to whoever needs the van.", tone: "success" });
      }
    } catch {
      // A cancelled share is not a failure and gets no message.
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      variant="secondary"
      size="md"
      loading={busy}
      icon={<Share2 size={20} strokeWidth={1.5} />}
      iconPosition="leading"
      onClick={share}
    >
      {label}
    </Button>
  );
}
