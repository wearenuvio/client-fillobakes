"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { LoafGlyph } from "@/components/ui/LineArt";
import { useToast } from "@/components/ui/Toast";
import { getProductBySlug } from "@/lib/catalog";
import { getStockFor, type Box } from "@/lib/mock";
import { formatINR, pluralise } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { Est } from "@/components/pages/home/Tbc";

/**
 * A curated box — site-content "Page: Boxes".
 *
 * A box is a PRODUCT, not the subscription. The subscription is the Standing
 * Order and the two words never overlap.
 *
 * No box photograph exists yet (mock-data: "Does not exist. Needs a flat-lay
 * of real contents"), so the well is built from the cutouts of the things
 * actually in the box. That is more honest than a stand-in photograph of
 * somebody else's hamper, and it doubles as the contents list.
 *
 * Prices are ours, derived from retail, and are tagged as such until the
 * founders set them.
 */

export function BoxCard({ box }: { box: Box }) {
  const add = useCartStore((s) => s.add);
  const { toast } = useToast();

  const items = box.contents
    .map((entry) => ({ product: getProductBySlug(entry.slug), qty: entry.qty }))
    .filter((entry): entry is { product: NonNullable<ReturnType<typeof getProductBySlug>>; qty: number } =>
      Boolean(entry.product),
    );

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const goneItems = items.filter(
    (item) => getStockFor(item.product.slug)?.state === "sold_out",
  );

  function addBox() {
    for (const item of items) add(item.product.slug, item.qty);
    toast({
      message: `${box.name} — ${pluralise(count, "bake")} in your box.`,
      tone: "success",
      action: {
        label: "Open the box",
        onClick: () => useCartStore.getState().open(),
      },
    });
  }

  return (
    <article className="flex flex-col rounded-md border border-paper-300 bg-paper-0 p-6">
      {/* The well, built from what is in the box. */}
      <div
        data-surface="well"
        className={cn(
          "grid aspect-4/3 w-full grid-cols-2 place-items-center gap-2 bg-paper-200 p-4",
          items.length > 4 && "grid-cols-3",
        )}
      >
        {items.slice(0, 6).map((item) =>
          item.product.image ? (
            <Image
              key={item.product.slug}
              src={item.product.image.src}
              alt=""
              width={240}
              height={240}
              sizes="120px"
              className="max-h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(4,33,47,0.35)]"
            />
          ) : (
            <LoafGlyph key={item.product.slug} size={48} className="opacity-70" />
          ),
        )}
      </div>

      <h2 className="mt-6 text-display-sm text-ink-800">{box.name}</h2>
      <p className="mt-2 text-body text-ink-600">{box.line}</p>

      <ul className="mt-5 divide-y divide-paper-300 border-y border-y-paper-300">
        {items.map((item) => (
          <li
            key={item.product.slug}
            className="flex items-baseline gap-3 py-2 text-body-sm"
          >
            <span className="min-w-0 flex-1 truncate text-ink-800">
              {item.product.name}
            </span>
            <span className="shrink-0 font-mono text-caption text-ink-500 tabular">
              ×{item.qty}
            </span>
          </li>
        ))}
      </ul>

      {box.allergenFlag ? (
        <p className="micro mt-3 text-ink-600">{box.allergenFlag}</p>
      ) : null}

      {goneItems.length > 0 ? (
        <p className="mt-3">
          <Badge variant="muted">
            {goneItems.map((item) => item.product.name).join(", ")} gone this
            week
          </Badge>
        </p>
      ) : null}

      <div className="mt-auto flex items-baseline justify-between gap-3 pt-6">
        <span className="flex items-baseline gap-2">
          <Price amount={box.price} size="lg" />
          <Est what="Our price, derived from retail — the founders set the final number" />
        </span>
        <span className="text-caption text-ink-500 tabular">
          Singly {formatINR(box.listValue)} · {box.savingLabel.toLowerCase()}
        </span>
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={addBox}>
        Add the box
      </Button>
      <p className="mt-3 text-caption text-ink-500">
        {pluralise(count, "bake")} go into your box, and the kitchen applies the
        box price to the order.
      </p>
    </article>
  );
}
