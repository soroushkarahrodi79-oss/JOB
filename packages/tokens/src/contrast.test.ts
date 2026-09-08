import { describe, expect, it } from 'vitest';
import { contrastPairs, FLOOR } from './pairs';
import { contrastRatio } from './contrast';

// color.md: contrast is a token constraint, not a review finding. Editing a colour in raw.ts
// that drops a pair below its floor fails here — the pairing is simply not publishable.
describe('contrast pairs meet the color.md floors', () => {
  for (const pair of contrastPairs) {
    it(`${pair.id} (${pair.kind}) >= ${String(FLOOR[pair.kind])}:1`, () => {
      const ratio = contrastRatio(pair.fg, pair.bg);
      expect(ratio, `${pair.id} was ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
        FLOOR[pair.kind],
      );
    });
  }
});
