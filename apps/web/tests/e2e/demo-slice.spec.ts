import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// GATE 4 slice: SH-01 (Demo Entry and Actor Switch) → SH-02 (Truth Ledger). These are rendered
// checks over the real screens — navigation, Persian-first RTL, and truthful capability labels at
// the point of use (docs/product/screen-inventory.md; docs/demo-truth-matrix.md).

const DEMO = '/demo';
const TRUTH = '/truth';

/**
 * Navigate to SH-01, then wait until this tab's demo session has been read.
 *
 * SH-01 is server-rendered with no active actor and swaps in the tab's own session once the
 * client mounts, so a click that lands before that is a click on markup about to be replaced.
 * The page publishes `data-session-restored` for exactly this.
 */
async function openDemo(page: import('@playwright/test').Page) {
  await page.goto(DEMO);
  await page.locator('[data-session-restored="true"]').waitFor();
}

test.describe('Persian-first RTL foundation (ADR-0005)', () => {
  for (const path of [DEMO, TRUTH]) {
    test(`${path} document root is Persian-first and RTL`, async ({ page }) => {
      await page.goto(path);
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'fa');
      await expect(html).toHaveAttribute('dir', 'rtl');
    });
  }
});

test.describe('SH-01 — Demo Entry and Actor Switch', () => {
  test('declares itself a demo mechanism that does not exist in a real deployment', async ({
    page,
  }) => {
    await page.goto(DEMO);
    const bar = page.getByRole('note', { name: 'نوار نمایش' });
    await expect(bar).toContainText('سازوکار نمایشی');
    await expect(bar).toContainText('در نسخهٔ واقعی');
  });

  test('offers the three actors with their working identifiers', async ({ page }) => {
    await page.goto(DEMO);
    await expect(page.getByTestId('actor-worker')).toContainText('WKR-DEMO-01');
    await expect(page.getByTestId('actor-employer')).toContainText('EMP-DEMO-01');
    await expect(page.getByTestId('actor-operations')).toContainText('عملیات');
  });

  test('states plainly that an unbuilt home is PLANNED and renders no link to it', async ({
    page,
  }) => {
    // W-01 and OPS-01 are not built in this slice. Selecting either must say so and must not
    // render a live destination — "prefer absence over a dead affordance" (color.md).
    for (const [actor, screenId] of [
      ['actor-worker', 'W-01'],
      ['actor-operations', 'OPS-01'],
    ] as const) {
      await openDemo(page);
      await page.getByTestId(actor).click();
      const planned = page.getByTestId('home-planned');
      await expect(planned).toContainText('PLANNED');
      await expect(planned).toContainText(screenId);
      await expect(page.getByTestId('go-home')).toHaveCount(0);
    }
  });

  test('declares that choosing an actor is not signing in', async ({ page }) => {
    await page.goto(DEMO);
    const statement = page.getByTestId('not-authentication');
    await expect(statement).toContainText('حساب کاربری نیست');
    // Nothing on the screen asks for a credential of any kind.
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });

  test('states what the demo session actually is, on the demo bar', async ({ page }) => {
    await page.goto(DEMO);
    const detail = page.getByTestId('demo-bar-detail');
    await expect(detail).toContainText('همین زبانهٔ مرورگر');
    await expect(detail).toContainText('ذخیره یا ارسال نمی‌شود');
  });

  test('the Truth Ledger (SH-02) is reachable from the actor switch', async ({ page }) => {
    await openDemo(page);
    await page.getByTestId('actor-worker').click();
    await page
      .getByTestId('active-actor')
      .getByRole('link', { name: 'رفتن به دفتر شفافیت' })
      .click();
    await expect(page).toHaveURL(/\/truth$/);
    await expect(page.getByRole('heading', { level: 1, name: 'دفتر شفافیت' })).toBeVisible();
  });

  test('does not overflow the page at the 320px baseline', async ({ page }) => {
    await page.goto(DEMO);
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    );
    expect(noOverflow).toBe(true);
  });
});

test.describe('SH-02 — Truth Ledger', () => {
  test('renders the whole capability matrix, legible as levels', async ({ page }) => {
    await page.goto(TRUTH);
    await expect(page.getByTestId('row-1')).toBeVisible();
    await expect(page.getByTestId('row-24')).toBeVisible();
    // The two capabilities this slice built read FUNCTIONAL.
    await expect(page.getByTestId('actual-21')).toHaveText('FUNCTIONAL');
    await expect(page.getByTestId('actual-22')).toHaveText('FUNCTIONAL');
  });

  test('labels simulated and mock capabilities truthfully, in words', async ({ page }) => {
    await page.goto(TRUTH);
    // Authentication (row 17) is SIMULATED; messaging (row 16) is MOCK — the honest gaps.
    await expect(page.getByTestId('actual-17')).toContainText('شبیه‌سازی‌شده');
    await expect(page.getByTestId('actual-16')).toContainText('ساختگی');
    // Escrow (row 12) is never presented as real.
    await expect(page.getByTestId('actual-12')).toHaveText('PLANNED');
  });

  test('every row is a stable deep-link anchor for a truth chip', async ({ page }) => {
    await page.goto(`${TRUTH}#truth-row-8`);
    const row = page.locator('#truth-row-8');
    await expect(row).toBeVisible();
    await expect(page.getByTestId('actual-8')).toContainText('شبیه‌سازی‌شده');
  });

  test('does not overflow the page at the 320px baseline', async ({ page }) => {
    await page.goto(TRUTH);
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    );
    expect(noOverflow).toBe(true);
  });
});

test.describe('Keyboard and accessibility (WCAG 2.2)', () => {
  test('the first interactive element on SH-01 is reachable with a visible ring', async ({
    page,
  }) => {
    await page.goto(DEMO);
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { tag: el.tagName, outlineStyle: cs.outlineStyle };
    });
    expect(focused?.tag).toBe('A');
    expect(focused?.outlineStyle).not.toBe('none');
  });

  for (const path of [DEMO, TRUTH]) {
    test(`no serious or critical axe violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(serious, JSON.stringify(serious.map((v) => v.id))).toEqual([]);
    });
  }
});
