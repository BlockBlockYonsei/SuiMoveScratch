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
  menu: "Imports" | "Structs" | "Functions" | "CodePreview";
  setMenu: (menu: "Imports" | "Structs" | "Functions" | "CodePreview") => void;
}) {
  return (
    <Sidebar className="bg-blue-50 min-h-screen ">
      <SidebarHeader>
        <SidebarHeader className="text-2xl font-bold">
          SuiMoveScratch
        </SidebarHeader>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="space-y-1">
          <hr />
          <Button
            variant={menu === "Imports" ? "default" : "ghost"}
            className={`${
              menu === "Imports"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold
              `}
            onClick={() => setMenu("Imports")}
          >
            Imports
          </Button>
          <Button
            variant={menu === "Structs" ? "default" : "ghost"}
            className={`${
              menu === "Structs"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("Structs")}
          >
            Structs
          </Button>
          <Button
            variant={menu === "Functions" ? "default" : "ghost"}
            className={`${
              menu === "Functions"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("Functions")}
          >
            Functions
          </Button>
          <Button
            variant={menu === "CodePreview" ? "default" : "ghost"}
            className={`${
              menu === "CodePreview"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("CodePreview")}
          >
            CodePreview Preview
          </Button>

          <hr />

          <Button
            // variant={menu === "CodePreview" ? "default" : "ghost"}
            variant={"ghost"}
            className={`active:bg-black active:text-white hover:bg-gray-100
            cursor-pointer py-6 text-lg font-semibold`}
            // onClick={() => setMenu("CodePreview")}
          >
            Save Code
          </Button>
          <Button
            // variant={menu === "CodePreview" ? "default" : "ghost"}
            variant={"ghost"}
            className={`active:bg-black active:text-white hover:bg-gray-100
            cursor-pointer py-6 text-lg font-semibold`}
            // onClick={() => setMenu("CodePreview")}
          >
            Download Code
          </Button>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
