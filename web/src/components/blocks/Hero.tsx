import * as React from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/cn";
import { Kicker } from "@/components/ui/Rule";
import { RingSeal } from "@/components/ui/Stamp";

/**
 * Hero — DESIGN.md §12.3 (variant A) and §12.4 (variant B).
 *
 * Never both variants on one page. Never a 6/6 split — the hero is 7/5 or 5/7
 * (§8, asymmetry rule).
 *
 * Variant A, "Paper hero": paper-50 with grain, no photo, no gradient. Left
 * 7/12 is type; right 5/12 is a product cutout with a contact shadow. The ring
 * seal sits at the column boundary, overlapping.
 *
 * Variant B, "Full-bleed statement": a warm photograph, radius-xl with a 32px
 * inset at desktop, edge-to-edge on mobile, `min(78vh, 720px)` tall. Buttons
 * here — and ONLY here — take the pill on-photo variant.
 */

export function HeroPaper({
  kicker,
  headline,
  lead,
  actions,
  /** Two nano lines beside a leaf and a vertical hairline. */
  proof = ["100% vegetarian & eggless", "Baked fresh every morning"],
  image,
  imageAlt = "",
  showSeal = true,
  className,
}: {
  kicker?: React.ReactNode;
  headline: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  proof?: [string, string] | string[];
  image?: { src: string } | null;
  imageAlt?: string;
  showSeal?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative bg-paper-50 pt-[var(--section-y)] pb-[var(--section-y-lg)]",
        className,
      )}
    >
      <div className="container-content grid gap-12 lg:grid-cols-12 lg:gap-6">
        {/* -------- Columns 1–7: the type ------------------------------- */}
        <div className="lg:col-span-7">
          {kicker ? <Kicker>{kicker}</Kicker> : null}
          <h1 className="mt-4 text-display-2xl text-ink-800">{headline}</h1>
          {lead ? (
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">{lead}</p>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}

          {/* Proof lockup, pinned to the column's bottom. */}
          <div className="mt-12 flex items-center gap-4">
            <Leaf size={20} strokeWidth={1.5} aria-hidden="true" className="text-kiln" />
            <span className="h-8 w-px bg-paper-400" aria-hidden="true" />
            <span className="nano space-y-0.5 text-ink-500">
              <span className="block">{proof[0]}</span>
              <span className="block">{proof[1]}</span>
            </span>
          </div>
        </div>

        {/* -------- Columns 8–12: the cutout, oversized and cropped ----- */}
        <div className="relative lg:col-span-5">
          {image ? (
            <Image
              src={image.src}
              alt={imageAlt}
              width={1200}
              height={1200}
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="mx-auto w-full max-w-[520px] object-contain drop-shadow-[0_18px_24px_rgba(4,33,47,0.35)] lg:max-w-none lg:scale-115"
            />
          ) : null}

          {showSeal ? (
            <span className="absolute bottom-0 -left-6 hidden lg:block">
              <RingSeal size={132} />
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function HeroStatement({
  eyebrow,
  headline,
  /** The display-italic crumb sub-phrase that breaks the baseline (mb-6). */
  collision,
  claim,
  actions,
  image,
  imageAlt = "",
  className,
}: {
  eyebrow?: React.ReactNode;
  headline: React.ReactNode;
  collision?: React.ReactNode;
  claim?: React.ReactNode;
  actions?: React.ReactNode;
  image: { src: string };
  imageAlt?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative md:px-8", className)}>
      <div className="relative h-[min(78vh,720px)] overflow-hidden md:rounded-xl">
        <Image
          src={image.src}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* A bottom-up scrim only — never a flat translucent panel (§10.2). */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(to_top,rgba(4,33,47,0.55),transparent)]"
        />

        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          {eyebrow ? <p className="nano text-paper-0">{eyebrow}</p> : null}
          <h1 className="relative mt-4 text-display-2xl text-paper-0">
            {headline}
            {collision ? (
              <span className="absolute -bottom-[0.35em] left-1/2 -translate-x-1/2 font-display text-[40%] italic text-crumb">
                {collision}
              </span>
            ) : null}
          </h1>
          {actions ? (
            <div className="mt-12 flex flex-wrap justify-center gap-3">{actions}</div>
          ) : null}
        </div>

        {claim ? (
          <p className="absolute bottom-6 left-6 max-w-[36ch] text-left text-body-sm text-paper-0">
            {claim}
          </p>
        ) : null}
      </div>
    </section>
  );
}
