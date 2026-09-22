import { describe, expect, it } from 'vitest';
import { DEMO_NOW, FEATURED_OPPORTUNITY_PLAN } from '@platform/domain';
import {
  civilDateKey,
  minutesToClock,
  parseCivilDateKey,
  shiftDateOptions,
  shiftTimeOptions,
  tehranCivilDate,
  tehranInstant,
  tehranMinutesFromMidnight,
} from './shift-window';

describe('shift dates and times', () => {
  it('reads the demo today in Tehran, not in UTC', () => {
    expect(tehranCivilDate(DEMO_NOW)).toEqual({ year: 2026, month: 9, day: 22 });
    // 21:00Z on the 22nd is already the 23rd in Tehran (UTC+03:30).
    expect(tehranCivilDate('2026-09-22T21:00:00.000Z')).toEqual({
      year: 2026,
      month: 9,
      day: 23,
    });
  });

  it('converts a Tehran wall-clock shift to the instant the domain stores', () => {
    // The featured shift is 16:00–22:00 Tehran on چهارشنبه ۱ مهر ۱۴۰۵.
    expect(tehranInstant({ year: 2026, month: 9, day: 23 }, 16 * 60)).toBe(
      FEATURED_OPPORTUNITY_PLAN.workStartsAt,
    );
    expect(tehranInstant({ year: 2026, month: 9, day: 23 }, 22 * 60)).toBe(
      FEATURED_OPPORTUNITY_PLAN.workEndsAt,
    );
  });

  it('round-trips an instant back to the wall-clock the employer chose', () => {
    expect(tehranMinutesFromMidnight(FEATURED_OPPORTUNITY_PLAN.workStartsAt)).toBe(16 * 60);
    expect(tehranMinutesFromMidnight(FEATURED_OPPORTUNITY_PLAN.workEndsAt)).toBe(22 * 60);
  });

  it('offers dates starting at the demo today and rolls across a month end', () => {
    const options = shiftDateOptions(DEMO_NOW, 3);
    expect(options.map(civilDateKey)).toEqual(['2026-09-22', '2026-09-23', '2026-09-24']);
    const acrossMonthEnd = shiftDateOptions('2026-09-29T06:00:00.000Z', 3);
    expect(acrossMonthEnd.map(civilDateKey)).toEqual(['2026-09-29', '2026-09-30', '2026-10-01']);
  });

  it('refuses a date key that is not a real date', () => {
    expect(parseCivilDateKey('2026-09-23')).toEqual({ year: 2026, month: 9, day: 23 });
    expect(parseCivilDateKey('2026-09-31')).toBeNull();
    expect(parseCivilDateKey('2026-13-01')).toBeNull();
    expect(parseCivilDateKey('tomorrow')).toBeNull();
  });

  it('offers half-hour start times across a working day', () => {
    const times = shiftTimeOptions();
    expect(minutesToClock(times[0] ?? -1)).toBe('06:00');
    expect(minutesToClock(times[times.length - 1] ?? -1)).toBe('00:00');
    expect(
      times.every((minutes, index) => index === 0 || minutes - (times[index - 1] ?? 0) === 30),
    ).toBe(true);
  });
});
