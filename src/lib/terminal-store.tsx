import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  seedOrders,
  seedRiskLimits,
  seedSession,
  seedStrategies,
  type Order,
  type RiskLimit,
  type SessionComponent,
  type Strategy,
} from "./trading-data";
import {
  seedBrokerOrders,
  seedHoldings,
  seedLogs,
  seedMultiLeg,
  seedOrderSummary,
  seedPositions,
  seedRemoteClients,
  seedRemoteHosts,
  seedSignals,
  seedStrategyRows,
  seedSymbolMaps,
  seedUsers,
  type BrokerOrderRow,
  type HoldingRow,
  type LogRow,
  type LogType,
  type MultiLegRow,
  type OrderSummaryRow,
  type PositionRow,
  type RemoteRow,
  type SignalRow,
  type StrategyRow,
  type SymbolMapRow,
  type UserRow,
} from "./bridge-data";

export type TradingMode = "Live" | "Paper" | "Simulated";
export type FreakProtection = "Off" | "Normal" | "Strong";

interface TerminalState {
  /* core-slice domain */
  orders: Order[];
  strategies: Strategy[];
  risk: RiskLimit[];
  session: SessionComponent[];
  simulator: boolean;
  killed: boolean;
  toggleSimulator: () => void;
  activateKillSwitch: () => void;
  resetKillSwitch: () => void;
  cancelOrder: (id: string) => void;
  reconcileOrder: (id: string) => void;
  setStrategyState: (id: string, state: Strategy["state"]) => void;
  toggleRiskLimit: (id: string) => void;

  /* bridge grids */
  logs: LogRow[];
  symbolMaps: SymbolMapRow[];
  signals: SignalRow[];
  orderSummary: OrderSummaryRow[];
  brokerOrders: BrokerOrderRow[];
  positions: PositionRow[];
  holdings: HoldingRow[];
  users: UserRow[];
  strategyRows: StrategyRow[];
  multiLeg: MultiLegRow[];
  remoteHosts: RemoteRow[];
  remoteClients: RemoteRow[];

  /* bridge chrome */
  trading: boolean;
  tradingMode: TradingMode;
  freakProtection: FreakProtection;
  showOrderBook: boolean;
  setTradingMode: (m: TradingMode) => void;
  setFreakProtection: (f: FreakProtection) => void;
  setShowOrderBook: (v: boolean) => void;
  startTrading: () => void;
  stopTrading: () => void;
  verifyApiLogin: () => void;
  clearLogs: () => void;
  log: (type: LogType, message: string, extra?: Partial<LogRow>) => void;

  /* row-level toggles */
  toggleSymbolMap: (id: string) => void;
  deleteSymbolMap: (id: string) => void;
  toggleUser: (id: string) => void;
  toggleStrategyRow: (id: string) => void;
  toggleMultiLeg: (id: string) => void;
  toggleRemoteHost: (id: string) => void;
  toggleRemoteClient: (id: string) => void;
}

const TerminalContext = createContext<TerminalState | null>(null);

