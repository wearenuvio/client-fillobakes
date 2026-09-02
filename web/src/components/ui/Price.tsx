import * as React from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";

/**
 * Price — DESIGN-v2 §1: prices are sans, 600, tabular. 18px on a card, 24px
 * on a product page. `₹` with no space before the amount. The v1 display-italic
 * price is gone: it fought the serif headline for attention and lost.
 *
 * Sizes match the places the system actually puts a price:
 *  - `sm`  cart line, compact summaries
 *  - `md`  the ProductCard foot row and the fulfilment lane (default)
 *  - `lg`  the PDP buy block
 *  - `xl`  a subscription plan card's headline amount
 */

export type PriceProps = React.HTMLAttributes<HTMLSpanElement> & {
  amount: number;
  size?: "sm" | "md" | "lg" | "xl";
  /** Sold out and struck-through prices step down to ink-500 (§12.5). */
  muted?: boolean;
  tone?: "ink" | "onDark" | "kiln";
};

const SIZES = {
  sm: "text-body-sm",
  md: "text-body-lg",
  lg: "text-[24px] leading-tight",
  xl: "text-[32px] leading-tight",
} as const;

export function Price({
  amount,
  size = "md",
  muted = false,
  tone = "ink",
  className,
  ...rest
}: PriceProps) {
  return (
    <span
      {...rest}
      className={cn(
        "font-sans font-semibold tabular",
        SIZES[size],
        muted
          ? "text-muted"
          : tone === "onDark"
            ? "text-on-choc"
            : tone === "kiln"
              ? "text-accent"
              : "text-ink",
        className,
      )}
    >
      {formatINR(amount)}
    </span>
  );
}

/** "Free" reads as a price and must sit on the same baseline as one. */
export function FreeLabel({
  size = "md",
  tone = "ink",
  className,
}: {
  size?: PriceProps["size"];
  tone?: PriceProps["tone"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-sans font-semibold",
        SIZES[size ?? "md"],
        tone === "onDark" ? "text-on-choc" : "text-ink",
        className,
      )}
    >
      Free
    </span>
  );
}
