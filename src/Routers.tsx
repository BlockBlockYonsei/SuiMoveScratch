import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import PackageViewer1 from "./pages/PackageViewer1/Main";
import PackageViewer2 from "./pages/PackageViewer2/Main";
import NoCodeMove2 from "./pages/NoCodeMoveV2/Main";
import LandingPage from "./pages/LandingPage/Main";
import { SuiMovePackageProvider } from "./context/SuiMovePackageContext";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/nocodemove"
            element={
              <SuiMovePackageProvider>
                <NoCodeMove2 />
              </SuiMovePackageProvider>
            }
          />
          <Route path="/packageviewer1" element={<PackageViewer1 />} />
          <Route path="/packageviewer2" element={<PackageViewer2 />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/landingpage" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
