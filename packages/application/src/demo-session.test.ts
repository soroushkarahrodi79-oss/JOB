import { describe, expect, it } from 'vitest';
import { DEMO_NOW, DomainTransitionError, FEATURED_OPPORTUNITY_PLAN, rial } from '@platform/domain';
import {
  DemoSessionConflictError,
  answerFactor,
  classificationSignalFor,
  createOpportunity,
  discardDraft,
  draftOpportunity,
  engagementsForOpportunity,
  initialDemoSession,
  inviteWorker,
  isInvited,
  markClassificationShown,
  opportunityById,
  publishOpportunity,
  publishedOpportunities,
  selectActor,
  toOpportunity,
  type DemoSession,
} from './demo-session';
import { employerHomeModel } from './employer-home';
import { validateOpportunityForm, type OpportunityFormValues } from './opportunity-input';

const EMPLOYER = FEATURED_OPPORTUNITY_PLAN.employerId;
const FEATURED = FEATURED_OPPORTUNITY_PLAN.id;

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

function created(session = initialDemoSession(), values = form): DemoSession {
  const validation = validateOpportunityForm(values);
  if (!validation.ok) throw new Error(`fixture is invalid: ${JSON.stringify(validation.errors)}`);
  return createOpportunity(session, validation.input, {
    id: FEATURED,
    employerId: EMPLOYER,
    recordedAt: DEMO_NOW,
  });
}

function publishedSession(): DemoSession {
  let session = created();
  session = answerFactor(session, FEATURED, 'DirectionAndControl', 'employmentLike', DEMO_NOW);
  session = markClassificationShown(session, FEATURED);
  return publishOpportunity(session, FEATURED, DEMO_NOW);
}

describe('the shared demo session', () => {
  it('starts with no opportunities — the featured one is created, not seeded', () => {
    const session = initialDemoSession();
    expect(session.opportunities).toEqual([]);
    expect(opportunityById(session, FEATURED)).toBeUndefined();
    expect(session.now).toBe(DEMO_NOW);
  });

  it('creates the authoritative OPP-DEMO-01 with the canonical identity and terms', () => {
    const session = created();
    const record = opportunityById(session, FEATURED);
    expect(record?.employerId).toBe(EMPLOYER);
    expect(record?.terms.headcount).toBe(2);
    expect(record?.terms.acceptanceMode).toBe('InviteOnly');
    expect(record?.terms.amount).toEqual(rial(9_800_000));
    expect(record?.terms.workStartsAt).toBe(FEATURED_OPPORTUNITY_PLAN.workStartsAt);
    expect(record?.lifecycle.state).toBe('Draft');
    // The domain entity is projected from the record, so there is one authoritative state.
    expect(record && toOpportunity(record).state).toBe('Draft');
  });

  it('refuses a second OPP-DEMO-01 rather than creating a duplicate featured transaction', () => {
    const session = publishedSession();
    const validation = validateOpportunityForm(form);
    if (!validation.ok) throw new Error('fixture is invalid');
    expect(() =>
      createOpportunity(session, validation.input, {
        id: FEATURED,
        employerId: EMPLOYER,
        recordedAt: DEMO_NOW,
      }),
    ).toThrow(DemoSessionConflictError);
    expect(session.opportunities.filter((record) => record.id === FEATURED)).toHaveLength(1);
  });

  it('replays deterministically: the same walkthrough produces the same world', () => {
    expect(publishedSession()).toEqual(publishedSession());
    expect(initialDemoSession()).toEqual(initialDemoSession());
  });

  it('leaves no record when a creation flow is abandoned', () => {
    // state-transitions.md: "`Draft` is not persisted as an abandoned artifact in the prototype."
    const session = discardDraft(created());
    expect(session.opportunities).toEqual([]);
    expect(draftOpportunity(session)).toBeUndefined();
  });

  it('records the commitment as a commitment, with no state able to express custody', () => {
    const record = opportunityById(created(), FEATURED);
    expect(record?.commitment).toEqual({
      amount: rial(9_800_000),
      basis: 'PerShift',
      platformHoldsFunds: false,
    });
    expect(record?.paymentState).toBe('CommitmentRecorded');
    // Nothing in the record is a balance, a held amount, or an escrow state.
    expect(JSON.stringify(record)).not.toMatch(/escrow|balance|wallet|held|custod/i);
  });
});

