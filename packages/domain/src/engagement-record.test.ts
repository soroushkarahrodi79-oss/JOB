import { describe, expect, it } from 'vitest';
import {
  acknowledgeAmendment,
  recordAmendment,
  transitionPreferredCrew,
} from './engagement-record';

describe('engagement record mechanisms', () => {
  it('records and acknowledges a structured amendment without rewriting it', () => {
    const amendment = recordAmendment('InProgress', {
      engagementId: 'ENG-DEMO-01',
      recordedByEmployerId: 'EMP-DEMO-01',
      changedScope: 'Additional closing tasks',
      revisedEndsAt: '2026-09-02T17:00:00Z',
      recordedAt: '2026-09-02T15:00:00Z',
    });
    expect(acknowledgeAmendment(amendment, '2026-09-02T15:01:00Z')).toMatchObject({
      changedScope: 'Additional closing tasks',
      acknowledgedByWorkerAt: '2026-09-02T15:01:00Z',
    });
  });

  it('keeps Preferred Crew relationship transitions explicit', () => {
    expect(transitionPreferredCrew('None', 'Mark')).toBe('Marked');
    expect(transitionPreferredCrew('Marked', 'Remove')).toBe('Removed');
    expect(() => transitionPreferredCrew('Removed', 'Mark')).toThrow(
      'invalid relationship transition',
    );
  });
});
