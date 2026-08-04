import { createFileRoute } from "@tanstack/react-router";
import { useTerminal } from "@/lib/terminal-store";
import { formatMoney, formatQty, type RiskLimit } from "@/lib/trading-data";
import { Panel, Pill, Meter } from "@/components/terminal/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Risk Gates — LoopbackDesk" },
      {
        name: "description",
        content:
          "Pre-trade and in-trade risk limits: daily loss floor, profit lock, order-rate cap under the SEBI threshold, and freeze-quantity slicing.",
      },
      { property: "og:title", content: "Risk Gates — LoopbackDesk" },
      {
        property: "og:description",
        content: "Daily loss floor, profit lock, order-rate cap and freeze-quantity slicing, all enforced in the core.",
      },
    ],
  }),
  component: Risk,
});

const actionTone = {
  BLOCK_NEW: "info",
  SQUARE_OFF_ALL: "bad",
  HALT_STRATEGY: "warn",
} as const;

function value(limit: RiskLimit, n: number) {
  return limit.unit === "money" ? formatMoney(n) : formatQty(n);
}

function Risk() {
  const { risk, toggleRiskLimit } = useTerminal();
  const breached = risk.filter((r) => r.enabled && r.used / r.value >= 0.9).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="label-eyebrow">FR-RISK · Pre-trade &amp; in-trade gates</div>
          <h1 className="text-2xl font-semibold tracking-tight">Risk management</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Every gate is evaluated in the core before an intent reaches the broker wrapper. Disabling a gate
            is recorded in the incident bundle.
          </p>
        </div>
        <Pill tone={breached ? "warn" : "ok"} dot>
          {breached ? `${breached} near breach` : "Within limits"}
        </Pill>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {risk.map((r) => {
          const pct = Math.min(100, (r.used / r.value) * 100);
          const tone = !r.enabled ? "neutral" : pct >= 90 ? "bad" : pct >= 60 ? "warn" : "ok";
          return (
            <Panel
              key={r.id}
              eyebrow={r.id}
              title={r.label}
              action={
                <button
                  onClick={() => toggleRiskLimit(r.id)}
                  className={cn(
                    "num rounded-full border px-2 py-0.5 text-[0.6875rem] uppercase tracking-wider transition-colors",
                    r.enabled
                      ? "border-profit/40 bg-profit/10 text-profit"
                      : "border-grid bg-muted/50 text-muted-foreground",
                  )}
                >
                  {r.enabled ? "Armed" : "Off"}
                </button>
              }
              bodyClassName="space-y-3 px-4 py-4"
            >
              <div className="flex items-baseline gap-2">
                <span className={cn("num text-xl font-semibold", !r.enabled && "text-muted-foreground")}>
                  {value(r, r.used)}
                </span>
                <span className="num text-xs text-muted-foreground">/ {value(r, r.value)}</span>
              </div>
              <Meter pct={r.enabled ? pct : 0} tone={tone} />
              <p className="text-xs text-muted-foreground">{r.description}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="label-eyebrow">On breach</span>
                <Pill tone={actionTone[r.breachAction]}>{r.breachAction.replace(/_/g, " ")}</Pill>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
