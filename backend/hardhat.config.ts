import { defineConfig } from 'hardhat/config';
import hardhatFoundry from '@nomicfoundation/hardhat-foundry';
import hardhatToolboxMochaEthers from '@nomicfoundation/hardhat-toolbox-mocha-ethers';

const {
  ETHERSCAN_API_KEY = '',
  ALCHEMY_ENDPOINT_URL_BASE_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA = '',
  ALCHEMY_ENDPOINT_URL_ETHEREUM_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_ETHEREUM_SEPOLIA = '',
  PRIVATE_KEY = '',
} = process.env;

const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

/** HTTP networks are only registered when the RPC URL is set (Hardhat rejects empty URLs). */
const remoteNetworks = {
  ...(ALCHEMY_ENDPOINT_URL_ETHEREUM_MAINNET
    ? {
        mainnet: {
          type: 'http' as const,
          chainType: 'l1' as const,
          chainId: 1,
          url: ALCHEMY_ENDPOINT_URL_ETHEREUM_MAINNET,
          accounts,
        },
      }
    : {}),
  ...(ALCHEMY_ENDPOINT_URL_ETHEREUM_SEPOLIA
    ? {
        sepolia: {
          type: 'http' as const,
          chainType: 'l1' as const,
          chainId: 11155111,
          url: ALCHEMY_ENDPOINT_URL_ETHEREUM_SEPOLIA,
          accounts,
        },
      }
    : {}),
  ...(ALCHEMY_ENDPOINT_URL_BASE_MAINNET
    ? {
        base: {
          type: 'http' as const,
          chainType: 'l1' as const,
          chainId: 8453,
          url: ALCHEMY_ENDPOINT_URL_BASE_MAINNET,
          accounts,
        },
      }
    : {}),
  ...(ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA
    ? {
        baseSepolia: {
          type: 'http' as const,
          chainType: 'l1' as const,
          chainId: 84532,
          url: ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA,
          accounts,
        },
      }
    : {}),
};

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers, hardhatFoundry],
  paths: {
    tests: {
      mocha: './test/hardhat',
    },
  },
  solidity: {
    version: '0.8.28',
  },
  typechain: {
    outDir: './typechain-types',
  },
  networks: {
    hardhat: {
      type: 'edr-simulated',
      chainType: 'l1',
      chainId: 31337,
    },
    ...remoteNetworks,
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY,
    },
  },
});
