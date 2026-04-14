import type { Page } from '@playwright/test';

const CONFIG_BODY = JSON.stringify({
  features: [
    { id: 'multi_wallet', isEnabled: false, config: null },
    { id: 'activity', isEnabled: true, config: null },
    { id: 'swap', isEnabled: true, config: null },
    { id: 'event_tracking', isEnabled: true, config: null },
    { id: 'onramp', isEnabled: true, config: null },
    { id: 'reown_authentication', isEnabled: false, config: null },
    { id: 'social_login', isEnabled: true, config: null },
    { id: 'fund_from_exchange', isEnabled: false, config: null },
    { id: 'headless', isEnabled: false, config: null },
    { id: 'payments', isEnabled: false, config: null },
    { id: 'reown_branding', isEnabled: false, config: null },
  ],
});

const LIMITS_BODY = JSON.stringify({
  planLimits: {
    tier: 'none',
    isAboveRpcLimit: false,
    isAboveMauLimit: false,
  },
});

/**
 * Patches `window.fetch` before any app code runs so AppKit config requests succeed
 * without a registered Reown Cloud project id (runs earlier than `page.route`).
 */
export async function installReownFetchStub(page: Page) {
  await page.addInitScript(
    (payload: { configJson: string; limitsJson: string }) => {
      const { configJson, limitsJson } = payload;
      const orig = window.fetch.bind(window);
      window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.href
              : (input as Request).url;
        if (url.includes('api.web3modal.org')) {
          const body = url.includes('project-limits') ? limitsJson : configJson;
          return Promise.resolve(
            new Response(body, {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }
        return orig(input, init);
      };
    },
    { configJson: CONFIG_BODY, limitsJson: LIMITS_BODY },
  );
}

/** Optional Playwright network-level stub (backup). */
export async function stubReownRemoteConfig(page: Page) {
  await page.route('https://api.web3modal.org/**', async (route) => {
    const url = route.request().url();
    if (url.includes('project-limits')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: LIMITS_BODY,
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: CONFIG_BODY,
    });
  });
}
