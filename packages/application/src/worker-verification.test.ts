import { describe, expect, it } from 'vitest';
import { DEMO_NOW, FEATURED_OPPORTUNITY_PLAN } from '@platform/domain';
import {
  answerFactor,
  createOpportunity,
  initialDemoSession,
  inviteWorker,
  markClassificationShown,
  publishOpportunity,
  selectActor,
  type DemoSession,
} from './demo-session';
import { validateOpportunityForm } from './opportunity-input';
import { lastIdentityAttempt, recordSimulatedIdentityOutcome } from './worker-verification';

const OPPORTUNITY_ID = FEATURED_OPPORTUNITY_PLAN.id;
const WORKER_ID = 'WKR-DEMO-01';
const success = {
  ok: true as const,
  value: { verifiedAt: DEMO_NOW, source: 'SimulatedIdentityProvider' as const },
};
const timeout = { ok: false as const, failure: { kind: 'Timeout' as const, recoverable: true as const } };
const rejected = {
  ok: false as const,
  failure: { kind: 'Rejected' as const, recoverable: false as const, reason: 'Demo-only rejection' },
};

function withOffer(): DemoSession {
  const input = validateOpportunityForm({
    title: FEATURED_OPPORTUNITY_PLAN.title,
    shiftDateKey: '2026-09-23',
    startMinutes: 16 * 60,
    endMinutes: 22 * 60,
    neighbourhood: 'Demo-Centre',
    tomanAmount: '980000',
    payBasis: 'PerShift',
    headcount: 2,
    requirementIds: ['cafe-service', 'food-handling-certificate'],
    acceptanceMode: 'InviteOnly',
    employerNote: '',
    travelBoundaryKm: '10',
    paymentCommitmentRecorded: true,
  });
  if (!input.ok) throw new Error('Invalid W-03 fixture');
  let session = createOpportunity(initialDemoSession(), input.input, {
    id: OPPORTUNITY_ID,
    employerId: FEATURED_OPPORTUNITY_PLAN.employerId,
    recordedAt: DEMO_NOW,
  });
  session = answerFactor(session, OPPORTUNITY_ID, 'DirectionAndControl', 'employmentLike', DEMO_NOW);
  session = markClassificationShown(session, OPPORTUNITY_ID);
  session = publishOpportunity(session, OPPORTUNITY_ID, DEMO_NOW);
  session = inviteWorker(session, {
    opportunityId: OPPORTUNITY_ID,
    workerId: WORKER_ID,
    employerId: FEATURED_OPPORTUNITY_PLAN.employerId,
    opportunityTitle: FEATURED_OPPORTUNITY_PLAN.title,
    recordedAt: DEMO_NOW,
  });
  return selectActor(session, 'worker');
}

function record(session: DemoSession, result: typeof success | typeof timeout | typeof rejected) {
  return recordSimulatedIdentityOutcome(session, {
    opportunityId: OPPORTUNITY_ID,
    workerId: WORKER_ID,
    result,
  });
}

describe('W-03 simulated verification outcome recording', () => {
  it('does not allow URL navigation, a different role or an unrelated worker to create evidence', () => {
    expect(() => record(initialDemoSession(), success)).toThrow();
    expect(() => record(selectActor(withOffer(), 'employer'), success)).toThrow();
    expect(() =>
      recordSimulatedIdentityOutcome(withOffer(), {
        opportunityId: OPPORTUNITY_ID,
        workerId: 'WKR-DEMO-02',
        result: success,
      }),
    ).toThrow();
  });

  it('records only a synthetic verified attestation and never changes the offered engagement', () => {
    const previous = withOffer();
    const next = record(previous, success);
    const attempt = lastIdentityAttempt(next, OPPORTUNITY_ID, WORKER_ID);
    expect(attempt).toMatchObject({
      result: 'VerifiedSimulated',
      source: 'SimulatedIdentityProvider',
      attestation: {
        criterionId: 'identity',
        state: 'Satisfied',
        strength: 'ProviderVerifiedSimulated',
        recordedAt: DEMO_NOW,
      },
    });
    expect(next.engagements).toEqual(previous.engagements);
    expect(next.engagements[0]?.state).toBe('Offered');
    expect(record(next, success)).toBe(next);
    expect(JSON.stringify(next)).not.toMatch(/nationalId|documentImage|identityNumber/i);
  });

  it('records rejection and timeout without an attestation, then permits a successful retry', () => {
    const first = record(withOffer(), rejected);
    const second = record(first, timeout);
    const third = record(second, success);
    expect(first.identityAttempts?.[0]?.result).toBe('RejectedSimulated');
    expect(second.identityAttempts?.[1]?.result).toBe('TimeoutSimulated');
    expect(first.identityAttempts?.[0]?.attestation).toBeUndefined();
    expect(second.identityAttempts?.[1]?.attestation).toBeUndefined();
    expect(JSON.stringify(first)).not.toContain('Demo-only rejection');
    expect(third.identityAttempts).toHaveLength(3);
    expect(third.engagements[0]?.state).toBe('Offered');
  });
});
