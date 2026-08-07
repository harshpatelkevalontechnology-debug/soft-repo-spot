import { createFileRoute } from "@tanstack/react-router";
import { useTerminal } from "@/lib/terminal-store";
import type { SymbolMapRow } from "@/lib/bridge-data";
import { CheckCell, DataGrid, type GridColumn } from "@/components/bridge/data-grid";
import { Pencil, Plus, Trash2, Upload, Download } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Symbol Mapping — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Map source symbols from your data provider to exchange symbols, products, order types and per-symbol quantity and risk caps.",
      },
      { property: "og:title", content: "Symbol Mapping — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Source-to-exchange symbol mapping with per-symbol quantity and risk caps.",
      },
    ],
  }),
  component: SymbolMapping,
});

function SymbolMapping() {
  const { symbolMaps, toggleSymbolMap, deleteSymbolMap } = useTerminal();

  const columns: GridColumn<SymbolMapRow>[] = [
    {
      key: "enabled",
      header: "Enabled",
      align: "center",
      value: (r) => (r.enabled ? "Yes" : "No"),
      render: (r) => <CheckCell checked={r.enabled} onToggle={() => toggleSymbolMap(r.id)} />,
    },
    {
      key: "edit",
      header: "Edit",
      align: "center",
      filter: false,
      render: () => <Pencil className="mx-auto h-3.5 w-3.5 text-accent" />,
    },
    {
      key: "delete",
      header: "Delete",
      align: "center",
      filter: false,
      render: (r) => (
        <button type="button" aria-label={`Delete ${r.sourceSymbol}`} onClick={() => deleteSymbolMap(r.id)}>
          <Trash2 className="mx-auto h-3.5 w-3.5 text-loss" />
        </button>
      ),
    },
    { key: "sourceSymbol", header: "Source Symbol" },
    { key: "dataProvider", header: "Data Provider" },
    { key: "mapping", header: "Mapping" },
    { key: "exchange", header: "Exchange" },
    { key: "exchgSymbol", header: "Exchg Symbol" },
    { key: "product", header: "Product" },
    { key: "entryOrder", header: "Entry Order" },
    { key: "exitOrder", header: "Exit Order" },
    { key: "strategies", header: "Strategies" },
    { key: "qtyType", header: "Qty Type" },
    { key: "qtyValue", header: "Qty Value", align: "right" },
    { key: "maxQty", header: "Max Qty", align: "right" },
    { key: "maxOpenPos", header: "Max Open Pos", align: "right" },
    { key: "maxOpenTrades", header: "Max Open Trades", align: "right" },
    { key: "maxTrades", header: "Max Trades", align: "right" },
    { key: "maxProfitPerTrade", header: "Max Profit Per Trade", align: "right" },
    { key: "maxLossPerTrade", header: "Max Loss Per Trade", align: "right" },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={symbolMaps}
      rowKey={(r) => r.id}
      groupBand={false}
      hints={["FOR BEST PERFORMANCE, DISABLE THE MAPPINGS WHICH ARE NOT REQUIRED."]}
      toolbar={
        <>
          <button type="button" className="chrome-btn">
            <Plus className="h-3.5 w-3.5 text-profit" />
            Add Symbol
          </button>
          <button type="button" className="chrome-btn">
            <Trash2 className="h-3.5 w-3.5 text-loss" />
            Delete All Symbols
          </button>
          <button type="button" className="chrome-btn">
            <Plus className="h-3.5 w-3.5 text-profit" />
            Add Adv Symbol
          </button>
          <button type="button" className="chrome-btn">
            <Upload className="h-3.5 w-3.5 text-primary" />
            Import Symbols
          </button>
          <button type="button" className="chrome-btn">
            <Download className="h-3.5 w-3.5 text-profit" />
            Export Symbols
          </button>
        </>
      }
    />
  );
}
