'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { formatJalali, formatTimeWindow, TruthChip } from '@platform/ui';
import { DemoBar } from '../../../../demo/DemoBar';
import { actorByKey } from '../../../../demo/actors';
import { useDemoSession } from '../../../../demo/session';
import { Latin } from '../../../../Latin';
import shared from '../../../../outbox/outbox.module.css';
import styles from '../../../opportunity/[opportunityId]/verify/verification.module.css';

const WORKER_ID = actorByKey('worker').reference;

export default function WorkerCompletionPage() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const { session, restored, submitCompletion } = useDemoSession();
  const [declared, setDeclared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workerRole = restored && session.activeActor === 'worker';
  const engagement = session.engagements.find(
    (item) => item.id === engagementId && item.workerId === WORKER_ID,
  );
  // The accepted-terms snapshot from W-04 — the immutable copy the worker agreed to, never re-read
  // from the mutable live opportunity.
  const acceptedEvent = session.engagementEvents.find(
    (event) => event.engagementId === engagement?.id && event.kind === 'Accepted',
  );
  const terms = acceptedEvent?.kind === 'Accepted' ? acceptedEvent.agreedTerms : undefined;
  const submitted = engagement?.completionProof?.state === 'Submitted';
  const visible =
    workerRole &&
    engagement !== undefined &&
    terms !== undefined &&
    engagement.state === 'InProgress';

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!visible || engagement === undefined) return;
    setError(null);
    try {
      submitCompletion(engagement.id);
      setDeclared(false);
    } catch {
      setError(
        'ثبت گزارش پایان کار ممکن نشد. این کار فقط برای همکاری درحال‌انجام و تنها یک‌بار انجام می‌شود.',
      );
    }
  }

  const start = terms === undefined ? undefined : new Date(terms.terms.workStartsAt);
  const end = terms === undefined ? undefined : new Date(terms.terms.workEndsAt);

  return (
    <div className={shared.shell} data-session-restored={restored ? 'true' : 'false'}>
      <DemoBar detail="W-06 گزارش پایان کار را به‌عنوان یک رویداد ساختاریافته ثبت می‌کند؛ نه عکس، نه پیام و نه سند اثبات حضور فیزیکی." />
      <main className={shared.page}>
        <header className={shared.header}>
          <Link className={shared.back} href={`/worker/engagement/${engagementId}`}>
            بازگشت به جزئیات همکاری
          </Link>
          <p className="type-label">
            <Latin>W-06</Latin> · گزارش پایان کار
          </p>
          <h1 className="type-display">ثبت گزارش پایان کار</h1>
          <p className="type-body">
            گزارش پایان کار یک اظهار ساختاریافتهٔ خودِ کارگر است که به همین همکاری و شرایط
            پذیرفته‌شده گره می‌خورد. این گزارش مدرک حضور فیزیکی، عکس یا پیام نیست و به‌تنهایی کار را
            «تأییدشده» نمی‌کند.
          </p>
        </header>

        {!restored ? (
          <p className="type-body">در حال خواندن وضعیت نمایش…</p>
        ) : !workerRole ? (
          <section className={shared.section} data-testid="completion-forbidden">
            <h2 className="type-title">این صفحه برای نقش کارگر است</h2>
            <Link href="/demo">انتخاب نقش</Link>
          </section>
        ) : !visible || engagement === undefined || terms === undefined ? (
          <section className={shared.section} data-testid="completion-unavailable">
            <h2 className="type-title">همکاری درحال‌انجامی برای گزارش پایان کار وجود ندارد</h2>
            <p className="type-body">
              باز کردن این نشانی به‌تنهایی همکاری یا گزارشی ایجاد نمی‌کند. ابتدا باید ورود در{' '}
              <Latin>W-05</Latin> ثبت شده و همکاری درحال‌انجام باشد.
            </p>
          </section>
        ) : (
          <>
            <section className={shared.section} data-testid="completion-terms">
              <h2 className="type-title">{terms.title}</h2>
              <p className="type-body">
                وضعیت همکاری <Latin>{engagement.state}</Latin>
              </p>
              {start !== undefined && end !== undefined ? (
                <p className="type-body">
                  {formatJalali(start)} · {formatTimeWindow(start, end)} ·{' '}
                  {terms.terms.location.neighbourhood}
                </p>
              ) : null}
              <p className="type-detail">
                شرایط بالا همان نسخهٔ ثبت‌شده در لحظهٔ پذیرش است؛ از فرصت زندهٔ کارفرما دوباره
                خوانده نمی‌شود.
              </p>
            </section>

            {!submitted ? (
              <section className={shared.section} data-testid="completion-ready">
                <h2 className="type-title">اظهار پایان کار</h2>
                <p className="type-body">
                  ثبت گزارش، وضعیت گواهِ کار را در دامنه از <Latin>Awaited</Latin> به{' '}
                  <Latin>Submitted</Latin> می‌برد. ساز و کار ثبت{' '}
                  <TruthChip level="FUNCTIONAL" href="/truth#truth-row-10" /> است؛ اما قدرتِ این
                  گواه <TruthChip level="SIMULATED" href="/truth#truth-row-10" /> است — اظهارِ خودِ
                  کارگر، بدون تأیید مستقل کارفرما یا هیچ داده‌ای از دستگاه.
                </p>
                <p className="type-detail">
                  ثبت گزارش، کار را تکمیل‌شده اعلام نمی‌کند، پرداختی را آزاد نمی‌کند و به‌جای
                  کارفرما آن را تأیید نمی‌کند. کارفرما باید جداگانه بررسی کند؛ تا آن زمان گزارش در
                  حالت <Latin>Submitted</Latin> می‌ماند.
                </p>
                <form onSubmit={submit}>
                  <label className="type-body-strong">
                    <input
                      type="checkbox"
                      checked={declared}
                      onChange={(event) => setDeclared(event.target.checked)}
                      data-testid="completion-declare"
                    />{' '}
                    اظهار می‌کنم کار مطابق شرایط پذیرفته‌شده انجام شده است.
                  </label>
                  <div className={styles.actions}>
                    <button
                      type="submit"
                      className={styles.primaryAction}
                      disabled={!declared}
                      data-testid="completion-submit"
                    >
                      ثبت گزارش پایان کار
                    </button>
                  </div>
                </form>
                {error === null ? null : (
                  <p role="alert" className="type-body" data-testid="completion-error">
                    {error}
                  </p>
                )}
              </section>
            ) : (
              <section className={shared.section} data-testid="completion-recorded">
                <h2 className="type-title">گزارش پایان کار ثبت شد</h2>
                <p className="type-body">
                  وضعیت گواهِ کار اکنون <Latin>Submitted</Latin> است و منتظر بررسی کارفرماست. هیچ
                  پرداختی آزاد نشده و کارفرما هنوز چیزی را تأیید نکرده است.
                </p>
                <p className="type-detail">
                  قدرت این گواه <TruthChip level="SIMULATED" href="/truth#truth-row-10" /> است —
                  اظهارِ خودِ کارگر، نه سند تأییدشدهٔ انجام واقعی کار. بررسی، تأیید یا اعتراض
                  کارفرما هنوز ساخته نشده است — <Latin>PLANNED</Latin>.
                </p>
              </section>
            )}

            <section className={shared.section}>
              <h2 className="type-title">پس از ثبت گزارش</h2>
              <p className="type-detail">
                پرداخت و رسید (<Latin>W-07</Latin>) و بررسی کارفرما هنوز در این برش ساخته نشده‌اند —{' '}
                <Latin>PLANNED</Latin>. ثبت گزارش به‌خودی‌خود هیچ پرداختی را آزاد نمی‌کند.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
