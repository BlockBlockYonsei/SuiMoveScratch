import { SideBarEditor } from "./SideBarEditor";
import CodePreview from "./CodePreview";
import { SuiMoveModuleProvider } from "@/context/SuiMoveModuleContext";

export default function Main() {
  return (
    <div className="w-5/6 min-h-screen m-auto bg-gray-200">
      <SuiMoveModuleProvider>
        <div className="flex">
          <SideBarEditor />
          <CodePreview />
        </div>
      </SuiMoveModuleProvider>
    </div>
  );
}
