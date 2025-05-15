import { AppSidebar } from "./AppSidebar";
import { useState } from "react";
import { ImportsType, SuiMoveFunction } from "@/types/move-syntax";
import CodePreview from "./CodePreview";
import { StructsType } from "@/types/move-syntax";
import { SuiMoveModuleProvider } from "@/context/SuiMoveModuleContext";

export default function Main() {
  const [imports, setImports] = useState<ImportsType>({});
  const [structs, setStructs] = useState<StructsType>({});
  const [functions, setFunctions] = useState<Record<string, SuiMoveFunction>>(
    {}
  );

  return (
    <div className="w-5/6 min-h-screen m-auto bg-gray-200">
      <SuiMoveModuleProvider>
        <div className="flex">
          <AppSidebar
            imports={imports}
            structs={structs}
            functions={functions}
            setImports={setImports}
            setStructs={setStructs}
            setFunctions={setFunctions}
          />
          <CodePreview
            imports={imports}
            structs={structs}
            functions={functions}
          />
        </div>
      </SuiMoveModuleProvider>
    </div>
  );
}
