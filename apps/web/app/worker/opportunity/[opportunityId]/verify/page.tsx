'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  lastIdentityAttempt,
  opportunityById,
  type IdentityDemoOutcome,
} from '@platform/application';
import { generateSyntheticDemoWorld } from '@platform/domain';
import { TruthChip } from '@platform/ui';
import { DemoBar } from '../../../../demo/DemoBar';
import { actorByKey } from '../../../../demo/actors';
import { useDemoSession } from '../../../../demo/session';
import { Latin } from '../../../../Latin';
import shared from '../../../../outbox/outbox.module.css';
import styles from './verification.module.css';

const WORKER_ID = actorByKey('worker').reference;

export default function WorkerVerificationPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const { session, restored, simulateIdentityCheck } = useDemoSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isWorker = restored && session.activeActor === 'worker';
  const opportunity = isWorker ? opportunityById(session, opportunityId) : undefined;
  const visible =
    isWorker &&
    session.seed === generateSyntheticDemoWorld().seed &&
    opportunity?.lifecycle.state === 'Published' &&
    session.engagements.some(
      (item) =>
        item.opportunityId === opportunityId &&
        item.workerId === WORKER_ID &&
        item.state === 'Offered',
    ) &&
    session.notifications.some(
      (item) =>
        item.id === `NOTE-DEMO-${opportunityId}-${WORKER_ID}` &&
        item.recipientId === WORKER_ID &&
        item.truth === 'MOCK',
    );
  const latest = visible ? lastIdentityAttempt(session, opportunityId, WORKER_ID) : undefined;
  const verified = latest?.result === 'VerifiedSimulated';

  async function run(outcome: IdentityDemoOutcome) {
    if (pending || !visible || verified) return;
    setPending(true);
    setError(null);
    try {
      await simulateIdentityCheck(opportunityId, outcome);
    } catch {
      setError('این تلاش نمایشی ثبت نشد. وضعیت دعوت را بررسی کنید و دوباره تلاش کنید.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={shared.shell} data-session-restored={restored ? 'true' : 'false'}>
      <DemoBar detail="این بررسی فقط با داده‌های ساختگی همین زبانه کار می‌کند؛ هیچ مدرک یا شناسهٔ واقعی دریافت نمی‌شود." />
      <main className={shared.page}>
        <header className={shared.header}>
          <Link className={shared.back} href={`/worker/opportunity/${opportunityId}`}>
            بازگشت به جزئیات دعوت
          </Link>
          <p className="type-label">
            <Latin>W-03</Latin> · بررسی آزمایشی هویت
          </p>
          <h1 className="type-display">بررسی هویت برای این دعوت</h1>
          <p className="type-body">
            در طرح نمایشی، بررسی هویت پیش از پذیرش همکاری لازم است. پذیرش هنوز ساخته نشده و انجام
            این بررسی، وضعیت دعوت را از <Latin>Offered</Latin> تغییر نمی‌دهد.
          </p>
        </header>
        {!restored ? (
          <p className="type-body" data-testid="verification-loading">
            در حال خواندن وضعیت نمایش…
          </p>
        ) : !isWorker ? (
          <section className={shared.section} data-testid="verification-forbidden">
            <h2 className="type-title">این مرحله فقط برای نقش کارگر است</h2>
            <Link href="/demo">انتخاب نقش نمایشی</Link>
          </section>
        ) : !visible ? (
          <section className={shared.section} data-testid="verification-unavailable">
            <h2 className="type-title">دعوت معتبری برای بررسی وجود ندارد</h2>
            <p className="type-body">
              ورود از نشانی این صفحه، دعوت یا بررسی هویت ایجاد نمی‌کند. ابتدا باید کارفرما در همین
              زبانه فرصتی منتشر کند و برای این کارگر دعوت ثبت کند.
            </p>
            <Link href="/worker">بازگشت به کار و فرصت‌ها</Link>
          </section>
        ) : (
          <>
            <section className={shared.section} data-testid="verification-ready">
              <h2 className="type-title">{opportunity?.title}</h2>
              <p className="type-body">
                تنها نتیجهٔ یک ارائه‌دهندهٔ کاملاً ساختگی ذخیره می‌شود: وضعیت، زمان و سطح اعتبار.
                شمارهٔ ملی، تصویر مدرک و اطلاعات هویتی درخواست یا ذخیره نمی‌شوند.{' '}
                <TruthChip level="SIMULATED" href="/truth#truth-row-3" />
              </p>
              <p className="type-detail">
                این کنترل‌ها سناریوهای آزمایش هستند، نه انتخاب نتیجهٔ بررسی هویت واقعی.
              </p>
              {verified ? null : (
                <div className={styles.actions} data-testid="verification-scenarios">
                  <button
                    type="button"
                    className={styles.primaryAction}
                    disabled={pending}
                    onClick={() => void run('Success')}
                    data-testid="verification-success"
                  >
                    اجرای سناریوی موفق
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    disabled={pending}
                    onClick={() => void run('Rejected')}
                    data-testid="verification-rejected"
                  >
                    اجرای سناریوی ردشدن
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    disabled={pending}
                    onClick={() => void run('Timeout')}
                    data-testid="verification-timeout"
                  >
                    اجرای سناریوی پایان مهلت
                  </button>
                </div>
              )}
              {error === null ? null : (
                <p className="type-body" role="alert" data-testid="verification-error">
                  {error}
                </p>
              )}
            </section>
            {latest === undefined ? null : (
              <section className={styles.result} data-testid="verification-result">
                <h2 className="type-title">نتیجهٔ آخرین تلاش نمایشی</h2>
                {latest.result === 'VerifiedSimulated' ? (
                  <p className="type-body" data-testid="verification-verified">
                    بررسی آزمایشی موفق بود؛ گواه ثبت‌شده دارای مبنای{' '}
                    <Latin>ProviderVerifiedSimulated</Latin> و زمان ثبت است. این تأیید واقعی هویت
                    نیست.
                  </p>
                ) : latest.result === 'RejectedSimulated' ? (
                  <p className="type-body" data-testid="verification-failure">
                    ارائه‌دهندهٔ ساختگی این تلاش را رد کرد. گواه موفق ایجاد نشد؛ می‌توانید سناریوی
                    دیگری را اجرا کنید.
                  </p>
                ) : latest.result === 'TimeoutSimulated' ? (
                  <p className="type-body" data-testid="verification-failure">
                    مهلت پاسخ ارائه‌دهندهٔ ساختگی پایان یافت. هویت تأیید نشده است و می‌توانید دوباره
                    تلاش کنید.
                  </p>
                ) : (
                  <p className="type-body" data-testid="verification-failure">
                    نتیجهٔ این تلاش آزمایشی نامعلوم است. هیچ گواه موفقی ثبت نشده است.
                  </p>
                )}
                <p className="type-detail">
                  زمان ثبت: <Latin>{latest.recordedAt}</Latin> ·{' '}
                  <TruthChip level="SIMULATED" href="/truth#truth-row-3" />
                </p>
                <p className="type-detail">
                  دعوت همچنان <Latin>Offered</Latin> است. پذیرش یا رد دعوت در{' '}
                  <Latin>W-04 · PLANNED</Latin> انجام خواهد شد؛ این صفحه آن را انجام نمی‌دهد.
                </p>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
