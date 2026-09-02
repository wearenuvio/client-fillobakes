import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A stock lifestyle photograph inside an editorial column — DESIGN.md §10.2
 * and §10.5.
 *
 * The aspect ratio is fixed by the caller and reserved by the wrapper, so a
 * photograph can never shift the text under it while it loads. `sizes` is
 * required rather than optional: an unsized `fill` image downloads the 2400px
 * original on a 375px screen, which is the single most common way an image
 * ruins a content page.
 */
export function EditorialImage({
  src,
  alt,
  caption,
  credit,
  ratio = "3 / 2",
  sizes,
  priority = false,
  rounded = true,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  /** Unsplash is attribution-optional; we credit anyway. */
  credit?: string;
  ratio?: string;
  sizes: string;
  priority?: boolean;
  rounded?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div
        style={{ aspectRatio: ratio }}
        className={cn(
          "relative w-full overflow-hidden bg-paper-200",
          rounded && "rounded-xl",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
      {caption || credit ? (
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          {caption ? (
            <span className="text-caption text-ink-500">{caption}</span>
          ) : null}
          {credit ? <span className="nano text-ink-400">{credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
