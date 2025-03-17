import Routers from "./Routers";
import { SuiClientProvider } from "@mysten/dapp-kit";

function App() {
  return (
    <SuiClientProvider
      networks={{
        testnet: { url: "https://rpc-testnet.suiscan.xyz:443" },
      }}
    >
      <Routers />
    </SuiClientProvider>
  );
}

export default App;
