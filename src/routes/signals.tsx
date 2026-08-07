import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import type { SignalRow } from "@/lib/bridge-data";
import { DataGrid, type GridColumn } from "@/components/bridge/data-grid";

export const Route = createFileRoute("/signals")({
  head: () => ({
    meta: [
      { title: "Signals — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Every entry signal received from TradingView, Amibroker or Excel with its paired exit signal, quantity processing state and triggers.",
      },
      { property: "og:title", content: "Signals — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Entry and exit signals with quantity processing state and trigger prices.",
      },
    ],
  }),
  component: Signals,
});

function Signals() {
  const { signals } = useTerminal();

  const columns: GridColumn<SignalRow>[] = [
    { key: "requestId", header: "Request ID" },
    { key: "source", header: "Source" },
    { key: "signalSymbol", header: "Signal Symbol" },
    { key: "qtyProcessing", header: "Qty Processing" },
    { key: "exchangeSymbol", header: "Exchange Symbol", width: "15rem" },
    { key: "entryTxn", header: "Entry Txn" },
    { key: "entryQty", header: "Entry Qty", align: "right" },
    { key: "entryPrice", header: "Entry Price", align: "right", render: (r) => r.entryPrice.toFixed(2) },
    { key: "entryTrigger", header: "Entry Trigger" },
    { key: "target", header: "Target", align: "right", render: (r) => r.target.toFixed(2) },
    { key: "sl", header: "SL", align: "right", render: (r) => r.sl.toFixed(2) },
    { key: "trailSl", header: "Trail SL", align: "right", render: (r) => r.trailSl.toFixed(2) },
    { key: "exitQty", header: "Exit Qty", align: "right" },
    { key: "exitPrice", header: "Exit Price", align: "right", render: (r) => r.exitPrice.toFixed(2) },
    { key: "exitTrigger", header: "Exit Trigger" },
    { key: "signalTime", header: "Signal Time" },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={signals}
      rowKey={(r) => r.id}
      hints={[
        "Signals Grid contains all the received Entry signals and their corresponding Exit Signals. Each signal might be executed in multiple users as per Strategy.",
        "You can utilize this grid to Modify few fields of Entry / Exit Signals depending upon their status. Any modification here will modify all related orders.",
        "You can create groups by Dragging one or more column(s) into \u201cDrag a column\u201d Area for better viewing.",
      ]}
      toolbar={
        <button type="button" className="chrome-btn">
          <Download className="h-3.5 w-3.5 text-profit" />
          Export Signals
        </button>
      }
    />
  );
}
