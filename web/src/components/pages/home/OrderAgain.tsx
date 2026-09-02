"use client";

import * as React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { LoafGlyph } from "@/components/ui/LineArt";
import { Kicker } from "@/components/ui/Rule";
import { useToast } from "@/components/ui/Toast";
import { getProductBySlug } from "@/lib/catalog";
import { getLatestOrder, getStockFor } from "@/lib/mock";
import { useCartStore } from "@/store/cart";
import { useSessionStore, useSessionHydrated } from "@/store/session";

/**
 * "Order again" — site-content Home §8, journey §3.1 row 7.
 *
 * Returning visitors only, injected ABOVE the menu. One tap adds the line;
 * there is no variant modal, because there are no variants — the shortest
 * path from "I want that again" to "it is in the box" is the whole point.
 *
 * "Returning" is read from the two persisted stores: a browser that has set an
 * area or put something in the box has been here before. On a first visit
 * nothing renders and the menu simply starts one row higher.
 */

export function OrderAgain() {
  const hydrated = useSessionHydrated();
  const area = useSessionStore((s) => s.area);
  const hasLines = useCartStore((s) => s.lines.length > 0);
  const add = useCartStore((s) => s.add);
  const { toast } = useToast();

  const order = getLatestOrder();
  const items = React.useMemo(
    () =>
      (order?.items ?? [])
        .slice(0, 3)
        .map((item) => getProductBySlug(item.slug))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [order],
  );

  if (!hydrated || (!area && !hasLines) || items.length === 0) return null;

  return (
    <div className="mb-12 border-b border-b-paper-300 pb-12">
      <Kicker>Order again</Kicker>
      <p className="mt-3 text-body text-ink-600">
        The last three off your previous run. One tap each.
      </p>

      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {items.map((product) => {
          const stock = getStockFor(product.slug);
          const soldOut = stock?.state === "sold_out";
          return (
            <li
              key={product.slug}
              className="flex items-center gap-4 rounded-md border border-paper-300 bg-paper-0 p-3"
            >
              <span
                data-surface="well"
                className="grid size-16 shrink-0 place-items-center bg-paper-200"
              >
                {product.image ? (
                  <Image
                    src={product.image.src}
                    alt=""
                    width={128}
                    height={128}
                    sizes="64px"
                    className="w-[70%] object-contain"
                  />
                ) : (
                  <LoafGlyph size={36} className="opacity-70" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-body-sm font-semibold text-ink-800">
                  {product.name}
                </span>
                <Price amount={product.price} size="sm" muted={soldOut} />
              </span>

              {soldOut ? (
                <span className="micro shrink-0 text-ink-500">Gone</span>
              ) : (
                <button
                  type="button"
                  aria-label={`Add ${product.name} to the box`}
                  onClick={() => {
                    add(product.slug);
                    toast({ message: `${product.name} is in your box.`, tone: "success" });
                  }}
                  className="relative grid size-9 shrink-0 place-items-center rounded-pill border-[1.5px] border-ink-800 text-ink-800 transition-colors duration-[var(--dur-base)] hover:bg-ink-800 hover:text-paper-0 after:absolute after:size-11 after:content-['']"
                >
                  <Plus size={20} strokeWidth={1.5} aria-hidden="true" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
