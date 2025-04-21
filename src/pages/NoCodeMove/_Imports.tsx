import { useSuiClientQuery } from "@mysten/dapp-kit";
import {
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { useState } from "react";

interface Props {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  setImports: React.Dispatch<
    React.SetStateAction<
      Record<string, Record<string, SuiMoveNormalizedStruct>>
    >
  >;
}

export default function Imports({ imports, setImports }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const packages = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  ];

  const addImport = (
    data: SuiMoveNormalizedModules,
    pkgAddress: string,
    moduleName: string,
    structName: string
  ) => {
    if (moduleName) {
      const key = pkgAddress + "::" + moduleName;
      setImports((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [structName]: data[moduleName].structs[structName],
        },
      }));
      setIsOpen(false);
    }
  };
  return (
    <section className="bg-white p-4 rounded-xl border-2 border-black">
      <div className="flex items-center gap-4">
        <h1 className="inline-block bg-gray-200 text-3xl">Imports</h1>
        <div className="relative py-2">
          <button
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsOpen(false);
            }}
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 px-4 rounded-xl bg-blue-500 cursor-pointer hover:bg-blue-600 text-white transition"
          >
            ➕ Import 추가
          </button>
          <div
            className={`${
              isOpen ? "" : "hidden"
            } absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto max-h-64 `}
          >
            {packages.map((pkgAddress) => (
              <div>
                <h2 className="text-2xl">
                  {pkgAddress.slice(0, 5)}...{pkgAddress.slice(-4)}
                </h2>
                <ul className="w-48 bg-white border rounded-xl shadow-lg z-10">
                  <PackagesForImport
                    pkgAddress={pkgAddress}
                    addImport={addImport}
                  />
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      {Object.entries(imports)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, values]) => {
          const pkgName = () => {
            const pkg = key.split("::")[0];
            if (pkg === packages[0]) return "std";
            else if (pkg === packages[1]) return "sui";
            // 나중에 Move.toml 파일의 [addresses] 읽어서 반영
            else return pkg;
          };
          return (
            <div key={key}>
              <span className="text-blue-500">use </span>
              {pkgName()}::{key.split("::")[1]} &#123;{" "}
              <span className="text-emerald-500 font-semibold">
                {Object.keys(values).join(", ")}
              </span>{" "}
              &#125;;
            </div>
          );
        })}
    </section>
  );
}

function PackagesForImport({
  pkgAddress,
  addImport,
}: {
  pkgAddress: string;
  addImport: (
    data: SuiMoveNormalizedModules,
    pkgAddress: string,
    moduleName: string,
    structName: string
  ) => void;
}) {
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package: pkgAddress,
    },
    {
      enabled: true,
    }
  );

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message || "error"}</div>;
  return (
    <>
      {Object.entries(data).map(([moduleName, moduleData]) => {
        if (Object.keys(moduleData.structs).length === 0) return;
        return (
          <div key={moduleName} className="relative group">
            <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
              {moduleName}
            </div>

            <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
              {Object.keys(moduleData.structs).map((structName) => (
                <li
                  key={structName}
                  onClick={() => {
                    addImport(data, pkgAddress, moduleName, structName);
                  }}
                  className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                >
                  {structName}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}
