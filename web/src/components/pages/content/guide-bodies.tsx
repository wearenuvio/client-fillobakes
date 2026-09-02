import * as React from "react";
import { PullQuote } from "@/components/pages/content/Prose";

/**
 * The four guides — site-content.md, Section: Guides.
 *
 * A guide is undated, maintained, and linked from every product it explains.
 * Guide 1 is written in full in the content spec and is reproduced here
 * verbatim; the other three are written to the same brief.
 *
 * `how-to-store-shokupan` is a food-safety page and cannot be published until
 * the founders supply real storage times. It renders as a guide with the
 * safe part written and the unsafe part named as missing — a gap, never a
 * guess (DECISIONS §10).
 */

export type GuideBody = {
  standfirst: string;
  /** "Maintained" or the reason it is not published in full. */
  state: "maintained" | "part-published";
  stateNote?: string;
  image: { src: string; alt: string; caption: string; credit: string };
  body: React.ReactNode;
  /** Product slugs and pages this guide is the explainer for. */
  productSlugs: string[];
  related: { href: string; label: string }[];
};

export const GUIDE_BODIES: Record<string, GuideBody> = {
  "what-is-shokupan": {
    standfirst:
      "Japan's everyday loaf, written 食パン. Fine crumb, thin crust, and slices that pull apart in sheets rather than crumbling.",
    state: "maintained",
    image: {
      src: "/images/stock/hero/white-loaf-sliced-golden-crust.jpg",
      alt: "A pale milk loaf, part-sliced, showing a fine even crumb.",
      caption: "Torn, not sliced. The crumb is the whole argument.",
      credit: "Photograph: Laura Ockel",
    },
    productSlugs: [
      "milk-shokupan",
      "japanese-marble-bread",
      "blue-pea-bread",
      "chocolate-shokupan",
    ],
    related: [
      { href: "/shokupan", label: "Buy shokupan" },
      { href: "/journal/why-eggless", label: "Why eggless" },
      { href: "/guides/how-to-store-shokupan", label: "How to keep it" },
    ],
    body: (
      <>
        <p>
          Shokupan is written 食パン. It means, roughly, eating bread — the loaf
          you keep in the house rather than the one you buy for an occasion. In
          Japan it is the default bread, the way pav or a sliced white loaf is
          the default here.
        </p>
        <p>
          It looks simple and it is not. The crumb is fine and even. The crust
          is thin. A slice pulls apart in sheets rather than crumbling, and it
          holds a shape under butter, jam or a sandwich filling without going to
          pieces. Bakers get there through a soft, wet dough, a long
          fermentation, and a lot of attention to temperature. Two shapes are
          traditional: baked with a lid on the tin for a square slice, or
          without one for a domed top.
        </p>
        <p>
          The loaf arrived in Japan in its modern form after the war, when
          American-style soft white bread came with the occupation, and Japanese
          bakers spent the following decades making it theirs. It is now the
          base for most of what a Japanese bakery sells. Cut the crusts off, add
          cream and fruit, and it becomes a fruit sando. Split it, fill it, and
          it becomes an anpan.
        </p>
        <p>
          Ours is made without eggs, which is the part that took the longest.
          Egg is what usually gives a milk loaf its softness and its structure,
          so removing it means finding that softness somewhere else. We found it
          in hydration and in time.
        </p>
        <PullQuote>Tear it, don&rsquo;t slice it. It gives up in soft sheets.</PullQuote>
      </>
    ),
  },

  "an-pan": {
    standfirst:
      "A soft bun with something sweet inside. The original was red bean paste and sold in Ginza from 1875 — ours are filled with cream, and we still call them anpan.",
    state: "maintained",
    image: {
      src: "/images/stock/hero/glazed-sesame-buns-tray-anpan-style.jpg",
      alt: "A tray of glazed, sesame-topped buns cooling in warm light.",
      caption: "The bun is the constant. The filling is where bakeries argue.",
      credit: "Photograph: Amanda Lim",
    },
    productSlugs: [
      "custard-an-pan",
      "choco-an-pan",
      "strawberry-an-pan",
      "pistachio-an-pan",
      "tiramisu-an-pan",
      "cookie-n-cream-an-pan",
      "banana-biscoff-an-pan",
    ],
    related: [
      { href: "/guides/what-is-shokupan", label: "What is shokupan" },
      { href: "/shop/all", label: "The whole menu" },
    ],
    body: (
      <>
        <p>
          An anpan is a soft, enriched bun with a filling sealed inside it. The
          name is a compound: <em>an</em>, the sweet paste, and <em>pan</em>,
          bread. It is one of the first things a Japanese bakery learned to make
          and it is still the thing most of them sell most of.
        </p>
        <h2>Where it came from</h2>
        <p>
          The bun is usually credited to a Tokyo bakery in 1875, which took a
          Western yeasted dough and filled it with the sweet red bean paste
          people already ate. That combination is why it caught on: an
          unfamiliar format carrying a familiar flavour. Everything a bakery
          does after that is a variation on the same move.
        </p>
        <h2>What ours are</h2>
        <p>
          Ours are filled with cream rather than red bean — custard, chocolate,
          pistachio, tiramisu, cookies and cream, banana biscoff, strawberry.
          That is a departure and we would rather name it than quietly redefine
          the word. The bun, the enriched dough, the seal and the soft crumb are
          the anpan part. The filling is ours.
        </p>
        <p>
          They are all eggless, like everything else we bake, which matters more
          in a filled bun than in a plain loaf: the filling is where egg usually
          hides.
        </p>
        <h2>How to eat one</h2>
        <p>
          At room temperature, on the day. Cold from the fridge dulls the cream
          and firms the crumb. If it has been in there, ten minutes out fixes
          most of it.
        </p>
        <PullQuote>
          A familiar flavour in an unfamiliar format is the oldest trick in
          Japanese baking.
        </PullQuote>
      </>
    ),
  },

  "what-is-karepan": {
    standfirst:
      "Curry bread. A Japanese bakery staple since the 1920s: a savoury filling inside a bun, usually crumbed, traditionally fried.",
    state: "maintained",
    image: {
      src: "/images/stock/lifestyle/braided-milk-bread-buns-golden.jpg",
      alt: "Golden, glossy buns cooling on a rack.",
      caption: "Crisp outside, soft inside. That contrast is the whole format.",
      credit: "Photograph: Evgeni Tcherkasski",
    },
    productSlugs: ["seoul-spice", "tex-mex-zest"],
    related: [
      { href: "/guides/an-pan", label: "What is an anpan" },
      { href: "/shop", label: "This week's bake" },
    ],
    body: (
      <>
        <p>
          Karepan is curry bread: a savoury filling wrapped in an enriched
          dough, coated in breadcrumbs, and cooked until the outside is crisp
          and the inside is still soft. It has been on Japanese bakery shelves
          since the 1920s, which makes it about as traditional as a bakery item
          gets in a country that adopted bread late.
        </p>
        <h2>Why the crumb coating</h2>
        <p>
          The breadcrumbs are not decoration. They are what keeps a wet filling
          from turning the dough around it to paste, and they are what gives the
          format its one memorable quality: two textures in a single bite. A
          karepan without that contrast is just a filled bun.
        </p>
        <h2>What we do differently</h2>
        <p>
          Ours are eggless, and the fillings are ours rather than a Japanese
          curry: Seoul Spice and Tex Mex Zest are the two on the menu. The
          format is the borrowed part — the dough, the seal, the crumb coat,
          the contrast. The heat is calibrated for people who eat chilli
          regularly, which is most of Bengaluru.
        </p>
        <h2>How to eat one</h2>
        <p>
          Warm, and soon. This is the item on our menu that most rewards being
          eaten within the hour. On day two, a few minutes in a hot oven brings
          the coating back; a microwave will not.
        </p>
      </>
    ),
  },

  "how-to-store-shokupan": {
    standfirst:
      "The honest version: where to keep a milk loaf, where not to, and what we have not measured yet.",
    state: "part-published",
    stateNote:
      "Part-published. The keeping times for Bengaluru conditions are not measured yet, and a guess on a food-safety page is worse than a gap. This page publishes in full when the kitchen has them.",
    image: {
      src: "/images/stock/lifestyle/toast-marmalade-jar-rustic.jpg",
      alt: "A slice of toast with marmalade beside an open jar, in morning light.",
      caption: "Day two is toast. Day three is French toast.",
      credit: "Photograph: Calum Lewis",
    },
    productSlugs: [
      "milk-shokupan",
      "japanese-marble-bread",
      "blue-pea-bread",
      "chocolate-shokupan",
    ],
    related: [
      { href: "/guides/what-is-shokupan", label: "What is shokupan" },
      { href: "/faq", label: "Questions" },
    ],
    body: (
      <>
        <p>
          A milk loaf has no preservatives in it, which is the reason it is
          good and the reason it is brief. Everything below is about slowing
          that down without ruining the crumb.
        </p>
        <h2>Not the fridge</h2>
        <p>
          The fridge is the single worst place for a soft loaf. Bread goes stale
          fastest at fridge temperature — faster than it does on the counter —
          because the starch retrogrades quickest just above freezing. A loaf
          that spends a night in there comes out dry and tight, and no amount of
          toasting brings it back to what it was.
        </p>
        <h2>The counter, sealed</h2>
        <p>
          Room temperature, in the bag it came in, closed, out of direct sun. A
          bread box works. A metal tin works. What matters is that the air
          around it is still and the loaf is not sitting in it uncovered.
        </p>
        <h2>The freezer, if you must</h2>
        <p>
          Slice it first, then freeze it, so you can take out what you need. A
          frozen slice goes straight into the toaster from the freezer. This is
          the only storage method that genuinely stops the clock.
        </p>
        <h2>What we have not published</h2>
        <p>
          How many days a Fillo loaf keeps in Bengaluru, sealed, at room
          temperature — in the heat and in the monsoon, which are different
          answers. We have not run that properly yet, and this is a food-safety
          page, so we are not going to estimate it. What we will say without
          hedging: bread is best on day one, good on day two, and excellent as
          French toast on day three.
        </p>
        <PullQuote>
          A gap on a food-safety page is honest. A guess on one is not.
        </PullQuote>
      </>
    ),
  },
};
