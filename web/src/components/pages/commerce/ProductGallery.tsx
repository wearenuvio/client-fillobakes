"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Stamp } from "@/components/ui/Stamp";
import { LoafGlyph } from "@/components/ui/LineArt";
import type { ProductImage } from "@/lib/images";

/**
 * The PDP gallery: one square well and a row of thumbnails beneath it.
 *
 * The well is the product's home in this system (§10.1) — paper-200, no
 * radius, the cutout at ~58% with the contact shadow. Sold out desaturates
 * the art and nothing else; running out is not an error.
 */
export function ProductGallery({
  images,
  alt,
  soldOut = false,
  bakedToday = false,
  className,
}: {
  images: ProductImage[];
  alt: string;
  soldOut?: boolean;
  bakedToday?: boolean;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const active = images[Math.min(index, images.length - 1)];

  return (
    <div className={className}>
      <div
        data-surface="well"
        className="relative grid aspect-square w-full place-items-center overflow-hidden bg-paper-200"
      >
        {active ? (
          <Image
            key={active.src}
            src={active.src}
            alt={alt}
            width={1000}
            height={1000}
            priority
            sizes="(min-width: 1024px) 620px, 100vw"
            className={cn(
              active.kind === "cutout"
                ? "w-[62%] object-contain drop-shadow-[0_18px_24px_rgba(4,33,47,0.35)]"
                : "size-full object-cover",
              soldOut && "opacity-70 grayscale",
            )}
          />
        ) : (
          <LoafGlyph size={200} className="opacity-70" />
        )}

        {bakedToday && !soldOut ? (
          <span className="pointer-events-none absolute top-4 right-4">
            <Stamp size={72} />
          </span>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="mt-3 flex gap-3" role="list">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index ? "true" : undefined}
                aria-label={`${alt}, view ${i + 1} of ${images.length}`}
                className={cn(
                  "grid size-20 place-items-center overflow-hidden bg-paper-100",
                  "border transition-colors duration-[var(--dur-fast)]",
                  i === index
                    ? "border-ink-800"
                    : "border-transparent hover:border-ink-600",
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  width={160}
                  height={160}
                  sizes="80px"
                  className={
                    image.kind === "cutout"
                      ? "w-[72%] object-contain"
                      : "size-full object-cover"
                  }
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
