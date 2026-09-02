import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * A founder placeholder, rendered as one.
 *
 * DECISIONS.md §10: every number on this site is true or clearly mock-tagged.
 * A price the founders have not set is never rounded into a confident number —
 * it is shown with the reason it is provisional, in the same place the number
 * appears.
 */
export function TbcNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("micro text-ink-500", className)}>
      <span className="text-kiln">[TBC]</span> {children}
    </p>
  );
}

/**
 * The two products, stated at the top of both /fillo-plus and /standing-order.
 *
 * They are deliberately not the same thing: "cancel Fillo+" must never be
 * ambiguous between *stop my bread* and *leave the programme* (journey §7).
 */
export function TwoProducts({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-6 border-y border-y-paper-300 py-6 sm:grid-cols-2",
        className,
      )}
    >
      <p className="text-body text-ink-600">
        <Link href="/fillo-plus" className="link-underline font-semibold text-ink-800">
          Fillo+
        </Link>{" "}
        is the free membership, tied to your phone number. You earn coins on
        everything you buy.
      </p>
      <p className="text-body text-ink-600">
        <Link href="/standing-order" className="link-underline font-semibold text-ink-800">
          The Standing Order
        </Link>{" "}
        is the weekly bread, on your route&rsquo;s run. You can have either, or
        both.
      </p>
    </div>
  );
}
