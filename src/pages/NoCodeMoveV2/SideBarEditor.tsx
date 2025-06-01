import JSZip from "jszip";
import { saveAs } from "file-saver";

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
  moduleCodes,
}: {
  menu: "Import" | "Struct" | "Function" | "FunctionCode" | "CodePreview";
  setMenu: (
    menu: "Import" | "Struct" | "Function" | "FunctionCode" | "CodePreview"
  ) => void;
  moduleCodes: Record<string, string>;
}) {
  const handleDownload = async () => {
    const zip = new JSZip();

    Object.entries(moduleCodes).forEach(([moduleName, moduleCode]) => {
      zip.file(`sui_move/sources/${moduleName}.move`, moduleCode);
    });

    const responseTest = await fetch("/sui_move_tests.move");
    const testFile = await responseTest.text();

    zip.file(`sui_move/tests/sui_move_tests.move`, testFile);

    const responseMoveToml = await fetch("/Move.toml");
    const moveTomlContent = await responseMoveToml.text();

    zip.file(`sui_move/Move.toml`, moveTomlContent);

    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "move_package.zip");
    });
  };
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
            variant={menu === "Import" ? "default" : "ghost"}
            className={`${
              menu === "Import"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold
              `}
            onClick={() => setMenu("Import")}
          >
            Import
          </Button>
          <Button
            variant={menu === "Struct" ? "default" : "ghost"}
            className={`${
              menu === "Struct"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("Struct")}
          >
            Struct
          </Button>
          <Button
            variant={menu === "Function" ? "default" : "ghost"}
            className={`${
              menu === "Function"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("Function")}
          >
            Function
          </Button>
          <Button
            variant={menu === "FunctionCode" ? "default" : "ghost"}
            className={`${
              menu === "FunctionCode"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("FunctionCode")}
          >
            Function Code
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
            Preview Code
          </Button>

          <hr />

          {/* <Button
            // variant={menu === "CodePreview" ? "default" : "ghost"}
            variant={"ghost"}
            className={`active:bg-black active:text-white hover:bg-gray-100
            cursor-pointer py-6 text-lg font-semibold`}
            // onClick={() => setMenu("CodePreview")}
          >
            Save Code
          </Button> */}
          <Button
            // variant={menu === "CodePreview" ? "default" : "ghost"}
            variant={"ghost"}
            className={`active:bg-black active:text-white hover:bg-gray-100
            cursor-pointer py-6 text-lg font-semibold`}
            onClick={handleDownload}
          >
            Download Code
          </Button>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
