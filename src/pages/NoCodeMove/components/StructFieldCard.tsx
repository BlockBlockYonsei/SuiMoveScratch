import {
  SuiMoveNormalizedField,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { useState, useRef, useEffect } from "react";
import TypeModal from "./TypeModal";
import { preventDefault } from "../utils/utils";

interface Props {
  key?: React.Key | null | undefined;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  structName: string;
  structData: SuiMoveNormalizedStruct;
  setStructs: React.Dispatch
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  field: SuiMoveNormalizedField;
}

export default function StructFieldCard({
  key,
  imports,
  structs,
  structName,
  structData,
  setStructs,
  field,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside the modal to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  
  // Function to update the field type
  const setType = (type: SuiMoveNormalizedType) => {
    try {
      // Create a new fields array with the updated field
      const updatedFields = structData.fields.map((f) =>
        f.name === field.name ? { ...f, type } : f
      );
      // Create a new struct with the updated fields
      const newStructData = {
        ...structData,
        fields: updatedFields,
      };
      // Update the structs state
      setStructs((prev) => ({
        ...prev,
        [structName]: newStructData,
      }));
      // Close the type modal
      setIsOpen(false);
    } catch (error) {
      console.error("Error setting field type:", error);
    }
  };
  
  // Helper function to display the type in a readable format
  const displayType = (type: SuiMoveNormalizedType): string => {
    if (typeof type === "string") {
      return type;
    } else if ("Struct" in type) {
      return type.Struct.name;
    } else {
      return "Unknown Type";
    }
  };
  
  return (
    <div key={key} className="mb-2">
      <div className="relative flex items-center">
        <span className="text-lg text-blue-500 font-semibold">
          {field.name}:{" "}
        </span>
        <button
          onClick={(e) => {
            preventDefault(e);
            setIsOpen(!isOpen);
          }}
          className="border-2 border-black cursor-pointer rounded-md px-2 py-1 ml-2 hover:bg-gray-100"
        >
          {displayType(field.type)}
        </button>
        {/* Type selection modal */}
        {isOpen && (
          <div ref={modalRef} className="z-50">
            <TypeModal
              imports={imports}
              structs={structs}
              typeParameters={structData.typeParameters}
              setType={setType}
            />
          </div>
        )}
      </div>
    </div>
  );
}