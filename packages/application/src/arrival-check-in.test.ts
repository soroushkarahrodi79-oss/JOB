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
import {
  advanceDemoClockToShiftStart,
  checkInWithDemoCode,
  issueDemoArrivalCode,
} from './arrival-check-in';

const OPP = FEATURED_OPPORTUNITY_PLAN.id;
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
    id: OPP,
    employerId: FEATURED_OPPORTUNITY_PLAN.employerId,
    recordedAt: DEMO_NOW,
  });
  session = answerFactor(session, OPP, 'DirectionAndControl', 'employmentLike', DEMO_NOW);
  session = markClassificationShown(session, OPP);
  session = publishOpportunity(session, OPP, DEMO_NOW);
  session = inviteWorker(session, {
    opportunityId: OPP,
    workerId: WORKER,
    employerId: FEATURED_OPPORTUNITY_PLAN.employerId,
    opportunityTitle: FEATURED_OPPORTUNITY_PLAN.title,
    recordedAt: DEMO_NOW,
  });
  session = selectActor(session, 'worker');
  session = recordSimulatedIdentityOutcome(session, {
    opportunityId: OPP,
    workerId: WORKER,
    result: {
      ok: true,
      value: { verifiedAt: DEMO_NOW, source: 'SimulatedIdentityProvider' },
    },
  });
  return respondToInvitation(session, {
    opportunityId: OPP,
    workerId: WORKER,
    decision: 'Accept',
    recordedAt: DEMO_NOW,
  });
}

function issued(): DemoSession {
  return issueDemoArrivalCode(selectActor(accepted(), 'employer'), OPP);
}

function ready(): DemoSession {
  return selectActor(advanceDemoClockToShiftStart(issued(), OPP), 'worker');
}

describe('W-05 one-world demo check-in', () => {
  it('will not issue a code to a worker who has not accepted or to a different role', () => {
    expect(() =>
      issueDemoArrivalCode(selectActor(initialDemoSession(), 'employer'), OPP),
    ).toThrow();
    expect(() => issueDemoArrivalCode(accepted(), OPP)).toThrow();
  });

  it('issues one short demo code without starting work or generating an arrival event', () => {
    const once = issued();
    const twice = issueDemoArrivalCode(once, OPP);
    expect(twice).toEqual(once);
    expect(once.arrivalCodes).toHaveLength(1);
    expect(once.arrivalCodes[0]?.code.used).toBe(false);
    expect(once.engagements[0]?.state).toBe('Accepted');
    expect(once.engagementEvents.map((event) => event.kind)).toEqual(['Invited', 'Accepted']);
  });

  it('requires explicit demo-clock advancement before check-in and never reads device time', () => {
    const before = selectActor(issued(), 'worker');
    expect(() => checkInWithDemoCode(before, { opportunityId: OPP, code: '681204' })).toThrow(
      'The demo shift has not started yet',
    );
    expect(before.now).toBe(DEMO_NOW);
    expect(before.engagements[0]?.state).toBe('Accepted');
  });

  it('rejects incorrect, expired, replayed or missing code without a fabricated event', () => {
    const session = ready();
    expect(() => checkInWithDemoCode(session, { opportunityId: OPP, code: '999999' })).toThrow(
      DomainTransitionError,
    );
    expect(session.engagementEvents).toHaveLength(2);
    expect(session.arrivalCodes[0]?.code.used).toBe(false);
    const expired: DemoSession = {
      ...session,
      arrivalCodes: session.arrivalCodes.map((item) => ({
        ...item,
        code: { ...item.code, expiresAt: DEMO_NOW },
      })),
    };
    expect(() => checkInWithDemoCode(expired, { opportunityId: OPP, code: '681204' })).toThrow(
      DomainTransitionError,
    );
    expect(() =>
      checkInWithDemoCode({ ...session, arrivalCodes: [] }, { opportunityId: OPP, code: '681204' }),
    ).toThrow();
    const arrived = checkInWithDemoCode(session, { opportunityId: OPP, code: '681204' });
    expect(() => checkInWithDemoCode(arrived, { opportunityId: OPP, code: '681204' })).toThrow();
    expect(arrived.engagementEvents).toHaveLength(3);
  });

  it('records a single simulated arrival from a valid shared code while retaining agreed terms', () => {
    const session = ready();
    const acceptedEvent = session.engagementEvents.find((event) => event.kind === 'Accepted');
    const result = checkInWithDemoCode(session, { opportunityId: OPP, code: '681204' });
    expect(result.engagements[0]?.state).toBe('InProgress');
    expect(result.engagements[0]?.arrivedAt).toBe(
      opportunityById(session, OPP)?.terms.workStartsAt,
    );
    expect(result.arrivalCodes[0]?.code.used).toBe(true);
    expect(result.engagementEvents[2]).toMatchObject({
      kind: 'ArrivedSimulated',
      recordedAt: result.now,
      source: 'DemoSharedCode',
    });
    expect(result.engagementEvents.find((event) => event.kind === 'Accepted')).toEqual(
      acceptedEvent,
    );
    expect(result.notifications).toEqual(session.notifications);
    expect(
      result.engagementEvents.filter((event) => event.kind === 'ArrivedSimulated'),
    ).toHaveLength(1);
  });
});
