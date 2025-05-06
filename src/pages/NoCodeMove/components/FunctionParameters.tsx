import {
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { useState } from "react";
import { SuiMoveFunction } from "../_Functions";
import TypeModal from "./TypeModal";
import ErrorBoundary from "./ErrorBoundary";
import { SYNTAX_COLORS } from "../utils";

interface Props {
  functionName: string;
  functionData: SuiMoveFunction;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}

export default function FunctionParameters({
  functionName,
  functionData,
  imports,
  structs,
  setFunctions,
}: Props) {
  const [activeParamIndex, setActiveParamIndex] = useState<number | null>(null);

  // Add a new parameter with default U64 type
  const addParameter = () => {
    try {
      let newFunctionData = { ...functionData };
      newFunctionData.function.parameters.push("U64");
      setFunctions((prev) => ({
        ...prev,
        [functionName]: newFunctionData,
      }));
    } catch (error) {
      console.error("Error adding parameter:", error);
    }
  };

  // Update parameter type
  const updateParameterType = (index: number, type: SuiMoveNormalizedType) => {
    try {
      let newFunctionData = { ...functionData };
      newFunctionData.function.parameters[index] = type;
      setFunctions((prev) => ({
        ...prev,
        [functionName]: newFunctionData,
      }));
      setActiveParamIndex(null);
    } catch (error) {
      console.error("Error updating parameter type:", error);
    }
  };

  // Helper function to display type in readable format
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
    <ErrorBoundary>
      <div>
        <button
          onClick={addParameter}
          className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
        >
          ➕ 파라미터 추가
        </button>

        <div className="mt-2 space-y-2">
          {functionData.function.parameters.map((param, index) => (
            <div key={index} className="flex items-center">
              <span className={`${SYNTAX_COLORS.VARIABLE} mr-2`}>
                param{index}:
              </span>
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveParamIndex(
                      index === activeParamIndex ? null : index
                    )
                  }
                  className="border-2 border-black cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
                >
                  {displayType(param)}
                </button>
                {activeParamIndex === index && (
                  <div className="absolute left-0 top-full z-50">
                    <TypeModal
                      imports={imports}
                      structs={structs}
                      typeParameters={functionData.function.typeParameters}
                      setType={(type) => updateParameterType(index, type)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
