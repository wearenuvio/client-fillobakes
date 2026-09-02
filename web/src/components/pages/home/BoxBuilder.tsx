"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { LoafGlyph } from "@/components/ui/LineArt";
import { useToast } from "@/components/ui/Toast";
import { getProducts, getProductBySlug, type Product } from "@/lib/catalog";
import { getBoxes, getStockFor, type Box } from "@/lib/mock";
import { formatINR } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { Est } from "@/components/pages/home/Tbc";

/**
 * Build your own — site-content "Page: Boxes".
 *
 * Six slots and a live total. An empty slot invites a tap; a filled slot shows
 * the bake and a remove control. The saving is stated in rupees and ONLY when
 * it is real — a partly-filled box has no saving, so it does not claim one.
 *
 * A bake that has gone for the week is greyed in the picker and never hidden,
 * which is the same rule the grid follows.
 */

type BuilderBox = Box & { slots?: number; states?: Record<string, string> };

export function BoxBuilder() {
  const builder = getBoxes().find((b) => b.type === "builder") as
    | BuilderBox
    | undefined;
  const slots = builder?.slots ?? 6;
  /** mock-data: "sum_of_items_minus_10_percent" — our design, tagged [Est.]. */
  const discount = 0.1;

  const [picked, setPicked] = React.useState<(string | null)[]>(() =>
    Array.from({ length: slots }, () => null),
  );
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const add = useCartStore((s) => s.add);
  const { toast } = useToast();

  const chosen = picked.filter((slug): slug is string => Boolean(slug));
  const listTotal = chosen.reduce(
    (sum, slug) => sum + (getProductBySlug(slug)?.price ?? 0),
    0,
  );
  const complete = chosen.length === slots;
  const boxTotal = complete ? Math.round(listTotal * (1 - discount)) : listTotal;
  const saving = listTotal - boxTotal;
  const remaining = slots - chosen.length;

  function fill(slug: string) {
    setPicked((current) => {
      const next = [...current];
      const index = next.findIndex((value) => value === null);
      if (index === -1) return current;
      next[index] = slug;
      return next;
    });
    setPickerOpen(false);
  }

  function clear(index: number) {
    setPicked((current) => {
      const next = [...current];
      next[index] = null;
      return next;
    });
  }

  function addBox() {
    for (const slug of chosen) add(slug);
    toast({
      message: `Six bakes are in your box.`,
      tone: "success",
      action: {
        label: "Open the box",
        onClick: () => useCartStore.getState().open(),
      },
    });
    setPicked(Array.from({ length: slots }, () => null));
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
      <div className="lg:col-span-7">
        <ol className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3">
          {picked.map((slug, index) => {
            const product = slug ? getProductBySlug(slug) : undefined;
            return (
              <li key={index} className="relative">
                {product ? (
                  <>
                    <span
                      data-surface="well"
                      className="grid aspect-square w-full place-items-center bg-paper-200"
                    >
                      {product.image ? (
                        <Image
                          src={product.image.src}
                          alt=""
                          width={240}
                          height={240}
                          sizes="140px"
                          className="w-[70%] object-contain drop-shadow-[0_18px_24px_rgba(4,33,47,0.35)]"
                        />
                      ) : (
                        <LoafGlyph size={56} className="opacity-70" />
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => clear(index)}
                      aria-label={`Take ${product.name} out of the box`}
                      className="absolute top-1 right-1 grid size-8 place-items-center rounded-pill bg-paper-0 text-ink-800 transition-colors duration-[var(--dur-fast)] hover:bg-paper-100"
                    >
                      <X size={16} strokeWidth={1.5} aria-hidden="true" />
                    </button>
                    <span className="mt-2 block truncate text-caption text-ink-600">
                      {product.name}
                    </span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    aria-label={`Fill slot ${index + 1}`}
                    className={cn(
                      "grid aspect-square w-full place-items-center border border-dashed border-paper-400",
                      "bg-paper-0 text-ink-500 transition-colors duration-[var(--dur-fast)]",
                      "hover:border-ink-600 hover:text-ink-800",
                    )}
                  >
                    <Plus size={24} strokeWidth={1.5} aria-hidden="true" />
                    <span className="nano mt-1">{index + 1}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* -------- The running total ---------------------------------- */}
      <div className="lg:col-span-4 lg:col-start-9">
        <div className="rounded-md border border-paper-300 bg-paper-0 p-6">
          <p className="micro text-ink-500">Your box</p>

          <p className="mt-3 font-display text-display-sm text-ink-800">
            <span className="tabular">{chosen.length}</span> of{" "}
            <span className="tabular">{slots}</span>
            {chosen.length > 0 ? (
              <>
                {" · "}
                <span className="tabular">{formatINR(boxTotal)}</span>
              </>
            ) : null}
          </p>

          <p className="mt-2 text-body-sm text-ink-600">
            {chosen.length === 0
              ? "Nothing picked yet. Tap a slot."
              : complete
                ? saving > 0
                  ? `The box is done. You save ${formatINR(saving)}.`
                  : "The box is done."
                : remaining === 2
                  ? "Two more and the box is done."
                  : `${formatINR(listTotal)} so far.`}
          </p>

          {complete && saving > 0 ? (
            <p className="micro mt-3 text-ink-500">
              Builder pricing <Est what="The 10% builder discount is our design, not founder-set" />
            </p>
          ) : null}

          <Button
            size="lg"
            fullWidth
            className="mt-6"
            disabled={!complete}
            onClick={addBox}
          >
            Add the box
          </Button>
          {!complete ? (
            <p className="mt-3 text-caption text-ink-500">
              {chosen.length === 0
                ? "Six bakes make a box."
                : `${remaining} more and the box goes on the van.`}
            </p>
          ) : null}
        </div>
      </div>

      <PickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={fill}
      />
    </div>
  );
}

function PickerDialog({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (slug: string) => void;
}) {
  const products = getProducts();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Pick a bake"
      description="Anything on the menu. Mix as you like."
      variant="sheet"
    >
      <ul className="max-h-[50vh] divide-y divide-paper-300 overflow-y-auto">
        {products.map((product) => (
          <PickerRow key={product.slug} product={product} onPick={onPick} />
        ))}
      </ul>
    </Dialog>
  );
}

function PickerRow({
  product,
  onPick,
}: {
  product: Product;
  onPick: (slug: string) => void;
}) {
  const soldOut = getStockFor(product.slug)?.state === "sold_out";

  return (
    <li className="flex items-center gap-3 py-3">
      <span
        data-surface="well"
        className="grid size-12 shrink-0 place-items-center bg-paper-200"
      >
        {product.image ? (
          <Image
            src={product.image.src}
            alt=""
            width={96}
            height={96}
            sizes="48px"
            className={cn("w-[74%] object-contain", soldOut && "opacity-55 grayscale")}
          />
        ) : (
          <LoafGlyph size={28} className="opacity-70" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-sm font-semibold text-ink-800">
          {product.name}
        </span>
        <Price amount={product.price} size="sm" muted={soldOut} />
      </span>

      {soldOut ? (
        <Badge variant="muted">Gone for this week</Badge>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => onPick(product.slug)}>
          Pick
        </Button>
      )}
    </li>
  );
}
