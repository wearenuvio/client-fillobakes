"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { LoafGlyph } from "@/components/ui/LineArt";
import { getProductBySlug } from "@/lib/catalog";
import { getOnBoard } from "@/lib/mock";
import { NotifyDialog } from "@/components/pages/home/NotifyDialog";

/**
 * The sold-out module — site-content Home §6 (sold-out state), DESIGN.md
 * §12.27 and the microcopy library.
 *
 * On a weekly-drop model sold-out is the most-read copy on the site, so it is
 * written best and it gets the page's emotional centre. Three separately
 * written strings in three separate slots — status, cause, promise — and the
 * cause is always NAMED, because scarcity read as demand raises evaluation
 * while scarcity read as an accident does not.
 *
 * It is never styled as an error: no danger colour, no warning tint, nothing
 * greyed but the photograph itself. The menu stays below it, fully visible,
 * so the buyer sees exactly what they missed and what they have not.
 *
 * On a sold-out day the gift card is the only purchase left on the site, so it
 * carries the second button (site-content, /gift-cards).
 */

export function SoldOutBand() {
  const [open, setOpen] = React.useState(false);
  const gone = getOnBoard().find((item) => item.state === "sold_out");
  const product = gone ? getProductBySlug(gone.slug) : undefined;

  if (!gone || !product) return null;

  return (
    <>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
        {/* -------- The thing that is gone, on its well ------------------ */}
        <div className="lg:col-span-5">
          <div
            data-surface="well"
            className="relative grid aspect-square w-full max-w-[420px] place-items-center bg-paper-200"
          >
            <span className="absolute top-3 left-3">
              <Badge variant="muted">Gone this week</Badge>
            </span>
            {product.image ? (
              <Image
                src={product.image.src}
                alt=""
                width={600}
                height={600}
                sizes="(min-width: 1024px) 420px, 80vw"
                className="w-[58%] object-contain opacity-55 grayscale drop-shadow-[0_18px_24px_rgba(4,33,47,0.35)]"
              />
            ) : (
              <LoafGlyph size={140} className="opacity-70" />
            )}
          </div>
          <p className="mt-4 text-title font-sans font-semibold text-ink-800">
            {product.name}
          </p>
          <KanaLabel kana={product.kana} className="mt-1" />
        </div>

        {/* -------- Status, cause, promise ------------------------------- */}
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="text-display-lg text-ink-800">Gone for this week.</h2>
          <p className="mt-5 max-w-[46ch] text-body-lg text-ink-600">
            {product.name} went first on Saturday&rsquo;s run. We bake again
            Saturday, and everything below is still on the van.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" onClick={() => setOpen(true)}>
              Tell me when the van&rsquo;s back out
            </Button>
            <ButtonLink href="/gift-cards" variant="secondary" size="lg">
              Send a gift card instead
            </ButtonLink>
          </div>
          <p className="mt-3 text-caption text-ink-500">
            One message, Sunday morning. Nothing else.
          </p>
        </div>
      </div>

      <NotifyDialog
        open={open}
        onClose={() => setOpen(false)}
        subject={product.name}
      />
    </>
  );
}
