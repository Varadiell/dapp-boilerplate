import { http, createConfig } from 'wagmi';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

export const config = createConfig(
  getDefaultConfig({
    // appDescription: "",
    // appIcon: "",
    appName: 'The Ballot Project',
    // appUrl: "",
    chains: [mainnet, sepolia, hardhat],
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [hardhat.id]: http(),
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  }),
);
