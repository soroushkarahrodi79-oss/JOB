import type { Money, PayBasis } from '@platform/domain';

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

// Storage is a UTC instant; presentation is Jalali in the originating zone (data-model.md:
// "UTC instant plus the originating time zone"). The prototype's one market is Tehran
// (demo-dataset.md "Geography"), so the zone is pinned rather than taken from the renderer's
// machine: a shift stored as 12:30Z is 16:00 in Tehran and must read as 16:00 wherever the page
// is rendered, including on a server in another zone. Reading the host zone would also be able to
// move a shift across a Jalali day boundary, which is a date defect, not a formatting one.
const TEHRAN = 'Asia/Tehran';

const jalali = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: TEHRAN,
});

const clock = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TEHRAN,
});

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

/**
 * What a pay figure is the price of, in the employer's and the worker's own words.
 *
 * design/components/opportunity-card.md requires every rendered pay figure to carry "amount in
 * Toman, its unit, and its basis (per shift, per hour)". The basis is not a qualifier that a
 * layout may drop under pressure: without it, ۹۸۰٬۰۰۰ تومان is either the whole obligation for a
 * shift or the price of one of its hours, and those are different agreements.
 */
export const PAY_BASIS_LABEL: Readonly<Record<PayBasis, string>> = {
  PerShift: 'برای کل شیفت',
  PerHour: 'به ازای هر ساعت',
};

/**
 * An amount bound to its unit and its basis, so a line break can separate neither.
 *
 * This renders what was agreed and computes nothing. A `PerHour` figure is NOT multiplied out
 * into a shift total anywhere in this system: converting a rate into an obligation needs a rule
 * for rounding, breaks and overruns that this project has not established, and inventing one here
 * would put a number on the screen that the employer never agreed to pay.
 */
export function formatAmountWithBasis(money: Money, basis: PayBasis): string {
  return `${formatToman(money)}${NBSP}${PAY_BASIS_LABEL[basis]}`;
}
