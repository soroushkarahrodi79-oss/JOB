import { rial } from './money';
import type { EngagementRecord } from './projections';
import type { AdministrativeLocation, EligibilityRequirement, PayBasis, Worker } from './core';
import type { Money } from './money';

/**
 * An opportunity the demo walkthrough **creates**, with the canonical terms it is created from.
 *
 * It is a plan, not a record. docs/product/demo-scenarios.md has `EMP-01` create `OPP-01` at beat
 * B1 and `OPP-02` at beat B12, so neither exists when the walkthrough starts: seeding them and
 * then letting the employer "create" one would make the creation flow an illustration of itself,
 * and would leave two candidates for the single featured transaction every later story runs
 * through. Holding the terms here rather than in a screen is what keeps the opportunity the
 * employer creates identical to the one the candidate list, both engagements and the rehire effect
 * later refer to — one shared world, not a fixture per screen.
 */
export interface PlannedOpportunity {
  readonly id: string;
  readonly employerId: string;
  /** The beat that creates it (docs/product/demo-scenarios.md Story B). */
  readonly createdAtBeat: 'B1' | 'B12';
  /** The employer's own words for the work. Never a category label. */
  readonly title: string;
  readonly acceptanceMode: 'InviteOnly' | 'OpenAcceptance';
  readonly amount: Money;
  /** What the amount prices. Never inferred from the figure — see PayBasis. */
  readonly payBasis: PayBasis;
  /** UTC instants. Jalali is presentation only (data-model.md). */
  readonly workStartsAt: string;
  readonly workEndsAt: string;
  readonly location: AdministrativeLocation;
  readonly headcount: number;
  /** Concrete, evaluable conditions only — each maps to an attestation criterion workers carry. */
  readonly requirements: readonly EligibilityRequirement[];
}

export interface SyntheticDemoWorld {
  readonly seed: 'GATE3-DEMO-2026-09-09';
  readonly workers: readonly Worker[];
  /** Opportunities the walkthrough creates. None of them exists at the start — see the type. */
  readonly plannedOpportunities: readonly PlannedOpportunity[];
  readonly engagementRecords: readonly EngagementRecord[];
  /** Fixed synthetic, symmetric distance values — never coordinates or real travel time. */
  readonly distanceKilometres: Readonly<Record<string, number>>;
}

const DEMO_SEED = 'GATE3-DEMO-2026-09-09' as const;
const NEIGHBOURHOODS = [
  'Demo-North',
  'Demo-East',
  'Demo-Centre',
  'Demo-West',
  'Demo-South',
  'Demo-River',
] as const;

function demoWorker(index: number): Worker {
  const id = `WKR-DEMO-${index.toString().padStart(2, '0')}`;
  const certificateState = index === 3 ? 'Unknown' : 'Satisfied';
  return {
    id,
    location: {
      city: 'Tehran',
      neighbourhood: NEIGHBOURHOODS[(index - 1) % NEIGHBOURHOODS.length] ?? 'Demo-Centre',
    },
    verification: index === 1 ? 'Unverified' : 'VerifiedSimulated',
    attestations: [
      {
        criterionId: 'cafe-service',
        state: 'Satisfied',
        strength: 'SelfDeclared',
        recordedAt: '2026-09-01T08:00:00Z',
      },
      {
        criterionId: 'food-handling-certificate',
        state: certificateState,
        strength: 'SelfDeclared',
        recordedAt: '2026-09-01T08:00:00Z',
      },
    ],
  };
}

/**
 * The demo's fixed "today" (demo-dataset.md generation rule 7: dates are generated against a demo
 * today, in the Iranian calendar, with Friday as the weekend day). UTC instant; Jalali is
 * presentation only. 2026-09-22 is سه‌شنبه ۳۱ شهریور ۱۴۰۵.
 */
export const DEMO_NOW = '2026-09-22T06:00:00.000Z';

const DEMO_CENTRE = { city: 'Tehran', neighbourhood: 'Demo-Centre' } as const;

