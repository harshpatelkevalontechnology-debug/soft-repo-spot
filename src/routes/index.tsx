import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useTerminal } from "@/lib/terminal-store";
import { formatMoney } from "@/lib/trading-data";
import { Panel, Pill, Stat, Meter } from "@/components/terminal/primitives";
import { OrderBook } from "@/components/terminal/order-book";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trading Dashboard — LoopbackDesk" },
      {
        name: "description",
        content:
          "Live day MTM, order book with SUCCESS/FAILED/UNKNOWN reconciliation, running strategies and risk headroom in one desk view.",
      },
      { property: "og:title", content: "Trading Dashboard — LoopbackDesk" },
      {
        property: "og:description",
        content: "Live day MTM, order book, running strategies and risk headroom in one desk view.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { orders, strategies, risk, session } = useTerminal();

  const dayMtm = strategies.reduce((a, s) => a + s.mtm, 0);
  const running = strategies.filter((s) => s.state === "RUNNING").length;
  const unresolved = orders.filter((o) => o.status === "UNKNOWN" || o.status === "PENDING").length;
  const maxLoss = risk.find((r) => r.id === "RISK-MAXLOSS");
  const lossUsedPct = maxLoss ? Math.min(100, (Math.abs(Math.min(dayMtm, 0)) / maxLoss.value) * 100) : 0;
  const degraded = session.filter((s) => s.state !== "OK");

  return (
    <div className="space-y-5">
      <div>
        <div className="label-eyebrow">Desk overview</div>
        <h1 className="text-2xl font-semibold tracking-tight">Trading dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Single install, own broker credentials. All trading state lives on this client — the core owns
          execution, the wrapper is stateless.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Day MTM"
          value={formatMoney(dayMtm, { sign: true })}
          sub={`${strategies.length} strategies loaded`}
          tone={dayMtm >= 0 ? "profit" : "loss"}
        />
        <Stat label="Running strategies" value={String(running)} sub={`${running} of ${strategies.length} live`} tone="primary" />
        <Stat
          label="Unresolved orders"
          value={String(unresolved)}
          sub="Pending or UNKNOWN — reconcile before re-send"
          tone={unresolved ? "loss" : "neutral"}
        />
        <Stat
          label="Orders today"
          value={String(orders.length)}
          sub="Rate cap 8/sec/exchange (SEBI threshold 10)"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel
          eyebrow="FR-ORD"
          title="Order book"
          action={<Pill tone="info">Live</Pill>}
          bodyClassName="p-0"
        >
          <OrderBook orders={orders} />
        </Panel>

        <div className="space-y-5">
          <Panel
            eyebrow="FR-RISK"
            title="Loss headroom"
            action={
              <Link to="/risk" className="num text-[0.6875rem] uppercase tracking-wider text-primary hover:underline">
                Limits
              </Link>
            }
            bodyClassName="space-y-3 px-4 py-4"
          >
            <div className="flex items-baseline justify-between">
              <span className="num text-xl font-semibold text-foreground">
                {maxLoss ? formatMoney(maxLoss.value - Math.abs(Math.min(dayMtm, 0))) : "—"}
              </span>
              <span className="text-xs text-muted-foreground">
                of {maxLoss ? formatMoney(maxLoss.value) : "—"}
              </span>
            </div>
            <Meter pct={lossUsedPct} tone={lossUsedPct > 70 ? "bad" : lossUsedPct > 40 ? "warn" : "ok"} />
            <p className="text-xs text-muted-foreground">
              Breach action: square off all positions and block new orders for the session.
            </p>
          </Panel>

          <Panel
            eyebrow="FR-STR"
            title="Strategies"
            action={
              <Link to="/strategies" className="num text-[0.6875rem] uppercase tracking-wider text-primary hover:underline">
                Open
              </Link>
            }
            bodyClassName="divide-y divide-grid"
          >
            {strategies.map((s) => (
              <Link
                key={s.id}
                to="/strategies"
                className="scan-row flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-raised/60"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm">{s.name}</div>
                  <div className="num text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
                    {s.underlying} · {s.legs.length} legs · {s.state}
                  </div>
                </div>
                <span className={`num text-sm ${s.mtm >= 0 ? "text-profit" : "text-loss"}`}>
                  {formatMoney(s.mtm, { sign: true })}
                </span>
              </Link>
            ))}
          </Panel>

          <Panel eyebrow="FR-SESS" title="Session health" bodyClassName="space-y-2.5 px-4 py-4">
            {degraded.length === 0 ? (
              <p className="text-xs text-muted-foreground">All hops healthy.</p>
            ) : (
              degraded.map((c) => (
                <div key={c.id} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs">{c.name}</div>
                    <div className="text-[0.6875rem] text-muted-foreground">{c.detail}</div>
                  </div>
                  <Pill tone={c.state === "DOWN" ? "bad" : "warn"}>{c.state}</Pill>
                </div>
              ))
            )}
            <Link
              to="/session"
              className="num inline-flex items-center gap-1 pt-1 text-[0.6875rem] uppercase tracking-wider text-primary hover:underline"
            >
              Full supervisor <ArrowUpRight className="size-3" />
            </Link>
          </Panel>
        </div>
      </div>
    </div>
  );
}
