import type { AdministrativeLocation } from './core';
import type { Money } from './money';

/** Domain-level outcomes shared by all provider boundaries (ADR-0003). */
export type ProviderFailure =
  | { readonly kind: 'Unavailable'; readonly recoverable: true }
  | { readonly kind: 'Rejected'; readonly recoverable: false; readonly reason: string }
  | { readonly kind: 'Timeout'; readonly recoverable: true }
  | { readonly kind: 'PartialSuccess'; readonly recoverable: true; readonly detail: string }
  | { readonly kind: 'UnknownOutcome'; readonly recoverable: true }
  | { readonly kind: 'MalformedResult'; readonly recoverable: true };

export type ProviderResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly failure: ProviderFailure };

export interface IdentityVerificationPort {
  verifyWorker(
    workerId: string,
  ): Promise<
    ProviderResult<{ readonly verifiedAt: string; readonly source: 'SimulatedIdentityProvider' }>
  >;
}

export interface BusinessVerificationPort {
  verifyEmployer(
    employerId: string,
  ): Promise<
    ProviderResult<{ readonly verifiedAt: string; readonly source: 'SimulatedBusinessRegistry' }>
  >;
}

export interface PaymentPort {
  settle(input: {
    readonly paymentIntentId: string;
    readonly amount: Money;
  }): Promise<
    ProviderResult<{ readonly reportedAt: string; readonly source: 'SimulatedSettlementNetwork' }>
  >;
}

export interface MessagingPort {
  deliver(input: {
    readonly recipientId: string;
    readonly message: string;
  }): Promise<ProviderResult<{ readonly deliveryId: string }>>;
}

export interface GeolocationPort {
  distanceBetween(
    from: AdministrativeLocation,
    to: AdministrativeLocation,
  ): Promise<ProviderResult<{ readonly kilometres: number; readonly simulated: true }>>;
}

export interface AuthenticationPort {
  establishSession(
    subjectId: string,
  ): Promise<ProviderResult<{ readonly sessionId: string; readonly simulated: true }>>;
}

export interface ClockPort {
  now(): string;
}

export interface IdGeneratorPort {
  next(prefix: string): string;
}
