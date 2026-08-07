import { createFileRoute } from "@tanstack/react-router";
import { useTerminal } from "@/lib/terminal-store";
import { CheckCell } from "@/components/bridge/data-grid";

export const Route = createFileRoute("/adv-bridge")({
  head: () => ({
    meta: [
      { title: "Adv Bridge — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Advanced bridge controls: freak-tick protection, order-rate caps, wrapper retry policy, reconciliation and kill-switch behaviour.",
      },
      { property: "og:title", content: "Adv Bridge — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Freak protection, order-rate caps, wrapper retry policy and kill-switch behaviour.",
      },
    ],
  }),
  component: AdvBridge,
});

function AdvBridge() {
  const { freakProtection, tradingMode, trading, killed, activateKillSwitch, resetKillSwitch } = useTerminal();

  const settings = [
    { label: "Freak tick protection", value: freakProtection, note: "Rejects ticks outside the sanity band." },
    { label: "Trading mode", value: tradingMode, note: "Live routes to the broker; Paper stays in the core." },
    { label: "Wrapper retry policy", value: "Single attempt", note: "UNKNOWN is never auto-retried." },
    { label: "Order rate cap", value: "8 / sec / exchange", note: "Hard-capped below the SEBI 10/sec threshold." },
    { label: "Freeze-qty slicing", value: "Enabled", note: "Splits orders above the exchange freeze quantity." },
    { label: "Auto reconciliation", value: "Every 30s", note: "Reconciles UNKNOWN orders against the broker book." },
  ];

  return (
    <div className="min-h-0 flex-1 overflow-auto p-4">
      <header className="mb-4">
        <h1 className="text-lg font-semibold">Advanced Bridge Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Guardrails applied by the core before any order reaches the wrapper. Changing these while trading is live
          takes effect on the next signal.
        </p>
      </header>

      <div className="overflow-hidden rounded-sm border border-grid">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="grid-head border-b border-grid text-left">
              <th className="border-r border-grid/70 px-3 py-2">Setting</th>
              <th className="border-r border-grid/70 px-3 py-2">Value</th>
              <th className="px-3 py-2">Behaviour</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s, i) => (
              <tr key={s.label} className={i % 2 === 1 ? "bg-row-alt" : undefined}>
                <td className="border-r border-grid/40 px-3 py-2 font-medium">{s.label}</td>
                <td className="num border-r border-grid/40 px-3 py-2">{s.value}</td>
                <td className="px-3 py-2 text-muted-foreground">{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-sm border border-grid bg-surface-raised px-3 py-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <CheckCell checked={trading} />
          Bridge is {trading ? "LIVE" : "stopped"}
        </label>
        <span className="h-4 w-px bg-grid" />
        {killed ? (
          <>
            <span className="text-sm font-semibold text-loss">Kill switch is ACTIVE</span>
            <button type="button" className="chrome-btn" onClick={resetKillSwitch}>
              Reset kill switch
            </button>
          </>
        ) : (
          <button type="button" className="chrome-btn" onClick={activateKillSwitch}>
            Activate kill switch
          </button>
        )}
        <p className="text-xs text-hint">
          Kill switch pulls every working order and squares off all running strategies immediately.
        </p>
      </div>
    </div>
  );
}
