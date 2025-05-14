import { ImportsType } from "@/types/move";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { DialogClose } from "@radix-ui/react-dialog";
import * as React from "react";

interface Props extends React.ComponentProps<"div"> {
  packageId: string;
  setImports: React.Dispatch<React.SetStateAction<ImportsType>>;
}

export default function ImportPackageModule({
  className,
  packageId,
  setImports,
}: Props) {
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package: packageId,
    },
    {
      enabled: !!packageId, // only run when selectedPkg is truthy
    }
  );

  const addImport = (
    data: SuiMoveNormalizedModules,
    pkgAddress: string,
    moduleName: string,
    structName: string
  ) => {
    if (moduleName) {
      const key = pkgAddress + "::" + moduleName;
      setImports((prev: any) => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [structName]: data[moduleName].structs[structName],
        },
      }));
    }
  };

  if (isPending)
    return <div className={`${className} text-center py-4`}>Loading...</div>;

  if (error)
    return (
      <div className={`${className} text-center text-red-500 py-4`}>
        Error: {error?.message || "Failed to load modules"}
      </div>
    );
  return (
    <div
      className={`w-full bg-white border rounded-xl shadow-lg p-2 space-y-2 max-h-96 overflow-y-auto ${className}`}
    >
      {Object.entries(data).map(([moduleName, moduleData]) => (
        <div key={moduleName} className="relative group">
          <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition font-semibold">
            {moduleName}
          </div>

          <ul className="ml-4 mt-2 space-y-1">
            <DialogClose>
              <li
                onClick={() => {
                  addImport(data, packageId, moduleName, "Self");
                }}
                className="px-4 py-1 text-emerald-600 hover:bg-blue-50 cursor-pointer rounded transition"
              >
                Self
              </li>
            </DialogClose>
            {Object.keys(moduleData.structs).map((structName) => (
              <DialogClose>
                <li
                  key={structName}
                  onClick={() => {
                    addImport(data, packageId, moduleName, structName);
                  }}
                  className="px-4 py-1 text-emerald-600 hover:bg-blue-50 cursor-pointer rounded transition"
                >
                  {structName}
                </li>
              </DialogClose>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
