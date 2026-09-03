import * as React from "react";
import { PullQuote } from "@/components/pages/content/Prose";

/**
 * The journal — site-content.md, Section: Journal (`/journal`).
 *
 * "From the van. Notes on bread, the route, and what didn't rise."
 * 250–700 words, one photograph, one link to a product, no listicles.
 *
 * A journal post is dated and never updated, which is the whole difference
 * from a guide. Two are written; the rest are commissioned and say so in the
 * copy, in the reader's own words, rather than hiding behind a code comment.
 * A post with no date has not been published — it is an outline standing where
 * the piece will go.
 */

export type JournalBody = {
  standfirst: string;
  /** ISO with +05:30, per lib/format.ts. Null on a post that is not written. */
  published: string | null;
  state: "published" | "commissioned";
  /** What is still missing, in the reader's words. Required on a draft. */
  draftNote?: string;
  image: {
    src: string;
    alt: string;
    caption: string;
    credit: string;
    /** CSS object-position. Set it where a centre crop loses the subject. */
    focus?: string;
  };
  body: React.ReactNode;
  productSlugs: string[];
  related: { href: string; label: string }[];
};

export const JOURNAL_BODIES: Record<string, JournalBody> = {
  "why-eggless": {
    standfirst:
      "Egg is a non-vegetarian ingredient under Indian labelling rules, so eggless is easy to claim. Keeping the crumb without it is the part that took months.",
    published: "2026-07-11T09:00:00+05:30",
    state: "published",
    image: {
      src: "/images/stock/hero/shokupan-crust-close-warm.jpg",
      alt: "A close view of a soft milk loaf, crust and crumb in warm light.",
      caption: "No egg in it. The texture is the argument.",
      credit: "",
    },
    productSlugs: ["milk-shokupan", "japanese-marble-bread"],
    related: [
      { href: "/guides/what-is-shokupan", label: "What is shokupan" },
      { href: "/about", label: "Our story" },
      { href: "/product/milk-shokupan", label: "Milk Shokupan" },
    ],
    body: (
      <>
        <p>
          Start with the easy part. Under Indian food labelling rules, egg
          counts as a non-vegetarian ingredient. So a green vegetarian mark on a
          packet here already means no egg. Anyone who has spent years reading
          the mark on the back of a biscuit packet knows this. We are not
          claiming anything unusual by baking without eggs. Plenty of Indian
          bakeries do.
        </p>
        <p>The hard part is texture, and nobody talks about that.</p>
        <p>
          Egg does specific work in a milk bread. It carries fat and water into
          the crumb, it helps the structure set as the loaf bakes, and it is a
          large part of why a good shokupan feels the way it does. Take it out
          and the usual result is a loaf that is drier, tighter, and slightly
          mean. Most eggless milk breads are a compromise, and you can taste the
          compromise.
        </p>
        <p>
          Getting the same crumb without it means changing everything else. A
          wetter dough. A longer, cooler fermentation. Shaping by hand, in small
          batches, because a wet dough does not behave in a machine. It took
          months of loaves that were nearly right before one was actually right,
          and more than 300 first-time tasters worked through the menu before
          the van ran a single route.
        </p>
        <PullQuote>
          We are not asking for credit for what we left out. We are asking you
          to notice what is still there.
        </PullQuote>
        <p>
          Every one of our 23 items is eggless. Not a range, not a line. All of
          it.
        </p>
      </>
    ),
  },

  "why-23-items": {
    standfirst:
      "More than 300 first-time tasters worked through everything before the van ran a route. This is what survived, and why the menu stays short.",
    published: "2026-07-25T09:00:00+05:30",
    state: "published",
    image: {
      src: "/images/stock/hero/bakery-counter-wide-pastry-display.jpg",
      alt: "A bakery counter with a small, tightly arranged range of breads.",
      caption: "Twenty-three. Not because it is a target, because it is what held.",
      credit: "Photograph: Elisha Terada",
    },
    productSlugs: ["milk-shokupan", "custard-an-pan", "seoul-spice", "fruit-sando"],
    related: [
      { href: "/shop/all", label: "All 23 bakes" },
      { href: "/journal/why-eggless", label: "Why eggless" },
      { href: "/about", label: "Our story" },
    ],
    body: (
      <>
        <p>
          The obvious way to open a bakery is to make a long menu and let people
          choose. It is also the fastest way to bake sixty mediocre things.
          Every extra item is another dough, another proof time, another tray in
          an oven that has a fixed number of trays, and another decision at
          4am that somebody has to get right while doing eleven other jobs.
        </p>
        <h2>What the tasting phase actually did</h2>
        <p>
          Before the van ran a route, more than 300 first-time tasters worked
          through the menu. That was not a marketing exercise. It was a way of
          finding out which items people described accurately when asked a day
          later, and which ones they had to be reminded of. The second group did
          not make it.
        </p>
        <p>
          It also settled the shokupan. An eggless milk loaf was the thing most
          likely to disappoint, and it was the thing we most needed to be
          right, so it took the most rounds. Everything else on the menu is
          downstream of that loaf: the sandos are made from it, the anpan share
          its dough family, the toasts are it, sliced.
        </p>
        <h2>Why it stays short</h2>
        <p>
          A van has a finite amount of space and a route has a finite amount of
          time. A short menu means every item on board is one we bake often
          enough to bake well, and it means a sold-out sign is a real signal
          rather than a stock error. It also means we can tell you honestly what
          is in the van on a Saturday afternoon, which is the only claim on this
          site that has to hold up in person.
        </p>
        <PullQuote>
          Twenty-three items is not modesty. It is the number that survived
          being tasted by strangers.
        </PullQuote>
        <p>
          The menu will grow, slowly, through weekly specials — an item runs as
          a special, and if it earns its tray it stays. That is the only route
          in.
        </p>
      </>
    ),
  },

  "a-day-on-the-route": {
    standfirst:
      "From the first mix to the last stop, with real timestamps. What a day at a moving bakery in Bengaluru actually looks like.",
    published: null,
    state: "commissioned",
    draftNote:
      "This one is being written from the kitchen's own clock, not from memory. Until we have logged a full day properly — the first mix, the shaping, the load, every stop — there is nothing here worth reading. A post about timestamps with invented timestamps would be the worst piece on this site.",
    image: {
      src: "/images/stock/van-and-city/delivery-van-blossom-street-morning.jpg",
      alt: "A small delivery van parked on a quiet street in the early morning.",
      caption: "The route starts long after the bake does.",
      credit: "Photograph: JavyGo",
    },
    productSlugs: ["milk-shokupan"],
    related: [
      { href: "/van", label: "Where the van is" },
      { href: "/journal", label: "The rest of the journal" },
    ],
    body: (
      <>
        <p>
          The shape of the piece is fixed. It runs from the first mix of the
          morning to the last stop of the afternoon, in order, with the real
          time beside each step — the point being that most of the work happens
          before anybody sees a loaf, and the route is the short part of the
          day.
        </p>
        <p>
          What it needs before it can go up is a properly logged day. Not a
          reconstruction. We would rather leave this page as an outline than
          publish a schedule the kitchen does not actually run to.
        </p>
      </>
    ),
  },

  "how-to-eat-a-fruit-sando": {
    standfirst:
      "Crustless milk bread, whipped cream, fruit arranged so the cut face shows. When to eat it, how to cut it, and why it does not keep.",
    published: null,
    state: "commissioned",
    draftNote:
      "Commissioned, not written. The useful version of this needs a photographer and one sando cut in front of them, and the honest keeping time — which is also the answer we are still waiting on for the storage guide.",
    image: {
      src: "/images/stock/lifestyle/berry-cream-pastry-plated.jpg",
      alt: "A cream and berry pastry plated in soft daylight.",
      caption: "The cut face is the whole point of the format.",
      credit: "Photograph: Cosmin Ursea",
    },
    productSlugs: ["fruit-sando", "strawberry-cream-fruit-sando", "custard-cream-fruit-sando"],
    related: [
      { href: "/guides/what-is-shokupan", label: "What is shokupan" },
      { href: "/shop", label: "This week's bake" },
    ],
    body: (
      <>
        <p>
          A fruit sando is crustless milk bread, whipped cream and fruit,
          assembled so that the cut face shows a pattern. It is a Japanese
          convenience-store staple and it is the item on our menu people are
          least sure what to do with, which is exactly why it needs a piece
          rather than a product description.
        </p>
        <p>
          The three things it has to answer: cut it cold and with a hot knife,
          eat it the same day, and do not put it in the fridge overnight
          expecting it to survive. We can say all three. What we cannot say yet
          is the honest number of hours, and that is the part the piece is
          waiting on.
        </p>
      </>
    ),
  },
};
