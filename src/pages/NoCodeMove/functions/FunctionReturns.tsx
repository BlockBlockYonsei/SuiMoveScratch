import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import { useState } from "react";
import TypeModal from "../components/TypeModal";

export default function FunctionReturns({
  functionName,
  functionData,
  imports,
  structs,
  setFunctions,
}: {
  functionName: string;
  functionData: SuiMoveFunction;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}) {
  return (
    <div>
      <div>
        <button
          onClick={() => {
            let newFunctionData = functionData;
            newFunctionData.function.return.push("U64");

            setFunctions((prev) => ({
              ...prev,
              [functionName]: newFunctionData,
            }));
          }}
          className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
        >
          ➕ 리턴 타입 추가
        </button>
      </div>
      {functionData.function.return.map((param, index) => (
        <FunctionReturnCard
          key={param.toString()}
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
}: // setParams,
{
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

  const setType = (type: SuiMoveNormalizedType) => {
    let newFunctionData = functionData;
    newFunctionData.function.return[index] = type;
    setFunctions((prev) => ({
      ...prev,
      [functionName]: newFunctionData,
    }));

    setIsOpen((prev) => !prev);
  };

  return (
    <div key={key}>
      <div className="relative">
        <span>Return{index}</span> :{" "}
        <button
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="border-2 border-black cursor-pointer rounded-md"
        >
          {/* {type} */}
          {typeof param === "string"
            ? param
            : "Struct" in param
            ? param.Struct.name
            : "Unknown Type"}
          {/* {name} */}
        </button>
        <div className={`${isOpen ? "" : "hidden"} `}>
          <TypeModal
            imports={imports}
            structs={structs}
            typeParameters={typeParameters}
            setType={setType}
          ></TypeModal>
        </div>
      </div>
    </div>
  );
}
