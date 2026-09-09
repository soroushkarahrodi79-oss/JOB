import type { Money } from './money';

/** Administrative location only: coordinates are deliberately not modelled (D6). */
export interface AdministrativeLocation {
  readonly city: string;
  readonly neighbourhood: string;
}

export type AttestationStrength =
  | 'SelfDeclared'
  | 'EmployerConfirmed'
  | 'ProviderVerifiedSimulated';

export interface Attestation {
  readonly criterionId: string;
  readonly state: 'Satisfied' | 'Unsatisfied' | 'Unknown';
  readonly strength: AttestationStrength;
  readonly recordedAt: string;
}

export interface Worker {
  readonly id: string;
  readonly location: AdministrativeLocation;
  readonly attestations: readonly Attestation[];
  readonly verification: 'Unverified' | 'VerifiedSimulated' | 'Failed';
}

export interface EligibilityRequirement {
  readonly id: string;
  readonly label: string;
}

export interface OpportunityTerms {
  readonly amount: Money;
  readonly workStartsAt: string;
  readonly workEndsAt: string;
  readonly location: AdministrativeLocation;
  readonly headcount: number;
  readonly acceptanceMode: 'InviteOnly' | 'OpenAcceptance';
}

export interface Opportunity {
  readonly id: string;
  readonly employerId: string;
  readonly state: import('./states').OpportunityState;
  readonly terms: OpportunityTerms;
  readonly requirements: readonly EligibilityRequirement[];
  readonly classificationFactors: readonly import('./classification').ClassificationFactor[];
}

export interface PaymentCommitment {
  readonly amount: Money;
  /** A record of the employer's commitment, never Platform-held money. */
  readonly platformHoldsFunds: false;
}

export class DomainTransitionError extends Error {
  public constructor(
    public readonly aggregate: string,
    public readonly from: string,
    public readonly command: string,
    public readonly reason: string,
  ) {
    super(`${aggregate} cannot ${command} from ${from}: ${reason}`);
    this.name = 'DomainTransitionError';
  }
}
