import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routers from "./Routers";
import ErrorBoundary from "./pages/NoCodeMove/components/ErrorBoundary";

const { networkConfig } = createNetworkConfig({
  testnet: { url: "https://rpc-testnet.suiscan.xyz:443" },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <ErrorBoundary>
            <Routers />
          </ErrorBoundary>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
