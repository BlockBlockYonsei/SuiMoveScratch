import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-full mx-auto">
      <Outlet />
    </div>
  );
}
