import Image from "next/image";
import { Kicker } from "@/components/ui/Rule";
import { Tbc } from "@/components/pages/home/Tbc";
import { getProductBySlug } from "@/lib/catalog";
import { formatINR } from "@/lib/format";

/**
 * "Why it costs what it costs" — site-content Home §10.
 *
 * Placed after desire and before the price objection hardens. Premium Indian
 * D2C never argues price; it replaces the price conversation with a process
 * conversation, in specifics. So this section is three specifics and no
 * adjectives.
 *
 * The ferment hours and the hydration percentage are design placeholders in
 * the corpus, not measured figures, so they print as placeholders. A spec cell
 * with an invented number would cost more credibility than the blank does.
 */

const KITCHEN_PHOTO = "/images/stock/lifestyle/hands-tearing-bread-minimal.jpg";

export function WhyItCosts() {
  const loaf = getProductBySlug("milk-shokupan");
  const price = loaf ? formatINR(loaf.price) : "";

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
      {/* -------- Columns 1–5: the picture ---------------------------- */}
      <div className="lg:col-span-5">
        <div className="aspect-4/5 overflow-hidden rounded-md bg-paper-200">
          <Image
            src={KITCHEN_PHOTO}
            alt="Two hands pulling a loaf of milk bread apart"
            width={900}
            height={1125}
            sizes="(min-width: 1024px) 440px, 92vw"
            className="size-full object-cover"
          />
        </div>
      </div>

      {/* -------- Columns 7–12: the three specifics -------------------- */}
      <div className="lg:col-span-6 lg:col-start-7">
        <Kicker>The price</Kicker>
        <h2 className="mt-4 text-display-lg text-ink-800">
          Why a loaf is {price}
        </h2>

        <ol className="mt-10 divide-y divide-paper-300 border-t border-t-paper-300">
          <li className="py-6">
            <h3 className="text-title-lg font-sans text-ink-800">The method</h3>
            <p className="mt-2 max-w-[62ch] text-body text-ink-600">
              A <Tbc what="The ferment time" />-hour ferment and a{" "}
              <Tbc what="The hydration percentage" />% hydration dough, mixed and
              shaped by hand in small batches. That is where the crumb comes
              from.
            </p>
          </li>
          <li className="py-6">
            <h3 className="text-title-lg font-sans text-ink-800">
              Eggless, and nobody asked for a discount for it
            </h3>
            <p className="mt-2 max-w-[62ch] text-body text-ink-600">
              Egg is what usually gives a milk bread its softness. Taking it out
              and keeping the texture is the hard part, and it is why the
              shokupan took months to settle. Over 300 first-time tasters worked
              through the menu before the van ran a single route.
            </p>
          </li>
          <li className="py-6">
            <h3 className="text-title-lg font-sans text-ink-800">
              The names are not decoration
            </h3>
            <p className="mt-2 max-w-[62ch] text-body text-ink-600">
              Kyoto Curry. Seoul Spice. Calcutta Blaze. Bangalore Bloom. Each
              one is a city and a flavour, developed on trips and in real
              kitchens.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}
