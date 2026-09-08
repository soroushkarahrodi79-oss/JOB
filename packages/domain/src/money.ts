// Monetary representation. data-model.md: "Integer minor units plus an explicit currency and
// unit. Never floating point. Never a bare number." The stored unit is Rial; Toman is a
// presentation concern converted at the boundary (see packages/ui presentation), never stored.
// A Rial/Toman confusion is identified as the single most likely data defect in the project, so
// the type makes the unit explicit and the constructor refuses a non-integer.
//
// This is representation only. Monetary arithmetic (a ledger) is domain behaviour and lands at
// GATE 3; nothing here performs it.

export type CurrencyCode = 'IRR';

export interface Money {
  /** The ISO 4217 code. Rial is the stored unit. */
  readonly currency: CurrencyCode;
  /** Whole Rial. Integer by construction. */
  readonly rialAmount: number;
}

export function rial(amount: number): Money {
  if (!Number.isInteger(amount)) {
    throw new RangeError(
      `Money must be a whole number of Rial (data-model.md: never floating point). Received ${String(amount)}.`,
    );
  }
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError(`Money amount ${String(amount)} exceeds safe integer range.`);
  }
  return { currency: 'IRR', rialAmount: amount };
}

export function moneyEquals(a: Money, b: Money): boolean {
  return a.currency === b.currency && a.rialAmount === b.rialAmount;
}
