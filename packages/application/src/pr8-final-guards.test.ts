import { describe, expect, it } from 'vitest';
import {
  DEMO_NOW,
  FEATURED_OPPORTUNITY_PLAN,
  generateSyntheticDemoWorld,
  type OpportunityTerms,
} from '@platform/domain';
import { candidateList, type CandidateOpportunity } from './candidate-list';
import {
  DemoSessionConflictError,
  createOpportunity,
  initialDemoSession,
  inviteWorker,
  markClassificationShown,
  publishOpportunity,
  type DemoSession,
} from './demo-session';
import { validateOpportunityForm, type OpportunityFormValues } from './opportunity-input';

const plan = FEATURED_OPPORTUNITY_PLAN;
const world = generateSyntheticDemoWorld();

const form: OpportunityFormValues = {
  title: plan.title,
  shiftDateKey: '2026-09-23',
  startMinutes: 16 * 60,
  endMinutes: 22 * 60,
  neighbourhood: 'Demo-Centre',
  tomanAmount: '980000',
  payBasis: 'PerShift',
  headcount: 2,
  requirementIds: ['cafe-service', 'food-handling-certificate'],
  acceptanceMode: 'InviteOnly',
  employerNote: '',
  travelBoundaryKm: '10',
  paymentCommitmentRecorded: true,
};

function draft(): DemoSession {
  const result = validateOpportunityForm(form);
  if (!result.ok) throw new Error('Invalid test opportunity');
  return createOpportunity(initialDemoSession(), result.input, {
    id: plan.id,
    employerId: plan.employerId,
    recordedAt: DEMO_NOW,
  });
}

function published(): DemoSession {
  return publishOpportunity(markClassificationShown(draft(), plan.id), plan.id, DEMO_NOW);
}

function invite(session: DemoSession, workerId: string, employerId = plan.employerId) {
  return inviteWorker(session, {
    opportunityId: plan.id,
    workerId,
    employerId,
    opportunityTitle: plan.title,
    recordedAt: DEMO_NOW,
  });
}

function opportunity(terms: OpportunityTerms): CandidateOpportunity {
  return {
    id: plan.id,
    employerId: plan.employerId,
    terms,
    requirements: plan.requirements,
  };
}

describe('soft location ordering is an actual, evidence-based tie-break', () => {
  const original = world.workers.find((worker) => worker.id === 'WKR-DEMO-01');
  if (original === undefined) throw new Error('Missing synthetic worker');

  // Both have the SAME eligibility, skills and event history; their identifiers intentionally
  // favour the farther worker, so an ID-only ordering would produce the opposite result.
  const farther = {
    ...original,
    id: 'WKR-DEMO-A',
    location: { city: 'Tehran', neighbourhood: 'Demo-West' },
  };
  const nearer = {
    ...original,
    id: 'WKR-DEMO-Z',
    location: { city: 'Tehran', neighbourhood: 'Demo-East' },
  };
  const tiedWorld = {
    ...world,
    workers: [farther, nearer],
    workerNames: { [farther.id]: 'Farther', [nearer.id]: 'Nearer' },
    availabilityByWorker: {
      [farther.id]: world.availabilityByWorker[original.id] ?? [],
      [nearer.id]: world.availabilityByWorker[original.id] ?? [],
    },
    engagementRecords: [],
    preferredCrew: [],
  };

  const termsWithoutBoundary: OpportunityTerms = {
    amount: plan.amount,
    payBasis: plan.payBasis,
    workStartsAt: plan.workStartsAt,
    workEndsAt: plan.workEndsAt,
    location: plan.location,
    headcount: plan.headcount,
    acceptanceMode: plan.acceptanceMode,
  };

  it('places the closer known distance first when no boundary is recorded', () => {
    const result = candidateList(tiedWorld, opportunity(termsWithoutBoundary));
    const ids = result.ranked.map((candidate) => candidate.workerId);
    expect(ids).toEqual([nearer.id, farther.id]);
    expect(result.excluded).toHaveLength(0);
  });

  it('never treats missing distance as zero or excludes on a missing soft distance', () => {
    const missingDistanceWorker = {
      ...nearer,
      id: 'WKR-DEMO-0',
      location: { city: 'Tehran', neighbourhood: 'Demo-Unmapped' },
    };
    const withUnknown = {
      ...tiedWorld,
      workers: [missingDistanceWorker, nearer],
      availabilityByWorker: {
        [missingDistanceWorker.id]: world.availabilityByWorker[original.id] ?? [],
        [nearer.id]: world.availabilityByWorker[original.id] ?? [],
      },
    };
    const result = candidateList(withUnknown, opportunity(termsWithoutBoundary));
    const ids = result.ranked.map((candidate) => candidate.workerId);
    expect(result.excluded).toHaveLength(0);
    expect(ids).toEqual([nearer.id, missingDistanceWorker.id]);
    expect(result.ranked[1]?.distanceKilometres).toBeUndefined();
  });

  it('does not use distance to reorder two workers when a hard travel boundary exists', () => {
    const result = candidateList(
      tiedWorld,
      opportunity({ ...termsWithoutBoundary, travelBoundary: { maxKilometres: 10 } }),
    );
    const ids = result.ranked.map((candidate) => candidate.workerId);
    expect(ids).toEqual([farther.id, nearer.id]);
  });
});

