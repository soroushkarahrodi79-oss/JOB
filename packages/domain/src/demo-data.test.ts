import { describe, expect, it } from 'vitest';
import { FEATURED_OPPORTUNITY_PLAN, generateSyntheticDemoWorld } from './demo-data';

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
});
