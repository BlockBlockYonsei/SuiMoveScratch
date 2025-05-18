import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import FunctionCard from "./FunctionCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import FunctionEditorDialog from "./FunctionEditorDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function FunctionCardList() {
  const { imports, structs, functions, setFunctions, setSelectedFunction } =
    useContext(SuiMoveModuleContext);
  return (
    <div className="space-y-2 grid grid-cols-2 lg:grid-cols-3 gap-2">
      {[...functions.entries()].map(([name, data]) => {
        return (
          <Dialog>
            <DialogTrigger className="cursor-pointer rounded-md">
              <FunctionCard functionName={name} functionData={data} />
            </DialogTrigger>
            <FunctionEditorDialog />
          </Dialog>
        );
      })}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer h-full text-9xl"
            onClick={() => {
              setSelectedFunction(null);
            }}
          >
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <FunctionEditorDialog />
      </Dialog>
    </div>
  );
}
