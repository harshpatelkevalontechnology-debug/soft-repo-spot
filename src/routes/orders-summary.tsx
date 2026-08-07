import { createFileRoute } from "@tanstack/react-router";
import { Download, Paintbrush } from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import type { OrderSummaryRow } from "@/lib/bridge-data";
import { DataGrid, PnlCell, type GridColumn } from "@/components/bridge/data-grid";

export const Route = createFileRoute("/orders-summary")({
  head: () => ({
    meta: [
      { title: "Orders Summary — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "All executed orders paired as entry and exit legs with live LTP, running P&L, fill quantities and exchange timestamps in one grid.",
      },
      { property: "og:title", content: "Orders Summary — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Entry/exit paired order execution with live LTP, P&L and fill quantities.",
      },
    ],
  }),
  component: OrdersSummary,
});

function OrdersSummary() {
  const { orderSummary } = useTerminal();

  const columns: GridColumn<OrderSummaryRow>[] = [
    { key: "sourceSymbol", header: "Source Symbol" },
    { key: "requestId", header: "Request ID" },
    { key: "exchange", header: "Exchange" },
    { key: "exchangeSymbol", header: "Exchange Symbol", width: "15rem" },
    { key: "ltp", header: "LTP", align: "right", render: (r) => r.ltp.toFixed(2) },
    { key: "pnl", header: "P&L", align: "right", render: (r) => <PnlCell value={r.pnl} /> },
    { key: "product", header: "Product" },
    { key: "entryOrderType", header: "Entry Order Type" },
    { key: "entryOrderId", header: "Entry Order ID" },
    { key: "entryTime", header: "Entry Time" },
    { key: "entryTxn", header: "Entry Txn" },
    { key: "entryQty", header: "Entry Qty", align: "right" },
    { key: "entryFilledQty", header: "Entry Filled Qty", align: "right" },
    { key: "entryExchgTime", header: "Entry Exchg Time" },
    { key: "entryAvgPrice", header: "Entry Avg Price", align: "right", render: (r) => r.entryAvgPrice.toFixed(2) },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={orderSummary}
      rowKey={(r) => r.id}
      hints={[
        "Orders Summary contains all the executed orders in Entry and Exit order logical pairing. This grid shows all the required information regarding orders at a single place.",
        "This grid is very flexible. You can resize the columns, move the columns according to your preferences, you can even Sort or Filter the columns.",
        "You can create groups by Dragging one or more column(s) into \u201cDrag a column\u201d Area for better viewing.",
      ]}
      toolbar={
        <>
          <button type="button" className="chrome-btn">
            <Paintbrush className="h-3.5 w-3.5 text-primary" />
            Re-Paint
          </button>
          <button type="button" className="chrome-btn">
            <Download className="h-3.5 w-3.5 text-profit" />
            Export Summary
          </button>
        </>
      }
    />
  );
}
