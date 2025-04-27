import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveVisibility,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import FunctionParameters from "./FunctionParameters";
import FunctionReturns from "./FunctionReturns";
import TypeParameters from "../components/TypeParameters";

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
