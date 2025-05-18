import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function SideBarEditor({
  menu,
  setMenu,
}: {
  menu: "imports" | "structs" | "functions" | "code";
  setMenu: (menu: "imports" | "structs" | "functions" | "code") => void;
}) {
  return (
    <Sidebar className="w-[350px] bg-blue-50 min-h-screen ">
      <SidebarHeader>
        <SidebarHeader className="text-2xl font-bold">
          SuiMoveScratch
        </SidebarHeader>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="space-y-1">
          <Button
            variant={menu === "imports" ? "default" : "ghost"}
            className={`${
              menu === "imports"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold
              `}
            onClick={() => setMenu("imports")}
          >
            Imports
          </Button>
          <Button
            variant={menu === "structs" ? "default" : "ghost"}
            className={`${
              menu === "structs"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("structs")}
          >
            Structs
          </Button>
          <Button
            variant={menu === "functions" ? "default" : "ghost"}
            className={`${
              menu === "functions"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("functions")}
          >
            Functions
          </Button>
          <Button
            variant={menu === "code" ? "default" : "ghost"}
            className={`${
              menu === "code"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("code")}
          >
            Code
          </Button>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
