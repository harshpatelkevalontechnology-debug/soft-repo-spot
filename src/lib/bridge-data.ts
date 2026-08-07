/**
 * Row models + deterministic seeds for the bridge tabs.
 * Mirrors the desktop bridge grids: Symbol Mapping, Signals, Orders Summary,
 * Order Book, Positions, Holdings, User Settings, Strategies, Multi-Leg,
 * Remote Share.
 */

export type LogType = "MESSAGE" | "WARNING" | "ERROR" | "ATTENTION" | "TRADING";

export interface LogRow {
  id: string;
  timestamp: string;
  type: LogType;
  user: string;
  strategy: string;
  portfolio: string;
  message: string;
}

export interface SymbolMapRow {
  id: string;
  enabled: boolean;
  sourceSymbol: string;
  dataProvider: string;
  mapping: string;
  exchange: string;
  exchgSymbol: string;
  product: string;
  entryOrder: string;
  exitOrder: string;
  strategies: string;
  qtyType: string;
  qtyValue: number;
  maxQty: number;
  maxOpenPos: number;
  maxOpenTrades: number;
  maxTrades: number;
  maxProfitPerTrade: number;
  maxLossPerTrade: number;
}

export interface SignalRow {
  id: string;
  requestId: string;
  source: string;
  signalSymbol: string;
  qtyProcessing: string;
  exchangeSymbol: string;
  entryTxn: string;
  entryQty: number;
  entryPrice: number;
  entryTrigger: string;
  target: number;
  sl: number;
  trailSl: number;
  exitQty: number;
  exitPrice: number;
  exitTrigger: string;
  signalTime: string;
}

export interface OrderSummaryRow {
  id: string;
  sourceSymbol: string;
  requestId: string;
  exchange: string;
  exchangeSymbol: string;
  ltp: number;
  pnl: number;
  product: string;
  entryOrderType: string;
  entryOrderId: string;
  entryTime: string;
  entryTxn: string;
  entryQty: number;
  entryFilledQty: number;
  entryExchgTime: string;
  entryAvgPrice: number;
}

export interface BrokerOrderRow {
  id: string;
  symbol: string;
  exchange: string;
  orderTime: string;
  orderId: string;
  txn: string;
  avgPrice: number;
  quantity: number;
  filledQuantity: number;
  orderType: string;
  price: number;
  triggerPrice: number;
  exchangeTime: string;
  exchgOrderId: string;
  product: string;
  validity: string;
  status: string;
  userId: string;
  userAlias: string;
}

export interface PositionRow {
  id: string;
  exchange: string;
  symbol: string;
  netQty: number;
  ltp: number;
  pnl: number;
  pnlPct: number;
  buyQty: number;
  buyAvgPrice: number;
  buyValue: number;
  sellQty: number;
  sellAvgPrice: number;
  sellValue: number;
  carryFwdQty: number;
  realizedProfit: number;
  unrealizedProfit: number;
  userId: string;
  userAlias: string;
}

export interface HoldingRow {
  id: string;
  exchange: string;
  symbol: string;
  qty: number;
  avgPrice: number;
  buyValue: number;
  ltp: number;
  currentValue: number;
  pnl: number;
  collateralQty: number;
  t1Qty: number;
  cncSellQty: number;
  userId: string;
  userAlias: string;
}

export interface UserRow {
  id: string;
  enabled: boolean;
  loggedIn: boolean;
  mtmAll: number;
  misMtm: number;
  nrmlMtm: number;
  availableMargin: number;
  marketOrders: string;
  userAlias: string;
  userId: string;
  broker: string;
  apiKey: string;
  apiSecret: string;
  historicalApi: boolean;
  sqOffTime: string;
  enableNrmlSqOff: string;
  enableCncSqOff: boolean;
}

export interface StrategyRow {
  id: string;
  enabled: boolean;
  strategyTag: string;
  pnl: number;
  tradeValue: number;
  marketOrders: string;
  noDuplicateSeconds: number;
  startTime: string;
  endTime: string;
  sqOffTime: string;
  userAccount: string;
  maxProfit: number;
  maxLoss: number;
  maxLossWaitTime: number;
}

