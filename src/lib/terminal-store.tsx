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

interface TerminalState {
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
}

const TerminalContext = createContext<TerminalState | null>(null);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => seedOrders());
  const [strategies, setStrategies] = useState<Strategy[]>(() => seedStrategies());
  const [risk, setRisk] = useState<RiskLimit[]>(() => seedRiskLimits());
  const [session] = useState<SessionComponent[]>(() => seedSession());
  const [simulator, setSimulator] = useState(false);
  const [killed, setKilled] = useState(false);

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
  }, []);

  const resetKillSwitch = useCallback(() => setKilled(false), []);

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
    ],
  );

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used inside TerminalProvider");
  return ctx;
}
