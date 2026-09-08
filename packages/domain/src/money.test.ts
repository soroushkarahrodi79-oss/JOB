import { describe, expect, it } from 'vitest';
import { rial, moneyEquals } from './money';

describe('Money representation (data-model.md)', () => {
  it('constructs whole Rial with an explicit currency', () => {
    expect(rial(1_500_000)).toEqual({ currency: 'IRR', rialAmount: 1_500_000 });
  });

  it('refuses a floating-point amount', () => {
    expect(() => rial(1500.5)).toThrow(RangeError);
  });

  it('refuses an unsafe integer', () => {
    expect(() => rial(Number.MAX_SAFE_INTEGER + 2)).toThrow(RangeError);
  });

  it('compares by currency and amount', () => {
    expect(moneyEquals(rial(10), rial(10))).toBe(true);
    expect(moneyEquals(rial(10), rial(20))).toBe(false);
  });
});
