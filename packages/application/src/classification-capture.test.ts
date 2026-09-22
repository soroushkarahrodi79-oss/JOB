import { describe, expect, it } from 'vitest';
import {
  CLASSIFICATION_FACTORS,
  DEMO_NOW,
  FEATURED_OPPORTUNITY_PLAN,
  evaluateClassificationSignal,
  type OpportunityTerms,
} from '@platform/domain';
import {
  FACTOR_QUESTIONS,
  NEVER_CAPTURED_FACTORS,
  captureClassificationFactors,
  derivedFactorReadings,
} from './classification-capture';

const terms: OpportunityTerms = {
  amount: FEATURED_OPPORTUNITY_PLAN.amount,
  workStartsAt: FEATURED_OPPORTUNITY_PLAN.workStartsAt,
  workEndsAt: FEATURED_OPPORTUNITY_PLAN.workEndsAt,
  location: FEATURED_OPPORTUNITY_PLAN.location,
  headcount: FEATURED_OPPORTUNITY_PLAN.headcount,
  acceptanceMode: FEATURED_OPPORTUNITY_PLAN.acceptanceMode,
};

const capture = (answers: Parameters<typeof captureClassificationFactors>[0]['answers']) =>
  captureClassificationFactors({ terms, payBasis: 'PerShift', answers, recordedAt: DEMO_NOW });

describe('classification factor capture', () => {
  it('records every factor in the set, never leaving one absent', () => {
    const factors = capture({});
    expect(factors.map((factor) => factor.kind)).toEqual([...CLASSIFICATION_FACTORS]);
  });

  it('derives most factors from E-02 and names the field each came from', () => {
    const derived = capture({}).filter((factor) => factor.source === 'Derived');
    expect(derived.length).toBeGreaterThan(0);
    for (const factor of derived) {
      expect(factor.sourceReference.length).toBeGreaterThan(0);
    }
    // experience/classification.md demonstration requirement 2: at least one factor is visibly
    // derived, with the field it came from.
    expect(derived.map((factor) => factor.kind)).toContain('ScheduleControl');
    expect(derivedFactorReadings(terms, 'PerShift').map((reading) => reading.fieldLabel)).toContain(
      'زمان شیفت',
    );
  });

  it('asks only a small number of questions, and each has a "not decided yet" answer', () => {
    expect(FACTOR_QUESTIONS.length).toBeLessThanOrEqual(3);
    for (const question of FACTOR_QUESTIONS) {
      expect(question.answers.map((answer) => answer.key)).toContain('undecided');
      expect(question.question).not.toMatch(/قرارداد کار|کارگر و کارفرما|قانون کار|استخدام/);
    }
  });

  it('always leaves at least one factor uncaptured, named as such', () => {
    // experience/classification.md demonstration requirement 3 — "the uncomfortable one [that]
    // must not be removed for looking incomplete".
    expect(NEVER_CAPTURED_FACTORS.length).toBeGreaterThan(0);
    const answered = capture({
      DirectionAndControl: 'employmentLike',
      ToolsAndMaterials: 'employmentLike',
      Integration: 'employmentLike',
    });
    const signal = evaluateClassificationSignal(answered);
    expect(signal.uncapturedFactors).toEqual([...NEVER_CAPTURED_FACTORS]);
  });

  it('stores "never asked" differently from "asked, not decided yet"', () => {
    const factors = capture({ ToolsAndMaterials: 'undecided' });
    const askedUndecided = factors.find((factor) => factor.kind === 'ToolsAndMaterials');
    const neverAsked = factors.find((factor) => factor.kind === NEVER_CAPTURED_FACTORS[0]);

    expect(askedUndecided?.value).toBe('Uncaptured');
    expect(neverAsked?.value).toBe('Uncaptured');
    // Same value, different source — which is the whole distinction the surface has to keep.
    expect(askedUndecided?.source).toBe('EmployerAnswered');
    expect(neverAsked?.source).toBe('NotCaptured');
  });

  it('never fills in a missing answer with a negative', () => {
    const unanswered = capture({}).find((factor) => factor.kind === 'DirectionAndControl');
    expect(unanswered?.value).toBe('Uncaptured');
    expect(unanswered?.source).toBe('NotCaptured');
  });

  it('reads the pay basis as the factor it is, and says so in the employer s words', () => {
    const perHour = captureClassificationFactors({
      terms,
      payBasis: 'PerHour',
      answers: {},
      recordedAt: DEMO_NOW,
    }).find((factor) => factor.kind === 'EconomicStructure');
    const perShift = capture({}).find((factor) => factor.kind === 'EconomicStructure');
    expect(perHour?.value).toBe('EmploymentLike');
    expect(perShift?.value).toBe('IndependentLike');
  });

  it('produces a signal that is a hypothesis and never a verdict', () => {
    const signal = evaluateClassificationSignal(capture({ DirectionAndControl: 'employmentLike' }));
    expect(signal.epistemicStatus).toBe('HYPOTHESIS');
    expect(signal.isLegalVerdict).toBe(false);
    expect(JSON.stringify(signal)).not.toMatch(/employee|contractor|confidence|score|percent/i);
  });
});
