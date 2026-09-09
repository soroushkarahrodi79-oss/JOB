import { describe, expect, it } from 'vitest';
import { evaluateClassificationSignal } from './classification';

describe('classification signal', () => {
  it('produces employment-like signals without producing a legal verdict or blocking value', () => {
    const signal = evaluateClassificationSignal([
      {
        kind: 'DirectionAndControl',
        value: 'EmploymentLike',
        source: 'EmployerAnswered',
        sourceReference: 'OPP-DEMO-01',
        recordedAt: '2026-09-01T00:00:00Z',
      },
      {
        kind: 'Exclusivity',
        value: 'Uncaptured',
        source: 'EmployerAnswered',
        sourceReference: 'OPP-DEMO-01',
        recordedAt: '2026-09-01T00:00:00Z',
      },
    ]);
    expect(signal).toMatchObject({
      employmentLikeFactors: ['DirectionAndControl'],
      uncapturedFactors: ['Exclusivity'],
      isLegalVerdict: false,
      epistemicStatus: 'HYPOTHESIS',
    });
    expect('legalStatus' in signal).toBe(false);
  });
});
