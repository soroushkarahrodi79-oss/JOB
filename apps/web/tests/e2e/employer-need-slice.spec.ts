import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// GATE 4 slice: SH-01 → E-01 → E-02 → E-03, the employer's NEED journey.
//
// These are rendered checks over the real screens. They assert the things the canon says must
// survive: the terms, the money and its unit, the no-custody statement, the uncaptured factor, the
// non-authoritative framing of the classification signal, and that nothing claims to be built when
// it is not.
//
// The demo session lives in `sessionStorage` for one browser tab, so each Playwright context
// starts with a fresh shared world and `OPP-DEMO-01` does not exist until the employer creates it.

const DEMO = '/demo';
const HOME = '/employer';
const CREATE = '/employer/opportunity/new';
const FACTORS = '/employer/opportunity/new/factors';

/**
 * Navigate, then wait until this tab's demo session has actually been read.
 *
 * The screens are server-rendered from a fresh world and swap in the tab's own session once the
 * client mounts, so a click that lands before that is a click on markup that is about to be
 * replaced. The pages publish `data-session-restored` for exactly this, so the suite waits on the
 * application's own signal rather than on a guessed delay.
 */
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function enterAsEmployer(page: Page) {
  await open(page, DEMO);
  await page.getByTestId('actor-employer').click();
  await page.getByTestId('go-home').click();
  await page.waitForURL(`**${HOME}`);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function fillAndContinue(page: Page) {
  await open(page, CREATE);
  await page.getByTestId('record-commitment').check();
  await page.getByTestId('continue').click();
  await page.waitForURL(`**${FACTORS}`);
  await page.locator('[data-session-restored="true"]').waitFor();
}

async function answerAndPublish(page: Page) {
  await fillAndContinue(page);
  await page.getByTestId('factor-DirectionAndControl-employmentLike').check();
  await page.getByTestId('factor-ToolsAndMaterials-employmentLike').check();
  await page.getByTestId('factor-Integration-undecided').check();
  await page.getByTestId('publish').click();
  await expect(page.getByTestId('published-state')).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page) {
  const fits = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  );
  expect(fits).toBe(true);
}

test.describe('SH-01 → E-01 — the employer actor reaches a built home', () => {
  test('selecting the employer opens E-01, and it is the employer of the shared world', async ({
    page,
  }) => {
    await open(page, DEMO);
    await expect(page.getByTestId('actor-employer')).toContainText('EMP-DEMO-01');
    await page.getByTestId('actor-employer').click();
    await expect(page.getByTestId('home-built')).toContainText('E-01');
    await page.getByTestId('go-home').click();
    await expect(page).toHaveURL(new RegExp(`${HOME}$`));
    await expect(page.getByRole('heading', { level: 1, name: 'کارها' })).toBeVisible();
  });

  test('the employer chrome names its unbuilt destinations without making them controls', async ({
    page,
  }) => {
    await enterAsEmployer(page);
    for (const screenId of ['E-08', 'SH-03']) {
      await expect(page.getByTestId(`rail-planned-${screenId}`)).toContainText('PLANNED');
    }
    // Neither is a link — a PLANNED destination is not rendered as a control at all.
    const rail = page.getByRole('navigation', { name: 'پیمایش کارفرما' });
    await expect(rail.getByRole('link', { name: 'نمایهٔ اعتماد' })).toHaveCount(0);
    await expect(rail.getByRole('link', { name: 'پیام‌ها' })).toHaveCount(0);
  });
});

