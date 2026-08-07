import { createFileRoute } from "@tanstack/react-router";
import { Paintbrush, Plus, Trash2 } from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import type { RemoteRow } from "@/lib/bridge-data";
import { CheckCell, DataGrid, type GridColumn } from "@/components/bridge/data-grid";

export const Route = createFileRoute("/remote-share")({
  head: () => ({
    meta: [
      { title: "Remote Share — LoopbackDesk Bridge" },
      {
        name: "description",
        content:
          "Share your signals as a remote host or receive them as a remote client, with per-link user limits, strategy tags and symbol mappings.",
      },
      { property: "og:title", content: "Remote Share — LoopbackDesk Bridge" },
      {
        property: "og:description",
        content: "Signal sharing between a remote host and remote clients with per-link limits.",
      },
    ],
  }),
  component: RemoteShare,
});

function panelColumns(onToggle: (id: string) => void): GridColumn<RemoteRow>[] {
  return [
    {
      key: "enabled",
      header: "Enabled",
      align: "center",
      value: (r) => (r.enabled ? "Yes" : "No"),
      render: (r) => <CheckCell checked={r.enabled} onToggle={() => onToggle(r.id)} />,
    },
    { key: "remoteId", header: "Remote ID" },
    { key: "maxUsersAllowed", header: "Max Users Allowed", align: "right" },
    { key: "strategyTag", header: "Strategy Tag" },
    { key: "symbolMappings", header: "Symbol Mappings" },
    {
      key: "delete",
      header: "Delete",
      align: "center",
      filter: false,
      render: () => <Trash2 className="mx-auto h-3.5 w-3.5 text-loss" />,
    },
  ];
}

function RemoteShare() {
  const { remoteHosts, remoteClients, toggleRemoteHost, toggleRemoteClient } = useTerminal();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 divide-x divide-grid lg:grid-cols-2">
        <section className="flex min-h-0 flex-col">
          <header className="shrink-0 border-b border-grid px-3 pb-2 pt-3">
            <h1 className="text-base font-semibold">Remote Host</h1>
            <div className="mt-2 flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <CheckCell checked={false} />
                Enable Remote Host (Signal Provider)
              </label>
              <button type="button" className="chrome-btn">
                <Plus className="h-3.5 w-3.5 text-profit" />
                Add Remote Client
              </button>
            </div>
          </header>
          <div className="min-h-0 flex-1">
            <DataGrid
              columns={panelColumns(toggleRemoteHost)}
              rows={remoteHosts}
              rowKey={(r) => r.id}
              groupBand={false}
            />
          </div>
        </section>

        <section className="flex min-h-0 flex-col">
          <header className="shrink-0 border-b border-grid px-3 pb-2 pt-3">
            <h2 className="text-base font-semibold">Remote Client</h2>
            <div className="mt-2 flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <CheckCell checked={false} />
                Enable Remote Client (Signal Receiver)
              </label>
              <button type="button" className="chrome-btn">
                <Plus className="h-3.5 w-3.5 text-profit" />
                Add Remote Host
              </button>
            </div>
          </header>
          <div className="min-h-0 flex-1">
            <DataGrid
              columns={panelColumns(toggleRemoteClient)}
              rows={remoteClients}
              rowKey={(r) => r.id}
              groupBand={false}
            />
          </div>
        </section>
      </div>

      <div className="flex shrink-0 items-end justify-between gap-4 border-t border-grid bg-chrome px-3 py-2">
        <div className="space-y-1 text-[0.6875rem] leading-tight text-accent">
          <p>
            Disclaimer: Using remote host, you can share your signal with your friends and family, and using remote
            client you can receive signals from your trusted remote host. Please check policy guidelines from your
            Broker / Exchange or regulatory body. User discretion advised.
          </p>
          <p>
            Your signals are communicated in a fully encrypted way between you and the remote host / client. Any
            information related to Remote Host / Client is saved only on your computer locally.
          </p>
        </div>
        <button type="button" className="chrome-btn">
          <Paintbrush className="h-3.5 w-3.5 text-primary" />
          Re-Paint
        </button>
      </div>
    </div>
  );
}
