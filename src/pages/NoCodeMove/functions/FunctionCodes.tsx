import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "@/types/move-syntax";
import FunctionModal from "./FunctionModal";
import { useState } from "react";
import { parseSuiMoveNormalizedType } from "../../PackageViewer1/utils";

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
  // structs,
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
            addCode={(
              funcName: string,
              funcData: SuiMoveNormalizedFunction
            ) => {
              let newFunctionData = functionData;
              newFunctionData.insideCode[funcName] = funcData;
              setFunctions((prev) => ({
                ...prev,
                [functionName]: newFunctionData,
              }));
            }}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
      <div className="border-2 border-black rounded-md p-2 overflow-x-auto whitespace-nowrap">
        <div>let value = 30;</div>
        <input value={"let value = 30;"} />

        {Object.entries(functionData.insideCode).map(([funcName, codeLine]) => {
          return (
            <div className="">
              <span className="font-semibold">
                <span className="text-blue-500">let </span>(
                {codeLine.return.map((r) => {
                  const returnType = parseSuiMoveNormalizedType(r);
                  return (
                    <span>
                      <span>
                        {returnType.prefix === "value" ? "" : returnType.prefix}
                      </span>
                      <span className="text-emerald-500">
                        {typeof returnType.core === "string"
                          ? returnType.core
                          : "Struct" in returnType.core
                          ? returnType.core.Struct.name
                          : "TypeParameter" in returnType.core
                          ? returnType.core.TypeParameter
                          : "Unknown Type"}
                      </span>
                      ,{" "}
                    </span>
                  );
                })}
                ) = <span className="text-pink-500">{funcName}</span>&lt;
                {codeLine.typeParameters.map((tp, i) => {
                  return (
                    <span>
                      T{i}: {tp.abilities.join(", ")},
                    </span>
                  );
                })}
                &gt;(
                {codeLine.parameters.map((p) => {
                  const parameterType = parseSuiMoveNormalizedType(p);
                  return (
                    <span>
                      <span>{parameterType.prefix}</span>
                      <span className="text-emerald-500">
                        {typeof parameterType.core === "string"
                          ? parameterType.core
                          : "Struct" in parameterType.core
                          ? parameterType.core.Struct.name
                          : "TypeParameter" in parameterType.core
                          ? parameterType.core.TypeParameter
                          : "Unknown Type"}
                      </span>
                      ,{" "}
                    </span>
                  );
                })}
                )
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