test.describe('E-01 — Employer Home', () => {
  test('is empty and says so, rather than inventing activity', async ({ page }) => {
    await enterAsEmployer(page);
    await expect(page.getByTestId('queue-empty')).toBeVisible();
    // A queue, not a dashboard: no metric, rate or percentage anywhere on the screen.
    await expect(page.locator('body')).not.toContainText('٪');
    await expect(page.getByTestId('planned-areas')).toContainText('E-07');
  });

  test('names each unbuilt part of the employer s day with what it would show', async ({
    page,
  }) => {
    await enterAsEmployer(page);
    const planned = page.getByTestId('planned-areas');
    for (const screenId of ['E-04', 'E-06', 'E-07', 'E-08', 'SH-03']) {
      await expect(planned).toContainText(screenId);
    }
  });

  test('leads to E-02', async ({ page }) => {
    await enterAsEmployer(page);
    await page.getByTestId('create-opportunity').click();
    await expect(page).toHaveURL(new RegExp(`${CREATE}$`));
    await expect(page.getByRole('heading', { level: 1, name: 'فرصت تازه' })).toBeVisible();
  });

  test('lists the published opportunity with its terms in Persian digits', async ({ page }) => {
    await enterAsEmployer(page);
    await answerAndPublish(page);
    await open(page, HOME);
    await expect(page.getByTestId('opportunity-OPP-DEMO-01')).toBeVisible();
    // The figure carries its basis (opportunity-card.md item 6) — a bare amount is ambiguous.
    await expect(page.getByTestId('row-amount')).toHaveText('۹۸۰٬۰۰۰ تومان برای کل شیفت');
    await expect(page.getByTestId('row-positions')).toHaveText('۰ از ۲ پر شده');
    // E-04 is not built, and the row says so rather than offering a dead invite control.
    await expect(page.getByTestId('candidates-planned')).toContainText('PLANNED');
  });
});

