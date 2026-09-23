import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEMO = '/demo';
const CREATE = '/employer/opportunity/new';
const FACTORS = '/employer/opportunity/new/factors';
const CANDIDATES = '/employer/opportunity/OPP-DEMO-01/candidates';
const DETAIL = '/worker/opportunity/OPP-DEMO-01';

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function inviteFirstWorker(page: Page) {
  await open(page, DEMO);
  await page.getByTestId('actor-employer').click();
  await page.getByTestId('go-home').click();
  await open(page, CREATE);
  await page.getByTestId('record-commitment').check();
  await page.getByTestId('continue').click();
  await page.waitForURL(`**${FACTORS}`);
  await page.locator('[data-session-restored="true"]').waitFor();
  await page.getByTestId('factor-DirectionAndControl-employmentLike').check();
  await page.getByTestId('factor-ToolsAndMaterials-employmentLike').check();
  await page.getByTestId('factor-Integration-undecided').check();
  await page.getByTestId('publish').click();
  await expect(page.getByTestId('published-state')).toBeVisible();
  await page.getByTestId('go-candidates').click();
  await page.waitForURL(`**${CANDIDATES}`);
  await page.locator('[data-session-restored="true"]').waitFor();
  await page.getByTestId('invite-WKR-DEMO-01').click();
  await expect(page.getByTestId('invited-WKR-DEMO-01')).toBeVisible();
}

test.describe('W-02 — bounded invitation detail', () => {
  test('a URL cannot invent an invitation or reveal worker details to another actor', async ({
    page,
  }) => {
    await open(page, DETAIL);
    await expect(page.getByTestId('worker-detail-forbidden')).toBeVisible();
    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await open(page, DETAIL);
    await expect(page.getByTestId('worker-detail-unavailable')).toBeVisible();
    await expect(page.getByTestId('worker-invitation-detail')).toHaveCount(0);
  });

  test('shows the same offered invitation and recorded terms without accepting it', async ({
    page,
  }) => {
    await inviteFirstWorker(page);
    await open(page, DETAIL);
    await expect(page.getByTestId('worker-detail-forbidden')).toBeVisible();
    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await page.getByTestId('demo-outbox-link').click();
    await page.getByTestId('worker-detail-link').click();
    await expect(page).toHaveURL(/\/worker\/opportunity\/OPP-DEMO-01$/);
    await expect(page.getByTestId('worker-invitation-detail')).toContainText('Offered');
    await expect(page.getByTestId('worker-invitation-detail')).toContainText('ساختگی');
    await expect(page.getByTestId('worker-detail-amount')).toHaveText(
      '۹۸۰٬۰۰۰ تومان برای کل شیفت',
    );
    await expect(page.getByTestId('worker-requirements')).toContainText('کارت سلامت');
    await expect(page.getByTestId('worker-eligibility-result')).toContainText('مانع قطعی');
    await expect(page.getByTestId('worker-no-custody')).toContainText('نگهداری');
    await expect(page.getByTestId('worker-response-planned')).toContainText('W-04');
    await expect(page.getByRole('button', { name: /پذیرش|رد دعوت/ })).toHaveCount(0);
    await page.reload();
    await page.locator('[data-session-restored="true"]').waitFor();
    await expect(page.getByTestId('worker-invitation-detail')).toContainText('Offered');
    await open(page, '/outbox');
    await expect(page.getByTestId('outbox-offered')).toContainText('Offered');
  });

  test('is RTL, fits a small mobile screen and has no serious accessibility errors', async ({
    page,
  }) => {
    await inviteFirstWorker(page);
    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await open(page, DETAIL);
    await expect(page.getByTestId('worker-invitation-detail')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
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
        .filter((item) => item.impact === 'serious' || item.impact === 'critical')
        .map((item) => item.id),
    ).toEqual([]);
  });
});
