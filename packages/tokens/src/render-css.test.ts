import { describe, expect, it } from 'vitest';
import { renderCss } from './render-css';

const css = renderCss();

describe('generated token CSS', () => {
  it('declares the body anchor and the amount role', () => {
    expect(css).toContain('--type-body-size: 17px;');
    expect(css).toContain('--type-amount-size: 24px;');
  });

  it('uses no physical left/right declarations (ADR-0005)', () => {
    // Match CSS declarations like `left:` / `margin-right:`, not the word inside a value.
    expect(/(^|[\s;{])(?:[a-z-]*-)?(left|right)\s*:/m.test(css)).toBe(false);
  });

  it('zeroes every motion duration under reduced motion (foundations.md)', () => {
    const block = css.slice(css.indexOf('prefers-reduced-motion'));
    expect(block).toContain('--motion-duration-short: 0ms;');
    expect(block).toContain('--motion-duration-medium: 0ms;');
  });

  it('rebinds density aliases for all three actors', () => {
    expect(css).toContain("[data-density='worker']");
    expect(css).toContain("[data-density='employer']");
    expect(css).toContain("[data-density='operations']");
  });

  it('emits tabular-nums for the numeric and amount roles (typography.md)', () => {
    expect(css).toMatch(/\.type-numeric\s*\{[^}]*font-variant-numeric: tabular-nums;/s);
    expect(css).toMatch(/\.type-amount\s*\{[^}]*font-variant-numeric: tabular-nums;/s);
  });
});
