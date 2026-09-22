import { describe, expect, it } from 'vitest';
import { UNRECORDED_FACTOR_SOURCES, evaluateClassificationSignal } from './classification';

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

  it('keeps the three ways a factor can be unrecorded apart in storage', () => {
    // experience/classification.md: "'Not asked' and 'answered no' must never be stored or
    // displayed as the same thing", and uncaptured factors are recorded as uncaptured rather than
    // left absent. All three land on value 'Uncaptured', so the SOURCE carries the distinction.
    const at = '2026-09-22T06:00:00.000Z';
    const neverAsked = {
      kind: 'Exclusivity',
      value: 'Uncaptured',
      source: 'NotAsked',
      sourceReference: 'outside the prototype question set',
      recordedAt: at,
    } as const;
    const askedNoAnswer = {
      kind: 'Integration',
      value: 'Uncaptured',
      source: 'AskedNotAnswered',
      sourceReference: 'E-03: integration',
      recordedAt: at,
    } as const;
    const askedUndecided = {
      kind: 'ToolsAndMaterials',
      value: 'Uncaptured',
      source: 'EmployerAnswered',
      sourceReference: 'E-03: tools-and-materials',
      recordedAt: at,
    } as const;

    const signal = evaluateClassificationSignal([neverAsked, askedNoAnswer, askedUndecided]);
    expect(signal.uncapturedFactors).toEqual(['Exclusivity', 'Integration', 'ToolsAndMaterials']);
    expect(new Set([neverAsked.source, askedNoAnswer.source, askedUndecided.source]).size).toBe(3);
    // Only the employer's own «هنوز مشخص نیست» is attributable to the employer.
    expect(askedUndecided.source).toBe('EmployerAnswered');
    expect(UNRECORDED_FACTOR_SOURCES).toContain(neverAsked.source);
    expect(UNRECORDED_FACTOR_SOURCES).toContain(askedNoAnswer.source);
    expect(UNRECORDED_FACTOR_SOURCES).not.toContain(askedUndecided.source);
  });

  it('never represents a negative answer as a gap', () => {
    // The prototype's questions have no yes/no form: both substantive answers are positive
    // statements about how the work is organised, so "answered no" is a VALUE, never 'Uncaptured'.
    const answeredNo = {
      kind: 'DirectionAndControl',
      value: 'IndependentLike',
      source: 'EmployerAnswered',
      sourceReference: 'E-03: direction-and-control',
      recordedAt: '2026-09-22T06:00:00.000Z',
    } as const;
    const signal = evaluateClassificationSignal([answeredNo]);
    expect(signal.independentLikeFactors).toEqual(['DirectionAndControl']);
    expect(signal.uncapturedFactors).toEqual([]);
  });
});
