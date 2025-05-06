import {
  SuiMoveNormalizedField,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import StructFieldCard from "./StructFieldCard";
import ErrorBoundary from "./ErrorBoundary";

interface Props {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  structName: string;
  structData: SuiMoveNormalizedStruct;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
}

export default function StructFields({
  imports,
  structs,
  structName,
  structData,
  setStructs,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Add a new field
  const addField = () => {
    try {
      const trimmed = inputValue.trim();
      if (!trimmed) return;

      // Check for duplicate field names
      if (structData.fields.some((field) => field.name === trimmed)) {
        console.warn("Field name already exists");
        return;
      }

      // Create a new field with default type U64
      const newField: SuiMoveNormalizedField = {
        name: trimmed,
        type: "U64",
      };

      // Update the struct data with the new field
      const newStructData = {
        ...structData,
        fields: [...structData.fields, newField],
      };

      // Set the updated struct data
      setStructs((prev) => ({
        ...prev,
        [structName]: newStructData,
      }));
    } catch (error) {
      console.error("Error adding field:", error);
    } finally {
      setInputValue("");
      setIsEditing(false);
    }
  };

  return (
    <ErrorBoundary>
      <div>
        {/* Field add button */}
        <button
          onClick={() => setIsEditing(true)}
          className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
        >
          ➕ 필드 추가
        </button>

        {/* Display existing fields */}
        <div className="mt-2">
          {structData.fields.map((field) => (
            <StructFieldCard
              key={field.name}
              imports={imports}
              structs={structs}
              structName={structName}
              structData={structData}
              setStructs={setStructs}
              field={field}
            />
          ))}
        </div>

        {/* Input field for adding a new field */}
        <input
          className={`${
            isEditing ? "" : "hidden"
          } block mt-2 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none`}
          ref={inputRef}
          value={inputValue}
          placeholder="Field Name을 입력하세요."
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            setInputValue("");
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addField();
            }
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