export interface MultiLegRow {
  id: string;
  enabled: boolean;
  status: string;
  portfolioName: string;
  symbol: string;
  pnl: number;
  currentValue: number;
  valuePerLot: number;
  underlyingPrice: number;
  underlyingLtp: number;
  positionalPortfolio: string;
}

export interface RemoteRow {
  id: string;
  enabled: boolean;
  remoteId: string;
  maxUsersAllowed: number;
  strategyTag: string;
  symbolMappings: string;
}

/* ------------------------------- formatting ------------------------------ */

export const fmt2 = (n: number) => n.toFixed(2);
export const fmtNum = (n: number) => new Intl.NumberFormat("en-IN").format(n);

/* --------------------------------- seeds --------------------------------- */

export function seedLogs(): LogRow[] {
  const base = (
    id: string,
    timestamp: string,
    type: LogType,
    message: string,
    user = "",
    strategy = "",
    portfolio = "",
  ): LogRow => ({ id, timestamp, type, user, strategy, portfolio, message });

  return [
    base(
      "LOG-1",
      "14:01:01.452",
      "MESSAGE",
      "User ID: HARSH117 (Trial Account) Logged in successfully. Expiry Date: 13-Aug-2026, Max Users: 2, Version: 1.0.2.895.",
    ),
    base("LOG-2", "14:01:01.644", "MESSAGE", "Loading Masters..."),
    base("LOG-3", "14:01:11.503", "MESSAGE", "Masters Loaded Successfully."),
    base("LOG-4", "14:01:11.531", "MESSAGE", "Loading Options Portfolios..."),
    base("LOG-5", "14:01:11.681", "MESSAGE", "Options Portfolios loaded successfully."),
    base("LOG-6", "14:04:34.404", "WARNING", "Please Check your internet connection!"),
    base("LOG-7", "14:04:49.332", "MESSAGE", "Internet connected again!"),
    base(
      "LOG-8",
      "14:06:12.660",
      "ATTENTION",
      "Wrapper returned UNKNOWN for BANKNIFTY05AUG26 52600 CE — reconcile before re-send.",
      "SIM1",
      "DEFAULT",
    ),
    base("LOG-9", "14:06:43.319", "MESSAGE", "Verify API Login"),
    base("LOG-10", "14:06:43.350", "ERROR", "Simulated1 (SIM1 - APITest) Login Failed!", "SIM1"),
  ];
}

export function seedSymbolMaps(): SymbolMapRow[] {
  return [
    {
      id: "SM-1",
      enabled: true,
      sourceSymbol: "*",
      dataProvider: "TrueData",
      mapping: "NONE",
      exchange: "NSE",
      exchgSymbol: "*",
      product: "MIS",
      entryOrder: "MARKET",
      exitOrder: "MARKET",
      strategies: "DEFAULT",
      qtyType: "FixedQty",
      qtyValue: 1,
      maxQty: 0,
      maxOpenPos: 0,
      maxOpenTrades: 0,
      maxTrades: 0,
      maxProfitPerTrade: 0,
      maxLossPerTrade: 0,
    },
    {
      id: "SM-2",
      enabled: true,
      sourceSymbol: "NIFTY-I",
      dataProvider: "TrueData",
      mapping: "OPTIONS",
      exchange: "NFO",
      exchgSymbol: "NIFTY",
      product: "NRML",
      entryOrder: "MARKET",
      exitOrder: "LIMIT",
      strategies: "STRADDLE920",
      qtyType: "FixedLots",
      qtyValue: 2,
      maxQty: 1800,
      maxOpenPos: 4,
      maxOpenTrades: 12,
      maxTrades: 40,
      maxProfitPerTrade: 9000,
      maxLossPerTrade: 15000,
    },
    {
      id: "SM-3",
      enabled: false,
      sourceSymbol: "BANKNIFTY-I",
      dataProvider: "TrueData",
      mapping: "OPTIONS",
      exchange: "NFO",
      exchgSymbol: "BANKNIFTY",
      product: "NRML",
      entryOrder: "MARKET",
      exitOrder: "MARKET",
      strategies: "IRONCONDOR",
      qtyType: "FixedLots",
      qtyValue: 1,
      maxQty: 900,
      maxOpenPos: 4,
      maxOpenTrades: 8,
      maxTrades: 24,
      maxProfitPerTrade: 7500,
      maxLossPerTrade: 20000,
    },
  ];
}