describe('invitation has its own application guards, independent of the UI button', () => {
  it('refuses an absent or unpublished opportunity without recording any offer', () => {
    expect(() => invite(initialDemoSession(), 'WKR-DEMO-01')).toThrow(DemoSessionConflictError);
    expect(() => invite(draft(), 'WKR-DEMO-01')).toThrow(DemoSessionConflictError);
  });

  it('refuses a mismatched employer, stale title and non-invite-only terms', () => {
    const session = published();
    expect(() => invite(session, 'WKR-DEMO-01', 'EMP-DEMO-02')).toThrow(DemoSessionConflictError);
    expect(() =>
      inviteWorker(session, {
        opportunityId: plan.id,
        workerId: 'WKR-DEMO-01',
        employerId: plan.employerId,
        opportunityTitle: 'stale title',
        recordedAt: DEMO_NOW,
      }),
    ).toThrow(DemoSessionConflictError);
    const openAcceptance: DemoSession = {
      ...session,
      opportunities: session.opportunities.map((record) => ({
        ...record,
        terms: { ...record.terms, acceptanceMode: 'OpenAcceptance' },
      })),
    };
    expect(() => invite(openAcceptance, 'WKR-DEMO-01')).toThrow(DemoSessionConflictError);
    expect(session.engagements).toHaveLength(0);
    expect(session.notifications).toHaveLength(0);
  });

  it('refuses excluded, unavailable, distant and unknown workers, without side effects', () => {
    const session = published();
    const excludedIds = ['WKR-DEMO-03', 'WKR-DEMO-04', 'WKR-DEMO-05', 'WKR-DEMO-UNKNOWN'];
    for (const workerId of excludedIds) {
      expect(() => invite(session, workerId)).toThrow(DemoSessionConflictError);
    }
    expect(session.engagements).toHaveLength(0);
    expect(session.notifications).toHaveLength(0);
  });

  it('rejects a stale candidate under the opportunity current requirements', () => {
    const session = published();
    const changed: DemoSession = {
      ...session,
      opportunities: session.opportunities.map((record) => ({
        ...record,
        requirements: [{ id: 'barista-certificate', label: 'گواهی باریستا' }],
      })),
    };
    expect(() => invite(changed, 'WKR-DEMO-01')).toThrow(DemoSessionConflictError);
  });

  it('refuses a no-longer-published opportunity and preserves existing records', () => {
    const once = invite(published(), 'WKR-DEMO-01');
    const filled: DemoSession = {
      ...once,
      opportunities: once.opportunities.map((record) => ({
        ...record,
        lifecycle: { ...record.lifecycle, state: 'Filled' },
      })),
    };
    expect(() => invite(filled, 'WKR-DEMO-02')).toThrow(DemoSessionConflictError);
    expect(filled.engagements).toHaveLength(1);
    expect(filled.notifications).toHaveLength(1);
  });

  it('keeps an eligible invitation idempotent and MOCK, without imposing an invented offer cap', () => {
    const once = invite(published(), 'WKR-DEMO-01');
    expect(invite(once, 'WKR-DEMO-01')).toBe(once);
    const twice = invite(once, 'WKR-DEMO-02');
    const offeredStates = twice.engagements.map((engagement) => engagement.state);
    const notificationTruths = twice.notifications.map((notification) => notification.truth);
    expect(offeredStates).toEqual(['Offered', 'Offered']);
    expect(notificationTruths).toEqual(['MOCK', 'MOCK']);
  });
});
