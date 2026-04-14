import { expect, test } from '@playwright/test';

import {
  HARDHAT_ACCOUNTS,
  installHardhatInjectedWallet,
  setE2EAccount,
} from './helpers/hardhat-wallet';
import {
  installReownFetchStub,
  stubReownRemoteConfig,
} from './helpers/reown-api-stub';
import { waitForTransactionSuccess } from './helpers/tx';
import { waitForWalletConnected } from './helpers/wallet-connected';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ context, page }) => {
  await installReownFetchStub(page);
  await stubReownRemoteConfig(page);
  await context.clearCookies();
  await page.goto('about:blank');
  await page.evaluate(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
  });
  await installHardhatInjectedWallet(page);
});

test('chair connects and registers two voters', async ({ page }) => {
  await page.goto('/');
  await waitForWalletConnected(page);

  await page.goto('/voters');
  await page.getByTestId('e2e-give-right-address').fill(HARDHAT_ACCOUNTS[1]);
  await page.getByTestId('e2e-give-right-submit').click();
  await waitForTransactionSuccess(page);

  await page.getByTestId('e2e-give-right-address').fill(HARDHAT_ACCOUNTS[2]);
  await page.getByTestId('e2e-give-right-submit').click();
  await waitForTransactionSuccess(page);
});

test('chair votes directly for Maybe', async ({ page }) => {
  await page.goto('/');
  await waitForWalletConnected(page);

  await page.goto('/votes');
  await page.getByTestId('e2e-vote-proposal-trigger').click();
  await page.getByRole('option', { name: 'Maybe' }).click();
  await page.getByTestId('e2e-vote-submit').click();
  await waitForTransactionSuccess(page);
});

test('voter 1 delegates voting power to voter 2', async ({ page }) => {
  // Switch account only after we are on the app origin — about:blank uses another
  // realm; `__e2eAccountIndex` must live on the same window as `window.ethereum`.
  await page.goto('/');
  await setE2EAccount(page, 1);
  await waitForWalletConnected(page, {
    accountAddressPrefix: HARDHAT_ACCOUNTS[1],
  });

  await page.goto('/voters');
  await setE2EAccount(page, 1);
  await expect(page.getByTestId('e2e-wallet-address')).toContainText(
    HARDHAT_ACCOUNTS[1].slice(0, 10),
    { ignoreCase: true },
  );
  await expect(page.getByTestId('e2e-delegate-address')).toBeVisible({
    timeout: 90_000,
  });
  await page.getByTestId('e2e-delegate-address').fill(HARDHAT_ACCOUNTS[2]);
  await page.getByTestId('e2e-delegate-submit').click();
  await waitForTransactionSuccess(page);
});

test('voter 2 votes for Yes using delegated weight', async ({ page }) => {
  await page.goto('/');
  await setE2EAccount(page, 2);
  await waitForWalletConnected(page, {
    accountAddressPrefix: HARDHAT_ACCOUNTS[2],
  });

  await page.goto('/votes');
  await setE2EAccount(page, 2);
  await expect(page.getByTestId('e2e-wallet-address')).toContainText(
    HARDHAT_ACCOUNTS[2].slice(0, 10),
    { ignoreCase: true },
  );
  await page.getByTestId('e2e-vote-proposal-trigger').click();
  await page.getByRole('option', { name: 'Yes' }).click();
  await page.getByTestId('e2e-vote-submit').click();
  await waitForTransactionSuccess(page);
});

