'use client';

import { SimulatedIdentityVerificationAdapter } from '@platform/adapters';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  answerFactor,
  checkInWorker,
  createOpportunity,
  discardDraft,
  initialDemoSession,
  inviteWorker,
  issueArrivalCode,
  markClassificationShown,
  opportunityById,
  publishOpportunity,
  recordSimulatedIdentityOutcome,
  respondToInvitation,
  selectActor,
  type ActorKey,
  type DemoSession,
  type FactorAnswerKey,
  type IdentityDemoOutcome,
  type ValidatedOpportunityInput,
  type WorkerInvitationDecision,
} from '@platform/application';
import { FEATURED_OPPORTUNITY_PLAN, type ClassificationFactorKind } from '@platform/domain';

// The demo session: where the shared world's state lives while a reviewer walks the prototype.
//
// WHAT THIS ACTUALLY IS. One React state value, held in memory and mirrored into
// `sessionStorage` so a reload of the same browser tab resumes where it was. That is the whole
// mechanism. Concretely:
//
//   · it lasts for one browser tab and no longer — a second tab starts a fresh world;
//   · it is not shared between devices, browsers, or people, and never leaves the browser;
//   · nothing is written to a server and there is no database (architecture/data-model.md: there
//     is no schema and none is provisioned);
//   · closing the tab ends it.
//
// The chrome says this in Persian at the point of use rather than implying a stored account. It is
// NOT authentication: SH-01 chooses which actor's view to render, and truth-matrix row 17
// (authentication, `SIMULATED`) is a different capability that this does not implement.
//
// It calls the application layer's use cases and stores what they return. No domain rule is
// re-implemented here; a refused transition throws out of the use case and the screen shows it.

const STORAGE_KEY = 'platform.demo-session.v2';

interface DemoSessionContextValue {
  readonly session: DemoSession;
  /** False until `sessionStorage` has been read, so server and first client render agree. */
  readonly restored: boolean;
  readonly chooseActor: (actor: ActorKey) => void;
  readonly createFeaturedOpportunity: (input: ValidatedOpportunityInput) => void;
  readonly answer: (kind: ClassificationFactorKind, answer: FactorAnswerKey) => void;
  readonly markShown: (opportunityId: string) => void;
  readonly publish: (opportunityId: string) => void;
  readonly invite: (opportunityId: string, workerId: string) => void;
  readonly simulateIdentityCheck: (
    opportunityId: string,
    outcome: IdentityDemoOutcome,
  ) => Promise<void>;
  readonly respondToWorkerInvitation: (
    opportunityId: string,
    decision: WorkerInvitationDecision,
  ) => void;
  readonly issueWorkerArrivalCode: (engagementId: string) => void;
  readonly checkIn: (engagementId: string, suppliedCode: string) => void;
  readonly abandonDraft: () => void;
}

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

function read(): DemoSession | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const stored = JSON.parse(raw) as DemoSession;
    return {
      ...stored,
      identityAttempts: stored.identityAttempts ?? [],
      engagementEvents: stored.engagementEvents ?? [],
    };
  } catch {
    // Private mode, blocked storage, or a stale shape. An unrestorable session is a fresh one.
    return null;
  }
}

function write(session: DemoSession): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage is a convenience here; the in-memory session is the authority for this tab.
  }
}

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession>(initialDemoSession);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const stored = read();
    if (stored !== null) setSession(stored);
    setRestored(true);
  }, []);

  const apply = useCallback((next: (current: DemoSession) => DemoSession) => {
    setSession((current) => {
      const updated = next(current);
      write(updated);
      return updated;
    });
  }, []);

  const value = useMemo<DemoSessionContextValue>(
    () => ({
      session,
      restored,
      chooseActor: (actor) => {
        apply((current) => selectActor(current, actor));
      },
      createFeaturedOpportunity: (input) => {
        apply((current) =>
          createOpportunity(current, input, {
            // The identity is the shared world's: this creates the ONE featured transaction every
            // later story runs through, never a second one.
            id: FEATURED_OPPORTUNITY_PLAN.id,
            employerId: FEATURED_OPPORTUNITY_PLAN.employerId,
            recordedAt: current.now,
          }),
        );
      },
      answer: (kind, chosen) => {
        apply((current) =>
          answerFactor(current, FEATURED_OPPORTUNITY_PLAN.id, kind, chosen, current.now),
        );
      },
      markShown: (opportunityId) => {
        apply((current) => markClassificationShown(current, opportunityId));
      },
      publish: (opportunityId) => {
        apply((current) => publishOpportunity(current, opportunityId, current.now));
      },
      invite: (opportunityId, workerId) => {
        apply((current) => {
          const opportunity = opportunityById(current, opportunityId);
          if (opportunity === undefined) return current;
          return inviteWorker(current, {
            opportunityId,
            workerId,
            employerId: opportunity.employerId,
            opportunityTitle: opportunity.title,
            recordedAt: current.now,
          });
        });
      },
      simulateIdentityCheck: async (opportunityId, outcome) => {
        // The three explicit demo controls configure an existing simulated port, not a real
        // verification rail. No personal data is entered or transmitted.
        const response =
          outcome === 'Success'
            ? {
                ok: true as const,
                value: {
                  verifiedAt: session.now,
                  source: 'SimulatedIdentityProvider' as const,
                },
              }
            : outcome === 'Rejected'
              ? {
                  ok: false as const,
                  failure: {
                    kind: 'Rejected' as const,
                    recoverable: false as const,
                    reason: 'Demonstration rejection',
                  },
                }
              : {
                  ok: false as const,
                  failure: { kind: 'Timeout' as const, recoverable: true as const },
                };
        const adapter = new SimulatedIdentityVerificationAdapter([response]);
        const result = await adapter.verifyWorker('WKR-DEMO-01');
        apply((current) =>
          recordSimulatedIdentityOutcome(current, {
            opportunityId,
            workerId: 'WKR-DEMO-01',
            result,
          }),
        );
      },
      respondToWorkerInvitation: (opportunityId, decision) => {
        apply((current) =>
          respondToInvitation(current, {
            opportunityId,
            workerId: 'WKR-DEMO-01',
            decision,
            recordedAt: current.now,
          }),
        );
      },
      issueWorkerArrivalCode: (engagementId) => {
        apply((current) =>
          issueArrivalCode(current, {
            engagementId,
            employerId: FEATURED_OPPORTUNITY_PLAN.employerId,
          }),
        );
      },
      checkIn: (engagementId, suppliedCode) => {
        const updated = checkInWorker(session, {
          engagementId,
          workerId: 'WKR-DEMO-01',
          suppliedCode,
          recordedAt: session.now,
        });
        write(updated);
        setSession(updated);
      },
      abandonDraft: () => {
        apply(discardDraft);
      },
    }),
    [session, restored, apply],
  );

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession(): DemoSessionContextValue {
  const value = useContext(DemoSessionContext);
  if (value === null) {
    throw new Error('useDemoSession must be used inside DemoSessionProvider.');
  }
  return value;
}
