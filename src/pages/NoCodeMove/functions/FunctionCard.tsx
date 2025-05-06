import FunctionParameters from "./FunctionParameters";
import FunctionReturns from "./FunctionReturns";
import FunctionInfo from "./FunctionInfo";
import FunctionCodes from "./FunctionCodes";
import { useState } from "react";
import FunctionTypeParameters from "./FunctionTypeParameters";
import { FunctionCardProps } from "@/types/functions";

export default function FunctionCard({
  imports,
  structs,
  functions,
  functionName,
  functionData,
  setFunctions,
}: FunctionCardProps) {
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
