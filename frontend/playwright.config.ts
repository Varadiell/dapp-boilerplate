import { millisecondsInMinute } from 'date-fns/constants';
import { defineConfig, devices } from '@playwright/test';

const port = 3000;
const baseURL = `http://127.0.0.1:${port}`;

/** `.env.test` / CI — fallback if `NEXT_PUBLIC_REOWN_PROJECT_ID` is unset. */
const reownProjectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? 'e2e-playwright-placeholder';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup-ballot.ts',
  globalTeardown: './e2e/global-teardown-ballot.ts',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/ballot-flows.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      retries: process.env.CI ? 2 : 0,
      expect: { timeout: 30_000 },
    },
    {
      name: 'chromium-ballot',
      fullyParallel: false,
      workers: 1,
      testMatch: '**/ballot-flows.spec.ts',
      timeout: 3 * millisecondsInMinute,
      retries: 0,
      use: {
        ...devices['Desktop Chrome'],
        actionTimeout: 30_000,
        navigationTimeout: 90_000,
      },
      expect: { timeout: 90_000 },
    },
  ],
  webServer: {
    command: 'bun run build && bun run start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 5 * millisecondsInMinute,
    env: {
      ...process.env,
      NEXT_PUBLIC_REOWN_PROJECT_ID: reownProjectId,
      NEXT_PUBLIC_E2E_AUTO_CONNECT: '1',
    },
  },
});
