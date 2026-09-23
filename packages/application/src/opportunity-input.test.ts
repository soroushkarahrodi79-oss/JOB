import { describe, expect, it } from 'vitest';
import { FEATURED_OPPORTUNITY_PLAN } from '@platform/domain';
import { validateOpportunityForm, type OpportunityFormValues } from './opportunity-input';
import { areRequirementsBinaryEvaluable } from './requirement-catalogue';

const valid: OpportunityFormValues = {
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
  employerNote: 'ورود از در پشتی، ساعت ۱۵:۴۵.',
  travelBoundaryKm: '10',
  paymentCommitmentRecorded: true,
};

function errorsFor(values: Partial<OpportunityFormValues>): readonly string[] {
  const result = validateOpportunityForm({ ...valid, ...values });
  return result.ok ? [] : result.errors.map((error) => error.field);
}

describe('E-02 opportunity form validation', () => {
  it('accepts the canonical featured transaction and produces the terms the domain stores', () => {
    const result = validateOpportunityForm(valid);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.input.amount).toEqual(FEATURED_OPPORTUNITY_PLAN.amount);
    expect(result.input.workStartsAt).toBe(FEATURED_OPPORTUNITY_PLAN.workStartsAt);
    expect(result.input.workEndsAt).toBe(FEATURED_OPPORTUNITY_PLAN.workEndsAt);
    expect(result.input.headcount).toBe(2);
    expect(result.input.acceptanceMode).toBe('InviteOnly');
    expect(result.input.location).toEqual({ city: 'Tehran', neighbourhood: 'Demo-Centre' });
  });

  it('reports every failed field at once, so the error summary can name them all', () => {
    const fields = errorsFor({
      title: '   ',
      tomanAmount: 'خیلی',
      headcount: 0,
      paymentCommitmentRecorded: false,
    });
    expect(fields).toEqual(
      expect.arrayContaining(['title', 'tomanAmount', 'headcount', 'paymentCommitmentRecorded']),
    );
  });

  it('refuses a shift that ends before or when it starts', () => {
    expect(errorsFor({ endMinutes: 16 * 60 })).toContain('endMinutes');
    expect(errorsFor({ endMinutes: 12 * 60 })).toContain('endMinutes');
  });

  it('refuses publication input without a recorded payment commitment', () => {
    expect(errorsFor({ paymentCommitmentRecorded: false })).toContain('paymentCommitmentRecorded');
  });

  it('never lets a requirement the domain cannot evaluate become an eligibility gate', () => {
    // demo-scenarios.md B2: "A requirement the employer cannot state concretely cannot be a
    // requirement." An id outside the catalogue is refused rather than stored as a condition
    // nothing can answer.
    expect(errorsFor({ requirementIds: ['must-be-a-hard-worker'] })).toContain('requirementIds');
    expect(
      areRequirementsBinaryEvaluable([{ id: 'must-be-a-hard-worker', label: 'سخت‌کوش' }]),
    ).toBe(false);
  });

  it('keeps the employer note out of the requirement list entirely', () => {
    const result = validateOpportunityForm({
      ...valid,
      requirementIds: [],
      employerNote: 'باید سخت‌کوش و خوش‌برخورد باشد',
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.input.requirements).toEqual([]);
    expect(result.input.employerNote).toContain('سخت‌کوش');
  });

  it('allows an opportunity with no requirements at all', () => {
    // Requirements exclude people, so none is a legitimate choice and must not be forced.
    expect(errorsFor({ requirementIds: [] })).toEqual([]);
  });

  it('refuses a location outside the demo geography (D6)', () => {
    expect(errorsFor({ neighbourhood: 'Elsewhere' })).toContain('neighbourhood');
  });

  it('records the travel boundary as an evaluable term, and accepts Persian digits', () => {
    const result = validateOpportunityForm({ ...valid, travelBoundaryKm: '۱۰' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.input.travelBoundary).toEqual({ maxKilometres: 10 });
  });

  it('treats an empty travel boundary as no boundary, not a boundary of zero', () => {
    const result = validateOpportunityForm({ ...valid, travelBoundaryKm: '' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.input.travelBoundary).toBeUndefined();
  });

  it('refuses a zero or non-numeric travel boundary', () => {
    expect(errorsFor({ travelBoundaryKm: '0' })).toContain('travelBoundaryKm');
    expect(errorsFor({ travelBoundaryKm: 'دور' })).toContain('travelBoundaryKm');
  });
});
