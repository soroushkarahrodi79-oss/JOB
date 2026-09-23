import { rial } from './money';
import type { AvailabilityWindow } from './availability';
import type { EngagementRecord } from './projections';
import type { DisputeState, EngagementState, PaymentIntentState } from './states';
import type {
  AdministrativeLocation,
  Attestation,
  AttestationStrength,
  EligibilityRequirement,
  PayBasis,
  TravelBoundary,
  Worker,
} from './core';
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
  /** The employer's travel boundary, where the canonical scenario records one. */
  readonly travelBoundary?: TravelBoundary;
}

/** A Preferred Crew relationship an employer recorded historically. Employer-specific by definition. */
export interface PreferredCrewLink {
  readonly employerId: string;
  readonly workerId: string;
}

export interface SyntheticDemoWorld {
  readonly seed: 'GATE3-DEMO-2026-09-09';
  readonly workers: readonly Worker[];
  /** Synthetic Persian display names, keyed by worker id. Never a real person (policy rule 1). */
  readonly workerNames: Readonly<Record<string, string>>;
  /**
   * Each worker's declared availability windows, keyed by worker id. A worker absent from this map
   * has declared NO availability — which is unknown, not unavailable (availability.ts).
   */
  readonly availabilityByWorker: Readonly<Record<string, readonly AvailabilityWindow[]>>;
  /** Historical Preferred Crew relationships. None is with `EMP-DEMO-01`; that one is created live at B10. */
  readonly preferredCrew: readonly PreferredCrewLink[];
  /** Opportunities the walkthrough creates. None of them exists at the start — see the type. */
  readonly plannedOpportunities: readonly PlannedOpportunity[];
  readonly engagementRecords: readonly EngagementRecord[];
  /** Fixed synthetic, symmetric distance values — never coordinates or real travel time. */
  readonly distanceKilometres: Readonly<Record<string, number>>;
}

const DEMO_SEED = 'GATE3-DEMO-2026-09-09' as const;

/**
 * The demo's fixed "today" (demo-dataset.md generation rule 7: dates are generated against a demo
 * today, in the Iranian calendar, with Friday as the weekend day). UTC instant; Jalali is
 * presentation only. 2026-09-22 is سه‌شنبه ۳۱ شهریور ۱۴۰۵.
 */
export const DEMO_NOW = '2026-09-22T06:00:00.000Z';

const DEMO_CENTRE = { city: 'Tehran', neighbourhood: 'Demo-Centre' } as const;

/**
 * The synthetic distance table (demo-dataset.md "Geography"): a fixed, symmetric set of distances
 * between the workplace neighbourhood and where workers live. It is not real distance or travel
 * time and is labelled `SIMULATED` at every point of use (truth-matrix row 8). Six to eight
 * neighbourhoods, spread so a worker can be plainly near, plainly far, or genuinely borderline —
 * `Demo-Hills` at 16 km is the one that falls outside `OPP-DEMO-01`'s travel boundary.
 */
const DISTANCE_KILOMETRES: Readonly<Record<string, number>> = {
  'Demo-Centre|Demo-East': 4,
  'Demo-Centre|Demo-River': 5,
  'Demo-Centre|Demo-West': 6,
  'Demo-Centre|Demo-North': 7,
  'Demo-Centre|Demo-South': 8,
  'Demo-Centre|Demo-Hills': 16,
};

/** The symmetric key into the distance table, matching `SimulatedGeolocationAdapter`. */
export function distanceKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

const FULL_DAY = (day: string): AvailabilityWindow => ({
  startsAt: `${day}T06:00:00.000Z`,
  endsAt: `${day}T20:00:00.000Z`,
});

