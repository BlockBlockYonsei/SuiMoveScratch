import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import FunctionCard from "./FunctionCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import FunctionCodeEditorDialog from "./FunctionCodeEditorDialog";

export default function FunctionCodePreview() {
  const { functions, setSelectedFunction } = useContext(SuiMoveModuleContext);
  return (
    <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
      {[...functions.entries()].map(([functionName, data]) => {
        return (
          <Dialog key={functionName}>
            <DialogTrigger
              className="cursor-pointer rounded-md"
              onClick={() => setSelectedFunction(data)}
            >
              <FunctionCard functionName={functionName} functionData={data} />
            </DialogTrigger>
            <FunctionCodeEditorDialog />
          </Dialog>
        );
      })}
      <Dialog>
        <DialogTrigger asChild onClick={() => setSelectedFunction(undefined)}>
          <Button variant="outline" className="cursor-pointer h-full text-9xl">
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <FunctionCodeEditorDialog />
      </Dialog>
    </div>
  );
}
