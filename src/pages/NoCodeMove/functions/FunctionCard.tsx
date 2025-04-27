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

interface Props {
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
}

export default function FunctionCard({
  imports,
  functionName,
  functionData,
  setFunctions,
  structs,
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
      <div className="border-2 border-black rounded-md p-2">
        <div>let value = 30;</div>
        <input value={"let value = 30;"} />
        {functionData.insideCode.map((c) => (
          <div>{c}</div>
        ))}
      </div>

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
