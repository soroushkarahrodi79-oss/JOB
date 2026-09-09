import { DomainTransitionError } from './core';
import type {
  DisputeState,
  EngagementState,
  OpportunityState,
  PaymentIntentState,
  ProofOfWorkState,
} from './states';

export interface OpportunityLifecycle {
  readonly state: OpportunityState;
  readonly headcount: number;
  readonly acceptedEngagementCount: number;
  readonly hasPaymentCommitment: boolean;
  readonly classificationComputed: boolean;
  readonly classificationShown: boolean;
}

export function transitionOpportunity(
  opportunity: OpportunityLifecycle,
  command: 'Publish' | 'Fill' | 'Expire' | 'Cancel' | 'Close',
): OpportunityLifecycle {
  const fail = (reason: string): never => {
    throw new DomainTransitionError('Opportunity', opportunity.state, command, reason);
  };
  switch (command) {
    case 'Publish':
      if (opportunity.state !== 'Draft') return fail('only drafts may be published');
      if (!opportunity.hasPaymentCommitment) return fail('a payment commitment is required');
      if (!opportunity.classificationComputed || !opportunity.classificationShown) {
        return fail('the classification signal must be computed and shown');
      }
      return { ...opportunity, state: 'Published' };
    case 'Fill':
      if (opportunity.state !== 'Published') return fail('only published opportunities can fill');
      if (opportunity.acceptedEngagementCount < opportunity.headcount)
        return fail('headcount is not reached');
      return { ...opportunity, state: 'Filled' };
    case 'Expire':
      if (opportunity.state !== 'Published')
        return fail('only unfilled published opportunities can expire');
      return { ...opportunity, state: 'Expired' };
    case 'Cancel':
      if (opportunity.state !== 'Published' && opportunity.state !== 'Filled')
        return fail('only live opportunities can cancel');
      return { ...opportunity, state: 'Cancelled' };
    case 'Close':
      if (opportunity.state !== 'Filled') return fail('only filled opportunities can close');
      return { ...opportunity, state: 'Closed' };
  }
}

export interface EngagementLifecycle {
  /** `NotCreated` is a command boundary, never a held Engagement state. */
  readonly state: EngagementState | 'NotCreated';
  readonly eligibilityAtAcceptance: boolean;
  readonly verificationSatisfied: boolean;
  readonly proofTerminal: boolean;
  readonly hasOpenDispute: boolean;
}

export type EngagementCommand =
  | 'AcceptInvitation'
  | 'AcceptOpenOpportunity'
  | 'BeginWork'
  | 'Complete'
  | 'Settle'
  | 'Decline'
  | 'ExpireOffer'
  | 'Cancel'
  | 'OpenDispute'
  | 'CloseDispute';

export function transitionEngagement(
  engagement: EngagementLifecycle,
  command: EngagementCommand,
): EngagementLifecycle {
  const fail = (reason: string): never => {
    throw new DomainTransitionError('Engagement', engagement.state, command, reason);
  };
  const accepts = (): EngagementLifecycle => {
    if (!engagement.eligibilityAtAcceptance) return fail('eligibility must be true at acceptance');
    if (!engagement.verificationSatisfied)
      return fail('verification is required before acceptance (D2 fallback)');
    return { ...engagement, state: 'Accepted' };
  };
  switch (command) {
    case 'AcceptInvitation':
      return engagement.state === 'Offered' ? accepts() : fail('only an offer can be accepted');
    case 'AcceptOpenOpportunity':
      return engagement.state === 'NotCreated'
        ? accepts()
        : fail('open acceptance creates a new engagement only');
    case 'BeginWork':
      return engagement.state === 'Accepted'
        ? { ...engagement, state: 'InProgress' }
        : fail('only an accepted engagement can begin');
    case 'Complete':
      if (engagement.state !== 'InProgress') return fail('only work in progress can complete');
      if (!engagement.proofTerminal) return fail('proof must be in a terminal state');
      return { ...engagement, state: 'Completed' };
    case 'Settle':
      if (engagement.state !== 'Completed') return fail('only completed work can settle');
      if (!engagement.proofTerminal || engagement.hasOpenDispute)
        return fail('proof must be terminal with no open dispute');
      return { ...engagement, state: 'Settled' };
    case 'Decline':
      return engagement.state === 'Offered'
        ? { ...engagement, state: 'Declined' }
        : fail('only offers can decline');
    case 'ExpireOffer':
      return engagement.state === 'Offered'
        ? { ...engagement, state: 'Expired' }
        : fail('only offers can expire');
    case 'Cancel':
      if (
        engagement.state !== 'Offered' &&
        engagement.state !== 'Accepted' &&
        engagement.state !== 'InProgress'
      ) {
        return fail('only non-terminal engagements can cancel');
      }
      return { ...engagement, state: 'Cancelled' };
    case 'OpenDispute':
      return engagement.state === 'Completed'
        ? { ...engagement, state: 'Disputed', hasOpenDispute: true }
        : fail('only a completed engagement can enter a case');
    case 'CloseDispute':
      return engagement.state === 'Disputed'
        ? { ...engagement, state: 'Completed', hasOpenDispute: false }
        : fail('only a disputed engagement can return to completed');
  }
}

