'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DEMO_NEIGHBOURHOODS,
  REQUIREMENT_CATALOGUE,
  civilDateKey,
  draftOpportunity,
  minutesToClock,
  opportunityById,
  parseTomanInput,
  shiftDateOptions,
  shiftTimeOptions,
  tehranCivilDate,
  tehranMinutesFromMidnight,
  toTomanInputValue,
  validateOpportunityForm,
  type OpportunityFieldName,
  type OpportunityFormValues,
} from '@platform/application';
import { FEATURED_OPPORTUNITY_PLAN } from '@platform/domain';
import { formatJalali, toPersianDigits } from '@platform/ui';
import { useDemoSession } from '../../../demo/session';
import { Latin } from '../../../Latin';
import { CommitmentBlock } from '../../CommitmentBlock';
import styles from '../../employer.module.css';

// E-02 — Opportunity Creation. Beats B1, B2, B3.
//
// "A form a café operator finishes in under a minute, not a requisition" (storyboard.md stage 2).
// Persona P2 will not write a job specification, so the mandatory set is exactly need, time,
// place, pay and headcount — and nothing is added to it. Requirements are step two because "a
// requirement stated apart from the work it belongs to tends to become a wish list, and the
// product's central rule is that a requirement excludes people" (screen-inventory.md).
//
// The form is PRE-FILLED with the shared world's featured transaction. That is not a shortcut: the
// opportunity this screen creates is `OPP-DEMO-01`, the one every later story runs through, so its
// terms come from the one place that owns them (demo-data.ts). Every field stays editable, and
// what the employer submits is what gets created.
//
// Three honesty obligations live on this screen and none of them is decoration:
//   · a requirement the domain cannot evaluate never becomes an eligibility gate — the note field
//     is structurally separate from the requirement list;
//   · the commitment step states that the Platform records a commitment and holds no money;
//   · the location data is fixed synthetic demo geography, labelled where it is used.

const PLAN = FEATURED_OPPORTUNITY_PLAN;

const FIELD_ORDER: readonly OpportunityFieldName[] = [
  'title',
  'shiftDateKey',
  'endMinutes',
  'neighbourhood',
  'tomanAmount',
  'headcount',
  'requirementIds',
  'paymentCommitmentRecorded',
];

const FIELD_ANCHOR: Record<OpportunityFieldName, string> = {
  title: 'field-title',
  shiftDateKey: 'field-date',
  endMinutes: 'field-end',
  neighbourhood: 'field-neighbourhood',
  tomanAmount: 'field-amount',
  headcount: 'field-headcount',
  requirementIds: 'field-requirements',
  paymentCommitmentRecorded: 'field-commitment',
};

const NEIGHBOURHOOD_LABELS: Record<string, string> = {
  'Demo-Centre': 'مرکز (نمایشی)',
  'Demo-North': 'شمال (نمایشی)',
  'Demo-East': 'شرق (نمایشی)',
  'Demo-West': 'غرب (نمایشی)',
  'Demo-South': 'جنوب (نمایشی)',
  'Demo-River': 'کنار رود (نمایشی)',
};

/** Pre-filled from the shared world's plan, and every field stays editable. */
function initialValues(): OpportunityFormValues {
  return {
    title: PLAN.title,
    shiftDateKey: civilDateKey(tehranCivilDate(PLAN.workStartsAt)),
    startMinutes: tehranMinutesFromMidnight(PLAN.workStartsAt),
    endMinutes: tehranMinutesFromMidnight(PLAN.workEndsAt),
    neighbourhood: PLAN.location.neighbourhood,
    tomanAmount: toTomanInputValue(PLAN.amount),
    payBasis: PLAN.payBasis,
    headcount: PLAN.headcount,
    requirementIds: PLAN.requirements.map((requirement) => requirement.id),
    acceptanceMode: PLAN.acceptanceMode,
    employerNote: '',
    paymentCommitmentRecorded: false,
  };
}

