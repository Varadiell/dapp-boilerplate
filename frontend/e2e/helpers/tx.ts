import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const TX_MAX_MS = 120_000;

/** Waits for the Sonner toast following a contract write (useContract hook). */
export async function waitForTransactionSuccess(page: Page) {
  await expect(page.getByText(/^(Success|Succès)$/)).toBeVisible({
    timeout: TX_MAX_MS,
  });
}
