"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { EmptyState } from "@/components/ui/EmptyState";
import { WheatGlyph } from "@/components/ui/LineArt";
import { Rule } from "@/components/ui/Rule";
import { CategoryChips, CategoryRail } from "@/components/blocks/CategoryFilter";
import { ProductCard, ProductGrid } from "@/components/blocks/ProductCard";
import { AreaLaneSheet } from "@/components/blocks/AreaLaneSheet";
import { useToast } from "@/components/ui/Toast";
import { RunSwitcher } from "@/components/pages/commerce/RunSwitcher";
import { StickyCartBar } from "@/components/pages/commerce/StickyCartBar";
import { ThreeDoorsModule } from "@/components/pages/commerce/ThreeDoorsModule";
import type { Door } from "@/components/blocks/ThreeDoors";
import type {
  CategoryView,
  ItemView,
  RunView,
} from "@/components/pages/commerce/types";
import { getProductBySlug, type Product } from "@/lib/catalog";
import { useSessionStore, useSessionHydrated } from "@/store/session";

/**
 * The shop board: run switcher, filters, search and the contact-sheet grid.
 *
 * Shared by /shop (run-aware), /shop/all (the whole catalogue with an
 * availability badge per card) and /shop/[category].
 *
 * Two rules from the copy spec are enforced structurally rather than by
 * discipline: a category tab that resolves to zero items is never rendered
 * (the server hands us only non-empty categories), and a sold-out card is
 * never hidden, reordered or removed from the grid — it sits exactly where it
 * would otherwise sit, in the muted state ProductCard already knows.
 */

export type ShopMode = "run" | "all" | "category";

type Sort = "popular" | "price-asc" | "price-desc";

const TAG_FILTERS = [
  { id: "sweet", label: "Sweet" },
  { id: "savory", label: "Savoury" },
  { id: "spicy", label: "Spicy" },
  { id: "nuts", label: "Contains nuts" },
  { id: "same-day", label: "Same-day only" },
  { id: "under-150", label: "Under ₹150" },
] as const;

type TagId = (typeof TAG_FILTERS)[number]["id"];

const SORTS: { id: Sort; label: string }[] = [
  { id: "popular", label: "Most ordered" },
  { id: "price-asc", label: "Price low to high" },
  { id: "price-desc", label: "Price high to low" },
];

