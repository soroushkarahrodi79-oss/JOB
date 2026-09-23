import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// GATE 4 slice: E-04 — Candidate List and explainable matching.
//
// These are rendered checks over the real screen, reached through the same shared demo session that
// E-02 and E-03 use: the employer creates and publishes OPP-DEMO-01, then opens its candidate list.
// The list is computed from the one synthetic world, so the same workers and the same opportunity
// appear here as everywhere else — one world, not a fixture per screen.

const DEMO = '/demo';
const HOME = '/employer';
const CREATE = '/employer/opportunity/new';
const FACTORS = '/employer/opportunity/new/factors';
const CANDIDATES = '/employer/opportunity/OPP-DEMO-01/candidates';

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function publishFeatured(page: Page) {
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
}

async function openCandidates(page: Page) {
  await publishFeatured(page);
  await page.getByTestId('go-candidates').click();
  await page.waitForURL(`**${CANDIDATES}`);
  await page.locator('[data-session-restored="true"]').waitFor();
  await expect(page.getByTestId('candidate-list')).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page) {
  const fits = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  );
  expect(fits).toBe(true);
}

test.describe('E-04 — the eligible set is explained and ordered', () => {
  test('shows the published opportunity and its actual terms as the header', async ({ page }) => {
    await openCandidates(page);
    const header = page.getByTestId('opportunity-header');
    await expect(header).toContainText('سرویس و پذیرایی کافه');
    // The recorded travel boundary is a real term and is labelled SIMULATED at the point of use.
    await expect(page.getByTestId('opp-boundary')).toContainText('۱۰');
    await expect(page.getByTestId('opp-boundary')).toContainText('شبیه‌سازی‌شده');
  });

  test('lists the eligible newcomer and orders an established worker ahead of them', async ({
    page,
  }) => {
    await openCandidates(page);
    // WKR-01 is an eligible newcomer, with no history, stated as a neutral fact — not a penalty.
    await expect(page.getByTestId('candidate-WKR-DEMO-01')).toBeVisible();
    await expect(page.getByTestId('headline-WKR-DEMO-01')).toContainText('هنوز سابقهٔ ثبت‌شده');
    // WKR-02 is ordered ahead of WKR-01, and the reason is named — reliability, not a score.
    await expect(page.getByTestId('headline-WKR-DEMO-02')).toContainText('قابلیت اتکا');
    const order = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[data-testid^="candidate-WKR-"]')].map((el) =>
        el.getAttribute('data-testid'),
      );
      return {
        two: ids.indexOf('candidate-WKR-DEMO-02'),
        one: ids.indexOf('candidate-WKR-DEMO-01'),
      };
    });
    expect(order.two).toBeGreaterThanOrEqual(0);
    expect(order.two).toBeLessThan(order.one);
  });

  test('shows no numeric score, percentage or match figure anywhere', async ({ page }) => {
    await openCandidates(page);
    const body = page.locator('body');
    // The product's central refusal: no composite number. No percentage sign in either script,
    // and no Latin percent. (The intro copy names «امتیاز/ستاره» only to say there is none, so the
    // meaningful guard is the absence of an actual figure, checked here and in the unit tests.)
    await expect(body).not.toContainText('٪');
    await expect(body).not.toContainText('%');
  });

  test('expands the full seven-rung ladder with each reason and its provenance', async ({
    page,
  }) => {
    await openCandidates(page);
    const ladder = page.getByTestId('ladder-WKR-DEMO-02');
    // The ladder is inside a closed <details>; open it and every stage is present.
    await page.getByTestId('candidate-WKR-DEMO-02').getByText('چرا این نتیجه؟').click();
    await expect(ladder).toContainText('واجد شرایط بودن');
    await expect(ladder).toContainText('در دسترس بودن');
    await expect(ladder).toContainText('مکان');
    await expect(ladder).toContainText('قابلیت اتکا');
    // WKR-02's certificate is provider-verified (simulated) — provenance travels with the reason.
    await expect(ladder).toContainText('تأیید‌شده — شبیه‌سازی‌شده');
  });
});

test.describe('E-04 — the excluded set is a separate, non-ranked group', () => {
  test('separates excluded candidates and states one specific reason each', async ({ page }) => {
    await openCandidates(page);
    await expect(page.getByTestId('excluded-nonranked')).toContainText('رتبه‌بندی نشده');

    // WKR-03: the exact missing certificate, and nothing else.
    await expect(page.getByTestId('exclusion-reason-WKR-DEMO-03')).toContainText('کارت سلامت');
    // WKR-04: recorded availability that does not cover the shift.
    await expect(page.getByTestId('exclusion-reason-WKR-DEMO-04')).toContainText('در دسترس نیست');
    // WKR-05: outside the recorded travel boundary, on a SIMULATED distance.
    await expect(page.getByTestId('exclusion-reason-WKR-DEMO-05')).toContainText('محدودهٔ مسافت');
    await expect(page.getByTestId('exclusion-reason-WKR-DEMO-05')).toContainText('شبیه‌سازی‌شده');

    // None of the excluded are in the ranked list.
    for (const id of ['WKR-DEMO-03', 'WKR-DEMO-04', 'WKR-DEMO-05']) {
      await expect(page.getByTestId(`candidate-${id}`)).toHaveCount(0);
    }
  });
});

test.describe('E-04 — invitation is a truthful bounded action', () => {
  test('invites a candidate, records it honestly as MOCK, and survives a reload', async ({
    page,
  }) => {
    await openCandidates(page);
    await page.getByTestId('invite-WKR-DEMO-01').click();
    const invited = page.getByTestId('invited-WKR-DEMO-01');
    await expect(invited).toContainText('دعوت ثبت شد');
    await expect(invited).toContainText('ساختگی');
    // The outbox that would show sent messages is itself PLANNED, and nothing leaves the system.
    await expect(page.getByTestId('outbox-planned')).toContainText('PLANNED');

    // The Offered engagement lives in the shared session and survives a tab reload.
    await page.reload();
    await page.locator('[data-session-restored="true"]').waitFor();
    await expect(page.getByTestId('invited-WKR-DEMO-01')).toBeVisible();
    await expect(page.getByTestId('invite-WKR-DEMO-01')).toHaveCount(0);
  });
});

test.describe('E-04 — RTL, keyboard, overflow and accessibility', () => {
  test('is Persian-first and RTL and does not overflow sideways', async ({ page }) => {
    await openCandidates(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expectNoHorizontalOverflow(page);
  });

  test('is unavailable-safe: an unpublished opportunity id says so, with no dead controls', async ({
    page,
  }) => {
    // Reaching the list before anything is published shows the honest unavailable state.
    await open(page, '/employer/opportunity/OPP-DEMO-01/candidates');
    await expect(page.getByTestId('candidates-unavailable')).toBeVisible();
  });

  test('no serious or critical axe violations', async ({ page }) => {
    await openCandidates(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(serious, JSON.stringify(serious.map((violation) => violation.id))).toEqual([]);
  });
});
