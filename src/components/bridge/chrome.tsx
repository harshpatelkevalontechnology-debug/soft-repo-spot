import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  CircleAlert,
  Copy,
  Download,
  Info,
  KeyRound,
  Maximize2,
  Minus,
  Play,
  ScrollText,
  Settings2,
  Square,
  Wrench,
  X,
} from "lucide-react";
import { useTerminal, type FreakProtection, type TradingMode } from "@/lib/terminal-store";
import type { LogType } from "@/lib/bridge-data";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Symbol Mapping" },
  { to: "/signals", label: "Signals" },
  { to: "/orders-summary", label: "Orders Summary" },
  { to: "/order-book", label: "Order Book" },
  { to: "/positions", label: "Positions" },
  { to: "/holdings", label: "Holdings" },
  { to: "/user-settings", label: "User Settings" },
  { to: "/strategies", label: "Strategies" },
  { to: "/multi-leg", label: "Multi-Leg" },
  { to: "/remote-share", label: "Remote Share" },
  { to: "/adv-bridge", label: "Adv Bridge *" },
  { to: "/risk", label: "Risk" },
  { to: "/session", label: "Session" },
  { to: "/overview", label: "Overview" },
] as const;

const LOG_TONE: Record<LogType, string> = {
  MESSAGE: "text-log-message",
  WARNING: "text-accent",
  ERROR: "text-loss",
  ATTENTION: "text-loss",
  TRADING: "text-profit",
};

