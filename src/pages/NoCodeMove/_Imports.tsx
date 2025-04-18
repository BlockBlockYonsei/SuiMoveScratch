import {
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { useState } from "react";

interface Props {
  pkg: string;
  data: SuiMoveNormalizedModules;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  setImports: React.Dispatch<
    React.SetStateAction<
      Record<string, Record<string, SuiMoveNormalizedStruct>>
    >
  >;
}

export default function Imports({ pkg, data, imports, setImports }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const packages = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  ];

  const addImport = (pkg: string, module: string, struct: string) => {
    if (module) {
      setImports((prev) => ({
        ...prev,
        [pkg + "::" + module]: {
          ...(prev[module] || {}),
          [struct]: data[module].structs[struct],
        },
      }));
      setIsOpen(false);
    }
  };
  return (
    <div className="bg-white p-4 rounded-xl border-2 border-black">
      <div className="flex items-center gap-4">
        <div className="inline-block bg-gray-200 text-3xl">Imports</div>
        <div className="relative py-2">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsOpen(false);
            }}
            className="p-2 px-4 rounded-xl bg-blue-500 cursor-pointer hover:bg-blue-600 text-white transition"
          >
            ➕ Import 추가
          </button>
          {isOpen && (
            <div className="absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto max-h-64">
              <ul className="w-48 bg-white border rounded-xl shadow-lg z-10">
                {Object.entries(data).map(([moduleName, moduleData]) => {
                  if (Object.keys(moduleData.structs).length === 0) return;
                  return (
                    <li key={moduleName} className="relative group">
                      <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                        {moduleName}
                      </div>

                      <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                        {Object.keys(moduleData.structs).map((structName) => (
                          <li
                            key={structName}
                            onClick={() => {
                              addImport(pkg, moduleName, structName);
                            }}
                            className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                          >
                            {structName}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
      {Object.entries(imports).map(([key, values]) => {
        return (
          <div key={key}>
            <span className="text-blue-500">use</span>{" "}
            {packages.includes(key.split("::")[0]) ? "suiorstd" : key}:: &#123;{" "}
            <span className="text-emerald-500 font-semibold">
              {Object.keys(values).join(", ")}
            </span>{" "}
            &#125;;
          </div>
        );
      })}
    </div>
  );
}
