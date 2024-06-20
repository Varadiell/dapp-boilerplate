import { http, createConfig } from 'wagmi';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';
import { metaMask, coinbaseWallet, injected } from 'wagmi/connectors';

// TODO: add app infos
export const config = createConfig(
  getDefaultConfig({
    // appDescription: "",
    // appIcon: "",
    appName: 'The Ballot Project',
    // appUrl: "",
    chains: [hardhat, mainnet, sepolia],
    connectors: [
      metaMask(),
      coinbaseWallet(),
      injected(),
      /**walletConnect({ projectId }),*/ // TODO: add wallet connect projectId
    ],
    ssr: true,
    transports: {
      [hardhat.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  }),
);
