import { describe, expect, it } from 'vitest';
import { TRUTH_LEVELS, type TruthLevel } from '@platform/domain';
import { CAPABILITY_LEDGER, TRUTH_LEVEL_GLOSS } from './capability-ledger';

// The Truth Ledger's data is a transcription of docs/demo-truth-matrix.md. These checks guard the
// invariants that the render and the deep-link mechanism depend on. They cannot detect wording
// drift in the Markdown itself — that is a same-PR discipline (ADR-0006), not a test.

const LEVELS = new Set<string>(TRUTH_LEVELS);

describe('capability ledger (SH-02 data)', () => {
  it('covers the whole matrix as 24 contiguous rows', () => {
    expect(CAPABILITY_LEDGER).toHaveLength(24);
    const ids = CAPABILITY_LEDGER.map((r) => r.id);
    expect(ids).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
  });

  it('every row carries a valid target and actual truth level', () => {
    for (const row of CAPABILITY_LEDGER) {
      expect(LEVELS.has(row.target), `${String(row.id)} target`).toBe(true);
      expect(LEVELS.has(row.actual), `${String(row.id)} actual`).toBe(true);
      expect(row.capability.length).toBeGreaterThan(0);
    }
  });

  it('records the two capabilities this slice builds as FUNCTIONAL (rows 21, 22)', () => {
    // The slice's honesty hinge: SH-01 (actor switch) and SH-02 (this ledger) are now built, so
    // their Actual has moved off PLANNED. Nothing else may claim to have moved.
    const byId = new Map(CAPABILITY_LEDGER.map((r) => [r.id, r]));
    expect(byId.get(21)?.actual).toBe('FUNCTIONAL');
    expect(byId.get(22)?.actual).toBe('FUNCTIONAL');
  });

  it('does not silently promote any other capability past its documented Actual', () => {
    // Spot-checks of the deliberate honesty rows: the gaps must stay visible (matrix rows 12/18/19),
    // and the simulated/mock providers must not read FUNCTIONAL.
    const actual = (id: number): TruthLevel | undefined =>
      CAPABILITY_LEDGER.find((r) => r.id === id)?.actual;
    expect(actual(12)).toBe('PLANNED'); // escrow absence — never FUNCTIONAL
    expect(actual(16)).toBe('MOCK'); // messaging — no message leaves the system
    expect(actual(17)).toBe('SIMULATED'); // authentication
    expect(actual(18)).toBe('PLANNED'); // legal compliance posture
    expect(actual(19)).toBe('PLANNED'); // trust & safety
    expect(actual(2)).toBe('PLANNED'); // Passport aggregate not yet built
  });

  it('glosses SIMULATED and MOCK in Persian and leaves the unmarked levels without one', () => {
    // color.md: FUNCTIONAL is unmarked and PLANNED is never a control, so neither carries a chip
    // gloss; the ledger names them by their canonical taxonomy term instead.
    expect(TRUTH_LEVEL_GLOSS.SIMULATED).toBe('شبیه‌سازی‌شده');
    expect(TRUTH_LEVEL_GLOSS.MOCK).toBe('ساختگی');
    expect(TRUTH_LEVEL_GLOSS.FUNCTIONAL).toBeNull();
    expect(TRUTH_LEVEL_GLOSS.PLANNED).toBeNull();
  });
});
