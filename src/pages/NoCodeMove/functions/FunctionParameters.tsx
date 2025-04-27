import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import AddButton from "../components/AddButton";
import TypeButton from "../components/TypeButton";
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
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}
export default function FunctionParameters({
  imports,
  structs,
  functionName,
  functionData,
  setFunctions,
}: Props) {
  const [parameterNames, setParameterNames] = useState<string[]>([]);
  return (
    <div>
      <AddButton
        title="파라미터 추가"
        placeholder="Parameter Name을 입력하세요"
        callback={(name: string) => {
          let newFunctionData = functionData;
          newFunctionData.function.parameters.push("U64");

          setFunctions((prev) => ({
            ...prev,
            [functionName]: newFunctionData,
          }));
          setParameterNames((prev) => [...prev, name]);
        }}
      />
      {functionData.function.parameters.map((type, i) => {
        const setType = (type: SuiMoveNormalizedType) => {
          let newFunctionData = functionData;
          newFunctionData.function.parameters[i] = type;
          setFunctions((prev) => ({
            ...prev,
            [functionName]: newFunctionData,
          }));
        };

        return (
          <div>
            <span className="text-lg font-semibold">
              {`P${i}`}(
              <span className="text-blue-500 ">{`${parameterNames[i]}`}</span>
              ):
            </span>
            <TypeButton
              imports={imports}
              structs={structs}
              typeParameters={functionData.function.typeParameters}
              setType={setType}
              type={type}
            />
          </div>
        );
      })}
    </div>
  );
}
