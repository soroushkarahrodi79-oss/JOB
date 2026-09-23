'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  candidateList,
  engagementsForOpportunity,
  opportunityById,
  provenanceOfStrength,
  type CandidateOpportunity,
  type ExcludedCandidate,
  type OrderingSignal,
  type RankedCandidate,
} from '@platform/application';
import {
  generateSyntheticDemoWorld,
  type EligibilityReason,
  type ProvenanceLevel,
} from '@platform/domain';
import {
  EvidenceRow,
  StateMark,
  TruthChip,
  formatAmountWithBasis,
  formatJalali,
  formatTimeWindow,
  toPersianDigits,
} from '@platform/ui';
import { useDemoSession } from '../../../../demo/session';
import { Latin } from '../../../../Latin';
import employer from '../../../employer.module.css';
import styles from './candidates.module.css';

// E-04 — Candidate List. Beats B6, B7, B8 (docs/product/screen-inventory.md).
//
// THE MATCHING DEMONSTRATION. One claim: the system can state, in the employer's language, why any
// given worker was or was not a candidate (charter success criterion 2). Everything here serves it.
//
// The pipeline lives in the application layer (`candidateList`); this screen only renders its
// result. What it must make visible, and does:
//   · the eligible set in a deterministic, explained order, each with the reason it qualified and
//     the reason for its position;
//   · the excluded set in a SEPARATE, explicitly non-ranked group, each with the ONE unmet
//     requirement or hard constraint — never a dossier;
//   · that solid rails (stages 1–3) are hard filters and dotted rails (stages 4–7) only order,
//     which is domain invariant 4 made visible;
//   · every reason with the provenance of the fact it names — a self-declared card and a verified
//     one are never rendered identically.
//
// No composite score, percentage, star, tier or "AI match" appears anywhere, and pay is not a
// ranking factor (matching.md). Distance is fixed synthetic demo geography, labelled SIMULATED at
// the point of use (truth-matrix row 8). Invitation creates a real Offered engagement and records a
// MOCK notification; it never claims delivery or acceptance (truth-matrix row 16).

const PROVENANCE_LABEL: Record<ProvenanceLevel, string> = {
  SelfDeclared: 'خوداظهار',
  VerifiedSimulated: 'تأیید‌شده — شبیه‌سازی‌شده',
  Observed: 'ثبت‌شده',
  Derived: 'محاسبه‌شده',
};

const STAGE_LABEL = {
  SkillFit: 'تناسب مهارت',
  Reliability: 'قابلیت اتکا',
  PriorRelationship: 'سابقهٔ همکاری با شما',
  Preferences: 'ترجیح‌ها',
} as const;

function DistanceChip({ km }: { km: number | undefined }) {
  if (km === undefined) {
    return <span className="type-detail">مسافت ثبت نشده</span>;
  }
  return (
    <span className="type-detail">
      <span className="type-numeric">{toPersianDigits(String(km))} کیلومتر</span>{' '}
      <TruthChip level="SIMULATED" href="/truth#truth-row-8" />
    </span>
  );
}

/** One eligibility requirement, marked, with the provenance of the attestation that satisfies it. */
function EligibilityReasonRow({ reason }: { reason: EligibilityReason }) {
  const attestation = reason.attestation;
  if (reason.status === 'Met' && attestation !== undefined) {
    const provenance = provenanceOfStrength(attestation.strength);
    const date = formatJalali(new Date(attestation.recordedAt));
    if (provenance === 'VerifiedSimulated') {
      return (
        <EvidenceRow
          provenance="VerifiedSimulated"
          truth="SIMULATED"
          truthHref="/truth#truth-row-3"
          detail={`${PROVENANCE_LABEL.VerifiedSimulated} · ${date}`}
        >
          <p className="type-body">{reason.requirementLabel}</p>
        </EvidenceRow>
      );
    }
    return (
      <EvidenceRow provenance={provenance} detail={PROVENANCE_LABEL[provenance]}>
        <p className="type-body">{reason.requirementLabel}</p>
      </EvidenceRow>
    );
  }
  // Unmet or unknown: the absence carries no provenance mark — a mark never sits on an absence.
  return (
    <p className="type-body">
      {reason.requirementLabel} —{' '}
      <span className="type-body-strong">
        {reason.status === 'Unmet' ? 'برآورده نشده' : 'ثبت نشده'}
      </span>
    </p>
  );
}