/**
 * `OPP-DEMO-01` — the featured transaction, created by `EMP-DEMO-01` at beat B1.
 *
 * demo-dataset.md fixes its shape: two positions, within 24 hours, invite-only, one certificate
 * requirement (the exclusion at beat B7) and **one travel boundary**. Requirements are attestation-
 * backed criteria, so every one of them is a binary evaluable condition — the `Draft → Published`
 * guard in state-transitions.md. The travel boundary was NOT captured in the earlier GATE 4 slice;
 * it is captured here as an explicit, evaluable term (an optional field on the opportunity terms,
 * pre-filled from this plan and editable at E-02) so beat B7's location exclusion of `WKR-05` rests
 * on a recorded boundary rather than a Platform assumption (matching.md stage 3).
 *
 * The amount is a generator parameter (demo-dataset.md rule 8), carried over from the worked example
 * in design/typography.md and design/components/payment-surface.md. It is a plausible figure for a
 * six-hour café shift, not a validated market rate.
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
  // A worker beyond 10 km of the workplace is outside the boundary. `Demo-Hills` (16 km) is; every
  // other demo neighbourhood is within it.
  travelBoundary: { maxKilometres: 10 },
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

const RECORDED_AT = '2026-09-01T08:00:00.000Z';

function skill(id: string, strength: AttestationStrength = 'SelfDeclared'): Attestation {
  return { criterionId: id, state: 'Satisfied', strength, recordedAt: RECORDED_AT };
}

/** A completed, settled, on-time engagement — the ordinary good record. */
function settled(employerId: string): HistoryTemplate {
  return {
    employerId,
    engagementState: 'Settled',
    paymentState: 'SettlementReported',
    arrivedOnTime: true,
  };
}

interface HistoryTemplate {
  readonly employerId: string;
  readonly engagementState: EngagementState;
  readonly paymentState: PaymentIntentState;
  readonly arrivedOnTime: boolean;
  readonly cancelledBy?: 'Worker' | 'Employer';
  readonly disputeState?: DisputeState;
  readonly count?: number;
}

interface WorkerArchetype {
  readonly index: number;
  /** Synthetic Persian name — screened, never a real person (demo-scenarios.md policy rule 1). */
  readonly name: string;
  readonly neighbourhood: string;
  readonly verification: Worker['verification'];
  readonly attestations: readonly Attestation[];
  /** `null` means the worker declared no availability at all — unknown, not unavailable. */
  readonly availability: readonly AvailabilityWindow[] | null;
  readonly history: readonly HistoryTemplate[];
}

const COVERS_WINDOW: readonly AvailabilityWindow[] = [FULL_DAY('2026-09-23')];
// Declared, but the same day only in the morning — it ends (10:00Z) before the shift starts
// (12:30Z). This is a recorded conflict, not missing information: `WKR-04` is unavailable.
const MORNING_ONLY: readonly AvailabilityWindow[] = [
  { startsAt: '2026-09-23T02:00:00.000Z', endsAt: '2026-09-23T10:00:00.000Z' },
];
const BROAD: readonly AvailabilityWindow[] = [
  { startsAt: '2026-09-22T04:00:00.000Z', endsAt: '2026-09-26T20:00:00.000Z' },
];

const CERT = 'food-handling-certificate';
const CAFE = 'cafe-service';

/**
 * The twelve worker archetypes (demo-dataset.md "Workers — 12"), completed to exactly the
 * deterministic facts the E-04 narrative needs and no more. Reputation is NEVER seeded: each
 * archetype carries engagement *events*, and every rate the candidate list shows is derived from
 * them at run time (demo-dataset.md generation rule 2, "Reputation history — Not generated").
 *
 * The five featured workers:
 *   WKR-01 eligible newcomer, thin record — declared skills, unverified, no history.
 *   WKR-02 eligible, established history — the reliability anchor at beat B6.
 *   WKR-03 excluded on the exact missing certificate — capable on every other axis (beat B7).
 *   WKR-04 excluded on availability — a recorded window that does not cover the shift.
 *   WKR-05 excluded on the travel boundary — recorded distance (16 km) beyond `OPP-01`'s 10 km.
 */
