import { describe, expect, it } from 'vitest';
import {
  availabilityExcludes,
  coversOpportunityWindow,
  evaluateAvailability,
  type AvailabilityWindow,
} from './availability';

const WINDOW: AvailabilityWindow = {
  startsAt: '2026-09-23T12:30:00.000Z',
  endsAt: '2026-09-23T18:30:00.000Z',
};

describe('availability coverage', () => {
  it('covers a window fully contained in a declared window', () => {
    expect(
      coversOpportunityWindow(
        [{ startsAt: '2026-09-23T06:00:00.000Z', endsAt: '2026-09-23T20:00:00.000Z' }],
        WINDOW,
      ),
    ).toBe(true);
  });

  it('does not silently cover from an undefined or malformed declaration', () => {
    expect(coversOpportunityWindow(undefined, WINDOW)).toBe(false);
    expect(coversOpportunityWindow([{ startsAt: 'not-a-date', endsAt: 'x' }], WINDOW)).toBe(false);
  });
});

describe('availability evaluation treats missing and unavailable differently', () => {
  it('covers when a declared window contains the shift', () => {
    const result = evaluateAvailability(
      [{ startsAt: '2026-09-23T06:00:00.000Z', endsAt: '2026-09-23T20:00:00.000Z' }],
      WINDOW,
    );
    expect(result).toEqual({ kind: 'Covers' });
    expect(availabilityExcludes(result)).toBe(false);
  });

  it('excludes when a declared window exists but does not reach the shift', () => {
    // Morning only: it ends before the shift starts. A recorded conflict, and a hard exclusion.
    const result = evaluateAvailability(
      [{ startsAt: '2026-09-23T02:00:00.000Z', endsAt: '2026-09-23T10:00:00.000Z' }],
      WINDOW,
    );
    expect(result).toEqual({ kind: 'DoesNotCover' });
    expect(availabilityExcludes(result)).toBe(true);
  });

  it('leaves an undeclared availability unknown, and unknown never excludes', () => {
    for (const declared of [undefined, [] as AvailabilityWindow[]]) {
      const result = evaluateAvailability(declared, WINDOW);
      expect(result).toEqual({ kind: 'Unknown' });
      // Missing information stays unknown; it never becomes an "unavailable" fact.
      expect(availabilityExcludes(result)).toBe(false);
    }
  });
});
