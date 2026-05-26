export interface GainLoss {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainLoss;
  ltcg: GainLoss;
}

export interface CapitalGainCategory {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: CapitalGainCategory;
  ltcg: CapitalGainCategory;
}

export interface CapitalGainsResponse {
  capitalGains: CapitalGains;
}

export interface ComputedGains {
  stcg: CapitalGainCategory;
  ltcg: CapitalGainCategory;
  netStcg: number;
  netLtcg: number;
  realisedGains: number;
}
