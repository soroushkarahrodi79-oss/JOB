import { transitionProofOfWork, type Attestation } from '@platform/domain';
import {
  DemoSessionConflictError,
  type DemoCompletionProof,
  type DemoEngagementRecord,
  type DemoSession,
} from './demo-session';

const DEMO_WORKER_ID = 'WKR-DEMO-01';

function engagementById(
  session: DemoSession,
  engagementId: string,
): DemoEngagementRecord | undefined {
  return session.engagements.find((item) => item.id === engagementId);
}

/**
 * W-06 — the worker submits completion proof for an in-progress engagement.
 *
 * The domain owns the guard: `transitionProofOfWork(..., 'Submit')` only moves `Awaited → Submitted`
 * while the engagement is `InProgress`, and starts no response window, countdown or automatic
 * outcome (state-transitions.md). The completion attestation is `SelfDeclared`: the worker declares
 * the work done, recorded faithfully but not verified — submission is not employer approval, does
 * not complete the engagement and releases no payment.
 *
 * Idempotent: once a completion proof exists the same session is returned, so a repeated or replayed
 * submission never writes a second record or event.
 */
export function submitCompletionProof(
  session: DemoSession,
  input: {
    readonly engagementId: string;
    readonly workerId: string;
    readonly recordedAt: string;
  },
): DemoSession {
  const engagement = engagementById(session, input.engagementId);

  if (
    session.activeActor !== 'worker' ||
    input.workerId !== DEMO_WORKER_ID ||
    engagement === undefined ||
    engagement.workerId !== input.workerId ||
    engagement.state !== 'InProgress'
  ) {
    throw new DemoSessionConflictError(
      'An in-progress worker engagement is required to submit completion proof.',
    );
  }

  // Submission is deliberate and single: a completion proof already on the engagement is returned
  // unchanged, never a second record or event.
  if (engagement.completionProof !== undefined) return session;

  // The domain refuses anything but Awaited → Submitted while InProgress; the application supplies
  // the inputs and does not re-implement the guard.
  const lifecycle = transitionProofOfWork(
    { state: 'Awaited', engagementInProgress: true, hasContestingReason: false },
    'Submit',
  );

  const completionAttestation: Attestation = {
    criterionId: 'completion',
    state: 'Satisfied',
    strength: 'SelfDeclared',
    recordedAt: input.recordedAt,
  };

  const completionProof: DemoCompletionProof = {
    state: lifecycle.state,
    attestation: completionAttestation,
    submittedAt: input.recordedAt,
  };

  return {
    ...session,
    engagements: session.engagements.map((item) =>
      item.id === engagement.id ? { ...item, completionProof } : item,
    ),
    engagementEvents: [
      ...(session.engagementEvents ?? []),
      {
        id: `${engagement.id}:completion-submitted`,
        engagementId: engagement.id,
        kind: 'CompletionSubmitted',
        recordedAt: input.recordedAt,
        completionAttestation,
      },
    ],
  };
}
