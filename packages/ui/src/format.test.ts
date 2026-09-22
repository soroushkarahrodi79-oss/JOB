import { describe, expect, it } from 'vitest';
import { rial } from '@platform/domain';
import {
  toPersianDigits,
  formatToman,
  formatAmountWithBasis,
  formatJalali,
  formatTimeWindow,
} from './format';

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

  it('reads the date in Tehran, not in the renderer machine s zone', () => {
    // 2026-09-23T20:30Z is already چهارشنبه ۲ مهر in Tehran (UTC+03:30) and would still be
    // سه‌شنبه ۱ مهر in UTC. The date a shift falls on must not depend on where it is rendered.
    expect(formatJalali(new Date('2026-09-23T20:30:00Z'))).toContain('۲');
    expect(formatJalali(new Date('2026-09-23T12:30:00Z'))).toContain('چهارشنبه');
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

  it('renders the clock in Tehran', () => {
    // The featured shift is 16:00–22:00 Tehran, stored as 12:30Z–18:30Z.
    const out = formatTimeWindow(
      new Date('2026-09-23T12:30:00Z'),
      new Date('2026-09-23T18:30:00Z'),
    );
    expect(out).toContain('۱۶:۰۰');
    expect(out).toContain('۲۲:۰۰');
    expect(out).toContain('۶');
  });
});

describe('formatAmountWithBasis', () => {
  it('states what the figure is the price of, for both bases', () => {
    // opportunity-card.md item 6: amount, unit AND basis. Without the basis, 980,000 Toman is
    // either the whole shift obligation or the price of one of its hours.
    const perShift = formatAmountWithBasis(rial(9_800_000), 'PerShift');
    const perHour = formatAmountWithBasis(rial(9_800_000), 'PerHour');
    expect(perShift).toContain('۹۸۰٬۰۰۰');
    expect(perShift).toContain('تومان');
    expect(perShift).toContain('برای کل شیفت');
    expect(perHour).toContain('به ازای هر ساعت');
    expect(perShift).not.toBe(perHour);
  });

  it('renders the same figure for both bases — a rate is never multiplied into a total', () => {
    // There is no authorised rule for turning an hourly rate into a shift obligation, so this
    // function computes nothing. Both strings carry the agreed figure and differ only in words.
    const digitsOf = (text: string) => text.replace(/[^۰-۹]/g, '');
    expect(digitsOf(formatAmountWithBasis(rial(9_800_000), 'PerHour'))).toBe(
      digitsOf(formatAmountWithBasis(rial(9_800_000), 'PerShift')),
    );
  });

  it('binds the figure to its unit and to its basis so a line break cannot separate them', () => {
    // typography.md rule 8: a line break never separates a number from its unit. The joins are
    // no-break spaces; the basis phrase's own internal spacing is ordinary and may wrap.
    const out = formatAmountWithBasis(rial(9_800_000), 'PerHour');
    expect(out).toContain(' تومان');
    expect(out).toContain('تومان به');
  });
});
