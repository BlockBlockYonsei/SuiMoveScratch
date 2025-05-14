import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "@/types/move";
import TypeButton from "../components/TypeButton";

export default function FunctionReturns({
  imports,
  functionName,
  functionData,
  structs,
  setFunctions,
}: {
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  functionName: string;
  functionData: SuiMoveFunction;
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
      {functionData.function.return.map((type, index) => {
        const setType = (type: SuiMoveNormalizedType) => {
          let newFunctionData = functionData;
          newFunctionData.function.return[index] = type;
          setFunctions((prev) => ({
            ...prev,
            [functionName]: newFunctionData,
          }));
        };
        return (
          <TypeButton
            imports={imports}
            structs={structs}
            typeParameters={functionData.function.typeParameters}
            setType={setType}
            type={type}
          />
        );
      })}
    </div>
  );
}
