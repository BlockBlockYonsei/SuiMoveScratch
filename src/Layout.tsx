import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-full h-3/4 m-auto flex">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
