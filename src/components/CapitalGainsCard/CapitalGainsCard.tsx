import { useHarvesting } from '../../context/HarvestingContext';
import type { ComputedGains } from '../../types';
import styles from './CapitalGainsCard.module.css';

interface Props {
  variant: 'pre' | 'after';
  data: ComputedGains;
}

function fmt(n: number) {
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
  return `$${formatted}`;
}

export default function CapitalGainsCard({ variant, data }: Props) {
  const { preHarvesting, afterHarvesting } = useHarvesting();

  const savings =
    preHarvesting &&
    afterHarvesting &&
    preHarvesting.realisedGains > afterHarvesting.realisedGains
      ? preHarvesting.realisedGains - afterHarvesting.realisedGains
      : null;

  const isPre = variant === 'pre';

  return (
    <div className={`${styles.card} ${isPre ? styles.pre : styles.after}`}>
      <h3 className={styles.title}>
        {isPre ? 'Pre-Harvesting' : 'After Harvesting'}
      </h3>

      {!isPre && savings !== null && (
        <div className={styles.savingsBadge}>
          <span className={styles.savingsIcon}>🎉</span>
          <span>
            You're going to save{' '}
            <strong>{fmt(savings)}</strong>
          </span>
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.col}>
          <span className={styles.label}>Short-term</span>
        </div>
        <div className={styles.colGroup}>
          <div className={styles.subCol}>
            <span className={styles.subLabel}>Profits</span>
            <span className={`${styles.value} ${styles.profit}`}>{fmt(data.stcg.profits)}</span>
          </div>
          <div className={styles.subCol}>
            <span className={styles.subLabel}>Losses</span>
            <span className={`${styles.value} ${styles.loss}`}>- {fmt(data.stcg.losses)}</span>
          </div>
          <div className={styles.subCol}>
            <span className={styles.subLabel}>Net Capital Gains</span>
            <span className={`${styles.value} ${data.netStcg >= 0 ? styles.profit : styles.loss}`}>
              {data.netStcg < 0 ? '- ' : ''}{fmt(data.netStcg)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <div className={styles.col}>
          <span className={styles.label}>Long-term</span>
        </div>
        <div className={styles.colGroup}>
          <div className={styles.subCol}>
            <span className={styles.subLabel}>Profits</span>
            <span className={`${styles.value} ${styles.profit}`}>{fmt(data.ltcg.profits)}</span>
          </div>
          <div className={styles.subCol}>
            <span className={styles.subLabel}>Losses</span>
            <span className={`${styles.value} ${styles.loss}`}>- {fmt(data.ltcg.losses)}</span>
          </div>
          <div className={styles.subCol}>
            <span className={styles.subLabel}>Net Capital Gains</span>
            <span className={`${styles.value} ${data.netLtcg >= 0 ? styles.profit : styles.loss}`}>
              {data.netLtcg < 0 ? '- ' : ''}{fmt(data.netLtcg)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Realised Capital Gains</span>
        <span className={`${styles.totalValue} ${data.realisedGains >= 0 ? styles.profit : styles.loss}`}>
          {data.realisedGains < 0 ? '- ' : ''}{fmt(data.realisedGains)}
        </span>
      </div>
    </div>
  );
}