test('dashboard shows winner, chair, voters count, delegatee weight, and proposals', async ({
  page,
}) => {
  await page.goto('/');
  await setE2EAccount(page, 2);
  await waitForWalletConnected(page, {
    accountAddressPrefix: HARDHAT_ACCOUNTS[2],
  });

  await page.goto('/dashboard');
  await setE2EAccount(page, 2);
  await expect(page.getByTestId('e2e-wallet-address')).toContainText(
    HARDHAT_ACCOUNTS[2].slice(0, 10),
    { ignoreCase: true },
  );
  await expect(page.getByTestId('e2e-winning-proposal-name')).toHaveText(
    'Yes',
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('e2e-chair-address')).toContainText(
    HARDHAT_ACCOUNTS[0],
    { ignoreCase: true, timeout: 30_000 },
  );
  await expect(page.getByTestId('e2e-voters-count')).toHaveText('3', {
    timeout: 30_000,
  });
  await expect(page.getByTestId('e2e-account-vote-weight')).toHaveText('2', {
    timeout: 30_000,
  });
  const proposals = page.getByTestId('e2e-proposals-list');
  await expect(proposals.getByText('Yes')).toBeVisible();
  await expect(proposals.getByText('Maybe')).toBeVisible();
  await expect(proposals.getByText('No')).toBeVisible();
});

test('proposals page lists Yes, Maybe, and No', async ({ page }) => {
  await page.goto('/');
  await waitForWalletConnected(page);
  await page.goto('/proposals');
  const list = page.getByTestId('e2e-proposals-list');
  await expect(list.getByText('Yes')).toBeVisible({ timeout: 30_000 });
  await expect(list.getByText('Maybe')).toBeVisible();
  await expect(list.getByText('No')).toBeVisible();
});

test('events page lists GiveRight, Delegate, and Vote rows', async ({
  page,
}) => {
  await page.goto('/');
  await setE2EAccount(page, 0);
  await waitForWalletConnected(page, {
    accountAddressPrefix: HARDHAT_ACCOUNTS[0],
  });
  await page.goto('/events');
  await setE2EAccount(page, 0);
  await expect(page.getByTestId('e2e-events-table')).toBeVisible({
    timeout: 60_000,
  });
  const table = page.getByTestId('e2e-events-table');
  // Several rows can repeat the same event name (e.g. two GiveRight) — use .first().
  await expect(
    table.getByText('GiveRight', { exact: true }).first(),
  ).toBeVisible();
  await expect(
    table.getByText('Delegate', { exact: true }).first(),
  ).toBeVisible();
  await expect(table.getByText('Vote', { exact: true }).first()).toBeVisible();
});

test('sidebar navigates to proposals and events', async ({ page }) => {
  await page.goto('/');
  await waitForWalletConnected(page);
  await page.getByRole('link', { name: 'Proposals' }).first().click();
  await expect(page).toHaveURL(/\/proposals$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Proposals' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Events' }).first().click();
  await expect(page).toHaveURL(/\/events$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Events' }),
  ).toBeVisible();
});

test('votes page shows winning proposal and proposal table', async ({
  page,
}) => {
  await page.goto('/');
  await setE2EAccount(page, 2);
  await waitForWalletConnected(page, {
    accountAddressPrefix: HARDHAT_ACCOUNTS[2],
  });
  await page.goto('/votes');
  await setE2EAccount(page, 2);
  await expect(page.getByTestId('e2e-winning-proposal-name')).toHaveText(
    'Yes',
    {
      timeout: 30_000,
    },
  );
  await expect(page.getByTestId('e2e-proposals-list')).toBeVisible();
});

test('chair sees give-right card on voters page', async ({ page }) => {
  await page.goto('/');
  await setE2EAccount(page, 0);
  await waitForWalletConnected(page, {
    accountAddressPrefix: HARDHAT_ACCOUNTS[0],
  });
  await page.goto('/voters');
  await setE2EAccount(page, 0);
  await expect(page.getByTestId('e2e-give-right-card')).toBeVisible({
    timeout: 30_000,
  });
});

test('voters page shows voter-focused event types', async ({ page }) => {
  await page.goto('/');
  await setE2EAccount(page, 1);
  await waitForWalletConnected(page, {
    accountAddressPrefix: HARDHAT_ACCOUNTS[1],
  });
  await page.goto('/voters');
  await setE2EAccount(page, 1);
  await expect(page.getByTestId('e2e-events-table')).toBeVisible({
    timeout: 60_000,
  });
  const table = page.getByTestId('e2e-events-table');
  await expect(
    table.getByText('GiveRight', { exact: true }).first(),
  ).toBeVisible();
  await expect(
    table.getByText('Delegate', { exact: true }).first(),
  ).toBeVisible();
});
