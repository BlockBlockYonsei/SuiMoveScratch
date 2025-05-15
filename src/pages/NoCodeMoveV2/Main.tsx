import { AppSidebar } from "./AppSidebar";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";
import { ImportsType, SuiMoveFunction } from "@/types/move-syntax";
import CodePreview from "./CodePreview";

export default function Main() {
  const [imports, setImports] = useState<ImportsType>({});
  const [structs, setStructs] = useState<
    Record<string, SuiMoveNormalizedStruct>
  >({});
  const [functions, setFunctions] = useState<Record<string, SuiMoveFunction>>(
    {}
  );

  return (
    <div className="w-5/6 min-h-screen m-auto bg-gray-200">
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
    </div>
  );
}
