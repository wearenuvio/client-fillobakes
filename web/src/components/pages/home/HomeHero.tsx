import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";

/**
 * Home hero — "big word over crumb photo".
 *
 * A full-bleed photograph of the sliced shokupan with one Japanese word set
 * across it in the display serif. The word is the whole idea: *fuwa fuwa* is
 * what the bread is, and a customer who learns it on the home page has been
 * given something no bakery banner gives them. Everything else on the layer
 * is support — one script line above, one gloss below, one sentence, two
 * buttons, and the two corners.
 *
 * Contrast: the photograph is bright, and every line of type sits in its
 * lower half, so the chocolate scrim is a bottom-anchored gradient rather
 * than a flat wash over the whole frame. A 12% wash over the full image
 * takes the top edge down just far enough for the header hairline to land on
 * it cleanly without dulling the crumb.
 *
 * LCP: this photograph is the largest paint on the page. It carries
 * `priority`, `sizes="100vw"` and a ~320-byte blur placeholder baked in
 * below, so the first frame is a warm blur rather than a hole, and the
 * section reserves its own height in `min-height` so nothing moves when the
 * full image lands.
 */

/** 10×7 JPEG of the hero frame, inlined so the first paint is never empty. */
const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAHAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAIF/8QAHRAAAgIBBQAAAAAAAAAAAAAAAQIABBEDBRIikf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAXEQEBAQEAAAAAAAAAAAAAAAABAAIR/9oADAMBAAIRAxEAPwCrG41m0mPfkBgDEyTZQkkK/sRBMjMvL//Z";

export function HomeHero() {
  return (
    /* 78vh on a phone, but capped: on a tall handset or a portrait tablet an
       unbounded 78vh pushes the trust strip a full screen down and the hero
       stops being a hero and becomes a wall. */
    <section className="relative isolate flex min-h-[min(78vh,660px)] flex-col overflow-hidden lg:min-h-[clamp(560px,72vh,760px)]">
      {/* -------- The photograph ----------------------------------- */}
      <div className="absolute inset-0 -z-20">
        {/* `.photo-warm` wants to be the positioned box itself, so the
            absolute wrapper is a separate element above it. */}
        <div className="photo-warm size-full">
          <Image
            src="/images/stock/hero/shokupan-loaf-sliced-warm-light.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR}
            /* Phone crops into the crumb and the cut face; desktop opens out
               to the whole board. */
            className="object-cover object-[62%_46%] lg:object-[50%_44%]"
          />
        </div>
      </div>

      {/* -------- Scrim ---------------------------------------------
          One gradient over the whole frame rather than a band across the
          foot. The type stack is tall — script, a 200px word, a gloss, a
          sentence and two buttons — and on a loaf this bright a scrim that
          stops at 45% leaves the word and the gloss sitting on near-white
          crust at about 2.8:1. The stops below hold cream at 4.5:1 or better
          everywhere a line of type actually lands, and the bread still reads
          warm through them. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgb(43 27 18 / 0.78) 0%, rgb(43 27 18 / 0.64) 45%, rgb(43 27 18 / 0.42) 78%, rgb(43 27 18 / 0.30) 100%)",
        }}
      />

      {/* -------- The layer ----------------------------------------- */}
      <div className="container-content relative flex w-full flex-1 flex-col justify-end pt-28 pb-7 lg:pb-9">
        <div className="text-center">
          <p className="font-script text-[clamp(20px,2.2vw,26px)] leading-[1.1] font-medium text-on-choc">
            Baked fresh, eggless.
          </p>

          {/* The word, with a hairline running out to both margins. The rules
              are desktop only: at 375 they would be two 8px stubs. */}
          <div className="mt-3 flex items-center justify-center gap-6 lg:mt-4 lg:gap-8">
            <span
              aria-hidden="true"
              className="hidden h-px flex-1 bg-on-choc/35 lg:block"
            />
            <h1 className="text-center font-display text-[clamp(72px,13vw,200px)] leading-[0.86] tracking-[-0.015em] text-on-choc">
              {/* Two lines on a phone, one on everything else. */}
              <span className="block sm:inline">Fuwa</span>{" "}
              <span className="block sm:inline">fuwa</span>
            </h1>
            <span
              aria-hidden="true"
              className="hidden h-px flex-1 bg-on-choc/35 lg:block"
            />
          </div>

          {/* Cream, not the dimmed cream: this is the one line that explains
              the word above it, and it is the smallest type on the layer. */}
          <p className="mt-5 text-[15px] leading-[1.5] text-on-choc">
            <span
              lang="ja"
              className="font-[family-name:var(--font-kana)]"
            >
              ふわふわ
            </span>{" "}
            · the Japanese word for pillowy
          </p>

          <p className="mx-auto mt-5 max-w-[48ch] text-body-lg text-on-choc">
            Japanese milk bread, cream buns and savoury kare pan, baked every
            morning in Bengaluru.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <ButtonLink href="/shop" size="lg">
              See the menu
            </ButtonLink>
            <ButtonLink
              href="/van"
              variant="secondary"
              size="lg"
              className="border-on-choc text-on-choc hover:bg-[rgb(243_234_223_/_0.14)]"
            >
              How delivery works
            </ButtonLink>
          </div>
        </div>

        {/* -------- The two corners --------------------------------- */}
        <div className="mt-10 flex items-end justify-between gap-6 lg:mt-12">
          <p className="text-[13px] leading-[1.5] text-on-choc-2">
            Order by 8pm · at your door tomorrow
          </p>

          {/* Hidden below 480px, where the phone column has no room beside
              the line to its left. The wrapper carries the position: the
              seal's own `relative` would otherwise win over it. */}
          <span className="relative hidden shrink-0 min-[480px]:block">
            <Stamp
              lines={["100% eggless", "baked daily"]}
              size={92}
              tone="on-choc"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
