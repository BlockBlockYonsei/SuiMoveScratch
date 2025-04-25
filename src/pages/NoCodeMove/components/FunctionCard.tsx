import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveVisibility,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import { useState } from "react";
import FunctionParameters from "./FunctionParameters";
import FunctionReturns from "./FunctionReturns";
import TypeParameterCards from "./TypeParameterCards";

interface Props {
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
}

export default function FunctionCard({
  functionName,
  functionData,
  setFunctions,
  imports,
  structs,
}: Props) {
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);

  const [parameterNames, setParameterNames] = useState<string[]>([]);
  const addTypeParameter = (typeParameterName: string) => {
    setTypeParameterNames((prev) => [...prev, typeParameterName]);

    const newTypeParmeter: SuiMoveAbilitySet = {
      abilities: [],
    };
    const newFunctionData = {
      ...functionData,
      function: {
        ...functionData.function,
        typeParameters: [
          ...functionData.function.typeParameters,
          newTypeParmeter,
        ],
      },
    };
    setFunctions((prev) => ({
      ...prev,
      [functionName]: newFunctionData,
    }));
  };
  return (
    <div>
      {/* Function Info */}
      <div className="flex gap-2 text-xl font-semibold">
        <div className="">
          <select
            id="entry"
            name="entry"
            className="border-2 border-black p-1 rounded-md"
            onChange={(e) => {
              const isEntry = e.target.value === "entry";
              let newFunctionData = functionData;
              newFunctionData.function.isEntry = isEntry;
              setFunctions((prev) => ({
                ...prev,
                [functionName]: newFunctionData,
              }));
            }}
          >
            <option value="entry">Entry</option>
            <option value="non-entry">-</option>
          </select>
          <select
            id="visibility"
            name="visibility"
            className="text-pink-500 border-2 border-black p-1 rounded-md"
            onChange={(e) => {
              let newFunctionData = functionData;
              newFunctionData.function.visibility = e.target
                .value as SuiMoveVisibility;
              setFunctions((prev) => ({
                ...prev,
                [functionName]: newFunctionData,
              }));
            }}
          >
            <option value="Private">Private</option>
            <option value="Friend">Friend</option>
            <option value="Public">Public</option>
          </select>
          <span className="text-blue-700 border-2 border-black p-1 rounded-md">
            fun
          </span>
          <span className="border-2 border-black p-1 rounded-md">
            {functionName}
          </span>
        </div>
      </div>
      <TypeParameterCards
        typeParameterNames={typeParameterNames}
        name={functionName}
        data={functionData}
        setDatas={setFunctions}
        typeParameters={functionData.function.typeParameters}
        addTypeParameter={addTypeParameter}
      />

      {/* Function Parameter */}
      <div className="font-bold">Parameters:</div>
      <FunctionParameters
        functionName={functionName}
        functionData={functionData}
        imports={imports}
        structs={structs}
        setFunctions={setFunctions}
        parameterNames={parameterNames}
        setParameterNames={setParameterNames}
      />

      {/* Return : 이것도 Function Card 에 넣어야 함 */}
      <div className="font-bold">Returns:</div>
      <FunctionReturns
        functionName={functionName}
        functionData={functionData}
        imports={imports}
        structs={structs}
        setFunctions={setFunctions}
      />
      {/* <div>&#125;</div> */}
    </div>
  );
}
