import { useSuiClientQuery } from "@mysten/dapp-kit";
import { FunctionCard, StructCard } from "./components";
import {
  SuiMoveNormalizedModule,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { useState } from "react";

export default function Main() {
  // const package = "0xb84460fd33aaf7f7b7f80856f27c51db6334922f79e326641fb90d40cc698175"
  const PACKAGE =
    "0x31323c09dee186fae0b38e0dace096140f5765713e64d10d95f2537b4b699ab4";
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package: PACKAGE,
    },
    {
      enabled: true,
    },
  );

  const [isStructsOpen, setIsStructsOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [isExposedFunctionsOpen, setIsExposedFunctionsOpen] = useState<{
    [key: string]: boolean;
  }>({});

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message || "error"}</div>;

  // console.log(data);

  return (
    <div>
      <div className="text-2xl">여기다 작업해주시면 됩니다.</div>

      {Object.entries(data).map(
        ([moduleName, moduleData]: [string, SuiMoveNormalizedModule]) => {
          return (
            <div key={moduleName}>
              <h1 className="my-5 font-extrabold text-4xl">{moduleName}</h1>
              <div>
                {/* Module Info */}
                <h1 className="my-5 font-semibold text-2xl">Module Info</h1>
                <div className="p-2 border rounded-md">
                  <p className="text-xl">Address: {moduleData.address}</p>
                  <p className="text-xl">
                    File Format Version: {moduleData.fileFormatVersion}
                  </p>
                  <p className="text-xl">
                    Friend Modules: {JSON.stringify(moduleData.friends)}
                  </p>
                </div>

                {/* Structs */}
                <h1 className="my-5 font-semibold text-2xl">
                  <button
                    className={`hover:bg-blue-200 active:bg-blue-500 ${
                      isStructsOpen[moduleName]
                        ? "bg-blue-100"
                        : "bg-yellow-200"
                    }`}
                    onClick={() => {
                      setIsStructsOpen((prev) => ({
                        ...prev,
                        [moduleName]: !prev[moduleName],
                      }));
                    }}
                  >
                    Structs
                  </button>
                </h1>
                {isStructsOpen[moduleName] && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(moduleData.structs).map(
                      ([structName, structData]: [
                        string,
                        SuiMoveNormalizedStruct,
                      ]) => (
                        <StructCard
                          key={structName}
                          structName={structName}
                          structData={structData}
                        />
                      ),
                    )}
                  </div>
                )}

                {/* Exposed Functions */}
                <h1 className="my-5 font-semibold text-2xl">
                  <button
                    className={`hover:bg-blue-200 active:bg-blue-500 ${
                      isExposedFunctionsOpen[moduleName]
                        ? "bg-blue-100"
                        : "bg-yellow-200"
                    }`}
                    onClick={() => {
                      setIsExposedFunctionsOpen((prev) => ({
                        ...prev,
                        [moduleName]: !prev[moduleName],
                      }));
                    }}
                  >
                    Exposed Functions
                  </button>
                </h1>
                {isExposedFunctionsOpen[moduleName] &&
                  Object.entries(moduleData.exposedFunctions).map(
                    ([funcName, funcData]) => (
                      <FunctionCard
                        functionName={funcName}
                        functionData={funcData}
                      />
                    ),
                  )}
                <h2 className="my-5  text-2xl">enums</h2>
                <div>{JSON.stringify(moduleData.enums)}</div>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
