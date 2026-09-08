// The finite lifecycle states the prototype's entities can hold.
//
// CANONICAL SOURCE: docs/domain/state-transitions.md. This module expresses those states in
// code; it does not define new ones. If state-transitions.md changes, this file and the design
// vocabulary that renders it (docs/design/state-vocabulary.md, packages/ui) change with it.
// The exhaustiveness test in packages/ui guarantees every state below has exactly one rendering
// (GATE 1.5 exit criterion 5): "A state present in state-transitions.md and absent from the
// vocabulary is a defect."
//
// Derived projections (Worker Passport, reliability, employer trust, Work Graph) have NO state
// machine — they are recomputed from events, never transitioned (domain invariant 1). They are
// therefore absent here by design.

export const OPPORTUNITY_STATES = [
  'Draft',
  'Published',
  'Filled',
  'Expired',
  'Cancelled',
  'Closed',
] as const;

export const ENGAGEMENT_STATES = [
  'Offered',
  'Accepted',
  'InProgress',
  'Completed',
  'Settled',
  'Declined',
  'Expired',
  'Cancelled',
  'Disputed',
] as const;

export const PROOF_OF_WORK_STATES = [
  'Awaited',
  'Submitted',
  'Approved',
  'ApprovedByNonResponse',
  'Contested',
  'ResolvedByCase',
  'NotRequired',
] as const;

export const PAYMENT_INTENT_STATES = [
  'CommitmentRecorded',
  'AuthorizationSimulated',
  'ReleaseAuthorized',
  'SettlementReported',
  'SettlementFailed',
  'ReceiptAcknowledged',
] as const;

export const DISPUTE_STATES = [
  'Opened',
  'UnderReview',
  'OutcomeRecorded',
  'Closed',
  'Withdrawn',
] as const;

export const ATTESTATION_STATES = [
  'Declared',
  'Submitted',
  'VerifiedSimulated',
  'VerificationFailed',
  'ConfirmedByEmployer',
] as const;

export const PREFERRED_CREW_STATES = ['Marked', 'Removed'] as const;

export type OpportunityState = (typeof OPPORTUNITY_STATES)[number];
export type EngagementState = (typeof ENGAGEMENT_STATES)[number];
export type ProofOfWorkState = (typeof PROOF_OF_WORK_STATES)[number];
export type PaymentIntentState = (typeof PAYMENT_INTENT_STATES)[number];
export type DisputeState = (typeof DISPUTE_STATES)[number];
export type AttestationState = (typeof ATTESTATION_STATES)[number];
export type PreferredCrewState = (typeof PREFERRED_CREW_STATES)[number];

// The families of lifecycle state the design vocabulary must render. Keyed by the `family`
// dimension of docs/design/state-vocabulary.md ("One component, three dimensions").
export const LIFECYCLE_STATES = {
  opportunity: OPPORTUNITY_STATES,
  engagement: ENGAGEMENT_STATES,
  proof: PROOF_OF_WORK_STATES,
  payment: PAYMENT_INTENT_STATES,
  dispute: DISPUTE_STATES,
  attestation: ATTESTATION_STATES,
  preferredCrew: PREFERRED_CREW_STATES,
} as const;

export type LifecycleFamily = keyof typeof LIFECYCLE_STATES;
