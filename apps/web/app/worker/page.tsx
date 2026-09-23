'use client';

import Link from 'next/link';
import {
  candidateList,
  type DemoEngagementRecord,
  type DemoOpportunityRecord,
} from '@platform/application';
import { generateSyntheticDemoWorld } from '@platform/domain';
import { formatAmountWithBasis, formatJalali, formatTimeWindow, TruthChip } from '@platform/ui';
import { DemoBar } from '../demo/DemoBar';
import { actorByKey } from '../demo/actors';
import { useDemoSession } from '../demo/session';
import { Latin } from '../Latin';
import shared from '../outbox/outbox.module.css';
import styles from './worker.module.css';

// W-01 is a read-only projection of the ONE browser-tab demo session. The employer must create
// and publish OPP-DEMO-01 first. No seeded feed cards, fabricated jobs, new engagement states,
// authentication, hidden eligibility scores, or acceptance action are introduced here.
const WORKER_ID = actorByKey('worker').reference;

type FeedEntry = {
  readonly record: DemoOpportunityRecord;
  readonly excluded: boolean;
  readonly reason: string;
  readonly invited: boolean;
};

function entryFor(
  record: DemoOpportunityRecord,
  world: ReturnType<typeof generateSyntheticDemoWorld>,
  engagements: readonly DemoEngagementRecord[],
  notificationIds: ReadonlySet<string>,
): FeedEntry | undefined {
  if (record.lifecycle.state !== 'Published') return undefined;
  const model = candidateList(world, record);
  const eligible = model.ranked.find((candidate) => candidate.workerId === WORKER_ID);
  const excluded = model.excluded.find((candidate) => candidate.workerId === WORKER_ID);
  if (eligible === undefined && excluded === undefined) return undefined;
  const engagement = engagements.find(
    (item) =>
      item.opportunityId === record.id && item.workerId === WORKER_ID && item.state === 'Offered',
  );
  const invited =
    engagement !== undefined && notificationIds.has(`NOTE-DEMO-${record.id}-${WORKER_ID}`);
  const reason =
    excluded === undefined
      ? eligible?.availability.kind === 'Unknown'
        ? 'شرط‌ها برآورده شده‌اند؛ اطلاعات در دسترس‌بودن ثبت نشده و مانع قطعی محسوب نمی‌شود.'
        : 'شرط‌ها برآورده شده‌اند و مانع قطعیِ ثبت‌شده‌ای وجود ندارد.'
      : excluded.stage === 'Eligibility'
        ? `شرط «${excluded.unmetRequirement?.requirementLabel ?? 'نامشخص'}» ${excluded.unmetRequirement?.status === 'Unknown' ? 'مدرک ثبت‌شده ندارد.' : 'برآورده نشده است.'}`
        : excluded.stage === 'Availability'
          ? 'بازهٔ در دسترس‌بودنِ ثبت‌شده، این شیفت را پوشش نمی‌دهد.'
          : 'مسافت ثبت‌شده بیرون از محدودهٔ اعلام‌شدهٔ کارفرماست.';
  return { record, excluded: excluded !== undefined, reason, invited };
}

