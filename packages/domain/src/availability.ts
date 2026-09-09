export interface AvailabilityWindow {
  readonly startsAt: string;
  readonly endsAt: string;
}

/** Unknown or malformed windows do not silently cover an opportunity. */
export function coversOpportunityWindow(
  declared: readonly AvailabilityWindow[] | undefined,
  opportunity: AvailabilityWindow,
): boolean {
  if (declared === undefined) return false;
  const start = Date.parse(opportunity.startsAt);
  const end = Date.parse(opportunity.endsAt);
  if (Number.isNaN(start) || Number.isNaN(end) || start >= end) return false;
  return declared.some((window) => {
    const availableStart = Date.parse(window.startsAt);
    const availableEnd = Date.parse(window.endsAt);
    return (
      !Number.isNaN(availableStart) &&
      !Number.isNaN(availableEnd) &&
      availableStart <= start &&
      availableEnd >= end
    );
  });
}
