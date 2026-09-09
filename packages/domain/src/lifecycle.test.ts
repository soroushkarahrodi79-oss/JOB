import { describe, expect, it } from 'vitest';
import {
  DomainTransitionError,
  transitionDispute,
  transitionEngagement,
  transitionPayment,
  transitionProofOfWork,
} from './index';

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
