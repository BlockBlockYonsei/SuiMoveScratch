import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import StructEditorDialog from "./StructEditorDialog";
import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import StructCard from "./StructCard";

export default function StructCardList() {
  const { structs, setStructs, setSelectedStruct } =
    useContext(SuiMoveModuleContext);

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
    <div className="space-y-6">
      {Array.from(structs.entries()).map(([structName, structData]) => (
        <Dialog>
          <DialogTrigger>
            <button
              className="px-4 py-2 cursor-pointer rounded-md"
              onClick={() => setSelectedStruct(structName)}
            >
              <StructCard
                structName={structName}
                structData={structData}
                setStructs={setStructs}
              />
            </button>
          </DialogTrigger>
          <StructEditorDialog />
        </Dialog>
      ))}
    </div>
  );
}
