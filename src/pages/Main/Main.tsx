/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSuiClientQuery } from "@mysten/dapp-kit";
// import { SuiMoveNormalizedType } from "@mysten/sui/client";
import { parseSuiMoveNormalizedType } from "./utils";
import { StructCard } from "./components";
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
    }
  );

  const [isStructsOpen, setIsStructsOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [isExposedFunctionsOpen, setIsExposedFunctionsOpen] = useState<{
    [key: string]: boolean;
  }>({});

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message || "error"}</div>;

  console.log(data);

  return (
    <div>
      <div className="text-2xl">여기다 작업해주시면 됩니다.</div>

      {Object.entries(data).map(
        ([moduleName, moduleData]: [string, SuiMoveNormalizedModule]) => {
          return (
            <div>
              <h1 className="my-5 font-extrabold text-4xl">{moduleName}</h1>
              <div>
                {/* Package Info */}
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
                      isStructsOpen[moduleName] ? "" : "bg-yellow-200"
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
                        SuiMoveNormalizedStruct
                      ]) => (
                        <StructCard
                          key={structName}
                          structName={structName}
                          structData={structData}
                          // name={structName}
                          // abilities={structData.abilities.abilities}
                          // fields={structData.fields}
                        />
                      )
                    )}
                  </div>
                )}

                {/* Exposed Functions */}
                <h1 className="my-5 font-semibold text-2xl">
                  <button
                    className={`hover:bg-blue-200 active:bg-blue-500 ${
                      isExposedFunctionsOpen[moduleName] ? "" : "bg-yellow-200"
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
                      <div
                        key={funcName}
                        className="border p-4 mb-6 rounded-lg shadow-md"
                      >
                        <h2 className="text-xl font-semibold mb-2">
                          {funcName}
                        </h2>
                        <div className="mb-2">
                          <span className="font-bold">Visibility:</span>{" "}
                          {funcData.visibility}
                        </div>
                        <div className="mb-2">
                          <span className="font-bold">Entry:</span>{" "}
                          {funcData.isEntry ? "Yes" : "No"}
                        </div>
                        <div className="mb-2">
                          <span className="font-bold">Parameters:</span>
                          <ul className="list-disc list-inside ml-4">
                            {funcData.parameters.length > 0 ? (
                              funcData.parameters.map((param, index) => {
                                const formatted =
                                  parseSuiMoveNormalizedType(param); // ⬅ 아래 함수 참고
                                return (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="border border-gray-400 rounded px-2 py-0.5 text-sm">
                                      {formatted.prefix}
                                    </span>
                                    <span className="border border-blue-500 rounded px-2 py-0.5 text-sm font-mono">
                                      {formatted.core}
                                    </span>
                                  </li>
                                );
                              })
                            ) : (
                              <li>None</li>
                            )}
                          </ul>
                        </div>
                        <div className="mb-2">
                          <span className="font-bold">Return:</span>
                          <ul className="list-disc list-inside ml-4">
                            {funcData.return.length > 0 ? (
                              funcData.return.map((param, index) => {
                                const formatted =
                                  parseSuiMoveNormalizedType(param); // ⬅ 아래 함수 참고
                                return (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="border border-gray-400 rounded px-2 py-0.5 text-sm">
                                      {formatted.prefix}
                                    </span>
                                    <span className="border border-blue-500 rounded px-2 py-0.5 text-sm font-mono">
                                      {formatted.core}
                                    </span>
                                  </li>
                                );
                              })
                            ) : (
                              <li>None</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )
                  )}

                <h2 className="my-5  text-2xl">enums</h2>
                <div>{JSON.stringify(moduleData.enums)}</div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}
