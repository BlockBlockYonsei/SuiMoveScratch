import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-5/6 h-3/4 m-auto flex">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
