import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
// import { parseSuiMoveNormalizedType } from "../PackageViewer1/utils";

export interface SuiMoveFunction {
  function: SuiMoveNormalizedFunction;
  insideCode: string[];
}

interface Props {
  functions: Record<string, SuiMoveFunction>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
}

interface FunctiopnCardProps {
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
}

export default function Functions({
  functions,
  setFunctions,
  imports,
  structs,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const addFunction = (e: any) => {
    if (e.key === "Enter") {
      const trimmed = inputValue.trim();
      const newSuiMoveFunction = newEmptySuiMoveFunction();

      if (trimmed) {
        setFunctions((prev) => ({
          ...prev,
          [trimmed]: newSuiMoveFunction,
        }));
      }
      setInputValue("");
      setIsEditing(false);
    }
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-xl border-2 border-black">
        <div className="flex items-center gap-4 py-2">
          <div className="inline-block bg-gray-200 text-3xl">Function</div>
          <div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 my-2 rounded-xl cursor-pointer hover:bg-blue-600 transition"
              >
                ➕ Function 추가
              </button>
            )}
          </div>
        </div>

        {/* Functions 하나씩 보여주는 곳 */}
        {Object.entries(functions).map(([functionName, functionData]) => {
          return (
            <div
              key={functionName}
              className="border p-4 mb-6 rounded-lg shadow-md"
            >
              <FunctionCard
                functionName={functionName}
                functionData={functionData}
                imports={imports}
                structs={structs}
                setFunctions={setFunctions}
              ></FunctionCard>
            </div>
          );
        })}
        {/* Function 추가 버튼 클릭 시 입력 필드 */}
        <div>
          {isEditing && (
            <input
              ref={inputRef}
              value={inputValue}
              placeholder="Function Name을 입력하세요."
              onBlur={() => {
                setInputValue("");
                setIsEditing(false);
              }}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                addFunction(e);
              }}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function FunctionCard({
  functionName,
  functionData,
  setFunctions,
  imports,
  structs,
}: FunctiopnCardProps) {
  return (
    <div>
      {/* Function Info */}
      <div className="flex gap-2 text-xl font-semibold">
        <div className="">
          <select
            id="entry"
            name="entry"
            className="border-2 border-black p-1 rounded-md"
          >
            <option value="entry">Entry</option>
            <option value="non-entry">-</option>
          </select>
          <select
            id="visibility"
            name="visibility"
            className="text-pink-500 border-2 border-black p-1 rounded-md"
          >
            <option value="private">Private</option>
            <option value="friend">Friend</option>
            <option value="public">Public</option>
          </select>
          <span className="text-blue-700 border-2 border-black p-1 rounded-md">
            fun
          </span>
          <span className="border-2 border-black p-1 rounded-md">
            {functionName}
          </span>
        </div>
      </div>
      <FunctionTypeParameters
        functionName={functionName}
        functionData={functionData}
        setFunctions={setFunctions}
      />
      {/* Function Parameter */}
      <FunctionParameters
        functionName={functionName}
        functionData={functionData}
        imports={imports}
        structs={structs}
        setFunctions={setFunctions}
      />

      {/* Return : 이것도 Function Card 에 넣어야 함 */}
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

function FunctionTypeParameters({
  functionName,
  functionData,
  setFunctions,
}: {
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const ABILITIES = ["Copy", "Drop", "Store", "Key"] as const;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="mb-2">
      <span className="font-bold">Type Parameters:</span>
      {!isEditing && (
        <span>
          <button
            onClick={() => setIsEditing(true)}
            className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
          >
            ➕ 타입 파라미터 추가
          </button>
        </span>
      )}
      {functionData.function.typeParameters.map((t, i) => (
        <div key={i} className="font-semibold">
          <span>{`T${i}: `}</span>
          {
            <span>
              {ABILITIES.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    let newFunctionData = functionData;
                    if (t.abilities.includes(a)) {
                      newFunctionData.function.typeParameters[i].abilities =
                        functionData.function.typeParameters[
                          i
                        ].abilities.filter((ability) => ability !== a);
                    } else {
                      newFunctionData.function.typeParameters[i].abilities.push(
                        a
                      );
                    }
                    setFunctions((prev) => ({
                      ...prev,
                      [functionName]: newFunctionData,
                    }));
                  }}
                  className={`border-2 border-black px-1 rounded-md cursor-pointer ${
                    t.abilities.includes(a) ? "bg-emerald-300" : ""
                  }`}
                >
                  {a}
                </button>
              ))}{" "}
            </span>
          }
        </div>
      ))}
      {isEditing && (
        <div>
          <input
            ref={inputRef}
            value={inputValue}
            placeholder="Type Parameter Name을 입력하세요."
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              setInputValue("");
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                let newFunctionData = functionData;
                newFunctionData.function.typeParameters.push({ abilities: [] });
                const trimmed = inputValue.trim();
                if (trimmed) {
                  setFunctions((prev) => ({
                    ...prev,
                    [functionName]: newFunctionData,
                  }));
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

function FunctionParameters({
  functionName,
  functionData,
  imports,
  structs,
  setFunctions,
}: {
  functionName: string;
  functionData: SuiMoveFunction;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
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
        <span className="font-bold">Parameters:</span>
        {!isEditing && (
          <span>
            <button
              onClick={() => setIsEditing(true)}
              className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
            >
              ➕ 파라미터 추가
            </button>
          </span>
        )}
      </div>
      {functionData.function.parameters.map((param, index) => (
        <div key={param.toString()}>
          <FunctionParameterCard
            index={index}
            param={param}
            typeParameters={functionData.function.typeParameters}
            imports={imports}
            structs={structs}
            functionName={functionName}
            functionData={functionData}
            setFunctions={setFunctions}
          />
        </div>
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

function FunctionParameterCard({
  index,
  param,
  typeParameters,
  imports,
  structs,
  functionName,
  functionData,
  setFunctions,
}: // setParams,
{
  index: number;
  param: SuiMoveNormalizedType;
  typeParameters: SuiMoveAbilitySet[];
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  // setParams: React.Dispatch<
  //   React.SetStateAction<Record<string, SuiMoveNormalizedType>>
  // >;
}) {
  // const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});
  const [isOpen, setIsOpen] = useState(false);

  const PRIMITIVE_TYPES: SuiMoveNormalizedType[] = [
    "Bool",
    "U8",
    "U16",
    "U32",
    "U64",
    "U128",
    "U256",
    "Address",
    "Signer",
  ];

  return (
    <div>
      <div className="relative" key={param.toString()}>
        <span>Param{index}</span> :{" "}
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
        {isOpen && (
          <div className="absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto min-h-48 max-h-64">
            <ul className="w-48 bg-white border rounded-xl shadow-lg z-10">
              <li className="relative group">
                <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                  Primitive Type
                </div>
                <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                  {PRIMITIVE_TYPES.map((type) => (
                    <li
                      key={type.toString()}
                      onClick={() => {
                        let newFunctionData = functionData;
                        newFunctionData.function.parameters[index] = type;

                        setFunctions((prev) => ({
                          ...prev,
                          [functionName]: newFunctionData,
                        }));

                        setIsOpen((prev) => !prev);
                      }}
                      className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                    >
                      {type.toString()}
                    </li>
                  ))}
                </ul>
              </li>
              <li className="relative group">
                <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                  Type Parameters
                </div>
                <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                  {typeParameters.map((type, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        let newFunctionData = functionData;
                        newFunctionData.function.parameters[index] = {
                          Struct: {
                            address: "current",
                            module: "current",
                            name: "T" + i.toString(),
                            typeArguments: [],
                          },
                        };

                        setFunctions((prev) => ({
                          ...prev,
                          [functionName]: newFunctionData,
                        }));

                        setIsOpen((prev) => !prev);
                      }}
                      className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                    >
                      {`T${i}`}
                    </li>
                  ))}
                </ul>
              </li>
              <li className="relative group">
                <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                  Module Structs
                </div>

                <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                  {Object.keys(structs).map((structName) => (
                    <li
                      key={structName}
                      onClick={() => {
                        let newFunctionData = functionData;
                        newFunctionData.function.parameters[index] = {
                          Struct: {
                            address: "current",
                            module: "current",
                            name: structName,
                            typeArguments: [],
                          },
                        };

                        setFunctions((prev) => ({
                          ...prev,
                          [functionName]: newFunctionData,
                        }));
                        setIsOpen((prev) => !prev);
                      }}
                      className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                    >
                      {structName}
                    </li>
                  ))}
                </ul>
              </li>

              {Object.entries(imports).map(([moduleName, structData]) => (
                <li key={moduleName} className="relative group">
                  <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                    {moduleName.split("::")[1]}
                  </div>

                  <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                    {Object.keys(structData).map((structName) => (
                      <li
                        key={structName}
                        onClick={() => {
                          let newFunctionData = functionData;
                          newFunctionData.function.parameters[index] = {
                            Struct: {
                              address: moduleName.split("::")[0],
                              module: moduleName.split("::")[1],
                              name: structName,
                              typeArguments: [],
                            },
                          };

                          setFunctions((prev) => ({
                            ...prev,
                            [functionName]: newFunctionData,
                          }));
                          setIsOpen((prev) => !prev);
                        }}
                        className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                      >
                        {structName}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function FunctionReturns({
  functionName,
  functionData,
  imports,
  structs,
  setFunctions,
}: {
  functionName: string;
  functionData: SuiMoveFunction;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [params, setParams] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <div>
        <span className="font-bold">Returns:</span>
        {!isEditing && (
          <span>
            <button
              onClick={() => setIsEditing(true)}
              className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
            >
              ➕ 리턴 추가
            </button>
          </span>
        )}
      </div>
      {functionData.function.return.map((param, index) => (
        <div key={param.toString()}>
          <FunctionParameterCard
            index={index}
            param={param}
            typeParameters={functionData.function.typeParameters}
            imports={imports}
            structs={structs}
            functionName={functionName}
            functionData={functionData}
            setFunctions={setFunctions}
            // setParams={setParams}
          />
        </div>
      ))}
      {isEditing && (
        <div>
          <input
            ref={inputRef}
            value={inputValue}
            placeholder="Return Name을 입력하세요."
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              setInputValue("");
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const trimmed = inputValue.trim();
                if (trimmed) {
                  setParams((prev) => ({
                    ...prev,
                    [trimmed]: "U64",
                  }));
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

function newEmptySuiMoveFunction() {
  const CURRENT_PACKAGE =
    "0x1111111111111111111111111111111111111111111111111111111111111111";

  const CURRENT_MODULE = "CurrentModule";

  const newFunction: SuiMoveNormalizedFunction = {
    isEntry: false,
    parameters: [],
    return: [],
    typeParameters: [],
    visibility: "Private",
  };
  const newSuiMoveFunction: SuiMoveFunction = {
    function: newFunction,
    insideCode: [],
  };

  return newSuiMoveFunction;
}
