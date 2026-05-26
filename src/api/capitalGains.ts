import type { CapitalGainsResponse } from '../types';

const mockData: CapitalGainsResponse = {
  capitalGains: {
    stcg: {
      profits: 50000000,
      losses: 10000000,
    },
    ltcg: {
      profits: 25000000,
      losses: 5000000,
    },
  },
};

export const fetchCapitalGains = (): Promise<CapitalGainsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 600);
  });
};
