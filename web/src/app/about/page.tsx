import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { Rule, Kicker } from "@/components/ui/Rule";
import { RingSeal } from "@/components/ui/Stamp";
import { StatsBand } from "@/components/blocks/StatsBand";
import { ButtonLink } from "@/components/ui/Button";
import { LineArtBleed } from "@/components/ui/LineArt";
import { Prose, Lead, Footnote } from "@/components/pages/content/Prose";
import { EditorialImage } from "@/components/pages/content/EditorialImage";
import { HonestSpecList } from "@/components/pages/content/PendingSpecs";
import { SITE, CONTACT } from "@/lib/config";
import { getProducts } from "@/lib/catalog";

const PATH = "/about";

export const metadata: Metadata = buildMetadata(PATH);

/** The six, verbatim from site-content.md — emoji and tick marks removed. */
const HELD_TO = [
  "100% vegetarian Japanese baking. No exceptions in the kitchen.",
  "A fuwa fuwa crumb — pillowy — from hydration, fermentation timing and technique.",
  "Completely eggless, without giving up softness.",
  "Small batch, hand-rolled, baked after your order.",
  "A deliberately short menu: shokupan, karepan, anpan.",
  "Flavours developed on trips to Japan and in real kitchens, not from a flavour catalogue.",
];

/**
 * The timeline is the van's own history, and every entry is a fact the rest of
 * the site already states. Nothing here is a projection.
 */
const TIMELINE = [
  {
    when: "Before the van",
    what: "More than 300 first-time tasters worked through the menu. The shokupan settled into an eggless format because of what came back.",
  },
  {
    when: "December 2025",
    what: `${SITE.founders[0]} and ${SITE.founders[1]} start Fillo Bakes in Bengaluru, operated by ${SITE.legalName}.`,
  },
  {
    when: "The first routes",
    what: "One van, fixed neighbourhood routes, batches baked after the orders come in rather than before.",
  },
  {
    when: "Now",
    what: "Twenty-three items, all of them eggless, on run days that each area's route decides.",
  },
];

