"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useCartStore } from "@/store/cart";

/**
 * "Order again" — one tap adds the line back to the box. The cart store is
 * the source of truth for the total, so nothing here computes money.
 */
export function AddAgain({
  slug,
  name,
  qty = 1,
  label,
  variant = "secondary",
  fullWidth = false,
}: {
  slug: string;
  name: string;
  qty?: number;
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}) {
  const add = useCartStore((s) => s.add);
  const open = useCartStore((s) => s.open);
  const { toast } = useToast();

  return (
    <Button
      variant={variant}
      size="sm"
      fullWidth={fullWidth}
      icon={<Plus size={16} strokeWidth={1.5} />}
      iconPosition="leading"
      onClick={() => {
        add(slug, qty);
        toast({
          message: `${name} added to your box.`,
          action: { label: "Open the box", onClick: open },
        });
      }}
    >
      {label ?? "Add"}
    </Button>
  );
}

/** Adds every line of a past order back in one press. */
export function ReorderButton({
  items,
  variant = "secondary",
}: {
  items: { slug: string; qty: number }[];
  variant?: "primary" | "secondary" | "ghost";
}) {
  const add = useCartStore((s) => s.add);
  const open = useCartStore((s) => s.open);
  const { toast } = useToast();

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => {
        for (const line of items) add(line.slug, line.qty);
        toast({
          message: "Back in your box. Same items, this week's run.",
          action: { label: "Open the box", onClick: open },
        });
      }}
    >
      Order again
    </Button>
  );
}
