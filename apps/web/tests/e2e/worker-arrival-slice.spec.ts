import { expect, test, type Page } from '@playwright/test';

const OPP = 'OPP-DEMO-01';
const ENGAGEMENT = `/worker/opportunity/${OPP}/engagement`;
const EMPLOYER_ARRIVAL = `/employer/opportunity/${OPP}/arrival`;

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function acceptFirstWorker(page: Page) {
  await open(page, '/demo');
  await page.getByTestId('actor-employer').click();
  await open(page, '/employer/opportunity/new');
  await page.getByTestId('record-commitment').check();
  await page.getByTestId('continue').click();
  await page.waitForURL('**/employer/opportunity/new/factors');
  await page.getByTestId('factor-DirectionAndControl-employmentLike').check();
  await page.getByTestId('factor-ToolsAndMaterials-employmentLike').check();
  await page.getByTestId('factor-Integration-undecided').check();
  await page.getByTestId('publish').click();
  await expect(page.getByTestId('published-state')).toBeVisible();
  await open(page, `/employer/opportunity/${OPP}/candidates`);
  await page.getByTestId('invite-WKR-DEMO-01').click();
  await expect(page.getByTestId('invited-WKR-DEMO-01')).toBeVisible();
  await open(page, '/demo');
  await page.getByTestId('actor-worker').click();
  await open(page, `/worker/opportunity/${OPP}/verify`);
  await page.getByTestId('verification-success').click();
  await expect(page.getByTestId('verification-verified')).toBeVisible();
  await open(page, `/worker/opportunity/${OPP}/respond`);
  await page.getByTestId('response-accept').click();
  await expect(page.getByTestId('response-accepted')).toBeVisible();
}

test('W-05 requires an accepted engagement; URL alone cannot create an arrival', async ({ page }) => {
  await open(page, ENGAGEMENT);
  await expect(page.getByTestId('engagement-unavailable')).toBeVisible();
  await open(page, '/demo');
  await page.getByTestId('actor-worker').click();
  await open(page, ENGAGEMENT);
  await expect(page.getByTestId('engagement-unavailable')).toBeVisible();
});

test('W-05 check-in needs employer code and explicit demo time, rejects bad code and cannot replay', async ({ page }) => {
  await acceptFirstWorker(page);
  await open(page, ENGAGEMENT);
  await expect(page.getByTestId('engagement-accepted-terms')).toContainText('۹۸۰');
  await expect(page.getByTestId('engagement-accepted-terms')).toContainText('Accepted');
  await page.getByTestId('engagement-code-input').fill('681204');
  await page.getByTestId('engagement-checkin-submit').click();
  await expect(page.getByTestId('engagement-checkin-error')).toBeVisible();
  await expect(page.getByTestId('engagement-accepted-terms')).toContainText('Accepted');

  await open(page, '/demo');
  await page.getByTestId('actor-employer').click();
  await open(page, EMPLOYER_ARRIVAL);
  await page.getByTestId('employer-issue-code').click();
  await expect(page.getByTestId('employer-issued-code')).toContainText('681204');
  await page.getByTestId('employer-advance-clock').click();
  await expect(page.getByTestId('employer-clock-advanced')).toBeVisible();

  await open(page, '/demo');
  await page.getByTestId('actor-worker').click();
  await open(page, ENGAGEMENT);
  await page.getByTestId('engagement-code-input').fill('999999');
  await page.getByTestId('engagement-checkin-submit').click();
  await expect(page.getByTestId('engagement-checkin-error')).toBeVisible();
  await expect(page.getByTestId('engagement-accepted-terms')).toContainText('Accepted');
  await page.getByTestId('engagement-code-input').fill('681204');
  await page.getByTestId('engagement-checkin-submit').click();
  await expect(page.getByTestId('engagement-arrived')).toBeVisible();
  await expect(page.getByTestId('engagement-accepted-terms')).toContainText('InProgress');
  await page.reload();
  await page.locator('[data-session-restored="true"]').waitFor();
  await expect(page.getByTestId('engagement-arrived')).toBeVisible();
  await expect(page.getByTestId('engagement-code-input')).toHaveCount(0);
});
