"use client";

import * as React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { Price } from "@/components/ui/Price";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { LoafGlyph } from "@/components/ui/LineArt";
import { cn } from "@/lib/cn";
import { getCategories, getProducts, type Product } from "@/lib/catalog";
import { getStockFor } from "@/lib/mock";

export type PickerLines = Record<string, number>;

/**
 * The item picker used by the standing-order builder and by "change what's in
 * it". A sold-out SKU is never hidden or reordered (§12.5) — it stays in the
 * list, says so, and cannot be added to a plan we know we cannot bake.
 */
export function ItemPicker({
  lines,
  onChange,
  categories,
  className,
}: {
  lines: PickerLines;
  onChange: (next: PickerLines) => void;
  /** Restrict the list, e.g. loaves and buns for the builder's first step. */
  categories?: string[];
  className?: string;
}) {
  const products = React.useMemo(() => {
    const all = getProducts();
    return categories?.length
      ? all.filter((p) => categories.includes(p.category))
      : all;
  }, [categories]);

  const groups = React.useMemo(() => {
    const byCategory = new Map<string, Product[]>();
    for (const product of products) {
      const list = byCategory.get(product.category) ?? [];
      list.push(product);
      byCategory.set(product.category, list);
    }
    return getCategories()
      .filter((c) => byCategory.has(c.slug))
      .map((c) => ({ category: c, items: byCategory.get(c.slug) ?? [] }));
  }, [products]);

  function setQty(slug: string, qty: number) {
    const next = { ...lines };
    if (qty <= 0) delete next[slug];
    else next[slug] = Math.min(5, qty);
    onChange(next);
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {groups.map(({ category, items }) => (
        <div key={category.slug}>
          <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
            {category.label}
          </p>
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {items.map((product) => {
              const qty = lines[product.slug] ?? 0;
              const stock = getStockFor(product.slug);
              const soldOut = stock?.state === "sold_out";
              return (
                <li key={product.slug} className="flex items-center gap-4 py-3">
                  <span
                    data-surface="well"
                    className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md bg-well"
                  >
                    {product.image ? (
                      <Image
                        src={product.image.src}
                        alt=""
                        width={120}
                        height={120}
                        sizes="48px"
                        className={cn(
                          product.image.kind === "cutout"
                            ? "w-[76%] object-contain cutout-sm"
                            : "size-full object-cover",
                          soldOut && "opacity-60 grayscale-[.6]",
                        )}
                      />
                    ) : (
                      <LoafGlyph size={28} className="text-muted opacity-60" />
                    )}
                  </span>

                  {/* Name and price share the flexible column: at 375 there
                      is not room for three, and a truncated product name is
                      the one thing this list cannot afford. */}
                  <span className="min-w-0 flex-1">
                    <span className="block text-body-sm font-semibold text-ink">
                      {product.name}
                    </span>
                    <span className="mt-0.5 flex items-baseline gap-2">
                      <Price amount={product.price} size="sm" />
                      <KanaLabel kana={product.kana} />
                    </span>
                  </span>

                  <span className="shrink-0 text-right">
                    {soldOut ? (
                      <span className="text-body-sm text-muted">Sold out</span>
                    ) : qty > 0 ? (
                      <QtyStepper
                        qty={qty}
                        onIncrement={() => setQty(product.slug, qty + 1)}
                        onDecrement={() => setQty(product.slug, qty - 1)}
                        max={5}
                        label={product.name}
                        className="ml-auto"
                      />
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Plus size={16} strokeWidth={1.5} />}
                        iconPosition="leading"
                        onClick={() => setQty(product.slug, 1)}
                      >
                        Add
                      </Button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** "1 Milk Shokupan, 2 Custard An Pan" from a picker map. */
export function describeLines(lines: PickerLines): string {
  const products = getProducts();
  const parts: string[] = [];
  for (const product of products) {
    const qty = lines[product.slug];
    if (qty) parts.push(`${qty} ${product.name}`);
  }
  return parts.join(", ");
}

export function linesTotal(lines: PickerLines): number {
  return getProducts().reduce(
    (sum, product) => sum + (lines[product.slug] ?? 0) * product.price,
    0,
  );
}

export function lineCount(lines: PickerLines): number {
  return Object.values(lines).reduce((a, b) => a + b, 0);
}
