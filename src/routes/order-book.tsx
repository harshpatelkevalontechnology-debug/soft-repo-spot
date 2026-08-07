import { createFileRoute } from "@tanstack/react-router";
import { Download, Paintbrush, RefreshCw } from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import type { BrokerOrderRow } from "@/lib/bridge-data";
import { DataGrid, type GridColumn } from "@/components/bridge/data-grid";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order-book")({
  head: () => ({
    meta: [
      { title: "Order Book — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Broker-side order book showing every order with status, fill quantity, trigger price, exchange order ID and the account that placed it.",
      },
      { property: "og:title", content: "Order Book — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Broker order book with status, fills, trigger prices and exchange order IDs.",
      },
    ],
  }),
  component: OrderBookTab,
});

const statusTone: Record<string, string> = {
  COMPLETE: "text-profit font-semibold",
  OPEN: "text-primary font-semibold",
  UNKNOWN: "text-accent font-semibold",
  REJECTED: "text-loss font-semibold",
  CANCELLED: "text-muted-foreground font-semibold",
};

function OrderBookTab() {
  const { brokerOrders, showOrderBook, setShowOrderBook } = useTerminal();

  const columns: GridColumn<BrokerOrderRow>[] = [
    { key: "symbol", header: "Symbol", width: "15rem" },
    { key: "exchange", header: "Exchange" },
    { key: "orderTime", header: "Order Time" },
    { key: "orderId", header: "Order ID" },
    {
      key: "txn",
      header: "Txn",
      render: (r) => (
        <span className={cn("font-semibold", r.txn === "BUY" ? "text-profit" : "text-loss")}>{r.txn}</span>
      ),
    },
    { key: "avgPrice", header: "Avg Price", align: "right", render: (r) => r.avgPrice.toFixed(2) },
    { key: "quantity", header: "Quantity", align: "right" },
    { key: "filledQuantity", header: "Filled Quantity", align: "right" },
    { key: "orderType", header: "Order Type" },
    { key: "price", header: "Price", align: "right", render: (r) => r.price.toFixed(2) },
    { key: "triggerPrice", header: "Trigger Price", align: "right", render: (r) => r.triggerPrice.toFixed(2) },
    { key: "exchangeTime", header: "Exchange Time" },
    { key: "exchgOrderId", header: "Exchg Order ID" },
    { key: "product", header: "Product" },
    { key: "validity", header: "Validity" },
    {
      key: "status",
      header: "Status",
      render: (r) => <span className={statusTone[r.status] ?? ""}>{r.status}</span>,
    },
    { key: "userId", header: "User ID" },
    { key: "userAlias", header: "User Alias" },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={showOrderBook ? brokerOrders : []}
      rowKey={(r) => r.id}
      emptyText="Order Book display is turned off."
      hints={[
        "Order Book is shown from the Broker's Data and doesn't have any use for the bridge. It is shown for your reference only.",
        "Order Book refreshes randomly and can be delayed up to 1 minute. If you need recent data you can click Refresh.",
        "You can create groups by Dragging one or more column(s) into \u201cDrag a column\u201d Area for better viewing.",
      ]}
      toolbar={
        <>
          <label className="mr-2 inline-flex items-center gap-2 text-xs font-semibold">
            Show OrderBook
            <button
              type="button"
              role="switch"
              aria-checked={showOrderBook}
              onClick={() => setShowOrderBook(!showOrderBook)}
              className={cn(
                "relative h-4 w-8 rounded-full transition-colors",
                showOrderBook ? "bg-primary" : "bg-muted-foreground/40",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-3 w-3 rounded-full bg-surface transition-all",
                  showOrderBook ? "left-4" : "left-0.5",
                )}
              />
            </button>
          </label>
          <button type="button" className="chrome-btn">
            <Paintbrush className="h-3.5 w-3.5 text-primary" />
            Re-Paint
          </button>
          <button type="button" className="chrome-btn">
            <RefreshCw className="h-3.5 w-3.5 text-primary" />
            Refresh
          </button>
          <button type="button" className="chrome-btn">
            <Download className="h-3.5 w-3.5 text-profit" />
            Export OrderBook
          </button>
        </>
      }
    />
  );
}
