import { generateSyntheticDemoWorld, type Attestation, type ProviderResult } from '@platform/domain';
import {
  DemoSessionConflictError,
  opportunityById,
  type DemoSession,
} from './demo-session';

/** Only a fictional provider outcome is stored: never an identity number, document or image. */
export interface DemoIdentityAttempt {
  readonly opportunityId: string;
  readonly workerId: string;
  readonly result: 'VerifiedSimulated' | 'RejectedSimulated' | 'TimeoutSimulated' | 'InconclusiveSimulated';
  readonly source: 'SimulatedIdentityProvider';
  readonly recordedAt: string;
  readonly attestation?: Attestation;
}

/** All outcomes remain in the one browser-tab session; the latest result is displayed at W-03. */
export function lastIdentityAttempt(
  session: DemoSession,
  opportunityId: string,
  workerId: string,
): DemoIdentityAttempt | undefined {
  return (session.identityAttempts ?? [])
    .filter((item) => item.opportunityId === opportunityId && item.workerId === workerId)
    .at(-1);
}

/**
 * Record one attempt from the EXISTING simulated identity provider, not a UI-only "verified" flag.
 * Authorization is repeated here so a direct caller cannot create an identity attestation by
 * visiting a URL, changing role or supplying a worker who did not receive this opportunity.
 * A recorded success is idempotent; rejection, timeout and inconclusive outcomes may be retried.
 * The provider's rejection reason is deliberately not persisted (it may contain personal data).
 */
export function recordSimulatedIdentityOutcome(
  session: DemoSession,
  input: {
    readonly opportunityId: string;
    readonly workerId: string;
    readonly result: ProviderResult<{
      readonly verifiedAt: string;
      readonly source: 'SimulatedIdentityProvider';
    }>;
  },
): DemoSession {
  const world = generateSyntheticDemoWorld();
  const opportunity = opportunityById(session, input.opportunityId);
  if (
    session.activeActor !== 'worker' ||
    session.seed !== world.seed ||
    input.workerId !== 'WKR-DEMO-01' ||
    opportunity?.lifecycle.state !== 'Published' ||
    !session.engagements.some(
      (engagement) =>
        engagement.opportunityId === input.opportunityId &&
        engagement.workerId === input.workerId &&
        engagement.state === 'Offered',
    ) ||
    !session.notifications.some(
      (notice) =>
        notice.id === `NOTE-DEMO-${input.opportunityId}-${input.workerId}` &&
        notice.recipientId === input.workerId &&
        notice.truth === 'MOCK',
    )
  ) {
    throw new DemoSessionConflictError('A current worker invitation is required for W-03.');
  }

  if (lastIdentityAttempt(session, input.opportunityId, input.workerId)?.result === 'VerifiedSimulated') {
    return session;
  }

  const result: DemoIdentityAttempt = input.result.ok
    ? {
        opportunityId: input.opportunityId,
        workerId: input.workerId,
        result: 'VerifiedSimulated',
        source: input.result.value.source,
        recordedAt: input.result.value.verifiedAt,
        attestation: {
          criterionId: 'identity',
          state: 'Satisfied',
          strength: 'ProviderVerifiedSimulated',
          recordedAt: input.result.value.verifiedAt,
        },
      }
    : {
        opportunityId: input.opportunityId,
        workerId: input.workerId,
        result:
          input.result.failure.kind === 'Rejected'
            ? 'RejectedSimulated'
            : input.result.failure.kind === 'Timeout'
              ? 'TimeoutSimulated'
              : 'InconclusiveSimulated',
        source: 'SimulatedIdentityProvider',
        recordedAt: session.now,
      };
  return { ...session, identityAttempts: [...(session.identityAttempts ?? []), result] };
}
