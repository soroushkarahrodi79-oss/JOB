import {
  consumeArrivalCode,
  generateSyntheticDemoWorld,
  transitionEngagement,
  type ArrivalCode,
} from '@platform/domain';
import { FixedClockAdapter } from '@platform/adapters';
import { DemoSessionConflictError, opportunityById, type DemoSession } from './demo-session';

/** A one-tab, fictional, employer-issued shared secret. Not an authentication credential. */
export interface DemoArrivalCode {
  readonly engagementId: string;
  readonly issuedAt: string;
  readonly code: ArrivalCode;
}

const WORKER_ID = 'WKR-DEMO-01';

function acceptedEngagement(session: DemoSession, opportunityId: string) {
  const opportunity = opportunityById(session, opportunityId);
  const engagement = session.engagements.find(
    (item) => item.opportunityId === opportunityId && item.workerId === WORKER_ID,
  );
  const accepted =
    engagement !== undefined &&
    (engagement.state === 'Accepted' || engagement.state === 'InProgress');
  const acceptance = session.engagementEvents.find(
    (event) => event.engagementId === engagement?.id && event.kind === 'Accepted',
  );
  if (
    session.seed !== generateSyntheticDemoWorld().seed ||
    opportunity === undefined ||
    engagement === undefined ||
    !accepted ||
    acceptance?.kind !== 'Accepted'
  ) {
    throw new DemoSessionConflictError(
      'W-05 requires an accepted engagement and its recorded terms.',
    );
  }
  return { opportunity, engagement, acceptance };
}

/**
 * A deliberate demo-clock move; never substitutes the actual browser/device clock for an arrival.
 * The operator can advance to this engagement's scheduled start, not to an arbitrary instant.
 */
export function advanceDemoClockToShiftStart(
  session: DemoSession,
  opportunityId: string,
): DemoSession {
  const { opportunity } = acceptedEngagement(session, opportunityId);
  if (session.activeActor !== 'employer' || opportunity.employerId !== 'EMP-DEMO-01') {
    throw new DemoSessionConflictError('Only the demo employer can advance the scenario clock.');
  }
  const start = opportunity.terms.workStartsAt;
  if (Date.parse(session.now) > Date.parse(start)) {
    throw new DemoSessionConflictError('The demo clock cannot move backwards.');
  }
  return session.now === start ? session : { ...session, now: start };
}

/** Issues the same code on repeat, but never creates one before a recorded acceptance. */
export function issueDemoArrivalCode(session: DemoSession, opportunityId: string): DemoSession {
  const { opportunity, engagement } = acceptedEngagement(session, opportunityId);
  if (session.activeActor !== 'employer' || opportunity.employerId !== engagement.employerId) {
    throw new DemoSessionConflictError('Only the opportunity employer may issue an arrival code.');
  }
  if (engagement.state !== 'Accepted') {
    throw new DemoSessionConflictError('Only accepted engagements can receive a new arrival code.');
  }
  if ((session.arrivalCodes ?? []).some((item) => item.engagementId === engagement.id)) {
    return session;
  }
  return {
    ...session,
    arrivalCodes: [
      ...(session.arrivalCodes ?? []),
      {
        engagementId: engagement.id,
        issuedAt: session.now,
        code: {
          // Clearly fictional, deterministic demo secret; never represented as production security.
          value: '681204',
          expiresAt: opportunity.terms.workEndsAt,
          used: false,
        },
      },
    ],
  };
}

/**
 * Arrival is a synthetic, deliberately triggered event, not proof of physical location or presence.
 * Functional code validation precedes the domain transition; failure does not change any record.
 */
export function checkInWithDemoCode(
  session: DemoSession,
  input: { readonly opportunityId: string; readonly code: string },
): DemoSession {
  const { opportunity, engagement } = acceptedEngagement(session, input.opportunityId);
  if (session.activeActor !== 'worker' || engagement.workerId !== WORKER_ID) {
    throw new DemoSessionConflictError('Only the invited demo worker may check in.');
  }
  if (engagement.state !== 'Accepted') {
    throw new DemoSessionConflictError('Only accepted engagements may check in.');
  }
  const issued = (session.arrivalCodes ?? []).find((item) => item.engagementId === engagement.id);
  if (issued === undefined) {
    throw new DemoSessionConflictError('The employer must issue a code before check-in.');
  }
  const recordedAt = new FixedClockAdapter(session.now).now();
  if (Date.parse(recordedAt) < Date.parse(opportunity.terms.workStartsAt)) {
    throw new DemoSessionConflictError('The demo shift has not started yet.');
  }
  const consumed = consumeArrivalCode(issued.code, input.code, recordedAt);
  const lifecycle = transitionEngagement(
    {
      state: engagement.state,
      eligibilityAtAcceptance: true,
      verificationSatisfied: true,
      proofTerminal: false,
      hasOpenDispute: false,
    },
    'BeginWork',
  );
  return {
    ...session,
    arrivalCodes: (session.arrivalCodes ?? []).map((item) =>
      item.engagementId === engagement.id ? { ...item, code: consumed } : item,
    ),
    engagements: session.engagements.map((item) =>
      item.id === engagement.id
        ? { ...item, state: lifecycle.state as 'InProgress', arrivedAt: recordedAt }
        : item,
    ),
    engagementEvents: [
      ...session.engagementEvents,
      {
        id: `${engagement.id}:arrived`,
        engagementId: engagement.id,
        kind: 'ArrivedSimulated',
        recordedAt,
        source: 'DemoSharedCode',
      },
    ],
  };
}
