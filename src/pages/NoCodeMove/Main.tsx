import { useSuiClientQuery } from "@mysten/dapp-kit";
import {
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";

export default function Main() {
  const [imports, setImports] = useState<Record<string, string[]>>({});
  const [structs, setStructs] = useState<
    Record<string, SuiMoveNormalizedStruct>
  >({});

  const [array, setArray] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const packages = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  ];

  const PACKAGE =
    // "0x31323c09dee186fae0b38e0dace096140f5765713e64d10d95f2537b4b699ab4";
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

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto bg-gray-100">
      <h1 className="text-2xl font-bold">🛠️ No Code 텍스트 에디터</h1>
      <br></br>
      <Imports data={data}></Imports>
      struct 는 이 로직이 아니야!! data 에서 추가하는 게 아니라 내가 직접 걍
      추가하는 거라고!
      <div className="bg-white p-4 rounded-xl border-2 border-black">
        <div className="inline-block bg-gray-200 text-2xl">Struct</div>
        {Object.entries(structs).map(([key, value]) => {
          return (
            <div>
              <div>{key}</div>
              <div>{JSON.stringify(value)}</div>
            </div>
          );
        })}

        {array.map((item, idx) => (
          <div>
            public struct{" "}
            <span className="text-emerald-500 font-semibold">{item}</span>{" "}
            &#123;
            <div>&#125;</div>
          </div>
        ))}
        <div>
          {isEditing && (
            <input
              ref={inputRef}
              value={inputValue}
              placeholder="Struct Name을 입력하세요."
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => {
                // cancelEditing();
                setInputValue("");
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // finishEditing();
                  const trimmed = inputValue.trim();
                  if (trimmed) {
                    setArray([...array, trimmed]);
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
      <div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
          >
            ➕ Struct 추가
          </button>
        )}
      </div>
      <Button
        onClick={() => {
          setStructs({
            MembershipPolicy: {
              abilities: {
                abilities: [],
              },
              fields: [
                {
                  name: "a",
                  type: {
                    Struct: {
                      address: "",
                      module: "",
                      name: "",
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
            },
          });
        }}
      >
        ➕ Struct(가짜 데이터) 추가
      </Button>
    </div>
  );

  function Imports({ data }: { data: SuiMoveNormalizedModules }) {
    const [isOpen, setIsOpen] = useState(false);

    const addImportBlock = (module: string, i: string) => {
      console.log(imports[module]);
      if (imports[module]) {
        const newImports = [...imports[module], i];
        setImports((prev) => ({
          ...prev,
          [module]: newImports,
        }));
      } else {
        setImports((prev) => ({
          ...prev,
          [module]: [i],
        }));
      }
    };

    const handleConfirm = (module: string, i: string) => {
      if (module) {
        console.log(module);
        addImportBlock(module, i);
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
                  {values.join(", ")}
                </span>{" "}
                &#125;;
              </div>
            );
          })}
        </div>
        <br></br>
        <Button onClick={() => setIsOpen((prev) => !prev)}>
          ➕ Import 추가
        </Button>
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
                            handleConfirm(moduleName, k);
                            setIsOpen(false);
                          }}
                          className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                        >
                          {k}
                        </li>
                      ))}
                      {/* {Object.keys(moduleData.exposedFunctions).map((k) => (
                      <li
                        key={k}
                        onClick={() => {
                          handleConfirm(moduleName, k);
                          setIsOpen(false);
                        }}
                        className="px-4 py-2 text-pink-500 hover:bg-blue-50 cursor-pointer transition"
                      >
                        {k}()
                      </li>
                    ))} */}
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
}

// ✅ Button 컴포넌트
function Button({ children, onClick }: { children: any; onClick: any }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 my-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
    >
      {children}
    </button>
  );
}
