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
 * `NotCaptured` is the member that carries a rule rather than a category. The prototype has to
 * keep "nobody asked" and "asked, and the employer has not decided" apart —
 * docs/product/experience/classification.md requires uncaptured factors to be "recorded as
 * uncaptured, not as absent or as negative", and that "'Not asked' and 'answered no' must never be
 * stored or displayed as the same thing". Both cases end at `value: 'Uncaptured'`, so the value
 * cannot hold the distinction and the source has to: a factor the prototype never asks about is
 * `NotCaptured`; a factor asked and answered «هنوز مشخص نیست» is `EmployerAnswered`.
 */
export type ClassificationFactorSource =
  | 'Derived'
  | 'EmployerAnswered'
  | 'ObservedEvent'
  | 'NotCaptured';

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
