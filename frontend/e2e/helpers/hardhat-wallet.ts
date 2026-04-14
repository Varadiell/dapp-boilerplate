import type { Page } from '@playwright/test';

/** JSON-RPC used by the local Hardhat node started in global setup. */
export const HARDHAT_RPC = 'http://127.0.0.1:8545';
export const HARDHAT_CHAIN_ID_HEX = '0x7a69';

/**
 * Hardhat default accounts #0–#4 (canonical EIP-55 checksum).
 * #0 deploys the Ballot and is chairperson.
 */
export const HARDHAT_ACCOUNTS = [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
] as const;

type E2EWindow = Window &
  typeof globalThis & {
    __e2eSetAccount?: (index: number) => void;
    __e2eAccountIndex?: number;
    ethereum?: {
      isMetaMask?: boolean;
      isE2EHardhat?: boolean;
      chainId?: string;
      request: (a: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (ev: string, fn: (...args: unknown[]) => void) => void;
      removeListener: (ev: string, fn: (...args: unknown[]) => void) => void;
    };
  };

/**
 * Injects a minimal EIP-1193 provider that forwards to Hardhat and exposes
 * `window.__e2eSetAccount(i)` to switch the active account (for wagmi).
 * Account index is stored on `window` so Playwright re-running init scripts on
 * each navigation does not reset it.
 */
export async function installHardhatInjectedWallet(page: Page) {
  await page.addInitScript(
    ({
      rpcUrl,
      accounts,
      chainIdHex,
    }: {
      rpcUrl: string;
      accounts: string[];
      chainIdHex: string;
    }) => {
      const w = window as E2EWindow;
      if (w.ethereum?.isE2EHardhat) {
        return;
      }

      const storedIdx = (() => {
        try {
          const s = sessionStorage.getItem('__e2eAccountIndex');
          if (s === null) return undefined;
          const n = Number.parseInt(s, 10);
          return Number.isFinite(n) ? n : undefined;
        } catch {
          return undefined;
        }
      })();

      if (typeof w.__e2eAccountIndex !== 'number') {
        w.__e2eAccountIndex = storedIdx ?? 0;
      }

      const listeners: Record<string, Set<(...args: unknown[]) => void>> = {};

      function on(evt: string, fn: (...args: unknown[]) => void) {
        if (!listeners[evt]) listeners[evt] = new Set();
        listeners[evt].add(fn);
      }

      function removeListener(evt: string, fn: (...args: unknown[]) => void) {
        listeners[evt]?.delete(fn);
      }

      function emit(evt: string, ...args: unknown[]) {
        listeners[evt]?.forEach((fn) => {
          try {
            fn(...args);
          } catch {
            /* noop */
          }
        });
      }

      async function jsonRpc(method: string, params?: unknown[]) {
        const res = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method,
            params: params ?? [],
          }),
        });
        const json = (await res.json()) as {
          result?: unknown;
          error?: { message?: string; code?: number };
        };
        if (json.error) {
          const err = new Error(
            json.error.message ?? 'JSON-RPC error',
          ) as Error & { code?: number };
          err.code = json.error.code;
          throw err;
        }
        return json.result;
      }

      const ethereum = {
        isMetaMask: true,
        isE2EHardhat: true,
        chainId: chainIdHex,
        request: async ({
          method,
          params,
        }: {
          method: string;
          params?: unknown[];
        }) => {
          const p = params as unknown[] | undefined;
          const i =
            typeof w.__e2eAccountIndex === 'number' ? w.__e2eAccountIndex : 0;
          switch (method) {
            case 'eth_chainId':
              return chainIdHex;
            case 'net_version':
              return '31337';
            case 'eth_accounts':
            case 'eth_requestAccounts':
              return [accounts[i]];
            case 'wallet_switchEthereumChain':
            case 'wallet_addEthereumChain':
              return null;
            default:
              return jsonRpc(method, p);
          }
        },
        on,
        removeListener,
      };

      Object.defineProperty(ethereum, 'selectedAddress', {
        get: () => {
          const i =
            typeof w.__e2eAccountIndex === 'number' ? w.__e2eAccountIndex : 0;
          return accounts[i];
        },
      });

      w.ethereum = ethereum;

      w.__e2eSetAccount = (i: number) => {
        w.__e2eAccountIndex = i;
        try {
          sessionStorage.setItem('__e2eAccountIndex', String(i));
        } catch {
          /* ignore */
        }
        emit('accountsChanged', [accounts[i]]);
      };
    },
    {
      rpcUrl: HARDHAT_RPC,
      accounts: [...HARDHAT_ACCOUNTS],
      chainIdHex: HARDHAT_CHAIN_ID_HEX,
    },
  );
}

export async function setE2EAccount(page: Page, index: number) {
  await page.evaluate((i) => {
    (window as E2EWindow).__e2eSetAccount?.(i);
  }, index);
}
