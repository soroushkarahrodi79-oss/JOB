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

/**
 * The outcome of comparing a worker's declared availability against an opportunity's window.
 *
 * `Unknown` and `DoesNotCover` are different facts and are never merged. A worker who declared
 * availability that does not reach the window has *told us* she is unavailable — a hard exclusion.
 * A worker who declared no availability at all has told us nothing, and an absence of information is
 * not an absence of availability: she stays a candidate whose availability is unknown, exactly as an
 * unknown distance does not exclude (matching.md; the GATE 4 requirement that "availability and
 * missing availability are treated differently").
 */
export type AvailabilityEvaluation =
  | { readonly kind: 'Covers' }
  | { readonly kind: 'DoesNotCover' }
  | { readonly kind: 'Unknown' };

export function evaluateAvailability(
  declared: readonly AvailabilityWindow[] | undefined,
  opportunity: AvailabilityWindow,
): AvailabilityEvaluation {
  if (declared === undefined || declared.length === 0) return { kind: 'Unknown' };
  return coversOpportunityWindow(declared, opportunity)
    ? { kind: 'Covers' }
    : { kind: 'DoesNotCover' };
}

/** Whether an availability evaluation is a hard exclusion. Only a recorded, non-covering window is. */
export function availabilityExcludes(evaluation: AvailabilityEvaluation): boolean {
  return evaluation.kind === 'DoesNotCover';
}
