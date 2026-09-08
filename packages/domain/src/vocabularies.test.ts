import { describe, expect, it } from 'vitest';
import {
  ELIGIBILITY_STATES,
  AVAILABILITY_STATES,
  PROVENANCE_LEVELS,
  TRUTH_LEVELS,
} from './vocabularies';

describe('domain vocabularies', () => {
  it('eligibility has exactly three states', () => {
    expect([...ELIGIBILITY_STATES]).toEqual(['Eligible', 'Conditional', 'NotEligible']);
  });
  it('availability is a two-valued fact', () => {
    expect([...AVAILABILITY_STATES]).toEqual(['Available', 'Unavailable']);
  });
  it('provenance has exactly four levels (ADR-0012 decision 2)', () => {
    expect([...PROVENANCE_LEVELS]).toEqual([
      'SelfDeclared',
      'VerifiedSimulated',
      'Observed',
      'Derived',
    ]);
  });
  it('truth taxonomy has the four levels (ADR-0004)', () => {
    expect([...TRUTH_LEVELS]).toEqual(['FUNCTIONAL', 'SIMULATED', 'MOCK', 'PLANNED']);
  });
});
