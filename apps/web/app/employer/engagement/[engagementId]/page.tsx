'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { opportunityById } from '@platform/application';
import { formatJalali, formatTimeWindow, TruthChip } from '@platform/ui';
import { useDemoSession } from '../../../demo/session';
import { Latin } from '../../../Latin';
import shared from '../../../outbox/outbox.module.css';
import { EmployerChrome } from '../../Chrome';
import styles from '../../employer.module.css';

export default function EmployerEngagementPage() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const { session, restored, issueWorkerArrivalCode } = useDemoSession();

  const employerRole = restored && session.activeActor === 'employer';
  const engagement = session.engagements.find(
    (item) => item.id === engagementId && item.employerId === 'EMP-DEMO-01',
  );
  const opportunity =
    engagement === undefined ? undefined : opportunityById(session, engagement.opportunityId);
  const visible =
    employerRole &&
    engagement !== undefined &&
    opportunity !== undefined &&
    (engagement.state === 'Accepted' || engagement.state === 'InProgress');

  const start = opportunity === undefined ? undefined : new Date(opportunity.terms.workStartsAt);
  const end = opportunity === undefined ? undefined : new Date(opportunity.terms.workEndsAt);

  const content = (
    <main className={shared.page} data-session-restored={restored ? 'true' : 'false'}>
      <header className={shared.header}>
        <Link className={shared.back} href="/employer">
          بازگشت به کارها
        </Link>
        <p className="type-label">
          <Latin>E-06</Latin> · پیگیری همکاری
        </p>
        <h1 className="type-display">پیگیری همکاری و کد ورود</h1>
        <p className="type-body">
          این برش فقط صدور کد ورود و مشاهدهٔ رویداد رسیدن را می‌سازد. ثبت تغییر در شرح یا زمان کار
          هنوز ساخته نشده است.
        </p>
      </header>

      {!restored ? (
        <p className="type-body">در حال خواندن وضعیت نمایش…</p>
      ) : !employerRole ? (
        <section className={shared.section} data-testid="employer-engagement-forbidden">
          <h2 className="type-title">این صفحه برای نقش کارفرما است</h2>
          <Link href="/demo">انتخاب نقش</Link>
        </section>
      ) : !visible || engagement === undefined || opportunity === undefined ? (
        <section className={shared.section} data-testid="employer-engagement-unavailable">
          <h2 className="type-title">همکاری زنده‌ای برای پیگیری وجود ندارد</h2>
          <p className="type-body">
            این صفحه فقط همکاری پذیرفته‌شده یا درحال‌انجامِ همین کارفرما را نشان می‌دهد.
          </p>
        </section>
      ) : (
        <>
          <section className={shared.section} data-testid="employer-engagement-detail">
            <h2 className="type-title">{opportunity.title}</h2>
            <p className="type-body">
              کارگر <Latin>{engagement.workerId}</Latin> · وضعیت <Latin>{engagement.state}</Latin>
            </p>
            {start !== undefined && end !== undefined ? (
              <p className="type-body">
                {formatJalali(start)} · {formatTimeWindow(start, end)} ·{' '}
                {opportunity.terms.location.neighbourhood}
              </p>
            ) : null}
          </section>

          {engagement.state === 'Accepted' ? (
            <section className={shared.section} data-testid="employer-arrival-code">
              <h2 className="type-title">کد ورود کارگر</h2>
              {engagement.arrivalCode === undefined ? (
                <>
                  <p className="type-body">
                    یک کد کوتاه برای همین همکاری صادر کنید. کد تا پایان زمان توافق‌شدهٔ شیفت معتبر
                    است و پس از استفاده قابل تکرار نیست.
                  </p>
                  <button
                    type="button"
                    className={styles.primaryAction}
                    onClick={() => issueWorkerArrivalCode(engagement.id)}
                    data-testid="issue-arrival-code"
                  >
                    صدور کد ورود
                  </button>
                </>
              ) : (
                <>
                  <p className="type-display type-numeric" data-testid="arrival-code-value">
                    {engagement.arrivalCode.value}
                  </p>
                  <p className="type-detail">
                    این کد از وضعیت همین نمونه تولید شده و مکانیزم امنیتی تولیدی نیست. کد یک‌بارمصرف
                    است؛ اعتبار آن با پایان شیفت توافق‌شده تمام می‌شود.
                  </p>
                </>
              )}
            </section>
          ) : (
            <section className={shared.section} data-testid="employer-arrival-recorded">
              <h2 className="type-title">ورود ثبت شده است</h2>
              <p className="type-body">
                کارگر با کد همین همکاری وارد شده و وضعیت اکنون <Latin>InProgress</Latin> است.
              </p>
              <p className="type-detail">
                بخش دستگاه/موقعیت گواه ورود{' '}
                <TruthChip level="SIMULATED" href="/truth#truth-row-10" /> است؛ هیچ موقعیت واقعی
                دستگاه خوانده نشده است.
              </p>
            </section>
          )}

          <section className={shared.section}>
            <h2 className="type-title">تغییر در کار</h2>
            <p className="type-detail">
              ثبت و تأیید تغییر ساختاریافته در مرحلهٔ بعد ساخته می‌شود — <Latin>PLANNED</Latin>.
            </p>
          </section>
        </>
      )}
    </main>
  );

  return <EmployerChrome>{content}</EmployerChrome>;
}