/** A rung of the explanation ladder. `kind` decides the rail: solid filters, dotted orders. */
function Rung({
  kind,
  stage,
  children,
}: {
  kind: 'filter' | 'ordering';
  stage: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.rung} ${kind === 'filter' ? styles.filter : styles.ordering}`}>
      <span className={`type-label ${styles.rungStage}`}>{stage}</span>
      {children}
    </div>
  );
}

function OrderingRungBody({ signal }: { signal: OrderingSignal }) {
  if (signal.stage === 'SkillFit') {
    if (!signal.acted || signal.skillFit === undefined || signal.skillFit.length === 0) {
      return <p className="type-body">مهارت مرتبط دیگری ثبت نشده است.</p>;
    }
    return (
      <p className="type-body">
        مهارت‌های مرتبط:{' '}
        {signal.skillFit
          .map((fact) => `${fact.label} (${PROVENANCE_LABEL[fact.provenance]})`)
          .join(' · ')}
      </p>
    );
  }
  if (signal.stage === 'Reliability') {
    const r = signal.reliability;
    if (!signal.acted || r === undefined || r.completed === 0) {
      // No history is not a penalty (scenario S2). It is stated as a neutral fact.
      return <p className="type-body">هنوز سابقهٔ ثبت‌شده‌ای ندارد. این نکتهٔ منفی نیست.</p>;
    }
    return (
      <p className="type-body type-numeric">
        {toPersianDigits(
          `${String(r.completed)} همکاری کامل‌شده · ${String(r.onTimeArrivals)} ورود به‌موقع` +
            (r.cancellations > 0 ? ` · ${String(r.cancellations)} لغو` : ''),
        )}
      </p>
    );
  }
  if (signal.stage === 'PriorRelationship') {
    const p = signal.priorRelationship;
    if (!signal.acted || p === undefined) {
      return <p className="type-body">هنوز با شما همکاری‌ای نداشته است.</p>;
    }
    return (
      <p className="type-body type-numeric">
        {toPersianDigits(`${String(p.completedWithEmployer)} همکاری کامل‌شده با شما`)}
        {p.preferredCrew ? ' · برای دعوت دوباره علامت‌گذاری شده' : ''}
      </p>
    );
  }
  return <p className="type-body">ترجیح نرمی ثبت نشده است.</p>;
}

function headline(candidate: RankedCandidate): string {
  switch (candidate.topOrderingStage) {
    case 'PriorRelationship':
      return 'جلوتر به‌دلیل سابقهٔ همکاری با شما';
    case 'Reliability': {
      const completed =
        candidate.ordering.find((s) => s.stage === 'Reliability')?.reliability?.completed ?? 0;
      return toPersianDigits(`جلوتر به‌دلیل قابلیت اتکا — ${String(completed)} همکاری کامل‌شده`);
    }
    case 'SkillFit':
      return 'جلوتر به‌دلیل تناسب مهارت با این کار';
    case null:
    default:
      return 'واجد شرایط بر پایهٔ شرط‌ها؛ هنوز سابقهٔ ثبت‌شده‌ای ندارد.';
  }
}

function RankedRow({
  candidate,
  invited,
  canInvite,
  onInvite,
}: {
  candidate: RankedCandidate;
  invited: boolean;
  canInvite: boolean;
  onInvite: () => void;
}) {
  return (
    <article className={styles.candidate} data-testid={`candidate-${candidate.workerId}`}>
      <div className={styles.margin}>
        <span className={`type-numeric ${styles.rank}`}>
          {toPersianDigits(String(candidate.rank))}
        </span>
        <StateMark family="eligibility" state="Eligible" />
      </div>
      <div className={styles.body}>
        <div className={styles.nameRow}>
          <h3 className="type-subtitle">{candidate.name}</h3>
        </div>
        <p className={`type-detail ${styles.where}`}>
          <span>{candidate.neighbourhood}</span>
          <DistanceChip km={candidate.distanceKilometres} />
        </p>

        {/* Always visible: the eligibility state (marker above) plus one ordering sentence. */}
        <p
          className={`type-body ${styles.headline}`}
          data-testid={`headline-${candidate.workerId}`}
        >
          {headline(candidate)}
        </p>

        {/* The full ladder. Closed state states the headline fact; nothing decision-critical hides. */}
        <details className={styles.ladder}>
          <summary className={`type-label ${styles.ladderSummary}`}>چرا این نتیجه؟</summary>
          <div className={styles.rungs} data-testid={`ladder-${candidate.workerId}`}>
            <Rung kind="filter" stage="۱ · واجد شرایط بودن">
              {candidate.eligibility.reasons.map((reason) => (
                <EligibilityReasonRow key={reason.requirementId} reason={reason} />
              ))}
            </Rung>
            <Rung kind="filter" stage="۲ · در دسترس بودن">
              {candidate.availability.kind === 'Covers' ? (
                <EvidenceRow provenance="SelfDeclared" detail={PROVENANCE_LABEL.SelfDeclared}>
                  <p className="type-body">در بازهٔ زمانی این شیفت در دسترس است.</p>
                </EvidenceRow>
              ) : (
                <p className="type-body">
                  در دسترس‌بودن ثبت نشده است — نامشخص، نه «در دسترس نیست».
                </p>
              )}
            </Rung>
            <Rung kind="filter" stage="۳ · مکان">
              {candidate.location.kind === 'NoBoundary' ? (
                <p className="type-body">
                  محدودهٔ مسافتی تعیین نکرده‌اید؛ مسافت فقط بر ترتیب اثر می‌گذارد.
                </p>
              ) : candidate.location.kind === 'Within' ? (
                <p className="type-body">
                  درون محدودهٔ مسافت شماست. <DistanceChip km={candidate.distanceKilometres} />
                </p>
              ) : (
                <p className="type-body">مسافت ثبت نشده است — نامشخص.</p>
              )}
            </Rung>
            {candidate.ordering.map((signal) => (
              <Rung key={signal.stage} kind="ordering" stage={STAGE_LABEL[signal.stage]}>
                <OrderingRungBody signal={signal} />
              </Rung>
            ))}
          </div>
        </details>

        {canInvite ? (
          <div className={styles.inviteRow}>
            {invited ? (
              <>
                <StateMark family="engagement" state="Offered" />
                <span
                  className={`type-detail ${styles.mockNote}`}
                  data-testid={`invited-${candidate.workerId}`}
                >
                  دعوت ثبت شد؛ هیچ پیامی از سامانه خارج نمی‌شود{' '}
                  <TruthChip level="MOCK" href="/truth#truth-row-16" />
                </span>
              </>
            ) : (
              <button
                type="button"
                className={`type-body-strong ${employer.primaryButton}`}
                onClick={onInvite}
                data-testid={`invite-${candidate.workerId}`}
              >
                دعوت
              </button>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function exclusionText(candidate: ExcludedCandidate): {
  reason: React.ReactNode;
  passed: string | null;
} {
  if (candidate.stage === 'Eligibility') {
    const unmet = candidate.unmetRequirement;
    return {
      reason: (
        <>
          <p className="type-body-strong">{unmet?.requirementLabel ?? 'یک شرط'}</p>
          <p className="type-body">
            {unmet?.status === 'Unmet' ? 'برآورده نشده است.' : 'ثبت نشده است.'} با ثبت این شرط،
            دوباره واجد شرایط می‌شود.
          </p>
        </>
      ),
      passed: null,
    };
  }
  if (candidate.stage === 'Availability') {
    return {
      reason: (
        <>
          <p className="type-body-strong">در بازهٔ زمانی این شیفت در دسترس نیست</p>
          <p className="type-body">
            بر پایهٔ در دسترس‌بودنی که خودش ثبت کرده است، نه نبودِ اطلاعات.
          </p>
        </>
      ),
      passed: 'واجد همهٔ شرط‌هاست.',
    };
  }
  const km = candidate.distanceKilometres;
  return {
    reason: (
      <>
        <p className="type-body-strong">خارج از محدودهٔ مسافت شماست</p>
        <p className="type-body">
          {km === undefined ? 'مسافت ثبت‌شده فراتر از محدوده است.' : ''}
          <span className="type-numeric">
            {km === undefined ? '' : toPersianDigits(`${String(km)} کیلومتر`)}
          </span>{' '}
          <TruthChip level="SIMULATED" href="/truth#truth-row-8" />
        </p>
      </>
    ),
    passed: 'واجد همهٔ شرط‌ها و در بازهٔ شیفت در دسترس است.',
  };
}

function ExcludedRow({ candidate }: { candidate: ExcludedCandidate }) {
  const { reason, passed } = exclusionText(candidate);
  return (
    <article className={styles.excluded} data-testid={`excluded-${candidate.workerId}`}>
      <div className={styles.margin}>
        <StateMark family="eligibility" state="NotEligible" />
      </div>
      <div className={styles.body}>
        <div className={styles.nameRow}>
          <h3 className="type-subtitle">{candidate.name}</h3>
          <span className={`type-detail ${styles.where}`}>{candidate.neighbourhood}</span>
        </div>
        <div
          className={styles.excludedReason}
          data-testid={`exclusion-reason-${candidate.workerId}`}
        >
          {reason}
        </div>
        {passed !== null ? <p className={`type-detail ${styles.passed}`}>{passed}</p> : null}
      </div>
    </article>
  );
}

export default function CandidateListPage() {
  const params = useParams<{ opportunityId: string }>();
  const opportunityId = params.opportunityId;
  const { session, restored, invite } = useDemoSession();

  if (!restored) {
    return (
      <div className={employer.page}>
        <h1 className="type-display">نامزدها</h1>
        <p className="type-body" data-testid="candidates-loading">
          در حال خواندن وضعیت نمایش…
        </p>
      </div>
    );
  }

  const record = opportunityById(session, opportunityId);
  if (record === undefined || record.lifecycle.state === 'Draft') {
    return (
      <div className={employer.page}>
        <h1 className="type-display">نامزدها</h1>
        <p className="type-body" data-testid="candidates-unavailable">
          این فهرست دربارهٔ فرصتی است که منتشر شده باشد. هنوز فرصت منتشرشده‌ای با این نشانی در این
          نمایش نیست.
        </p>
        <Link className={`type-body-strong ${employer.primaryAction}`} href="/employer">
          بازگشت به کارها
        </Link>
      </div>
    );
  }

  const world = generateSyntheticDemoWorld();
  const opportunity: CandidateOpportunity = {
    id: record.id,
    employerId: record.employerId,
    terms: record.terms,
    requirements: record.requirements,
  };
  const model = candidateList(world, opportunity);
  const invitedIds = new Set(
    engagementsForOpportunity(session, record.id).map((engagement) => engagement.workerId),
  );
  const canInvite = record.terms.acceptanceMode === 'InviteOnly';

  const start = new Date(record.terms.workStartsAt);
  const end = new Date(record.terms.workEndsAt);

  return (
    <div className={employer.page} data-testid="candidate-list">
      <header className={employer.header}>
        <h1 className="type-display">نامزدها</h1>
        <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
          چه کسی واجد شرایط است و چرا، و چه کسی کنار گذاشته شده و به چه دلیل مشخص. هیچ امتیاز، درصد
          یا ستاره‌ای در کار نیست.
        </p>
      </header>

      {/* The opportunity this list is about — its actual published terms. */}
      <section className={employer.section} aria-labelledby="opp-heading">
        <div className={employer.workItem} data-testid="opportunity-header">
          <div className={employer.workItemHead}>
            <h2 id="opp-heading" className="type-title">
              {record.title}
            </h2>
            <StateMark family="opportunity" state={record.lifecycle.state} />
          </div>
          <dl className={employer.factGrid}>
            <div>
              <dt className="type-label">زمان</dt>
              <dd className="type-body">
                {formatJalali(start)}
                <br />
                <span className="type-numeric">{formatTimeWindow(start, end)}</span>
              </dd>
            </div>
            <div>
              <dt className="type-label">دستمزد</dt>
              <dd className="type-body type-numeric">
                {formatAmountWithBasis(record.terms.amount, record.terms.payBasis)}
              </dd>
            </div>
            <div>
              <dt className="type-label">محل کار</dt>
              <dd className="type-body">{record.terms.location.neighbourhood}</dd>
            </div>
            <div>
              <dt className="type-label">محدودهٔ مسافت</dt>
              <dd className="type-body" data-testid="opp-boundary">
                {record.terms.travelBoundary === undefined ? (
                  'بدون محدودیت'
                ) : (
                  <>
                    <span className="type-numeric">
                      {toPersianDigits(
                        `تا ${String(record.terms.travelBoundary.maxKilometres)} کیلومتر`,
                      )}
                    </span>{' '}
                    <TruthChip level="SIMULATED" href="/truth#truth-row-8" />
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── Eligible, ranked ────────────────────────────────────────────────────────────── */}
      <section className={employer.section} aria-labelledby="eligible-heading">
        <h2 id="eligible-heading" className="type-title">
          واجد شرایط{' '}
          <span className={`type-body ${styles.count}`} data-testid="eligible-count">
            ({toPersianDigits(String(model.ranked.length))} نفر، به ترتیب)
          </span>
        </h2>
        {model.ranked.length === 0 ? (
          <div className={styles.emptyState} data-testid="empty-eligible">
            <p className="type-body-strong">هیچ نامزد واجد شرایطی نیست.</p>
            {model.emptyReason !== undefined ? (
              <p className="type-body">
                {toPersianDigits(
                  `بیشترین کنارگذاری به‌دلیل «${model.emptyReason.requirementLabel}» بود — ${String(model.emptyReason.count)} نفر.`,
                )}
              </p>
            ) : null}
          </div>
        ) : (
          model.ranked.map((candidate) => (
            <RankedRow
              key={candidate.workerId}
              candidate={candidate}
              invited={invitedIds.has(candidate.workerId)}
              canInvite={canInvite}
              onInvite={() => {
                invite(record.id, candidate.workerId);
              }}
            />
          ))
        )}
      </section>

      {/* ── Excluded, explicitly NOT ranked ─────────────────────────────────────────────── */}
      {model.excluded.length > 0 ? (
        <section className={employer.section} aria-labelledby="excluded-heading">
          <h2 id="excluded-heading" className="type-title">
            کنار گذاشته‌شده‌ها{' '}
            <span className={`type-body ${styles.count}`}>
              ({toPersianDigits(String(model.excluded.length))} نفر)
            </span>
          </h2>
          <p className={`type-body ${styles.excludedIntro}`} data-testid="excluded-nonranked">
            این فهرست رتبه‌بندی نشده است. هر نفر با یک دلیلِ مشخص کنار گذاشته شده، نه با مقایسه یا
            امتیاز. کسی که واجد نیست، کم‌ارزش‌تر نیست — فقط شرطی را ندارد.
          </p>
          <div data-testid="excluded-group">
            {model.excluded.map((candidate) => (
              <ExcludedRow key={candidate.workerId} candidate={candidate} />
            ))}
          </div>
        </section>
      ) : null}

      {/* SH-03, the outbox that would show sent invitations, is not built in this slice. */}
      {canInvite ? (
        <section className={employer.section}>
          <p
            className="type-detail"
            style={{ color: 'var(--color-fg-muted)' }}
            data-testid="outbox-planned"
          >
            دعوت‌ها یک همکاری «دعوت‌شده» می‌سازند، اما صندوق پیام‌های خروجی (<Latin>SH-03</Latin>)
            هنوز ساخته نشده است —{' '}
            <span className="type-body-strong">
              برنامه‌ریزی‌شده (<Latin>PLANNED</Latin>)
            </span>
            . هیچ پیامی واقعاً ارسال نمی‌شود.
          </p>
        </section>
      ) : null}
    </div>
  );
}
