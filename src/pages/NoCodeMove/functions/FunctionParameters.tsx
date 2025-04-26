import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import { useEffect, useRef, useState } from "react";
import TypeModal from "../components/TypeModal";

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
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  parameterNames: string[];
  setParameterNames: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // const [params, setParams] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <div>
        <button
          onClick={() => setIsEditing(true)}
          className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
        >
          ➕ 파라미터 추가
        </button>
      </div>
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
      {isEditing && (
        <div>
          <input
            ref={inputRef}
            value={inputValue}
            placeholder="Parameter Name을 입력하세요."
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              setInputValue("");
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const trimmed = inputValue.trim();
                if (trimmed) {
                  let newFunctionData = functionData;
                  newFunctionData.function.parameters.push("U64");

                  setFunctions((prev) => ({
                    ...prev,
                    [functionName]: newFunctionData,
                  }));
                  setParameterNames((prev) => [...prev, trimmed]);
                }
                setInputValue("");
                setIsEditing(false);
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
          />
        </div>
      )}
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
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
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
