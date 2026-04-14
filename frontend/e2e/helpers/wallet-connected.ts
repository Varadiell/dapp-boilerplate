import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/** Waits for `E2EAutoConnect` + wagmi to surface an address (see `E2EWalletControls`). */
export async function waitForWalletConnected(
  page: Page,
  options?: { accountAddressPrefix?: `0x${string}` },
) {
  const addr = page.getByTestId('e2e-wallet-address');
  await expect(addr).toBeVisible({
    timeout: 90_000,
  });
  if (options?.accountAddressPrefix) {
    const prefix = options.accountAddressPrefix.slice(0, 10);
    await expect(addr).toContainText(prefix, {
      ignoreCase: true,
    });
  }
}
