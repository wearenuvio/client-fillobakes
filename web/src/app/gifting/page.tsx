import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Kicker, Rule } from "@/components/ui/Rule";
import { ButtonLink } from "@/components/ui/Button";
import { getArea, getCutoffCopy } from "@/lib/mock";
import { GiftNotePreview } from "@/components/pages/home/GiftNotePreview";

const PATH = "/gifting";

export const metadata: Metadata = buildMetadata(PATH);

const GIFT_PHOTO = "/images/stock/lifestyle/two-people-sharing-bread-board.jpg";

/**
 * Gifting — site-content "Page: Gifting", journey §3.9.
 *
 * Fillo already owns the date and slot machinery, so a gift is the same order
 * with four differences. The page states the four rather than building a
 * separate flow, and every one of them is a promise about the RECIPIENT'S
 * experience: our messages go to them, the prices do not.
 */
export default function GiftingPage() {
  const whitefield = getArea("whitefield");

  const differences = [
    {
      title: "The delivery contact becomes the recipient",
      body: "Their name and number, not yours. Every message about the box goes to them.",
    },
    {
      title: "Prices are hidden by default",
      body: "The packing slip and every message to them leaves the total out. You can turn that off.",
    },
    {
      title: "The slot picker asks for the Saturday",
      body: "A gift is chosen by date, not by convenience — so the question changes to which Saturday.",
    },
    {
      title: "A note, written on the card by hand",
      body: "140 characters. It goes on the card that sits on the box.",
    },
  ];

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Gifting", path: "/gifting" }]} />

      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <Kicker>Gifting</Kicker>
            <h1 className="mt-4 text-display-xl text-ink-800">
              Send bread to someone
            </h1>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">
              Pick a Saturday, write a note, and we hand it over.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/boxes" size="lg">
                Send a box
              </ButtonLink>
              <ButtonLink href="/gift-cards" variant="ghost" size="lg">
                Or send a gift card →
              </ButtonLink>
            </div>
            <p className="mt-8 text-caption text-ink-500">
              {getCutoffCopy("open")}.
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="aspect-3/2 overflow-hidden rounded-md bg-paper-200 lg:aspect-4/5">
              <Image
                src={GIFT_PHOTO}
                alt="Two people sharing bread across a table"
                width={1200}
                height={1500}
                priority
                sizes="(min-width: 1024px) 440px, 92vw"
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section surface="paper-100">
        <SectionHeader
          kicker="How a gift differs"
          heading="Four things change."
          lead="Everything else is the order you would place for yourself — same van, same run, same morning."
        />
        <ol className="mt-10 grid gap-px overflow-hidden border border-paper-300 bg-paper-300 md:grid-cols-2">
          {differences.map((item, index) => (
            <li key={item.title} className="bg-paper-0 p-6">
              <span className="micro text-ink-500 tabular">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-title-lg font-sans text-ink-800">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[46ch] text-body text-ink-600">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section surface="paper-50">
        <SectionHeader
          kicker="The note"
          heading="140 characters, by hand."
          lead="Write it here to see how it sits on the card. It goes on the box, not in a text message."
        />
        <div className="mt-10">
          <GiftNotePreview />
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <Rule tone="strong" />
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <h2 className="text-display-sm text-ink-800">
              What you hear, and when
            </h2>
            <ul className="mt-6 divide-y divide-paper-300 border-y border-y-paper-300">
              <li className="py-3 text-body text-ink-600">
                We&rsquo;ll message you when it&rsquo;s handed over.
              </li>
              <li className="py-3 text-body text-ink-600">
                Delivered to Anjali at 4:47. She&rsquo;s got it.
              </li>
            </ul>
            <p className="micro mt-3 text-ink-500">
              An example of the message, not a real delivery
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-display-sm text-ink-800">
              If we don&rsquo;t reach them yet
            </h2>
            <p className="mt-4 max-w-[52ch] text-body text-ink-600">
              {whitefield
                ? `${whitefield.answer} A gift card gets there today, and it comes off whatever they order when we do.`
                : "A gift card gets there today, and it comes off whatever they order when we reach them."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/gift-cards" variant="secondary" size="md">
                Send a gift card instead
              </ButtonLink>
              <ButtonLink href="/areas" variant="ghost" size="md">
                See where the van runs →
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
