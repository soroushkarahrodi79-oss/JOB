'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { formatAmountWithBasis, formatJalali, formatTimeWindow, TruthChip } from '@platform/ui';
import { generateSyntheticDemoWorld } from '@platform/domain';
import { DemoBar } from '../../../../demo/DemoBar';
import { useDemoSession } from '../../../../demo/session';
import { Latin } from '../../../../Latin';
import shared from '../../../../outbox/outbox.module.css';
import controls from '../verify/verification.module.css';

export default function WorkerEngagementPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const { session, restored, checkIn } = useDemoSession();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const worker = restored && session.activeActor === 'worker';
  const engagement = session.engagements.find(
    (item) => item.opportunityId === opportunityId && item.workerId === 'WKR-DEMO-01',
  );
  const accepted = session.engagementEvents.find(
    (event) => event.engagementId === engagement?.id && event.kind === 'Accepted',
  );
  const visible =
    worker &&
    session.seed === generateSyntheticDemoWorld().seed &&
    (engagement?.state === 'Accepted' || engagement?.state === 'InProgress') &&
    accepted?.kind === 'Accepted';
  const terms = accepted?.kind === 'Accepted' ? accepted.agreedTerms : undefined;
  const started = engagement?.state === 'InProgress';

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      checkIn(opportunityId, code);
    } catch {
      setError('کد نادرست، منقضی یا مصرف‌شده است؛ یا ساعت نمایشی هنوز به آغاز شیفت نرسیده است.');
    }
  }

  return (
    <div className={shared.shell} data-session-restored={restored ? 'true' : 'false'}>
      <DemoBar detail="این صفحه فقط رویدادهای همین زبانهٔ آزمایشی را ثبت می‌کند؛ حضور واقعی یا موقعیت مکانی را نمی‌سنجد." />
      <main className={shared.page}>
        <header className={shared.header}>
          <Link className={shared.back} href="/worker">
            بازگشت به کارهای من
          </Link>
          <p className="type-label">
            <Latin>W-05</Latin> · جزئیات همکاری و ورود به شیفت
          </p>
          <h1 className="type-display">همکاری پذیرفته‌شده</h1>
          <p className="type-body">
            شرایط زیر همان نسخهٔ ثبت‌شده در لحظهٔ پذیرش است؛ از فرصت زنده دوباره خوانده نمی‌شود.
          </p>
        </header>
        {!restored ? (
          <p className="type-body" data-testid="engagement-loading">
            در حال خواندن وضعیت…
          </p>
        ) : !visible || terms === undefined || engagement === undefined ? (
          <section className={shared.section} data-testid="engagement-unavailable">
            <h2 className="type-title">همکاری پذیرفته‌شده‌ای برای این نقش وجود ندارد</h2>
            <p className="type-body">
              بازکردن نشانی این صفحه، دعوت یا پذیرش یا حضور ایجاد نمی‌کند.
            </p>
          </section>
        ) : (
          <>
            <section className={shared.section} data-testid="engagement-accepted-terms">
              <h2 className="type-title">{terms.title}</h2>
              <p className="type-body type-numeric" data-testid="engagement-amount">
                {formatAmountWithBasis(terms.terms.amount, terms.terms.payBasis)}
              </p>
              <p className="type-body">
                {formatJalali(new Date(terms.terms.workStartsAt))} ·{' '}
                {formatTimeWindow(
                  new Date(terms.terms.workStartsAt),
                  new Date(terms.terms.workEndsAt),
                )}
              </p>
              <p className="type-body">
                {terms.terms.location.city} · {terms.terms.location.neighbourhood}{' '}
                <TruthChip level="SIMULATED" href="/truth#truth-row-8" />
              </p>
              <p className="type-body">
                شرایط ثبت‌شده:{' '}
                {terms.requirements.map((requirement) => requirement.label).join('، ')}
              </p>
              <p className="type-detail">
                وضعیت: <Latin>{engagement.state}</Latin> · پذیرش در{' '}
                {formatJalali(new Date(accepted.recordedAt))} ثبت شده است. بررسی هویتِ مبنا{' '}
                <TruthChip level="SIMULATED" href="/truth#truth-row-3" />
              </p>
              <p className="type-detail">
                تعهد پرداخت ثبت شده، اما پلتفرم پولی نگه نمی‌دارد و هیچ پرداختی در این مرحله انجام
                نمی‌شود.
              </p>
            </section>
            <section className={shared.section} data-testid="engagement-checkin">
              <h2 className="type-title">ورود با کد کارفرما</h2>
              {started ? (
                <>
                  <p className="type-body" data-testid="engagement-arrived">
                    ورود در سناریوی نمایشی ثبت شد: <Latin>{engagement.arrivedAt}</Latin>{' '}
                    <TruthChip level="SIMULATED" href="/truth#truth-row-10" />
                  </p>
                  <p className="type-detail">
                    کد یک‌بارمصرف است. این رویداد سند حضور فیزیکی یا دادهٔ دستگاه و موقعیت مکانی
                    نیست.
                  </p>
                </>
              ) : (
                <>
                  <p className="type-body">
                    کارفرما باید کد کوتاه این همکاری را صادر کند و ساعت سناریو را صریحاً تا شروع
                    شیفت جلو ببرد؛ کارگر سپس کد را وارد می‌کند. ساعت و حضور واقعی اندازه‌گیری
                    نمی‌شوند. <TruthChip level="SIMULATED" href="/truth#truth-row-10" />
                  </p>
                  <form onSubmit={submit} className={shared.section}>
                    <label htmlFor="arrival-code" className="type-body-strong">
                      کد ورود نمایشی
                    </label>
                    <input
                      id="arrival-code"
                      name="arrival-code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      autoComplete="off"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      required
                      data-testid="engagement-code-input"
                    />
                    <button
                      type="submit"
                      className={controls.primaryAction}
                      data-testid="engagement-checkin-submit"
                    >
                      ثبت ورود نمایشی
                    </button>
                  </form>
                  {error === null ? null : (
                    <p className="type-body" role="alert" data-testid="engagement-checkin-error">
                      {error}
                    </p>
                  )}
                </>
              )}
              <p className="type-detail">
                تکمیل کار، اصلاحیهٔ شیفت و پرداخت در این برش ساخته نشده‌اند — <Latin>PLANNED</Latin>
                .
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
