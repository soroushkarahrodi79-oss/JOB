import { describe, expect, it } from 'vitest';
import {
  FEATURED_OPPORTUNITY_PLAN,
  generateSyntheticDemoWorld,
  rial,
  type OpportunityTerms,
} from '@platform/domain';
import { candidateList, type CandidateOpportunity } from './candidate-list';

const world = generateSyntheticDemoWorld();

function opportunity(overrides?: {
  terms?: Partial<OpportunityTerms>;
  requirements?: CandidateOpportunity['requirements'];
  dropTravelBoundary?: boolean;
}): CandidateOpportunity {
  const plan = FEATURED_OPPORTUNITY_PLAN;
  const terms: OpportunityTerms = {
    amount: plan.amount,
    payBasis: plan.payBasis,
    workStartsAt: plan.workStartsAt,
    workEndsAt: plan.workEndsAt,
    location: plan.location,
    headcount: plan.headcount,
    acceptanceMode: plan.acceptanceMode,
    ...(plan.travelBoundary === undefined || overrides?.dropTravelBoundary === true
      ? {}
      : { travelBoundary: plan.travelBoundary }),
    ...overrides?.terms,
  };
  return {
    id: plan.id,
    employerId: plan.employerId,
    terms,
    requirements: overrides?.requirements ?? plan.requirements,
  };
}

const model = candidateList(world, opportunity());
const rankedIds = model.ranked.map((candidate) => candidate.workerId);
const excludedById = new Map(model.excluded.map((candidate) => [candidate.workerId, candidate]));

describe('E-04 matching pipeline — hard gates before ordering', () => {
  it('never lets an excluded worker appear in the eligible ranking', () => {
    for (const excluded of model.excluded) {
      expect(rankedIds).not.toContain(excluded.workerId);
    }
    // Every worker is accounted for exactly once, in one partition or the other.
    expect(rankedIds.length + model.excluded.length).toBe(world.workers.length);
  });

  it('evaluates eligibility before ordering: WKR-03 is excluded, not ranked low', () => {
    expect(rankedIds).not.toContain('WKR-DEMO-03');
    const wkr03 = excludedById.get('WKR-DEMO-03');
    expect(wkr03?.stage).toBe('Eligibility');
    // The one specific unmet requirement, and only that one.
    expect(wkr03?.unmetRequirement?.requirementId).toBe('food-handling-certificate');
    expect(wkr03?.unmetRequirement?.status).toBe('Unknown');
  });

  it('keeps an eligible newcomer with no history in the ranked list', () => {
    // Scenario S2: WKR-01 qualifies on eligibility alone.
    expect(rankedIds).toContain('WKR-DEMO-01');
    const wkr01 = model.ranked.find((candidate) => candidate.workerId === 'WKR-DEMO-01');
    const reliability = wkr01?.ordering.find((signal) => signal.stage === 'Reliability');
    expect(reliability?.reliability?.completed).toBe(0);
    expect(reliability?.acted).toBe(false);
    // No history is not a penalty: it has no top ordering reason, it is not excluded.
    expect(wkr01?.topOrderingStage).toBeNull();
  });

  it('treats a recorded non-covering availability as an exclusion (WKR-04)', () => {
    expect(rankedIds).not.toContain('WKR-DEMO-04');
    expect(excludedById.get('WKR-DEMO-04')?.stage).toBe('Availability');
    expect(excludedById.get('WKR-DEMO-04')?.availability.kind).toBe('DoesNotCover');
  });

  it('treats missing availability differently: WKR-08 stays a candidate, flagged unknown', () => {
    expect(rankedIds).toContain('WKR-DEMO-08');
    const wkr08 = model.ranked.find((candidate) => candidate.workerId === 'WKR-DEMO-08');
    expect(wkr08?.availability.kind).toBe('Unknown');
  });

  it('enforces the travel boundary only when it is recorded and the distance is known', () => {
    // Recorded 10 km boundary, WKR-05 at 16 km → excluded on location.
    expect(rankedIds).not.toContain('WKR-DEMO-05');
    expect(excludedById.get('WKR-DEMO-05')?.stage).toBe('Location');
    expect(excludedById.get('WKR-DEMO-05')?.location.kind).toBe('Outside');

    // Remove the boundary and WKR-05 is a candidate again — distance now only orders.
    const noBoundary = candidateList(world, opportunity({ dropTravelBoundary: true }));
    expect(noBoundary.ranked.map((c) => c.workerId)).toContain('WKR-DEMO-05');
    expect(noBoundary.hasTravelBoundary).toBe(false);
  });
});

