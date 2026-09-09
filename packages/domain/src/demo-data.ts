import { rial } from './money';
import type { EngagementRecord } from './projections';
import type { Worker } from './core';

export interface SyntheticDemoWorld {
  readonly seed: 'GATE3-DEMO-2026-09-09';
  readonly workers: readonly Worker[];
  readonly opportunities: readonly {
    readonly id: string;
    readonly employerId: string;
    readonly acceptanceMode: 'InviteOnly' | 'OpenAcceptance';
    readonly amount: ReturnType<typeof rial>;
    readonly city: 'Tehran';
    readonly neighbourhood: string;
  }[];
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
    opportunities: [
      {
        id: 'OPP-DEMO-01',
        employerId: 'EMP-DEMO-01',
        acceptanceMode: 'InviteOnly',
        amount: rial(2_000_000),
        city: 'Tehran',
        neighbourhood: 'Demo-Centre',
      },
      {
        id: 'OPP-DEMO-02',
        employerId: 'EMP-DEMO-01',
        acceptanceMode: 'OpenAcceptance',
        amount: rial(2_000_000),
        city: 'Tehran',
        neighbourhood: 'Demo-Centre',
      },
    ],
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
