'use client';

import { AppKitButton } from '@reown/appkit/react';

/** Small leaf so `main-navigation` can load AppKit only in non-E2E builds. */
export function AppKitWalletButton() {
  return <AppKitButton balance="show" />;
}
