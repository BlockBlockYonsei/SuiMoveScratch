import { useState } from "react";
import ImportModal from "./ImportModal";
import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";

export default function ImportButton({
  packages,
  setImports,
}: {
  packages: string[];
  setImports: React.Dispatch
    React.SetStateAction
      Record
        string,
        Record
          string,
          SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
        >
      >
    >
  >;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const addImport = (
    data: SuiMoveNormalizedModules,
    pkgAddress: string,
    moduleName: string,
    structName: string
  ) => {
    if (!moduleName) return;
    const key = pkgAddress + "::" + moduleName;
if (structName === "Self") {
      setImports((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [structName]: data[moduleName].exposedFunctions,
        },
      }));
    } else {
      setImports((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [structName]: data[moduleName].structs[structName],
        },
      }));
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
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
        } absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto max-h-64`}
      >
        {packages.map((pkgAddress) => (
          <ImportModal
            key={pkgAddress}
            pkgAddress={pkgAddress}
            addImport={addImport}
          />
        ))}
      </div>
    </div>
  );
}