describe('E-04 matching pipeline — ordering', () => {
  it('orders an established worker ahead of a newcomer, on reliability not on pay', () => {
    expect(rankedIds.indexOf('WKR-DEMO-02')).toBeLessThan(rankedIds.indexOf('WKR-DEMO-01'));
    const wkr02 = model.ranked.find((candidate) => candidate.workerId === 'WKR-DEMO-02');
    expect(wkr02?.topOrderingStage).toBe('Reliability');
  });

  it('cannot be reordered by a lower or higher pay offer — pay is not a ranking input', () => {
    const cheaper = candidateList(world, opportunity({ terms: { amount: rial(1_000_000) } }));
    const dearer = candidateList(world, opportunity({ terms: { amount: rial(50_000_000) } }));
    expect(cheaper.ranked.map((c) => c.workerId)).toEqual(rankedIds);
    expect(dearer.ranked.map((c) => c.workerId)).toEqual(rankedIds);
  });

  it('is deterministic and total', () => {
    expect(candidateList(world, opportunity()).ranked.map((c) => c.workerId)).toEqual(rankedIds);
    // No two ranked candidates share a rank.
    expect(new Set(model.ranked.map((c) => c.rank)).size).toBe(model.ranked.length);
  });

  it('derives reliability from events, never from a seeded value', () => {
    const wkr02 = model.ranked.find((candidate) => candidate.workerId === 'WKR-DEMO-02');
    const completedEvents = world.engagementRecords.filter(
      (record) =>
        record.workerId === 'WKR-DEMO-02' &&
        (record.engagementState === 'Completed' || record.engagementState === 'Settled'),
    ).length;
    expect(wkr02?.ordering.find((s) => s.stage === 'Reliability')?.reliability?.completed).toBe(
      completedEvents,
    );
  });

  it('keeps a Preferred Crew relationship with another employer off this employer s list', () => {
    // WKR-06 is EMP-03's Preferred Crew; on EMP-01's list that confers nothing.
    const wkr06 = model.ranked.find((candidate) => candidate.workerId === 'WKR-DEMO-06');
    const prior = wkr06?.ordering.find((signal) => signal.stage === 'PriorRelationship');
    expect(prior?.priorRelationship?.preferredCrew).toBe(false);
    expect(prior?.acted).toBe(false);
  });
});

describe('E-04 matching pipeline — explanation provenance', () => {
  it('preserves the real provenance of each eligibility reason', () => {
    const wkr01 = model.ranked.find((candidate) => candidate.workerId === 'WKR-DEMO-01');
    const wkr02 = model.ranked.find((candidate) => candidate.workerId === 'WKR-DEMO-02');
    const cert01 = wkr01?.eligibility.reasons.find(
      (reason) => reason.requirementId === 'food-handling-certificate',
    );
    const cert02 = wkr02?.eligibility.reasons.find(
      (reason) => reason.requirementId === 'food-handling-certificate',
    );
    // WKR-01's certificate is self-declared; WKR-02's is provider-verified (simulated). Different
    // statements, from different attestations — never rendered identically.
    expect(cert01?.attestation?.strength).toBe('SelfDeclared');
    expect(cert02?.attestation?.strength).toBe('ProviderVerifiedSimulated');
  });
});

describe('E-04 matching pipeline — edited terms change the result', () => {
  it('reflects an edited requirement set, and explains an empty list', () => {
    // Require a skill no worker declares → nobody is eligible, and the empty state names the
    // requirement that removed the most people.
    const impossible = candidateList(
      world,
      opportunity({ requirements: [{ id: 'barista-certificate', label: 'گواهی باریستا' }] }),
    );
    expect(impossible.ranked).toHaveLength(0);
    expect(impossible.emptyReason?.requirementId).toBe('barista-certificate');
    expect(impossible.emptyReason?.count).toBeGreaterThan(0);
  });

  it('reflects a dropped certificate requirement — WKR-03 becomes eligible', () => {
    const noCert = candidateList(
      world,
      opportunity({
        requirements: [{ id: 'cafe-service', label: 'تجربهٔ کار در کافه یا پذیرایی' }],
      }),
    );
    expect(noCert.ranked.map((c) => c.workerId)).toContain('WKR-DEMO-03');
  });
});
