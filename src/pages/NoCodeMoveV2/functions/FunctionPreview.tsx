import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import FunctionCard from "./FunctionCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import FunctionEditorDialog from "./FunctionEditorDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function FunctionPreview() {
  const { functions, setSelectedFunction } = useContext(SuiMoveModuleContext);
  return (
    <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
      {[...functions.entries()].map(([functionName, data]) => {
        return (
          <Dialog key={functionName}>
            <DialogTrigger
              asChild
              className="cursor-pointer rounded-md"
              onClick={() => setSelectedFunction(data)}
            >
              <FunctionCard functionName={functionName} functionData={data} />
            </DialogTrigger>
            <FunctionEditorDialog />
          </Dialog>
        );
      })}
      <Dialog>
        <DialogTrigger asChild onClick={() => setSelectedFunction(undefined)}>
          <Button
            variant="outline"
            className="cursor-pointer h-full min-h-40 text-9xl"
          >
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <FunctionEditorDialog />
      </Dialog>
    </div>
  );
}
