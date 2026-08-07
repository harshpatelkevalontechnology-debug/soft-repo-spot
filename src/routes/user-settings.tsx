import { createFileRoute } from "@tanstack/react-router";
import { Download, HelpCircle, LogOut, Paintbrush, RefreshCw, Trash2, Upload } from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import type { UserRow } from "@/lib/bridge-data";
import { CheckCell, DataGrid, PnlCell, type GridColumn } from "@/components/bridge/data-grid";

export const Route = createFileRoute("/user-settings")({
  head: () => ({
    meta: [
      { title: "User Settings — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Broker accounts wired into the bridge: API credentials, login state, live MTM, available margin and square-off timings per user.",
      },
      { property: "og:title", content: "User Settings — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Broker accounts with API credentials, MTM, margin and square-off timings.",
      },
    ],
  }),
  component: UserSettings,
});

function UserSettings() {
  const { users, toggleUser } = useTerminal();

  const columns: GridColumn<UserRow>[] = [
    {
      key: "enabled",
      header: "Enabled",
      align: "center",
      value: (r) => (r.enabled ? "Yes" : "No"),
      render: (r) => <CheckCell checked={r.enabled} onToggle={() => toggleUser(r.id)} />,
    },
    {
      key: "delete",
      header: "Delete",
      align: "center",
      filter: false,
      render: () => <Trash2 className="mx-auto h-3.5 w-3.5 text-loss" />,
    },
    {
      key: "logout",
      header: "Logout",
      align: "center",
      filter: false,
      render: () => <LogOut className="mx-auto h-3.5 w-3.5 text-primary" />,
    },
    { key: "manualSqOff", header: "Manual Square Off", align: "center", filter: false, render: () => "◍" },
    {
      key: "loggedIn",
      header: "LoggedIn",
      align: "center",
      value: (r) => (r.loggedIn ? "Yes" : "No"),
      render: (r) => <CheckCell checked={r.loggedIn} />,
    },
    { key: "mtmAll", header: "MTM (All)", align: "right", render: (r) => <PnlCell value={r.mtmAll} /> },
    { key: "misMtm", header: "MIS MTM", align: "right", render: (r) => <PnlCell value={r.misMtm} /> },
    { key: "nrmlMtm", header: "NRML MTM", align: "right", render: (r) => <PnlCell value={r.nrmlMtm} /> },
    {
      key: "availableMargin",
      header: "Available Margin",
      align: "right",
      render: (r) => r.availableMargin.toFixed(2),
    },
    { key: "marketOrders", header: "Market Orders" },
    { key: "userAlias", header: "User Alias" },
    { key: "userId", header: "User ID" },
    { key: "broker", header: "Broker" },
    { key: "apiKey", header: "API Key" },
    { key: "apiSecret", header: "API Secret" },
    {
      key: "historicalApi",
      header: "Historical API",
      align: "center",
      value: (r) => (r.historicalApi ? "Yes" : "No"),
      render: (r) => <CheckCell checked={r.historicalApi} />,
    },
    { key: "sqOffTime", header: "SqOff Time" },
    { key: "enableNrmlSqOff", header: "Enable NRML SqOff" },
    {
      key: "enableCncSqOff",
      header: "Enable CNC SqOff",
      align: "center",
      value: (r) => (r.enableCncSqOff ? "Yes" : "No"),
      render: (r) => <CheckCell checked={r.enableCncSqOff} />,
    },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={users}
      rowKey={(r) => r.id}
      groupBand={false}
      addRowLabel="Click here to add new row"
      hints={[
        "Bridge never collects user id or related details. Any provided ID, Password or any other sensitive information will be saved only on the user's computer with encryption.",
        "Password and Pin is only required if you have selected Auto Login. Auto login internally fills user details in the browser for easy login. It is totally optional.",
        "If you are facing a Login issue with your broker, un-tick Auto Login and proceed with Manual Login.",
      ]}
      toolbar={
        <>
          <button type="button" className="chrome-btn">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            Help
          </button>
          <button type="button" className="chrome-btn">
            <Paintbrush className="h-3.5 w-3.5 text-primary" />
            Re-Paint
          </button>
          <button type="button" className="chrome-btn">
            <RefreshCw className="h-3.5 w-3.5 text-profit" />
            Refresh
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
