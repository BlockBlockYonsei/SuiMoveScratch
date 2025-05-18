import {
  generateImportsCode,
  generateStructCode,
  generateFunctionCode,
} from "@/pages/NoCodeMoveV2/utils/generateCode";
import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ImportEditorDialog from "./imports/ImportEditorDialog";
import StructEditorDialog from "./structs/StructEditorDialog";
import FunctionEditorDialog from "./functions/FunctionEditorDialog";
import StructCardList from "./structs/StructCardList";
import FunctionListView from "./functions/FunctionListView";
import { PlusIcon } from "lucide-react";
import ImportPreview from "./imports/ImportPreview";

export default function DataPreview({
  menu,
}: {
  menu: "imports" | "structs" | "functions" | "code";
}) {
  const { imports, structs, functions, setSelectedStruct } =
    useContext(SuiMoveModuleContext);

  return (
    <div className="flex-1 p-5 space-y-6 text-sm font-mono">
      {/* <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => downloadMoveCode(imports, structs, functions)}
      >
        code download
      </button> */}
      <div className="flex justify-start items-center gap-4">
        <h1 className="text-2xl font-bold">{menu}</h1>

        {menu !== "code" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  if (menu === "structs") {
                    setSelectedStruct(null);
                  }
                }}
              >
                <PlusIcon />
              </Button>
            </DialogTrigger>
            {menu === "imports" && <ImportEditorDialog />}
            {menu === "structs" && <StructEditorDialog />}
            {menu === "functions" && <FunctionEditorDialog />}
          </Dialog>
        )}
      </div>

      <pre className="bg-white p-4 rounded-md shadow whitespace-pre-wrap overflow-auto">
        {menu === "imports" && <ImportPreview />}
        {menu === "structs" && <StructCardList />}
        {menu === "functions" && <FunctionListView />}

        {menu === "code" && (
          <div>
            <code>{generateImportsCode(imports)}</code>
            <br /> <br />
            <code>
              {Array.from(structs.entries())
                .map(([structName, structData]) =>
                  generateStructCode(structName, structData)
                )
                .join("\n\n")}
            </code>
            <br /> <br />
            <code>
              {Array.from(functions.entries())
                .map(([name, f]) => generateFunctionCode(name, f))
                .join("\n\n")}
            </code>
          </div>
        )}
      </pre>
    </div>
  );
}
