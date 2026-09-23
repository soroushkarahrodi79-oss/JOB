'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  candidateList,
  opportunityById,
  type RankedCandidate,
  type ExcludedCandidate,
} from '@platform/application';
import { generateSyntheticDemoWorld, type EligibilityReason } from '@platform/domain';
import {
  formatAmountWithBasis,
  formatJalali,
  formatTimeWindow,
  toPersianDigits,
  TruthChip,
} from '@platform/ui';
import { DemoBar } from '../../../demo/DemoBar';
import { actorByKey } from '../../../demo/actors';
import { useDemoSession } from '../../../demo/session';
import { Latin } from '../../../Latin';
import styles from '../../../outbox/outbox.module.css';

// W-02, bounded to a worker's own in-tab invitation. This is the published opportunity
// recorded by E-02/E-03, evaluated by the SAME candidateList as E-04. No worker-side
// engagement transition, identity check, inferred travel boundary, or SMS delivery.
const WORKER_ID = actorByKey('worker').reference;

type WorkerEvaluation = RankedCandidate | ExcludedCandidate;

function Requirement({ reason }: { reason: EligibilityReason }) {
  const status =
    reason.status === 'Met'
      ? 'برآورده شده'
      : reason.status === 'Unmet'
        ? 'برآورده نشده'
        : 'مدرکی ثبت نشده است';
  const strength = reason.attestation?.strength;
  const source =
    strength === 'ProviderVerifiedSimulated'
      ? 'تأیید آزمایشی ارائه‌دهنده'
      : strength === 'EmployerConfirmed'
        ? 'تأیید ثبت‌شدهٔ کارفرما'
        : strength === 'SelfDeclared'
          ? 'خوداظهاری کارگر'
          : null;

  return (
    <li className={styles.message} data-testid={`worker-requirement-${reason.requirementId}`}>
      <p className="type-body-strong">{reason.requirementLabel}</p>
      <p className="type-body">
        {status}
        {source !== null ? <> · مبنا: {source}</> : null}
        {strength === 'ProviderVerifiedSimulated' ? (
          <>
            {' '}
            <TruthChip level="SIMULATED" href="/truth#truth-row-3" />
          </>
        ) : null}
      </p>
    </li>
  );
}

function WorkerResult({ evaluation }: { evaluation: WorkerEvaluation }) {
  const excluded = 'stage' in evaluation;
  const availability =
    evaluation.availability.kind === 'Covers'
      ? 'در دسترس‌بودن این بازه ثبت شده است.'
      : evaluation.availability.kind === 'DoesNotCover'
        ? 'بازهٔ ثبت‌شدهٔ در دسترس‌بودن، این شیفت را پوشش نمی‌دهد.'
        : 'اطلاعات در دسترس‌بودن ثبت نشده است؛ این به‌معنای عدم دسترسی نیست.';
  const location =
    evaluation.location.kind === 'Outside'
      ? 'بیرون از محدودهٔ مسافت ثبت‌شدهٔ کارفرما.'
      : evaluation.location.kind === 'Within'
        ? 'در محدودهٔ مسافت ثبت‌شدهٔ کارفرما.'
        : 'مسافت، مانع قطعی برای این فرصت ثبت نشده است.';

  return (
    <section className={styles.section} aria-labelledby="eligibility-heading">
      <h2 className="type-title" id="eligibility-heading">
        شرایط و دلیل نتیجه
      </h2>
      <p className="type-body" data-testid="worker-eligibility-result">
        {excluded
          ? 'در ارزیابی فعلی، یک شرط یا محدودیت ثبت‌شده مانع واجد شرایط بودن است.'
          : 'در ارزیابی فعلی، مانع قطعی ثبت‌شده‌ای برای این فرصت وجود ندارد.'}{' '}
        این نتیجه تنها برای اطلاعات این نمایش است؛ پذیرش همکاری نیست.
      </p>
      <ul className={styles.messages} data-testid="worker-requirements">
        {evaluation.eligibility.reasons.length === 0 ? (
          <li className="type-body">کارفرما شرط تخصصی جداگانه‌ای ثبت نکرده است.</li>
        ) : (
          evaluation.eligibility.reasons.map((reason) => (
            <Requirement key={reason.requirementId} reason={reason} />
          ))
        )}
      </ul>
      <p className="type-body" data-testid="worker-availability">
        <strong>در دسترس بودن:</strong> {availability}
      </p>
      <p className="type-body" data-testid="worker-location-evaluation">
        <strong>محدودهٔ مسافت:</strong> {location}{' '}
        <TruthChip level="SIMULATED" href="/truth#truth-row-8" />
      </p>
      {excluded ? (
        <p className="type-body" data-testid="worker-exclusion-stage">
          اولین مانع در ترتیب ارزیابی: <Latin>{evaluation.stage}</Latin>. نبود مدرک، برابر با ردشدن
          صریح آن شرط نیست.
        </p>
      ) : null}
    </section>
  );
}

