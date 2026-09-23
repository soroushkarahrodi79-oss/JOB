import type { DemoOpportunityRecord, DemoSession } from './demo-session';
import { draftOpportunity, publishedOpportunities } from './demo-session';

// E-01's read model.
//
// E-01 answers one question: "what needs my attention now?" navigation.md is explicit that it is a
// QUEUE, not a dashboard — "no KPI row, no charts, no counts strip, and no 'welcome back'" — so
// this model deliberately exposes no totals, no rates and no metrics. It exposes the items
// themselves, and nothing that could be rendered as a number about the employer.
//
// It also reports what is NOT built. The employer's queue is chiefly submitted proof decisions
// (screen-inventory.md E-01), and proof review, engagement monitoring and the trust profile do not
// exist in this slice. Candidate listing and invitation now do (E-04), reached from each published
// opportunity row rather than from this planned list. SH-03 is a working MOCK-message outbox in
// the employer rail and is no longer described here as a planned area. A screen that omitted the
// remaining gaps would read as an employer with a quiet day rather than a product with unbuilt
// screens, which is the difference between an honest empty state and a flattering one.

/** A queue entry. One work item, with the state that makes it an item. */
export interface EmployerQueueItem {
  readonly kind: 'PublishedOpportunity';
  readonly record: DemoOpportunityRecord;
}

/** A part of the employer's day this slice does not build. Rendered as PLANNED, never as a control. */
export interface EmployerPlannedArea {
  /** The screen id, so the ledger and the inventory can be traced from the screen. */
  readonly screenId: 'E-06' | 'E-07' | 'E-08';
  readonly label: string;
  readonly whatItWouldShow: string;
}

export interface EmployerHomeModel {
  readonly employerId: string;
  /** Live items waiting on this employer. Empty until something is waiting; never padded. */
  readonly queue: readonly EmployerQueueItem[];
  /** The creation flow in progress, if the employer left one open. */
  readonly draft: DemoOpportunityRecord | undefined;
  readonly planned: readonly EmployerPlannedArea[];
}

/**
 * The parts of E-01 that are not built.
 *
 * Each one is a screen in screen-inventory.md that E-01 lists as an outgoing transition. Naming
 * them is how the screen stays honest about being a slice: the employer's real queue is proof
 * decisions, and there is no proof in this slice because there are no engagements.
 */
const PLANNED_AREAS: readonly EmployerPlannedArea[] = [
  {
    screenId: 'E-06',
    label: 'پیگیری همکاری در جریان',
    whatItWouldShow: 'وضعیت حضور و ثبت تغییر در شرح یا زمان کار.',
  },
  {
    screenId: 'E-07',
    label: 'بررسی گزارش پایان کار',
    whatItWouldShow: 'گزارش‌های پایان کار که منتظر تأیید یا اعتراض شما هستند.',
  },
  {
    screenId: 'E-08',
    label: 'نمایهٔ اعتماد شما',
    whatItWouldShow: 'سابقهٔ پرداخت، لغو و تغییرات شما — همان چیزی که کارگر دربارهٔ شما می‌بیند.',
  },
];

export function employerHomeModel(session: DemoSession, employerId: string): EmployerHomeModel {
  const draft = draftOpportunity(session);
  return {
    employerId,
    queue: publishedOpportunities(session, employerId).map((record) => ({
      kind: 'PublishedOpportunity' as const,
      record,
    })),
    draft: draft?.employerId === employerId ? draft : undefined,
    planned: PLANNED_AREAS,
  };
}
