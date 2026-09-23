import {
  generateSyntheticDemoWorld,
  transitionEngagement,
  transitionOpportunity,
} from '@platform/domain';
import { candidateList } from './candidate-list';
import { DemoSessionConflictError, opportunityById, type DemoSession } from './demo-session';
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
  const verified =
    lastIdentityAttempt(session, input.opportunityId, input.workerId)?.result ===
    'VerifiedSimulated';
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
  };
}
