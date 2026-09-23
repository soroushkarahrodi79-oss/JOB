import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEMO = '/demo';
const CREATE = '/employer/opportunity/new';
const FACTORS = '/employer/opportunity/new/factors';
const CANDIDATES = '/employer/opportunity/OPP-DEMO-01/candidates';
const DETAIL = '/worker/opportunity/OPP-DEMO-01';
const VERIFY = `${DETAIL}/verify`;
const ENGAGEMENT_ID = 'ENG-DEMO-OPP-DEMO-01-WKR-DEMO-01';
const EMPLOYER_ENGAGEMENT = `/employer/engagement/${ENGAGEMENT_ID}`;
const WORKER_ENGAGEMENT = `/worker/engagement/${ENGAGEMENT_ID}`;

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function acceptFeaturedEngagement(page: Page) {
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
  await open(page, DEMO);
  await page.getByTestId('actor-worker').click();
  await open(page, VERIFY);
  await page.getByTestId('verification-success').click();
  await page.getByTestId('worker-response-link').click();
  await page.getByTestId('response-accept').click();
  await expect(page.getByTestId('response-accepted')).toContainText('Accepted');
}

test.describe('W-05A — engagement detail and arrival check-in', () => {
  test('employer issues a code and worker records arrival once', async ({ page }) => {
    await acceptFeaturedEngagement(page);

    await open(page, DEMO);
    await page.getByTestId('actor-employer').click();
    await open(page, '/employer');
    await page.getByTestId('engagement-monitor-WKR-DEMO-01').click();
    await expect(page).toHaveURL(new RegExp(`/employer/engagement/${ENGAGEMENT_ID}$`));
    await page.getByTestId('issue-arrival-code').click();
    const code = (await page.getByTestId('arrival-code-value').textContent())?.trim();
    expect(code).toMatch(/^\d{4}$/);

    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await open(page, '/worker');
    await page.getByRole('link', { name: 'جزئیات همکاری و ورود' }).click();
    await expect(page).toHaveURL(new RegExp(`/worker/engagement/${ENGAGEMENT_ID}$`));
    await page.getByTestId('arrival-code-input').fill('0000');
    await page.getByTestId('checkin-submit').click();
    await expect(page.getByTestId('checkin-error')).toBeVisible();
    await expect(page.getByTestId('engagement-detail')).toContainText('Accepted');

    await page.getByTestId('arrival-code-input').fill(code ?? '');
    await page.getByTestId('checkin-submit').click();
    await expect(page.getByTestId('checkin-recorded')).toContainText('InProgress');
    await expect(page.getByTestId('checkin-recorded').locator('[data-level="SIMULATED"]')).toBeVisible();

    await page.reload();
    await page.locator('[data-session-restored="true"]').waitFor();
    await expect(page.getByTestId('checkin-recorded')).toContainText('InProgress');

    await open(page, DEMO);
    await page.getByTestId('actor-employer').click();
    await open(page, EMPLOYER_ENGAGEMENT);
    await expect(page.getByTestId('employer-arrival-recorded')).toContainText('InProgress');
  });

  test('cannot mint a live engagement or check-in by opening W-05 directly', async ({ page }) => {
    await open(page, WORKER_ENGAGEMENT);
    await expect(page.getByTestId('checkin-forbidden')).toBeVisible();
    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await open(page, WORKER_ENGAGEMENT);
    await expect(page.getByTestId('checkin-unavailable')).toBeVisible();
  });

  test('keeps W-05 usable at 320px with no serious accessibility violations', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await acceptFeaturedEngagement(page);
    await open(page, WORKER_ENGAGEMENT);
    await expect(page.getByTestId('engagement-detail')).toBeVisible();
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
