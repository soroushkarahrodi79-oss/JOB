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
  publishOpportunity,
  selectActor,
  type DemoSession,
} from './demo-session';
import { validateOpportunityForm, type OpportunityFormValues } from './opportunity-input';
import { recordSimulatedIdentityOutcome } from './worker-verification';
import { respondToInvitation } from './worker-response';
import { checkInWorker, issueArrivalCode } from './worker-checkin';

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

function accepted(): DemoSession {
  const validated = validateOpportunityForm(form);
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
  session = selectActor(session, 'worker');
  session = recordSimulatedIdentityOutcome(session, {
    opportunityId: FEATURED,
    workerId: WORKER,
    result: {
      ok: true,
      value: { verifiedAt: DEMO_NOW, source: 'SimulatedIdentityProvider' },
    },
  });
  return respondToInvitation(session, {
    opportunityId: FEATURED,
    workerId: WORKER,
    decision: 'Accept',
    recordedAt: DEMO_NOW,
  });
}

function withCode(): DemoSession {
  const workerSession = accepted();
  const engagement = workerSession.engagements[0];
  if (engagement === undefined) throw new Error('missing engagement');
  return issueArrivalCode(selectActor(workerSession, 'employer'), {
    engagementId: engagement.id,
    employerId: EMPLOYER,
  });
}

describe('W-05A arrival check-in', () => {
  it('issues one deterministic short code only for an Accepted employer engagement', () => {
    const session = withCode();
    expect(session.engagements[0]?.arrivalCode?.value).toMatch(/^\d{4}$/);
    expect(session.engagements[0]?.arrivalCode?.used).toBe(false);
    expect(session.engagements[0]?.arrivalCode?.expiresAt).toBe(
      FEATURED_OPPORTUNITY_PLAN.workEndsAt,
    );
    const again = issueArrivalCode(session, {
      engagementId: session.engagements[0]?.id ?? '',
      employerId: EMPLOYER,
    });
    expect(again).toEqual(session);
  });

  it('rejects a wrong code without changing engagement or recording arrival', () => {
    const employerSession = withCode();
    const engagement = employerSession.engagements[0];
    if (engagement === undefined) throw new Error('missing engagement');
    const workerSession = selectActor(employerSession, 'worker');
    expect(() =>
      checkInWorker(workerSession, {
        engagementId: engagement.id,
        workerId: WORKER,
        suppliedCode: '0000',
        recordedAt: DEMO_NOW,
      }),
    ).toThrow(DomainTransitionError);
    expect(workerSession.engagements[0]?.state).toBe('Accepted');
    expect(workerSession.engagementEvents.some((event) => event.kind === 'Arrived')).toBe(false);
  });

  it('consumes the code, records simulated arrival evidence and begins work', () => {
    const employerSession = withCode();
    const engagement = employerSession.engagements[0];
    const code = engagement?.arrivalCode?.value;
    if (engagement === undefined || code === undefined) throw new Error('missing arrival code');
    const session = checkInWorker(selectActor(employerSession, 'worker'), {
      engagementId: engagement.id,
      workerId: WORKER,
      suppliedCode: code,
      recordedAt: DEMO_NOW,
    });
    expect(session.engagements[0]?.state).toBe('InProgress');
    expect(session.engagements[0]?.arrivalCode?.used).toBe(true);
    expect(session.engagements[0]?.arrivalAttestation).toMatchObject({
      criterionId: 'arrival',
      state: 'Satisfied',
      strength: 'ProviderVerifiedSimulated',
      recordedAt: DEMO_NOW,
    });
    expect(session.engagementEvents.at(-1)?.kind).toBe('Arrived');
  });

  it('rejects replay after the engagement has begun', () => {
    const employerSession = withCode();
    const engagement = employerSession.engagements[0];
    const code = engagement?.arrivalCode?.value;
    if (engagement === undefined || code === undefined) throw new Error('missing arrival code');
    const inProgress = checkInWorker(selectActor(employerSession, 'worker'), {
      engagementId: engagement.id,
      workerId: WORKER,
      suppliedCode: code,
      recordedAt: DEMO_NOW,
    });
    expect(() =>
      checkInWorker(inProgress, {
        engagementId: engagement.id,
        workerId: WORKER,
        suppliedCode: code,
        recordedAt: DEMO_NOW,
      }),
    ).toThrow('A current Accepted worker engagement with a code is required.');
  });

  it('rejects a code after the agreed shift end', () => {
    const employerSession = withCode();
    const engagement = employerSession.engagements[0];
    const code = engagement?.arrivalCode?.value;
    if (engagement === undefined || code === undefined) throw new Error('missing arrival code');
    expect(() =>
      checkInWorker(selectActor(employerSession, 'worker'), {
        engagementId: engagement.id,
        workerId: WORKER,
        suppliedCode: code,
        recordedAt: '2026-09-23T19:00:00.000Z',
      }),
    ).toThrow(DomainTransitionError);
  });
});
