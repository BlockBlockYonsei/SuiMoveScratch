import { AppSidebar } from "@/components/AppSidebar";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";
import {
  generateImportsCode,
  generateStructCode,
  generateFunctionCode,
  downloadMoveCode,
} from "./NoCodeMove/utils/generateCode";
import { SuiMoveFunction } from "@/types/move";

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
  const [functions, setFunctions] = useState<Record<string, SuiMoveFunction>>(
    {},
  );

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
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => downloadMoveCode(imports, structs, functions)}
          >
            code download
          </button>

          <pre className="bg-white p-4 rounded-md shadow whitespace-pre-wrap overflow-auto">
            <code>{generateImportsCode(imports)}</code>
            <br /> <br />
            <code>
              {Object.entries(structs)
                .map(([name, s]) =>
                  generateStructCode(
                    name,
                    s,
                    (s as any).typeParameterNames || [],
                  ),
                )
                .join("\n\n")}
            </code>
            <br /> <br />
            <code>
              {Object.entries(functions)
                .map(([name, f]) => generateFunctionCode(name, f))
                .join("\n\n")}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
