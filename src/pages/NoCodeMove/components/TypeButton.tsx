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
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
  typeParameters: SuiMoveStructTypeParameter[] | SuiMoveAbilitySet[]; // strudt or function
  type: SuiMoveNormalizedType;
  setType: (arg0: SuiMoveNormalizedType) => void;
}

export default function TypeButton({
  imports,
  structs,
  typeParameters,
  type,
  setType,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="border-2 border-black cursor-pointer rounded-md"
      >
        {typeof type === "string"
          ? type
          : "Struct" in type
          ? type.Struct.name
          : "Unknown Type"}
      </button>
      <div className={`${isOpen ? "" : "hidden"} `}>
        <TypeModal
          imports={imports}
          structs={structs}
          typeParameters={typeParameters}
          setType={setType}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  );
}
