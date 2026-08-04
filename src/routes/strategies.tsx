import { createFileRoute } from "@tanstack/react-router";
import { useTerminal } from "@/lib/terminal-store";
import { formatMoney, type Strategy } from "@/lib/trading-data";
import { Panel, Pill, Meter } from "@/components/terminal/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/strategies")({
  head: () => ({
    meta: [
      { title: "Strategy Engine — LoopbackDesk" },
      {
        name: "description",
        content:
          "Author and supervise multi-leg options strategies: legs, per-leg stop-loss and target, entry/exit windows and live MTM against caps.",
      },
      { property: "og:title", content: "Strategy Engine — LoopbackDesk" },
      {
        property: "og:description",
        content: "Multi-leg options strategies with per-leg SL/target, entry windows and live MTM against caps.",
      },
    ],
  }),
  component: Strategies,
});

const stateTone = {
  RUNNING: "ok",
  ARMED: "info",
  HALTED: "bad",
  IDLE: "neutral",
  EXITED: "neutral",
} as const;

function Actions({ s }: { s: Strategy }) {
  const { setStrategyState } = useTerminal();
  const btn =
    "num rounded border border-grid px-2.5 py-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground";
  return (
    <div className="flex flex-wrap gap-2">
      {s.state !== "RUNNING" && s.state !== "EXITED" && (
        <button onClick={() => setStrategyState(s.id, "RUNNING")} className={cn(btn, "hover:border-profit/50 hover:text-profit")}>
          Start
        </button>
      )}
      {s.state === "RUNNING" && (
        <button onClick={() => setStrategyState(s.id, "HALTED")} className={cn(btn, "hover:border-caution/50 hover:text-caution")}>
          Halt
        </button>
      )}
      {s.state !== "EXITED" && (
        <button onClick={() => setStrategyState(s.id, "EXITED")} className={cn(btn, "hover:border-loss/50 hover:text-loss")}>
          Square off
        </button>
      )}
      {s.state === "EXITED" && (
        <button onClick={() => setStrategyState(s.id, "ARMED")} className={btn}>
          Re-arm
        </button>
      )}
    </div>
  );
}

function Strategies() {
  const { strategies } = useTerminal();

  return (
    <div className="space-y-5">
      <div>
        <div className="label-eyebrow">FR-STR · Strategy engine</div>
        <h1 className="text-2xl font-semibold tracking-tight">Strategies</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          White-box multi-leg definitions. Strike offsets resolve against ATM at entry time; per-leg SL and
          target are evaluated by the core, never the UI.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {strategies.map((s) => {
          const lossPct = s.mtm < 0 ? Math.min(100, (Math.abs(s.mtm) / s.maxLossPaise) * 100) : 0;
          return (
            <Panel
              key={s.id}
              eyebrow={`${s.id} · ${s.underlying} · ${s.expiry}`}
              title={s.name}
              action={
                <div className="flex items-center gap-2">
                  {s.simulated && <Pill tone="warn">Sim</Pill>}
                  <Pill tone={stateTone[s.state]} dot={s.state === "RUNNING"}>
                    {s.state}
                  </Pill>
                </div>
              }
              bodyClassName="space-y-4 px-4 py-4"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="label-eyebrow">MTM</div>
                  <div className={cn("num text-lg font-semibold", s.mtm >= 0 ? "text-profit" : "text-loss")}>
                    {formatMoney(s.mtm, { sign: true })}
                  </div>
                </div>
                <div>
                  <div className="label-eyebrow">Window</div>
                  <div className="num text-lg">
                    {s.entryTime}–{s.exitTime}
                  </div>
                </div>
                <div>
                  <div className="label-eyebrow">Orders</div>
                  <div className="num text-lg">{s.ordersToday}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[0.6875rem] text-muted-foreground">
                  <span>Loss cap usage</span>
                  <span className="num">{formatMoney(s.maxLossPaise)}</span>
                </div>
                <Meter pct={lossPct} tone={lossPct > 70 ? "bad" : lossPct > 40 ? "warn" : "ok"} />
              </div>

              <div className="overflow-hidden rounded-md border border-grid">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-grid bg-surface-raised/50 text-left">
                      {["Leg", "Side", "Type", "Strike", "Lots", "SL", "Target"].map((h) => (
                        <th key={h} className="label-eyebrow px-3 py-1.5 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.legs.map((l) => (
                      <tr key={l.id} className="border-b border-grid/60 last:border-0">
                        <td className="num px-3 py-2 text-xs text-muted-foreground">{l.id}</td>
                        <td className={cn("num px-3 py-2 text-xs font-semibold", l.side === "BUY" ? "text-profit" : "text-loss")}>
                          {l.side}
                        </td>
                        <td className="num px-3 py-2 text-xs">{l.optionType}</td>
                        <td className="num px-3 py-2 text-xs">
                          ATM{l.strikeOffset === 0 ? "" : l.strikeOffset > 0 ? `+${l.strikeOffset}` : l.strikeOffset}
                        </td>
                        <td className="num px-3 py-2 text-xs">{l.lots}</td>
                        <td className="num px-3 py-2 text-xs">{l.slPct ? `${l.slPct}%` : "—"}</td>
                        <td className="num px-3 py-2 text-xs">{l.tgtPct ? `${l.tgtPct}%` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Actions s={s} />
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
