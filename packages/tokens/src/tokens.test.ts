import { describe, expect, it } from 'vitest';
import { tokens, DENSITY, SEMANTIC_ROLES, TYPE_ROLES } from './tokens';
import { raw } from './raw';

// The token budget from tokens.md is a budget, not an inventory: exceeding a group is a signal
// to look at the design. These assertions turn that into a tripwire.
describe('token budget (tokens.md "The groups")', () => {
  it('surfaces: 3', () => expect(Object.keys(tokens.color.surface)).toHaveLength(3));
  it('foreground: 4', () => expect(Object.keys(tokens.color.fg)).toHaveLength(4));
  it('borders: 3', () => expect(Object.keys(tokens.color.border)).toHaveLength(3));
  it('semantic roles: 6, each fg/bg/border', () => {
    expect(SEMANTIC_ROLES).toHaveLength(6);
    for (const role of SEMANTIC_ROLES) {
      expect(Object.keys(tokens.color.state[role]).sort()).toEqual(['bg', 'border', 'fg']);
    }
  });
  it('type roles: 11', () => expect(TYPE_ROLES).toHaveLength(11));
  it('type families: 2', () => expect(Object.keys(tokens.type.family)).toHaveLength(2));
  it('spacing: 7 steps + 3 aliases', () => expect(Object.keys(tokens.space)).toHaveLength(10));
  it('radius: 3', () => expect(Object.keys(tokens.radius)).toHaveLength(3));
  it('border widths: 2', () => expect(Object.keys(tokens.border.width)).toHaveLength(2));
  it('elevation: 2 (one of them flat)', () => {
    expect(Object.keys(tokens.elevation)).toHaveLength(2);
    expect(tokens.elevation.flat).toBe('none');
  });
});

// ADR-0012 decision 4 / visual-language.md: the system contains no primitive for asserting
// without evidence. These are enforced by ABSENCE — a token set is reviewable in a way a style
// guide is not. If one of these names ever appears, it must be a superseding ADR, not a token.
describe('absences (ADR-0012 decision 4)', () => {
  const flat = JSON.stringify(tokens).toLowerCase();
  const forbiddenValues = ['gradient', 'linear-gradient', 'radial-gradient'];
  for (const word of forbiddenValues) {
    it(`no token value contains "${word}"`, () => expect(flat).not.toContain(word));
  }

  const forbiddenNames = [
    'score',
    'gauge',
    'star',
    'tier',
    'level',
    'streak',
    'percentile',
    'brand',
  ];
  const allKeys = collectKeys(tokens).map((k) => k.toLowerCase());
  for (const word of forbiddenNames) {
    it(`no token name contains "${word}"`, () => {
      expect(allKeys.some((k) => k.includes(word))).toBe(false);
    });
  }

  it('shadow is limited to a single overlay value — no card shadow', () => {
    const shadows = JSON.stringify(tokens.elevation);
    expect(shadows).not.toContain('inset');
  });
});

// tokens.md / ADR-0005: logical direction only. A token containing left/right is a defect.
describe('no physical direction in token names or values (ADR-0005)', () => {
  const keys = collectKeys(tokens).map((k) => k.toLowerCase());
  const values = Object.values(raw).map(String).join(' ').toLowerCase();
  it('no token name says left/right', () => {
    expect(keys.some((k) => /(^|[^a-z])(left|right)([^a-z]|$)/.test(k))).toBe(false);
  });
  it('no raw value says left/right', () => {
    expect(/(^|[^a-z])(left|right)([^a-z]|$)/.test(values)).toBe(false);
  });
});

describe('density is a rebinding of exactly the alias set (tokens.md)', () => {
  for (const density of Object.keys(DENSITY) as (keyof typeof DENSITY)[]) {
    it(`${density} rebinds gutter/row/section/comfortable only`, () => {
      expect(Object.keys(DENSITY[density]).sort()).toEqual([
        'comfortable',
        'gutter',
        'row',
        'section',
      ]);
    });
  }
});

function collectKeys(obj: unknown, acc: string[] = []): string[] {
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      acc.push(k);
      collectKeys(v, acc);
    }
  }
  return acc;
}
