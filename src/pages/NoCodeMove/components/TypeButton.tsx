import { useState } from "react";
import TypeModal from "./TypeModal";
import { TypeButtonProps } from "@/types/components";

export default function TypeButton({
  imports,
  structs,
  typeParameters,
  type,
  setType,
}: TypeButtonProps) {
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
