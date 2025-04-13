import {
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { useState } from "react";

interface Props {
  data: SuiMoveNormalizedModules;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  setImports: React.Dispatch<
    React.SetStateAction<
      Record<string, Record<string, SuiMoveNormalizedStruct>>
    >
  >;
}

export default function Imports({ data, imports, setImports }: Props) {
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
      <div className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-4 py-2 my-2 rounded-xl bg-blue-500 cursor-pointer hover:bg-blue-600 text-white transition"
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
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
