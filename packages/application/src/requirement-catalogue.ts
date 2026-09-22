import type { EligibilityRequirement } from '@platform/domain';

// The conditions an employer may attach to an opportunity.
//
// It is a closed list, and that is the product rule rather than a convenience. An eligibility
// requirement excludes people (domain invariant 4), so every one of them has to be evaluable
// against something a worker actually carries — an attestation with a criterion id and a
// provenance. `evaluateEligibility` answers Met / Unmet / Unknown against exactly these ids; a
// free-text requirement would answer `Unknown` for everyone and exclude the entire world for a
// reason the domain could not explain. That is why the `Draft → Published` guard in
// state-transitions.md reads "every requirement is a binary evaluable condition", and why the
// employer's free-text field in E-02 is a NOTE, kept structurally separate from this list.
//
// The taxonomy is small and is for the demo scenarios only — D5, `AUTHORISED`, prototype-only,
// and explicitly not a general taxonomy (docs/open-decisions.md). Coverage follows
// demo-dataset.md, *Skills*.

export interface RequirementOption extends EligibilityRequirement {
  /** Which part of the demo taxonomy this is, so E-02 can group without inventing a hierarchy. */
  readonly kind: 'Skill' | 'Certificate';
}

export const REQUIREMENT_CATALOGUE: readonly RequirementOption[] = [
  { id: 'cafe-service', label: 'تجربهٔ کار در کافه یا پذیرایی', kind: 'Skill' },
  { id: 'food-preparation', label: 'آماده‌سازی مواد غذایی', kind: 'Skill' },
  { id: 'cash-handling', label: 'کار با صندوق و دریافت وجه', kind: 'Skill' },
  { id: 'customer-service', label: 'برخورد مستقیم با مشتری', kind: 'Skill' },
  { id: 'warehouse-stock', label: 'کار انبار و چیدمان کالا', kind: 'Skill' },
  { id: 'event-setup', label: 'برپایی و جمع‌آوری رویداد', kind: 'Skill' },
  { id: 'cleaning', label: 'نظافت و نگه‌داری محیط', kind: 'Skill' },
  { id: 'food-handling-certificate', label: 'کارت سلامت معتبر', kind: 'Certificate' },
  { id: 'barista-certificate', label: 'گواهی دورهٔ باریستا', kind: 'Certificate' },
];

const BY_ID = new Map(REQUIREMENT_CATALOGUE.map((option) => [option.id, option]));

/** Whether every requirement is one the domain can evaluate — the publication guard's input. */
export function areRequirementsBinaryEvaluable(
  requirements: readonly EligibilityRequirement[],
): boolean {
  return requirements.every((requirement) => BY_ID.has(requirement.id));
}

export function requirementById(id: string): RequirementOption | undefined {
  return BY_ID.get(id);
}
