import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { ShopShell } from "@/components/pages/commerce/ShopShell";
import { getCategories, getCategory } from "@/lib/catalog";

type Params = { params: Promise<{ category: string }> };

/**
 * One page per category — the same grid as `/shop` with its tab pre-selected.
 *
 * Only categories that actually resolve to items are generated: the live
 * site's empty "Weekly Specials" tab is the bug this rule exists to prevent,
 * and an empty category page is the same bug with a URL attached.
 */
export function generateStaticParams() {
  return getCategories()
    .filter((c) => c.count > 0)
    .map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const record = getCategory(category);
  if (!record) return buildMetadata(`/shop/${category}`);
  return buildMetadata(`/shop/${category}`, {
    title: `${record.label} — ${record.count} eggless bakes | Fillo Bakes`,
    description: record.description,
  });
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const record = getCategory(category);
  if (!record || record.count === 0) notFound();

  const path = `/shop/${record.slug}`;

  return (
    <>
      <JsonLd
        path={path}
        crumbs={[
          { name: "Shop", path: "/shop" },
          { name: record.label, path },
        ]}
      />
      <ShopShell
        heading={record.label}
        count={record.count}
        lead={record.description}
        products={record.products}
        activeTab={record.slug}
      />
    </>
  );
}
