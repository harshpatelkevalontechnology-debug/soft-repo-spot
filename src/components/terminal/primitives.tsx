import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel flex flex-col overflow-hidden", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-grid px-4 py-3">
          <div>
            {eyebrow && <div className="label-eyebrow">{eyebrow}</div>}
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

type Tone = "ok" | "warn" | "bad" | "neutral" | "info";

const toneClass: Record<Tone, string> = {
  ok: "border-profit/35 bg-profit/10 text-profit",
  warn: "border-caution/35 bg-caution/10 text-caution",
  bad: "border-loss/40 bg-loss/10 text-loss",
  info: "border-primary/35 bg-primary/10 text-primary",
  neutral: "border-grid bg-muted/50 text-muted-foreground",
};

export function Pill({
  tone = "neutral",
  children,
  dot,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "num inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.6875rem] uppercase tracking-wider",
        toneClass[tone],
        className,
      )}
    >
      {dot && <span className="live-dot size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "profit" | "loss" | "neutral" | "primary";
}) {
  const valueTone =
    tone === "profit"
      ? "text-profit"
      : tone === "loss"
        ? "text-loss"
        : tone === "primary"
          ? "text-primary"
          : "text-foreground";
  return (
    <div className="panel px-4 py-3.5">
      <div className="label-eyebrow">{label}</div>
      <div className={cn("num mt-1.5 text-2xl font-semibold", valueTone)}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function Meter({ pct, tone = "info" }: { pct: number; tone?: Tone }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const bar =
    tone === "bad"
      ? "bg-loss"
      : tone === "warn"
        ? "bg-caution"
        : tone === "ok"
          ? "bg-profit"
          : "bg-primary";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full transition-[width] duration-500", bar)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
