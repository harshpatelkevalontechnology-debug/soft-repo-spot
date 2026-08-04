/**
 * Core-slice domain model for the desktop platform, ported to the web.
 * Money is held in MINOR UNITS (paise) per spec §1.3 — never floats.
 */

export type Side = "BUY" | "SELL";
export type OrderStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "UNKNOWN"
  | "CANCELLED";
export type ProductType = "MIS" | "NRML";
export type OrderType = "MARKET" | "LIMIT" | "SL-L";
export type Broker = "ORVIX" | "XTS";

export interface Order {
  id: string;
  ts: string;
  symbol: string;
  side: Side;
  qty: number;
  filled: number;
  /** paise */
  price: number;
  orderType: OrderType;
  product: ProductType;
  status: OrderStatus;
  broker: Broker;
  strategyId: string | null;
  /** wrapper hop that last touched the order — for incident triage */
  hop: "core" | "wrapper" | "broker";
  note?: string;
}

export interface Leg {
  id: string;
  side: Side;
  optionType: "CE" | "PE";
  strikeOffset: number; // relative to ATM, in strikes
  lots: number;
  slPct: number | null;
  tgtPct: number | null;
}

export type StrategyState = "IDLE" | "ARMED" | "RUNNING" | "HALTED" | "EXITED";

export interface Strategy {
  id: string;
  name: string;
  underlying: "NIFTY" | "BANKNIFTY" | "FINNIFTY" | "SENSEX";
  expiry: string;
  state: StrategyState;
  entryTime: string;
  exitTime: string;
  legs: Leg[];
  /** paise */
  mtm: number;
  maxLossPaise: number;
  maxProfitPaise: number;
  ordersToday: number;
  simulated: boolean;
}

export interface RiskLimit {
  id: string;
  label: string;
  description: string;
  /** paise for money limits, plain integer otherwise */
  value: number;
  used: number;
  unit: "money" | "count" | "rate";
  breachAction: "BLOCK_NEW" | "SQUARE_OFF_ALL" | "HALT_STRATEGY";
  enabled: boolean;
}

export type HealthState = "OK" | "DEGRADED" | "DOWN";

export interface SessionComponent {
  id: string;
  name: string;
  endpoint: string;
  state: HealthState;
  latencyMs: number;
  detail: string;
  lastBeat: string;
}

/* ---------------- formatting ---------------- */

export const paise = (n: number) => Math.round(n);

export function formatMoney(minor: number, opts?: { sign?: boolean }) {
  const rupees = minor / 100;
  const s = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Math.abs(rupees));
  if (opts?.sign) return `${minor < 0 ? "−" : "+"}${s}`;
  return minor < 0 ? `−${s}` : s;
}

