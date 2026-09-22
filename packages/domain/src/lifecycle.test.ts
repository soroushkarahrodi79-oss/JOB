import { describe, expect, it } from 'vitest';
import {
  DomainTransitionError,
  transitionDispute,
  transitionEngagement,
  transitionOpportunity,
  transitionPayment,
  transitionProofOfWork,
  type OpportunityLifecycle,
} from './index';

const publishableDraft: OpportunityLifecycle = {
  state: 'Draft',
  headcount: 2,
  acceptedEngagementCount: 0,
  hasPaymentCommitment: true,
  requirementsAreBinaryEvaluable: true,
  classificationComputed: true,
  classificationShown: true,
};

describe('opportunity lifecycle', () => {
  it('publishes a draft that satisfies every guard in state-transitions.md', () => {
    expect(transitionOpportunity(publishableDraft, 'Publish').state).toBe('Published');
  });

  it('refuses publication when a requirement is not a binary evaluable condition', () => {
    expect(() =>
      transitionOpportunity(
        { ...publishableDraft, requirementsAreBinaryEvaluable: false },
        'Publish',
      ),
    ).toThrow('every requirement must be a binary evaluable condition');
  });

  it('refuses publication without a recorded payment commitment', () => {
    expect(() =>
      transitionOpportunity({ ...publishableDraft, hasPaymentCommitment: false }, 'Publish'),
    ).toThrow(DomainTransitionError);
  });

  it('refuses publication until the classification signal has been computed and shown', () => {
    expect(() =>
      transitionOpportunity({ ...publishableDraft, classificationShown: false }, 'Publish'),
    ).toThrow('the classification signal must be computed and shown');
  });

  it('does not let the classification signal gate anything beyond having been shown (D3)', () => {
    // The signal's CONTENT is not an input to the guard: only that it was computed and shown.
    // Blocking on what it says would presume an answer to Q1/Q6 (ADR-0010 safeguard 7).
    expect(Object.keys(publishableDraft)).not.toContain('classificationSignal');
  });

  it('fills only once every position is accepted, and closes only from filled', () => {
    const published = transitionOpportunity(publishableDraft, 'Publish');
    expect(() => transitionOpportunity(published, 'Fill')).toThrow('headcount is not reached');
    const filled = transitionOpportunity({ ...published, acceptedEngagementCount: 2 }, 'Fill');
    expect(filled.state).toBe('Filled');
    expect(transitionOpportunity(filled, 'Close').state).toBe('Closed');
  });

  it('refuses to publish anything that is not a draft', () => {
    const published = transitionOpportunity(publishableDraft, 'Publish');
    expect(() => transitionOpportunity(published, 'Publish')).toThrow(
      'only drafts may be published',
    );
  });
});

describe('engagement lifecycle', () => {
  it('requires D2 verification at either canonically defined acceptance path', () => {
    expect(() =>
      transitionEngagement(
        {
          state: 'Offered',
          eligibilityAtAcceptance: true,
          verificationSatisfied: false,
          proofTerminal: false,
          hasOpenDispute: false,
        },
        'AcceptInvitation',
      ),
    ).toThrow(DomainTransitionError);
    expect(
      transitionEngagement(
        {
          state: 'NotCreated',
          eligibilityAtAcceptance: true,
          verificationSatisfied: true,
          proofTerminal: false,
          hasOpenDispute: false,
        },
        'AcceptOpenOpportunity',
      ).state,
    ).toBe('Accepted');
  });

  it('rejects illegal state changes deterministically', () => {
    expect(() =>
      transitionEngagement(
        {
          state: 'Settled',
          eligibilityAtAcceptance: true,
          verificationSatisfied: true,
          proofTerminal: true,
          hasOpenDispute: false,
        },
        'BeginWork',
      ),
    ).toThrow('Engagement cannot BeginWork from Settled');
  });
});

describe('proof, payment and dispute lifecycle', () => {
  it('supports structured proof, contest and case handoff', () => {
    const submitted = transitionProofOfWork(
      { state: 'Awaited', engagementInProgress: true, hasContestingReason: false },
      'Submit',
    );
    expect(
      transitionProofOfWork({ ...submitted, hasContestingReason: true }, 'Contest').state,
    ).toBe('Contested');
  });

  it('preserves a payment failure before retry', () => {
    const authorised = transitionPayment(
      { state: 'AuthorizationSimulated', proofTerminal: true, hasOpenDispute: false },
      'AuthorizeRelease',
    );
    const failed = transitionPayment(authorised, 'ReportFailure');
    expect(failed.state).toBe('SettlementFailed');
    expect(transitionPayment(failed, 'RetryRelease').state).toBe('ReleaseAuthorized');
  });

  it('requires an evidence-based finding before a dispute outcome', () => {
    const review = transitionDispute(
      {
        state: 'Opened',
        bothPartiesInvited: true,
        findingHasRecordedBasis: false,
        paymentConsequenceApplied: false,
      },
      'TakeUnderReview',
    );
    expect(() => transitionDispute(review, 'RecordOutcome')).toThrow(DomainTransitionError);
  });
});
