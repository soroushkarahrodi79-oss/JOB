import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEMO = '/demo';
const CREATE = '/employer/opportunity/new';
const FACTORS = '/employer/opportunity/new/factors';
const CANDIDATES = '/employer/opportunity/OPP-DEMO-01/candidates';
const DETAIL = '/worker/opportunity/OPP-DEMO-01';
const VERIFY = `${DETAIL}/verify`;

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function inviteFirstWorker(page: Page) {
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
  await open(page, CANDIDATES);
  await page.getByTestId('invite-WKR-DEMO-01').click();
  await expect(page.getByTestId('invited-WKR-DEMO-01')).toBeVisible();
  await open(page, DEMO);
  await page.getByTestId('actor-worker').click();
}

test.describe('W-03 — simulated identity verification', () => {
  test('does not create evidence merely by opening its URL or selecting another role', async ({ page }) => {
    await open(page, VERIFY);
    await expect(page.getByTestId('verification-forbidden')).toBeVisible();
    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await open(page, VERIFY);
    await expect(page.getByTestId('verification-unavailable')).toBeVisible();
    await expect(page.getByTestId('verification-scenarios')).toHaveCount(0);
  });

  test('records rejection, timeout and success without accepting an offer', async ({ page }) => {
    await inviteFirstWorker(page);
    await open(page, DETAIL);
    await page.getByTestId('worker-verification-link').click();
    await expect(page).toHaveURL(/\/worker\/opportunity\/OPP-DEMO-01\/verify$/);
    await expect(page.getByTestId('verification-ready')).toContainText('SIMULATED');
    await expect(page.getByTestId('verification-ready')).toContainText('شمارهٔ ملی');
    await page.getByTestId('verification-rejected').click();
    await expect(page.getByTestId('verification-failure')).toContainText('رد کرد');
    await page.getByTestId('verification-timeout').click();
    await expect(page.getByTestId('verification-failure')).toContainText('مهلت');
    await page.getByTestId('verification-success').click();
    await expect(page.getByTestId('verification-verified')).toContainText('ProviderVerifiedSimulated');
    await expect(page.getByTestId('verification-scenarios')).toHaveCount(0);
    await page.reload();
    await page.locator('[data-session-restored="true"]').waitFor();
    await expect(page.getByTestId('verification-verified')).toBeVisible();
    await expect(page.getByTestId('verification-result')).toContainText('Offered');
    await open(page, '/worker');
    await expect(page.getByTestId('worker-offered-work')).toContainText('Offered');
    await expect(page.getByRole('button', { name: /پذیرش|رد دعوت/ })).toHaveCount(0);
  });

  test('remains readable at 320px RTL without serious accessibility findings', async ({ page }) => {
    await inviteFirstWorker(page);
    await page.setViewportSize({ width: 320, height: 720 });
    await open(page, VERIFY);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByTestId('verification-success')).toBeVisible();
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
