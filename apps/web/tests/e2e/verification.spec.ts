import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const HARNESS = '/gate2-verification';

test.describe('RTL and Persian foundation (ADR-0005)', () => {
  test('document root is Persian-first and RTL', async ({ page }) => {
    await page.goto(HARNESS);
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'fa');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('the self-hosted Vazirmatn faces load in all three weights (R2 precondition)', async ({
    page,
  }) => {
    await page.goto(HARNESS);
    const loaded = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        w400: document.fonts.check('400 16px Vazirmatn'),
        w600: document.fonts.check('600 16px Vazirmatn'),
        w700: document.fonts.check('700 16px Vazirmatn'),
      };
    });
    expect(loaded).toEqual({ w400: true, w600: true, w700: true });
  });
});

test.describe('R1 — Persian tabular figures (rendered, not declared)', () => {
  test('equal-width Persian digits align a column', async ({ page }) => {
    await page.goto(HARNESS);
    await page.evaluate(() => document.fonts.ready);
    const ones = await page.getByTestId('r1-ones').boundingBox();
    const eights = await page.getByTestId('r1-eights').boundingBox();
    expect(ones).not.toBeNull();
    expect(eights).not.toBeNull();
    // ۱۱۱۱ and ۸۸۸۸ must occupy the same width: that is what tabular figures mean.
    expect(Math.abs((ones?.width ?? 0) - (eights?.width ?? 0))).toBeLessThan(0.6);
  });

  test('no Latin digit leaks into a rendered amount', async ({ page }) => {
    await page.goto(HARNESS);
    const text = (await page.getByTestId('r1-money-column').innerText()).normalize();
    expect(/[0-9]/.test(text)).toBe(false);
    expect(text).toContain('تومان');
  });
});

test.describe('R2 — Persian weight separation', () => {
  test('the three body weights are applied and the face resolves to Vazirmatn', async ({
    page,
  }) => {
    await page.goto(HARNESS);
    await page.evaluate(() => document.fonts.ready);
    for (const [testid, weight] of [
      ['r2-400', '400'],
      ['r2-600', '600'],
      ['r2-700', '700'],
    ] as const) {
      const el = page.getByTestId(testid);
      const style = await el.evaluate((n) => {
        const cs = getComputedStyle(n);
        return { weight: cs.fontWeight, family: cs.fontFamily.toLowerCase() };
      });
      expect(style.weight).toBe(weight);
      expect(style.family).toContain('vazirmatn');
    }
  });
});

test.describe('R3 — epistemic doubled border under forced colors', () => {
  test('the «فرضیه» header still carries the meaning', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(HARNESS);
    const header = page.getByTestId('r3-header');
    await expect(header).toBeVisible();
    await expect(header).toHaveText('فرضیه');
  });
});

test.describe('R4 — truth chips are labelled controls', () => {
  test('SIMULATED and MOCK render as links, labelled in words', async ({ page }) => {
    await page.goto(HARNESS);
    const section = page.getByTestId('r4-truth');
    await expect(section.getByRole('link', { name: /شبیه‌سازی‌شده/ })).toBeVisible();
    await expect(section.getByRole('link', { name: /ساختگی/ })).toBeVisible();
  });
});

test.describe('R5 — Evidence Margin at 320px', () => {
  test('the longest provenance label survives and the page does not overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(HARNESS);
    const row = page.getByTestId('r5-margin');
    await expect(row).toContainText('شبیه‌سازی‌شده');
    await expect(row).toContainText('گواهی سلامت');
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    );
    expect(noOverflow).toBe(true);
  });
});

test.describe('Keyboard and focus (foundations.md; WCAG 2.2)', () => {
  test('the first interactive element is reachable by keyboard with a visible ring', async ({
    page,
  }) => {
    await page.goto(HARNESS);
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { tag: el.tagName, outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth };
    });
    expect(focused?.tag).toBe('A');
    expect(focused?.outlineStyle).not.toBe('none');
  });
});

test.describe('Automated accessibility (necessary, not sufficient)', () => {
  test('no serious or critical axe violations on the harness', async ({ page }) => {
    await page.goto(HARNESS);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(serious, JSON.stringify(serious.map((v) => v.id))).toEqual([]);
  });
});
