import { useState, useMemo } from 'react';
import { useHarvesting } from '../../context/HarvestingContext';
import styles from './HoldingsTable.module.css';

type SortKey = 'coin' | 'currentPrice' | 'stcg' | 'ltcg';
type SortOrder = 'asc' | 'desc';

function fmtAmt(n: number) {
  if (Math.abs(n) < 1e-6) return '0.00';
  return n.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

function fmtVal(n: number) {
  const isNegative = n < 0;
  const absValue = Math.abs(n);
  
  let formatted = '';
  if (absValue >= 1_000_000) {
    formatted = `${(absValue / 1_000_000).toFixed(2)}M`;
  } else if (absValue >= 10_000) {
    formatted = `${(absValue / 1_000).toFixed(2)}K`;
  } else {
    formatted = absValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  
  return isNegative ? `-$${formatted}` : `$${formatted}`;
}

export default function HoldingsTable() {
  const {
    holdings,
    holdingsLoading,
    holdingsError,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    isAllSelected,
    showAll,
    setShowAll,
  } = useHarvesting();

  const [sortKey, setSortKey] = useState<SortKey>('stcg');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedHoldings = useMemo(() => {
    const list = [...holdings].map((item, originalIndex) => ({
      item,
      originalIndex,
    }));

    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortKey === 'coin') {
        return sortOrder === 'asc'
          ? a.item.coin.localeCompare(b.item.coin)
          : b.item.coin.localeCompare(a.item.coin);
      } else if (sortKey === 'currentPrice') {
        valA = a.item.currentPrice;
        valB = b.item.currentPrice;
      } else if (sortKey === 'stcg') {
        valA = a.item.stcg.gain;
        valB = b.item.stcg.gain;
      } else if (sortKey === 'ltcg') {
        valA = a.item.ltcg.gain;
        valB = b.item.ltcg.gain;
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [holdings, sortKey, sortOrder]);

  const displayedHoldings = useMemo(() => {
    if (showAll) return sortedHoldings;
    return sortedHoldings.slice(0, 7);
  }, [sortedHoldings, showAll]);

  if (holdingsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your holdings...</p>
      </div>
    );
  }

  if (holdingsError) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>⚠️ {holdingsError}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>All Holdings</h2>
        <span className={styles.badge}>{holdings.length} Assets Found</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className={styles.checkbox}
                  aria-label="Select all assets"
                />
              </th>
              <th className={styles.sortable} onClick={() => handleSort('coin')}>
                Asset {sortKey === 'coin' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className={styles.numeric}>Holdings & Avg Buy Price</th>
              <th className={`${styles.numeric} ${styles.sortable}`} onClick={() => handleSort('currentPrice')}>
                Current Price {sortKey === 'currentPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className={`${styles.numeric} ${styles.sortable}`} onClick={() => handleSort('stcg')}>
                Short-Term Gain {sortKey === 'stcg' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className={`${styles.numeric} ${styles.sortable}`} onClick={() => handleSort('ltcg')}>
                Long-Term Gain {sortKey === 'ltcg' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className={styles.numeric}>Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {displayedHoldings.map(({ item, originalIndex }) => {
              const isSelected = selectedIds.has(originalIndex);
              return (
                <tr key={`${item.coin}-${originalIndex}`} className={isSelected ? styles.selectedRow : ''}>
                  <td className={styles.checkboxCol}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(originalIndex)}
                      className={styles.checkbox}
                      aria-label={`Select ${item.coin}`}
                    />
                  </td>
                  <td>
                    <div className={styles.coinCell}>
                      <img src={item.logo} alt={item.coin} className={styles.logo} onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
                      }} />
                      <div>
                        <div className={styles.coinSym}>{item.coin}</div>
                        <div className={styles.coinName}>{item.coinName}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.numeric}>
                    <div className={styles.holdingAmt}>{fmtAmt(item.totalHolding)} {item.coin}</div>
                    <div className={styles.subText}>{fmtVal(item.averageBuyPrice)}</div>
                  </td>
                  <td className={styles.numeric}>
                    <span className={styles.primaryText}>{fmtVal(item.currentPrice)}</span>
                  </td>
                  <td className={styles.numeric}>
                    <div className={`${styles.gainAmt} ${item.stcg.gain >= 0 ? styles.profit : styles.loss}`}>
                      {fmtVal(item.stcg.gain)}
                    </div>
                    <div className={styles.subText}>{fmtAmt(item.stcg.balance)} {item.coin}</div>
                  </td>
                  <td className={styles.numeric}>
                    <div className={`${styles.gainAmt} ${item.ltcg.gain >= 0 ? styles.profit : styles.loss}`}>
                      {fmtVal(item.ltcg.gain)}
                    </div>
                    <div className={styles.subText}>{fmtAmt(item.ltcg.balance)} {item.coin}</div>
                  </td>
                  <td className={styles.numeric}>
                    {isSelected ? (
                      <span className={styles.sellAmount}>
                        {fmtAmt(item.totalHolding)} {item.coin}
                      </span>
                    ) : (
                      <span className={styles.sellPlaceholder}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > 7 && (
        <div className={styles.footerAction}>
          <button className={styles.viewBtn} onClick={() => setShowAll(!showAll)}>
            {showAll ? 'View Less' : `View All Holdings (${holdings.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
