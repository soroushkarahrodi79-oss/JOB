import { expect, test, type Page } from '@playwright/test';

const DEMO = '/demo';
const CREATE = '/employer/opportunity/new';
const FACTORS = '/employer/opportunity/new/factors';
const CANDIDATES = '/employer/opportunity/OPP-DEMO-01/candidates';
const DETAIL = '/worker/opportunity/OPP-DEMO-01';
const VERIFY = `${DETAIL}/verify`;
const RESPOND = `${DETAIL}/respond`;

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function inviteWorker(page: Page) {
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

test.describe('W-04 — worker responds to invitation', () => {
  test('requires W-03 before acceptance and preserves Accepted after reload', async ({ page }) => {
    await inviteWorker(page);
    await open(page, RESPOND);

    await expect(page.getByTestId('response-ready')).toBeVisible();
    await expect(page.getByTestId('response-accept')).toBeDisabled();
    await expect(page.getByTestId('response-decline')).toBeEnabled();

    await open(page, VERIFY);
    await page.getByTestId('verification-success').click();
    await expect(page.getByTestId('verification-verified')).toBeVisible();
    await page.getByTestId('worker-response-link').click();
    await expect(page).toHaveURL(/\/worker\/opportunity\/OPP-DEMO-01\/respond$/);
    await expect(page.getByTestId('response-accept')).toBeEnabled();

    await page.getByTestId('response-accept').click();
    await expect(page.getByTestId('response-accepted')).toContainText('Accepted');
    await page.reload();
    await page.locator('[data-session-restored="true"]').waitFor();
    await expect(page.getByTestId('response-accepted')).toContainText('Accepted');
  });

  test('declines an Offered invitation without requiring verification', async ({ page }) => {
    await inviteWorker(page);
    await open(page, DETAIL);
    await page.getByTestId('worker-response-link').click();
    await expect(page).toHaveURL(/\/worker\/opportunity\/OPP-DEMO-01\/respond$/);
    await page.getByTestId('response-decline').click();
    await expect(page.getByTestId('response-declined')).toContainText('Declined');
    await page.reload();
    await page.locator('[data-session-restored="true"]').waitFor();
    await expect(page.getByTestId('response-declined')).toContainText('Declined');
  });

  test('does not create a response by opening W-04 directly', async ({ page }) => {
    await open(page, RESPOND);
    await expect(page.getByTestId('response-forbidden')).toBeVisible();
    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await open(page, RESPOND);
    await expect(page.getByTestId('response-unavailable')).toBeVisible();
  });
});
