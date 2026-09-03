import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import { InkArt } from "@/components/ui/InkArt";

/**
 * Home hero — "big word over crumb photo", printed rather than photographed.
 *
 * A full-bleed frame of the sliced shokupan with one Japanese word set across
 * it. The word is the whole idea: *fuwa fuwa* is what the bread is, and a
 * customer who learns it here has been given something no bakery banner gives
 * them. It is set once and it stays set — the line under it does the
 * translating, which is quieter and does not ask anyone to wait for the
 * headline to change back before they can read it.
 *
 * The photograph is treated rather than presented: sepia, softened contrast,
 * a chocolate vignette and a fine grain, so it sits on the same paper as the
 * rest of the site instead of looking like a stock frame dropped behind type.
 * The grain is on the photo layer only — the type stays crisp.
 *
 * Contrast: every line of type lands in the lower half of a bright frame, so
 * the chocolate scrim is a gradient over the whole picture rather than a band
 * across the foot. A scrim that stops at 45% leaves the word and the gloss
 * sitting on near-white crust at about 2.8:1.
 *
 * LCP: this photograph is the largest paint on the page. It carries
 * `priority`, `sizes="100vw"` and a ~320-byte blur placeholder inlined below,
 * and the section reserves its own height in `min-height`, so the first frame
 * is a warm blur and nothing moves when the full image lands.
 */

/** 10×7 JPEG of the hero frame, inlined so the first paint is never empty. */
const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAHAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAIF/8QAHRAAAgIBBQAAAAAAAAAAAAAAAQIABBEDBRIikf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAXEQEBAQEAAAAAAAAAAAAAAAABAAIR/9oADAMBAAIRAxEAPwCrG41m0mPfkBgDEyTZQkkK/sRBMjMvL//Z";

/**
 * Fine film grain: one tile of fractal noise, repeated, multiplied over the
 * photograph. An SVG filter costs nothing to download and does not need a
 * texture file in `public/`.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function HomeHero() {
  return (
    /* 78vh on a phone, but capped: on a tall handset or a portrait tablet an
       unbounded 78vh pushes the trust strip a full screen down and the hero
       stops being a hero and becomes a wall. */
    <section className="relative isolate flex min-h-[min(78vh,660px)] flex-col overflow-hidden lg:min-h-[clamp(560px,72vh,760px)]">
      {/* -------- The photograph, and its treatment ------------------- */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/stock/hero/shokupan-loaf-sliced-warm-light.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          /* Phone crops into the crumb and the cut face; desktop opens out
             to the whole board. Sepia and the softened contrast are the
             vintage part; the lifted blacks come from the cream wash below,
             because `brightness` would wash the highlights out with them. */
          className="object-cover object-[62%_46%] lg:object-[50%_44%] [filter:sepia(0.25)_contrast(0.95)_saturate(0.9)]"
        />
        {/* Lifted blacks. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[color:var(--color-paper)] opacity-[0.07]"
        />
        {/* Vignette. */}
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, rgb(43 27 18 / 0) 42%, rgb(43 27 18 / 0.35) 100%)",
          }}
        />
        {/* Grain. Multiplied, and only over the photograph — the type layer
            sits above this and stays clean. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.08] mix-blend-multiply"
          style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat" }}
        />
      </div>

      {/* -------- Scrim ---------------------------------------------
          One gradient over the whole frame rather than a band across the
          foot. The stops below hold cream at 4.5:1 or better everywhere a
          line of type actually lands, and the bread still reads warm. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgb(43 27 18 / 0.78) 0%, rgb(43 27 18 / 0.64) 45%, rgb(43 27 18 / 0.42) 78%, rgb(43 27 18 / 0.30) 100%)",
        }}
      />

      {/* -------- Corner stalks -------------------------------------
          Two mirrored stalks in the outer corners, in the margin outside the
          content column so they never come near a word, and inset from every
          edge so nothing is cut. */}
      <InkArt
        name="wheat-stalk"
        tone="light"
        width={32}
        fit="contain"
        opacity={0.55}
        hideOnPhone={false}
        sizes="32px"
        className="top-6 left-1 h-[90px] w-[21px] lg:top-8 lg:left-4 lg:h-[140px] lg:w-[32px]"
      />
      <InkArt
        name="wheat-stalk"
        tone="light"
        width={32}
        fit="contain"
        opacity={0.55}
        hideOnPhone={false}
        sizes="32px"
        className="right-1 bottom-6 h-[90px] w-[21px] -scale-100 lg:right-4 lg:bottom-8 lg:h-[140px] lg:w-[32px]"
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
            <span lang="ja" className="font-[family-name:var(--font-kana)]">
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
            <Stamp lines={["100% eggless", "baked daily"]} size={72} tone="on-choc" />
          </span>
        </div>
      </div>
    </section>
  );
}