const ARCHETYPES: readonly WorkerArchetype[] = [
  {
    index: 1,
    name: 'سارا کریمی',
    neighbourhood: 'Demo-East',
    verification: 'Unverified',
    attestations: [skill(CAFE), skill(CERT)],
    availability: COVERS_WINDOW,
    history: [],
  },
  {
    index: 2,
    name: 'رضا موسوی',
    neighbourhood: 'Demo-North',
    verification: 'VerifiedSimulated',
    attestations: [
      skill(CAFE),
      skill('customer-service'),
      skill('cash-handling'),
      skill(CERT, 'ProviderVerifiedSimulated'),
    ],
    availability: COVERS_WINDOW,
    history: [
      { ...settled('EMP-DEMO-02'), count: 4 },
      { ...settled('EMP-DEMO-03'), count: 2 },
    ],
  },
  {
    index: 3,
    name: 'مینا رستمی',
    neighbourhood: 'Demo-River',
    verification: 'VerifiedSimulated',
    // Capable and well-reviewed on every axis except the one hard requirement she lacks: no health
    // card is recorded, so its criterion is `Unknown` — the exclusion at beat B7.
    attestations: [
      skill(CAFE),
      skill('customer-service'),
      skill('food-preparation'),
      { criterionId: CERT, state: 'Unknown', strength: 'SelfDeclared', recordedAt: RECORDED_AT },
    ],
    availability: COVERS_WINDOW,
    history: [{ ...settled('EMP-DEMO-02'), count: 5 }],
  },
  {
    index: 4,
    name: 'کاوه احمدی',
    neighbourhood: 'Demo-West',
    verification: 'VerifiedSimulated',
    attestations: [skill(CAFE), skill('cash-handling'), skill(CERT, 'ProviderVerifiedSimulated')],
    availability: MORNING_ONLY,
    history: [{ ...settled('EMP-DEMO-02'), count: 4 }],
  },
  {
    index: 5,
    name: 'نگار حسینی',
    neighbourhood: 'Demo-Hills',
    verification: 'VerifiedSimulated',
    attestations: [
      skill(CAFE),
      skill('customer-service'),
      skill(CERT, 'ProviderVerifiedSimulated'),
    ],
    availability: COVERS_WINDOW,
    history: [{ ...settled('EMP-DEMO-03'), count: 4 }],
  },
  {
    index: 6,
    name: 'بهرام نادری',
    neighbourhood: 'Demo-South',
    verification: 'VerifiedSimulated',
    attestations: [skill(CAFE), skill(CERT, 'EmployerConfirmed')],
    availability: COVERS_WINDOW,
    // Preferred Crew of EMP-03 (below). That relationship confers nothing on EMP-01's list.
    history: [{ ...settled('EMP-DEMO-03'), count: 3 }],
  },
  {
    index: 7,
    name: 'الهام صادقی',
    neighbourhood: 'Demo-East',
    verification: 'VerifiedSimulated',
    attestations: [skill(CAFE), skill('event-setup'), skill(CERT, 'ProviderVerifiedSimulated')],
    availability: COVERS_WINDOW,
    history: [
      { ...settled('EMP-DEMO-02'), count: 3 },
      {
        employerId: 'EMP-DEMO-02',
        engagementState: 'Cancelled',
        paymentState: 'SettlementFailed',
        arrivedOnTime: false,
        cancelledBy: 'Worker',
        count: 2,
      },
    ],
  },
  {
    index: 8,
    name: 'یاسمن قاسمی',
    neighbourhood: 'Demo-North',
    verification: 'VerifiedSimulated',
    // Verified identity, every skill self-declared, no history — and no declared availability, so
    // her availability is UNKNOWN. She is not excluded for it; unknown is not unavailable.
    attestations: [skill(CAFE), skill(CERT)],
    availability: null,
    history: [],
  },
  {
    index: 9,
    name: 'پرویز مرادی',
    neighbourhood: 'Demo-River',
    verification: 'VerifiedSimulated',
    attestations: [
      skill(CAFE),
      skill('customer-service'),
      skill(CERT, 'ProviderVerifiedSimulated'),
    ],
    availability: COVERS_WINDOW,
    history: [
      { ...settled('EMP-DEMO-02'), count: 6 },
      // One historical resolved dispute, sitting in the record without acting as a penalty.
      {
        employerId: 'EMP-DEMO-02',
        engagementState: 'Settled',
        paymentState: 'SettlementReported',
        arrivedOnTime: true,
        disputeState: 'Closed',
      },
    ],
  },
  {
    index: 10,
    name: 'شیرین علوی',
    neighbourhood: 'Demo-West',
    verification: 'VerifiedSimulated',
    // Narrow specialist: the required café skill and the certificate, and no other relevant skill.
    attestations: [skill(CAFE), skill(CERT, 'ProviderVerifiedSimulated')],
    availability: COVERS_WINDOW,
    history: [{ ...settled('EMP-DEMO-02'), count: 4 }],
  },
  {
    index: 11,
    name: 'داریوش کاظمی',
    neighbourhood: 'Demo-South',
    verification: 'VerifiedSimulated',
    // Broad availability, thin skills — the opposite trade to the specialist.
    attestations: [skill(CAFE), skill(CERT)],
    availability: BROAD,
    history: [settled('EMP-DEMO-03')],
  },
  {
    index: 12,
    name: 'ندا اسدی',
    neighbourhood: 'Demo-East',
    verification: 'VerifiedSimulated',
    attestations: [skill(CAFE), skill('customer-service'), skill(CERT)],
    availability: COVERS_WINDOW,
    // Declined two recent offers, no cancellations. Declining is legitimate and is not a
    // reliability signal — it never enters the derived metrics as a negative.
    history: [
      {
        employerId: 'EMP-DEMO-03',
        engagementState: 'Declined',
        paymentState: 'CommitmentRecorded',
        arrivedOnTime: false,
        count: 2,
      },
    ],
  },
];