export interface ProofOfWorkLifecycle {
  readonly state: ProofOfWorkState;
  readonly engagementInProgress: boolean;
  readonly hasContestingReason: boolean;
}

export function transitionProofOfWork(
  proof: ProofOfWorkLifecycle,
  command: 'Submit' | 'Approve' | 'Contest' | 'ResolveByCase' | 'NotRequired',
): ProofOfWorkLifecycle {
  const fail = (reason: string): never => {
    throw new DomainTransitionError('ProofOfWork', proof.state, command, reason);
  };
  switch (command) {
    case 'Submit':
      if (proof.state !== 'Awaited' || !proof.engagementInProgress)
        return fail('completion is only submitted during work in progress');
      return { ...proof, state: 'Submitted' };
    case 'Approve':
      return proof.state === 'Submitted'
        ? { ...proof, state: 'Approved' }
        : fail('only submitted proof can be approved');
    case 'Contest':
      if (proof.state !== 'Submitted') return fail('only submitted proof can be contested');
      if (!proof.hasContestingReason) return fail('a contest requires a stated reason');
      return { ...proof, state: 'Contested' };
    case 'ResolveByCase':
      return proof.state === 'Contested'
        ? { ...proof, state: 'ResolvedByCase' }
        : fail('only contested proof resolves by case');
    case 'NotRequired':
      return proof.state === 'Awaited'
        ? { ...proof, state: 'NotRequired' }
        : fail('only awaited proof can become not required');
  }
}

/** D18 remains pending: no response-window duration or automatic elapse policy is encoded here. */
export function isProofTerminal(state: ProofOfWorkState): boolean {
  return state === 'Approved' || state === 'ApprovedByNonResponse' || state === 'ResolvedByCase';
}

export interface PaymentLifecycle {
  readonly state: PaymentIntentState;
  readonly proofTerminal: boolean;
  readonly hasOpenDispute: boolean;
}

export function transitionPayment(
  payment: PaymentLifecycle,
  command:
    | 'AuthorizeSimulated'
    | 'AuthorizeRelease'
    | 'ReportSettlement'
    | 'ReportFailure'
    | 'RetryRelease'
    | 'AcknowledgeReceipt',
): PaymentLifecycle {
  const fail = (reason: string): never => {
    throw new DomainTransitionError('PaymentIntent', payment.state, command, reason);
  };
  switch (command) {
    case 'AuthorizeSimulated':
      return payment.state === 'CommitmentRecorded'
        ? { ...payment, state: 'AuthorizationSimulated' }
        : fail('only a commitment can be authorised');
    case 'AuthorizeRelease':
      if (payment.state !== 'AuthorizationSimulated')
        return fail('only an authorised commitment can release');
      if (!payment.proofTerminal || payment.hasOpenDispute)
        return fail('proof must be terminal and no case open');
      return { ...payment, state: 'ReleaseAuthorized' };
    case 'ReportSettlement':
      return payment.state === 'ReleaseAuthorized'
        ? { ...payment, state: 'SettlementReported' }
        : fail('only an instructed release can settle');
    case 'ReportFailure':
      return payment.state === 'ReleaseAuthorized'
        ? { ...payment, state: 'SettlementFailed' }
        : fail('only an instructed release can fail');
    case 'RetryRelease':
      return payment.state === 'SettlementFailed'
        ? { ...payment, state: 'ReleaseAuthorized' }
        : fail('only a failed settlement can retry');
    case 'AcknowledgeReceipt':
      return payment.state === 'SettlementReported'
        ? { ...payment, state: 'ReceiptAcknowledged' }
        : fail('only reported settlement can be acknowledged');
  }
}

export interface DisputeLifecycle {
  readonly state: DisputeState;
  readonly bothPartiesInvited: boolean;
  readonly findingHasRecordedBasis: boolean;
  readonly paymentConsequenceApplied: boolean;
}

export function transitionDispute(
  dispute: DisputeLifecycle,
  command: 'TakeUnderReview' | 'RecordOutcome' | 'Close' | 'Withdraw',
): DisputeLifecycle {
  const fail = (reason: string): never => {
    throw new DomainTransitionError('Dispute', dispute.state, command, reason);
  };
  switch (command) {
    case 'TakeUnderReview':
      if (dispute.state !== 'Opened') return fail('only opened cases can be reviewed');
      if (!dispute.bothPartiesInvited)
        return fail('both parties must have had an opportunity to record an account');
      return { ...dispute, state: 'UnderReview' };
    case 'RecordOutcome':
      if (dispute.state !== 'UnderReview') return fail('only reviewed cases can record an outcome');
      if (!dispute.findingHasRecordedBasis)
        return fail('the finding must reference recorded events');
      return { ...dispute, state: 'OutcomeRecorded' };
    case 'Close':
      if (dispute.state !== 'OutcomeRecorded')
        return fail('only an outcome-recorded case can close');
      if (!dispute.paymentConsequenceApplied)
        return fail('the recorded payment consequence must be applied');
      return { ...dispute, state: 'Closed' };
    case 'Withdraw':
      if (dispute.state !== 'Opened' && dispute.state !== 'UnderReview')
        return fail('only open cases can be withdrawn');
      return { ...dispute, state: 'Withdrawn' };
  }
}