export function seedSignals(): SignalRow[] {
  return [
    {
      id: "SG-1",
      requestId: "REQ-770114",
      source: "TradingView",
      signalSymbol: "NIFTY-I",
      qtyProcessing: "Completed",
      exchangeSymbol: "NIFTY07AUG26 24500 CE",
      entryTxn: "SELL",
      entryQty: 150,
      entryPrice: 142.35,
      entryTrigger: "09:20:01",
      target: 56.94,
      sl: 185.05,
      trailSl: 0,
      exitQty: 0,
      exitPrice: 0,
      exitTrigger: "—",
      signalTime: "09:20:00.981",
    },
    {
      id: "SG-2",
      requestId: "REQ-770115",
      source: "TradingView",
      signalSymbol: "NIFTY-I",
      qtyProcessing: "Completed",
      exchangeSymbol: "NIFTY07AUG26 24500 PE",
      entryTxn: "SELL",
      entryQty: 150,
      entryPrice: 138.1,
      entryTrigger: "09:20:01",
      target: 55.24,
      sl: 179.53,
      trailSl: 0,
      exitQty: 0,
      exitPrice: 0,
      exitTrigger: "—",
      signalTime: "09:20:00.994",
    },
    {
      id: "SG-3",
      requestId: "REQ-770131",
      source: "Amibroker",
      signalSymbol: "FINNIFTY-I",
      qtyProcessing: "Partial",
      exchangeSymbol: "FINNIFTY11AUG26 23300 CE",
      entryTxn: "BUY",
      entryQty: 120,
      entryPrice: 88.0,
      entryTrigger: "10:04:55",
      target: 158.4,
      sl: 66.0,
      trailSl: 12.5,
      exitQty: 40,
      exitPrice: 94.7,
      exitTrigger: "10:31:04",
      signalTime: "10:04:54.772",
    },
    {
      id: "SG-4",
      requestId: "REQ-770140",
      source: "Excel",
      signalSymbol: "BANKNIFTY-I",
      qtyProcessing: "Rejected",
      exchangeSymbol: "BANKNIFTY05AUG26 52600 CE",
      entryTxn: "SELL",
      entryQty: 60,
      entryPrice: 0,
      entryTrigger: "10:06:12",
      target: 0,
      sl: 0,
      trailSl: 0,
      exitQty: 0,
      exitPrice: 0,
      exitTrigger: "—",
      signalTime: "10:06:12.404",
    },
  ];
}

export function seedOrderSummary(): OrderSummaryRow[] {
  return [
    {
      id: "OS-1",
      sourceSymbol: "NIFTY-I",
      requestId: "REQ-770114",
      exchange: "NFO",
      exchangeSymbol: "NIFTY07AUG26 24500 CE",
      ltp: 121.6,
      pnl: 3112.5,
      product: "NRML",
      entryOrderType: "MARKET",
      entryOrderId: "ORD-88214",
      entryTime: "09:20:01.284",
      entryTxn: "SELL",
      entryQty: 150,
      entryFilledQty: 150,
      entryExchgTime: "09:20:01.331",
      entryAvgPrice: 142.35,
    },
    {
      id: "OS-2",
      sourceSymbol: "NIFTY-I",
      requestId: "REQ-770115",
      exchange: "NFO",
      exchangeSymbol: "NIFTY07AUG26 24500 PE",
      ltp: 146.9,
      pnl: -1320.0,
      product: "NRML",
      entryOrderType: "MARKET",
      entryOrderId: "ORD-88215",
      entryTime: "09:20:01.412",
      entryTxn: "SELL",
      entryQty: 150,
      entryFilledQty: 150,
      entryExchgTime: "09:20:01.470",
      entryAvgPrice: 138.1,
    },
    {
      id: "OS-3",
      sourceSymbol: "FINNIFTY-I",
      requestId: "REQ-770131",
      exchange: "NFO",
      exchangeSymbol: "FINNIFTY11AUG26 23300 CE",
      ltp: 94.7,
      pnl: 268.0,
      product: "MIS",
      entryOrderType: "LIMIT",
      entryOrderId: "ORD-88219",
      entryTime: "10:04:55.007",
      entryTxn: "BUY",
      entryQty: 120,
      entryFilledQty: 40,
      entryExchgTime: "10:04:55.219",
      entryAvgPrice: 88.0,
    },
  ];
}

