import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * IconButton — a bare glyph target. Minimum hit area is 44×44px everywhere
 * (DESIGN.md §12), so even the 20px close glyph gets a 44px box.
 *
 * `label` is required: an icon-only control with no accessible name is a bug.
 */

export type IconButtonVariant = "plain" | "outline" | "solid" | "onDark";
export type IconButtonSize = "sm" | "md";

const VARIANTS: Record<IconButtonVariant, string> = {
  plain: "text-ink-600 hover:text-ink-900 hover:bg-veil",
  outline:
    "border-[1.5px] border-ink-800 text-ink-800 hover:bg-ink-800 hover:text-paper-0",
  solid: "bg-ink-800 text-paper-0 hover:bg-ink-700",
  onDark: "text-paper-0 hover:bg-[rgba(255,253,232,0.12)]",
};

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Circular controls are the carousel arrows and the stepper only. */
  round?: boolean;
};

export function IconButton({
  label,
  variant = "plain",
  size = "md",
  round = false,
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
        "disabled:pointer-events-none disabled:text-ink-400",
        size === "sm" ? "size-9" : "size-11",
        round ? "rounded-pill" : "rounded-md",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
