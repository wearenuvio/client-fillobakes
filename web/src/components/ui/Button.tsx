import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Button — DESIGN-v2 §2.
 *
 * Primary is the terracotta accent: it is the only coloured control on the
 * site, and there is at most one per screenful. Radius 8px, label 14px/600,
 * a 2px lift on hover. Secondary is a 1px ink outline. Ghost is text plus an
 * arrow. Nothing is all-caps and nothing is a pill except the on-photo pair.
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  /** Hero B only: pill, paper-0 fill, ink-900 label. */
  | "onPhotoPrimary"
  /** Hero B only: pill, transparent, 1.5px paper-0 border. */
  | "onPhotoSecondary";

export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-sans " +
  "tracking-[0.005em] whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,transform] duration-[var(--dur-base)] " +
  "ease-[var(--ease-standard)] disabled:pointer-events-none disabled:cursor-not-allowed";

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-body-sm",
  md: "h-11 px-5 text-body-sm",
  lg: "h-13 px-7 text-body",
};

/** Ghost drops one padding step (§12.10). */
const GHOST_SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-0 text-body-sm",
  md: "h-11 px-0 text-body-sm",
  lg: "h-13 px-0 text-body",
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "rounded-md bg-accent text-on-accent font-semibold hover:bg-accent-hover " +
    "hover:-translate-y-0.5 active:translate-y-0 " +
    "disabled:bg-line disabled:text-muted disabled:translate-y-0",
  secondary:
    "rounded-md border border-ink bg-transparent text-ink font-semibold " +
    "hover:bg-veil hover:-translate-y-0.5 active:translate-y-0 " +
    "disabled:border-line disabled:text-muted disabled:bg-transparent",
  ghost:
    "rounded-md bg-transparent text-accent font-semibold link-underline " +
    "hover:text-accent-hover disabled:text-muted",
  destructive:
    "rounded-md bg-accent text-on-accent font-semibold hover:bg-accent-hover " +
    "active:translate-y-px disabled:bg-line disabled:text-muted",
  onPhotoPrimary:
    "rounded-pill bg-card text-ink font-semibold hover:bg-paper active:translate-y-px",
  onPhotoSecondary:
    "rounded-pill border border-card bg-transparent text-card font-semibold " +
    "hover:bg-[rgba(255,253,249,0.14)]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  fullWidth = false,
  className?: string,
): string {
  return cn(
    BASE,
    variant === "ghost" ? GHOST_SIZES[size] : SIZES[size],
    VARIANTS[variant],
    fullWidth && "w-full",
    className,
  );
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** A Lucide element. Trailing by default; `plus` and friends lead. */
  icon?: React.ReactNode;
  iconPosition?: "leading" | "trailing";
  /** Label holds its width; a 16px loader-2 spins in place of the icon. */
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "trailing",
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const glyph = loading ? (
    <Loader2
      size={16}
      strokeWidth={1.5}
      className="animate-spin motion-reduce:animate-none"
      aria-hidden="true"
    />
  ) : (
    icon
  );

  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant, size, fullWidth, className)}
    >
      {glyph && iconPosition === "leading" ? glyph : null}
      <span>{children}</span>
      {glyph && iconPosition === "trailing" ? glyph : null}
    </button>
  );
}

export type ButtonLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "leading" | "trailing";
};

/** The same geometry as Button, for real navigations. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "trailing",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link {...rest} className={buttonClasses(variant, size, fullWidth, className)}>
      {icon && iconPosition === "leading" ? icon : null}
      <span>{children}</span>
      {icon && iconPosition === "trailing" ? icon : null}
    </Link>
  );
}
