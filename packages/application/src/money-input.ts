import { rial, type Money } from '@platform/domain';

// Money enters the product as an employer typing Toman and is stored as integer Rial
// (architecture/data-model.md: "The stored unit is Rial. Toman is a presentation concern and is
// converted at the boundary"). This module is that boundary, and it is the only place the ×10
// conversion happens.
//
// A 10× Rial/Toman error is named in data-model.md as the single most likely data defect in the
// project, so the conversion is integer-only from end to end: there is no parseFloat, no division,
// and no rounding anywhere in this file. An input that is not a whole number of Toman is refused
// rather than coerced.

const PERSIAN_ZERO = 0x06f0; // ۰ — Extended Arabic-Indic
const ARABIC_ZERO = 0x0660; // ٠ — Arabic-Indic

/** Separators an Iranian user plausibly types or pastes, all of which mean "ignore me". */
const SEPARATORS = new Set([',', '٬', '،', '.', '٫', ' ', ' ', '‏', '‎', '_', '-']);

export type TomanParseFailure =
  | 'Empty'
  | 'NotANumber'
  | 'NotAWholeNumber'
  | 'NotPositive'
  | 'TooLarge';

export type TomanParseResult =
  | { readonly ok: true; readonly money: Money; readonly toman: number }
  | { readonly ok: false; readonly failure: TomanParseFailure };

/** Whole Toman, in Rial. 100,000,000,000 Rial is far above any plausible shift and well inside
 *  the safe-integer range, so the ceiling exists to reject a paste, not to cap a real figure. */
const MAX_RIAL = 100_000_000_000;

function asciiDigit(codePoint: number): string | null {
  if (codePoint >= 0x30 && codePoint <= 0x39) return String.fromCharCode(codePoint);
  if (codePoint >= PERSIAN_ZERO && codePoint <= PERSIAN_ZERO + 9) {
    return String.fromCharCode(0x30 + (codePoint - PERSIAN_ZERO));
  }
  if (codePoint >= ARABIC_ZERO && codePoint <= ARABIC_ZERO + 9) {
    return String.fromCharCode(0x30 + (codePoint - ARABIC_ZERO));
  }
  return null;
}

/**
 * Parses an amount the employer typed in Toman into stored Rial.
 *
 * Accepts Persian, Arabic-Indic and ASCII digits, because users type in all three
 * (data-model.md, *Digits*). A decimal separator is refused rather than truncated: a fractional
 * Toman is not a figure this product can commit to, and silently dropping it would change the
 * amount the employer agreed to pay.
 */
export function parseTomanInput(raw: string): TomanParseResult {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { ok: false, failure: 'Empty' };

  let digits = '';
  let sawDecimalSeparator = false;
  let sawFractionalDigits = false;
  for (const character of trimmed) {
    const converted = asciiDigit(character.codePointAt(0) ?? -1);
    if (converted !== null) {
      digits += converted;
      // A digit after a decimal mark is a fraction of a Toman, in whichever script it was typed.
      if (sawDecimalSeparator) sawFractionalDigits = true;
      continue;
    }
    if (character === '.' || character === '٫') sawDecimalSeparator = true;
    if (!SEPARATORS.has(character)) return { ok: false, failure: 'NotANumber' };
  }

  if (digits.length === 0) return { ok: false, failure: 'NotANumber' };
  if (sawFractionalDigits) return { ok: false, failure: 'NotAWholeNumber' };

  const toman = Number(digits);
  if (!Number.isInteger(toman)) return { ok: false, failure: 'NotAWholeNumber' };
  if (toman <= 0) return { ok: false, failure: 'NotPositive' };
  if (toman * 10 > MAX_RIAL) return { ok: false, failure: 'TooLarge' };

  return { ok: true, money: rial(toman * 10), toman };
}

/** The stored Rial figure as whole Toman, for pre-filling an input the employer may edit. */
export function toTomanInputValue(money: Money): string {
  if (money.rialAmount % 10 !== 0) {
    throw new RangeError(
      `toTomanInputValue: ${String(money.rialAmount)} Rial is not a whole number of Toman.`,
    );
  }
  return String(money.rialAmount / 10);
}
