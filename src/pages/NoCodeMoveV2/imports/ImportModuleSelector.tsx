import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { ImportDataMap, ImportedSuiMoveModule } from "@/types/move-syntax";
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
                  const importKey = packageId + "::" + moduleName;

                  setImports((prev: ImportDataMap) => {
                    const newImportMap = new Map(prev);
                    const current = prev.get(importKey) || {
                      address: packageId,
                      moduleName,
                      structs: {},
                    };

                    const newImportData = {
                      ...current,
                      functions: data[moduleName].exposedFunctions,
                    } as ImportedSuiMoveModule;
                    newImportMap.set(importKey, newImportData);

                    return newImportMap;
                  });
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
                    const importKey = packageId + "::" + moduleName;

                    setImports((prev: ImportDataMap) => {
                      const newImportMap = new Map(prev);
                      const current = prev.get(importKey) || {
                        address: packageId,
                        moduleName,
                        structs: {},
                      };
                      const newImportData = {
                        ...current,
                        structs: {
                          ...current.structs,
                          [structName]: data[moduleName].structs[structName],
                        },
                      } as ImportedSuiMoveModule;
                      newImportMap.set(importKey, newImportData);
                      return newImportMap;
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
