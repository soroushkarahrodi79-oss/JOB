// The typed mapping between domain states and the design vocabulary.
//
// state = family x semantic role x form (docs/design/state-vocabulary.md). This module encodes
// that mapping so it is a single system, not per-status styling: every state resolves to a role
// (which decides colour), a mark (a glyph), and a Persian label (its own words) or, for payment,
// party-dependent prose owned by payment.md.
//
// CANONICAL SOURCES: labels/roles/marks are transcribed from docs/design/state-vocabulary.md;
// payment wordings are payment.md's; the state SETS come from packages/domain (which mirror
// docs/domain/state-transitions.md). vocabulary.test.ts enforces that EVERY domain lifecycle
// state, plus eligibility/availability/provenance, has exactly one entry here and no extra
// entry exists (GATE 1.5 exit criterion 5). A drift in any of those documents fails that test.

import type { SemanticRole } from '@platform/tokens';

export type StateRole = SemanticRole | 'verification' | 'truth';

// The form dimension of state-vocabulary.md. Default is inline; chip only where a state must
// survive being scanned in a list; banner at most once per screen.
export type Form = 'inline' | 'marker' | 'chip' | 'banner';

// The bounded mark set. Glyph artwork is GATE 4 iconography; these identifiers keep the mapping
// systematic (family/role decides the mark; there is no per-status invention).
export type MarkId =
  | 'check-filled'
  | 'check-half'
  | 'rule'
  | 'window-filled'
  | 'window-open'
  | 'provenance-self'
  | 'provenance-verified'
  | 'provenance-observed'
  | 'provenance-derived'
  | 'record'
  | 'waiting'
  | 'alert'
  | 'caveat'
  | 'dash'
  | 'case';

// A role that follows whose behaviour the state describes, while the label stays identical
// (state-vocabulary.md: "the label follows the fact; the role follows whose behaviour it is").
export interface ActorDependentRole {
  readonly describes: 'employer' | 'worker';
  readonly onActorRecord: StateRole;
  readonly onCounterpartyRecord: StateRole;
}

export interface VisualState {
  /** The state's own Persian words, or null where the canon renders it as party-dependent prose. */
  readonly label: string | null;
  readonly labelSource: string;
  readonly role: StateRole | ActorDependentRole;
  readonly mark: MarkId;
  readonly form: Form;
  /** Carries the SIMULATED truth chip (a port-produced claim). */
  readonly simulated?: true;
  /** A required, permanent annotation the fact cannot be shown without. */
  readonly annotation?: string;
}

/** A state the canon deliberately does not render (state-vocabulary.md Preferred Crew "Removed"). */
export interface NotRendered {
  readonly notRendered: true;
  readonly labelSource: string;
}

export type Rendering = VisualState | NotRendered;

const VOCAB = 'state-vocabulary.md';
const PAYMENT = 'payment.md (party-dependent sentence)';

