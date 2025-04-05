import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import PackageViewer1 from "./pages/PackageViewer1/Main";
import PackageViewer2 from "./pages/PackageViewer2/Main";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PackageViewer2 />} />
          <Route path="/packageviewer1" element={<PackageViewer1 />} />
        </Route>
      </Routes>
    </Router>
  );
}
