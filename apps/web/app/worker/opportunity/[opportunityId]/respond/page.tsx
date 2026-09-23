'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { lastIdentityAttempt, opportunityById } from '@platform/application';
import { generateSyntheticDemoWorld } from '@platform/domain';
import { TruthChip } from '@platform/ui';
import { DemoBar } from '../../../../demo/DemoBar';
import { actorByKey } from '../../../../demo/actors';
import { useDemoSession } from '../../../../demo/session';
import { Latin } from '../../../../Latin';
import shared from '../../../../outbox/outbox.module.css';
import styles from '../verify/verification.module.css';

const WORKER_ID = actorByKey('worker').reference;

export default function WorkerResponsePage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const { session, restored, respondToWorkerInvitation } = useDemoSession();
  const [error, setError] = useState<string | null>(null);

  const isWorker = restored && session.activeActor === 'worker';
  const opportunity = isWorker ? opportunityById(session, opportunityId) : undefined;
  const engagement = session.engagements.find(
    (item) => item.opportunityId === opportunityId && item.workerId === WORKER_ID,
  );
  const notified = session.notifications.some(
    (item) =>
      item.id === `NOTE-DEMO-${opportunityId}-${WORKER_ID}` &&
      item.recipientId === WORKER_ID &&
      item.truth === 'MOCK',
  );
  const visible =
    isWorker &&
    session.seed === generateSyntheticDemoWorld().seed &&
    opportunity !== undefined &&
    (opportunity.lifecycle.state === 'Published' || opportunity.lifecycle.state === 'Filled') &&
    engagement !== undefined &&
    notified;

  const latest = visible ? lastIdentityAttempt(session, opportunityId, WORKER_ID) : undefined;
  const verified = latest?.result === 'VerifiedSimulated';
  const offered = engagement?.state === 'Offered';
  const canAccept =
    verified &&
    opportunity?.lifecycle.state === 'Published' &&
    opportunity.lifecycle.acceptedEngagementCount < opportunity.lifecycle.headcount;

  function decide(decision: 'Accept' | 'Decline') {
    if (!visible || !offered) return;
    setError(null);
    try {
      respondToWorkerInvitation(opportunityId, decision);
    } catch {
      setError(
        decision === 'Accept'
          ? 'پذیرش ثبت نشد. بررسی هویت و واجد شرایط بودن فعلی باید پیش از پذیرش تأیید شوند.'
          : 'رد دعوت ثبت نشد. وضعیت دعوت را بررسی کنید و دوباره تلاش کنید.',
      );
    }
  }

  return (
    <div className={shared.shell} data-session-restored={restored ? 'true' : 'false'}>
      <DemoBar detail="پاسخ به دعوت فقط وضعیت همین نمایش را تغییر می‌دهد؛ هیچ پیام واقعی ارسال نمی‌شود و هیچ پرداختی انجام نمی‌گیرد." />
      <main className={shared.page}>
        <header className={shared.header}>
          <Link className={shared.back} href={`/worker/opportunity/${opportunityId}`}>
            بازگشت به جزئیات دعوت
          </Link>
          <p className="type-label">
            <Latin>W-04</Latin> · پاسخ به دعوت
          </p>
          <h1 className="type-display">پذیرش یا رد دعوت</h1>
          <p className="type-body">
            این مرحله فقط پاسخ کارگر به همان دعوت ثبت‌شده است. پذیرش، شروع کار نیست و هیچ پرداختی را
            آزاد نمی‌کند.
          </p>
        </header>

        {!restored ? (
          <p className="type-body" data-testid="response-loading">
            در حال خواندن وضعیت نمایش…
          </p>
        ) : !isWorker ? (
          <section className={shared.section} data-testid="response-forbidden">
            <h2 className="type-title">این مرحله فقط برای نقش کارگر است</h2>
            <Link href="/demo">انتخاب نقش نمایشی</Link>
          </section>
        ) : !visible || opportunity === undefined || engagement === undefined ? (
          <section className={shared.section} data-testid="response-unavailable">
            <h2 className="type-title">دعوت معتبری برای پاسخ وجود ندارد</h2>
            <p className="type-body">
              نشانی این صفحه به‌تنهایی دعوت یا همکاری ایجاد نمی‌کند. دعوت باید قبلاً در همین زبانه
              ثبت شده باشد.
            </p>
          </section>
        ) : engagement.state === 'Accepted' ? (
          <section className={shared.section} data-testid="response-accepted">
            <h2 className="type-title">دعوت پذیرفته شد</h2>
            <p className="type-body">
              وضعیت همکاری اکنون <Latin>Accepted</Latin> است. این فقط تأیید شرایط است؛ کار هنوز شروع
              نشده و هیچ پرداختی آزاد نشده است.
            </p>
            <p className="type-detail">
              بررسی هویتِ مبنا <TruthChip level="SIMULATED" href="/truth#truth-row-3" /> · پیام دعوت{' '}
              <TruthChip level="MOCK" href="/truth#truth-row-16" />
            </p>
            <Link
              href={`/worker/opportunity/${opportunityId}/engagement`}
              data-testid="worker-engagement-link"
            >
              دیدن شرایط پذیرفته‌شده و ورود به شیفت
            </Link>
            <Link href="/worker">بازگشت به کارهای من</Link>
          </section>
        ) : engagement.state === 'Declined' ? (
          <section className={shared.section} data-testid="response-declined">
            <h2 className="type-title">دعوت رد شد</h2>
            <p className="type-body">
              وضعیت این دعوت اکنون <Latin>Declined</Latin> است. رد دعوت در مدل دامنه یک نتیجهٔ مشروع
              است و به‌خودی‌خود سیگنال قابلیت اعتماد نیست.
            </p>
            <Link href="/worker">بازگشت به کارهای من</Link>
          </section>
        ) : (
          <section className={shared.section} data-testid="response-ready">
            <h2 className="type-title">{opportunity.title}</h2>
            <p className="type-body">
              وضعیت فعلی <Latin>Offered</Latin> است. برای پذیرش، سامانه باید همین حالا واجد شرایط
              بودن را دوباره ارزیابی کند و W‑03 موفق ثبت شده باشد.
            </p>

            {verified ? (
              <p className="type-body" data-testid="response-verification-ready">
                آستانهٔ آزمایشی بررسی هویت ثبت شده است.{' '}
                <TruthChip level="SIMULATED" href="/truth#truth-row-3" />
              </p>
            ) : (
              <p className="type-body" data-testid="response-verification-required">
                پذیرش هنوز ممکن نیست: ابتدا W‑03 را با نتیجهٔ موفق تکمیل کنید.{' '}
                <Link href={`/worker/opportunity/${opportunityId}/verify`}>
                  رفتن به بررسی آزمایشی هویت
                </Link>
              </p>
            )}

            {verified && !canAccept ? (
              <p className="type-body" data-testid="response-capacity-unavailable">
                ظرفیت منتشرشده تکمیل شده است. پذیرش ممکن نیست؛ هنوز می‌توانید دعوت را رد کنید.
              </p>
            ) : null}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryAction}
                disabled={!canAccept}
                onClick={() => decide('Accept')}
                data-testid="response-accept"
              >
                پذیرش دعوت
              </button>
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={() => decide('Decline')}
                data-testid="response-decline"
              >
                رد دعوت
              </button>
            </div>

            {error === null ? null : (
              <p className="type-body" role="alert" data-testid="response-error">
                {error}
              </p>
            )}
            <p className="type-detail">
              هیچ پیام واقعی ارسال نمی‌شود. پذیرش یا رد فقط در جلسهٔ نمایشی همین زبانه ثبت می‌شود.{' '}
              <TruthChip level="MOCK" href="/truth#truth-row-16" />
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
