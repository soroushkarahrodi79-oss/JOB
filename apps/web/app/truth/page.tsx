import Link from 'next/link';
import {
  CAPABILITY_LEDGER,
  TRUTH_LEVEL_GLOSS,
  toPersianDigits,
  type CapabilityLedgerRow,
} from '@platform/ui';
import type { TruthLevel } from '@platform/domain';
import styles from './truth.module.css';

// SH-02 — Truth Ledger (docs/product/screen-inventory.md; docs/design/storyboard.md stage 1).
//
// Purpose: charter success criterion 4 — a reviewer identifies what is simulated WITHOUT being
// told. This surface renders the canonical capability matrix (docs/demo-truth-matrix.md, via
// @platform/ui CAPABILITY_LEDGER) as a document of record: every capability, its target and actual
// levels, and the honest gaps. Each row carries `id="truth-row-<n>"`, the stable anchor a truth
// chip elsewhere deep-links to (color.md rule 4). Row 22 is FUNCTIONAL.
//
// SLICE SCOPE: the per-row "screens where the capability is exercised" cross-reference is deferred —
// those screens are not built yet, and listing them now would either be empty or imply screens
// exist. It is recorded as remaining Gate 4 work in the PR notes.

// A truth level is rendered by its canonical taxonomy term plus, for SIMULATED/MOCK, the Persian
// gloss the design system defines (color.md). FUNCTIONAL and PLANNED have no chip gloss.
function levelText(level: TruthLevel): string {
  const gloss = TRUTH_LEVEL_GLOSS[level];
  return gloss === null ? level : `${level} · ${gloss}`;
}

function LedgerRow({ row }: { row: CapabilityLedgerRow }) {
  return (
    <article
      id={`truth-row-${String(row.id)}`}
      className={styles.row}
      data-testid={`row-${String(row.id)}`}
    >
      <h2 className={`type-body-strong ${styles.capability}`}>
        <span className="type-detail" style={{ color: 'var(--color-fg-muted)' }}>
          ردیف {toPersianDigits(String(row.id))}
        </span>{' '}
        {row.capability}
      </h2>
      <dl className={styles.levels}>
        <div className={styles.level}>
          <dt className="type-label">هدف</dt>
          <dd className="type-detail" data-testid={`target-${String(row.id)}`}>
            {levelText(row.target)}
          </dd>
        </div>
        <div className={styles.level}>
          <dt className="type-label">وضعیت کنونی</dt>
          <dd
            className="type-detail"
            data-testid={`actual-${String(row.id)}`}
            data-level={row.actual}
          >
            {levelText(row.actual)}
          </dd>
        </div>
      </dl>
      {row.note.length > 0 ? (
        <p className="type-detail" style={{ color: 'var(--color-fg-muted)' }}>
          {row.note}
        </p>
      ) : null}
    </article>
  );
}

export default function TruthLedgerPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>
          <Link className={`type-detail ${styles.back}`} href="/demo">
            بازگشت به نمایش
          </Link>
        </p>
        <h1 className="type-display">دفتر شفافیت</h1>
        <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
          این سیاههٔ سطحِ راستیِ هر قابلیت است: چه چیزی واقعی و کارکردی است، چه چیزی شبیه‌سازی‌شده
          یا ساختگی است، و چه چیزی هنوز ساخته نشده. هدف این است که بازبین، بدون آنکه به او گفته شود،
          تشخیص دهد چه چیزی شبیه‌سازی شده است. یک قابلیت هرگز در سطحی بالاتر از «وضعیت کنونی» خود
          نمایش داده نمی‌شود.
        </p>
      </header>

      <section className={styles.ledger} aria-label="سیاههٔ قابلیت‌ها">
        {CAPABILITY_LEDGER.map((row) => (
          <LedgerRow key={row.id} row={row} />
        ))}
      </section>
    </main>
  );
}
