import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {
  base,
  baseSepolia,
  hardhat,
  mainnet,
  sepolia,
} from '@reown/appkit/networks';
import { cookieStorage, createStorage, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

const {
  ALCHEMY_ENDPOINT_URL_BASE_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA = '',
  ALCHEMY_ENDPOINT_URL_ETHEREUM_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_ETHEREUM_SEPOLIA = '',
  ALCHEMY_API_KEY = '',
  NEXT_PUBLIC_REOWN_PROJECT_ID = '',
} = process.env;

const e2eAutoConnect = process.env.NEXT_PUBLIC_E2E_AUTO_CONNECT === '1';
const rawReown = NEXT_PUBLIC_REOWN_PROJECT_ID.trim();
const isProd = process.env.NODE_ENV === 'production';

/** WagmiAdapter needs a non-empty id; dev/E2E may use placeholder when env is empty/DUMMY. */
const REOWN_PLACEHOLDER_PROJECT_ID = 'e2e-playwright-placeholder';

const needsReownPlaceholder = !rawReown || rawReown.toUpperCase() === 'DUMMY';

/** Reown Cloud — https://dashboard.reown.com */
export const projectId =
  needsReownPlaceholder && (!isProd || e2eAutoConnect)
    ? REOWN_PLACEHOLDER_PROJECT_ID
    : rawReown;

if (isProd && !e2eAutoConnect && needsReownPlaceholder) {
  throw new Error(
    'NEXT_PUBLIC_REOWN_PROJECT_ID is missing or still set to DUMMY. Replace it with your Reown Cloud project ID from https://dashboard.reown.com',
  );
}

export const networks = [hardhat, sepolia, baseSepolia, mainnet, base] as const;

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [...networks],
  pollingInterval: 3000,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  ...(e2eAutoConnect
    ? { connectors: [injected({ shimDisconnect: true })] }
    : {}),
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(
      `${ALCHEMY_ENDPOINT_URL_ETHEREUM_SEPOLIA}${ALCHEMY_API_KEY}`,
    ),
    [baseSepolia.id]: http(
      `${ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA}${ALCHEMY_API_KEY}`,
    ),
    [mainnet.id]: http(
      `${ALCHEMY_ENDPOINT_URL_ETHEREUM_MAINNET}${ALCHEMY_API_KEY}`,
    ),
    [base.id]: http(`${ALCHEMY_ENDPOINT_URL_BASE_MAINNET}${ALCHEMY_API_KEY}`),
  },
});

export const config = wagmiAdapter.wagmiConfig;
