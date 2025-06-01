import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import FunctionCard from "./FunctionCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import FunctionCodeEditorDialog from "./FunctionCodeEditorDialog";

export default function FunctionCodePreview() {
  const { functions, selectedFunction, setSelectedFunction } =
    useContext(SuiMoveModuleContext);

  if (!selectedFunction) return;
  return (
    <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
      <Dialog key={selectedFunction.functionName}>
        <DialogTrigger className="cursor-pointer rounded-md">
          <FunctionCard
            functionName={selectedFunction.functionName}
            functionData={selectedFunction}
          />
        </DialogTrigger>
        <FunctionCodeEditorDialog />
      </Dialog>
    </div>
  );
}
