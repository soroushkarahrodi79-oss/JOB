import type { TravelBoundary } from './core';

/**
 * The outcome of comparing a worker's distance against an opportunity's travel boundary.
 *
 * The four cases are kept apart on purpose, because collapsing them is how missing information
 * turns into a false fact (matching.md; the GATE 4 candidate-list requirement that "missing
 * distance data must not be interpreted as zero distance"):
 *
 *   NoBoundary      — the employer recorded no boundary. Distance orders, it never excludes.
 *   Within          — a boundary is set and the recorded distance is inside it.
 *   Outside         — a boundary is set and the recorded distance is beyond it. The one exclusion.
 *   UnknownDistance — a boundary is set but no distance is recorded. Not inside, not beyond, and
 *                     never silently either: an unknown distance leaves the worker a candidate with
 *                     an unknown location, exactly as an unrecorded availability does.
 */
export type LocationEvaluation =
  | { readonly kind: 'NoBoundary' }
  | { readonly kind: 'Within'; readonly distanceKilometres: number }
  | { readonly kind: 'Outside'; readonly distanceKilometres: number }
  | { readonly kind: 'UnknownDistance' };

/**
 * Evaluates a worker's distance against an opportunity's travel boundary.
 *
 * Only `Outside` excludes. A boundary with no distance to compare against yields `UnknownDistance`,
 * never `Outside`: treating a missing distance as beyond the boundary would exclude a worker for a
 * fact nobody recorded, which is the "missing must remain unknown" rule inverted.
 */
export function evaluateTravelBoundary(
  boundary: TravelBoundary | undefined,
  distanceKilometres: number | undefined,
): LocationEvaluation {
  if (boundary === undefined) return { kind: 'NoBoundary' };
  if (distanceKilometres === undefined || Number.isNaN(distanceKilometres)) {
    return { kind: 'UnknownDistance' };
  }
  return distanceKilometres <= boundary.maxKilometres
    ? { kind: 'Within', distanceKilometres }
    : { kind: 'Outside', distanceKilometres };
}

/** Whether a location evaluation is a hard exclusion. Only a recorded distance beyond a set boundary is. */
export function locationExcludes(evaluation: LocationEvaluation): boolean {
  return evaluation.kind === 'Outside';
}
