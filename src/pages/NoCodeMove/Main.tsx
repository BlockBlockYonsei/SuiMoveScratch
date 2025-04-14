import { useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import Imports from "./_Imports";
import Structs from "./_Structs";

export default function Main() {
  const [imports, setImports] = useState<
    Record<string, Record<string, SuiMoveNormalizedStruct>>
  >({});
  const [structs, setStructs] = useState<
    Record<string, SuiMoveNormalizedStruct>
  >({});

  //========================== Function State

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // =================================================

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

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto bg-gray-100">
      <h1 className="text-2xl font-bold">🛠️ No Code 텍스트 에디터</h1>
      <br></br>
      <Imports data={data} imports={imports} setImports={setImports}></Imports>

      <br></br>
      <Structs
        structs={structs}
        setStructs={setStructs}
        imports={imports}
      ></Structs>

      <br></br>
      <div>
        <div className="bg-white p-4 rounded-xl border-2 border-black">
          <div className="inline-block bg-gray-200 text-2xl">Function</div>
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
                  // addStruct(e);
                }}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
              />
            )}
          </div>
        </div>
        {/* Function 추가 버튼 */}
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
    </div>
  );
}
