import { describe, expect, it } from 'vitest';
import {
  DEMO_NOW,
  DomainTransitionError,
  FEATURED_OPPORTUNITY_PLAN,
} from '@platform/domain';
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

describe('W-04 worker invitation response', () => {
  it('refuses acceptance before the W-03 verification threshold is satisfied', () => {
    expect(() =>
      respondToInvitation(offered(), {
        opportunityId: FEATURED,
        workerId: WORKER,
        decision: 'Accept',
        recordedAt: DEMO_NOW,
      }),
    ).toThrow(DomainTransitionError);
  });

  it('accepts only after verification and increments accepted headcount once', () => {
    const session = respondToInvitation(verified(offered()), {
      opportunityId: FEATURED,
      workerId: WORKER,
      decision: 'Accept',
      recordedAt: DEMO_NOW,
    });
    expect(session.engagements[0]?.state).toBe('Accepted');
    expect(session.engagements[0]?.acceptedAt).toBe(DEMO_NOW);
    expect(opportunityById(session, FEATURED)?.lifecycle.acceptedEngagementCount).toBe(1);
    expect(opportunityById(session, FEATURED)?.lifecycle.state).toBe('Published');
  });

  it('moves the opportunity to Filled when acceptance reaches headcount', () => {
    const session = respondToInvitation(verified(offered({ ...form, headcount: 1 })), {
      opportunityId: FEATURED,
      workerId: WORKER,
      decision: 'Accept',
      recordedAt: DEMO_NOW,
    });
    expect(session.engagements[0]?.state).toBe('Accepted');
    expect(opportunityById(session, FEATURED)?.lifecycle.acceptedEngagementCount).toBe(1);
    expect(opportunityById(session, FEATURED)?.lifecycle.state).toBe('Filled');
  });

  it('declines directly from Offered without requiring verification or changing accepted count', () => {
    const session = respondToInvitation(offered(), {
      opportunityId: FEATURED,
      workerId: WORKER,
      decision: 'Decline',
      recordedAt: DEMO_NOW,
    });
    expect(session.engagements[0]?.state).toBe('Declined');
    expect(session.engagements[0]?.declinedAt).toBe(DEMO_NOW);
    expect(opportunityById(session, FEATURED)?.lifecycle.acceptedEngagementCount).toBe(0);
  });

  it('refuses a second response after the offer has left Offered', () => {
    const accepted = respondToInvitation(verified(offered()), {
      opportunityId: FEATURED,
      workerId: WORKER,
      decision: 'Accept',
      recordedAt: DEMO_NOW,
    });
    expect(() =>
      respondToInvitation(accepted, {
        opportunityId: FEATURED,
        workerId: WORKER,
        decision: 'Decline',
        recordedAt: DEMO_NOW,
      }),
    ).toThrow('A current worker offer is required for W-04.');
  });
});
