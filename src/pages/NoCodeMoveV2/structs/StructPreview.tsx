import { useContext } from "react";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { Button } from "@/components/ui/button";
import StructEditorDialog from "./StructEditorDialog";
import StructCard from "./StructCard";

export default function StructPreview() {
  const { structs, setSelectedStruct } = useContext(SuiMoveModuleContext);

  return (
    <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
      {Array.from(structs.entries()).map(([structName, structData]) => (
        <Dialog key={structName}>
          <DialogTrigger
            asChild
            className="cursor-pointer rounded-md"
            onClick={() => setSelectedStruct(structData)}
          >
            <StructCard structName={structName} structData={structData} />
          </DialogTrigger>
          <StructEditorDialog />
        </Dialog>
      ))}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer h-full text-9xl"
            onClick={() => {
              setSelectedStruct(undefined);
            }}
          >
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <StructEditorDialog />
      </Dialog>
    </div>
  );
}