describe('publication goes through the domain lifecycle', () => {
  it('publishes once every canonical guard is satisfied', () => {
    const session = publishedSession();
    expect(opportunityById(session, FEATURED)?.lifecycle.state).toBe('Published');
    expect(publishedOpportunities(session, EMPLOYER)).toHaveLength(1);
  });

  it('refuses to publish before the classification signal has been shown', () => {
    expect(() => publishOpportunity(created(), FEATURED, DEMO_NOW)).toThrow(DomainTransitionError);
  });

  it('publishes regardless of what the signal says — the signal informs and never blocks (D3)', () => {
    let employmentLike = created();
    for (const kind of ['DirectionAndControl', 'ToolsAndMaterials', 'Integration'] as const) {
      employmentLike = answerFactor(employmentLike, FEATURED, kind, 'employmentLike', DEMO_NOW);
    }
    employmentLike = markClassificationShown(employmentLike, FEATURED);
    const published = publishOpportunity(employmentLike, FEATURED, DEMO_NOW);
    const record = opportunityById(published, FEATURED);

    expect(record?.lifecycle.state).toBe('Published');
    expect(record && classificationSignalFor(record).employmentLikeFactors.length).toBeGreaterThan(
      1,
    );
  });

  it('refuses publication when a requirement is not evaluable', () => {
    // Guard inputs come from the application; the domain does the refusing.
    const session = created();
    const record = opportunityById(session, FEATURED);
    if (record === undefined) throw new Error('missing record');
    const tampered: DemoSession = {
      ...session,
      opportunities: [
        {
          ...record,
          lifecycle: {
            ...record.lifecycle,
            requirementsAreBinaryEvaluable: false,
            classificationShown: true,
          },
        },
      ],
    };
    expect(() => publishOpportunity(tampered, FEATURED, DEMO_NOW)).toThrow(
      'every requirement must be a binary evaluable condition',
    );
  });

  it('refuses to publish an opportunity that is not in the session', () => {
    expect(() => publishOpportunity(initialDemoSession(), FEATURED, DEMO_NOW)).toThrow(
      DemoSessionConflictError,
    );
  });
});

describe('E-01 read model', () => {
  it('is empty and says so, rather than being padded with invented activity', () => {
    const model = employerHomeModel(initialDemoSession(), EMPLOYER);
    expect(model.queue).toEqual([]);
    expect(model.draft).toBeUndefined();
    expect(model.planned.map((area) => area.screenId)).toContain('E-07');
  });

  it('surfaces an unfinished creation flow so the employer can resume or discard it', () => {
    const model = employerHomeModel(created(), EMPLOYER);
    expect(model.draft?.id).toBe(FEATURED);
    expect(model.queue).toEqual([]);
  });

  it('lists the published opportunity once it exists, and nothing else', () => {
    const model = employerHomeModel(publishedSession(), EMPLOYER);
    expect(model.queue.map((item) => item.record.id)).toEqual([FEATURED]);
    expect(model.draft).toBeUndefined();
    // A queue, not a dashboard: nothing numeric about the employer is exposed.
    expect(Object.keys(model)).toEqual(['employerId', 'queue', 'draft', 'planned']);
  });

  it('shows another employer nothing of this employer s work', () => {
    const model = employerHomeModel(publishedSession(), 'EMP-DEMO-02');
    expect(model.queue).toEqual([]);
  });
});

describe('actor selection', () => {
  it('records the active actor without pretending to be authentication', () => {
    const session = selectActor(initialDemoSession(), 'employer');
    expect(session.activeActor).toBe('employer');
    expect(JSON.stringify(session)).not.toMatch(/token|password|credential|session-?id/i);
  });
});

