import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {
  base,
  baseSepolia,
  hardhat,
  mainnet,
  sepolia,
} from '@reown/appkit/networks';
import { cookieStorage, createStorage, http } from 'wagmi';

const {
  ALCHEMY_ENDPOINT_URL_BASE_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA = '',
  ALCHEMY_ENDPOINT_URL_ETHEREUM_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_ETHEREUM_SEPOLIA = '',
  ALCHEMY_API_KEY = '',
  NEXT_PUBLIC_REOWN_PROJECT_ID = '',
} = process.env;

const reownProjectIdEnv = NEXT_PUBLIC_REOWN_PROJECT_ID.trim();
if (!reownProjectIdEnv || reownProjectIdEnv.toUpperCase() === 'DUMMY') {
  throw new Error(
    'NEXT_PUBLIC_REOWN_PROJECT_ID is missing or still set to DUMMY. Replace it with your Reown Cloud project ID from https://dashboard.reown.com',
  );
}

/** Reown Cloud project ID — https://dashboard.reown.com */
export const projectId = reownProjectIdEnv;

export const networks = [hardhat, sepolia, baseSepolia, mainnet, base] as const;

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [...networks],
  pollingInterval: 3000,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
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
