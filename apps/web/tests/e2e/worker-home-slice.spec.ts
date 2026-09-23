import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEMO = '/demo';
const WORKER = '/worker';
const CREATE = '/employer/opportunity/new';
const FACTORS = '/employer/opportunity/new/factors';
const CANDIDATES = '/employer/opportunity/OPP-DEMO-01/candidates';

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function publish(page: Page) {
  await open(page, DEMO);
  await page.getByTestId('actor-employer').click();
  await open(page, CREATE);
  await page.getByTestId('record-commitment').check();
  await page.getByTestId('continue').click();
  await page.waitForURL(`**${FACTORS}`);
  await page.getByTestId('factor-DirectionAndControl-employmentLike').check();
  await page.getByTestId('factor-ToolsAndMaterials-employmentLike').check();
  await page.getByTestId('factor-Integration-undecided').check();
  await page.getByTestId('publish').click();
  await expect(page.getByTestId('published-state')).toBeVisible();
}

async function enterWorker(page: Page) {
  await open(page, DEMO);
  await page.getByTestId('actor-worker').click();
  await expect(page.getByTestId('home-built')).toContainText('W-01');
  await page.getByTestId('go-home').click();
  await expect(page).toHaveURL(/\/worker$/);
  await page.locator('[data-session-restored="true"]').waitFor();
}

test.describe('W-01 — one-world worker home', () => {
  test('empty means no employer-published opportunity or invented work', async ({ page }) => {
    await open(page, WORKER);
    await expect(page.getByTestId('worker-home-forbidden')).toBeVisible();
    await enterWorker(page);
    await expect(page.getByTestId('worker-feed-empty')).toBeVisible();
    await expect(page.getByTestId('worker-work-empty')).toBeVisible();
    await expect(page.getByTestId('worker-navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: 'کارنامه' })).toHaveCount(0);
    await expect(page.getByTestId('worker-eligible-opportunity')).toHaveCount(0);
  });

  test('renders the employer-published opportunity without fabricating an invitation', async ({
    page,
  }) => {
    await publish(page);
    await enterWorker(page);
    await expect(page.getByTestId('worker-eligible-opportunity')).toHaveCount(1);
    await expect(page.getByTestId('worker-inclusion-reason')).toBeVisible();
    await expect(page.getByTestId('worker-not-invited')).toContainText('PLANNED');
    await expect(page.getByTestId('worker-feed-detail')).toHaveCount(0);
    await expect(page.getByTestId('worker-work-empty')).toBeVisible();
    const summary = page.getByTestId('worker-opportunity-summary');
    await expect(summary).toContainText('۹۸۰');
    await expect(summary).toContainText('Demo-Centre');
    const headings = await page.locator('main h2').allTextContents();
    expect(headings[0]).toContain('فرصت‌های واجد شرایط');
    expect(headings[1]).toContain('کارهای من');
  });

  test('published opportunity keeps its facts and role labels legible at 320px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await publish(page);
    await enterWorker(page);
    await expect(page.getByTestId('worker-opportunity-summary')).toBeVisible();
    await expect(page.getByTestId('worker-inclusion-reason')).toBeVisible();
    await expect(page.getByTestId('worker-not-invited')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
      ),
    ).toBe(true);
  });

  test('opens only the existing invitation detail and survives reload', async ({ page }) => {
    await publish(page);
    await open(page, CANDIDATES);
    await page.getByTestId('invite-WKR-DEMO-01').click();
    await expect(page.getByTestId('invited-WKR-DEMO-01')).toBeVisible();
    await enterWorker(page);
    await expect(page.getByTestId('worker-offered-work')).toHaveCount(1);
    await expect(page.getByTestId('worker-feed-detail')).toHaveAttribute(
      'href',
      '/worker/opportunity/OPP-DEMO-01',
    );
    await page.getByTestId('worker-feed-detail').click();
    await expect(page.getByTestId('worker-invitation-detail')).toBeVisible();
    await expect(page.getByRole('button', { name: /پذیرش/ })).toHaveCount(0);
    await open(page, WORKER);
    await page.reload();
    await page.locator('[data-session-restored="true"]').waitFor();
    await expect(page.getByTestId('worker-offered-work')).toContainText('Offered');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => v.id),
    ).toEqual([]);
  });
});
