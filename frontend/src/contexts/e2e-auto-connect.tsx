'use client';

import { hardhat } from '@reown/appkit/networks';
import { isE2EHardhatInjected } from '@/lib/e2e-hardhat-wallet';
import { useEffect, useRef } from 'react';
import { injected } from 'wagmi/connectors';
import { useAccount, useConnect } from 'wagmi';

/** Auto-connect injected Hardhat wallet when `NEXT_PUBLIC_E2E_AUTO_CONNECT=1`. */
export function E2EAutoConnect() {
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const attempted = useRef(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E_AUTO_CONNECT !== '1') return;
    if (attempted.current) return;
    if (isConnected && address) return;

    if (!isE2EHardhatInjected()) return;

    attempted.current = true;

    void (async () => {
      try {
        await connectAsync({
          connector: injected(),
          chainId: hardhat.id,
        });
      } catch {
        attempted.current = false;
      }
    })();
  }, [address, connectAsync, isConnected]);

  return null;
}
