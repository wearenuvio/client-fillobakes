import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import { InkArt } from "@/components/ui/InkArt";
import type { ProductImage } from "@/lib/images";

/**
 * Home hero — DESIGN-v2 §3.1, hero option A ("floating cutout on cream").
 *
 * Two columns at 1.1/.9. Left: the one script line, one display headline, one
 * paragraph, one accent button and one ghost link. Right: the shokupan cutout
 * tilted −6° with a drop shadow, floating on a 6s loop, the drawn crumbs
 * scattered around it and the seal pressed into the bottom-right with a pair
 * of wheat stalks tucked behind it.
 *
 * The crumbs used to be eight CSS ovals. They are now `crumbs-scatter.png`
 * from the hand-drawn set, which reads as part of the same hand as the seal
 * ring instead of as a stray browser dot. It is the lightest file in the set
 * (67KB) and it sits behind the loaf, so it never competes with the product.
 *
 * The loaf is the LCP element and carries `priority`; everything decorative
 * around it is lazy. Nothing here shifts: the stage is a fixed square and both
 * the cutout and the drawings are absolutely positioned inside it.
 */

export function HomeHero({
  image,
  imageAlt,
}: {
  image: ProductImage | null;
  imageAlt: string;
}) {
  return (
    <section className="relative overflow-hidden bg-paper">
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
              {/* Crumbs, behind the loaf. The scatter is drawn at a fixed
                  crumb size, so it is placed three times small rather than
                  once large — stretched across the whole stage the crumbs
                  come out the size of the slices. Two of them stay on a
                  phone; they sit under the product, not beside the words. */}
              <InkArt
                name="crumbs-scatter"
                width={176}
                opacity={0.55}
                hideOnPhone={false}
                className="top-[4%] left-[2%] w-[34%] -rotate-12"
              />
              <InkArt
                name="crumbs-scatter"
                width={150}
                opacity={0.45}
                hideOnPhone={false}
                className="bottom-[8%] left-[-2%] w-[29%] rotate-6 -scale-x-100"
              />
              <InkArt
                name="crumbs-scatter"
                width={132}
                opacity={0.4}
                className="top-[16%] right-[-2%] w-[25%] rotate-[18deg]"
              />

              {image ? (
                <Image
                  src={image.src}
                  alt={imageAlt}
                  width={1000}
                  height={1000}
                  priority
                  sizes="(min-width: 1024px) 46vw, 90vw"
                  data-motion="float"
                  className="absolute inset-0 z-1 size-full -rotate-6 object-contain cutout motion-safe:animate-[var(--animate-float)]"
                />
              ) : null}

              {/* The seal, with the crossed stalks tucked in behind it. */}
              <span className="absolute right-1 bottom-2 z-2 grid place-items-center lg:right-5 lg:bottom-5">
                <InkArt
                  name="wheat-pair"
                  width={132}
                  opacity={0.22}
                  hideOnPhone={false}
                  className="ink-art-fade top-1/2 left-1/2 w-[132px] -translate-x-1/2 -translate-y-1/2 rotate-6"
                />
                <Stamp
                  lines={["100% eggless", "baked daily"]}
                  size={108}
                  className="relative z-1"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