export const RENDERINGS = {
  eligibility: {
    Eligible: {
      label: 'واجد شرایط',
      labelSource: VOCAB,
      role: 'positive',
      mark: 'check-filled',
      form: 'inline',
    },
    Conditional: {
      label: 'مشروط',
      labelSource: VOCAB,
      role: 'attention',
      mark: 'check-half',
      form: 'inline',
    },
    NotEligible: {
      label: 'واجد شرایط نیست',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'rule',
      form: 'inline',
    },
  },
  availability: {
    Available: {
      label: 'در دسترس',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'window-filled',
      form: 'inline',
    },
    Unavailable: {
      label: 'در دسترس نیست',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'window-open',
      form: 'inline',
    },
  },
  provenance: {
    SelfDeclared: {
      label: 'خوداظهار',
      labelSource: VOCAB,
      role: 'verification',
      mark: 'provenance-self',
      form: 'marker',
    },
    VerifiedSimulated: {
      label: 'تأیید‌شده — شبیه‌سازی‌شده',
      labelSource: VOCAB,
      role: 'verification',
      mark: 'provenance-verified',
      form: 'marker',
      simulated: true,
    },
    Observed: {
      label: 'ثبت‌شده',
      labelSource: VOCAB,
      role: 'verification',
      mark: 'provenance-observed',
      form: 'marker',
    },
    Derived: {
      label: 'محاسبه‌شده',
      labelSource: VOCAB,
      role: 'verification',
      mark: 'provenance-derived',
      form: 'marker',
    },
  },
  opportunity: {
    Draft: { label: 'پیش‌نویس', labelSource: VOCAB, role: 'neutral', mark: 'dash', form: 'inline' },
    Published: {
      label: 'منتشر شد',
      labelSource: VOCAB,
      role: 'info',
      mark: 'record',
      form: 'inline',
    },
    Filled: {
      label: 'همهٔ جایگاه‌ها پر شد',
      labelSource: VOCAB,
      role: 'positive',
      mark: 'check-filled',
      form: 'inline',
    },
    Expired: {
      label: 'بدون پر شدن منقضی شد',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'dash',
      form: 'inline',
    },
    Cancelled: {
      label: 'لغو شد',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'dash',
      form: 'inline',
    },
    Closed: { label: 'بسته شد', labelSource: VOCAB, role: 'neutral', mark: 'dash', form: 'inline' },
  },
  engagement: {
    Offered: {
      label: 'دعوت‌شده',
      labelSource: VOCAB,
      role: 'attention',
      mark: 'waiting',
      form: 'inline',
    },
    Accepted: {
      label: 'پذیرفته‌شده',
      labelSource: VOCAB,
      role: 'info',
      mark: 'record',
      form: 'inline',
    },
    InProgress: {
      label: 'در حال انجام',
      labelSource: VOCAB,
      role: 'info',
      mark: 'record',
      form: 'inline',
    },
    Completed: {
      label: 'انجام‌شده',
      labelSource: VOCAB,
      role: 'positive',
      mark: 'check-filled',
      form: 'inline',
    },
    Settled: {
      label: 'تسویه‌شده',
      labelSource: VOCAB,
      role: 'positive',
      mark: 'check-filled',
      form: 'inline',
    },
    Declined: {
      label: 'پیشنهاد رد شد',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'dash',
      form: 'inline',
      annotation: 'رد کردن پیشنهاد نشانهٔ بی‌اعتمادی نیست',
    },
    Expired: {
      label: 'مهلت پاسخ گذشت',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'dash',
      form: 'inline',
      annotation: 'رد کردن پیشنهاد نشانهٔ بی‌اعتمادی نیست',
    },
    Cancelled: {
      label: 'لغو شد',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'dash',
      form: 'inline',
    },
    Disputed: {
      label: 'پرونده باز است',
      labelSource: VOCAB,
      role: 'attention',
      mark: 'case',
      form: 'inline',
    },
  },
  proof: {
    Awaited: {
      label: 'در انتظار گزارش پایان کار',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'waiting',
      form: 'inline',
    },
    Submitted: {
      label: 'گزارش پایان کار ثبت شد',
      labelSource: VOCAB,
      role: 'attention',
      mark: 'waiting',
      form: 'inline',
    },
    Approved: {
      label: 'کارفرما تأیید کرد',
      labelSource: VOCAB,
      role: 'positive',
      mark: 'check-filled',
      form: 'inline',
    },
    ApprovedByNonResponse: {
      label: 'بدون پاسخ کارفرما تأیید شد',
      labelSource: VOCAB,
      // The role follows whose behaviour it describes; the label does not change.
      role: { describes: 'employer', onActorRecord: 'warning', onCounterpartyRecord: 'neutral' },
      mark: 'caveat',
      form: 'inline',
    },
    Contested: {
      label: 'کارفرما اعتراض کرد',
      labelSource: VOCAB,
      role: 'attention',
      mark: 'alert',
      form: 'inline',
    },
    ResolvedByCase: {
      label: 'با نتیجهٔ پرونده تعیین شد',
      labelSource: VOCAB,
      role: 'info',
      mark: 'record',
      form: 'inline',
    },
    NotRequired: {
      label: 'لازم نیست',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'dash',
      form: 'inline',
    },
  },
  payment: {
    CommitmentRecorded: {
      label: null,
      labelSource: PAYMENT,
      role: 'info',
      mark: 'record',
      form: 'inline',
    },
    AuthorizationSimulated: {
      label: null,
      labelSource: PAYMENT,
      role: 'info',
      mark: 'record',
      form: 'inline',
      simulated: true,
    },
    ReleaseAuthorized: {
      label: null,
      labelSource: PAYMENT,
      role: 'info',
      mark: 'record',
      form: 'inline',
    },
    SettlementReported: {
      label: null,
      labelSource: PAYMENT,
      role: 'info',
      mark: 'record',
      form: 'inline',
      simulated: true,
    },
    SettlementFailed: {
      label: null,
      labelSource: PAYMENT,
      role: 'critical',
      mark: 'alert',
      form: 'inline',
      simulated: true,
    },
    ReceiptAcknowledged: {
      label: null,
      labelSource: PAYMENT,
      role: 'positive',
      mark: 'check-filled',
      form: 'inline',
    },
  },
  dispute: {
    Opened: {
      label: 'پرونده باز شد',
      labelSource: VOCAB,
      role: 'attention',
      mark: 'case',
      form: 'inline',
    },
    UnderReview: {
      label: 'در حال بررسی',
      labelSource: VOCAB,
      role: 'attention',
      mark: 'case',
      form: 'inline',
    },
    OutcomeRecorded: {
      label: 'نتیجه ثبت شد',
      labelSource: VOCAB,
      role: 'info',
      mark: 'record',
      form: 'inline',
    },
    Closed: { label: 'بسته شد', labelSource: VOCAB, role: 'neutral', mark: 'dash', form: 'inline' },
    Withdrawn: {
      label: 'پس گرفته شد',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'dash',
      form: 'inline',
    },
  },
  attestation: {
    Declared: {
      label: 'خوداظهار',
      labelSource: VOCAB,
      role: 'verification',
      mark: 'provenance-self',
      form: 'marker',
    },
    Submitted: {
      label: 'در حال بررسی',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'waiting',
      form: 'inline',
    },
    VerifiedSimulated: {
      label: 'تأیید‌شده — شبیه‌سازی‌شده',
      labelSource: VOCAB,
      role: 'verification',
      mark: 'provenance-verified',
      form: 'marker',
      simulated: true,
    },
    VerificationFailed: {
      label: 'تأیید انجام نشد',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'dash',
      form: 'inline',
    },
    ConfirmedByEmployer: {
      label: 'ثبت‌شده',
      labelSource: VOCAB,
      role: 'verification',
      mark: 'provenance-observed',
      form: 'marker',
    },
  },
  preferredCrew: {
    Marked: {
      label: 'برای دعوت دوباره علامت‌گذاری شده',
      labelSource: VOCAB,
      role: 'neutral',
      mark: 'record',
      form: 'inline',
    },
    Removed: {
      notRendered: true,
      labelSource: `${VOCAB}: removal returns to no marking; there is no "was removed" state`,
    },
  },
} as const satisfies Record<string, Record<string, Rendering>>;

export type Family = keyof typeof RENDERINGS;

export function isNotRendered(r: Rendering): r is NotRendered {
  return 'notRendered' in r && r.notRendered === true;
}

export function resolveRole(
  role: StateRole | ActorDependentRole,
  viewer: 'actor' | 'counterparty' = 'actor',
): StateRole {
  if (typeof role === 'string') return role;
  return viewer === 'actor' ? role.onActorRecord : role.onCounterpartyRecord;
}
