import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import type { ProductImage } from "@/lib/images";

/**
 * Home hero — DESIGN-v2 §3.1, hero option A ("floating cutout on cream").
 *
 * Two columns at 1.1/.9. Left: the one script line, one display headline, one
 * paragraph, one accent button and one ghost link. Right: the shokupan cutout
 * tilted −6° with a drop shadow, floating on a 6s loop, a scatter of crumbs
 * around it and the seal pressed into the bottom-right.
 *
 * The image is the LCP element and carries `priority`.
 */

/** Crumbs: x/y in %, size in px, opacity. Scattered, never symmetric. */
const CRUMBS = [
  { x: 13, y: 30, s: 11, o: 0.55, r: 18 },
  { x: 21, y: 46, s: 7, o: 0.45, r: -22 },
  { x: 30, y: 19, s: 8, o: 0.4, r: 40 },
  { x: 42, y: 9, s: 6, o: 0.32, r: 12 },
  { x: 79, y: 20, s: 9, o: 0.5, r: -12 },
  { x: 90, y: 44, s: 12, o: 0.42, r: 26 },
  { x: 71, y: 79, s: 8, o: 0.4, r: -34 },
  { x: 52, y: 88, s: 6, o: 0.3, r: 8 },
];

export function HomeHero({
  image,
  imageAlt,
}: {
  image: ProductImage | null;
  imageAlt: string;
}) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <span aria-hidden="true" className="lineart" />
      <div className="container-content">
        <div className="hero-stage grid items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-8">
          {/* -------- The voice ------------------------------------- */}
          <div>
            <p className="script">Baked fresh, eggless.</p>
            <h1 className="mt-3 text-display-1 text-ink lg:max-w-[13ch]">
              Japanese milk bread, to your door.
            </h1>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-2">
              Pillowy shokupan, cream-filled an pan and savoury kare pan, baked
              every morning in Bengaluru.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink
                href="/shop"
                size="lg"
                icon={<ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />}
              >
                See the menu
              </ButtonLink>
              {/* One button on a phone; the ghost link joins it from 480px. */}
              <span className="hidden sm:contents">
                <ButtonLink href="/van" variant="ghost" size="lg">
                  How delivery works
                </ButtonLink>
              </span>
            </div>
          </div>

          {/* -------- The product ----------------------------------- */}
          <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <div className="relative aspect-square">
              {CRUMBS.map((crumb, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    left: `${crumb.x}%`,
                    top: `${crumb.y}%`,
                    width: crumb.s,
                    height: crumb.s * 0.68,
                    opacity: crumb.o,
                    transform: `rotate(${crumb.r}deg)`,
                  }}
                  className="absolute z-1 rounded-[45%] bg-[#C08A4E]"
                />
              ))}

              {image ? (
                <Image
                  src={image.src}
                  alt={imageAlt}
                  width={1000}
                  height={1000}
                  priority
                  sizes="(min-width: 1024px) 46vw, 90vw"
                  data-motion="float"
                  className="absolute inset-0 size-full -rotate-6 object-contain cutout motion-safe:animate-[var(--animate-float)]"
                />
              ) : null}

              <Stamp
                lines={["100% eggless", "baked daily"]}
                size={92}
                className="absolute right-2 bottom-4 z-2 lg:right-6 lg:bottom-6"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