export default function AboutPage() {
  const itemCount = getProducts().length;

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Our story", path: PATH }]} />

      {/* 1. Head — 7/5, never 6/6 (§8, asymmetry rule). */}
      <Section surface="paper-50" className="overflow-hidden">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Kicker>Our story</Kicker>
            <h1 className="mt-4 text-display-xl text-ink-800">
              Bread, delivered on a route
            </h1>
            <Lead className="mt-6">
              A moving bakery in Bengaluru. Started December 2025 by{" "}
              {SITE.founders[0]} and {SITE.founders[1]}.
            </Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/shop" size="lg">
                See this week&rsquo;s bake
              </ButtonLink>
              <ButtonLink href="/van" variant="secondary" size="lg">
                Track the van
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <EditorialImage
              src="/images/stock/lifestyle/pastries-cooling-rack-curtain-light.jpg"
              alt="Trays of freshly baked pastries cooling by a window in soft morning light."
              ratio="4 / 5"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
              caption="The bake starts long before the route does."
              credit="Photograph: Iqbal Pohan"
            />
          </div>
        </div>
      </Section>

      {/* 2. Why a van */}
      <Section surface="paper-100" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Rule label="Why a van" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              The bakery moves, so the street doesn&rsquo;t have to
            </h2>
          </div>
          <div className="lg:col-span-7">
            <Prose>
              <p>
                Most of us remember a neighbourhood that smelled of bread in the
                evening. Picking up pav for dinner. Buns for tea. That routine
                disappeared into supermarket shelves and delivery apps.
              </p>
              <p>
                We think fresh bread can be a daily staple again, the way a milk
                subscription already is. The only way to do that is to bring it
                to the street rather than wait for the street to come to us. So
                the bakery moves, on a fixed route, and every batch is baked
                after the orders come in.
              </p>
            </Prose>
            <Footnote>
              Which is also why the site keeps asking where you are. It is the
              one question the whole thing hangs on.
            </Footnote>
          </div>
        </div>
      </Section>

      {/* 3. Six things we hold to — labelled hairline rows. */}
      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Rule label="What we hold to" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              Six things we hold to
            </h2>
            <p className="mt-4 max-w-[46ch] text-body text-ink-600">
              These are the rules the kitchen runs on. None of them has been
              relaxed for a busy week yet.
            </p>
          </div>

          <ol className="lg:col-span-8">
            {HELD_TO.map((line, index) => (
              <li
                key={line}
                className="flex gap-6 border-t border-t-paper-300 py-6 last:border-b last:border-b-paper-300"
              >
                <span className="micro w-8 shrink-0 pt-1 text-ink-400 tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="max-w-[52ch] text-body-lg text-ink-700">
                  {line}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 4. The number that earned its place. */}
      <Section surface="dark" size="lg">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Kicker tone="crumb">Before we sold a loaf</Kicker>
            <h2 className="mt-4 text-display-lg text-paper-0">
              300 people tasted it before you could buy it
            </h2>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-400">
              Before the van ran a single route, more than 300 first-time
              tasters worked through the menu. That is what settled the
              shokupan in an eggless format, and it is why the menu is{" "}
              <span className="tabular">{itemCount}</span> items and not 60.
            </p>
            <p className="mt-6 max-w-[46ch] text-body-sm text-ink-400">
              The dates of that testing phase are not published here yet. We
              have the number and we do not have the calendar, and one without
              the other is still true.
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <StatsBand
              stats={[
                { value: `${itemCount}`, caption: "Items on the menu" },
                { value: "300+", caption: "First-time tasters" },
                { value: "100%", caption: "Eggless, every batch" },
                { value: "1", caption: "Van on the road" },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* 5. What we bake */}
      <Section surface="paper-50" className="overflow-hidden">
        <LineArtBleed glyph="loaf" side="left" size={620} />
        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <EditorialImage
              src="/images/stock/lifestyle/hands-holding-loaf-linen-table.jpg"
              alt="Two hands holding a pale milk loaf over a linen cloth."
              ratio="4 / 5"
              sizes="(min-width: 1024px) 40vw, 100vw"
              caption="Hand-rolled, small batch, baked after the orders come in."
              credit="Photograph: Franzi Meyer"
            />
          </div>

          <div className="lg:col-span-7">
            <Rule label="What we bake" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              A short menu, held to
            </h2>
            <Prose className="mt-6">
              <p>
                Our shokupan is a soft milk loaf that took a long time to get
                right without eggs. Our karepan have a crisp outside and a soft
                inside, with fillings including umami-forward vegetables. Our
                anpan are soft buns filled with fresh cream, from chocolate to
                banana biscoff. Alongside those we bake toasts, pies, strudels
                and seasonal items.
              </p>
              <p>
                A slow-cooked ratatouille karepan appears in our older copy and
                is not on the current menu. Either it comes back as a weekly
                special or the sentence goes — we have not decided, so we are
                not putting it on a product page in the meantime.
              </p>
            </Prose>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/shop/all" variant="secondary">
                All {itemCount} bakes
              </ButtonLink>
              <ButtonLink href="/guides/what-is-shokupan" variant="ghost">
                What is shokupan
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. Timeline */}
      <Section surface="paper-100">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Rule label="How it went" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              Short history of a moving bakery
            </h2>
          </div>
          <ol className="lg:col-span-8">
            {TIMELINE.map((entry) => (
              <li
                key={entry.when}
                className="grid gap-2 border-t border-t-paper-300 py-6 last:border-b last:border-b-paper-300 sm:grid-cols-[10rem_1fr] sm:gap-8"
              >
                <span className="micro pt-1 text-kiln">{entry.when}</span>
                <span className="max-w-[52ch] text-body text-ink-600">
                  {entry.what}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 7. The company + the one seal on this page (§13). */}
      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Rule label="The company" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              Who you are actually buying from
            </h2>

            <HonestSpecList
              className="mt-8"
              specs={[
                { label: "Legal entity", value: SITE.legalName },
                { label: "Registered", value: `${SITE.city}, ${SITE.state}` },
                { label: "Founded", value: "December 2025" },
                { label: "Menu", value: `${itemCount} items, all eggless` },
                { label: "Payments", value: "Razorpay" },
                { label: "FSSAI licence", value: "TBC — awaiting the licence number" },
                { label: "Hours", value: SITE.hoursLabel },
              ]}
              pendingLead="Not on this page yet:"
              claim="Eggless, vegetarian, and made by two people whose names are on the company."
            />

            <p className="mt-8 max-w-[62ch] text-body text-ink-600">
              Questions about any of the above go to{" "}
              <a href={`mailto:${CONTACT.email}`} className="link-underline text-kiln">
                {CONTACT.email}
              </a>{" "}
              or to <span className="tabular">{CONTACT.phone}</span> on
              WhatsApp. Both reach the same two people.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" variant="secondary">
                Talk to us
              </ButtonLink>
              <Link
                href="/franchise"
                className="link-underline inline-flex min-h-11 items-center text-body-sm text-ink-600 hover:text-ink-800"
              >
                Run a route with us
              </Link>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:flex lg:items-center lg:justify-end">
            <RingSeal />
          </div>
        </div>
      </Section>
    </>
  );
}
