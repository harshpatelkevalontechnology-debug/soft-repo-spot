import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Copy,
  Download,
  Files,
  Info,
  Paintbrush,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import type { MultiLegRow } from "@/lib/bridge-data";
import { CheckCell, DataGrid, PnlCell, type GridColumn } from "@/components/bridge/data-grid";

export const Route = createFileRoute("/multi-leg")({
  head: () => ({
    meta: [
      { title: "Multi-Leg Portfolios — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Options portfolios executed as a single unit: execute or square off, payoff and chart views, per-lot value and live underlying price.",
      },
      { property: "og:title", content: "Multi-Leg Portfolios — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Options portfolios with execute/square-off, payoff view and live underlying price.",
      },
    ],
  }),
  component: MultiLeg,
});

const iconCol = (key: string, header: string, node: React.ReactNode): GridColumn<MultiLegRow> => ({
  key,
  header,
  align: "center",
  filter: false,
  render: () => <span className="flex justify-center">{node}</span>,
});

function MultiLeg() {
  const { multiLeg, toggleMultiLeg } = useTerminal();

  const columns: GridColumn<MultiLegRow>[] = [
    {
      key: "enabled",
      header: "Enabled",
      align: "center",
      value: (r) => (r.enabled ? "Yes" : "No"),
      render: (r) => <CheckCell checked={r.enabled} onToggle={() => toggleMultiLeg(r.id)} />,
    },
    { key: "status", header: "Status" },
    { key: "portfolioName", header: "Portfolio Name", width: "14rem" },
    { key: "symbol", header: "Symbol" },
    iconCol("execute", "Execute / SqOff", <Play className="h-3.5 w-3.5 text-profit" />),
    iconCol("edit", "Edit", <Pencil className="h-3.5 w-3.5 text-accent" />),
    iconCol("makeCopy", "Make Copy", <Copy className="h-3.5 w-3.5 text-primary" />),
    iconCol("clone", "Clone", <Files className="h-3.5 w-3.5 text-primary" />),
    iconCol("delete", "Delete", <Trash2 className="h-3.5 w-3.5 text-loss" />),
    iconCol("markCompleted", "Mark As Completed", <Info className="h-3.5 w-3.5 text-primary" />),
    iconCol("reset", "Reset", <RotateCcw className="h-3.5 w-3.5 text-accent" />),
    iconCol("payoff", "PayOff", <BarChart3 className="h-3.5 w-3.5 text-primary" />),
    iconCol("chart", "Chart", <BarChart3 className="h-3.5 w-3.5 text-profit" />),
    iconCol("reExecute", "ReExecute", <RefreshCw className="h-3.5 w-3.5 text-primary" />),
    iconCol("partEntry", "Part Entry / Exit", <Play className="h-3.5 w-3.5 text-accent" />),
    { key: "pnl", header: "PNL", align: "right", render: (r) => <PnlCell value={r.pnl} /> },
    { key: "currentValue", header: "Current Value", align: "right", render: (r) => r.currentValue.toFixed(2) },
    { key: "valuePerLot", header: "Value Per Lot", align: "right", render: (r) => r.valuePerLot.toFixed(2) },
    {
      key: "underlyingPrice",
      header: "Underlying Price",
      align: "right",
      render: (r) => r.underlyingPrice.toFixed(2),
    },
    { key: "underlyingLtp", header: "Underlying LTP", align: "right", render: (r) => r.underlyingLtp.toFixed(2) },
    { key: "positionalPortfolio", header: "Positional Portfolio" },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={multiLeg}
      rowKey={(r) => r.id}
      toolbar={
        <>
          <button type="button" className="chrome-btn">
            <Plus className="h-3.5 w-3.5 text-profit" />
            Add Portfolio
          </button>
          <button type="button" className="chrome-btn">
            <Info className="h-3.5 w-3.5 text-primary" />
            Options
          </button>
          <button type="button" className="chrome-btn">
            <Paintbrush className="h-3.5 w-3.5 text-primary" />
            Re-Paint
          </button>
          <label className="mx-1 inline-flex items-center gap-2 text-xs font-semibold">
            <CheckCell checked={false} />
            Greeks, Multiply by Lots
          </label>
          <button type="button" className="chrome-btn">
            <RefreshCw className="h-3.5 w-3.5 text-profit" />
            Refresh Greeks
          </button>
          <button type="button" className="chrome-btn">
            <Download className="h-3.5 w-3.5 text-profit" />
            Export
          </button>
          <button type="button" className="chrome-btn">
            <Upload className="h-3.5 w-3.5 text-primary" />
            Import
          </button>
        </>
      }
    />
  );
}
