import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { Holding, CapitalGains, ComputedGains } from '../types';
import { fetchHoldings } from '../api/holdings';
import { fetchCapitalGains } from '../api/capitalGains';

interface HarvestingContextType {
  holdings: Holding[];
  holdingsLoading: boolean;
  holdingsError: string | null;
  capitalGains: CapitalGains | null;
  gainsLoading: boolean;
  gainsError: string | null;
  selectedIds: Set<number>;
  toggleSelection: (index: number) => void;
  toggleSelectAll: () => void;
  isAllSelected: boolean;
  preHarvesting: ComputedGains | null;
  afterHarvesting: ComputedGains | null;
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}

const HarvestingContext = createContext<HarvestingContextType | null>(null);

function computeGains(gains: CapitalGains): ComputedGains {
  const netStcg = gains.stcg.profits - gains.stcg.losses;
  const netLtcg = gains.ltcg.profits - gains.ltcg.losses;
  return {
    stcg: gains.stcg,
    ltcg: gains.ltcg,
    netStcg,
    netLtcg,
    realisedGains: netStcg + netLtcg,
  };
}

export function HarvestingProvider({ children }: { children: React.ReactNode }) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [holdingsLoading, setHoldingsLoading] = useState(true);
  const [holdingsError, setHoldingsError] = useState<string | null>(null);

  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null);
  const [gainsLoading, setGainsLoading] = useState(true);
  const [gainsError, setGainsError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchHoldings()
      .then(setHoldings)
      .catch(() => setHoldingsError('Failed to load holdings.'))
      .finally(() => setHoldingsLoading(false));

    fetchCapitalGains()
      .then((res) => setCapitalGains(res.capitalGains))
      .catch(() => setGainsError('Failed to load capital gains.'))
      .finally(() => setGainsLoading(false));
  }, []);

  const toggleSelection = useCallback((index: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const isAllSelected = holdings.length > 0 && selectedIds.size === holdings.length;

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(holdings.map((_, i) => i)));
    }
  }, [isAllSelected, holdings]);

  const preHarvesting = useMemo(
    () => (capitalGains ? computeGains(capitalGains) : null),
    [capitalGains]
  );

  const afterHarvesting = useMemo((): ComputedGains | null => {
    if (!capitalGains) return null;

    let stcgProfits = capitalGains.stcg.profits;
    let stcgLosses = capitalGains.stcg.losses;
    let ltcgProfits = capitalGains.ltcg.profits;
    let ltcgLosses = capitalGains.ltcg.losses;

    selectedIds.forEach((idx) => {
      const h = holdings[idx];
      if (!h) return;

      if (h.stcg.gain > 0) stcgProfits += h.stcg.gain;
      else if (h.stcg.gain < 0) stcgLosses += Math.abs(h.stcg.gain);

      if (h.ltcg.gain > 0) ltcgProfits += h.ltcg.gain;
      else if (h.ltcg.gain < 0) ltcgLosses += Math.abs(h.ltcg.gain);
    });

    const gains: CapitalGains = {
      stcg: { profits: stcgProfits, losses: stcgLosses },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses },
    };
    return computeGains(gains);
  }, [capitalGains, selectedIds, holdings]);

  return (
    <HarvestingContext.Provider
      value={{
        holdings,
        holdingsLoading,
        holdingsError,
        capitalGains,
        gainsLoading,
        gainsError,
        selectedIds,
        toggleSelection,
        toggleSelectAll,
        isAllSelected,
        preHarvesting,
        afterHarvesting,
        showAll,
        setShowAll,
      }}
    >
      {children}
    </HarvestingContext.Provider>
  );
}

export function useHarvesting(): HarvestingContextType {
  const ctx = useContext(HarvestingContext);
  if (!ctx) throw new Error('useHarvesting must be used inside HarvestingProvider');
  return ctx;
}