describe('invitation is a truthful bounded action', () => {
  const invite = (session: DemoSession, workerId: string) =>
    inviteWorker(session, {
      opportunityId: FEATURED,
      workerId,
      employerId: EMPLOYER,
      opportunityTitle: FEATURED_OPPORTUNITY_PLAN.title,
      recordedAt: DEMO_NOW,
    });

  it('creates exactly one Offered engagement and records a MOCK notification', () => {
    const session = invite(publishedSession(), 'WKR-DEMO-01');
    const engagements = engagementsForOpportunity(session, FEATURED);
    expect(engagements).toHaveLength(1);
    expect(engagements[0]?.state).toBe('Offered');
    expect(engagements[0]?.workerId).toBe('WKR-DEMO-01');
    // Never advanced to Accepted, and the notification is MOCK — nothing left the system.
    expect(session.notifications).toHaveLength(1);
    expect(session.notifications[0]?.truth).toBe('MOCK');
    expect(isInvited(session, FEATURED, 'WKR-DEMO-01')).toBe(true);
  });

  it('is idempotent: inviting the same worker twice changes nothing', () => {
    const once = invite(publishedSession(), 'WKR-DEMO-01');
    const twice = invite(once, 'WKR-DEMO-01');
    expect(twice.engagements).toHaveLength(1);
    expect(twice.notifications).toHaveLength(1);
  });

  it('never records an acceptance or a delivery', () => {
    const session = invite(publishedSession(), 'WKR-DEMO-02');
    expect(JSON.stringify(session.engagements)).not.toMatch(/Accepted|InProgress|Completed/);
    expect(JSON.stringify(session.notifications)).not.toMatch(/delivered|sent|received/i);
  });
});

describe('pay basis travels with the money', () => {
  const createdWith = (payBasis: 'PerShift' | 'PerHour') => {
    const session = created(initialDemoSession(), { ...form, payBasis });
    const record = opportunityById(session, FEATURED);
    if (record === undefined) throw new Error('missing record');
    return record;
  };

  it('preserves the basis on the terms and on the commitment, for both modes', () => {
    for (const payBasis of ['PerShift', 'PerHour'] as const) {
      const record = createdWith(payBasis);
      expect(record.terms.payBasis, payBasis).toBe(payBasis);
      expect(record.commitment.basis, payBasis).toBe(payBasis);
      // The domain entity projected from the record carries it too.
      expect(toOpportunity(record).terms.payBasis, payBasis).toBe(payBasis);
    }
  });

  it('records an hourly rate as a rate, never as the shift obligation', () => {
    // A rate and a total are different commitments. The amount is identical in both records, so
    // the ONLY thing distinguishing them is the basis — which is why it may never be dropped.
    const perHour = createdWith('PerHour');
    const perShift = createdWith('PerShift');
    expect(perHour.commitment.amount).toEqual(perShift.commitment.amount);
    expect(perHour.commitment.basis).not.toBe(perShift.commitment.basis);
  });

  it('never derives a shift total from an hourly rate', () => {
    // No authorised rule exists for rounding, breaks or overruns, so nothing in the record may
    // hold a computed total. The commitment holds exactly what the employer entered.
    const record = createdWith('PerHour');
    const hours =
      (new Date(record.terms.workEndsAt).getTime() -
        new Date(record.terms.workStartsAt).getTime()) /
      3_600_000;
    expect(hours).toBe(6);
    expect(record.commitment.amount).toEqual(rial(9_800_000));
    expect(record.commitment.amount.rialAmount).not.toBe(9_800_000 * hours);
    expect(Object.keys(record.commitment).sort()).toEqual([
      'amount',
      'basis',
      'platformHoldsFunds',
    ]);
  });

  it('keeps the commitment free of custody in both modes', () => {
    for (const payBasis of ['PerShift', 'PerHour'] as const) {
      const record = createdWith(payBasis);
      expect(record.commitment.platformHoldsFunds).toBe(false);
      expect(JSON.stringify(record.commitment)).not.toMatch(/escrow|balance|wallet|held|custod/i);
    }
  });

  it('reads the hourly basis as an employment-like economic structure, and says which field', () => {
    const perHour = createdWith('PerHour').classificationFactors.find(
      (factor) => factor.kind === 'EconomicStructure',
    );
    const perShift = createdWith('PerShift').classificationFactors.find(
      (factor) => factor.kind === 'EconomicStructure',
    );
    expect(perHour?.value).toBe('EmploymentLike');
    expect(perShift?.value).toBe('IndependentLike');
    expect(perHour?.source).toBe('Derived');
    expect(perHour?.sourceReference).toBe('مبلغ و مبنای پرداخت');
  });

  it('keeps the canonical featured scenario on the per-shift basis', () => {
    // demo-dataset.md fixes OPP-01's shape; the investor walkthrough must not change basis.
    expect(FEATURED_OPPORTUNITY_PLAN.payBasis).toBe('PerShift');
    expect(publishedSession().opportunities[0]?.terms.payBasis).toBe('PerShift');
  });
});
