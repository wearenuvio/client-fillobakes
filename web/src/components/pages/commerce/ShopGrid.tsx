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
 * Two layouts of the same controls. Below 1024 the categories are a sticky
 * scrolling tab strip under the header and search and sort sit in a row above
 * the grid — the phone shape, where horizontal space is the scarce thing.
 * From 1024 all of it collapses into one sticky card down the left: search,
 * sort, the category list with its counts, and the tag filters. A wide screen
 * has the column to spare, and a list of six categories is faster to read
 * down than across.
 *
 * Changing the category navigates, so a category is always a real URL that can
 * be linked, shared and indexed. The tag filters are client state: they cut
 * across categories and are not worth a route each.
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

/** The four cuts people actually ask for. `savory` is the tag's spelling. */
const TAGS = [
  { id: "sweet", label: "Sweet" },
  { id: "savory", label: "Savoury" },
  { id: "spicy", label: "Spicy" },
  { id: "nuts", label: "Contains nuts" },
] as const;

type TagId = (typeof TAGS)[number]["id"];

export function ShopGrid({
  items,
  tabs = [],
  activeTab = "all",
}: {
  items: ShopItem[];
  tabs?: ShopTab[];
  activeTab?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<Sort>("popular");
  const [tags, setTags] = React.useState<TagId[]>([]);

  /**
   * The tags and the search box are ranking conditions, not gates.
   *
   * A hard filter answers "show me only the sweet ones" by deleting the other
   * nineteen bakes off the page, which is the wrong answer to a question
   * nobody quite asked — someone tapping "Sweet" is browsing, not excluding.
   * So every product gets a score (one point per condition it satisfies, two
   * extra when the search words are in its actual name), the matches come
   * first in the chosen sort order, and everything else stays on the page
   * behind a "More bakes" rule. The category is the one hard filter, because
   * that one is a route and the URL has already promised it.
   */
  const conditionCount = tags.length + (query.trim() ? 1 : 0);
  const filtering = conditionCount > 0;

  const { matched, rest } = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    const byChosenSort = (a: ShopItem, b: ShopItem) => {
      if (sort === "price-asc") return a.product.price - b.product.price;
      if (sort === "price-desc") return b.product.price - a.product.price;
      return rank(a) - rank(b);
    };

    if (!filtering) return { matched: [...items].sort(byChosenSort), rest: [] };

    const scored = items.map((item) => ({ item, score: score(item, q, tags) }));
    const hit = scored.filter((s) => s.score > 0);
    const miss = scored.filter((s) => s.score === 0);

    return {
      matched: hit
        .sort((a, b) => b.score - a.score || byChosenSort(a.item, b.item))
        .map((s) => s.item),
      rest: miss.map((s) => s.item).sort(byChosenSort),
    };
  }, [items, query, sort, tags, filtering]);

  function toggleTag(tag: TagId) {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    );
  }

  function clearConditions() {
    setQuery("");
    setTags([]);
  }

  /** "6 matches · Clear", under the filters and above the grid. */
  const matchLine = filtering ? (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <p aria-live="polite" className="text-body-sm text-muted">
        {matched.length} {matched.length === 1 ? "match" : "matches"}
      </p>
      <button
        type="button"
        onClick={clearConditions}
        className="link-underline text-body-sm font-semibold text-accent"
      >
        Clear
      </button>
    </div>
  ) : null;

  const searchField = (
    <SearchField id="shop-search" value={query} onChange={setQuery} />
  );
  const sortField = <SortField value={sort} onChange={setSort} />;

  return (
    <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-10">
      {/* -------- Phone and tablet: one row above the grid ------------- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:hidden">
        <div className="order-2 shrink-0 sm:order-1">{sortField}</div>
        <div className="order-1 w-full sm:order-2 sm:max-w-[300px]">
          {searchField}
        </div>
      </div>

      {/* -------- Desktop: the sticky control card --------------------- */}
      <aside className="hidden lg:sticky lg:top-24 lg:block">
        <div className="rounded-lg border border-line bg-card p-5">
          {searchField}
          <div className="mt-4">{sortField}</div>

          {tabs.length > 0 ? (
            <nav aria-label="Categories" className="mt-6 border-t border-line pt-5">
              <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                Kinds
              </p>
              <ul className="mt-3">
                {tabs.map((tab) => {
                  const active = tab.slug === activeTab;
                  return (
                    <li key={tab.slug}>
                      <button
                        type="button"
                        onClick={() => router.push(tab.href)}
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 py-2 pl-3 text-left text-body-sm",
                          "border-l-2 transition-colors duration-[var(--dur-base)]",
                          active
                            ? "border-accent font-semibold text-accent"
                            : "border-transparent text-ink-2 hover:border-line hover:text-ink",
                        )}
                      >
                        {tab.label}
                        <span
                          className={cn(
                            "tabular text-[13px]",
                            active ? "text-accent" : "text-muted",
                          )}
                        >
                          {tab.count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}

          <div className="mt-6 border-t border-line pt-5">
            <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              Filter
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const on = tags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      "inline-flex h-8 items-center rounded-pill border px-3 text-[13px]",
                      "transition-colors duration-[var(--dur-base)]",
                      on
                        ? "border-accent bg-accent font-semibold text-on-accent"
                        : "border-line text-ink-2 hover:border-ink hover:text-ink",
                    )}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
            {matchLine ? <div className="mt-4">{matchLine}</div> : null}
          </div>
        </div>
      </aside>

      {/* -------- Grid --------------------------------------------------
          2-up on a phone and a tablet, 3-up at every desktop width. The
          control card takes 260px out of the row, and three larger wells
          beside it read better than four cramped ones — the well is the
          product's photograph, and shrinking it to gain a column is a bad
          trade on a page whose whole job is showing the bakes. */}
      <div className="mt-6 lg:mt-0">
        {matchLine ? <div className="mb-6 lg:hidden">{matchLine}</div> : null}

        {matched.length > 0 ? (
          <Grid items={matched} />
        ) : (
          <p className="text-body-lg text-ink-2">
            Nothing matches that — but everything we bake is still below.
          </p>
        )}

        {rest.length > 0 ? (
          <>
            {/* The rest of the menu, still on the page. Someone who filtered
                to "Spicy" has not asked us to hide the bread. */}
            <div className="mt-12 flex items-center gap-4">
              <span className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                More bakes
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            </div>
            <div className="mt-6 opacity-[0.82]">
              <Grid items={rest} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function Grid({ items }: { items: ShopItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
      {items.map((item, i) => (
        <ProductCard
          key={item.product.slug}
          product={{ ...item.product, href: `/product/${item.product.slug}` }}
          stock={{ soldOut: item.soldOut, left: item.left }}
          priority={i < 3}
        />
      ))}
    </div>
  );
}

/**
 * One point for each condition the product satisfies, plus two more when the
 * search words are in the name itself — "curry" typed into the box should put
 * Kyoto Curry above a bake that merely carries the tag.
 */
function score(item: ShopItem, q: string, tags: readonly string[]): number {
  const { product } = item;
  let total = 0;

  for (const tag of tags) if (product.tags.includes(tag)) total += 1;

  if (q) {
    const name = product.name.toLowerCase();
    const haystack = `${name} ${product.shortDescription} ${product.tags.join(" ")}`.toLowerCase();
    if (haystack.includes(q)) total += 1;
    if (name.includes(q)) total += 2;
  }

  return total;
}

/* -------------------------------------------------------------------------- */
/* The two controls, shared by both layouts                                   */
/* -------------------------------------------------------------------------- */

function SearchField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="relative">
      <Search
        size={17}
        strokeWidth={1.5}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
      />
      <label htmlFor={id} className="sr-only">
        Search the menu
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search the menu"
        className={cn(
          "h-11 w-full rounded-pill border border-line bg-card pr-4 pl-11",
          "text-body-sm text-ink placeholder:text-muted",
          "transition-colors duration-[var(--dur-base)] hover:border-ink",
          "focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none",
        )}
      />
    </div>
  );
}

/**
 * Sort stays a real `<select>` — a phone gets its own wheel and a keyboard
 * gets type-ahead for free — but nothing about it is left to the browser to
 * draw. `appearance-none` strips the platform chrome, the pill and the ground
 * match the tabs, and the chevron is the same Lucide line as everywhere else.
 */
function SortField({
  value,
  onChange,
}: {
  value: Sort;
  onChange: (next: Sort) => void;
}) {
  return (
    <div className="relative">
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
        value={value}
        onChange={(e) => onChange(e.target.value as Sort)}
        className={cn(
          "h-11 w-full appearance-none rounded-pill border border-line bg-card",
          "pr-10 pl-[4.4rem] text-body-sm font-medium text-ink",
          "transition-colors duration-[var(--dur-base)] hover:border-ink",
          "focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none",
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
  );
}

/** "Most ordered": the customer favourites first, then catalogue order. */
function rank(item: ShopItem): number {
  const favourite = item.product.badges.includes("bestseller") ? 0 : 1;
  const signature = item.product.badges.includes("signature") ? -1 : 0;
  return favourite + signature;
}

/**
 * The sticky tab strip, phone and tablet only. Full-bleed so its hairline runs
 * the width of the window, horizontally scrollable with a fade at the right
 * edge, and every pill is 44px tall so a thumb can hit it. From 1024 the
 * categories live in the control card instead.
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
    <div className="sticky top-16 z-[calc(var(--z-sticky)-1)] border-b border-line bg-paper/95 backdrop-blur-[10px] lg:hidden">
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
          className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-linear-to-l from-paper via-paper/80 to-paper/0"
        />
      </div>
    </div>
  );
}