export default function OpportunityCreationPage() {
  const router = useRouter();
  const { session, restored, createFeaturedOpportunity } = useDemoSession();
  const [values, setValues] = useState<OpportunityFormValues>(initialValues);
  const [touched, setTouched] = useState<ReadonlySet<OpportunityFieldName>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const existing = opportunityById(session, PLAN.id);
  const draft = draftOpportunity(session);

  const validation = useMemo(() => validateOpportunityForm(values), [values]);
  const errors = validation.ok ? [] : validation.errors;
  const parsedAmount = parseTomanInput(values.tomanAmount);

  const dateOptions = useMemo(() => shiftDateOptions(session.now, 14), [session.now]);
  const timeOptions = useMemo(() => shiftTimeOptions(), []);

  // Errors are shown once a field has been left, or once the form has been submitted — never on
  // each keystroke (foundations.md, *Errors and validation*).
  const visibleErrors = errors.filter((error) => submitted || touched.has(error.field));
  const errorFor = (field: OpportunityFieldName): string | undefined =>
    visibleErrors.find((error) => error.field === field)?.message;

  const blur = (field: OpportunityFieldName) => () => {
    setTouched((current) => new Set(current).add(field));
  };

  useEffect(() => {
    if (submitted && errors.length > 0) summaryRef.current?.focus();
  }, [submitted, errors.length]);

  if (restored && existing !== undefined && existing.lifecycle.state !== 'Draft') {
    // The shared world has exactly one featured transaction. Offering a second creation here would
    // either duplicate it or quietly overwrite the record every later story depends on.
    return (
      <div className={styles.page}>
        <h1 className="type-display">فرصت تازه</h1>
        <p className="type-body" data-testid="already-created">
          «{existing.title}» پیش‌تر در همین نمایش ساخته و منتشر شده است. در این برش، نمایش یک فرصت
          دارد و همان یکی است.
        </p>
        <Link className={`type-body-strong ${styles.primaryAction}`} href="/employer">
          بازگشت به کارها
        </Link>
      </div>
    );
  }

  if (restored && draft !== undefined) {
    return (
      <div className={styles.page}>
        <h1 className="type-display">فرصت تازه</h1>
        <p className="type-body" data-testid="draft-in-progress">
          «{draft.title}» را شروع کرده‌اید و هنوز منتشر نشده است. می‌توانید ادامه دهید یا آن را رها
          کنید؛ فرصتِ رهاشده هیچ ردی باقی نمی‌گذارد.
        </p>
        <Link
          className={`type-body-strong ${styles.primaryAction}`}
          href="/employer/opportunity/new/factors"
        >
          ادامهٔ همین فرصت
        </Link>
      </div>
    );
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setConflict(null);
    const result = validateOpportunityForm(values);
    if (!result.ok) return;
    try {
      createFeaturedOpportunity(result.input);
      router.push('/employer/opportunity/new/factors');
    } catch (error) {
      setConflict(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="type-display">فرصت تازه</h1>
        <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
          بگویید چه کاری لازم دارید، کِی و کجا، و چقدر می‌پردازید. همین. شرط‌ها مرحلهٔ بعد است.
        </p>
      </header>

      {conflict !== null ? (
        <p className="type-body" role="alert" data-testid="conflict">
          {conflict}
        </p>
      ) : null}

      {submitted && visibleErrors.length > 0 ? (
        <div
          className={styles.errorSummary}
          role="alert"
          tabIndex={-1}
          ref={summaryRef}
          data-testid="error-summary"
        >
          <p className="type-body-strong">برای ادامه، این موارد را کامل کنید:</p>
          <ul>
            {FIELD_ORDER.filter((field) =>
              visibleErrors.some((error) => error.field === field),
            ).map((field) => (
              <li key={field}>
                <a className={`type-body ${styles.inlineLink}`} href={`#${FIELD_ANCHOR[field]}`}>
                  {errorFor(field)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form className={styles.form} onSubmit={submit} noValidate>
        {/* ── B1 — the work ─────────────────────────────────────────────────────────────── */}
        <fieldset className={styles.fieldset}>
          <legend className="type-title">کار</legend>

          <div className={styles.field}>
            <label className="type-label" htmlFor={FIELD_ANCHOR.title}>
              چه کاری لازم دارید؟
            </label>
            <input
              id={FIELD_ANCHOR.title}
              className={`type-body ${styles.input}`}
              type="text"
              value={values.title}
              onChange={(event) => {
                setValues((current) => ({ ...current, title: event.target.value }));
              }}
              onBlur={blur('title')}
              aria-invalid={errorFor('title') !== undefined}
              aria-describedby={errorFor('title') !== undefined ? 'error-title' : undefined}
            />
            {errorFor('title') !== undefined ? (
              <p className="type-detail" id="error-title" data-testid="error-title">
                {errorFor('title')}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className="type-label" htmlFor={FIELD_ANCHOR.shiftDateKey}>
              روز شیفت
            </label>
            <select
              id={FIELD_ANCHOR.shiftDateKey}
              className={`type-body ${styles.input}`}
              value={values.shiftDateKey}
              onChange={(event) => {
                setValues((current) => ({ ...current, shiftDateKey: event.target.value }));
              }}
              onBlur={blur('shiftDateKey')}
              data-testid="select-date"
            >
              {dateOptions.map((date) => {
                const key = civilDateKey(date);
                return (
                  <option key={key} value={key}>
                    {/* Jalali, carrying its weekday (typography.md, *Dates and times*). */}
                    {formatJalali(new Date(`${key}T12:00:00.000Z`))}
                  </option>
                );
              })}
            </select>
            <p className="type-detail" style={{ color: 'var(--color-fg-muted)' }}>
              روزها از «امروزِ» ثابت این نمایش شمرده می‌شوند.
            </p>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className="type-label" htmlFor="field-start">
                ساعت شروع
              </label>
              <select
                id="field-start"
                className={`type-body type-numeric ${styles.input}`}
                value={String(values.startMinutes)}
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    startMinutes: Number(event.target.value),
                  }));
                }}
                data-testid="select-start"
              >
                {timeOptions.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {toPersianDigits(minutesToClock(minutes))}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className="type-label" htmlFor={FIELD_ANCHOR.endMinutes}>
                ساعت پایان
              </label>
              <select
                id={FIELD_ANCHOR.endMinutes}
                className={`type-body type-numeric ${styles.input}`}
                value={String(values.endMinutes)}
                onChange={(event) => {
                  setValues((current) => ({ ...current, endMinutes: Number(event.target.value) }));
                }}
                onBlur={blur('endMinutes')}
                aria-invalid={errorFor('endMinutes') !== undefined}
                aria-describedby={errorFor('endMinutes') !== undefined ? 'error-end' : undefined}
                data-testid="select-end"
              >
                {timeOptions.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {toPersianDigits(minutesToClock(minutes))}
                  </option>
                ))}
              </select>
              {errorFor('endMinutes') !== undefined ? (
                <p className="type-detail" id="error-end" data-testid="error-end">
                  {errorFor('endMinutes')}
                </p>
              ) : null}
            </div>
          </div>

          <div className={styles.field}>
            <label className="type-label" htmlFor={FIELD_ANCHOR.neighbourhood}>
              محل کار
            </label>
            <select
              id={FIELD_ANCHOR.neighbourhood}
              className={`type-body ${styles.input}`}
              value={values.neighbourhood}
              onChange={(event) => {
                setValues((current) => ({ ...current, neighbourhood: event.target.value }));
              }}
              onBlur={blur('neighbourhood')}
              data-testid="select-neighbourhood"
            >
              {DEMO_NEIGHBOURHOODS.map((neighbourhood) => (
                <option key={neighbourhood} value={neighbourhood}>
                  {NEIGHBOURHOOD_LABELS[neighbourhood] ?? neighbourhood}
                </option>
              ))}
            </select>
            {/* Truth-matrix row 8: the demo geography is a fixed synthetic table, not map data.
                Labelled where it is used, and the label is words, not only a chip. */}
            <p className="type-detail" data-testid="location-truth">
              محله‌ها و فاصله‌های این نمایش ساختگی و ثابت‌اند و از هیچ سرویس نقشه‌ای نمی‌آیند —{' '}
              <span className="type-body-strong">شبیه‌سازی‌شده</span>.{' '}
              <Link className={styles.inlineLink} href="/truth#truth-row-8">
                دفتر شفافیت، ردیف ۸
              </Link>
            </p>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className="type-label" htmlFor={FIELD_ANCHOR.tomanAmount}>
                دستمزد (تومان)
              </label>
              <input
                id={FIELD_ANCHOR.tomanAmount}
                className={`type-body type-numeric ${styles.input}`}
                type="text"
                inputMode="numeric"
                dir="ltr"
                value={values.tomanAmount}
                onChange={(event) => {
                  setValues((current) => ({ ...current, tomanAmount: event.target.value }));
                }}
                onBlur={blur('tomanAmount')}
                aria-invalid={errorFor('tomanAmount') !== undefined}
                aria-describedby="amount-hint"
                data-testid="input-amount"
              />
              {/* One description slot, not two stacked ones. The correction REPLACES the hint
                  rather than being appended below it, so validating on blur does not grow the
                  field and shift the controls beneath it out from under the pointer — the
                  commitment checkbox is the very next thing the employer reaches for. */}
              {errorFor('tomanAmount') !== undefined ? (
                <p className="type-detail" id="amount-hint" data-testid="error-amount">
                  {errorFor('tomanAmount')}
                </p>
              ) : (
                <p
                  className="type-detail"
                  id="amount-hint"
                  style={{ color: 'var(--color-fg-muted)' }}
                >
                  مبلغ را به تومان وارد کنید. ارقام فارسی و انگلیسی هر دو پذیرفته می‌شود.
                </p>
              )}
            </div>

            <fieldset className={styles.field}>
              <legend className="type-label">مبنای پرداخت</legend>
              {(
                [
                  ['PerShift', 'برای کل شیفت'],
                  ['PerHour', 'به ازای هر ساعت'],
                ] as const
              ).map(([basis, label]) => (
                <label key={basis} className={`type-body ${styles.choice}`}>
                  <input
                    type="radio"
                    name="payBasis"
                    value={basis}
                    checked={values.payBasis === basis}
                    onChange={() => {
                      setValues((current) => ({ ...current, payBasis: basis }));
                    }}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
          </div>

          <div className={styles.field}>
            <label className="type-label" htmlFor={FIELD_ANCHOR.headcount}>
              چند نفر لازم دارید؟
            </label>
            <select
              id={FIELD_ANCHOR.headcount}
              className={`type-body type-numeric ${styles.input}`}
              value={String(values.headcount)}
              onChange={(event) => {
                setValues((current) => ({ ...current, headcount: Number(event.target.value) }));
              }}
              onBlur={blur('headcount')}
              aria-invalid={errorFor('headcount') !== undefined}
              data-testid="select-headcount"
            >
              {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>
                  {toPersianDigits(String(count))}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        {/* ── B2 — the requirements ─────────────────────────────────────────────────────── */}
        <fieldset className={styles.fieldset} id={FIELD_ANCHOR.requirementIds}>
          <legend className="type-title">شرط‌ها</legend>
          <p className="type-body">
            هر شرطی که اینجا بگذارید، کسانی را کنار می‌گذارد. برای همین فقط شرط‌هایی پذیرفته می‌شود
            که سامانه بتواند دربارهٔ هر نفر به آن پاسخ بله یا خیر بدهد. شرط گذاشتن اجباری نیست.
          </p>

          {(['Skill', 'Certificate'] as const).map((kind) => (
            <fieldset key={kind} className={styles.requirementGroup}>
              <legend className="type-label">
                {kind === 'Skill' ? 'تجربه و مهارت' : 'گواهی و مدرک'}
              </legend>
              {REQUIREMENT_CATALOGUE.filter((option) => option.kind === kind).map((option) => (
                <label key={option.id} className={`type-body ${styles.choice}`}>
                  <input
                    type="checkbox"
                    checked={values.requirementIds.includes(option.id)}
                    onChange={(event) => {
                      setValues((current) => ({
                        ...current,
                        requirementIds: event.target.checked
                          ? [...current.requirementIds, option.id]
                          : current.requirementIds.filter((id) => id !== option.id),
                      }));
                    }}
                    data-testid={`requirement-${option.id}`}
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>
          ))}

          {/* HYPOTHESIS · demo-dataset.md, *Skills*: whether any certificate is legally required
              for a given kind of work in Iran is UNKNOWN and recorded as Q13. Here it is an
              employer-stated requirement and no screen may describe it as required by law. */}
          <p className="type-detail" data-testid="certificate-not-legal">
            گواهی‌های بالا شرط‌هایی هستند که شما می‌گذارید. پلتفرم نمی‌گوید قانون آن‌ها را لازم کرده
            است و دربارهٔ الزام قانونی هیچ اظهار نظری نمی‌کند.
          </p>

          <div className={styles.field}>
            <label className="type-label" htmlFor="field-note">
              توضیح برای کارگر (اختیاری)
            </label>
            <textarea
              id="field-note"
              className={`type-body ${styles.input}`}
              rows={3}
              value={values.employerNote}
              onChange={(event) => {
                setValues((current) => ({ ...current, employerNote: event.target.value }));
              }}
              aria-describedby="note-help"
              data-testid="input-note"
            />
            {/* The structural guarantee, stated: free text travels with the opportunity and never
                becomes a gate, because nothing could evaluate it. */}
            <p className="type-detail" id="note-help" data-testid="note-not-a-requirement">
              این متن فقط توضیح است و شرط نیست. چیزی که اینجا بنویسید کسی را کنار نمی‌گذارد.
            </p>
          </div>

          <fieldset className={styles.field}>
            <legend className="type-label">چه کسی می‌تواند بپذیرد؟</legend>
            {(
              [
                ['InviteOnly', 'فقط کسانی که دعوت می‌کنم'],
                ['OpenAcceptance', 'هر کسی که واجد شرایط باشد'],
              ] as const
            ).map(([mode, label]) => (
              <label key={mode} className={`type-body ${styles.choice}`}>
                <input
                  type="radio"
                  name="acceptanceMode"
                  value={mode}
                  checked={values.acceptanceMode === mode}
                  onChange={() => {
                    setValues((current) => ({ ...current, acceptanceMode: mode }));
                  }}
                  data-testid={`acceptance-${mode}`}
                />
                {label}
              </label>
            ))}
            {/* ADR-0010 safeguard 3: a prototype-provisional default is marked at the point of
                use, in the same plain sentence as everything else. */}
            <p className="type-detail" data-testid="d16-note">
              پیش‌فرض «فقط با دعوت» یک انتخاب موقتِ نمونهٔ اولیه است (<Latin>D16</Latin>) و هنوز
              تصمیم نهایی محصول نیست.
            </p>
          </fieldset>
        </fieldset>

        {/* ── B3 — the payment commitment ───────────────────────────────────────────────── */}
        <fieldset className={styles.fieldset} id={FIELD_ANCHOR.paymentCommitmentRecorded}>
          <legend className="type-title">تعهد پرداخت</legend>

          {/* Always rendered, with or without a parseable figure — see CommitmentBlock. */}
          <CommitmentBlock amount={parsedAmount.ok ? parsedAmount.money : null} />

          <label className={`type-body ${styles.choice}`}>
            <input
              type="checkbox"
              checked={values.paymentCommitmentRecorded}
              onChange={(event) => {
                setValues((current) => ({
                  ...current,
                  paymentCommitmentRecorded: event.target.checked,
                }));
              }}
              onBlur={blur('paymentCommitmentRecorded')}
              aria-invalid={errorFor('paymentCommitmentRecorded') !== undefined}
              data-testid="record-commitment"
            />
            تعهد پرداخت این مبلغ را ثبت می‌کنم.
          </label>
          {errorFor('paymentCommitmentRecorded') !== undefined ? (
            <p className="type-detail" data-testid="error-commitment">
              {errorFor('paymentCommitmentRecorded')}
            </p>
          ) : null}
        </fieldset>

        {/* The action sits after every term it commits the employer to (foundations.md content
            hierarchy; design principle 8). It creates the Draft — publication is E-03. */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={`type-body-strong ${styles.primaryButton}`}
            data-testid="continue"
          >
            ثبت پیش‌نویس و ادامه
          </button>
          <p className="type-detail" style={{ color: 'var(--color-fg-muted)' }}>
            با این کار فرصت هنوز منتشر نمی‌شود. مرحلهٔ بعد چند پرسش کوتاه دربارهٔ نحوهٔ انجام کار
            است و انتشار آنجا انجام می‌شود.
          </p>
        </div>
      </form>
    </div>
  );
}
