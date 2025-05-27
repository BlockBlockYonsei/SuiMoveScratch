import StructPreview from "./structs/StructPreview";
import FunctionPreview from "./functions/FunctionPreview";
import ImportPreview from "./imports/ImportPreview";
import CodePreview from "./CodePreview";
import { useContext, useEffect } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import {
  generateFunctionCode,
  generateImportsCode,
  generateModuleDeclaration,
  generateStructCode,
} from "@/lib/generateCode";

export default function MainScreen({
  menu,
  moduleName,
  setModuleCodes,
}: {
  menu: "Imports" | "Structs" | "Functions" | "CodePreview";
  moduleName: string;
  setModuleCodes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const { setModuleName, imports, structs, functions } =
    useContext(SuiMoveModuleContext);

  useEffect(() => {
    setModuleName(moduleName);
  }, [moduleName]);

  useEffect(() => {
    const moduleDeclaration = generateModuleDeclaration({
      packageName: "0x0",
      moduleName,
    });

    const importsCode = generateImportsCode(imports);

    const structsCode =
      Array.from(structs.values())
        .map((struct) => generateStructCode(struct))
        .join("\n") + "\n";

    const functionsCode =
      Array.from(functions.values())
        .map((func) => generateFunctionCode(func))
        .join("\n") + "\n";

    const code = moduleDeclaration + importsCode + structsCode + functionsCode;

    setModuleCodes((prev) => ({ ...prev, [moduleName]: code }));
  }, [moduleName, imports, structs, functions]);

  return (
    <div className="flex-1 space-y-6 text-sm font-mono">
      <div className="flex justify-start items-center gap-4">
        <h1 className="text-2xl font-bold">{menu}</h1>
      </div>

      <pre className="bg-white p-4 rounded-md shadow whitespace-pre-wrap overflow-auto">
        {menu === "Imports" && <ImportPreview />}
        {menu === "Structs" && <StructPreview />}
        {menu === "Functions" && <FunctionPreview />}

        {menu === "CodePreview" && <CodePreview />}
      </pre>
    </div>
  );
}
