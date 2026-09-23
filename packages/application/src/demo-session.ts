import {
  DEMO_NOW,
  evaluateClassificationSignal,
  generateSyntheticDemoWorld,
  transitionOpportunity,
  type ClassificationFactor,
  type ClassificationSignal,
  type EligibilityRequirement,
  type Opportunity,
  type OpportunityLifecycle,
  type OpportunityTerms,
  type PaymentCommitment,
  type PaymentIntentState,
} from '@platform/domain';
import {
  captureClassificationFactors,
  type FactorAnswerKey,
  type FactorAnswers,
} from './classification-capture';
import { candidateList } from './candidate-list';
import { areRequirementsBinaryEvaluable } from './requirement-catalogue';
import type { ValidatedOpportunityInput } from './opportunity-input';

// The prototype's shared demo world, and the only place its state lives.
//
// ONE WORLD, NOT ONE FIXTURE PER SCREEN. demo-scenarios.md: "The prototype has ONE synthetic
// dataset. Stories A, B and C are three traversals of it." So the opportunity the employer creates
// at beat B1 is the same `OPP-DEMO-01` the candidate list, both engagements, the dispute and the
// rehire effect later refer to. Its identity comes from the plan in the domain generator; nothing
// here mints a second one, and `createOpportunity` refuses an id that already exists.
//
// NO DATABASE. architecture/data-model.md: there is no schema and none is provisioned. This state
// is held by the caller — in the prototype, one browser tab — and the demo chrome says so at the
// point of use rather than implying a stored account.
//
// DETERMINISM. `initialDemoSession()` is a pure function of the domain generator and the demo
// clock, so the same walkthrough replays to the same world (demo-dataset.md coherence
// requirement 7).

export type ActorKey = 'worker' | 'employer' | 'operations';

/**
 * An engagement the employer has offered from E-04. It is a real `Offered` engagement in the shared
 * session — the invite-only entry into the engagement lifecycle (state-transitions.md; beat B8's
 * first half). It is NOT an acceptance: nothing here advances it to `Accepted`, because the worker's
 * side (W-02/W-04) is not built, and claiming acceptance would be fiction (truth-matrix row 16).
 */
export interface DemoEngagementRecord {
  readonly id: string;
  readonly opportunityId: string;
  readonly workerId: string;
  readonly employerId: string;
  readonly state: 'Offered';
  readonly offeredAt: string;
}

/**
 * A notification the invite would have sent. Recorded honestly as `MOCK`: no message leaves the
 * system, nothing is delivered, and no worker is told anything (truth-matrix row 16; the outbox
 * screen SH-03 that would display it is itself still `PLANNED`).
 */
export interface DemoNotification {
  readonly id: string;
  readonly recipientId: string;
  readonly channel: 'sms';
  readonly message: string;
  readonly recordedAt: string;
  readonly truth: 'MOCK';
}

/**
 * What the session holds for one opportunity.
 *
 * `lifecycle` carries the single authoritative state; the domain `Opportunity` is projected from
 * this record by `toOpportunity` rather than stored beside it, so there is no second copy of the
 * state to drift.
 */
export interface DemoOpportunityRecord {
  readonly id: string;
  readonly employerId: string;
  readonly title: string;
  readonly terms: OpportunityTerms;
  readonly requirements: readonly EligibilityRequirement[];
  /** Free text from the employer. Never an eligibility gate — see `OpportunityFormValues`. */
  readonly employerNote: string;
  readonly classificationFactors: readonly ClassificationFactor[];
  readonly commitment: PaymentCommitment;
  readonly paymentState: PaymentIntentState;
  readonly lifecycle: OpportunityLifecycle;
  readonly createdAt: string;
  readonly publishedAt?: string;
}

export interface DemoSession {
  readonly seed: string;
  /** The demo's fixed "today". Every date in the world is generated against it. */
  readonly now: string;
  readonly activeActor: ActorKey | null;
  /** Published and draft opportunities, in creation order. */
  readonly opportunities: readonly DemoOpportunityRecord[];
  /** Offered engagements created by inviting candidates from E-04. */
  readonly engagements: readonly DemoEngagementRecord[];
  /** The MOCK notification outbox — messages that would have been sent, none of which leaves the system. */
  readonly notifications: readonly DemoNotification[];
  /** The answers captured at E-03 for the opportunity currently in creation. */
  readonly factorAnswers: FactorAnswers;
}

export class DemoSessionConflictError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'DemoSessionConflictError';
  }
}

export function initialDemoSession(): DemoSession {
  // The generator is read so that the session is tied to the one synthetic world rather than to a
  // literal here. It plans the featured opportunity; it does not seed it.
  const world = generateSyntheticDemoWorld();
  return {
    seed: world.seed,
    now: DEMO_NOW,
    activeActor: null,
    opportunities: [],
    engagements: [],
    notifications: [],
    factorAnswers: {},
  };
}

export function selectActor(session: DemoSession, actor: ActorKey): DemoSession {
  return { ...session, activeActor: actor };
}

