import type { Attestation } from './core';
import type { DisputeState, EngagementState, PaymentIntentState } from './states';

/**
 * Small, rebuildable derived state used by the prototype. It is intentionally a function of
 * recorded inputs rather than a mutable Passport or trust profile.
 */
export interface EngagementRecord {
  readonly workerId: string;
  readonly employerId: string;
  readonly engagementState: EngagementState;
  readonly paymentState: PaymentIntentState;
  readonly disputeState?: DisputeState;
  readonly arrivedOnTime: boolean;
  readonly cancelledBy?: 'Worker' | 'Employer';
}

export interface WorkerTrustProjection {
  readonly completed: number;
  readonly settled: number;
  readonly cancellations: number;
  readonly onTimeArrivals: number;
  readonly disputes: number;
  readonly attestations: readonly Attestation[];
}

export interface EmployerTrustProjection {
  readonly reportedSettlements: number;
  readonly settlementFailures: number;
  readonly cancellations: number;
  readonly disputes: number;
}

export function deriveWorkerTrust(
  workerId: string,
  records: readonly EngagementRecord[],
  attestations: readonly Attestation[],
): WorkerTrustProjection {
  const own = records.filter((record) => record.workerId === workerId);
  return {
    completed: own.filter(
      (record) => record.engagementState === 'Completed' || record.engagementState === 'Settled',
    ).length,
    settled: own.filter((record) => record.engagementState === 'Settled').length,
    cancellations: own.filter((record) => record.engagementState === 'Cancelled').length,
    onTimeArrivals: own.filter((record) => record.arrivedOnTime).length,
    disputes: own.filter((record) => record.disputeState !== undefined).length,
    attestations,
  };
}

export function deriveEmployerTrust(
  employerId: string,
  records: readonly EngagementRecord[],
): EmployerTrustProjection {
  const own = records.filter((record) => record.employerId === employerId);
  return {
    reportedSettlements: own.filter((record) => record.paymentState === 'SettlementReported')
      .length,
    settlementFailures: own.filter((record) => record.paymentState === 'SettlementFailed').length,
    cancellations: own.filter((record) => record.cancelledBy === 'Employer').length,
    disputes: own.filter((record) => record.disputeState !== undefined).length,
  };
}
