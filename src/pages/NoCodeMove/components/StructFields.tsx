import {
  SuiMoveNormalizedField,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import StructFieldCard from "./StructFieldCard";

interface Props {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>; // 여긴 필요 없고, StructFieldCards에서 필요
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
  // const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      {/* 필드 추가 버튼 */}
      <button
        onClick={() => setIsEditing(true)}
        className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
      >
        ➕ 필드 추가
      </button>

      {/* 필드 보여주는 곳 */}
      {structData.fields.map((field, _) => (
        <StructFieldCard
          key={field.name}
          imports={imports}
          structs={structs}
          structName={structName}
          structData={structData}
          setStructs={setStructs}
          field={field}
        ></StructFieldCard>
      ))}

      {/* 필드 이름 입력 */}
      <input
        className={`${
          isEditing ? "" : "hidden"
        } block px-3 py-2 border border-gray-300 rounded-xl focus:outline-none`}
        ref={inputRef}
        value={inputValue}
        placeholder="Field Name을 입력하세요."
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => {
          setInputValue("");
          setIsEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;

          try {
            const trimmed = inputValue.trim();
            if (!trimmed) return;

            if (structData.fields.some((field) => field.name === trimmed))
              return;

            const newField: SuiMoveNormalizedField = {
              name: trimmed,
              type: "U64",
            };
            const newStructData = {
              ...structData,
              fields: [...structData.fields, newField],
            };
            setStructs((prev) => ({
              ...prev,
              [structName]: newStructData,
            }));
          } finally {
            setInputValue("");
            setIsEditing(false);
          }
        }}
      />
    </div>
  );
}
