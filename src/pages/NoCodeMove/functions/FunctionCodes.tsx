import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import FunctionModal from "./FunctionModal";
import { useState } from "react";

interface Props {
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
  functions: Record<string, SuiMoveFunction>;
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}

export default function FunctionCodes({
  imports,
  structs,
  functions,
  functionName,
  functionData,
  setFunctions,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="relative">
        <button
          onClick={() => {
            // let newFunctionData = functionData;
            // newFunctionData.function.return.push("U64");
            // setFunctions((prev) => ({
            //   ...prev,
            //   [functionName]: newFunctionData,
            // }));
            setIsOpen((prev) => !prev);
          }}
          className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
        >
          ➕ 코드 추가
        </button>
        <div className={`${isOpen ? "" : "hidden"} `}>
          <FunctionModal
            imports={imports}
            functions={functions}
            addCode={(arg0: SuiMoveNormalizedFunction) => {
              let newFunctionData = functionData;
              newFunctionData.insideCode.push(arg0);
              setFunctions((prev) => ({
                ...prev,
                [functionName]: newFunctionData,
              }));
            }}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
      <div className="border-2 border-black rounded-md p-2">
        <div>let value = 30;</div>
        <input value={"let value = 30;"} />
        {functionData.insideCode.map((code) => (
          <div>{JSON.stringify(code)}</div>
        ))}
      </div>
    </div>
  );
}