export function seedBrokerOrders(): BrokerOrderRow[] {
  return [
    {
      id: "BO-1",
      symbol: "NIFTY07AUG26 24500 CE",
      exchange: "NFO",
      orderTime: "09:20:01.284",
      orderId: "ORD-88214",
      txn: "SELL",
      avgPrice: 142.35,
      quantity: 150,
      filledQuantity: 150,
      orderType: "MARKET",
      price: 0,
      triggerPrice: 0,
      exchangeTime: "09:20:01.331",
      exchgOrderId: "1100000024412",
      product: "NRML",
      validity: "DAY",
      status: "COMPLETE",
      userId: "SIM1",
      userAlias: "Simulated1",
    },
    {
      id: "BO-2",
      symbol: "NIFTY07AUG26 24500 PE",
      exchange: "NFO",
      orderTime: "09:20:01.412",
      orderId: "ORD-88215",
      txn: "SELL",
      avgPrice: 138.1,
      quantity: 150,
      filledQuantity: 150,
      orderType: "MARKET",
      price: 0,
      triggerPrice: 0,
      exchangeTime: "09:20:01.470",
      exchgOrderId: "1100000024418",
      product: "NRML",
      validity: "DAY",
      status: "COMPLETE",
      userId: "SIM1",
      userAlias: "Simulated1",
    },
    {
      id: "BO-3",
      symbol: "FINNIFTY11AUG26 23300 CE",
      exchange: "NFO",
      orderTime: "10:04:55.007",
      orderId: "ORD-88219",
      txn: "BUY",
      avgPrice: 88.0,
      quantity: 120,
      filledQuantity: 40,
      orderType: "LIMIT",
      price: 88.0,
      triggerPrice: 0,
      exchangeTime: "10:04:55.219",
      exchgOrderId: "1100000024533",
      product: "MIS",
      validity: "DAY",
      status: "OPEN",
      userId: "SIM1",
      userAlias: "Simulated1",
    },
    {
      id: "BO-4",
      symbol: "BANKNIFTY05AUG26 52600 CE",
      exchange: "NFO",
      orderTime: "10:06:12.660",
      orderId: "ORD-88221",
      txn: "SELL",
      avgPrice: 0,
      quantity: 60,
      filledQuantity: 0,
      orderType: "MARKET",
      price: 0,
      triggerPrice: 0,
      exchangeTime: "—",
      exchgOrderId: "—",
      product: "NRML",
      validity: "DAY",
      status: "UNKNOWN",
      userId: "SIM1",
      userAlias: "Simulated1",
    },
    {
      id: "BO-5",
      symbol: "NIFTY07AUG26 24700 CE",
      exchange: "NFO",
      orderTime: "10:12:39.918",
      orderId: "ORD-88223",
      txn: "BUY",
      avgPrice: 0,
      quantity: 75,
      filledQuantity: 0,
      orderType: "SL-L",
      price: 61.25,
      triggerPrice: 60.0,
      exchangeTime: "10:12:40.004",
      exchgOrderId: "1100000024611",
      product: "MIS",
      validity: "DAY",
      status: "REJECTED",
      userId: "SIM1",
      userAlias: "Simulated1",
    },
    {
      id: "BO-6",
      symbol: "BANKNIFTY05AUG26 51800 PE",
      exchange: "NFO",
      orderTime: "11:02:18.771",
      orderId: "ORD-88230",
      txn: "SELL",
      avgPrice: 0,
      quantity: 30,
      filledQuantity: 0,
      orderType: "LIMIT",
      price: 210.0,
      triggerPrice: 0,
      exchangeTime: "11:02:19.020",
      exchgOrderId: "1100000024790",
      product: "NRML",
      validity: "DAY",
      status: "CANCELLED",
      userId: "SIM1",
      userAlias: "Simulated1",
    },
  ];
}

