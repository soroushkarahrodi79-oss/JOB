import type { TruthLevel } from '@platform/domain';
import { VisuallyHidden } from './VisuallyHidden';
import styles from './TruthChip.module.css';

// color.md: the four truth levels render as follows.
//   FUNCTIONAL -> nothing (the honest majority stays quiet)
//   SIMULATED  -> chip, label «شبیه‌سازی‌شده»
//   MOCK       -> chip, denser hatch, label «ساختگی»
//   PLANNED    -> not rendered as a control at all
const LABELS: Partial<Record<TruthLevel, string>> = {
  SIMULATED: 'شبیه‌سازی‌شده',
  MOCK: 'ساختگی',
};

export interface TruthChipProps {
  level: TruthLevel;
  /** Link to the truth ledger (SH-02), filtered to this claim. The chip is a control, not decor. */
  href: string;
  className?: string;
}

/**
 * The first-class truth-labelling primitive (design-system.md "Truth-label affordance";
 * ADR-0004). Labelling is at the point of use; this attaches to a claim, never to a screen.
 * Announces its level and that it links to the truth ledger (foundations.md).
 */
export function TruthChip({ level, href, className }: TruthChipProps) {
  const label = LABELS[level];
  if (label === undefined) {
    // FUNCTIONAL and PLANNED render nothing.
    return null;
  }
  const classes = [styles.chip, className].filter(Boolean).join(' ');
  return (
    <a className={classes} href={href} data-level={level}>
      <span className={`type-detail ${styles.label}`}>{label}</span>
      <VisuallyHidden>— توضیح در دفتر شفافیت</VisuallyHidden>
    </a>
  );
}
