import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Price } from "@/components/ui/Price";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { ButtonLink } from "@/components/ui/Button";
import { LoafGlyph } from "@/components/ui/LineArt";

/**
 * ThreeDoors — DESIGN.md §12.32.
 *
 * Twenty-three SKUs is not overload by itself, but a visitor who has never
 * eaten shokupan, cannot read the names and arrives with no goal will stall.
 * The fix is not a smaller menu — it is a smaller FIRST DECISION, with the
 * full grid one tap away.
 *
 * **Each door is named twice**, and that double-naming is the whole remedy for
 * unfamiliarity: a plain-English role ("The Loaf"), then the real name with a
 * sensory line ("Milk Shokupan. Pull-apart, cloud-soft.").
 *
 * Rules: exactly three doors — not four, not a carousel. The escape hatch
 * below is mandatory and is never de-emphasised. It is not a category filter
 * and must not reuse the category colours.
 */

export type Door = {
  /** The plain-English role: "The Loaf" / "The Sweet One" / "The Box". */
  role: string;
  /** The real product name. */
  name: string;
  kana?: string | null;
  /** One sensory sentence. */
  sensory: string;
  price: number;
  href: string;
  image?: { src: string } | null;
};

export function ThreeDoors({
  doors,
  heading = "New here? Start with one of three.",
  lead = "Everything is eggless. Everything is baked the morning it goes out.",
  escapeHref = "/shop/all",
  escapeLabel = "Or browse all 23 bakes →",
  className,
}: {
  /** Exactly three. A fourth is a violation of §12.32. */
  doors: [Door, Door, Door] | Door[];
  heading?: React.ReactNode;
  lead?: React.ReactNode;
  escapeHref?: string;
  escapeLabel?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-display-md text-ink-800">{heading}</h2>
      <p className="mt-3 max-w-[62ch] text-body text-ink-600">{lead}</p>

      <div className="mt-10 grid gap-4 min-[900px]:grid-cols-3">
        {doors.slice(0, 3).map((door) => (
          <Link
            key={door.role}
            href={door.href}
            className={cn(
              "group flex flex-col rounded-md border border-paper-300 bg-paper-0 p-6",
              "transition-[transform,box-shadow] duration-[var(--dur-fast)]",
              "ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-lift",
            )}
          >
            <span
              data-surface="well"
              className="grid aspect-4/3 w-full place-items-center overflow-hidden bg-paper-200"
            >
              {door.image ? (
                <Image
                  src={door.image.src}
                  alt=""
                  width={640}
                  height={480}
                  sizes="(min-width: 900px) 33vw, 90vw"
                  className="w-[64%] object-contain drop-shadow-[0_18px_24px_rgba(4,33,47,0.35)] transition-transform duration-[var(--dur-fast)] group-hover:scale-103 motion-reduce:transform-none"
                />
              ) : (
                <LoafGlyph size={120} className="opacity-70" />
              )}
            </span>

            <span className="mt-6 flex items-baseline justify-between gap-4">
              <span className="font-display text-display-sm text-ink-800">
                {door.role}
              </span>
              <Price amount={door.price} />
            </span>

            <span className="mt-3 block text-body text-ink-600">
              {door.name}. {door.sensory}
            </span>
            <KanaLabel kana={door.kana} className="mt-1" />
          </Link>
        ))}
      </div>

      {/* Mandatory escape hatch, never de-emphasised. */}
      <div className="mt-8 flex justify-center">
        <ButtonLink href={escapeHref} variant="ghost" size="md">
          {escapeLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
