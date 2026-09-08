import {
  StateMark,
  TruthChip,
  EvidenceRow,
  formatToman,
  formatJalali,
  formatTimeWindow,
} from '@platform/ui';
import { rial } from '@platform/domain';
import styles from './harness.module.css';

// GATE 2 verification harness. NOT a product screen (screens are GATE 4, ADR-0011). This surface
// exists only to render the token layer and the primitives so the eight risks carried out of
// GATE 1.5 (docs/design/adversarial-review.md) can be discharged with RENDERED checks — several
// of them (R1 Persian tabular figures, R4 hatch) can only be settled by rendering, not by CSS
// declarations. All content is synthetic (docs/product/demo-scenarios.md demo-data policy).

const amounts = [rial(1_500_000), rial(120_000), rial(9_800_000), rial(450_000)];

export default function VerificationHarness() {
  return (
    <main className={styles.page}>
      <header>
        <h1 className="type-display">راستی‌آزمایی گیت ۲</h1>
        <p className="type-detail" style={{ color: 'var(--color-fg-muted)' }}>
          سطح فنی برای اثبات لایهٔ توکن و پریمیتیوها. صفحهٔ محصول نیست.
        </p>
      </header>

      {/* R1 — Persian tabular figures: equal-width digits align a money column. */}
      <section className={styles.section} data-testid="r1-tabular">
        <h2 className="type-title">R1 — ارقام جدولی فارسی</h2>
        <div className={styles.column}>
          <span className="type-numeric" data-testid="r1-ones">
            ۱۱۱۱
          </span>
          <span className="type-numeric" data-testid="r1-eights">
            ۸۸۸۸
          </span>
        </div>
        <div className={styles.column} data-testid="r1-money-column">
          {amounts.map((m, i) => (
            <span key={i} className="type-numeric" data-testid={`r1-money-${String(i)}`}>
              {formatToman(m)}
            </span>
          ))}
        </div>
      </section>

      {/* R2 — Persian weight separation at body size. */}
      <section className={styles.section} data-testid="r2-weights">
        <h2 className="type-title">R2 — تفکیک وزن فارسی</h2>
        <span className="type-body" data-testid="r2-400">
          کارگر با سابقهٔ کاری روشن
        </span>
        <span className="type-body-strong" data-testid="r2-600">
          کارگر با سابقهٔ کاری روشن
        </span>
        <span data-testid="r2-700" style={{ fontWeight: 700 }} className="type-body">
          کارگر با سابقهٔ کاری روشن
        </span>
      </section>

      {/* R3 — the doubled border on epistemically qualified content, header carries the meaning. */}
      <section className={styles.section} data-testid="r3-epistemic-section">
        <h2 className="type-title">R3 — محتوای دارای وضعیت معرفتی</h2>
        <div className={styles.epistemic} data-testid="r3-epistemic">
          <p className={`type-label ${styles.epistemicHeader}`} data-testid="r3-header">
            فرضیه
          </p>
          <p className="type-body">این نشانهٔ طبقه‌بندی یک فرضیه است و نتیجهٔ حقوقی نیست.</p>
        </div>
      </section>

      {/* R4 — truth chip hatch legibility at chip size. */}
      <section className={styles.section} data-testid="r4-truth">
        <h2 className="type-title">R4 — نشان درستی‌نمایی</h2>
        <div className={styles.row}>
          <TruthChip level="SIMULATED" href="#truth-row-1" />
          <TruthChip level="MOCK" href="#truth-row-2" />
        </div>
      </section>

      {/* R5 — the Evidence Margin at 320px with the longest provenance label on a wrapping claim. */}
      <section className={styles.section} data-testid="r5-margin">
        <h2 className="type-title">R5 — حاشیهٔ سند در عرض کم</h2>
        <EvidenceRow
          provenance="VerifiedSimulated"
          truth="SIMULATED"
          truthHref="#truth-row-3"
          detail="سامانهٔ نمونه — ۱۴۰۴/۰۶/۱۷"
        >
          گواهی سلامت کار در محیط آشپزخانه، صادرشده برای یک بازهٔ زمانی مشخص و قابل بازبینی در
          سابقه.
        </EvidenceRow>
      </section>

      {/* State vocabulary — a coordinate of family x role x form, never colour alone. */}
      <section className={styles.section} data-testid="vocab">
        <h2 className="type-title">واژگان وضعیت</h2>
        <div className={styles.row}>
          <StateMark family="eligibility" state="Eligible" />
          <StateMark family="eligibility" state="Conditional" />
          <StateMark family="eligibility" state="NotEligible" />
        </div>
        <div className={styles.row}>
          <StateMark family="engagement" state="Offered" form="chip" />
          <StateMark family="engagement" state="Completed" form="chip" />
          <StateMark family="proof" state="ApprovedByNonResponse" viewer="actor" form="chip" />
        </div>
      </section>

      {/* Provenance markers — all four levels, ink only. */}
      <section className={styles.section} data-testid="provenance">
        <h2 className="type-title">مبدأ اطلاعات</h2>
        <div className={styles.column}>
          <StateMark family="provenance" state="SelfDeclared" />
          <StateMark family="provenance" state="Observed" />
          <StateMark family="provenance" state="Derived" />
        </div>
      </section>

      {/* Money / date / time presentation. */}
      <section className={styles.section} data-testid="formats">
        <h2 className="type-title">قالب‌بندی</h2>
        <p className="type-body" data-testid="fmt-money">
          {formatToman(rial(1_500_000))}
        </p>
        <p className="type-body" data-testid="fmt-date">
          {formatJalali(new Date('2025-09-08T09:00:00Z'))}
        </p>
        <p className="type-body" data-testid="fmt-window">
          {formatTimeWindow(new Date('2025-09-08T08:00:00Z'), new Date('2025-09-08T12:00:00Z'))}
        </p>
      </section>
    </main>
  );
}
