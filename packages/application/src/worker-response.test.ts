import { describe, expect, it } from 'vitest';
import { DEMO_NOW, DomainTransitionError, FEATURED_OPPORTUNITY_PLAN } from '@platform/domain';
import {
  answerFactor,
  createOpportunity,
  initialDemoSession,
  inviteWorker,
  markClassificationShown,
  opportunityById,
  publishOpportunity,
  selectActor,
  type DemoSession,
} from './demo-session';
import { validateOpportunityForm, type OpportunityFormValues } from './opportunity-input';
import { recordSimulatedIdentityOutcome } from './worker-verification';
import { respondToInvitation } from './worker-response';

const FEATURED = FEATURED_OPPORTUNITY_PLAN.id;
const EMPLOYER = FEATURED_OPPORTUNITY_PLAN.employerId;
const WORKER = 'WKR-DEMO-01';

const form: OpportunityFormValues = {
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
};

function offered(values = form): DemoSession {
  const validated = validateOpportunityForm(values);
  if (!validated.ok) throw new Error('invalid fixture');
  let session = createOpportunity(initialDemoSession(), validated.input, {
    id: FEATURED,
    employerId: EMPLOYER,
    recordedAt: DEMO_NOW,
  });
  session = answerFactor(session, FEATURED, 'DirectionAndControl', 'employmentLike', DEMO_NOW);
  session = markClassificationShown(session, FEATURED);
  session = publishOpportunity(session, FEATURED, DEMO_NOW);
  session = inviteWorker(session, {
    opportunityId: FEATURED,
    workerId: WORKER,
    employerId: EMPLOYER,
    opportunityTitle: FEATURED_OPPORTUNITY_PLAN.title,
    recordedAt: DEMO_NOW,
  });
  return selectActor(session, 'worker');
}

function verified(session: DemoSession): DemoSession {
  return recordSimulatedIdentityOutcome(session, {
    opportunityId: FEATURED,
    workerId: WORKER,
    result: {
      ok: true,
      value: { verifiedAt: DEMO_NOW, source: 'SimulatedIdentityProvider' },
    },
  });
}

function respond(session: DemoSession, decision: 'Accept' | 'Decline'): DemoSession {
  return respondToInvitation(session, {
    opportunityId: FEATURED,
    workerId: WORKER,
    decision,
    recordedAt: DEMO_NOW,
  });
}

