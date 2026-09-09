import { describe, expect, it } from 'vitest';
import { evaluateEligibility, type Worker } from './index';

const worker: Worker = {
  id: 'WKR-DEMO-01',
  location: { city: 'Tehran', neighbourhood: 'Demo-Centre' },
  verification: 'VerifiedSimulated',
  attestations: [
    {
      criterionId: 'food-card',
      state: 'Satisfied',
      strength: 'SelfDeclared',
      recordedAt: '2026-09-01T00:00:00Z',
    },
    {
      criterionId: 'cash-handling',
      state: 'Unknown',
      strength: 'SelfDeclared',
      recordedAt: '2026-09-01T00:00:00Z',
    },
  ],
};

describe('eligibility', () => {
  it('passes a worker whose every required condition is satisfied', () => {
    expect(
      evaluateEligibility(worker, [{ id: 'food-card', label: 'Food handling card' }]),
    ).toMatchObject({ eligible: true });
  });

  it('retains the exact unmet requirement as the exclusion reason', () => {
    const result = evaluateEligibility(worker, [
      { id: 'food-card', label: 'Food handling card' },
      { id: 'cash-handling', label: 'Cash handling experience' },
    ]);
    expect(result).toMatchObject({
      eligible: false,
      exclusionReason: { requirementId: 'cash-handling', status: 'Unknown' },
    });
  });

  it('does not silently treat absent evidence as eligible', () => {
    expect(
      evaluateEligibility(worker, [{ id: 'missing', label: 'Missing criterion' }]),
    ).toMatchObject({
      eligible: false,
      exclusionReason: { status: 'Unknown' },
    });
  });
});
