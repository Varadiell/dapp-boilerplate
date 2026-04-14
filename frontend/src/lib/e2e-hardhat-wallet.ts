/** Playwright injects `isE2EHardhat` on `window.ethereum` (see `e2e/helpers/hardhat-wallet.ts`). */
export function isE2EHardhatInjected(): boolean {
  if (typeof window === 'undefined') return false;
  const eth = (window as Window & { ethereum?: { isE2EHardhat?: boolean } })
    .ethereum;
  return eth?.isE2EHardhat === true;
}
