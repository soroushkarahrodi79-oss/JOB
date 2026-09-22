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

  it('keeps "never asked" and "asked, not decided yet" apart in storage', () => {
    // experience/classification.md: "'Not asked' and 'answered no' must never be stored or
    // displayed as the same thing", and uncaptured factors are recorded as uncaptured rather than
    // left absent. Both land on value 'Uncaptured', so the SOURCE carries the distinction.
    const neverAsked = {
      kind: 'Exclusivity',
      value: 'Uncaptured',
      source: 'NotCaptured',
      sourceReference: 'not asked by the prototype',
      recordedAt: '2026-09-22T06:00:00.000Z',
    } as const;
    const askedUndecided = {
      kind: 'ToolsAndMaterials',
      value: 'Uncaptured',
      source: 'EmployerAnswered',
      sourceReference: 'E-03: tools-and-materials',
      recordedAt: '2026-09-22T06:00:00.000Z',
    } as const;

    const signal = evaluateClassificationSignal([neverAsked, askedUndecided]);
    expect(signal.uncapturedFactors).toEqual(['Exclusivity', 'ToolsAndMaterials']);
    expect(neverAsked.source).not.toBe(askedUndecided.source);
  });
});
