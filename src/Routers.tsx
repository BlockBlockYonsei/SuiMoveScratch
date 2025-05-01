import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import PackageViewer1 from "./pages/PackageViewer1/Main";
import PackageViewer2 from "./pages/PackageViewer2/Main";
import NoCodeMove from "./pages/NoCodeMove/Main";
import Final from "./pages/Final";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<NoCodeMove />} />
          <Route path="/packageviewer1" element={<PackageViewer1 />} />
          <Route path="/packageviewer2" element={<PackageViewer2 />} />
        </Route>
        <Route path="/test" element={<Final />} />
      </Routes>
    </Router>
  );
}