function stamp() {
  const d = new Date();
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => seedOrders());
  const [strategies, setStrategies] = useState<Strategy[]>(() => seedStrategies());
  const [risk, setRisk] = useState<RiskLimit[]>(() => seedRiskLimits());
  const [session] = useState<SessionComponent[]>(() => seedSession());
  const [simulator, setSimulator] = useState(false);
  const [killed, setKilled] = useState(false);

  const [logs, setLogs] = useState<LogRow[]>(() => seedLogs());
  const [symbolMaps, setSymbolMaps] = useState<SymbolMapRow[]>(() => seedSymbolMaps());
  const [signals] = useState<SignalRow[]>(() => seedSignals());
  const [orderSummary] = useState<OrderSummaryRow[]>(() => seedOrderSummary());
  const [brokerOrders] = useState<BrokerOrderRow[]>(() => seedBrokerOrders());
  const [positions] = useState<PositionRow[]>(() => seedPositions());
  const [holdings] = useState<HoldingRow[]>(() => seedHoldings());
  const [users, setUsers] = useState<UserRow[]>(() => seedUsers());
  const [strategyRows, setStrategyRows] = useState<StrategyRow[]>(() => seedStrategyRows());
  const [multiLeg, setMultiLeg] = useState<MultiLegRow[]>(() => seedMultiLeg());
  const [remoteHosts, setRemoteHosts] = useState<RemoteRow[]>(() => seedRemoteHosts());
  const [remoteClients, setRemoteClients] = useState<RemoteRow[]>(() => seedRemoteClients());

  const [trading, setTrading] = useState(false);
  const [tradingMode, setTradingMode] = useState<TradingMode>("Live");
  const [freakProtection, setFreakProtection] = useState<FreakProtection>("Strong");
  const [showOrderBook, setShowOrderBook] = useState(true);

  const log = useCallback((type: LogType, message: string, extra?: Partial<LogRow>) => {
    setLogs((prev) => [
      ...prev,
      {
        id: `LOG-${prev.length + 1}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: stamp(),
        type,
        user: extra?.user ?? "",
        strategy: extra?.strategy ?? "",
        portfolio: extra?.portfolio ?? "",
        message,
      },
    ]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const startTrading = useCallback(() => {
    setTrading(true);
    log("TRADING", "Start Trading requested by user.");
    log("MESSAGE", "Refreshing Positions and Holdings...");
    log("TRADING", "Bridge is now LIVE. Listening for signals.");
  }, [log]);

  const stopTrading = useCallback(() => {
    setTrading(false);
    log("TRADING", "Stop Trading requested. No new orders will be placed.");
    log("WARNING", "Open positions are NOT squared off by Stop Trading.");
  }, [log]);

  const verifyApiLogin = useCallback(() => {
    log("MESSAGE", "Verify API Login");
    setUsers((prev) =>
      prev.map((u) => (u.broker === "APITest" ? u : { ...u, loggedIn: true })),
    );
    log("ERROR", "Simulated1 (SIM1 - APITest) Login Failed!", { user: "SIM1" });
    log("MESSAGE", "Orvix Live (HD4412 - Orvix) Logged in successfully.", { user: "HD4412" });
  }, [log]);

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && (o.status === "PENDING" || o.status === "UNKNOWN")
          ? { ...o, status: "CANCELLED", hop: "core", note: "Cancelled from order book" }
          : o,
      ),
    );
  }, []);

  const reconcileOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status === "UNKNOWN"
          ? { ...o, status: "FAILED", hop: "broker", note: "Reconciled against broker book: no order found" }
          : o,
      ),
    );
  }, []);

  const setStrategyState = useCallback((id: string, state: Strategy["state"]) => {
    setStrategies((prev) => prev.map((s) => (s.id === id ? { ...s, state } : s)));
  }, []);

  const toggleRiskLimit = useCallback((id: string) => {
    setRisk((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);

  const activateKillSwitch = useCallback(() => {
    setKilled(true);
    setTrading(false);
    setStrategies((prev) =>
      prev.map((s) => (s.state === "RUNNING" || s.state === "ARMED" ? { ...s, state: "EXITED" } : s)),
    );
    setOrders((prev) =>
      prev.map((o) =>
        o.status === "PENDING"
          ? { ...o, status: "CANCELLED", hop: "core", note: "Kill switch: all working orders pulled" }
          : o,
      ),
    );
    log("ATTENTION", "KILL SWITCH: all working orders pulled and strategies squared off.");
  }, [log]);

  const resetKillSwitch = useCallback(() => setKilled(false), []);

  const toggleSymbolMap = useCallback((id: string) => {
    setSymbolMaps((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);
  const deleteSymbolMap = useCallback((id: string) => {
    setSymbolMaps((prev) => prev.filter((r) => r.id !== id));
  }, []);
  const toggleUser = useCallback((id: string) => {
    setUsers((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);
  const toggleStrategyRow = useCallback((id: string) => {
    setStrategyRows((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);
  const toggleMultiLeg = useCallback((id: string) => {
    setMultiLeg((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);
  const toggleRemoteHost = useCallback((id: string) => {
    setRemoteHosts((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);
  const toggleRemoteClient = useCallback((id: string) => {
    setRemoteClients((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);

  const value = useMemo<TerminalState>(
    () => ({
      orders,
      strategies,
      risk,
      session,
      simulator,
      killed,
      toggleSimulator: () => setSimulator((s) => !s),
      activateKillSwitch,
      resetKillSwitch,
      cancelOrder,
      reconcileOrder,
      setStrategyState,
      toggleRiskLimit,
      logs,
      symbolMaps,
      signals,
      orderSummary,
      brokerOrders,
      positions,
      holdings,
      users,
      strategyRows,
      multiLeg,
      remoteHosts,
      remoteClients,
      trading,
      tradingMode,
      freakProtection,
      showOrderBook,
      setTradingMode,
      setFreakProtection,
      setShowOrderBook,
      startTrading,
      stopTrading,
      verifyApiLogin,
      clearLogs,
      log,
      toggleSymbolMap,
      deleteSymbolMap,
      toggleUser,
      toggleStrategyRow,
      toggleMultiLeg,
      toggleRemoteHost,
      toggleRemoteClient,
    }),
    [
      orders,
      strategies,
      risk,
      session,
      simulator,
      killed,
      activateKillSwitch,
      resetKillSwitch,
      cancelOrder,
      reconcileOrder,
      setStrategyState,
      toggleRiskLimit,
      logs,
      symbolMaps,
      signals,
      orderSummary,
      brokerOrders,
      positions,
      holdings,
      users,
      strategyRows,
      multiLeg,
      remoteHosts,
      remoteClients,
      trading,
      tradingMode,
      freakProtection,
      showOrderBook,
      startTrading,
      stopTrading,
      verifyApiLogin,
      clearLogs,
      log,
      toggleSymbolMap,
      deleteSymbolMap,
      toggleUser,
      toggleStrategyRow,
      toggleMultiLeg,
      toggleRemoteHost,
      toggleRemoteClient,
    ],
  );

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used inside TerminalProvider");
  return ctx;
}