export default function WorkerHomePage() {
  const { session, restored } = useDemoSession();
  const workerRole = restored && session.activeActor === 'worker';
  const world = generateSyntheticDemoWorld();
  const entries =
    workerRole && session.seed === world.seed
      ? session.opportunities
          .map((record) =>
            entryFor(
              record,
              world,
              session.engagements,
              new Set(
                session.notifications
                  .filter((notice) => notice.recipientId === WORKER_ID && notice.truth === 'MOCK')
                  .map((notice) => notice.id),
              ),
            ),
          )
          .filter((entry): entry is FeedEntry => entry !== undefined)
      : [];
  const eligible = entries.filter((entry) => !entry.excluded);
  const excluded = entries.filter((entry) => entry.excluded);
  const offered = session.engagements.filter(
    (item) => item.workerId === WORKER_ID && item.state === 'Offered',
  );

  return (
    <div className={shared.shell} data-session-restored={restored ? 'true' : 'false'}>
      <DemoBar detail="این صفحه فقط وضعیت ثبت‌شدهٔ همین زبانه را نشان می‌دهد؛ انتخاب نقش، احراز هویت نیست." />
      <main className={`${shared.page} ${styles.workerPage}`}>
        <header className={`${shared.header} ${styles.workerHeader}`}>
          <p className="type-label">
            <Latin>W-01</Latin> · کار و فرصت‌ها
          </p>
          <h1 className="type-display">کار و فرصت‌ها</h1>
          <p className="type-body">
            فرصت‌های منتشرشده و دعوت‌های ثبت‌شدهٔ همین زبانه؛ بدون فرصت یا سابقهٔ ساختگیِ اضافه.
          </p>
        </header>
        {!restored ? (
          <p className="type-body" data-testid="worker-home-loading">
            در حال خواندن وضعیت نمایش…
          </p>
        ) : !workerRole ? (
          <section className={shared.section} data-testid="worker-home-forbidden">
            <h2 className="type-title">این صفحه برای نقش کارگر است</h2>
            <p className="type-body">
              برای ورود به نمای این کارگر، از صفحهٔ نمایش نقش کارگر را انتخاب کنید؛ این کار احراز
              هویت واقعی نیست.
            </p>
            <Link href="/demo">انتخاب نقش</Link>
          </section>
        ) : (
          <>
            <section
              className={`${shared.section} ${styles.contentSection}`}
              aria-labelledby="feed-heading"
              data-testid="worker-feed"
            >
              <h2 id="feed-heading" className="type-title">
                فرصت‌های واجد شرایط
              </h2>
              {eligible.length === 0 ? (
                <p className={`${styles.emptyState} type-body`} data-testid="worker-feed-empty">
                  هنوز فرصت منتشرشدهٔ واجد شرایطی برای این کارگر در این زبانه وجود ندارد. کارفرما
                  باید ابتدا فرصتی منتشر کند.
                </p>
              ) : (
                eligible.map(({ record, reason, invited }) => (
                  <article
                    className={styles.opportunityRecord}
                    key={record.id}
                    data-testid="worker-eligible-opportunity"
                  >
                    <div className={styles.recordHeading}>
                      <h3 className="type-subtitle">{record.title}</h3>
                      {invited ? (
                        <p className="type-label">
                          دعوت ثبت‌شده · <Latin>Offered</Latin>
                        </p>
                      ) : null}
                    </div>
                    <div className={styles.factGrid} data-testid="worker-opportunity-summary">
                      <p className={`${styles.amount} type-body-strong type-numeric`}>
                        {formatAmountWithBasis(record.terms.amount, record.terms.payBasis)}
                      </p>
                      <p className={`${styles.fact} type-body`}>
                        {formatJalali(new Date(record.terms.workStartsAt))} ·{' '}
                        {formatTimeWindow(
                          new Date(record.terms.workStartsAt),
                          new Date(record.terms.workEndsAt),
                        )}
                      </p>
                      <p className={`${styles.fact} type-body`}>
                        {record.terms.location.neighbourhood} ·{' '}
                        <TruthChip level="SIMULATED" href="/truth#truth-row-8" />
                      </p>
                    </div>
                    <p
                      className={`${styles.eligibility} type-body`}
                      data-testid="worker-inclusion-reason"
                    >
                      {reason}
                    </p>
                    {invited ? (
                      <Link
                        className={styles.primaryAction}
                        href={`/worker/opportunity/${record.id}`}
                        data-testid="worker-feed-detail"
                      >
                        دیدن شرایط دعوت و دلایل واجد شرایط بودن
                      </Link>
                    ) : (
                      <p
                        className={`${styles.plannedNote} type-detail`}
                        data-testid="worker-not-invited"
                      >
                        دعوتی برای این کارگر ثبت نشده است؛ جزئیات کامل فعلاً فقط از دعوت ثبت‌شده
                        باز می‌شود — <Latin>PLANNED</Latin>.
                      </p>
                    )}
                  </article>
                ))
              )}
              {excluded.length > 0 ? (
                <div className={shared.section} data-testid="worker-excluded-group">
                  <h3 className="type-subtitle">فرصت‌های خارج از شرایط ثبت‌شده</h3>
                  {excluded.map(({ record, reason }) => (
                    <article
                      className={styles.excludedRecord}
                      key={record.id}
                      data-testid="worker-excluded-opportunity"
                    >
                      <p className="type-body-strong">{record.title}</p>
                      <p className="type-body">{reason}</p>
                      <p className="type-detail">
                        این فرصت در فهرست واجد شرایط‌ها نیست؛ دلیل فوق از ارزیابی همین فرصت آمده
                        است.
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>
            <section
              className={`${shared.section} ${styles.contentSection} ${styles.workSection}`}
              aria-labelledby="work-heading"
              data-testid="worker-my-work"
            >
              <h2 id="work-heading" className="type-title">
                کارهای من
              </h2>
              {offered.length === 0 ? (
                <p className="type-body" data-testid="worker-work-empty">
                  هنوز همکاری یا دعوتی برای این کارگر در این زبانه ثبت نشده است.
                </p>
              ) : (
                offered.map((item) => (
                  <article
                    className={styles.offerRecord}
                    key={item.id}
                    data-testid="worker-offered-work"
                  >
                    <p className="type-body-strong">
                      دعوت به همکاری · <Latin>Offered</Latin>
                    </p>
                    <p className="type-body">
                      این دعوت ثبت شده ولی پذیرفته نشده است. هیچ پیامکی ارسال نشده است.{' '}
                      <TruthChip level="MOCK" href="/truth#truth-row-16" />
                    </p>
                    <Link href="/outbox" className={styles.action}>
                      دیدن پیام دعوت
                    </Link>
                  </article>
                ))
              )}
              <p className={`${styles.plannedNote} type-detail`}>
                پذیرش، حضور در کار و سابقهٔ تکمیل‌شده هنوز در این برش ساخته نشده‌اند —{' '}
                <Latin>PLANNED</Latin>.
              </p>
            </section>
          </>
        )}
      </main>
      {workerRole ? (
        <nav className={styles.bottomNav} aria-label="پیمایش کارگر" data-testid="worker-navigation">
          <Link href="/worker" aria-current="page" className={styles.navItem}>
            کار
          </Link>
          <span className={styles.navPlanned}>
            کارنامه · <Latin>PLANNED</Latin>
          </span>
          <Link href="/outbox" className={styles.navItem}>
            پیام‌ها · <Latin>MOCK</Latin>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
