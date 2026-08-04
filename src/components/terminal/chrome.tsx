import { Link } from "@tanstack/react-router";
import { Activity, LayoutGrid, ShieldAlert, Layers, Power, FlaskConical } from "lucide-react";
import { useTerminal } from "@/lib/terminal-store";
import { formatMoney } from "@/lib/trading-data";
import { Pill } from "./primitives";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/strategies", label: "Strategies", icon: Layers },
  { to: "/risk", label: "Risk", icon: ShieldAlert },
  { to: "/session", label: "Session", icon: Activity },
] as const;

export function TerminalChrome({ children }: { children: React.ReactNode }) {
  const { simulator, toggleSimulator, killed, activateKillSwitch, resetKillSwitch, strategies, session } =
    useTerminal();

  const dayMtm = strategies.reduce((a, s) => a + s.mtm, 0);
  const degraded = session.filter((s) => s.state !== "OK").length;

  return (
    <div className="min-h-screen">
      {simulator && (
        <div className="num bg-caution py-1 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-accent-foreground">
          Simulator mode — no orders reach the broker
        </div>
      )}
      <header className="sticky top-0 z-30 border-b border-grid bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-6 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-primary/15 text-primary">
              <Activity className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Loopback<span className="text-primary">Desk</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="num flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
                activeProps={{ className: "bg-surface-raised !text-primary" }}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="label-eyebrow leading-none">Day MTM</div>
              <div
                className={cn(
                  "num text-sm font-semibold",
                  dayMtm >= 0 ? "text-profit" : "text-loss",
                )}
              >
                {formatMoney(dayMtm, { sign: true })}
              </div>
            </div>
            <Pill tone={degraded ? "warn" : "ok"} dot>
              {degraded ? `${degraded} degraded` : "All healthy"}
            </Pill>
            <button
              onClick={toggleSimulator}
              className={cn(
                "num flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[0.6875rem] uppercase tracking-wider transition-colors",
                simulator
                  ? "border-caution/50 bg-caution/15 text-caution"
                  : "border-grid text-muted-foreground hover:text-foreground",
              )}
            >
              <FlaskConical className="size-3.5" />
              Sim
            </button>
            <button
              onClick={killed ? resetKillSwitch : activateKillSwitch}
              className={cn(
                "num flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider transition-colors",
                killed
                  ? "border-grid bg-muted text-muted-foreground hover:text-foreground"
                  : "border-loss/50 bg-loss/15 text-loss hover:bg-loss/25",
              )}
            >
              <Power className="size-3.5" />
              {killed ? "Re-arm" : "Kill switch"}
            </button>
          </div>
        </div>
      </header>

      {killed && (
        <div className="num border-b border-loss/40 bg-loss/10 px-5 py-2 text-center text-xs uppercase tracking-wider text-loss">
          Kill switch engaged — all strategies exited, working orders pulled
        </div>
      )}

      <main className="mx-auto max-w-[1500px] px-5 py-6">{children}</main>
    </div>
  );
}
