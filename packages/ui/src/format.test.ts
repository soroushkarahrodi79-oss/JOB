import { describe, expect, it } from 'vitest';
import { rial } from '@platform/domain';
import { toPersianDigits, formatToman, formatJalali, formatTimeWindow } from './format';

const ASCII_DIGIT = /[0-9]/;

describe('toPersianDigits', () => {
  it('converts ASCII digits to Persian', () => {
    expect(toPersianDigits('2024')).toBe('۲۰۲۴');
  });
  it('leaves ZWNJ and other characters untouched', () => {
    const withZwnj = 'پیش‌نویس 12';
    const out = toPersianDigits(withZwnj);
    expect(out).toContain('‌'); // ZWNJ (U+200C) survived
    expect(out).toContain('۱۲');
  });
});

describe('formatToman', () => {
  it('presents Rial as grouped Persian-digit Toman with its unit', () => {
    const out = formatToman(rial(1_500_000)); // 150,000 Toman
    expect(out).toContain('۱۵۰٬۰۰۰');
    expect(out).toContain('تومان');
    expect(ASCII_DIGIT.test(out)).toBe(false); // no Latin digits leak
  });
  it('never rounds for display: a non-whole-Toman Rial value throws', () => {
    expect(() => formatToman(rial(15))).toThrow(RangeError);
  });
});

describe('formatJalali', () => {
  it('renders a Persian-digit Jalali date carrying its weekday', () => {
    const out = formatJalali(new Date('2025-09-08T09:00:00Z'));
    expect(out.length).toBeGreaterThan(0);
    expect(ASCII_DIGIT.test(out)).toBe(false);
    expect(/[۰-۹]/.test(out)).toBe(true);
  });
});

describe('formatTimeWindow', () => {
  it('renders start, end and duration as one unit', () => {
    const out = formatTimeWindow(
      new Date('2025-09-08T08:00:00Z'),
      new Date('2025-09-08T12:00:00Z'),
    );
    expect(out).toContain('تا');
    expect(out).toContain('ساعت');
    expect(ASCII_DIGIT.test(out)).toBe(false);
  });
});
