'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FACTOR_QUESTIONS,
  classificationSignalFor,
  derivedFactorReadings,
  draftOpportunity,
  opportunityById,
  type DemoOpportunityRecord,
} from '@platform/application';
import { FEATURED_OPPORTUNITY_PLAN, type ClassificationFactor } from '@platform/domain';
import {
  EvidenceRow,
  StateMark,
  formatJalali,
  formatTimeWindow,
  formatToman,
  toPersianDigits,
} from '@platform/ui';
import { useDemoSession } from '../../../../demo/session';
import { Latin } from '../../../../Latin';
import styles from '../../../employer.module.css';

// E-03 — Engagement Factors and Classification Signal. Beats B4, B5.
//
// `HYPOTHESIS` · Nothing on this screen is a legal determination, and no wording on it may be read
// as one (ADR-0007; experience/classification.md, *Statement of non-conclusion*).
//
// The screen has to communicate two things that pull against each other: that the Platform has
// something useful to say about how this engagement is organised, and that it has no idea what
// that means legally. Every convention available for the first destroys the second — a score
// implies measurement, a gauge implies calibration, a traffic light implies a validated threshold
// — so the panel is built from the one device that exists for this and nothing else: the doubled
// border, reserved system-wide for epistemically qualified content and used here and nowhere else.
//
// LAYOUT AS GUARANTEE. The publish action sits OUTSIDE the panel and BEFORE it in the flow, and is
// never disabled by the signal (components/classification-signal.md, *Non-blocking, structurally*).
// An action inside the panel, or one whose enabled state the panel controlled, would make the
// signal appear to gate publication — and blocking would presume an answer to Q1 and Q6, which
// ADR-0010 safeguard 7 makes unavailable regardless of who approves it (D3).

const PLAN = FEATURED_OPPORTUNITY_PLAN;

const FACTOR_LABELS: Record<string, string> = {
  DirectionAndControl: 'تعیین روش کار و نظارت',
  ScheduleControl: 'تعیین ساعت کار',
  Integration: 'جای کار در فعالیت مجموعه',
  DurationAndRepetition: 'مدت و تکرار',
  ToolsAndMaterials: 'ابزار و مواد',
  EconomicStructure: 'ساختار پرداخت',
  Exclusivity: 'انحصار',
};

/** The two ends of the spectrum, in the employer's own vocabulary. Neither end is good or bad. */
const SPECTRUM = [
  { key: 'independent', label: 'بیشتر شبیه یک کار مستقل و مشخص' },
  { key: 'mixed', label: 'ترکیبی از هر دو' },
  { key: 'employment', label: 'بیشتر شبیه کار زیر نظر و برنامهٔ شما' },
] as const;

/** A named position, from counting factors. No score, no percentage, no confidence figure. */
function spectrumPosition(employmentLike: number, independentLike: number): string {
  if (employmentLike > independentLike) return 'employment';
  if (independentLike > employmentLike) return 'independent';
  return 'mixed';
}

function FactorRow({ factor }: { factor: ClassificationFactor }) {
  const label = FACTOR_LABELS[factor.kind] ?? factor.kind;
  const reading =
    factor.value === 'EmploymentLike'
      ? 'به کار زیر نظر و برنامهٔ شما نزدیک است'
      : factor.value === 'IndependentLike'
        ? 'به کار مستقل و مشخص نزدیک است'
        : 'ثبت نشده';

  return (
    <EvidenceRow
      provenance={factor.source === 'Derived' ? 'Derived' : 'SelfDeclared'}
      detail={
        factor.source === 'Derived'
          ? `از «${factor.sourceReference}»`
          : factor.source === 'EmployerAnswered'
            ? 'پاسخ شما در همین صفحه'
            : 'پرسیده نشده'
      }
    >
      <p className="type-body-strong">{label}</p>
      <p className="type-body">{reading}</p>
    </EvidenceRow>
  );
}

