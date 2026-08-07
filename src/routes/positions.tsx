import { createFileRoute } from "@tanstack/react-router";
import { Download, LogOut, Paintbrush, RefreshCw, Shuffle } from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import type { PositionRow } from "@/lib/bridge-data";
import { DataGrid, PnlCell, type GridColumn } from "@/components/bridge/data-grid";

export const Route = createFileRoute("/positions")({
  head: () => ({
    meta: [
      { title: "Positions — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Live net positions replicated from the broker: net quantity, LTP, realised and unrealised P&L, buy/sell averages and carry-forward quantity.",
      },
      { property: "og:title", content: "Positions — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Net positions with LTP, realised/unrealised P&L and buy/sell averages.",
      },
    ],
  }),
  component: Positions,
});

function Positions() {
  const { positions } = useTerminal();

  const columns: GridColumn<PositionRow>[] = [
    { key: "exchange", header: "Exchange" },
    { key: "symbol", header: "Symbol", width: "15rem" },
    { key: "netQty", header: "Net Qty", align: "right" },
    { key: "ltp", header: "LTP", align: "right", render: (r) => r.ltp.toFixed(2) },
    { key: "pnl", header: "P&L", align: "right", render: (r) => <PnlCell value={r.pnl} /> },
    { key: "pnlPct", header: "P&L %", align: "right", render: (r) => <PnlCell value={r.pnlPct} /> },
    { key: "buyQty", header: "Buy Qty", align: "right" },
    { key: "buyAvgPrice", header: "Buy Avg Price", align: "right", render: (r) => r.buyAvgPrice.toFixed(2) },
    { key: "buyValue", header: "Buy Value", align: "right", render: (r) => r.buyValue.toFixed(2) },
    { key: "sellQty", header: "Sell Qty", align: "right" },
    { key: "sellAvgPrice", header: "Sell Avg Price", align: "right", render: (r) => r.sellAvgPrice.toFixed(2) },
    { key: "sellValue", header: "Sell Value", align: "right", render: (r) => r.sellValue.toFixed(2) },
    { key: "carryFwdQty", header: "Carry Fwd Qty", align: "right" },
    {
      key: "realizedProfit",
      header: "Realized Profit",
      align: "right",
      render: (r) => <PnlCell value={r.realizedProfit} />,
    },
    {
      key: "unrealizedProfit",
      header: "Unrealized Profit",
      align: "right",
      render: (r) => <PnlCell value={r.unrealizedProfit} />,
    },
    { key: "userId", header: "UserID" },
    { key: "userAlias", header: "User Alias" },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={positions}
      rowKey={(r) => r.id}
      hints={[
        "This Grid is a replica of Broker's Positions. It includes manual and other positions taken outside of the Bridge.",
        "Positions refresh only if Trading is Started in the Bridge and are not SquaredOff.",
        "LTP will not be updated for Zero Net Positions.",
        "You can create groups by Dragging one or more column(s) into \u201cDrag a column\u201d Area for better viewing.",
      ]}
      toolbar={
        <>
          <button type="button" className="chrome-btn">
            <Paintbrush className="h-3.5 w-3.5 text-primary" />
            Re-Paint
          </button>
          <button type="button" className="chrome-btn">
            <LogOut className="h-3.5 w-3.5 text-loss" />
            Exit
          </button>
          <button type="button" className="chrome-btn">
            <RefreshCw className="h-3.5 w-3.5 text-primary" />
            Refresh
          </button>
          <button type="button" className="chrome-btn">
            <Shuffle className="h-3.5 w-3.5 text-accent" />
            Convert Positions
          </button>
          <button type="button" className="chrome-btn">
            <Download className="h-3.5 w-3.5 text-profit" />
            Export
          </button>
        </>
      }
    />
  );
}