/** Historical Preferred Crew. None is EMP-01 — that relationship is created live at beat B10. */
const PREFERRED_CREW: readonly PreferredCrewLink[] = [
  { employerId: 'EMP-DEMO-02', workerId: 'WKR-DEMO-04' },
  { employerId: 'EMP-DEMO-02', workerId: 'WKR-DEMO-07' },
  { employerId: 'EMP-DEMO-03', workerId: 'WKR-DEMO-06' },
];

function workerId(index: number): string {
  return `WKR-DEMO-${index.toString().padStart(2, '0')}`;
}

function expandHistory(id: string, templates: readonly HistoryTemplate[]): EngagementRecord[] {
  const records: EngagementRecord[] = [];
  for (const template of templates) {
    const times = template.count ?? 1;
    for (let n = 0; n < times; n += 1) {
      records.push({
        workerId: id,
        employerId: template.employerId,
        engagementState: template.engagementState,
        paymentState: template.paymentState,
        arrivedOnTime: template.arrivedOnTime,
        ...(template.cancelledBy === undefined ? {} : { cancelledBy: template.cancelledBy }),
        ...(template.disputeState === undefined ? {} : { disputeState: template.disputeState }),
      });
    }
  }
  return records;
}

/** A generator, not a hand-maintained fixture: fixed input always yields the same synthetic world. */
export function generateSyntheticDemoWorld(): SyntheticDemoWorld {
  const workers: Worker[] = [];
  const workerNames: Record<string, string> = {};
  const availabilityByWorker: Record<string, readonly AvailabilityWindow[]> = {};
  const engagementRecords: EngagementRecord[] = [];

  for (const archetype of ARCHETYPES) {
    const id = workerId(archetype.index);
    workers.push({
      id,
      location: { city: 'Tehran', neighbourhood: archetype.neighbourhood },
      verification: archetype.verification,
      attestations: archetype.attestations,
    });
    workerNames[id] = archetype.name;
    if (archetype.availability !== null) availabilityByWorker[id] = archetype.availability;
    engagementRecords.push(...expandHistory(id, archetype.history));
  }

  return {
    seed: DEMO_SEED,
    workers,
    workerNames,
    availabilityByWorker,
    preferredCrew: PREFERRED_CREW,
    plannedOpportunities: [FEATURED_OPPORTUNITY_PLAN, REHIRE_OPPORTUNITY_PLAN],
    engagementRecords,
    distanceKilometres: DISTANCE_KILOMETRES,
  };
}
