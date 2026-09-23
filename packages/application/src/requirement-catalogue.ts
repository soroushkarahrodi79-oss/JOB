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

/**
 * Which additional skills are *relevant* to a required one, for skill-fit ordering (matching.md
 * stage 4: "Skills the employer marked as required are stage 1. Remaining relevant skills order the
 * eligible set.").
 *
 * This is a curated adjacency for the demo taxonomy only — D5, `AUTHORISED`, prototype-only, and
 * explicitly not a general skill graph (docs/open-decisions.md). It never introduces or excludes a
 * candidate; it only orders among those who already passed every hard gate. A café shift's relevant
 * neighbours are the other front-of-house skills, so a worker who also serves customers or runs a
 * till fits a café better than one with the bare required skill — a named, openable fact, never a
 * score.
 */
const RELATED_SKILLS: Readonly<Record<string, readonly string[]>> = {
  'cafe-service': ['customer-service', 'cash-handling', 'food-preparation', 'barista-certificate'],
  'food-preparation': ['cafe-service', 'cleaning'],
  'warehouse-stock': ['event-setup', 'cleaning'],
  'event-setup': ['warehouse-stock', 'cleaning', 'customer-service'],
  'customer-service': ['cafe-service', 'cash-handling'],
};

/**
 * The skills that order the eligible set for an opportunity: every skill relevant to a required
 * skill, minus the required skills themselves (those were already the eligibility gate). Certificate
 * requirements contribute no ordering neighbours of their own.
 */
export function orderingSkillIds(
  requirements: readonly EligibilityRequirement[],
): readonly string[] {
  const requiredIds = new Set(requirements.map((requirement) => requirement.id));
  const relevant = new Set<string>();
  for (const requirement of requirements) {
    for (const related of RELATED_SKILLS[requirement.id] ?? []) {
      if (!requiredIds.has(related)) relevant.add(related);
    }
  }
  return [...relevant];
}

/** Whether every requirement is one the domain can evaluate — the publication guard's input. */
export function areRequirementsBinaryEvaluable(
  requirements: readonly EligibilityRequirement[],
): boolean {
  return requirements.every((requirement) => BY_ID.has(requirement.id));
}

export function requirementById(id: string): RequirementOption | undefined {
  return BY_ID.get(id);
}
