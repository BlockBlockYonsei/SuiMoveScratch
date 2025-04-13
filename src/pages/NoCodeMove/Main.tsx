import { useSuiClientQuery } from "@mysten/dapp-kit";
import {
  SuiMoveNormalizedField,
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";

export default function Main() {
  const [imports, setImports] = useState<
    Record<string, Record<string, SuiMoveNormalizedStruct>>
  >({});
  const [structs, setStructs] = useState<
    Record<string, SuiMoveNormalizedStruct>
  >({});

  const CURRENT_PACKAGE =
    "0x1111111111111111111111111111111111111111111111111111111111111111";

  const CURRENT_MODULE = "CurrentModule";

  const packages = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  ];

  const PACKAGE =
    "0x0000000000000000000000000000000000000000000000000000000000000002";
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package: PACKAGE,
    },
    {
      enabled: true,
    }
  );

  // 새로 고침 시 확인 알림
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = ""; // 일부 브라우저에서는 이 설정이 필수
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message || "error"}</div>;

  /// ===============================================================================
  /// Return of Main()
  /// ===============================================================================
  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto bg-gray-100">
      <h1 className="text-2xl font-bold">🛠️ No Code 텍스트 에디터</h1>
      <br></br>
      <Imports data={data}></Imports>

      <Structs data={data}></Structs>
    </div>
  );

  /// ===============================================================================
  /// Inside Components
  /// ===============================================================================
  function Imports({ data }: { data: SuiMoveNormalizedModules }) {
    const [isOpen, setIsOpen] = useState(false);

    const addImport = (module: string, struct: string) => {
      if (module) {
        setImports((prev) => ({
          ...prev,
          [module]: {
            ...(prev[module] || {}),
            [struct]: data[module].structs[struct],
          },
        }));
        setIsOpen(false);
      }
    };
    return (
      <div>
        <div className="bg-white p-4 rounded-xl border-2 border-black">
          <div className="inline-block bg-gray-200 text-2xl">Imports</div>
          {Object.entries(imports).map(([key, values]) => {
            return (
              <div key={key}>
                <span className="text-blue-500">use</span> sui::{key}:: &#123;{" "}
                <span className="text-emerald-500 font-semibold">
                  {Object.keys(values).join(", ")}
                </span>{" "}
                &#125;;
              </div>
            );
          })}
        </div>
        <br></br>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-4 py-2 my-2 rounded-xl bg-blue-500 cursor-pointer hover:bg-blue-600 text-white transition"
        >
          ➕ Import 추가
        </button>
        <div className="relative">
          {isOpen && (
            <div className="apsolute left-0 p-4 mt-2 bg-white rounded-xl shadow overflow-auto max-h-64">
              <ul className="w-48 bg-white border rounded-xl shadow-lg z-10">
                {Object.entries(data).map(([moduleName, moduleData]) => (
                  <li key={moduleName} className="relative group">
                    <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                      {moduleName}
                    </div>

                    <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                      {Object.keys(moduleData.structs).map((k) => (
                        <li
                          key={k}
                          onClick={() => {
                            addImport(moduleName, k);
                          }}
                          className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                        >
                          {k}
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

  function Structs({ data }: { data: SuiMoveNormalizedModules }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

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
              <div>
                <Struct structName={key} structData={value}></Struct>
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

  function Struct({
    structName,
    structData,
  }: {
    structName: string;
    structData: SuiMoveNormalizedStruct;
  }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");
    // const [fields, setFields] = useState<string[]>([]);
    const [fields, setFields] = useState<SuiMoveNormalizedField[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const ABILITIES = ["Copy", "Drop", "Store", "Key"] as const;

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
        {fields.map((field, idx) => (
          <div className="relative">
            <span>{field.name}</span> :{" "}
            <button
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
              className="border-2 border-black cursor-pointer rounded-md"
            >
              {field.type.toString()}
            </button>
          </div>
        ))}
        {isOpen && (
          <div className="apsolute left-0 p-4 mt-2 bg-white rounded-xl shadow overflow-auto max-h-64">
            <ul className="w-48 bg-white border rounded-xl shadow-lg z-10">
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
                          // addImport(moduleName, k);
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
                    setFields((prev) => [
                      ...prev,
                      {
                        name: trimmed,
                        type: "U64",
                      },
                    ]);
                  }
                  setInputValue("");
                  setIsEditing(false);
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
}

/// ===============================================================================
/// Outside Components
/// ===============================================================================

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
