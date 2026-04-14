'use client';

/** AppKit init (dynamic import from `web3-provider` so E2E can skip loading it). */
import { createAppKit } from '@reown/appkit/react';
import { hardhat } from '@reown/appkit/networks';
import { networks, projectId, wagmiAdapter } from '@/lib/wagmi.config';

const metadata = {
  name: 'The Ballot Project',
  description: 'The Ballot Project',
  url:
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000',
  icons: [],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [...networks],
  defaultNetwork: hardhat,
  metadata,
  features: {
    analytics: false,
  },
});