test.describe('E-02 — Opportunity Creation', () => {
  test('refuses to continue without a recorded commitment, and names every failed field', async ({
    page,
  }) => {
    await open(page, CREATE);
    await page.locator('#field-title').fill('  ');
    await page.getByTestId('input-amount').fill('');
    await page.getByTestId('continue').click();

    await expect(page).toHaveURL(new RegExp(`${CREATE}$`));
    const summary = page.getByTestId('error-summary');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText('تعهد پرداخت');
    await expect(summary).toContainText('مبلغ');
    // Focus moves to the summary so the failures are announced and reachable.
    await expect(summary).toBeFocused();
  });

  test('refuses a shift that ends before it starts, in the field s own words', async ({ page }) => {
    await open(page, CREATE);
    await page.getByTestId('select-end').selectOption(String(10 * 60));
    await page.getByTestId('record-commitment').check();
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error-end')).toContainText('ساعت پایان');
    await expect(page).toHaveURL(new RegExp(`${CREATE}$`));
  });

  test('refuses a fractional Toman rather than rounding it', async ({ page }) => {
    await open(page, CREATE);
    await page.getByTestId('input-amount').fill('980000.5');
    await page.getByTestId('record-commitment').check();
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error-amount')).toContainText('اعشار');
  });

  test('accepts Persian digits for the amount', async ({ page }) => {
    await open(page, CREATE);
    await page.getByTestId('input-amount').fill('۹۸۰۰۰۰');
    await expect(page.getByTestId('commitment-amount')).toHaveText('۹۸۰٬۰۰۰ تومان');
  });

  test('says which amount is being committed to, per shift', async ({ page }) => {
    await open(page, CREATE);
    const block = page.getByTestId('commitment-block');
    await expect(block).toHaveAttribute('data-basis', 'PerShift');
    await expect(page.getByTestId('commitment-basis')).toHaveText('برای کل شیفت');
    await expect(page.getByTestId('commitment-scope')).toContainText('کل تعهد پرداخت شما');
  });

  test('never presents an hourly rate as the whole shift obligation', async ({ page }) => {
    await open(page, CREATE);
    await page.getByTestId('input-amount').fill('۹۸۰۰۰۰');
    await page.locator('input[name="payBasis"][value="PerHour"]').check();

    const block = page.getByTestId('commitment-block');
    await expect(block).toHaveAttribute('data-basis', 'PerHour');
    await expect(page.getByTestId('commitment-basis')).toHaveText('به ازای هر ساعت');

    const scope = page.getByTestId('commitment-scope');
    await expect(scope).toContainText('برای هر ساعت کارکرد');
    await expect(scope).toContainText('اینجا محاسبه نمی‌شود');
    await expect(scope).not.toContainText('کل تعهد');

    // No invented total: the six-hour shift must not produce ۵٬۸۸۰٬۰۰۰ anywhere on the screen.
    await expect(page.getByTestId('commitment-amount')).toHaveText('۹۸۰٬۰۰۰ تومان');
    await expect(page.locator('body')).not.toContainText('۵٬۸۸۰٬۰۰۰');
  });

  test('carries an hourly basis through creation to E-03', async ({ page }) => {
    await open(page, CREATE);
    await page.locator('input[name="payBasis"][value="PerHour"]').check();
    await page.getByTestId('record-commitment').check();
    await page.getByTestId('continue').click();
    await page.waitForURL(`**${FACTORS}`);
    await expect(page.getByTestId('summary-amount')).toHaveText('۹۸۰٬۰۰۰ تومان به ازای هر ساعت');
  });

  test('records a commitment and never implies the Platform holds the money', async ({ page }) => {
    await open(page, CREATE);
    const block = page.getByTestId('commitment-block');
    await expect(block.getByTestId('no-custody')).toContainText('نگه نمی‌دارد');
    await expect(block.getByTestId('no-custody')).toContainText('تعهد');
    // The statement links to the truth-ledger row that exists to show the absence honestly.
    await expect(block.getByRole('link')).toHaveAttribute('href', '/truth#truth-row-12');
    // No custody vocabulary exists anywhere on the screen.
    await expect(page.locator('body')).not.toContainText('امانت');
    await expect(page.locator('body')).not.toContainText('تضمین');
  });

  test('pre-selects invite-only and marks it as a prototype-provisional default (D16)', async ({
    page,
  }) => {
    await open(page, CREATE);
    await expect(page.getByTestId('acceptance-InviteOnly')).toBeChecked();
    await expect(page.getByTestId('d16-note')).toContainText('D16');
    await expect(page.getByTestId('d16-note')).toContainText('موقت');
  });

  test('keeps free text out of the requirement list', async ({ page }) => {
    await open(page, CREATE);
    await expect(page.getByTestId('note-not-a-requirement')).toContainText('شرط نیست');
    await page.getByTestId('input-note').fill('باید سخت‌کوش باشد');
    await page.getByTestId('requirement-cafe-service').uncheck();
    await page.getByTestId('requirement-food-handling-certificate').uncheck();
    await page.getByTestId('record-commitment').check();
    await page.getByTestId('continue').click();
    await page.waitForURL(`**${FACTORS}`);
    // The note travelled with the opportunity; the requirement list is empty, not populated by it.
    await expect(page.getByTestId('terms-summary')).toContainText('بدون شرط');
  });

  test('never describes a certificate requirement as required by law', async ({ page }) => {
    await open(page, CREATE);
    await expect(page.getByTestId('certificate-not-legal')).toContainText('قانون');
    await expect(page.getByTestId('certificate-not-legal')).toContainText('نمی‌گوید');
  });

  test('labels the demo geography as simulated at the point of use', async ({ page }) => {
    await open(page, CREATE);
    const truth = page.getByTestId('location-truth');
    await expect(truth).toContainText('شبیه‌سازی‌شده');
    await expect(truth.getByRole('link')).toHaveAttribute('href', '/truth#truth-row-8');
  });

  test('carries the canonical featured transaction through to E-03', async ({ page }) => {
    await fillAndContinue(page);
    const summary = page.getByTestId('terms-summary');
    await expect(page.getByTestId('summary-amount')).toHaveText('۹۸۰٬۰۰۰ تومان برای کل شیفت');
    await expect(page.getByTestId('summary-headcount')).toHaveText('۲ جایگاه');
    await expect(summary).toContainText('کارت سلامت معتبر');
    await expect(summary).toContainText('فقط کسانی که دعوت می‌کنید');
    await expect(summary).toContainText('چهارشنبه');
  });

  test('refuses to create a second OPP-DEMO-01 once one exists', async ({ page }) => {
    await answerAndPublish(page);
    await open(page, CREATE);
    await expect(page.getByTestId('already-created')).toBeVisible();
    // There is no second creation form to submit.
    await expect(page.getByTestId('continue')).toHaveCount(0);
  });
});

