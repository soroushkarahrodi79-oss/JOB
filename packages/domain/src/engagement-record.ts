import { DomainTransitionError } from './core';
import type { EngagementState, PreferredCrewState } from './states';

/** Immutable structured evidence of a change to already-accepted work; never free-form chat. */
export interface EngagementAmendment {
  readonly engagementId: string;
  readonly recordedByEmployerId: string;
  readonly changedScope: string;
  readonly revisedEndsAt: string;
  readonly recordedAt: string;
  readonly acknowledgedByWorkerAt?: string;
}

export function recordAmendment(
  engagementState: EngagementState,
  amendment: EngagementAmendment,
): EngagementAmendment {
  if (engagementState !== 'Accepted' && engagementState !== 'InProgress') {
    throw new DomainTransitionError(
      'Engagement',
      engagementState,
      'RecordAmendment',
      'only live engagements can be amended',
    );
  }
  if (amendment.changedScope.trim().length === 0) {
    throw new DomainTransitionError(
      'EngagementAmendment',
      'Unrecorded',
      'Record',
      'the changed scope is required',
    );
  }
  return { ...amendment };
}

export function acknowledgeAmendment(
  amendment: EngagementAmendment,
  acknowledgedAt: string,
): EngagementAmendment {
  if (amendment.acknowledgedByWorkerAt !== undefined) {
    throw new DomainTransitionError(
      'EngagementAmendment',
      'Acknowledged',
      'Acknowledge',
      'an amendment is acknowledged once',
    );
  }
  return { ...amendment, acknowledgedByWorkerAt: acknowledgedAt };
}

/** The only Preferred Crew transitions canonically defined: none → marked → removed. */
export function transitionPreferredCrew(
  current: PreferredCrewState | 'None',
  command: 'Mark' | 'Remove',
): PreferredCrewState {
  if (command === 'Mark' && current === 'None') return 'Marked';
  if (command === 'Remove' && current === 'Marked') return 'Removed';
  throw new DomainTransitionError(
    'PreferredCrew',
    current,
    command,
    'invalid relationship transition',
  );
}
