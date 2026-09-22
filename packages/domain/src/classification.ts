export const CLASSIFICATION_FACTORS = [
  'DirectionAndControl',
  'ScheduleControl',
  'Integration',
  'DurationAndRepetition',
  'ToolsAndMaterials',
  'EconomicStructure',
  'Exclusivity',
] as const;

export type ClassificationFactorKind = (typeof CLASSIFICATION_FACTORS)[number];
export type ClassificationFactorValue = 'EmploymentLike' | 'IndependentLike' | 'Uncaptured';

/**
 * How a factor came to be recorded.
 *
 * docs/product/experience/classification.md requires uncaptured factors to be "recorded as
 * uncaptured, not as absent or as negative", and that "'Not asked' and 'answered no' must never be
 * stored or displayed as the same thing". Three different situations all end at
 * `value: 'Uncaptured'`, so the value cannot hold the distinction and the source has to:
 *
 * | Situation | source | value |
 * | --- | --- | --- |
 * | Read from a field the employer already filled in | `Derived` | substantive |
 * | Observed from a recorded event | `ObservedEvent` | substantive |
 * | Answered — including an answer that reads as "no" | `EmployerAnswered` | substantive |
 * | Asked, and the employer answered «هنوز مشخص نیست» | `EmployerAnswered` | `Uncaptured` |
 * | Asked, and no answer was recorded | `AskedNotAnswered` | `Uncaptured` |
 * | Outside the prototype's question set — nobody was asked | `NotAsked` | `Uncaptured` |
 *
 * The last three are the ones a later legal analysis cannot reconstruct if they are merged. "The
 * employer told us they have not decided", "we asked and got nothing back" and "we never asked"
 * are three different facts about the record, and only the first is a statement by the employer.
 *
 * A NEGATIVE answer is never `Uncaptured`. The prototype's questions have no yes/no form — both
 * substantive answers are positive statements about how the work is organised — so "answered no"
 * is stored as `EmployerAnswered` with a substantive value and is never confused with a gap.
 */
export type ClassificationFactorSource =
  | 'Derived'
  | 'EmployerAnswered'
  | 'ObservedEvent'
  | 'AskedNotAnswered'
  | 'NotAsked';

/** The sources that mean "no fact was recorded here". Each stays distinct from the others. */
export const UNRECORDED_FACTOR_SOURCES = ['AskedNotAnswered', 'NotAsked'] as const;

/** Facts, their provenance, and gaps are stored; a legal classification never is. */
export interface ClassificationFactor {
  readonly kind: ClassificationFactorKind;
  readonly value: ClassificationFactorValue;
  readonly source: ClassificationFactorSource;
  readonly sourceReference: string;
  readonly recordedAt: string;
}

export interface ClassificationSignal {
  readonly kind: 'EngagementOrganisationSignal';
  readonly employmentLikeFactors: readonly ClassificationFactorKind[];
  readonly independentLikeFactors: readonly ClassificationFactorKind[];
  readonly uncapturedFactors: readonly ClassificationFactorKind[];
  readonly epistemicStatus: 'HYPOTHESIS';
  readonly isLegalVerdict: false;
}

/** Recomputable signal only; it deliberately has no legal status or confidence score. */
export function evaluateClassificationSignal(
  factors: readonly ClassificationFactor[],
): ClassificationSignal {
  const byValue = (value: ClassificationFactorValue): ClassificationFactorKind[] =>
    factors.filter((factor) => factor.value === value).map((factor) => factor.kind);
  return {
    kind: 'EngagementOrganisationSignal',
    employmentLikeFactors: byValue('EmploymentLike'),
    independentLikeFactors: byValue('IndependentLike'),
    uncapturedFactors: byValue('Uncaptured'),
    epistemicStatus: 'HYPOTHESIS',
    isLegalVerdict: false,
  };
}
