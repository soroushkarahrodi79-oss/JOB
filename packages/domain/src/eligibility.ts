import type { Attestation, EligibilityRequirement, Worker } from './core';

export interface EligibilityReason {
  readonly requirementId: string;
  readonly requirementLabel: string;
  readonly status: 'Met' | 'Unmet' | 'Unknown';
  readonly attestation?: Attestation;
}

export interface EligibilityEvaluation {
  readonly eligible: boolean;
  readonly reasons: readonly EligibilityReason[];
  /** The single worker-facing reason required by D9, if not eligible. */
  readonly exclusionReason?: EligibilityReason;
}

function latestAttestation(worker: Worker, criterionId: string): Attestation | undefined {
  return worker.attestations.find((attestation) => attestation.criterionId === criterionId);
}

/**
 * Binary, explainable eligibility. Missing and unknown evidence never become eligibility.
 * The returned reasons retain provenance for every condition.
 */
export function evaluateEligibility(
  worker: Worker,
  requirements: readonly EligibilityRequirement[],
): EligibilityEvaluation {
  const reasons = requirements.map((requirement): EligibilityReason => {
    const attestation = latestAttestation(worker, requirement.id);
    if (attestation?.state === 'Satisfied') {
      return {
        requirementId: requirement.id,
        requirementLabel: requirement.label,
        status: 'Met',
        attestation,
      };
    }
    if (attestation?.state === 'Unsatisfied') {
      return {
        requirementId: requirement.id,
        requirementLabel: requirement.label,
        status: 'Unmet',
        attestation,
      };
    }
    return {
      requirementId: requirement.id,
      requirementLabel: requirement.label,
      status: 'Unknown',
      ...(attestation === undefined ? {} : { attestation }),
    };
  });
  const exclusionReason = reasons.find((reason) => reason.status !== 'Met');
  return {
    eligible: exclusionReason === undefined,
    reasons,
    ...(exclusionReason === undefined ? {} : { exclusionReason }),
  };
}
