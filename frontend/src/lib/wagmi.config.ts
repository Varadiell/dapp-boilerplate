import { http, createConfig } from 'wagmi';
import { localhost, mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    // appDescription: "",
    // appIcon: "",
    appName: "The Ballot Project",
    // appUrl: "",
    chains: [localhost, mainnet, sepolia],
    ssr: true,
    transports: {
      [localhost.id]: http(),
      [mainnet.id]: http(
        // `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      ),
      [sepolia.id]: http(),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  }),
);
