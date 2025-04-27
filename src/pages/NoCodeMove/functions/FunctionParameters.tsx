import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import { useState } from "react";
import TypeModal from "../components/TypeModal";
import AddButton from "../components/AddButton";

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
  const addFunctionParameter = (name: string) => {
    let newFunctionData = functionData;
    newFunctionData.function.parameters.push("U64");

    setFunctions((prev) => ({
      ...prev,
      [functionName]: newFunctionData,
    }));
    setParameterNames((prev) => [...prev, name]);
  };

  return (
    <div>
      <AddButton
        title="파라미터 추가"
        placeholder="Parameter Name을 입력하세요"
        callback={addFunctionParameter}
      />
      {functionData.function.parameters.map((param, index) => (
        <FunctionParameterCard
          key={param.toString()}
          index={index}
          param={param}
          typeParameters={functionData.function.typeParameters}
          imports={imports}
          structs={structs}
          functionName={functionName}
          functionData={functionData}
          setFunctions={setFunctions}
          parameterNames={parameterNames}
        />
      ))}
    </div>
  );
}

export function FunctionParameterCard({
  key,
  index,
  param,
  typeParameters,
  imports,
  structs,
  functionName,
  functionData,
  parameterNames,
  setFunctions,
}: // setParams,
{
  key?: React.Key | null | undefined;
  index: number;
  param: SuiMoveNormalizedType;
  typeParameters: SuiMoveAbilitySet[];
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
  parameterNames: string[];
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const setType = (type: SuiMoveNormalizedType) => {
    let newFunctionData = functionData;
    newFunctionData.function.parameters[index] = type;
    setFunctions((prev) => ({
      ...prev,
      [functionName]: newFunctionData,
    }));

    setIsOpen((prev) => !prev);
  };

  return (
    <div key={key}>
      <div className="relative">
        <span>
          Param{index}({parameterNames[index]})
        </span>{" "}
        :{" "}
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="border-2 border-black cursor-pointer rounded-md"
        >
          {/* {type} */}
          {typeof param === "string"
            ? param
            : "Struct" in param
            ? param.Struct.name
            : "Unknown Type"}
          {/* {name} */}
        </button>
        <div className={`${isOpen ? "" : "hidden"} `}>
          <TypeModal
            imports={imports}
            structs={structs}
            typeParameters={typeParameters}
            setType={setType}
          ></TypeModal>
        </div>
      </div>
    </div>
  );
}
