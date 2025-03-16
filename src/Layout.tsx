import { Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <div className="w-[1080px] mx-auto">
      <Outlet />
    </div>
  );
}
