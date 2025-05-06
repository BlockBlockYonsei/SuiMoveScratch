import {
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedFunction,
} from "@mysten/sui/client";
import { useEffect, useState } from "react";
import Imports from "./_Imports";
import Structs from "./_Structs";
import Functions from "./_Functions";
import { downloadMoveCode } from "./utils/generateCode";
import { SuiMoveFunction } from "@/types/move";

export default function Main() {
  const [imports, setImports] = useState<
    Record<
      string,
      Record<
        string,
        SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
      >
    >
  >({});
  const [structs, setStructs] = useState<
    Record<string, SuiMoveNormalizedStruct>
  >({});
  const [functions, setFunctions] = useState<Record<string, SuiMoveFunction>>(
    {},
  );

  // =================================================

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

  return (
    <div className="grid grid-cols-2">
      {/* <div className="min-h-screen p-6 max-w-xl mx-auto bg-gray-100"> */}
      <div className="min-h-screen p-6 max-w-xl bg-gray-100">
        <h1 className="text-2xl font-bold">🛠️ No Code 텍스트 에디터</h1>
        <br></br>
        <Imports imports={imports} setImports={setImports}></Imports>

        <br></br>
        <Structs
          imports={imports}
          structs={structs}
          setStructs={setStructs}
        ></Structs>

        <br></br>
        <Functions
          imports={imports}
          structs={structs}
          functions={functions}
          setFunctions={setFunctions}
        ></Functions>
      </div>

      {/* 디버깅 용 실제 데이터 보여주는 상자 */}
      <div className="min-h-screen p-6 max-w-xl bg-gray-200">
        <button
          onClick={() => downloadMoveCode(imports, structs, functions)}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Move 코드 다운로드
        </button>
        <div className="text-3xl">Imports</div>
        <div className="min-h-24 border-2 border-black rounded-md">
          {Object.entries(imports).map(([pkgModuleName, module]) => (
            <div key={pkgModuleName}>
              <div className="text-2xl">
                {pkgModuleName.split("::")[0].slice(0, 4)}...
                {pkgModuleName.split("::")[0].slice(-3)}::
                {pkgModuleName.split("::")[1]}
              </div>
              {Object.entries(module).map(([moduleName, moduleData]) => (
                <div key={moduleName}>
                  <div>{moduleName}</div>
                  <div>{JSON.stringify(moduleData)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="text-3xl">Structs</div>
        <div className="min-h-24 border-2 border-black rounded-md">
          {Object.entries(structs).map(([key, value]) => (
            <div key={key}>
              <div className="text-2xl">{key}</div>
              <div>{JSON.stringify(value)}</div>
            </div>
          ))}
        </div>

        <div className="text-3xl">Functions</div>
        <div className="min-h-24 border-2 border-black rounded-md">
          {Object.entries(functions).map(([key, value]) => (
            <div key={key}>
              <div className="text-2xl">{key}</div>
              <div>{JSON.stringify(value)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
