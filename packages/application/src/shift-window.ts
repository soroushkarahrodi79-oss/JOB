// Shift dates and times, between what the employer picks and what the domain stores.
//
// Storage is a UTC instant (architecture/data-model.md). The employer picks a civil date and a
// wall-clock time in Tehran, because that is the only place the prototype's work happens
// (demo-dataset.md, *Geography*). Jalali rendering of these values belongs to the presentation
// layer (@platform/ui `formatJalali` / `formatTimeWindow`); this module deals only in the civil
// values and the instants they convert to, so the conversion is testable without a formatter.
//
// Iran has observed no daylight saving since 2022, so the offset is a constant rather than a
// lookup. If that changes it changes here, in one place, rather than in every caller.

const TEHRAN_OFFSET_MINUTES = 210; // UTC+03:30
const MINUTES_PER_DAY = 24 * 60;

export interface CivilDate {
  readonly year: number;
  readonly month: number; // 1–12, Gregorian. Jalali is presentation only.
  readonly day: number;
}

/** The civil date in Tehran at a given UTC instant. */
export function tehranCivilDate(instant: string): CivilDate {
  const shifted = new Date(new Date(instant).getTime() + TEHRAN_OFFSET_MINUTES * 60_000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

/** The UTC instant of a Tehran wall-clock time on a civil date. */
export function tehranInstant(date: CivilDate, minutesFromMidnight: number): string {
  const utcMillis =
    Date.UTC(date.year, date.month - 1, date.day) +
    (minutesFromMidnight - TEHRAN_OFFSET_MINUTES) * 60_000;
  return new Date(utcMillis).toISOString();
}

/** A stable, ASCII form for a `<select>` value. Never shown to a user — Jalali is. */
export function civilDateKey(date: CivilDate): string {
  const pad = (n: number): string => n.toString().padStart(2, '0');
  return `${String(date.year)}-${pad(date.month)}-${pad(date.day)}`;
}

export function parseCivilDateKey(key: string): CivilDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (match === null) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const candidate = { year, month, day };
  // Reject 31 Bahman and its kind: round-tripping catches an out-of-range day without a table.
  return civilDateKey(tehranCivilDate(tehranInstant(candidate, 12 * 60))) === key
    ? candidate
    : null;
}

/**
 * The dates the employer may choose from, starting at the demo's today.
 *
 * A bounded list rather than a free date field, and deliberately: the prototype has no Jalali date
 * picker, and a Gregorian one would be the "visibly foreign" defect rtl-accessibility.md rule 8
 * names. Each option is rendered as a Jalali date carrying its weekday by the presentation layer.
 */
export function shiftDateOptions(nowInstant: string, count = 14): readonly CivilDate[] {
  const today = tehranCivilDate(nowInstant);
  const base = Date.UTC(today.year, today.month - 1, today.day);
  return Array.from({ length: count }, (_, offset) => {
    const day = new Date(base + offset * MINUTES_PER_DAY * 60_000);
    return { year: day.getUTCFullYear(), month: day.getUTCMonth() + 1, day: day.getUTCDate() };
  });
}

/** Wall-clock start times, in minutes from midnight. Half-hour steps over a working day. */
export function shiftTimeOptions(): readonly number[] {
  return Array.from({ length: 37 }, (_, step) => 6 * 60 + step * 30); // 06:00 → 24:00
}

/** Minutes from midnight as a clock string the presentation layer converts to Persian digits. */
export function minutesToClock(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const rest = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${rest.toString().padStart(2, '0')}`;
}

/** The Tehran wall-clock minutes-from-midnight of a stored instant. */
export function tehranMinutesFromMidnight(instant: string): number {
  const shifted = new Date(new Date(instant).getTime() + TEHRAN_OFFSET_MINUTES * 60_000);
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
}
