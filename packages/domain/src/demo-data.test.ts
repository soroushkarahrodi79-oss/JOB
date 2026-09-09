import { describe, expect, it } from 'vitest';
import { generateSyntheticDemoWorld } from './demo-data';

describe('synthetic demo dataset', () => {
  it('is deterministic, synthetic, and internally consistent with D5/D6', () => {
    const first = generateSyntheticDemoWorld();
    expect(first).toEqual(generateSyntheticDemoWorld());
    expect(first.workers).toHaveLength(12);
    expect(first.opportunities.map((opportunity) => opportunity.acceptanceMode)).toEqual([
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
});
