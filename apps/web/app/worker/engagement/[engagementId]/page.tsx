'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { opportunityById } from '@platform/application';
import { formatJalali, formatTimeWindow, TruthChip } from '@platform/ui';
import { DemoBar } from '../../../demo/DemoBar';
import { actorByKey } from '../../../demo/actors';
import { useDemoSession } from '../../../demo/session';
import { Latin } from '../../../Latin';
import shared from '../../../outbox/outbox.module.css';
import styles from '../../opportunity/[opportunityId]/verify/verification.module.css';

const WORKER_ID = actorByKey('worker').reference;

export default function WorkerEngagementPage() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const { session, restored, checkIn } = useDemoSession();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const workerRole = restored && session.activeActor === 'worker';
  const engagement = session.engagements.find(
    (item) => item.id === engagementId && item.workerId === WORKER_ID,
  );
  const opportunity =
    engagement === undefined ? undefined : opportunityById(session, engagement.opportunityId);
  const visible =
    workerRole &&
    engagement !== undefined &&
    opportunity !== undefined &&
    (engagement.state === 'Accepted' || engagement.state === 'InProgress');

  function submitCheckIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!visible || engagement?.state !== 'Accepted') return;
    setError(null);
    try {
      checkIn(engagement.id, code);
      setCode('');
    } catch {
      setError('کد ورود پذیرفته نشد. کد ممکن است نادرست، منقضی یا قبلاً استفاده‌شده باشد.');
    }
  }

  const start = opportunity === undefined ? undefined : new Date(opportunity.terms.workStartsAt);
  const end = opportunity === undefined ? undefined : new Date(opportunity.terms.workEndsAt);

  return (
    <div className={shared.shell} data-session-restored={restored ? 'true' : 'false'}>
      <DemoBar detail="W-05 ورود به محل کار را به‌عنوان یک رویداد ثبت می‌کند؛ مرورگر موقعیت واقعی دستگاه را نمی‌خواند." />
      <main className={shared.page}>
        <header className={shared.header}>
          <Link className={shared.back} href="/worker">
            بازگشت به کارهای من
          </Link>
          <p className="type-label">
            <Latin>W-05</Latin> · همکاری و ورود
          </p>
          <h1 className="type-display">جزئیات همکاری و ثبت ورود</h1>
          <p className="type-body">
            ورود با کد یک‌بارمصرفِ همان همکاری ثبت می‌شود. بخش دستگاه یا موقعیت فقط شبیه‌سازی شده
            است و هیچ موقعیت واقعی از دستگاه خوانده نمی‌شود.
          </p>
        </header>

        {!restored ? (
          <p className="type-body">در حال خواندن وضعیت نمایش…</p>
        ) : !workerRole ? (
          <section className={shared.section} data-testid="checkin-forbidden">
            <h2 className="type-title">این صفحه برای نقش کارگر است</h2>
            <Link href="/demo">انتخاب نقش</Link>
          </section>
        ) : !visible || engagement === undefined || opportunity === undefined ? (
          <section className={shared.section} data-testid="checkin-unavailable">
            <h2 className="type-title">همکاری پذیرفته‌شده‌ای برای ورود وجود ندارد</h2>
            <p className="type-body">
              باز کردن این نشانی به‌تنهایی همکاری یا ورود ایجاد نمی‌کند. ابتدا دعوت باید پذیرفته شده
              باشد.
            </p>
          </section>
        ) : (
          <>
            <section className={shared.section} data-testid="engagement-detail">
              <h2 className="type-title">{opportunity.title}</h2>
              <p className="type-body">
                وضعیت همکاری <Latin>{engagement.state}</Latin>
              </p>
              {start !== undefined && end !== undefined ? (
                <p className="type-body">
                  {formatJalali(start)} · {formatTimeWindow(start, end)} ·{' '}
                  {opportunity.terms.location.neighbourhood}
                </p>
              ) : null}
            </section>

            {engagement.state === 'Accepted' ? (
              <section className={shared.section} data-testid="checkin-ready">
                <h2 className="type-title">ثبت ورود</h2>
                {engagement.arrivalCode === undefined ? (
                  <p className="type-body" data-testid="checkin-code-missing">
                    کارفرما هنوز کد ورود این همکاری را صادر نکرده است. در این نمایش، کد از نمای
                    کارفرما در E‑06 صادر می‌شود.
                  </p>
                ) : (
                  <form onSubmit={submitCheckIn}>
                    <label className="type-body-strong" htmlFor="arrival-code">
                      کد ورود
                    </label>
                    <input
                      id="arrival-code"
                      name="arrival-code"
                      inputMode="numeric"
                      autoComplete="off"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      data-testid="arrival-code-input"
                    />
                    <div className={styles.actions}>
                      <button
                        type="submit"
                        className={styles.primaryAction}
                        disabled={code.trim().length === 0}
                        data-testid="checkin-submit"
                      >
                        ثبت ورود
                      </button>
                    </div>
                  </form>
                )}
                {error === null ? null : (
                  <p role="alert" className="type-body" data-testid="checkin-error">
                    {error}
                  </p>
                )}
              </section>
            ) : (
              <section className={shared.section} data-testid="checkin-recorded">
                <h2 className="type-title">ورود ثبت شد</h2>
                <p className="type-body">
                  وضعیت همکاری اکنون <Latin>InProgress</Latin> است. زمان ورود در رویداد همکاری ثبت
                  شده است.
                </p>
                <p className="type-detail">
                  قدرت گواه ورود <TruthChip level="SIMULATED" href="/truth#truth-row-10" /> — این
                  نمونه هیچ موقعیت واقعی دستگاه را جمع‌آوری نکرده است.
                </p>
                <Link href={`/worker/engagement/${engagementId}/completion`} data-testid="go-w06">
                  ثبت گزارش پایان کار (<Latin>W-06</Latin>)
                </Link>
              </section>
            )}

            <section className={shared.section}>
              <h2 className="type-title">بعد از ورود</h2>
              <p className="type-detail">
                گزارش پایان کار اکنون در <Latin>W-06</Latin> قابل ثبت است. ثبت تغییر ساختاریافتهٔ
                کار هنوز ساخته نشده است — <Latin>PLANNED</Latin>. ورود به‌تنهایی هیچ پرداختی را آزاد
                نمی‌کند.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
