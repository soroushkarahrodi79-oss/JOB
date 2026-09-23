import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEMO = '/demo';
const HOME = '/employer';
const CREATE = '/employer/opportunity/new';
const FACTORS = '/employer/opportunity/new/factors';
const CANDIDATES = '/employer/opportunity/OPP-DEMO-01/candidates';
const OUTBOX = '/outbox';

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function publishAndInvite(page: Page) {
  await open(page, DEMO);
  await page.getByTestId('actor-employer').click();
  await page.getByTestId('go-home').click();
  await page.waitForURL(`**${HOME}`);
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
  await expect(page.getByTestId('invited-WKR-DEMO-01')).toContainText('دعوت ثبت شد');
}

test.describe('SH-03 — shared-world MOCK invitation outbox', () => {
  test('empty state is real and opening without an actor does not reveal messages', async ({
    page,
  }) => {
    await open(page, OUTBOX);
    await expect(page.getByTestId('outbox-choose-actor')).toBeVisible();
    await expect(page.getByTestId('outbox-messages')).toHaveCount(0);
    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await page.getByTestId('demo-outbox-link').click();
    await expect(page).toHaveURL(/\/outbox$/);
    await expect(page.getByTestId('outbox-empty')).toBeVisible();
    await expect(page.getByTestId('outbox-messages')).toHaveCount(0);
  });

  test('records one employer invitation and shows it only to its demo recipient after role switch and reload', async ({
    page,
  }) => {
    await publishAndInvite(page);
    await page.getByTestId('rail-SH-03').click();
    await expect(page).toHaveURL(/\/outbox$/);
    await expect(page.getByTestId('outbox-messages')).toBeVisible();
    const firstMessage = page.getByTestId('outbox-message-WKR-DEMO-01');
    await expect(firstMessage).toContainText('WKR-DEMO-01');
    await expect(firstMessage).toContainText('SMS');
    await expect(firstMessage).toContainText('ساختگی');
    await expect(firstMessage.locator('[data-level="MOCK"]')).toHaveCount(2);
    await expect(firstMessage).toContainText('ارسال نشده');

    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await page.getByTestId('demo-outbox-link').click();
    await expect(page.getByTestId('outbox-message-WKR-DEMO-01')).toBeVisible();
    await expect(page.getByTestId('outbox-offered')).toContainText('Offered');
    await expect(page.getByTestId('response-planned')).toContainText('PLANNED');
    await expect(page.getByRole('button', { name: /پذیرش/ })).toHaveCount(0);
    await page.reload();
    await page.locator('[data-session-restored="true"]').waitFor();
    await expect(page.getByTestId('outbox-message-WKR-DEMO-01')).toBeVisible();
  });

  test('does not expose an invitation to another worker or to operations', async ({ page }) => {
    await publishAndInvite(page);
    await page.getByTestId('invite-WKR-DEMO-02').click();
    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await page.getByTestId('demo-outbox-link').click();
    await expect(page.getByTestId('outbox-message-WKR-DEMO-01')).toHaveCount(1);
    await expect(page.getByTestId('outbox-message-WKR-DEMO-02')).toHaveCount(0);
    await open(page, DEMO);
    await page.getByTestId('actor-operations').click();
    await page.getByTestId('demo-outbox-link').click();
    await expect(page.getByTestId('outbox-empty')).toBeVisible();
    await expect(page.getByTestId('outbox-messages')).toHaveCount(0);
  });

  test('keeps the RTL presentation legible without horizontal overflow or serious accessibility violations', async ({
    page,
  }) => {
    await publishAndInvite(page);
    await open(page, OUTBOX);
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
        .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
        .map((violation) => violation.id),
    ).toEqual([]);
  });
});
