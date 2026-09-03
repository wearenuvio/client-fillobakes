import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A photograph inside an editorial column.
 *
 * The ratio is fixed by the caller and reserved by the wrapper, so a picture
 * can never shift the text under it while it loads. `sizes` is required
 * rather than optional: an unsized `fill` image downloads the 2400px original
 * on a 375px screen, which is the commonest way an image ruins a page.
 */
export function EditorialImage({
  src,
  alt,
  caption,
  credit,
  ratio = "3 / 2",
  /** CSS object-position, where a centre crop would lose the subject. */
  focus,
  sizes,
  priority = false,
  rounded = true,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  ratio?: string;
  focus?: string;
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
          "relative w-full overflow-hidden bg-well",
          rounded && "rounded-lg",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={focus ? { objectPosition: focus } : undefined}
          className="object-cover"
        />
      </div>
      {caption || credit ? (
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          {caption ? (
            <span className="text-body-sm text-ink-2">{caption}</span>
          ) : null}
          {credit ? <span className="text-body-sm text-muted">{credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
