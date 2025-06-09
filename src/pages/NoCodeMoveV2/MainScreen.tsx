import StructPreview from "./structs/StructPreview";
import FunctionPreview from "./functions/FunctionPreview";
import ImportPreview from "./imports/ImportPreview";
import CodePreview from "./CodePreview";
import { useContext, useEffect } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import FunctionCodePreview from "./functions/FunctionCodePreview";

export default function MainScreen({
  menu,
  moduleName,
}: {
  menu: "Import" | "Struct" | "Function" | "FunctionCode" | "CodePreview";
  moduleName: string;
}) {
  const { setModuleName, functions, selectedFunction, setSelectedFunction } =
    useContext(SuiMoveModuleContext);

  useEffect(() => {
    setModuleName(moduleName);
  }, [moduleName]);

  return (
    <div className="flex-1 space-y-6 text-sm font-mono">
      <div className="flex justify-start items-center gap-4">
        <h1 className="text-2xl font-bold">{menu}</h1>

        <div className="flex flex-wrap max-h-[100px] overflow-y-auto gap-4">
          {menu === "FunctionCode" &&
            [...functions.entries()].map(([functionName, data]) => {
              return (
                <button
                  key={functionName}
                  className={`border-4 ${
                    functionName === selectedFunction?.functionName
                      ? "border-pink-500"
                      : "border-black"
                  } p-1 rounded-md cursor-pointer`}
                  onClick={() => setSelectedFunction(data)}
                >
                  {functionName}
                </button>
              );
            })}
        </div>
      </div>

      <pre className="bg-white p-4 rounded-md shadow whitespace-pre-wrap overflow-auto">
        {menu === "Import" && <ImportPreview />}
        {menu === "Struct" && <StructPreview />}
        {menu === "Function" && <FunctionPreview />}
        {menu === "FunctionCode" && <FunctionCodePreview />}

        {menu === "CodePreview" && <CodePreview />}
      </pre>
    </div>
  );
}