function TermsSummary({ record }: { record: DemoOpportunityRecord }) {
  const start = new Date(record.terms.workStartsAt);
  const end = new Date(record.terms.workEndsAt);
  return (
    <dl className={styles.factGrid} data-testid="terms-summary">
      <div>
        <dt className="type-label">کار</dt>
        <dd className="type-body">{record.title}</dd>
      </div>
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
        <dd className="type-body type-numeric" data-testid="summary-amount">
          {formatToman(record.terms.amount)}
        </dd>
      </div>
      <div>
        <dt className="type-label">جایگاه‌ها</dt>
        <dd className="type-body type-numeric" data-testid="summary-headcount">
          {toPersianDigits(String(record.terms.headcount))} جایگاه
        </dd>
      </div>
      <div>
        <dt className="type-label">پذیرش</dt>
        <dd className="type-body">
          {record.terms.acceptanceMode === 'InviteOnly'
            ? 'فقط کسانی که دعوت می‌کنید'
            : 'هر کسی که واجد شرایط باشد'}
        </dd>
      </div>
      <div>
        <dt className="type-label">شرط‌ها</dt>
        <dd className="type-body">
          {record.requirements.length === 0
            ? 'بدون شرط'
            : record.requirements.map((requirement) => requirement.label).join(' · ')}
        </dd>
      </div>
    </dl>
  );
}