/** The domain entity, projected from the stored record. One state, one source. */
export function toOpportunity(record: DemoOpportunityRecord): Opportunity {
  return {
    id: record.id,
    employerId: record.employerId,
    state: record.lifecycle.state,
    terms: record.terms,
    requirements: record.requirements,
    classificationFactors: record.classificationFactors,
  };
}

export function opportunityById(
  session: DemoSession,
  id: string,
): DemoOpportunityRecord | undefined {
  return session.opportunities.find((record) => record.id === id);
}

/** The opportunity still being created, if any. At most one; the flow is E-02 → E-03. */
export function draftOpportunity(session: DemoSession): DemoOpportunityRecord | undefined {
  return session.opportunities.find((record) => record.lifecycle.state === 'Draft');
}

export function publishedOpportunities(
  session: DemoSession,
  employerId: string,
): readonly DemoOpportunityRecord[] {
  return session.opportunities.filter(
    (record) => record.employerId === employerId && record.lifecycle.state !== 'Draft',
  );
}

/**
 * Beats B1–B3 — creates the Opportunity in `Draft` and records the payment commitment.
 *
 * The identity is the shared world's, not a new one: this either creates the authoritative
 * `OPP-DEMO-01` or refuses. A second creation is a conflict rather than a second opportunity,
 * which is what keeps the featured transaction single across every later story.
 *
 * The commitment is a RECORD of the employer's undertaking. `PaymentCommitment.platformHoldsFunds`
 * is typed `false` in the domain, so no state in this system can express custody
 * (product/experience/payment.md).
 */
export function createOpportunity(
  session: DemoSession,
  input: ValidatedOpportunityInput,
  options: { readonly id: string; readonly employerId: string; readonly recordedAt: string },
): DemoSession {
  if (opportunityById(session, options.id) !== undefined) {
    throw new DemoSessionConflictError(
      `Opportunity ${options.id} already exists in this demo session; the shared world has exactly one.`,
    );
  }
  const existingDraft = draftOpportunity(session);
  if (existingDraft !== undefined) {
    throw new DemoSessionConflictError(
      `A draft (${existingDraft.id}) is already in creation; finish or discard it first.`,
    );
  }

  const terms: OpportunityTerms = {
    amount: input.amount,
    // The basis is part of the terms, not a presentation choice: it is what makes `amount` mean
    // something. A record that lost it could not tell a shift total from an hourly rate.
    payBasis: input.payBasis,
    workStartsAt: input.workStartsAt,
    workEndsAt: input.workEndsAt,
    location: input.location,
    headcount: input.headcount,
    acceptanceMode: input.acceptanceMode,
    // The recorded travel boundary, when the employer set one. Absent means distance never filters —
    // E-04 reads exactly what was recorded here, not the featured default (matching.md stage 3).
    ...(input.travelBoundary === undefined ? {} : { travelBoundary: input.travelBoundary }),
  };

  const record: DemoOpportunityRecord = {
    id: options.id,
    employerId: options.employerId,
    title: input.title,
    terms,
    requirements: input.requirements,
    employerNote: input.employerNote,
    classificationFactors: captureClassificationFactors({
      terms,
      answers: {},
      recordedAt: options.recordedAt,
    }),
    commitment: { amount: input.amount, basis: input.payBasis, platformHoldsFunds: false },
    paymentState: 'CommitmentRecorded',
    lifecycle: {
      state: 'Draft',
      headcount: input.headcount,
      acceptedEngagementCount: 0,
      hasPaymentCommitment: true,
      requirementsAreBinaryEvaluable: areRequirementsBinaryEvaluable(input.requirements),
      classificationComputed: true,
      classificationShown: false,
    },
    createdAt: options.recordedAt,
  };

  return { ...session, opportunities: [...session.opportunities, record], factorAnswers: {} };
}

/**
 * state-transitions.md: "`Draft` is not persisted as an abandoned artifact in the prototype. A
 * creation flow left incomplete leaves no record."
 */
export function discardDraft(session: DemoSession): DemoSession {
  return {
    ...session,
    opportunities: session.opportunities.filter((record) => record.lifecycle.state !== 'Draft'),
    factorAnswers: {},
  };
}

/** Beat B4 — records one factor answer and recomputes the whole factor set from it. */
export function answerFactor(
  session: DemoSession,
  opportunityId: string,
  kind: ClassificationFactor['kind'],
  answer: FactorAnswerKey,
  recordedAt: string,
): DemoSession {
  const answers: FactorAnswers = { ...session.factorAnswers, [kind]: answer };
  return {
    ...session,
    factorAnswers: answers,
    opportunities: session.opportunities.map((record) =>
      record.id === opportunityId
        ? {
            ...record,
            classificationFactors: captureClassificationFactors({
              terms: record.terms,
              answers,
              recordedAt,
            }),
          }
        : record,
    ),
  };
}

