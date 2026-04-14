'use client';

import { useAccount } from 'wagmi';

/**
 * Minimal wallet UI for Playwright ballot E2E (no AppKit). Paired with
 * `NEXT_PUBLIC_E2E_AUTO_CONNECT=1` and `E2EAutoConnect` in `web3-provider.tsx`.
 */
export function E2EWalletControls() {
  const { address, isConnected, isConnecting } = useAccount();

  if (isConnecting) {
    return <span className="text-sm text-muted-foreground">Connecting…</span>;
  }

  if (!isConnected || !address) {
    return (
      <span data-testid="e2e-wallet-disconnected" className="text-sm">
        Not connected
      </span>
    );
  }

  return (
    <span data-testid="e2e-wallet-address" className="text-sm font-mono">
      {address}
    </span>
  );
}
