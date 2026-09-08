import { describe, expect, it } from 'vitest';
import { LIFECYCLE_STATES, ENGAGEMENT_STATES, PAYMENT_INTENT_STATES } from './states';

// These expectations mirror docs/domain/state-transitions.md exactly. If a state is added or
// removed there, this test is the first thing that must change — and the ui exhaustiveness test
// then forces a rendering for it.
const EXPECTED: Record<string, readonly string[]> = {
  opportunity: ['Draft', 'Published', 'Filled', 'Expired', 'Cancelled', 'Closed'],
  engagement: [
    'Offered',
    'Accepted',
    'InProgress',
    'Completed',
    'Settled',
    'Declined',
    'Expired',
    'Cancelled',
    'Disputed',
  ],
  proof: [
    'Awaited',
    'Submitted',
    'Approved',
    'ApprovedByNonResponse',
    'Contested',
    'ResolvedByCase',
    'NotRequired',
  ],
  payment: [
    'CommitmentRecorded',
    'AuthorizationSimulated',
    'ReleaseAuthorized',
    'SettlementReported',
    'SettlementFailed',
    'ReceiptAcknowledged',
  ],
  dispute: ['Opened', 'UnderReview', 'OutcomeRecorded', 'Closed', 'Withdrawn'],
  attestation: [
    'Declared',
    'Submitted',
    'VerifiedSimulated',
    'VerificationFailed',
    'ConfirmedByEmployer',
  ],
  preferredCrew: ['Marked', 'Removed'],
};

describe('lifecycle states match state-transitions.md', () => {
  it('has exactly the seven lifecycle families', () => {
    expect(Object.keys(LIFECYCLE_STATES).sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  for (const [family, states] of Object.entries(LIFECYCLE_STATES)) {
    it(`${family} matches the canonical set`, () => {
      expect([...states]).toEqual(EXPECTED[family]);
    });
    it(`${family} has no duplicate states`, () => {
      expect(new Set(states).size).toBe(states.length);
    });
  }

  // Two states the commissioning brief for GATE 1.5 had omitted; their presence is the reason
  // the vocabulary mapping note exists (state-vocabulary.md "Mapping note").
  it('keeps Disputed as a distinct engagement state', () => {
    expect(ENGAGEMENT_STATES).toContain('Disputed');
  });
  it('keeps SettlementFailed as a first-class payment state (scenario S5)', () => {
    expect(PAYMENT_INTENT_STATES).toContain('SettlementFailed');
  });
});
