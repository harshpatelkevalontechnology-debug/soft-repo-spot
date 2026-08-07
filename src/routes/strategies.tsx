import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Download, Paintbrush, Trash2, Upload } from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import type { StrategyRow } from "@/lib/bridge-data";
import { CheckCell, DataGrid, PnlCell, type GridColumn } from "@/components/bridge/data-grid";

export const Route = createFileRoute("/strategies")({
  head: () => ({
    meta: [
      { title: "Strategies — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Strategy tags with their trading window, square-off time, duplicate-signal guard, mapped account and max profit / max loss caps.",
      },
      { property: "og:title", content: "Strategies — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Strategy tags with trading windows, duplicate-signal guards and profit/loss caps.",
      },
    ],
  }),
  component: Strategies,
});

function Strategies() {
  const { strategyRows, toggleStrategyRow } = useTerminal();

  const columns: GridColumn<StrategyRow>[] = [
    {
      key: "enabled",
      header: "Enabled",
      align: "center",
      value: (r) => (r.enabled ? "Yes" : "No"),
      render: (r) => <CheckCell checked={r.enabled} onToggle={() => toggleStrategyRow(r.id)} />,
    },
    {
      key: "delete",
      header: "Delete",
      align: "center",
      filter: false,
      render: () => <Trash2 className="mx-auto h-3.5 w-3.5 text-loss" />,
    },
    { key: "manualSqOff", header: "Manual Square Off", align: "center", filter: false, render: () => "◍" },
    {
      key: "markCompleted",
      header: "Mark As Completed",
      align: "center",
      filter: false,
      render: () => <CheckCircle2 className="mx-auto h-3.5 w-3.5 text-profit" />,
    },
    { key: "strategyTag", header: "Strategy Tag" },
    { key: "pnl", header: "PNL", align: "right", render: (r) => <PnlCell value={r.pnl} /> },
    { key: "tradeValue", header: "Trade Value *", align: "right", render: (r) => r.tradeValue.toFixed(2) },
    { key: "marketOrders", header: "Market Orders" },
    { key: "noDuplicateSeconds", header: "No Duplicate Signals for Seconds", align: "right" },
    { key: "startTime", header: "Start Time" },
    { key: "endTime", header: "End Time" },
    { key: "sqOffTime", header: "SqOff Time" },
    { key: "userAccount", header: "User Account" },
    { key: "maxProfit", header: "Max Profit", align: "right" },
    { key: "maxLoss", header: "Max Loss", align: "right" },
    { key: "maxLossWaitTime", header: "Max Loss Wait Time", align: "right" },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={strategyRows}
      rowKey={(r) => r.id}
      groupBand={false}
      addRowLabel="Click here to add new row"
      hints={[
        "If a user's SqOff time hits before the strategy SqOff time, then all positions would be squared off for that user and no new order will be placed.",
        "Password and Pin is only required if you have selected Auto Login. Auto login internally fills user details in the browser for easy login. It is totally optional.",
      ]}
      toolbar={
        <>
          <button type="button" className="chrome-btn">
            <Paintbrush className="h-3.5 w-3.5 text-primary" />
            Re-Paint
          </button>
          <button type="button" className="chrome-btn">
            <Upload className="h-3.5 w-3.5 text-primary" />
            Import
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