function TitleBar() {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-grid bg-chrome pl-2 pr-1">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-[3px] bg-primary text-[0.625rem] font-bold text-primary-foreground">
          LD
        </div>
        <span className="text-sm font-bold text-foreground">LoopbackDesk</span>
        <span className="text-sm text-muted-foreground">|</span>
        <span className="text-sm font-semibold text-foreground">Intelligent Trading Bridge</span>
      </div>
      <div className="flex items-center">
        {[
          { icon: <span className="text-sm font-semibold">?</span>, label: "Help" },
          { icon: <Minus className="h-3.5 w-3.5" />, label: "Minimise" },
          { icon: <Maximize2 className="h-3 w-3" />, label: "Maximise" },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            aria-label={b.label}
            className="flex h-8 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {b.icon}
          </button>
        ))}
        <button
          type="button"
          aria-label="Close"
          className="flex h-8 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function TabStrip() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex shrink-0 overflow-x-auto bg-tabbar" aria-label="Bridge sections">
      {TABS.map((t) => {
        const active = pathname === t.to;
        return (
          <Link
            key={t.to}
            to={t.to}
            className={cn(
              "relative whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors",
              active
                ? "text-tabbar-active after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-tabbar-active"
                : "text-tabbar-foreground/75 hover:text-tabbar-active",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

function ActionBar() {
  const {
    trading,
    tradingMode,
    setTradingMode,
    freakProtection,
    setFreakProtection,
    startTrading,
    stopTrading,
    verifyApiLogin,
  } = useTerminal();

  const select =
    "rounded-sm border border-grid bg-surface px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="shrink-0 border-t border-grid bg-chrome px-3 py-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <button type="button" className="chrome-btn" onClick={verifyApiLogin}>
            <KeyRound className="h-3.5 w-3.5 text-profit" />
            Verify API Login
          </button>

          <label className="flex flex-col gap-1">
            <span className="text-[0.6875rem] font-semibold text-foreground">Freak Protection</span>
            <select
              className={select}
              value={freakProtection}
              onChange={(e) => setFreakProtection(e.target.value as FreakProtection)}
            >
              {["Off", "Normal", "Strong"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[0.6875rem] font-semibold text-foreground">Trading Mode :</span>
            <select
              className={select}
              value={tradingMode}
              onChange={(e) => setTradingMode(e.target.value as TradingMode)}
            >
              {["Live", "Paper", "Simulated"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="chrome-btn"
            onClick={startTrading}
            disabled={trading}
          >
            <Play className="h-3.5 w-3.5 text-profit" fill="currentColor" />
            Start Trading
          </button>
          <button type="button" className="chrome-btn" onClick={stopTrading} disabled={!trading}>
            <Square className="h-3 w-3 text-loss" fill="currentColor" />
            Stop Trading
          </button>
          <button type="button" className="chrome-btn">
            <Settings2 className="h-3.5 w-3.5 text-primary" />
            Options Trading
          </button>
          <button type="button" className="chrome-btn">
            <Wrench className="h-3.5 w-3.5 text-profit" />
            Trading Tools
          </button>
          <button type="button" className="chrome-btn">
            <Settings2 className="h-3.5 w-3.5 text-accent" />
            Settings
          </button>
        </div>
      </div>

      <p className="mt-1.5 text-[0.6875rem] text-hint">
        <span className="font-bold text-loss">IMPORTANT:</span> Do not restart bridge while you have
        open positions. If needed you can try clicking Stop Trading button and then Start Trading again.
      </p>
    </div>
  );
}

type LogFilter = "ALL" | "ATTENTION" | "ERROR" | "WARNING" | "MESSAGE" | "TRADING";

function LogConsole() {
  const { logs, clearLogs } = useTerminal();
  const [filter, setFilter] = useState<LogFilter>("ALL");

  const counts = useMemo(() => {
    const c: Record<LogType, number> = {
      ATTENTION: 0,
      ERROR: 0,
      WARNING: 0,
      MESSAGE: 0,
      TRADING: 0,
    };
    logs.forEach((l) => {
      c[l.type] += 1;
    });
    return c;
  }, [logs]);

  const visible = filter === "ALL" ? logs : logs.filter((l) => l.type === filter);

  const chips: { key: LogFilter; label: string; icon: ReactNode }[] = [
    { key: "ALL", label: "All Logs", icon: <ScrollText className="h-3.5 w-3.5 text-profit" /> },
    {
      key: "ATTENTION",
      label: `${counts.ATTENTION} Attention`,
      icon: <AlertTriangle className="h-3.5 w-3.5 text-accent" />,
    },
    { key: "ERROR", label: `${counts.ERROR} Errors`, icon: <CircleAlert className="h-3.5 w-3.5 text-loss" /> },
    {
      key: "WARNING",
      label: `${counts.WARNING} Warnings`,
      icon: <AlertTriangle className="h-3.5 w-3.5 text-accent" />,
    },
    { key: "MESSAGE", label: `${counts.MESSAGE} Messages`, icon: <Info className="h-3.5 w-3.5 text-primary" /> },
    { key: "TRADING", label: `${counts.TRADING} Trading`, icon: <Play className="h-3 w-3 text-profit" /> },
  ];



  const copyAll = () => {
    const text = visible.map((l) => `${l.timestamp}\t${l.type}\t${l.message}`).join("\n");
    void navigator.clipboard?.writeText(text);
  };

  return (
    <section className="flex h-64 shrink-0 flex-col border-t border-grid bg-surface" aria-label="Log console">
      <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-grid bg-chrome px-2 py-1">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-semibold transition-colors",
              filter === c.key ? "border-primary bg-surface text-foreground" : "border-transparent text-foreground/80 hover:bg-muted",
            )}
          >
            {c.icon}
            {c.label}
          </button>
        ))}

        <span className="mx-1 h-4 w-px bg-grid" />

        <button type="button" className="chrome-btn" onClick={clearLogs}>
          Clear Logs
        </button>
        <button type="button" className="chrome-btn" onClick={copyAll}>
          <Copy className="h-3 w-3" />
          Copy All
        </button>
        <button type="button" className="chrome-btn">
          <Download className="h-3 w-3 text-profit" />
          Export
        </button>

        <div className="ml-auto flex items-center gap-3 pr-1 text-xs font-bold">
          <span>
            NIFTY <span className="num font-semibold text-profit">24,512.40</span>
          </span>
          <span>
            BANKNIFTY <span className="num font-semibold text-loss">52,398.40</span>
          </span>
          <span>
            SENSEX <span className="num font-semibold text-profit">80,244.10</span>
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="grid-head border-b border-grid text-left">
              {["Timestamp", "Log Type", "User", "Strategy", "Portfolio", "Message"].map((h) => (
                <th key={h} className="border-r border-grid/70 px-2 py-1.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((l) => (
              <tr
                key={l.id}
                className={cn(
                  "border-b border-grid/50",
                  (l.type === "ERROR" || l.type === "ATTENTION") && "bg-row-highlight/40",
                )}
              >
                <td className="num whitespace-nowrap px-2 py-1 text-log-message">{l.timestamp}</td>
                <td className={cn("whitespace-nowrap px-2 py-1 font-semibold", LOG_TONE[l.type])}>{l.type}</td>
                <td className="whitespace-nowrap px-2 py-1">{l.user}</td>
                <td className="whitespace-nowrap px-2 py-1">{l.strategy}</td>
                <td className="whitespace-nowrap px-2 py-1">{l.portfolio}</td>
                <td className="px-2 py-1">{l.message}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                  No log entries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function BridgeWindow({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-chrome text-foreground">
      <TitleBar />
      <TabStrip />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden border-b border-grid bg-surface">
        {children}
      </main>
      <ActionBar />
      <LogConsole />
    </div>
  );
}