export function seedPositions(): PositionRow[] {
  return [
    {
      id: "PS-1",
      exchange: "NFO",
      symbol: "NIFTY07AUG26 24500 CE",
      netQty: -150,
      ltp: 121.6,
      pnl: 3112.5,
      pnlPct: 14.57,
      buyQty: 0,
      buyAvgPrice: 0,
      buyValue: 0,
      sellQty: 150,
      sellAvgPrice: 142.35,
      sellValue: 21352.5,
      carryFwdQty: 0,
      realizedProfit: 0,
      unrealizedProfit: 3112.5,
      userId: "SIM1",
      userAlias: "Simulated1",
    },
    {
      id: "PS-2",
      exchange: "NFO",
      symbol: "NIFTY07AUG26 24500 PE",
      netQty: -150,
      ltp: 146.9,
      pnl: -1320.0,
      pnlPct: -6.37,
      buyQty: 0,
      buyAvgPrice: 0,
      buyValue: 0,
      sellQty: 150,
      sellAvgPrice: 138.1,
      sellValue: 20715.0,
      carryFwdQty: 0,
      realizedProfit: 0,
      unrealizedProfit: -1320.0,
      userId: "SIM1",
      userAlias: "Simulated1",
    },
    {
      id: "PS-3",
      exchange: "NFO",
      symbol: "FINNIFTY11AUG26 23300 CE",
      netQty: 0,
      ltp: 94.7,
      pnl: 268.0,
      pnlPct: 7.61,
      buyQty: 40,
      buyAvgPrice: 88.0,
      buyValue: 3520.0,
      sellQty: 40,
      sellAvgPrice: 94.7,
      sellValue: 3788.0,
      carryFwdQty: 0,
      realizedProfit: 268.0,
      unrealizedProfit: 0,
      userId: "SIM1",
      userAlias: "Simulated1",
    },
  ];
}

export function seedHoldings(): HoldingRow[] {
  return [
    {
      id: "HD-1",
      exchange: "NSE",
      symbol: "RELIANCE",
      qty: 40,
      avgPrice: 2810.4,
      buyValue: 112416,
      ltp: 2944.1,
      currentValue: 117764,
      pnl: 5348,
      collateralQty: 0,
      t1Qty: 0,
      cncSellQty: 0,
      userId: "SIM1",
      userAlias: "Simulated1",
    },
    {
      id: "HD-2",
      exchange: "NSE",
      symbol: "HDFCBANK",
      qty: 75,
      avgPrice: 1622.8,
      buyValue: 121710,
      ltp: 1588.35,
      currentValue: 119126.25,
      pnl: -2583.75,
      collateralQty: 75,
      t1Qty: 0,
      cncSellQty: 0,
      userId: "SIM1",
      userAlias: "Simulated1",
    },
    {
      id: "HD-3",
      exchange: "NSE",
      symbol: "INFY",
      qty: 120,
      avgPrice: 1490.2,
      buyValue: 178824,
      ltp: 1533.75,
      currentValue: 184050,
      pnl: 5226,
      collateralQty: 0,
      t1Qty: 20,
      cncSellQty: 0,
      userId: "SIM1",
      userAlias: "Simulated1",
    },
  ];
}

