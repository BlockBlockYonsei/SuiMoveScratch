import StructPreview from "./structs/StructPreview";
import FunctionPreview from "./functions/FunctionPreview";
import ImportPreview from "./imports/ImportPreview";
import CodePreview from "./CodePreview";
import { useContext, useEffect } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { Button } from "@/components/ui/button";

export default function MainScreen({
  menu,
  moduleName,
}: {
  menu: "Imports" | "Structs" | "Functions" | "CodePreview";
  moduleName: string;
}) {
  const { setModuleName } = useContext(SuiMoveModuleContext);

  useEffect(() => {
    setModuleName(moduleName);
  }, [moduleName]);

  const handleDownload = () => {};

  return (
    <div className="flex-1 space-y-6 text-sm font-mono">
      <div className="flex justify-start items-center gap-4">
        <h1 className="text-2xl font-bold">{menu}</h1>
        {menu === "CodePreview" && (
          <Button className="cursor-pointer" onClick={handleDownload}>
            Code Download
          </Button>
        )}
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
