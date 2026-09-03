"use client";

import * as React from "react";
import { AlertCircle, Check, Info } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Toast — DESIGN-v2 §1.
 *
 * Bottom-centre on mobile, bottom-right at ≥768. The chocolate band's ground,
 * its text, a 20px gold status glyph, one ghost action in gold. Auto-dismisses
 * at 4.5s (7s with an action); the timer pauses on hover. Stacks to three,
 * oldest dropping first. `role="status"`, `aria-live="polite"`.
 *
 * Note the system's own rule: a success that has a place on the page replaces
 * itself in place (AreaCheck, WhatsApp opt-in, the newsletter row) rather than
 * firing a toast. Reach for this only when there is nowhere else to say it.
 */

export type ToastTone = "success" | "info" | "error";

export type ToastInput = {
  message: React.ReactNode;
  tone?: ToastTone;
  action?: { label: string; onClick: () => void };
};

type ToastRecord = ToastInput & { id: number };

const MAX_STACK = 3;

const ToastContext = React.createContext<{
  toast: (input: ToastInput) => void;
} | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const nextId = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((input: ToastInput) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { ...input, id }].slice(-MAX_STACK));
  }, []);

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastRecord[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-[var(--z-toast)]",
        "flex flex-col items-center gap-3 md:right-6 md:bottom-6 md:left-auto md:items-end",
      )}
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

const ICONS: Record<ToastTone, React.ElementType> = {
  success: Check,
  info: Info,
  error: AlertCircle,
};

export function Toast({
  message,
  tone = "success",
  action,
  onDismiss,
}: ToastInput & { onDismiss?: () => void }) {
  const [paused, setPaused] = React.useState(false);
  const Icon = ICONS[tone];
  const life = action ? 7000 : 4500;

  React.useEffect(() => {
    if (paused || !onDismiss) return;
    const timer = setTimeout(onDismiss, life);
    return () => clearTimeout(timer);
  }, [paused, onDismiss, life]);

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "pointer-events-auto flex w-full max-w-[400px] items-start gap-3 rounded-md",
        "bg-choc p-4 text-on-choc shadow-overlay",
        "motion-safe:animate-[toast-in_var(--dur-base)_var(--ease-out)]",
      )}
      data-surface="dark"
    >
      <Icon
        size={20}
        strokeWidth={1.5}
        aria-hidden="true"
        className="mt-px shrink-0 text-gold"
      />
      <p className="min-w-0 flex-1 text-body-sm text-on-choc">{message}</p>
      {action ? (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            onDismiss?.();
          }}
          className="link-underline shrink-0 text-body-sm font-semibold text-gold"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
