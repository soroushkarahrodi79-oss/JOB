import { DomainTransitionError } from './core';

export interface ArrivalCode {
  readonly value: string;
  readonly expiresAt: string;
  readonly used: boolean;
}

/** Functional shared-secret check-in: wrong, expired and replayed codes are rejected. */
export function consumeArrivalCode(code: ArrivalCode, supplied: string, now: string): ArrivalCode {
  if (code.used)
    throw new DomainTransitionError('ArrivalCode', 'Used', 'Consume', 'the code is single-use');
  if (supplied !== code.value)
    throw new DomainTransitionError('ArrivalCode', 'Issued', 'Consume', 'the code does not match');
  if (Date.parse(now) > Date.parse(code.expiresAt))
    throw new DomainTransitionError('ArrivalCode', 'Issued', 'Consume', 'the code has expired');
  return { ...code, used: true };
}