test.describe('E-03 — Factors and Classification Signal', () => {
  test('renders the hypothesis, a derived factor and an uncaptured one without interaction', async ({
    page,
  }) => {
    await fillAndContinue(page);
    await expect(page.getByTestId('hypothesis-header')).toContainText('فرضیه');
    await expect(page.getByTestId('hypothesis-header')).toContainText('تعیین حقوقی نیست');
    await expect(page.getByTestId('derived-explanation')).toContainText('زمان شیفت');
    // Demonstration requirement 3: at least one factor is visibly uncaptured and named as such.
    await expect(page.getByTestId('uncaptured-factors')).toContainText('انحصار');
    await expect(page.getByTestId('legal-footer')).toContainText('مشاورهٔ حقوقی نمی‌دهد');
  });

  test('keeps "never asked" and "asked, not decided yet" visibly different', async ({ page }) => {
    await fillAndContinue(page);
    await page.getByTestId('factor-Integration-undecided').check();
    const uncaptured = page.getByTestId('uncaptured-factors');
    await expect(uncaptured).toContainText('پرسیده شد؛ پاسخ «هنوز مشخص نیست»');
    await expect(page.getByTestId('never-asked').first()).toContainText('نه «بله» و نه «خیر»');
    // And the third state: asked, nothing back. Distinct from both of the above.
    await expect(page.getByTestId('asked-not-answered').first()).toContainText(
      'هنوز پاسخی ثبت نشده',
    );
  });

  test('renders all three unrecorded states differently before anything is answered', async ({
    page,
  }) => {
    await fillAndContinue(page);
    // Nothing answered yet: the three asked factors are AskedNotAnswered, and Exclusivity is
    // NotAsked. The screen must not tell the employer that a question it just put is never asked.
    await expect(page.getByTestId('asked-not-answered')).toHaveCount(3);
    await expect(page.getByTestId('never-asked')).toHaveCount(1);
    await expect(page.getByTestId('never-asked')).toContainText('انحصار');
  });

  test('states no legal status and offers no score, percentage or recommendation', async ({
    page,
  }) => {
    await answerAndPublish(page);
    const panel = page.getByTestId('classification-panel');
    await expect(panel).not.toContainText('٪');
    await expect(panel).not.toContainText('%');
    await expect(panel).not.toContainText('قرارداد کار');
    await expect(panel).not.toContainText('مطابق قانون');
    await expect(panel).not.toContainText('ایمن');
    // The position is named in words, not scored.
    await expect(page.getByTestId('spectrum-position')).toContainText('بر پایهٔ آنچه ثبت شده');
  });

  test('publishes regardless of what the signal says, and says the signal does not block', async ({
    page,
  }) => {
    await fillAndContinue(page);
    // Every answer employment-like — the most "employment-like" reading available.
    await page.getByTestId('factor-DirectionAndControl-employmentLike').check();
    await page.getByTestId('factor-ToolsAndMaterials-employmentLike').check();
    await page.getByTestId('factor-Integration-employmentLike').check();

    await expect(page.getByTestId('signal-does-not-block')).toContainText('غیرفعال نمی‌کند');
    const publish = page.getByTestId('publish');
    await expect(publish).toBeEnabled();
    await publish.click();
    await expect(page.getByTestId('published-state')).toContainText('منتشر شد');
    await expect(page.getByTestId('d3-note')).toContainText('D3');
  });

  test('marks the next step PLANNED rather than offering a dead route to E-04', async ({
    page,
  }) => {
    await answerAndPublish(page);
    await expect(page.getByTestId('next-planned')).toContainText('E-04');
    await expect(page.getByTestId('next-planned')).toContainText('PLANNED');
  });

  test('leaves no record when the creation flow is abandoned', async ({ page }) => {
    await fillAndContinue(page);
    await page.getByTestId('discard-draft').click();
    await page.waitForURL(`**${HOME}`);
    await expect(page.getByTestId('queue-empty')).toBeVisible();
    await expect(page.getByTestId('draft-item')).toHaveCount(0);
  });

  test('does not offer publication for an opportunity that was never created', async ({ page }) => {
    await open(page, FACTORS);
    await expect(page.getByTestId('no-draft')).toBeVisible();
    await expect(page.getByTestId('publish')).toHaveCount(0);
  });

  test('replays deterministically: a fresh session recreates the same opportunity', async ({
    browser,
  }) => {
    const readTerms = async () => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await answerAndPublish(page);
      const terms = await page.getByTestId('terms-summary').innerText();
      await context.close();
      return terms;
    };
    expect(await readTerms()).toBe(await readTerms());
  });
});

