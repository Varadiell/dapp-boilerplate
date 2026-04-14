'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { E2EAutoConnect } from '@/contexts/e2e-auto-connect';
import { BallotDataStoreSync } from '@/contexts/ballot-data-store-sync';
import { isE2EHardhatInjected } from '@/lib/e2e-hardhat-wallet';
import { wagmiAdapter } from '@/lib/wagmi.config';
import { type ReactNode, useEffect } from 'react';
import { cookieToInitialState, WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

export function Web3Provider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  useEffect(() => {
    const skipAppKit =
      process.env.NEXT_PUBLIC_E2E_AUTO_CONNECT === '1' &&
      isE2EHardhatInjected();
    if (!skipAppKit) void import('@/contexts/appkit-bootstrap');
  }, []);

  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <E2EAutoConnect />
        <BallotDataStoreSync>{children}</BallotDataStoreSync>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
