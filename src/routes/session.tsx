import { createFileRoute } from "@tanstack/react-router";
import { useTerminal } from "@/lib/terminal-store";
import { Panel, Pill, Meter } from "@/components/terminal/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/session")({
  head: () => ({
    meta: [
      { title: "Session Supervisor — LoopbackDesk" },
      {
        name: "description",
        content:
          "Health of every hop: Python core on :8788, Go broker wrapper on :8787, broker sessions, tick feed and license verification.",
      },
      { property: "og:title", content: "Session Supervisor — LoopbackDesk" },
      {
        property: "og:description",
        content: "Health of every hop — core, wrapper, broker sessions, tick feed and licensing — so failures are attributable.",
      },
    ],
  }),
  component: Session,
});

const tone = { OK: "ok", DEGRADED: "warn", DOWN: "bad" } as const;

function Session() {
  const { session } = useTerminal();
  const down = session.filter((s) => s.state === "DOWN").length;
  const degraded = session.filter((s) => s.state === "DEGRADED").length;

  return (
    <div className="space-y-5">
      <div>
        <div className="label-eyebrow">FR-SESS · Session &amp; connectivity guardian</div>
        <h1 className="text-2xl font-semibold tracking-tight">Session supervisor</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Support must identify the failing hop — UI, core, wrapper or broker — without guesswork. Each row is
          one hop with its own heartbeat and latency budget.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Panel bodyClassName="px-4 py-3.5">
          <div className="label-eyebrow">Healthy hops</div>
          <div className="num mt-1 text-2xl font-semibold text-profit">
            {session.length - down - degraded}/{session.length}
          </div>
        </Panel>
        <Panel bodyClassName="px-4 py-3.5">
          <div className="label-eyebrow">Degraded</div>
          <div className="num mt-1 text-2xl font-semibold text-caution">{degraded}</div>
        </Panel>
        <Panel bodyClassName="px-4 py-3.5">
          <div className="label-eyebrow">Down</div>
          <div className="num mt-1 text-2xl font-semibold text-loss">{down}</div>
        </Panel>
      </div>

      <Panel eyebrow="Loopback only" title="Hop health" bodyClassName="divide-y divide-grid">
        {session.map((c) => (
          <div key={c.id} className="grid gap-3 px-4 py-3.5 md:grid-cols-[240px_minmax(0,1fr)_160px] md:items-center">
            <div>
              <div className="text-sm font-medium">{c.name}</div>
              <div className="num text-[0.6875rem] text-muted-foreground">{c.endpoint}</div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{c.detail}</p>
              <div className="mt-2 max-w-xs">
                <Meter
                  pct={Math.min(100, (c.latencyMs / 800) * 100)}
                  tone={c.latencyMs > 400 ? "bad" : c.latencyMs > 150 ? "warn" : "ok"}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <span className={cn("num text-xs", c.latencyMs > 400 ? "text-caution" : "text-muted-foreground")}>
                {c.latencyMs ? `${c.latencyMs} ms` : "—"}
              </span>
              <Pill tone={tone[c.state]} dot={c.state === "OK"}>
                {c.state}
              </Pill>
            </div>
          </div>
        ))}
      </Panel>

      <Panel eyebrow="Process model" title="Three processes, one machine" bodyClassName="grid gap-4 px-4 py-4 md:grid-cols-3">
        {[
          {
            t: "Tauri shell",
            d: "Presentation only. Renders intents, owns the kill-switch hotkey and the simulator banner. Never holds business logic.",
          },
          {
            t: "Python core · :8788",
            d: "Owns all trading state: execution engine, risk gates, session guardian, mapping, simulator, diagnostics, licensing.",
          },
          {
            t: "Go wrapper · :8787",
            d: "Stateless single-attempt broker calls. Returns SUCCESS, FAILED or UNKNOWN — never retries on its own.",
          },
        ].map((p) => (
          <div key={p.t} className="rounded-md border border-grid bg-surface-raised/40 p-3.5">
            <div className="num text-xs uppercase tracking-wider text-primary">{p.t}</div>
            <p className="mt-1.5 text-xs text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </Panel>
    </div>
  );
}
