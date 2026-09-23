'use client';

import Link from 'next/link';
import { formatJalali, TruthChip } from '@platform/ui';
import type { DemoEngagementRecord, DemoNotification } from '@platform/application';
import { DemoBar } from '../demo/DemoBar';
import { actorByKey } from '../demo/actors';
import { useDemoSession } from '../demo/session';
import { EmployerChrome } from '../employer/Chrome';
import { Latin } from '../Latin';
import styles from './outbox.module.css';

// SH-03 is a view of the SAME browser-tab session as E-04. It does not send SMS, poll a
// provider, make an offer to a real person, or accept an engagement. An employer sees only
// copies of invitations it recorded; the demo worker sees only invitations addressed to the
// single worker selected by SH-01. Operations has no invitation in this bounded story.
const WORKER_ID = actorByKey('worker').reference;
const EMPLOYER_ID = actorByKey('employer').reference;

interface InvitationView {
  readonly engagement: DemoEngagementRecord;
  readonly notification: DemoNotification;
}

function recordedTime(value: string): string {
  const date = new Date(value);
  return `${formatJalali(date)} · ${new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)}`;
}

function Invitation({ item, employerView }: { item: InvitationView; employerView: boolean }) {
  const { engagement, notification } = item;
  return (
    <article className={styles.message} data-testid={`outbox-message-${notification.recipientId}`}>
      <div className={styles.messageHeading}>
        <h2 className="type-subtitle">دعوت به همکاری</h2>
        <TruthChip level="MOCK" href="/truth#truth-row-16" />
      </div>
      <p className="type-body" data-testid="outbox-message-text">
        {notification.message}
      </p>
      <dl className={styles.facts}>
        <div>
          <dt className="type-label">گیرنده</dt>
          <dd className="type-identifier">
            <Latin>{notification.recipientId}</Latin>
          </dd>
        </div>
        <div>
          <dt className="type-label">کانالِ پیش‌نمایش</dt>
          <dd className="type-body">
            پیامک (<Latin>SMS</Latin>) — ارسال نشده
          </dd>
        </div>
        <div>
          <dt className="type-label">زمان ثبت در نمایش</dt>
          <dd className="type-numeric">{recordedTime(notification.recordedAt)}</dd>
        </div>
      </dl>
      <p className={`type-detail ${styles.notice}`} data-testid="outbox-offered">
        {employerView
          ? 'پیش‌نمایش دعوت ثبت‌شده برای کارگر'
          : 'دعوت ثبت‌شده برای این کارگر در نمایش'}
        ؛ وضعیت همکاری <Latin>{engagement.state}</Latin> است، نه پذیرفته‌شده. هیچ پیامکی ارسال یا
        تحویل نشده است. <TruthChip level="MOCK" href="/truth#truth-row-16" />
      </p>
      {!employerView ? (
        <p className="type-detail" data-testid="response-planned">
          بازکردن فرصت و پاسخ‌دادن به دعوت در <Latin>W-02</Latin> هنوز ساخته نشده است —{' '}
          <Latin>PLANNED</Latin>. این پیام دکمهٔ پذیرش ندارد.
        </p>
      ) : null}
    </article>
  );
}

export default function NotificationOutboxPage() {
  const { session, restored } = useDemoSession();
  const actor = restored ? session.activeActor : null;
  const employerView = actor === 'employer';
  const invitations: InvitationView[] = [];

  if (actor === 'worker' || actor === 'employer') {
    for (const engagement of session.engagements) {
      if (actor === 'worker' && engagement.workerId !== WORKER_ID) continue;
      if (employerView && engagement.employerId !== EMPLOYER_ID) continue;
      const notification = session.notifications.find(
        (item) =>
          item.id === `NOTE-DEMO-${engagement.opportunityId}-${engagement.workerId}` &&
          item.recipientId === engagement.workerId &&
          item.truth === 'MOCK',
      );
      if (notification !== undefined) invitations.push({ engagement, notification });
    }
  }
  invitations.reverse();

  const content = (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={`type-detail ${styles.back}`} href="/demo">
          بازگشت به انتخاب نقش
        </Link>
        <p className="type-label">
          <Latin>SH-03</Latin> · پیام‌ها
        </p>
        <h1 className="type-display">صندوق پیام‌های نمایشی</h1>
        <p className="type-body">
          فقط پیش‌نمایش پیام‌هایی که از دعوت‌های همین زبانهٔ مرورگر ساخته شده‌اند. هیچ پیام واقعی
          ارسال، تحویل یا دریافت نشده است. <TruthChip level="MOCK" href="/truth#truth-row-16" />
        </p>
      </header>

      {!restored ? (
        <p className="type-body" data-testid="outbox-loading" aria-live="polite">
          در حال خواندن وضعیت همین زبانه…
        </p>
      ) : actor === null ? (
        <section className={styles.section} data-testid="outbox-choose-actor">
          <h2 className="type-title">نقشی انتخاب نشده است</h2>
          <p className="type-body">برای دیدن پیام‌های مربوط به یک نقش، ابتدا آن را انتخاب کنید.</p>
          <Link className={styles.back} href="/demo">
            انتخاب نقش
          </Link>
        </section>
      ) : (
        <section className={styles.section} aria-labelledby="messages-heading">
          <h2 className="type-title" id="messages-heading">
            {employerView ? 'رونوشت دعوت‌های ثبت‌شده' : 'پیام‌های این نقش'}
          </h2>
          <p className="type-detail">
            {actor === 'worker' ? (
              <>
                فقط برای <Latin>{WORKER_ID}</Latin>؛ انتخاب نقش در نمایش احراز هویت نیست.
              </>
            ) : employerView ? (
              <>
                فقط دعوت‌های ثبت‌شده توسط <Latin>{EMPLOYER_ID}</Latin>؛ این‌ها پیام‌های ارسالی واقعی
                نیستند.
              </>
            ) : (
              'برای نقش عملیات در این داستان پیام دعوتی ثبت نشده است.'
            )}
          </p>
          {invitations.length === 0 ? (
            <p className="type-body" data-testid="outbox-empty">
              هنوز پیام نمایشیِ مربوط به این نقش ثبت نشده است. پیام نمونهٔ ازپیش‌ساخته‌ای نمایش داده
              نمی‌شود.
            </p>
          ) : (
            <div className={styles.messages} data-testid="outbox-messages">
              {invitations.map((item) => (
                <Invitation key={item.notification.id} item={item} employerView={employerView} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );

  return employerView ? (
    <EmployerChrome>{content}</EmployerChrome>
  ) : (
    <div className={styles.shell} data-session-restored={restored ? 'true' : 'false'}>
      <DemoBar detail="پیام‌ها فقط پیش‌نمایش در همین زبانه‌اند؛ هیچ پیامکی ارسال نمی‌شود." />
      <main>{content}</main>
    </div>
  );
}
