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

/** Facts, their provenance, and gaps are stored; a legal classification never is. */
export interface ClassificationFactor {
  readonly kind: ClassificationFactorKind;
  readonly value: ClassificationFactorValue;
  readonly source: 'Derived' | 'EmployerAnswered' | 'ObservedEvent';
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