describe('W-04 worker invitation response', () => {
  it('refuses acceptance before the W-03 verification threshold is satisfied', () => {
    expect(() => respond(offered(), 'Accept')).toThrow(DomainTransitionError);
  });

  it('accepts only after verification and increments accepted headcount once', () => {
    const session = respond(verified(offered()), 'Accept');
    expect(session.engagements[0]?.state).toBe('Accepted');
    expect(session.engagements[0]?.acceptedAt).toBe(DEMO_NOW);
    expect(opportunityById(session, FEATURED)?.lifecycle.acceptedEngagementCount).toBe(1);
    expect(opportunityById(session, FEATURED)?.lifecycle.state).toBe('Published');
  });

  it('moves the opportunity to Filled when acceptance reaches headcount', () => {
    const session = respond(verified(offered({ ...form, headcount: 1 })), 'Accept');
    expect(session.engagements[0]?.state).toBe('Accepted');
    expect(opportunityById(session, FEATURED)?.lifecycle.acceptedEngagementCount).toBe(1);
    expect(opportunityById(session, FEATURED)?.lifecycle.state).toBe('Filled');
  });

  it('declines directly from Offered without requiring verification or changing accepted count', () => {
    const session = respond(offered(), 'Decline');
    expect(session.engagements[0]?.state).toBe('Declined');
    expect(session.engagements[0]?.declinedAt).toBe(DEMO_NOW);
    expect(opportunityById(session, FEATURED)?.lifecycle.acceptedEngagementCount).toBe(0);
  });

  it('records one append-only invitation and one acceptance with a copied pay-basis-aware terms snapshot', () => {
    const original = verified(offered());
    const accepted = respondToInvitation(original, {
      opportunityId: FEATURED,
      workerId: WORKER,
      decision: 'Accept',
      recordedAt: DEMO_NOW,
    });
    expect(original.engagementEvents.map((event) => event.kind)).toEqual(['Invited']);
    expect(accepted.engagementEvents.map((event) => event.kind)).toEqual(['Invited', 'Accepted']);
    const event = accepted.engagementEvents[1];
    if (event?.kind !== 'Accepted') throw new Error('missing acceptance evidence');
    expect(event.agreedTerms.title).toBe(FEATURED_OPPORTUNITY_PLAN.title);
    expect(event.agreedTerms.terms.payBasis).toBe('PerShift');
    expect(event.agreedTerms.terms.amount).toEqual(event.agreedTerms.commitment.amount);
    expect(event.agreedTerms.commitment.platformHoldsFunds).toBe(false);
    expect(event.agreedTerms.requirements).toEqual(accepted.opportunities[0]?.requirements);
    expect(event.verification).toEqual({
      source: 'SimulatedIdentityProvider',
      recordedAt: DEMO_NOW,
    });
    const updatedOpportunity = {
      ...accepted.opportunities[0]!,
      title: 'Changed after acceptance',
      terms: { ...accepted.opportunities[0]!.terms, workEndsAt: '2026-09-24T09:00:00.000Z' },
    };
    const later = { ...accepted, opportunities: [updatedOpportunity] };
    expect(later.engagementEvents[1]).toEqual(event);
    expect(event.agreedTerms.title).not.toBe(updatedOpportunity.title);
    expect(event.agreedTerms.terms.workEndsAt).not.toBe(updatedOpportunity.terms.workEndsAt);
  });

  it('records a decline without inventing accepted terms, and rejects duplicate events', () => {
    const declined = respondToInvitation(offered(), {
      opportunityId: FEATURED,
      workerId: WORKER,
      decision: 'Decline',
      recordedAt: DEMO_NOW,
    });
    expect(declined.engagementEvents.map((event) => event.kind)).toEqual(['Invited', 'Declined']);
    expect('agreedTerms' in declined.engagementEvents[1]!).toBe(false);
    expect(() =>
      respondToInvitation(declined, {
        opportunityId: FEATURED,
        workerId: WORKER,
        decision: 'Decline',
        recordedAt: DEMO_NOW,
      }),
    ).toThrow();
    expect(declined.engagementEvents).toHaveLength(2);
  });

  it('refuses a second response after the offer has left Offered', () => {
    const accepted = respond(verified(offered()), 'Accept');
    expect(() => respond(accepted, 'Decline')).toThrow(
      'A current worker offer is required for W-04.',
    );
    expect(opportunityById(accepted, FEATURED)?.lifecycle.acceptedEngagementCount).toBe(1);
  });

  it('rejects a forged actor, wrong worker or missing MOCK notice without altering the offer', () => {
    const session = verified(offered());
    expect(() => respond(selectActor(session, 'employer'), 'Accept')).toThrow(
      'A current worker offer is required for W-04.',
    );
    expect(() =>
      respondToInvitation(session, {
        opportunityId: FEATURED,
        workerId: 'WKR-DEMO-02',
        decision: 'Accept',
        recordedAt: DEMO_NOW,
      }),
    ).toThrow('A current worker offer is required for W-04.');
    const withoutNotice = { ...session, notifications: [] };
    expect(() => respond(withoutNotice, 'Decline')).toThrow(
      'A current worker offer is required for W-04.',
    );
    expect(session.engagements[0]?.state).toBe('Offered');
    expect(session.notifications).toHaveLength(1);
  });

  it('blocks acceptance when the position is Filled but permits declining the outstanding offer', () => {
    const session = verified(offered());
    const filled = {
      ...session,
      opportunities: session.opportunities.map((record) => ({
        ...record,
        lifecycle: {
          ...record.lifecycle,
          state: 'Filled' as const,
          acceptedEngagementCount: record.lifecycle.headcount,
        },
      })),
    };
    expect(() => respond(filled, 'Accept')).toThrow(
      'Cannot accept an offer: no published position remains.',
    );
    const declined = respond(filled, 'Decline');
    expect(declined.engagements[0]?.state).toBe('Declined');
    expect(opportunityById(declined, FEATURED)?.lifecycle.state).toBe('Filled');
  });
});
