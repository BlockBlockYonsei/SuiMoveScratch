import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";

interface Props {
  // data: SuiMoveNormalizedModules;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
}

interface StructCardProps {
  structName: string;
  structData: SuiMoveNormalizedStruct;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
}

export default function Structs({ structs, setStructs, imports }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const CURRENT_PACKAGE =
    "0x1111111111111111111111111111111111111111111111111111111111111111";

  const CURRENT_MODULE = "CurrentModule";

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <div className="bg-white p-4 rounded-xl border-2 border-black">
        <div className="inline-block bg-gray-200 text-2xl">Struct</div>
        {/* Structs 하나씩 보여주는 곳 */}
        {Object.entries(structs).map(([key, value]) => {
          return (
            <div key={key}>
              <StructCard
                structName={key}
                structData={value}
                setStructs={setStructs}
                imports={imports}
              ></StructCard>
            </div>
          );
        })}

        {/* Struct 추가 버튼 클릭 시 입력 필드 */}
        <div>
          {isEditing && (
            <input
              ref={inputRef}
              value={inputValue}
              placeholder="Struct Name을 입력하세요."
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => {
                setInputValue("");
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const trimmed = inputValue.trim();
                  const newStruct = newEmptyStruct({
                    packageAddr: CURRENT_PACKAGE,
                    module: CURRENT_MODULE,
                    structName: trimmed,
                  });
                  if (trimmed) {
                    setStructs((prev) => ({
                      ...prev,
                      [trimmed]: newStruct,
                    }));
                  }
                  setInputValue("");
                  setIsEditing(false);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
            />
          )}
        </div>
      </div>
      {/* Struct 추가 버튼 */}
      <div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-600 transition"
          >
            ➕ Struct 추가
          </button>
        )}
      </div>
    </div>
  );
}

function StructCard({
  structName,
  structData,
  setStructs,
  imports,
}: StructCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  const ABILITIES = ["Copy", "Drop", "Store", "Key"] as const;
  const PRIMITIVE_TYPES = [
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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <div>
        public struct{" "}
        <span className="text-emerald-500 font-semibold">{structName}</span>{" "}
        {
          <span>
            {ABILITIES.map((a) => (
              <button
                key={a}
                onClick={() => {
                  let newStructData = structData;
                  if (structData.abilities.abilities.includes(a)) {
                    newStructData.abilities.abilities =
                      structData.abilities.abilities.filter(
                        (ability) => ability !== a
                      );
                  } else {
                    newStructData.abilities.abilities.push(a);
                  }

                  setStructs((prev) => ({
                    ...prev,
                    [structName]: newStructData,
                  }));
                }}
                className={`border-2 border-black px-1 rounded-md cursor-pointer ${
                  structData.abilities.abilities.includes(a)
                    ? "bg-emerald-300"
                    : ""
                }`}
              >
                {a}
              </button>
            ))}{" "}
          </span>
        }
        &#123;
        {!isEditing && (
          <span>
            <button
              onClick={() => setIsEditing(true)}
              className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
            >
              ➕ 필드 추가
            </button>
          </span>
        )}
      </div>
      {Object.entries(fields).map(([name, type]) => (
        <div className="relative" key={name}>
          <span>{name}</span> :{" "}
          <button
            onClick={() => {
              setIsOpen((prev) => ({
                ...prev,
                [name]: !prev[name],
              }));
            }}
            className="border-2 border-black cursor-pointer rounded-md"
          >
            {type}
          </button>
          {/* <div className="relative"> */}
          {isOpen[name] && (
            <div className="absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto min-h-48 max-h-64">
              <ul className="w-48 bg-white border rounded-xl shadow-lg z-10">
                <li className="relative group">
                  <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                    Primitive Type
                  </div>
                  <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                    {PRIMITIVE_TYPES.map((type) => (
                      <li
                        key={type}
                        onClick={() => {
                          setFields((prev) => ({
                            ...prev,
                            [name]: type,
                          }));
                          setIsOpen((prev) => ({
                            ...prev,
                            [name]: false,
                          }));
                        }}
                        className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                      >
                        {type}
                      </li>
                    ))}
                  </ul>
                </li>

                {Object.entries(imports).map(([moduleName, structData]) => (
                  <li key={moduleName} className="relative group">
                    <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                      {moduleName}
                    </div>

                    <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                      {Object.keys(structData).map((structName) => (
                        <li
                          key={structName}
                          onClick={() => {
                            setFields((prev) => ({
                              ...prev,
                              [name]: structName,
                            }));
                            setIsOpen((prev) => ({
                              ...prev,
                              [name]: false,
                            }));
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
        // </div>
      ))}
      {isEditing && (
        <div>
          <input
            ref={inputRef}
            value={inputValue}
            placeholder="Field Name을 입력하세요."
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              setInputValue("");
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // finishEditing();
                const trimmed = inputValue.trim();
                if (trimmed) {
                  // setFields([...fields, trimmed]);
                  setFields((prev) => ({
                    ...prev,
                    [trimmed]: "U64",
                  }));
                }
                setInputValue("");
                setIsEditing(false);
                setIsOpen((prev) => ({
                  ...prev,
                  [trimmed]: false,
                }));
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
          />
        </div>
      )}
      <div>&#125;</div>
    </div>
  );
}

function newEmptyStruct({
  packageAddr,
  module,
  structName,
}: {
  packageAddr: string;
  module: string;
  structName: string;
}): SuiMoveNormalizedStruct {
  return {
    abilities: {
      abilities: [],
    },
    fields: [
      {
        name: structName,
        type: {
          Struct: {
            address: packageAddr,
            module: module,
            name: structName,
            typeArguments: [],
          },
        },
      },
    ],
    typeParameters: [
      {
        constraints: {
          abilities: [],
        },
        isPhantom: false,
      },
    ],
  };
}
