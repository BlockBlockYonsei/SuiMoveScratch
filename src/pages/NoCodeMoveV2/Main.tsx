import { SideBarEditor } from "@/pages/NoCodeMoveV2/SideBarEditor";
import CodePreview from "@/pages/NoCodeMoveV2/CodePreview";
import { SuiMoveModuleProvider } from "@/context/SuiMoveModuleContext";
import { useState } from "react";

export default function Main() {
  const [menu, setMenu] = useState<
    "imports" | "structs" | "functions" | "code"
  >("imports");

  return (
    <div className="w-5/6 min-h-screen m-auto bg-gray-200">
      <SuiMoveModuleProvider>
        <div className="flex">
          <SideBarEditor menu={menu} setMenu={setMenu} />
          <CodePreview menu={menu} />
        </div>
      </SuiMoveModuleProvider>
    </div>
  );
}
