"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/blocks/ProductCard";

/**
 * The shop grid — DESIGN-v2 §3 Shop.
 *
 * Grid first. Sticky category tabs, a search field and a sort control, then
 * products. No route switcher, no area nag, no three doors: what goes on which
 * van is a cart-drawer and checkout question in v2, and the catalogue is never
 * gated behind it.
 *
 * Changing the tab navigates, so a category is always a real URL that can be
 * linked, shared and indexed.
 */

export type ShopTab = { slug: string; label: string; href: string; count: number };

export type ShopItem = {
  product: Product;
  soldOut: boolean;
  left: number | null;
};

type Sort = "popular" | "price-asc" | "price-desc";

const SORTS: { value: Sort; label: string }[] = [
  { value: "popular", label: "Most ordered" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

export function ShopGrid({ items }: { items: ShopItem[] }) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<Sort>("popular");

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? items.filter(
          (item) =>
            item.product.name.toLowerCase().includes(q) ||
            item.product.shortDescription.toLowerCase().includes(q) ||
            item.product.tags.some((t) => t.toLowerCase().includes(q)),
        )
      : items;

    if (sort === "popular") {
      return [...filtered].sort((a, b) => rank(a) - rank(b));
    }
    return [...filtered].sort((a, b) =>
      sort === "price-asc"
        ? a.product.price - b.product.price
        : b.product.price - a.product.price,
    );
  }, [items, query, sort]);

  return (
    <>
      {/* -------- Search and sort --------------------------------------
          The sort stays a real <select> — a phone should get its own wheel and
          a keyboard should get type-ahead for free — but nothing about it is
          left to the browser to draw. `appearance-none` strips the platform
          chrome, the pill radius and the paper ground match the tabs above it,
          and the chevron is the same Lucide line as everywhere else. */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="relative order-2 shrink-0 sm:order-1">
          <label htmlFor="shop-sort" className="sr-only">
            Sort by
          </label>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[12px] font-medium tracking-[0.12em] text-muted uppercase"
          >
            Sort
          </span>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={cn(
              "h-11 w-full appearance-none rounded-pill border border-line bg-card",
              "pr-10 pl-[4.4rem] text-body-sm font-medium text-ink",
              "transition-colors duration-[var(--dur-base)] hover:border-ink",
              "focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none",
              "sm:w-auto",
            )}
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted"
          />
        </div>

        <div className="relative order-1 w-full sm:order-2 sm:max-w-[300px]">
          <Search
            size={17}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
          />
          <label htmlFor="shop-search" className="sr-only">
            Search the menu
          </label>
          <input
            id="shop-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the menu"
            className={cn(
              "h-11 w-full rounded-pill border border-line bg-card pr-4 pl-11",
              "text-body-sm text-ink placeholder:text-muted",
              "transition-colors duration-[var(--dur-base)] hover:border-ink",
              "focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none",
            )}
          />
        </div>
      </div>

      {/* -------- Grid -------------------------------------------------- */}
      {visible.length === 0 ? (
        <p className="mt-16 text-body-lg text-ink-2">
          Nothing matches “{query.trim()}”. Try a shorter word, or{" "}
          <button
            type="button"
            onClick={() => setQuery("")}
            className="link-underline font-semibold text-accent"
          >
            see everything
          </button>
          .
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {visible.map((item, i) => (
            <ProductCard
              key={item.product.slug}
              product={{
                ...item.product,
                href: `/product/${item.product.slug}`,
              }}
              stock={{ soldOut: item.soldOut, left: item.left }}
              priority={i < 4}
            />
          ))}
        </div>
      )}
    </>
  );
}

/** "Most ordered": the customer favourites first, then catalogue order. */
function rank(item: ShopItem): number {
  const favourite = item.product.badges.includes("bestseller") ? 0 : 1;
  const signature = item.product.badges.includes("signature") ? -1 : 0;
  return favourite + signature;
}

/**
 * The sticky tab strip. Full-bleed so its hairline runs the width of the
 * window, horizontally scrollable on a phone with a fade at the right edge,
 * and every pill is 44px tall so a thumb can hit it.
 */
export function ShopTabs({
  tabs,
  activeTab = "all",
}: {
  tabs: ShopTab[];
  activeTab?: string;
}) {
  const router = useRouter();

  return (
    <div className="sticky top-16 z-[calc(var(--z-sticky)-1)] border-b border-line bg-paper/95 backdrop-blur-[10px] lg:top-[72px]">
      <div className="relative">
        <div className="scroll-rail container-content gap-2 py-3">
          {tabs.map((tab) => {
            const active = tab.slug === activeTab;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => router.push(tab.href)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "inline-flex h-11 items-center gap-1.5 rounded-pill border px-4 text-body-sm",
                  "transition-colors duration-[var(--dur-base)] whitespace-nowrap",
                  active
                    ? "border-accent bg-accent font-semibold text-on-accent"
                    : "border-line bg-card text-ink-2 hover:border-ink hover:text-ink",
                )}
              >
                {tab.label}
                <span
                  className={cn("tabular", active ? "opacity-70" : "text-muted")}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        {/* The fade tells a thumb there is more to the right. It ends on
            `paper/0` rather than `transparent`: interpolating a colour to
            keyword transparent runs through a grey midpoint and leaves a dirty
            band across the pills. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-linear-to-l from-paper via-paper/80 to-paper/0 lg:hidden"
        />
      </div>
    </div>
  );
}
