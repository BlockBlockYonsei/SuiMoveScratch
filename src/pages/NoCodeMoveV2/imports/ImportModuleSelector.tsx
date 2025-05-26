import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import {
  ImportedModuleData,
  ImportedSuiMoveModule,
} from "@/types/move-syntax2";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { DialogClose } from "@radix-ui/react-dialog";
import { useContext } from "react";

interface Props extends React.ComponentProps<"div"> {
  packageId: string;
}

export default function ImportModuleSelector({ className, packageId }: Props) {
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package: packageId,
    },
    {
      enabled: !!packageId, // only run when selectedPkg is truthy
    }
  );

  const { setImports } = useContext(SuiMoveModuleContext);

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
                  setImports((prev: ImportedModuleData) => {
                    const newImportMap = new Map(prev[packageId]);
                    const current = newImportMap.get(moduleName) || {
                      address: packageId,
                      moduleName,
                      structs: {},
                    };

                    newImportMap.set(moduleName, {
                      ...current,
                      functions: moduleData.exposedFunctions,
                    } as ImportedSuiMoveModule);

                    return {
                      ...prev,
                      [packageId]: newImportMap,
                    };
                  });
                }}
                className="px-4 py-1 text-emerald-600 hover:bg-blue-50 cursor-pointer rounded transition"
              >
                Self
              </li>
            </DialogClose>
            {Object.keys(moduleData.structs).map((structName) => (
              <DialogClose key={structName}>
                <li
                  onClick={() => {
                    setImports((prev: ImportedModuleData) => {
                      const newImportMap = new Map(prev[packageId]);
                      const current = newImportMap.get(moduleName) || {
                        address: packageId,
                        moduleName,
                        structs: {},
                      };

                      newImportMap.set(moduleName, {
                        ...current,
                        structs: {
                          ...current.structs,
                          [structName]: moduleData.structs[structName],
                        },
                      } as ImportedSuiMoveModule);

                      return {
                        ...prev,
                        [packageId]: newImportMap,
                      };
                    });
                  }}
                  className={`px-4 py-1 text-emerald-600 hover:bg-blue-50 ${"cursor-pointer"} rounded transition`}
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
