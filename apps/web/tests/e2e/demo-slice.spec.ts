import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// SH-01 actor switch and SH-02 truth ledger: one world, no authentication claim.
const DEMO = '/demo';
const TRUTH = '/truth';

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

  test('routes the worker to built W-01 while keeping OPS-01 PLANNED and unlinked', async ({
    page,
  }) => {
    await openDemo(page);
    await page.getByTestId('actor-worker').click();
    await expect(page.getByTestId('home-built')).toContainText('W-01');
    await page.getByTestId('go-home').click();
    await expect(page).toHaveURL(/\/worker$/);
    await openDemo(page);
    await page.getByTestId('actor-operations').click();
    await expect(page.getByTestId('home-planned')).toContainText('OPS-01');
    await expect(page.getByTestId('home-planned')).toContainText('PLANNED');
    await expect(page.getByTestId('go-home')).toHaveCount(0);
  });

  test('declares that choosing an actor is not signing in', async ({ page }) => {
    await page.goto(DEMO);
    const statement = page.getByTestId('not-authentication');
    await expect(statement).toContainText('حساب کاربری نیست');
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
    await expect(page.getByTestId('actual-21')).toHaveText('FUNCTIONAL');
    await expect(page.getByTestId('actual-22')).toHaveText('FUNCTIONAL');
  });

  test('labels simulated and mock capabilities truthfully, in words', async ({ page }) => {
    await page.goto(TRUTH);
    await expect(page.getByTestId('actual-17')).toContainText('شبیه‌سازی‌شده');
    await expect(page.getByTestId('actual-16')).toContainText('ساختگی');
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
