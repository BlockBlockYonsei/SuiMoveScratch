import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import PackageViewer1 from "./pages/PackageViewer1/Main";
import PackageViewer2 from "./pages/PackageViewer2/Main";
import NoCodeMove from "./pages/NoCodeMove/Main";
import NoCodeMove2 from "./pages/NoCodeMoveV2/Main";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<NoCodeMove2 />} />
          <Route path="/nocodemove1" element={<NoCodeMove />} />
          <Route path="/packageviewer1" element={<PackageViewer1 />} />
          <Route path="/packageviewer2" element={<PackageViewer2 />} />
        </Route>
      </Routes>
    </Router>
  );
}
