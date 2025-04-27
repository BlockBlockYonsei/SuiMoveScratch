import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import AddButton from "../components/AddButton";
import TypeButton from "../components/TypeButton";

export default function FunctionParameters({
  functionName,
  functionData,
  imports,
  structs,
  setFunctions,
  parameterNames,
  setParameterNames,
}: {
  functionName: string;
  functionData: SuiMoveFunction;
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  parameterNames: string[];
  setParameterNames: React.Dispatch<React.SetStateAction<string[]>>;
}) {
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
      {functionData.function.parameters.map((type, index) => {
        const setType = (type: SuiMoveNormalizedType) => {
          let newFunctionData = functionData;
          newFunctionData.function.parameters[index] = type;
          setFunctions((prev) => ({
            ...prev,
            [functionName]: newFunctionData,
          }));
        };

        return (
          <div>
            <span>
              Param{index}({parameterNames[index]})
            </span>{" "}
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
