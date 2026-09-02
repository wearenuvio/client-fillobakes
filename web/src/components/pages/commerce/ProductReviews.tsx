import { Testimonial } from "@/components/blocks/Testimonial";
import { ButtonLink } from "@/components/ui/Button";
import { WheatGlyph } from "@/components/ui/LineArt";
import { whatsappHref } from "@/lib/config";

/**
 * Reviews for this SKU.
 *
 * There is no review data. `mock-data.json` has none, and `seo.json` says in
 * two places that no real per-product reviews exist and that AggregateRating
 * must not be emitted until they do — a fabricated rating is a manual-action
 * risk as well as a lie.
 *
 * So this block ships exactly what is real: the three named quotes the current
 * home page carries (site-content, home §11), attached only to the SKUs they
 * actually name. No count, no average, no star row, and no invented voices.
 * Every other SKU gets the honest empty state and the route by which a real
 * review would arrive.
 *
 * The founders still owe permission and an area/date per quote — logged in
 * PHASE2B-REQUESTS.md.
 */

type Review = {
  slug: string;
  quote: string;
  name: string;
  meta: string;
};

const REVIEWS: Review[] = [
  {
    slug: "milk-shokupan",
    quote:
      "The shokupan was fabulous, just melt in the mouth delicious. With bread like that, who needs cake.",
    name: "Riya S.",
    meta: "BENGALURU",
  },
  {
    slug: "orchard-melt",
    quote:
      "The dessert strudels are unreal. Orchard Melt is comfort food at its finest.",
    name: "Neha P.",
    meta: "BENGALURU",
  },
];

export function ProductReviews({ slug, name }: { slug: string; name: string }) {
  const reviews = REVIEWS.filter((r) => r.slug === slug);

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <span aria-hidden="true" className="block opacity-12">
          <WheatGlyph size={72} />
        </span>
        <p className="text-title text-ink-800">No reviews for this one yet.</p>
        <p className="max-w-[46ch] text-body-sm text-ink-500">
          We ask for them in the WhatsApp message after a delivery, so every review here
          is attached to a real order. Nothing else counts.
        </p>
        <ButtonLink
          href={whatsappHref(`Hi Fillo — I have something to say about the ${name}.`)}
          variant="ghost"
          size="md"
        >
          Message us on WhatsApp
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-12 md:grid-cols-2">
      {reviews.map((review) => (
        <Testimonial
          key={review.name}
          quote={review.quote}
          name={review.name}
          meta={review.meta}
        />
      ))}
    </div>
  );
}
