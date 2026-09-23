import { describe, expect, it } from 'vitest';
import { evaluateTravelBoundary, locationExcludes } from './location';

describe('travel boundary evaluation (matching stage 3)', () => {
  it('never filters when the employer recorded no boundary — distance only orders', () => {
    const result = evaluateTravelBoundary(undefined, 40);
    expect(result).toEqual({ kind: 'NoBoundary' });
    expect(locationExcludes(result)).toBe(false);
  });

  it('includes a worker inside a recorded boundary', () => {
    const result = evaluateTravelBoundary({ maxKilometres: 10 }, 6);
    expect(result).toEqual({ kind: 'Within', distanceKilometres: 6 });
    expect(locationExcludes(result)).toBe(false);
  });

  it('excludes only a recorded distance beyond a recorded boundary', () => {
    const result = evaluateTravelBoundary({ maxKilometres: 10 }, 16);
    expect(result).toEqual({ kind: 'Outside', distanceKilometres: 16 });
    expect(locationExcludes(result)).toBe(true);
  });

  it('treats a missing distance as unknown, never as zero and never as beyond the boundary', () => {
    const result = evaluateTravelBoundary({ maxKilometres: 10 }, undefined);
    expect(result).toEqual({ kind: 'UnknownDistance' });
    // Unknown never excludes: a distance nobody recorded is not a distance beyond the boundary.
    expect(locationExcludes(result)).toBe(false);
  });

  it('does not read the boundary value itself as a distance', () => {
    // A boundary of 0 with an unknown distance is still unknown, not "outside".
    expect(evaluateTravelBoundary({ maxKilometres: 0 }, undefined)).toEqual({
      kind: 'UnknownDistance',
    });
  });
});
