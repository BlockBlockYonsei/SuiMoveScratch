import {
  SuiMoveAbilitySet,
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

export default function FunctionReturns({
  functionName,
  functionData,
  imports,
  structs,
  setFunctions,
}: Props) {
  return (
    <ErrorBoundary>
      <div>
        <div>
          <button
            onClick={() => {
              try {
                let newFunctionData = { ...functionData };
                newFunctionData.function.return.push("U64");
                setFunctions((prev) => ({
                  ...prev,
                  [functionName]: newFunctionData,
                }));
              } catch (error) {
                console.error("Error adding return type:", error);
              }
            }}
            className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
          >
            ➕ 리턴 타입 추가
          </button>
        </div>
        {/* Display return types */}
        {functionData.function.return.map((param, index) => (
          <FunctionReturnCard
            key={`return-${index}-${param.toString()}`}
            index={index}
            param={param}
            typeParameters={functionData.function.typeParameters}
            imports={imports}
            structs={structs}
            functionName={functionName}
            functionData={functionData}
            setFunctions={setFunctions}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
}

export function FunctionReturnCard({
  key,
  index,
  param,
  typeParameters,
  imports,
  structs,
  functionName,
  functionData,
  setFunctions,
}: {
  key?: React.Key | null | undefined;
  index: number;
  param: SuiMoveNormalizedType;
  typeParameters: SuiMoveAbilitySet[];
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Function to update return type
  const setType = (type: SuiMoveNormalizedType) => {
    try {
      let newFunctionData = { ...functionData };
      newFunctionData.function.return[index] = type;
      setFunctions((prev) => ({
        ...prev,
        [functionName]: newFunctionData,
      }));
      setIsOpen((prev) => !prev);
    } catch (error) {
      console.error("Error updating return type:", error);
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
    <div key={key}>
      <div className="relative mt-2">
        <span className={`${SYNTAX_COLORS.VARIABLE}`}>Return{index}</span>:{" "}
        <button
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="border-2 border-black cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
        >
          {displayType(param)}
        </button>
        <div className={`${isOpen ? "" : "hidden"}`}>
          <TypeModal
            imports={imports}
            structs={structs}
            typeParameters={typeParameters}
            setType={setType}
          />
        </div>
      </div>
    </div>
  );
}
