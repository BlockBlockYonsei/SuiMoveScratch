import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "@/types/move-syntax";
import FunctionParameters from "./FunctionParameters";
import FunctionReturns from "./FunctionReturns";
import FunctionInfo from "./FunctionInfo";
import FunctionCodes from "./FunctionCodes";
import { useState } from "react";
import FunctionTypeParameters from "./FunctionTypeParameters";

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

export default function FunctionCard({
  imports,
  structs,
  functions,
  functionName,
  functionData,
  setFunctions,
}: Props) {
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);
  const [parameterNames, setParameterNames] = useState<string[]>([]);

  return (
    <div>
      <FunctionInfo
        functionName={functionName}
        functionData={functionData}
        setFunctions={setFunctions}
      />

      <div className="font-bold">Type Parameters:</div>
      <FunctionTypeParameters
        functionName={functionName}
        functionData={functionData}
        setFunctions={setFunctions}
        typeParameterNames={typeParameterNames}
        setTypeParameterNames={setTypeParameterNames}
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

      {/* Codes in Function */}
      <div className="font-bold">Codes in Function:</div>
      <FunctionCodes
        imports={imports}
        structs={structs}
        functions={functions}
        functionName={functionName}
        functionData={functionData}
        setFunctions={setFunctions}
      />

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
