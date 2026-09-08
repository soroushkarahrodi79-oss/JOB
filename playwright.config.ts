import { defineConfig, devices } from '@playwright/test';

// Rendered verification for the eight risks carried out of GATE 1.5
// (docs/design/adversarial-review.md). These are rendered checks, not CSS-declaration
// checks — R1 (Persian tabular figures) and R4 (hatch legibility) can only be settled by
// rendering. The app under test is a verification harness, NOT a product screen: screens
// are GATE 4 (ADR-0011).
const PORT = 3210;

export default defineConfig({
  testDir: './apps/web/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      // Persona P1's condition: the 320px design baseline (foundations.md responsive strategy).
      name: 'mobile-320',
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 } },
    },
    {
      name: 'reduced-motion',
      use: { ...devices['Desktop Chrome'], contextOptions: { reducedMotion: 'reduce' } },
    },
  ],
  webServer: {
    command: `pnpm build:tokens && pnpm --filter @platform/web dev --port ${String(PORT)}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
