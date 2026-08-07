import { createFileRoute } from "@tanstack/react-router";
import { Download, LogOut, RefreshCw } from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import type { HoldingRow } from "@/lib/bridge-data";
import { CheckCell, DataGrid, PnlCell, type GridColumn } from "@/components/bridge/data-grid";

export const Route = createFileRoute("/holdings")({
  head: () => ({
    meta: [
      { title: "Holdings — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Demat holdings replicated from the broker with average price, buy value, current value, collateral quantity and T1 quantity.",
      },
      { property: "og:title", content: "Holdings — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Demat holdings with average price, current value, collateral and T1 quantity.",
      },
    ],
  }),
  component: Holdings,
});

function Holdings() {
  const { holdings } = useTerminal();

  const columns: GridColumn<HoldingRow>[] = [
    { key: "exchange", header: "Exchange" },
    { key: "symbol", header: "Symbol" },
    { key: "qty", header: "Qty", align: "right" },
    { key: "avgPrice", header: "Avg Price", align: "right", render: (r) => r.avgPrice.toFixed(2) },
    { key: "buyValue", header: "Buy Value", align: "right", render: (r) => r.buyValue.toFixed(2) },
    { key: "ltp", header: "LTP", align: "right", render: (r) => r.ltp.toFixed(2) },
    { key: "currentValue", header: "Current Value", align: "right", render: (r) => r.currentValue.toFixed(2) },
    { key: "pnl", header: "P&L", align: "right", render: (r) => <PnlCell value={r.pnl} /> },
    { key: "collateralQty", header: "Collateral Qty", align: "right" },
    { key: "t1Qty", header: "T1 Qty", align: "right" },
    { key: "cncSellQty", header: "CNC Sell Qty", align: "right" },
    { key: "userId", header: "UserID" },
    { key: "userAlias", header: "User Alias" },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={holdings}
      rowKey={(r) => r.id}
      hints={[
        "This Grid is a replica of Broker's Holdings.",
        "Holdings are refreshed only once on Start Trading.",
        "You can create groups by Dragging one or more column(s) into \u201cDrag a column\u201d Area for better viewing.",
      ]}
      toolbar={
        <>
          <label className="mr-2 inline-flex items-center gap-2 text-xs font-semibold">
            <CheckCell checked />
            Add T1 Holdings
          </label>
          <button type="button" className="chrome-btn">
            <LogOut className="h-3.5 w-3.5 text-loss" />
            Exit
          </button>
          <button type="button" className="chrome-btn">
            <RefreshCw className="h-3.5 w-3.5 text-primary" />
            Refresh
          </button>
          <button type="button" className="chrome-btn">
            <Download className="h-3.5 w-3.5 text-profit" />
            Export Holdings
          </button>
        </>
      }
    />
  );
}
