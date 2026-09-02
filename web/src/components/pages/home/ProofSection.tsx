import { Testimonial } from "@/components/blocks/Testimonial";
import { Kicker } from "@/components/ui/Rule";

/**
 * Proof — site-content Home §11, DESIGN.md §12.13.
 *
 * Cut from the old site's eight quotes to three. The first few reviews do
 * almost all the trust work; eight identical five-star quotes read as
 * manufactured.
 *
 * No star average and no review count, because there is no counted number
 * behind either. No rating row on the quotes for the same reason, and no
 * inline "rate us" widget — a rating with no order attached collects noise.
 * Review collection belongs to the post-delivery WhatsApp message.
 */

const REVIEWS = [
  {
    quote:
      "The shokupan was fabulous, just melt in the mouth delicious. With bread like that, who needs cake.",
    name: "Riya S.",
  },
  {
    quote:
      "The dessert strudels are unreal. Orchard Melt is comfort food at its finest.",
    name: "Neha P.",
  },
  {
    quote:
      "Beautiful flavours, not overly greasy, and very filling. Will definitely order again.",
    name: "Aman K.",
  },
];

export function ProofSection() {
  return (
    <div>
      <Kicker>Proof</Kicker>
      <h2 className="mt-4 text-display-lg text-ink-800">
        What people said
      </h2>

      <div className="mt-12 grid gap-12 lg:grid-cols-3 lg:gap-6">
        {REVIEWS.map((review) => (
          <Testimonial
            key={review.name}
            quote={review.quote}
            name={review.name}
            meta=""
          />
        ))}
      </div>

      <p className="micro mt-12 border-t border-t-paper-300 pt-4 text-ink-500">
        * Carried over from the old site. We are confirming the areas and the
        dates before we print them.
      </p>
    </div>
  );
}
