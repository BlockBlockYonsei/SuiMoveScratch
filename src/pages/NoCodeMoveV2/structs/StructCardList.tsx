import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import StructEditorDialog from "./StructEditorDialog";
import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import StructCard from "./StructCard";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function StructCardList() {
  const { structs, setSelectedStruct } = useContext(SuiMoveModuleContext);

  const formatType = (type: any): string => {
    if (typeof type === "string") return type;
    if (type.Struct) {
      const { name, typeArguments } = type.Struct;
      if (typeArguments && typeArguments.length > 0) {
        return `${name}<${typeArguments
          .map((t: any) => formatType(t))
          .join(", ")}>`;
      }
      return name;
    }
    return JSON.stringify(type);
  };

  return (
    <div className="space-y-2 grid grid-cols-2 lg:grid-cols-3 gap-2">
      {Array.from(structs.entries()).map(([structName, structData]) => (
        <Dialog>
          <DialogTrigger
            className="cursor-pointer rounded-md"
            onClick={() => setSelectedStruct(structName)}
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
              setSelectedStruct(null);
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
