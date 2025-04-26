import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import FunctionCard from "./functions/FunctionCard";
// import { parseSuiMoveNormalizedType } from "../PackageViewer1/utils";

export interface SuiMoveFunction {
  function: SuiMoveNormalizedFunction;
  insideCode: string[];
}

interface Props {
  functions: Record<string, SuiMoveFunction>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
}

export default function Functions({
  functions,
  setFunctions,
  imports,
  structs,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const addFunction = (e: any) => {
    if (e.key === "Enter") {
      const trimmed = inputValue.trim();
      const newSuiMoveFunction = newEmptySuiMoveFunction();

      if (trimmed) {
        setFunctions((prev) => ({
          ...prev,
          [trimmed]: newSuiMoveFunction,
        }));
      }
      setInputValue("");
      setIsEditing(false);
    }
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-xl border-2 border-black">
        <div className="flex items-center gap-4 py-2">
          <div className="inline-block bg-gray-200 text-3xl">Function</div>
          <div className="relative">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 my-2 rounded-xl cursor-pointer hover:bg-blue-600 transition"
            >
              ➕ Function 추가
            </button>
            <div
              className={`${isEditing ? "" : "hidden"} absolute bg-gray-200`}
            >
              <input
                ref={inputRef}
                value={inputValue}
                placeholder="Function Name을 입력하세요."
                onBlur={() => {
                  setInputValue("");
                  setIsEditing(false);
                }}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  addFunction(e);
                }}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Functions 하나씩 보여주는 곳 */}
        {Object.entries(functions).map(([functionName, functionData]) => {
          return (
            <div
              key={functionName}
              className="border p-4 mb-6 rounded-lg shadow-md"
            >
              <FunctionCard
                functionName={functionName}
                functionData={functionData}
                imports={imports}
                structs={structs}
                setFunctions={setFunctions}
              ></FunctionCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function newEmptySuiMoveFunction() {
  const CURRENT_PACKAGE =
    "0x1111111111111111111111111111111111111111111111111111111111111111";

  const CURRENT_MODULE = "CurrentModule";

  const newFunction: SuiMoveNormalizedFunction = {
    isEntry: false,
    parameters: [],
    return: [],
    typeParameters: [],
    visibility: "Private",
  };
  const newSuiMoveFunction: SuiMoveFunction = {
    function: newFunction,
    insideCode: [],
  };

  return newSuiMoveFunction;
}
