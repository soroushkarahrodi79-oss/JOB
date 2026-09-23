import {
  generateSyntheticDemoWorld,
  transitionEngagement,
  transitionOpportunity,
} from '@platform/domain';
import { candidateList } from './candidate-list';
import {
  DemoSessionConflictError,
  opportunityById,
  type DemoAgreedTermsSnapshot,
  type DemoSession,
} from './demo-session';
import { lastIdentityAttempt } from './worker-verification';

export type WorkerInvitationDecision = 'Accept' | 'Decline';

const DEMO_WORKER_ID = 'WKR-DEMO-01';

/**
 * W-04 — respond to an existing worker invitation in the shared demo session.
 * Acceptance rechecks current eligibility and the W-03 simulated verification threshold.
 * Declining an Offered invitation never counts against worker reliability.
 * Neither response starts work, transfers funds or sends an external message.
 */
export function respondToInvitation(
  session: DemoSession,
  input: {
    readonly opportunityId: string;
    readonly workerId: string;
    readonly decision: WorkerInvitationDecision;
    readonly recordedAt: string;
  },
): DemoSession {
  const world = generateSyntheticDemoWorld();
  const opportunity = opportunityById(session, input.opportunityId);
  const engagement = session.engagements.find(
    (item) => item.opportunityId === input.opportunityId && item.workerId === input.workerId,
  );

  if (
    session.activeActor !== 'worker' ||
    session.seed !== world.seed ||
    input.workerId !== DEMO_WORKER_ID ||
    opportunity === undefined ||
    (opportunity.lifecycle.state !== 'Published' && opportunity.lifecycle.state !== 'Filled') ||
    engagement === undefined ||
    engagement.state !== 'Offered' ||
    !session.notifications.some(
      (notice) =>
        notice.id === `NOTE-DEMO-${input.opportunityId}-${input.workerId}` &&
        notice.recipientId === input.workerId &&
        notice.truth === 'MOCK',
    )
  ) {
    throw new DemoSessionConflictError('A current worker offer is required for W-04.');
  }

  if (input.decision === 'Decline') {
    const lifecycle = transitionEngagement(
      {
        state: engagement.state,
        eligibilityAtAcceptance: false,
        verificationSatisfied: false,
        proofTerminal: false,
        hasOpenDispute: false,
      },
      'Decline',
    );
    return {
      ...session,
      engagements: session.engagements.map((item) =>
        item.id === engagement.id
          ? { ...item, state: lifecycle.state as 'Declined', declinedAt: input.recordedAt }
          : item,
      ),
      engagementEvents: [
        ...(session.engagementEvents ?? []),
        {
          id: `${engagement.id}:declined`,
          engagementId: engagement.id,
          kind: 'Declined',
          recordedAt: input.recordedAt,
        },
      ],
    };
  }

  if (
    opportunity.lifecycle.state !== 'Published' ||
    opportunity.lifecycle.acceptedEngagementCount >= opportunity.lifecycle.headcount
  ) {
    throw new DemoSessionConflictError('Cannot accept an offer: no published position remains.');
  }

  const eligibleNow = candidateList(world, opportunity).ranked.some(
    (candidate) => candidate.workerId === input.workerId,
  );
  const verificationAttempt = lastIdentityAttempt(session, input.opportunityId, input.workerId);
  const verified = verificationAttempt?.result === 'VerifiedSimulated';
  const lifecycle = transitionEngagement(
    {
      state: engagement.state,
      eligibilityAtAcceptance: eligibleNow,
      verificationSatisfied: verified,
      proofTerminal: false,
      hasOpenDispute: false,
    },
    'AcceptInvitation',
  );

  if (verificationAttempt?.result !== 'VerifiedSimulated') {
    throw new DemoSessionConflictError(
      'Cannot record acceptance without simulated verification evidence.',
    );
  }
  const agreedTerms: DemoAgreedTermsSnapshot = {
    title: opportunity.title,
    terms: {
      ...opportunity.terms,
      amount: { ...opportunity.terms.amount },
      location: { ...opportunity.terms.location },
      ...(opportunity.terms.travelBoundary === undefined
        ? {}
        : { travelBoundary: { ...opportunity.terms.travelBoundary } }),
    },
    requirements: opportunity.requirements.map((requirement) => ({ ...requirement })),
    employerNote: opportunity.employerNote,
    commitment: {
      ...opportunity.commitment,
      amount: { ...opportunity.commitment.amount },
    },
  };

  const acceptedCount = opportunity.lifecycle.acceptedEngagementCount + 1;
  const opportunityWithAcceptedCount = {
    ...opportunity.lifecycle,
    acceptedEngagementCount: acceptedCount,
  };
  const opportunityLifecycle =
    acceptedCount === opportunity.lifecycle.headcount
      ? transitionOpportunity(opportunityWithAcceptedCount, 'Fill')
      : opportunityWithAcceptedCount;

  return {
    ...session,
    engagements: session.engagements.map((item) =>
      item.id === engagement.id
        ? { ...item, state: lifecycle.state as 'Accepted', acceptedAt: input.recordedAt }
        : item,
    ),
    opportunities: session.opportunities.map((item) =>
      item.id === opportunity.id ? { ...item, lifecycle: opportunityLifecycle } : item,
    ),
    engagementEvents: [
      ...(session.engagementEvents ?? []),
      {
        id: `${engagement.id}:accepted`,
        engagementId: engagement.id,
        kind: 'Accepted',
        recordedAt: input.recordedAt,
        agreedTerms,
        verification: {
          source: verificationAttempt.source,
          recordedAt: verificationAttempt.recordedAt,
        },
      },
    ],
  };
}