export function seedUsers(): UserRow[] {
  return [
    {
      id: "US-1",
      enabled: true,
      loggedIn: false,
      mtmAll: 0,
      misMtm: 0,
      nrmlMtm: 0,
      availableMargin: 0,
      marketOrders: "Allowed",
      userAlias: "Simulated1",
      userId: "SIM1",
      broker: "APITest",
      apiKey: "••••••••••7f2a",
      apiSecret: "••••••••••b91c",
      historicalApi: false,
      sqOffTime: "23:55:00",
      enableNrmlSqOff: "Today",
      enableCncSqOff: true,
    },
    {
      id: "US-2",
      enabled: true,
      loggedIn: true,
      mtmAll: 1792.5,
      misMtm: 268.0,
      nrmlMtm: 1524.5,
      availableMargin: 486320.75,
      marketOrders: "Allowed",
      userAlias: "Orvix Live",
      userId: "HD4412",
      broker: "Orvix",
      apiKey: "••••••••••31de",
      apiSecret: "••••••••••04aa",
      historicalApi: true,
      sqOffTime: "15:20:00",
      enableNrmlSqOff: "Today",
      enableCncSqOff: false,
    },
  ];
}

export function seedStrategyRows(): StrategyRow[] {
  return [
    {
      id: "ST-1",
      enabled: true,
      strategyTag: "DEFAULT",
      pnl: 0,
      tradeValue: 0,
      marketOrders: "Allowed",
      noDuplicateSeconds: 60,
      startTime: "00:01:00",
      endTime: "23:55:00",
      sqOffTime: "23:55:00",
      userAccount: "SIM1",
      maxProfit: 0,
      maxLoss: 0,
      maxLossWaitTime: 0,
    },
    {
      id: "ST-2",
      enabled: true,
      strategyTag: "STRADDLE920",
      pnl: 1792.5,
      tradeValue: 42067.5,
      marketOrders: "Allowed",
      noDuplicateSeconds: 30,
      startTime: "09:20:00",
      endTime: "15:10:00",
      sqOffTime: "15:15:00",
      userAccount: "HD4412",
      maxProfit: 9000,
      maxLoss: 15000,
      maxLossWaitTime: 120,
    },
    {
      id: "ST-3",
      enabled: false,
      strategyTag: "IRONCONDOR",
      pnl: -320,
      tradeValue: 0,
      marketOrders: "Blocked",
      noDuplicateSeconds: 45,
      startTime: "09:25:00",
      endTime: "15:05:00",
      sqOffTime: "15:10:00",
      userAccount: "HD4412",
      maxProfit: 7500,
      maxLoss: 20000,
      maxLossWaitTime: 90,
    },
  ];
}

export function seedMultiLeg(): MultiLegRow[] {
  return [
    {
      id: "ML-1",
      enabled: true,
      status: "Executed",
      portfolioName: "NIFTY Short Straddle 9:20",
      symbol: "NIFTY",
      pnl: 1792.5,
      currentValue: 42067.5,
      valuePerLot: 561.0,
      underlyingPrice: 24512.4,
      underlyingLtp: 24488.9,
      positionalPortfolio: "No",
    },
    {
      id: "ML-2",
      enabled: true,
      status: "Pending",
      portfolioName: "BN Iron Condor",
      symbol: "BANKNIFTY",
      pnl: 0,
      currentValue: 0,
      valuePerLot: 0,
      underlyingPrice: 52410.15,
      underlyingLtp: 52398.4,
      positionalPortfolio: "Yes",
    },
    {
      id: "ML-3",
      enabled: false,
      status: "Completed",
      portfolioName: "FinNifty Directional CE",
      symbol: "FINNIFTY",
      pnl: 268.0,
      currentValue: 3788.0,
      valuePerLot: 94.7,
      underlyingPrice: 23288.6,
      underlyingLtp: 23301.2,
      positionalPortfolio: "No",
    },
  ];
}

export function seedRemoteHosts(): RemoteRow[] {
  return [
    {
      id: "RH-1",
      enabled: false,
      remoteId: "HOST-4471",
      maxUsersAllowed: 2,
      strategyTag: "STRADDLE920",
      symbolMappings: "NIFTY-I",
    },
  ];
}

export function seedRemoteClients(): RemoteRow[] {
  return [
    {
      id: "RC-1",
      enabled: false,
      remoteId: "CLI-8802",
      maxUsersAllowed: 1,
      strategyTag: "DEFAULT",
      symbolMappings: "*",
    },
  ];
}
