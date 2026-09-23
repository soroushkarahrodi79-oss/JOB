import { describe, expect, it } from 'vitest';
import { FEATURED_OPPORTUNITY_PLAN, distanceKey, generateSyntheticDemoWorld } from './demo-data';
import { evaluateAvailability } from './availability';
import { evaluateTravelBoundary } from './location';

describe('synthetic demo dataset', () => {
  it('is deterministic, synthetic, and internally consistent with D5/D6', () => {
    const first = generateSyntheticDemoWorld();
    expect(first).toEqual(generateSyntheticDemoWorld());
    expect(first.workers).toHaveLength(12);
    expect(first.plannedOpportunities.map((opportunity) => opportunity.acceptanceMode)).toEqual([
      'InviteOnly',
      'OpenAcceptance',
    ]);
    expect(
      first.workers
        .find((worker) => worker.id === 'WKR-DEMO-03')
        ?.attestations.find(
          (attestation) => attestation.criterionId === 'food-handling-certificate',
        )?.state,
    ).toBe('Unknown');
    expect(JSON.stringify(first)).not.toMatch(/phone|national|bank|coordinate/i);
  });

  it('plans the featured transaction rather than seeding it, so the walkthrough creates it', () => {
    const world = generateSyntheticDemoWorld();
    // demo-scenarios.md: `OPP-01` is created by `EMP-01` at beat B1 and `OPP-02` at beat B12.
    // Nothing in the starting world may already be one of them.
    expect(world.plannedOpportunities.map((plan) => plan.createdAtBeat)).toEqual(['B1', 'B12']);
    expect(world.plannedOpportunities[0]).toBe(FEATURED_OPPORTUNITY_PLAN);
    expect(world).not.toHaveProperty('opportunities');
  });

  it('fixes the featured transaction to the shape every later story depends on', () => {
    // demo-dataset.md: two positions, within 24 hours of the demo today, invite-only, with the
    // certificate requirement that excludes WKR-03 at beat B7.
    expect(FEATURED_OPPORTUNITY_PLAN.id).toBe('OPP-DEMO-01');
    expect(FEATURED_OPPORTUNITY_PLAN.employerId).toBe('EMP-DEMO-01');
    expect(FEATURED_OPPORTUNITY_PLAN.headcount).toBe(2);
    expect(FEATURED_OPPORTUNITY_PLAN.acceptanceMode).toBe('InviteOnly');
    expect(FEATURED_OPPORTUNITY_PLAN.requirements.map((requirement) => requirement.id)).toContain(
      'food-handling-certificate',
    );
    // Money is whole Rial, and a whole number of Toman so presentation never rounds.
    expect(Number.isInteger(FEATURED_OPPORTUNITY_PLAN.amount.rialAmount)).toBe(true);
    expect(FEATURED_OPPORTUNITY_PLAN.amount.rialAmount % 10).toBe(0);
    expect(FEATURED_OPPORTUNITY_PLAN.amount.currency).toBe('IRR');
  });

  it('records the canonical travel boundary as an explicit, evaluable term', () => {
    // demo-dataset.md OPP-01: "one travel boundary". It is a recorded term, not a Platform default.
    expect(FEATURED_OPPORTUNITY_PLAN.travelBoundary).toEqual({ maxKilometres: 10 });
  });
});

describe('the twelve worker archetypes carry the facts the E-04 narrative needs', () => {
  const world = generateSyntheticDemoWorld();
  const worker = (index: number) =>
    world.workers.find((w) => w.id === `WKR-DEMO-${index.toString().padStart(2, '0')}`);
  const opportunityWindow = {
    startsAt: FEATURED_OPPORTUNITY_PLAN.workStartsAt,
    endsAt: FEATURED_OPPORTUNITY_PLAN.workEndsAt,
  };
  const distanceFor = (index: number) =>
    world.distanceKilometres[
      distanceKey('Demo-Centre', worker(index)?.location.neighbourhood ?? '')
    ];

  it('gives every worker a synthetic Persian name and no real identifiers', () => {
    for (const w of world.workers) {
      expect(world.workerNames[w.id]).toBeTruthy();
    }
    expect(JSON.stringify(world)).not.toMatch(/phone|national|bank|coordinate/i);
  });

  it('WKR-01 is a newcomer: unverified, declared skills, and NO recorded history', () => {
    // Coherence requirement 2: her record has no observed history and no computable rates.
    expect(worker(1)?.verification).toBe('Unverified');
    expect(world.engagementRecords.filter((r) => r.workerId === 'WKR-DEMO-01')).toHaveLength(0);
    // Still eligible on the declared skills and available in the window.
    expect(
      evaluateAvailability(world.availabilityByWorker['WKR-DEMO-01'], opportunityWindow),
    ).toEqual({ kind: 'Covers' });
  });

  it('WKR-02 is established: verified, with a real settled history to derive reliability from', () => {
    expect(worker(2)?.verification).toBe('VerifiedSimulated');
    expect(
      world.engagementRecords.filter(
        (r) => r.workerId === 'WKR-DEMO-02' && r.engagementState === 'Settled',
      ).length,
    ).toBeGreaterThan(0);
  });

  it('WKR-03 lacks only the certificate — every other requirement is met', () => {
    const cert = worker(3)?.attestations.find((a) => a.criterionId === 'food-handling-certificate');
    expect(cert?.state).toBe('Unknown');
    expect(worker(3)?.attestations.find((a) => a.criterionId === 'cafe-service')?.state).toBe(
      'Satisfied',
    );
  });

  it('WKR-04 is unavailable by a recorded window, not by missing information', () => {
    expect(
      evaluateAvailability(world.availabilityByWorker['WKR-DEMO-04'], opportunityWindow),
    ).toEqual({ kind: 'DoesNotCover' });
  });

  it('WKR-05 is beyond the recorded travel boundary, on a recorded distance', () => {
    const distance = distanceFor(5);
    expect(distance).toBe(16);
    expect(evaluateTravelBoundary(FEATURED_OPPORTUNITY_PLAN.travelBoundary, distance)).toEqual({
      kind: 'Outside',
      distanceKilometres: 16,
    });
  });

  it('WKR-08 has declared no availability at all — unknown, and not the same as WKR-04', () => {
    expect(world.availabilityByWorker['WKR-DEMO-08']).toBeUndefined();
    expect(
      evaluateAvailability(world.availabilityByWorker['WKR-DEMO-08'], opportunityWindow),
    ).toEqual({ kind: 'Unknown' });
  });

  it('keeps every Preferred Crew relationship with an employer other than EMP-01', () => {
    // The EMP-01 relationship is created live at beat B10; none is seeded.
    expect(world.preferredCrew.every((link) => link.employerId !== 'EMP-DEMO-01')).toBe(true);
    expect(world.preferredCrew.length).toBeGreaterThan(0);
  });

  it('seeds events, never reputation values', () => {
    // Every historical record is an engagement event with a lifecycle state; nothing is a rate.
    for (const record of world.engagementRecords) {
      expect(typeof record.engagementState).toBe('string');
    }
    expect(JSON.stringify(world)).not.toMatch(/completionRate|reliabilityScore|rating|stars/i);
  });
});