test.describe('Persian-first RTL, keyboard and accessibility (ADR-0005, WCAG 2.2)', () => {
  for (const path of [HOME, CREATE]) {
    test(`${path} is Persian-first and RTL from the document root`, async ({ page }) => {
      await open(page, path);
      await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    });

    test(`${path} does not overflow sideways`, async ({ page }) => {
      await open(page, path);
      await expectNoHorizontalOverflow(page);
    });
  }

  test('E-03 does not overflow sideways once the panel is rendered', async ({ page }) => {
    await fillAndContinue(page);
    await expectNoHorizontalOverflow(page);
  });

  test('every form control on E-02 has a programmatically associated label', async ({ page }) => {
    await open(page, CREATE);
    const unlabelled = await page.evaluate(() => {
      const controls = [...document.querySelectorAll('input, select, textarea')];
      return controls.filter((control) => {
        const id = control.getAttribute('id');
        const hasFor = id !== null && document.querySelector(`label[for="${id}"]`) !== null;
        const wrapped = control.closest('label') !== null;
        const aria = control.getAttribute('aria-label') ?? control.getAttribute('aria-labelledby');
        return !hasFor && !wrapped && aria === null;
      }).length;
    });
    expect(unlabelled).toBe(0);
  });

  test('the whole E-02 form is operable from the keyboard with a visible focus ring', async ({
    page,
  }) => {
    await open(page, CREATE);
    await page.locator('#field-title').focus();
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      return el === null ? null : getComputedStyle(el).outlineStyle;
    });
    expect(outline).not.toBe('none');

    // The commitment can be recorded and the form submitted without a pointer.
    await page.getByTestId('record-commitment').focus();
    await page.keyboard.press('Space');
    await expect(page.getByTestId('record-commitment')).toBeChecked();
    await page.getByTestId('continue').focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(`**${FACTORS}`);
  });

  test('no decision-critical fact on E-03 is hidden behind hover or a disclosure', async ({
    page,
  }) => {
    await fillAndContinue(page);
    // Everything the canon lists as always-rendered is in the DOM and visible with no interaction.
    for (const testId of [
      'hypothesis-header',
      'spectrum',
      'spectrum-position',
      'uncaptured-factors',
      'legal-footer',
      'd3-note',
    ]) {
      await expect(page.getByTestId(testId)).toBeVisible();
    }
    await expect(page.locator('details')).toHaveCount(0);
  });

  for (const [name, prepare] of [
    ['E-01', enterAsEmployer],
    [
      'E-02',
      async (page: Page) => {
        await open(page, CREATE);
      },
    ],
    ['E-03', fillAndContinue],
  ] as const) {
    test(`no serious or critical axe violations on ${name}`, async ({ page }) => {
      await prepare(page);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const serious = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      );
      expect(serious, JSON.stringify(serious.map((violation) => violation.id))).toEqual([]);
    });
  }
});
