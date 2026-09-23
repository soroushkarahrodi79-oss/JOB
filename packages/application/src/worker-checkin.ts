import {
  consumeArrivalCode,
  transitionEngagement,
  type ArrivalCode,
  type Attestation,
} from '@platform/domain';
import {
  DemoSessionConflictError,
  opportunityById,
  type DemoEngagementRecord,
  type DemoSession,
} from './demo-session';

const DEMO_WORKER_ID = 'WKR-DEMO-01';

function deterministicShortCode(engagementId: string): string {
  let hash = 0;
  for (const char of engagementId) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return String(1000 + (Math.abs(hash) % 9000));
}

function engagementById(session: DemoSession, engagementId: string): DemoEngagementRecord | undefined {
  return session.engagements.find((item) => item.id === engagementId);
}

/**
 * E-06A — issue the short arrival code for an Accepted engagement.
 *
 * The prototype deliberately avoids inventing a separate expiry duration: the accepted shift end
 * is the validity ceiling. The code is deterministic only inside this synthetic demo world and is
 * not presented as a production security mechanism.
 */
export function issueArrivalCode(
  session: DemoSession,
  input: {
    readonly engagementId: string;
    readonly employerId: string;
  },
): DemoSession {
  const engagement = engagementById(session, input.engagementId);
  const opportunity =
    engagement === undefined ? undefined : opportunityById(session, engagement.opportunityId);

  if (
    session.activeActor !== 'employer' ||
    engagement === undefined ||
    opportunity === undefined ||
    engagement.employerId !== input.employerId ||
    engagement.state !== 'Accepted'
  ) {
    throw new DemoSessionConflictError('An Accepted employer engagement is required to issue a code.');
  }

  if (engagement.arrivalCode !== undefined) return session;

  const code: ArrivalCode = {
    value: deterministicShortCode(engagement.id),
    expiresAt: opportunity.terms.workEndsAt,
    used: false,
  };

  return {
    ...session,
    engagements: session.engagements.map((item) =>
      item.id === engagement.id ? { ...item, arrivalCode: code } : item,
    ),
  };
}

/**
 * W-05A — consume the employer-issued code and record arrival.
 *
 * The domain owns wrong, expired and replayed-code refusal. Only after it succeeds does the
 * canonical engagement lifecycle move Accepted to InProgress. Device/location strength remains
 * simulated; the browser never reads real location.
 */
export function checkInWorker(
  session: DemoSession,
  input: {
    readonly engagementId: string;
    readonly workerId: string;
    readonly suppliedCode: string;
    readonly recordedAt: string;
  },
): DemoSession {
  const engagement = engagementById(session, input.engagementId);

  if (
    session.activeActor !== 'worker' ||
    input.workerId !== DEMO_WORKER_ID ||
    engagement === undefined ||
    engagement.workerId !== input.workerId ||
    engagement.state !== 'Accepted' ||
    engagement.arrivalCode === undefined
  ) {
    throw new DemoSessionConflictError('A current Accepted worker engagement with a code is required.');
  }

  const consumed = consumeArrivalCode(
    engagement.arrivalCode,
    input.suppliedCode.trim(),
    input.recordedAt,
  );
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

  const arrivalAttestation: Attestation = {
    criterionId: 'arrival',
    state: 'Satisfied',
    strength: 'ProviderVerifiedSimulated',
    recordedAt: input.recordedAt,
  };

  return {
    ...session,
    engagements: session.engagements.map((item) =>
      item.id === engagement.id
        ? {
            ...item,
            state: lifecycle.state as 'InProgress',
            arrivalCode: consumed,
            arrivalAttestation,
          }
        : item,
    ),
    engagementEvents: [
      ...(session.engagementEvents ?? []),
      {
        id: `${engagement.id}:arrived`,
        engagementId: engagement.id,
        kind: 'Arrived',
        recordedAt: input.recordedAt,
        arrivalAttestation,
      },
    ],
  };
}
