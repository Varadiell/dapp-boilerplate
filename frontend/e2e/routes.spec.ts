import { expect, test } from '@playwright/test';

/**
 * Server-rendered shell only (JS off). Web3 flows are covered in `ballot-flows.spec.ts`.
 */
test.use({ javaScriptEnabled: false });

const pages: { path: string; title: string }[] = [
  { path: '/', title: 'Home' },
  { path: '/dashboard', title: 'Dashboard' },
  { path: '/voters', title: 'Voters' },
  { path: '/proposals', title: 'Proposals' },
  { path: '/votes', title: 'Votes' },
  { path: '/events', title: 'Events' },
];

for (const { path, title } of pages) {
  test(`page ${path} shows title "${title}"`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(/The Ballot Project/);
    await expect(
      page.getByRole('heading', { level: 1, name: title }),
    ).toBeVisible();
  });
}

test('not-found route shows 404', async ({ page }) => {
  await page.goto('/__e2e_not_found__');
  await expect(page.getByText('404', { exact: true }).first()).toBeVisible();
});

test('sidebar navigates to dashboard', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Dashboard' }).first().click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Dashboard' }),
  ).toBeVisible();
});