export function ShopBoard({
  mode,
  runs,
  areaRuns,
  items,
  categories,
  initialRunId,
  initialCategory = "all",
  doors,
  catalogueCount,
}: {
  mode: ShopMode;
  runs: RunView[];
  /** Area name -> the run id that serves it. */
  areaRuns: Record<string, string>;
  items: ItemView[];
  categories: CategoryView[];
  initialRunId: string;
  initialCategory?: string;
  /** Only /shop shows the three doors, and only on a first visit. */
  doors?: Door[];
  /** The whole catalogue, for the "All" chip's count. */
  catalogueCount: number;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [runId, setRunId] = React.useState(initialRunId);
  const [runPicked, setRunPicked] = React.useState(false);
  const [category, setCategoryState] = React.useState(initialCategory);

  // On a category page the tabs are navigation, not a filter, so the URL and
  // the H1 never disagree with the grid underneath them.
  const setCategory = React.useCallback(
    (next: string) => {
      if (mode === "category") {
        router.push(next === "all" ? "/shop/all" : `/shop/${next}`);
        return;
      }
      setCategoryState(next);
    },
    [mode, router],
  );
  const [query, setQuery] = React.useState("");
  const [tags, setTags] = React.useState<TagId[]>([]);
  const [sort, setSort] = React.useState<Sort>("popular");
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const hydrated = useSessionHydrated();
  const area = useSessionStore((s) => s.area);
  const areaStatus = useSessionStore((s) => s.areaStatus);
  const lane = useSessionStore((s) => s.lane);

  // Once the session knows where the van meets this person, the board shows
  // their run rather than the soonest one anywhere. A manual switch wins.
  React.useEffect(() => {
    if (runPicked || !hydrated) return;
    const next =
      lane === "home_delivery" ? "home_delivery" : area ? areaRuns[area] : undefined;
    if (next && runs.some((r) => r.id === next)) setRunId(next);
  }, [hydrated, area, lane, areaRuns, runs, runPicked]);

  const run = runs.find((r) => r.id === runId) ?? runs[0];

  const categoryItems = React.useMemo(
    () => [
      { slug: "all", label: "All", count: catalogueCount },
      ...categories.map((c) => ({ slug: c.slug, label: c.label, count: c.count })),
    ],
    [categories, catalogueCount],
  );

  // Resolved on the client only, so the server render never guesses an area.
  const areaSet = hydrated && Boolean(area) && areaStatus !== "unset";

  const { onRun, offRun } = React.useMemo(() => {
    const matches: { product: Product; item: ItemView }[] = [];
    const off: { product: Product; item: ItemView }[] = [];
    const q = query.trim().toLowerCase();

    for (const item of items) {
      const product = getProductBySlug(item.slug);
      if (!product) continue;
      if (category !== "all" && product.category !== category) continue;
      if (
        q &&
        !`${product.name} ${product.shortDescription} ${product.tags.join(" ")}`
          .toLowerCase()
          .includes(q)
      ) {
        continue;
      }
      if (!tags.every((tag) => matchesTag(product, tag))) continue;

      if (mode === "run" && !item.runs.includes(run.id)) {
        off.push({ product, item });
      } else {
        matches.push({ product, item });
      }
    }

    const sorted = [...matches].sort((a, b) => {
      if (sort === "price-asc") return a.product.price - b.product.price;
      if (sort === "price-desc") return b.product.price - a.product.price;
      const aBest = a.product.badges.includes("bestseller") ? 0 : 1;
      const bBest = b.product.badges.includes("bestseller") ? 0 : 1;
      return aBest - bBest;
    });

    return { onRun: sorted, offRun: off };
  }, [items, category, query, tags, sort, mode, run.id]);

  function toggleTag(tag: TagId) {
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  }

  function notifyMe(slug: string) {
    const product = getProductBySlug(slug);
    toast({
      message: `Done. You’ll hear before anyone else does${
        product ? ` when the ${product.name} is back` : ""
      }.`,
      tone: "success",
    });
  }

  const filtersActive = tags.length > 0 || query.trim().length > 0;

  return (
    <>
      {/* -------- Run switcher ------------------------------------------- */}
      {mode === "run" ? (
        <div className="mt-8">
          <p className="micro mb-3 text-ink-500">Which run</p>
          <RunSwitcher
            runs={runs}
            value={runId}
            onChange={(next) => {
              setRunPicked(true);
              setRunId(next);
            }}
          />
          <RunHeader run={run} />
        </div>
      ) : null}

      {/* -------- Area banner, when we cannot answer "on your route" ------ */}
      {mode === "run" && hydrated && !areaSet ? (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-md bg-paper-200 p-4">
          <MapPin size={20} strokeWidth={1.5} aria-hidden="true" className="text-ink-800" />
          <p className="min-w-0 flex-1 text-body-sm text-ink-600">
            Set your area to see what&rsquo;s on your route.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setSheetOpen(true)}>
            Set your area
          </Button>
        </div>
      ) : null}

      {/* -------- Three doors, first visit only --------------------------- */}
      {doors && doors.length === 3 ? (
        <ThreeDoorsModule doors={doors} className="mt-16" />
      ) : null}

      {/* -------- Search ------------------------------------------------- */}
      <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="md:max-w-80 md:flex-1">
          <label htmlFor="shop-search" className="sr-only">
            Search the menu
          </label>
          <Input
            id="shop-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the menu"
            leadingIcon={<Search size={20} strokeWidth={1.5} aria-hidden="true" />}
          />
        </div>

        <div className="flex items-center gap-3 md:ml-auto">
          <label htmlFor="shop-sort" className="micro shrink-0 text-ink-500">
            Sort
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={cn(
              "h-11 rounded-sm border border-paper-400 bg-paper-0 px-3 text-body-sm text-ink-800",
              "transition-colors duration-[var(--dur-fast)] hover:border-ink-500 focus:border-ink-800 focus:outline-none",
            )}
          >
            {SORTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* -------- Tag filters -------------------------------------------- */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {TAG_FILTERS.map((filter) => {
          const active = tags.includes(filter.id);
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggleTag(filter.id)}
              className={cn(
                "micro inline-flex h-9 items-center rounded-sm px-4 whitespace-nowrap",
                "transition-colors duration-[var(--dur-fast)]",
                active
                  ? "border border-transparent bg-ink-800 text-paper-0"
                  : "border border-paper-300 text-ink-600 hover:border-ink-600 hover:text-ink-800",
              )}
            >
              {filter.label}
            </button>
          );
        })}
        {filtersActive ? (
          <button
            type="button"
            onClick={() => {
              setTags([]);
              setQuery("");
            }}
            className="link-underline ml-1 inline-flex h-9 items-center gap-1 text-body-sm text-ink-700"
          >
            <X size={16} strokeWidth={1.5} aria-hidden="true" />
            Clear
          </button>
        ) : null}
      </div>

      {/* -------- Rail + grid --------------------------------------------- */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,200px)_minmax(0,1fr)] lg:gap-12">
        {/* min-w-0: without it the grid item's automatic minimum size is the
            category rail's max-content, which sized the column to ~760px and
            gave the whole page a horizontal scrollbar at 375. */}
        <div className="min-w-0 lg:pt-1">
          <CategoryRail
            items={categoryItems}
            value={category}
            onChange={setCategory}
            className="hidden lg:block"
          />
          <CategoryChips
            items={categoryItems}
            value={category}
            onChange={setCategory}
            className="lg:hidden"
          />
          <p className="mt-6 hidden max-w-[36ch] text-caption text-ink-500 lg:block">
            {categories.find((c) => c.slug === category)?.description ??
              "Everything we bake, in catalogue order."}
          </p>
        </div>

        <div className="min-w-0">
          {onRun.length > 0 ? (
            <ProductGrid>
              {onRun.map(({ product, item }, index) => (
                <div key={product.slug} className="flex flex-col">
                  <ProductCard
                    product={{ ...product, href: `/product/${product.slug}` }}
                    rowIndex={Math.floor(index / 4)}
                    priority={index < 4}
                    stock={{ soldOut: item.soldOut, left: item.left }}
                    onNotifyMe={notifyMe}
                  />
                  {mode !== "run" ? (
                    <p className="micro mt-2 text-ink-500">{item.availability}</p>
                  ) : null}
                </div>
              ))}
            </ProductGrid>
          ) : (
            <EmptyState
              title="We don’t bake that — yet."
              body="Here’s what’s in the van this week."
              glyph={<WheatGlyph size={96} />}
              action={
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setQuery("");
                    setTags([]);
                    setCategory("all");
                  }}
                >
                  See the whole menu
                </Button>
              }
            />
          )}

          {/* -------- Not on this run, kept visible and never hidden ------ */}
          {offRun.length > 0 ? (
            <div className="mt-16">
              <Rule
                label="Not on this run"
                trailing={`${offRun.length} MORE`}
                tone="strong"
              />
              <ul className="mt-4 divide-y divide-paper-300">
                {offRun.map(({ product, item }) => {
                  const elsewhere = runs.find(
                    (r) => r.id !== run.id && item.runs.includes(r.id),
                  );
                  return (
                    <li
                      key={product.slug}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${product.slug}`}
                          className="link-underline text-body font-semibold text-ink-600"
                        >
                          {product.name}
                        </Link>
                        <KanaLabel kana={product.kana} />
                      </div>
                      <Price amount={product.price} size="sm" muted />
                      {elsewhere ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRunPicked(true);
                            setRunId(elsewhere.id);
                          }}
                        >
                          {elsewhere.lane === "home_delivery"
                            ? "On home delivery"
                            : `On ${elsewhere.nextDayLabel ?? "the next"}'s ${elsewhere.shortName} run`}
                        </Button>
                      ) : (
                        <Badge variant="outline">Not this week</Badge>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {mode === "run" ? (
            <div className="mt-16 flex justify-center">
              <ButtonLink href="/shop/all" variant="ghost" size="md">
                See everything we bake →
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </div>

      <StickyCartBar />
      <AreaLaneSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

function matchesTag(product: Product, tag: TagId): boolean {
  if (tag === "under-150") return product.price < 150;
  if (tag === "nuts") {
    return product.allergens.contains.includes("nuts") || product.tags.includes("nuts");
  }
  return product.tags.includes(tag);
}

/**
 * The run header (site-content, /shop §1): the day, the place and the window
 * in one line, then where it stops, then the cut-off stated once.
 *
 * It lives on the client because the switcher moves it. There is deliberately
 * no bake counter: `vanState.ovenCapacity` is null and its TBC note says not
 * to publish a cap the kitchen cannot honour, and DESIGN.md §12.27 is explicit
 * that a manufactured count is worse than none. The real per-SKU counts do
 * appear — on the cards, where they came from.
 */
function RunHeader({ run }: { run: RunView }) {
  const headline =
    run.lane === "home_delivery"
      ? ["Home delivery", run.nextDateLabel, "two-hour windows"]
          .filter(Boolean)
          .join(" · ")
      : [
          run.nextDayLabel ? `The ${run.nextDayLabel} bake` : run.routeName,
          run.shortName,
          run.bandLabel,
        ]
          .filter(Boolean)
          .join(" · ");

  return (
    <div className="mt-6">
      <p className="font-display text-display-sm text-ink-800 tabular">{headline}</p>
      <p className="mt-2 text-body-sm text-ink-600">
        {run.lane === "home_delivery"
          ? "To your door, in a two-hour window you choose."
          : run.stops.map((s) => s.name).join(" · ")}
      </p>
      <p className="mt-2 text-body-sm text-ink-800">{run.cutoffLine}</p>
    </div>
  );
}