/**
 * Beat B5 — the classification panel has been rendered to the employer.
 *
 * This is a publication guard in state-transitions.md ("the classification signal has been
 * computed and shown") and it is the only way the signal touches publication. What the signal
 * SAYS is never an input: blocking on its content would presume an answer to Q1/Q6, which
 * ADR-0010 safeguard 7 makes unavailable regardless of who approves it (D3).
 */
export function markClassificationShown(session: DemoSession, opportunityId: string): DemoSession {
  return {
    ...session,
    opportunities: session.opportunities.map((record) =>
      record.id === opportunityId
        ? { ...record, lifecycle: { ...record.lifecycle, classificationShown: true } }
        : record,
    ),
  };
}

/** Beat B5 — publishes through the domain lifecycle. Never a UI-only status flag. */
export function publishOpportunity(
  session: DemoSession,
  opportunityId: string,
  publishedAt: string,
): DemoSession {
  const record = opportunityById(session, opportunityId);
  if (record === undefined) {
    throw new DemoSessionConflictError(`Opportunity ${opportunityId} is not in this demo session.`);
  }
  // Throws DomainTransitionError when a guard fails. The application does not re-implement or
  // soften the guards; it supplies their inputs and lets the domain refuse.
  const lifecycle = transitionOpportunity(record.lifecycle, 'Publish');
  return {
    ...session,
    opportunities: session.opportunities.map((candidate) =>
      candidate.id === opportunityId ? { ...candidate, lifecycle, publishedAt } : candidate,
    ),
  };
}

/** The recomputed signal. Never stored as a verdict — domain invariant 5. */
export function classificationSignalFor(record: DemoOpportunityRecord): ClassificationSignal {
  return evaluateClassificationSignal(record.classificationFactors);
}

/** The Offered engagements on one opportunity, in the order they were created. */
export function engagementsForOpportunity(
  session: DemoSession,
  opportunityId: string,
): readonly DemoEngagementRecord[] {
  return session.engagements.filter((engagement) => engagement.opportunityId === opportunityId);
}

/** Whether this worker has already been invited to this opportunity. Invitation is idempotent. */
export function isInvited(session: DemoSession, opportunityId: string, workerId: string): boolean {
  return session.engagements.some(
    (engagement) => engagement.opportunityId === opportunityId && engagement.workerId === workerId,
  );
}

/**
 * Beat B8 (first half) — the employer invites a candidate from E-04.
 *
 * A direct application caller cannot bypass the guards simply because the UI hides its button:
 * the opportunity must exist, be Published and InviteOnly, the supplied employer/title must match
 * the authoritative record, and the worker must be eligible for its CURRENT recorded terms.
 * No limit on outstanding offers is inferred from headcount: the lifecycle counts ACCEPTED work,
 * not invitations. A repeated valid invitation is idempotent.
 *
 * This creates an Offered engagement and a MOCK notification. It never claims external delivery
 * or acceptance (truth-matrix row 16).
 */
export function inviteWorker(
  session: DemoSession,
  input: {
    readonly opportunityId: string;
    readonly workerId: string;
    readonly employerId: string;
    readonly opportunityTitle: string;
    readonly recordedAt: string;
  },
): DemoSession {
  const opportunity = opportunityById(session, input.opportunityId);
  if (opportunity === undefined) {
    throw new DemoSessionConflictError(
      `Cannot invite: opportunity ${input.opportunityId} does not exist.`,
    );
  }
  if (opportunity.lifecycle.state !== 'Published') {
    throw new DemoSessionConflictError(
      `Cannot invite: opportunity ${input.opportunityId} is not Published.`,
    );
  }
  if (opportunity.terms.acceptanceMode !== 'InviteOnly') {
    throw new DemoSessionConflictError('Cannot invite: this opportunity does not accept invitations.');
  }
  if (opportunity.employerId !== input.employerId || opportunity.title !== input.opportunityTitle) {
    throw new DemoSessionConflictError(
      'Cannot invite: employer or opportunity details no longer match the record.',
    );
  }

  const world = generateSyntheticDemoWorld();
  if (
    session.seed !== world.seed ||
    !candidateList(world, opportunity).ranked.some(
      (candidate) => candidate.workerId === input.workerId,
    )
  ) {
    throw new DemoSessionConflictError(
      'Cannot invite: worker is not currently eligible for this opportunity.',
    );
  }
  if (isInvited(session, input.opportunityId, input.workerId)) return session;

  const engagement: DemoEngagementRecord = {
    id: `ENG-DEMO-${input.opportunityId}-${input.workerId}`,
    opportunityId: input.opportunityId,
    workerId: input.workerId,
    employerId: opportunity.employerId,
    state: 'Offered',
    offeredAt: input.recordedAt,
  };
  const notification: DemoNotification = {
    id: `NOTE-DEMO-${input.opportunityId}-${input.workerId}`,
    recipientId: input.workerId,
    channel: 'sms',
    message: `دعوت به همکاری در «${opportunity.title}»`,
    recordedAt: input.recordedAt,
    truth: 'MOCK',
  };
  return {
    ...session,
    engagements: [...session.engagements, engagement],
    notifications: [...session.notifications, notification],
  };
}