export default function WorkerInvitationDetailPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const { session, restored } = useDemoSession();
  const isWorker = restored && session.activeActor === 'worker';
  const world = generateSyntheticDemoWorld();
  const record = isWorker ? opportunityById(session, opportunityId) : undefined;
  const offered = session.engagements.some(
    (engagement) =>
      engagement.opportunityId === opportunityId &&
      engagement.workerId === WORKER_ID &&
      engagement.state === 'Offered',
  );
  const notified = session.notifications.some(
    (notification) =>
      notification.id === `NOTE-DEMO-${opportunityId}-${WORKER_ID}` &&
      notification.recipientId === WORKER_ID &&
      notification.truth === 'MOCK',
  );
  const visible =
    isWorker &&
    session.seed === world.seed &&
    offered &&
    notified &&
    record !== undefined &&
    record.lifecycle.state === 'Published';
  const evaluated = visible && record !== undefined ? candidateList(world, record) : undefined;
  const evaluation =
    evaluated?.ranked.find((item) => item.workerId === WORKER_ID) ??
    evaluated?.excluded.find((item) => item.workerId === WORKER_ID);

  return (
    <div className={styles.shell} data-session-restored={restored ? 'true' : 'false'}>
      <DemoBar detail="جزئیات دعوت فقط از داده‌های ثبت‌شدهٔ همین زبانه خوانده می‌شود؛ این ورود به حساب نیست." />
      <main className={styles.page}>
        <header className={styles.header}>
          <Link className={`type-detail ${styles.back}`} href="/outbox">
            بازگشت به پیام‌های نمایشی
          </Link>
          <p className="type-label">
            <Latin>W-02</Latin> · جزئیات دعوت
          </p>
          <h1 className="type-display">جزئیات فرصت و شرایط</h1>
        </header>
        {!restored ? (
          <p className="type-body" data-testid="worker-detail-loading">
            در حال خواندن وضعیت نمایش…
          </p>
        ) : !isWorker ? (
          <section className={styles.section} data-testid="worker-detail-forbidden">
            <h2 className="type-title">این نمایش برای نقش کارگر است</h2>
            <p className="type-body">
              انتخاب نقش در این نمونه، احراز هویت نیست. برای دیدن دعوت همین کارگر، نقش کارگر را از
              صفحهٔ نمایش انتخاب کنید.
            </p>
            <Link className={styles.back} href="/demo">
              انتخاب نقش
            </Link>
          </section>
        ) : !visible || record === undefined || evaluation === undefined ? (
          <section className={styles.section} data-testid="worker-detail-unavailable">
            <h2 className="type-title">دعوتی برای نمایش وجود ندارد</h2>
            <p className="type-body">
              تنها فرصت منتشرشده‌ای نمایش داده می‌شود که برای همین کارگر در همین زبانه دعوت و پیام
              نمایشی ثبت کرده باشد. نشانی به‌تنهایی دعوت ایجاد نمی‌کند.
            </p>
          </section>
        ) : (
          <>
            <section className={styles.section} data-testid="worker-invitation-detail">
              <h2 className="type-title">{record.title}</h2>
              <p className="type-body">
                این دعوت در نمایش ثبت شده و هنوز <Latin>Offered</Latin> است؛ نه تأییدشده، نه
                پذیرفته‌شده. هیچ پیامکی ارسال نشده است.{' '}
                <TruthChip level="MOCK" href="/truth#truth-row-16" />
              </p>
              <dl className={styles.facts}>
                <div>
                  <dt className="type-label">دستمزد و مبنا</dt>
                  <dd className="type-body type-numeric" data-testid="worker-detail-amount">
                    {formatAmountWithBasis(record.terms.amount, record.terms.payBasis)}
                  </dd>
                </div>
                <div>
                  <dt className="type-label">زمان شیفت</dt>
                  <dd className="type-body type-numeric">
                    {formatJalali(new Date(record.terms.workStartsAt))} ·{' '}
                    {formatTimeWindow(
                      new Date(record.terms.workStartsAt),
                      new Date(record.terms.workEndsAt),
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="type-label">محل کار</dt>
                  <dd className="type-body">
                    {record.terms.location.city} · {record.terms.location.neighbourhood}{' '}
                    <TruthChip level="SIMULATED" href="/truth#truth-row-8" />
                  </dd>
                </div>
                <div>
                  <dt className="type-label">ظرفیت ثبت‌شده</dt>
                  <dd className="type-body type-numeric">
                    {toPersianDigits(String(record.terms.headcount))} جایگاه
                  </dd>
                </div>
                <div>
                  <dt className="type-label">نوع پذیرش</dt>
                  <dd className="type-body">
                    {record.terms.acceptanceMode === 'InviteOnly'
                      ? 'فقط با دعوت کارفرما'
                      : 'پذیرش باز'}
                  </dd>
                </div>
                <div>
                  <dt className="type-label">محدودهٔ مسافت کارفرما</dt>
                  <dd className="type-body">
                    {record.terms.travelBoundary === undefined
                      ? 'محدوده‌ای ثبت نشده است.'
                      : toPersianDigits(
                          `تا ${String(record.terms.travelBoundary.maxKilometres)} کیلومتر`,
                        )}{' '}
                    {record.terms.travelBoundary === undefined ? null : (
                      <TruthChip level="SIMULATED" href="/truth#truth-row-8" />
                    )}
                  </dd>
                </div>
              </dl>
              {record.employerNote.trim().length > 0 ? (
                <p className="type-body" data-testid="worker-employer-note">
                  توضیح کارفرما (شرط احراز صلاحیت نیست): {record.employerNote}
                </p>
              ) : null}
              <p className={`type-detail ${styles.notice}`} data-testid="worker-no-custody">
                مبلغ بالا تعهد ثبت‌شدهٔ کارفرما است. سامانه پول را نگهداری یا پرداخت نمی‌کند.{' '}
                <TruthChip level="MOCK" href="/truth#truth-row-12" />
              </p>
            </section>
            <WorkerResult evaluation={evaluation} />
            <section className={styles.section} data-testid="worker-response-planned">
              <h2 className="type-title">گام بعدی</h2>
              <p className="type-body">
                بررسی هویت (<Latin>W-03</Latin>) و پذیرش یا رد دعوت (<Latin>W-04</Latin>) هنوز ساخته
                نشده‌اند — <Latin>PLANNED</Latin>. مشاهدهٔ این صفحه هیچ تغییری در وضعیت همکاری، تعهد
                پرداخت یا پیام ثبت‌شده نمی‌دهد.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
