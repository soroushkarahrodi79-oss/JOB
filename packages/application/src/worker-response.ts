import {
  generateSyntheticDemoWorld,
  transitionEngagement,
  transitionOpportunity,
  type EligibilityRequirement,
  type OpportunityTerms,
} from '@platform/domain';
import { candidateList } from './candidate-list';
import {
  DemoSessionConflictError,
  opportunityById,
  type DemoSession,
} from './demo-session';
import { lastIdentityAttempt } from './worker-verification';

/** One append-only act by the synthetic worker. Acceptance freezes precisely the terms shown. */
export interface DemoResponseEvent {
  readonly engagementId: string;
  readonly opportunityId: string;
  readonly workerId: string;
  readonly action: 'Accepted' | 'Declined';
  readonly recordedAt: string;
  readonly agreedTitle?: string;
  readonly agreedTerms?: OpportunityTerms;
  readonly agreedRequirements?: readonly EligibilityRequirement[];
}

function snapshotTerms(terms: OpportunityTerms): OpportunityTerms {
  return {
    ...terms,
    amount: { ...terms.amount },
    location: { ...terms.location },
    ...(terms.travelBoundary === undefined
      ? {}
      : { travelBoundary: { ...terms.travelBoundary } }),
  };
}

/**
 * The invite-only portion of W-04. A bare URL, role switch or invented response cannot create
 * an engagement: it must refer to the same existing, published invitation and MOCK notification.
 * Declining needs no verification. Accepting requires a recorded W-03 success and CURRENT
 * eligibility. The domain transition authoritatively enforces those acceptance guards.
 * No payment state is changed, and this demo is not real worker authentication or contracting.
 */
export function respondToInvitation(
  session: DemoSession,
  input: {
    readonly opportunityId: string;
    readonly workerId: string;
    readonly action: 'Accept' | 'Decline';
  },
): DemoSession {
  const opportunity = opportunityById(session, input.opportunityId);
  const engagement = session.engagements.find(
    (record) =>
      record.opportunityId === input.opportunityId && record.workerId === input.workerId,
  );
  const world = generateSyntheticDemoWorld();
  if (
    session.activeActor !== 'worker' ||
    session.seed !== world.seed ||
    input.workerId !== 'WKR-DEMO-01' ||
    opportunity === undefined ||
    opportunity.terms.acceptanceMode !== 'InviteOnly' ||
    engagement === undefined ||
    !session.notifications.some(
      (notice) =>
        notice.id === `NOTE-DEMO-${input.opportunityId}-${input.workerId}` &&
        notice.recipientId === input.workerId &&
        notice.truth === 'MOCK',
    )
  ) {
    throw new DemoSessionConflictError('A matching worker invitation is required for W-04.');
  }

  // Repeated identical actions must neither duplicate an event nor advance the headcount twice.
  if (
    (input.action === 'Accept' && engagement.state === 'Accepted') ||
    (input.action === 'Decline' && engagement.state === 'Declined')
  ) {
    return session;
  }
  if (engagement.state !== 'Offered') {
    throw new DemoSessionConflictError('An answered invitation cannot be answered differently.');
  }

  const accepting = input.action === 'Accept';
  if (accepting && opportunity.lifecycle.state !== 'Published') {
    throw new DemoSessionConflictError('Only an open published opportunity may be accepted.');
  }
  const eligibleNow =
    accepting &&
    candidateList(world, opportunity).ranked.some((candidate) => candidate.workerId === input.workerId);
  const verified =
    lastIdentityAttempt(session, input.opportunityId, input.workerId)?.result ===
    'VerifiedSimulated';
  if (accepting && opportunity.lifecycle.acceptedEngagementCount >= opportunity.lifecycle.headcount) {
    throw new DemoSessionConflictError('All positions have already been accepted.');
  }
  const result = transitionEngagement(
    {
      state: engagement.state,
      eligibilityAtAcceptance: eligibleNow,
      verificationSatisfied: verified,
      proofTerminal: false,
      hasOpenDispute: false,
    },
    accepting ? 'AcceptInvitation' : 'Decline',
  );
  const recordedAt = session.now;
  const event: DemoResponseEvent = accepting
    ? {
        engagementId: engagement.id,
        opportunityId: input.opportunityId,
        workerId: input.workerId,
        action: 'Accepted',
        recordedAt,
        agreedTitle: opportunity.title,
        agreedTerms: snapshotTerms(opportunity.terms),
        agreedRequirements: opportunity.requirements.map((requirement) => ({ ...requirement })),
      }
    : {
        engagementId: engagement.id,
        opportunityId: input.opportunityId,
        workerId: input.workerId,
        action: 'Declined',
        recordedAt,
      };

  const updatedCount = opportunity.lifecycle.acceptedEngagementCount + (accepting ? 1 : 0);
  const countedLifecycle = {
    ...opportunity.lifecycle,
    acceptedEngagementCount: updatedCount,
  };
  const lifecycle =
    accepting && updatedCount === opportunity.lifecycle.headcount
      ? transitionOpportunity(countedLifecycle, 'Fill')
      : countedLifecycle;
  return {
    ...session,
    engagements: session.engagements.map((item) =>
      item.id === engagement.id ? { ...item, state: result.state as 'Accepted' | 'Declined' } : item,
    ),
    opportunities: session.opportunities.map((item) =>
      item.id === opportunity.id ? { ...item, lifecycle } : item,
    ),
    responseEvents: [...(session.responseEvents ?? []), event],
  };
}

export function responseForEngagement(
  session: DemoSession,
  engagementId: string,
): DemoResponseEvent | undefined {
  return (session.responseEvents ?? []).find((event) => event.engagementId === engagementId);
}
