import type {
  AuthenticationPort,
  BusinessVerificationPort,
  ClockPort,
  GeolocationPort,
  IdGeneratorPort,
  IdentityVerificationPort,
  MessagingPort,
  PaymentPort,
  ProviderFailure,
  ProviderResult,
} from '@platform/domain';
import type { AdministrativeLocation } from '@platform/domain';
import type { Money } from '@platform/domain';

export type DeterministicOutcome<T> = ProviderResult<T>;

function nextOutcome<T>(
  outcomes: readonly DeterministicOutcome<T>[],
  cursor: { value: number },
): DeterministicOutcome<T> {
  const index = Math.min(cursor.value, outcomes.length - 1);
  cursor.value += 1;
  const outcome = outcomes[index];
  if (outcome === undefined)
    throw new Error('A simulated adapter requires at least one configured outcome.');
  return outcome;
}

export class SimulatedIdentityVerificationAdapter implements IdentityVerificationPort {
  private readonly cursor = { value: 0 };
  public constructor(
    private readonly outcomes: readonly DeterministicOutcome<{
      readonly verifiedAt: string;
      readonly source: 'SimulatedIdentityProvider';
    }>[],
  ) {}
  public async verifyWorker(_workerId: string) {
    return nextOutcome(this.outcomes, this.cursor);
  }
}

export class SimulatedBusinessVerificationAdapter implements BusinessVerificationPort {
  private readonly cursor = { value: 0 };
  public constructor(
    private readonly outcomes: readonly DeterministicOutcome<{
      readonly verifiedAt: string;
      readonly source: 'SimulatedBusinessRegistry';
    }>[],
  ) {}
  public async verifyEmployer(_employerId: string) {
    return nextOutcome(this.outcomes, this.cursor);
  }
}

export class SimulatedPaymentAdapter implements PaymentPort {
  private readonly cursor = { value: 0 };
  public constructor(
    private readonly outcomes: readonly DeterministicOutcome<{
      readonly reportedAt: string;
      readonly source: 'SimulatedSettlementNetwork';
    }>[],
  ) {}
  public async settle(_input: { readonly paymentIntentId: string; readonly amount: Money }) {
    return nextOutcome(this.outcomes, this.cursor);
  }
}

/** Mock by canonical truth level: it writes nowhere and never sends a message. */
export class MockMessagingAdapter implements MessagingPort {
  public constructor(
    private readonly outcome: DeterministicOutcome<{ readonly deliveryId: string }>,
  ) {}
  public async deliver(_input: { readonly recipientId: string; readonly message: string }) {
    return this.outcome;
  }
}

export class SimulatedGeolocationAdapter implements GeolocationPort {
  public constructor(
    private readonly distances: Readonly<Record<string, number>>,
    private readonly failure?: ProviderFailure,
  ) {}
  public async distanceBetween(from: AdministrativeLocation, to: AdministrativeLocation) {
    if (this.failure !== undefined) return { ok: false as const, failure: this.failure };
    const key = [from.neighbourhood, to.neighbourhood].sort().join('|');
    const kilometres = this.distances[key];
    return kilometres === undefined
      ? {
          ok: false as const,
          failure: { kind: 'MalformedResult' as const, recoverable: true as const },
        }
      : { ok: true as const, value: { kilometres, simulated: true as const } };
  }
}

export class SimulatedAuthenticationAdapter implements AuthenticationPort {
  private readonly cursor = { value: 0 };
  public constructor(
    private readonly outcomes: readonly DeterministicOutcome<{
      readonly sessionId: string;
      readonly simulated: true;
    }>[],
  ) {}
  public async establishSession(_subjectId: string) {
    return nextOutcome(this.outcomes, this.cursor);
  }
}

export class FixedClockAdapter implements ClockPort {
  public constructor(private readonly instant: string) {}
  public now(): string {
    return this.instant;
  }
}

export class SequentialIdGeneratorAdapter implements IdGeneratorPort {
  private sequence = 0;
  public next(prefix: string): string {
    this.sequence += 1;
    return `${prefix}-DEMO-${this.sequence.toString().padStart(4, '0')}`;
  }
}
