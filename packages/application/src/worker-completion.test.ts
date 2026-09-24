import { describe, expect, it } from 'vitest';
import { DEMO_NOW, FEATURED_OPPORTUNITY_PLAN } from '@platform/domain';
import {
  DemoSessionConflictError,
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
import { submitCompletionProof } from './worker-completion';

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

/** Worker actor, engagement Accepted (post W-04), before any check-in. */
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

/** Worker actor, engagement InProgress: employer issued the code and the worker checked in. */
function inProgress(): DemoSession {
  const acceptedSession = accepted();
  const engagement = acceptedSession.engagements[0];
  if (engagement === undefined) throw new Error('missing engagement');
  const withCode = issueArrivalCode(selectActor(acceptedSession, 'employer'), {
    engagementId: engagement.id,
    employerId: EMPLOYER,
  });
  const code = withCode.engagements[0]?.arrivalCode?.value;
  if (code === undefined) throw new Error('missing arrival code');
  return checkInWorker(selectActor(withCode, 'worker'), {
    engagementId: engagement.id,
    workerId: WORKER,
    suppliedCode: code,
    recordedAt: DEMO_NOW,
  });
}

const engagementId = (session: DemoSession): string => {
  const id = session.engagements[0]?.id;
  if (id === undefined) throw new Error('missing engagement');
  return id;
};

describe('W-06 completion proof submission', () => {
  it('records a self-declared completion attestation and moves proof Awaited → Submitted', () => {
    const session = inProgress();
    const result = submitCompletionProof(session, {
      engagementId: engagementId(session),
      workerId: WORKER,
      recordedAt: DEMO_NOW,
    });
    expect(result.engagements[0]?.completionProof?.state).toBe('Submitted');
    expect(result.engagements[0]?.completionProof?.attestation).toMatchObject({
      criterionId: 'completion',
      state: 'Satisfied',
      strength: 'SelfDeclared',
      recordedAt: DEMO_NOW,
    });
    expect(result.engagementEvents.at(-1)).toMatchObject({
      kind: 'CompletionSubmitted',
      engagementId: engagementId(session),
    });
  });

  it('does not complete the engagement, approve the proof or release payment', () => {
    const session = inProgress();
    const result = submitCompletionProof(session, {
      engagementId: engagementId(session),
      workerId: WORKER,
      recordedAt: DEMO_NOW,
    });
    // Submission is not approval: the engagement stays InProgress and the proof stays non-terminal.
    expect(result.engagements[0]?.state).toBe('InProgress');
    expect(result.engagements[0]?.completionProof?.state).toBe('Submitted');
    // No payment state is advanced by submission.
    expect(result.opportunities[0]?.paymentState).toBe('CommitmentRecorded');
  });

  it('rejects submission before check-in (engagement not InProgress)', () => {
    const session = accepted();
    expect(session.engagements[0]?.state).toBe('Accepted');
    expect(() =>
      submitCompletionProof(session, {
        engagementId: engagementId(session),
        workerId: WORKER,
        recordedAt: DEMO_NOW,
      }),
    ).toThrow(DemoSessionConflictError);
    expect(session.engagementEvents.some((event) => event.kind === 'CompletionSubmitted')).toBe(
      false,
    );
  });

  it('rejects submission by a non-worker actor', () => {
    const session = selectActor(inProgress(), 'employer');
    expect(() =>
      submitCompletionProof(session, {
        engagementId: engagementId(session),
        workerId: WORKER,
        recordedAt: DEMO_NOW,
      }),
    ).toThrow(DemoSessionConflictError);
  });

  it('is idempotent: a repeated submission creates no second record or event', () => {
    const once = submitCompletionProof(inProgress(), {
      engagementId: engagementId(inProgress()),
      workerId: WORKER,
      recordedAt: DEMO_NOW,
    });
    const twice = submitCompletionProof(once, {
      engagementId: engagementId(once),
      workerId: WORKER,
      recordedAt: DEMO_NOW,
    });
    expect(twice).toBe(once);
    expect(
      twice.engagementEvents.filter((event) => event.kind === 'CompletionSubmitted'),
    ).toHaveLength(1);
  });

  it('preserves the accepted-terms snapshot and the recorded arrival', () => {
    const session = inProgress();
    const acceptedBefore = session.engagementEvents.find((event) => event.kind === 'Accepted');
    const result = submitCompletionProof(session, {
      engagementId: engagementId(session),
      workerId: WORKER,
      recordedAt: DEMO_NOW,
    });
    expect(result.engagementEvents.find((event) => event.kind === 'Accepted')).toEqual(
      acceptedBefore,
    );
    expect(result.engagements[0]?.arrivalAttestation?.criterionId).toBe('arrival');
    expect(result.engagements[0]?.arrivalCode?.used).toBe(true);
  });
});
