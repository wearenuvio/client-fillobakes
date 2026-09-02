import * as React from "react";
import { AlertCircle, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Form fields — DESIGN.md §12.24.
 *
 * Labels are always visible and uppercase micro-caps; a placeholder is never
 * the label. Errors appear on blur, never on keystroke, and are wired with
 * `aria-describedby` + `aria-invalid`. Inputs are the one component allowed
 * both a border and a surface tint.
 */

/* -------------------------------------------------------------------------- */
/* Shells                                                                      */
/* -------------------------------------------------------------------------- */

export function Label({
  className,
  children,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...rest} className={cn("micro mb-2 block text-ink-600", className)}>
      {children}
    </label>
  );
}

export function Helper({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...rest} className={cn("mt-2 text-caption text-ink-500", className)}>
      {children}
    </p>
  );
}

export function FieldError({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      role="alert"
      {...rest}
      className={cn(
        "mt-2 flex items-start gap-1.5 text-caption text-danger",
        className,
      )}
    >
      <AlertCircle size={16} strokeWidth={1.5} className="mt-px shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export type FieldProps = {
  label?: React.ReactNode;
  htmlFor?: string;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/** Label + control + helper/error, with the ids already wired by the caller. */
export function Field({
  label,
  htmlFor,
  helper,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("w-full", className)}>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? (
        <FieldError id={htmlFor ? `${htmlFor}-error` : undefined}>{error}</FieldError>
      ) : helper ? (
        <Helper id={htmlFor ? `${htmlFor}-helper` : undefined}>{helper}</Helper>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Controls                                                                    */
/* -------------------------------------------------------------------------- */

const CONTROL =
  "h-12 w-full rounded-sm bg-paper-0 px-4 text-body text-ink-800 " +
  "border border-paper-400 placeholder:text-ink-500 " +
  "transition-colors duration-[var(--dur-fast)] " +
  "hover:border-ink-500 focus:border-ink-800 focus:outline-none " +
  "disabled:bg-paper-100 disabled:border-paper-300 disabled:text-ink-400";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  /** A 16px check inset at the right. No border change (§12.24). */
  valid?: boolean;
  /** A 20px Lucide glyph inset at the left, e.g. map-pin on AreaCheck. */
  leadingIcon?: React.ReactNode;
  /** The fixed "+91" prefix on a phone field, behind a hairline. */
  prefix?: React.ReactNode;
};

export function Input({
  invalid,
  valid,
  leadingIcon,
  prefix,
  className,
  ...rest
}: InputProps) {
  const bare = !leadingIcon && !prefix && !valid;
  if (bare) {
    return (
      <input
        {...rest}
        aria-invalid={invalid || undefined}
        className={cn(CONTROL, invalid && "border-danger hover:border-danger", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-sm border bg-paper-0 pr-4 h-12",
        "transition-colors duration-[var(--dur-fast)]",
        invalid ? "border-danger" : "border-paper-400 focus-within:border-ink-800",
        "hover:border-ink-500",
        className,
      )}
    >
      {leadingIcon ? (
        <span className="grid size-12 shrink-0 place-items-center text-ink-500">
          {leadingIcon}
        </span>
      ) : null}
      {prefix ? (
        <span className="flex h-full items-center gap-3 pl-4 text-body text-ink-500">
          <span className="font-mono tabular">{prefix}</span>
          <span className="h-6 w-px bg-paper-300" aria-hidden="true" />
        </span>
      ) : null}
      <input
        {...rest}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-body text-ink-800",
          "placeholder:text-ink-500 focus:outline-none disabled:text-ink-400",
          !leadingIcon && !prefix && "pl-4",
        )}
      />
      {valid ? (
        <Check size={16} strokeWidth={1.5} className="shrink-0 text-success" aria-hidden="true" />
      ) : null}
    </div>
  );
}

export function Textarea({
  invalid,
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(
        CONTROL,
        "min-h-30 resize-y py-3 leading-[1.6]",
        invalid && "border-danger",
        className,
      )}
    />
  );
}

export function Select({
  invalid,
  className,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        {...rest}
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL,
          "appearance-none pr-11",
          invalid && "border-danger",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown
        size={20}
        strokeWidth={1.5}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-600"
      />
    </div>
  );
}

/**
 * Checkbox / radio — 20px, 1.5px ink-600 border, checked fills ink-800.
 * The whole 44px row is the hit target.
 */
export function Checkbox({
  label,
  helper,
  className,
  type = "checkbox",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: React.ReactNode;
  helper?: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "group flex min-h-11 cursor-pointer items-start gap-3 py-2",
        rest.disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <input
        type={type}
        {...rest}
        className={cn(
          "mt-0.5 size-5 shrink-0 appearance-none border-[1.5px] border-ink-600 bg-paper-0",
          type === "radio" ? "rounded-pill" : "rounded-xs",
          "checked:border-ink-800 checked:bg-ink-800",
          "transition-colors duration-[var(--dur-fast)]",
          // The glyph: a paper-0 tick (or dot) drawn with a mask-free background.
          type === "radio"
            ? "checked:shadow-[inset_0_0_0_3px_var(--color-paper-0)]"
            : "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22%23FFFDF7%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%224,10 8,14 16,6%22/></svg>')] checked:bg-center checked:bg-no-repeat",
          "disabled:border-paper-300",
        )}
      />
      <span className="min-w-0">
        <span className="block text-body-sm text-ink-800">{label}</span>
        {helper ? (
          <span className="mt-0.5 block text-caption text-ink-500">{helper}</span>
        ) : null}
      </span>
    </label>
  );
}

/**
 * Switch — the notification toggles (/account/alerts). A locked toggle stays
 * on and explains itself rather than disappearing.
 */
export function Switch({
  checked,
  onCheckedChange,
  label,
  helper,
  locked = false,
  lockedCopy,
  id,
}: {
  checked: boolean;
  onCheckedChange?: (next: boolean) => void;
  label: React.ReactNode;
  helper?: React.ReactNode;
  locked?: boolean;
  lockedCopy?: React.ReactNode;
  id?: string;
}) {
  const describedBy = id ? `${id}-helper` : undefined;
  return (
    <div className="flex min-h-11 items-start justify-between gap-6 py-3">
      <span className="min-w-0">
        <span className="block text-body-sm font-semibold text-ink-800">{label}</span>
        {helper ? (
          <span id={describedBy} className="mt-0.5 block text-caption text-ink-500">
            {helper}
          </span>
        ) : null}
        {locked && lockedCopy ? (
          <span className="micro mt-1 block text-ink-500">{lockedCopy}</span>
        ) : null}
      </span>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-describedby={describedBy}
        aria-disabled={locked || undefined}
        onClick={locked ? undefined : () => onCheckedChange?.(!checked)}
        className={cn(
          "relative mt-1 h-6 w-11 shrink-0 rounded-pill border transition-colors",
          "duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
          checked ? "border-ink-800 bg-ink-800" : "border-paper-400 bg-paper-100",
          locked && "cursor-not-allowed opacity-70",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0.5 size-4.5 rounded-pill bg-paper-0 transition-transform",
            "duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
            checked ? "translate-x-5.5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
