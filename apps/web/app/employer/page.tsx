'use client';

import Link from 'next/link';
import { employerHomeModel, type DemoOpportunityRecord } from '@platform/application';
import { FEATURED_OPPORTUNITY_PLAN } from '@platform/domain';
import {
  StateMark,
  formatJalali,
  formatTimeWindow,
  formatToman,
  toPersianDigits,
} from '@platform/ui';
import { useDemoSession } from '../demo/session';
import { Latin } from '../Latin';
import styles from './employer.module.css';

// E-01 — Employer Home (docs/product/screen-inventory.md).
//
// It answers one question: "what needs my attention now?" — and navigation.md is explicit that the
// concrete consequence is "no KPI row, no charts, no counts strip, and no 'welcome back'". So this
// screen has none. There is no metric on it, because a metric here would be a number about the
// employer that nothing in this slice can derive.
//
// It also refuses to look busier than it is. The employer's real queue is submitted proof
// decisions, and proof, engagements and invitations are not built. Rather than render an empty
// panel that reads as a quiet day, it names each unbuilt part with what it would show, marked
// PLANNED. Nothing on this screen is a live-looking control that leads nowhere.

const EMPLOYER_ID = FEATURED_OPPORTUNITY_PLAN.employerId;

function OpportunityRow({ record }: { record: DemoOpportunityRecord }) {
  const start = new Date(record.terms.workStartsAt);
  const end = new Date(record.terms.workEndsAt);

  return (
    <article className={styles.workItem} data-testid={`opportunity-${record.id}`}>
      <div className={styles.workItemHead}>
        <h3 className="type-subtitle">{record.title}</h3>
        <StateMark family="opportunity" state={record.lifecycle.state} />
      </div>
      <dl className={styles.factGrid}>
        <div>
          <dt className="type-label">زمان</dt>
          <dd className="type-body">
            {formatJalali(start)}
            <br />
            <span className="type-numeric">{formatTimeWindow(start, end)}</span>
          </dd>
        </div>
        <div>
          <dt className="type-label">دستمزد</dt>
          <dd className="type-body type-numeric" data-testid="row-amount">
            {formatToman(record.terms.amount)}
          </dd>
        </div>
        <div>
          <dt className="type-label">جایگاه‌ها</dt>
          <dd className="type-body type-numeric" data-testid="row-positions">
            {/* A ratio in Persian digits, never a percentage (typography.md). Filled of total. */}
            {toPersianDigits(
              `${String(record.lifecycle.acceptedEngagementCount)} از ${String(record.terms.headcount)} پر شده`,
            )}
          </dd>
        </div>
      </dl>
      <p className="type-detail" data-testid="candidates-planned">
        فهرست نامزدها و دعوت از آن‌ها (<Latin>E-04</Latin>) هنوز ساخته نشده است —{' '}
        <span className="type-body-strong">
          برنامه‌ریزی‌شده (<Latin>PLANNED</Latin>)
        </span>
        . تا آن زمان این فرصت منتشر شده اما هیچ دعوتی از آن ارسال نمی‌شود.
      </p>
    </article>
  );
}

export default function EmployerHomePage() {
  const { session, restored } = useDemoSession();
  const model = employerHomeModel(session, EMPLOYER_ID);
  const nothingWaiting = model.queue.length === 0 && model.draft === undefined;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="type-display">کارها</h1>
        <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
          هرچه منتظر پاسخ شماست اینجاست. اگر چیزی اینجا نیست، یعنی کاری منتظر شما نیست.
        </p>
      </header>

      {/* The primary action. It sits at the top because on this screen it is not an action that
          commits the employer to anything — it opens E-02, where the terms are stated and the
          commitment is recorded below them (foundations.md content hierarchy). */}
      <section className={styles.section} aria-labelledby="action-heading">
        <h2 id="action-heading" className="type-title">
          شروع یک کار تازه
        </h2>
        <Link
          className={`type-body-strong ${styles.primaryAction}`}
          href="/employer/opportunity/new"
          data-testid="create-opportunity"
        >
          فرصت جدید بسازید
        </Link>
      </section>

      <section className={styles.section} aria-labelledby="queue-heading" aria-live="polite">
        <h2 id="queue-heading" className="type-title">
          در جریان
        </h2>

        {!restored ? (
          <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
            در حال خواندن وضعیت نمایش…
          </p>
        ) : nothingWaiting ? (
          <p className="type-body" data-testid="queue-empty">
            هیچ فرصت باز یا همکاری در جریانی ندارید. این صفحه چیزی را که وجود ندارد نشان نمی‌دهد.
          </p>
        ) : null}

        {restored && model.draft !== undefined ? (
          <div className={styles.workItem} data-testid="draft-item">
            <div className={styles.workItemHead}>
              <h3 className="type-subtitle">{model.draft.title}</h3>
              <StateMark family="opportunity" state="Draft" />
            </div>
            <p className="type-body">
              یک فرصت را شروع کرده‌اید و هنوز منتشر نشده است. تا وقتی منتشر نشود، برای هیچ‌کس دیده
              نمی‌شود.
            </p>
            <Link
              className={`type-body-strong ${styles.primaryAction}`}
              href="/employer/opportunity/new/factors"
              data-testid="resume-draft"
            >
              ادامهٔ همین فرصت
            </Link>
          </div>
        ) : null}

        {restored
          ? model.queue.map((item) => <OpportunityRow key={item.record.id} record={item.record} />)
          : null}
      </section>

      {/* What the employer's day would otherwise contain. Named, with what each would show, and
          marked PLANNED — never rendered as a control. */}
      <section className={styles.section} aria-labelledby="planned-heading">
        <h2 id="planned-heading" className="type-title">
          بخش‌هایی که هنوز ساخته نشده‌اند
        </h2>
        <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
          این‌ها بخشی از خانهٔ کارفرما هستند و در این برش ساخته نشده‌اند. اینجا نام برده می‌شوند تا
          نبودشان پنهان نماند.
        </p>
        <ul className={styles.plannedList} data-testid="planned-areas">
          {model.planned.map((area) => (
            <li key={area.screenId} className={styles.plannedItem}>
              <p className="type-body-strong">
                {area.label}{' '}
                <span className="type-detail" style={{ color: 'var(--color-fg-muted)' }}>
                  (<Latin>{area.screenId}</Latin>) — برنامه‌ریزی‌شده (<Latin>PLANNED</Latin>)
                </span>
              </p>
              <p className="type-detail">{area.whatItWouldShow}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
