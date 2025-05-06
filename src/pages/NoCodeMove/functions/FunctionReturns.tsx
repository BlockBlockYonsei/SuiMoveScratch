import {
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import TypeButton from "../components/TypeButton";
import { FunctionReturnsProps } from "@/types/functions";

export default function FunctionReturns({
  imports,
  functionName,
  functionData,
  structs,
  setFunctions,
}: FunctionReturnsProps) {
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
