import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
// Remove or fully comment out this line:
// import { getFullnodeUrl } from "@mysten/sui.js/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routers from "./Routers";

const { networkConfig } = createNetworkConfig({
  // localnet: { url: getFullnodeUrl("localnet") },
  // mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: "https://rpc-testnet.suiscan.xyz:443" },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <Routers />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
