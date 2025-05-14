import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useState } from "react";
import TypeModal from "./TypeModal";

interface Props {
  imports: Record
    string,
    Record
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
  typeParameters: SuiMoveStructTypeParameter[] | SuiMoveAbilitySet[];
  type: SuiMoveNormalizedType;
  setType: (type: SuiMoveNormalizedType) => void;
}

export default function TypeButton({
  imports,
  structs,
  typeParameters,
  type,
  setType,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Helper function to display the type in a readable format
  const displayType = (): string => {
    if (typeof type === "string") {
      return type;
    } else if ("Struct" in type) {
      return type.Struct.name;
    } else {
      return "Unknown Type";
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="border-2 border-black cursor-pointer rounded-md px-2 py-1 ml-1 hover:bg-gray-100"
      >
        {displayType()}
      </button>
      <div className={`${isOpen ? "" : "hidden"}`}>
        <TypeModal
          imports={imports}
          structs={structs}
          typeParameters={typeParameters}
          setType={(newType) => {
            setType(newType);
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
}