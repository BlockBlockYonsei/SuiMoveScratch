import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import StructCard from "./components/StructCard";
import { newEmptyStruct } from "./utils";

interface Props {
  structs: Record<string, SuiMoveNormalizedStruct>;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
}

export default function Structs({ structs, setStructs, imports }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const CURRENT_PACKAGE = "0x0";
  const CURRENT_MODULE = "CurrentModule";

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const addStruct = (e: any) => {
    if (e.key === "Enter") {
      const trimmed = inputValue.trim();

      const newStruct = newEmptyStruct();
      if (trimmed) {
        setStructs((prev) => ({
          ...prev,
          [trimmed]: newStruct,
        }));
      }
      setInputValue("");
      setIsEditing(false);
    }
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-xl border-2 border-black">
        {/* Struct 제목 및 Struct 추가 버튼 */}
        <div className="flex items-center gap-4 py-2">
          <div className="inline-block bg-gray-200 text-3xl">Struct</div>
          <div className="relative">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 my-2 rounded-xl cursor-pointer hover:bg-blue-600 transition"
            >
              ➕ Struct 추가
            </button>
            <div
              className={`${isEditing ? "" : "hidden"} absolute bg-gray-200`}
            >
              <input
                ref={inputRef}
                value={inputValue}
                placeholder="Struct Name을 입력하세요."
                onBlur={() => {
                  setInputValue("");
                  setIsEditing(false);
                }}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  addStruct(e);
                }}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Structs 하나씩 보여주는 곳 */}
        {Object.entries(structs).map(([key, value]) => {
          return (
            <div key={key}>
              <StructCard
                structName={key}
                structData={value}
                setStructs={setStructs}
                imports={imports}
              ></StructCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
