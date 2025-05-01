import { AppSidebar } from "@/components/AppSidebar";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";
import {
  generateImportsCode,
  renderFunctions,
  renderStructs,
} from "./NoCodeMove/utils/generateCode";

export default function Final() {
  const packages = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  ];
  const [imports, setImports] = useState<
    Record<string, Record<string, SuiMoveNormalizedStruct>>
  >({});
  const [structs, setStructs] = useState<
    Record<string, SuiMoveNormalizedStruct>
  >({});
  const [functions, setFunctions] = useState<Record<string, any>>({});

  return (
    <div className="w-5/6 min-h-screen m-auto bg-gray-200">
      <div className="flex">
        <AppSidebar
          packages={packages}
          imports={imports}
          structs={structs}
          functions={functions}
          setImports={setImports}
          setStructs={setStructs}
          setFunctions={setFunctions}
        />

        <div className="flex-1 p-5 space-y-6 text-sm font-mono">
          <pre className="bg-white p-4 rounded-md shadow whitespace-pre-wrap overflow-auto">
            <code>{generateImportsCode(imports)}</code>
            <br /> <br />
            <code>{renderStructs(structs)}</code>
            <br /> <br />
            <code>{renderFunctions(functions)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
