import type { Money } from '@platform/domain';

// Presentation of numerals, money, and dates (typography.md "Numerals", "Money", "Dates and
// times"). These convert at the boundary: storage stays ASCII/Rial/UTC; presentation is Persian
// digits / Toman / Jalali. ZWNJ and any non-digit character pass through untouched.

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const THOUSANDS = '٬'; // ٬ — the Persian thousands separator
const NBSP = ' '; // binds a number to its unit so a line break never separates them

/** Renders ASCII digits as Persian (Extended Arabic-Indic). Leaves every other character — ZWNJ
 *  included — exactly as-is. */
export function toPersianDigits(input: string): string {
  return input.replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

function groupThousands(n: number): string {
  return Math.trunc(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS);
}

/**
 * Formats money in Toman with Persian digits and its unit. Toman is the only displayed unit
 * (typography.md). The amount is never rounded for display: a Rial value that is not a whole
 * number of Toman is a data defect and throws rather than silently losing money.
 */
export function formatToman(money: Money): string {
  if (money.rialAmount % 10 !== 0) {
    throw new RangeError(
      `formatToman: ${String(money.rialAmount)} Rial is not a whole number of Toman; display must not round (typography.md).`,
    );
  }
  const toman = money.rialAmount / 10;
  const sign = toman < 0 ? '−' : '';
  return `${sign}${toPersianDigits(groupThousands(Math.abs(toman)))}${NBSP}تومان`;
}

const jalali = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const clock = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { hour: '2-digit', minute: '2-digit' });

/** A Jalali date carrying its weekday (typography.md: "A date carries its weekday"). */
export function formatJalali(date: Date): string {
  return jalali.format(date);
}

/** A time window as a single unit — start, end and duration — never two facts to subtract. */
export function formatTimeWindow(start: Date, end: Date): string {
  const hours = Math.round((end.getTime() - start.getTime()) / 3_600_000);
  const duration = `${toPersianDigits(String(hours))}${NBSP}ساعت`;
  return `${clock.format(start)} تا ${clock.format(end)}${NBSP}(${duration})`;
}
