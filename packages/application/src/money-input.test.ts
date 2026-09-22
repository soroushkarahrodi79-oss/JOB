import { describe, expect, it } from 'vitest';
import { rial } from '@platform/domain';
import { parseTomanInput, toTomanInputValue } from './money-input';

describe('Toman input at the storage boundary', () => {
  it('stores ten Rial for every Toman the employer typed', () => {
    const parsed = parseTomanInput('980000');
    expect(parsed.ok && parsed.money).toEqual(rial(9_800_000));
    expect(parsed.ok && parsed.toman).toBe(980_000);
  });

  it('accepts Persian and Arabic-Indic digits, and grouping the user pasted', () => {
    for (const input of ['۹۸۰۰۰۰', '۹۸۰٬۰۰۰', '٩٨٠٠٠٠', '980,000', '980 000']) {
      const parsed = parseTomanInput(input);
      expect(parsed.ok && parsed.money.rialAmount, input).toBe(9_800_000);
    }
  });

  it('refuses a fraction of a Toman rather than truncating it', () => {
    // data-model.md names a Rial/Toman confusion the most likely defect in the project; silently
    // dropping a fraction would change the figure the employer committed to.
    expect(parseTomanInput('980000.5')).toEqual({ ok: false, failure: 'NotAWholeNumber' });
    expect(parseTomanInput('۹۸۰۰۰۰٫۵')).toEqual({ ok: false, failure: 'NotAWholeNumber' });
  });

  it('refuses empty, non-numeric, zero and implausible input with distinct reasons', () => {
    expect(parseTomanInput('   ')).toEqual({ ok: false, failure: 'Empty' });
    expect(parseTomanInput('صد هزار')).toEqual({ ok: false, failure: 'NotANumber' });
    expect(parseTomanInput('0')).toEqual({ ok: false, failure: 'NotPositive' });
    expect(parseTomanInput('99999999999')).toEqual({ ok: false, failure: 'TooLarge' });
  });

  it('never performs floating-point arithmetic on money', () => {
    // A ×10 on an integer stays exact; the parser has no division and no parseFloat.
    const parsed = parseTomanInput('1234567');
    expect(parsed.ok && parsed.money.rialAmount).toBe(12_345_670);
    expect(parsed.ok && Number.isSafeInteger(parsed.money.rialAmount)).toBe(true);
  });

  it('round-trips a stored amount back into the form', () => {
    expect(toTomanInputValue(rial(9_800_000))).toBe('980000');
    expect(() => toTomanInputValue(rial(15))).toThrow(RangeError);
  });
});
