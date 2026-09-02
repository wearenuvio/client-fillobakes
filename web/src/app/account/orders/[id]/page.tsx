import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { getOrder, getOrderIds, ORDER_STATUS_REFERENCE } from "@/lib/mock";
import { AccountPage } from "@/components/pages/account/AccountPage";
import { OrderDetail } from "@/components/pages/account/OrderDetail";
import { orderInStatus } from "@/components/pages/account/orderStatus";

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return getOrderIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata(`/account/orders/${id}`, {
    title: `Order ${id} | Fillo Bakes`,
    noindex: true,
  });
}

export default async function AccountOrderPage({ params, searchParams }: Params) {
  const { id } = await params;
  const query = await searchParams;
  const base = getOrder(id);
  if (!base) notFound();

  // Eleven statuses live in the fixture's reference list but only three have a
  // real order behind them. `?status=` renders any of the eleven off the same
  // order, without inventing a timestamp for a step it never reached.
  const requested = Array.isArray(query.status) ? query.status[0] : query.status;
  const status =
    requested && ORDER_STATUS_REFERENCE.includes(requested) ? requested : base.status;
  const order = orderInStatus(base, status);

  const path = `/account/orders/${id}`;

  return (
    <>
      <JsonLd
        path={path}
        crumbs={[
          { name: "Account", path: "/account" },
          { name: "Orders", path: "/account/orders" },
          { name: id, path },
        ]}
      />
      <AccountPage h1={`Order ${id}`} kicker="Your orders">
        <OrderDetail order={order} />
      </AccountPage>
    </>
  );
}
