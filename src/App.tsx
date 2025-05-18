import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
// import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routers from "./Routers";
import { SidebarProvider } from "@/components/ui/sidebar";
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
        <SidebarProvider>
          <WalletProvider preferredWallets={["suiet"]}>
            <Routers />
          </WalletProvider>
        </SidebarProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
