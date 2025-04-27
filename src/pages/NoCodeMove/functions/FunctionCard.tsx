import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import FunctionParameters from "./FunctionParameters";
import FunctionReturns from "./FunctionReturns";
import TypeParameters from "../components/TypeParameters";
import FunctionInfoCard from "./FunctionInfoCard";
import FunctionCodes from "./FunctionCodes";

interface Props {
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}

export default function FunctionCard({
  imports,
  structs,
  functionName,
  functionData,
  setFunctions,
}: Props) {
  const addTypeParameter = () => {
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
      <FunctionInfoCard
        functionName={functionName}
        functionData={functionData}
        setFunctions={setFunctions}
      />

      <div className="font-bold">Type Parameters:</div>
      <TypeParameters
        name={functionName}
        data={functionData}
        setDatas={setFunctions}
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
      />

      {/* Codes in Function */}
      <div className="font-bold">Codes in Function:</div>
      <FunctionCodes
        imports={imports}
        structs={structs}
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
