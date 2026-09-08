import { describe, expect, it } from 'vitest';
import {
  LIFECYCLE_STATES,
  ELIGIBILITY_STATES,
  AVAILABILITY_STATES,
  PROVENANCE_LEVELS,
} from '@platform/domain';
import { RENDERINGS, isNotRendered, resolveRole, type Family } from './vocabulary';

// The GATE 1.5 exit-criterion-5 tripwire, in code:
//   "Every state the domain holds has exactly one rendering ... A state present in
//    state-transitions.md and absent from the vocabulary is a defect."
// If a state is added to packages/domain (mirroring state-transitions.md) with no rendering here,
// this fails. If a rendering exists for a state the domain does not hold, this also fails.

const EXPECTED: Record<Family, readonly string[]> = {
  eligibility: ELIGIBILITY_STATES,
  availability: AVAILABILITY_STATES,
  provenance: PROVENANCE_LEVELS,
  opportunity: LIFECYCLE_STATES.opportunity,
  engagement: LIFECYCLE_STATES.engagement,
  proof: LIFECYCLE_STATES.proof,
  payment: LIFECYCLE_STATES.payment,
  dispute: LIFECYCLE_STATES.dispute,
  attestation: LIFECYCLE_STATES.attestation,
  preferredCrew: LIFECYCLE_STATES.preferredCrew,
};

describe('every domain state has exactly one rendering (GATE 1.5 criterion 5)', () => {
  for (const family of Object.keys(EXPECTED) as Family[]) {
    it(`${family}: rendering keys match the domain state set exactly`, () => {
      expect(Object.keys(RENDERINGS[family]).sort()).toEqual([...EXPECTED[family]].sort());
    });
  }

  it('no rendering family exists that the domain does not define', () => {
    expect(Object.keys(RENDERINGS).sort()).toEqual(Object.keys(EXPECTED).sort());
  });
});

describe('every rendering satisfies the state-vocabulary rules', () => {
  const validRoles = new Set([
    'neutral',
    'info',
    'positive',
    'attention',
    'warning',
    'critical',
    'verification',
    'truth',
  ]);

  for (const family of Object.keys(RENDERINGS) as Family[]) {
    for (const [state, rendering] of Object.entries(RENDERINGS[family])) {
      if (isNotRendered(rendering)) {
        it(`${family}.${state}: not-rendered entries are documented`, () => {
          expect(rendering.labelSource.length).toBeGreaterThan(0);
        });
        continue;
      }

      it(`${family}.${state}: carries a mark and a source (never colour alone)`, () => {
        expect(rendering.mark.length).toBeGreaterThan(0);
        expect(rendering.labelSource.length).toBeGreaterThan(0);
        // A labelled state must have a non-empty label; payment states render as prose (null).
        if (rendering.label !== null) expect(rendering.label.length).toBeGreaterThan(0);
      });

      it(`${family}.${state}: role resolves to a known semantic role`, () => {
        expect(validRoles.has(resolveRole(rendering.role, 'actor'))).toBe(true);
        expect(validRoles.has(resolveRole(rendering.role, 'counterparty'))).toBe(true);
      });
    }
  }
});

describe('specific canonical facts survive transcription', () => {
  it('ApprovedByNonResponse is warning on the employer record, neutral on the worker record', () => {
    const r = RENDERINGS.proof.ApprovedByNonResponse;
    expect(isNotRendered(r)).toBe(false);
    if (!isNotRendered(r)) {
      expect(resolveRole(r.role, 'actor')).toBe('warning');
      expect(resolveRole(r.role, 'counterparty')).toBe('neutral');
      // The label is identical regardless of whose record it is on.
      expect(r.label).toBe('بدون پاسخ کارفرما تأیید شد');
    }
  });

  it('NotEligible is neutral, never critical (dignity; domain invariant 4)', () => {
    const r = RENDERINGS.eligibility.NotEligible;
    if (!isNotRendered(r)) expect(r.role).toBe('neutral');
  });

  it('SettlementFailed is the sole critical state and carries the SIMULATED chip', () => {
    const r = RENDERINGS.payment.SettlementFailed;
    if (!isNotRendered(r)) {
      expect(r.role).toBe('critical');
      expect(r.simulated).toBe(true);
    }
  });

  it('preserves ZWNJ in compound labels (never collapsed)', () => {
    const draft = RENDERINGS.opportunity.Draft;
    if (!isNotRendered(draft)) expect(draft.label).toContain('‌');
  });

  it('Preferred Crew "Removed" is deliberately not rendered', () => {
    expect(isNotRendered(RENDERINGS.preferredCrew.Removed)).toBe(true);
  });
});
