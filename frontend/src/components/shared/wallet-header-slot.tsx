'use client';

import dynamic from 'next/dynamic';
import { E2EWalletControls } from '@/components/shared/e2e-wallet-controls';
import { isE2EHardhatInjected } from '@/lib/e2e-hardhat-wallet';
import { useLayoutEffect, useState } from 'react';

const AppKitWalletButton = dynamic(
  () =>
    import('@/components/shared/appkit-wallet-button').then(
      (m) => m.AppKitWalletButton,
    ),
  { ssr: false },
);

/** AppKit in normal runs; minimal E2E UI when auto-connect + Hardhat wallet. */
export function WalletHeaderSlot() {
  const [useE2eUi, setUseE2eUi] = useState(false);

  // E2E: detect Hardhat wallet after mount (not available during SSR).
  useLayoutEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E_AUTO_CONNECT !== '1') return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only E2E branch
    setUseE2eUi(isE2EHardhatInjected());
  }, []);

  if (process.env.NEXT_PUBLIC_E2E_AUTO_CONNECT === '1' && useE2eUi) {
    return <E2EWalletControls />;
  }

  return <AppKitWalletButton />;
}
