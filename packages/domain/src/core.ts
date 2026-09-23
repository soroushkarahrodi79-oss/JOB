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

/**
 * An employer-stated limit on how far a worker may be from the workplace.
 *
 * matching.md stage 3: distance is a hard constraint *only where someone has said it is*. When an
 * employer records a boundary it filters like any eligibility requirement; absent one, distance
 * merely orders. The prototype's distance is fixed synthetic demo geography, `SIMULATED` at the
 * point of use (truth-matrix row 8) — the boundary is a real recorded term, the distance it is
 * compared against is not real-world data.
 */
export interface TravelBoundary {
  /** The maximum distance, in kilometres of the synthetic demo geography, an employer will accept. */
  readonly maxKilometres: number;
}

/**
 * What an `amount` is the price of.
 *
 * An amount without its basis is ambiguous, and the ambiguity is not cosmetic: 980,000 Toman is
 * either the whole obligation for a shift or the price of one of its hours. demo-dataset.md fixes
 * "a pay basis per opportunity" as part of the dataset's structure, and
 * design/components/opportunity-card.md requires every rendered pay figure to carry it, so the
 * basis travels with the money rather than being inferred by whoever reads it.
 *
 * `PerHour` deliberately implies NO total. Converting a rate into a shift obligation needs a rule
 * for rounding, breaks and overruns that this project has not established, and inventing one would
 * state an obligation the employer never agreed to.
 */
export type PayBasis = 'PerShift' | 'PerHour';

export interface OpportunityTerms {
  readonly amount: Money;
  /** What `amount` prices. Never omitted — see `PayBasis`. */
  readonly payBasis: PayBasis;
  readonly workStartsAt: string;
  readonly workEndsAt: string;
  readonly location: AdministrativeLocation;
  readonly headcount: number;
  readonly acceptanceMode: 'InviteOnly' | 'OpenAcceptance';
  /**
   * The employer's travel boundary, when one was recorded. Optional by construction: an absent
   * boundary is not a boundary of zero, it is the employer declining to filter on distance
   * (matching.md stage 3). A recorded boundary is a hard eligibility constraint; nothing infers one.
   */
  readonly travelBoundary?: TravelBoundary;
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
  /**
   * What `amount` prices, carried so the record cannot be read as an obligation it is not.
   *
   * On `PerShift` the amount IS the whole obligation. On `PerHour` it is a rate the employer has
   * committed to, and the total remains unknown until hours are recorded — the Platform does not
   * compute it (see `PayBasis`). Storing the amount alone would make those two commitments
   * indistinguishable in the record that a later payment, dispute or settlement reads.
   */
  readonly basis: PayBasis;
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
