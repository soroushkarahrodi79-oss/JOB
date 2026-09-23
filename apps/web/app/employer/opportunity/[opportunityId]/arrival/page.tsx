'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { opportunityById } from '@platform/application';
import { formatJalali, formatTimeWindow, TruthChip } from '@platform/ui';
import { EmployerChrome } from '../../../Chrome';
import { useDemoSession } from '../../../../demo/session';
import { Latin } from '../../../../Latin';
import shared from '../../../../outbox/outbox.module.css';
import controls from '../../../../worker/opportunity/[opportunityId]/verify/verification.module.css';

export default function EmployerArrivalPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const { session, restored, issueArrivalCode, advanceScenarioClock } = useDemoSession();
  const [error, setError] = useState<string | null>(null);
  const record = opportunityById(session, opportunityId);
  const employer = restored && session.activeActor === 'employer';
  const engagement = session.engagements.find(
    (item) => item.opportunityId === opportunityId && item.workerId === 'WKR-DEMO-01',
  );
  const accepted = session.engagementEvents.some(
    (event) => event.engagementId === engagement?.id && event.kind === 'Accepted',
  );
  const allowed = employer && record?.employerId === 'EMP-DEMO-01' && accepted &&
    (engagement?.state === 'Accepted' || engagement?.state === 'InProgress');
  const code = (session.arrivalCodes ?? []).find((item) => item.engagementId === engagement?.id);
  const shifted = record !== undefined && session.now === record.terms.workStartsAt;

  function act(next: () => void) {
    setError(null);
    try {
      next();
    } catch {
      setError('عملیات ثبت نشد. وضعیت همکاری یا زمان نمایشی را بررسی کنید.');
    }
  }

  return (
    <EmployerChrome>
      <div className={shared.page}>
        <header className={shared.header}>
          <Link href="/employer" className={shared.back}>بازگشت به کارها</Link>
          <p className="type-label"><Latin>E-06</Latin> · برش محدود ورود به شیفت</p>
          <h1 className="type-display">کد حضور در شیفت نمایشی</h1>
          <p className="type-body">
            این کد فقط در همین زبانهٔ نمایش کار می‌کند. ایجاد کد یا جلو بردن ساعت، حضور واقعی
            کارگر را ثابت نمی‌کند و پیامک یا موقعیت مکانی واقعی در کار نیست.
          </p>
        </header>
        {!restored ? <p className="type-body">در حال خواندن وضعیت…</p> : !allowed || record === undefined || engagement === undefined ? (
          <section className={shared.section} data-testid="employer-arrival-unavailable">
            <h2 className="type-title">همکاری پذیرفته‌شده‌ای برای نمایش کد وجود ندارد</h2>
            <p className="type-body">ابتدا دعوت همین کارگر باید در W-04 پذیرفته شده باشد.</p>
          </section>
        ) : (
          <section className={shared.section} data-testid="employer-arrival-ready">
            <h2 className="type-title">{record.title}</h2>
            <p className="type-body">کارگر: <Latin>{engagement.workerId}</Latin> · وضعیت: <Latin>{engagement.state}</Latin></p>
            <p className="type-body">
              زمان برنامه‌ریزی‌شده: {formatJalali(new Date(record.terms.workStartsAt))} ·{' '}
              {formatTimeWindow(new Date(record.terms.workStartsAt), new Date(record.terms.workEndsAt))}
            </p>
            {engagement.state === 'Accepted' ? (
              <>
                {code === undefined ? (
                  <button type="button" className={controls.primaryAction} onClick={() => act(() => issueArrivalCode(opportunityId))} data-testid="employer-issue-code">
                    صدور کد نمایشی
                  </button>
                ) : (
                  <p className="type-body" data-testid="employer-issued-code">
                    کد کوتاه برای اعلام حضوری در همین سناریوی ساختگی: <Latin>{code.code.value}</Latin>
                  </p>
                )}
                <p className="type-detail">تأیید کد <TruthChip level="FUNCTIONAL" href="/truth#truth-row-10" /> · سناریوی زمان و حضور <TruthChip level="SIMULATED" href="/truth#truth-row-10" /></p>
                {!shifted ? (
                  <button type="button" className={controls.secondaryAction} onClick={() => act(() => advanceScenarioClock(opportunityId))} data-testid="employer-advance-clock">
                    جلو بردن ساعتِ نمایش تا آغاز شیفت
                  </button>
                ) : <p className="type-body" data-testid="employer-clock-advanced">ساعت همین سناریوی ساختگی به زمان شروع شیفت رسیده است. <TruthChip level="SIMULATED" href="/truth#truth-row-10" /></p>}
                <p className="type-detail">در نقش کارگر، W-05 را باز کنید و کد را وارد کنید. هیچ شروع کاری بدون اقدام کارگر ثبت نمی‌شود.</p>
              </>
            ) : <p className="type-body" data-testid="employer-arrived">ورود نمایشی با کد ثبت شده است؛ کد دیگر قابل استفاده نیست. <TruthChip level="SIMULATED" href="/truth#truth-row-10" /></p>}
            {error === null ? null : <p role="alert" className="type-body">{error}</p>}
            <p className="type-detail">ثبت اصلاحیهٔ شیفت در این برش ساخته نشده است — <Latin>PLANNED</Latin>.</p>
          </section>
        )}
      </div>
    </EmployerChrome>
  );
}