export function formatQty(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

/* ---------------- seed data (deterministic; no module-scope randomness) --------------- */

export function seedStrategies(): Strategy[] {
  return [
    {
      id: "STR-1041",
      name: "Short Straddle 9:20",
      underlying: "NIFTY",
      expiry: "07 Aug 2026",
      state: "RUNNING",
      entryTime: "09:20",
      exitTime: "15:10",
      simulated: false,
      mtm: 1_842_50,
      maxLossPaise: 1_500_000,
      maxProfitPaise: 900_000,
      ordersToday: 6,
      legs: [
        { id: "L1", side: "SELL", optionType: "CE", strikeOffset: 0, lots: 2, slPct: 30, tgtPct: 60 },
        { id: "L2", side: "SELL", optionType: "PE", strikeOffset: 0, lots: 2, slPct: 30, tgtPct: 60 },
      ],
    },
    {
      id: "STR-1042",
      name: "BN Iron Condor",
      underlying: "BANKNIFTY",
      expiry: "05 Aug 2026",
      state: "ARMED",
      entryTime: "09:25",
      exitTime: "15:05",
      simulated: false,
      mtm: -320_00,
      maxLossPaise: 2_000_000,
      maxProfitPaise: 750_000,
      ordersToday: 0,
      legs: [
        { id: "L1", side: "SELL", optionType: "CE", strikeOffset: 2, lots: 1, slPct: 40, tgtPct: null },
        { id: "L2", side: "BUY", optionType: "CE", strikeOffset: 5, lots: 1, slPct: null, tgtPct: null },
        { id: "L3", side: "SELL", optionType: "PE", strikeOffset: -2, lots: 1, slPct: 40, tgtPct: null },
        { id: "L4", side: "BUY", optionType: "PE", strikeOffset: -5, lots: 1, slPct: null, tgtPct: null },
      ],
    },
    {
      id: "STR-1043",
      name: "FinNifty Directional CE",
      underlying: "FINNIFTY",
      expiry: "11 Aug 2026",
      state: "HALTED",
      entryTime: "10:00",
      exitTime: "14:45",
      simulated: true,
      mtm: -1_210_00,
      maxLossPaise: 1_200_000,
      maxProfitPaise: 1_800_000,
      ordersToday: 3,
      legs: [
        { id: "L1", side: "BUY", optionType: "CE", strikeOffset: 1, lots: 3, slPct: 25, tgtPct: 80 },
      ],
    },
  ];
}

export function seedOrders(): Order[] {
  return [
    {
      id: "ORD-88214",
      ts: "09:20:01.284",
      symbol: "NIFTY07AUG26 24500 CE",
      side: "SELL",
      qty: 150,
      filled: 150,
      price: 142_35,
      orderType: "MARKET",
      product: "NRML",
      status: "SUCCESS",
      broker: "ORVIX",
      strategyId: "STR-1041",
      hop: "broker",
    },
    {
      id: "ORD-88215",
      ts: "09:20:01.412",
      symbol: "NIFTY07AUG26 24500 PE",
      side: "SELL",
      qty: 150,
      filled: 150,
      price: 138_10,
      orderType: "MARKET",
      product: "NRML",
      status: "SUCCESS",
      broker: "ORVIX",
      strategyId: "STR-1041",
      hop: "broker",
    },
    {
      id: "ORD-88219",
      ts: "10:04:55.007",
      symbol: "FINNIFTY11AUG26 23300 CE",
      side: "BUY",
      qty: 120,
      filled: 40,
      price: 88_00,
      orderType: "LIMIT",
      product: "MIS",
      status: "PENDING",
      broker: "XTS",
      strategyId: "STR-1043",
      hop: "wrapper",
      note: "Partial fill; freeze-qty slice 2 of 3",
    },
    {
      id: "ORD-88221",
      ts: "10:06:12.660",
      symbol: "BANKNIFTY05AUG26 52600 CE",
      side: "SELL",
      qty: 60,
      filled: 0,
      price: 0,
      orderType: "MARKET",
      product: "NRML",
      status: "UNKNOWN",
      broker: "XTS",
      strategyId: null,
      hop: "wrapper",
      note: "Wrapper timeout — single attempt, no retry. Reconcile before re-send.",
    },
    {
      id: "ORD-88223",
      ts: "10:12:39.918",
      symbol: "NIFTY07AUG26 24700 CE",
      side: "BUY",
      qty: 75,
      filled: 0,
      price: 61_25,
      orderType: "SL-L",
      product: "MIS",
      status: "FAILED",
      broker: "ORVIX",
      strategyId: "STR-1041",
      hop: "broker",
      note: "RMS reject: margin shortfall",
    },
    {
      id: "ORD-88226",
      ts: "10:31:04.220",
      symbol: "FINNIFTY11AUG26 23300 CE",
      side: "SELL",
      qty: 40,
      filled: 40,
      price: 94_70,
      orderType: "MARKET",
      product: "MIS",
      status: "SUCCESS",
      broker: "XTS",
      strategyId: "STR-1043",
      hop: "broker",
    },
    {
      id: "ORD-88230",
      ts: "11:02:18.771",
      symbol: "BANKNIFTY05AUG26 51800 PE",
      side: "SELL",
      qty: 30,
      filled: 0,
      price: 210_00,
      orderType: "LIMIT",
      product: "NRML",
      status: "CANCELLED",
      broker: "XTS",
      strategyId: "STR-1042",
      hop: "core",
      note: "Cancelled by risk gate: order-rate guard",
    },
  ];
}

export function seedRiskLimits(): RiskLimit[] {
  return [
    {
      id: "RISK-MAXLOSS",
      label: "Daily max loss",
      description: "Aggregate MTM floor across all strategies and accounts.",
      value: 5_000_000,
      used: 1_620_00,
      unit: "money",
      breachAction: "SQUARE_OFF_ALL",
      enabled: true,
    },
    {
      id: "RISK-PROFIT-LOCK",
      label: "Profit lock trigger",
      description: "Trail and lock realised profit once the day crosses this level.",
      value: 3_000_000,
      used: 1_842_50,
      unit: "money",
      breachAction: "HALT_STRATEGY",
      enabled: true,
    },
    {
      id: "RISK-ORDER-RATE",
      label: "Order rate / sec / exchange",
      description: "SEBI registration threshold is 10/sec — platform hard-caps below it.",
      value: 8,
      used: 3,
      unit: "rate",
      breachAction: "BLOCK_NEW",
      enabled: true,
    },
    {
      id: "RISK-MAX-ORDERS",
      label: "Max orders per day",
      description: "Runaway-loop circuit breaker across the whole install.",
      value: 400,
      used: 61,
      unit: "count",
      breachAction: "BLOCK_NEW",
      enabled: true,
    },
    {
      id: "RISK-PER-STRAT-LOSS",
      label: "Per-strategy loss cap",
      description: "Halts and squares off only the offending strategy.",
      value: 1_500_000,
      used: 1_210_00,
      unit: "money",
      breachAction: "HALT_STRATEGY",
      enabled: true,
    },
    {
      id: "RISK-FREEZE-SLICE",
      label: "Freeze-qty slicing",
      description: "Split orders above exchange freeze quantity into legal slices.",
      value: 1800,
      used: 1800,
      unit: "count",
      breachAction: "BLOCK_NEW",
      enabled: true,
    },
  ];
}

export function seedSession(): SessionComponent[] {
  return [
    {
      id: "SES-CORE",
      name: "Python core",
      endpoint: "127.0.0.1:8788",
      state: "OK",
      latencyMs: 4,
      detail: "Owns all trading state · engine, risk, guardian, analytics",
      lastBeat: "now",
    },
    {
      id: "SES-WRAP",
      name: "Go broker wrapper",
      endpoint: "127.0.0.1:8787",
      state: "OK",
      latencyMs: 2,
      detail: "Stateless single-attempt wrapper · SUCCESS / FAILED / UNKNOWN",
      lastBeat: "now",
    },
    {
      id: "SES-ORVIX",
      name: "Orvix session",
      endpoint: "api.orvix · account HD4412",
      state: "OK",
      latencyMs: 78,
      detail: "Token valid · expires in 13h 22m · 3 of 10 req/sec used",
      lastBeat: "2s ago",
    },
    {
      id: "SES-XTS",
      name: "Symphony XTS session",
      endpoint: "xts.partner · account XP0098",
      state: "DEGRADED",
      latencyMs: 640,
      detail: "Marketdata socket reconnected 2× in 5m · order API responding",
      lastBeat: "9s ago",
    },
    {
      id: "SES-FEED",
      name: "Tick feed",
      endpoint: "ws · 214 instruments",
      state: "OK",
      latencyMs: 31,
      detail: "No gaps in last 15m · sequence contiguous",
      lastBeat: "now",
    },
    {
      id: "SES-LIC",
      name: "License verification",
      endpoint: "license.partner/v1/verify",
      state: "DOWN",
      latencyMs: 0,
      detail: "Server not provisioned (spec §11 open item) · running on grace token",
      lastBeat: "start-up",
    },
  ];
}
