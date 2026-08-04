import { useTerminal } from "@/lib/terminal-store";
import { formatMoney, formatQty, type Order } from "@/lib/trading-data";
import { Pill } from "./primitives";
import { cn } from "@/lib/utils";

const statusTone = {
  SUCCESS: "ok",
  PENDING: "info",
  FAILED: "bad",
  UNKNOWN: "warn",
  CANCELLED: "neutral",
} as const;

export function OrderBook({ orders }: { orders: Order[] }) {
  const { cancelOrder, reconcileOrder } = useTerminal();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-grid text-left">
            {["Time", "Order", "Symbol", "Side", "Qty", "Price", "Status", "Hop", ""].map((h) => (
              <th key={h} className="label-eyebrow px-4 py-2 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="scan-row border-b border-grid/60 last:border-0 hover:bg-surface-raised/60">
              <td className="num px-4 py-2.5 text-xs text-muted-foreground">{o.ts}</td>
              <td className="num px-4 py-2.5 text-xs">
                <div>{o.id}</div>
                <div className="text-[0.6875rem] text-muted-foreground">
                  {o.broker} · {o.strategyId ?? "manual"}
                </div>
              </td>
              <td className="px-4 py-2.5">
                <div className="num text-xs">{o.symbol}</div>
                <div className="text-[0.6875rem] text-muted-foreground">
                  {o.orderType} · {o.product}
                </div>
                {o.note && <div className="mt-0.5 text-[0.6875rem] text-caution">{o.note}</div>}
              </td>
              <td className="px-4 py-2.5">
                <span
                  className={cn(
                    "num text-xs font-semibold",
                    o.side === "BUY" ? "text-profit" : "text-loss",
                  )}
                >
                  {o.side}
                </span>
              </td>
              <td className="num px-4 py-2.5 text-xs">
                {formatQty(o.filled)}
                <span className="text-muted-foreground"> / {formatQty(o.qty)}</span>
              </td>
              <td className="num px-4 py-2.5 text-xs">{o.price ? formatMoney(o.price) : "—"}</td>
              <td className="px-4 py-2.5">
                <Pill tone={statusTone[o.status]} dot={o.status === "PENDING"}>
                  {o.status}
                </Pill>
              </td>
              <td className="num px-4 py-2.5 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
                {o.hop}
              </td>
              <td className="px-4 py-2.5 text-right">
                {o.status === "PENDING" && (
                  <button
                    onClick={() => cancelOrder(o.id)}
                    className="num rounded border border-grid px-2 py-1 text-[0.6875rem] uppercase tracking-wider text-muted-foreground transition-colors hover:border-loss/50 hover:text-loss"
                  >
                    Cancel
                  </button>
                )}
                {o.status === "UNKNOWN" && (
                  <button
                    onClick={() => reconcileOrder(o.id)}
                    className="num rounded border border-caution/50 px-2 py-1 text-[0.6875rem] uppercase tracking-wider text-caution transition-colors hover:bg-caution/15"
                  >
                    Reconcile
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