/**
 * `OPP-DEMO-01` — the featured transaction, created by `EMP-DEMO-01` at beat B1.
 *
 * demo-dataset.md fixes its shape: two positions, within 24 hours, invite-only, with a certificate
 * requirement that is the exclusion at beat B7. Requirements are attestation-backed criteria, so
 * every one of them is a binary evaluable condition — the `Draft → Published` guard in
 * state-transitions.md. The employer's travel boundary is part of the canonical definition and is
 * NOT modelled here: nothing in the domain can evaluate it yet, and a requirement nothing can
 * evaluate must not become an eligibility gate. It lands with E-04, which is where it is read.
 *
 * The amount is a generator parameter (demo-dataset.md rule 8), carried over from the worked
 * example in design/typography.md and design/components/payment-surface.md. It is a plausible
 * figure for a six-hour café shift, not a validated market rate.
 */
export const FEATURED_OPPORTUNITY_PLAN: PlannedOpportunity = {
  id: 'OPP-DEMO-01',
  employerId: 'EMP-DEMO-01',
  createdAtBeat: 'B1',
  title: 'سرویس و پذیرایی کافه — شیفت عصر',
  acceptanceMode: 'InviteOnly',
  amount: rial(9_800_000),
  payBasis: 'PerShift',
  // چهارشنبه ۱ مهر ۱۴۰۵, 16:00–22:00 Tehran (UTC+03:30). Six hours, inside the 24-hour window.
  workStartsAt: '2026-09-23T12:30:00.000Z',
  workEndsAt: '2026-09-23T18:30:00.000Z',
  location: DEMO_CENTRE,
  headcount: 2,
  requirements: [
    { id: 'cafe-service', label: 'تجربهٔ کار در کافه یا پذیرایی' },
    { id: 'food-handling-certificate', label: 'کارت سلامت معتبر' },
  ],
};

/**
 * `OPP-DEMO-02` — created at beat B12, solely so its candidate list can show the prior
 * relationship `OPP-DEMO-01` left behind. Open acceptance, because both entry paths into
 * `Accepted` have to be demonstrated. Not created by this slice.
 */
export const REHIRE_OPPORTUNITY_PLAN: PlannedOpportunity = {
  id: 'OPP-DEMO-02',
  employerId: 'EMP-DEMO-01',
  createdAtBeat: 'B12',
  title: 'سرویس و پذیرایی کافه — شیفت آخر هفته',
  acceptanceMode: 'OpenAcceptance',
  amount: rial(9_800_000),
  payBasis: 'PerShift',
  // شنبه ۴ مهر ۱۴۰۵, 16:00–22:00 Tehran. Friday is the weekend day and is deliberately skipped.
  workStartsAt: '2026-09-26T12:30:00.000Z',
  workEndsAt: '2026-09-26T18:30:00.000Z',
  location: DEMO_CENTRE,
  headcount: 1,
  requirements: [{ id: 'cafe-service', label: 'تجربهٔ کار در کافه یا پذیرایی' }],
};

/** A generator, not a hand-maintained fixture: fixed input always yields the same synthetic world. */
export function generateSyntheticDemoWorld(): SyntheticDemoWorld {
  const workers = Array.from({ length: 12 }, (_, index) => demoWorker(index + 1));
  const engagementRecords: EngagementRecord[] = Array.from({ length: 30 }, (_, index) => ({
    workerId: `WKR-DEMO-${((index % 12) + 1).toString().padStart(2, '0')}`,
    employerId: `EMP-DEMO-${((index % 4) + 1).toString().padStart(2, '0')}`,
    engagementState: index % 7 === 0 ? 'Cancelled' : index % 5 === 0 ? 'Completed' : 'Settled',
    paymentState: index % 9 === 0 ? 'SettlementFailed' : 'SettlementReported',
    arrivedOnTime: index % 4 !== 0,
    ...(index % 7 === 0
      ? { cancelledBy: index % 2 === 0 ? ('Worker' as const) : ('Employer' as const) }
      : {}),
    ...(index === 8 ? { disputeState: 'Closed' as const } : {}),
  }));
  return {
    seed: DEMO_SEED,
    workers,
    plannedOpportunities: [FEATURED_OPPORTUNITY_PLAN, REHIRE_OPPORTUNITY_PLAN],
    engagementRecords,
    distanceKilometres: {
      'Demo-Centre|Demo-East': 4,
      'Demo-Centre|Demo-North': 7,
      'Demo-Centre|Demo-River': 5,
      'Demo-Centre|Demo-South': 8,
      'Demo-Centre|Demo-West': 6,
    },
  };
}