export default function FactorsPage() {
  const router = useRouter();
  const { session, restored, answer, markShown, publish, abandonDraft } = useDemoSession();
  const [publishError, setPublishError] = useState<string | null>(null);

  const record = opportunityById(session, PLAN.id) ?? draftOpportunity(session);

  // Beat B5's publication guard: the panel is rendered without interaction, so it is marked shown
  // as soon as this screen renders it. This is the ONLY way the signal touches publication — what
  // it says is never an input.
  const isDraft = record?.lifecycle.state === 'Draft';
  const alreadyShown = record?.lifecycle.classificationShown ?? false;
  useEffect(() => {
    if (restored && record !== undefined && isDraft && !alreadyShown) markShown(record.id);
  }, [restored, record, isDraft, alreadyShown, markShown]);

  if (!restored) {
    return (
      <div className={styles.page}>
        <h1 className="type-display">نحوهٔ انجام کار</h1>
        <p className="type-body">در حال خواندن وضعیت نمایش…</p>
      </div>
    );
  }

  if (record === undefined) {
    return (
      <div className={styles.page}>
        <h1 className="type-display">نحوهٔ انجام کار</h1>
        <p className="type-body" data-testid="no-draft">
          هنوز فرصتی نساخته‌اید. این صفحه دربارهٔ فرصتی است که در مرحلهٔ پیش ساخته می‌شود.
        </p>
        <Link
          className={`type-body-strong ${styles.primaryAction}`}
          href="/employer/opportunity/new"
        >
          ساختن فرصت
        </Link>
      </div>
    );
  }

  const signal = classificationSignalFor(record);
  const position = spectrumPosition(
    signal.employmentLikeFactors.length,
    signal.independentLikeFactors.length,
  );
  const captured = record.classificationFactors.filter((factor) => factor.value !== 'Uncaptured');
  const uncaptured = record.classificationFactors.filter((factor) => factor.value === 'Uncaptured');
  const published = record.lifecycle.state === 'Published';

  // The E-02 fields the derived factors were read from, each named once however many factors
  // came from it.
  const derivedFields = [
    ...new Set(
      derivedFactorReadings(record.terms, record.payBasis).map((reading) => reading.fieldLabel),
    ),
  ];

  const onPublish = () => {
    setPublishError(null);
    try {
      publish(record.id);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="type-display">نحوهٔ انجام کار</h1>
        <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
          بیشتر چیزهایی که لازم است از آنچه همین حالا نوشتید خوانده می‌شود. فقط چند پرسش می‌ماند که
          از روی آن قابل خواندن نیست.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="terms-heading">
        <h2 id="terms-heading" className="type-title">
          چیزی که منتشر می‌شود
        </h2>
        <TermsSummary record={record} />
      </section>

      {/* ── B4 — the few questions nothing in E-02 implies ────────────────────────────── */}
      {/* Once the opportunity is published the answers are a record, so they render AS a record.
          A disabled control is the alternative and foundations.md rules it out: the system
          "prefers not to render a control at all over rendering an unexplained dead one". */}
      <section className={styles.section} aria-labelledby="questions-heading">
        <h2 id="questions-heading" className="type-title">
          {published ? 'آنچه دربارهٔ نحوهٔ انجام کار گفتید' : 'چند پرسش کوتاه'}
        </h2>
        {FACTOR_QUESTIONS.map((question) => {
          const current = session.factorAnswers[question.kind];
          if (published) {
            const chosen = question.answers.find((option) => option.key === current);
            return (
              <div key={question.kind} className={styles.field}>
                <p className="type-label">{question.question}</p>
                <p className="type-body" data-testid={`answered-${question.kind}`}>
                  {chosen?.label ?? 'پاسخی ثبت نشد'}
                </p>
              </div>
            );
          }
          return (
            <fieldset key={question.kind} className={styles.field}>
              <legend className="type-label">{question.question}</legend>
              {question.answers.map((option) => (
                <label key={option.key} className={`type-body ${styles.choice}`}>
                  <input
                    type="radio"
                    name={question.kind}
                    value={option.key}
                    checked={current === option.key}
                    onChange={() => {
                      answer(question.kind, option.key);
                    }}
                    data-testid={`factor-${question.kind}-${option.key}`}
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>
          );
        })}
      </section>

      {/* ── The publish action: OUTSIDE the panel, BEFORE it, never disabled by it ─────── */}
      <section className={styles.section} aria-labelledby="publish-heading" aria-live="polite">
        <h2 id="publish-heading" className="type-title">
          انتشار
        </h2>
        {published ? (
          <div className={styles.workItem} data-testid="published-state">
            <StateMark family="opportunity" state="Published" />
            <p className="type-body">
              «{record.title}» منتشر شد. از این پس در همین نمایش، همین فرصت است که در همهٔ صفحه‌های
              بعدی دیده می‌شود.
            </p>
            <p className="type-detail" data-testid="next-planned">
              مرحلهٔ بعد، فهرست نامزدها و دعوت از آن‌ها (<Latin>E-04</Latin>)، هنوز ساخته نشده است —{' '}
              <span className="type-body-strong">
                برنامه‌ریزی‌شده (<Latin>PLANNED</Latin>)
              </span>
              .
            </p>
            <Link className={`type-body-strong ${styles.primaryAction}`} href="/employer">
              بازگشت به کارها
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              className={`type-body-strong ${styles.primaryButton}`}
              onClick={onPublish}
              data-testid="publish"
            >
              انتشار فرصت
            </button>
            <p className="type-body" data-testid="signal-does-not-block">
              آنچه در پایین این صفحه می‌بینید جلوی انتشار را نمی‌گیرد و این دکمه را غیرفعال نمی‌کند.
            </p>
            <button
              type="button"
              className={`type-detail ${styles.secondaryButton}`}
              onClick={() => {
                abandonDraft();
                router.push('/employer');
              }}
              data-testid="discard-draft"
            >
              رها کردن این فرصت
            </button>
          </>
        )}
        {publishError !== null ? (
          <p className="type-body" role="alert" data-testid="publish-error">
            {publishError}
          </p>
        ) : null}
      </section>

      {/* ── B5 — the classification signal. The doubled border, once in the whole product ── */}
      <section
        className={styles.epistemicPanel}
        aria-labelledby="signal-heading"
        data-testid="classification-panel"
      >
        <header className={styles.epistemicHeader}>
          <p className="type-body-strong" data-testid="hypothesis-header">
            فرضیه — این یک تعیین حقوقی نیست.
          </p>
          <h2 id="signal-heading" className="type-title">
            چگونگی سازمان‌دهی این همکاری
          </h2>
          <p className="type-body">
            این فقط توصیفی از چیزی است که شما ثبت کرده‌اید. پلتفرم نمی‌گوید این همکاری از نظر قانونی
            چیست و چنین چیزی را بررسی نکرده است.{' '}
            <Link className={styles.inlineLink} href="/truth#truth-row-18">
              آنچه هنوز روشن نیست، در دفتر شفافیت
            </Link>
          </p>
        </header>

        {/* A named position on a named spectrum. Every segment is `neutral`: neither end is good
            or bad, and colouring one would be the legal position the Platform cannot take. */}
        <div className={styles.spectrum} data-testid="spectrum">
          {SPECTRUM.map((segment) => (
            <div
              key={segment.key}
              className={styles.spectrumSegment}
              data-current={segment.key === position ? 'true' : undefined}
            >
              <span className="type-detail">{segment.label}</span>
            </div>
          ))}
        </div>
        <p className="type-body-strong" data-testid="spectrum-position">
          بر پایهٔ آنچه ثبت شده: {SPECTRUM.find((segment) => segment.key === position)?.label ?? ''}
        </p>

        <h3 className="type-subtitle">آنچه ثبت شده است</h3>
        <div className={styles.factorList}>
          {captured.map((factor) => (
            <FactorRow key={factor.kind} factor={factor} />
          ))}
          {captured.length === 0 ? <p className="type-body">هنوز هیچ عاملی ثبت نشده است.</p> : null}
        </div>

        {/* Uncaptured factors at EQUAL visual weight: not dimmed, not collapsed, not smaller, not
            behind a disclosure, not below a fold at any width. The panel is incomplete, and a
            classification screen with no visible gaps would be the overclaim this whole mechanism
            exists to avoid (classification-signal.md; demonstration requirement 3). */}
        <h3 className="type-subtitle">ثبت‌نشده</h3>
        <div className={styles.factorList} data-testid="uncaptured-factors">
          {uncaptured.map((factor) =>
            // Two different facts, rendered differently and at the same weight.
            //
            // An answered «هنوز مشخص نیست» IS a claim the employer made, so it carries the
            // self-declared mark the canon assigns it (classification-signal.md, *Factors*).
            // A factor nobody asked about is NOT a claim by anyone: giving it a provenance mark
            // would attribute to the employer something they never said, and "a mark never sits
            // on a mark" has a companion rule — a mark never sits on an absence. It is named
            // without one, at the same size, in the same list.
            factor.source === 'EmployerAnswered' ? (
              <EvidenceRow
                key={factor.kind}
                provenance="SelfDeclared"
                detail="پرسیده شد؛ پاسخ «هنوز مشخص نیست»"
              >
                <p className="type-body-strong">{FACTOR_LABELS[factor.kind] ?? factor.kind}</p>
                <p className="type-body">
                  شما گفتید هنوز مشخص نیست. این با «خیر» یکی نیست و همین‌طور ثبت شده است.
                </p>
              </EvidenceRow>
            ) : (
              <div key={factor.kind} className={styles.uncapturedRow} data-testid="never-asked">
                <p className="type-body-strong">{FACTOR_LABELS[factor.kind] ?? factor.kind}</p>
                <p className="type-body">
                  این مورد در نمونهٔ اولیه پرسیده نمی‌شود، پس دربارهٔ آن چیزی ثبت نشده است — نه
                  «بله» و نه «خیر».
                </p>
              </div>
            ),
          )}
        </div>

        {derivedFields.length > 0 ? (
          <p className="type-detail" data-testid="derived-explanation">
            {`عامل‌هایی که «محاسبه‌شده» علامت خورده‌اند از همین فرصت خوانده شده‌اند: ${derivedFields.join(' · ')}`}
          </p>
        ) : null}

        {/* ADR-0010 safeguard 3 — the provisional default, marked at the point of use. */}
        <p className="type-detail" data-testid="d3-note">
          اینکه این بخش فقط اطلاع می‌دهد و جلوی انتشار را نمی‌گیرد، یک انتخاب موقتِ نمونهٔ اولیه است
          (<Latin>D3</Latin>) و هنوز تصمیم نهایی محصول نیست.
        </p>

        {/* The permanent footer. `type.body`, never smaller, never collapsible, never below a fold
            at any width (classification-signal.md, *The permanent footer*). */}
        <p className="type-body" data-testid="legal-footer">
          پلتفرم مشاورهٔ حقوقی نمی‌دهد و دربارهٔ وضعیت حقوقی این همکاری اظهار نظری نمی‌کند.
        </p>
      </section>
    </div>
  );
}
