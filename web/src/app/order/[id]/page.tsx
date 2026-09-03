import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { LoafGlyph } from "@/components/ui/LineArt";
import { ConfirmationPage } from "@/components/pages/commerce/ConfirmationPage";
import {
  CONFIRMATION_ORDER_ID,
  confirmationFallback,
  orderView,
} from "@/components/pages/commerce/confirmation";
import { getOrderIds } from "@/lib/mock";

type Params = { params: Promise<{ id: string }> };

/**
 * Confirmation and live status. noindex, and excluded from the sitemap.
 * Reachable without a login, so it survives being forwarded on WhatsApp.
 */
export function generateStaticParams() {
  return [...getOrderIds(), CONFIRMATION_ORDER_ID].map((id) => ({ id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata(`/order/${id}`, { noindex: true });
}

export default async function OrderPage({ params }: Params) {
  const { id } = await params;
  const path = `/order/${id}`;

  const view =
    id === CONFIRMATION_ORDER_ID ? confirmationFallback() : orderView(id);

  if (!view) {
    return (
      <>
        <JsonLd path={path} crumbs={[{ name: "Order", path }]} />
        <div className="bg-paper">
          <div className="container-narrow py-24 text-center">
            <LoafGlyph size={96} className="mx-auto text-muted opacity-60" />
            <h1 className="mt-6 font-display text-display-2 text-ink">
              We can&rsquo;t find that order.
            </h1>
            <p className="mx-auto mt-4 max-w-[42ch] text-body-lg text-ink-2">
              The link may have been cut short somewhere between here and
              WhatsApp. Send us the number and we will pull it up.
            </p>
            <ButtonLink href="/shop" size="lg" className="mt-8">
              See the menu
            </ButtonLink>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <JsonLd path={path} crumbs={[{ name: "Order", path }]} />
      <ConfirmationPage order={view} />
    </>
  );
}
