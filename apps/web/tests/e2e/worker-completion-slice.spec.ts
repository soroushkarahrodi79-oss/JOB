import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEMO = '/demo';
const CREATE = '/employer/opportunity/new';
const FACTORS = '/employer/opportunity/new/factors';
const CANDIDATES = '/employer/opportunity/OPP-DEMO-01/candidates';
const DETAIL = '/worker/opportunity/OPP-DEMO-01';
const VERIFY = `${DETAIL}/verify`;
const ENGAGEMENT_ID = 'ENG-DEMO-OPP-DEMO-01-WKR-DEMO-01';
const WORKER_ENGAGEMENT = `/worker/engagement/${ENGAGEMENT_ID}`;
const WORKER_COMPLETION = `${WORKER_ENGAGEMENT}/completion`;
const EMPLOYER_ENGAGEMENT = `/employer/engagement/${ENGAGEMENT_ID}`;

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

/** Drives the shared demo world to an InProgress engagement, ending on the worker's W-05 page. */
async function reachInProgress(page: Page) {
  await acceptFeaturedEngagement(page);

  await open(page, DEMO);
  await page.getByTestId('actor-employer').click();
  await open(page, '/employer');
  await page.getByTestId('engagement-monitor-WKR-DEMO-01').click();
  await expect(page).toHaveURL(new RegExp(`/employer/engagement/${ENGAGEMENT_ID}$`));
  await page.getByTestId('issue-arrival-code').click();
  const code = (await page.getByTestId('arrival-code-value').textContent())?.trim();

  await open(page, DEMO);
  await page.getByTestId('actor-worker').click();
  await open(page, WORKER_ENGAGEMENT);
  await page.getByTestId('arrival-code-input').fill(code ?? '');
  await page.getByTestId('checkin-submit').click();
  await expect(page.getByTestId('checkin-recorded')).toContainText('InProgress');
}

test.describe('W-06 — completion proof submission', () => {
  test('worker submits completion once and the employer sees it pending review', async ({
    page,
  }) => {
    await reachInProgress(page);

    await page.getByTestId('go-w06').click();
    await expect(page).toHaveURL(new RegExp(`/worker/engagement/${ENGAGEMENT_ID}/completion$`));
    await expect(page.getByTestId('completion-terms')).toContainText('InProgress');

    // Submission is deliberate: the button is inert until the worker declares completion.
    await expect(page.getByTestId('completion-submit')).toBeDisabled();
    await page.getByTestId('completion-declare').check();
    await page.getByTestId('completion-submit').click();

    await expect(page.getByTestId('completion-recorded')).toContainText('Submitted');
    await expect(
      page.getByTestId('completion-recorded').locator('[data-level="SIMULATED"]'),
    ).toBeVisible();

    // Persists across reload, and the submission form does not reappear (no duplicate submission).
    await page.reload();
    await page.locator('[data-session-restored="true"]').waitFor();
    await expect(page.getByTestId('completion-recorded')).toBeVisible();
    await expect(page.getByTestId('completion-ready')).toHaveCount(0);

    // Employer continuity: the shared world carries the submission into E-06 as a pending review.
    await open(page, DEMO);
    await page.getByTestId('actor-employer').click();
    await open(page, EMPLOYER_ENGAGEMENT);
    await expect(page.getByTestId('employer-completion-review')).toContainText('Submitted');
  });

  test('a URL alone cannot submit completion or invent an engagement', async ({ page }) => {
    await open(page, WORKER_COMPLETION);
    await expect(page.getByTestId('completion-forbidden')).toBeVisible();

    await open(page, DEMO);
    await page.getByTestId('actor-worker').click();
    await open(page, WORKER_COMPLETION);
    await expect(page.getByTestId('completion-unavailable')).toBeVisible();
  });

  test('keeps W-06 usable at 320px with no serious accessibility violations', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await reachInProgress(page);
    await open(page, WORKER_COMPLETION);
    await expect(page.getByTestId('completion-ready')).toBeVisible();
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
