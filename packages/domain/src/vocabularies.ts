// Domain vocabularies that the design system renders but that are not entity lifecycles.
//
// Eligibility and provenance are domain concepts (domain-model.md invariants 3 and 2).
// The truth taxonomy is canonical in docs/demo-truth-matrix.md (ADR-0004); it is enumerated here
// so the truth-label primitive can be typed against it — FUNCTIONAL is included for completeness
// but is never rendered (color.md: "FUNCTIONAL is unmarked").

export const ELIGIBILITY_STATES = ['Eligible', 'Conditional', 'NotEligible'] as const;
export const AVAILABILITY_STATES = ['Available', 'Unavailable'] as const;

// The four provenance levels — ink only, distinguished by mark/label/position, never hue
// (ADR-0012 decision 2; state-vocabulary.md "Provenance").
export const PROVENANCE_LEVELS = [
  'SelfDeclared',
  'VerifiedSimulated',
  'Observed',
  'Derived',
] as const;

export const TRUTH_LEVELS = ['FUNCTIONAL', 'SIMULATED', 'MOCK', 'PLANNED'] as const;

export type EligibilityState = (typeof ELIGIBILITY_STATES)[number];
export type AvailabilityState = (typeof AVAILABILITY_STATES)[number];
export type ProvenanceLevel = (typeof PROVENANCE_LEVELS)[number];
export type TruthLevel = (typeof TRUTH_LEVELS)[number];
